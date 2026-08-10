import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/site/PageHero";
import { BrandImage } from "@/components/ui/BrandImage";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatCurrency } from "@/lib/format";
import { mediaUrl } from "@/lib/cms/media";
import { getAvailableHorses, getArchivedHorses } from "@/lib/data/horses";

export const metadata: Metadata = {
  title: "Horses for Sale",
  description: "Standardbred horses for sale at Medowie Lodge, NSW.",
  alternates: { canonical: "/horses-for-sale" },
};

export default async function HorsesForSalePage() {
  const [horses, archived] = await Promise.all([
    getAvailableHorses().catch(() => []),
    getArchivedHorses().catch(() => []),
  ]);

  return (
    <div>
      <PageHero eyebrow="Medowie Lodge" heading="Horses for Sale" intro="Current listings from Medowie Lodge." />

      <section className="py-14">
        <div className="mx-auto w-full max-w-[1400px] px-5 sm:px-8">
          {horses.length === 0 ? (
            <EmptyState
              heading="No current listings"
              message="Contact Medowie Lodge regarding upcoming yearlings or private enquiries."
            />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {horses.map((horse) => (
                <Link key={horse.id} href={`/horses-for-sale/${horse.slug}`} className="group block border border-line">
                  <div className="relative aspect-[4/3]">
                    <BrandImage src={mediaUrl(horse.heroImage)} alt={horse.name} label={horse.name} />
                    {horse.state === "under_offer" && (
                      <span className="absolute right-0 top-0 bg-charcoal px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-warm-white">
                        Under Offer
                      </span>
                    )}
                  </div>
                  <div className="p-5">
                    <p className="eyebrow text-[10px]">{horse.saleType}</p>
                    <h2 className="mt-1 font-serif text-xl text-brown group-hover:underline">{horse.name}</h2>
                    <p className="mt-1 text-sm text-grey">
                      {[horse.sex, horse.gait, horse.yearFoaled ? `Foaled ${horse.yearFoaled}` : null]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                    <p className="mt-2 text-sm font-semibold text-charcoal">
                      {horse.priceType === "poa" ? "POA" : formatCurrency(horse.price) ?? "POA"}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {archived.length > 0 && (
        <section className="border-t border-line py-14">
          <div className="mx-auto w-full max-w-[1400px] px-5 sm:px-8">
            <p className="eyebrow mb-3">Archive</p>
            <h2 className="font-serif text-2xl text-brown">Previously Sold</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {archived.map((horse) => (
                <div key={horse.id} className="border border-line opacity-90">
                  <div className="relative aspect-[4/3]">
                    <BrandImage src={mediaUrl(horse.heroImage)} alt={horse.name} label={horse.name} />
                    <span className="absolute right-0 top-0 bg-charcoal px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-warm-white">
                      Sold
                    </span>
                  </div>
                  <div className="p-5">
                    <p className="eyebrow text-[10px]">{horse.saleType}</p>
                    <h2 className="mt-1 font-serif text-xl text-brown">{horse.name}</h2>
                    <p className="mt-1 text-sm text-grey">
                      {[horse.sire, horse.dam].filter(Boolean).join(" x ")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
