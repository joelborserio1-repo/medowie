# Seed assets

Real Medowie Lodge photography and marketing material, supplied directly by the user in chat and
committed here so `cms/src/bootstrap/seed-content.ts` can upload them into Strapi's Media Library on
first boot (via `uploadSeedAsset()`, which calls Strapi's own Upload plugin — local disk in dev, R2 in
production). None of these are AI-generated or stock imagery — see `docs/CONTENT_MIGRATION.md` for
exactly which record each one is attached to and what's still unverified about it.

- `soho-lanikai-flyer.jpg` — Medowie Lodge's own promotional flyer for the stallion Soho Lanikai.
  Attached to his `gallery` field.
- `apg-2018-lot-327.png` — the real APG 2018 Sydney Yearling Sale catalogue photo for Lot 327
  (Somebeachsomewhere x Go Right Babe). Attached to that horse-for-sale record's `heroImage`.
- `racing-colours.webp` — a candid photo of the stable's racing colours (white/orange, maroon star).
  Attached to the About page's `heroImage`. Not captioned as any specific horse or race — that wasn't
  identified in the source material.

The site logo (`medowie-lodge-logo.png`) lives in the Next.js app at `public/brand/`, not here — it's a
static frontend asset, not CMS content.
