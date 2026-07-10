import { prisma } from "@/lib/prisma";
import UnitsClient from "./UnitsClient";

export default async function AdminUnitsPage() {
  const units = await prisma.unit.findMany({
    orderBy: { createdAt: "desc" }
  });

  return <UnitsClient units={units} />;
}
