# Admin Guide

Content is managed entirely from the Strapi admin panel — at `http://localhost:1337/admin` locally, or
your CMS's deployed URL in production (e.g. `https://cms.medowielodge.com.au/admin`). There's no
separate admin area inside the public Next.js site.

Sign in with an account created per [`STRAPI_SETUP.md`](./STRAPI_SETUP.md) / [`DEPLOYMENT.md`](./DEPLOYMENT.md).
New staff accounts: **Settings → Administration Panel → Users → Invite new user**.

## Finding things

The left sidebar's **Content Manager** lists every content type:

- **Collection types** (Stallion, Horse for Sale, Result, News Article, Form Document, Enquiry, Enquiry
  Note) — each has a list view with Create/Edit/Delete.
- **Single types** (Site Settings, Homepage, About Page, Training Page, Yearling Preparation Page) —
  each is one record, edited directly (no list view).

## Stallions

The most detailed content type, matching the public stallion profile page section-for-section:

- Core fields cover identity, pedigree, service fee, statistics, copy, semen availability, and SEO.
- **`state`** controls public visibility: `draft`/`admin_review` are hidden from the public site;
  `published` shows on the main stallion listings; `archived` shows in the "Archived Stallions" section.
  (This is a plain field, not Strapi's built-in Draft/Publish toggle — ignore the Draft/Publish button
  in the top-right of the edit screen, it doesn't affect what the public site shows.)
- **`featured`** — tick on exactly one published stallion to control the homepage's Featured Stallion
  section.
- **Highlights, Eligible Schemes, Progeny, Videos** are repeatable component fields — click "Add an
  entry" to add rows, drag to reorder.
- **Pedigree** is a single component (sire's sire/dam, dam's sire/dam).
- **Gallery** and **Documents** are media fields — click to open the Media Library picker (upload new
  files or pick existing ones).

## Horses for Sale & Yearlings

There's one content type for both current listings and the yearling-sale history. Set **Sale Type** to
"Yearling Sale" for entries that belong on the Yearling Preparation page's past-sales gallery. Set
**State** to `sold` once a horse sells (it stays visible in the archive/history section); use `archive`
only to fully hide a listing.

## News, Results, Form Documents

Straightforward collection types. News articles can optionally relate to a stallion and/or a horse
listing. Form documents have an **Active** toggle to hide a document without deleting its record —
useful for retiring an old season's contract while keeping it for reference.

## Enquiries

Every public form (Contact, Book a Mare, Stallion enquiry, Training enquiry, Horse for Sale enquiry)
creates an Enquiry record here. The Public role can only *create* these — nobody can read them without
being signed into the admin panel. Update **Stage** (`new` → `contacted` → `follow_up` → `closed`) as
you work through them, and add related **Enquiry Note** records for internal, timestamped follow-up
notes (create one from the Enquiry Note collection type, linking it back to the enquiry).

## Site Settings

Business name, tagline, address, phone, email, social links, the enquiry notification email, seasonal
collection information, and default SEO title/description all live in the **Site Settings** single type.

## Homepage / About / Training / Yearling Preparation copy

Each of these pages has its own single type with one field per section (e.g. Training Page has
`introBody`, `raceTrainingBody`, `breakingInBody`, `educationBody`, `facilitiesBody`). Leave a section's
body field blank to hide that section on the public page entirely, rather than showing a half-written
placeholder.

**Homepage hero video** — upload a clip to **Hero Video** to replace the background video on the
homepage (falls back to the built-in default video if left empty). **Hero Video Start Seconds** /
**Hero Video End Seconds** trim which part of the clip plays — leave End blank to play to the end of
the file. The player seeks to the start point on load and jumps back to it once it reaches the end
point, looping just that section rather than the whole clip.

## Media Library

**Media Library** in the sidebar lists every uploaded file, independent of which content record uses
it. Upload once, then attach the same file to multiple records if needed. In production this is backed
by Cloudflare R2 rather than local disk (see [`DEPLOYMENT.md`](./DEPLOYMENT.md)) — from an editor's
perspective it works identically either way.

## Roles & Permissions

**Settings → Users & Permissions → Roles** shows what the "Public" role (used by the live website) can
do. It's set up automatically on first boot by `cms/src/bootstrap/set-public-permissions.ts` — read
access to published content, create-only on enquiries. Don't grant Public any write access, and don't
grant it `find`/`findOne` on Enquiry or Enquiry Note.
