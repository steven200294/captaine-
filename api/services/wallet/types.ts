export interface WalletPassData {
  orderNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  adultCount: number;
  childCount: number;
  cruiseDate?: string;
  cruiseTime?: string;
  qrCodeValue: string;
  totalAmount: number;
}

export interface WalletPassResult {
  applePassBuffer?: Buffer;
  googleWalletUrl?: string;
}
