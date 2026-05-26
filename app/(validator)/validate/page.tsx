'use client';

import { useState, useEffect, useRef } from 'react';
import { Shield, Camera, RotateCcw, Users, CheckCircle2, XCircle, LogOut } from 'lucide-react';

const VALIDATOR_PIN = '4242';

interface ScanResult {
  valid: boolean;
  type?: string;
  message: string;
  code?: string;
  timestamp: Date;
}

interface Stats {
  boardedToday: number;
  totalBoarded: number;
  pendingBoarding: number;
}

export default function ValidatePage() {
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState(false);

  const [scanning, setScanning] = useState(false);
  const [lastResult, setLastResult] = useState<ScanResult | null>(null);
  const [history, setHistory] = useState<ScanResult[]>([]);
  const [stats, setStats] = useState<Stats>({ boardedToday: 0, totalBoarded: 0, pendingBoarding: 0 });
  const [processing, setProcessing] = useState(false);

  const scannerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const html5QrRef = useRef<any>(null);

  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('tcb_validator_auth');
      if (saved === 'true') setAuthenticated(true);
    }
  }, []);

  const handleLogout = () => {
    setAuthenticated(false);
    sessionStorage.removeItem('tcb_validator_auth');
    stopScanner();
  };

  useEffect(() => {
    if (!authenticated) return;
    let cancelled = false;

    const loadStats = async () => {
      try {
        const res = await fetch('/api/qr/stats');
        const data = await res.json();
        if (data.success && !cancelled) setStats(data.data);
      } catch {}
    };

    loadStats();
    const interval = setInterval(loadStats, 30000);
    return () => { cancelled = true; clearInterval(interval); };
  }, [authenticated]);

  const validateCode = async (rawCode: string) => {
    if (processing) return;
    setProcessing(true);

    try {
      const res = await fetch('/api/qr/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: rawCode, action: 'validate' }),
      });
      const data = await res.json();

      const result: ScanResult = {
        valid: data.data?.valid ?? false,
        type: data.data?.type,
        message: data.data?.message || data.error || 'Erreur',
        code: data.data?.code || rawCode,
        timestamp: new Date(),
      };

      setLastResult(result);
      setHistory((prev) => [result, ...prev].slice(0, 50));

      if (result.valid) {
        setStats((s) => ({ ...s, boardedToday: s.boardedToday + 1 }));
        vibrate([100, 50, 100]);
      } else {
        vibrate([300]);
      }
    } catch {
      setLastResult({
        valid: false,
        message: 'Erreur reseau',
        timestamp: new Date(),
      });
      vibrate([300]);
    } finally {
      setProcessing(false);
    }
  };

  const vibrate = (pattern: number[]) => {
    if ('vibrate' in navigator) navigator.vibrate(pattern);
  };

  const startScanner = async () => {
    setScanning(true);
    setLastResult(null);

    const { Html5Qrcode } = await import('html5-qrcode');

    if (html5QrRef.current) {
      try { await html5QrRef.current.stop(); } catch {}
    }

    const scanner = new Html5Qrcode('qr-reader');
    html5QrRef.current = scanner;

    try {
      await scanner.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1,
        },
        (decodedText: string) => {
          validateCode(decodedText);
        },
        () => {}
      );
    } catch (err) {
      console.error('[SCANNER]', err);
      setScanning(false);
    }
  };

  const stopScanner = async () => {
    if (html5QrRef.current) {
      try { await html5QrRef.current.stop(); } catch {}
      html5QrRef.current = null;
    }
    setScanning(false);
  };

  // AUTH SCREEN — white theme
  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 bg-gray-50">
        <div className="w-full max-w-xs text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#1c355e] flex items-center justify-center mx-auto mb-6">
            <Shield className="w-8 h-8 text-[#FFB800]" />
          </div>
          <h1 className="text-xl font-bold text-[#1c355e] mb-2">Validateur QR</h1>
          <p className="text-sm text-gray-500 mb-6">Entrez le code a 4 chiffres</p>

          <div>
            <input
              type="tel"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={4}
              autoFocus
              autoComplete="off"
              value={pin}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '').slice(0, 4);
                setPin(val);
                setPinError(false);
                if (val.length === 4) {
                  if (val === VALIDATOR_PIN) {
                    setAuthenticated(true);
                    sessionStorage.setItem('tcb_validator_auth', 'true');
                  } else {
                    setTimeout(() => {
                      setPinError(true);
                      setPin('');
                    }, 300);
                  }
                }
              }}
              placeholder="0000"
              className={`w-full text-center text-4xl font-bold tracking-[0.5em] py-4 border-2 rounded-2xl bg-white outline-none transition-colors ${
                pinError
                  ? 'border-red-400 text-red-500'
                  : 'border-gray-200 text-[#1c355e] focus:border-[#1c355e]'
              }`}
            />

            <button
              type="button"
              onClick={() => {
                if (pin.length >= 4) {
                  if (pin === VALIDATOR_PIN) {
                    setAuthenticated(true);
                    sessionStorage.setItem('tcb_validator_auth', 'true');
                  } else {
                    setPinError(true);
                    setPin('');
                  }
                }
              }}
              className="mt-6 w-full bg-[#1c355e] hover:bg-[#152846] text-white font-bold py-4 rounded-xl transition-colors text-base active:bg-[#0f2035]"
            >
              Valider
            </button>
          </div>

          {pinError && (
            <p className="text-red-500 text-sm mt-4">Code incorrect</p>
          )}
        </div>
      </div>
    );
  }

  // MAIN SCANNER SCREEN — white theme
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#1c355e] flex items-center justify-center">
            <Shield className="w-4 h-4 text-[#FFB800]" />
          </div>
          <div>
            <p className="text-sm font-bold text-[#1c355e]">The Captain Boat</p>
            <p className="text-[10px] text-gray-400 uppercase tracking-wider">Validateur</p>
          </div>
        </div>
        <button onClick={handleLogout} className="p-2 text-gray-400 hover:text-gray-700 transition-colors">
          <LogOut className="w-5 h-5" />
        </button>
      </header>

      {/* Stats bar */}
      <div className="flex justify-around px-4 py-4 bg-gray-50 border-b border-gray-100">
        <div className="text-center">
          <p className="text-2xl font-bold text-[#1c355e]">{stats.boardedToday}</p>
          <p className="text-[9px] text-gray-500 uppercase tracking-wider font-medium">Aujourd&apos;hui</p>
        </div>
        <div className="w-px bg-gray-200" />
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-700">{stats.pendingBoarding}</p>
          <p className="text-[9px] text-gray-500 uppercase tracking-wider font-medium">En attente</p>
        </div>
        <div className="w-px bg-gray-200" />
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-400">{stats.totalBoarded}</p>
          <p className="text-[9px] text-gray-500 uppercase tracking-wider font-medium">Total</p>
        </div>
      </div>

      {/* Scanner area */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-6">
        {!scanning ? (
          <div className="text-center">
            {lastResult && (
              <ResultCard result={lastResult} />
            )}

            <button
              onClick={startScanner}
              className="mt-6 bg-[#1c355e] hover:bg-[#152846] text-white font-bold py-4 px-8 rounded-2xl flex items-center gap-3 mx-auto text-lg transition-colors shadow-lg"
            >
              <Camera className="w-6 h-6" />
              {lastResult ? 'Scanner suivant' : 'Demarrer le scanner'}
            </button>
          </div>
        ) : (
          <div className="w-full max-w-sm">
            <div
              id="qr-reader"
              ref={scannerRef}
              className="rounded-2xl overflow-hidden border-2 border-gray-200 shadow-inner"
            />

            {processing && (
              <div className="mt-4 text-center">
                <div className="w-6 h-6 border-2 border-[#1c355e] border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-sm text-gray-500 mt-2">Verification...</p>
              </div>
            )}

            {lastResult && !processing && (
              <div className="mt-4">
                <ResultCard result={lastResult} compact />
              </div>
            )}

            <button
              onClick={stopScanner}
              className="mt-4 w-full border border-gray-200 text-gray-600 font-medium py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Arreter le scanner
            </button>
          </div>
        )}
      </div>

      {/* History */}
      {history.length > 0 && (
        <div className="px-4 pb-6 border-t border-gray-100 pt-4">
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-4 h-4 text-gray-400" />
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              Derniers scans ({history.length})
            </p>
          </div>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {history.slice(0, 10).map((item, i) => (
              <div
                key={i}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg ${
                  item.valid ? 'bg-green-50' : 'bg-red-50'
                }`}
              >
                {item.valid ? (
                  <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-500 shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-medium truncate ${item.valid ? 'text-green-800' : 'text-red-800'}`}>
                    {item.message}
                  </p>
                  <p className="text-[10px] text-gray-400">
                    {item.code && <span className="font-mono">{item.code}</span>}
                    {' — '}
                    {item.timestamp.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ResultCard({ result, compact = false }: { result: ScanResult; compact?: boolean }) {
  const isValid = result.valid;

  return (
    <div
      className={`rounded-2xl ${compact ? 'p-4' : 'p-8'} text-center transition-all ${
        isValid
          ? 'bg-green-50 border border-green-200'
          : 'bg-red-50 border border-red-200'
      }`}
    >
      {!compact && (
        <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
          isValid ? 'bg-green-100' : 'bg-red-100'
        }`}>
          {isValid ? (
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          ) : (
            <XCircle className="w-10 h-10 text-red-500" />
          )}
        </div>
      )}

      <p className={`font-bold ${compact ? 'text-base' : 'text-xl'} ${isValid ? 'text-green-800' : 'text-red-700'}`}>
        {result.message}
      </p>

      {result.type && (
        <span className={`inline-block mt-2 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
          isValid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
        }`}>
          {result.type === 'adult' ? 'Adulte' : 'Enfant'}
        </span>
      )}

      {result.code && !compact && (
        <p className="mt-3 text-xs font-mono text-gray-400">{result.code}</p>
      )}
    </div>
  );
}
