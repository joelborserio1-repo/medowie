"use client";

import { useState } from "react";
import { clsx } from "clsx";
import { StallionCard } from "@/components/stallions/StallionCard";
import type { Stallion } from "@/lib/supabase/types";

const FILTERS = [
  { label: "All", value: "all" },
  { label: "Pacers", value: "Pacer" },
  { label: "Trotters", value: "Trotter" },
] as const;

export function StallionIndexGrid({ stallions }: { stallions: Stallion[] }) {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["value"]>("all");
  const filtered = filter === "all" ? stallions : stallions.filter((s) => s.gait === filter);

  return (
    <div>
      <div className="flex gap-2 border-b border-line pb-4">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setFilter(f.value)}
            className={clsx(
              "px-4 py-2 text-xs font-semibold uppercase tracking-[0.1em]",
              filter === f.value ? "bg-orange text-warm-white" : "border border-line text-charcoal hover:border-orange"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="mt-8 text-sm text-grey">No stallions match this filter.</p>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((s) => (
            <StallionCard key={s.id} stallion={s} />
          ))}
        </div>
      )}
    </div>
  );
}
