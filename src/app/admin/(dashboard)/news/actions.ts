"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

function str(formData: FormData, key: string): string | null {
  const value = formData.get(key);
  return typeof value === "string" && value.trim() !== "" ? value.trim() : null;
}

export async function upsertNews(formData: FormData) {
  await requireAdmin();
  const supabase = await createClient();
  const id = str(formData, "id");

  const record = {
    title: str(formData, "title"),
    slug: str(formData, "slug"),
    excerpt: str(formData, "excerpt"),
    body: str(formData, "body"),
    hero_image_url: str(formData, "hero_image_url"),
    category: str(formData, "category"),
    published_date: str(formData, "published_date"),
    author: str(formData, "author"),
    related_stallion_id: str(formData, "related_stallion_id"),
    related_horse_id: str(formData, "related_horse_id"),
    status: str(formData, "status") ?? "draft",
    meta_title: str(formData, "meta_title"),
    meta_description: str(formData, "meta_description"),
  };

  if (id) {
    const { error } = await supabase.from("news").update(record).eq("id", id);
    if (error) throw error;
  } else {
    const { error } = await supabase.from("news").insert(record);
    if (error) throw error;
  }

  revalidatePath("/admin/news");
  revalidatePath("/news");
  revalidatePath("/");
  redirect("/admin/news");
}

export async function deleteNews(id: string) {
  await requireAdmin();
  const supabase = await createClient();
  await supabase.from("news").delete().eq("id", id);
  revalidatePath("/admin/news");
  revalidatePath("/news");
  redirect("/admin/news");
}
