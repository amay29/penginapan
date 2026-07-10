"use client";

import { useTransition } from "react";
import { updateBookingStatus } from "@/actions/booking-admin";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function BookingsClient({ bookings }: { bookings: any[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleStatusChange = (id: string, newStatus: string) => {
    startTransition(async () => {
      const res = await updateBookingStatus(id, newStatus);
      if (res.error) {
        alert(res.error);
      } else {
        router.refresh();
      }
    });
  };

  return (
    <div>
      <h1 className="mb-8 font-serif text-3xl font-light text-obsidian-900">All Bookings</h1>
      
      <div className="overflow-hidden bg-white border border-parchment-200">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-obsidian-700">
            <thead className="bg-parchment-50 text-[10px] uppercase tracking-widest text-obsidian-500 border-b border-parchment-200">
              <tr>
                <th className="px-6 py-4 font-normal">Guest</th>
                <th className="px-6 py-4 font-normal">Space</th>
                <th className="px-6 py-4 font-normal">Dates</th>
                <th className="px-6 py-4 font-normal">Total</th>
                <th className="px-6 py-4 font-normal">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-parchment-100">
              {bookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-parchment-50 transition-colors">
                  <td className="px-6 py-6">
                    <p className="font-serif text-lg text-obsidian-900 mb-1">{booking.guestName}</p>
                    <p className="text-xs text-obsidian-500 font-sans">{booking.guestEmail}</p>
                    <p className="text-xs text-obsidian-500 font-sans">{booking.guestPhone}</p>
                  </td>
                  <td className="px-6 py-6 font-serif text-lg text-obsidian-900">
                    {booking.unit.name}
                  </td>
                  <td className="px-6 py-6 whitespace-nowrap">
                    <p className="text-sm font-sans">{booking.checkIn.toLocaleDateString()}</p>
                    <p className="text-xs text-obsidian-400 font-sans">to</p>
                    <p className="text-sm font-sans">{booking.checkOut.toLocaleDateString()}</p>
                  </td>
                  <td className="px-6 py-6 font-serif text-lg text-obsidian-900">
                    Rp {booking.totalPrice.toLocaleString('id-ID')}
                  </td>
                  <td className="px-6 py-6">
                    <div className="relative">
                      <select
                        disabled={isPending}
                        value={booking.status}
                        onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                        className={`appearance-none border pl-4 pr-10 py-1.5 text-[10px] uppercase tracking-widest font-sans focus:outline-none focus:border-obsidian-900 cursor-pointer disabled:opacity-50 ${
                          booking.status === "CONFIRMED" ? "bg-green-50 text-green-800 border-green-200" :
                          booking.status === "CANCELLED" ? "bg-red-50 text-red-800 border-red-200" :
                          "bg-parchment-100 text-obsidian-700 border-parchment-200"
                        }`}
                      >
                        <option value="PENDING">Pending</option>
                        <option value="CONFIRMED">Confirmed</option>
                        <option value="CANCELLED">Cancelled</option>
                      </select>
                      {/* Custom dropdown arrow */}
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-obsidian-500">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 9l-7 7-7-7"></path></svg>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
              {bookings.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center text-obsidian-500 font-serif italic border border-dashed border-parchment-300">
                    No bookings found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
