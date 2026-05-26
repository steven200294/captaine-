import { sendEmail, reservationConfirmationEmail, esimActivationEmail } from '@shared/emails';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

interface ConfirmationParams {
  orderNumber: string;
  email: string;
  firstName: string;
  lastName: string;
  totalAmount: number;
  items: Array<{ slug: string; adults: number; children: number; price: number }>;
  qrCodes: { adult: string[]; child: string[] };
  pdfBuffer?: Buffer;
  applePassBuffer?: Buffer;
  googleWalletUrl?: string;
}

export async function sendConfirmationEmail(params: ConfirmationParams): Promise<void> {
  const allQr = [
    ...params.qrCodes.adult.map((code) => ({ code, type: 'adult' as const })),
    ...params.qrCodes.child.map((code) => ({ code, type: 'child' as const })),
  ];

  const { subject, html } = reservationConfirmationEmail({
    orderNumber: params.orderNumber,
    firstName: params.firstName,
    lastName: params.lastName,
    email: params.email,
    totalAmount: params.totalAmount,
    items: params.items.map((item) => ({
      title: item.slug,
      adultCount: item.adults,
      childCount: item.children,
      price: item.price,
    })),
    qrCodes: allQr,
    baseUrl: BASE_URL,
    googleWalletUrl: params.googleWalletUrl,
  });

  const attachments: Array<{ filename: string; content: Buffer; contentType: string }> = [];

  if (params.pdfBuffer) {
    attachments.push({
      filename: `billets-${params.orderNumber}.pdf`,
      content: params.pdfBuffer,
      contentType: 'application/pdf',
    });
  }

  if (params.applePassBuffer) {
    attachments.push({
      filename: `billet-${params.orderNumber}.pkpass`,
      content: params.applePassBuffer,
      contentType: 'application/vnd.apple.pkpass',
    });
  }

  await sendEmail({
    to: params.email,
    subject,
    html,
    attachments: attachments.length > 0 ? attachments : undefined,
  });
}

interface ESIMEmailParams {
  email: string;
  firstName: string;
  orderNumber: string;
  packageType: '3gb' | '10gb';
  qrCodeUrl: string;
  smdpAddress: string;
  iosLink: string;
  iccid: string;
}

export async function sendESIMEmail(params: ESIMEmailParams): Promise<void> {
  const { subject, html } = esimActivationEmail({
    firstName: params.firstName,
    orderNumber: params.orderNumber,
    packageType: params.packageType,
    qrCodeUrl: params.qrCodeUrl,
    smdpAddress: params.smdpAddress,
    iosLink: params.iosLink,
    iccid: params.iccid,
    baseUrl: BASE_URL,
  });

  await sendEmail({ to: params.email, subject, html });
}
