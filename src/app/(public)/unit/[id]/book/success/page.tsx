import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default async function BookingSuccessPage({ 
  params, 
  searchParams 
}: { 
  params: Promise<{ id: string }>,
  searchParams: Promise<{ bookingId?: string }>
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  
  if (!resolvedSearchParams.bookingId) {
    notFound();
  }

  const booking = await prisma.booking.findUnique({
    where: { id: resolvedSearchParams.bookingId },
    include: { unit: true }
  });

  if (!booking || booking.unitId !== resolvedParams.id) {
    notFound();
  }

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center bg-sand-50 py-12 px-4">
      <div className="w-full max-w-lg rounded-3xl bg-white p-8 text-center shadow-xl sm:p-12">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-earth-100 text-earth-700">
          <CheckCircle className="h-10 w-10" />
        </div>
        <h1 className="mb-2 text-3xl font-bold text-earth-900">Booking Confirmed!</h1>
        <p className="mb-8 text-earth-600">
          Thank you, {booking.guestName}. Your stay at <strong>{booking.unit.name}</strong> is successfully booked.
        </p>

        <div className="mb-8 rounded-2xl border border-sand-200 bg-sand-50 p-6 text-left">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-earth-800">Booking Details</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-earth-600">Booking ID</span>
              <span className="font-mono font-medium text-earth-900">{booking.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-earth-600">Check-in</span>
              <span className="font-medium text-earth-900">{booking.checkIn.toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-earth-600">Check-out</span>
              <span className="font-medium text-earth-900">{booking.checkOut.toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between border-t border-sand-200 pt-3">
              <span className="font-semibold text-earth-900">Total Paid</span>
              <span className="font-bold text-earth-900">Rp {booking.totalPrice.toLocaleString('id-ID')}</span>
            </div>
          </div>
        </div>

        <Link
          href="/"
          className="inline-block w-full rounded-lg bg-earth-800 py-4 font-bold text-white smooth-transition hover:bg-earth-900"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
}
