# Environment Variables

One app, one environment file. Copy `.env.local.example` to `.env.local` and fill in:

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Your Supabase project URL. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | The project's public anon key. Safe to expose to the client — Row Level Security (see `supabase/migrations/0002_rls.sql`) is what actually restricts what it can read and write. |
| `SUPABASE_SERVICE_ROLE_KEY` | Scripts only | Bypasses RLS entirely. Only used by `scripts/upload-seed-assets.mjs` and `src/lib/supabase/admin.ts`. Never expose this to the client or commit a real value. |
| `NEXT_PUBLIC_SITE_URL` | Yes | Canonical site URL, e.g. `https://www.medowielodge.com.au`. Used for metadata, OpenGraph, sitemap and robots.txt. |
| `RESEND_API_KEY` | No | Enables transactional email via [Resend](https://resend.com). Without it, enquiries still save to Supabase — email sending is skipped silently. |
| `RESEND_FROM_EMAIL` | No | Sender address for enquiry emails. Requires a verified domain in Resend. |

On Cloudflare, `NEXT_PUBLIC_*` variables must be set **at build time** (they get inlined into the client
bundle by `next build`), not just as a Worker runtime var — see [`DEPLOYMENT.md`](./DEPLOYMENT.md).

### Where the enquiry notification email address lives

Unlike most of the settings above, the **enquiry notification recipient** isn't an environment
variable — it's the `enquiry_recipient_email` field on the `site_settings` table, editable by admins at
`/admin/settings` without a redeploy.

### Admin accounts

There's no environment variable for admin credentials — accounts are created directly in the Supabase
dashboard (**Authentication → Users**) and then added to the `admin_users` table. See
[`SUPABASE_SETUP.md`](./SUPABASE_SETUP.md#3-create-an-admin-account).
