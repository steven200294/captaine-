"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, ArrowRight } from "lucide-react";
import { getProductBySlug } from "@shared/products";

interface ProductCardProps {
  slug: string;
  title: string;
  price: number;
  oldPrice: number;
  image: string;
  badge?: string;
  description: string;
}

export default function ProductCard({
  slug,
  title,
  price,
  oldPrice,
  image,
  badge,
  description,
}: ProductCardProps) {
  const product = getProductBySlug(slug);

  return (
    <div className="mt-2 mb-1 w-full rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
      <div className="flex flex-col sm:flex-row">
        {/* Image */}
        <div className="relative w-full sm:w-28 h-32 sm:h-auto shrink-0">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 112px"
          />
          {badge && (
            <span className="absolute top-2 left-2 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-[#FFB800] text-[#1c355e]">
              {badge}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 p-3 flex flex-col gap-1.5">
          <h4 className="font-bold text-sm text-[#1c355e] leading-tight">{title}</h4>
          <p className="text-xs text-gray-500 line-clamp-2">{description}</p>

          {/* Price */}
          <div className="flex items-baseline gap-2 mt-auto">
            <span className="text-base font-bold text-[#1c355e]">{price}€</span>
            {oldPrice > price && (
              <span className="text-xs text-gray-400 line-through">{oldPrice}€</span>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2 mt-1.5">
            <Link
              href={`/produits/${slug}`}
              className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold bg-[#1c355e] text-white py-2 px-3 rounded-xl hover:bg-[#152846] transition-colors min-h-[44px]"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              Reserver
            </Link>
            <Link
              href={`/produits/${slug}`}
              className="flex items-center justify-center gap-1 text-xs font-semibold text-[#1c355e] border border-[#1c355e]/20 py-2 px-3 rounded-xl hover:bg-[#1c355e]/5 transition-colors min-h-[44px]"
            >
              Voir
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
