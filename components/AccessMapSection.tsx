import { MapPin, Train, Bus, Car } from "lucide-react";

export default function AccessMapSection() {
  return (
    <section className="bg-[#f8f9fa] py-24">
      <div className="container mx-auto px-4 lg:px-8 max-w-[1200px]">

        {/* Section Title */}
        <h2 className="text-[40px] md:text-5xl font-medium text-center text-[#1c2b4c] mb-16 tracking-tight">
          Plan d'Accès
        </h2>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-stretch">

          {/* Map Column */}
          <div className="flex-1 w-full min-h-[400px] lg:min-h-[500px] rounded-[2rem] overflow-hidden shadow-[0_20px_40px_rgba(28,53,94,0.1)] relative">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2624.4988775466856!2d2.3005844768393527!3d48.86395370004561!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e66fd236612df5%3A0xc6fbbfcd23136ab!2sBateaux-Mouches!5e0!3m2!1sfr!2sfr!4v1716164283838!5m2!1sfr!2sfr"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: '400px' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 w-full h-full"
            />
          </div>

          {/* Info Column */}
          <div className="flex-1 bg-white rounded-[2rem] p-8 md:p-10 shadow-[0_20px_40px_rgba(28,53,94,0.1)] border border-gray-100 flex flex-col justify-center">

            <div className="space-y-8">

              {/* Address */}
              <div className="flex items-start gap-4">
                <div className="bg-[#1c355e]/10 p-3 rounded-full flex-shrink-0 mt-1">
                  <MapPin className="w-6 h-6 text-[#1c355e]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#1c2b4c] mb-1">BATEAUX-MOUCHES</h3>
                  <p className="text-gray-600 font-medium">Embarcadère Port de la Conférence</p>
                </div>
              </div>

              {/* Metro */}
              <div className="flex items-start gap-4">
                <div className="bg-[#1c355e]/10 p-3 rounded-full flex-shrink-0 mt-1">
                  <Train className="w-6 h-6 text-[#1c355e]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#1c2b4c] mb-3">Métro (M)</h3>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-gray-800">Alma-Marceau</span>
                      <span className="bg-[#d5c900] text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">9</span>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-gray-500 italic mr-1">Ou</span>
                      <span className="font-semibold text-gray-800">Champs-Elysées Clémenceau</span>
                      <span className="bg-[#ffce00] text-black w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">1</span>
                      <span className="bg-[#8cd1e6] text-black w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">13</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* RER */}
              <div className="flex items-start gap-4">
                <div className="bg-[#1c355e]/10 p-3 rounded-full flex-shrink-0 mt-1">
                  <Train className="w-6 h-6 text-[#1c355e]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#1c2b4c] mb-2">RER (C)</h3>
                  <div className="flex items-center gap-2">
                    <span className="bg-[#fcd946] text-black w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">C</span>
                    <span className="font-semibold text-gray-800">Pont de l'Alma</span>
                  </div>
                </div>
              </div>

              {/* Bus */}
              <div className="flex items-start gap-4">
                <div className="bg-[#1c355e]/10 p-3 rounded-full flex-shrink-0 mt-1">
                  <Bus className="w-6 h-6 text-[#1c355e]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#1c2b4c] mb-2">Bus</h3>
                  <div className="flex flex-wrap gap-2">
                    {["28", "42", "49", "63", "72", "80", "83", "92"].map((num) => (
                      <span key={num} className="bg-gray-100 text-gray-800 px-2 py-1 rounded-md text-sm font-bold border border-gray-200">
                        {num}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Parking */}
              <div className="flex items-start gap-4">
                <div className="bg-[#1c355e]/10 p-3 rounded-full flex-shrink-0 mt-1">
                  <Car className="w-6 h-6 text-[#1c355e]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#1c2b4c] mb-1">Parking (P)</h3>
                  <p className="text-gray-800 font-medium">
                    Parking gratuit sur le quai
                  </p>
                  <p className="text-sm italic text-gray-500 mt-1">
                    (pendant toute la durée de la croisière)
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
