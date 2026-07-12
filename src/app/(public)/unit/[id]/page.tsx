import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Metadata } from "next";

export const revalidate = 3600; // 1 hour cache

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const unit = await prisma.unit.findUnique({ where: { id: resolvedParams.id } });
  
  if (!unit) return { title: "Unit Not Found" };

  return {
    title: `${unit.name} | ${unit.type}`,
    description: unit.promotionalCopy?.slice(0, 160) || `Experience luxury at ${unit.name}, a premium ${unit.type} offering an unforgettable retreat in nature.`,
    openGraph: {
      images: [unit.photoUrls[0]],
    },
  };
}

export default async function UnitDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const unit = await prisma.unit.findUnique({ where: { id: resolvedParams.id } });
  if (!unit) notFound();

  const photo0 = unit.photoUrls[0] || "https://images.unsplash.com/photo-1542718610-a1d656d1884c?auto=format&fit=crop&q=80";
  const photo1 = unit.photoUrls[1] || "https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&q=80";
  const photo2 = unit.photoUrls[2] || null;

  return (
    <article className="min-h-screen bg-parchment-50 pt-20">
      {/* ── FULL-BLEED HERO IMAGE ───────────────────────────────── */}
      <div className="relative h-[75vh] w-full overflow-hidden">
        <Image src={photo0} alt={unit.name} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-parchment-50 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-12 md:px-16 flex items-end justify-between">
          <div>
            <p className="mb-2 text-[9px] uppercase tracking-[0.3em] text-parchment-300">{unit.type}</p>
            <h1 className="font-serif text-6xl font-light text-parchment-50 md:text-8xl">{unit.name}</h1>
          </div>
          <div className="text-right hidden md:block">
            <p className="text-[9px] uppercase tracking-[0.2em] text-parchment-300 mb-1">Per Malam</p>
            <p className="font-serif text-3xl text-parchment-50">
              Rp {unit.pricePerNight.toLocaleString("id-ID")}
            </p>
          </div>
        </div>
      </div>

      {/* ── SECONDARY IMAGES ────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-1 px-1">
        <div className="relative aspect-[16/7] overflow-hidden">
          <Image src={photo1} alt={`${unit.name} interior`} fill className="object-cover" />
        </div>
        <div className="relative aspect-[16/7] overflow-hidden bg-obsidian-800">
          {photo2 ? (
            <Image src={photo2} alt={`${unit.name} detail`} fill className="object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-obsidian-900">
              <span className="text-[9px] uppercase tracking-[0.3em] text-obsidian-500">Foto menyusul</span>
            </div>
          )}
        </div>
      </div>

      {/* ── CONTENT & BOOKING ───────────────────────────────────── */}
      <div className="mx-auto max-w-[1400px] px-6 py-24 md:px-16">
        <div className="grid gap-20 lg:grid-cols-12">

          {/* Left: editorial content */}
          <div className="lg:col-span-7">
            <div className="mb-16 grid grid-cols-3 gap-8 border-b border-parchment-300 pb-16">
              <div>
                <p className="mb-2 text-[9px] uppercase tracking-[0.25em] text-obsidian-400">Tipe</p>
                <p className="font-serif text-lg text-obsidian-900">{unit.type}</p>
              </div>
              <div>
                <p className="mb-2 text-[9px] uppercase tracking-[0.25em] text-obsidian-400">Kapasitas</p>
                <p className="font-serif text-lg text-obsidian-900">{unit.capacity} tamu</p>
              </div>
              <div>
                <p className="mb-2 text-[9px] uppercase tracking-[0.25em] text-obsidian-400">Harga</p>
                <p className="font-serif text-lg text-obsidian-900">
                  Rp {unit.pricePerNight.toLocaleString("id-ID")}
                </p>
              </div>
            </div>

            <p className="font-serif text-2xl font-light leading-relaxed text-obsidian-800 md:text-3xl mb-16">
              {unit.promotionalCopy ||
                "Nikmati kenyamanan berlibur di tengah asrinya alam Ciparay. Ruangan ini dirancang khusus untuk kenyamanan Anda dan keluarga."}
            </p>

            <div>
              <p className="mb-8 text-[9px] uppercase tracking-[0.25em] text-obsidian-400">Fasilitas Kamar</p>
              <div className="grid grid-cols-2 gap-x-12 gap-y-5">
                {unit.amenities.map((a, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <span className="h-[1px] w-6 flex-shrink-0 bg-gold-400" />
                    <span className="text-sm text-obsidian-800">{a}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: sticky booking widget */}
          <div className="lg:col-span-5">
            <div className="sticky top-28 border border-parchment-300 bg-white p-10">
              <p className="mb-2 text-[9px] uppercase tracking-[0.25em] text-obsidian-400">Pesan Kamar</p>
              <p className="font-serif text-3xl text-obsidian-900 mb-8">{unit.name}</p>

              <div className="mb-8 border-t border-parchment-300 pt-6 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-obsidian-500">Tarif per malam</span>
                  <span className="text-obsidian-900 font-medium">
                    Rp {unit.pricePerNight.toLocaleString("id-ID")}
                  </span>
                </div>
              </div>

              <p className="mb-8 text-xs leading-relaxed text-obsidian-400">
                Pilih tanggal menginap Kakak di halaman selanjutnya. Kami akan menyimpan pesanan ini selama 24 jam setelah dikonfirmasi.
              </p>

              <Link
                href={`/unit/${unit.id}/book`}
                className="block w-full bg-obsidian-900 py-5 text-center text-[10px] uppercase tracking-[0.3em] text-parchment-50 transition-colors duration-500 hover:bg-obsidian-800"
              >
                Cek Ketersediaan
              </Link>

              <div className="mt-4 flex flex-col gap-3">
                <a
                  href="https://wa.me/6281234567890?text=Halo%2C%20saya%20tertarik%20untuk%20menginap."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full border border-green-700/30 bg-green-50 py-4 text-center text-[10px] uppercase tracking-[0.3em] text-green-800 transition-colors duration-300 hover:bg-green-100 hover:border-green-700/50"
                >
                  Tanya via WhatsApp
                </a>

                <Link
                  href="/"
                  className="block w-full border border-parchment-300 py-4 text-center text-[10px] uppercase tracking-[0.3em] text-obsidian-600 transition-colors duration-300 hover:border-obsidian-400 hover:text-obsidian-900"
                >
                  ← Kembali ke Beranda
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
