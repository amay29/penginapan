import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import BookingClient from "./BookingClient";

export default async function BookUnitPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const unit = await prisma.unit.findUnique({
    where: { id: resolvedParams.id }
  });

  if (!unit) {
    notFound();
  }

  // Fetch all active bookings for this unit to disable dates
  const activeBookings = await prisma.booking.findMany({
    where: {
      unitId: unit.id,
      status: { not: "CANCELLED" },
      checkOut: { gte: new Date() } // Only bookings that haven't ended yet
    },
    select: {
      checkIn: true,
      checkOut: true,
    }
  });

  return (
    <div className="bg-sand-50 py-12 min-h-screen">
      <div className="container mx-auto px-4 md:px-8">
        <div className="mb-8 max-w-3xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-earth-900 md:text-4xl">Book {unit.name}</h1>
          <p className="mt-2 text-earth-600">Select your dates and fill in your details to secure your stay.</p>
        </div>

        <BookingClient unit={unit} existingBookings={activeBookings} />
      </div>
    </div>
  );
}
