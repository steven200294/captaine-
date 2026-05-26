"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { X, Languages, ChevronDown } from "lucide-react";

interface LanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect?: (lang: Language) => void;
}

type Language = {
  code: string;
  label: string;
  flag: string;
  position: string;
};

const LANGUAGES: Language[] = [
  { code: "fr", label: "Français", flag: "fr", position: "top-[5%] left-[8%]" },
  { code: "ma", label: "العربية", flag: "ma", position: "top-[5%] right-[8%]" },
  { code: "en", label: "English", flag: "gb", position: "top-[38%] left-[2%]" },
  { code: "zh", label: "中文", flag: "cn", position: "top-[28%] left-1/2 -translate-x-1/2" },
  { code: "de", label: "Deutsch", flag: "de", position: "bottom-[5%] left-[22%]" },
  { code: "es", label: "Español", flag: "es", position: "bottom-[8%] right-[3%]" },
];

export default function LanguageModal({ isOpen, onClose, onSelect }: LanguageModalProps) {
  const [showList, setShowList] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      setShowList(false);
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSelect = (lang: Language) => {
    onSelect?.(lang);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      {/* Background click to close */}
      <div className="absolute inset-0" onClick={onClose}></div>

      {/* Modal Container */}
      <div className="relative bg-white w-full max-w-[700px] rounded-2xl sm:rounded-3xl border-2 sm:border-4 border-[#1c355e] p-5 pb-8 sm:p-8 sm:pb-12 shadow-2xl flex flex-col items-center mt-16 sm:mt-20">

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#1c355e] hover:bg-[#132545] text-white flex items-center justify-center transition-colors shadow-md z-20"
          aria-label="Fermer"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2.5} />
        </button>

        {/* Logo overlapping top border */}
        <div className="absolute -top-20 sm:-top-32 left-1/2 -translate-x-1/2 w-40 h-40 sm:w-64 sm:h-64 z-10 pointer-events-none">
          <Image
            src="/images/logo/captaine.png"
            alt="The Captain Boat"
            fill
            className="object-contain drop-shadow-2xl"
            priority
          />
        </div>

        {/* Spacer for logo overlap */}
        <div className="w-full h-10 sm:h-16"></div>

        {/* Flags Grid Area */}
        <div className="relative w-full h-[220px] sm:h-[280px] mb-5 sm:mb-6">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleSelect(lang)}
              className={`absolute ${lang.position} w-[64px] h-[64px] sm:w-[90px] sm:h-[90px] rounded-full border-2 sm:border-[3px] border-[#1c355e] overflow-hidden hover:scale-110 active:scale-95 transition-transform shadow-lg bg-white p-1`}
              aria-label={`Choisir ${lang.label}`}
              title={lang.label}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://flagcdn.com/w160/${lang.flag}.png`}
                alt={lang.label}
                className="w-full h-full object-cover rounded-full"
              />
            </button>
          ))}
        </div>

        {/* Text */}
        <h2 className="text-2xl sm:text-[38px] font-black text-[#1c355e] mb-4 sm:mb-6 italic tracking-wider uppercase text-center">
          CHOISIS UNE LANGUE
        </h2>

        {/* LANGUE button with dropdown */}
        <div className="relative w-full max-w-[260px] sm:max-w-[280px]">
          <button
            onClick={() => setShowList((v) => !v)}
            className="w-full bg-[#1c355e] hover:bg-[#132545] text-white font-bold text-base sm:text-xl px-8 sm:px-12 py-3 sm:py-4 rounded-full flex items-center justify-center gap-2 sm:gap-3 transition-colors shadow-lg"
            aria-expanded={showList}
            aria-haspopup="listbox"
          >
            <Languages className="w-5 h-5 sm:w-6 sm:h-6" />
            LANGUE
            <ChevronDown className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform ${showList ? "rotate-180" : ""}`} />
          </button>

          {/* Dropdown list */}
          {showList && (
            <ul
              role="listbox"
              className="absolute left-0 right-0 bottom-full mb-2 bg-white rounded-2xl border-2 border-[#1c355e] shadow-xl overflow-hidden z-30 animate-in fade-in slide-in-from-bottom-2 duration-150"
            >
              {LANGUAGES.map((lang) => (
                <li key={lang.code}>
                  <button
                    onClick={() => handleSelect(lang)}
                    className="w-full flex items-center gap-3 px-5 py-3 hover:bg-gray-100 transition-colors text-left"
                    role="option"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`https://flagcdn.com/w40/${lang.flag}.png`}
                      alt={lang.label}
                      className="w-7 h-7 object-cover rounded-full border border-gray-200"
                    />
                    <span className="font-semibold text-[#1c355e]">{lang.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
