import { prisma } from "@/lib/prisma";
import PoolClient from "./PoolClient";

export const revalidate = 0; // Disable cache

export default async function PoolAdminPage() {
  const tickets = await prisma.poolTicket.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-light tracking-wide text-surface-50 mb-2">Pool Tickets</h1>
        <p className="text-sm text-surface-400">Manajemen tiket kolam renang harian.</p>
      </div>

      <PoolClient tickets={tickets} />
    </div>
  );
}
