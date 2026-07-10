"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { sendBookingConfirmationEmail, sendAdminNotificationEmail } from "@/lib/email";

interface SubmitBookingParams {
  unitId: string;
  checkIn: Date;
  checkOut: Date;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  guestCount: number;
  totalPrice: number;
}

export async function submitBooking(params: SubmitBookingParams) {
  try {
    if (new Date(params.checkOut) <= new Date(params.checkIn)) {
      return { error: "Check-out date must be after check-in date." };
    }

    const booking = await prisma.booking.create({
      data: {
        unitId:     params.unitId,
        checkIn:    params.checkIn,
        checkOut:   params.checkOut,
        guestName:  params.guestName,
        guestEmail: params.guestEmail,
        guestPhone: params.guestPhone,
        totalPrice: params.totalPrice,
        status:     "CONFIRMED",
      },
      include: {
        unit: true
      }
    });

    sendBookingConfirmationEmail(booking, booking.unit.name).catch(console.error);
    sendAdminNotificationEmail(booking, booking.unit.name).catch(console.error);

    revalidatePath(`/unit/${params.unitId}/book`);
    return { success: true, bookingId: booking.id };

  } catch (error: any) {
    console.error("Booking error:", error);
    if (error.message?.includes("prevent_double_booking") || error.code === 'P2004') {
      return { error: "Tanggal ini baru saja dipesan orang lain. Silakan pilih tanggal lain." };
    }
    return { error: "Gagal membuat reservasi. Coba lagi nanti." };
  }
}
