import { formatCurrency } from "@/lib/format";
import type { Stallion } from "@/lib/supabase/types";

export function QuickStats({ stallion }: { stallion: Stallion }) {
  const stats = [
    stallion.mile_rate ? { label: "Mile Rate", value: stallion.mile_rate } : null,
    stallion.career_earnings ? { label: "Career Earnings", value: formatCurrency(stallion.career_earnings) } : null,
    stallion.wins !== null ? { label: "Wins", value: String(stallion.wins) } : null,
    stallion.starts !== null ? { label: "Starts", value: String(stallion.starts) } : null,
    stallion.seconds !== null ? { label: "Seconds", value: String(stallion.seconds) } : null,
    stallion.thirds !== null ? { label: "Thirds", value: String(stallion.thirds) } : null,
  ].filter((s): s is { label: string; value: string } => Boolean(s?.value));

  if (stats.length === 0) return null;

  return (
    <section className="border-b border-line py-10">
      <div className="mx-auto w-full max-w-[1400px] px-5 sm:px-8">
        <dl className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
          {stats.map((s) => (
            <div key={s.label} className="border-l border-line pl-4">
              <dd className="font-serif text-3xl text-brown">{s.value}</dd>
              <dt className="mt-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-earth">{s.label}</dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
