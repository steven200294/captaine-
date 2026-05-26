import { createServiceClient } from '@shared/config/supabase-server';
import type { QRCodeType } from '@shared/types';

interface AssignQRCodesParams {
  reservationId: string;
  adultCount: number;
  childCount: number;
}

interface AssignedCodes {
  adult: string[];
  child: string[];
}

export async function assignQRCodes({ reservationId, adultCount, childCount }: AssignQRCodesParams): Promise<AssignedCodes> {
  const supabase = createServiceClient();

  const assignByType = async (type: QRCodeType, count: number): Promise<string[]> => {
    if (count === 0) return [];

    const { data: available, error: fetchError } = await supabase
      .from('qr_codes')
      .select('id, code')
      .eq('status', 'available')
      .eq('type', type)
      .order('created_at', { ascending: true })
      .limit(count);

    if (fetchError) throw new Error(`Failed to fetch ${type} QR codes: ${fetchError.message}`);
    if (!available || available.length < count) {
      throw new Error(`Insufficient ${type} QR codes: need ${count}, have ${available?.length ?? 0}`);
    }

    const ids = available.map((qr) => qr.id);
    const { error: updateError } = await supabase
      .from('qr_codes')
      .update({
        status: 'assigned',
        reservation_id: reservationId,
        assigned_at: new Date().toISOString(),
      })
      .in('id', ids);

    if (updateError) throw new Error(`Failed to assign ${type} QR codes: ${updateError.message}`);

    return available.map((qr) => qr.code);
  };

  const [adult, child] = await Promise.all([
    assignByType('adult', adultCount),
    assignByType('child', childCount),
  ]);

  return { adult, child };
}

export async function validateQRCode(code: string): Promise<{
  valid: boolean;
  type?: QRCodeType;
  reservationId?: string;
  message: string;
}> {
  const supabase = createServiceClient();

  const { data: qr, error } = await supabase
    .from('qr_codes')
    .select('id, code, type, status, reservation_id')
    .eq('code', code)
    .single();

  if (error || !qr) {
    return { valid: false, message: 'QR code inconnu' };
  }

  if (qr.status === 'used') {
    return { valid: false, type: qr.type as QRCodeType, message: 'QR code déjà utilisé' };
  }

  if (qr.status !== 'assigned') {
    return { valid: false, type: qr.type as QRCodeType, message: 'QR code non attribué' };
  }

  const { error: updateError } = await supabase
    .from('qr_codes')
    .update({ status: 'used', used_at: new Date().toISOString() })
    .eq('id', qr.id);

  if (updateError) {
    return { valid: false, message: 'Erreur lors de la validation' };
  }

  return {
    valid: true,
    type: qr.type as QRCodeType,
    reservationId: qr.reservation_id ?? undefined,
    message: `✓ ${qr.type === 'adult' ? 'Adulte' : 'Enfant'} validé`,
  };
}

export async function getQRStockCount(): Promise<{ adult: number; child: number }> {
  const supabase = createServiceClient();

  const { count: adultCount } = await supabase
    .from('qr_codes')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'available')
    .eq('type', 'adult');

  const { count: childCount } = await supabase
    .from('qr_codes')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'available')
    .eq('type', 'child');

  return { adult: adultCount ?? 0, child: childCount ?? 0 };
}
