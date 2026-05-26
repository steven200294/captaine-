import Image from "next/image";

export default function ClientReviewsSection() {
  return (
    <section className="bg-white py-24">
      <div className="container mx-auto px-4 lg:px-8 max-w-[1200px]">
        
        {/* Section Title */}
        <h2 className="text-[40px] md:text-5xl font-medium text-center text-[#1c2b4c] mb-16 tracking-tight">
          Avis Client
        </h2>

        {/* 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          
          {/* Card 1: Image + Slide-up Hover Info */}
          <div className="group rounded-[2rem] bg-[#1c355e] flex flex-col h-[480px] shadow-[0_20px_40px_rgba(28,53,94,0.15)] overflow-hidden relative cursor-pointer">
            {/* Background Image */}
            <div className="absolute inset-0 w-full h-full transition-transform duration-700 group-hover:scale-105">
              <Image 
                src="/review_1.jpg" 
                alt="Kenji T." 
                fill 
                className="object-cover" 
              />
            </div>
            
            {/* Sliding Blue Overlay */}
            <div className="absolute bottom-0 w-full bg-[#1c355e] flex flex-col justify-start p-8 transition-all duration-500 ease-in-out h-[28%] group-hover:h-full">
              {/* Always visible header */}
              <div className="flex-shrink-0 mb-6">
                <h3 className="text-white font-bold text-[22px] tracking-wide mb-1">Kenji T.</h3>
                <p className="text-blue-200 text-sm font-medium">Photographe de voyage</p>
              </div>

              {/* Review text - Hidden by default */}
              <div className="opacity-0 translate-y-8 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-100 flex-1">
                <div className="mb-4">
                  <svg width="32" height="24" viewBox="0 0 32 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11.5 26H0V14.5L7.5 0H15L9.5 12H11.5V26ZM31 26H19.5V14.5L27 0H34.5L29 12H31V26Z" fill="#cbd5e1" opacity="0.6"/>
                  </svg>
                </div>
                <p className="text-white text-[16px] leading-[1.6] font-medium italic">
                  "Superbe expérience ! Le personnel est aux petits soins et la vue sur les monuments depuis le bateau est incomparable. L'organisation était parfaite de A à Z."
                </p>
              </div>
            </div>
          </div>

          {/* Card 2: Quote (Static, or could be animated too, but keeping to mockup) */}
          <div className="rounded-[2rem] bg-[#1c355e] flex flex-col p-10 h-[480px] shadow-[0_20px_40px_rgba(28,53,94,0.15)] relative transform transition-transform duration-500 hover:-translate-y-2">
            <div className="mb-6 mt-2">
              <svg width="44" height="34" viewBox="0 0 32 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.5 26H0V14.5L7.5 0H15L9.5 12H11.5V26ZM31 26H19.5V14.5L27 0H34.5L29 12H31V26Z" fill="#cbd5e1" opacity="0.9"/>
              </svg>
            </div>
            <p className="text-white text-[17px] leading-[1.6] font-medium mb-auto italic">
              "Une expérience inoubliable sur la Seine ! Pouvoir profiter d'une croisière tout en dégustant de délicieux macarons, avec une connexion eSIM parfaite dès notre arrivée... C'est le service premium idéal pour visiter Paris."
            </p>
            <div className="mt-8">
              <h3 className="text-white font-bold text-[22px] tracking-wide mb-1">Antoine & Marie</h3>
              <p className="text-blue-200 text-sm font-medium">Jeunes mariés</p>
            </div>
          </div>

          {/* Card 3: Image + Slide-up Hover Info */}
          <div className="group rounded-[2rem] bg-[#1c355e] flex flex-col h-[480px] shadow-[0_20px_40px_rgba(28,53,94,0.15)] overflow-hidden relative cursor-pointer">
            {/* Background Image */}
            <div className="absolute inset-0 w-full h-full transition-transform duration-700 group-hover:scale-105">
              <Image 
                src="/review_2.jpg" 
                alt="Sophie M." 
                fill 
                className="object-cover" 
              />
            </div>
            
            {/* Sliding Blue Overlay */}
            <div className="absolute bottom-0 w-full bg-[#1c355e] flex flex-col justify-start p-8 transition-all duration-500 ease-in-out h-[28%] group-hover:h-full">
              {/* Always visible header */}
              <div className="flex-shrink-0 mb-6">
                <h3 className="text-white font-bold text-[22px] tracking-wide mb-1">Sophie M.</h3>
                <p className="text-blue-200 text-sm font-medium">Blogueuse voyage</p>
              </div>

              {/* Review text - Hidden by default */}
              <div className="opacity-0 translate-y-8 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-100 flex-1">
                <div className="mb-4">
                  <svg width="32" height="24" viewBox="0 0 32 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11.5 26H0V14.5L7.5 0H15L9.5 12H11.5V26ZM31 26H19.5V14.5L27 0H34.5L29 12H31V26Z" fill="#cbd5e1" opacity="0.6"/>
                  </svg>
                </div>
                <p className="text-white text-[16px] leading-[1.6] font-medium italic">
                  "La croisière au coucher du soleil est tout simplement magique. Le confort du bateau est exceptionnel et je recommande chaudement !"
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
