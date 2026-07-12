"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function markTicketAsPaid(ticketId: string) {
  try {
    const session = await getServerSession(authOptions);
    const role = (session?.user as any)?.role;
    if (!session || (role !== "OWNER" && role !== "POOL_SECURITY")) throw new Error("Unauthorized");

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
