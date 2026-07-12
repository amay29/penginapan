"use client";

import { useState } from "react";
import { createUser, deleteUser } from "@/app/actions/user-admin";
import { Trash2, UserPlus, Loader2, Shield } from "lucide-react";

export default function UsersClient({ users }: { users: any[] }) {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "RECEPTIONIST",
    password: "",
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await createUser(formData);
    setLoading(false);
    
    if (res.success) {
      setShowForm(false);
      setFormData({ name: "", email: "", role: "RECEPTIONIST", password: "" });
    } else {
      alert(res.error);
    }
  };

  const handleDelete = async (id: string, role: string) => {
    if (role === "OWNER") {
      alert("Tidak bisa menghapus akun OWNER");
      return;
    }
    if (!confirm("Hapus akun ini permanen?")) return;
    
    setDeleteId(id);
    const res = await deleteUser(id);
    setDeleteId(null);
    
    if (!res.success) alert(res.error);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-gold-600 text-surface-950 px-4 py-2 text-xs uppercase tracking-widest font-semibold rounded-sm hover:bg-gold-500 transition-colors flex items-center gap-2"
        >
          <UserPlus className="h-4 w-4" /> {showForm ? "Batal" : "Tambah Akun"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-surface-900 border border-surface-600/30 p-6 rounded-sm space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-widest text-surface-500 mb-1">Nama</label>
              <input 
                required type="text" 
                value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full bg-surface-950 border border-surface-600/50 rounded-sm px-3 py-2 text-sm text-surface-100 focus:border-gold-500 focus:outline-none transition-colors" 
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-surface-500 mb-1">Email / Username</label>
              <input 
                required type="email" 
                value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                className="w-full bg-surface-950 border border-surface-600/50 rounded-sm px-3 py-2 text-sm text-surface-100 focus:border-gold-500 focus:outline-none transition-colors" 
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-surface-500 mb-1">Role Akses</label>
              <select 
                value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}
                className="w-full bg-surface-950 border border-surface-600/50 rounded-sm px-3 py-2 text-sm text-surface-100 focus:border-gold-500 focus:outline-none transition-colors appearance-none" 
              >
                <option value="RECEPTIONIST">Resepsionis (Glamping)</option>
                <option value="CAFE_CASHIER">Kasir (Kafe)</option>
                <option value="POOL_SECURITY">Satpam (Kolam)</option>
                <option value="OWNER">Owner (Akses Penuh)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-surface-500 mb-1">Password</label>
              <input 
                type="text" 
                placeholder="Default: password"
                value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})}
                className="w-full bg-surface-950 border border-surface-600/50 rounded-sm px-3 py-2 text-sm text-surface-100 focus:border-gold-500 focus:outline-none transition-colors" 
              />
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <button
              disabled={loading}
              type="submit"
              className="bg-emerald-600 text-surface-950 px-6 py-2 text-xs uppercase tracking-widest font-semibold rounded-sm hover:bg-emerald-500 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Simpan Akun"}
            </button>
          </div>
        </form>
      )}

      <div className="bg-surface-900 border border-surface-600/30 overflow-hidden rounded-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-surface-800/50 text-surface-400 text-xs uppercase tracking-wider border-b border-surface-600/30">
            <tr>
              <th className="px-6 py-4 font-medium">Pengguna</th>
              <th className="px-6 py-4 font-medium">Role Akses</th>
              <th className="px-6 py-4 font-medium text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-600/30">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-surface-800/20 transition-colors">
                <td className="px-6 py-4">
                  <p className="text-surface-100 font-medium">{user.name}</p>
                  <p className="text-surface-500 text-xs mt-0.5">{user.email}</p>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-[10px] uppercase tracking-widest font-medium border ${
                    user.role === 'OWNER' ? 'bg-gold-500/10 text-gold-400 border-gold-500/20' :
                    'bg-surface-700 text-surface-300 border-surface-600'
                  }`}>
                    {user.role === 'OWNER' && <Shield className="h-3 w-3" />}
                    {user.role.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  {user.role !== "OWNER" && (
                    <button 
                      onClick={() => handleDelete(user.id, user.role)}
                      disabled={deleteId === user.id}
                      className="text-surface-500 hover:text-red-400 p-2 transition-colors disabled:opacity-50"
                    >
                      {deleteId === user.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
