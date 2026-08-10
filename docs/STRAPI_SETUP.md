# Strapi Setup

## 1. Local development

```bash
cd cms
npm install
cp .env.example .env
```

Generate real secrets rather than using the placeholder values:

```bash
for i in 1 2; do openssl rand -base64 32; done   # APP_KEYS (comma-separate the two)
openssl rand -base64 32                          # API_TOKEN_SALT
openssl rand -base64 32                          # ADMIN_JWT_SECRET
openssl rand -base64 32                          # TRANSFER_TOKEN_SALT
openssl rand -base64 32                          # JWT_SECRET
openssl rand -base64 32                          # ENCRYPTION_KEY
```

Leave `DATABASE_CLIENT=sqlite` for local dev — no separate database server needed.

```bash
npm run develop
```

Open [http://localhost:1337/admin](http://localhost:1337/admin) and complete the "create your first
administrator" form. (Alternatively, set `STRAPI_ADMIN_EMAIL` / `STRAPI_ADMIN_PASSWORD` in `.env` before
first boot and one is created automatically — convenient for local dev, but never do this in production.)

## 2. What happens on first boot

`cms/src/index.ts` runs three bootstrap steps (`cms/src/bootstrap/`) every time Strapi starts, each
idempotent (safe to run on every restart):

1. **`set-public-permissions.ts`** — grants the "Public" role `find`/`findOne` on published content
   (stallions, horses for sale, results, news, form documents, site settings, and the page-content
   single types) and `create`-only on enquiries. Without this, the public API returns `403 Forbidden`
   for everything.
2. **`create-first-admin.ts`** — creates an admin user from `STRAPI_ADMIN_EMAIL` /
   `STRAPI_ADMIN_PASSWORD` if set and no admin exists yet. No-op once an admin exists.
3. **`seed-content.ts`** — seeds only independently verified content (see
   [`CONTENT_MIGRATION.md`](./CONTENT_MIGRATION.md)). No-op once that content already exists, so it
   won't overwrite anything staff have since edited.

## 3. Content types

| Type | Kind | Notes |
|---|---|---|
| `stallion` | Collection | Components: `highlights`, `eligibility`, `progeny` (repeatable), `pedigree` (single), `videos` (repeatable). Media: `heroImage`, `profileImage`, `cardImage`, `gallery`, `documents`, `matingPdf`, `pedigreeDocument`. |
| `horse-for-sale` | Collection | Also used for the yearling-sale history/archive — filter by `saleType` and `state`. |
| `result` | Collection | Race results for the homepage/results page track record. |
| `news-article` | Collection | Optional relations to a stallion and/or horse listing. |
| `form-document` | Collection | Forms & contracts. `active` toggles visibility without deleting. |
| `enquiry` | Collection | Every public form lands here. Public role: `create` only. |
| `enquiry-note` | Collection | Internal, timestamped staff notes on an enquiry. |
| `site-setting` | Single | Business details, contact info, SEO defaults, collection info. |
| `homepage`, `about-page`, `training-page`, `yearling-preparation-page` | Single | Page copy, one record each. |

All content types use a custom `state` field for draft/admin_review/published/archived (or the narrower
equivalents on horses/results/news/documents) rather than Strapi's native Draft & Publish system —
`draftAndPublish` is disabled on every type. This was a deliberate fix: Strapi reserves `status` for its
own computed draft/publish indicator and silently shadows a custom attribute with that name, and a
plain "draft vs published" toggle can't represent this project's four public-visibility states anyway.

## 4. Public API safety net

Beyond the Public role's action permissions, each public-facing content type has a small controller
override (`cms/src/api/*/controllers/*.ts`) that force-narrows the `state`/`active` filter with `$and`
— so even if a caller's own filter is missing or wrong, the public REST API can never return
draft/admin_review/archived content. This is the equivalent of the row-level security this project used
before switching to Strapi.

## 5. Media

Local dev uses Strapi's default local-disk upload provider — fine for a laptop, not for a redeployed
container. Production should set the `R2_*` environment variables (see
[`ENVIRONMENT_VARIABLES.md`](./ENVIRONMENT_VARIABLES.md)) to switch to Cloudflare R2, configured in
`cms/config/plugins.ts`.
