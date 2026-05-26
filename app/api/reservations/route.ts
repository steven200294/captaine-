import { NextRequest, NextResponse } from 'next/server';
import { reservationLookupSchema } from '@shared/validations';
import { lookupReservation } from '@api/services/reservation';
import { checkRateLimit } from '@shared/security/rate-limit';

export async function POST(req: NextRequest) {
  const rateLimited = await checkRateLimit(req, 'lookup');
  if (rateLimited) return rateLimited;

  try {
    const body = await req.json();
    const parsed = reservationLookupSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const reservations = await lookupReservation(parsed.data.email, parsed.data.orderNumber);

    return NextResponse.json({
      success: true,
      data: reservations,
    });
  } catch (error) {
    console.error('[RESERVATIONS_LOOKUP]', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la recherche' },
      { status: 500 }
    );
  }
}
