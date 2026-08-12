import { createClient } from "@/lib/supabase/server";
import type { NewsArticle } from "@/lib/supabase/types";

export async function getLatestNews(limit = 3): Promise<NewsArticle[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("news")
    .select("*")
    .eq("status", "published")
    .order("published_date", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data ?? [];
}

export async function getAllNews(): Promise<NewsArticle[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("news")
    .select("*")
    .eq("status", "published")
    .order("published_date", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function getNewsBySlug(slug: string): Promise<NewsArticle | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("news").select("*").eq("slug", slug).maybeSingle();
  if (error) throw error;
  return data;
}
