"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { X, Send } from "lucide-react";
import Image from "next/image";
import TypingIndicator from "./TypingIndicator";
import ProductCard from "./ProductCard";
import PromoCard from "./PromoCard";
import ChatCart, { type CartItem } from "./ChatCart";
import ChatPayment from "./ChatPayment";
import ChatTicket from "./ChatTicket";
import WhatsAppButton from "./WhatsAppButton";

interface AIModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SUGGESTIONS = [
  "Quelle croisiere me recommandes-tu ?",
  "Je veux reserver pour 2 adultes",
  "Combien dure une croisiere ?",
  "Quels sont les horaires ?",
];

const PRODUCT_MARKER_RE = /\[PRODUCT:([a-z-]+)\]/g;
const PROMO_MARKER_RE = /\[PROMO:([a-z-]+)\]/g;
const CART_ADD_MARKER_RE = /\[CART_ADD:([a-z-]+):(\d+):(\d+)\]/g;
const CART_SHOW_MARKER_RE = /\[CART_SHOW\]/;
const CHECKOUT_MARKER_RE = /\[CHECKOUT\]/;
const WHATSAPP_MARKER_RE = /\[WHATSAPP\]/;
const TICKET_MARKER_RE = /\[TICKET:(pi_[a-zA-Z0-9_]+)\]/;

type ActionItem =
  | { type: "product"; slug: string }
  | { type: "promo"; slug: string }
  | { type: "cart_add"; slug: string; adults: number; children: number }
  | { type: "cart_show" }
  | { type: "checkout" }
  | { type: "whatsapp" }
  | { type: "ticket"; paymentIntentId: string };

function extractActionsFromText(text: string): ActionItem[] {
  const actions: ActionItem[] = [];
  const seen = new Set<string>();

  for (const match of text.matchAll(CART_ADD_MARKER_RE)) {
    actions.push({ type: "cart_add", slug: match[1], adults: parseInt(match[2], 10), children: parseInt(match[3], 10) });
  }

  if (CART_SHOW_MARKER_RE.test(text)) {
    actions.push({ type: "cart_show" });
  }

  if (CHECKOUT_MARKER_RE.test(text)) {
    actions.push({ type: "checkout" });
  }

  if (WHATSAPP_MARKER_RE.test(text)) {
    actions.push({ type: "whatsapp" });
  }

  const ticketMatch = text.match(TICKET_MARKER_RE);
  if (ticketMatch) {
    actions.push({ type: "ticket", paymentIntentId: ticketMatch[1] });
  }

  for (const match of text.matchAll(PROMO_MARKER_RE)) {
    const slug = match[1];
    if (seen.has(slug)) continue;
    seen.add(slug);
    actions.push({ type: "promo", slug });
  }

  for (const match of text.matchAll(PRODUCT_MARKER_RE)) {
    const slug = match[1];
    if (seen.has(slug)) continue;
    seen.add(slug);
    actions.push({ type: "product", slug });
  }

  return actions;
}

function stripMarkers(text: string): string {
  return text
    .replace(PRODUCT_MARKER_RE, "")
    .replace(PROMO_MARKER_RE, "")
    .replace(CART_ADD_MARKER_RE, "")
    .replace(/\[CART_SHOW\]/g, "")
    .replace(/\[CHECKOUT\]/g, "")
    .replace(/\[WHATSAPP\]/g, "")
    .replace(/\[TICKET:pi_[a-zA-Z0-9_]+\]/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function renderFormattedText(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i} className="font-bold">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      return <em key={i} className="italic">{part.slice(1, -1)}</em>;
    }
    return <span key={i}>{part}</span>;
  });
}

