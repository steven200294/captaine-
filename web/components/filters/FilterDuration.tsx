'use client';
import { useFilters, type DurationKey } from "../FilterContext";
import { OFFERS } from "@shared/offers";

const OPTIONS: { label: string; value: DurationKey }[] = [
  { label: "1 heure", value: "1h" },
  { label: "Flexible", value: "flexible" },
];

export default function FilterDuration() {
  const { filters, setDuration } = useFilters();

  return (
    <div>
      <h3 className="text-xs font-bold text-[#1c2b4c] uppercase tracking-wider mb-4">
        DURÉE
      </h3>
      <div className="flex flex-col gap-3">
        {OPTIONS.map((opt) => {
          const count = OFFERS.filter(o => o.durationKey === opt.value).length;
          const selected = filters.duration === opt.value;
          return (
            <label
              key={opt.value}
              className="flex items-center justify-between cursor-pointer group"
              onClick={() => setDuration(opt.value)}
            >
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                  selected ? 'border-[#1c2b4c]' : 'border-gray-300 group-hover:border-gray-400'
                }`}>
                  {selected && <div className="w-2.5 h-2.5 rounded-full bg-[#1c2b4c]" />}
                </div>
                <span className={`text-sm font-medium group-hover:text-black ${selected ? 'text-[#1c2b4c]' : 'text-gray-700'}`}>
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
