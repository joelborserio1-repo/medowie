import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHero } from "@/components/site/PageHero";
import { BookAMareForm } from "@/components/forms/BookAMareForm";
import { getPublishedStallions } from "@/lib/data/stallions";

export const metadata: Metadata = {
  title: "Book a Mare",
  description: "Submit a stallion booking enquiry to Medowie Lodge.",
  alternates: { canonical: "/book-a-mare" },
};

export default async function BookAMarePage() {
  const stallions = await getPublishedStallions().catch(() => []);

  return (
    <div>
      <PageHero
        eyebrow="Breeding"
        heading="Book a Mare"
        intro="Submit a booking enquiry for one of the stallions standing at Medowie Lodge."
      />

      <section className="py-14">
        <div className="mx-auto w-full max-w-3xl px-5 sm:px-8">
          {stallions.length === 0 ? (
            <p className="text-sm text-grey">
              Stallion listings are being finalised for this season. Contact Medowie Lodge directly to
              discuss booking a mare.
            </p>
          ) : (
            <Suspense>
              <BookAMareForm stallions={stallions} />
            </Suspense>
          )}
        </div>
      </section>
    </div>
  );
}
