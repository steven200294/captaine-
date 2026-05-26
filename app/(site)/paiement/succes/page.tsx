"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Download,
  Mail,
  ArrowRight,
  Loader2,
  Wallet,
} from "lucide-react";

interface ReservationInfo {
  order_number: string;
  email: string;
  first_name: string;
  pdf_url: string | null;
}

export default function PaymentSuccessPage() {
  const [reservation, setReservation] = useState<ReservationInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const piId = params.get("payment_intent");
    if (!piId) {
      const timer = setTimeout(() => setLoading(false), 0);
      return () => clearTimeout(timer);
    }

    let cancelled = false;
    const maxPolls = 10;
    let count = 0;

    const poll = async () => {
      try {
        const res = await fetch(`/api/reservations/by-payment?payment_intent=${piId}`);
        const data = await res.json();
        if (data.success && data.data) {
          if (!cancelled) {
            setReservation(data.data);
            setLoading(false);
            document.cookie = `tcb_email=${encodeURIComponent(data.data.email)};path=/;max-age=${60 * 60 * 24 * 365}`;
          }
          return true;
        }
      } catch {}
      return false;
    };

    poll().then((found) => {
      if (found || cancelled) return;
      const interval = setInterval(async () => {
        count++;
        if (count >= maxPolls) {
          clearInterval(interval);
          if (!cancelled) setLoading(false);
          return;
        }
        const done = await poll();
        if (done) clearInterval(interval);
      }, 3000);

      return () => clearInterval(interval);
    });

    return () => { cancelled = true; };
  }, []);

  const piId = typeof window !== "undefined"
    ? new URLSearchParams(window.location.search).get("payment_intent")
    : null;
  const fallbackOrder = piId ? `TCB-${piId.slice(-6).toUpperCase()}` : null;

  return (
    <main className="min-h-screen bg-[#f8f9fa] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-[0_2px_20px_rgb(0,0,0,0.05)] p-10 max-w-lg w-full text-center">
        <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-green-500" />
        </div>

        <h1 className="text-2xl font-bold text-[#1c355e] mb-2">
          Reservation confirmee !
        </h1>
        <p className="text-gray-500 mb-8">
          Votre paiement a ete accepte. Vous allez recevoir vos billets par
          email dans quelques instants.
        </p>

        {/* Order number */}
        <div className="bg-[#f0f4ff] rounded-xl p-4 mb-8">
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">
            NUMERO DE COMMANDE
          </p>
          {loading ? (
            <div className="flex items-center justify-center gap-2 py-1">
              <Loader2 className="w-4 h-4 animate-spin text-[#1c355e]" />
              <span className="text-sm text-gray-500">Preparation...</span>
            </div>
          ) : (
            <p className="text-xl font-bold text-[#1c355e] font-mono">
              {reservation?.order_number || fallbackOrder}
            </p>
          )}
        </div>

        <div className="space-y-3 mb-8 text-left">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
            <Mail className="w-5 h-5 text-[#1c355e] mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-900">
                Email de confirmation
              </p>
              <p className="text-xs text-gray-500">
                Avec vos QR codes et instructions (PDF en piece jointe)
              </p>
            </div>
          </div>

          {/* PDF download */}
          {reservation?.pdf_url ? (
            <a
              href={reservation.pdf_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 hover:bg-[#f0f4ff] transition-colors group"
            >
              <Download className="w-5 h-5 text-[#1c355e] mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-900 group-hover:text-[#1c355e]">
                  Telecharger vos billets
                </p>
                <p className="text-xs text-gray-500">
                  Format PDF avec QR codes
                </p>
              </div>
            </a>
          ) : (
            <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
              <Download className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Billets en preparation...
                </p>
                <p className="text-xs text-gray-500">
                  Disponibles sous 1 minute via &ldquo;Ma reservation&rdquo;
                </p>
              </div>
            </div>
          )}

          {/* Wallet pass */}
          <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
            <Wallet className="w-5 h-5 text-[#1c355e] mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-900">
                Ajouter au Wallet
              </p>
              <p className="text-xs text-gray-500">
                Apple Wallet / Google Wallet — disponible par email
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/ma-reservation"
            className="flex-1 bg-[#1c355e] hover:bg-[#152846] text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors text-sm"
          >
            Ma reservation
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/"
            className="flex-1 border border-gray-200 text-gray-600 font-bold py-3.5 rounded-xl flex items-center justify-center hover:bg-gray-50 transition-colors text-sm"
          >
            Retour a l&apos;accueil
          </Link>
        </div>
      </div>
    </main>
  );
}
