"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  CreditCard,
  Lock,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Clock,
  RefreshCcw,
  CheckCircle2,
  Banknote,
  Check,
} from "lucide-react";
import { useCart } from "@/components/CartContext";

export default function CheckoutPage() {
  const { items, removeFromCart } = useCart();
  const [step, setStep] = useState(1);

  const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
  const total = subtotal;

  const stepLabels = ["PANIER", "INFOS", "PAIEMENT"];

  return (
    <main className="min-h-screen bg-[#f8f9fa] pb-24 pt-8 selection:bg-[#1c355e] selection:text-white font-sans">
      <div className="container mx-auto px-4 lg:px-8 max-w-5xl">

        {/* STEPPER */}
        <div className="flex items-center justify-center mb-12">
          <div className="flex items-center gap-0">
            {stepLabels.map((label, i) => {
              const n = i + 1;
              const done = step > n;
              const active = step === n;
              return (
                <div key={label} className="flex items-center">
                  <div className="flex flex-col items-center gap-2 relative z-10">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-sm transition-colors ${done ? "bg-green-500 text-white" : active ? "bg-[#1c355e] text-white shadow-md" : "bg-white border-2 border-gray-300 text-gray-400"}`}>
                      {done ? <Check className="w-4 h-4" /> : n}
                    </div>
                    <span className={`text-[10px] font-bold tracking-wider absolute -bottom-6 ${active ? "text-[#1c355e]" : done ? "text-green-500" : "text-gray-400"}`}>
                      {label}
                    </span>
                  </div>
                  {i < stepLabels.length - 1 && (
                    <div className={`w-24 md:w-32 h-[2px] transition-colors ${done ? "bg-green-500" : "bg-gray-300"}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 mt-16">

          {/* LEFT COLUMN */}
          <div className="flex-1">

            {/* ÉTAPE 1 — PANIER */}
            {step === 1 && (
              <div className="bg-white rounded-2xl shadow-[0_2px_20px_rgb(0,0,0,0.03)] p-8">
                <h2 className="text-xl font-bold text-[#1c355e] mb-6">Récapitulatif du panier</h2>

                {items.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-sm text-gray-400 mb-4">Votre panier est vide.</p>
                    <Link href="/produits" className="text-[#1c355e] font-bold hover:underline text-sm">
                      Voir les offres →
                    </Link>
                  </div>
                ) : (
                  <>
                    <div className="space-y-6">
                      {items.map((item, index) => (
                        <div key={item.id}>
                          <div className="flex gap-4 items-center">
                            <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                              <Image src={item.product.mainImage} alt={item.product.title} fill className="object-cover" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-bold text-[#1c355e] text-base leading-snug">{item.product.title}</h3>
                              <p className="text-sm text-gray-500 mt-1">
                                {item.passengers} passager{item.passengers > 1 ? "s" : ""}
                                {item.date ? ` • ${item.date}` : ""}
                                {item.time ? `, ${item.time}` : ""}
                              </p>
                            </div>
                            <div className="text-right flex flex-col items-end gap-2">
                              <span className="font-medium text-gray-900 text-lg">{item.totalPrice.toFixed(2).replace(".", ",")}€</span>
                              <button onClick={() => removeFromCart(item.id)} className="text-[10px] font-bold text-red-500 uppercase tracking-wider hover:underline">
                                RETIRER
                              </button>
                            </div>
                          </div>
                          {index < items.length - 1 && <div className="h-px bg-gray-100 w-full mt-6" />}
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => setStep(2)}
                      className="mt-8 w-full bg-[#1c355e] hover:bg-[#152846] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
                    >
                      Continuer vers les infos
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            )}

            {/* ÉTAPE 2 — INFOS CLIENT */}
            {step === 2 && (
              <div className="bg-white rounded-2xl shadow-[0_2px_20px_rgb(0,0,0,0.03)] p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-[#1c355e]">Informations client</h2>
                  <span className="bg-[#f0f4ff] text-[#1c355e] text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">Étape 2/3</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">PRÉNOM</label>
                    <input type="text" placeholder="Jean" className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#1c355e] focus:ring-1 focus:ring-[#1c355e] transition-colors text-gray-900" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">NOM</label>
                    <input type="text" placeholder="Dupont" className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#1c355e] focus:ring-1 focus:ring-[#1c355e] transition-colors text-gray-900" />
                  </div>
                </div>
                <div className="mb-6">
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">E-MAIL DE CONFIRMATION</label>
                  <input type="email" placeholder="jean.dupont@email.com" className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#1c355e] focus:ring-1 focus:ring-[#1c355e] transition-colors text-gray-900" />
                </div>
                <div className="mb-8">
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">TÉLÉPHONE (optionnel)</label>
                  <input type="tel" placeholder="+33 6 00 00 00 00" className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#1c355e] focus:ring-1 focus:ring-[#1c355e] transition-colors text-gray-900" />
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setStep(1)} className="flex items-center gap-2 border border-gray-200 text-gray-600 font-bold py-4 px-6 rounded-xl hover:bg-gray-50 transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    Retour
                  </button>
                  <button onClick={() => setStep(3)} className="flex-1 bg-[#1c355e] hover:bg-[#152846] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors">
                    Continuer vers le paiement
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ÉTAPE 3 — PAIEMENT */}
            {step === 3 && (
              <div className="bg-white rounded-2xl shadow-[0_2px_20px_rgb(0,0,0,0.03)] p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-[#1c355e]">Paiement</h2>
                  <ShieldCheck className="w-6 h-6 text-[#1c355e]" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  <button className="bg-black text-white rounded-lg py-3.5 flex items-center justify-center gap-1.5 hover:bg-gray-900 transition-colors border border-black shadow-sm">
                    <svg width="18" height="22" viewBox="0 0 384 512" fill="white" xmlns="http://www.w3.org/2000/svg">
                      <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
                    </svg>
                    <span className="font-semibold text-[16px] tracking-wide">Pay</span>
                  </button>
                  <button className="bg-[#f8f9fa] border border-gray-200 text-gray-700 rounded-lg py-3.5 flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors shadow-sm">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    <span className="font-semibold text-[15px]">Pay</span>
                  </button>
                  <button className="bg-white border border-gray-200 text-[#1677FF] rounded-lg py-3 flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors shadow-sm font-bold text-[15px]">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path d="M19.695 15.07c3.426 1.158 4.203 1.22 4.203 1.22V3.846c0-2.124-1.705-3.845-3.81-3.845H3.914C1.808.001.102 1.722.102 3.846v16.31c0 2.123 1.706 3.845 3.813 3.845h16.173c2.105 0 3.81-1.722 3.81-3.845v-.157s-6.19-2.602-9.315-4.119c-2.096 2.602-4.8 4.181-7.607 4.181-4.75 0-6.361-4.19-4.112-6.949.49-.602 1.324-1.175 2.617-1.497 2.025-.502 5.247.313 8.266 1.317a16.796 16.796 0 0 0 1.341-3.302H5.781v-.952h4.799V6.975H4.77v-.953h5.81V3.591s0-.409.411-.409h2.347v2.84h5.744v.951h-5.744v1.704h4.69a19.453 19.453 0 0 1-1.986 5.06c1.424.52 2.702 1.011 3.654 1.333m-13.81-2.032c-.596.06-1.71.325-2.321.869-1.83 1.608-.735 4.55 2.968 4.55 2.151 0 4.301-1.388 5.99-3.61-2.403-1.182-4.438-2.028-6.637-1.809"/>
                    </svg>
                    Alipay
                  </button>
                  <button className="bg-white border border-gray-200 text-[#07C160] rounded-lg py-3 flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors shadow-sm font-bold text-[15px]">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 0 1 .598.082l1.584.926a.272.272 0 0 0 .14.047c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 0 1-.023-.156.49.49 0 0 1 .201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-6.656-6.088V8.89c-.135-.01-.27-.027-.407-.03zm-2.53 3.274c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.969-.982z"/>
                    </svg>
                    WeChat Pay
                  </button>
                  <button className="bg-white border border-gray-200 text-[#1c355e] rounded-lg py-3 flex items-center justify-center gap-2.5 hover:bg-gray-50 transition-colors shadow-sm font-bold text-[15px]">
                    <svg width="24" height="15" viewBox="0 0 45 30" xmlns="http://www.w3.org/2000/svg" className="mt-0.5">
                      <path d="M12 0 L24 0 L12 30 L0 30 Z" fill="#D32F2F" />
                      <path d="M22 0 L34 0 L22 30 L10 30 Z" fill="#1976D2" opacity="0.9" />
                      <path d="M33 0 L45 0 L33 30 L21 30 Z" fill="#00796B" opacity="0.9" />
                    </svg>
                    UnionPay
                  </button>
                  <button className="bg-white border border-gray-200 text-[#0055A4] rounded-lg py-3 flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors shadow-sm font-bold text-[15px]">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="11" fill="#0055A4"/>
                      <path d="M7 13.5C7.5 12 9.5 11 12 11C14.5 11 16.5 12 17 13.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M8.5 9C9 8 10.5 7.5 12 7.5C13.5 7.5 15 8 15.5 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    ANCV Connect
                  </button>
                </div>

                <div className="flex items-center gap-4 mb-8">
                  <div className="flex-1 h-px bg-gray-200" />
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">OU CARTE DE CRÉDIT</span>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>

                <div className="space-y-4 mb-8">
                  <div className="border border-gray-200 rounded-lg p-5 focus-within:border-[#1c355e] focus-within:ring-1 focus-within:ring-[#1c355e] transition-all relative">
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">NUMÉRO DE CARTE</label>
                    <input type="text" placeholder="•••• •••• •••• ••••" className="w-full text-xl tracking-[0.2em] text-gray-900 focus:outline-none placeholder:text-gray-300 font-mono" />
                    <div className="absolute top-5 right-5 flex gap-1.5">
                      <div className="w-10 h-6 bg-gray-100 rounded border border-gray-200 flex items-center justify-center"><CreditCard className="w-4 h-4 text-gray-400" /></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="border border-gray-200 rounded-lg p-5 focus-within:border-[#1c355e] focus-within:ring-1 focus-within:ring-[#1c355e] transition-all">
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">EXPIRATION</label>
                      <input type="text" placeholder="MM / AA" className="w-full text-sm text-gray-900 focus:outline-none placeholder:text-gray-300" />
                    </div>
                    <div className="border border-gray-200 rounded-lg p-5 focus-within:border-[#1c355e] focus-within:ring-1 focus-within:ring-[#1c355e] transition-all">
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">CVV</label>
                      <input type="text" placeholder="•••" className="w-full text-sm text-gray-900 focus:outline-none placeholder:text-gray-300" />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setStep(2)} className="flex items-center gap-2 border border-gray-200 text-gray-600 font-bold py-4 px-6 rounded-xl hover:bg-gray-50 transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    Retour
                  </button>
                  <button className="flex-1 bg-[#FFB800] hover:bg-[#e6a600] text-[#1c355e] font-extrabold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors">
                    CONFIRMER & PAYER
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex justify-center items-center gap-2 text-[10px] text-gray-400 uppercase tracking-[0.2em] font-bold mt-4">
                  <Lock className="w-3.5 h-3.5" />
                  TRANSACTION CHIFFRÉE 256-BIT
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN — toujours visible */}
          <div className="w-full lg:w-[380px] flex-shrink-0 space-y-6 lg:sticky lg:top-24 lg:self-start">

            {/* SUMMARY CARD */}
            <div className="bg-[#1c355e] rounded-2xl p-8 text-white relative overflow-hidden shadow-xl">
              <Banknote className="absolute -right-8 -top-8 w-40 h-40 text-white opacity-5" />
              <div className="relative z-10">
                <p className="text-[10px] font-bold text-blue-300 uppercase tracking-widest mb-2">TOTAL À PAYER</p>
                <div className="text-5xl font-black mb-1">{total.toFixed(2).replace(".", ",")}€</div>
                <p className="text-sm text-blue-300 mb-8 font-medium">~ ${(total * 1.08).toFixed(2)} USD</p>

                <div className="mb-8">
                  <label className="block text-[10px] font-bold text-blue-300 uppercase tracking-widest mb-3">CODE PROMO</label>
                  <div className="flex gap-2">
                    <input type="text" placeholder="Entrez votre code" className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-sm text-white placeholder:text-blue-300 focus:outline-none focus:border-white/40 transition-colors" />
                    <button className="bg-[#FFB800] hover:bg-[#e6a600] text-[#1c355e] text-xs font-bold px-5 py-3 rounded-lg transition-colors">APPLIQUER</button>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-blue-100">Sous-total</span>
                    <span>{subtotal.toFixed(2).replace(".", ",")}€</span>
                  </div>
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-blue-100">TVA (20%)</span>
                    <span>Incluse</span>
                  </div>
                </div>

                <div className="border-t border-white/10 pt-5 flex justify-between items-center">
                  <span className="text-base font-medium">Total final</span>
                  <span className="text-xl font-bold">{total.toFixed(2).replace(".", ",")}€</span>
                </div>
              </div>
            </div>

            {/* TRUST BADGES */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl p-5 shadow-[0_2px_15px_rgb(0,0,0,0.03)] border border-gray-100">
                <CheckCircle2 className="w-6 h-6 text-[#1c355e] mb-3" />
                <p className="text-[10px] font-bold text-gray-900 uppercase tracking-widest mb-1">OFFICIEL</p>
                <p className="text-[11px] text-gray-500 font-medium">Revendeur agréé direct</p>
              </div>
              <div className="bg-white rounded-2xl p-5 shadow-[0_2px_15px_rgb(0,0,0,0.03)] border border-gray-100">
                <RefreshCcw className="w-6 h-6 text-[#1c355e] mb-3" />
                <p className="text-[10px] font-bold text-gray-900 uppercase tracking-widest mb-1">FLEXIBLE</p>
                <p className="text-[11px] text-gray-500 font-medium">Annulation gratuite 24h</p>
              </div>
            </div>

            {/* AVAILABILITY ALERT */}
            <div className="bg-[#ffebee] border border-[#ffcdd2] rounded-2xl p-5 flex gap-4 items-center shadow-sm">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-red-600 uppercase tracking-widest mb-1">DISPONIBILITÉ LIMITÉE</p>
                <p className="text-sm text-red-500 font-medium leading-snug">Seulement 4 places restantes pour cette date.</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
