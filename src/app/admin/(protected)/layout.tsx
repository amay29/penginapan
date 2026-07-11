import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, LogOut, Grid2X2, CalendarDays, ExternalLink, Ticket, ScanLine, Coffee, Utensils, ReceiptText } from "lucide-react";

const navItems = [
  { href: "/admin",          icon: LayoutDashboard, label: "Overview"  },
  { href: "/admin/bookings", icon: CalendarDays,    label: "Bookings"  },
  { href: "/admin/units",    icon: Grid2X2,         label: "Spaces"    },
  { href: "/admin/pool",     icon: Ticket,          label: "Pool Tickets"},
  { href: "/admin/validasi-tiket", icon: ScanLine,  label: "Scan Tiket"  },
];

const cafeNavItems = [
  { href: "/admin/cafe/pos",    icon: Coffee,      label: "Kasir POS"   },
  { href: "/admin/cafe/menu",   icon: Utensils,    label: "Manajemen Menu"},
  { href: "/admin/cafe/orders", icon: ReceiptText, label: "Riwayat Kafe" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/admin/login");

  const initial = session.user.name?.charAt(0).toUpperCase() || "A";
  const role = session.user.role || "USER";

  // Filter navigation based on role
  const filteredNavItems = navItems.filter((item) => {
    if (role === "OWNER") return true;
    if (role === "RECEPTIONIST") return item.href === "/admin/bookings" || item.href === "/admin/units";
    if (role === "POOL_SECURITY") return item.href === "/admin/validasi-tiket" || item.href === "/admin/pool";
    return false;
  });

  const filteredCafeItems = cafeNavItems.filter((item) => {
    if (role === "OWNER") return true;
    if (role === "CAFE_CASHIER") return true; // cashier sees all cafe menus
    return false;
  });

  return (
    <div className="flex min-h-screen bg-surface-950 text-surface-100 font-sans antialiased">

      {/* ── Sidebar ─────────────────────────────────────────────── */}
      <aside className="hidden md:flex w-60 flex-col bg-surface-900 border-r border-surface-600/30 fixed inset-y-0 left-0 z-40">

        {/* Brand */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-surface-600/30">
          <Link href="/" className="font-serif text-lg tracking-[0.2em] text-surface-100 hover:text-gold-300 transition-colors duration-300">
            ROSA
          </Link>
          <Link href="/" target="_blank" className="text-surface-500 hover:text-surface-200 transition-colors">
            <ExternalLink className="h-3.5 w-3.5" strokeWidth={1.5} />
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-6 space-y-0.5">
          {filteredNavItems.length > 0 && (
            <>
              <p className="px-3 mb-3 text-[9px] uppercase tracking-[0.3em] text-surface-500">Management</p>
              {filteredNavItems.map(({ href, icon: Icon, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center gap-3 px-3 py-2.5 text-sm text-surface-400 rounded-sm hover:text-surface-100 hover:bg-surface-700/50 transition-all duration-200"
                >
                  <Icon className="h-4 w-4 shrink-0" strokeWidth={1.5} />
                  <span className="tracking-wide">{label}</span>
                </Link>
              ))}
            </>
          )}
          
          {filteredCafeItems.length > 0 && (
            <>
              <p className="px-3 mb-3 mt-6 text-[9px] uppercase tracking-[0.3em] text-surface-500">Rosa Cafe</p>
              {filteredCafeItems.map(({ href, icon: Icon, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center gap-3 px-3 py-2.5 text-sm text-surface-400 rounded-sm hover:text-surface-100 hover:bg-surface-700/50 transition-all duration-200"
                >
                  <Icon className="h-4 w-4 shrink-0" strokeWidth={1.5} />
                  <span className="tracking-wide">{label}</span>
                </Link>
              ))}
            </>
          )}
        </nav>

        {/* User & Signout */}
        <div className="px-4 py-5 border-t border-surface-600/30 space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-sm bg-surface-700 flex items-center justify-center text-xs font-semibold text-surface-200 shrink-0">
              {initial}
            </div>
            <div className="min-w-0">
              <p className="text-sm text-surface-100 truncate">{session.user.name}</p>
              <p className="text-[9px] uppercase tracking-widest text-surface-500">{role.replace('_', ' ')}</p>
            </div>
          </div>
          <Link
            href="/api/auth/signout"
            className="flex items-center gap-2 text-xs tracking-widest uppercase text-surface-500 hover:text-red-400 transition-colors duration-200"
          >
            <LogOut className="h-3.5 w-3.5" strokeWidth={1.5} />
            Sign Out
          </Link>
        </div>
      </aside>

      {/* ── Main content ─────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col md:ml-60 min-h-screen">
        {/* Mobile Header */}
        <header className="flex h-14 items-center justify-between border-b border-surface-600/30 bg-surface-900 px-5 md:hidden">
          <Link href="/" className="font-serif text-lg tracking-[0.2em] text-surface-100">ROSA</Link>
          <Link href="/api/auth/signout" className="text-surface-500 hover:text-red-400 transition-colors">
            <LogOut className="h-4 w-4" strokeWidth={1.5} />
          </Link>
        </header>

        <main className="flex-1 p-6 md:p-10 lg:p-14">
          {children}
        </main>
      </div>
    </div>
  );
}
