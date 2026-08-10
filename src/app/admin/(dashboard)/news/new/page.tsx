import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { NewsForm } from "@/components/admin/NewsForm";

export default async function NewNewsPage() {
  await requireAdmin();
  const supabase = await createClient();
  const [{ data: stallions }, { data: horses }] = await Promise.all([
    supabase.from("stallions").select("id, name").order("name"),
    supabase.from("horses_for_sale").select("id, name").order("name"),
  ]);

  return (
    <div>
      <AdminPageHeader title="Add Article" />
      <NewsForm stallions={stallions ?? []} horses={horses ?? []} />
    </div>
  );
}
