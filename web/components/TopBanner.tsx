"use client";

import { Zap } from "lucide-react";
import { useEffect, useState } from "react";

const FLASH_SALE_SECONDS = 6 * 3600 + 42 * 60 + 18;

export default function TopBanner() {
  const [timeLeft, setTimeLeft] = useState(FLASH_SALE_SECONDS);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const h = String(Math.floor(timeLeft / 3600)).padStart(2, "0");
  const m = String(Math.floor((timeLeft % 3600) / 60)).padStart(2, "0");
  const s = String(timeLeft % 60).padStart(2, "0");

  return (
    <div className="bg-[#c3171d] text-white py-2 overflow-hidden relative">
      {/* Pulse overlay */}
      <div className="absolute inset-0 animate-pulse bg-white/5 pointer-events-none" />

      {/* Desktop */}
      <div className="hidden sm:flex items-center justify-center gap-2 px-4 text-xs font-bold tracking-wider">
        <Zap className="w-4 h-4 fill-white shrink-0 animate-bounce" />
        <span>HOT DEALS — OFFRES LIMITÉES SUR LES CROISIÈRES ! VENTE FLASH SE TERMINE DANS</span>
        <Countdown h={h} m={m} s={s} />
      </div>

      {/* Mobile: marquee + timer */}
      <div className="flex sm:hidden items-center gap-2 px-3 text-[10px] font-bold tracking-wide">
        <Zap className="w-3 h-3 fill-white shrink-0 animate-bounce" />
        <div className="flex-1 overflow-hidden">
          <div className="whitespace-nowrap animate-marquee inline-block">
            HOT DEALS — OFFRES LIMITÉES SUR LES CROISIÈRES !&nbsp;&nbsp;&nbsp;
          </div>
        </div>
        <Countdown h={h} m={m} s={s} small />
      </div>
    </div>
  );
}

function Countdown({ h, m, s, small }: { h: string; m: string; s: string; small?: boolean }) {
  const px = small ? "px-1 py-0.5 text-[10px]" : "px-1.5 py-0.5 text-xs";
  return (
    <div className="flex items-center gap-0.5 shrink-0">
      <span className={`bg-white text-[#c3171d] rounded shadow-sm leading-none font-mono tabular-nums ${px}`}>{h}</span>
      <span className="mx-0.5 animate-pulse">:</span>
      <span className={`bg-white text-[#c3171d] rounded shadow-sm leading-none font-mono tabular-nums ${px}`}>{m}</span>
      <span className="mx-0.5 animate-pulse">:</span>
      <span className={`bg-white text-[#c3171d] rounded shadow-sm leading-none font-mono tabular-nums ${px}`}>{s}</span>
    </div>
  );
}
