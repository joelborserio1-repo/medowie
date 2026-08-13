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

export async function upsertStallion(formData: FormData) {
  await requireAdmin();
  const supabase = await createClient();

  const id = str(formData, "id");
  const status = str(formData, "status") ?? "admin_review";

  const record = {
    name: str(formData, "name"),
    slug: str(formData, "slug"),
    country_suffix: str(formData, "country_suffix"),
    status,
    featured: formData.get("featured") === "on",
    display_order: int(formData, "display_order") ?? 0,
    gait: str(formData, "gait"),
    colour: str(formData, "colour"),
    foaled_date: str(formData, "foaled_date"),
    height: str(formData, "height"),
    sire: str(formData, "sire"),
    dam: str(formData, "dam"),
    damsire: str(formData, "damsire"),
    service_fee: num(formData, "service_fee"),
    service_fee_nz: num(formData, "service_fee_nz"),
    fee_notes: str(formData, "fee_notes"),
    includes_gst: formData.get("includes_gst") === "on",
    mile_rate: str(formData, "mile_rate"),
    career_earnings: num(formData, "career_earnings"),
    starts: int(formData, "starts"),
    wins: int(formData, "wins"),
    seconds: int(formData, "seconds"),
    thirds: int(formData, "thirds"),
    headline: str(formData, "headline"),
    short_description: str(formData, "short_description"),
    full_biography: str(formData, "full_biography"),
    semen_chilled_au: formData.get("semen_chilled_au") === "on",
    semen_frozen_au: formData.get("semen_frozen_au") === "on",
    semen_frozen_nz: formData.get("semen_frozen_nz") === "on",
    semen_notes: str(formData, "semen_notes"),
    mating_information: str(formData, "mating_information"),
    mating_pdf_url: str(formData, "mating_pdf_url"),
    pedigree_document_url: str(formData, "pedigree_document_url"),
    hero_image_url: str(formData, "hero_image_url"),
    profile_image_url: str(formData, "profile_image_url"),
    card_image_url: str(formData, "card_image_url"),
    meta_title: str(formData, "meta_title"),
    meta_description: str(formData, "meta_description"),
    published_at: status === "published" ? new Date().toISOString() : null,
  };

  let stallionId = id;

  // `service_fee_nz` may not exist yet on the live database. If Postgres/PostgREST
  // rejects it as an unknown column, transparently retry without it so saving a
  // stallion never breaks — the NZ fee simply won't persist until the column exists.
  const isMissingNzColumn = (message: string | undefined) =>
    Boolean(message && /service_fee_nz/.test(message) && /(column|schema cache|does not exist)/i.test(message));

  if (id) {
    let { error } = await supabase.from("stallions").update(record).eq("id", id);
    if (error && isMissingNzColumn(error.message)) {
      const { service_fee_nz: _omit, ...rest } = record;
      void _omit;
      ({ error } = await supabase.from("stallions").update(rest).eq("id", id));
    }
    if (error) throw error;
  } else {
    let { data, error } = await supabase.from("stallions").insert(record).select("id").single();
    if (error && isMissingNzColumn(error.message)) {
      const { service_fee_nz: _omit, ...rest } = record;
      void _omit;
      ({ data, error } = await supabase.from("stallions").insert(rest).select("id").single());
    }
    if (error) throw error;
    stallionId = data!.id;
  }

  revalidatePath("/admin/stallions");
  revalidatePath("/stallions");
  revalidatePath("/");
  redirect(`/admin/stallions/${stallionId}`);
}

export async function deleteStallion(id: string) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("stallions").delete().eq("id", id);
  if (error) throw error;
  revalidatePath("/admin/stallions");
  revalidatePath("/stallions");
  redirect("/admin/stallions");
}

export async function duplicateStallion(id: string) {
  await requireAdmin();
  const supabase = await createClient();
  const { data: original, error } = await supabase.from("stallions").select("*").eq("id", id).single();
  if (error || !original) throw error ?? new Error("Stallion not found");

  const { id: _id, slug, created_at, updated_at, ...rest } = original;
  void _id;
  void created_at;
  void updated_at;

  const { data: copy, error: insertError } = await supabase
    .from("stallions")
    .insert({ ...rest, slug: `${slug}-copy`, name: `${rest.name} (Copy)`, status: "draft", featured: false, published_at: null })
    .select("id")
    .single();
  if (insertError) throw insertError;

  revalidatePath("/admin/stallions");
  redirect(`/admin/stallions/${copy.id}`);
}

