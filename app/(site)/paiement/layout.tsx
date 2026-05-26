import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Paiement Securise',
  description: 'Finalisez votre reservation pour votre croisiere sur la Seine. Paiement securise par Stripe.',
  robots: { index: false },
};

export default function PaiementLayout({ children }: { children: React.ReactNode }) {
  return children;
}
