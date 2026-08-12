import type { Metadata } from "next";
import { PageHero } from "@/components/site/PageHero";
import { ContentSection } from "@/components/site/ContentSection";
import { PastYearlingsGallery } from "@/components/site/PastYearlingsGallery";
import { BrandImage } from "@/components/ui/BrandImage";
import { getContentBlocks } from "@/lib/data/settings";
import { getArchivedHorses } from "@/lib/data/horses";
import type { PageFeature } from "@/lib/supabase/types";

export const metadata: Metadata = {
  title: "Yearling Preparation",
  description: "Yearling preparation and sale presentation at Medowie Lodge, NSW.",
  alternates: { canonical: "/yearling-preparation" },
};

export default async function YearlingPreparationPage() {
  const [blocks, archivedHorses] = await Promise.all([
    getContentBlocks([
      "yearling_intro",
      "yearling_sale_preparation",
      "yearling_handling_education",
      "yearling_presentation",
    ]),
    getArchivedHorses().catch(() => []),
  ]);

  const intro = blocks["yearling_intro"];
  const yearlings = archivedHorses.filter((h) => h.sale_type === "Yearling Sale");

  return (
    <div>
      <PageHero
        eyebrow="Medowie Lodge"
        heading="Yearling Preparation"
        intro="Preparing and presenting Standardbred yearlings for sale."
      />

      {intro?.body && (
        <section className="border-b border-line py-14">
          <div className="mx-auto grid w-full max-w-[1400px] gap-10 px-5 sm:px-8 lg:grid-cols-2 lg:items-center">
            <div className="max-w-lg whitespace-pre-line text-[16px] leading-relaxed text-charcoal">
              {intro.body}
              {intro.meta?.tagline && (
                <p className="mt-6 font-serif text-xl italic text-orange">{intro.meta.tagline}</p>
              )}
            </div>
            <div className="relative aspect-[4/3]">
              <BrandImage src={intro.image_url} alt="Yearling preparation at Medowie Lodge" label="Yearling Preparation" />
              {intro.meta?.years_experience && (
                <div className="absolute right-4 top-4 flex h-24 w-24 flex-col items-center justify-center rounded-full bg-orange text-center text-warm-white shadow-lg">
                  <span className="font-serif text-2xl leading-none">{intro.meta.years_experience}</span>
                  <span className="mt-1 text-[10px] uppercase tracking-[0.06em] leading-tight">
                    Years
                    <br />
                    Experience
                  </span>
                </div>
              )}
            </div>
          </div>

          {intro.meta?.features && intro.meta.features.length > 0 && (
            <div className="mx-auto mt-10 grid w-full max-w-[1400px] gap-8 px-5 sm:px-8 sm:grid-cols-2 lg:grid-cols-4">
              {intro.meta.features.map((feature: PageFeature) => (
                <div key={feature.heading}>
                  <p className="font-serif text-lg text-brown">{feature.heading}</p>
                  {feature.body && <p className="mt-1 text-sm text-charcoal">{feature.body}</p>}
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      <ContentSection
        heading={blocks["yearling_sale_preparation"]?.heading}
        body={blocks["yearling_sale_preparation"]?.body}
        eyebrow="Sale Preparation"
      />
      <ContentSection
        heading={blocks["yearling_handling_education"]?.heading}
        body={blocks["yearling_handling_education"]?.body}
        eyebrow="Handling & Education"
      />
      <ContentSection
        heading={blocks["yearling_presentation"]?.heading}
        body={blocks["yearling_presentation"]?.body}
        eyebrow="Presentation"
      />

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
