"use client";

import { Minus, Plus, Trash2, CreditCard } from "lucide-react";

export interface CartItem {
  slug: string;
  title: string;
  adultCount: number;
  childCount: number;
  adultPrice: number;
  childPrice: number;
  isFlat?: boolean;
}

export function getItemTotal(item: CartItem): number {
  if (item.isFlat) return item.adultPrice * item.adultCount;
  return item.adultCount * item.adultPrice + item.childCount * item.childPrice;
}

export function getCartTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + getItemTotal(item), 0);
}

interface ChatCartProps {
  items: CartItem[];
  onUpdateItem: (slug: string, field: "adultCount" | "childCount", delta: number) => void;
  onRemoveItem: (slug: string) => void;
  onCheckout: () => void;
}

export default function ChatCart({ items, onUpdateItem, onRemoveItem, onCheckout }: ChatCartProps) {
  if (items.length === 0) return null;

  const total = getCartTotal(items);

  return (
    <div className="mt-2 mb-1 w-full rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      <div className="px-3 py-2.5 bg-[#1c355e] text-white">
        <h4 className="text-xs font-bold uppercase tracking-wide">Mon panier</h4>
      </div>

      <div className="divide-y divide-gray-100">
        {items.map((item) => {
          const itemTotal = getItemTotal(item);

          if (item.isFlat) {
            return (
              <div key={item.slug} className="px-3 py-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#1c355e] truncate">{item.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">Forfait tout compris</p>
                    <p className="text-xs text-gray-400 mt-0.5">{itemTotal}€</p>
                  </div>
                  <button
                    onClick={() => onRemoveItem(item.slug)}
                    className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                    aria-label="Supprimer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-600">Quantite</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onUpdateItem(item.slug, "adultCount", -1)}
                      disabled={item.adultCount <= 1}
                      className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center disabled:opacity-30 hover:bg-gray-50 transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-sm font-bold w-5 text-center">{item.adultCount}</span>
                    <button
                      onClick={() => onUpdateItem(item.slug, "adultCount", 1)}
                      className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          }

          return (
            <div key={item.slug} className="px-3 py-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#1c355e] truncate">{item.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{itemTotal}€</p>
                </div>
                <button
                  onClick={() => onRemoveItem(item.slug)}
                  className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                  aria-label="Supprimer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-gray-600">Adultes ({item.adultPrice}€)</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onUpdateItem(item.slug, "adultCount", -1)}
                    disabled={item.adultCount <= 0}
                    className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center disabled:opacity-30 hover:bg-gray-50 transition-colors"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="text-sm font-bold w-5 text-center">{item.adultCount}</span>
                  <button
                    onClick={() => onUpdateItem(item.slug, "adultCount", 1)}
                    className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between mt-1.5">
                <span className="text-xs text-gray-600">Enfants ({item.childPrice}€)</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onUpdateItem(item.slug, "childCount", -1)}
                    disabled={item.childCount <= 0}
                    className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center disabled:opacity-30 hover:bg-gray-50 transition-colors"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="text-sm font-bold w-5 text-center">{item.childCount}</span>
                  <button
                    onClick={() => onUpdateItem(item.slug, "childCount", 1)}
                    className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Total + CTA */}
      <div className="px-3 py-3 border-t border-gray-200 bg-[#f8f9fc]">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-sm font-bold text-[#1c355e]">Total</span>
          <span className="text-lg font-bold text-[#1c355e]">{total}€</span>
        </div>
        <button
          onClick={onCheckout}
          disabled={total === 0}
          className="w-full flex items-center justify-center gap-2 bg-[#FFB800] hover:bg-[#e6a600] disabled:bg-gray-300 text-[#1c355e] font-bold py-3 rounded-xl transition-colors min-h-[44px]"
        >
          <CreditCard className="w-4 h-4" />
          Payer {total}€
        </button>
      </div>
    </div>
  );
}
