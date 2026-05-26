import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Nos Offres — Croisieres et Packs',
  description: 'Decouvrez toutes nos offres de croisieres sur la Seine : classiques, avec macarons, eSIM et packs privilege.',
  openGraph: {
    title: 'Offres The Captain Boat',
    description: 'Croisieres, macarons, eSIM et packs privileges sur la Seine.',
  },
};

export default function ProduitsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
