import { BrandImage } from "@/components/ui/BrandImage";
import { Button } from "@/components/ui/Button";
import { formatFee, stallionDisplayName } from "@/lib/format";
import type { Stallion } from "@/lib/supabase/types";

export function StallionHero({ stallion }: { stallion: Stallion }) {
  const semen: string[] = [];
  if (stallion.semen_chilled_au) semen.push("Chilled semen Australia");
  if (stallion.semen_frozen_au) semen.push("Frozen semen Australia");
  if (stallion.semen_frozen_nz) semen.push("Frozen semen New Zealand");

  return (
    <section className="grid gap-0 border-b border-line lg:grid-cols-[1.3fr_1fr]">
      <div className="relative aspect-[4/3] lg:aspect-auto lg:min-h-[520px]">
        <BrandImage
          src={stallion.hero_image_url ?? stallion.profile_image_url}
          alt={stallionDisplayName(stallion.name, stallion.country_suffix)}
          label={stallion.name}
          priority
          sizes="(min-width: 1024px) 55vw, 100vw"
        />
      </div>

      <div className="flex flex-col justify-center bg-parchment p-6 sm:p-10">
        {stallion.gait && <p className="eyebrow mb-2">{stallion.gait}</p>}
        <h1 className="font-serif text-4xl leading-tight text-brown sm:text-5xl">
          {stallion.name}
          {stallion.country_suffix && (
            <span className="ml-2 text-2xl font-normal text-earth">{stallion.country_suffix}</span>
          )}
        </h1>

        {(stallion.sire || stallion.dam) && (
          <p className="mt-3 text-[15px] text-grey">
            {[stallion.sire, stallion.dam].filter(Boolean).join(" x ")}
            {stallion.damsire && <span className="block text-sm">({stallion.damsire})</span>}
          </p>
        )}

        <div className="mt-6 border-t border-line pt-6">
          <p className="eyebrow text-[10px]">Service Fee</p>
          <p className="mt-1 font-serif text-3xl text-brown">
            {formatFee(stallion.service_fee, stallion.includes_gst) ?? "POA"}
          </p>
          {stallion.fee_notes && <p className="mt-1 text-sm text-grey">{stallion.fee_notes}</p>}
        </div>

        {semen.length > 0 && (
          <div className="mt-5">
            <p className="eyebrow text-[10px]">Availability</p>
            <ul className="mt-1 text-sm text-charcoal">
              {semen.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-7 flex flex-wrap gap-3">
          <Button href={`/book-a-mare?stallion=${stallion.slug}`}>Book This Stallion</Button>
          {stallion.pedigree_document_url && (
            <Button href={stallion.pedigree_document_url} variant="secondary">
              Download Contract
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
