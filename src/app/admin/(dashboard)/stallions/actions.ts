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

/**
 * One-click seeder for Zirconium + sets the active roster.
 *
 * Runs under the authenticated admin session, so it writes to the SAME live
 * Supabase project the public site reads from. Safe to run more than once:
 * the stallion is matched by slug and updated in place, and its pedigree /
 * highlights are replaced rather than duplicated.
 */
export async function importZirconium() {
  await requireAdmin();
  const supabase = await createClient();

  const fullBiography = [
    "Zirconium brings one of European trotting's most influential sire lines to Australian breeders at an accessible service fee. A beautifully bred son of the legendary Ready Cash, he recorded a career-best mile rate of 1:54.2 — making him the fastest son of Ready Cash to stand at stud in Australia.",
    "He combined genuine gait speed with versatility and toughness: able to leave quickly, sustain his speed through a race and still produce a sharp finishing sprint when required. His racing career included victories across varying distances and a 1:56.5 performance over 2000 metres.",
    "After winning four consecutive races, Zirconium attracted the attention of Knutsson Trotting and was purchased to continue his career in the United States under champion trainer Åke Svanstedt. The intention was to campaign him against America's open-class trotters, however an injury ultimately brought his racing career to an early conclusion and saw him retired to stud.",
    "What remained was exactly what breeders look for in a stallion: speed, pedigree, athleticism and versatility — and one of the strongest maternal families in European trotting.",
    "BY THE GREAT READY CASH — Zirconium is a son of one of the most important trotting stallions of the modern era. A dual winner of the Prix d'Amérique, Ready Cash became the sire of an exceptional collection of international champions including Bold Eagle, Face Time Bourbon, Readly Express, Bird Parker, Traders, Django Riff and Brillantissime.",
    "A BLUE-BLOOD MATERNAL FAMILY — Zirconium is from Ok America, a high-class daughter of the influential American sire Andover Hall. Ok America earned more than $350,000 and competed successfully at Group level, winning the Group 3 Gran Premio Città di Napoli and running second in the Group 1 Oaks del Trotto. The depth continues through his second dam, Zagabria Dei, herself a multiple Group winner. His maternal family also features champion mare Lisa America — a Group 1 winner of the Oslo Grand Prix, Åby Stora Pris, Gulddivisionen and Gala Internazionale del Trotto, and crowned European Grand Circuit Champion.",
  ].join("\n\n");

  const matingInformation = [
    "Zirconium's pedigree gives Australian breeders an opportunity to introduce Ready Cash blood without sacrificing the strength of an established North American maternal line. His dam being by Andover Hall creates an especially attractive pedigree profile for the significant population of trotting mares carrying complementary American bloodlines.",
    "CROSSES TO CONSIDER",
    "Muscles Yankee line — The Ready Cash influence on the top line combined with Andover Hall through Zirconium's dam gives breeders the chance to blend two of the world's most recognised modern trotting families. Mares carrying Muscles Yankee-line blood should be among the first considered.",
    "American-bred trotting mares — Zirconium's European speed combined with the strong North American influence through Ok America's family makes him particularly interesting for Australian mares carrying established American trotting pedigrees.",
    "Ready Cash in NSW — A 1:54.2 son of Ready Cash, from a Group-performed maternal family, available to Australian breeders from Medowie Lodge, NSW.",
  ].join("\n\n");

  const record = {
    name: "Zirconium",
    slug: "zirconium",
    country_suffix: null,
    status: "published",
    featured: false,
    display_order: 1,
    gait: "Trotter",
    colour: null,
    sire: "Ready Cash",
    dam: "Ok America",
    damsire: "Andover Hall",
    service_fee: 1100,
    fee_notes: "Payable on 42-day positive pregnancy test. Multi-mare discounts available. Standing at Medowie Lodge, Medowie NSW. Bookings 0451 958 203.",
    includes_gst: true,
    mile_rate: "1:54.2",
    starts: 37,
    wins: 13,
    seconds: 5,
    thirds: 5,
    headline: "The fastest son of Ready Cash to stand at stud in Australia",
    short_description:
      "European speed, world-class blood, Australian opportunity. A 1:54.2 son of the legendary Ready Cash from a blue-blood European maternal family, standing at Medowie Lodge, NSW.",
    full_biography: fullBiography,
    mating_information: matingInformation,
    meta_title: "Zirconium — Ready Cash × Ok America | Medowie Lodge",
    meta_description:
      "Zirconium — a 1:54.2 son of Ready Cash and 13-time race winner from a Group-performed European maternal family. Standing at Medowie Lodge, NSW. Service fee $1,100 inc GST.",
    published_at: new Date().toISOString(),
  };

  // Match by slug so re-running updates in place instead of duplicating.
  const { data: existing } = await supabase.from("stallions").select("id").eq("slug", "zirconium").maybeSingle();

  let zirconiumId: string;
  if (existing) {
    const { error } = await supabase.from("stallions").update(record).eq("id", existing.id);
    if (error) throw error;
    zirconiumId = existing.id;
  } else {
    const { data, error } = await supabase.from("stallions").insert(record).select("id").single();
    if (error) throw error;
    zirconiumId = data.id;
  }

  // Pedigree (upsert one row per stallion).
  await supabase.from("stallion_pedigree").upsert(
    {
      stallion_id: zirconiumId,
      sires_sire: "Indy De Vive",
      sires_dam: "Kidea",
      dams_sire: "Andover Hall",
      dams_dam: "Zagabria Dei",
      extended: { dams_dams_sire: "Victory Dream", dams_dams_dam: "Donnina" },
    },
    { onConflict: "stallion_id" }
  );

  // Career highlights — replace to keep idempotent.
  await supabase.from("stallion_highlights").delete().eq("stallion_id", zirconiumId);
  await supabase.from("stallion_highlights").insert([
    {
      stallion_id: zirconiumId,
      race: "Six-year-old campaign",
      result: "Unbeaten — 4 wins from 4 starts",
      notes: "Culminated an improving profile before his move to North America.",
      display_order: 1,
    },
    {
      stallion_id: zirconiumId,
      race: "Gran Premio Regione Campania",
      grade: "Group 2",
      result: "Third",
      notes: "As a four-year-old, against Europe's open-class trotters.",
      display_order: 2,
    },
    {
      stallion_id: zirconiumId,
      race: "Career best",
      result: "1:54.2 mile rate",
      notes: "The fastest son of Ready Cash to stand at stud in Australia; also recorded 1:56.5 over 2000m.",
      display_order: 3,
    },
  ]);

  // Active roster: only Soho Lanikai, Muscle M Up and Zirconium are published.
  const activeSlugs = ["soho-lanikai", "muscle-m-up", "zirconium"];
  await supabase.from("stallions").update({ status: "draft" }).not("slug", "in", `(${activeSlugs.join(",")})`);
  await supabase.from("stallions").update({ status: "published" }).in("slug", ["soho-lanikai", "muscle-m-up"]);

  revalidatePath("/admin/stallions");
  revalidatePath("/stallions");
  revalidatePath("/");
  redirect(`/admin/stallions/${zirconiumId}`);
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
      dam: str(formData, "dam"),
      damsire: str(formData, "damsire"),
      earnings: num(formData, "earnings"),
      mile_rate: str(formData, "mile_rate"),
      wins: int(formData, "wins"),
      notes: str(formData, "notes"),
      image_url: str(formData, "image_url"),
      profile_url: str(formData, "profile_url"),
      featured: formData.get("featured") === "on",
    });
  }
  revalidatePath(`/admin/stallions/${stallionId}`);
  revalidatePath("/admin/progeny");
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
