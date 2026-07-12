"use client";

import { useState, useMemo, useTransition, useEffect } from "react";
import { Unit } from "@prisma/client";
import { Calendar } from "@/components/ui/calendar";
import { DateRange, Matcher } from "react-day-picker";
import { differenceInDays, isWithinInterval, startOfDay, isBefore, format } from "date-fns";
import { submitBooking } from "@/actions/booking";
import { useRouter } from "next/navigation";
import { Users, Minus, Plus } from "lucide-react";

interface BookingClientProps {
  unit: Unit;
  existingBookings: { checkIn: Date; checkOut: Date }[];
}

export default function BookingClient({ unit, existingBookings }: BookingClientProps) {
  const router = useRouter();
  const [date, setDate]         = useState<DateRange | undefined>();
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [phone, setPhone]       = useState("");
  const [guests, setGuests]     = useState(1);
  const [isPending, startTransition] = useTransition();
  const [error, setError]       = useState<string | null>(null);
  const [monthsToShow, setMonthsToShow] = useState(2);

  useEffect(() => {
    const handleResize = () => setMonthsToShow(window.innerWidth < 768 ? 1 : 2);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const disabledDates = useMemo<Matcher[]>(() => {
    const disabled: Matcher[] = [{ before: startOfDay(new Date()) }];
    existingBookings.forEach(b => {
      disabled.push({
        from: startOfDay(new Date(b.checkIn)),
        to:   startOfDay(new Date(b.checkOut)),
      });
    });
    return disabled;
  }, [existingBookings]);

  const handleDateSelect = (newDate: DateRange | undefined) => {
    if (newDate?.from && newDate?.to) {
      const overlap = existingBookings.some(b => {
        const bIn  = startOfDay(new Date(b.checkIn));
        const bOut = startOfDay(new Date(b.checkOut));
        return (
          isWithinInterval(bIn,  { start: newDate.from!, end: newDate.to! }) ||
          isWithinInterval(bOut, { start: newDate.from!, end: newDate.to! }) ||
          (isBefore(bIn, newDate.from!) && isBefore(newDate.to!, bOut))
        );
      });
      if (overlap) { setDate(undefined); return; }
    }
    setDate(newDate);
  };

  const nights     = date?.from && date?.to ? differenceInDays(date.to, date.from) : 0;
  const totalPrice = nights > 0 ? nights * unit.pricePerNight : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date?.from || !date?.to || nights < 1) {
      setError("Pilih tanggal check-in dan check-out terlebih dahulu.");
      return;
    }
    if (guests > unit.capacity) {
      setError(`Kapasitas maksimal unit ini adalah ${unit.capacity} tamu.`);
      return;
    }
    setError(null);
    startTransition(async () => {
      const result = await submitBooking({
        unitId:     unit.id,
        checkIn:    date.from!,
        checkOut:   date.to!,
        guestName:  name,
        guestEmail: email,
        guestPhone: phone,
        guestCount: guests,
        totalPrice,
      });
      if (result.error) setError(result.error);
      else if (result.success)
        router.push(`/unit/${unit.id}/book/success?bookingId=${result.bookingId}`);
    });
  };

  const inputClass  = "w-full border-0 border-b border-parchment-300 bg-transparent px-0 py-3 text-sm text-obsidian-900 placeholder-obsidian-300 focus:border-obsidian-900 focus:outline-none transition-colors duration-300";
  const labelClass  = "block text-[9px] uppercase tracking-[0.25em] text-obsidian-400 mb-1";

  return (
    <div className="mx-auto max-w-[1400px] grid gap-16 px-6 py-16 md:px-16 lg:grid-cols-2 lg:gap-24">

      {/* ── Left: Calendar ──────────────────────────────────────── */}
      <div>
        <p className="mb-2 text-[9px] uppercase tracking-[0.25em] text-obsidian-400">Langkah 01</p>
        <h2 className="font-serif text-4xl font-light text-obsidian-900 mb-10">Pilih Tanggal</h2>

        <Calendar
          mode="range"
          selected={date}
          onSelect={handleDateSelect}
          numberOfMonths={monthsToShow}
          disabled={disabledDates}
          className="w-full"
        />

        {nights > 0 && (
          <div className="mt-8 border-t border-parchment-300 pt-8">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-obsidian-500">
                {format(date!.from!, "d MMM")} → {format(date!.to!, "d MMM yyyy")}
              </span>
              <span className="text-obsidian-700">{nights} malam</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[9px] uppercase tracking-[0.25em] text-obsidian-400">Estimasi Total</span>
              <span className="font-serif text-2xl text-obsidian-900">
                Rp {totalPrice.toLocaleString("id-ID")}
              </span>
            </div>
          </div>
        )}

        {!date?.from && (
          <p className="mt-6 text-xs text-obsidian-400 italic">
            Klik tanggal mulai, lalu tanggal selesai pada kalender di atas.
          </p>
        )}
      </div>

      {/* ── Right: Form ─────────────────────────────────────────── */}
      <div>
        <p className="mb-2 text-[9px] uppercase tracking-[0.25em] text-obsidian-400">Langkah 02</p>
        <h2 className="font-serif text-4xl font-light text-obsidian-900 mb-10">Data Diri</h2>

        <form onSubmit={handleSubmit} className="space-y-10">
          {error && (
            <div className="border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="name" className={labelClass}>Nama Lengkap</label>
            <input id="name" required type="text" value={name}
              onChange={e => setName(e.target.value)}
              className={inputClass} placeholder="Nama lengkap Anda" />
          </div>

          <div>
            <label htmlFor="email" className={labelClass}>Alamat Email</label>
            <input id="email" required type="email" value={email}
              onChange={e => setEmail(e.target.value)}
              className={inputClass} placeholder="email@anda.com" />
          </div>

          <div>
            <label htmlFor="phone" className={labelClass}>No. WhatsApp</label>
            <input id="phone" required type="tel" value={phone}
              onChange={e => setPhone(e.target.value)}
              className={inputClass} placeholder="+62 812 0000 0000" />
          </div>

          {/* ── Guest Count Selector ─────────────────────────── */}
          <div>
            <label className={labelClass}>
              Jumlah Tamu <span className="text-obsidian-300">(maks. {unit.capacity} orang)</span>
            </label>
            <div className="flex items-center gap-5 mt-3">
              <button
                type="button"
                onClick={() => setGuests(g => Math.max(1, g - 1))}
                className="h-9 w-9 flex items-center justify-center border border-parchment-300 text-obsidian-500 hover:border-obsidian-400 hover:text-obsidian-900 transition-colors"
              >
                <Minus className="h-3 w-3" />
              </button>
              <span className="w-8 text-center font-serif text-2xl text-obsidian-900">{guests}</span>
              <button
                type="button"
                onClick={() => setGuests(g => Math.min(unit.capacity, g + 1))}
                className="h-9 w-9 flex items-center justify-center border border-parchment-300 text-obsidian-500 hover:border-obsidian-400 hover:text-obsidian-900 transition-colors"
              >
                <Plus className="h-3 w-3" />
              </button>
              <div className="flex items-center gap-2 text-xs text-obsidian-400 ml-2">
                <Users className="h-3.5 w-3.5" />
                <span>{guests} tamu</span>
              </div>
            </div>
          </div>

          {/* Summary */}
          {nights > 0 && (
            <div className="border border-parchment-300 p-6 bg-parchment-50">
              <p className="mb-4 text-[9px] uppercase tracking-[0.25em] text-obsidian-400">Ringkasan Pesanan</p>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-obsidian-500">Unit</span>
                  <span className="text-obsidian-900 font-medium">{unit.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-obsidian-500">Tamu</span>
                  <span className="text-obsidian-900">{guests} orang</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-obsidian-500">Durasi</span>
                  <span className="text-obsidian-900">{nights} malam</span>
                </div>
                <div className="flex justify-between border-t border-parchment-300 pt-3">
                  <span className="text-obsidian-900 font-medium">Total</span>
                  <span className="font-serif text-xl text-obsidian-900">
                    Rp {totalPrice.toLocaleString("id-ID")}
                  </span>
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isPending || nights < 1}
            className="w-full bg-obsidian-900 py-5 text-[10px] uppercase tracking-[0.3em] text-parchment-50 transition-colors duration-500 hover:bg-obsidian-800 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isPending ? "Memproses…" : "Konfirmasi Reservasi"}
          </button>

          <p className="text-center text-[9px] uppercase tracking-[0.2em] text-obsidian-400">
            Tidak ada pembayaran di muka · Reservasi langsung terkonfirmasi
          </p>
        </form>
      </div>
    </div>
  );
}
