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
they were read directly, not guessed. No image files could be extracted from the screenshots at that
point (they were inline in the conversation, not files on disk), so no photography was migrated in that
first pass. Per the project brief, none was fabricated or AI-generated as a substitute.

Later, the user pasted several real Medowie Lodge promotional images directly into the conversation: a
clean logo lockup, a Soho Lanikai stallion flyer, a Yearling Preparation flyer, three homepage banner
graphics (Stud/Training/Yearling Preparation), an APG 2018 Lot 327 sale photo, and a candid photo of the
stable's racing colours (plus one beanie/merchandise ad, deliberately not used as site content — it's
product marketing, not stud information). This time the images' base64 bytes were recovered directly
from the session transcript (`~/.claude/projects/.../*.jsonl`, where Claude Code stores full
conversation history including inline image attachments) and decoded back into real image files — which
made it possible to commit actual verified photography, not just transcribe text from images.

The user also supplied the complete About page narrative as plain text in chat — that's used verbatim
below, not summarized or rewritten.

**The backend itself changed twice.** It started on Supabase with a custom `/admin` panel, moved to a
self-hosted Strapi CMS on Railway partway through (at the user's request, chasing an "easy database"
feel), then moved back to Supabase + a rebuilt custom `/admin` (this time restored from the original
Supabase-era git history and re-merged with everything built during the Strapi period) once Railway
turned out to be a hard blocker. All the verified content below survived both migrations — see
`supabase/migrations/0003_seed.sql` (the first pass) and `supabase/migrations/0005_verified_content_upgrade.sql`
(everything gathered afterward) for exactly what's seeded and how.

## What is verified and seeded

- **Business details**: address (951 Richardson Road, Medowie NSW 2318), phone (0429 817 199), email
  (medowielodge@bigpond.com), Facebook page.
- **Homepage introduction copy**, lightly copy-edited for grammar only — the "Welcome to Medowie
  Lodge... Darren Reay... Vice President of Harness Breeders NSW" text.
- **The complete About page narrative**, supplied verbatim by the user: the business overview, Darren
  Reay's background, and nine section essays (A Complete Standardbred Operation, Experience That Comes
  From Doing The Work, Breaking-In and Early Education, Race Training, Yearling Preparation, Stud
  Services, Horse Welfare Comes First, A Hands-On Approach, Based in the Hunter Region, and the closing
  Built on Experience section) — twelve `site_content_blocks` rows in total, keys prefixed `about_`.
- **Yearling Preparation page**: the "30 Years Experience / Proven Results / Professional Care" stat,
  the "Experience. Dedication. Results." tagline, and the four feature blocks (Expert Handling &
  Training, Fitness & Development, Prepared for Success, Professional Photos & Videos), all read
  directly off the Yearling Preparation flyer image. Stored in the `yearling_intro` content block's
  `meta` JSON column (`tagline`, `years_experience`, `features`).
- **Five stallion names and countries**: Tiger Tara (NZ), Follow the Stars (AUS), Timothy Red (AUS),
  My High Expectations (USA), My Chaching Chaching (NZ). Gait (Pacer/Trotter) is inferred from the
  site's own "TR" notation next to trotters.
- **Soho Lanikai**, a sixth stallion, from a dedicated Medowie Lodge promotional flyer: service fee
  ($2,000 inc. GST), sire (Somebeachsomewhere), gait (Pacer, inferred from the sulky photo and mile
  rate), and his first-start result ("won by 65 metres in 1:54") as a career highlight. The flyer names
  his dam only as "a Group 1 winning mare" with no actual name given, so `dam` is left blank rather than
  guessed. Like the other five, seeded as `admin_review` — the flyer carries no date, so current
  standing status can't be confirmed. The flyer image itself is uploaded to his gallery by
  `scripts/upload-seed-assets.mjs`.
- **Three historical yearling sale records** from the "2018 Sydney APG Yearling Sale" example on the
  Horses for Sale page (Lot 327, 357, 428), including their real sire/dam pairings, seeded as
  `sold`/archive entries — not current listings. **Lot 327** also gets its real sale-catalogue photo,
  uploaded and linked as its `hero_image_url` by the same script.
- **About page**: a real, unbranded photo of the stable's racing colours (white jacket, orange sleeves,
  maroon star) is uploaded and linked as the `about_intro` block's `image_url` — it isn't captioned as
  any specific horse, since the source material didn't identify which horse or race it's from.
- **Site logo**: the real Medowie Lodge horse-head-and-star lockup renders in the site header
  (`public/brand/medowie-lodge-logo.png`), background removed (it shipped on a white background — see
  the git history for the pure-Python chroma-key script used, since no image-editing tool was available
  in this environment).
- **Homepage banners and hero video**: the three "Stud / Training / Yearling Preparation" graphics
  (`public/home/`) and the background video (`public/video/hero.mp4`) are the business's own real
  marketing material, committed as static frontend assets rather than CMS content since they're part of
  the page design, not staff-swappable per-season copy. The hero video's start time (12s in, since the
  clip's opening few seconds are slow) is CMS-editable — see `hero_video_start_seconds` on
  `site_settings`.

## What is deliberately left blank

Everything the source material didn't verify ships as an empty field or an `admin_review` / `draft`
status, never a guess:

- Stallion **service fees**, **GST notes**, **statistics** (mile rate, earnings, starts/wins),
  **full biographies**, **pedigree trees beyond sire/dam**, **progeny**, **career highlights** — for the
  original five stallions (Soho Lanikai's are filled in from his own flyer, see above).
- Whether each of the five original stallions is **currently standing** — the source page's own
  "2023/2024 breeding season" label and "© 2015–2025" footer show the live site is already out of date,
  so season-status cannot be treated as current. All five are seeded `admin_review`.
- All other **photography** — the five original stallions' images, and training/property photos beyond
  what's described above. `BrandImage` renders a plain brand-toned placeholder panel (never AI-generated
  art) wherever an image field is empty.
- Training page **sub-sections** (Race Training, Breaking-In, Education, Facilities) — the live site
  didn't contain this detail, so those content blocks are seeded `draft` with no body; the frontend
  simply doesn't render an empty section.
- **Forms & contracts**, **results**, **news**, **current horses for sale** — no source data existed at
  all, so these start empty and their pages render an honest empty state.

## What Medowie Lodge staff need to do

1. **Confirm the current stallion roster and season** in `/admin` (Stallions) — set each stallion's
   **Status** to `published` (or `archived`) once fees and availability are confirmed for the season, or
   remove the ones no longer standing.
2. **Upload real photography** via **Admin → Media**, then paste the resulting URL into the relevant
   stallion/horse/article field.
3. **Fill in service fees, statistics, biographies and pedigrees** per stallion.
4. **Write the Training page's sub-sections** — Race Training, Breaking-In, Education & Preparation,
   Facilities — under **Admin → Site Content**; leave a block blank to keep that section hidden.
5. **Upload current contracts and semen order forms** via **Admin → Forms**.
6. If network access to the old site is restored later, or an export of it becomes available, re-run a
   proper crawl and reconcile it against what's already in the database rather than overwriting
   staff-entered data.
