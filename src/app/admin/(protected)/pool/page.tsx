import { prisma } from "@/lib/prisma";

export const revalidate = 0; // Disable cache

export default async function PoolAdminPage() {
  const tickets = await prisma.poolTicket.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-light tracking-wide text-surface-50 mb-2">Pool Tickets</h1>
        <p className="text-sm text-surface-400">Manajemen tiket kolam renang harian.</p>
      </div>

      <div className="bg-surface-900 border border-surface-600/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-surface-800/50 text-surface-400 text-xs uppercase tracking-wider border-b border-surface-600/30">
              <tr>
                <th className="px-6 py-4 font-medium">Ticket ID</th>
                <th className="px-6 py-4 font-medium">Guest</th>
                <th className="px-6 py-4 font-medium">Visit Date</th>
                <th className="px-6 py-4 font-medium">Jumlah</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600/30">
              {tickets.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-surface-500">
                    Belum ada tiket terjual.
                  </td>
                </tr>
              ) : (
                tickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-surface-800/20 transition-colors">
                    <td className="px-6 py-4 text-surface-400 font-mono text-xs">
                      {ticket.id.slice(-8).toUpperCase()}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-surface-100">{ticket.guestName}</p>
                      <p className="text-surface-500 text-xs mt-0.5">{ticket.guestPhone}</p>
                    </td>
                    <td className="px-6 py-4 text-surface-300">
                      {new Date(ticket.visitDate).toLocaleDateString("id-ID", {
                        day: "numeric", month: "short", year: "numeric"
                      })}
                    </td>
                    <td className="px-6 py-4 text-surface-300">
                      {ticket.adultCount + ticket.childCount} Org
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-sm text-[10px] uppercase tracking-widest font-medium border ${
                        ticket.status === 'PAID' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                        ticket.status === 'USED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                        'bg-surface-700 text-surface-400 border-surface-600'
                      }`}>
                        {ticket.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-serif text-surface-100">
                      Rp {ticket.totalPrice.toLocaleString('id-ID')}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
