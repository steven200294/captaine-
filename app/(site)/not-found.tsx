import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <p className="text-7xl font-black text-[#1c355e] mb-4">404</p>
        <h1 className="text-xl font-bold text-[#1c355e] mb-2">
          Page introuvable
        </h1>
        <p className="text-sm text-gray-500 mb-8">
          La page que vous cherchez n&apos;existe pas ou a ete deplacee.
        </p>
        <div className="flex gap-3 justify-center">
          <Link
            href="/"
            className="bg-[#1c355e] hover:bg-[#152846] text-white font-bold py-3 px-6 rounded-xl transition-colors text-sm"
          >
            Retour a l&apos;accueil
          </Link>
          <Link
            href="/produits"
            className="border border-gray-200 text-gray-600 font-bold py-3 px-6 rounded-xl hover:bg-gray-50 transition-colors text-sm"
          >
            Voir les offres
          </Link>
        </div>
      </div>
    </div>
  );
}
