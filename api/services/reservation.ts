import { createServiceClient } from '@shared/config/supabase-server';
import { stripe } from '@shared/config/stripe';
import { assignQRCodes } from './qr-code';
import { provisionESIM } from './esim';
import { sendConfirmationEmail, sendESIMEmail } from './email-triggers';
import { generateAndUploadTicket, generateTicketPDF } from './pdf-ticket';
import { generateWalletPasses } from './wallet';
import type { CheckoutInput } from '@shared/validations';

function generateOrderNumber(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = 'TCB-';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function createCheckoutSession(input: CheckoutInput) {
  const supabase = createServiceClient();

  const totalAmount = input.items.reduce((sum, item) => sum + item.totalPrice, 0);

  const lineItems = input.items.map((item) => ({
    price_data: {
      currency: 'eur',
      product_data: {
        name: item.productTitle,
        metadata: { slug: item.productSlug },
      },
      unit_amount: item.totalPrice,
    },
    quantity: 1,
  }));

  const paymentIntent = await stripe.paymentIntents.create({
    amount: totalAmount,
    currency: 'eur',
    payment_method_types: ['card', 'alipay'],
    metadata: {
      email: input.email,
      firstName: input.firstName,
      lastName: input.lastName,
      phone: input.phone || '',
      itemsJson: JSON.stringify(input.items.map((i) => ({
        slug: i.productSlug,
        adults: i.adultCount,
        children: i.childCount,
        price: i.totalPrice,
      }))),
    },
    receipt_email: input.email,
  });

  return {
    clientSecret: paymentIntent.client_secret!,
    paymentIntentId: paymentIntent.id,
    amount: totalAmount,
  };
}

export async function handlePaymentSuccess(paymentIntentId: string) {
  const supabase = createServiceClient();

  const existingRes = await supabase
    .from('reservations')
    .select('id')
    .eq('stripe_payment_intent_id', paymentIntentId)
    .single();

  if (existingRes.data) {
    return { alreadyProcessed: true, reservationId: existingRes.data.id };
  }

  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
  const meta = paymentIntent.metadata;
  const items = JSON.parse(meta.itemsJson || '[]');

  const orderNumber = generateOrderNumber();

  const { data: reservation, error: resError } = await supabase
    .from('reservations')
    .insert({
      order_number: orderNumber,
      email: meta.email,
      first_name: meta.firstName,
      last_name: meta.lastName,
      phone: meta.phone || null,
      status: 'confirmed',
      total_amount: paymentIntent.amount,
      stripe_payment_intent_id: paymentIntentId,
    })
    .select()
    .single();

  if (resError || !reservation) {
    throw new Error(`Failed to create reservation: ${resError?.message}`);
  }

  let totalAdults = 0;
  let totalChildren = 0;

  for (const item of items) {
    totalAdults += item.adults || 0;
    totalChildren += item.children || 0;

    await supabase.from('reservation_items').insert({
      reservation_id: reservation.id,
      product_slug: item.slug,
      product_title: item.slug,
      quantity: 1,
      adult_count: item.adults || 0,
      child_count: item.children || 0,
      unit_price: item.price,
      total_price: item.price,
      premium_options: [],
    });
  }

  let qrCodes = { adult: [] as string[], child: [] as string[] };
  try {
    qrCodes = await assignQRCodes({
      reservationId: reservation.id,
      adultCount: totalAdults,
      childCount: totalChildren,
    });
  } catch (err) {
    console.error('[RESERVATION] QR assignment failed:', err);
    await supabase
      .from('reservations')
      .update({ notes: 'QR_ASSIGNMENT_FAILED - manual action required' })
      .eq('id', reservation.id);
  }

  for (const item of items) {
    const { data: product } = await supabase
      .from('products')
      .select('has_esim, esim_package')
      .eq('slug', item.slug)
      .single();

    if (product?.has_esim && product.esim_package) {
      const esimCount = item.adults || 1;
      for (let i = 0; i < esimCount; i++) {
        try {
          const esimResult = await provisionESIM({
            reservationId: reservation.id,
            packageType: product.esim_package as '3gb' | '10gb',
            customerName: `${meta.firstName} ${meta.lastName}`,
            customerEmail: meta.email,
          });
          if (esimResult?.qrCodeUrl) {
            sendESIMEmail({
              email: meta.email,
              firstName: meta.firstName,
              orderNumber,
              packageType: product.esim_package as '3gb' | '10gb',
              qrCodeUrl: esimResult.qrCodeUrl,
              smdpAddress: esimResult.smdpAddress || '',
              iosLink: esimResult.iosLink || '',
              iccid: esimResult.iccid || '',
            }).catch((err) => console.error('[EMAIL] eSIM email failed:', err));
          }
        } catch (err) {
          console.error('[RESERVATION] eSIM provisioning failed:', err);
        }
      }
    }
  }

  // Generate PDF ticket, wallet passes, and send confirmation email
  generateAndUploadTicket({
    reservationId: reservation.id,
    orderNumber,
    firstName: meta.firstName,
    lastName: meta.lastName,
    email: meta.email,
    totalAmount: paymentIntent.amount,
    items: items.map((i: { slug: string; adults: number; children: number }) => ({
      slug: i.slug,
      title: i.slug,
      adults: i.adults,
      children: i.children,
    })),
    qrCodes,
  }).then(async (pdfUrl) => {
    console.log(`[PDF] Ticket generated: ${pdfUrl}`);

    const pdfBuffer = await generateTicketPDF({
      reservationId: reservation.id,
      orderNumber,
      firstName: meta.firstName,
      lastName: meta.lastName,
      email: meta.email,
      totalAmount: paymentIntent.amount,
      items: items.map((i: { slug: string; adults: number; children: number }) => ({
        slug: i.slug,
        title: i.slug,
        adults: i.adults,
        children: i.children,
      })),
      qrCodes,
    });

    const qrValue = qrCodes.adult[0] || qrCodes.child[0] || orderNumber;
    const walletPasses = await generateWalletPasses({
      orderNumber,
      firstName: meta.firstName,
      lastName: meta.lastName,
      email: meta.email,
      adultCount: totalAdults,
      childCount: totalChildren,
      qrCodeValue: qrValue,
      totalAmount: paymentIntent.amount,
    });

    if (walletPasses.googleWalletUrl) {
      await supabase
        .from('reservations')
        .update({ google_wallet_url: walletPasses.googleWalletUrl })
        .eq('id', reservation.id);
    }

    sendConfirmationEmail({
      orderNumber,
      email: meta.email,
      firstName: meta.firstName,
      lastName: meta.lastName,
      totalAmount: paymentIntent.amount,
      items,
      qrCodes,
      pdfBuffer,
      applePassBuffer: walletPasses.applePassBuffer,
      googleWalletUrl: walletPasses.googleWalletUrl,
    });
  }).catch((err) => {
    console.error('[PDF] Generation failed, sending email without PDF:', err);
    sendConfirmationEmail({
      orderNumber,
      email: meta.email,
      firstName: meta.firstName,
      lastName: meta.lastName,
      totalAmount: paymentIntent.amount,
      items,
      qrCodes,
    }).catch((e) => console.error('[EMAIL] Confirmation failed:', e));
  });

  return {
    alreadyProcessed: false,
    reservationId: reservation.id,
    orderNumber,
    qrCodes,
  };
}

export async function lookupReservation(email: string, orderNumber?: string) {
  const supabase = createServiceClient();

  let query = supabase
    .from('reservations')
    .select(`
      *,
      reservation_items (*),
      qr_codes (code, type, status),
      esim_orders (iccid, qr_code_url, package_type, status)
    `)
    .eq('email', email)
    .order('created_at', { ascending: false });

  if (orderNumber) {
    query = query.eq('order_number', orderNumber);
  }

  const { data, error } = await query;

  if (error) throw new Error(`Lookup failed: ${error.message}`);
  return data || [];
}
