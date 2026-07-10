import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export default async function BookingSuccessPage({ 
  params, 
  searchParams 
}: { 
  params: Promise<{ id: string }>,
  searchParams: Promise<{ bookingId?: string }>
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  
  if (!resolvedSearchParams.bookingId) notFound();

  const booking = await prisma.booking.findUnique({
    where: { id: resolvedSearchParams.bookingId },
    include: { unit: true }
  });

  if (!booking || booking.unitId !== resolvedParams.id) notFound();

  const nights = Math.round(
    (new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="min-h-screen bg-parchment-50 flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-lg">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-obsidian-900 mb-8">
            <CheckCircle2 className="h-7 w-7 text-gold-400" strokeWidth={1.5} />
          </div>
          <h1 className="font-serif text-4xl font-light text-obsidian-900 mb-3">
            Reservation Confirmed
          </h1>
          <p className="text-sm text-obsidian-500 leading-relaxed">
            Thank you, <span className="text-obsidian-900 font-medium">{booking.guestName}</span>.<br />
            We look forward to welcoming you to {booking.unit.name}.
          </p>
        </div>

        {/* Details Card */}
        <div className="border border-parchment-300 bg-white">
          <div className="px-8 py-5 border-b border-parchment-200">
            <p className="text-[9px] uppercase tracking-[0.3em] text-obsidian-400">Booking Summary</p>
          </div>

          <div className="px-8 py-6 space-y-5">
            <div className="flex justify-between items-center">
              <span className="text-xs uppercase tracking-widest text-obsidian-400">Booking ID</span>
              <span className="font-mono text-xs text-obsidian-700 bg-parchment-100 px-3 py-1 rounded">
                {booking.id.slice(0, 8).toUpperCase()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs uppercase tracking-widest text-obsidian-400">Space</span>
              <span className="font-serif text-base text-obsidian-900">{booking.unit.name}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs uppercase tracking-widest text-obsidian-400">Check-in</span>
              <span className="text-sm text-obsidian-800">
                {new Date(booking.checkIn).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs uppercase tracking-widest text-obsidian-400">Check-out</span>
              <span className="text-sm text-obsidian-800">
                {new Date(booking.checkOut).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs uppercase tracking-widest text-obsidian-400">Duration</span>
              <span className="text-sm text-obsidian-800">{nights} malam</span>
            </div>

            <div className="flex justify-between items-center pt-5 border-t border-parchment-200">
              <span className="text-xs uppercase tracking-widest text-obsidian-700 font-medium">Total</span>
              <span className="font-serif text-2xl text-obsidian-900">
                Rp {booking.totalPrice.toLocaleString("id-ID")}
              </span>
            </div>
          </div>
        </div>

        {/* Info note */}
        <p className="mt-6 text-center text-xs text-obsidian-400 leading-relaxed">
          Simpan halaman ini sebagai bukti reservasi Anda.<br />
          Tim kami akan menghubungi Anda melalui WhatsApp sebelum kedatangan.
        </p>

        {/* Actions */}
        <div className="mt-8 flex flex-col gap-3">
          <Link
            href="/"
            className="block w-full bg-obsidian-900 py-4 text-center text-[10px] uppercase tracking-[0.3em] text-parchment-50 hover:bg-obsidian-800 transition-colors duration-300"
          >
            Back to Damar
          </Link>
          <Link
            href={`/unit/${booking.unitId}`}
            className="block w-full border border-parchment-300 py-3 text-center text-[10px] uppercase tracking-[0.3em] text-obsidian-600 hover:border-obsidian-400 hover:text-obsidian-900 transition-colors duration-300"
          >
            View Space Details
          </Link>
        </div>
      </div>
    </div>
  );
}
