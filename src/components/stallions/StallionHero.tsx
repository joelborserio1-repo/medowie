import { Button } from "@/components/ui/Button";
import { StallionImageCarousel, type CarouselImage } from "@/components/stallions/StallionImageCarousel";
import { formatAmount, stallionDisplayName } from "@/lib/format";
import type { Stallion, StallionGalleryImage } from "@/lib/supabase/types";

export function StallionHero({
  stallion,
  gallery,
  hasVideos,
  hasDocuments,
}: {
  stallion: Stallion;
  gallery: StallionGalleryImage[];
  hasVideos: boolean;
  hasDocuments: boolean;
}) {
  const displayName = stallionDisplayName(stallion.name, stallion.country_suffix);

  // Build the carousel: lead with the hero image, then any additional gallery
  // photos (de-duplicated), falling back to the profile image.
  const seen = new Set<string>();
  const images: CarouselImage[] = [];
  const pushImage = (src: string | null | undefined, alt: string) => {
    if (!src || seen.has(src)) return;
    seen.add(src);
    images.push({ src, alt });
  };
  pushImage(stallion.hero_image_url, displayName);
  gallery.forEach((g) => pushImage(g.image_url, g.alt_text ?? displayName));
  if (images.length === 0) pushImage(stallion.profile_image_url, displayName);

  const semen: string[] = [];
  if (stallion.semen_chilled_au) semen.push("Chilled semen — Australia");
  if (stallion.semen_frozen_au) semen.push("Frozen semen — Australia");
  if (stallion.semen_frozen_nz) semen.push("Frozen semen — New Zealand");

  const auFee = formatAmount(stallion.service_fee);
  const nzFee = formatAmount(stallion.service_fee_nz);
  const gstLabel = stallion.includes_gst ? "inc GST" : "+ GST";
  const hasFee = Boolean(auFee || nzFee);

  return (
    <section className="grid gap-0 border-b border-line lg:grid-cols-[1.25fr_1fr]">
      <div className="bg-warm-white p-4 sm:p-6 lg:p-8">
        <StallionImageCarousel images={images} fallbackLabel={stallion.name} />
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
          {hasFee ? (
            <div className="mt-2 flex flex-wrap items-baseline gap-x-8 gap-y-2">
              {auFee && (
                <p className="font-serif text-3xl text-brown">
                  <span className="mr-1 align-middle text-sm font-semibold tracking-[0.08em] text-earth">AU</span>
                  {auFee}
                  <span className="ml-1 align-middle text-sm text-grey">{gstLabel}</span>
                </p>
              )}
              {nzFee && (
                <p className="font-serif text-3xl text-brown">
                  <span className="mr-1 align-middle text-sm font-semibold tracking-[0.08em] text-earth">NZ</span>
                  {nzFee}
                  <span className="ml-1 align-middle text-sm text-grey">+ GST</span>
                </p>
              )}
            </div>
          ) : (
            <p className="mt-1 font-serif text-3xl text-brown">POA</p>
          )}
          {stallion.fee_notes && <p className="mt-2 text-sm text-grey">{stallion.fee_notes}</p>}
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
          <Button href={`/book-a-mare?stallion=${stallion.slug}`}>Make a Booking</Button>
          {hasVideos && (
            <Button href="#videos" variant="secondary">
              Replays
            </Button>
          )}
          {hasDocuments && (
            <Button href="#forms" variant="secondary">
              Contracts &amp; Forms
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
