import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DollarSign, Activity, CreditCard, BarChart2, TrendingUp, TrendingDown } from "lucide-react";
import RevenueChart, { DailyRevenue } from "@/components/admin/RevenueChart";
import { format, subDays, startOfDay, endOfDay, subWeeks, subMonths, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns";
import { id } from "date-fns/locale";

export const revalidate = 0;

export default async function ReportsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "OWNER") {
    redirect("/admin");
  }

  // Helper to fetch revenue for a specific date range
  const fetchRevenueRange = async (start: Date, end: Date) => {
    const [glamping, cafe, pool] = await Promise.all([
      prisma.booking.aggregate({
        _sum: { totalPrice: true },
        where: { status: { in: ["CONFIRMED", "CHECKED_IN", "COMPLETED"] }, createdAt: { gte: start, lte: end } }
      }),
      prisma.cafeOrder.aggregate({
        _sum: { totalAmount: true },
        where: { status: "COMPLETED", createdAt: { gte: start, lte: end } }
      }),
      prisma.poolTicket.aggregate({
        _sum: { totalPrice: true },
        where: { status: { in: ["PAID", "USED"] }, createdAt: { gte: start, lte: end } }
      })
    ]);
    return {
      glamping: glamping._sum.totalPrice || 0,
      cafe: cafe._sum.totalAmount || 0,
      pool: pool._sum.totalPrice || 0,
      total: (glamping._sum.totalPrice || 0) + (cafe._sum.totalAmount || 0) + (pool._sum.totalPrice || 0)
    };
  };

  const now = new Date();

  // Current Periods
  const todayStart = startOfDay(now);
  const todayEnd = endOfDay(now);
  const thisWeekStart = startOfWeek(now, { weekStartsOn: 1 });
  const thisWeekEnd = endOfWeek(now, { weekStartsOn: 1 });
  const thisMonthStart = startOfMonth(now);
  const thisMonthEnd = endOfMonth(now);

  // Previous Periods
  const yesterdayStart = startOfDay(subDays(now, 1));
  const yesterdayEnd = endOfDay(subDays(now, 1));
  const lastWeekStart = startOfWeek(subWeeks(now, 1), { weekStartsOn: 1 });
  const lastWeekEnd = endOfWeek(subWeeks(now, 1), { weekStartsOn: 1 });
  const lastMonthStart = startOfMonth(subMonths(now, 1));
  const lastMonthEnd = endOfMonth(subMonths(now, 1));

  // Fetch all current data
  const [daily, weekly, monthly] = await Promise.all([
    fetchRevenueRange(todayStart, todayEnd),
    fetchRevenueRange(thisWeekStart, thisWeekEnd),
    fetchRevenueRange(thisMonthStart, thisMonthEnd)
  ]);

  // Fetch all previous data for trends
  const [prevDaily, prevWeekly, prevMonthly] = await Promise.all([
    fetchRevenueRange(yesterdayStart, yesterdayEnd),
    fetchRevenueRange(lastWeekStart, lastWeekEnd),
    fetchRevenueRange(lastMonthStart, lastMonthEnd)
  ]);

  const calculateTrend = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  };

  const cards = [
    { title: "Hari Ini", data: daily, trend: calculateTrend(daily.total, prevDaily.total), vsLabel: "kemarin" },
    { title: "Minggu Ini", data: weekly, trend: calculateTrend(weekly.total, prevWeekly.total), vsLabel: "minggu lalu" },
    { title: "Bulan Ini", data: monthly, trend: calculateTrend(monthly.total, prevMonthly.total), vsLabel: "bulan lalu" },
  ];

  // Fetch last 7 days for the chart
  const last7DaysData: DailyRevenue[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = subDays(now, i);
    const start = startOfDay(d);
    const end = endOfDay(d);
    const rev = await fetchRevenueRange(start, end);
    last7DaysData.push({
      date: format(d, "dd MMM", { locale: id }),
      glamping: rev.glamping,
      cafe: rev.cafe,
      pool: rev.pool
    });
  }

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="font-serif text-3xl font-light tracking-wide text-surface-50 mb-2 flex items-center gap-3">
          <BarChart2 className="h-7 w-7 text-gold-500" /> Laporan Keuangan
        </h1>
        <p className="text-sm text-surface-400">Ringkasan pendapatan dari seluruh divisi bisnis dengan analisis tren.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card, idx) => (
          <div key={idx} className="bg-surface-900 border border-surface-600/30 rounded-sm overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-surface-600/30 bg-surface-800/50 flex justify-between items-center">
              <h2 className="text-sm uppercase tracking-widest text-surface-200">{card.title}</h2>
              {card.trend !== 0 && (
                <div className={`flex items-center gap-1 text-xs font-medium ${card.trend > 0 ? 'text-green-500' : 'text-rose-500'}`}>
                  {card.trend > 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                  {card.trend > 0 ? '+' : ''}{card.trend}%
                </div>
              )}
            </div>
            
            <div className="p-6 flex-1 flex flex-col justify-center">
              <p className="text-[10px] uppercase tracking-widest text-surface-500 mb-1">Total Pendapatan</p>
              <p className="text-3xl font-serif text-gold-400">Rp {card.data.total.toLocaleString("id-ID")}</p>
              <p className="text-xs text-surface-500 mt-2">
                {card.trend > 0 ? 'Naik' : card.trend < 0 ? 'Turun' : 'Sama'} {Math.abs(card.trend)}% dibanding {card.vsLabel}
              </p>
            </div>

            <div className="px-6 py-5 bg-surface-950/50 border-t border-surface-600/30 space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-surface-400 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-amber-500"></span> Glamping
                </span>
                <span className="text-surface-100 font-mono">Rp {card.data.glamping.toLocaleString("id-ID")}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-surface-400 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-rose-500"></span> Kafe
                </span>
                <span className="text-surface-100 font-mono">Rp {card.data.cafe.toLocaleString("id-ID")}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-surface-400 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-cyan-500"></span> Kolam
                </span>
                <span className="text-surface-100 font-mono">Rp {card.data.pool.toLocaleString("id-ID")}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <RevenueChart data={last7DaysData} />
    </div>
  );
}
