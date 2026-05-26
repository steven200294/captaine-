'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[ERROR_BOUNDARY]', error);
  }, [error]);

  return (
    <html lang="fr">
      <body className="min-h-screen bg-[#f8f9fa] flex items-center justify-center px-4 font-sans">
        <div className="bg-white rounded-2xl shadow-[0_2px_20px_rgb(0,0,0,0.05)] p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-[#1c355e] mb-2">
            Une erreur est survenue
          </h1>
          <p className="text-sm text-gray-500 mb-6">
            Nous nous excusons pour ce desagrement. Notre equipe a ete notifiee.
          </p>
          <div className="flex gap-3">
            <button
              onClick={reset}
              className="flex-1 bg-[#1c355e] hover:bg-[#152846] text-white font-bold py-3 rounded-xl transition-colors text-sm"
            >
              Reessayer
            </button>
            <Link
              href="/"
              className="flex-1 border border-gray-200 text-gray-600 font-bold py-3 rounded-xl hover:bg-gray-50 transition-colors text-sm flex items-center justify-center"
            >
              Accueil
            </Link>
          </div>
          {error.digest && (
            <p className="text-[10px] text-gray-400 mt-4 font-mono">
              Ref: {error.digest}
            </p>
          )}
        </div>
      </body>
    </html>
  );
}
