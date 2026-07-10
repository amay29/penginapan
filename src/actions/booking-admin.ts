"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateBookingStatus(id: string, status: string) {
  try {
    const booking = await prisma.booking.update({
      where: { id },
      data: { status }
    });
    revalidatePath("/admin/bookings");
    revalidatePath("/admin"); // update dashboard stats
    return { success: true, booking };
  } catch (error: any) {
    console.error("Error updating booking status:", error);
    return { error: error.message || "Failed to update status." };
  }
}
