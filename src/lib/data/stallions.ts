import { createClient } from "@/lib/supabase/server";
import type {
  Stallion,
  StallionDocument,
  StallionEligibility,
  StallionGalleryImage,
  StallionHighlight,
  StallionPedigree,
  StallionProgeny,
  StallionVideo,
} from "@/lib/supabase/types";

export async function getPublishedStallions(): Promise<Stallion[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("stallions")
    .select("*")
    .eq("status", "published")
    .order("display_order", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function getArchivedStallions(): Promise<Stallion[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("stallions")
    .select("*")
    .eq("status", "archived")
    .order("display_order", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function getFeaturedStallion(): Promise<Stallion | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("stallions")
    .select("*")
    .eq("status", "published")
    .eq("featured", true)
    .order("display_order", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function getStallionBySlug(slug: string): Promise<Stallion | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("stallions").select("*").eq("slug", slug).maybeSingle();

  if (error) throw error;
  return data;
}

export interface StallionDetail {
  stallion: Stallion;
  highlights: StallionHighlight[];
  eligibility: StallionEligibility[];
  gallery: StallionGalleryImage[];
  videos: StallionVideo[];
  documents: StallionDocument[];
  progeny: StallionProgeny[];
  pedigree: StallionPedigree | null;
}

export async function getStallionDetail(slug: string): Promise<StallionDetail | null> {
  const supabase = await createClient();
  const stallion = await getStallionBySlug(slug);
  if (!stallion) return null;

  const [highlights, eligibility, gallery, videos, documents, progeny, pedigree] = await Promise.all([
    supabase
      .from("stallion_highlights")
      .select("*")
      .eq("stallion_id", stallion.id)
      .order("display_order"),
    supabase
      .from("stallion_eligibility")
      .select("*")
      .eq("stallion_id", stallion.id)
      .order("display_order"),
    supabase.from("stallion_gallery").select("*").eq("stallion_id", stallion.id).order("display_order"),
    supabase.from("stallion_videos").select("*").eq("stallion_id", stallion.id).order("display_order"),
    supabase.from("stallion_documents").select("*").eq("stallion_id", stallion.id).order("display_order"),
    supabase
      .from("stallion_progeny")
      .select("*")
      .eq("stallion_id", stallion.id)
      .order("display_order"),
    supabase.from("stallion_pedigree").select("*").eq("stallion_id", stallion.id).maybeSingle(),
  ]);

  return {
    stallion,
    highlights: highlights.data ?? [],
    eligibility: eligibility.data ?? [],
    gallery: gallery.data ?? [],
    videos: videos.data ?? [],
    documents: documents.data ?? [],
    progeny: progeny.data ?? [],
    pedigree: pedigree.data ?? null,
  };
}

export async function getStallionNavItems(): Promise<Pick<Stallion, "name" | "slug" | "country_suffix">[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("stallions")
    .select("name, slug, country_suffix")
    .eq("status", "published")
    .order("display_order", { ascending: true });

  if (error) return [];
  return data ?? [];
}
