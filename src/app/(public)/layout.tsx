"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import AiConcierge from "@/components/ui/AiConcierge";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      {/* ── Navbar ─────────────────────────────────────────────── */}
      <header
        className={`fixed top-0 z-50 w-full transition-all duration-700 ease-luxury ${
          scrolled
            ? "bg-parchment-50/95 backdrop-blur-sm border-b border-parchment-300"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-20 max-w-[1400px] items-center justify-between px-6 md:px-12">
          {/* Left nav */}
          <nav className="hidden flex-1 items-center gap-10 md:flex">
            <Link
              href="/#accommodations"
              className={`link-underline text-[10px] uppercase tracking-[0.25em] transition-colors duration-500 ${
                scrolled ? "text-obsidian-700" : "text-parchment-100"
              }`}
            >
              Kamar & Vila
            </Link>
            <Link
              href="/#kolam"
              className={`link-underline text-[10px] uppercase tracking-[0.25em] transition-colors duration-500 ${
                scrolled ? "text-obsidian-700" : "text-parchment-100"
              }`}
            >
              Kolam Renang
            </Link>
          </nav>

          {/* Center logo */}
          <div className="flex flex-1 justify-center">
            <Link href="/" className="group text-center">
              <span
                className={`font-serif text-[1.5rem] font-light tracking-[0.2em] transition-colors duration-500 md:text-[1.75rem] ${
                  scrolled ? "text-obsidian-900" : "text-parchment-50"
                }`}
              >
                ROSA
              </span>
              <span className={`block text-[9px] uppercase tracking-[0.3em] transition-colors duration-500 ${
                scrolled ? "text-obsidian-500" : "text-parchment-300"
              }`}>
                Glamping & Pool
              </span>
            </Link>
          </div>

          {/* Right actions */}
          <div className="hidden flex-1 items-center justify-end gap-8 md:flex">
            <Link
              href="/admin/login"
              className={`link-underline text-[10px] uppercase tracking-[0.25em] transition-colors duration-500 ${
                scrolled ? "text-obsidian-700" : "text-parchment-100"
              }`}
            >
              Staff
            </Link>
            <Link
              href="/#accommodations"
              className={`border px-7 py-3 text-[10px] uppercase tracking-[0.25em] transition-all duration-500 ${
                scrolled
                  ? "border-obsidian-900 text-obsidian-900 hover:bg-obsidian-900 hover:text-parchment-50"
                  : "border-parchment-100 text-parchment-50 hover:bg-parchment-50 hover:text-obsidian-900"
              }`}
            >
              Pesan Sekarang
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="flex flex-1 justify-end md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? (
              <X className={`h-5 w-5 ${scrolled ? "text-obsidian-900" : "text-parchment-50"}`} strokeWidth={1} />
            ) : (
              <Menu className={`h-5 w-5 ${scrolled ? "text-obsidian-900" : "text-parchment-50"}`} strokeWidth={1} />
            )}
          </button>
        </div>

        {/* Mobile drawer */}
        <div
          className={`overflow-hidden transition-all duration-700 ease-luxury bg-parchment-50 md:hidden ${
            menuOpen ? "max-h-64 border-t border-parchment-200" : "max-h-0"
          }`}
        >
          <nav className="flex flex-col gap-6 px-6 py-8">
            <Link href="/#accommodations" onClick={() => setMenuOpen(false)} className="link-underline text-[10px] uppercase tracking-[0.25em] text-obsidian-700 w-fit">Kamar & Vila</Link>
            <Link href="/#kolam" onClick={() => setMenuOpen(false)} className="link-underline text-[10px] uppercase tracking-[0.25em] text-obsidian-700 w-fit">Kolam Renang</Link>
            <Link href="/admin/login" onClick={() => setMenuOpen(false)} className="link-underline text-[10px] uppercase tracking-[0.25em] text-obsidian-700 w-fit">Staff</Link>
            <Link href="/#accommodations" onClick={() => setMenuOpen(false)} className="mt-2 border border-obsidian-900 px-7 py-3 text-center text-[10px] uppercase tracking-[0.25em] text-obsidian-900 w-full">Pesan Sekarang</Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      {/* ── Marquee banner ─────────────────────────────────────── */}
      <div className="overflow-hidden border-y border-obsidian-900 bg-obsidian-900 py-4">
        <div className="flex w-max animate-marquee gap-0">
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i} className="flex items-center gap-8 px-8 text-[10px] uppercase tracking-[0.3em] text-obsidian-400">
              <span>Glamping Syariah</span>
              <span className="text-gold-400">✦</span>
              <span>Kolam Renang</span>
              <span className="text-gold-400">✦</span>
              <span>Ciparay, Bandung</span>
              <span className="text-gold-400">✦</span>
              <span>Cocok Untuk Keluarga</span>
              <span className="text-gold-400">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── Footer ─────────────────────────────────────────────── */}
      <footer className="bg-obsidian-900 text-parchment-100">
        <div className="mx-auto max-w-[1400px] px-6 py-24 md:px-12">
          <div className="grid gap-16 md:grid-cols-12">
            <div className="md:col-span-5">
              <p className="mb-2 font-serif text-5xl font-light tracking-[0.15em] md:text-6xl">
                ROSA
              </p>
              <p className="mb-6 text-[10px] uppercase tracking-[0.3em] text-obsidian-500">Glamping & Pool · Ciparay</p>
              <p className="max-w-sm text-sm leading-relaxed text-obsidian-400">
                Tempat istirahat yang nyaman dan asri di Kampung Lebak Biru, Ciheulang, Kecamatan Ciparay, Bandung. Properti syariah — aman, nyaman, dan terpercaya untuk keluarga.
              </p>
            </div>
            <div className="md:col-span-3">
              <p className="mb-6 text-[10px] uppercase tracking-[0.25em] text-obsidian-500">Jelajahi</p>
              <ul className="space-y-4 text-sm text-obsidian-400">
                <li><Link href="/#accommodations" className="link-underline hover:text-parchment-100 transition-colors duration-300">Kamar & Vila</Link></li>
                <li><Link href="/#kolam" className="link-underline hover:text-parchment-100 transition-colors duration-300">Kolam Renang</Link></li>
                <li><Link href="/#accommodations" className="link-underline hover:text-parchment-100 transition-colors duration-300">Cara Pesan</Link></li>
              </ul>
            </div>
            <div className="md:col-span-4">
              <p className="mb-6 text-[10px] uppercase tracking-[0.25em] text-obsidian-500">Hubungi Kami</p>
              <ul className="space-y-4 text-sm text-obsidian-400">
                <li>
                  <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer" className="link-underline hover:text-parchment-100 transition-colors duration-300">
                    WhatsApp
                  </a>
                </li>
                <li>
                  <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" className="link-underline hover:text-parchment-100 transition-colors duration-300">
                    Instagram
                  </a>
                </li>
                <li>
                  <Link href="/admin/login" className="link-underline hover:text-parchment-100 transition-colors duration-300">
                    Staff Portal
                  </Link>
                </li>
              </ul>
              <p className="mt-6 text-xs leading-relaxed text-obsidian-600">
                Kp. Lebak Biru, Ciheulang,<br />
                Kec. Ciparay, Kab. Bandung,<br />
                Jawa Barat 40381
              </p>
            </div>
          </div>

          <div className="mt-20 flex flex-col items-center justify-between border-t border-obsidian-800 pt-8 md:flex-row">
            <p className="text-[10px] uppercase tracking-[0.2em] text-obsidian-600">
              © {new Date().getFullYear()} Rosa Glamping & Pool Ciparay
            </p>
            <p className="mt-4 text-[10px] uppercase tracking-[0.2em] text-obsidian-600 md:mt-0">
              Properti Syariah · Bandung Selatan
            </p>
          </div>
        </div>
      </footer>

      {/* ── AI CONCIERGE (Floating Chat) ──────────────────────── */}
      <AiConcierge />
    </div>
  );
}
