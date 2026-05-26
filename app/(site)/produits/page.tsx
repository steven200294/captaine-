"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Settings2, Star, Clock, MapPin, ChevronDown, X } from "lucide-react";
import { OFFERS } from "@shared/offers";

const OFFER_TYPE_FILTERS = [
  { label: "Croisière Classique", key: "solo" },
  { label: "Pack Combiné",        key: "pack" },
  { label: "Offre eSIM",          key: "esim" },
];

const DURATION_FILTERS = [
  { label: "1h",      key: "1h" },
  { label: "Flexible", key: "flexible" },
];

export default function ProduitsPage() {
  const [selectedTypes, setSelectedTypes]   = useState<string[]>([]);
  const [selectedDuration, setSelectedDuration] = useState<string | null>(null);
  const [maxPrice, setMaxPrice]             = useState(90);
  const [visible, setVisible]              = useState(4);

  const toggleType = (key: string) =>
    setSelectedTypes((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );

  const filtered = OFFERS.filter((offer) => {
    // Prix
    if (offer.adultNewPrice > maxPrice) return false;

    // Durée
    if (selectedDuration && offer.durationKey !== selectedDuration) return false;

    // Type d'offre
    if (selectedTypes.length > 0) {
      const match = selectedTypes.some((key) => {
        if (key === "solo")  return offer.offerTypes.includes("solo");
        if (key === "esim")  return offer.offerTypes.includes("esim");
        if (key === "pack")  return offer.isPack === true || (offer.offerTypes.includes("esim") && offer.offerTypes.includes("macarons"));
        return false;
      });
      if (!match) return false;
    }

    return true;
  });

  const hasFilters = selectedTypes.length > 0 || selectedDuration !== null || maxPrice < 90;

  const resetFilters = () => {
    setSelectedTypes([]);
    setSelectedDuration(null);
    setMaxPrice(90);
    setVisible(4);
  };

  return (
    <main className="min-h-screen bg-[#f8f9fa] pb-24 pt-8 selection:bg-[#1c355e] selection:text-white font-sans">
      <div className="container mx-auto px-4 lg:px-8 max-w-7xl">

        {/* HEADER */}
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-[#1c355e] mb-4">L'Excellence Navale</h1>
          <p className="text-gray-600 text-lg max-w-2xl font-medium leading-relaxed">
            Découvrez Paris depuis son plus beau boulevard. Des expériences sur-mesure, du classique à l'ultime prestige sur la Seine.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">

          {/* SIDEBAR */}
          <div className="w-full lg:w-[280px] flex-shrink-0 space-y-6">
            <div className="bg-white rounded-2xl shadow-[0_2px_15px_rgb(0,0,0,0.02)] border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <Settings2 className="w-5 h-5 text-gray-700" />
                  <h2 className="font-bold text-gray-900 text-lg">Filtres</h2>
                </div>
                {hasFilters && (
                  <button
                    onClick={resetFilters}
                    className="flex items-center gap-1 text-[11px] font-bold text-[#c3171d] hover:underline"
                  >
                    <X className="w-3 h-3" /> Réinitialiser
                  </button>
                )}
              </div>

              {/* TYPE D'OFFRE */}
              <div className="mb-8">
                <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">TYPE D'OFFRE</h3>
                <div className="space-y-3">
                  {OFFER_TYPE_FILTERS.map(({ label, key }) => {
                    const active = selectedTypes.includes(key);
                    return (
                      <label key={key} className="flex items-center gap-3 cursor-pointer group" onClick={() => toggleType(key)}>
                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${active ? "border-[#1c355e] bg-[#1c355e]" : "border-gray-300 group-hover:border-[#1c355e]"}`}>
                          {active && (
                            <svg width="10" height="8" viewBox="0 0 12 10" fill="none">
                              <path d="M1 5L4.5 8.5L11 1.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          )}
                        </div>
                        <span className={`text-sm font-medium transition-colors ${active ? "text-[#1c355e] font-semibold" : "text-gray-600 group-hover:text-gray-900"}`}>{label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* BUDGET */}
              <div className="mb-8">
                <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">BUDGET</h3>
                <div className="px-1">
                  <input
                    type="range"
                    min={15}
                    max={90}
                    value={maxPrice}
                    onChange={(e) => { setMaxPrice(Number(e.target.value)); setVisible(4); }}
                    className="w-full accent-[#1c355e] cursor-pointer"
                  />
                  <div className="flex justify-between items-center text-xs font-bold text-[#1c355e] mt-2">
                    <span>15 €</span>
                    <span className="bg-[#1c355e] text-white px-2 py-0.5 rounded-full text-[10px]">max {maxPrice} €</span>
                    <span>90 €</span>
                  </div>
                </div>
              </div>

              {/* DURÉE */}
              <div className="mb-8">
                <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">DURÉE</h3>
                <div className="flex flex-wrap gap-2">
                  {DURATION_FILTERS.map(({ label, key }) => {
                    const active = selectedDuration === key;
                    return (
                      <button
                        key={key}
                        onClick={() => { setSelectedDuration(active ? null : key); setVisible(4); }}
                        className={`border text-xs font-bold px-4 py-2 rounded-lg transition-colors ${active ? "bg-[#1c355e] text-white border-[#1c355e]" : "border-gray-200 text-gray-700 hover:border-[#1c355e]"}`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* LANGUES */}
              <div>
                <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">LANGUES</h3>
                <div className="flex gap-2">
                  <button className="flex-1 border border-[#1c355e] bg-[#f0f4ff] text-[#1c355e] text-xs font-bold px-4 py-2.5 rounded-lg">🇫🇷 FR</button>
                  <button className="flex-1 border border-[#1c355e] bg-[#f0f4ff] text-[#1c355e] text-xs font-bold px-4 py-2.5 rounded-lg">🇬🇧 EN</button>
                </div>
                <p className="text-[10px] text-gray-400 mt-2 text-center">Toutes nos offres sont disponibles en FR & EN</p>
              </div>
            </div>

            {/* VIP CARD */}
            <div className="bg-gradient-to-br from-[#1c355e] to-[#0f1f3a] rounded-2xl p-6 text-white relative overflow-hidden shadow-lg border border-[#2a4a7f]">
              <div className="relative z-10">
                <span className="bg-[#FFB800] text-[#1c355e] text-[10px] font-black px-2 py-1 rounded uppercase tracking-wider mb-4 inline-block">VIP</span>
                <h3 className="text-xl font-bold mb-2">Évènement Privé ?</h3>
                <p className="text-blue-200 text-sm mb-6 font-medium leading-relaxed">
                  Louez un bateau entier pour vos moments inoubliables sur la Seine.
                </p>
                <button className="w-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold py-3 rounded-lg transition-colors text-sm">
                  Devis Express
                </button>
              </div>
            </div>
          </div>

          {/* PRODUCT GRID */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm font-bold text-gray-500">
                <span className="text-[#1c355e] text-lg">{filtered.length}</span> offre{filtered.length !== 1 ? "s" : ""} trouvée{filtered.length !== 1 ? "s" : ""}
              </p>
            </div>

            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-32 text-center">
                <p className="text-4xl mb-4">🔍</p>
                <p className="text-xl font-bold text-[#1c355e] mb-2">Aucune offre trouvée</p>
                <p className="text-sm text-gray-500 mb-6">Essayez de modifier vos filtres.</p>
                <button onClick={resetFilters} className="bg-[#1c355e] text-white font-bold px-6 py-3 rounded-full text-sm hover:bg-[#152846] transition-colors">
                  Réinitialiser les filtres
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filtered.slice(0, visible).map((offer) => {
                    const discount = Math.round((1 - offer.adultNewPrice / offer.adultOldPrice) * 100);
                    return (
                      <div key={offer.slug} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-[0_2px_15px_rgb(0,0,0,0.03)] hover:shadow-lg transition-shadow group flex flex-col">
                        <div className="relative h-56 w-full overflow-hidden">
                          <Image src={offer.image} alt={offer.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                          <div className="absolute top-4 left-4">
                            <span className={`text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-md ${offer.badge.color === "red" ? "bg-[#c3171d]" : "bg-[#1c355e]"}`}>
                              {offer.badge.text}
                            </span>
                          </div>
                        </div>

                        <div className="p-6 flex flex-col flex-1">
                          <div className="flex justify-between items-center mb-3 text-xs font-bold text-gray-500">
                            <div className="flex items-center gap-1.5">
                              <Star className="w-3.5 h-3.5 text-[#FFB800] fill-[#FFB800]" />
                              <span className="text-gray-900">{offer.rating}</span>
                              <span className="font-medium">({offer.reviews.toLocaleString()} avis)</span>
                            </div>
                            <div className="flex items-center gap-1.5 font-medium">
                              <Clock className="w-3.5 h-3.5" />
                              {offer.duration}
                            </div>
                          </div>

                          <h3 className="text-xl font-bold text-[#1c355e] mb-2 leading-tight">{offer.title}</h3>
                          <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-4 font-medium">
                            <MapPin className="w-3.5 h-3.5" />
                            {offer.location}
                          </div>
                          <p className="text-sm text-gray-600 leading-relaxed mb-6 flex-1">{offer.description}</p>

                          <div className="mt-auto">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm font-bold text-red-500 line-through">{offer.adultOldPrice},00 €</span>
                              {discount > 0 && (
                                <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded">-{discount}%</span>
                              )}
                            </div>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-3xl font-black text-[#1c355e]">{offer.adultNewPrice},00 €</span>
                              <Link href={`/produits/${offer.slug}`} className="bg-[#FFB800] hover:bg-[#e6a600] text-[#1c355e] font-bold px-6 py-3 rounded-xl transition-colors text-sm shadow-sm">
                                RÉSERVER
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {visible < filtered.length && (
                  <div className="mt-12 flex justify-center">
                    <button
                      onClick={() => setVisible(filtered.length)}
                      className="bg-white border border-gray-200 text-[#1c355e] font-bold py-3.5 px-8 rounded-full shadow-sm hover:bg-gray-50 flex items-center gap-2 text-xs uppercase tracking-wider transition-colors"
                    >
                      VOIR PLUS D'OFFRES
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
