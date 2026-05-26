"use client";

import Link from "next/link";
import { Zap } from "lucide-react";

interface PromoCardProps {
  slug: string;
  title: string;
  discount: number;
  originalPrice: number;
  currentPrice: number;
  badge: string;
}

export default function PromoCard({
  slug,
  title,
  discount,
  originalPrice,
  currentPrice,
  badge,
}: PromoCardProps) {
  return (
    <div className="mt-2 mb-1 w-full rounded-2xl border border-[#FFB800]/30 bg-linear-to-br from-[#FFB800]/5 to-[#FFB800]/10 p-3 shadow-sm">
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="shrink-0 w-10 h-10 rounded-xl bg-[#FFB800] flex items-center justify-center">
          <Zap className="w-5 h-5 text-[#1c355e]" fill="currentColor" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-[#c3171d] text-white">
              {badge}
            </span>
            <span className="text-[10px] font-bold text-[#c3171d]">
              -{discount}€
            </span>
          </div>

          <h4 className="font-bold text-sm text-[#1c355e] mt-1 leading-tight truncate">
            {title}
          </h4>

          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-base font-bold text-[#1c355e]">{currentPrice}€</span>
            <span className="text-xs text-gray-400 line-through">{originalPrice}€</span>
          </div>
        </div>
      </div>

      {/* CTA */}
      <Link
        href={`/produits/${slug}`}
        className="mt-3 flex items-center justify-center gap-1.5 w-full text-xs font-bold bg-[#1c355e] text-white py-2.5 rounded-xl hover:bg-[#152846] transition-colors min-h-[44px]"
      >
        <Zap className="w-3.5 h-3.5" />
        Profiter de l'offre
      </Link>
    </div>
  );
}
