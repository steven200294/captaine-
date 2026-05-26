"use client";

import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ArrowLeft,
  Lock,
  ShieldCheck,
  Clock,
  RefreshCcw,
  CheckCircle2,
  Banknote,
  Check,
  Loader2,
} from "lucide-react";
import { useCart } from "@web/contexts/CartContext";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

function CheckoutForm({
  clientSecret,
  amount,
  onSuccess,
  onBack,
}: {
  clientSecret: string;
  amount: number;
  onSuccess: () => void;
  onBack: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    const { error: submitError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/paiement/succes`,
      },
    });

    if (submitError) {
      setError(submitError.message || "Erreur de paiement");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-[#1c355e]">Paiement sécurisé</h2>
        <ShieldCheck className="w-6 h-6 text-[#1c355e]" />
      </div>

      <div className="mb-6">
        <PaymentElement
          options={{
            layout: "tabs",
            business: { name: "The Captain Boat" },
          }}
        />
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 border border-gray-200 text-gray-600 font-bold py-4 px-6 rounded-xl hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour
        </button>
        <button
          type="submit"
          disabled={!stripe || loading}
          className="flex-1 bg-[#FFB800] hover:bg-[#e6a600] disabled:bg-gray-300 text-[#1c355e] font-extrabold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              CONFIRMER & PAYER — {(amount / 100).toFixed(2).replace(".", ",")}€
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </div>

      <div className="flex justify-center items-center gap-2 text-[10px] text-gray-400 uppercase tracking-[0.2em] font-bold mt-4">
        <Lock className="w-3.5 h-3.5" />
        TRANSACTION CHIFFRÉE 256-BIT · STRIPE
      </div>
    </form>
  );
}

export default function CheckoutPage() {
  const { items, removeFromCart, clearCart } = useCart();
  const [step, setStep] = useState(1);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentLoading, setPaymentLoading] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
  const total = subtotal;
  const totalCents = Math.round(total * 100);

  const stepLabels = ["PANIER", "INFOS", "PAIEMENT"];

  const handleCreatePayment = async () => {
    setPaymentLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          firstName: form.firstName,
          lastName: form.lastName,
          phone: form.phone || undefined,
          items: items.map((item) => ({
            productSlug: item.product.slug,
            productTitle: item.product.title,
            adultCount: item.passengers,
            childCount: 0,
            unitPrice: Math.round(item.totalPrice * 100),
            totalPrice: Math.round(item.totalPrice * 100),
            cruiseDate: item.date || null,
            cruiseTime: item.time || null,
            premiumOptions: [],
          })),
        }),
      });

      const data = await res.json();
      if (data.success) {
        setClientSecret(data.data.clientSecret);
        document.cookie = `tcb_email=${encodeURIComponent(form.email)};path=/;max-age=${60 * 60 * 24 * 365}`;
        setStep(3);
      } else {
        alert(data.error || "Erreur lors de la création du paiement");
      }
    } catch {
      alert("Erreur réseau. Veuillez réessayer.");
    } finally {
      setPaymentLoading(false);
    }
  };

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
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-sm transition-colors ${
                        done
                          ? "bg-green-500 text-white"
                          : active
                          ? "bg-[#1c355e] text-white shadow-md"
                          : "bg-white border-2 border-gray-300 text-gray-400"
                      }`}
                    >
                      {done ? <Check className="w-4 h-4" /> : n}
                    </div>
                    <span
                      className={`text-[10px] font-bold tracking-wider absolute -bottom-6 ${
                        active
                          ? "text-[#1c355e]"
                          : done
                          ? "text-green-500"
                          : "text-gray-400"
                      }`}
                    >
                      {label}
                    </span>
                  </div>
                  {i < stepLabels.length - 1 && (
                    <div
                      className={`w-24 md:w-32 h-[2px] transition-colors ${
                        done ? "bg-green-500" : "bg-gray-300"
                      }`}
                    />
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
                <h2 className="text-xl font-bold text-[#1c355e] mb-6">
                  Récapitulatif du panier
                </h2>

                {items.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-sm text-gray-400 mb-4">
                      Votre panier est vide.
                    </p>
                    <Link
                      href="/produits"
                      className="text-[#1c355e] font-bold hover:underline text-sm"
                    >
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
                              <Image
                                src={item.product.mainImage}
                                alt={item.product.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-bold text-[#1c355e] text-base leading-snug">
                                {item.product.title}
                              </h3>
                              <p className="text-sm text-gray-500 mt-1">
                                {item.passengers} passager
                                {item.passengers > 1 ? "s" : ""}
                                {item.date ? ` • ${item.date}` : ""}
                                {item.time ? `, ${item.time}` : ""}
                              </p>
                            </div>
                            <div className="text-right flex flex-col items-end gap-2">
                              <span className="font-medium text-gray-900 text-lg">
                                {item.totalPrice.toFixed(2).replace(".", ",")}€
                              </span>
                              <button
                                onClick={() => removeFromCart(item.id)}
                                className="text-[10px] font-bold text-red-500 uppercase tracking-wider hover:underline"
                              >
                                RETIRER
                              </button>
                            </div>
                          </div>
                          {index < items.length - 1 && (
                            <div className="h-px bg-gray-100 w-full mt-6" />
                          )}
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
                  <h2 className="text-xl font-bold text-[#1c355e]">
                    Informations client
                  </h2>
                  <span className="bg-[#f0f4ff] text-[#1c355e] text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                    Étape 2/3
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                      PRÉNOM
                    </label>
                    <input
                      type="text"
                      placeholder="Jean"
                      value={form.firstName}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, firstName: e.target.value }))
                      }
                      className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#1c355e] focus:ring-1 focus:ring-[#1c355e] transition-colors text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                      NOM
                    </label>
                    <input
                      type="text"
                      placeholder="Dupont"
                      value={form.lastName}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, lastName: e.target.value }))
                      }
                      className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#1c355e] focus:ring-1 focus:ring-[#1c355e] transition-colors text-gray-900"
                    />
                  </div>
                </div>
                <div className="mb-6">
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                    E-MAIL DE CONFIRMATION
                  </label>
                  <input
                    type="email"
                    placeholder="jean.dupont@email.com"
                    value={form.email}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, email: e.target.value }))
                    }
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#1c355e] focus:ring-1 focus:ring-[#1c355e] transition-colors text-gray-900"
                  />
                </div>
                <div className="mb-8">
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                    TÉLÉPHONE (optionnel)
                  </label>
                  <input
                    type="tel"
                    placeholder="+33 6 00 00 00 00"
                    value={form.phone}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, phone: e.target.value }))
                    }
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#1c355e] focus:ring-1 focus:ring-[#1c355e] transition-colors text-gray-900"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(1)}
                    className="flex items-center gap-2 border border-gray-200 text-gray-600 font-bold py-4 px-6 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Retour
                  </button>
                  <button
                    onClick={handleCreatePayment}
                    disabled={
                      !form.email || !form.firstName || !form.lastName || paymentLoading
                    }
                    className="flex-1 bg-[#1c355e] hover:bg-[#152846] disabled:bg-gray-300 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
                  >
                    {paymentLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        Continuer vers le paiement
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* ÉTAPE 3 — PAIEMENT STRIPE */}
            {step === 3 && clientSecret && (
              <div className="bg-white rounded-2xl shadow-[0_2px_20px_rgb(0,0,0,0.03)] p-8">
                <Elements
                  stripe={stripePromise}
                  options={{
                    clientSecret,
                    appearance: {
                      theme: "stripe",
                      variables: {
                        colorPrimary: "#1c355e",
                        borderRadius: "8px",
                        fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
                      },
                    },
                    locale: "fr",
                  }}
                >
                  <CheckoutForm
                    clientSecret={clientSecret}
                    amount={totalCents}
                    onSuccess={() => clearCart()}
                    onBack={() => setStep(2)}
                  />
                </Elements>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN */}
          <div className="w-full lg:w-[380px] flex-shrink-0 space-y-6 lg:sticky lg:top-24 lg:self-start">
            {/* SUMMARY CARD */}
            <div className="bg-[#1c355e] rounded-2xl p-8 text-white relative overflow-hidden shadow-xl">
              <Banknote className="absolute -right-8 -top-8 w-40 h-40 text-white opacity-5" />
              <div className="relative z-10">
                <p className="text-[10px] font-bold text-blue-300 uppercase tracking-widest mb-2">
                  TOTAL À PAYER
                </p>
                <div className="text-5xl font-black mb-1">
                  {total.toFixed(2).replace(".", ",")}€
                </div>
                <p className="text-sm text-blue-300 mb-8 font-medium">
                  ~ ${(total * 1.08).toFixed(2)} USD
                </p>

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
                  <span className="text-xl font-bold">
                    {total.toFixed(2).replace(".", ",")}€
                  </span>
                </div>
              </div>
            </div>

            {/* TRUST BADGES */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl p-5 shadow-[0_2px_15px_rgb(0,0,0,0.03)] border border-gray-100">
                <CheckCircle2 className="w-6 h-6 text-[#1c355e] mb-3" />
                <p className="text-[10px] font-bold text-gray-900 uppercase tracking-widest mb-1">
                  OFFICIEL
                </p>
                <p className="text-[11px] text-gray-500 font-medium">
                  Revendeur agréé direct
                </p>
              </div>
              <div className="bg-white rounded-2xl p-5 shadow-[0_2px_15px_rgb(0,0,0,0.03)] border border-gray-100">
                <RefreshCcw className="w-6 h-6 text-[#1c355e] mb-3" />
                <p className="text-[10px] font-bold text-gray-900 uppercase tracking-widest mb-1">
                  FLEXIBLE
                </p>
                <p className="text-[11px] text-gray-500 font-medium">
                  Billet valable 2 ans
                </p>
              </div>
            </div>

            {/* PAYMENT METHODS */}
            <div className="bg-white rounded-2xl p-5 shadow-[0_2px_15px_rgb(0,0,0,0.03)] border border-gray-100">
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">
                MÉTHODES ACCEPTÉES
              </p>
              <div className="flex flex-wrap gap-2">
                {["Visa", "Mastercard", "Amex", "Apple Pay", "Google Pay", "Alipay"].map((m) => (
                  <span
                    key={m}
                    className="text-[11px] font-medium text-gray-600 bg-gray-50 px-2.5 py-1 rounded-md border border-gray-100"
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>

            {/* AVAILABILITY ALERT */}
            <div className="bg-[#ffebee] border border-[#ffcdd2] rounded-2xl p-5 flex gap-4 items-center shadow-sm">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-red-600 uppercase tracking-widest mb-1">
                  DISPONIBILITÉ LIMITÉE
                </p>
                <p className="text-sm text-red-500 font-medium leading-snug">
                  Seulement 4 places restantes pour cette date.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
