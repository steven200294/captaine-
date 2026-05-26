"use client";

import { useState, useEffect } from "react";
import { Download, ExternalLink, CheckCircle } from "lucide-react";

interface ChatTicketProps {
  paymentIntentId: string;
}

export default function ChatTicket({ paymentIntentId }: ChatTicketProps) {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let attempts = 0;
    const maxAttempts = 15;

    const poll = async () => {
      try {
        const res = await fetch(`/api/reservations/by-payment?payment_intent=${paymentIntentId}`);
        const data = await res.json();

        if (data.success && data.data) {
          setPdfUrl(data.data.pdf_url || null);
          setOrderNumber(data.data.order_number);
          setLoading(false);
          return;
        }
      } catch {}

      attempts++;
      if (attempts < maxAttempts) {
        setTimeout(poll, 2000);
      } else {
        setLoading(false);
      }
    };

    poll();
  }, [paymentIntentId]);

  return (
    <div className="mt-2 mb-1 w-full rounded-2xl border border-green-200 bg-green-50 shadow-sm overflow-hidden p-4">
      <div className="flex items-center gap-2 mb-3">
        <CheckCircle className="w-5 h-5 text-green-600" />
        <h4 className="text-sm font-bold text-green-800">Paiement confirme</h4>
      </div>

      {loading ? (
        <p className="text-xs text-gray-600">Preparation de votre billet...</p>
      ) : (
        <div className="space-y-2">
          {orderNumber && (
            <p className="text-xs text-gray-600">
              Commande : <span className="font-bold">{orderNumber}</span>
            </p>
          )}

          {pdfUrl && (
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-[#1c355e] text-white font-bold py-3 rounded-xl hover:bg-[#152846] transition-colors min-h-[44px]"
            >
              <Download className="w-4 h-4" />
              Telecharger mon billet (PDF)
            </a>
          )}

          <a
            href="/ma-reservation"
            className="flex items-center justify-center gap-2 w-full border border-[#1c355e]/20 text-[#1c355e] font-semibold py-2.5 rounded-xl hover:bg-[#1c355e]/5 transition-colors text-xs"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Voir ma reservation
          </a>
        </div>
      )}
    </div>
  );
}
