import type { Metadata } from "next";
import { StallionIndexGrid } from "@/components/stallions/StallionIndexGrid";
import { StallionCard } from "@/components/stallions/StallionCard";
import { getArchivedStallions, getPublishedStallions } from "@/lib/data/stallions";

export const metadata: Metadata = {
  title: "Stallions",
  description: "Standardbred stallions standing at Medowie Lodge, NSW.",
  alternates: { canonical: "/stallions" },
};

export default async function StallionsPage() {
  const [stallions, archived] = await Promise.all([
    getPublishedStallions().catch(() => []),
    getArchivedStallions().catch(() => []),
  ]);

  return (
    <div className="py-14 sm:py-20">
      <div className="mx-auto w-full max-w-[1400px] px-5 sm:px-8">
        <p className="eyebrow mb-3">Standardbred Sires</p>
        <h1 className="font-serif text-4xl text-brown sm:text-5xl">Stallions</h1>
        <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-grey">
          Current stallions standing at Medowie Lodge.
        </p>

        <div className="mt-10">
          {stallions.length === 0 ? (
            <p className="text-sm text-grey">
              Stallion listings for the current season are being confirmed. Contact Medowie Lodge directly
              for availability.
            </p>
          ) : (
            <StallionIndexGrid stallions={stallions} />
          )}
        </div>

        {archived.length > 0 && (
          <div className="mt-20 border-t border-line pt-10">
            <p className="eyebrow mb-3">Archive</p>
            <h2 className="font-serif text-2xl text-brown">Archived Stallions</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {archived.map((s) => (
                <StallionCard key={s.id} stallion={s} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
