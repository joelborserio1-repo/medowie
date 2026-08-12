import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { formatDate } from "@/lib/format";

export default async function AdminResultsPage() {
  await requireAdmin();
  const supabase = await createClient();
  const { data: results } = await supabase.from("results").select("*").order("date", { ascending: false });

  return (
    <div>
      <AdminPageHeader title="Results" action={{ label: "Add Result", href: "/admin/results/new" }} />
      <div className="overflow-x-auto border border-line bg-warm-white">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-line bg-parchment text-[11px] uppercase tracking-[0.08em] text-earth">
              <th className="px-4 py-3 font-semibold">Date</th>
              <th className="px-4 py-3 font-semibold">Horse</th>
              <th className="px-4 py-3 font-semibold">Race</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {(results ?? []).map((r) => (
              <tr key={r.id} className="border-b border-line">
                <td className="px-4 py-3 text-grey">{formatDate(r.date)}</td>
                <td className="px-4 py-3 font-medium text-charcoal">{r.horse}</td>
                <td className="px-4 py-3 text-grey">{r.race}</td>
                <td className="px-4 py-3 text-xs uppercase tracking-wide text-grey">{r.status}</td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/results/${r.id}`} className="text-xs font-semibold uppercase tracking-wide text-orange hover:underline">
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
            {(results ?? []).length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-sm text-grey">
                  No results yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
