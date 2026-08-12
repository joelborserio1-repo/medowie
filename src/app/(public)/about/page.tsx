import type { Metadata } from "next";
import { PageHero } from "@/components/site/PageHero";
import { ContentSection } from "@/components/site/ContentSection";
import { BrandImage } from "@/components/ui/BrandImage";
import { getContentBlocks } from "@/lib/data/settings";

export const metadata: Metadata = {
  title: "About",
  description: "Medowie Lodge is a Standardbred stud and harness racing stable at Medowie, NSW, operated by Darren Reay and family.",
  alternates: { canonical: "/about" },
};

const SECTIONS = [
  { key: "about_darren", eyebrow: "Darren Reay & Family" },
  { key: "about_complete_operation" },
  { key: "about_experience" },
  { key: "about_breaking_in" },
  { key: "about_race_training", eyebrow: "Training" },
  { key: "about_yearling_preparation" },
  { key: "about_stud_services", eyebrow: "Stud" },
  { key: "about_horse_welfare" },
  { key: "about_hands_on" },
  { key: "about_hunter_region", eyebrow: "Medowie / Hunter Region" },
  { key: "about_built_on_experience" },
] as const;

const KEYS = ["about_intro", ...SECTIONS.map((s) => s.key)] as const;

export default async function AboutPage() {
  const blocks = await getContentBlocks([...KEYS]);
  const intro = blocks["about_intro"];
  const sections = SECTIONS.filter((s) => blocks[s.key]?.body);

  return (
    <div>
      <PageHero eyebrow="Medowie Lodge" heading="About" />

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
              <BrandImage src={intro.image_url} alt="Medowie Lodge" label="Medowie Lodge" />
            </div>
          </div>
        </section>
      )}

      {sections.map((section, i) => (
        <ContentSection
          key={section.key}
          heading={blocks[section.key]?.heading}
          body={blocks[section.key]?.body}
          eyebrow={"eyebrow" in section ? section.eyebrow : undefined}
          tint={i % 2 === 1}
        />
      ))}
    </div>
  );
}
