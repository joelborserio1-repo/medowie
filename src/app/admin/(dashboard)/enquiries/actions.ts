"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export async function updateEnquiryStatus(id: string, formData: FormData) {
  const admin = await requireAdmin();
  const supabase = await createClient();
  const status = formData.get("status");
  if (typeof status === "string") {
    await supabase.from("enquiries").update({ status }).eq("id", id);
  }
  void admin;
  revalidatePath(`/admin/enquiries/${id}`);
  revalidatePath("/admin/enquiries");
  revalidatePath("/admin");
}

export async function addEnquiryNote(id: string, formData: FormData) {
  const admin = await requireAdmin();
  const supabase = await createClient();
  const note = formData.get("note");
  if (typeof note === "string" && note.trim() !== "") {
    await supabase.from("enquiry_notes").insert({ enquiry_id: id, author_id: admin.id, note: note.trim() });
  }
  revalidatePath(`/admin/enquiries/${id}`);
}
