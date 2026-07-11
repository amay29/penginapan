import { prisma } from "@/lib/prisma";
import { Plus, ToggleLeft, ToggleRight, Trash2 } from "lucide-react";
import MenuForm from "./MenuForm";
import MenuItemAction from "./MenuItemAction";

export const revalidate = 0;

export default async function CafeMenuPage() {
  const items = await prisma.cafeItem.findMany({
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-light tracking-wide text-surface-50 mb-2">Cafe Menu</h1>
          <p className="text-sm text-surface-400">Kelola daftar menu makanan & minuman Rosa Cafe.</p>
        </div>
        <MenuForm />
      </div>

      <div className="bg-surface-900 border border-surface-600/30 overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-surface-800/50 text-surface-400 text-xs uppercase tracking-wider border-b border-surface-600/30">
            <tr>
              <th className="px-6 py-4 font-medium">Nama Menu</th>
              <th className="px-6 py-4 font-medium">Kategori</th>
              <th className="px-6 py-4 font-medium text-right">Harga</th>
              <th className="px-6 py-4 font-medium text-center">Status</th>
              <th className="px-6 py-4 font-medium text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-600/30">
            {items.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-surface-500">
                  Belum ada menu terdaftar.
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.id} className="hover:bg-surface-800/20 transition-colors">
                  <td className="px-6 py-4 font-medium text-surface-100">{item.name}</td>
                  <td className="px-6 py-4 text-surface-400">
                    <span className="bg-surface-800 px-2 py-1 text-xs rounded-sm border border-surface-700">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-mono text-surface-300">
                    Rp {item.price.toLocaleString("id-ID")}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {item.isAvailable ? (
                      <span className="text-emerald-400 text-xs uppercase tracking-widest bg-emerald-500/10 px-2 py-1 rounded-sm">Tersedia</span>
                    ) : (
                      <span className="text-red-400 text-xs uppercase tracking-widest bg-red-500/10 px-2 py-1 rounded-sm">Habis</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <MenuItemAction id={item.id} isAvailable={item.isAvailable} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
