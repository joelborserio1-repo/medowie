# Content Migration

## What happened

This rebuild was scoped to crawl `medowielodge.com.au`, download its imagery and PDFs, and migrate its
stallion, pedigree, fee and racing-record content into the new CMS.

The build environment's network egress proxy blocks all outbound requests to `medowielodge.com.au`, and
to the third-party pages that referenced it (`harnesslink.com`, `apgold.com.au`,
`nutrienstandardbred.com.au`, Facebook). Every direct fetch attempt returned `EGRESS_BLOCKED`. Search
snippets were reachable and confirmed a handful of facts (business address, phone, email, Darren Reay's
name and role), but no page content, images, or documents could be retrieved that way.

Partway through the build, the user supplied screenshots of five live pages (Home, Stallions, Training,
Horses for Sale, Contact). Those screenshots are the source for everything below marked **verified** —
they were read directly, not guessed. No image files could be extracted from the screenshots (they're
inline in the conversation, not files on disk), so **no photography was migrated**. Per the project brief,
none was fabricated or AI-generated as a substitute.

The CMS itself was later rebuilt on Strapi (see `cms/`); the verified content below is seeded by
`cms/src/bootstrap/seed-content.ts`, which runs automatically on Strapi's first boot and is safe to
re-run (it skips anything already present, so it never overwrites staff-entered data).

## What is verified and seeded (`cms/src/bootstrap/seed-content.ts`)

- **Business details**: address (951 Richardson Road, Medowie NSW 2318), phone (0429 817 199), email
  (medowielodge@bigpond.com), Facebook page.
- **Homepage introduction copy**, lightly copy-edited for grammar only — the "Welcome to Medowie
  Lodge... Darren Reay... Vice President of Harness Breeders NSW" text.
- **Training page introduction** — the one paragraph that existed on the live site.
- **Yearling preparation introduction** — the Sydney APG / Bathurst sale paragraph.
- **Five stallion names and countries**: Tiger Tara (NZ), Follow the Stars (AUS), Timothy Red (AUS),
  My High Expectations (USA), My Chaching Chaching (NZ). Gait (Pacer/Trotter) is inferred from the
  site's own "TR" notation next to trotters.
- **Three historical yearling sale records** from the "2018 Sydney APG Yearling Sale" example on the
  Horses for Sale page (Lot 327, 357, 428), including their real sire/dam pairings, seeded as
  `sold`/archive entries — not current listings.

## What is deliberately left blank

Everything the source material didn't verify ships as an empty field or an `admin_review` / `draft`
state, never a guess:

- Stallion **service fees**, **GST notes**, **statistics** (mile rate, earnings, starts/wins),
  **full biographies**, **pedigree trees beyond sire/dam**, **progeny**, **career highlights**.
- Whether each of the five stallions is **currently standing** — the source page's own "2023/2024
  breeding season" label and "© 2015–2025" footer show the live site is already out of date, so
  season-status cannot be treated as current. All five are seeded with `state: admin_review`.
- All **photography** — stallion, training, yearling and property images. `BrandImage` renders a plain
  brand-toned placeholder panel (never AI-generated art) wherever a media field is empty.
- Training/About/Yearling Preparation **sub-sections** the brief asked for (Race Training,
  Breaking-In, Facilities, Sale Preparation, Handling & Education, Presentation, Breeding, region copy)
  — the live site didn't contain this detail, so those fields on the relevant single types (Training
  Page, About Page, Yearling Preparation Page) are left blank rather than filled with generic marketing
  copy; the frontend simply doesn't render an empty section.
- **Forms & contracts**, **results**, **news**, **current horses for sale** — no source data existed at
  all, so these content types start empty and their pages render an honest empty state.

## What Medowie Lodge staff need to do

1. **Confirm the current stallion roster and season** in Strapi admin (Content Manager → Stallion) —
   set each stallion's **State** to `published` (or `archived`) once fees and availability are confirmed
   for the season, or remove the ones no longer standing.
2. **Upload real photography** via each stallion/horse/article's media fields (opens the Media Library
   picker directly — no separate upload step needed).
3. **Fill in service fees, statistics, biographies and pedigrees** per stallion.
4. **Write the expanded Training / Yearling Preparation / About sections** — each is a single type with
   one field per section; leave a field blank to keep that section hidden.
5. **Upload current contracts and semen order forms** via the Form Document content type.
6. If network access to the old site is restored later, or an export of it becomes available, re-run a
   proper crawl and reconcile it against what's already in Strapi rather than overwriting staff-entered
   data.
