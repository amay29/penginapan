"use client";

import { useState } from "react";
import UnitForm from "@/components/admin/UnitForm";
import { deleteUnit } from "@/actions/unit";
import { Edit2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function UnitsClient({ units }: { units: any[] }) {
  const router = useRouter();
  const [selectedUnit, setSelectedUnit] = useState<any | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleEdit = (unit: any) => {
    setSelectedUnit(unit);
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    setSelectedUnit(null);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this space?")) return;
    setIsDeleting(id);
    const res = await deleteUnit(id);
    if (res.error) {
      alert(res.error);
    } else {
      router.refresh();
    }
    setIsDeleting(null);
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-serif text-3xl font-light text-obsidian-900">Spaces</h1>
        <button 
          onClick={handleAddNew}
          className="bg-obsidian-900 px-6 py-2 text-[10px] uppercase tracking-widest text-parchment-50 hover:bg-obsidian-800 transition-colors"
        >
          + Add New Space
        </button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {units.map((unit) => (
          <div key={unit.id} className="flex flex-col overflow-hidden bg-white border border-parchment-200">
            <div className="p-6 flex-1">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-[0.25em] text-obsidian-500">
                  {unit.type}
                </span>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleEdit(unit)}
                    className="p-2 text-obsidian-400 hover:text-obsidian-900 transition-colors"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(unit.id)}
                    disabled={isDeleting === unit.id}
                    className="p-2 text-red-300 hover:text-red-700 disabled:opacity-50 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <h3 className="mb-4 font-serif text-2xl text-obsidian-900">{unit.name}</h3>
              <p className="mb-6 text-sm leading-relaxed text-obsidian-600 line-clamp-3">
                {unit.promotionalCopy || "No promotional copy set."}
              </p>
              <div className="mt-auto pt-4 border-t border-parchment-200 flex justify-between items-end">
                <div>
                  <p className="text-[9px] uppercase tracking-widest text-obsidian-400 mb-1">Price per night</p>
                  <p className="font-serif text-xl text-obsidian-900">Rp {unit.pricePerNight.toLocaleString('id-ID')}</p>
                </div>
                <div className="text-[10px] uppercase tracking-widest text-obsidian-400">
                  {unit.capacity} Pax
                </div>
              </div>
            </div>
          </div>
        ))}
        {units.length === 0 && (
          <div className="col-span-full py-12 text-center text-obsidian-500 font-serif italic border border-dashed border-parchment-300">
            No spaces found. Add one to begin.
          </div>
        )}
      </div>

      {isFormOpen && (
        <UnitForm 
          unit={selectedUnit} 
          onClose={() => setIsFormOpen(false)} 
        />
      )}
    </div>
  );
}
