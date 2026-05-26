import { NextResponse } from 'next/server';
import { createServiceClient } from '@shared/config/supabase-server';

export async function GET() {
  const supabase = createServiceClient();

  const today = new Date().toISOString().split('T')[0];

  const { count: usedToday } = await supabase
    .from('qr_codes')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'used')
    .gte('used_at', `${today}T00:00:00`);

  const { count: totalUsed } = await supabase
    .from('qr_codes')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'used');

  const { count: totalAssigned } = await supabase
    .from('qr_codes')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'assigned');

  return NextResponse.json({
    success: true,
    data: {
      boardedToday: usedToday ?? 0,
      totalBoarded: totalUsed ?? 0,
      pendingBoarding: totalAssigned ?? 0,
    },
  });
}
