"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { sendPoolTicketEmail } from "@/lib/email";
import crypto from "crypto";

interface BuyTicketParams {
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  visitDate: Date;
  adultCount: number;
  childCount: number;
  totalPrice: number;
}

export async function buyPoolTicket(params: BuyTicketParams) {
  try {
    const qrCodeToken = crypto.randomUUID();

    const ticket = await prisma.poolTicket.create({
      data: {
        guestName:  params.guestName,
        guestEmail: params.guestEmail,
        guestPhone: params.guestPhone,
        visitDate:  params.visitDate,
        adultCount: params.adultCount,
        childCount: params.childCount,
        totalPrice: params.totalPrice,
        status:     "PAID", // Assuming successful payment integration flow
        qrCode:     qrCodeToken,
      },
    });

    sendPoolTicketEmail(ticket).catch(console.error);

    revalidatePath(`/admin/pool`);
    return { success: true, ticketId: ticket.id };

  } catch (error: any) {
    console.error("Pool ticket error:", error);
    return { error: "Gagal memproses tiket. Coba lagi nanti." };
  }
}
