import { createClient } from "@/lib/supabase/server";
import type { SiteContentBlock, SiteSettings } from "@/lib/supabase/types";

export async function getSiteSettings(): Promise<SiteSettings> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("site_settings").select("*").single();
  if (error) throw error;
  return data;
}

export async function getContentBlock(key: string): Promise<SiteContentBlock | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("site_content_blocks")
    .select("*")
    .eq("key", key)
    .eq("status", "published")
    .maybeSingle();

  if (error) return null;
  return data;
}

export async function getContentBlocks(keys: string[]): Promise<Record<string, SiteContentBlock>> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("site_content_blocks")
    .select("*")
    .in("key", keys)
    .eq("status", "published");

  if (error) return {};
  const map: Record<string, SiteContentBlock> = {};
  for (const block of data ?? []) map[block.key] = block;
  return map;
}
