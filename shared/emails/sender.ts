import { Resend } from 'resend';

export interface EmailPayload {
  to: string;
  subject: string;
  html: string;
  attachments?: Array<{
    filename: string;
    content: Buffer;
    contentType?: string;
  }>;
}

type EmailProvider = 'resend' | 'smtp';

function getProvider(): EmailProvider {
  if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== 're_xxx') {
    return 'resend';
  }
  return 'smtp';
}

async function sendViaResend(payload: EmailPayload) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const { error } = await resend.emails.send({
    from: process.env.EMAIL_FROM || 'The Captain Boat <noreply@thecaptainboat.com>',
    to: payload.to,
    subject: payload.subject,
    html: payload.html,
    attachments: payload.attachments?.map((a) => ({
      filename: a.filename,
      content: a.content,
    })),
  });
  if (error) throw new Error(`Resend error: ${error.message}`);
}

async function sendViaSMTP(payload: EmailPayload) {
  const smtpHost = process.env.SMTP_HOST || 'localhost';
  const smtpPort = process.env.SMTP_PORT || '1025';

  const boundary = `----boundary${Date.now()}`;
  const parts: string[] = [];

  parts.push(`From: ${process.env.EMAIL_FROM || 'The Captain Boat <noreply@thecaptainboat.com>'}`);
  parts.push(`To: ${payload.to}`);
  parts.push(`Subject: ${payload.subject}`);
  parts.push(`MIME-Version: 1.0`);

  if (payload.attachments?.length) {
    parts.push(`Content-Type: multipart/mixed; boundary="${boundary}"`);
    parts.push('');
    parts.push(`--${boundary}`);
    parts.push('Content-Type: text/html; charset=utf-8');
    parts.push('');
    parts.push(payload.html);

    for (const att of payload.attachments) {
      parts.push(`--${boundary}`);
      parts.push(`Content-Type: ${att.contentType || 'application/pdf'}`);
      parts.push(`Content-Disposition: attachment; filename="${att.filename}"`);
      parts.push('Content-Transfer-Encoding: base64');
      parts.push('');
      parts.push(att.content.toString('base64'));
    }
    parts.push(`--${boundary}--`);
  } else {
    parts.push('Content-Type: text/html; charset=utf-8');
    parts.push('');
    parts.push(payload.html);
  }

  const message = parts.join('\r\n');

  const net = await import('net');
  return new Promise<void>((resolve, reject) => {
    const socket = net.createConnection(Number(smtpPort), smtpHost, () => {
      let step = 0;
      socket.on('data', (data) => {
        const response = data.toString();
        if (response.startsWith('5')) {
          socket.destroy();
          reject(new Error(`SMTP error: ${response}`));
          return;
        }
        step++;
        switch (step) {
          case 1: socket.write(`EHLO localhost\r\n`); break;
          case 2: socket.write(`MAIL FROM:<noreply@thecaptainboat.com>\r\n`); break;
          case 3: socket.write(`RCPT TO:<${payload.to}>\r\n`); break;
          case 4: socket.write(`DATA\r\n`); break;
          case 5: socket.write(`${message}\r\n.\r\n`); break;
          case 6: socket.write(`QUIT\r\n`); resolve(); break;
        }
      });
    });
    socket.on('error', reject);
  });
}

export async function sendEmail(payload: EmailPayload): Promise<void> {
  const provider = getProvider();
  console.log(`[EMAIL] Sending "${payload.subject}" to ${payload.to} via ${provider}`);

  if (provider === 'resend') {
    await sendViaResend(payload);
  } else {
    await sendViaSMTP(payload);
  }
}
