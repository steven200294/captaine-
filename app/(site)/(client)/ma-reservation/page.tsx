"use client";

import { useState, useEffect } from "react";
import {
  Search,
  QrCode,
  Download,
  Clock,
  CheckCircle2,
  AlertCircle,
  Smartphone,
} from "lucide-react";

interface ReservationData {
  id: string;
  order_number: string;
  status: string;
  cruise_date: string | null;
  cruise_time: string | null;
  total_amount: number;
  created_at: string;
  pdf_url: string | null;
  reservation_items: Array<{
    product_title: string;
    adult_count: number;
    child_count: number;
  }>;
  qr_codes: Array<{
    code: string;
    type: string;
    status: string;
  }>;
  esim_orders: Array<{
    iccid: string | null;
    qr_code_url: string | null;
    package_type: string;
    status: string;
  }>;
}

export default function MaReservationPage() {
  const [email, setEmail] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const [reservations, setReservations] = useState<ReservationData[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const savedEmail = document.cookie
      .split("; ")
      .find((c) => c.startsWith("tcb_email="))
      ?.split("=")[1];
    if (savedEmail) {
      setEmail(decodeURIComponent(savedEmail));
    }
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError(null);
    setSearched(true);

    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, orderNumber: orderNumber || undefined }),
      });

      const data = await res.json();
      if (data.success) {
        setReservations(data.data || []);
      } else {
        setError(data.error || "Erreur lors de la recherche");
      }
    } catch {
      setError("Erreur réseau");
    } finally {
      setLoading(false);
    }
  };

  const statusLabel = (status: string) => {
    switch (status) {
      case "confirmed": return { text: "Confirmée", color: "text-green-700 bg-green-50" };
      case "pending": return { text: "En attente", color: "text-yellow-700 bg-yellow-50" };
      case "cancelled": return { text: "Annulée", color: "text-red-700 bg-red-50" };
      default: return { text: status, color: "text-gray-700 bg-gray-50" };
    }
  };

  return (
    <main className="min-h-screen bg-[#f8f9fa] pb-24 pt-8">
      <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
        <div className="text-center mb-10">
          <h1 className="text-2xl font-bold text-[#1c355e] mb-2">
            Ma réservation
          </h1>
          <p className="text-sm text-gray-500">
            Retrouvez vos QR codes et le détail de votre commande
          </p>
        </div>

        {/* SEARCH FORM */}
        <form
          onSubmit={handleSearch}
          className="bg-white rounded-2xl shadow-[0_2px_20px_rgb(0,0,0,0.03)] p-8 mb-8"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                E-MAIL UTILISÉ LORS DE LA COMMANDE
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jean.dupont@email.com"
                required
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#1c355e] focus:ring-1 focus:ring-[#1c355e] transition-colors text-gray-900"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                N° DE COMMANDE (optionnel)
              </label>
              <input
                type="text"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                placeholder="TCB-XXXXXX"
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#1c355e] focus:ring-1 focus:ring-[#1c355e] transition-colors text-gray-900"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading || !email}
            className="mt-6 w-full bg-[#1c355e] hover:bg-[#152846] disabled:bg-gray-300 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            <Search className="w-4 h-4" />
            {loading ? "Recherche..." : "Rechercher ma réservation"}
          </button>
        </form>

        {/* ERROR */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* RESULTS */}
        {searched && !error && reservations.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-sm">
              Aucune réservation trouvée pour cet email.
            </p>
          </div>
        )}

        {reservations.map((res) => {
          const status = statusLabel(res.status);
          return (
            <div
              key={res.id}
              className="bg-white rounded-2xl shadow-[0_2px_20px_rgb(0,0,0,0.03)] p-8 mb-6"
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    COMMANDE
                  </p>
                  <p className="text-lg font-bold text-[#1c355e] font-mono">
                    {res.order_number}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(res.created_at).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <span
                  className={`text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider ${status.color}`}
                >
                  {status.text}
                </span>
              </div>

              {/* QR Codes */}
              {res.qr_codes.length > 0 && (
                <div className="mb-6">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-3">
                    QR CODES CROISIÈRE
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {res.qr_codes.map((qr, i) => (
                      <div
                        key={i}
                        className="border border-gray-100 rounded-xl p-4 text-center"
                      >
                        <QrCode className="w-8 h-8 text-[#1c355e] mx-auto mb-2" />
                        <p className="text-xs font-mono text-gray-600 truncate">
                          {qr.code}
                        </p>
                        <p className="text-[10px] text-gray-400 mt-1 capitalize">
                          {qr.type === "adult" ? "Adulte" : "Enfant"}
                        </p>
                        {qr.status === "used" && (
                          <span className="text-[9px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full mt-1 inline-block">
                            UTILISÉ
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* eSIMs */}
              {res.esim_orders.length > 0 && (
                <div className="mb-6">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-3">
                    eSIM
                  </p>
                  <div className="space-y-3">
                    {res.esim_orders.map((esim, i) => (
                      <div
                        key={i}
                        className="border border-gray-100 rounded-xl p-4 flex items-center gap-4"
                      >
                        <Smartphone className="w-6 h-6 text-[#1c355e]" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            eSIM {esim.package_type.toUpperCase()} — Europe & UK
                          </p>
                          <p className="text-xs text-gray-500">
                            {esim.iccid ? `ICCID: ${esim.iccid}` : "En cours d'activation..."}
                          </p>
                        </div>
                        {esim.status === "provisioned" && (
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                        )}
                        {esim.status === "pending" && (
                          <Clock className="w-5 h-5 text-yellow-500" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* PDF Download */}
              {res.pdf_url && (
                <a
                  href={res.pdf_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full border border-[#1c355e] text-[#1c355e] font-bold py-3 rounded-xl hover:bg-[#f0f4ff] transition-colors text-sm mb-3"
                >
                  <Download className="w-4 h-4" />
                  Telecharger mes billets (PDF)
                </a>
              )}

              {/* Wallet Passes */}
              <div className="flex gap-3">
                <a
                  href={`/api/wallet/apple?order=${res.order_number}&email=${encodeURIComponent(email)}`}
                  className="flex-1 flex items-center justify-center gap-2 border border-gray-200 text-gray-700 font-medium py-3 rounded-xl hover:bg-gray-50 transition-colors text-sm"
                >
                  <Smartphone className="w-4 h-4" />
                  Apple Wallet
                </a>
                <a
                  href={`/api/wallet/google?order=${res.order_number}&email=${encodeURIComponent(email)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 border border-gray-200 text-gray-700 font-medium py-3 rounded-xl hover:bg-gray-50 transition-colors text-sm"
                >
                  <Smartphone className="w-4 h-4" />
                  Google Wallet
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
