"use client";

import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Loader2, Lock, CheckCircle } from "lucide-react";
import type { CartItem } from "./ChatCart";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

interface ChatPaymentProps {
  items: CartItem[];
  onSuccess: (paymentIntentId: string) => void;
  onCancel: () => void;
}

function PaymentForm({ amount, onSuccess, onCancel }: { amount: number; onSuccess: (piId: string) => void; onCancel: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    const { error: submitErr } = await elements.submit();
    if (submitErr) {
      setError(submitErr.message || "Erreur de validation");
      setLoading(false);
      return;
    }

    const { error: confirmErr, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/paiement/succes`,
      },
      redirect: "if_required",
    });

    if (confirmErr) {
      setError(confirmErr.message || "Erreur de paiement");
      setLoading(false);
      return;
    }

    if (paymentIntent && paymentIntent.status === "succeeded") {
      onSuccess(paymentIntent.id);
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <PaymentElement
        options={{
          layout: "tabs",
          wallets: { applePay: "auto", googlePay: "auto" },
        }}
      />

      {error && (
        <p className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
      )}

      <div className="flex gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2.5 text-xs font-semibold text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={!stripe || loading}
          className="flex-1 flex items-center justify-center gap-2 bg-[#FFB800] hover:bg-[#e6a600] disabled:bg-gray-300 text-[#1c355e] font-bold py-2.5 rounded-xl transition-colors min-h-[44px]"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <Lock className="w-3.5 h-3.5" />
              Payer {amount}€
            </>
          )}
        </button>
      </div>

      <p className="text-[10px] text-gray-400 text-center uppercase tracking-wide">
        Transaction securisee Stripe
      </p>
    </form>
  );
}

export default function ChatPayment({ items, onSuccess, onCancel }: ChatPaymentProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ email: "", firstName: "", lastName: "" });
  const [step, setStep] = useState<"info" | "pay">("info");

  const total = items.reduce((sum, item) => {
    return sum + item.adultCount * item.adultPrice + item.childCount * item.childPrice;
  }, 0);

  const handleCreateIntent = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          firstName: form.firstName,
          lastName: form.lastName,
          items: items.map((item) => ({
            productSlug: item.slug,
            productTitle: item.title,
            adultCount: item.adultCount,
            childCount: item.childCount,
            totalPrice: item.adultCount * item.adultPrice * 100 + item.childCount * item.childPrice * 100,
          })),
        }),
      });

      const data = await res.json();
      if (!data.success) {
        setError(data.error || "Erreur lors de la creation du paiement");
        setLoading(false);
        return;
      }

      setClientSecret(data.data.clientSecret);
      setStep("pay");
    } catch {
      setError("Erreur reseau");
    }
    setLoading(false);
  };

  if (step === "pay" && clientSecret) {
    return (
      <div className="mt-2 mb-1 w-full rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden p-3">
        <Elements
          stripe={stripePromise}
          options={{
            clientSecret,
            appearance: { theme: "stripe", variables: { borderRadius: "12px" } },
          }}
        >
          <PaymentForm amount={total} onSuccess={onSuccess} onCancel={onCancel} />
        </Elements>
      </div>
    );
  }

  return (
    <div className="mt-2 mb-1 w-full rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      <div className="px-3 py-2.5 bg-[#1c355e] text-white">
        <h4 className="text-xs font-bold uppercase tracking-wide">Vos coordonnees</h4>
      </div>

      <form onSubmit={handleCreateIntent} className="p-3 space-y-2.5">
        <input
          type="email"
          required
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          className="w-full text-sm px-3 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#1c355e]/20"
        />
        <div className="flex gap-2">
          <input
            type="text"
            required
            placeholder="Prenom"
            value={form.firstName}
            onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
            className="flex-1 text-sm px-3 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#1c355e]/20"
          />
          <input
            type="text"
            required
            placeholder="Nom"
            value={form.lastName}
            onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
            className="flex-1 text-sm px-3 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#1c355e]/20"
          />
        </div>

        {error && (
          <p className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
        )}

        <div className="flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 text-xs font-semibold text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
          >
            Retour
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 bg-[#1c355e] hover:bg-[#152846] disabled:bg-gray-300 text-white font-bold py-2.5 rounded-xl transition-colors min-h-[44px]"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : `Continuer — ${total}€`}
          </button>
        </div>
      </form>
    </div>
  );
}
