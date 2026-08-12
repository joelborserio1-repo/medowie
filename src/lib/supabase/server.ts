import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getSupabaseConfig } from "./config";

/**
 * Supabase client for use in Server Components, Server Actions and Route
 * Handlers. Reads the user's session from cookies so RLS (is_admin(), etc.)
 * evaluates against the signed-in user.
 *
 * URL + key come from the single source of truth in `config.ts` so server-side
 * access can never drift onto a different Supabase project than the browser.
 */
export async function createClient() {
  const cookieStore = await cookies();
  const { url, anonKey } = getSupabaseConfig();

  return createServerClient(
    url,
    anonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Called from a Server Component that can't set cookies — the
            // middleware refreshes the session on the next request instead.
          }
        },
      },
    }
  );
}
