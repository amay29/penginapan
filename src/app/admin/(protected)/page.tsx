import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowRight, TrendingUp, CalendarCheck, Home, Clock } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role || "USER";

  if (role === "RECEPTIONIST") redirect("/admin/bookings");
  if (role === "CAFE_CASHIER") redirect("/admin/cafe/pos");
  if (role === "POOL_SECURITY") redirect("/admin/validasi-tiket");

  const [
    totalBookings, confirmedBookings, pendingBookings, totalUnits, totalRevenueData, recentBookings,
    totalCafeRevenueData,
    totalPoolRevenueData,
    recentPoolTickets,
    recentCafeOrders
  ] = await Promise.all([
    prisma.booking.count(),
    prisma.booking.count({ where: { status: "CONFIRMED" } }),
    prisma.booking.count({ where: { status: "PENDING" } }),
    prisma.unit.count(),
    prisma.booking.aggregate({ _sum: { totalPrice: true }, where: { status: { in: ["CONFIRMED", "CHECKED_IN", "COMPLETED"] } } }),
    prisma.booking.findMany({ take: 5, orderBy: { createdAt: "desc" }, include: { unit: true } }),
    prisma.cafeOrder.aggregate({ _sum: { totalAmount: true }, where: { status: "COMPLETED" } }),
    prisma.poolTicket.aggregate({ _sum: { totalPrice: true }, where: { status: { in: ["PAID", "USED"] } } }),
    prisma.poolTicket.findMany({ take: 5, orderBy: { createdAt: "desc" } }),
    prisma.cafeOrder.findMany({ take: 5, orderBy: { createdAt: "desc" } })
  ]);

  const glampingRevenue = totalRevenueData._sum.totalPrice || 0;
  const cafeRevenue = totalCafeRevenueData._sum.totalAmount || 0;
  const poolRevenue = totalPoolRevenueData._sum.totalPrice || 0;
  const grandTotal = glampingRevenue + cafeRevenue + poolRevenue;

  const stats = [
    {
      icon: TrendingUp,
      label: "Total Unified Revenue",
      value: `Rp ${grandTotal.toLocaleString("id-ID")}`,
      sub: `From all divisions`,
      valueClass: "text-gold-400",
    },
    {
      icon: Home,
      label: "Glamping Revenue",
      value: `Rp ${glampingRevenue.toLocaleString("id-ID")}`,
      sub: `${confirmedBookings} active bookings`,
      valueClass: "text-surface-100",
    },
    {
      icon: Clock,
      label: "Cafe Revenue",
      value: `Rp ${cafeRevenue.toLocaleString("id-ID")}`,
      sub: `completed orders`,
      valueClass: "text-surface-100",
    },
    {
      icon: CalendarCheck,
      label: "Pool Revenue",
      value: `Rp ${poolRevenue.toLocaleString("id-ID")}`,
      sub: `paid tickets`,
      valueClass: "text-surface-100",
    },
  ];

  // Combine recent activity
  const allRecent = [
    ...recentBookings.map(b => ({
      id: b.id,
      type: "BOOKING",
      title: b.guestName,
      desc: `${b.unit.name} · ${b.checkIn.toLocaleDateString("id-ID")}`,
      amount: b.totalPrice,
      status: b.status,
      date: b.createdAt
    })),
    ...recentPoolTickets.map(p => ({
      id: p.id,
      type: "POOL",
      title: p.guestName,
      desc: `${p.adultCount + p.childCount} Orang`,
      amount: p.totalPrice,
      status: p.status,
      date: p.createdAt
    })),
    ...recentCafeOrders.map(c => ({
      id: c.id,
      type: "CAFE",
      title: c.guestName || c.tableNumber || "Walk-in",
      desc: c.paymentMethod,
      amount: c.totalAmount,
      status: c.status,
      date: c.createdAt
    }))
  ].sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 10);

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

      {/* Recent Activity */}
      <div className="bg-surface-800 border border-surface-600/30 rounded-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-600/30">
          <h2 className="text-sm font-medium text-surface-200 tracking-wide">Recent Activity</h2>
        </div>
        <div className="divide-y divide-surface-600/20">
          {allRecent.length === 0 && (
            <p className="px-6 py-10 text-sm text-surface-500 italic font-serif text-center">No activity yet.</p>
          )}
          {allRecent.map((item) => (
            <div key={item.id} className="flex items-center justify-between px-6 py-4 hover:bg-surface-700/30 transition-colors duration-200">
              <div>
                <div className="flex items-center gap-2">
                  <span className={`text-[8px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded-sm ${
                    item.type === "BOOKING" ? "bg-amber-900/40 text-amber-500" :
                    item.type === "POOL" ? "bg-cyan-900/40 text-cyan-500" :
                    "bg-rose-900/40 text-rose-500"
                  }`}>
                    {item.type}
                  </span>
                  <p className="text-sm text-surface-100 font-medium">{item.title}</p>
                </div>
                <p className="text-xs text-surface-400 mt-1">
                  {item.desc}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <p className="text-sm font-serif text-surface-200">Rp {item.amount.toLocaleString("id-ID")}</p>
                <span className={`text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-full border ${
                  ["CONFIRMED", "CHECKED_IN", "COMPLETED", "PAID", "USED"].includes(item.status) ? "bg-gold-700/20 text-gold-400 border-gold-700/30" :
                  ["CANCELLED", "EXPIRED"].includes(item.status) ? "bg-red-900/20 text-red-400 border-red-900/30" :
                  "bg-surface-700 text-surface-400 border-surface-600/40"
                }`}>
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
