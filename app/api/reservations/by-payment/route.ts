import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@shared/config/supabase-server';

export async function GET(req: NextRequest) {
  const piId = req.nextUrl.searchParams.get('payment_intent');

  if (!piId) {
    return NextResponse.json(
      { success: false, error: 'Missing payment_intent param' },
      { status: 400 }
    );
  }

  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from('reservations')
    .select(`
      id, order_number, status, email, first_name, last_name,
      cruise_date, cruise_time, total_amount, created_at, pdf_url,
      reservation_items (product_title, adult_count, child_count),
      qr_codes (code, type, status),
      esim_orders (iccid, qr_code_url, package_type, status)
    `)
    .eq('stripe_payment_intent_id', piId)
    .single();

  if (error || !data) {
    return NextResponse.json(
      { success: false, error: 'Reservation not found' },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, data });
}
