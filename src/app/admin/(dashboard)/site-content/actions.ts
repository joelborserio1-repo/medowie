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

  const rawMeta = str(formData, "meta");
  let meta: Record<string, unknown> = {};
  if (rawMeta) {
    try {
      const parsed = JSON.parse(rawMeta);
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        meta = parsed as Record<string, unknown>;
      } else {
        throw new Error("must be a JSON object");
      }
    } catch {
      // Invalid JSON — leave the block's existing meta untouched rather than
      // silently wiping it or saving something the public pages can't read.
      const { data: existing } = await supabase.from("site_content_blocks").select("meta").eq("id", id).single();
      meta = (existing?.meta as Record<string, unknown>) ?? {};
    }
  }

  await supabase
    .from("site_content_blocks")
    .update({
      heading: str(formData, "heading"),
      body: str(formData, "body"),
      image_url: str(formData, "image_url"),
      status: str(formData, "status") ?? "draft",
      meta,
    })
    .eq("id", id);

  revalidatePath("/admin/site-content");
  revalidatePath("/", "layout");
}
