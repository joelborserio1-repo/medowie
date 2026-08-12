import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ResultForm } from "@/components/admin/ResultForm";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { deleteResult } from "../actions";

export default async function EditResultPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const supabase = await createClient();
  const { data: result } = await supabase.from("results").select("*").eq("id", id).maybeSingle();
  if (!result) notFound();

  return (
    <div>
      <AdminPageHeader title={`Edit — ${result.horse}`} />
      <div className="mb-8">
        <DeleteButton action={deleteResult.bind(null, id)} confirmMessage="Delete this result?" />
      </div>
      <ResultForm result={result} />
    </div>
  );
}
