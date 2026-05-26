'use client';
import { useFilters, type OfferTypeKey } from "../FilterContext";
import { OFFERS } from "@shared/offers";

const OPTIONS: { label: string; value: OfferTypeKey }[] = [
  { label: "Croisière seule", value: "solo" },
  { label: "Croisière + eSIM", value: "esim" },
  { label: "Croisière + Macarons", value: "macarons" },
];

export default function FilterOfferType() {
  const { filters, toggleOfferType } = useFilters();

  return (
    <div>
      <h3 className="text-xs font-bold text-[#1c2b4c] uppercase tracking-wider mb-4">
        TYPE D&apos;OFFRE
      </h3>
      <div className="flex flex-col gap-3">
        {OPTIONS.map((opt) => {
          const count = OFFERS.filter(o => o.offerTypes.includes(opt.value)).length;
          const checked = filters.offerTypes.includes(opt.value);
          return (
            <label
              key={opt.value}
              className="flex items-center justify-between cursor-pointer group"
              onClick={() => toggleOfferType(opt.value)}
            >
              <div className="flex items-center gap-3">
                {checked ? (
                  <div className="w-5 h-5 rounded flex items-center justify-center bg-[#1c2b4c] text-white flex-shrink-0">
                    <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                ) : (
                  <div className="w-5 h-5 rounded border border-gray-300 group-hover:border-gray-400 flex-shrink-0"></div>
                )}
                <span className={`text-sm font-medium group-hover:text-black ${checked ? 'text-[#1c2b4c]' : 'text-gray-700'}`}>
                  {opt.label}
                </span>
              </div>
              <span className="text-xs text-gray-400">({count})</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
