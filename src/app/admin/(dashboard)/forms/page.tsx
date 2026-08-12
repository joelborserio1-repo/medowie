import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

export default async function AdminFormsPage() {
  await requireAdmin();
  const supabase = await createClient();
  const { data: documents } = await supabase.from("documents").select("*").order("category");

  return (
    <div>
      <AdminPageHeader title="Forms & Contracts" action={{ label: "Add Document", href: "/admin/forms/new" }} />
      <div className="overflow-x-auto border border-line bg-warm-white">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-line bg-parchment text-[11px] uppercase tracking-[0.08em] text-earth">
              <th className="px-4 py-3 font-semibold">Title</th>
              <th className="px-4 py-3 font-semibold">Category</th>
              <th className="px-4 py-3 font-semibold">Season</th>
              <th className="px-4 py-3 font-semibold">Active</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {(documents ?? []).map((d) => (
              <tr key={d.id} className="border-b border-line">
                <td className="px-4 py-3 font-medium text-charcoal">{d.title}</td>
                <td className="px-4 py-3 text-grey">{d.category}</td>
                <td className="px-4 py-3 text-grey">{d.season ?? "—"}</td>
                <td className="px-4 py-3 text-grey">{d.active ? "Yes" : "No"}</td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/forms/${d.id}`} className="text-xs font-semibold uppercase tracking-wide text-orange hover:underline">
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
            {(documents ?? []).length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-sm text-grey">
                  No documents yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
