import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@shared/emails';
import { reservationConfirmationEmail } from '@shared/emails';
import { esimActivationEmail } from '@shared/emails';
import { reminderEmail } from '@shared/emails';
import { postCruiseEmail } from '@shared/emails';

export async function POST(request: NextRequest) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Preview disabled in production' }, { status: 403 });
  }

  const body = await request.json();
  const { template, data } = body;

  let email: { subject: string; html: string };

  switch (template) {
    case 'reservation-confirmation':
      email = reservationConfirmationEmail(data);
      break;
    case 'esim-activation':
      email = esimActivationEmail(data);
      break;
    case 'reminder':
      email = reminderEmail(data);
      break;
    case 'post-cruise':
      email = postCruiseEmail(data);
      break;
    default:
      return NextResponse.json({ error: `Unknown template: ${template}` }, { status: 400 });
  }

  if (body.send) {
    await sendEmail({ to: data.email || 'test@test.com', ...email });
    return NextResponse.json({ sent: true, subject: email.subject });
  }

  return NextResponse.json({ subject: email.subject, html: email.html });
}
