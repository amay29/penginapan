import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";

export default async function PublicLandingPage() {
  const units = await prisma.unit.findMany({
    orderBy: { pricePerNight: "desc" }
  });

  return (
    <article>
      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="relative h-screen w-full overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&q=90&w=2400"
          alt="Damar luxury glamping retreat in the forest"
          fill
          className="object-cover"
          priority
        />
        {/* Gradient overlay — heavier at bottom for text breathing room */}
        <div className="absolute inset-0 bg-gradient-to-b from-obsidian-950/60 via-obsidian-950/20 to-obsidian-950/70" />

        {/* Hero text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <p className="animate-fade-up animation-delay-200 mb-4 text-[10px] uppercase tracking-[0.4em] text-gold-300">
            Est. 2024 · West Java, Indonesia
          </p>
          <h1 className="animate-fade-up animation-delay-400 font-serif text-[clamp(4rem,12vw,10rem)] font-light leading-none tracking-[0.06em] text-parchment-50">
            DAMAR
          </h1>
          <p className="animate-fade-up animation-delay-600 mt-6 font-serif text-xl font-light italic text-parchment-200 max-w-md">
            A sanctuary of quiet luxury amidst the wild
          </p>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-fade-up animation-delay-600">
          <span className="text-[9px] uppercase tracking-[0.3em] text-parchment-300">Scroll</span>
          <div className="h-12 w-[1px] bg-gradient-to-b from-parchment-300 to-transparent" />
        </div>
      </section>

      {/* ── PHILOSOPHY ───────────────────────────────────────────── */}
      <section className="py-32 px-6">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-8 text-[10px] uppercase tracking-[0.3em] text-obsidian-500">Our Philosophy</p>
          <blockquote className="font-serif text-3xl font-light leading-relaxed text-obsidian-900 md:text-5xl">
            "We believe that true luxury is not in excess,
            but in the perfection of simplicity."
          </blockquote>
        </div>
      </section>

      {/* ── HORIZONTAL RULE (editorial) ──────────────────────────── */}
      <div className="mx-6 border-t border-parchment-300 md:mx-12" />

      {/* ── COLLECTION ───────────────────────────────────────────── */}
      <section id="accommodations" className="py-24 px-6 md:px-12">
        <div className="mx-auto max-w-[1400px]">

          {/* Section header */}
          <div className="mb-20 grid grid-cols-2 items-end md:grid-cols-3">
            <div>
              <p className="mb-3 text-[10px] uppercase tracking-[0.25em] text-obsidian-500">
                No. {String(units.length).padStart(2, "0")} Spaces
              </p>
              <h2 className="font-serif text-5xl font-light text-obsidian-900 md:text-7xl">
                The<br />Collection
              </h2>
            </div>
            <div className="hidden md:block" />
            <p className="text-right text-sm leading-relaxed text-obsidian-500 max-w-xs ml-auto">
              Each structure is hand-selected for its architecture, its setting,
              and its ability to make you feel beautifully alone.
            </p>
          </div>

          {/* Staggered editorial grid */}
          <div className="grid grid-cols-1 gap-x-8 gap-y-28 md:grid-cols-12">
            {units.map((unit, i) => {
              // Alternate: large-left / large-right pattern
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
                  {/* Image */}
                  <Link
                    href={`/unit/${unit.id}`}
                    className={`${imgCols} relative block overflow-hidden bg-parchment-200 ${
                      isEven ? "aspect-[3/4]" : "aspect-[4/3]"
                    } ${isEven ? "" : "md:order-2"}`}
                  >
                    <Image
                      src={
                        unit.photoUrls[0] ||
                        "https://images.unsplash.com/photo-1542718610-a1d656d1884c?auto=format&fit=crop&q=80"
                      }
                      alt={unit.name}
                      fill
                      className="object-cover transition-transform duration-[1200ms] ease-luxury group-hover:scale-105"
                    />
                    {/* Number badge */}
                    <span className="absolute top-6 left-6 font-serif text-xs text-parchment-200 tracking-widest">
                      0{i + 1}
                    </span>
                  </Link>

                  {/* Text */}
                  <div className={`${textCols} flex flex-col justify-center ${isEven ? "md:pl-8" : "md:order-1 md:pr-8"}`}>
                    <p className="mb-4 text-[10px] uppercase tracking-[0.25em] text-obsidian-500">
                      {unit.type} · Up to {unit.capacity} guests
                    </p>
                    <h3 className="font-serif text-4xl font-light leading-tight text-obsidian-900 md:text-5xl">
                      {unit.name}
                    </h3>

                    <div className="my-8 h-[1px] w-16 bg-parchment-400" />

                    <p className="mb-10 text-sm leading-relaxed text-obsidian-500 max-w-sm line-clamp-3">
                      {unit.promotionalCopy ||
                        "An intimate retreat designed to dissolve the boundary between inside and outside. Mornings are yours to keep."}
                    </p>

                    <div className="flex items-end justify-between">
                      <Link
                        href={`/unit/${unit.id}`}
                        className="link-underline text-[10px] uppercase tracking-[0.25em] text-obsidian-900 pb-0.5"
                      >
                        Discover Space
                      </Link>
                      <div className="text-right">
                        <p className="text-[9px] uppercase tracking-[0.2em] text-obsidian-400 mb-1">From</p>
                        <p className="font-serif text-2xl text-obsidian-900">
                          Rp {unit.pricePerNight.toLocaleString("id-ID")}
                          <span className="text-sm font-sans text-obsidian-500"> /night</span>
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

      {/* ── FULL-WIDTH IMMERSIVE BANNER ───────────────────────────── */}
      <section className="relative h-[60vh] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&q=85&w=2000"
          alt="Forest glamping atmosphere"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-obsidian-950/50" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <p className="mb-6 font-serif text-3xl font-light italic text-parchment-100 md:text-5xl">
            "Step outside. Stay inside luxury."
          </p>
          <Link
            href="/#accommodations"
            className="mt-4 border border-parchment-200 px-10 py-4 text-[10px] uppercase tracking-[0.3em] text-parchment-100 hover:bg-parchment-50 hover:text-obsidian-900 transition-colors duration-500"
          >
            Explore Retreats
          </Link>
        </div>
      </section>
    </article>
  );
}
