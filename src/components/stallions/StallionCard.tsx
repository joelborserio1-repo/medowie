import Link from "next/link";
import { BrandImage } from "@/components/ui/BrandImage";
import { formatFee, stallionDisplayName } from "@/lib/format";
import { mediaUrl } from "@/lib/cms/media";
import type { Stallion } from "@/lib/cms/types";

export function StallionCard({ stallion }: { stallion: Stallion }) {
  const fee = formatFee(stallion.serviceFee, stallion.includesGst);
  const pedigree = [stallion.sire, stallion.dam].filter(Boolean).join(" x ");

  const semen: string[] = [];
  if (stallion.semenChilledAu) semen.push("Chilled Australia");
  if (stallion.semenFrozenAu) semen.push("Frozen Australia");
  if (stallion.semenFrozenNz) semen.push("Frozen New Zealand");

  return (
    <Link href={`/stallions/${stallion.slug}`} className="group block border border-line bg-warm-white">
      <div className="relative aspect-[4/3] overflow-hidden">
        <BrandImage
          src={mediaUrl(stallion.cardImage) ?? mediaUrl(stallion.profileImage)}
          alt={stallionDisplayName(stallion.name, stallion.countrySuffix)}
          label={stallion.name}
          sizes="(min-width: 1024px) 33vw, 100vw"
          className="transition-transform duration-300 group-hover:scale-[1.03]"
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
          {stallion.countrySuffix && (
            <span className="ml-1.5 text-sm font-normal text-earth">{stallion.countrySuffix}</span>
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
