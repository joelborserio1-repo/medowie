import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BrandImage } from "@/components/ui/BrandImage";
import { HorseEnquiryForm } from "@/components/forms/HorseEnquiryForm";
import { formatCurrency, formatDate } from "@/lib/format";
import { mediaUrl } from "@/lib/cms/media";
import { getHorseBySlug } from "@/lib/data/horses";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const horse = await getHorseBySlug(slug).catch(() => null);
  if (!horse) return {};
  return {
    title: horse.name,
    description: horse.description ?? `${horse.name} — for sale at Medowie Lodge.`,
    alternates: { canonical: `/horses-for-sale/${slug}` },
  };
}

export default async function HorseForSalePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const horse = await getHorseBySlug(slug).catch(() => null);
  if (!horse) notFound();

  const details = [
    { label: "Sale Type", value: horse.saleType },
    { label: "Sex", value: horse.sex },
    { label: "Gait", value: horse.gait },
    { label: "Foaled", value: horse.yearFoaled ? String(horse.yearFoaled) : null },
    { label: "Colour", value: horse.colour },
    { label: "Sire", value: horse.sire },
    { label: "Dam", value: horse.dam },
    { label: "Damsire", value: horse.damsire },
    { label: "Location", value: horse.location },
    { label: "Sale", value: horse.saleName },
    { label: "Lot Number", value: horse.lotNumber },
    { label: "Sale Date", value: formatDate(horse.saleDate) },
  ].filter((d) => d.value);

  const pedigreeUrl = mediaUrl(horse.pedigreeDocument);

  return (
    <div>
      <section className="relative aspect-[16/9] max-h-[560px] w-full sm:aspect-[21/9]">
        <BrandImage src={mediaUrl(horse.heroImage)} alt={horse.name} label={horse.name} priority />
        {horse.state !== "available" && (
          <span className="absolute right-5 top-5 bg-charcoal px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.1em] text-warm-white">
            {horse.state === "sold" ? "Sold" : horse.state === "under_offer" ? "Under Offer" : horse.state}
          </span>
        )}
      </section>

      <section className="border-b border-line py-10">
        <div className="mx-auto w-full max-w-[1400px] px-5 sm:px-8">
          <p className="eyebrow mb-2">{horse.saleType}</p>
          <h1 className="font-serif text-4xl text-brown sm:text-5xl">{horse.name}</h1>
          <p className="mt-3 text-xl font-semibold text-charcoal">
            {horse.priceType === "poa"
              ? "POA"
              : horse.state === "sold" && horse.showSoldPrice
                ? `Sold — ${formatCurrency(horse.soldPrice)}`
                : formatCurrency(horse.price) ?? "POA"}
          </p>
        </div>
      </section>

      <section className="border-b border-line py-14">
        <div className="mx-auto grid w-full max-w-[1400px] gap-12 px-5 sm:px-8 lg:grid-cols-[1fr_360px]">
          <div>
            {horse.description && (
              <div className="max-w-2xl whitespace-pre-line text-[16px] leading-relaxed text-charcoal">
                {horse.description}
              </div>
            )}

            <dl className="mt-8 grid gap-x-8 gap-y-4 sm:grid-cols-2">
              {details.map((d) => (
                <div key={d.label} className="border-t border-line pt-3">
                  <dt className="text-[11px] font-semibold uppercase tracking-[0.08em] text-earth">{d.label}</dt>
                  <dd className="mt-1 text-sm text-charcoal">{d.value}</dd>
                </div>
              ))}
            </dl>

            {(pedigreeUrl || horse.externalCatalogueUrl || horse.videoUrl) && (
              <div className="mt-8 flex flex-wrap gap-4">
                {pedigreeUrl && (
                  <a href={pedigreeUrl} className="text-xs font-semibold uppercase tracking-[0.1em] text-orange hover:underline">
                    Pedigree →
                  </a>
                )}
                {horse.externalCatalogueUrl && (
                  <a href={horse.externalCatalogueUrl} className="text-xs font-semibold uppercase tracking-[0.1em] text-orange hover:underline">
                    Catalogue →
                  </a>
                )}
                {horse.videoUrl && (
                  <a href={horse.videoUrl} className="text-xs font-semibold uppercase tracking-[0.1em] text-orange hover:underline">
                    Video →
                  </a>
                )}
              </div>
            )}

            {horse.gallery.length > 0 && (
              <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3">
                {horse.gallery.map((img) => (
                  <div key={img.id} className="relative aspect-square">
                    <BrandImage src={mediaUrl(img)} alt={img.alternativeText ?? horse.name} />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            {horse.state === "available" || horse.state === "under_offer" || horse.state === "upcoming" ? (
              <HorseEnquiryForm horseId={String(horse.id)} horseName={horse.name} />
            ) : (
              <div className="border border-line bg-parchment p-6 text-sm text-grey">
                This horse is no longer available. Contact Medowie Lodge about future listings.
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
