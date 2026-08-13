import { BrandImage } from "@/components/ui/BrandImage";
import { EmptyState } from "@/components/ui/EmptyState";
import type { HorseForSale } from "@/lib/supabase/types";

/** Extract a 4-digit year from a sale date or free-text sale name. */
function yearOf(y: HorseForSale): number | null {
  if (y.sale_date) {
    const d = new Date(y.sale_date);
    if (!Number.isNaN(d.getTime())) return d.getFullYear();
  }
  const fromName = y.sale_name?.match(/\b(19|20)\d{2}\b/);
  if (fromName) return Number(fromName[0]);
  return null;
}

/**
 * Build the group label, e.g. "APG 2018". Prefer the sale name (which usually
 * carries the sale brand like APG / Bathurst) combined with the year; strip any
 * year already embedded in the name so it isn't duplicated. Falls back to just
 * the year, then "Earlier Sales" when no year is known.
 */
function groupLabel(saleName: string | null, year: number | null): string {
  const cleanedName = saleName?.replace(/\b(19|20)\d{2}\b/g, "").replace(/\s{2,}/g, " ").trim();
  if (cleanedName && year) return `${cleanedName} ${year}`;
  if (cleanedName) return cleanedName;
  if (year) return String(year);
  return "Earlier Sales";
}

interface YearGroup {
  key: string;
  label: string;
  year: number;
  yearlings: HorseForSale[];
}

export function PastYearlingsGallery({ yearlings }: { yearlings: HorseForSale[] }) {
  if (yearlings.length === 0) {
    return (
      <EmptyState
        heading="Sale history coming soon"
        message="Past yearling sale results will be added here as they're confirmed."
      />
    );
  }

  // Group by year, then most-recent-first (so the oldest, e.g. 2018, sits last).
  const byYear = new Map<number, YearGroup>();
  for (const y of yearlings) {
    const year = yearOf(y) ?? 0;
    if (!byYear.has(year)) {
      byYear.set(year, { key: String(year), label: "", year, yearlings: [] });
    }
    byYear.get(year)!.yearlings.push(y);
  }

  const groups = [...byYear.values()].sort((a, b) => b.year - a.year);
  for (const g of groups) {
    // Use the first entry's sale name to brand the year (e.g. APG / Bathurst).
    const saleName = g.yearlings.find((y) => y.sale_name)?.sale_name ?? null;
    g.label = groupLabel(saleName, g.year || null);
  }

  return (
    <div className="space-y-14">
      {groups.map((group) => (
        <div key={group.key}>
          <div className="mb-5 flex items-baseline gap-4 border-b border-line pb-2">
            <h3 className="font-serif text-2xl text-brown">{group.label}</h3>
            <span className="text-xs uppercase tracking-[0.1em] text-earth">
              {group.yearlings.length} {group.yearlings.length === 1 ? "yearling" : "yearlings"}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {group.yearlings.map((y) => (
              <figure
                key={y.id}
                className="overflow-hidden rounded-brand border border-line bg-warm-white transition-colors hover:border-earth"
              >
                <div className="relative aspect-[4/3] bg-parchment">
                  <BrandImage
                    src={y.hero_image_url}
                    alt={y.name}
                    label={y.lot_number ? `Lot ${y.lot_number}` : y.name}
                    sizes="(min-width: 1280px) 16vw, (min-width: 640px) 25vw, 50vw"
                  />
                </div>
                <figcaption className="px-2.5 py-2">
                  <p className="truncate text-[13px] font-medium leading-tight text-charcoal">{y.name}</p>
                  <p className="mt-0.5 truncate text-[11px] leading-tight text-grey">
                    {[y.sire, y.dam].filter(Boolean).join(" x ")}
                  </p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