const PRODUCTS_DATA: Record<string, { title: string; price: number; oldPrice: number; image: string; badge: string; description: string; childPrice: number; isFlat?: boolean }> = {
  "croisiere-classique": { title: "La Croisiere Classique", price: 17, oldPrice: 20, childPrice: 8, image: "/images/cards/croisière.jpg", badge: "MEILLEUR PRIX", description: "1h sur la Seine, commentaires audio en 12 langues." },
  "croisiere-macarons": { title: "Croisiere & Macarons Artisanaux", price: 19, oldPrice: 26, childPrice: 8, image: "/images/cards/croisière-macaron.png", badge: "EXPERIENCE GOURMET", description: "Croisiere 1h + coffret macarons artisanaux Makdamia." },
  "croisiere-esim": { title: "Croisiere & eSIM Connect", price: 19, oldPrice: 26, childPrice: 8, image: "/images/cards/esim.png", badge: "MEILLEURE OFFRE", description: "Croisiere 1h + eSIM 3Go Europe/UK 30 jours." },
  "pack-capitaine": { title: "Le Pack Capitaine (Complet)", price: 25, oldPrice: 32, childPrice: 8, image: "/images/cards/macaron-croisière-esim.png", badge: "VENTE FLASH", description: "Croisiere + Macarons + eSIM 3Go. Tout inclus." },
  "pack-family": { title: "Pack Family", price: 65, oldPrice: 90, childPrice: 0, isFlat: true, image: "/images/cards/macaron.png", badge: "OFFRE FAMILLE", description: "2 adultes + 2 enfants + macarons + 2 eSIM." },
  "pack-privilege": { title: "Pack Privilege Expert Paris", price: 28, oldPrice: 34, childPrice: 0, image: "/images/cards/pack-privilege.jpg", badge: "PRIVILEGE", description: "Croisiere 1h + eSIM 10Go Europe/UK." },
};

