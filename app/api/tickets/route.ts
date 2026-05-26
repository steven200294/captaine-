import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@shared/config/supabase-server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const orderNumber = searchParams.get('order');
  const email = searchParams.get('email');

  if (!orderNumber || !email) {
    return NextResponse.json({ error: 'Paramètres manquants' }, { status: 400 });
  }

  const supabase = createServiceClient();

  const { data: reservation } = await supabase
    .from('reservations')
    .select('pdf_url')
    .eq('order_number', orderNumber)
    .eq('email', email)
    .single();

  if (!reservation?.pdf_url) {
    return NextResponse.json({ error: 'Ticket non trouvé' }, { status: 404 });
  }

  return NextResponse.json({ url: reservation.pdf_url });
}
