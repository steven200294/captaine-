import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative w-full h-[90vh] min-h-[650px] md:h-[85vh] md:min-h-[650px] md:max-h-[900px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero/1000021601.jpg"
          alt="Croisière sur la Seine"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 w-full max-w-6xl mx-auto -mt-12">
        <h2 className="font-serif italic text-5xl sm:text-6xl md:text-7xl text-white mb-2 font-medium drop-shadow-md">
          Croisières
        </h2>
        
        {/* Responsive large text */}
        <h1 className="text-6xl sm:text-7xl md:text-[7rem] lg:text-[9rem] font-bold text-white tracking-tight leading-[0.85] mb-6 drop-shadow-xl w-full">
          SUR LA SEINE
        </h1>
        
        <p className="font-serif italic text-2xl sm:text-3xl md:text-4xl text-white drop-shadow-md">
          La meilleure expérience, au meilleur prix.
        </p>

        <a
          href="/produits"
          className="mt-8 px-10 py-4 bg-[#FFB800] hover:bg-[#f0ad00] text-[#0f172a] font-bold text-lg tracking-wide rounded-full transition-all duration-200 shadow-lg"
        >
          RÉSERVER
        </a>

        {/* Trust badges */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-white text-sm font-semibold">
          <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-sm px-4 py-2 rounded-full">
            <span className="text-[#FFB800]">★★★★★</span>
            <span>+500 avis clients</span>
          </div>
          <div className="bg-black/40 backdrop-blur-sm px-4 py-2 rounded-full">
            N°1 des croisières sur la Seine
          </div>
          <div className="bg-black/40 backdrop-blur-sm px-4 py-2 rounded-full">
            Départs tous les jours
          </div>
          <div className="bg-black/40 backdrop-blur-sm px-4 py-2 rounded-full">
            Billet coupe-file inclus
          </div>
        </div>
      </div>
    </section>
  );
}
