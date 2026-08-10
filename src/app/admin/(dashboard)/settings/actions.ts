"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

function str(formData: FormData, key: string): string | null {
  const value = formData.get(key);
  return typeof value === "string" && value.trim() !== "" ? value.trim() : null;
}

export async function updateSettings(formData: FormData) {
  await requireAdmin();
  const supabase = await createClient();

  await supabase
    .from("site_settings")
    .update({
      business_name: str(formData, "business_name") ?? "Medowie Lodge",
      tagline: str(formData, "tagline"),
      phone: str(formData, "phone"),
      email: str(formData, "email"),
      address_line1: str(formData, "address_line1"),
      address_line2: str(formData, "address_line2"),
      suburb: str(formData, "suburb"),
      state: str(formData, "state"),
      postcode: str(formData, "postcode"),
      facebook_url: str(formData, "facebook_url"),
      instagram_url: str(formData, "instagram_url"),
      enquiry_recipient_email: str(formData, "enquiry_recipient_email"),
      collection_days: str(formData, "collection_days"),
      collection_cutoff_time: str(formData, "collection_cutoff_time"),
      collection_instructions: str(formData, "collection_instructions"),
      seo_default_title: str(formData, "seo_default_title"),
      seo_default_description: str(formData, "seo_default_description"),
      og_image_url: str(formData, "og_image_url"),
    })
    .eq("id", true);

  revalidatePath("/", "layout");
  revalidatePath("/admin/settings");
}
