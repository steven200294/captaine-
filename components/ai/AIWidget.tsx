"use client";

import { useState } from "react";
import { MessageCircle } from "lucide-react";
import Image from "next/image";
import AIModal from "./AIModal";

export default function AIWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40 flex flex-col items-center gap-3">
        {/* Tooltip / Label */}
        <div className="relative bg-white text-[#1c2b4c] text-xs font-bold px-4 py-2 rounded-xl shadow-xl border border-gray-100 flex items-center gap-1.5 animate-bounce shadow-[0_10px_30px_rgba(28,53,94,0.15)]">
          Discuter avec
          {/* Triangle pointing down */}
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-b border-r border-gray-100 rotate-45"></div>
        </div>

        <button
          onClick={() => setIsOpen(true)}
          className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white text-white shadow-2xl hover:scale-105 active:scale-95 transition-transform flex items-center justify-center group border-2 border-white ring-4 ring-[#1c355e]/10"
          aria-label="Ouvrir l'assistant IA"
        >
          {/* Pulse halo */}
          <span className="absolute inset-0 rounded-full bg-[#1c355e] opacity-20 animate-ping" />
          
          {/* Avatar */}
          <div className="relative w-full h-full rounded-full overflow-hidden bg-[#f8f9fc]">
            <Image 
              src="/images/sailor-avatar.png" 
              alt="Capitaine IA" 
              fill 
              className="object-cover group-hover:scale-110 transition-transform duration-300" 
            />
          </div>

          {/* Badge Icon */}
          <div className="absolute -top-1 -right-1 bg-[#FFB800] text-white p-1.5 sm:p-2 rounded-full shadow-lg border-2 border-white transform group-hover:-translate-y-1 transition-transform duration-300">
            <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4 text-[#1c355e]" fill="currentColor" />
          </div>
        </button>
      </div>

      <AIModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
