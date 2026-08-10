import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { formatDate } from "@/lib/format";

export default async function AdminYearlingsPage() {
  await requireAdmin();
  const supabase = await createClient();
  const { data: yearlings } = await supabase
    .from("horses_for_sale")
    .select("*")
    .eq("sale_type", "Yearling Sale")
    .order("sale_date", { ascending: false });

  return (
    <div>
      <AdminPageHeader title="Yearlings" action={{ label: "Add Yearling", href: "/admin/horses-for-sale/new" }} />
      <p className="mb-6 max-w-xl text-sm text-grey">
        Yearling sale entries share the Horses for Sale table — set “Sale Type” to Yearling Sale when adding one.
      </p>

      <div className="overflow-x-auto border border-line bg-warm-white">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-line bg-parchment text-[11px] uppercase tracking-[0.08em] text-earth">
              <th className="px-4 py-3 font-semibold">Lot</th>
              <th className="px-4 py-3 font-semibold">Name</th>
              <th className="px-4 py-3 font-semibold">Sale</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {(yearlings ?? []).map((y) => (
              <tr key={y.id} className="border-b border-line">
                <td className="px-4 py-3 text-grey">{y.lot_number ?? "—"}</td>
                <td className="px-4 py-3 font-medium text-charcoal">{y.name}</td>
                <td className="px-4 py-3 text-grey">{[y.sale_name, formatDate(y.sale_date)].filter(Boolean).join(" · ")}</td>
                <td className="px-4 py-3 text-xs uppercase tracking-wide text-grey">{y.status.replace("_", " ")}</td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/horses-for-sale/${y.id}`} className="text-xs font-semibold uppercase tracking-wide text-orange hover:underline">
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
            {(yearlings ?? []).length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-sm text-grey">
                  No yearling sale entries yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
