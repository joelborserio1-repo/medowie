import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StallionHero } from "@/components/stallions/StallionHero";
import { QuickStats } from "@/components/stallions/QuickStats";
import { CareerHighlightsTable } from "@/components/stallions/CareerHighlightsTable";
import { BreedingInformation } from "@/components/stallions/BreedingInformation";
import { PedigreeTree } from "@/components/stallions/PedigreeTree";
import { ProgenyList } from "@/components/stallions/ProgenyList";
import { MediaGallery } from "@/components/stallions/MediaGallery";
import { StallionEnquiryForm } from "@/components/forms/StallionEnquiryForm";
import { getStallionDetail } from "@/lib/data/stallions";
import { stallionDisplayName } from "@/lib/format";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const detail = await getStallionDetail(slug).catch(() => null);
  if (!detail) return {};

  const name = stallionDisplayName(detail.stallion.name, detail.stallion.country_suffix);
  const description =
    detail.stallion.meta_description ??
    detail.stallion.short_description ??
    `${name} — Standardbred stallion standing at Medowie Lodge, NSW.`;

  return {
    title: detail.stallion.meta_title ?? name,
    description,
    alternates: { canonical: `/stallions/${slug}` },
    openGraph: {
      title: name,
      description,
      images: detail.stallion.hero_image_url ? [detail.stallion.hero_image_url] : undefined,
    },
  };
}

export default async function StallionProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const detail = await getStallionDetail(slug).catch(() => null);
  if (!detail) notFound();

  const { stallion, highlights, eligibility, gallery, videos, documents, progeny, pedigree } = detail;
  const name = stallionDisplayName(stallion.name, stallion.country_suffix);

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Stallions", item: "/stallions" },
      { "@type": "ListItem", position: 2, name, item: `/stallions/${slug}` },
    ],
  };

  const offerJsonLd =
    stallion.status === "published" && stallion.service_fee
      ? {
          "@context": "https://schema.org",
          "@type": "Product",
          name: `${name} Stallion Service`,
          description: stallion.short_description ?? `Stallion service — ${name}`,
          offers: {
            "@type": "Offer",
            price: stallion.service_fee,
            priceCurrency: "AUD",
            availability: "https://schema.org/InStock",
          },
        }
      : null;

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      {offerJsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(offerJsonLd) }} />
      )}

      <StallionHero stallion={stallion} />
      <QuickStats stallion={stallion} />

      {stallion.full_biography && (
        <section className="border-b border-line py-14">
          <div className="mx-auto w-full max-w-[1400px] px-5 sm:px-8">
            <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
              <p className="eyebrow">Overview</p>
              <div className="max-w-2xl whitespace-pre-line text-[16px] leading-relaxed text-charcoal">
                {stallion.full_biography}
              </div>
            </div>
          </div>
        </section>
      )}

      <CareerHighlightsTable highlights={highlights} />
      <BreedingInformation stallion={stallion} eligibility={eligibility} />
      <PedigreeTree stallion={stallion} pedigree={pedigree} />
      <ProgenyList progeny={progeny} />

      {stallion.mating_information && (
        <section className="border-b border-line py-14">
          <div className="mx-auto w-full max-w-[1400px] px-5 sm:px-8">
            <p className="eyebrow mb-3">Mating Information</p>
            <h2 className="font-serif text-3xl text-brown">Mating Hints</h2>
            <div className="mt-6 max-w-2xl whitespace-pre-line text-[15px] leading-relaxed text-grey">
              {stallion.mating_information}
            </div>
            {stallion.mating_pdf_url && (
              <a
                href={stallion.mating_pdf_url}
                className="mt-4 inline-block text-xs font-semibold uppercase tracking-[0.1em] text-orange hover:underline"
              >
                Download Mating Hints PDF →
              </a>
            )}
          </div>
        </section>
      )}

      <MediaGallery gallery={gallery} videos={videos} />

      {documents.length > 0 && (
        <section className="border-b border-line py-14">
          <div className="mx-auto w-full max-w-[1400px] px-5 sm:px-8">
            <p className="eyebrow mb-3">Documents</p>
            <h2 className="font-serif text-3xl text-brown">Downloads</h2>
            <ul className="mt-6 space-y-2">
              {documents.map((d) => (
                <li key={d.id}>
                  <a href={d.file_url} className="text-sm font-medium text-orange hover:underline">
                    {d.title} →
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section className="py-14">
        <div className="mx-auto w-full max-w-2xl px-5 sm:px-8">
          <p className="eyebrow mb-3">Enquire</p>
          <h2 className="mb-6 font-serif text-3xl text-brown">Breeding Enquiry</h2>
          <StallionEnquiryForm stallionId={stallion.id} stallionName={name} />
        </div>
      </section>
    </div>
  );
}
