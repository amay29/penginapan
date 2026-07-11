"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function validateTicket(qrCodeToken: string) {
  try {
    const ticket = await prisma.poolTicket.findUnique({
      where: { qrCode: qrCodeToken }
    });

    if (!ticket) {
      return { success: false, error: "Tiket tidak ditemukan atau QR Code tidak valid." };
    }

    if (ticket.status === "USED") {
      return { success: false, error: `Tiket sudah digunakan pada ${new Date(ticket.updatedAt).toLocaleString('id-ID')}` };
    }

    if (ticket.status === "EXPIRED") {
      return { success: false, error: "Tiket sudah kedaluwarsa." };
    }

    // Mark as used
    const updated = await prisma.poolTicket.update({
      where: { id: ticket.id },
      data: { status: "USED" }
    });

    revalidatePath("/admin/pool");
    revalidatePath("/admin/validasi-tiket");

    return { 
      success: true, 
      ticket: {
        id: updated.id,
        guestName: updated.guestName,
        guestPhone: updated.guestPhone,
        adultCount: updated.adultCount,
        childCount: updated.childCount,
        visitDate: updated.visitDate
      }
    };

  } catch (error) {
    console.error("Error validating ticket:", error);
    return { success: false, error: "Terjadi kesalahan sistem." };
  }
}
