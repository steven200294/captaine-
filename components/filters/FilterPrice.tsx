'use client';
import { useFilters, PRICE_MIN, PRICE_MAX } from "../FilterContext";

export default function FilterPrice() {
  const { filters, setPriceRange } = useFilters();
  const [minVal, maxVal] = filters.priceRange;

  const minPercent = ((minVal - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100;
  const maxPercent = ((maxVal - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100;

  return (
    <div>
      <h3 className="text-xs font-bold text-[#1c2b4c] uppercase tracking-wider mb-4">
        PRIX
      </h3>
      <div className="flex items-center justify-between text-sm font-bold text-[#1c2b4c] mb-5">
        <span>{minVal}€</span>
        <span>{maxVal >= PRICE_MAX ? `${maxVal}€+` : `${maxVal}€`}</span>
      </div>

      <div className="relative h-2">
        {/* Background track */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gray-200 rounded-full" />
        {/* Active track */}
        <div
          className="absolute top-0 h-2 bg-[#1c2b4c] rounded-full"
          style={{ left: `${minPercent}%`, right: `${100 - maxPercent}%` }}
        />
        {/* Min thumb */}
        <input
          type="range"
          min={PRICE_MIN}
          max={PRICE_MAX}
          value={minVal}
          onChange={e => {
            const v = Math.min(Number(e.target.value), maxVal - 1);
            setPriceRange([v, maxVal]);
          }}
          className="price-range-input absolute w-full h-2 appearance-none bg-transparent"
          style={{ zIndex: minVal > PRICE_MAX - 10 ? 5 : 3 }}
        />
        {/* Max thumb */}
        <input
          type="range"
          min={PRICE_MIN}
          max={PRICE_MAX}
          value={maxVal}
          onChange={e => {
            const v = Math.max(Number(e.target.value), minVal + 1);
            setPriceRange([minVal, v]);
          }}
          className="price-range-input absolute w-full h-2 appearance-none bg-transparent"
          style={{ zIndex: minVal > PRICE_MAX - 10 ? 3 : 5 }}
        />
      </div>

      <style>{`
        .price-range-input {
          pointer-events: none;
          cursor: pointer;
        }
        .price-range-input::-webkit-slider-thumb {
          -webkit-appearance: none;
          pointer-events: all;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #1c2b4c;
          border: 2px solid white;
          box-shadow: 0 1px 4px rgba(0,0,0,0.25);
          cursor: pointer;
        }
        .price-range-input::-moz-range-thumb {
          pointer-events: all;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #1c2b4c;
          border: 2px solid white;
          box-shadow: 0 1px 4px rgba(0,0,0,0.25);
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
