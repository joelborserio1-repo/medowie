"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

function str(formData: FormData, key: string): string | null {
  const value = formData.get(key);
  return typeof value === "string" && value.trim() !== "" ? value.trim() : null;
}

export async function upsertResult(formData: FormData) {
  await requireAdmin();
  const supabase = await createClient();
  const id = str(formData, "id");

  const record = {
    date: str(formData, "date"),
    horse: str(formData, "horse"),
    race: str(formData, "race"),
    track: str(formData, "track"),
    placing: str(formData, "placing"),
    trainer: str(formData, "trainer"),
    driver: str(formData, "driver"),
    time: str(formData, "time"),
    description: str(formData, "description"),
    image_url: str(formData, "image_url"),
    external_url: str(formData, "external_url"),
    status: str(formData, "status") ?? "published",
  };

  if (id) {
    const { error } = await supabase.from("results").update(record).eq("id", id);
    if (error) throw error;
  } else {
    const { error } = await supabase.from("results").insert(record);
    if (error) throw error;
  }

  revalidatePath("/admin/results");
  revalidatePath("/results");
  revalidatePath("/");
  redirect("/admin/results");
}

export async function deleteResult(id: string) {
  await requireAdmin();
  const supabase = await createClient();
  await supabase.from("results").delete().eq("id", id);
  revalidatePath("/admin/results");
  revalidatePath("/results");
  redirect("/admin/results");
}
