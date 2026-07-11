"use client";

import { useState } from "react";
import { createCafeItem } from "@/actions/cafe";
import { Plus, Loader2, X } from "lucide-react";

export default function MenuForm() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Makanan");
  const [price, setPrice] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) return;
    
    setLoading(true);
    const res = await createCafeItem({
      name,
      category,
      price: parseInt(price, 10),
    });
    setLoading(false);
    
    if (res.success) {
      setOpen(false);
      setName("");
      setPrice("");
    }
  };

  return (
    <>
      <button 
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 bg-gold-500 text-surface-950 px-4 py-2 text-xs font-semibold tracking-widest uppercase hover:bg-gold-400 transition-colors"
      >
        <Plus className="h-4 w-4" />
        Tambah Menu
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-surface-950/80 backdrop-blur-sm p-4">
          <div className="bg-surface-900 border border-surface-600/30 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-surface-600/30">
              <h2 className="font-serif text-xl text-surface-50">Tambah Menu Baru</h2>
              <button onClick={() => setOpen(false)} className="text-surface-400 hover:text-surface-100">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-5 space-y-5">
              <div>
                <label className="block text-xs uppercase tracking-widest text-surface-400 mb-2">Nama Menu</label>
                <input 
                  type="text" 
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-surface-950 border border-surface-600/50 text-surface-100 px-4 py-2.5 focus:outline-none focus:border-gold-500 transition-colors"
                />
              </div>
              
              <div>
                <label className="block text-xs uppercase tracking-widest text-surface-400 mb-2">Kategori</label>
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-surface-950 border border-surface-600/50 text-surface-100 px-4 py-2.5 focus:outline-none focus:border-gold-500 transition-colors appearance-none"
                >
                  <option value="Makanan">Makanan</option>
                  <option value="Snack">Snack</option>
                  <option value="Minuman Dingin">Minuman Dingin</option>
                  <option value="Minuman Panas">Minuman Panas</option>
                  <option value="Paket">Paket / Lainnya</option>
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-surface-400 mb-2">Harga (Rp)</label>
                <input 
                  type="number" 
                  required
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full bg-surface-950 border border-surface-600/50 text-surface-100 px-4 py-2.5 focus:outline-none focus:border-gold-500 transition-colors"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 text-xs uppercase tracking-widest text-surface-400 hover:text-surface-100"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  disabled={loading}
                  className="bg-gold-500 text-surface-950 px-6 py-2 text-xs font-semibold tracking-widest uppercase hover:bg-gold-400 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {loading && <Loader2 className="h-3 w-3 animate-spin" />}
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
