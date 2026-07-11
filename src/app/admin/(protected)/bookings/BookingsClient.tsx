"use client";

import { useState, useTransition, useMemo } from "react";
import { updateBookingStatus, deleteBooking } from "@/actions/booking-admin";
import { Trash2, Search, List, Calendar as CalendarIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import CalendarView from "./CalendarView";

const STATUS_STYLE: Record<string, string> = {
  CONFIRMED: "bg-gold-700/20 text-gold-400 border-gold-700/30",
  CANCELLED: "bg-red-900/20 text-red-400 border-red-900/30",
  PENDING:   "bg-surface-700 text-surface-400 border-surface-600/40",
  CHECKED_IN: "bg-emerald-900/20 text-emerald-400 border-emerald-900/30",
  COMPLETED: "bg-blue-900/20 text-blue-400 border-blue-900/30",
};

const ALL_STATUSES = ["ALL", "PENDING", "CONFIRMED", "CHECKED_IN", "COMPLETED", "CANCELLED"];

export default function BookingsClient({ bookings }: { bookings: any[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [activeTab, setActiveTab] = useState<"list" | "calendar">("list");

  const filtered = useMemo(() => {
    return bookings.filter(b => {
      const matchSearch = search === "" ||
        b.guestName.toLowerCase().includes(search.toLowerCase()) ||
        b.guestEmail.toLowerCase().includes(search.toLowerCase()) ||
        b.unit.name.toLowerCase().includes(search.toLowerCase());
      const matchStatus = filterStatus === "ALL" || b.status === filterStatus;
      return matchSearch && matchStatus;
    });
  }, [bookings, search, filterStatus]);

  const handleStatusChange = (id: string, newStatus: string) => {
    startTransition(async () => {
      const res = await updateBookingStatus(id, newStatus);
      if (res.error) alert(res.error);
      else router.refresh();
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm("Delete this booking permanently? This cannot be undone.")) return;
    startTransition(async () => {
      const res = await deleteBooking(id);
      if (res.error) alert(res.error);
      else router.refresh();
    });
  };

  return (
    <div className="max-w-5xl space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end border-b border-surface-600/30 pb-6 gap-4">
        <div>
          <h1 className="font-serif text-3xl font-light text-surface-100 tracking-wide">Bookings</h1>
          <p className="mt-1 text-sm text-surface-400">
            {bookings.length} reservation{bookings.length !== 1 ? "s" : ""}
          </p>
        </div>
        
        <div className="flex bg-surface-900 rounded-sm border border-surface-600/30 p-1">
          <button 
            onClick={() => setActiveTab("list")}
            className={`flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-widest transition-colors ${activeTab === 'list' ? 'bg-surface-800 text-surface-100' : 'text-surface-500 hover:text-surface-300'}`}
          >
            <List className="h-3 w-3" /> List View
          </button>
          <button 
            onClick={() => setActiveTab("calendar")}
            className={`flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-widest transition-colors ${activeTab === 'calendar' ? 'bg-surface-800 text-surface-100' : 'text-surface-500 hover:text-surface-300'}`}
          >
            <CalendarIcon className="h-3 w-3" /> Calendar
          </button>
        </div>
      </div>

      {activeTab === "calendar" ? (
        <CalendarView bookings={bookings} />
      ) : (
        <>
          {/* Search + Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-surface-500 pointer-events-none" />
              <input
                type="text"
                placeholder="Search by guest, email, or space..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-surface-800 border border-surface-600/30 text-sm text-surface-100 placeholder:text-surface-500 focus:outline-none focus:border-gold-600 rounded-sm transition-colors"
              />
            </div>
            <div className="flex gap-1.5">
              {ALL_STATUSES.map(s => (
                <button
                  key={s}
                  onClick={() => setFilterStatus(s)}
                  className={`px-4 py-2 text-[9px] uppercase tracking-widest rounded-sm transition-colors duration-200 ${
                    filterStatus === s
                      ? "bg-surface-100 text-surface-950"
                      : "bg-surface-800 border border-surface-600/30 text-surface-400 hover:text-surface-100"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="bg-surface-800 border border-surface-600/30 rounded-sm overflow-hidden">
            {/* Column Headers */}
            <div className="hidden lg:grid grid-cols-[1.4fr_1.2fr_1fr_auto_auto_auto] gap-4 px-6 py-3 border-b border-surface-600/30 bg-surface-900/50">
              {["Guest", "Space & Dates", "Total", "Status", "Actions", ""].map((h, i) => (
                <p key={i} className="text-[9px] uppercase tracking-[0.25em] text-surface-500">{h}</p>
              ))}
            </div>

            {/* Rows */}
            <div className="divide-y divide-surface-600/20">
              {filtered.length === 0 && (
                <p className="px-6 py-12 text-sm italic text-surface-500 font-serif text-center">
                  {search || filterStatus !== "ALL" ? "No bookings match your filter." : "No bookings found."}
                </p>
              )}
              {filtered.map((booking) => (
                <div
                  key={booking.id}
                  className="grid grid-cols-1 lg:grid-cols-[1.4fr_1.2fr_1fr_auto_auto_auto] gap-4 items-center px-6 py-5 hover:bg-surface-700/20 transition-colors duration-200"
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
                    {booking.guestCount && (
                      <p className="text-xs text-surface-500 mt-0.5">{booking.guestCount} tamu</p>
                    )}
                  </div>

                  {/* Total */}
                  <p className="text-sm font-serif text-surface-100 whitespace-nowrap">
                    Rp {booking.totalPrice.toLocaleString("id-ID")}
                  </p>

                  {/* Status Badge */}
                  <span className={`text-[9px] uppercase tracking-widest px-3 py-1 border rounded-full whitespace-nowrap w-fit ${STATUS_STYLE[booking.status] ?? STATUS_STYLE.PENDING}`}>
                    {booking.status}
                  </span>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    {booking.status === "PENDING" && (
                      <>
                        <button
                          onClick={() => handleStatusChange(booking.id, "CONFIRMED")}
                          disabled={isPending}
                          className="px-3 py-1.5 bg-gold-600 text-surface-950 text-[10px] uppercase tracking-widest font-semibold rounded-sm hover:bg-gold-500 transition-colors disabled:opacity-50"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => handleStatusChange(booking.id, "CANCELLED")}
                          disabled={isPending}
                          className="px-3 py-1.5 bg-surface-700 text-red-400 text-[10px] uppercase tracking-widest font-semibold rounded-sm hover:bg-surface-600 transition-colors disabled:opacity-50"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {booking.status === "CONFIRMED" && (
                      <button
                        onClick={() => handleStatusChange(booking.id, "CHECKED_IN")}
                        disabled={isPending}
                        className="px-3 py-1.5 bg-emerald-600 text-surface-950 text-[10px] uppercase tracking-widest font-semibold rounded-sm hover:bg-emerald-500 transition-colors disabled:opacity-50"
                      >
                        Check In
                      </button>
                    )}
                    {booking.status === "CHECKED_IN" && (
                      <button
                        onClick={() => handleStatusChange(booking.id, "COMPLETED")}
                        disabled={isPending}
                        className="px-3 py-1.5 bg-blue-600 text-surface-950 text-[10px] uppercase tracking-widest font-semibold rounded-sm hover:bg-blue-500 transition-colors disabled:opacity-50"
                      >
                        Check Out
                      </button>
                    )}
                    {(booking.status === "COMPLETED" || booking.status === "CANCELLED") && (
                      <span className="text-[10px] text-surface-500 italic tracking-wider">—</span>
                    )}
                  </div>

                  {/* Delete */}
                  <button
                    onClick={() => handleDelete(booking.id)}
                    disabled={isPending}
                    className="p-1.5 text-surface-600 hover:text-red-400 disabled:opacity-50 transition-colors duration-200"
                    title="Delete booking"
                  >
                    <Trash2 className="h-4 w-4" strokeWidth={1.5} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
