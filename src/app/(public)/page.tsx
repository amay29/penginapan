import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";

export default async function LandingPage() {
  const units = await prisma.unit.findMany({
    orderBy: { pricePerNight: 'asc' }
  });

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[80vh] min-h-[600px] w-full overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&q=80"
          alt="Glamping in the forest"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-earth-900/40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="container mx-auto px-4 text-center text-sand-50">
            <h1 className="mb-6 text-5xl font-bold leading-tight md:text-7xl">
              Reconnect with Nature.<br />
              <span className="text-sand-300">Without Compromise.</span>
            </h1>
            <p className="mx-auto mb-10 max-w-2xl text-lg text-sand-100 md:text-xl">
              Experience the tranquility of the forest in our premium A-Frame cabins and Safari tents, designed for ultimate comfort and relaxation.
            </p>
            <Link
              href="#units"
              className="inline-block rounded-full bg-sand-50 px-8 py-4 text-lg font-semibold text-earth-900 smooth-transition hover:bg-sand-200"
            >
              Explore Accommodations
            </Link>
          </div>
        </div>
      </section>

      {/* Units Section */}
      <section id="units" className="bg-sand-50 py-24">
        <div className="container mx-auto px-4 md:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-earth-900">Our Accommodations</h2>
            <p className="mx-auto max-w-2xl text-earth-700">
              Each unit is meticulously designed to blend seamlessly with the surrounding landscape while providing luxurious amenities.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {units.map((unit) => (
              <div 
                key={unit.id} 
                className="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm smooth-transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <Image
                    src={unit.photoUrls[0] || "https://images.unsplash.com/photo-1542718610-a1d656d1884c?auto=format&fit=crop&q=80"}
                    alt={unit.name}
                    fill
                    className="object-cover smooth-transition group-hover:scale-105"
                  />
                  <div className="absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-earth-800 backdrop-blur-md">
                    {unit.type}
                  </div>
                </div>
                
                <div className="flex flex-1 flex-col p-6">
                  <div className="mb-2 flex items-baseline justify-between">
                    <h3 className="text-xl font-bold text-earth-900">{unit.name}</h3>
                  </div>
                  
                  <p className="mb-6 line-clamp-2 text-sm text-earth-700">
                    {unit.promotionalCopy}
                  </p>
                  
                  <div className="mt-auto flex items-end justify-between border-t border-sand-100 pt-4">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-earth-600">Starting from</p>
                      <p className="text-lg font-bold text-earth-900">
                        Rp {unit.pricePerNight.toLocaleString('id-ID')} <span className="text-sm font-normal text-earth-600">/ night</span>
                      </p>
                    </div>
                    <Link
                      href={`/unit/${unit.id}`}
                      className="rounded-lg bg-earth-800 px-4 py-2 text-sm font-medium text-sand-50 smooth-transition hover:bg-earth-900"
                    >
                      Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