function getSessionId(): string {
  if (typeof window === "undefined") return "server";
  let id = sessionStorage.getItem("tcb_chat_session");
  if (!id) {
    id = `chat_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    sessionStorage.setItem("tcb_chat_session", id);
  }
  return id;
}

function getTextFromMessage(msg: UIMessage): string {
  return msg.parts
    .filter((p): p is { type: "text"; text: string } => p.type === "text")
    .map((p) => p.text)
    .join("");
}

export default function AIModal({ isOpen, onClose }: AIModalProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState("");
  const [sessionId] = useState(getSessionId);

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  const [processedActions, setProcessedActions] = useState<Set<string>>(new Set());

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
      body: { sessionId },
    }),
    messages: [
      {
        id: "welcome",
        role: "assistant",
        parts: [{ type: "text", text: "Bonjour ! Je suis le Capitaine IA de The Captain Boat. Comment puis-je t'aider a organiser ta croisiere sur la Seine ?" }],
      },
    ],
  });

  const isLoading = status === "streaming" || status === "submitted";

  const handleCartAdd = useCallback((slug: string, adults: number, children: number) => {
    const product = PRODUCTS_DATA[slug];
    if (!product) return;

    const isFlat = product.isFlat || false;
    const effectiveAdults = isFlat ? 1 : adults;
    const effectiveChildren = isFlat ? 0 : children;

    setCartItems((prev) => {
      const existing = prev.find((item) => item.slug === slug);
      if (existing) {
        if (isFlat) return prev;
        return prev.map((item) =>
          item.slug === slug
            ? { ...item, adultCount: item.adultCount + effectiveAdults, childCount: item.childCount + effectiveChildren }
            : item
        );
      }
      return [...prev, {
        slug,
        title: product.title,
        adultCount: effectiveAdults,
        childCount: effectiveChildren,
        adultPrice: product.price,
        childPrice: product.childPrice,
        isFlat,
      }];
    });
  }, []);

  useEffect(() => {
    messages.forEach((msg) => {
      if (msg.role !== "assistant") return;
      const msgId = msg.id;
      if (processedActions.has(msgId)) return;

      const isLastMessage = msg === messages[messages.length - 1];
      const isStreaming = isLoading && isLastMessage;
      if (isStreaming) return;

      const rawText = getTextFromMessage(msg);
      const actions = extractActionsFromText(rawText);

      const hasCartAdd = actions.some((a) => a.type === "cart_add");
      if (hasCartAdd) {
        setProcessedActions((prev) => new Set(prev).add(msgId));
        actions.forEach((action) => {
          if (action.type === "cart_add") {
            handleCartAdd(action.slug, action.adults, action.children);
          }
        });
      }
    });
  }, [messages, isLoading, processedActions, handleCartAdd]);

  const handleUpdateItem = (slug: string, field: "adultCount" | "childCount", delta: number) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.slug !== slug) return item;
        const newValue = item[field] + delta;
        return { ...item, [field]: Math.max(0, newValue) };
      }).filter((item) => item.adultCount > 0 || item.childCount > 0)
    );
  };

  const handleRemoveItem = (slug: string) => {
    setCartItems((prev) => prev.filter((item) => item.slug !== slug));
  };

  const handleCheckout = () => {
    setShowCheckout(true);
  };

  const handlePaymentSuccess = (piId: string) => {
    setPaymentIntentId(piId);
    setShowCheckout(false);
    setCartItems([]);
  };

  const handlePaymentCancel = () => {
    setShowCheckout(false);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading, showCheckout, paymentIntentId]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSend = () => {
    const text = inputValue.trim();
    if (!text || isLoading) return;
    setInputValue("");
    sendMessage({ text });
  };

  const handleSuggestion = (text: string) => {
    if (isLoading) return;
    sendMessage({ text });
  };

  return (
    <div className="fixed inset-0 z-110 flex items-end sm:items-center justify-center p-0 sm:p-6 animate-in fade-in duration-200">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white w-full sm:w-[640px] lg:w-[720px] h-[85vh] sm:h-[80vh] sm:max-h-[760px] rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom sm:zoom-in-95 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-linear-to-r from-[#1c355e] to-[#2d4f87] text-white">
          <div className="flex items-center gap-3">
            <div className="relative w-11 h-11 rounded-full overflow-hidden bg-white shadow-md shrink-0">
              <Image src="/images/sailor-avatar.png" alt="Capitaine IA" fill className="object-cover" />
            </div>
            <div>
              <h2 className="font-bold text-base leading-none">Capitaine IA</h2>
              <p className="text-xs text-white/70 mt-1.5 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
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
          {messages.map((msg, idx) => {
            const isAi = msg.role === "assistant";
            const rawText = getTextFromMessage(msg);
            const cleanText = isAi ? stripMarkers(rawText) : rawText;
            const isLastMessage = idx === messages.length - 1;
            const isStreaming = isLoading && isLastMessage && isAi;
            const actions = (isAi && !isStreaming) ? extractActionsFromText(rawText) : [];

            const showCart = actions.some((a) => a.type === "cart_show");
            const showCheckoutAction = actions.some((a) => a.type === "checkout");
            const showWhatsApp = actions.some((a) => a.type === "whatsapp");
            const ticketAction = actions.find((a) => a.type === "ticket");

            return (
              <div key={msg.id} className="flex flex-col gap-1">
                <div className={`flex gap-2.5 max-w-[85%] sm:max-w-[80%] ${isAi ? "self-start" : "self-end flex-row-reverse"}`}>
                  {isAi && (
                    <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0 border border-gray-200 mt-1 shadow-sm">
                      <Image src="/images/sailor-avatar.png" alt="Capitaine IA" fill className="object-cover" />
                    </div>
                  )}
                  <div
                    className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                      isAi
                        ? "bg-white text-[#1c2b4c] rounded-tl-sm shadow-sm border border-gray-100"
                        : "bg-[#1c355e] text-white rounded-tr-sm shadow-sm"
                    }`}
                  >
                    {isAi ? renderFormattedText(cleanText) : cleanText}
                  </div>
                </div>

                {/* Inline actions */}
                {actions.length > 0 && (
                  <div className="ml-10 max-w-[85%] sm:max-w-[80%]">
                    {actions.map((action, aIdx) => {
                      if (action.type === "product") {
                        const p = PRODUCTS_DATA[action.slug];
                        if (!p) return null;
                        return (
                          <ProductCard
                            key={`product-${action.slug}-${aIdx}`}
                            slug={action.slug}
                            title={p.title}
                            price={p.price}
                            oldPrice={p.oldPrice}
                            image={p.image}
                            badge={p.badge}
                            description={p.description}
                          />
                        );
                      }
                      if (action.type === "promo") {
                        const p = PRODUCTS_DATA[action.slug];
                        if (!p) return null;
                        return (
                          <PromoCard
                            key={`promo-${action.slug}-${aIdx}`}
                            slug={action.slug}
                            title={p.title}
                            discount={p.oldPrice - p.price}
                            originalPrice={p.oldPrice}
                            currentPrice={p.price}
                            badge={p.badge}
                          />
                        );
                      }
                      return null;
                    })}

                    {showCart && cartItems.length > 0 && (
                      <ChatCart
                        items={cartItems}
                        onUpdateItem={handleUpdateItem}
                        onRemoveItem={handleRemoveItem}
                        onCheckout={handleCheckout}
                      />
                    )}

                    {showCheckoutAction && !showCheckout && !paymentIntentId && (
                      <ChatCart
                        items={cartItems}
                        onUpdateItem={handleUpdateItem}
                        onRemoveItem={handleRemoveItem}
                        onCheckout={handleCheckout}
                      />
                    )}

                    {showWhatsApp && <WhatsAppButton />}

                    {ticketAction && ticketAction.type === "ticket" && (
                      <ChatTicket paymentIntentId={ticketAction.paymentIntentId} />
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {/* Checkout overlay */}
          {showCheckout && cartItems.length > 0 && (
            <div className="ml-10 max-w-[85%] sm:max-w-[80%] self-start">
              <ChatPayment
                items={cartItems}
                onSuccess={handlePaymentSuccess}
                onCancel={handlePaymentCancel}
              />
            </div>
          )}

          {/* Ticket after payment */}
          {paymentIntentId && (
            <div className="ml-10 max-w-[85%] sm:max-w-[80%] self-start">
              <ChatTicket paymentIntentId={paymentIntentId} />
            </div>
          )}

          {/* Typing indicator */}
          {isLoading && (
            <div className="flex gap-2.5 self-start max-w-[85%]">
              <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0 border border-gray-200 mt-1 shadow-sm">
                <Image src="/images/sailor-avatar.png" alt="Capitaine IA" fill className="object-cover" />
              </div>
              <div className="bg-white rounded-2xl rounded-tl-sm shadow-sm border border-gray-100">
                <TypingIndicator />
              </div>
            </div>
          )}

          {/* Suggestions */}
          {messages.length <= 1 && !isLoading && (
            <div className="flex flex-wrap gap-2 mt-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => handleSuggestion(s)}
                  className="text-xs font-medium text-[#1c355e] bg-white border border-[#1c355e]/20 hover:bg-[#1c355e] hover:text-white transition-colors px-3 py-2 rounded-full"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-gray-200 bg-white px-3 py-3 flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            placeholder="Pose ta question..."
            className="flex-1 bg-[#f1f5f9] text-sm text-[#1c2b4c] placeholder:text-gray-400 px-4 py-3 rounded-full outline-none focus:ring-2 focus:ring-[#1c355e]/30"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim() || isLoading}
            className="w-11 h-11 rounded-full bg-[#1c355e] hover:bg-[#132545] disabled:bg-gray-300 text-white flex items-center justify-center transition-colors shrink-0"
            aria-label="Envoyer"
          >
            <Send className="w-4 h-4" strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
}
