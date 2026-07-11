"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function markTicketAsPaid(ticketId: string) {
  try {
    await prisma.poolTicket.update({
      where: { id: ticketId },
      data: { status: "PAID" },
    });
    revalidatePath("/admin/pool");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
