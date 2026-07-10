import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Tent, CalendarDays, LogOut, ExternalLink } from "lucide-react";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/admin/login");

  const initial = session.user.name?.charAt(0).toUpperCase() || "A";

  return (
    <div className="flex min-h-screen bg-parchment-100" style={{ fontFamily: "var(--font-inter), sans-serif" }}>

      {/* ── Sidebar ───────────────────────────────────────────── */}
      <aside className="hidden md:flex w-64 flex-col bg-obsidian-900 text-parchment-100 fixed inset-y-0 left-0 z-40">
        {/* Brand */}
        <div className="flex h-20 items-center justify-between border-b border-obsidian-800 px-8">
          <Link href="/" className="font-serif text-xl tracking-[0.15em] text-parchment-100">
            DAMAR
          </Link>
          <Link href="/" target="_blank" className="text-obsidian-500 hover:text-parchment-100 transition-colors">
            <ExternalLink className="h-4 w-4" strokeWidth={1} />
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 py-8 space-y-1">
          <p className="mb-4 px-4 text-[9px] uppercase tracking-[0.25em] text-obsidian-600">Management</p>
          {[
            { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
            { href: "/admin/bookings", icon: CalendarDays, label: "Bookings" },
            { href: "/admin/units", icon: Tent, label: "Units" },
          ].map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 rounded-none px-4 py-3 text-sm text-obsidian-400 transition-all duration-300 hover:bg-obsidian-800 hover:text-parchment-100"
            >
              <Icon className="h-4 w-4" strokeWidth={1.5} />
              <span className="tracking-wide">{label}</span>
            </Link>
          ))}
        </nav>

        {/* User */}
        <div className="border-t border-obsidian-800 p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center bg-obsidian-700 text-sm font-medium text-parchment-100">
              {initial}
            </div>
            <div>
              <p className="text-sm text-parchment-100">{session.user.name}</p>
              <p className="text-[10px] uppercase tracking-[0.15em] text-obsidian-500">Administrator</p>
            </div>
          </div>
          <Link
            href="/api/auth/signout"
            className="flex w-full items-center gap-2 px-0 py-2 text-xs text-obsidian-500 transition-colors hover:text-parchment-100"
          >
            <LogOut className="h-3.5 w-3.5" strokeWidth={1.5} />
            <span className="uppercase tracking-[0.15em]">Sign Out</span>
          </Link>
        </div>
      </aside>

      {/* ── Main content ─────────────────────────────────────── */}
      <div className="flex flex-1 flex-col md:ml-64">
        {/* Mobile header */}
        <header className="flex h-16 items-center justify-between border-b border-parchment-200 bg-white px-6 md:hidden">
          <Link href="/" className="font-serif text-xl tracking-[0.15em] text-obsidian-900">DAMAR</Link>
        </header>

        <main className="flex-1 overflow-y-auto p-8 md:p-12">
          {children}
        </main>
      </div>
    </div>
  );
}
