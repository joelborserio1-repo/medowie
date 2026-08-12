import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DocumentForm } from "@/components/admin/DocumentForm";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { deleteDocumentRecord } from "../actions";

export default async function EditDocumentPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: document }, { data: stallions }] = await Promise.all([
    supabase.from("documents").select("*").eq("id", id).maybeSingle(),
    supabase.from("stallions").select("id, name").order("name"),
  ]);

  if (!document) notFound();

  return (
    <div>
      <AdminPageHeader title={`Edit — ${document.title}`} />
      <div className="mb-8">
        <DeleteButton action={deleteDocumentRecord.bind(null, id)} confirmMessage="Delete this document?" />
      </div>
      <DocumentForm document={document} stallions={stallions ?? []} />
    </div>
  );
}
