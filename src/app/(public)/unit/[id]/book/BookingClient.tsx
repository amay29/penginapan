"use client";

import { useState, useMemo, useTransition } from "react";
import { Unit } from "@prisma/client";
import { Calendar } from "@/components/ui/calendar";
import { DateRange, Matcher } from "react-day-picker";
import { addDays, differenceInDays, isWithinInterval, startOfDay, isBefore } from "date-fns";
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

  // Calculate disabled dates (past dates and existing booked dates)
  const disabledDates = useMemo(() => {
    const disabled: Matcher[] = [
      { before: startOfDay(new Date()) } // Disable past dates
    ];

    existingBookings.forEach(booking => {
      disabled.push({
        from: startOfDay(new Date(booking.checkIn)),
        to: startOfDay(new Date(booking.checkOut))
      });
    });

    return disabled;
  }, [existingBookings]);

  // Handle date selection to prevent selecting across disabled dates
  const handleDateSelect = (newDate: DateRange | undefined) => {
    if (newDate?.from && newDate?.to) {
      // Check if any disabled date falls within the selected range
      const overlap = existingBookings.some(booking => {
        const bIn = startOfDay(new Date(booking.checkIn));
        const bOut = startOfDay(new Date(booking.checkOut));
        return (
          isWithinInterval(bIn, { start: newDate.from!, end: newDate.to! }) ||
          isWithinInterval(bOut, { start: newDate.from!, end: newDate.to! }) ||
          (isBefore(bIn, newDate.from!) && isBefore(newDate.to!, bOut))
        );
      });

      if (overlap) {
        // Reset selection if invalid
        setDate(undefined);
        return;
      }
    }
    setDate(newDate);
  };

  const nights = date?.from && date?.to ? differenceInDays(date.to, date.from) : 0;
  const totalPrice = nights > 0 ? nights * unit.pricePerNight : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date?.from || !date?.to) {
      setError("Please select check-in and check-out dates.");
      return;
    }
    if (nights < 1) {
      setError("Check-out date must be after check-in date.");
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

      if (result.error) {
        setError(result.error);
      } else if (result.success) {
        router.push(`/unit/${unit.id}/book/success?bookingId=${result.bookingId}`);
      }
    });
  };

  return (
    <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-2">
      {/* Calendar Section */}
      <div className="flex flex-col items-center">
        <h2 className="mb-6 w-full text-xl font-bold text-earth-900">1. Select Dates</h2>
        <Calendar
          mode="range"
          selected={date}
          onSelect={handleDateSelect}
          numberOfMonths={2}
          disabled={disabledDates}
          className="w-full max-w-fit"
        />
        <div className="mt-6 flex w-full max-w-fit items-center justify-between text-sm text-earth-600">
          <div className="flex items-center">
            <span className="mr-2 h-3 w-3 rounded-full bg-sand-200"></span> Available
          </div>
          <div className="flex items-center">
            <span className="mr-2 h-3 w-3 rounded-full bg-sand-300 opacity-50"></span> Booked
          </div>
          <div className="flex items-center">
            <span className="mr-2 h-3 w-3 rounded-full bg-earth-800"></span> Selected
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div>
        <h2 className="mb-6 text-xl font-bold text-earth-900">2. Guest Details</h2>
        <form onSubmit={handleSubmit} className="rounded-2xl border border-sand-200 bg-white p-8 shadow-xl">
          
          {error && (
            <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-700 border border-red-200">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="mb-2 block text-sm font-medium text-earth-800">Full Name</label>
              <input
                id="name"
                required
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full rounded-lg border border-sand-300 px-4 py-3 text-earth-900 focus:border-earth-600 focus:outline-none focus:ring-1 focus:ring-earth-600"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-earth-800">Email Address</label>
              <input
                id="email"
                required
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full rounded-lg border border-sand-300 px-4 py-3 text-earth-900 focus:border-earth-600 focus:outline-none focus:ring-1 focus:ring-earth-600"
                placeholder="john@example.com"
              />
            </div>
            <div>
              <label htmlFor="phone" className="mb-2 block text-sm font-medium text-earth-800">Phone Number</label>
              <input
                id="phone"
                required
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full rounded-lg border border-sand-300 px-4 py-3 text-earth-900 focus:border-earth-600 focus:outline-none focus:ring-1 focus:ring-earth-600"
                placeholder="+62 812 3456 7890"
              />
            </div>
          </div>

          <div className="mt-8 border-t border-sand-100 pt-6">
            <h3 className="mb-4 text-lg font-bold text-earth-900">Summary</h3>
            <div className="mb-2 flex justify-between text-earth-700">
              <span>Dates</span>
              <span className="font-medium text-earth-900">
                {date?.from ? date.from.toLocaleDateString() : '---'} - {date?.to ? date.to.toLocaleDateString() : '---'}
              </span>
            </div>
            <div className="mb-4 flex justify-between text-earth-700">
              <span>Duration</span>
              <span className="font-medium text-earth-900">{nights} night(s)</span>
            </div>
            <div className="flex justify-between border-t border-sand-100 pt-4 text-xl font-bold text-earth-900">
              <span>Total</span>
              <span>Rp {totalPrice.toLocaleString('id-ID')}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending || nights < 1}
            className="mt-8 w-full rounded-lg bg-earth-800 py-4 text-lg font-bold text-white smooth-transition hover:bg-earth-900 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? "Confirming..." : "Confirm Booking"}
          </button>
        </form>
      </div>
    </div>
  );
}
