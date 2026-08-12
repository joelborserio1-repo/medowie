import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { formatDate } from "@/lib/format";

const TYPE_LABELS: Record<string, string> = {
  general: "General",
  stallion: "Stallion",
  book_a_mare: "Book a Mare",
  training: "Training",
  horse_for_sale: "Horse for Sale",
};

export default async function AdminEnquiriesPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  await requireAdmin();
  const { status } = await searchParams;
  const supabase = await createClient();

  let query = supabase.from("enquiries").select("*").order("created_at", { ascending: false });
  if (status) query = query.eq("status", status);
  const { data: enquiries } = await query;

  const statuses = ["new", "contacted", "follow_up", "closed"];

  return (
    <div>
      <AdminPageHeader title="Enquiries" />

      <div className="mb-6 flex flex-wrap gap-2">
        <Link
          href="/admin/enquiries"
          className={`border px-3 py-1.5 text-xs font-semibold uppercase tracking-wide ${!status ? "border-orange text-orange" : "border-line text-grey"}`}
        >
          All
        </Link>
        {statuses.map((s) => (
          <Link
            key={s}
            href={`/admin/enquiries?status=${s}`}
            className={`border px-3 py-1.5 text-xs font-semibold uppercase tracking-wide ${status === s ? "border-orange text-orange" : "border-line text-grey"}`}
          >
            {s.replace("_", " ")}
          </Link>
        ))}
      </div>

      <div className="overflow-x-auto border border-line bg-warm-white">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-line bg-parchment text-[11px] uppercase tracking-[0.08em] text-earth">
              <th className="px-4 py-3 font-semibold">Date</th>
              <th className="px-4 py-3 font-semibold">Type</th>
              <th className="px-4 py-3 font-semibold">Name</th>
              <th className="px-4 py-3 font-semibold">Email</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {(enquiries ?? []).map((e) => (
              <tr key={e.id} className="border-b border-line">
                <td className="px-4 py-3 text-grey">{formatDate(e.created_at)}</td>
                <td className="px-4 py-3 text-grey">{TYPE_LABELS[e.type] ?? e.type}</td>
                <td className="px-4 py-3 font-medium text-charcoal">{e.name}</td>
                <td className="px-4 py-3 text-grey">{e.email}</td>
                <td className="px-4 py-3 text-xs uppercase tracking-wide text-grey">{e.status.replace("_", " ")}</td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/enquiries/${e.id}`} className="text-xs font-semibold uppercase tracking-wide text-orange hover:underline">
                    View
                  </Link>
                </td>
              </tr>
            ))}
            {(enquiries ?? []).length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-sm text-grey">
                  No enquiries yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
