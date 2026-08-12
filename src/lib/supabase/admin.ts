import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { getSupabaseConfig } from "./config";

/**
 * Service-role Supabase client. Bypasses RLS entirely — never import this
 * from a Client Component and never expose SUPABASE_SERVICE_ROLE_KEY to the
 * browser. Reserved for narrow server-only operations where the authenticated
 * is_admin() RLS path isn't applicable.
 *
 * IMPORTANT: this MUST use the same project as the rest of the app (the one
 * NEXT_PUBLIC_SUPABASE_URL points at). Historically the service-role key in
 * this environment belonged to a DIFFERENT, empty Supabase project, which would
 * make every service-role call fail with "Invalid API key" or, worse, write to
 * the wrong database. We validate the key's project ref (when decodable) and
 * refuse to run on a mismatch rather than fail silently.
 */
export function createAdminClient() {
  const { url, ref } = getSupabaseConfig();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceRoleKey) {
    throw new Error(
      "[supabase] createAdminClient() requires SUPABASE_SERVICE_ROLE_KEY for the same project as " +
        `NEXT_PUBLIC_SUPABASE_URL (project "${ref}").`
    );
  }

  // Legacy service-role keys are JWTs that embed the project ref. If we can
  // decode it and it doesn't match the canonical project, refuse loudly.
  const keyRef = serviceRoleRefFromJwt(serviceRoleKey);
  if (keyRef && keyRef !== ref) {
    throw new Error(
      `[supabase] SUPABASE_SERVICE_ROLE_KEY belongs to project "${keyRef}" but the app uses "${ref}". ` +
        "Set the service-role key for the SAME project as NEXT_PUBLIC_SUPABASE_URL."
    );
  }

  return createSupabaseClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

/** Decode the `ref` claim from a legacy JWT service-role key, if present. */
function serviceRoleRefFromJwt(key: string): string | null {
  const parts = key.split(".");
  if (parts.length !== 3) return null; // not a JWT (e.g. new sb_secret_ format)
  try {
    const payload = JSON.parse(Buffer.from(parts[1], "base64").toString("utf8"));
    return typeof payload.ref === "string" ? payload.ref : null;
  } catch {
    return null;
  }
}
