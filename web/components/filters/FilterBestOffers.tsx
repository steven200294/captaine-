'use client';
import { Flame, Zap } from "lucide-react";
import { useFilters } from "../FilterContext";

export default function FilterBestOffers() {
  const { filters, setBestOffer } = useFilters();

  return (
    <div>
      <h3 className="text-xs font-bold text-[#1c2b4c] uppercase tracking-wider mb-4">
        MEILLEURES OFFRES
      </h3>
      <div className="flex flex-col gap-1">
        <button
          onClick={() => setBestOffer('meilleures')}
          className={`flex items-center gap-3 w-full font-bold px-4 py-3 rounded-md text-sm transition-colors ${
            filters.bestOffer === 'meilleures'
              ? 'bg-[#fce8e8] text-[#c3171d]'
              : 'text-gray-500 hover:bg-gray-50'
          }`}
        >
          <Flame className={`w-4 h-4 ${filters.bestOffer === 'meilleures' ? 'fill-current' : ''}`} />
          Meilleures offres
        </button>
        <button
          onClick={() => setBestOffer('flash')}
          className={`flex items-center gap-3 w-full font-bold px-4 py-3 rounded-md text-sm transition-colors ${
            filters.bestOffer === 'flash'
              ? 'bg-[#fce8e8] text-[#c3171d]'
              : 'text-gray-500 hover:bg-gray-50'
          }`}
        >
          <Zap className={`w-4 h-4 ${filters.bestOffer === 'flash' ? 'fill-current' : ''}`} />
          Ventes flash
        </button>
      </div>
    </div>
  );
}
