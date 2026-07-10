"use client";

import { useState, useMemo, useTransition } from "react";
import { Unit } from "@prisma/client";
import { Calendar } from "@/components/ui/calendar";
import { DateRange, Matcher } from "react-day-picker";
import { differenceInDays, isWithinInterval, startOfDay, isBefore, format } from "date-fns";
import { submitBooking } from "@/actions/booking";
import { useRouter } from "next/navigation";

interface BookingClientProps {
  unit: Unit;
  existingBookings: { checkIn: Date; checkOut: Date }[];
}

export default function BookingClient({ unit, existingBookings }: BookingClientProps) {
  const router = useRouter();
  const [date, setDate] = useState<DateRange | undefined>();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const disabledDates = useMemo(() => {
    const disabled: Matcher[] = [{ before: startOfDay(new Date()) }];
    existingBookings.forEach(b => {
      disabled.push({
        from: startOfDay(new Date(b.checkIn)),
        to: startOfDay(new Date(b.checkOut))
      });
    });
    return disabled;
  }, [existingBookings]);

  const handleDateSelect = (newDate: DateRange | undefined) => {
    if (newDate?.from && newDate?.to) {
      const overlap = existingBookings.some(b => {
        const bIn = startOfDay(new Date(b.checkIn));
        const bOut = startOfDay(new Date(b.checkOut));
        return (
          isWithinInterval(bIn, { start: newDate.from!, end: newDate.to! }) ||
          isWithinInterval(bOut, { start: newDate.from!, end: newDate.to! }) ||
          (isBefore(bIn, newDate.from!) && isBefore(newDate.to!, bOut))
        );
      });
      if (overlap) { setDate(undefined); return; }
    }
    setDate(newDate);
  };

  const nights = date?.from && date?.to ? differenceInDays(date.to, date.from) : 0;
  const totalPrice = nights > 0 ? nights * unit.pricePerNight : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date?.from || !date?.to || nights < 1) {
      setError("Please select valid check-in and check-out dates.");
      return;
    }
    setError(null);
    startTransition(async () => {
      const result = await submitBooking({
        unitId: unit.id,
        checkIn: date.from!,
        checkOut: date.to!,
        guestName: name,
        guestEmail: email,
        guestPhone: phone,
        totalPrice
      });
      if (result.error) setError(result.error);
      else if (result.success)
        router.push(`/unit/${unit.id}/book/success?bookingId=${result.bookingId}`);
    });
  };

  const inputClass =
    "w-full border-0 border-b border-parchment-300 bg-transparent px-0 py-3 text-sm text-obsidian-900 placeholder-obsidian-300 focus:border-obsidian-900 focus:outline-none transition-colors duration-300";
  const labelClass = "block text-[9px] uppercase tracking-[0.25em] text-obsidian-400 mb-1";

  return (
    <div className="mx-auto max-w-[1400px] grid gap-16 px-6 py-16 md:px-16 lg:grid-cols-2 lg:gap-24">

      {/* ── Left: Calendar ───────────────────────────────────── */}
      <div>
        <p className="mb-2 text-[9px] uppercase tracking-[0.25em] text-obsidian-400">Step 01</p>
        <h2 className="font-serif text-4xl font-light text-obsidian-900 mb-10">Select Dates</h2>

        <Calendar
          mode="range"
          selected={date}
          onSelect={handleDateSelect}
          numberOfMonths={2}
          disabled={disabledDates}
          className="w-full"
        />

        {/* Live price preview */}
        {nights > 0 && (
          <div className="mt-8 border-t border-parchment-300 pt-8">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-obsidian-500">
                {format(date!.from!, "d MMM")} → {format(date!.to!, "d MMM yyyy")}
              </span>
              <span className="text-obsidian-700">{nights} nights</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[9px] uppercase tracking-[0.25em] text-obsidian-400">Estimated Total</span>
              <span className="font-serif text-2xl text-obsidian-900">
                Rp {totalPrice.toLocaleString("id-ID")}
              </span>
            </div>
          </div>
        )}

        {!date?.from && (
          <p className="mt-6 text-xs text-obsidian-400 italic">
            Click a start date, then an end date on the calendar above.
          </p>
        )}
      </div>

      {/* ── Right: Form ──────────────────────────────────────── */}
      <div>
        <p className="mb-2 text-[9px] uppercase tracking-[0.25em] text-obsidian-400">Step 02</p>
        <h2 className="font-serif text-4xl font-light text-obsidian-900 mb-10">Your Details</h2>

        <form onSubmit={handleSubmit} className="space-y-10">
          {error && (
            <div className="border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="name" className={labelClass}>Full Name</label>
            <input id="name" required type="text" value={name}
              onChange={e => setName(e.target.value)}
              className={inputClass} placeholder="Your full name" />
          </div>
          <div>
            <label htmlFor="email" className={labelClass}>Email Address</label>
            <input id="email" required type="email" value={email}
              onChange={e => setEmail(e.target.value)}
              className={inputClass} placeholder="your@email.com" />
          </div>
          <div>
            <label htmlFor="phone" className={labelClass}>Phone / WhatsApp</label>
            <input id="phone" required type="tel" value={phone}
              onChange={e => setPhone(e.target.value)}
              className={inputClass} placeholder="+62 812 0000 0000" />
          </div>

          {/* Summary box */}
          {nights > 0 && (
            <div className="border border-parchment-300 p-6 bg-parchment-50">
              <p className="mb-4 text-[9px] uppercase tracking-[0.25em] text-obsidian-400">Booking Summary</p>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-obsidian-500">Unit</span>
                  <span className="text-obsidian-900 font-medium">{unit.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-obsidian-500">Duration</span>
                  <span className="text-obsidian-900">{nights} night{nights > 1 ? "s" : ""}</span>
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
            {isPending ? "Confirming Reservation…" : "Confirm Reservation"}
          </button>

          <p className="text-center text-[9px] uppercase tracking-[0.2em] text-obsidian-400">
            No payment required · Reservation confirmed instantly
          </p>
        </form>
      </div>
    </div>
  );
}
