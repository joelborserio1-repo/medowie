import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

export default async function AdminProgenyPage() {
  await requireAdmin();
  const supabase = await createClient();
  const { data: progeny } = await supabase
    .from("stallion_progeny")
    .select("*, stallions(name, id)")
    .order("display_order");

  return (
    <div>
      <AdminPageHeader title="Progeny" />
      <p className="mb-6 max-w-xl text-sm text-grey">
        Progeny are managed from each stallion&apos;s edit page — open a sire below to add records
        individually or bulk-import a full list straight from your Excel spreadsheet.
      </p>

      <div className="overflow-x-auto border border-line bg-warm-white">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-line bg-parchment text-[11px] uppercase tracking-[0.08em] text-earth">
              <th className="px-4 py-3 font-semibold">Name</th>
              <th className="px-4 py-3 font-semibold">Sire</th>
              <th className="px-4 py-3 font-semibold">Foaled</th>
              <th className="px-4 py-3 font-semibold">Featured</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {(progeny ?? []).map((p) => {
              const stallion = p.stallions as unknown as { id: string; name: string } | null;
              return (
                <tr key={p.id} className="border-b border-line">
                  <td className="px-4 py-3 font-medium text-charcoal">{p.name}</td>
                  <td className="px-4 py-3 text-grey">{stallion?.name ?? "—"}</td>
                  <td className="px-4 py-3 text-grey">{p.foaled_year ?? "—"}</td>
                  <td className="px-4 py-3 text-grey">{p.featured ? "Yes" : ""}</td>
                  <td className="px-4 py-3 text-right">
                    {stallion && (
                      <Link href={`/admin/stallions/${stallion.id}`} className="text-xs font-semibold uppercase tracking-wide text-orange hover:underline">
                        Manage
                      </Link>
                    )}
                  </td>
                </tr>
              );
            })}
            {(progeny ?? []).length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-sm text-grey">
                  No progeny recorded yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
