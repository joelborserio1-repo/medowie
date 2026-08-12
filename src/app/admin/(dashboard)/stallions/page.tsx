import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { stallionDisplayName, formatFee } from "@/lib/format";
import { importZirconium } from "./actions";

export default async function AdminStallionsPage() {
  await requireAdmin();
  const supabase = await createClient();
  const { data: stallions } = await supabase.from("stallions").select("*").order("display_order");

  const hasZirconium = (stallions ?? []).some((s) => s.slug === "zirconium");

  return (
    <div>
      <AdminPageHeader title="Stallions" action={{ label: "Add Stallion", href: "/admin/stallions/new" }} />

      {!hasZirconium && (
        <form
          action={importZirconium}
          className="mb-6 flex flex-col gap-3 border border-orange/40 bg-parchment p-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <p className="font-semibold text-charcoal">Set up the current roster</p>
            <p className="text-sm text-grey">
              Adds Zirconium (Ready Cash × Ok America) and makes Soho Lanikai, Muscle M Up and Zirconium the
              three active stallions. The others are moved to draft. You can change any of this afterwards.
            </p>
          </div>
          <button
            type="submit"
            className="shrink-0 whitespace-nowrap bg-orange px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-warm-white hover:bg-orange-dark"
          >
            Import Zirconium &amp; set roster
          </button>
        </form>
      )}

      <div className="overflow-x-auto border border-line bg-warm-white">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-line bg-parchment text-[11px] uppercase tracking-[0.08em] text-earth">
              <th className="px-4 py-3 font-semibold">Name</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Gait</th>
              <th className="px-4 py-3 font-semibold">Fee</th>
              <th className="px-4 py-3 font-semibold">Featured</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {(stallions ?? []).map((s) => (
              <tr key={s.id} className="border-b border-line">
                <td className="px-4 py-3 font-medium text-charcoal">{stallionDisplayName(s.name, s.country_suffix)}</td>
                <td className="px-4 py-3">
                  <span className="text-xs uppercase tracking-wide text-grey">{s.status.replace("_", " ")}</span>
                </td>
                <td className="px-4 py-3 text-grey">{s.gait ?? "—"}</td>
                <td className="px-4 py-3 text-grey">{formatFee(s.service_fee, s.includes_gst) ?? "—"}</td>
                <td className="px-4 py-3 text-grey">{s.featured ? "Yes" : ""}</td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/stallions/${s.id}`} className="text-xs font-semibold uppercase tracking-wide text-orange hover:underline">
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
            {(stallions ?? []).length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-sm text-grey">
                  No stallions yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
