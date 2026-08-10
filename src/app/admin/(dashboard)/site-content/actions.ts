"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

function str(formData: FormData, key: string): string | null {
  const value = formData.get(key);
  return typeof value === "string" && value.trim() !== "" ? value.trim() : null;
}

export async function updateContentBlock(id: string, formData: FormData) {
  await requireAdmin();
  const supabase = await createClient();

  await supabase
    .from("site_content_blocks")
    .update({
      heading: str(formData, "heading"),
      body: str(formData, "body"),
      image_url: str(formData, "image_url"),
      status: str(formData, "status") ?? "draft",
    })
    .eq("id", id);

  revalidatePath("/admin/site-content");
  revalidatePath("/", "layout");
}
