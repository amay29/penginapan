import Link from "next/link";
import { ReactNode } from "react";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-sand-50">
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-earth-100 bg-sand-50/80 backdrop-blur-md">
        <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-8">
          <Link href="/" className="text-2xl font-bold tracking-tight text-earth-900 smooth-transition hover:text-earth-700">
            Damar Glamping
          </Link>
          <nav className="hidden space-x-8 md:flex">
            <Link href="/" className="text-sm font-medium text-earth-800 hover:text-earth-600">Home</Link>
            <Link href="/#units" className="text-sm font-medium text-earth-800 hover:text-earth-600">Our Units</Link>
            <Link href="/about" className="text-sm font-medium text-earth-800 hover:text-earth-600">Our Story</Link>
          </nav>
          <div className="flex items-center space-x-4">
            <Link 
              href="/admin/login" 
              className="text-xs font-semibold uppercase tracking-wider text-earth-600 hover:text-earth-800"
            >
              Sign In
            </Link>
            <Link 
              href="/#units" 
              className="rounded-full bg-earth-800 px-6 py-2.5 text-sm font-medium text-sand-50 smooth-transition hover:bg-earth-900"
            >
              Book Now
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-earth-900 py-12 text-sand-50">
        <div className="container mx-auto grid gap-8 px-4 md:grid-cols-3 md:px-8">
          <div>
            <h3 className="mb-4 text-xl font-bold">Damar Glamping</h3>
            <p className="text-sm text-sand-200">
              Escape the ordinary. Experience nature without sacrificing comfort in our premium A-Frame cabins and Safari tents.
            </p>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider">Explore</h4>
            <ul className="space-y-2 text-sm text-sand-200">
              <li><Link href="/" className="hover:text-sand-50">Home</Link></li>
              <li><Link href="/#units" className="hover:text-sand-50">Accommodations</Link></li>
              <li><Link href="/about" className="hover:text-sand-50">Our Story</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider">Contact</h4>
            <ul className="space-y-2 text-sm text-sand-200">
              <li>hello@damarglamping.com</li>
              <li>+62 812 3456 7890</li>
              <li>Mount Salak, West Java, Indonesia</li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto mt-12 border-t border-earth-800 px-4 pt-8 text-center text-xs text-sand-300 md:px-8">
          &copy; {new Date().getFullYear()} Damar Glamping. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
