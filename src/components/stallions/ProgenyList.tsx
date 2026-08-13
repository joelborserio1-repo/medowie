"use client";

import { useMemo, useState } from "react";
import { formatCurrency, formatDate } from "@/lib/format";
import type { StallionProgeny } from "@/lib/supabase/types";

type SortKey =
  | "name"
  | "foaled_date"
  | "dam"
  | "damsire"
  | "country_of_birth"
  | "sex"
  | "earnings"
  | "mile_rate"
  | "starts"
  | "wins";

type SortDir = "asc" | "desc";

const COLUMNS: { key: SortKey; label: string; numeric?: boolean; align?: "left" | "right" }[] = [
  { key: "name", label: "Name" },
  { key: "foaled_date", label: "Foaling Date" },
  { key: "dam", label: "Dam" },
  { key: "damsire", label: "Broodmare Sire" },
  { key: "country_of_birth", label: "Country" },
  { key: "sex", label: "Sex" },
  { key: "earnings", label: "Lifetime Prizemoney", numeric: true, align: "right" },
  { key: "mile_rate", label: "Best Mile Rate", align: "right" },
  { key: "starts", label: "Lifetime Starts", numeric: true, align: "right" },
  { key: "wins", label: "Lifetime Wins", numeric: true, align: "right" },
];

function compare(a: StallionProgeny, b: StallionProgeny, key: SortKey, dir: SortDir): number {
  const av = a[key];
  const bv = b[key];
  // Nulls always sort last regardless of direction.
  if (av === null || av === undefined) return 1;
  if (bv === null || bv === undefined) return -1;

  let result: number;
  if (typeof av === "number" && typeof bv === "number") {
    result = av - bv;
  } else {
    result = String(av).localeCompare(String(bv), "en", { numeric: true, sensitivity: "base" });
  }
  return dir === "asc" ? result : -result;
}

export function ProgenyList({ progeny }: { progeny: StallionProgeny[] }) {
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("earnings");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = q
      ? progeny.filter((p) =>
          [p.name, p.dam, p.damsire, p.country_of_birth, p.sex]
            .filter(Boolean)
            .some((v) => String(v).toLowerCase().includes(q))
        )
      : progeny;
    return [...filtered].sort((a, b) => compare(a, b, sortKey, sortDir));
  }, [progeny, query, sortKey, sortDir]);

  if (progeny.length === 0) return null;

  const toggleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      // Numeric columns default to high→low, text columns A→Z.
      const col = COLUMNS.find((c) => c.key === key);
      setSortDir(col?.numeric ? "desc" : "asc");
    }
  };

  return (
    <section className="border-b border-line py-14">
      <div className="mx-auto w-full max-w-[1400px] px-5 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow mb-3">Progeny</p>
            <h2 className="font-serif text-3xl text-brown">Progeny Record</h2>
          </div>
          <label className="relative block w-full sm:w-72">
            <span className="sr-only">Search progeny</span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name, dam, broodmare sire…"
              className="w-full rounded-brand border border-line bg-warm-white px-3 py-2 text-sm text-charcoal placeholder:text-earth focus:border-orange focus:outline-none"
            />
          </label>
        </div>

        <p className="mt-3 text-xs text-grey">
          {rows.length} {rows.length === 1 ? "runner" : "runners"}
          {query && ` matching “${query}”`} · tap a column heading to sort
        </p>

        <div className="mt-6 overflow-x-auto rounded-brand border border-line">
          <table className="w-full min-w-[900px] border-collapse text-left text-sm">
            <thead>
              <tr className="bg-parchment text-[11px] uppercase tracking-[0.06em] text-earth">
                {COLUMNS.map((col) => {
                  const active = col.key === sortKey;
                  return (
                    <th
                      key={col.key}
                      scope="col"
                      className={`whitespace-nowrap px-4 py-3 font-semibold ${
                        col.align === "right" ? "text-right" : "text-left"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => toggleSort(col.key)}
                        className={`inline-flex items-center gap-1 uppercase tracking-[0.06em] transition-colors hover:text-orange ${
                          active ? "text-orange" : ""
                        } ${col.align === "right" ? "flex-row-reverse" : ""}`}
                        aria-label={`Sort by ${col.label}`}
                      >
                        {col.label}
                        <span aria-hidden="true" className="text-[9px]">
                          {active ? (sortDir === "asc" ? "▲" : "▼") : "↕"}
                        </span>
                      </button>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p.id} className="border-t border-line odd:bg-warm-white even:bg-parchment/40">
                  <td className="whitespace-nowrap px-4 py-3 font-medium text-charcoal">
                    {p.name}
                    {p.featured && <span className="ml-1.5 text-orange" aria-label="Notable">★</span>}
                    {p.description && <span className="mt-0.5 block text-xs font-normal text-grey">{p.description}</span>}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-grey">
                    {formatDate(p.foaled_date) ?? (p.foaled_year ? String(p.foaled_year) : "—")}
                  </td>
                  <td className="px-4 py-3 text-grey">{p.dam ?? "—"}</td>
                  <td className="px-4 py-3 text-grey">{p.damsire ?? "—"}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-grey">{p.country_of_birth ?? "—"}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-grey">{p.sex ?? "—"}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-right font-medium text-charcoal">
                    {formatCurrency(p.earnings) ?? "—"}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right text-grey">{p.mile_rate ?? "—"}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-right text-grey">{p.starts ?? "—"}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-right text-grey">{p.wins ?? "—"}</td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={COLUMNS.length} className="px-4 py-10 text-center text-sm text-grey">
                    No progeny match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
