import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function UnitDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const unit = await prisma.unit.findUnique({
    where: { id: resolvedParams.id }
  });

  if (!unit) {
    notFound();
  }

  return (
    <div className="flex flex-col bg-sand-50">
      {/* Header / Gallery */}
      <section className="container mx-auto mt-8 px-4 md:px-8">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <div className="mb-2 inline-block rounded-full bg-earth-200 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-earth-800">
              {unit.type}
            </div>
            <h1 className="text-4xl font-bold text-earth-900 md:text-5xl">{unit.name}</h1>
          </div>
          <div className="text-left md:text-right">
            <p className="text-sm uppercase tracking-wider text-earth-600">Price per night</p>
            <p className="text-3xl font-bold text-earth-900">
              Rp {unit.pricePerNight.toLocaleString('id-ID')}
            </p>
          </div>
        </div>

        {/* Simple Photo Gallery */}
        <div className="grid h-[50vh] min-h-[400px] grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="relative col-span-1 overflow-hidden rounded-2xl md:col-span-2">
            <Image
              src={unit.photoUrls[0] || "https://images.unsplash.com/photo-1542718610-a1d656d1884c?auto=format&fit=crop&q=80"}
              alt={`${unit.name} main view`}
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="hidden flex-col gap-4 md:flex">
            <div className="relative flex-1 overflow-hidden rounded-2xl">
              <Image
                src={unit.photoUrls[1] || "https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&q=80"}
                alt={`${unit.name} secondary view`}
                fill
                className="object-cover"
              />
            </div>
            <div className="relative flex-1 overflow-hidden rounded-2xl bg-earth-900/10">
               {/* Optional 3rd photo, fallback to solid or next photo */}
               {unit.photoUrls[2] ? (
                 <Image
                    src={unit.photoUrls[2]}
                    alt={`${unit.name} tertiary view`}
                    fill
                    className="object-cover"
                  />
               ) : (
                 <div className="flex h-full w-full items-center justify-center bg-sand-200 text-earth-700">
                    <span className="font-medium">More photos</span>
                 </div>
               )}
            </div>
          </div>
        </div>
      </section>

      {/* Details & Booking Section */}
      <section className="container mx-auto my-16 px-4 md:px-8">
        <div className="grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="mb-6 text-3xl font-bold text-earth-900">About this {unit.type}</h2>
            <p className="mb-8 text-lg leading-relaxed text-earth-700">
              {unit.promotionalCopy || "Experience luxury in the heart of nature. This meticulously designed unit offers a perfect blend of comfort and wilderness, providing an unforgettable glamping experience."}
            </p>
            
            <div className="mb-8 border-t border-sand-200 pt-8">
              <h3 className="mb-6 text-2xl font-bold text-earth-900">Amenities</h3>
              <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {unit.amenities.map((amenity, index) => (
                  <li key={index} className="flex items-center text-earth-800">
                    <svg className="mr-3 h-5 w-5 text-earth-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {amenity}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="border-t border-sand-200 pt-8">
              <h3 className="mb-4 text-2xl font-bold text-earth-900">Capacity</h3>
              <p className="text-earth-700">
                Suitable for up to <strong>{unit.capacity} guests</strong>.
              </p>
            </div>
          </div>

          {/* Sticky Booking Widget Stub */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 rounded-2xl border border-sand-200 bg-white p-6 shadow-xl">
              <h3 className="mb-6 text-xl font-bold text-earth-900">Reserve your stay</h3>
              <div className="mb-4 flex items-center justify-between border-b border-sand-100 pb-4">
                <span className="text-earth-600">Nightly Rate</span>
                <span className="font-bold text-earth-900">Rp {unit.pricePerNight.toLocaleString('id-ID')}</span>
              </div>
              <p className="mb-6 text-sm text-earth-600">
                Select dates on the next step to check availability.
              </p>
              
              <Link 
                href={`/unit/${unit.id}/book`}
                className="block w-full rounded-lg bg-earth-800 py-4 text-center font-bold text-white smooth-transition hover:bg-earth-900 hover:shadow-lg"
              >
                Check Availability & Book
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
