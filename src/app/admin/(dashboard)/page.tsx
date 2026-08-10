import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/format";

export default async function AdminDashboardPage() {
  const admin = await requireAdmin();
  const supabase = await createClient();

  const [
    { count: activeStallions },
    { count: currentListings },
    { count: newEnquiries },
    { count: bookAMareEnquiries },
    { count: draftStallions },
    { count: draftNews },
  ] = await Promise.all([
    supabase.from("stallions").select("id", { count: "exact", head: true }).eq("status", "published"),
    supabase.from("horses_for_sale").select("id", { count: "exact", head: true }).in("status", ["available", "under_offer", "upcoming"]),
    supabase.from("enquiries").select("id", { count: "exact", head: true }).eq("status", "new"),
    supabase.from("enquiries").select("id", { count: "exact", head: true }).eq("type", "book_a_mare").eq("status", "new"),
    supabase.from("stallions").select("id", { count: "exact", head: true }).in("status", ["draft", "admin_review"]),
    supabase.from("news").select("id", { count: "exact", head: true }).eq("status", "draft"),
  ]);

  const { data: recentEnquiries } = await supabase
    .from("enquiries")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5);

  const stats = [
    { label: "Active Stallions", value: activeStallions ?? 0, href: "/admin/stallions" },
    { label: "Current Sale Listings", value: currentListings ?? 0, href: "/admin/horses-for-sale" },
    { label: "New Enquiries", value: newEnquiries ?? 0, href: "/admin/enquiries?status=new" },
    { label: "Book-a-Mare Enquiries", value: bookAMareEnquiries ?? 0, href: "/admin/enquiries?status=new" },
    { label: "Draft / Review Content", value: (draftStallions ?? 0) + (draftNews ?? 0), href: "/admin/stallions" },
  ];

  return (
    <div>
      <h1 className="mb-1 font-serif text-2xl text-brown">Welcome{admin.fullName ? `, ${admin.fullName}` : ""}</h1>
      <p className="mb-8 text-sm text-grey">Medowie Lodge admin dashboard.</p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="border border-line bg-warm-white p-5 hover:border-orange">
            <p className="font-serif text-3xl text-brown">{s.value}</p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-grey">{s.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-10">
        <h2 className="mb-4 font-serif text-xl text-brown">Recent Enquiries</h2>
        <div className="overflow-x-auto border border-line bg-warm-white">
          <table className="w-full min-w-[600px] text-left text-sm">
            <thead>
              <tr className="border-b border-line bg-parchment text-[11px] uppercase tracking-[0.08em] text-earth">
                <th className="px-4 py-3 font-semibold">Date</th>
                <th className="px-4 py-3 font-semibold">Type</th>
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {(recentEnquiries ?? []).map((e) => (
                <tr key={e.id} className="border-b border-line">
                  <td className="px-4 py-3 text-grey">{formatDate(e.created_at)}</td>
                  <td className="px-4 py-3 text-grey">{e.type.replace(/_/g, " ")}</td>
                  <td className="px-4 py-3 font-medium text-charcoal">{e.name}</td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/admin/enquiries/${e.id}`} className="text-xs font-semibold uppercase tracking-wide text-orange hover:underline">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
              {(recentEnquiries ?? []).length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-sm text-grey">
                    No enquiries yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
