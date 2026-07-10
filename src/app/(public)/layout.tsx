import Link from "next/link";
import { User, Menu } from "lucide-react";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col font-sans selection:bg-forest-900 selection:text-linen-50">
      {/* Luxury Navbar */}
      <header className="fixed top-0 z-50 w-full bg-linen-50/90 backdrop-blur-md transition-all duration-300">
        <div className="container mx-auto flex h-24 items-center justify-between px-6 md:px-12">
          {/* Left: Menu (Mobile) or Links (Desktop) */}
          <div className="flex flex-1 items-center">
            <button className="md:hidden text-forest-900">
              <Menu className="h-6 w-6" strokeWidth={1.5} />
            </button>
            <nav className="hidden space-x-8 md:flex">
              <Link href="/#accommodations" className="text-xs uppercase tracking-[0.2em] text-forest-700 luxury-link">
                Accommodations
              </Link>
              <Link href="#experience" className="text-xs uppercase tracking-[0.2em] text-forest-700 luxury-link">
                Experience
              </Link>
            </nav>
          </div>

          {/* Center: Logo */}
          <Link href="/" className="flex flex-1 justify-center">
            <span className="font-serif text-2xl tracking-widest text-forest-900 md:text-3xl">
              DAMAR.
            </span>
          </Link>

          {/* Right: Actions */}
          <div className="flex flex-1 items-center justify-end space-x-6">
            <Link href="/admin/login" className="hidden items-center space-x-2 text-xs uppercase tracking-[0.2em] text-forest-700 luxury-link md:flex">
              <span>Admin</span>
            </Link>
            <Link 
              href="/#accommodations" 
              className="border border-forest-900 bg-forest-900 px-6 py-3 text-xs uppercase tracking-[0.2em] text-linen-50 transition-colors duration-500 hover:bg-transparent hover:text-forest-900"
            >
              Book
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      {/* Luxury Footer */}
      <footer className="bg-forest-900 py-20 text-linen-50">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid gap-12 md:grid-cols-3">
            <div className="col-span-1 md:col-span-2">
              <h3 className="font-serif text-3xl md:text-5xl tracking-wide mb-6">DAMAR.</h3>
              <p className="max-w-md text-forest-500 text-sm leading-relaxed">
                An exclusive sanctuary where modern luxury meets the untamed beauty of nature. 
                Experience tranquility in our meticulously curated retreats.
              </p>
            </div>
            <div className="flex flex-col space-y-4 text-sm tracking-[0.1em] uppercase text-forest-500">
              <Link href="#" className="hover:text-linen-50 transition-colors">Instagram</Link>
              <Link href="#" className="hover:text-linen-50 transition-colors">Journal</Link>
              <Link href="#" className="hover:text-linen-50 transition-colors">Contact</Link>
              <Link href="/admin/login" className="hover:text-linen-50 transition-colors">Admin Portal</Link>
            </div>
          </div>
          <div className="mt-20 border-t border-forest-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs tracking-wider text-forest-600">
            <p>&copy; {new Date().getFullYear()} Damar Retreats. All rights reserved.</p>
            <p className="mt-4 md:mt-0">Design by Antigravity</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
