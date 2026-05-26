import Image from "next/image";
import Link from "next/link";

export default function TestimonialMapSection() {
  return (
    <section className="bg-white py-32 overflow-hidden relative">
      <div className="container mx-auto px-4 lg:px-8 max-w-[1600px] flex flex-col items-center">
        
        {/* Map Container - XXL size */}
        <div className="relative w-full min-h-[600px] md:min-h-[800px] lg:min-h-[900px] mb-12 mt-8">
          
          <Image
            src="/images/maps/carte-bleue.png"
            alt="Carte de Paris"
            fill
            className="object-contain mix-blend-multiply opacity-90 scale-110 md:scale-125 lg:scale-[1.4]"
          />

          {/* Testimonial Card 1 (Top Right - Main) */}
          <div className="absolute top-[2%] md:top-[8%] right-0 md:right-[5%] lg:right-[8%] bg-[#1c355e] rounded-[32px] p-8 md:p-10 max-w-[340px] md:max-w-[420px] shadow-[0_20px_60px_rgba(28,53,94,0.4)] z-10 transform hover:-translate-y-2 transition-transform duration-300">
            <div className="mb-6">
              <svg width="40" height="30" viewBox="0 0 32 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.5 26H0V14.5L7.5 0H15L9.5 12H11.5V26ZM31 26H19.5V14.5L27 0H34.5L29 12H31V26Z" fill="#cbd5e1" opacity="0.9"/>
              </svg>
            </div>
            <p className="text-white text-lg md:text-xl leading-relaxed font-medium">
              "Une expérience incroyable sur la Seine ! L'organisation, la vue sur les monuments et la qualité du service ont largement dépassé nos attentes."
            </p>
          </div>

          {/* Testimonial Card 2 (Bottom Left) */}
          <div className="absolute bottom-[5%] md:bottom-[10%] left-0 md:left-[5%] lg:left-[10%] bg-white border border-gray-100 rounded-[32px] p-8 md:p-10 max-w-[340px] md:max-w-[420px] shadow-[0_20px_60px_rgba(0,0,0,0.08)] z-10 transform hover:-translate-y-2 transition-transform duration-300 hidden md:block">
            <div className="mb-6">
              <svg width="40" height="30" viewBox="0 0 32 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.5 26H0V14.5L7.5 0H15L9.5 12H11.5V26ZM31 26H19.5V14.5L27 0H34.5L29 12H31V26Z" fill="#1c355e" opacity="0.2"/>
              </svg>
            </div>
            <p className="text-[#1c355e] text-lg md:text-xl leading-relaxed font-bold">
              "Un moment magique ! Les macarons étaient délicieux et pouvoir profiter de l'eSIM dès notre arrivée a rendu notre voyage parfait. Nous reviendrons sans hésiter."
            </p>
          </div>

          {/* Testimonial Card 3 (Middle Left - Accent) */}
          <div className="absolute top-[35%] md:top-[40%] left-[-5%] md:left-[2%] lg:left-[4%] bg-[#FFB800] rounded-[32px] p-6 md:p-8 max-w-[280px] md:max-w-[320px] shadow-[0_20px_50px_rgba(255,184,0,0.3)] z-10 transform hover:-translate-y-2 transition-transform duration-300 hidden lg:block">
            <div className="mb-4">
              <svg width="32" height="24" viewBox="0 0 32 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.5 26H0V14.5L7.5 0H15L9.5 12H11.5V26ZM31 26H19.5V14.5L27 0H34.5L29 12H31V26Z" fill="#ffffff" opacity="0.9"/>
              </svg>
            </div>
            <p className="text-[#1c355e] text-base md:text-lg leading-relaxed font-bold">
              "Le meilleur moyen de visiter Paris sans stress. L'équipe du Captain Boat est au top !"
            </p>
          </div>

        </div>

        {/* Action Button */}
        <Link href="/produits" className="bg-[#1c355e] hover:bg-[#132545] text-white font-bold text-lg px-20 py-5 rounded-full transition-colors shadow-[0_12px_25px_rgba(28,53,94,0.25)] tracking-wider mt-8 hover:-translate-y-1 relative z-20 inline-block">
          RÉSERVER
        </Link>

      </div>
    </section>
  );
}
