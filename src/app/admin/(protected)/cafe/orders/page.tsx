import { prisma } from "@/lib/prisma";
import { Coffee, ReceiptText } from "lucide-react";

export const revalidate = 0;

export default async function CafeOrdersPage() {
  const orders = await prisma.cafeOrder.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      items: {
        include: { item: true }
      },
      booking: {
        include: { unit: true }
      }
    }
  });

  return (
    <div className="space-y-8 max-w-6xl">
      <div>
        <h1 className="font-serif text-3xl font-light tracking-wide text-surface-50 mb-2">Riwayat Pesanan</h1>
        <p className="text-sm text-surface-400">Daftar transaksi Rosa Cafe.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {orders.length === 0 ? (
          <div className="col-span-full p-8 text-center text-surface-500 bg-surface-900 border border-surface-600/30">
            Belum ada transaksi.
          </div>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="bg-surface-900 border border-surface-600/30 p-5 flex flex-col justify-between h-full">
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-surface-50 font-medium">
                      {order.paymentMethod === "ROOM_CHARGE" && order.booking 
                        ? `${order.booking.unit.name} (${order.booking.guestName})`
                        : (order.guestName || "Walk-in Customer")}
                    </p>
                    <p className="text-xs text-surface-500 mt-1">
                      {new Date(order.createdAt).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" })}
                    </p>
                  </div>
                  <span className={`text-[9px] uppercase tracking-widest px-2 py-1 rounded-sm font-semibold border ${
                    order.paymentMethod === 'ROOM_CHARGE' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                    order.paymentMethod === 'QRIS' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                    'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  }`}>
                    {order.paymentMethod.replace("_", " ")}
                  </span>
                </div>

                <div className="space-y-2 mb-6">
                  {order.items.map(orderItem => (
                    <div key={orderItem.id} className="flex justify-between text-sm">
                      <span className="text-surface-300"><span className="text-surface-500">{orderItem.quantity}x</span> {orderItem.item.name}</span>
                      <span className="text-surface-400 font-mono">{(orderItem.subtotal).toLocaleString('id-ID')}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-surface-600/30 flex items-center justify-between mt-auto">
                <span className="text-[10px] uppercase tracking-widest text-surface-500 flex items-center gap-1">
                  <ReceiptText className="h-3 w-3" /> Total
                </span>
                <span className="font-serif text-lg text-gold-400">
                  Rp {order.totalAmount.toLocaleString('id-ID')}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
