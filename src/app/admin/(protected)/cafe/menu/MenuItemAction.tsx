"use client";

import { toggleCafeItemAvailability, deleteCafeItem } from "@/actions/cafe";
import { Trash2, Loader2 } from "lucide-react";
import { useState } from "react";

export default function MenuItemAction({ id, isAvailable }: { id: string; isAvailable: boolean }) {
  const [loadingToggle, setLoadingToggle] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const handleToggle = async () => {
    setLoadingToggle(true);
    await toggleCafeItemAvailability(id, !isAvailable);
    setLoadingToggle(false);
  };

  const handleDelete = async () => {
    if (!confirm("Yakin ingin menghapus menu ini?")) return;
    setLoadingDelete(true);
    await deleteCafeItem(id);
    setLoadingDelete(false);
  };

  return (
    <div className="flex items-center justify-end gap-2">
      <button 
        onClick={handleToggle}
        disabled={loadingToggle}
        className={`px-3 py-1.5 text-xs font-medium rounded-sm border transition-colors ${
          isAvailable 
            ? "border-surface-600 text-surface-400 hover:text-surface-100" 
            : "border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
        }`}
      >
        {loadingToggle ? <Loader2 className="h-3 w-3 animate-spin" /> : (isAvailable ? "Set Habis" : "Set Tersedia")}
      </button>
      
      <button 
        onClick={handleDelete}
        disabled={loadingDelete}
        className="p-1.5 text-surface-500 hover:text-red-400 transition-colors rounded-sm border border-transparent hover:border-red-500/30 hover:bg-red-500/10"
        title="Hapus Menu"
      >
        {loadingDelete ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
      </button>
    </div>
  );
}
