import type { Metadata } from "next";
import { PageHero } from "@/components/site/PageHero";
import { ContentSection } from "@/components/site/ContentSection";
import { BrandImage } from "@/components/ui/BrandImage";
import { TrainingEnquiryForm } from "@/components/forms/TrainingEnquiryForm";
import { getContentBlocks } from "@/lib/data/settings";

export const metadata: Metadata = {
  title: "Training",
  description: "Race training, breaking-in and preparation from Medowie Lodge, NSW.",
  alternates: { canonical: "/training" },
};

export default async function TrainingPage() {
  const blocks = await getContentBlocks([
    "training_intro",
    "training_race_training",
    "training_breaking_in",
    "training_education",
    "training_facilities",
  ]);

  const intro = blocks["training_intro"];

  return (
    <div>
      <PageHero
        eyebrow="Medowie Lodge"
        heading="Training"
        intro="Race training, breaking-in and preparation from Medowie, NSW."
      />

      {intro?.body && (
        <section className="border-b border-line py-14">
          <div className="mx-auto grid w-full max-w-[1400px] gap-10 px-5 sm:px-8 lg:grid-cols-2 lg:items-center">
            <div className="relative aspect-[4/3]">
              <BrandImage src={intro.image_url} alt="Training at Medowie Lodge" label="Training" />
            </div>
            <div className="max-w-lg whitespace-pre-line text-[16px] leading-relaxed text-charcoal">
              {intro.body}
            </div>
          </div>
        </section>
      )}

      <ContentSection
        heading={blocks["training_race_training"]?.heading}
        body={blocks["training_race_training"]?.body}
        eyebrow="Race Training"
      />
      <ContentSection
        heading={blocks["training_breaking_in"]?.heading}
        body={blocks["training_breaking_in"]?.body}
        eyebrow="Breaking-In"
      />
      <ContentSection
        heading={blocks["training_education"]?.heading}
        body={blocks["training_education"]?.body}
        eyebrow="Education & Preparation"
      />
      <ContentSection
        heading={blocks["training_facilities"]?.heading}
        body={blocks["training_facilities"]?.body}
        eyebrow="Facilities"
      />

      <section className="py-14">
        <div className="mx-auto w-full max-w-2xl px-5 sm:px-8">
          <p className="eyebrow mb-3">Enquire</p>
          <h2 className="mb-6 font-serif text-3xl text-brown">Training Enquiry</h2>
          <TrainingEnquiryForm />
        </div>
      </section>
    </div>
  );
}
