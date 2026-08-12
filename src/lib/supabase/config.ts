/**
 * Single source of truth for which Supabase project the app talks to.
 *
 * WHY THIS EXISTS
 * ---------------
 * This project has (historically) had TWO different Supabase projects wired
 * into its environment variables at once:
 *
 *   - The public keys (NEXT_PUBLIC_SUPABASE_URL / …_ANON_KEY / …_PUBLISHABLE_KEY)
 *     point at the project that actually holds the site's data.
 *   - Some server-only vars (SUPABASE_URL, POSTGRES_*) have pointed at a
 *     DIFFERENT, empty project.
 *
 * Reading from one project while writing to another is the classic "it works
 * on read but nothing saves" foot-gun. To make it impossible to do by accident,
 * EVERY Supabase client in this app resolves its URL + key from here, and here
 * we fail fast (or loudly warn) when the environment is inconsistent.
 *
 * THE RULE: the canonical project is whatever NEXT_PUBLIC_SUPABASE_URL points
 * at. All reads and all writes use that one project. Full stop.
 */

/** Extract the project ref (the subdomain) from a Supabase URL. */
export function projectRefFromUrl(url: string | undefined | null): string | null {
  if (!url) return null;
  try {
    const host = new URL(url).host; // e.g. abcd1234.supabase.co
    const ref = host.split(".")[0];
    return ref || null;
  } catch {
    return null;
  }
}

type ResolvedConfig = { url: string; anonKey: string; ref: string };

let cached: ResolvedConfig | null = null;
let warned = false;

/**
 * Resolve the canonical Supabase URL + public key used for all client and
 * session-based server access. Throws if the required public vars are missing,
 * and warns (server-side) if a stray server var points at a different project.
 */
export function getSupabaseConfig(): ResolvedConfig {
  if (cached) return cached;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "[supabase] Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. " +
        "The app cannot connect to its database without these."
    );
  }

  const ref = projectRefFromUrl(url);
  if (!ref) {
    throw new Error(`[supabase] NEXT_PUBLIC_SUPABASE_URL is not a valid URL: ${url}`);
  }

  // Detect the two-project mismatch. `SUPABASE_URL` is server-only; if it is
  // present and points somewhere else, that is the misconfiguration we never
  // want to silently honor. We deliberately DO NOT throw: the app only ever
  // uses NEXT_PUBLIC_SUPABASE_URL, so it keeps working on the correct project.
  // Throwing here would take down the site over stray-but-unused variables.
  // Instead we log a loud, one-time server-side error so the misconfig is
  // impossible to miss in the logs and can be cleaned up.
  const serverUrlRef = projectRefFromUrl(process.env.SUPABASE_URL);
  if (serverUrlRef && serverUrlRef !== ref && !warned && typeof window === "undefined") {
    warned = true;
    console.error(
      `[supabase] ENV MISMATCH: NEXT_PUBLIC_SUPABASE_URL points at project "${ref}" ` +
        `but SUPABASE_URL points at "${serverUrlRef}". The app uses "${ref}" for everything. ` +
        `Remove or repoint the stray server variables (SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, POSTGRES_*) ` +
        `so the whole project uses a single Supabase project.`
    );
  }

  cached = { url, anonKey, ref };
  return cached;
}
