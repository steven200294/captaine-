"use client";

import { useState, useEffect } from "react";
import { Download, ExternalLink, CheckCircle, Loader2 } from "lucide-react";

interface ChatTicketProps {
  paymentIntentId: string;
}

export default function ChatTicket({ paymentIntentId }: ChatTicketProps) {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let attempts = 0;
    const maxAttempts = 40;
    let cancelled = false;

    const poll = async () => {
      if (cancelled) return;
      try {
        const res = await fetch(`/api/reservations/by-payment?payment_intent=${paymentIntentId}`);
        const data = await res.json();

        if (data.success && data.data && data.data.pdf_url) {
          setPdfUrl(data.data.pdf_url);
          setOrderNumber(data.data.order_number);
          setReady(true);
          return;
        }
      } catch {}

      attempts++;
      if (attempts < maxAttempts && !cancelled) {
        setTimeout(poll, 3000);
      } else {
        setReady(true);
      }
    };

    poll();
    return () => { cancelled = true; };
  }, [paymentIntentId]);

  const handleDownload = async () => {
    if (!pdfUrl) return;

    try {
      const res = await fetch(pdfUrl);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `billet-${orderNumber || "croisiere"}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      window.open(pdfUrl, "_blank");
    }
  };

  if (!ready) {
    return (
      <div className="mt-2 mb-1 w-full rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden p-4">
        <div className="flex items-center gap-3">
          <Loader2 className="w-5 h-5 animate-spin text-[#1c355e]" />
          <div>
            <p className="text-sm font-semibold text-[#1c355e]">Paiement réussi</p>
            <p className="text-xs text-gray-500">Génération de votre billet en cours...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-2 mb-1 w-full rounded-2xl border border-green-200 bg-green-50 shadow-sm overflow-hidden p-4">
      <div className="flex items-center gap-2 mb-3">
        <CheckCircle className="w-5 h-5 text-green-600" />
        <h4 className="text-sm font-bold text-green-800">Paiement confirmé</h4>
      </div>

      <div className="space-y-2">
        {orderNumber && (
          <p className="text-xs text-gray-600">
            Commande : <span className="font-bold">{orderNumber}</span>
          </p>
        )}

        {pdfUrl ? (
          <button
            onClick={handleDownload}
            className="flex items-center justify-center gap-2 w-full bg-[#1c355e] text-white font-bold py-3 rounded-xl hover:bg-[#152846] transition-colors min-h-[44px]"
          >
            <Download className="w-4 h-4" />
            Télécharger mon billet (PDF)
          </button>
        ) : (
          <p className="text-xs text-gray-500">
            Le billet sera envoyé par email sous quelques minutes.
          </p>
        )}

        <a
          href="/ma-reservation"
          className="flex items-center justify-center gap-2 w-full border border-[#1c355e]/20 text-[#1c355e] font-semibold py-2.5 rounded-xl hover:bg-[#1c355e]/5 transition-colors text-xs"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          Voir ma réservation
        </a>
      </div>
    </div>
  );
}
