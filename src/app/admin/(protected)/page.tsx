import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowRight, TrendingUp, CalendarCheck, Home, Clock } from "lucide-react";

export default async function AdminDashboardPage() {
  const [totalBookings, confirmedBookings, pendingBookings, totalUnits, totalRevenueData, recentBookings] = await Promise.all([
    prisma.booking.count(),
    prisma.booking.count({ where: { status: "CONFIRMED" } }),
    prisma.booking.count({ where: { status: "PENDING" } }),
    prisma.unit.count(),
    prisma.booking.aggregate({ _sum: { totalPrice: true }, where: { status: "CONFIRMED" } }),
    prisma.booking.findMany({ take: 5, orderBy: { createdAt: "desc" }, include: { unit: true } }),
  ]);

  const totalRevenue = totalRevenueData._sum.totalPrice || 0;

  const stats = [
    {
      icon: TrendingUp,
      label: "Confirmed Revenue",
      value: `Rp ${totalRevenue.toLocaleString("id-ID")}`,
      sub: `from ${confirmedBookings} confirmed bookings`,
      valueClass: "text-gold-400",
    },
    {
      icon: CalendarCheck,
      label: "Total Bookings",
      value: String(totalBookings),
      sub: `${confirmedBookings} confirmed · ${pendingBookings} pending`,
      valueClass: "text-surface-100",
    },
    {
      icon: Clock,
      label: "Awaiting Review",
      value: String(pendingBookings),
      sub: "pending confirmation",
      valueClass: pendingBookings > 0 ? "text-amber-300" : "text-surface-100",
    },
    {
      icon: Home,
      label: "Active Spaces",
      value: String(totalUnits),
      sub: "properties listed",
      valueClass: "text-surface-100",
    },
  ];

  return (
    <div className="max-w-5xl space-y-10">
      {/* Header */}
      <div className="border-b border-surface-600/30 pb-6">
        <h1 className="font-serif text-3xl font-light text-surface-100 tracking-wide">Overview</h1>
        <p className="mt-1 text-sm text-surface-400">Property management at a glance.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-surface-800 border border-surface-600/30 rounded-sm p-5 space-y-3 hover:border-surface-500/50 transition-colors duration-300">
            <s.icon className="h-4 w-4 text-surface-500" strokeWidth={1.5} />
            <div>
              <p className={`font-serif text-3xl font-light ${s.valueClass}`}>{s.value}</p>
              <p className="mt-1 text-[9px] uppercase tracking-[0.25em] text-surface-500">{s.label}</p>
              <p className="mt-1 text-xs text-surface-500">{s.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Bookings */}
      <div className="bg-surface-800 border border-surface-600/30 rounded-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-600/30">
          <h2 className="text-sm font-medium text-surface-200 tracking-wide">Recent Bookings</h2>
          <Link href="/admin/bookings" className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-surface-500 hover:text-gold-300 transition-colors">
            View All <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="divide-y divide-surface-600/20">
          {recentBookings.length === 0 && (
            <p className="px-6 py-10 text-sm text-surface-500 italic font-serif text-center">No bookings yet.</p>
          )}
          {recentBookings.map((b) => (
            <div key={b.id} className="flex items-center justify-between px-6 py-4 hover:bg-surface-700/30 transition-colors duration-200">
              <div>
                <p className="text-sm text-surface-100 font-medium">{b.guestName}</p>
                <p className="text-xs text-surface-400 mt-0.5">
                  {b.unit.name} · {b.checkIn.toLocaleDateString("id-ID")} – {b.checkOut.toLocaleDateString("id-ID")}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <p className="text-sm font-serif text-surface-200">Rp {b.totalPrice.toLocaleString("id-ID")}</p>
                <span className={`text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-full border ${
                  b.status === "CONFIRMED" ? "bg-gold-700/20 text-gold-400 border-gold-700/30" :
                  b.status === "CANCELLED" ? "bg-red-900/20 text-red-400 border-red-900/30" :
                  "bg-surface-700 text-surface-400 border-surface-600/40"
                }`}>
                  {b.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
