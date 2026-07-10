"use client";

import { useState } from "react";
import UnitForm from "@/components/admin/UnitForm";
import { deleteUnit } from "@/actions/unit";
import { Edit2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function UnitsClient({ units }: { units: any[] }) {
  const router = useRouter();
  const [selectedUnit, setSelectedUnit] = useState<any | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleEdit = (unit: any) => { setSelectedUnit(unit); setIsFormOpen(true); };
  const handleAddNew = () => { setSelectedUnit(null); setIsFormOpen(true); };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this space?")) return;
    setIsDeleting(id);
    const res = await deleteUnit(id);
    if (res.error) alert(res.error);
    else router.refresh();
    setIsDeleting(null);
  };

  return (
    <div className="max-w-5xl space-y-8">
      {/* Header */}
      <div className="border-b border-surface-600/30 pb-6 flex items-end justify-between">
        <div>
          <h1 className="font-serif text-3xl font-light text-surface-100 tracking-wide">Spaces</h1>
          <p className="mt-1 text-sm text-surface-400">{units.length} properties configured</p>
        </div>
        <button
          onClick={handleAddNew}
          className="flex items-center gap-2 bg-surface-100 text-surface-950 text-[10px] uppercase tracking-widest px-5 py-2.5 rounded-sm hover:bg-parchment-50 transition-colors duration-200 font-medium"
        >
          + Add Space
        </button>
      </div>

      {/* List */}
      <div className="bg-surface-800 border border-surface-600/30 rounded-sm overflow-hidden divide-y divide-surface-600/20">
        {units.length === 0 && (
          <p className="px-6 py-12 text-sm italic text-surface-500 font-serif text-center">No spaces configured yet.</p>
        )}
        {units.map((unit, i) => (
          <div
            key={unit.id}
            className="group flex items-center gap-6 px-6 py-5 hover:bg-surface-700/20 transition-colors duration-200"
          >
            {/* Thumbnail */}
            <div className="relative h-16 w-24 shrink-0 overflow-hidden bg-surface-700 rounded-sm">
              <Image
                src={unit.photoUrls[0] || "https://images.unsplash.com/photo-1542718610-a1d656d1884c?auto=format&fit=crop&q=75&w=300"}
                alt={unit.name}
                fill
                className="object-cover opacity-70 grayscale transition-all duration-500 group-hover:opacity-100 group-hover:grayscale-0"
              />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1">
                <p className="text-[9px] uppercase tracking-[0.25em] text-surface-500">{unit.type}</p>
                <span className="h-px w-4 bg-surface-600" />
                <p className="text-[9px] uppercase tracking-[0.25em] text-surface-500">{unit.capacity} Pax</p>
              </div>
              <h3 className="font-serif text-xl text-surface-100 group-hover:text-gold-300 transition-colors duration-300">{unit.name}</h3>
              <p className="text-xs text-surface-500 mt-1 line-clamp-1 max-w-lg">{unit.promotionalCopy || "No promotional copy."}</p>
            </div>

            {/* Price */}
            <div className="text-right shrink-0 hidden md:block">
              <p className="text-[9px] uppercase tracking-widest text-surface-500 mb-1">Nightly</p>
              <p className="font-serif text-lg text-surface-100">Rp {unit.pricePerNight.toLocaleString("id-ID")}</p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 shrink-0 pl-4 border-l border-surface-600/30">
              <button
                onClick={() => handleEdit(unit)}
                className="p-1.5 text-surface-500 hover:text-gold-300 transition-colors duration-200"
              >
                <Edit2 className="h-4 w-4" strokeWidth={1.5} />
              </button>
              <button
                onClick={() => handleDelete(unit.id)}
                disabled={isDeleting === unit.id}
                className="p-1.5 text-surface-500 hover:text-red-400 disabled:opacity-50 transition-colors duration-200"
              >
                <Trash2 className="h-4 w-4" strokeWidth={1.5} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {isFormOpen && (
        <UnitForm unit={selectedUnit} onClose={() => setIsFormOpen(false)} />
      )}
    </div>
  );
}
