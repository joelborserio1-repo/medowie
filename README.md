# Medowie Lodge

Website and CMS for Medowie Lodge, a Standardbred stud and harness racing stable at Medowie, NSW,
operated by Darren Reay and family.

Rebuilt on Next.js (App Router) + TypeScript + Tailwind CSS + Supabase.

## Stack

- **Next.js 16** (App Router, Server Components, Server Actions)
- **TypeScript**
- **Tailwind CSS v4**
- **Supabase** — Postgres database, Auth, Storage
- **React Hook Form + Zod** — public-facing form validation
- **Resend** — transactional email (optional; enquiries still save without it)

## Project structure

```
src/
  app/
    (public)/        Public site — homepage, stallions, training, contact, etc.
    admin/            /admin CMS — login + protected dashboard
    api/enquiries/     Enquiry form submission endpoint
    sitemap.ts, robots.ts
  components/
    site/              Header, footer, homepage sections
    stallions/          Stallion catalogue components
    forms/               Public enquiry forms (React Hook Form)
    admin/               Admin CMS forms and controls
    ui/                   Shared primitives (Button, Container, BrandImage…)
  lib/
    data/                Server-side Supabase data-access functions
    supabase/             Supabase client helpers (server, browser, admin, types)
    validation/           Zod schemas for enquiry forms
    email/                 Resend integration
    auth.ts, format.ts, fonts.ts
  proxy.ts              Auth gate for /admin routes (Next.js "proxy", formerly middleware)
supabase/
  migrations/            SQL schema, RLS policies, verified content seed
docs/
  SUPABASE_SETUP.md
  ENVIRONMENT_VARIABLES.md
  CONTENT_MIGRATION.md
  ADMIN_GUIDE.md
```

## Getting started

1. Create a Supabase project and run the migrations — see [`docs/SUPABASE_SETUP.md`](docs/SUPABASE_SETUP.md).
2. Copy environment variables — see [`docs/ENVIRONMENT_VARIABLES.md`](docs/ENVIRONMENT_VARIABLES.md).
3. Install dependencies and run the dev server:

   ```bash
   npm install
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) for the public site, and
   [http://localhost:3000/admin/login](http://localhost:3000/admin/login) for the CMS.

## Content status

This rebuild could not crawl or download assets from the live medowielodge.com.au site or third-party
sources at build time (see [`docs/CONTENT_MIGRATION.md`](docs/CONTENT_MIGRATION.md) for the full account).
Only content that could be independently verified — mainly from screenshots supplied directly during the
build — has been seeded into the database. Everywhere else (stallion fees, full biographies, statistics,
pedigrees, most photography) ships as an empty or `admin_review` CMS field rather than invented copy.
Nothing on the public site should be treated as current until confirmed by Medowie Lodge staff in `/admin`.

## Scripts

- `npm run dev` — start the dev server
- `npm run build` — production build
- `npm run lint` — ESLint
