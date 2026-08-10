import type { StallionHighlight } from "@/lib/supabase/types";

export function CareerHighlightsTable({ highlights }: { highlights: StallionHighlight[] }) {
  if (highlights.length === 0) return null;

  return (
    <section className="border-b border-line py-14">
      <div className="mx-auto w-full max-w-[1400px] px-5 sm:px-8">
        <p className="eyebrow mb-3">Racing Record</p>
        <h2 className="font-serif text-3xl text-brown">Career Highlights</h2>

        <div className="mt-8 overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-line text-[11px] uppercase tracking-[0.08em] text-earth">
                <th className="py-2.5 pr-4 font-semibold">Year</th>
                <th className="py-2.5 pr-4 font-semibold">Race</th>
                <th className="py-2.5 pr-4 font-semibold">Grade</th>
                <th className="py-2.5 pr-4 font-semibold">Result</th>
                <th className="py-2.5 pr-4 font-semibold">Track</th>
                <th className="py-2.5 font-semibold">Notes</th>
              </tr>
            </thead>
            <tbody>
              {highlights.map((h) => (
                <tr key={h.id} className="border-b border-line">
                  <td className="py-3 pr-4 text-grey">{h.year}</td>
                  <td className="py-3 pr-4 font-medium text-charcoal">{h.race}</td>
                  <td className="py-3 pr-4 text-grey">{h.grade}</td>
                  <td className="py-3 pr-4 font-semibold text-orange">{h.result}</td>
                  <td className="py-3 pr-4 text-grey">{h.track}</td>
                  <td className="py-3 text-grey">{h.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
