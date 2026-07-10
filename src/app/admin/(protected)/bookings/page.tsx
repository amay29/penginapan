import { prisma } from "@/lib/prisma";
import BookingsClient from "./BookingsClient";

export default async function AdminBookingsPage() {
  const bookings = await prisma.booking.findMany({
    orderBy: { createdAt: "desc" },
    include: { unit: true }
  });

  return <BookingsClient bookings={bookings} />;
}
