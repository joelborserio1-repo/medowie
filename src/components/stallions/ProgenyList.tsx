import { BrandImage } from "@/components/ui/BrandImage";
import { formatCurrency } from "@/lib/format";
import type { StallionProgeny } from "@/lib/supabase/types";

export function ProgenyList({ progeny }: { progeny: StallionProgeny[] }) {
  if (progeny.length === 0) return null;

  const featured = progeny.filter((p) => p.featured);
  const list = featured.length > 0 ? featured : progeny;

  return (
    <section className="border-b border-line py-14">
      <div className="mx-auto w-full max-w-[1400px] px-5 sm:px-8">
        <p className="eyebrow mb-3">Progeny</p>
        <h2 className="font-serif text-3xl text-brown">Notable Progeny</h2>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {list.map((p) => (
            <div key={p.id} className="border border-line">
              <div className="relative aspect-square">
                <BrandImage src={p.image_url} alt={p.name} label={p.name} />
              </div>
              <div className="p-4">
                <p className="font-serif text-lg text-brown">{p.name}</p>
                <p className="mt-1 text-xs text-grey">
                  {[p.sex, p.foaled_year ? String(p.foaled_year) : null].filter(Boolean).join(" · ")}
                </p>
                {p.dam && <p className="mt-1 text-xs text-grey">Dam: {p.dam}</p>}
                {(p.earnings || p.wins || p.mile_rate) && (
                  <p className="mt-2 text-xs font-semibold text-charcoal">
                    {[p.wins ? `${p.wins} wins` : null, p.mile_rate, formatCurrency(p.earnings)]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
