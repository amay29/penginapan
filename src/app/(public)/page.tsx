import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

export const revalidate = 60;

async function UnitCollection() {
  const units = await prisma.unit.findMany({ orderBy: { pricePerNight: "desc" } });

  return (
    <section id="accommodations" className="py-24 px-6 md:px-12">
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-20 grid grid-cols-2 items-end md:grid-cols-3">
          <div>
            <p className="mb-3 text-[10px] uppercase tracking-[0.25em] text-obsidian-500">
              {String(units.length).padStart(2, "0")} Pilihan Kamar
            </p>
            <h2 className="font-serif text-5xl font-light text-obsidian-900 md:text-7xl">
              Kamar &<br />Vila Kami
            </h2>
          </div>
          <div className="hidden md:block" />
          <p className="text-right text-sm leading-relaxed text-obsidian-500 max-w-xs ml-auto">
            Setiap kamar dirancang untuk memberikan kenyamanan maksimal di tengah alam Ciparay yang sejuk dan asri.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-x-8 gap-y-28 md:grid-cols-12">
          {units.map((unit, i) => {
            const isEven = i % 2 === 0;
            const imgCols = isEven ? "md:col-span-7" : "md:col-span-5 md:col-start-8";
            const textCols = isEven ? "md:col-span-5 md:col-start-8" : "md:col-span-7";
            return (
              <div
                key={unit.id}
                className={`group md:col-span-12 grid md:grid-cols-12 gap-8 md:gap-12 items-center ${
                  isEven ? "" : "md:[grid-template-areas:'text_image']"
                }`}
              >
                <Link
                  href={`/unit/${unit.id}`}
                  className={`${imgCols} relative block overflow-hidden bg-parchment-200 ${
                    isEven ? "aspect-[3/4]" : "aspect-4/3"
                  } ${isEven ? "" : "md:order-2"}`}
                >
                  <Image
                    src={unit.photoUrls[0] || "https://cf.bstatic.com/xdata/images/hotel/max1024x768/798760522.jpg?k=e6b10381b25574e277b2204741b734f853eb40b9f13345586482665778a90630&o=&hp=1"}
                    alt={unit.name}
                    fill
                    className="object-cover transition-transform duration-[1200ms] ease-luxury group-hover:scale-105"
                  />
                  <span className="absolute top-6 left-6 font-serif text-xs text-parchment-200 tracking-widest">
                    0{i + 1}
                  </span>
                </Link>

                <div className={`${textCols} flex flex-col justify-center ${isEven ? "md:pl-8" : "md:order-1 md:pr-8"}`}>
                  <p className="mb-4 text-[10px] uppercase tracking-[0.25em] text-obsidian-500">
                    {unit.type} · Maks. {unit.capacity} tamu
                  </p>
                  <h3 className="font-serif text-4xl font-light leading-tight text-obsidian-900 md:text-5xl">
                    {unit.name}
                  </h3>
                  <div className="my-8 h-[1px] w-16 bg-parchment-400" />
                  <p className="mb-10 text-sm leading-relaxed text-obsidian-500 max-w-sm line-clamp-3">
                    {unit.promotionalCopy || "Kamar yang nyaman dengan fasilitas lengkap. Cocok untuk keluarga maupun pasangan yang ingin menikmati suasana Ciparay yang asri dan sejuk."}
                  </p>
                  <div className="flex items-end justify-between">
                    <Link href={`/unit/${unit.id}`} className="link-underline text-[10px] uppercase tracking-[0.25em] text-obsidian-900 pb-0.5">
                      Lihat Detail
                    </Link>
                    <div className="text-right">
                      <p className="text-[9px] uppercase tracking-[0.2em] text-obsidian-400 mb-1">Mulai dari</p>
                      <p className="font-serif text-2xl text-obsidian-900">
                        Rp {unit.pricePerNight.toLocaleString("id-ID")}
                        <span className="text-sm font-sans text-obsidian-500"> /malam</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function UnitCollectionSkeleton() {
  return (
    <section className="py-24 px-6 md:px-12">
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-20">
          <div className="h-4 w-32 bg-parchment-200 mb-4 animate-pulse" />
          <div className="h-16 w-64 bg-parchment-200 animate-pulse" />
        </div>
        <div className="grid grid-cols-1 gap-24 md:grid-cols-2">
          {[1, 2].map(i => (
            <div key={i}>
              <div className="aspect-[3/4] w-full bg-parchment-200 animate-pulse" />
              <div className="mt-8 space-y-4">
                <div className="h-3 w-32 bg-parchment-200 animate-pulse" />
                <div className="h-10 w-56 bg-parchment-200 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default async function PublicLandingPage() {

  return (
    <article>
      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="relative h-screen w-full overflow-hidden">
        <Image
          src="https://cf.bstatic.com/xdata/images/hotel/max1024x768/798760522.jpg?k=e6b10381b25574e277b2204741b734f853eb40b9f13345586482665778a90630&o=&hp=1"
          alt="Rosa Glamping and Pool Ciparay — kolam renang dan penginapan"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-obsidian-950/60 via-obsidian-950/20 to-obsidian-950/70" />

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <p className="animate-fade-up animation-delay-200 mb-4 text-[10px] uppercase tracking-[0.4em] text-gold-300">
            Glamping & Pool · Ciparay, Bandung
          </p>
          <h1 className="animate-fade-up animation-delay-400 font-serif text-[clamp(3.5rem,11vw,9rem)] font-light leading-none tracking-[0.06em] text-parchment-50">
            ROSA
          </h1>
          <p className="animate-fade-up animation-delay-500 mt-1 text-[10px] uppercase tracking-[0.3em] text-parchment-300">
            Glamping & Pool
          </p>
          <p className="animate-fade-up animation-delay-600 mt-6 font-serif text-xl font-light italic text-parchment-200 max-w-md">
            Tempat istirahat yang asri, nyaman, dan halal untuk seluruh keluarga
          </p>
          <Link
            href="/#accommodations"
            className="animate-fade-up animation-delay-600 mt-10 border border-parchment-200 px-10 py-4 text-[10px] uppercase tracking-[0.3em] text-parchment-100 hover:bg-parchment-50 hover:text-obsidian-900 transition-colors duration-500"
          >
            Lihat Kamar
          </Link>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-fade-up animation-delay-600">
          <span className="text-[9px] uppercase tracking-[0.3em] text-parchment-300">Gulir</span>
          <div className="h-12 w-[1px] bg-gradient-to-b from-parchment-300 to-transparent" />
        </div>
      </section>

      {/* ── KEUNGGULAN ────────────────────────────────────────────── */}
      <section className="py-32 px-6">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-8 text-[10px] uppercase tracking-[0.3em] text-obsidian-500">Kenapa Rosa?</p>
          <blockquote className="font-serif text-3xl font-light leading-relaxed text-obsidian-900 md:text-5xl">
            "Alam yang sejuk, kolam yang jernih, dan kamar yang bersih — semua ada di sini."
          </blockquote>
          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3 text-left">
            <div>
              <p className="text-[9px] uppercase tracking-[0.3em] text-obsidian-400 mb-3">01</p>
              <h3 className="font-serif text-xl font-light text-obsidian-900 mb-3">Properti Syariah</h3>
              <p className="text-sm leading-relaxed text-obsidian-500">Aman dan nyaman untuk keluarga dan pasangan halal. Tidak perlu khawatir soal keamanan dan kenyamanan selama menginap.</p>
            </div>
            <div>
              <p className="text-[9px] uppercase tracking-[0.3em] text-obsidian-400 mb-3">02</p>
              <h3 className="font-serif text-xl font-light text-obsidian-900 mb-3">Kolam Renang</h3>
              <p className="text-sm leading-relaxed text-obsidian-500">Kolam renang outdoor yang bersih dan terawat. Cocok untuk anak-anak hingga orang dewasa, dengan latar alam yang menyegarkan.</p>
            </div>
            <div>
              <p className="text-[9px] uppercase tracking-[0.3em] text-obsidian-400 mb-3">03</p>
              <h3 className="font-serif text-xl font-light text-obsidian-900 mb-3">Suasana Asri</h3>
              <p className="text-sm leading-relaxed text-obsidian-500">Terletak di kaki gunung Ciparay dengan udara yang sejuk dan pemandangan alam yang indah. Kabur sejenak dari hiruk-pikuk kota.</p>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-6 border-t border-parchment-300 md:mx-12" />

      {/* ── COLLECTION ────────────────────────────────────────────── */}
      <Suspense fallback={<UnitCollectionSkeleton />}>
        <UnitCollection />
      </Suspense>

      {/* ── KOLAM RENANG BANNER ────────────────────────────────────── */}
      <section id="kolam" className="relative h-[60vh] overflow-hidden">
        <Image
          src="https://cf.bstatic.com/xdata/images/hotel/max1024x768/798760496.jpg?k=4843aeb3415768a213bb285fed6ede55d96acebd8cacd16fcd901a3aa258a909&o=&hp=1"
          alt="Rosa Swimming Pool — kolam renang outdoor Rosa Glamping Ciparay"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-obsidian-950/50" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <p className="mb-3 text-[10px] uppercase tracking-[0.4em] text-gold-300">Fasilitas Unggulan</p>
          <p className="mb-6 font-serif text-3xl font-light italic text-parchment-100 md:text-5xl">
            "Rosa Swimming Pool"
          </p>
          <p className="mb-8 text-sm text-parchment-300 max-w-md">
            Kolam renang outdoor yang bersih dan terawat — tersedia untuk tamu menginap maupun pengunjung harian.
          </p>
          <Link
            href="/#accommodations"
            className="border border-parchment-200 px-10 py-4 text-[10px] uppercase tracking-[0.3em] text-parchment-100 hover:bg-parchment-50 hover:text-obsidian-900 transition-colors duration-500"
          >
            Pesan Sekarang
          </Link>
        </div>
      </section>
    </article>
  );
}
