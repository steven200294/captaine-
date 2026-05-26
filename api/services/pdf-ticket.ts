import { renderToBuffer } from '@react-pdf/renderer';
import QRCode from 'qrcode';
import React from 'react';
import { TicketPDF } from '@shared/pdf/ticket';
import { createServiceClient } from '@shared/config/supabase-server';
import type { TicketData, TicketQRCode, TicketESIM } from '@shared/pdf/types';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

async function generateQRDataUrl(text: string): Promise<string> {
  return QRCode.toDataURL(text, {
    width: 200,
    margin: 1,
    color: { dark: '#1c355e', light: '#ffffff' },
    errorCorrectionLevel: 'M',
  });
}

interface GenerateTicketParams {
  reservationId: string;
  orderNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  totalAmount: number;
  items: Array<{ slug: string; title: string; adults: number; children: number }>;
  qrCodes: { adult: string[]; child: string[] };
  esim?: {
    packageType: '3gb' | '10gb';
    iccid: string;
    smdpAddress: string;
    qrCodeUrl?: string;
  };
}

export async function generateTicketPDF(params: GenerateTicketParams): Promise<Buffer> {
  const qrCodeImages: TicketQRCode[] = [];

  for (const code of params.qrCodes.adult) {
    const imageDataUrl = await generateQRDataUrl(code);
    qrCodeImages.push({ code, type: 'adult', imageDataUrl });
  }
  for (const code of params.qrCodes.child) {
    const imageDataUrl = await generateQRDataUrl(code);
    qrCodeImages.push({ code, type: 'child', imageDataUrl });
  }

  let esimData: TicketESIM | undefined;
  if (params.esim) {
    let qrImageDataUrl: string | undefined;
    if (params.esim.qrCodeUrl) {
      try {
        const res = await fetch(params.esim.qrCodeUrl);
        const buffer = await res.arrayBuffer();
        const base64 = Buffer.from(buffer).toString('base64');
        const mime = res.headers.get('content-type') || 'image/png';
        qrImageDataUrl = `data:${mime};base64,${base64}`;
      } catch {
        qrImageDataUrl = await generateQRDataUrl(`LPA:1$${params.esim.smdpAddress}$${params.esim.iccid}`);
      }
    }
    esimData = {
      packageType: params.esim.packageType,
      iccid: params.esim.iccid,
      smdpAddress: params.esim.smdpAddress,
      qrImageDataUrl,
    };
  }

  const totalAdults = params.items.reduce((sum, i) => sum + i.adults, 0);
  const totalChildren = params.items.reduce((sum, i) => sum + i.children, 0);

  const ticketData: TicketData = {
    orderNumber: params.orderNumber,
    firstName: params.firstName,
    lastName: params.lastName,
    email: params.email,
    totalAmount: params.totalAmount,
    totalAdults,
    totalChildren,
    items: params.items.map((i) => ({
      title: i.title,
      adultCount: i.adults,
      childCount: i.children,
    })),
    qrCodes: qrCodeImages,
    esim: esimData,
    logoUrl: `${BASE_URL}/images/logo/captaine.png`,
  };

  const pdfElement = React.createElement(TicketPDF, { data: ticketData });
  const buffer = await renderToBuffer(pdfElement as any);

  return Buffer.from(buffer);
}

export async function generateAndUploadTicket(params: GenerateTicketParams): Promise<string> {
  const supabase = createServiceClient();
  const pdfBuffer = await generateTicketPDF(params);

  const filePath = `tickets/${params.orderNumber}.pdf`;

  const { error } = await supabase.storage
    .from('tickets')
    .upload(filePath, pdfBuffer, {
      contentType: 'application/pdf',
      upsert: true,
    });

  if (error) {
    console.error('[PDF] Upload failed:', error.message);
    throw new Error(`PDF upload failed: ${error.message}`);
  }

  const { data: urlData } = supabase.storage
    .from('tickets')
    .getPublicUrl(filePath);

  await supabase
    .from('reservations')
    .update({ pdf_url: urlData.publicUrl })
    .eq('id', params.reservationId);

  return urlData.publicUrl;
}
