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
    <div className="flex flex-col bg-background pt-24">
      {/* Elegant Header */}
      <section className="container mx-auto px-6 md:px-12 py-12">
        <div className="mb-12 flex flex-col items-start justify-between border-b border-linen-800 pb-12 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <div className="mb-6 flex items-center space-x-4">
              <span className="text-[10px] uppercase tracking-[0.2em] text-forest-500">
                {unit.type}
              </span>
              <span className="h-[1px] w-8 bg-forest-300"></span>
            </div>
            <h1 className="font-serif text-5xl md:text-7xl text-forest-900 leading-tight">
              {unit.name}
            </h1>
          </div>
          <div className="mt-8 text-left md:mt-0 md:text-right">
            <p className="text-[10px] uppercase tracking-[0.2em] text-forest-500 mb-2">Per Night</p>
            <p className="text-2xl text-forest-900 font-medium">
              Rp {unit.pricePerNight.toLocaleString('id-ID')}
            </p>
          </div>
        </div>

        {/* Asymmetrical Luxury Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 min-h-[60vh]">
          <div className="relative col-span-1 md:col-span-8 h-[50vh] md:h-auto bg-linen-100">
            <Image
              src={unit.photoUrls[0] || "https://images.unsplash.com/photo-1542718610-a1d656d1884c?auto=format&fit=crop&q=80"}
              alt={`${unit.name} main view`}
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="col-span-1 md:col-span-4 flex flex-col gap-4 md:gap-8">
            <div className="relative flex-1 min-h-[30vh] bg-linen-100">
              <Image
                src={unit.photoUrls[1] || "https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&q=80"}
                alt={`${unit.name} secondary view`}
                fill
                className="object-cover"
              />
            </div>
            <div className="relative flex-1 min-h-[30vh] bg-linen-700">
               {unit.photoUrls[2] ? (
                 <Image
                    src={unit.photoUrls[2]}
                    alt={`${unit.name} tertiary view`}
                    fill
                    className="object-cover"
                  />
               ) : (
                 <div className="flex h-full w-full items-center justify-center bg-forest-900 text-linen-50">
                    <span className="text-[10px] uppercase tracking-[0.2em]">Explore More</span>
                 </div>
               )}
            </div>
          </div>
        </div>
      </section>

      {/* Details & Booking Section */}
      <section className="container mx-auto px-6 md:px-12 py-20">
        <div className="grid gap-20 lg:grid-cols-12">
          
          {/* Main Content */}
          <div className="lg:col-span-7 xl:col-span-8">
            <p className="font-serif text-2xl md:text-3xl leading-relaxed text-forest-800 mb-16">
              {unit.promotionalCopy || "Experience luxury in the heart of nature. This meticulously designed unit offers a perfect blend of comfort and wilderness, providing an unforgettable glamping experience."}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-linen-800 pt-16">
              <div>
                <h3 className="text-xs uppercase tracking-[0.2em] text-forest-500 mb-8">Amenities</h3>
                <ul className="space-y-4">
                  {unit.amenities.map((amenity, index) => (
                    <li key={index} className="flex items-start text-forest-800 font-medium">
                      <span className="mr-4 mt-1 h-1.5 w-1.5 rounded-full bg-forest-400 block shrink-0"></span>
                      {amenity}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="text-xs uppercase tracking-[0.2em] text-forest-500 mb-8">Capacity</h3>
                <p className="text-forest-800 font-medium">
                  Intimate setting for up to {unit.capacity} guests.
                </p>
              </div>
            </div>
          </div>

          {/* Sticky Booking Widget (Luxury Style) */}
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="sticky top-32 border border-forest-900 bg-white p-10">
              <h3 className="font-serif text-3xl text-forest-900 mb-8">Reserve</h3>
              <div className="mb-8 flex items-center justify-between border-b border-linen-800 pb-6">
                <span className="text-xs uppercase tracking-[0.2em] text-forest-500">Rate</span>
                <span className="font-medium text-forest-900">Rp {unit.pricePerNight.toLocaleString('id-ID')} / night</span>
              </div>
              <p className="mb-10 text-sm text-forest-600 leading-relaxed">
                Check availability for your preferred dates on the next page.
              </p>
              
              <Link 
                href={`/unit/${unit.id}/book`}
                className="block w-full bg-forest-900 py-5 text-center text-xs uppercase tracking-[0.2em] text-linen-50 transition-colors duration-500 hover:bg-forest-800"
              >
                Select Dates
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
