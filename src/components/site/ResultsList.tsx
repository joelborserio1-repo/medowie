import { formatDate } from "@/lib/format";
import type { Result } from "@/lib/supabase/types";

export function ResultsList({ results }: { results: Result[] }) {
  if (results.length === 0) return null;

  return (
    <section className="border-t border-line py-16 sm:py-24">
      <div className="mx-auto w-full max-w-[1400px] px-5 sm:px-8">
        <p className="eyebrow mb-3">Track Record</p>
        <h2 className="font-serif text-3xl text-brown sm:text-4xl">Latest Results</h2>

        <div className="mt-8 divide-y divide-line border-y border-line">
          {results.map((r) => (
            <div key={r.id} className="grid gap-1 py-4 sm:grid-cols-[120px_1fr_auto] sm:items-center sm:gap-4">
              <p className="text-xs uppercase tracking-[0.06em] text-grey">{formatDate(r.date)}</p>
              <div>
                <p className="font-serif text-lg text-brown">{r.horse}</p>
                <p className="text-sm text-grey">
                  {[r.race, r.track].filter(Boolean).join(" — ")}
                </p>
              </div>
              {r.placing && (
                <p className="text-sm font-semibold uppercase tracking-[0.06em] text-orange">{r.placing}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
