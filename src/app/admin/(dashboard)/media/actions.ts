"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export async function deleteMediaAsset(id: string, bucket: string, path: string) {
  await requireAdmin();
  const supabase = await createClient();
  await supabase.storage.from(bucket).remove([path]);
  await supabase.from("media_assets").delete().eq("id", id);
  revalidatePath("/admin/media");
}

export async function updateMediaAlt(id: string, formData: FormData) {
  await requireAdmin();
  const supabase = await createClient();
  const altText = formData.get("alt_text");
  await supabase
    .from("media_assets")
    .update({ alt_text: typeof altText === "string" ? altText : null })
    .eq("id", id);
  revalidatePath("/admin/media");
}
