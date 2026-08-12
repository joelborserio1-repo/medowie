import { createBrowserClient } from "@supabase/ssr";

/**
 * Supabase client for Client Components (admin forms with live interaction,
 * media manager, etc.). Uses the public anon key — RLS enforces access.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
