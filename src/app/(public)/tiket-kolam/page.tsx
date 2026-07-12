"use client";

import { useState } from "react";
import Image from "next/image";
import { Calendar, Users, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import { buyPoolTicket } from "@/actions/pool";

export default function TiketKolamPage() {
  const [adultCount, setAdultCount] = useState(1);
  const [childCount, setChildCount] = useState(0);
  const [visitDate, setVisitDate] = useState("");
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const TICKET_PRICE = 20000;
  const totalPrice = (adultCount + childCount) * TICKET_PRICE;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!visitDate) {
      setError("Pilih tanggal kunjungan terlebih dahulu.");
      setLoading(false);
      return;
    }

    const res = await buyPoolTicket({
      guestName,
      guestEmail,
      guestPhone,
      visitDate: new Date(visitDate),
      adultCount,
      childCount,
      totalPrice,
    });

    if (res.error) {
      setError(res.error);
    } else {
      setSuccess(true);
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-screen pt-32 pb-24 px-6 flex items-center justify-center bg-parchment-50">
        <div className="max-w-md w-full bg-white p-10 border border-parchment-300 text-center shadow-luxury">
          <CheckCircle2 className="h-16 w-16 text-green-600 mx-auto mb-6" />
          <h2 className="font-serif text-3xl font-light text-obsidian-900 mb-4">Pembelian Berhasil</h2>
          <p className="text-obsidian-500 text-sm leading-relaxed mb-8">
            Terima kasih {guestName}, tiket Rosa Swimming Pool Anda telah diterbitkan. Kami telah mengirimkan QR Code E-Tiket ke email Anda (<strong>{guestEmail}</strong>).
          </p>
          <button 
            onClick={() => window.location.href = "/"}
            className="w-full bg-obsidian-900 text-parchment-50 py-4 text-[10px] uppercase tracking-[0.25em] hover:bg-obsidian-800 transition-colors"
          >
            Kembali ke Beranda
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-24 bg-parchment-50">
      <div className="max-w-5xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left Col - Info */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-obsidian-500 mb-4">Day Pass</p>
            <h1 className="font-serif text-4xl font-light text-obsidian-900 mb-6 md:text-6xl leading-tight">
              Rosa<br />Swimming Pool
            </h1>
            <p className="text-obsidian-500 text-sm leading-relaxed mb-8">
              Nikmati kesegaran air kolam renang dengan pemandangan alam Ciparay yang asri. Cocok untuk keluarga dan anak-anak.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-parchment-200 text-obsidian-900">
                  <span className="font-serif text-xl">Rp 20rb</span>
                </div>
                <div>
                  <h3 className="font-serif text-lg text-obsidian-900">Harga Tiket Flat</h3>
                  <p className="text-xs text-obsidian-500">Berlaku untuk anak-anak dan dewasa.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-parchment-200 text-obsidian-900">
                  <Calendar className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-serif text-lg text-obsidian-900">Buka Setiap Hari</h3>
                  <p className="text-xs text-obsidian-500">Pukul 08.00 - 17.00 WIB.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 hidden lg:block relative aspect-[4/3] w-full bg-parchment-200 overflow-hidden">
            <Image
              src="https://cf.bstatic.com/xdata/images/hotel/max1024x768/798760496.jpg?k=4843aeb3415768a213bb285fed6ede55d96acebd8cacd16fcd901a3aa258a909&o=&hp=1"
              alt="Kolam Renang Rosa"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Right Col - Form */}
        <div className="lg:col-span-7 bg-white p-8 md:p-12 border border-parchment-300 shadow-luxury">
          <form onSubmit={handleSubmit} className="space-y-8">
            <h2 className="font-serif text-2xl font-light text-obsidian-900 mb-6">Detail Pemesanan</h2>
            
            {error && (
              <div className="bg-red-50 text-red-800 p-4 text-sm border border-red-200">
                {error}
              </div>
            )}

            <div className="space-y-6">
              {/* Date */}
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-obsidian-500 mb-2">Tanggal Kunjungan</label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={visitDate}
                  onChange={(e) => setVisitDate(e.target.value)}
                  className="w-full border-b border-parchment-300 bg-transparent py-3 text-obsidian-900 placeholder-obsidian-300 focus:border-obsidian-900 focus:outline-none focus:ring-0 transition-colors"
                />
              </div>

              {/* Tickets */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-obsidian-500 mb-2">Dewasa</label>
                  <div className="flex items-center border-b border-parchment-300 py-2">
                    <button type="button" onClick={() => setAdultCount(Math.max(1, adultCount - 1))} className="px-3 text-obsidian-500 hover:text-obsidian-900">-</button>
                    <span className="flex-1 text-center font-serif text-lg">{adultCount}</span>
                    <button type="button" onClick={() => setAdultCount(adultCount + 1)} className="px-3 text-obsidian-500 hover:text-obsidian-900">+</button>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-obsidian-500 mb-2">Anak-anak</label>
                  <div className="flex items-center border-b border-parchment-300 py-2">
                    <button type="button" onClick={() => setChildCount(Math.max(0, childCount - 1))} className="px-3 text-obsidian-500 hover:text-obsidian-900">-</button>
                    <span className="flex-1 text-center font-serif text-lg">{childCount}</span>
                    <button type="button" onClick={() => setChildCount(childCount + 1)} className="px-3 text-obsidian-500 hover:text-obsidian-900">+</button>
                  </div>
                </div>
              </div>
              
              {/* Guest Info */}
              <div className="pt-4 border-t border-parchment-200">
                <label className="block text-[10px] uppercase tracking-widest text-obsidian-500 mb-2">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full border-b border-parchment-300 bg-transparent py-3 text-obsidian-900 placeholder-obsidian-300 focus:border-obsidian-900 focus:outline-none transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-obsidian-500 mb-2">Email</label>
                  <input
                    type="email"
                    required
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    placeholder="john@example.com"
                    className="w-full border-b border-parchment-300 bg-transparent py-3 text-obsidian-900 placeholder-obsidian-300 focus:border-obsidian-900 focus:outline-none transition-colors"
                  />
                  <p className="text-[10px] text-obsidian-400 mt-1">E-tiket akan dikirim ke email ini.</p>
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-obsidian-500 mb-2">WhatsApp</label>
                  <input
                    type="tel"
                    required
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    placeholder="08123456789"
                    className="w-full border-b border-parchment-300 bg-transparent py-3 text-obsidian-900 placeholder-obsidian-300 focus:border-obsidian-900 focus:outline-none transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Total */}
            <div className="bg-parchment-100 p-6 mt-8 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="text-center sm:text-left">
                <p className="text-[10px] uppercase tracking-widest text-obsidian-500 mb-1">Total Pembayaran</p>
                <p className="font-serif text-3xl text-obsidian-900">Rp {totalPrice.toLocaleString("id-ID")}</p>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto bg-obsidian-900 text-parchment-50 px-8 py-4 text-[10px] uppercase tracking-[0.2em] hover:bg-obsidian-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Bayar"}
                {!loading && <ArrowRight className="h-4 w-4" />}
              </button>
            </div>
            
            <p className="text-xs text-obsidian-400 text-center mt-4">
              Pembayaran diamankan. E-Tiket (QR Code) akan otomatis dikirim setelah pembayaran berhasil.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
