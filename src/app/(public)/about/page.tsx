import type { Metadata } from "next";
import { PageHero } from "@/components/site/PageHero";
import { ContentSection } from "@/components/site/ContentSection";
import { BrandImage } from "@/components/ui/BrandImage";
import { getContentBlocks } from "@/lib/data/settings";
import type { SiteContentBlock } from "@/lib/supabase/types";

export const metadata: Metadata = {
  title: "About",
  description: "Medowie Lodge is a Standardbred stud and harness racing stable at Medowie, NSW, operated by Darren Reay and family.",
  alternates: { canonical: "/about" },
};

const KEYS = ["about_intro", "about_darren", "about_breeding", "about_training", "about_region"];

export default async function AboutPage() {
  const blocks = await getContentBlocks(KEYS).catch(() => ({}) as Record<string, SiteContentBlock>);

  return (
    <div>
      <PageHero eyebrow="Medowie Lodge" heading="About" />

      {blocks.about_intro && (
        <section className="border-b border-line py-14">
          <div className="mx-auto grid w-full max-w-[1400px] gap-10 px-5 sm:px-8 lg:grid-cols-2 lg:items-center">
            <div className="max-w-lg whitespace-pre-line text-[16px] leading-relaxed text-charcoal">
              {blocks.about_intro.body}
            </div>
            <div className="relative aspect-[4/3]">
              <BrandImage src={null} alt="Medowie Lodge" label="Medowie Lodge" />
            </div>
          </div>
        </section>
      )}

      <ContentSection block={blocks.about_darren} eyebrow="Darren Reay & Family" />
      <ContentSection block={blocks.about_breeding} eyebrow="Breeding" />
      <ContentSection block={blocks.about_training} eyebrow="Training" />
      <ContentSection block={blocks.about_region} eyebrow="Medowie / Hunter Region" />
    </div>
  );
}
