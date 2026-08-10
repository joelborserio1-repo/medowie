import type { Metadata } from "next";
import { PageHero } from "@/components/site/PageHero";
import { ContentSection } from "@/components/site/ContentSection";
import { BrandImage } from "@/components/ui/BrandImage";
import { TrainingEnquiryForm } from "@/components/forms/TrainingEnquiryForm";
import { getContentBlocks } from "@/lib/data/settings";
import type { SiteContentBlock } from "@/lib/supabase/types";

export const metadata: Metadata = {
  title: "Training",
  description: "Race training, breaking-in and preparation from Medowie Lodge, NSW.",
  alternates: { canonical: "/training" },
};

const KEYS = ["training_intro", "training_race_training", "training_breaking_in", "training_education", "training_facilities"];

export default async function TrainingPage() {
  const blocks = await getContentBlocks(KEYS).catch(() => ({}) as Record<string, SiteContentBlock>);

  return (
    <div>
      <PageHero
        eyebrow="Medowie Lodge"
        heading="Training"
        intro="Race training, breaking-in and preparation from Medowie, NSW."
      />

      {blocks.training_intro && (
        <section className="border-b border-line py-14">
          <div className="mx-auto grid w-full max-w-[1400px] gap-10 px-5 sm:px-8 lg:grid-cols-2 lg:items-center">
            <div className="relative aspect-[4/3]">
              <BrandImage src={null} alt="Training at Medowie Lodge" label="Training" />
            </div>
            <div className="max-w-lg whitespace-pre-line text-[16px] leading-relaxed text-charcoal">
              {blocks.training_intro.body}
            </div>
          </div>
        </section>
      )}

      <ContentSection block={blocks.training_race_training} eyebrow="Race Training" />
      <ContentSection block={blocks.training_breaking_in} eyebrow="Breaking-In" />
      <ContentSection block={blocks.training_education} eyebrow="Education & Preparation" />
      <ContentSection block={blocks.training_facilities} eyebrow="Facilities" />

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
