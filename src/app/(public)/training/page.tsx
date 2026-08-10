import type { Metadata } from "next";
import { PageHero } from "@/components/site/PageHero";
import { ContentSection } from "@/components/site/ContentSection";
import { BrandImage } from "@/components/ui/BrandImage";
import { TrainingEnquiryForm } from "@/components/forms/TrainingEnquiryForm";
import { getTrainingPage } from "@/lib/data/settings";

export const metadata: Metadata = {
  title: "Training",
  description: "Race training, breaking-in and preparation from Medowie Lodge, NSW.",
  alternates: { canonical: "/training" },
};

export default async function TrainingPage() {
  const page = await getTrainingPage().catch(() => null);

  return (
    <div>
      <PageHero
        eyebrow="Medowie Lodge"
        heading="Training"
        intro="Race training, breaking-in and preparation from Medowie, NSW."
      />

      {page?.introBody && (
        <section className="border-b border-line py-14">
          <div className="mx-auto grid w-full max-w-[1400px] gap-10 px-5 sm:px-8 lg:grid-cols-2 lg:items-center">
            <div className="relative aspect-[4/3]">
              <BrandImage src={null} alt="Training at Medowie Lodge" label="Training" />
            </div>
            <div className="max-w-lg whitespace-pre-line text-[16px] leading-relaxed text-charcoal">
              {page.introBody}
            </div>
          </div>
        </section>
      )}

      <ContentSection heading={page?.raceTrainingHeading} body={page?.raceTrainingBody} eyebrow="Race Training" />
      <ContentSection heading={page?.breakingInHeading} body={page?.breakingInBody} eyebrow="Breaking-In" />
      <ContentSection heading={page?.educationHeading} body={page?.educationBody} eyebrow="Education & Preparation" />
      <ContentSection heading={page?.facilitiesHeading} body={page?.facilitiesBody} eyebrow="Facilities" />

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
