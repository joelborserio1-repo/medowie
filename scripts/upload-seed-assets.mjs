#!/usr/bin/env node
/**
 * One-time script: uploads the real Medowie Lodge photos in
 * supabase/seed-assets/ to Supabase Storage and links each one into its
 * matching database row. Run once after the SQL migrations, with real
 * project credentials available:
 *
 *   NEXT_PUBLIC_SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/upload-seed-assets.mjs
 *
 * Uses the service role key (bypasses RLS) since this writes storage
 * objects and content tables directly, the same way the /admin panel's
 * MediaUploader does client-side with a signed-in admin session.
 * Safe to re-run: uploads use upsert, and each DB update only fires if
 * the target field is still empty.
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ASSETS_DIR = path.join(__dirname, "..", "supabase", "seed-assets");

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.\n" +
      "Run with: NEXT_PUBLIC_SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/upload-seed-assets.mjs"
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

const MIME_TYPES = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

async function uploadFile(bucket, filename) {
  const filepath = path.join(ASSETS_DIR, filename);
  const contentType = MIME_TYPES[path.extname(filename).toLowerCase()] ?? "application/octet-stream";
  const data = readFileSync(filepath);
  const storagePath = `seed/${filename}`;

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(storagePath, data, { contentType, upsert: true });
  if (uploadError) throw new Error(`Upload failed for ${filename}: ${uploadError.message}`);

  const { data: publicUrl } = supabase.storage.from(bucket).getPublicUrl(storagePath);

  await supabase.from("media_assets").upsert(
    { bucket, path: storagePath, url: publicUrl.publicUrl, folder: "seed" },
    { onConflict: "bucket,path" }
  );

  console.log(`Uploaded ${filename} -> ${publicUrl.publicUrl}`);
  return publicUrl.publicUrl;
}

async function main() {
  // Soho Lanikai's own promotional flyer -> his gallery.
  const flyerUrl = await uploadFile("stallions", "soho-lanikai-flyer.jpg");
  const { data: soho } = await supabase.from("stallions").select("id").eq("slug", "soho-lanikai").maybeSingle();
  if (soho) {
    const { count } = await supabase
      .from("stallion_gallery")
      .select("id", { count: "exact", head: true })
      .eq("stallion_id", soho.id);
    if (!count) {
      await supabase
        .from("stallion_gallery")
        .insert({ stallion_id: soho.id, image_url: flyerUrl, alt_text: "Soho Lanikai — Medowie Lodge promotional flyer" });
      console.log("Linked flyer to Soho Lanikai's gallery.");
    }
  } else {
    console.warn("Soho Lanikai stallion row not found — run the SQL migrations first.");
  }

  // Real APG 2018 sale-catalogue photo -> Lot 327's hero image.
  const lot327Url = await uploadFile("horses-for-sale", "apg-2018-lot-327.webp");
  const { data: lot327 } = await supabase
    .from("horses_for_sale")
    .select("id, hero_image_url")
    .eq("slug", "apg-2018-lot-327")
    .maybeSingle();
  if (lot327 && !lot327.hero_image_url) {
    await supabase.from("horses_for_sale").update({ hero_image_url: lot327Url }).eq("id", lot327.id);
    console.log("Set Lot 327's hero image.");
  } else if (!lot327) {
    console.warn("Lot 327 horse-for-sale row not found — run the SQL migrations first.");
  }

  // Racing-colours photo -> About page intro image.
  const coloursUrl = await uploadFile("general", "racing-colours.png");
  const { data: aboutIntro } = await supabase
    .from("site_content_blocks")
    .select("id, image_url")
    .eq("key", "about_intro")
    .maybeSingle();
  if (aboutIntro && !aboutIntro.image_url) {
    await supabase.from("site_content_blocks").update({ image_url: coloursUrl }).eq("id", aboutIntro.id);
    console.log("Set the About page's intro image.");
  } else if (!aboutIntro) {
    console.warn("about_intro content block not found — run the SQL migrations first.");
  }

  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
