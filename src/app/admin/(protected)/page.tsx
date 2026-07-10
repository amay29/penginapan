import { prisma } from "@/lib/prisma";
import { startOfDay, endOfDay } from "date-fns";

export default async function AdminDashboard() {
  const today = new Date();

  const [checkInsToday, checkOutsToday, totalUnits, activeBookings, recentBookings] = await Promise.all([
    prisma.booking.findMany({
      where: { checkIn: { gte: startOfDay(today), lte: endOfDay(today) }, status: "CONFIRMED" },
      include: { unit: true }
    }),
    prisma.booking.findMany({
      where: { checkOut: { gte: startOfDay(today), lte: endOfDay(today) }, status: "CONFIRMED" },
      include: { unit: true }
    }),
    prisma.unit.count(),
    prisma.booking.count({ where: { status: "CONFIRMED" } }),
    prisma.booking.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { unit: { select: { name: true } } }
    })
  ]);

  const stats = [
    { label: "Total Units", value: totalUnits, sub: "properties managed" },
    { label: "Active Bookings", value: activeBookings, sub: "confirmed reservations" },
    { label: "Check-ins Today", value: checkInsToday.length, sub: today.toLocaleDateString("en-GB", { day: "numeric", month: "long" }) },
    { label: "Check-outs Today", value: checkOutsToday.length, sub: today.toLocaleDateString("en-GB", { day: "numeric", month: "long" }) },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-12 border-b border-parchment-300 pb-8">
        <p className="mb-2 text-[9px] uppercase tracking-[0.25em] text-obsidian-400">
          {today.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        </p>
        <h1 className="font-serif text-4xl font-light text-obsidian-900 md:text-5xl">Good morning.</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-12 md:grid-cols-4">
        {stats.map(({ label, value, sub }) => (
          <div key={label} className="border border-parchment-300 bg-white p-6">
            <p className="text-[9px] uppercase tracking-[0.25em] text-obsidian-400 mb-4">{label}</p>
            <p className="font-serif text-5xl font-light text-obsidian-900 mb-1">{value}</p>
            <p className="text-xs text-obsidian-400">{sub}</p>
          </div>
        ))}
      </div>

      {/* Today's activity */}
      <div className="grid gap-8 md:grid-cols-2 mb-12">
        {[
          { title: "Check-ins", list: checkInsToday, badge: "Arriving" },
          { title: "Check-outs", list: checkOutsToday, badge: "Departing" },
        ].map(({ title, list, badge }) => (
          <div key={title} className="border border-parchment-300 bg-white">
            <div className="border-b border-parchment-200 px-6 py-4">
              <p className="text-[9px] uppercase tracking-[0.25em] text-obsidian-400">Today's {title}</p>
            </div>
            <div className="p-6">
              {list.length === 0 ? (
                <p className="text-sm text-obsidian-400 italic">None scheduled for today.</p>
              ) : (
                <ul className="space-y-4">
                  {list.map((b) => (
                    <li key={b.id} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-obsidian-900">{b.guestName}</p>
                        <p className="text-xs text-obsidian-400">{b.unit.name}</p>
                      </div>
                      <span className="border border-parchment-300 px-3 py-1 text-[9px] uppercase tracking-[0.15em] text-obsidian-600">
                        {badge}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Recent bookings */}
      <div className="border border-parchment-300 bg-white">
        <div className="border-b border-parchment-200 px-6 py-4 flex items-center justify-between">
          <p className="text-[9px] uppercase tracking-[0.25em] text-obsidian-400">Recent Reservations</p>
          <a href="/admin/bookings" className="text-[9px] uppercase tracking-[0.2em] text-obsidian-500 hover:text-obsidian-900 transition-colors">View All →</a>
        </div>
        <div className="divide-y divide-parchment-100">
          {recentBookings.map((b) => (
            <div key={b.id} className="flex items-center justify-between px-6 py-4">
              <div>
                <p className="text-sm text-obsidian-900">{b.guestName}</p>
                <p className="text-xs text-obsidian-400">{b.unit.name} · {b.checkIn.toLocaleDateString()} – {b.checkOut.toLocaleDateString()}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-obsidian-900">Rp {b.totalPrice.toLocaleString("id-ID")}</p>
                <span className={`text-[9px] uppercase tracking-[0.15em] ${b.status === "CONFIRMED" ? "text-obsidian-600" : "text-red-500"}`}>
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
