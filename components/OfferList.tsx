'use client';
import Link from "next/link";
import OfferCard from "./OfferCard";
import { useFilters } from "./FilterContext";
import { OFFERS, applyFilters } from "../lib/offers";

export default function OfferList() {
  const { filters } = useFilters();
  const filtered = applyFilters(OFFERS, filters);

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-[#1c2b4c] uppercase">
          {filtered.length} OFFRE{filtered.length !== 1 ? 'S' : ''} TROUVÉE{filtered.length !== 1 ? 'S' : ''}
        </h2>
        <div className="flex items-center gap-3 text-sm font-medium text-gray-500 mt-2 sm:mt-0">
          Trier par :
          <div className="flex items-center gap-1 font-bold text-[#1c2b4c] cursor-pointer">
            Les plus populaires
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>
        </div>
      </div>

      {/* List */}
      {filtered.length > 0 ? (
        <div className="flex flex-col gap-6">
          {filtered.map((offer) => (
            <OfferCard key={offer.slug} {...offer} image={offer.image} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <p className="text-2xl mb-2">🔍</p>
          <p className="text-lg font-bold text-[#1c2b4c] mb-1">Aucune offre trouvée</p>
          <p className="text-sm text-gray-500">Essayez de modifier vos filtres.</p>
        </div>
      )}

      {/* Action bottom */}
      {filtered.length > 0 && (
        <div className="mt-12 flex justify-center">
          <Link href="/produits" className="bg-[#1c355e] hover:bg-[#132545] text-white font-bold text-sm px-16 py-4 rounded-full transition-colors shadow-lg shadow-[#1c355e]/20">
            RÉSERVER
          </Link>
        </div>
      )}
    </div>
  );
}
