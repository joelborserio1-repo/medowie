import { createClient } from "@/lib/supabase/server";
import type { HorseForSale, HorseGalleryImage } from "@/lib/supabase/types";

export async function getAvailableHorses(limit?: number): Promise<HorseForSale[]> {
  const supabase = await createClient();
  let query = supabase
    .from("horses_for_sale")
    .select("*")
    .in("status", ["available", "under_offer", "upcoming"])
    .order("display_order", { ascending: true });

  if (limit) query = query.limit(limit);

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function getArchivedHorses(): Promise<HorseForSale[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("horses_for_sale")
    .select("*")
    .in("status", ["sold", "archive"])
    .order("sale_date", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function getHorseBySlug(
  slug: string
): Promise<{ horse: HorseForSale; gallery: HorseGalleryImage[] } | null> {
  const supabase = await createClient();
  const { data: horse, error } = await supabase
    .from("horses_for_sale")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw error;
  if (!horse) return null;

  const { data: gallery } = await supabase
    .from("horse_gallery")
    .select("*")
    .eq("horse_id", horse.id)
    .order("display_order");

  return { horse, gallery: gallery ?? [] };
}
