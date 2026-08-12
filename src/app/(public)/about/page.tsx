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

const KEYS = [
  "about_intro",
  "about_darren",
  "about_complete_operation",
  "about_experience",
  "about_breaking_in",
  "about_race_training",
  "about_yearling_preparation",
  "about_stud_services",
  "about_horse_welfare",
  "about_hands_on",
  "about_hunter_region",
  "about_built_on_experience",
] as const;

export default async function AboutPage() {
  const blocks = await getContentBlocks([...KEYS]);
  const intro = blocks["about_intro"];

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

      <ContentSection heading={blocks["about_darren"]?.heading} body={blocks["about_darren"]?.body} eyebrow="Darren Reay & Family" />
      <ContentSection heading={blocks["about_complete_operation"]?.heading} body={blocks["about_complete_operation"]?.body} />
      <ContentSection heading={blocks["about_experience"]?.heading} body={blocks["about_experience"]?.body} />
      <ContentSection heading={blocks["about_breaking_in"]?.heading} body={blocks["about_breaking_in"]?.body} />
      <ContentSection heading={blocks["about_race_training"]?.heading} body={blocks["about_race_training"]?.body} eyebrow="Training" />
      <ContentSection heading={blocks["about_yearling_preparation"]?.heading} body={blocks["about_yearling_preparation"]?.body} />
      <ContentSection heading={blocks["about_stud_services"]?.heading} body={blocks["about_stud_services"]?.body} eyebrow="Stud" />
      <ContentSection heading={blocks["about_horse_welfare"]?.heading} body={blocks["about_horse_welfare"]?.body} />
      <ContentSection heading={blocks["about_hands_on"]?.heading} body={blocks["about_hands_on"]?.body} />
      <ContentSection
        heading={blocks["about_hunter_region"]?.heading}
        body={blocks["about_hunter_region"]?.body}
        eyebrow="Medowie / Hunter Region"
      />
      <ContentSection heading={blocks["about_built_on_experience"]?.heading} body={blocks["about_built_on_experience"]?.body} />
    </div>
  );
}
