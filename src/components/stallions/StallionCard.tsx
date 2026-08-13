import Link from "next/link";
import { BrandImage } from "@/components/ui/BrandImage";
import { formatFee, stallionDisplayName } from "@/lib/format";
import type { Stallion } from "@/lib/supabase/types";

export function StallionCard({ stallion }: { stallion: Stallion }) {
  const fee = formatFee(stallion.service_fee, stallion.includes_gst);
  const pedigree = [stallion.sire, stallion.dam].filter(Boolean).join(" x ");

  const semen: string[] = [];
  if (stallion.semen_chilled_au) semen.push("Chilled Australia");
  if (stallion.semen_frozen_au) semen.push("Frozen Australia");
  if (stallion.semen_frozen_nz) semen.push("Frozen New Zealand");

  return (
    <Link
      href={`/stallions/${stallion.slug}`}
      className="group block overflow-hidden rounded-brand border border-line bg-warm-white shadow-[0_1px_2px_rgba(74,38,10,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-earth hover:shadow-[0_14px_34px_-14px_rgba(74,38,10,0.35)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-parchment">
        <BrandImage
          src={stallion.card_image_url ?? stallion.profile_image_url}
          alt={stallionDisplayName(stallion.name, stallion.country_suffix)}
          label={stallion.name}
          sizes="(min-width: 1024px) 33vw, 100vw"
          className="transition-transform duration-500 group-hover:scale-[1.04]"
        />
        {stallion.gait && (
          <span className="absolute left-0 top-0 bg-brown px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-warm-white">
            {stallion.gait}
          </span>
        )}
      </div>

      <div className="p-5">
        <h3 className="font-serif text-xl text-brown">
          {stallion.name}
          {stallion.country_suffix && (
            <span className="ml-1.5 text-sm font-normal text-earth">{stallion.country_suffix}</span>
          )}
        </h3>
        {pedigree && (
          <p className="mt-1 text-[13px] text-grey">
            {pedigree}
            {stallion.damsire && <span> ({stallion.damsire})</span>}
          </p>
        )}

        <div className="mt-4 flex items-end justify-between border-t border-line pt-4">
          <div>
            <p className="eyebrow mb-0.5 text-[10px]">Service Fee</p>
            <p className="text-sm font-semibold text-charcoal">{fee ?? "POA"}</p>
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-orange group-hover:underline">
            View Stallion →
          </span>
        </div>

        {semen.length > 0 && (
          <p className="mt-3 text-[11px] uppercase tracking-[0.06em] text-grey">{semen.join(" · ")}</p>
        )}
      </div>
    </Link>
  );
}
