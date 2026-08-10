# Environment Variables

Create a `.env.local` file in the project root (never committed — see `.gitignore`) with:

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL (Project Settings → API). |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anon/public API key. Safe to expose to the browser — RLS enforces access. |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Supabase service-role key. **Server-only** — never referenced from a Client Component. Used only in `src/lib/supabase/admin.ts` for narrow server operations. |
| `NEXT_PUBLIC_SITE_URL` | Yes | Canonical site URL, e.g. `https://www.medowielodge.com.au`. Used for metadata, OpenGraph, sitemap and robots.txt. |
| `RESEND_API_KEY` | No | Enables transactional email via [Resend](https://resend.com). Without it, enquiries still save to Supabase — email sending is skipped silently. |
| `RESEND_FROM_EMAIL` | No | Sender address for enquiry emails, e.g. `Medowie Lodge <enquiries@medowielodge.com.au>`. Requires a verified domain in Resend. |

## Example `.env.local`

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Optional
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL="Medowie Lodge <enquiries@medowielodge.com.au>"
```

## On Vercel

Add the same variables under **Project Settings → Environment Variables**. Set
`NEXT_PUBLIC_SITE_URL` to the production domain once it's live so metadata, the sitemap and
OpenGraph tags resolve to real URLs rather than `localhost`.

The **enquiry notification recipient email** is not an environment variable — it's stored in
`site_settings.enquiry_recipient_email` and editable from **Admin → Settings**, since it's the kind of
thing Medowie Lodge should be able to change without a redeploy.
