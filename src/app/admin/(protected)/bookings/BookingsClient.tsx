"use client";

import { useTransition } from "react";
import { updateBookingStatus } from "@/actions/booking-admin";
import { useRouter } from "next/navigation";

const STATUS_STYLE: Record<string, string> = {
  CONFIRMED: "bg-gold-700/20 text-gold-400 border-gold-700/30",
  CANCELLED: "bg-red-900/20 text-red-400 border-red-900/30",
  PENDING:   "bg-surface-700 text-surface-400 border-surface-600/40",
};

export default function BookingsClient({ bookings }: { bookings: any[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleStatusChange = (id: string, newStatus: string) => {
    startTransition(async () => {
      const res = await updateBookingStatus(id, newStatus);
      if (res.error) alert(res.error);
      else router.refresh();
    });
  };

  return (
    <div className="max-w-5xl space-y-8">
      {/* Header */}
      <div className="border-b border-surface-600/30 pb-6">
        <h1 className="font-serif text-3xl font-light text-surface-100 tracking-wide">Bookings</h1>
        <p className="mt-1 text-sm text-surface-400">
          {bookings.length} reservation{bookings.length !== 1 ? "s" : ""} in the ledger
        </p>
      </div>

      {/* Panel */}
      <div className="bg-surface-800 border border-surface-600/30 rounded-sm overflow-hidden">
        {/* Column Headers */}
        <div className="hidden md:grid grid-cols-[1.4fr_1.2fr_1fr_auto_auto] gap-4 px-6 py-3 border-b border-surface-600/30 bg-surface-900/50">
          {["Guest", "Space & Dates", "Total", "Status", "Update"].map((h) => (
            <p key={h} className="text-[9px] uppercase tracking-[0.25em] text-surface-500">{h}</p>
          ))}
        </div>

        {/* Rows */}
        <div className="divide-y divide-surface-600/20">
          {bookings.length === 0 && (
            <p className="px-6 py-12 text-sm italic text-surface-500 font-serif text-center">No bookings found in the ledger.</p>
          )}
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="grid grid-cols-1 md:grid-cols-[1.4fr_1.2fr_1fr_auto_auto] gap-4 items-center px-6 py-5 hover:bg-surface-700/20 transition-colors duration-200"
            >
              {/* Guest */}
              <div>
                <p className="text-sm font-medium text-surface-100">{booking.guestName}</p>
                <p className="text-xs text-surface-400 mt-0.5 truncate">{booking.guestEmail}</p>
                <p className="text-xs text-surface-500">{booking.guestPhone}</p>
              </div>

              {/* Space & Dates */}
              <div>
                <p className="text-sm font-serif text-surface-200">{booking.unit.name}</p>
                <p className="text-xs text-surface-400 mt-1">
                  {booking.checkIn.toLocaleDateString("id-ID", { day: "2-digit", month: "short" })}
                  {" – "}
                  {booking.checkOut.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}
                </p>
              </div>

              {/* Total */}
              <p className="text-sm font-serif text-surface-100 whitespace-nowrap">
                Rp {booking.totalPrice.toLocaleString("id-ID")}
              </p>

              {/* Status Badge */}
              <span className={`text-[9px] uppercase tracking-widest px-3 py-1 border rounded-full whitespace-nowrap w-fit ${STATUS_STYLE[booking.status] ?? STATUS_STYLE.PENDING}`}>
                {booking.status}
              </span>

              {/* Action Dropdown */}
              <div className="relative w-fit">
                <select
                  disabled={isPending}
                  value={booking.status}
                  onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                  className="appearance-none cursor-pointer text-[10px] uppercase tracking-widest bg-surface-700 border border-surface-600/50 text-surface-200 px-3 py-2 pr-7 rounded-sm hover:border-surface-400/50 focus:outline-none focus:border-gold-600 disabled:opacity-50 transition-colors duration-200"
                >
                  <option value="PENDING"   className="bg-surface-900">Pending</option>
                  <option value="CONFIRMED" className="bg-surface-900">Confirmed</option>
                  <option value="CANCELLED" className="bg-surface-900">Cancelled</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-surface-500">
                  <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 9l-7 7-7-7"/>
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
