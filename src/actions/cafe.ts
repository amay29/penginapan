"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// -----------------------------------------------------------------------------
// Menu Management
// -----------------------------------------------------------------------------

export async function createCafeItem(data: { name: string; category: string; price: number; imageUrl?: string }) {
  try {
    const item = await prisma.cafeItem.create({ data });
    revalidatePath("/admin/cafe/menu");
    return { success: true, item };
  } catch (error) {
    console.error("Failed to create cafe item:", error);
    return { success: false, error: "Gagal menambahkan menu." };
  }
}

export async function toggleCafeItemAvailability(id: string, isAvailable: boolean) {
  try {
    await prisma.cafeItem.update({
      where: { id },
      data: { isAvailable }
    });
    revalidatePath("/admin/cafe/menu");
    revalidatePath("/admin/cafe/pos");
    return { success: true };
  } catch (error) {
    console.error("Failed to toggle cafe item:", error);
    return { success: false, error: "Gagal mengupdate status menu." };
  }
}

export async function deleteCafeItem(id: string) {
  try {
    await prisma.cafeItem.delete({ where: { id } });
    revalidatePath("/admin/cafe/menu");
    revalidatePath("/admin/cafe/pos");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete cafe item:", error);
    return { success: false, error: "Gagal menghapus menu." };
  }
}

// -----------------------------------------------------------------------------
// POS & Ordering
// -----------------------------------------------------------------------------

interface OrderItemPayload {
  itemId: string;
  quantity: number;
  price: number;
}

interface ProcessOrderParams {
  items: OrderItemPayload[];
  totalAmount: number;
  paymentMethod: string; // "CASH", "QRIS", "ROOM_CHARGE"
  bookingId?: string;
  guestName?: string;
  tableNumber?: string;
}

export async function processCafeOrder(params: ProcessOrderParams) {
  try {
    if (params.items.length === 0) {
      return { success: false, error: "Pesanan kosong." };
    }

    if (params.paymentMethod === "ROOM_CHARGE" && !params.bookingId) {
      return { success: false, error: "Harap pilih tamu kamar untuk di-charge." };
    }

    const order = await prisma.cafeOrder.create({
      data: {
        totalAmount: params.totalAmount,
        paymentMethod: params.paymentMethod,
        status: "COMPLETED", // Assuming immediate payment or room charge is accepted
        bookingId: params.bookingId,
        guestName: params.guestName,
        tableNumber: params.tableNumber,
        items: {
          create: params.items.map(item => ({
            itemId: item.itemId,
            quantity: item.quantity,
            priceAtTime: item.price,
            subtotal: item.price * item.quantity
          }))
        }
      }
    });

    revalidatePath("/admin/cafe/pos");
    revalidatePath("/admin/cafe/orders");
    if (params.bookingId) {
      revalidatePath("/admin/bookings");
    }

    return { success: true, orderId: order.id };
  } catch (error) {
    console.error("Failed to process cafe order:", error);
    return { success: false, error: "Gagal memproses pesanan." };
  }
}