// --- Related rows -----------------------------------------------------

export async function addHighlight(stallionId: string, formData: FormData) {
  await requireAdmin();
  const supabase = await createClient();
  await supabase.from("stallion_highlights").insert({
    stallion_id: stallionId,
    year: str(formData, "year"),
    race: str(formData, "race"),
    grade: str(formData, "grade"),
    result: str(formData, "result"),
    track: str(formData, "track"),
    notes: str(formData, "notes"),
  });
  revalidatePath(`/admin/stallions/${stallionId}`);
  revalidatePath("/stallions");
}

export async function deleteHighlight(stallionId: string, id: string) {
  await requireAdmin();
  const supabase = await createClient();
  await supabase.from("stallion_highlights").delete().eq("id", id);
  revalidatePath(`/admin/stallions/${stallionId}`);
}

export async function addEligibility(stallionId: string, formData: FormData) {
  await requireAdmin();
  const supabase = await createClient();
  const label = str(formData, "label");
  if (label) await supabase.from("stallion_eligibility").insert({ stallion_id: stallionId, label });
  revalidatePath(`/admin/stallions/${stallionId}`);
}

export async function deleteEligibility(stallionId: string, id: string) {
  await requireAdmin();
  const supabase = await createClient();
  await supabase.from("stallion_eligibility").delete().eq("id", id);
  revalidatePath(`/admin/stallions/${stallionId}`);
}

export async function addGalleryImage(stallionId: string, formData: FormData) {
  await requireAdmin();
  const supabase = await createClient();
  const imageUrl = str(formData, "image_url");
  if (imageUrl) {
    await supabase
      .from("stallion_gallery")
      .insert({ stallion_id: stallionId, image_url: imageUrl, alt_text: str(formData, "alt_text"), caption: str(formData, "caption") });
  }
  revalidatePath(`/admin/stallions/${stallionId}`);
}

export async function deleteGalleryImage(stallionId: string, id: string) {
  await requireAdmin();
  const supabase = await createClient();
  await supabase.from("stallion_gallery").delete().eq("id", id);
  revalidatePath(`/admin/stallions/${stallionId}`);
}

export async function addVideo(stallionId: string, formData: FormData) {
  await requireAdmin();
  const supabase = await createClient();
  const youtubeUrl = str(formData, "youtube_url");
  if (youtubeUrl) {
    await supabase.from("stallion_videos").insert({ stallion_id: stallionId, youtube_url: youtubeUrl, title: str(formData, "title") });
  }
  revalidatePath(`/admin/stallions/${stallionId}`);
}

export async function deleteVideo(stallionId: string, id: string) {
  await requireAdmin();
  const supabase = await createClient();
  await supabase.from("stallion_videos").delete().eq("id", id);
  revalidatePath(`/admin/stallions/${stallionId}`);
}

export async function addDocument(stallionId: string, formData: FormData) {
  await requireAdmin();
  const supabase = await createClient();
  const title = str(formData, "title");
  const fileUrl = str(formData, "file_url");
  if (title && fileUrl) {
    await supabase.from("stallion_documents").insert({ stallion_id: stallionId, title, file_url: fileUrl });
  }
  revalidatePath(`/admin/stallions/${stallionId}`);
}

export async function deleteDocument(stallionId: string, id: string) {
  await requireAdmin();
  const supabase = await createClient();
  await supabase.from("stallion_documents").delete().eq("id", id);
  revalidatePath(`/admin/stallions/${stallionId}`);
}

export async function addProgeny(stallionId: string, formData: FormData) {
  await requireAdmin();
  const supabase = await createClient();
  const name = str(formData, "name");
  if (name) {
    await supabase.from("stallion_progeny").insert({
      stallion_id: stallionId,
      name,
      sex: str(formData, "sex"),
      foaled_year: int(formData, "foaled_year"),
      foaled_date: str(formData, "foaled_date"),
      country_of_birth: str(formData, "country_of_birth"),
      dam: str(formData, "dam"),
      damsire: str(formData, "damsire"),
      earnings: num(formData, "earnings"),
      mile_rate: str(formData, "mile_rate"),
      starts: int(formData, "starts"),
      wins: int(formData, "wins"),
      notes: str(formData, "notes"),
      description: str(formData, "description"),
      image_url: str(formData, "image_url"),
      profile_url: str(formData, "profile_url"),
      featured: formData.get("featured") === "on",
    });
  }
  revalidatePath(`/admin/stallions/${stallionId}`);
  revalidatePath("/admin/progeny");
}

