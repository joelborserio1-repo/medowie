import { requireAdmin } from "@/lib/auth";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ResultForm } from "@/components/admin/ResultForm";

export default async function NewResultPage() {
  await requireAdmin();
  return (
    <div>
      <AdminPageHeader title="Add Result" />
      <ResultForm />
    </div>
  );
}
