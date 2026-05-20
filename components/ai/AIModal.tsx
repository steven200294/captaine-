"use client";

import { useEffect, useState } from "react";
import { X, MessageCircle, Send } from "lucide-react";
import Image from "next/image";

interface AIModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Message = {
  role: "ai" | "user";
  text: string;
};

const SUGGESTIONS = [
  "Quelle croisière me recommandes-tu ?",
  "Y a-t-il des macarons à bord ?",
  "Combien dure une croisière ?",
  "Comment réserver ?",
];

export default function AIModal({ isOpen, onClose }: AIModalProps) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      text: "Bonjour ! Je suis le Capitaine IA de The Captain Boat ⚓️ Comment puis-je t'aider à organiser ta croisière sur la Seine ?",
    },
  ]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
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

  const handleSend = (text?: string) => {
    const content = (text ?? input).trim();
    if (!content) return;
    setMessages((m) => [
      ...m,
      { role: "user", text: content },
      { role: "ai", text: "Merci pour ta question ! (Cette démo n'est pas encore connectée à l'IA — réponse à venir)" },
    ]);
    setInput("");
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center p-0 sm:p-6 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white w-full sm:w-[640px] lg:w-[720px] h-[85vh] sm:h-[80vh] sm:max-h-[760px] rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom sm:zoom-in-95 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-[#1c355e] to-[#2d4f87] text-white">
          <div className="flex items-center gap-3">
            <div className="relative w-11 h-11 rounded-full overflow-hidden bg-white shadow-md flex-shrink-0">
              <Image src="/images/sailor-avatar.png" alt="Capitaine IA" fill className="object-cover" />
            </div>
            <div>
              <h2 className="font-bold text-base leading-none">Capitaine IA</h2>
              <p className="text-xs text-white/70 mt-1.5 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                En ligne
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/15 transition-colors"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" strokeWidth={2} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-5 bg-[#f8f9fc] flex flex-col gap-4">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-2.5 max-w-[85%] sm:max-w-[80%] ${msg.role === "ai" ? "self-start" : "self-end flex-row-reverse"}`}>
              {msg.role === "ai" && (
                <div className="relative w-8 h-8 rounded-full overflow-hidden flex-shrink-0 border border-gray-200 mt-1 shadow-sm">
                  <Image src="/images/sailor-avatar.png" alt="Capitaine IA" fill className="object-cover" />
                </div>
              )}
              <div
                className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === "ai"
                    ? "bg-white text-[#1c2b4c] rounded-tl-sm shadow-sm border border-gray-100"
                    : "bg-[#1c355e] text-white rounded-tr-sm shadow-sm"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {/* Suggestions (only show if just the initial message) */}
          {messages.length === 1 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => handleSend(s)}
                  className="text-xs font-medium text-[#1c355e] bg-white border border-[#1c355e]/20 hover:bg-[#1c355e] hover:text-white transition-colors px-3 py-2 rounded-full"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Input */}
        <div className="border-t border-gray-200 bg-white px-3 py-3 flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Pose ta question…"
            className="flex-1 bg-[#f1f5f9] text-sm text-[#1c2b4c] placeholder:text-gray-400 px-4 py-3 rounded-full outline-none focus:ring-2 focus:ring-[#1c355e]/30"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim()}
            className="w-11 h-11 rounded-full bg-[#1c355e] hover:bg-[#132545] disabled:bg-gray-300 text-white flex items-center justify-center transition-colors flex-shrink-0"
            aria-label="Envoyer"
          >
            <Send className="w-4 h-4" strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
}
