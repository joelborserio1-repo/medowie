import { BrandImage } from "@/components/ui/BrandImage";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatDate } from "@/lib/format";
import { mediaUrl } from "@/lib/cms/media";
import type { HorseForSale } from "@/lib/cms/types";

export function PastYearlingsGallery({ yearlings }: { yearlings: HorseForSale[] }) {
  if (yearlings.length === 0) {
    return (
      <EmptyState
        heading="Sale history coming soon"
        message="Past yearling sale results will be added here as they're confirmed."
      />
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {yearlings.map((y) => (
        <div key={y.id} className="border border-line">
          <div className="relative aspect-[4/3]">
            <BrandImage src={mediaUrl(y.heroImage)} alt={y.name} label={y.lotNumber ? `Lot ${y.lotNumber}` : y.name} />
            <span className="absolute right-0 top-0 bg-charcoal px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-warm-white">
              Sold
            </span>
          </div>
          <div className="p-4">
            {y.lotNumber && <p className="eyebrow text-[10px]">Lot {y.lotNumber}</p>}
            <p className="mt-1 text-sm text-charcoal">
              {[y.sire, y.dam].filter(Boolean).join(" x ")}
            </p>
            <p className="mt-1 text-xs text-grey">
              {[y.sex, y.saleName, formatDate(y.saleDate)].filter(Boolean).join(" · ")}
            </p>
            {mediaUrl(y.pedigreeDocument) && (
              <a href={mediaUrl(y.pedigreeDocument)!} className="mt-2 inline-block text-xs font-semibold text-orange hover:underline">
                Pedigree →
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
