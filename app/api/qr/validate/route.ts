import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@shared/config/supabase-server';

function extractQRCode(raw: string): string {
  let code = raw.trim();

  // Handle URL-encoded QR codes (e.g., https://thecaptainboat.com/qr/CODE123)
  try {
    const url = new URL(code);
    const pathParts = url.pathname.split('/').filter(Boolean);
    if (pathParts.length > 0) {
      code = pathParts[pathParts.length - 1];
    }
  } catch {
    // Not a URL — use raw value
  }

  // Handle JSON format (e.g., {"code":"ABC123","type":"adult"})
  try {
    const parsed = JSON.parse(code);
    if (parsed.code) code = parsed.code;
  } catch {
    // Not JSON
  }

  // Handle prefix formats (e.g., "TCB:ABC123" or "QR-ABC123")
  if (code.includes(':')) {
    code = code.split(':').pop()!;
  }

  return code.trim();
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const rawCode = body.code;
    const action = body.action || 'validate';

    if (!rawCode || typeof rawCode !== 'string' || rawCode.length < 3) {
      return NextResponse.json(
        { success: false, error: 'Code QR invalide' },
        { status: 400 }
      );
    }

    const code = extractQRCode(rawCode);
    const supabase = createServiceClient();

    const { data: qr, error } = await supabase
      .from('qr_codes')
      .select('id, code, type, status, reservation_id')
      .eq('code', code)
      .single();

    if (error || !qr) {
      return NextResponse.json({
        success: true,
        data: { valid: false, scannedRaw: rawCode, extractedCode: code, message: 'QR code inconnu' },
      });
    }

    if (qr.status === 'used') {
      return NextResponse.json({
        success: true,
        data: { valid: false, type: qr.type, message: 'Deja utilise', code: qr.code },
      });
    }

    if (qr.status !== 'assigned') {
      return NextResponse.json({
        success: true,
        data: { valid: false, type: qr.type, message: 'Non attribue', code: qr.code },
      });
    }

    if (action === 'check') {
      return NextResponse.json({
        success: true,
        data: { valid: true, type: qr.type, message: 'Valide (non consomme)', code: qr.code },
      });
    }

    // action === 'validate' → mark as used
    const { error: updateError } = await supabase
      .from('qr_codes')
      .update({ status: 'used', used_at: new Date().toISOString() })
      .eq('id', qr.id);

    if (updateError) {
      return NextResponse.json({
        success: false,
        error: 'Erreur lors de la validation',
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: {
        valid: true,
        type: qr.type,
        reservationId: qr.reservation_id,
        message: `${qr.type === 'adult' ? 'Adulte' : 'Enfant'} valide`,
        code: qr.code,
      },
    });
  } catch (error) {
    console.error('[QR_VALIDATE]', error);
    return NextResponse.json(
      { success: false, error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

