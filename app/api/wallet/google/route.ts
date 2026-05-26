import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@shared/config/supabase-server';
import { generateGoogleWalletUrl } from '@api/services/wallet/google-wallet';

export async function GET(req: NextRequest) {
  const orderNumber = req.nextUrl.searchParams.get('order');
  const email = req.nextUrl.searchParams.get('email');

  if (!orderNumber || !email) {
    return NextResponse.json(
      { success: false, error: 'Missing order or email param' },
      { status: 400 }
    );
  }

  const supabase = createServiceClient();
  const { data: reservation } = await supabase
    .from('reservations')
    .select(`
      id, order_number, first_name, last_name, email, total_amount,
      cruise_date, cruise_time, google_wallet_url,
      reservation_items (adult_count, child_count),
      qr_codes (code, type)
    `)
    .eq('order_number', orderNumber)
    .eq('email', email)
    .single();

  if (!reservation) {
    return NextResponse.json(
      { success: false, error: 'Reservation not found' },
      { status: 404 }
    );
  }

  if (reservation.google_wallet_url) {
    return NextResponse.redirect(reservation.google_wallet_url);
  }

  const items = reservation.reservation_items as Array<{ adult_count: number; child_count: number }>;
  const totalAdults = items.reduce((s, i) => s + (i.adult_count || 0), 0);
  const totalChildren = items.reduce((s, i) => s + (i.child_count || 0), 0);
  const qrCodes = reservation.qr_codes as Array<{ code: string; type: string }>;
  const qrValue = qrCodes[0]?.code || reservation.order_number;

  const walletUrl = await generateGoogleWalletUrl({
    orderNumber: reservation.order_number,
    firstName: reservation.first_name,
    lastName: reservation.last_name,
    email: reservation.email,
    adultCount: totalAdults,
    childCount: totalChildren,
    cruiseDate: reservation.cruise_date || undefined,
    cruiseTime: reservation.cruise_time || undefined,
    qrCodeValue: qrValue,
    totalAmount: reservation.total_amount,
  });

  if (!walletUrl) {
    return NextResponse.json(
      { success: false, error: 'Google Wallet credentials not configured' },
      { status: 503 }
    );
  }

  return NextResponse.redirect(walletUrl);
}
