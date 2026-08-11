import type { Metadata } from "next";
import { PageHero } from "@/components/site/PageHero";
import { ContentSection } from "@/components/site/ContentSection";
import { PastYearlingsGallery } from "@/components/site/PastYearlingsGallery";
import { BrandImage } from "@/components/ui/BrandImage";
import { getYearlingPreparationPage } from "@/lib/data/settings";
import { getArchivedHorses } from "@/lib/data/horses";

export const metadata: Metadata = {
  title: "Yearling Preparation",
  description: "Yearling preparation and sale presentation at Medowie Lodge, NSW.",
  alternates: { canonical: "/yearling-preparation" },
};

export default async function YearlingPreparationPage() {
  const [page, archivedHorses] = await Promise.all([
    getYearlingPreparationPage().catch(() => null),
    getArchivedHorses().catch(() => []),
  ]);

  const yearlings = archivedHorses.filter((h) => h.saleType === "Yearling Sale");

  return (
    <div>
      <PageHero
        eyebrow="Medowie Lodge"
        heading="Yearling Preparation"
        intro="Preparing and presenting Standardbred yearlings for sale."
      />

      {page?.introBody && (
        <section className="border-b border-line py-14">
          <div className="mx-auto grid w-full max-w-[1400px] gap-10 px-5 sm:px-8 lg:grid-cols-2 lg:items-center">
            <div className="max-w-lg whitespace-pre-line text-[16px] leading-relaxed text-charcoal">
              {page.introBody}
              {page.tagline && (
                <p className="mt-6 font-serif text-xl italic text-orange">{page.tagline}</p>
              )}
            </div>
            <div className="relative aspect-[4/3]">
              <BrandImage src={null} alt="Yearling preparation at Medowie Lodge" label="Yearling Preparation" />
              {page.yearsExperience && (
                <div className="absolute right-4 top-4 flex h-24 w-24 flex-col items-center justify-center rounded-full bg-orange text-center text-warm-white shadow-lg">
                  <span className="font-serif text-2xl leading-none">{page.yearsExperience}</span>
                  <span className="mt-1 text-[10px] uppercase tracking-[0.06em] leading-tight">Years<br />Experience</span>
                </div>
              )}
            </div>
          </div>

          {page.features && page.features.length > 0 && (
            <div className="mx-auto mt-10 grid w-full max-w-[1400px] gap-8 px-5 sm:px-8 sm:grid-cols-2 lg:grid-cols-4">
              {page.features.map((feature) => (
                <div key={feature.heading}>
                  <p className="font-serif text-lg text-brown">{feature.heading}</p>
                  {feature.body && <p className="mt-1 text-sm text-charcoal">{feature.body}</p>}
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      <ContentSection heading={page?.salePreparationHeading} body={page?.salePreparationBody} eyebrow="Sale Preparation" />
      <ContentSection
        heading={page?.handlingEducationHeading}
        body={page?.handlingEducationBody}
        eyebrow="Handling & Education"
      />
      <ContentSection heading={page?.presentationHeading} body={page?.presentationBody} eyebrow="Presentation" />

      <section className="py-14">
        <div className="mx-auto w-full max-w-[1400px] px-5 sm:px-8">
          <p className="eyebrow mb-3">Sales</p>
          <h2 className="font-serif text-3xl text-brown">Past Yearlings</h2>
          <div className="mt-8">
            <PastYearlingsGallery yearlings={yearlings} />
          </div>
        </div>
      </section>
    </div>
  );
}
