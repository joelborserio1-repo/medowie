import { requireAdmin } from "@/lib/auth";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { HorseForm } from "@/components/admin/HorseForm";

export default async function NewHorsePage() {
  await requireAdmin();
  return (
    <div>
      <AdminPageHeader title="Add Horse Listing" />
      <HorseForm />
    </div>
  );
}
