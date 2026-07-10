"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createUnit(data: {
  name: string;
  type: string;
  capacity: number;
  pricePerNight: number;
  amenities: string[];
  photoUrls: string[];
  promotionalCopy?: string;
}) {
  try {
    const unit = await prisma.unit.create({ data });
    revalidatePath("/admin/units");
    revalidatePath("/"); // Revalidate landing page ISR
    return { success: true, unit };
  } catch (error: any) {
    console.error("Error creating unit:", error);
    return { error: error.message || "Failed to create unit." };
  }
}

export async function updateUnit(
  id: string,
  data: {
    name: string;
    type: string;
    capacity: number;
    pricePerNight: number;
    amenities: string[];
    photoUrls: string[];
    promotionalCopy?: string;
  }
) {
  try {
    const unit = await prisma.unit.update({ where: { id }, data });
    revalidatePath("/admin/units");
    revalidatePath("/");
    revalidatePath(`/unit/${id}`);
    return { success: true, unit };
  } catch (error: any) {
    console.error("Error updating unit:", error);
    return { error: error.message || "Failed to update unit." };
  }
}

export async function deleteUnit(id: string) {
  try {
    await prisma.unit.delete({ where: { id } });
    revalidatePath("/admin/units");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting unit:", error);
    // Prisma throws specific codes for foreign key constraints, etc.
    if (error.code === 'P2003') {
      return { error: "Cannot delete this unit because it has existing bookings." };
    }
    return { error: error.message || "Failed to delete unit." };
  }
}
