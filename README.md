# Medowie Lodge

Website and CMS for Medowie Lodge, a Standardbred stud and harness racing stable at Medowie, NSW,
operated by Darren Reay and family.

Two apps in this repo:

- **`/`** — the public Next.js site (App Router, TypeScript, Tailwind CSS), deployed to **Cloudflare
  Workers**.
- **`/cms`** — a **Strapi** headless CMS (TypeScript) that is the single source of content: stallions,
  horses for sale, news, results, forms & contracts, enquiries, page copy and site settings. Deployed to
  **Railway** (or any Docker host — see `cms/Dockerfile`).

Content editors work entirely in Strapi's own admin panel (`/admin` on the CMS's URL) — there is no
custom admin UI in the Next.js app.

## Stack

- **Next.js 16** (App Router, Server Components) → Cloudflare Workers via the
  [OpenNext Cloudflare adapter](https://opennext.js.org/cloudflare)
- **TypeScript**, **Tailwind CSS v4**
- **Strapi 5** (TypeScript) → Railway, Postgres, Cloudflare R2 for media
- **React Hook Form + Zod** — public-facing form validation
- **Resend** — transactional email (optional; enquiries still save without it)

## Project structure

```
src/
  app/
    (public)/        Public site — homepage, stallions, training, contact, etc.
    api/enquiries/     Enquiry form submission endpoint (proxies to Strapi + sends email)
    sitemap.ts, robots.ts
  components/
    site/              Header, footer, homepage sections
    stallions/          Stallion catalogue components
    forms/               Public enquiry forms (React Hook Form)
    ui/                   Shared primitives (Button, Container, BrandImage…)
  lib/
    data/                Server-side Strapi data-access functions
    cms/                  Strapi REST client, media URL helper, TypeScript types
    validation/           Zod schemas for enquiry forms
    email/                 Resend integration
    format.ts, fonts.ts
wrangler.jsonc          Cloudflare Worker config (frontend)
open-next.config.ts     OpenNext Cloudflare adapter config

cms/                    Strapi CMS — a separate app, own package.json
  src/api/                Content types: stallion, horse-for-sale, result, news-article,
                           form-document, enquiry, enquiry-note, plus single types
                           (site-setting, homepage, about-page, training-page,
                           yearling-preparation-page)
  src/components/         Reusable field groups (stallion highlights, progeny, pedigree…)
  src/bootstrap/          First-boot setup: public API permissions, first admin user,
                           verified-content seed (see docs/CONTENT_MIGRATION.md)
  Dockerfile, railway.json

docs/
  DEPLOYMENT.md          Cloudflare (frontend) + Railway (CMS) deploy steps
  STRAPI_SETUP.md        Local Strapi setup, content types, permissions
  ENVIRONMENT_VARIABLES.md
  CONTENT_MIGRATION.md
  ADMIN_GUIDE.md         Using the Strapi admin panel
```

## Getting started

### CMS (Strapi)

```bash
cd cms
npm install
cp .env.example .env   # then fill in APP_KEYS etc. — see docs/STRAPI_SETUP.md
npm run develop
```

Open [http://localhost:1337/admin](http://localhost:1337/admin) to create your first admin account (or
set `STRAPI_ADMIN_EMAIL`/`STRAPI_ADMIN_PASSWORD` in `cms/.env` to have one created automatically on
first boot — local/dev convenience only, never set those in production).

### Frontend (Next.js)

```bash
npm install
cp .env.local.example .env.local   # point STRAPI_URL at the CMS above
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Content status

Nothing on the public site should be treated as current until confirmed by Medowie Lodge staff in the
Strapi admin. See [`docs/CONTENT_MIGRATION.md`](docs/CONTENT_MIGRATION.md) for exactly what's verified
vs. what's an empty field waiting to be filled in — this rebuild could not crawl or download assets from
the live medowielodge.com.au site or third-party sources, so only independently verified content is
seeded.

## Scripts

Frontend (repo root):
- `npm run dev` — dev server
- `npm run build` — production build (Node target, useful for typechecking/CI)
- `npm run cf:build` / `npm run cf:preview` / `npm run cf:deploy` — Cloudflare Workers build/preview/deploy
- `npm run lint` — ESLint

CMS (`cms/`):
- `npm run develop` — dev server with auto-reload
- `npm run build` — build the admin panel
- `npm run start` — production server
