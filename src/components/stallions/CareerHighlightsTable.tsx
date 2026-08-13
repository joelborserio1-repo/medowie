import { BrandImage } from "@/components/ui/BrandImage";
import type { Stallion, StallionHighlight } from "@/lib/supabase/types";

/**
 * Career Highlights — editorial two-column layout: a racing image on the left
 * and concise, scannable dot points on the right. Each highlight is condensed
 * to a single line so breeders can skim the record quickly.
 */
export function CareerHighlightsTable({
  highlights,
  stallion,
}: {
  highlights: StallionHighlight[];
  stallion: Stallion;
}) {
  if (highlights.length === 0) return null;

  const image = stallion.hero_image_url ?? stallion.profile_image_url ?? stallion.card_image_url;

  return (
    <section className="border-b border-line py-14">
      <div className="mx-auto w-full max-w-[1400px] px-5 sm:px-8">
        <p className="eyebrow mb-3">Racing Record</p>
        <h2 className="font-serif text-3xl text-brown">Career Highlights</h2>

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-stretch">
          <div className="relative aspect-[4/3] overflow-hidden rounded-brand border border-line lg:aspect-auto">
            <BrandImage
              src={image}
              alt={stallion.name}
              label={stallion.name}
              sizes="(min-width: 1024px) 45vw, 100vw"
            />
          </div>

          <ul className="divide-y divide-line border-y border-line">
            {highlights.map((h) => {
              const meta = [h.year, h.grade, h.track].filter(Boolean).join(" · ");
              return (
                <li key={h.id} className="flex gap-4 py-4">
                  <span
                    aria-hidden="true"
                    className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-orange"
                  />
                  <div className="min-w-0">
                    <p className="flex flex-wrap items-baseline gap-x-2 text-[15px] leading-snug text-charcoal">
                      <span className="font-semibold">{h.race}</span>
                      {h.result && (
                        <span className="text-sm font-semibold uppercase tracking-[0.04em] text-orange">
                          {h.result}
                        </span>
                      )}
                    </p>
                    {(meta || h.notes) && (
                      <p className="mt-0.5 text-[13px] text-grey">
                        {[meta, h.notes].filter(Boolean).join(" — ")}
                      </p>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
