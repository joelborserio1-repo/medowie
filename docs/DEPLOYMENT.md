# Deployment

Two separate deploys: the Strapi CMS to Railway, then the Next.js frontend to Cloudflare Workers
pointed at it. Deploy the CMS first — the frontend build needs a reachable `STRAPI_URL` to fetch content
at build time.

## 1. Strapi CMS → Railway

1. Create a new Railway project, add a service from this repo, and set its **Root Directory** to `cms/`.
2. Railway will detect `cms/Dockerfile` (via `cms/railway.json`) and build with it. No extra build
   command needed.
3. Add a **Postgres** plugin to the project and attach it to the CMS service — Railway injects
   `DATABASE_URL` automatically. Set `DATABASE_CLIENT=postgres`, `DATABASE_SSL=true`, and
   `DATABASE_SSL_REJECT_UNAUTHORIZED=false` on the service.
4. Set the Strapi secrets (`APP_KEYS`, `API_TOKEN_SALT`, `ADMIN_JWT_SECRET`, `TRANSFER_TOKEN_SALT`,
   `JWT_SECRET`, `ENCRYPTION_KEY`) — generate real values, see [`STRAPI_SETUP.md`](./STRAPI_SETUP.md).
   **Do not** set `STRAPI_ADMIN_EMAIL`/`STRAPI_ADMIN_PASSWORD` here — create the production admin by
   hand once the service is up (Strapi will prompt at `/admin` on first visit).
5. Set up Cloudflare R2 for media (recommended — Railway's filesystem doesn't persist uploads across
   redeploys):
   - Create an R2 bucket in the Cloudflare dashboard (e.g. `medowie-lodge-media`).
   - Create an R2 API token (Account API token, with R2 read/write) for `R2_ACCESS_KEY_ID` /
     `R2_SECRET_ACCESS_KEY`.
   - Either enable the bucket's public `r2.dev` URL or map a custom domain (e.g.
     `media.medowielodge.com.au`) to it, and set that as `R2_PUBLIC_URL`.
   - Set `R2_ACCOUNT_ID` and `R2_BUCKET` too.
6. Deploy. Once it's up, visit `https://<your-railway-url>/admin` and create the first admin account.
7. (Optional) Map a custom domain to the Railway service — e.g. `cms.medowielodge.com.au` — via
   Railway's domain settings, with a CNAME added in Cloudflare DNS.

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

- `NEXT_PUBLIC_STRAPI_URL` — the CMS's public URL, e.g. `https://cms.medowielodge.com.au`
- `NEXT_PUBLIC_SITE_URL` — this site's own URL, e.g. `https://www.medowielodge.com.au`

Runtime secrets (set with `wrangler secret put <NAME>`, not in `wrangler.jsonc`):

```bash
npx wrangler secret put STRAPI_URL              # same value as NEXT_PUBLIC_STRAPI_URL
npx wrangler secret put STRAPI_API_TOKEN        # optional
npx wrangler secret put RESEND_API_KEY          # optional
npx wrangler secret put RESEND_FROM_EMAIL       # optional
```

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

- **Root directory**: `/` (the Next.js app lives at the repo root; `cms/` is the separate Strapi app —
  don't point Railway-style builds at this repo's root).
- **Build command**: `npm run cf:build`
- Cloudflare's Workers Builds pipeline runs `wrangler deploy` automatically afterwards using
  `wrangler.jsonc`.
- Set the environment variables above in the dashboard's build/runtime environment settings.

### Custom domain

Add the Worker's route in the Cloudflare dashboard (Workers & Pages → your Worker → Triggers → Custom
Domains), e.g. `www.medowielodge.com.au`. Update `NEXT_PUBLIC_SITE_URL` and `wrangler.jsonc`'s
`vars.NEXT_PUBLIC_SITE_URL` to match.

## 3. After both are deployed

1. Confirm the frontend can reach the CMS: visit the homepage and check the "Current Stallions" section
   isn't stuck on the empty-state message (it will be, correctly, until staff publish a stallion).
2. Log into Strapi admin, review the seeded content described in
   [`CONTENT_MIGRATION.md`](./CONTENT_MIGRATION.md), and start publishing real content — see
   [`ADMIN_GUIDE.md`](./ADMIN_GUIDE.md).
3. Submit a test enquiry through the live site and confirm it appears in Strapi admin under Content
   Manager → Enquiry.
