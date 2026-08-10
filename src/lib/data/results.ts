import { createClient } from "@/lib/supabase/server";
import type { Result } from "@/lib/supabase/types";

export async function getLatestResults(limit = 5): Promise<Result[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("results")
    .select("*")
    .eq("status", "published")
    .order("date", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data ?? [];
}

export async function getAllResults(): Promise<Result[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("results")
    .select("*")
    .eq("status", "published")
    .order("date", { ascending: false });

  if (error) throw error;
  return data ?? [];
}
