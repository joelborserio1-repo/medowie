import { requireAdmin } from "@/lib/auth";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { StallionForm } from "@/components/admin/StallionForm";

export default async function NewStallionPage() {
  await requireAdmin();
  return (
    <div>
      <AdminPageHeader title="Add Stallion" />
      <StallionForm />
    </div>
  );
}
