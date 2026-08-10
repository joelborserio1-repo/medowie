# Admin Guide

The admin CMS lives at `/admin`. Sign in at `/admin/login` with an account created per
[SUPABASE_SETUP.md](./SUPABASE_SETUP.md) — there's no public sign-up.

## General patterns

- **Status fields.** Most content (stallions, horses, news, results, documents) has a status. Only
  `Published` (or `Active`, for documents) content appears on the public site. Use `Draft` /
  `Admin Review` to prepare something before it goes live.
- **Images.** Upload files on the **Media** page first, then copy the resulting URL into the relevant
  image field on the stallion/horse/news form. There's no drag-and-drop image picker inside every
  form — this keeps each content form a plain, predictable set of fields.
- **Deleting** is permanent (a browser confirmation appears first). If you just want something off the
  public site, change its status instead.
- Every save redirects you back to a list or detail page — if a save appears to do nothing, check
  that required fields (marked with a red `*`) are filled in.

## Stallions

**Admin → Stallions** is the most detailed section, matching the public stallion profile page:

- The main edit form covers identity, pedigree, service fee, statistics, copy, semen availability,
  image URLs and SEO fields.
- Below the main form, separate small forms manage **Career Highlights**, **Eligible Schemes**,
  **Pedigree** (sire's sire/dam, dam's sire/dam), **Media Gallery**, **Videos** (paste a YouTube URL),
  **Documents** and **Progeny** — each is an "add a row" form with a list of existing rows you can
  remove.
- **Featured**: tick "Feature on homepage" on exactly one stallion to control the homepage's Featured
  Stallion section.
- **Duplicate**: copies a stallion's fields into a new draft record (handy for a new season based on
  last year's entry) — remember to change the slug.
- The public **Stallions** page dropdown in the header updates automatically from whichever stallions
  are `Published`.

## Horses for Sale & Yearlings

Both use the same table. **Admin → Yearlings** is a filtered view of listings where "Sale Type" is
"Yearling Sale" (used for the Yearling Preparation page's past-sales gallery); create or edit those
listings from either the Yearlings or Horses for Sale screen — they're the same records.

Set **Status** to `Sold` once a horse sells; tick "Show sold price publicly" only if Medowie Lodge wants
the sale price displayed.

## Progeny

Progeny belong to a stallion, so they're managed from that stallion's edit page (scroll to the Progeny
section). **Admin → Progeny** is a read-only overview across all stallions with a link back to the
right stallion.

## Results & News

Straightforward add/edit/delete forms. Results support an optional external results-service link.
News articles can optionally tag a related stallion or horse listing.

## Forms & Contracts

Upload a document's file first via **Media** (bucket: `documents`), then add a record here with its
category, an optional season label (e.g. "2026/2027") and optional stallion link. Untick **Active** to
hide a document without deleting it — useful for retiring an old season's contract while keeping the
record for reference.

## Enquiries

Every public form (Contact, Book a Mare, Stallion enquiry, Training enquiry, Horse for Sale enquiry)
lands here. Filter by status along the top. Open an enquiry to see every field it was submitted with,
change its status (`New` → `Contacted` → `Follow Up` → `Closed`), and add internal notes — notes are
timestamped and never shown publicly.

## Media

Pick a storage bucket (matching the content type — stallions, horses-for-sale, yearlings, training,
news, documents, general), an optional folder name, then choose files. After upload, each item shows a
**Copy URL** button and an alt-text field (saves automatically when you click away from the field).

## Site Content

Homepage introduction, About page sections, Training sections and Yearling Preparation sections are
each a separate block here — click a block to expand it, edit the heading/body, and set it to
`Published` when ready. A block left as `Draft` simply doesn't render its section on the public page,
so it's safe to leave unfinished sections hidden rather than half-written and visible.

## Settings

Business name, tagline, address, phone, email, social links, the enquiry notification email, seasonal
collection information, and default SEO title/description all live here in one form.
