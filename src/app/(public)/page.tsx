import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default async function PublicLandingPage() {
  const units = await prisma.unit.findMany({
    orderBy: { pricePerNight: "desc" }
  });

  return (
    <div>
      {/* Luxury Hero Section */}
      <section className="relative h-screen w-full flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&q=80"
            alt="Luxury Glamping in the Forest"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-forest-900/40 mix-blend-multiply" />
        </div>
        
        <div className="relative z-10 text-center px-4 mt-20">
          <p className="mb-4 text-xs tracking-[0.3em] uppercase text-linen-100">Welcome to</p>
          <h1 className="font-serif text-6xl md:text-8xl lg:text-9xl text-linen-50 drop-shadow-sm">
            Damar.
          </h1>
          <p className="mt-8 font-serif text-xl italic text-linen-100 max-w-lg mx-auto">
            "A sanctuary of quiet luxury amidst the wild."
          </p>
        </div>
      </section>

      {/* Intro Section */}
      <section className="py-32 px-6 md:px-12 max-w-4xl mx-auto text-center">
         <h2 className="font-serif text-3xl md:text-5xl leading-tight text-forest-900 mb-8">
           Redefining the art of retreating.
         </h2>
         <p className="text-forest-600 leading-relaxed md:text-lg">
           Leave the noise behind. Damar offers an exclusive collection of architecturally stunning shelters designed to immerse you in nature without compromising on the highest standards of hospitality.
         </p>
      </section>

      {/* Accommodations Grid (Boutique Style) */}
      <section id="accommodations" className="py-20 px-6 md:px-12 bg-white">
        <div className="container mx-auto">
          <div className="mb-20 flex flex-col items-start justify-between border-b border-linen-800 pb-8 md:flex-row md:items-end">
            <div>
              <p className="text-xs tracking-[0.2em] uppercase text-forest-500 mb-4">Our Spaces</p>
              <h2 className="font-serif text-4xl md:text-6xl text-forest-900">
                The Collection
              </h2>
            </div>
            <Link href="#accommodations" className="mt-6 hidden items-center space-x-2 text-xs uppercase tracking-[0.2em] text-forest-900 luxury-link md:flex">
              <span>View All</span>
              <ArrowRight className="h-4 w-4" strokeWidth={1} />
            </Link>
          </div>

          <div className="grid gap-y-24 gap-x-12 md:grid-cols-2">
            {units.map((unit, index) => (
              <div key={unit.id} className={`group flex flex-col ${index === 1 ? 'md:mt-24' : ''}`}>
                <Link href={`/unit/${unit.id}`} className="relative block aspect-[4/5] w-full overflow-hidden bg-linen-100">
                  <Image
                    src={unit.photoUrls[0] || "https://images.unsplash.com/photo-1542718610-a1d656d1884c?auto=format&fit=crop&q=80"}
                    alt={unit.name}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-forest-900/0 transition-colors duration-700 group-hover:bg-forest-900/10" />
                </Link>
                
                <div className="mt-8 flex flex-col justify-between md:flex-row md:items-start">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-forest-500 mb-2">{unit.type}</p>
                    <h3 className="font-serif text-3xl text-forest-900 group-hover:text-forest-600 transition-colors duration-500">
                      <Link href={`/unit/${unit.id}`}>{unit.name}</Link>
                    </h3>
                  </div>
                  <div className="mt-4 md:mt-0 md:text-right">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-forest-500 mb-2">From</p>
                    <p className="text-lg text-forest-900 font-medium">Rp {unit.pricePerNight.toLocaleString('id-ID')}</p>
                  </div>
                </div>
                <Link 
                  href={`/unit/${unit.id}`} 
                  className="mt-6 inline-flex w-fit items-center space-x-2 text-xs uppercase tracking-[0.2em] text-forest-900 border-b border-forest-900 pb-1 hover:text-forest-600 hover:border-forest-600 transition-colors duration-500"
                >
                  <span>Discover</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
