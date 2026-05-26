export interface TicketQRCode {
  code: string;
  type: 'adult' | 'child';
  imageDataUrl: string;
}

export interface TicketESIM {
  packageType: '3gb' | '10gb';
  iccid: string;
  smdpAddress: string;
  qrImageDataUrl?: string;
}

export interface TicketData {
  orderNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  totalAmount: number;
  totalAdults: number;
  totalChildren: number;
  items: Array<{
    title: string;
    adultCount: number;
    childCount: number;
  }>;
  qrCodes: TicketQRCode[];
  esim?: TicketESIM;
  logoUrl?: string;
}