/**
 * Bulk-import progeny from spreadsheet data pasted as delimited rows.
 * Expected column order (matching the supplied Excel export):
 *   Name | Foaling Date | Dam | Broodmare Sire | Country of Birth | Sex |
 *   Lifetime Prizemoney | Best Mile Rate | Lifetime Starts | Lifetime Wins
 * Accepts tab-separated (direct Excel paste) or comma-separated values.
 * A leading header row is detected and skipped automatically.
 */
export async function bulkImportProgeny(stallionId: string, formData: FormData) {
  await requireAdmin();
  const supabase = await createClient();

  const raw = str(formData, "rows");
  const mode = str(formData, "mode"); // "append" | "replace"
  if (!raw) {
    redirect(`/admin/stallions/${stallionId}?import=empty`);
  }

  const lines = raw
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  const splitRow = (line: string): string[] =>
    (line.includes("\t") ? line.split("\t") : line.split(",")).map((c) => c.trim());

  // Skip a header row if the first cell is non-numeric header text like "Name".
  if (lines.length > 0) {
    const first = splitRow(lines[0])[0]?.toLowerCase();
    if (first === "name") lines.shift();
  }

  const toNum = (v: string | undefined): number | null => {
    if (!v) return null;
    const cleaned = v.replace(/[$,\s]/g, "");
    if (cleaned === "") return null;
    const n = Number(cleaned);
    return Number.isFinite(n) ? n : null;
  };
  const toInt = (v: string | undefined): number | null => {
    const n = toNum(v);
    return n === null ? null : Math.trunc(n);
  };
  const toDate = (v: string | undefined): string | null => {
    if (!v) return null;
    const d = new Date(v);
    if (Number.isNaN(d.getTime())) return null;
    return d.toISOString().slice(0, 10);
  };
  const text = (v: string | undefined): string | null => {
    const t = (v ?? "").trim();
    return t === "" ? null : t;
  };

  const records = lines
    .map((line, index) => {
      const c = splitRow(line);
      const name = text(c[0]);
      if (!name) return null;
      const foaledDate = toDate(c[1]);
      return {
        stallion_id: stallionId,
        name,
        foaled_date: foaledDate,
        foaled_year: foaledDate ? new Date(foaledDate).getFullYear() : null,
        dam: text(c[2]),
        damsire: text(c[3]),
        country_of_birth: text(c[4]),
        sex: text(c[5]),
        earnings: toNum(c[6]),
        mile_rate: text(c[7]),
        starts: toInt(c[8]),
        wins: toInt(c[9]),
        display_order: index,
        featured: false,
      };
    })
    .filter((r): r is NonNullable<typeof r> => r !== null);

  if (records.length === 0) {
    redirect(`/admin/stallions/${stallionId}?import=none`);
  }

  if (mode === "replace") {
    await supabase.from("stallion_progeny").delete().eq("stallion_id", stallionId);
  }

  const { error } = await supabase.from("stallion_progeny").insert(records);
  if (error) throw error;

  revalidatePath(`/admin/stallions/${stallionId}`);
  revalidatePath("/admin/progeny");
  revalidatePath("/stallions");
  redirect(`/admin/stallions/${stallionId}?import=${records.length}`);
}

export async function deleteProgeny(stallionId: string, id: string) {
  await requireAdmin();
  const supabase = await createClient();
  await supabase.from("stallion_progeny").delete().eq("id", id);
  revalidatePath(`/admin/stallions/${stallionId}`);
  revalidatePath("/admin/progeny");
}

export async function upsertPedigree(stallionId: string, formData: FormData) {
  await requireAdmin();
  const supabase = await createClient();
  await supabase.from("stallion_pedigree").upsert(
    {
      stallion_id: stallionId,
      sires_sire: str(formData, "sires_sire"),
      sires_dam: str(formData, "sires_dam"),
      dams_sire: str(formData, "dams_sire"),
      dams_dam: str(formData, "dams_dam"),
    },
    { onConflict: "stallion_id" }
  );
  revalidatePath(`/admin/stallions/${stallionId}`);
}
