# Deployment

One deploy: the Next.js frontend to Cloudflare Workers, talking directly to a Supabase project (no
separate CMS service to stand up or keep alive).

## 1. Supabase project

Set this up first — see [`SUPABASE_SETUP.md`](./SUPABASE_SETUP.md) for the full walkthrough (create the
project, run the SQL migrations in order, upload the seed photos, create the first admin account).

## 2. Next.js frontend → Cloudflare Workers

The frontend uses the [OpenNext Cloudflare adapter](https://opennext.js.org/cloudflare) — Next.js runs
as a real Worker (SSR, dynamic routes, image optimization), not a static export.

### One-time setup

```bash
npx wrangler login
npx wrangler r2 bucket create medowie-lodge-opennext-cache   # ISR/data cache bucket
```

### Environment variables

Build-time (`NEXT_PUBLIC_*` vars get inlined into the client bundle by `next build`, so these must be
present wherever the build runs — locally, in CI, or in Cloudflare's Workers Builds):

- `NEXT_PUBLIC_SUPABASE_URL` — your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — the project's public anon key
- `NEXT_PUBLIC_SITE_URL` — this site's own URL, e.g. `https://www.medowielodge.com.au`

Runtime secrets (set with `wrangler secret put <NAME>`, not in `wrangler.jsonc`):

```bash
npx wrangler secret put SUPABASE_SERVICE_ROLE_KEY   # only if a server-only route needs it (e.g. scripts run outside the Worker)
npx wrangler secret put RESEND_API_KEY              # optional
npx wrangler secret put RESEND_FROM_EMAIL           # optional
```

The Supabase anon key is safe in the client bundle by design — Row Level Security is what actually
restricts what it can read and write (see [`SUPABASE_SETUP.md`](./SUPABASE_SETUP.md#5-row-level-security-summary)).

### Deploy

```bash
npm run cf:build      # next build + OpenNext Cloudflare transform
npm run cf:deploy      # build + wrangler deploy
# or, if you only need to redeploy an existing build:
npx wrangler deploy
```

`wrangler.jsonc` already declares the Worker name, the R2 incremental-cache binding, and a self-reference
service binding (required by OpenNext for internal revalidation requests). Update
`compatibility_date` occasionally per Cloudflare's guidance, and change `vars.NEXT_PUBLIC_SITE_URL` to
the real production domain once you have one.

### Using the Cloudflare dashboard (Workers Builds) instead of the CLI

If deploying via a git-connected Worker in the Cloudflare dashboard rather than local `wrangler`:

- **Root directory**: `/`
- **Build command**: `npm run cf:build`
- Cloudflare's Workers Builds pipeline runs `wrangler deploy` automatically afterwards using
  `wrangler.jsonc`.
- Set the environment variables above in the dashboard's build/runtime environment settings — **the
  `NEXT_PUBLIC_*` ones must be set as *Build* variables specifically, not just *Runtime* variables**.
  Next.js inlines `NEXT_PUBLIC_*` values as literal strings into the compiled bundle during `next build`
  (including the middleware bundle) — it does not read them from `process.env` at request time. Workers
  Builds' dashboard has separate "Build" and "Runtime" sections under Settings → Variables and Secrets;
  a value only present under Runtime never reaches the build step, so the compiled middleware ends up
  calling `createServerClient(undefined, undefined, ...)`, which throws synchronously and crashes the
  whole Worker with a raw "Internal Server Error" for every route the middleware matches (`/admin/*`).
  After adding/fixing Build variables, trigger a fresh build (not just a redeploy of the existing build
  output) so `next build` re-runs with them present.

### Custom domain

Add the Worker's route in the Cloudflare dashboard (Workers & Pages → your Worker → Triggers → Custom
Domains), e.g. `www.medowielodge.com.au`. Update `NEXT_PUBLIC_SITE_URL` and `wrangler.jsonc`'s
`vars.NEXT_PUBLIC_SITE_URL` to match.

## 3. After deploying

1. Confirm the frontend can reach Supabase: visit the homepage and check the "Current Stallions"
   section isn't stuck on the empty-state message (it will be, correctly, until staff publish a
   stallion).
2. Sign in at `/admin`, review the seeded content described in
   [`CONTENT_MIGRATION.md`](./CONTENT_MIGRATION.md), and start publishing real content — see
   [`ADMIN_GUIDE.md`](./ADMIN_GUIDE.md).
3. Submit a test enquiry through the live site and confirm it appears under **Admin → Enquiries**.
