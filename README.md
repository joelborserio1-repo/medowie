# Medowie Lodge

Website and CMS for Medowie Lodge, a Standardbred stud and harness racing stable at Medowie, NSW,
operated by Darren Reay and family.

One app: the public Next.js site (App Router, TypeScript, Tailwind CSS) deployed to **Cloudflare
Workers**, backed by a **Supabase** Postgres database for content, auth and file storage. Content
editors work at `/admin` inside this same app — there is no separate CMS to run or deploy.

## Stack

- **Next.js 16** (App Router, Server Components) → Cloudflare Workers via the
  [OpenNext Cloudflare adapter](https://opennext.js.org/cloudflare)
- **TypeScript**, **Tailwind CSS v4**
- **Supabase** — Postgres, Row Level Security, Auth (admin sign-in), Storage (photos/videos/PDFs)
- **React Hook Form + Zod** — public-facing form validation
- **Resend** — transactional email (optional; enquiries still save without it)

## Project structure

```
src/
  app/
    (public)/        Public site — homepage, stallions, training, contact, etc.
    admin/            Admin panel — auth-gated, Server Actions for every write
    api/enquiries/     Enquiry form submission endpoint (saves to Supabase + sends email)
    sitemap.ts, robots.ts
  components/
    site/              Header, footer, homepage sections
    stallions/          Stallion catalogue components (incl. the photo/video carousel)
    admin/               Admin form fields, uploaders, stallion/news/etc. forms
    forms/               Public enquiry forms (React Hook Form)
    ui/                   Shared primitives (Button, Container, BrandImage…)
  lib/
    data/                Server-side Supabase data-access functions
    supabase/             Server/browser/admin Supabase clients, TypeScript types
    validation/           Zod schemas for enquiry forms
    email/                 Resend integration
    format.ts, fonts.ts
  proxy.ts              Middleware — gates /admin behind a signed-in session

supabase/
  migrations/            SQL migrations, run in order (see docs/SUPABASE_SETUP.md)
  seed-assets/            Real photos referenced by the seed migrations

scripts/
  upload-seed-assets.mjs  One-time script: uploads supabase/seed-assets/ to Storage

wrangler.jsonc          Cloudflare Worker config
open-next.config.ts     OpenNext Cloudflare adapter config

docs/
  DEPLOYMENT.md          Cloudflare + Supabase deploy steps
  SUPABASE_SETUP.md       Creating the project, running migrations, RLS summary
  ENVIRONMENT_VARIABLES.md
  CONTENT_MIGRATION.md    What's verified vs. still needs staff review
  ADMIN_GUIDE.md          Using the /admin panel
```

## Getting started

```bash
npm install
cp .env.local.example .env.local   # point at your Supabase project — see docs/SUPABASE_SETUP.md
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), and [http://localhost:3000/admin](http://localhost:3000/admin)
for the admin panel once you've created an account (see [`docs/SUPABASE_SETUP.md`](docs/SUPABASE_SETUP.md)).

## Content status

Nothing on the public site should be treated as current until confirmed by Medowie Lodge staff in
`/admin`. See [`docs/CONTENT_MIGRATION.md`](docs/CONTENT_MIGRATION.md) for exactly what's verified vs.
what's an empty field waiting to be filled in — only independently verified content is seeded, never a
guess.

## Scripts

- `npm run dev` — dev server
- `npm run build` — production build (Node target, useful for typechecking/CI)
- `npm run cf:build` / `npm run cf:preview` / `npm run cf:deploy` — Cloudflare Workers build/preview/deploy
- `npm run lint` — ESLint
- `node scripts/upload-seed-assets.mjs` — upload the real seed photos to Supabase Storage (needs
  `SUPABASE_SERVICE_ROLE_KEY`)
