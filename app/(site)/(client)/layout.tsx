import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ma Reservation',
  description: 'Retrouvez vos billets, QR codes et le detail de votre commande The Captain Boat.',
  robots: { index: false },
};

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return children;
}
