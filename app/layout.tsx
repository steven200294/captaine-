import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: {
    default: 'The Captain Boat — Croisieres sur la Seine a Paris',
    template: '%s | The Captain Boat',
  },
  description: 'Reservez votre croisiere sur la Seine avec The Captain Boat. Decouvrez Paris depuis un bateau avec macarons, eSIM et experiences exclusives.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://thecaptainboat.com'),
  keywords: ['croisiere seine', 'bateau paris', 'croisiere paris', 'the captain boat', 'seine cruise'],
  authors: [{ name: 'The Captain Boat' }],
  creator: 'The Captain Boat',
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    siteName: 'The Captain Boat',
    title: 'The Captain Boat — Croisieres sur la Seine',
    description: 'Reservez votre croisiere sur la Seine. Billets flexibles valables 2 ans.',
    images: [{ url: '/images/og-cover.jpg', width: 1200, height: 630, alt: 'Croisiere sur la Seine' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Captain Boat — Croisieres sur la Seine',
    description: 'Decouvrez Paris depuis la Seine. Reservez en ligne.',
    images: ['/images/og-cover.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        {children}
      </body>
    </html>
  );
}
