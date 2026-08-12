import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseConfig } from "./config";

/**
 * Supabase client for Client Components (admin forms with live interaction,
 * media manager, etc.). Uses the public anon key — RLS enforces access.
 *
 * URL + key come from the single source of truth in `config.ts` so this can
 * never drift onto a different Supabase project than the rest of the app.
 */
export function createClient() {
  const { url, anonKey } = getSupabaseConfig();
  return createBrowserClient(url, anonKey);
}
