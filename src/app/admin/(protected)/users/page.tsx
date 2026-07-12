import { prisma } from "@/lib/prisma";
import UsersClient from "./UsersClient";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export const revalidate = 0;

export default async function UsersPage() {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "OWNER") {
    redirect("/admin");
  }

  const users = await prisma.user.findMany({
    orderBy: { role: "asc" },
  });

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="font-serif text-3xl font-light tracking-wide text-surface-50 mb-2">Staff & Users</h1>
        <p className="text-sm text-surface-400">Manajemen akun staf (Kasir, Resepsionis, Satpam Kolam).</p>
      </div>

      <UsersClient users={users} />
    </div>
  );
}
