import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { formatDate } from "@/lib/format";

export default async function AdminNewsPage() {
  await requireAdmin();
  const supabase = await createClient();
  const { data: articles } = await supabase.from("news").select("*").order("published_date", { ascending: false });

  return (
    <div>
      <AdminPageHeader title="News" action={{ label: "Add Article", href: "/admin/news/new" }} />
      <div className="overflow-x-auto border border-line bg-warm-white">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-line bg-parchment text-[11px] uppercase tracking-[0.08em] text-earth">
              <th className="px-4 py-3 font-semibold">Title</th>
              <th className="px-4 py-3 font-semibold">Category</th>
              <th className="px-4 py-3 font-semibold">Date</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {(articles ?? []).map((a) => (
              <tr key={a.id} className="border-b border-line">
                <td className="px-4 py-3 font-medium text-charcoal">{a.title}</td>
                <td className="px-4 py-3 text-grey">{a.category}</td>
                <td className="px-4 py-3 text-grey">{formatDate(a.published_date)}</td>
                <td className="px-4 py-3 text-xs uppercase tracking-wide text-grey">{a.status}</td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/news/${a.id}`} className="text-xs font-semibold uppercase tracking-wide text-orange hover:underline">
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
            {(articles ?? []).length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-sm text-grey">
                  No articles yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
