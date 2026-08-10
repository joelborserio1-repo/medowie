"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

function str(formData: FormData, key: string): string | null {
  const value = formData.get(key);
  return typeof value === "string" && value.trim() !== "" ? value.trim() : null;
}
function num(formData: FormData, key: string): number | null {
  const value = str(formData, key);
  return value === null ? null : Number(value);
}
function int(formData: FormData, key: string): number | null {
  const value = str(formData, key);
  return value === null ? null : parseInt(value, 10);
}

export async function upsertHorse(formData: FormData) {
  await requireAdmin();
  const supabase = await createClient();

  const id = str(formData, "id");
  const status = str(formData, "status") ?? "available";

  const record = {
    name: str(formData, "name"),
    slug: str(formData, "slug"),
    status,
    featured: formData.get("featured") === "on",
    sale_type: str(formData, "sale_type") ?? "Private Sale",
    year_foaled: int(formData, "year_foaled"),
    sex: str(formData, "sex"),
    colour: str(formData, "colour"),
    gait: str(formData, "gait"),
    sire: str(formData, "sire"),
    dam: str(formData, "dam"),
    damsire: str(formData, "damsire"),
    price: num(formData, "price"),
    price_type: str(formData, "price_type") ?? "poa",
    description: str(formData, "description"),
    location: str(formData, "location"),
    hero_image_url: str(formData, "hero_image_url"),
    pedigree_document_url: str(formData, "pedigree_document_url"),
    video_url: str(formData, "video_url"),
    external_catalogue_url: str(formData, "external_catalogue_url"),
    sale_name: str(formData, "sale_name"),
    sale_date: str(formData, "sale_date"),
    lot_number: str(formData, "lot_number"),
    sold_price: num(formData, "sold_price"),
    show_sold_price: formData.get("show_sold_price") === "on",
    display_order: int(formData, "display_order") ?? 0,
    published_at: status !== "archive" ? new Date().toISOString() : null,
  };

  let horseId = id;
  if (id) {
    const { error } = await supabase.from("horses_for_sale").update(record).eq("id", id);
    if (error) throw error;
  } else {
    const { data, error } = await supabase.from("horses_for_sale").insert(record).select("id").single();
    if (error) throw error;
    horseId = data.id;
  }

  revalidatePath("/admin/horses-for-sale");
  revalidatePath("/admin/yearlings");
  revalidatePath("/horses-for-sale");
  revalidatePath("/yearling-preparation");
  revalidatePath("/");
  redirect(`/admin/horses-for-sale/${horseId}`);
}

export async function deleteHorse(id: string) {
  await requireAdmin();
  const supabase = await createClient();
  await supabase.from("horses_for_sale").delete().eq("id", id);
  revalidatePath("/admin/horses-for-sale");
  revalidatePath("/horses-for-sale");
  redirect("/admin/horses-for-sale");
}

export async function addHorseGalleryImage(horseId: string, formData: FormData) {
  await requireAdmin();
  const supabase = await createClient();
  const imageUrl = str(formData, "image_url");
  if (imageUrl) {
    await supabase.from("horse_gallery").insert({ horse_id: horseId, image_url: imageUrl, alt_text: str(formData, "alt_text") });
  }
  revalidatePath(`/admin/horses-for-sale/${horseId}`);
}

export async function deleteHorseGalleryImage(horseId: string, id: string) {
  await requireAdmin();
  const supabase = await createClient();
  await supabase.from("horse_gallery").delete().eq("id", id);
  revalidatePath(`/admin/horses-for-sale/${horseId}`);
}
