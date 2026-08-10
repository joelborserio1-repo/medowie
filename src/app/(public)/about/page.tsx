import type { Metadata } from "next";
import { PageHero } from "@/components/site/PageHero";
import { ContentSection } from "@/components/site/ContentSection";
import { BrandImage } from "@/components/ui/BrandImage";
import { getAboutPage } from "@/lib/data/settings";

export const metadata: Metadata = {
  title: "About",
  description: "Medowie Lodge is a Standardbred stud and harness racing stable at Medowie, NSW, operated by Darren Reay and family.",
  alternates: { canonical: "/about" },
};

export default async function AboutPage() {
  const page = await getAboutPage().catch(() => null);

  return (
    <div>
      <PageHero eyebrow="Medowie Lodge" heading="About" />

      {page?.introBody && (
        <section className="border-b border-line py-14">
          <div className="mx-auto grid w-full max-w-[1400px] gap-10 px-5 sm:px-8 lg:grid-cols-2 lg:items-center">
            <div className="max-w-lg whitespace-pre-line text-[16px] leading-relaxed text-charcoal">
              {page.introBody}
            </div>
            <div className="relative aspect-[4/3]">
              <BrandImage src={null} alt="Medowie Lodge" label="Medowie Lodge" />
            </div>
          </div>
        </section>
      )}

      <ContentSection heading={page?.darrenHeading} body={page?.darrenBody} eyebrow="Darren Reay & Family" />
      <ContentSection heading={page?.breedingHeading} body={page?.breedingBody} eyebrow="Breeding" />
      <ContentSection heading={page?.trainingHeading} body={page?.trainingBody} eyebrow="Training" />
      <ContentSection heading={page?.regionHeading} body={page?.regionBody} eyebrow="Medowie / Hunter Region" />
    </div>
  );
}
