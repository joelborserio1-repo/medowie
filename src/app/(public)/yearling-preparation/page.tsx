import type { Metadata } from "next";
import { PageHero } from "@/components/site/PageHero";
import { ContentSection } from "@/components/site/ContentSection";
import { PastYearlingsGallery } from "@/components/site/PastYearlingsGallery";
import { BrandImage } from "@/components/ui/BrandImage";
import { getContentBlocks } from "@/lib/data/settings";
import { getArchivedHorses } from "@/lib/data/horses";
import type { SiteContentBlock } from "@/lib/supabase/types";

export const metadata: Metadata = {
  title: "Yearling Preparation",
  description: "Yearling preparation and sale presentation at Medowie Lodge, NSW.",
  alternates: { canonical: "/yearling-preparation" },
};

const KEYS = [
  "yearling_preparation_intro",
  "yearling_sale_preparation",
  "yearling_handling_education",
  "yearling_presentation",
];

export default async function YearlingPreparationPage() {
  const [blocks, archivedHorses] = await Promise.all([
    getContentBlocks(KEYS).catch(() => ({}) as Record<string, SiteContentBlock>),
    getArchivedHorses().catch(() => []),
  ]);

  const yearlings = archivedHorses.filter((h) => h.sale_type === "Yearling Sale");

  return (
    <div>
      <PageHero
        eyebrow="Medowie Lodge"
        heading="Yearling Preparation"
        intro="Preparing and presenting Standardbred yearlings for sale."
      />

      {blocks.yearling_preparation_intro && (
        <section className="border-b border-line py-14">
          <div className="mx-auto grid w-full max-w-[1400px] gap-10 px-5 sm:px-8 lg:grid-cols-2 lg:items-center">
            <div className="max-w-lg whitespace-pre-line text-[16px] leading-relaxed text-charcoal">
              {blocks.yearling_preparation_intro.body}
            </div>
            <div className="relative aspect-[4/3]">
              <BrandImage src={null} alt="Yearling preparation at Medowie Lodge" label="Yearling Preparation" />
            </div>
          </div>
        </section>
      )}

      <ContentSection block={blocks.yearling_sale_preparation} eyebrow="Sale Preparation" />
      <ContentSection block={blocks.yearling_handling_education} eyebrow="Handling & Education" />
      <ContentSection block={blocks.yearling_presentation} eyebrow="Presentation" />

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
