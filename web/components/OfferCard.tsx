import Image from "next/image";
import Link from "next/link";
import { Star, Clock, MapPin } from "lucide-react";

interface OfferCardProps {
  title: string;
  image: string;
  adultNewPrice: number;
  adultOldPrice: number;
  childNewPrice?: number;
  childOldPrice?: number;
  isPack?: boolean;
  childNote?: string;
  rating: number;
  reviews: number;
  duration?: string;
  location?: string;
  description: string;
  tags: string[];
  badge: {
    text: string;
    color: "green" | "red";
  };
  buttonText?: string;
  isFavorite?: boolean;
  slug?: string;
}

export default function OfferCard({
  title,
  image,
  adultNewPrice,
  adultOldPrice,
  childNewPrice,
  childOldPrice,
  isPack = false,
  childNote,
  rating,
  reviews,
  duration,
  location,
  description,
  tags,
  badge,
  buttonText = "Vérifier la disponibilité",
  isFavorite = false,
  slug,
}: OfferCardProps) {
  const discount = Math.round((1 - adultNewPrice / adultOldPrice) * 100);

  return (
    <div className="flex flex-col md:flex-row bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Image Section */}
      <div className="relative w-full h-[220px] md:w-[280px] lg:w-[320px] md:h-full flex-shrink-0">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
        />
        <div
          className={`absolute top-4 left-4 text-white text-[10px] font-bold px-2 py-1 uppercase rounded-sm ${
            badge.color === "red" ? "bg-[#c3171d]" : "bg-[#28a745]"
          }`}
        >
          {badge.text}
        </div>
      </div>

      {/* Content Section */}
      <div className="flex flex-col flex-1 p-5 lg:p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-2">
          <h2 className="text-lg lg:text-xl font-bold text-[#1c2b4c] leading-tight pr-4">
            {title}
          </h2>
          <div className="flex items-center gap-1 bg-[#fff8e6] px-2 py-1 rounded">
            <Star className="w-4 h-4 fill-[#FFB800] text-[#FFB800]" />
            <span className="font-bold text-sm text-[#1c2b4c]">{rating}</span>
            <span className="text-xs text-gray-500">({reviews.toLocaleString()})</span>
          </div>
        </div>

        {/* Meta info */}
        {(duration || location) && (
          <div className="flex items-center gap-4 text-xs font-medium text-gray-500 mb-4 uppercase">
            {duration && (
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {duration}
              </div>
            )}
            {location && (
              <div className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {location}
              </div>
            )}
          </div>
        )}

        {/* Description */}
        <p className="text-sm text-[#475569] font-medium leading-relaxed mb-4 line-clamp-3">
          {description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {tags.map((tag, idx) => (
            <span
              key={idx}
              className="bg-[#f1f5f9] text-[#475569] text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Footer: Price & Button */}
        <div className="mt-auto flex items-end justify-between gap-4">
          <div className="flex flex-col gap-1">
            {/* Adult / Pack price */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-400 uppercase w-14">
                {isPack ? "Pack" : "Adulte"}
              </span>
              <span className="text-[26px] font-bold text-[#1c2b4c] leading-none">{adultNewPrice}€</span>
              <span className="text-base text-[#c3171d] line-through font-medium leading-none">{adultOldPrice}€</span>
              <span className="bg-[#c3171d] text-white text-[10px] font-bold px-1.5 py-0.5 rounded">-{discount}%</span>
            </div>

            {/* Child price */}
            {childNewPrice !== undefined && childOldPrice !== undefined && (
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-400 uppercase w-14">Enfant</span>
                <span className="text-lg font-bold text-[#1c2b4c] leading-none">{childNewPrice}€</span>
                <span className="text-sm text-[#c3171d] line-through font-medium leading-none">{childOldPrice}€</span>
              </div>
            )}

            {/* Child note */}
            {childNote && (
              <p className="text-[10px] text-gray-400 mt-0.5">{childNote}</p>
            )}
          </div>

          {slug ? (
            <Link
              href={`/produits/${slug}`}
              className="bg-[#1c355e] hover:bg-[#132545] text-white font-semibold text-sm px-6 py-3 rounded-full transition-colors flex-shrink-0"
            >
              {buttonText}
            </Link>
          ) : (
            <button className="bg-[#1c355e] hover:bg-[#132545] text-white font-semibold text-sm px-6 py-3 rounded-full transition-colors flex-shrink-0">
              {buttonText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
