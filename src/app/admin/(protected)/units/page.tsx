import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Edit2 } from "lucide-react";

export default async function AdminUnitsPage() {
  const units = await prisma.unit.findMany({
    orderBy: { createdAt: "desc" }
  });

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-earth-900">Manage Units</h1>
        <button className="rounded-lg bg-earth-800 px-4 py-2 font-medium text-white smooth-transition hover:bg-earth-900">
          + Add New Unit
        </button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {units.map((unit) => (
          <div key={unit.id} className="flex flex-col overflow-hidden rounded-2xl border border-sand-200 bg-white shadow-sm">
            <div className="p-6 flex-1">
              <div className="mb-2 flex items-center justify-between">
                <span className="rounded-full bg-earth-100 px-3 py-1 text-xs font-semibold uppercase text-earth-800">
                  {unit.type}
                </span>
                <button className="text-earth-500 hover:text-earth-900 smooth-transition">
                  <Edit2 className="h-4 w-4" />
                </button>
              </div>
              <h3 className="mb-2 text-xl font-bold text-earth-900">{unit.name}</h3>
              <p className="mb-4 text-sm text-earth-600 line-clamp-3">
                {unit.promotionalCopy || "No promotional copy set."}
              </p>
              <div className="mt-auto pt-4 border-t border-sand-100">
                <p className="text-xs text-earth-600 mb-1">Price per night</p>
                <p className="font-bold text-earth-900">Rp {unit.pricePerNight.toLocaleString('id-ID')}</p>
              </div>
            </div>
            {/* Action Area for AI Generation (Tahap 6) */}
            <div className="bg-sand-50 p-4 border-t border-sand-100 flex justify-end">
               {/* Button to be implemented in Tahap 6 */}
               <button className="text-sm font-medium text-earth-700 hover:text-earth-900">
                 Manage Details
               </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
