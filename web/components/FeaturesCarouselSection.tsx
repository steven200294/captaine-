import Image from "next/image";
import { CheckCircle, Star, ShieldCheck } from "lucide-react";

export default function FeaturesCarouselSection() {
  const CAROUSEL_IMAGES = [
    { src: "/images/croisieres/hero.png", alt: "Croisière sur la Seine" },
    { src: "/images/cards/esim.png", alt: "eSIM Digitale" },
    { src: "/images/cards/macarons.png", alt: "Macarons Parisiens" },
    { src: "/images/croisieres/night.png", alt: "Croisière de nuit" },
    { src: "/images/croisieres/experience.png", alt: "Expérience à bord" },
    { src: "/images/cards/croisière.jpg", alt: "Bateau sur la Seine" },
  ];

  // We duplicate the array to create a seamless infinite scroll loop
  const duplicatedImages = [...CAROUSEL_IMAGES, ...CAROUSEL_IMAGES];

  return (
    <section className="bg-white py-12 md:py-24 overflow-hidden border-t border-gray-200">
      <div className="container mx-auto px-4 lg:px-8 max-w-5xl text-center mb-10 md:mb-16">
        <h4 className="text-[#1c355e] font-black tracking-widest uppercase text-xs sm:text-sm mb-4">
          Bienvenue sur The Captain Boat
        </h4>
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#1c355e] mb-8 md:mb-12 leading-tight tracking-tight px-2">
          Découvrez nos expériences uniques sur la Seine : des croisières inoubliables avec macarons, eSIM et bien plus encore.
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 md:gap-12 text-sm font-bold text-[#1c355e]">
          <div className="flex items-center justify-center gap-3 bg-[#f0f4ff] sm:bg-transparent rounded-xl px-4 py-3 sm:p-0">
            <CheckCircle className="w-5 h-5 flex-shrink-0 text-[#1c355e]" />
            <span>Réservation facile</span>
          </div>
          <div className="flex items-center justify-center gap-3 bg-[#f0f4ff] sm:bg-transparent rounded-xl px-4 py-3 sm:p-0">
            <Star className="w-5 h-5 flex-shrink-0 text-[#1c355e]" />
            <span>Service premium</span>
          </div>
          <div className="flex items-center justify-center gap-3 bg-[#f0f4ff] sm:bg-transparent rounded-xl px-4 py-3 sm:p-0">
            <ShieldCheck className="w-5 h-5 flex-shrink-0 text-[#1c355e]" />
            <span>Meilleur prix garanti</span>
          </div>
        </div>
      </div>

      {/* Infinite Scroll Marquee */}
      <div className="relative w-full flex overflow-hidden group py-6 md:py-10">
        <div className="absolute top-0 left-0 w-[8%] md:w-[15%] h-full bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute top-0 right-0 w-[8%] md:w-[15%] h-full bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        <div className="flex gap-4 md:gap-6 w-max animate-marquee group-hover:[animation-play-state:paused] px-2 md:px-3">
          {duplicatedImages.map((img, idx) => (
            <div
              key={idx}
              className="relative w-[220px] sm:w-[320px] md:w-[440px] lg:w-[560px] h-[160px] sm:h-[220px] md:h-[300px] lg:h-[380px] rounded-2xl md:rounded-[2rem] overflow-hidden shadow-lg md:shadow-2xl flex-shrink-0"
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
