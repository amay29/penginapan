import { prisma } from "@/lib/prisma";
import POSClient from "./POSClient";

export const revalidate = 0;

export default async function CafePOSPage() {
  const [menuItems, activeBookings] = await Promise.all([
    prisma.cafeItem.findMany({
      where: { isAvailable: true },
      orderBy: { category: "asc" }
    }),
    prisma.booking.findMany({
      where: { status: "CONFIRMED" },
      include: { unit: true },
      orderBy: { checkIn: "asc" }
    })
  ]);

  return <POSClient menuItems={menuItems} activeBookings={activeBookings} />;
}
