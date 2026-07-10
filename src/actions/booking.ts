"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

interface SubmitBookingParams {
  unitId: string;
  checkIn: Date;
  checkOut: Date;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  totalPrice: number;
}

export async function submitBooking(params: SubmitBookingParams) {
  try {
    // 1. Basic validation (ensure checkOut is after checkIn)
    if (new Date(params.checkOut) <= new Date(params.checkIn)) {
      return { error: "Check-out date must be after check-in date." };
    }

    // 2. Insert booking to Database
    // Because we implemented the btree_gist EXCLUDE constraint at the DB level,
    // we don't need a complex locking SELECT ... FOR UPDATE here. 
    // If the dates overlap, Prisma will throw a constraint violation error.
    const booking = await prisma.booking.create({
      data: {
        unitId: params.unitId,
        checkIn: params.checkIn,
        checkOut: params.checkOut,
        guestName: params.guestName,
        guestEmail: params.guestEmail,
        guestPhone: params.guestPhone,
        totalPrice: params.totalPrice,
        status: "CONFIRMED", // Default to confirmed for this demo
      }
    });

    // Invalidate the cache for the booking page so calendar updates immediately
    revalidatePath(`/unit/${params.unitId}/book`);

    return { success: true, bookingId: booking.id };

  } catch (error: any) {
    console.error("Booking error:", error);
    
    // Check if it's the exclusion constraint violation (P2010 or P2004 depending on Prisma version/raw query vs native)
    // Often, Prisma throws P2004 for constraint failures, or P2010 for raw query failures.
    // For exclusion constraint, Postgres throws error code 23P01 (exclusion_violation).
    // We can just check the error message string as a fallback.
    if (error.message?.includes("prevent_double_booking") || error.code === 'P2004') {
      return { 
        error: "These dates just got booked by someone else! Please select different dates." 
      };
    }

    return { error: "Failed to create booking. Please try again later." };
  }
}
