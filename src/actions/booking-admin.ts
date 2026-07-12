"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function deleteBooking(id: string) {
  try {
    const session = await getServerSession(authOptions);
    const role = (session?.user as any)?.role;
    if (!session || (role !== "OWNER" && role !== "RECEPTIONIST")) throw new Error("Unauthorized");

    await prisma.booking.delete({ where: { id } });
    revalidatePath("/admin/bookings");
    revalidatePath("/admin");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to delete booking." };
  }
}

export async function updateBookingStatus(id: string, status: string) {
  try {
    const session = await getServerSession(authOptions);
    const role = (session?.user as any)?.role;
    if (!session || (role !== "OWNER" && role !== "RECEPTIONIST")) throw new Error("Unauthorized");

    const booking = await prisma.booking.update({
      where: { id },
      data: { status }
    });
    revalidatePath("/admin/bookings");
    revalidatePath("/admin");
    return { success: true, booking };
  } catch (error: any) {
    return { error: error.message || "Failed to update status." };
  }
}
