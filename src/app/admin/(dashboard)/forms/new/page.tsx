import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DocumentForm } from "@/components/admin/DocumentForm";

export default async function NewDocumentPage() {
  await requireAdmin();
  const supabase = await createClient();
  const { data: stallions } = await supabase.from("stallions").select("id, name").order("name");

  return (
    <div>
      <AdminPageHeader title="Add Document" />
      <DocumentForm stallions={stallions ?? []} />
    </div>
  );
}
