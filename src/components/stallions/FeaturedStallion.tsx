import { BrandImage } from "@/components/ui/BrandImage";
import { Button } from "@/components/ui/Button";
import { formatCurrency, formatFee, stallionDisplayName } from "@/lib/format";
import type { Stallion } from "@/lib/supabase/types";

export function FeaturedStallion({ stallion }: { stallion: Stallion }) {
  const stats = [
    stallion.mile_rate ? { label: "Best Mile Rate", value: stallion.mile_rate } : null,
    stallion.career_earnings ? { label: "Career Earnings", value: formatCurrency(stallion.career_earnings) } : null,
    stallion.wins ? { label: "Wins", value: String(stallion.wins) } : null,
    stallion.starts ? { label: "Starts", value: String(stallion.starts) } : null,
  ].filter((s): s is { label: string; value: string } => Boolean(s));

  return (
    <div className="grid gap-0 border border-line lg:grid-cols-2">
      <div className="relative aspect-[4/3] lg:aspect-auto">
        <BrandImage
          src={stallion.hero_image_url ?? stallion.profile_image_url}
          alt={stallionDisplayName(stallion.name, stallion.country_suffix)}
          label={stallion.name}
          sizes="(min-width: 1024px) 50vw, 100vw"
        />
      </div>

      <div className="flex flex-col justify-center p-8 sm:p-10 lg:p-12">
        <p className="eyebrow mb-3">Featured Stallion</p>
        <h3 className="font-serif text-3xl text-brown sm:text-4xl">
          {stallion.name}
          {stallion.country_suffix && (
            <span className="ml-2 text-xl font-normal text-earth">{stallion.country_suffix}</span>
          )}
        </h3>

        {(stallion.sire || stallion.dam) && (
          <p className="mt-2 text-sm text-grey">
            {[stallion.sire, stallion.dam].filter(Boolean).join(" x ")}
            {stallion.damsire && ` (${stallion.damsire})`}
          </p>
        )}

        {stallion.headline && <p className="mt-4 text-[15px] text-charcoal">{stallion.headline}</p>}

        {stats.length > 0 && (
          <dl className="mt-6 grid grid-cols-2 gap-5 border-t border-line pt-6 sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label}>
                <dt className="text-[10px] font-semibold uppercase tracking-[0.08em] text-earth">{s.label}</dt>
                <dd className="mt-1 font-serif text-2xl text-brown">{s.value}</dd>
              </div>
            ))}
          </dl>
        )}

        <div className="mt-6 border-t border-line pt-6">
          <p className="eyebrow mb-1 text-[10px]">Service Fee</p>
          <p className="text-lg font-semibold text-charcoal">
            {formatFee(stallion.service_fee, stallion.includes_gst) ?? "POA"}
          </p>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Button href={`/stallions/${stallion.slug}`}>Stallion Profile</Button>
          <Button href={`/book-a-mare?stallion=${stallion.slug}`} variant="secondary">
            Book a Mare
          </Button>
        </div>
      </div>
    </div>
  );
}
