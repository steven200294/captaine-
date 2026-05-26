import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@shared/config/stripe';
import { handlePaymentSuccess } from '@api/services/reservation';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature' }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('[WEBHOOK] Signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  switch (event.type) {
    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object;
      try {
        const result = await handlePaymentSuccess(paymentIntent.id);
        if (result.alreadyProcessed) {
          console.log('[WEBHOOK] Already processed:', paymentIntent.id);
        } else {
          console.log('[WEBHOOK] Reservation created:', result.orderNumber);
        }
      } catch (err) {
        console.error('[WEBHOOK] Processing failed:', err);
      }
      break;
    }

    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object;
      console.error('[WEBHOOK] Payment failed:', paymentIntent.id, paymentIntent.last_payment_error?.message);
      break;
    }

    default:
      console.log('[WEBHOOK] Unhandled event:', event.type);
  }

  return NextResponse.json({ received: true });
}
