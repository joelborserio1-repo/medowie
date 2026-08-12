# Seed assets

Real Medowie Lodge photography and marketing material, supplied directly by the user in chat. Uploaded
to Supabase Storage by `scripts/upload-seed-assets.mjs` (run once, after the migrations, with real
project credentials in `.env.local`) and linked to the matching database rows. None of these are
AI-generated or stock imagery — see `docs/CONTENT_MIGRATION.md` for exactly which record each one is
attached to and what's still unverified about it.

- `soho-lanikai-flyer.jpg` — Medowie Lodge's own promotional flyer for the stallion Soho Lanikai.
  Uploaded to the `stallions` bucket and linked into `stallion_gallery`.
- `apg-2018-lot-327.webp` — the real APG 2018 Sydney Yearling Sale catalogue photo for Lot 327
  (Somebeachsomewhere x Go Right Babe). Uploaded to the `horses-for-sale` bucket and set as that
  horse-for-sale record's `hero_image_url`.
- `racing-colours.png` — a candid photo of the stable's racing colours (white/orange, maroon star).
  Uploaded to the `general` bucket and set as the About page's `about_intro` block `image_url`. Not
  captioned as any specific horse or race — that wasn't identified in the source material.

The site logo, the three homepage banner images (Stud/Training/Yearling Preparation), and the hero
background video are static Next.js assets in `public/`, not Supabase Storage content — they're part of
the frontend build, not staff-editable CMS media.
