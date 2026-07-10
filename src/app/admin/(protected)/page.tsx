import { prisma } from "@/lib/prisma";
import { format, startOfDay, endOfDay } from "date-fns";

export default async function AdminDashboard() {
  const today = new Date();
  
  // Get today's check-ins
  const checkInsToday = await prisma.booking.findMany({
    where: {
      checkIn: {
        gte: startOfDay(today),
        lte: endOfDay(today)
      },
      status: "CONFIRMED"
    },
    include: { unit: true }
  });

  // Get today's check-outs
  const checkOutsToday = await prisma.booking.findMany({
    where: {
      checkOut: {
        gte: startOfDay(today),
        lte: endOfDay(today)
      },
      status: "CONFIRMED"
    },
    include: { unit: true }
  });

  const totalUnits = await prisma.unit.count();
  const activeBookings = await prisma.booking.count({
    where: { status: "CONFIRMED" }
  });

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold text-earth-900">Dashboard</h1>
      
      <div className="grid gap-6 md:grid-cols-4 mb-10">
        <div className="rounded-2xl bg-white p-6 shadow-sm border border-sand-200">
          <p className="text-sm font-medium text-earth-600 mb-1">Total Units</p>
          <p className="text-3xl font-bold text-earth-900">{totalUnits}</p>
        </div>
        <div className="rounded-2xl bg-white p-6 shadow-sm border border-sand-200">
          <p className="text-sm font-medium text-earth-600 mb-1">Active Bookings</p>
          <p className="text-3xl font-bold text-earth-900">{activeBookings}</p>
        </div>
        <div className="rounded-2xl bg-earth-100 p-6 shadow-sm border border-earth-200">
          <p className="text-sm font-medium text-earth-700 mb-1">Check-ins Today</p>
          <p className="text-3xl font-bold text-earth-900">{checkInsToday.length}</p>
        </div>
        <div className="rounded-2xl bg-sand-200 p-6 shadow-sm border border-sand-300">
          <p className="text-sm font-medium text-earth-700 mb-1">Check-outs Today</p>
          <p className="text-3xl font-bold text-earth-900">{checkOutsToday.length}</p>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="rounded-2xl bg-white p-6 shadow-sm border border-sand-200">
          <h2 className="mb-4 text-lg font-bold text-earth-900">Today's Check-ins</h2>
          {checkInsToday.length === 0 ? (
            <p className="text-earth-600 text-sm">No check-ins today.</p>
          ) : (
            <ul className="space-y-4">
              {checkInsToday.map(b => (
                <li key={b.id} className="flex justify-between items-center border-b border-sand-100 pb-3 last:border-0 last:pb-0">
                  <div>
                    <p className="font-medium text-earth-900">{b.guestName}</p>
                    <p className="text-xs text-earth-600">{b.unit.name}</p>
                  </div>
                  <span className="rounded bg-earth-200 px-2 py-1 text-xs font-semibold text-earth-800">Check-in</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        
        <div className="rounded-2xl bg-white p-6 shadow-sm border border-sand-200">
          <h2 className="mb-4 text-lg font-bold text-earth-900">Today's Check-outs</h2>
          {checkOutsToday.length === 0 ? (
            <p className="text-earth-600 text-sm">No check-outs today.</p>
          ) : (
            <ul className="space-y-4">
              {checkOutsToday.map(b => (
                <li key={b.id} className="flex justify-between items-center border-b border-sand-100 pb-3 last:border-0 last:pb-0">
                  <div>
                    <p className="font-medium text-earth-900">{b.guestName}</p>
                    <p className="text-xs text-earth-600">{b.unit.name}</p>
                  </div>
                  <span className="rounded bg-sand-200 px-2 py-1 text-xs font-semibold text-earth-800">Check-out</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
