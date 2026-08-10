import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { NewsForm } from "@/components/admin/NewsForm";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { deleteNews } from "../actions";

export default async function EditNewsPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: article }, { data: stallions }, { data: horses }] = await Promise.all([
    supabase.from("news").select("*").eq("id", id).maybeSingle(),
    supabase.from("stallions").select("id, name").order("name"),
    supabase.from("horses_for_sale").select("id, name").order("name"),
  ]);

  if (!article) notFound();

  return (
    <div>
      <AdminPageHeader title={`Edit — ${article.title}`} />
      <div className="mb-8">
        <DeleteButton action={deleteNews.bind(null, id)} confirmMessage="Delete this article?" />
      </div>
      <NewsForm article={article} stallions={stallions ?? []} horses={horses ?? []} />
    </div>
  );
}
