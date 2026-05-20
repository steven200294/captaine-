"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  Trash2,
  Minus,
  Plus,
  Calendar,
  Anchor,
  Lock,
  ShieldCheck,
  ArrowRight,
  ShoppingCart,
} from "lucide-react";
import { useCart } from "@/components/CartContext";
import { PRODUCTS } from "@/lib/products";
import { Star } from "lucide-react";

export default function CartPage() {
  const { items, addToCart, removeFromCart, itemCount } = useCart();
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const slugsInCart = new Set(items.map((i) => i.product.slug));
  const suggestedProducts = PRODUCTS.filter((p) => !slugsInCart.has(p.slug)).slice(0, 3);

  const getQty = (id: string) => quantities[id] ?? 1;
  const setQty = (id: string, v: number) =>
    setQuantities((prev) => ({ ...prev, [id]: Math.max(1, v) }));

  const subtotalHT = items.reduce(
    (sum, item) => sum + item.totalPrice * getQty(item.id),
    0
  );
  const tva = Math.round(subtotalHT * 0.2 * 100) / 100;
  const total = subtotalHT + tva;

  return (
    <main className="min-h-screen bg-white pb-24 pt-8 selection:bg-[#1c355e] selection:text-white">
      <div className="container mx-auto px-4 lg:px-8 max-w-6xl">

        {/* HEADER */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Votre Panier</h1>
          <p className="text-gray-500 text-sm">
            Étape 1 sur 3 — Récapitulatif de votre sélection prestige.
          </p>
        </div>

        {/* EMPTY STATE */}
        {itemCount === 0 && (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <ShoppingCart className="w-8 h-8 text-gray-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Votre panier est vide</h2>
            <p className="text-gray-500 text-sm mb-8">Découvrez nos croisières et ajoutez-les à votre panier.</p>
            <Link
              href="/produits"
              className="bg-[#FFB800] hover:bg-[#e6a600] text-gray-900 font-bold px-8 py-3 rounded-full transition-colors"
            >
              Voir les offres
            </Link>
          </div>
        )}

        {/* MAIN CONTENT */}
        {itemCount > 0 && (
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">

            {/* LEFT COLUMN */}
            <div className="flex-1 space-y-6">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="border border-gray-200 rounded-xl p-4 flex flex-col sm:flex-row gap-6 relative"
                >
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>

                  {/* Image */}
                  <div className="relative w-full sm:w-[220px] h-[200px] flex-shrink-0 rounded-lg overflow-hidden">
                    <Image
                      src={item.product.mainImage}
                      alt={item.product.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex flex-col flex-1 py-1">
                    <div className="mb-2">
                      <span className="inline-block bg-[#FFB800] text-gray-900 text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wide mb-2">
                        {item.product.badge.text}
                      </span>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        {item.product.title}
                      </h2>
                      <p className="text-sm text-gray-500 leading-relaxed pr-8">
                        {item.product.description}
                      </p>
                    </div>

                    {/* Date + Time + Passagers */}
                    <div className="flex flex-wrap gap-3 mt-2 mb-4">
                      {item.date && (
                        <span className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 border border-gray-100 rounded-full px-3 py-1">
                          <Calendar className="w-3 h-3" />
                          {item.date}
                        </span>
                      )}
                      {item.time && (
                        <span className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 border border-gray-100 rounded-full px-3 py-1">
                          {item.time}
                        </span>
                      )}
                      <span className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 border border-gray-100 rounded-full px-3 py-1">
                        {item.passengers} passager{item.passengers > 1 ? "s" : ""}
                      </span>
                    </div>

                    <div className="mt-auto flex items-center justify-between">
                      {/* Quantity */}
                      <div className="flex items-center border border-gray-300 rounded-md">
                        <button
                          onClick={() => setQty(item.id, getQty(item.id) - 1)}
                          className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <div className="w-8 text-center text-sm font-semibold text-gray-900">
                          {getQty(item.id)}
                        </div>
                        <button
                          onClick={() => setQty(item.id, getQty(item.id) + 1)}
                          className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-3xl font-bold text-gray-900">
                        {(item.totalPrice * getQty(item.id)).toFixed(2).replace(".", ",")} €
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* PORT CARD */}
              <div className="border border-gray-200 rounded-xl p-5 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-3">
                  <Anchor className="w-4 h-4 text-gray-900" />
                  <span className="text-xs font-bold text-gray-900 tracking-wider uppercase">
                    PORT DE DÉPART
                  </span>
                </div>
                <div className="text-gray-900 font-medium mb-1">
                  Port de la Bourdonnais, Paris
                </div>
                <button className="text-blue-500 hover:text-blue-700 text-xs text-left w-fit transition-colors">
                  Voir sur la carte
                </button>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="w-full lg:w-[400px] flex-shrink-0">
              <div className="bg-[#f8f9fa] rounded-2xl p-8 sticky top-24">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Récapitulatif</h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Sous-total HT</span>
                    <span className="font-medium text-gray-900">
                      {subtotalHT.toFixed(2).replace(".", ",")} €
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">TVA (20%)</span>
                    <span className="font-medium text-gray-900">
                      {tva.toFixed(2).replace(".", ",")} €
                    </span>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6 mb-8 flex justify-between items-end">
                  <span className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-1">
                    TOTAL TTC
                  </span>
                  <span className="text-4xl font-bold text-gray-900">
                    {total.toFixed(2).replace(".", ",")} €
                  </span>
                </div>

                {/* Promo code */}
                <div className="mb-8">
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                    CODE PROMO
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Entrez votre code"
                      className="flex-1 border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:border-[#1c355e]"
                    />
                    <button className="bg-[#1c355e] hover:bg-[#152846] text-white text-xs font-bold px-6 py-2 rounded-md transition-colors">
                      APPLIQUER
                    </button>
                  </div>
                </div>

                {/* CTA */}
                <Link
                  href="/paiement"
                  className="w-full bg-[#FFB800] hover:bg-[#e6a600] text-gray-900 font-bold py-4 rounded-md flex items-center justify-center gap-2 mb-8 transition-colors"
                >
                  VALIDER MA COMMANDE
                  <ArrowRight className="w-4 h-4" />
                </Link>

                {/* Trust Badges */}
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-white rounded-lg border border-gray-200 flex items-center justify-center flex-shrink-0">
                      <Lock className="w-5 h-5 text-gray-900" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-gray-900 mb-0.5">
                        Paiement 100% Sécurisé
                      </div>
                      <div className="text-[10px] text-gray-500 leading-tight">
                        Protocoles SSL & chiffrement AES-256
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-white rounded-lg border border-gray-200 flex items-center justify-center flex-shrink-0">
                      <ShieldCheck className="w-5 h-5 text-gray-900" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-gray-900 mb-0.5">
                        Garantie Excellence
                      </div>
                      <div className="text-[10px] text-gray-500 leading-tight">
                        Service client premium disponible 24/7
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CROSS-SELL */}
        {itemCount > 0 && suggestedProducts.length > 0 && (
          <div className="mt-24">
            <div className="flex items-center gap-6 mb-8">
              <h2 className="text-3xl font-bold text-gray-900 whitespace-nowrap">
                Complétez votre expérience
              </h2>
              <div className="h-px bg-gray-200 w-full" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {suggestedProducts.map((product) => (
                <div key={product.slug} className="border border-gray-200 rounded-xl overflow-hidden flex flex-col group">
                  <div className="relative h-48 w-full overflow-hidden">
                    <Image
                      src={product.mainImage}
                      alt={product.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className={`absolute top-3 left-3 text-white text-[10px] font-bold px-2 py-1 uppercase rounded-sm ${product.badge.color === "red" ? "bg-[#c3171d]" : "bg-[#28a745]"}`}>
                      {product.badge.text}
                    </div>
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center gap-1 mb-1">
                      <Star className="w-3.5 h-3.5 fill-[#FFB800] text-[#FFB800]" />
                      <span className="text-xs font-bold text-gray-700">{product.rating}</span>
                      <span className="text-xs text-gray-400">({product.reviews.toLocaleString()} avis)</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{product.title}</h3>
                    <p className="text-sm text-gray-500 mb-4 flex-1 leading-relaxed">{product.description}</p>
                    <div className="flex items-center justify-between mt-auto">
                      <div>
                        <span className="font-bold text-gray-900 text-lg">{product.adultNewPrice},00 €</span>
                        <span className="text-sm text-[#c3171d] line-through ml-2">{product.adultOldPrice},00 €</span>
                      </div>
                      <button
                        onClick={() => addToCart({ product, date: "", time: "", passengers: 1, totalPrice: product.adultNewPrice })}
                        className="border border-gray-900 text-gray-900 font-bold text-[10px] uppercase tracking-wider px-4 py-2 hover:bg-gray-900 hover:text-white transition-colors rounded"
                      >
                        AJOUTER
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
