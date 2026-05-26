"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Star, Flame, Users, Clock, ShieldCheck, CheckCircle2 } from "lucide-react";
import { Product } from "@shared/products";
import { useCart } from "@web/contexts/CartContext";

const TIMES = [
  "10:00", "11:00", "12:00", "13:00", "14:00",
  "15:00", "16:00", "17:00", "18:00", "18:30",
  "19:00", "20:00", "21:00", "21:30",
];

const FAKE_BOOKINGS = [
  { name: "Jean-Pierre", city: "Lyon" },
  { name: "Sophie", city: "Bordeaux" },
  { name: "Karim", city: "Marseille" },
  { name: "Emma", city: "Bruxelles" },
  { name: "Lucas", city: "Amsterdam" },
  { name: "Marie", city: "Toulouse" },
  { name: "Ahmed", city: "Londres" },
  { name: "Chloé", city: "Genève" },
];

function useCountdown(initialSeconds: number) {
  const [seconds, setSeconds] = useState(initialSeconds);
  useEffect(() => {
    const interval = setInterval(() => setSeconds(s => s > 0 ? s - 1 : 0), 1000);
    return () => clearInterval(interval);
  }, []);
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

export default function BookingCard({ product }: { product: Product }) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("18:30");
  const [passengers, setPassengers] = useState(1);
  const [viewers, setViewers] = useState(9);
  const [toast, setToast] = useState<{ name: string; city: string } | null>(null);
  const { addToCart } = useCart();
  const router = useRouter();

  const countdown = useCountdown(47 * 60 + 23);
  const bookingsToday = 34;
  const spotsLeft = 4;
  const discount = Math.round((1 - product.adultNewPrice / product.adultOldPrice) * 100);

  // Fluctuation aléatoire du compteur de visiteurs
  useEffect(() => {
    const interval = setInterval(() => {
      setViewers(v => Math.max(6, Math.min(14, v + (Math.random() > 0.5 ? 1 : -1))));
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // Toast de réservation toutes les 25-45 secondes
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const show = () => {
      const booking = FAKE_BOOKINGS[Math.floor(Math.random() * FAKE_BOOKINGS.length)];
      setToast(booking);
      setTimeout(() => setToast(null), 4000);
      timeout = setTimeout(show, 25000 + Math.random() * 20000);
    };
    timeout = setTimeout(show, 8000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden relative">

      {/* Toast notification */}
      <div className={`absolute bottom-full left-0 right-0 mb-3 px-3 transition-all duration-500 z-20 ${toast ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"}`}>
        <div className="bg-white border border-gray-200 rounded-xl shadow-xl px-4 py-3 flex items-center gap-3">
          <div className="w-8 h-8 bg-[#28a745] rounded-full flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-[12px] font-bold text-[#1c2b4c]">{toast?.name} ({toast?.city})</p>
            <p className="text-[11px] text-gray-500">vient de réserver cette offre</p>
          </div>
          <span className="ml-auto text-[10px] text-gray-400 flex-shrink-0">à l'instant</span>
        </div>
      </div>

      {/* Urgency banner */}
      <div className="bg-[#c3171d] px-4 py-2.5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 text-white text-[12px] font-bold">
          <Flame className="w-4 h-4 flex-shrink-0 animate-pulse" />
          Prix réduit expire dans
        </div>
        <div className="bg-white text-[#c3171d] font-black text-[14px] px-3 py-0.5 rounded-md tabular-nums tracking-widest">
          {countdown}
        </div>
      </div>

      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-2">
          <h2 className="text-xl font-bold text-[#1c2b4c] leading-tight flex-1 pr-4">
            {product.title}
          </h2>
          <span className="bg-[#c3171d] text-white text-xs font-bold px-2 py-1 rounded flex-shrink-0">
            -{discount}%
          </span>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          <Star className="w-4 h-4 fill-[#FFB800] text-[#FFB800]" />
          <span className="font-bold text-sm text-[#1c2b4c]">{product.rating}</span>
          <span className="text-xs text-gray-500">({product.reviews.toLocaleString()} avis)</span>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-500 mb-4 leading-relaxed">{product.description}</p>

        <hr className="border-gray-100 mb-4" />

        {/* Price */}
        <div className="flex items-center gap-3 mb-1">
          <span className="text-3xl font-bold text-[#1c2b4c]">{product.adultNewPrice},00 €</span>
          <span className="text-lg text-[#c3171d] line-through font-medium">{product.adultOldPrice},00 €</span>
          <span className="bg-[#1c355e] text-white text-[10px] font-bold px-2 py-1 rounded">OFFRE LIMITÉE</span>
        </div>
        {product.childNewPrice && (
          <p className="text-xs text-gray-400 mb-2">
            Enfant : {product.childNewPrice}€{product.childNote ? ` — ${product.childNote}` : ""}
          </p>
        )}
        {!product.childNewPrice && product.childNote && (
          <p className="text-xs text-gray-400 mb-2">{product.childNote}</p>
        )}

        {/* Social proof */}
        <div className="flex flex-col gap-2 mt-3 mb-4 bg-[#f8f9fc] rounded-xl px-4 py-3">
          <div className="flex items-center gap-2 text-[11px] text-gray-600">
            <span className="relative flex h-2 w-2 flex-shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#f5a623] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#f5a623]" />
            </span>
            <span><strong className="text-[#1c2b4c]">{viewers} personnes</strong> regardent cette offre en ce moment</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-gray-600">
            <Clock className="w-3 h-3 text-[#28a745] flex-shrink-0" />
            <span><strong className="text-[#1c2b4c]">{bookingsToday} réservations</strong> aujourd'hui pour cette offre</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-[#c3171d] font-semibold">
            <Flame className="w-3 h-3 flex-shrink-0" />
            <span>Plus que <strong>{spotsLeft} places</strong> au tarif réduit !</span>
          </div>
        </div>

        <hr className="border-gray-100 mb-4" />

        {/* Date */}
        <div className="mb-4">
          <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
            Date de la croisière
          </label>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-[#1c2b4c] focus:outline-none focus:border-[#1c355e] focus:ring-1 focus:ring-[#1c355e]"
          />
        </div>

        {/* Time + Passengers */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div>
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Heure</label>
            <select value={time} onChange={e => setTime(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-3 text-sm text-[#1c2b4c] focus:outline-none focus:border-[#1c355e] bg-white">
              {TIMES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Passagers</label>
            <select value={passengers} onChange={e => setPassengers(Number(e.target.value))}
              className="w-full border border-gray-200 rounded-lg px-3 py-3 text-sm text-[#1c2b4c] focus:outline-none focus:border-[#1c355e] bg-white">
              {Array.from({ length: 10 }, (_, i) => i + 1).map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={() => {
            addToCart({
              product,
              date,
              time,
              passengers,
              totalPrice: product.adultNewPrice * passengers,
            });
            router.push("/panier");
          }}
          className="w-full bg-[#f5a623] hover:bg-[#e09514] text-white font-bold text-[15px] py-4 rounded-xl transition-colors mb-3 shadow-md shadow-[#f5a623]/20 active:scale-95"
        >
          {product.buttonText ?? "Réserver maintenant"}
        </button>

        <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-400">
          <ShieldCheck className="w-3.5 h-3.5 text-[#28a745]" />
          Annulation gratuite jusqu'à 24h avant
        </div>
      </div>
    </div>
  );
}
