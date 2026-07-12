import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DollarSign, Activity, CreditCard, BarChart2 } from "lucide-react";

export const revalidate = 0;

export default async function ReportsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "OWNER") {
    redirect("/admin");
  }

  // Get current date boundaries
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay()); // Sunday as start of week

  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  // Fetch Revenue
  const fetchRevenues = async (startDate: Date) => {
    const [glamping, cafe, pool] = await Promise.all([
      prisma.booking.aggregate({
        _sum: { totalPrice: true },
        where: { status: { in: ["CONFIRMED", "CHECKED_IN", "COMPLETED"] }, createdAt: { gte: startDate } }
      }),
      prisma.cafeOrder.aggregate({
        _sum: { totalAmount: true },
        where: { status: "COMPLETED", createdAt: { gte: startDate } }
      }),
      prisma.poolTicket.aggregate({
        _sum: { totalPrice: true },
        where: { status: { in: ["PAID", "USED"] }, createdAt: { gte: startDate } }
      })
    ]);
    return {
      glamping: glamping._sum.totalPrice || 0,
      cafe: cafe._sum.totalAmount || 0,
      pool: pool._sum.totalPrice || 0,
      total: (glamping._sum.totalPrice || 0) + (cafe._sum.totalAmount || 0) + (pool._sum.totalPrice || 0)
    };
  };

  const [daily, weekly, monthly] = await Promise.all([
    fetchRevenues(today),
    fetchRevenues(startOfWeek),
    fetchRevenues(startOfMonth)
  ]);

  const cards = [
    { title: "Hari Ini", data: daily },
    { title: "Minggu Ini", data: weekly },
    { title: "Bulan Ini", data: monthly },
  ];

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="font-serif text-3xl font-light tracking-wide text-surface-50 mb-2 flex items-center gap-3">
          <BarChart2 className="h-7 w-7 text-gold-500" /> Laporan Keuangan
        </h1>
        <p className="text-sm text-surface-400">Ringkasan pendapatan dari seluruh divisi bisnis.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card, idx) => (
          <div key={idx} className="bg-surface-900 border border-surface-600/30 rounded-sm overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-surface-600/30 bg-surface-800/50">
              <h2 className="text-sm uppercase tracking-widest text-surface-200">{card.title}</h2>
            </div>
            
            <div className="p-6 flex-1 flex flex-col justify-center">
              <p className="text-[10px] uppercase tracking-widest text-surface-500 mb-1">Total Pendapatan</p>
              <p className="text-3xl font-serif text-gold-400">Rp {card.data.total.toLocaleString("id-ID")}</p>
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
    </div>
  );
}
