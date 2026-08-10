"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

function str(formData: FormData, key: string): string | null {
  const value = formData.get(key);
  return typeof value === "string" && value.trim() !== "" ? value.trim() : null;
}

export async function upsertDocument(formData: FormData) {
  await requireAdmin();
  const supabase = await createClient();
  const id = str(formData, "id");

  const record = {
    title: str(formData, "title"),
    category: str(formData, "category"),
    season: str(formData, "season"),
    stallion_id: str(formData, "stallion_id"),
    file_url: str(formData, "file_url"),
    description: str(formData, "description"),
    active: formData.get("active") === "on",
  };

  if (id) {
    const { error } = await supabase.from("documents").update(record).eq("id", id);
    if (error) throw error;
  } else {
    const { error } = await supabase.from("documents").insert(record);
    if (error) throw error;
  }

  revalidatePath("/admin/forms");
  revalidatePath("/forms");
  redirect("/admin/forms");
}

export async function deleteDocumentRecord(id: string) {
  await requireAdmin();
  const supabase = await createClient();
  await supabase.from("documents").delete().eq("id", id);
  revalidatePath("/admin/forms");
  revalidatePath("/forms");
  redirect("/admin/forms");
}
