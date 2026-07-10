import { prisma } from "@/lib/prisma";

export default async function AdminBookingsPage() {
  const bookings = await prisma.booking.findMany({
    orderBy: { createdAt: "desc" },
    include: { unit: true }
  });

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold text-earth-900">All Bookings</h1>
      
      <div className="overflow-hidden rounded-2xl bg-white shadow-sm border border-sand-200">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-earth-700">
            <thead className="bg-sand-100 text-xs uppercase text-earth-800">
              <tr>
                <th className="px-6 py-4">Guest</th>
                <th className="px-6 py-4">Unit</th>
                <th className="px-6 py-4">Dates</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand-100">
              {bookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-sand-50 smooth-transition">
                  <td className="px-6 py-4">
                    <p className="font-medium text-earth-900">{booking.guestName}</p>
                    <p className="text-xs">{booking.guestEmail}</p>
                    <p className="text-xs">{booking.guestPhone}</p>
                  </td>
                  <td className="px-6 py-4 font-medium text-earth-900">
                    {booking.unit.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p>{booking.checkIn.toLocaleDateString()} -</p>
                    <p>{booking.checkOut.toLocaleDateString()}</p>
                  </td>
                  <td className="px-6 py-4 font-bold text-earth-900">
                    Rp {booking.totalPrice.toLocaleString('id-ID')}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      booking.status === "CONFIRMED" ? "bg-earth-200 text-earth-800" :
                      booking.status === "CANCELLED" ? "bg-red-100 text-red-800" :
                      "bg-sand-200 text-earth-700"
                    }`}>
                      {booking.status}
                    </span>
                  </td>
                </tr>
              ))}
              {bookings.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center">
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
