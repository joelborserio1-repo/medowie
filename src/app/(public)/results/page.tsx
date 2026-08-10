import type { Metadata } from "next";
import { PageHero } from "@/components/site/PageHero";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatDate } from "@/lib/format";
import { getAllResults } from "@/lib/data/results";

export const metadata: Metadata = {
  title: "Results",
  description: "Race results for horses trained and bred at Medowie Lodge.",
  alternates: { canonical: "/results" },
};

export default async function ResultsPage() {
  const results = await getAllResults().catch(() => []);

  return (
    <div>
      <PageHero eyebrow="Track Record" heading="Results" />

      <section className="py-14">
        <div className="mx-auto w-full max-w-[1400px] px-5 sm:px-8">
          {results.length === 0 ? (
            <EmptyState heading="No results published yet" message="Race results will appear here as they're added." />
          ) : (
            <div className="divide-y divide-line border-y border-line">
              {results.map((r) => (
                <div key={r.id} className="grid gap-1 py-4 sm:grid-cols-[120px_1fr_auto] sm:items-center sm:gap-4">
                  <p className="text-xs uppercase tracking-[0.06em] text-grey">{formatDate(r.date)}</p>
                  <div>
                    <p className="font-serif text-lg text-brown">{r.horse}</p>
                    <p className="text-sm text-grey">
                      {[r.race, r.track, r.driver ? `Driver: ${r.driver}` : null].filter(Boolean).join(" — ")}
                    </p>
                    {r.description && <p className="mt-1 text-sm text-grey">{r.description}</p>}
                  </div>
                  {r.placing && <p className="text-sm font-semibold uppercase tracking-[0.06em] text-orange">{r.placing}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
