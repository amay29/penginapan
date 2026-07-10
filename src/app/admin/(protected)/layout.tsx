import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Tent, CalendarDays, LogOut } from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/admin/login");
  }

  return (
    <div className="flex min-h-screen bg-sand-100 font-sans">
      <aside className="w-64 bg-earth-900 text-sand-50 hidden flex-col md:flex">
        <div className="flex h-20 items-center justify-center border-b border-earth-800">
          <Link href="/" className="text-xl font-bold tracking-tight">Damar Admin</Link>
        </div>
        <nav className="flex-1 space-y-2 p-4">
          <Link href="/admin" className="flex items-center space-x-3 rounded-lg px-4 py-3 text-sand-200 smooth-transition hover:bg-earth-800 hover:text-white">
            <LayoutDashboard className="h-5 w-5" />
            <span>Dashboard</span>
          </Link>
          <Link href="/admin/bookings" className="flex items-center space-x-3 rounded-lg px-4 py-3 text-sand-200 smooth-transition hover:bg-earth-800 hover:text-white">
            <CalendarDays className="h-5 w-5" />
            <span>Bookings</span>
          </Link>
          <Link href="/admin/units" className="flex items-center space-x-3 rounded-lg px-4 py-3 text-sand-200 smooth-transition hover:bg-earth-800 hover:text-white">
            <Tent className="h-5 w-5" />
            <span>Units</span>
          </Link>
        </nav>
        <div className="border-t border-earth-800 p-4">
          <div className="mb-4 flex items-center space-x-3 px-4">
            <div className="h-8 w-8 rounded-full bg-earth-700 flex items-center justify-center font-bold">
              {session?.user?.name?.charAt(0) || "A"}
            </div>
            <div className="text-sm">
              <p className="font-medium text-white">{session?.user?.name}</p>
              <p className="text-xs text-earth-400">Administrator</p>
            </div>
          </div>
          <Link href="/api/auth/signout" className="flex w-full items-center justify-center space-x-2 rounded-lg bg-earth-800 px-4 py-2 text-sm font-medium text-sand-200 smooth-transition hover:bg-earth-700">
             <LogOut className="h-4 w-4" />
             <span>Sign Out</span>
          </Link>
        </div>
      </aside>
      
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="flex h-20 items-center justify-between border-b border-sand-200 bg-white px-8 md:hidden">
            <Link href="/" className="text-xl font-bold text-earth-900 tracking-tight">Damar Admin</Link>
            {/* Mobile menu could go here */}
        </header>
        <div className="flex-1 overflow-y-auto p-8">
           {children}
        </div>
      </main>
    </div>
  );
}
