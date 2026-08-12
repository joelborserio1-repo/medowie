import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { formatCurrency } from "@/lib/format";

export default async function AdminHorsesPage() {
  await requireAdmin();
  const supabase = await createClient();
  const { data: horses } = await supabase.from("horses_for_sale").select("*").order("display_order");

  return (
    <div>
      <AdminPageHeader title="Horses for Sale" action={{ label: "Add Listing", href: "/admin/horses-for-sale/new" }} />

      <div className="overflow-x-auto border border-line bg-warm-white">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-line bg-parchment text-[11px] uppercase tracking-[0.08em] text-earth">
              <th className="px-4 py-3 font-semibold">Name</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Sale Type</th>
              <th className="px-4 py-3 font-semibold">Price</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {(horses ?? []).map((h) => (
              <tr key={h.id} className="border-b border-line">
                <td className="px-4 py-3 font-medium text-charcoal">{h.name}</td>
                <td className="px-4 py-3 text-xs uppercase tracking-wide text-grey">{h.status.replace("_", " ")}</td>
                <td className="px-4 py-3 text-grey">{h.sale_type}</td>
                <td className="px-4 py-3 text-grey">{h.price_type === "poa" ? "POA" : formatCurrency(h.price) ?? "—"}</td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/horses-for-sale/${h.id}`} className="text-xs font-semibold uppercase tracking-wide text-orange hover:underline">
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
            {(horses ?? []).length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-sm text-grey">
                  No listings yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
