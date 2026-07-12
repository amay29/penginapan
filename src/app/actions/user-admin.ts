"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function createUser(data: { name: string; email: string; role: string; password?: string }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "OWNER") throw new Error("Unauthorized");

    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) throw new Error("Email sudah digunakan");

    const passwordToHash = data.password && data.password.trim() !== "" ? data.password : "password";
    const passwordHash = await bcrypt.hash(passwordToHash, 10);

    await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        role: data.role,
        passwordHash,
      },
    });

    revalidatePath("/admin/users");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteUser(id: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "OWNER") throw new Error("Unauthorized");

    const user = await prisma.user.findUnique({ where: { id } });
    if (user?.role === "OWNER") throw new Error("Tidak bisa menghapus akun OWNER");

    await prisma.user.delete({ where: { id } });
    revalidatePath("/admin/users");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
