import Link from "next/link";
import { BrandImage } from "@/components/ui/BrandImage";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatCurrency } from "@/lib/format";
import type { HorseForSale } from "@/lib/supabase/types";

export function HorsesForSalePreview({ horses }: { horses: HorseForSale[] }) {
  return (
    <section className="border-t border-line py-16 sm:py-24">
      <div className="mx-auto w-full max-w-[1400px] px-5 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow mb-3">Available</p>
            <h2 className="font-serif text-3xl text-brown sm:text-4xl">Horses for Sale</h2>
          </div>
          <Button href="/horses-for-sale" variant="secondary">
            View Horses for Sale
          </Button>
        </div>

        {horses.length === 0 ? (
          <div className="mt-8">
            <EmptyState
              heading="No current listings"
              message="Contact Medowie Lodge regarding upcoming yearlings or private enquiries."
            />
          </div>
        ) : (
          <div className="mt-8 grid gap-8 sm:grid-cols-3">
            {horses.map((horse) => (
              <Link key={horse.id} href={`/horses-for-sale/${horse.slug}`} className="group block">
                <div className="relative aspect-[4/3]">
                  <BrandImage src={horse.hero_image_url} alt={horse.name} label={horse.name} />
                  {horse.status === "under_offer" && (
                    <span className="absolute right-0 top-0 bg-charcoal px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-warm-white">
                      Under Offer
                    </span>
                  )}
                </div>
                <h3 className="mt-4 font-serif text-lg text-brown group-hover:underline">{horse.name}</h3>
                <p className="mt-1 text-sm text-grey">
                  {[horse.sex, horse.year_foaled ? `Foaled ${horse.year_foaled}` : null]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
                <p className="mt-1 text-sm font-semibold text-charcoal">
                  {horse.price_type === "poa" ? "POA" : formatCurrency(horse.price) ?? "POA"}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
