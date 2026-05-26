import { NextRequest, NextResponse } from 'next/server';
import { checkoutSchema } from '@shared/validations';
import { createCheckoutSession } from '@api/services/reservation';
import { checkRateLimit } from '@shared/security/rate-limit';

export async function POST(req: NextRequest) {
  const rateLimited = await checkRateLimit(req, 'checkout');
  if (rateLimited) return rateLimited;

  try {
    const body = await req.json();
    const parsed = checkoutSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const session = await createCheckoutSession(parsed.data);

    return NextResponse.json({
      success: true,
      data: {
        clientSecret: session.clientSecret,
        paymentIntentId: session.paymentIntentId,
        amount: session.amount,
      },
    });
  } catch (error) {
    console.error('[CHECKOUT]', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la création du paiement' },
      { status: 500 }
    );
  }
}
