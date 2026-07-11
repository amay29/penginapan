"use client";

import { useState } from "react";
import { validateTicket } from "@/actions/pool-admin";
import { ScanLine, Loader2, CheckCircle2, XCircle } from "lucide-react";

export default function TicketScannerPage() {
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    error?: string;
    ticket?: any;
  } | null>(null);

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setLoading(true);
    setResult(null);

    const res = await validateTicket(token);
    setResult(res);
    setLoading(false);
    setToken("");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-light tracking-wide text-surface-50 mb-2">Validasi Tiket</h1>
        <p className="text-sm text-surface-400">Scan QR Code atau masukkan ID token dari pengunjung.</p>
      </div>

      <div className="bg-surface-900 border border-surface-600/30 p-8">
        
        {/* Placeholder for actual camera scanner in a real PWA app */}
        <div className="aspect-video bg-surface-950 border-2 border-dashed border-surface-600/50 flex flex-col items-center justify-center mb-8 rounded-sm">
          <ScanLine className="h-12 w-12 text-surface-600 mb-4" />
          <p className="text-xs text-surface-500 uppercase tracking-widest">Kamera Scanner (Simulasi)</p>
        </div>

        <form onSubmit={handleScan} className="flex gap-4">
          <input
            type="text"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Masukkan Token QR Code..."
            className="flex-1 bg-surface-950 border border-surface-600/50 text-surface-100 px-4 py-3 text-sm focus:outline-none focus:border-gold-500 transition-colors placeholder:text-surface-600"
          />
          <button
            type="submit"
            disabled={loading || !token}
            className="bg-gold-500 text-surface-950 px-6 py-3 text-xs uppercase tracking-widest font-semibold hover:bg-gold-400 disabled:opacity-50 transition-colors flex items-center justify-center min-w-[120px]"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Validasi"}
          </button>
        </form>
      </div>

      {result && (
        <div className={`p-6 border ${result.success ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
          {result.success ? (
            <div className="flex gap-4">
              <CheckCircle2 className="h-8 w-8 text-emerald-400 shrink-0" />
              <div>
                <h3 className="text-emerald-400 font-medium text-lg mb-1">Tiket Valid & Berhasil Digunakan</h3>
                <div className="text-sm text-surface-300 space-y-1 mt-4">
                  <p><span className="text-surface-500 inline-block w-24">Nama:</span> {result.ticket.guestName}</p>
                  <p><span className="text-surface-500 inline-block w-24">No HP:</span> {result.ticket.guestPhone}</p>
                  <p><span className="text-surface-500 inline-block w-24">Jumlah:</span> {result.ticket.adultCount + result.ticket.childCount} Orang</p>
                  <p><span className="text-surface-500 inline-block w-24">Tanggal:</span> {new Date(result.ticket.visitDate).toLocaleDateString('id-ID')}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex gap-4">
              <XCircle className="h-8 w-8 text-red-400 shrink-0" />
              <div>
                <h3 className="text-red-400 font-medium text-lg mb-1">Validasi Gagal</h3>
                <p className="text-sm text-surface-300 mt-2">{result.error}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
