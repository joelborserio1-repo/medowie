# Admin Guide

Content is managed from `/admin` inside this same site — locally at `http://localhost:3000/admin`, or
your production domain (e.g. `https://www.medowielodge.com.au/admin`) once deployed. There's no separate
CMS app to visit.

Sign in with an account created per [`SUPABASE_SETUP.md`](./SUPABASE_SETUP.md#3-create-an-admin-account).
New staff accounts are created the same way — in the Supabase dashboard, then added to `admin_users`.

## Finding things

The admin sidebar lists every section:

- **Stallions, Horses for Sale, Results, News, Enquiries** — each has a list view with Create/Edit/Delete.
- **Forms** (contracts and semen order forms) — list view, one record per document.
- **Site Content** — every page's copy, edited as a flat list of content blocks (see below).
- **Settings** — business details, contact info, SEO defaults, hero video.
- **Media** — every uploaded file, independent of which record uses it.

## Stallions

The most detailed section, matching the public stallion profile page (and its photo/video carousel)
section-for-section:

- Core fields cover identity, pedigree, service fee, statistics, copy and semen availability.
- **Status** controls public visibility: `draft`/`admin_review` are hidden from the public site;
  `published` shows on the main stallion listings; `archived` shows in the "Archived Stallions" section.
- **Featured** — tick on exactly one published stallion to control the homepage's Featured Stallion
  section.
- **Career Highlights, Eligible Schemes, Progeny, Videos, Gallery, Documents** are each their own small
  table on the stallion's edit page — add or remove rows directly below the main form. **Gallery**
  photos and **Videos** (paste a YouTube URL) together drive the photo/video carousel on the public
  profile page.
- **Pedigree** (sire's sire/dam, dam's sire/dam) is a single form on the same page.

Upload photos and documents via **Admin → Media** first (pick a bucket, upload, copy the resulting
public URL), then paste that URL into the relevant field — there's no inline picker yet, just a
copyable URL.

## Horses for Sale & Yearlings

One section for both current listings and the yearling-sale history. Set **Sale Type** to "Yearling
Sale" for entries that belong on the Yearling Preparation page's past-sales gallery. Set **Status** to
`sold` once a horse sells (it stays visible in the archive/history section); use `archive` only to fully
hide a listing.

## News, Results, Forms

Straightforward sections. News articles can optionally relate to a stallion and/or a horse listing.
Form documents have an **Active** toggle to hide a document without deleting its record — useful for
retiring an old season's contract while keeping it for reference. PDFs render inline on the public
Forms & Contracts page with a "View" toggle, not just a download link.

## Enquiries

Every public form (Contact, Book a Mare, Stallion enquiry, Training enquiry, Horse for Sale enquiry)
creates an Enquiry record here. Nobody can read enquiries without being signed in as an admin — the
public forms can only create them. Update **Status** (`new` → `contacted` → `follow_up` → `closed`) as
you work through them, and add **Enquiry Notes** for internal, timestamped follow-up notes.

## Site Settings

Business name, tagline, address, phone, email, social links, the enquiry notification email, seasonal
collection information, and default SEO title/description all live here.

**Hero video** — upload a clip via Media and paste its URL into **Hero Video URL** to replace the
homepage's background video (falls back to the built-in default if left empty). **Hero Video Start
Seconds** / **Hero Video End Seconds** trim which part of the clip plays — leave End blank to play to
the end of the file. The player seeks to the start point on load and loops back to it, not to the very
start of the file, once it reaches the end point.

## Site Content

Homepage, About, Training and Yearling Preparation copy all live here as a flat list of content blocks,
one per section (e.g. `about_race_training`, `yearling_sale_preparation`). Each block has a Heading,
Body, an optional Image URL, and a Status (`draft` blocks stay hidden from the public site). Leave a
block's body empty and keep it `draft` to hide that section entirely, rather than showing a
half-written placeholder.

A few blocks — the homepage/About intro and the Yearling Preparation intro — also have an **Extra
fields (JSON)** box for structured extras that don't fit a single heading+body: a `tagline` string,
a `years_experience` number (renders as a stat badge), and a `features` array of `{heading, body}`
objects (renders as a row of feature cards). Edit that JSON carefully — invalid JSON is rejected and the
block's existing extra fields are left unchanged rather than being wiped.

## Media

**Media** in the sidebar lists every uploaded file, independent of which record uses it. Upload once,
then copy the same URL into multiple records if needed. Files live in Supabase Storage, organised into
buckets by area (`stallions`, `horses-for-sale`, `yearlings`, `training`, `news`, `documents`,
`general`) — all public-read, admin-only write.

## Roles & Permissions

Access is controlled by Row Level Security in the database, not a settings screen — see
[`SUPABASE_SETUP.md`](./SUPABASE_SETUP.md#5-row-level-security-summary) for the summary. In short: the
public site can only ever read `published` content and create enquiries; everything else requires being
listed in the `admin_users` table.
