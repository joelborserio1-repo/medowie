import { createClient } from "@/lib/supabase/browser";

/**
 * Uploads a single file to a Supabase Storage bucket from the browser (as the
 * signed-in admin) and returns its public URL. Reused by the admin upload
 * widgets so a non-technical editor never has to copy/paste storage URLs.
 */
export async function uploadToBucket(bucket: string, folder: string, file: File): Promise<string> {
  const supabase = createClient();
  const cleanName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "-");
  const safeFolder = folder.replace(/[^a-zA-Z0-9.\-_]/g, "-");
  const path = safeFolder ? `${safeFolder}/${Date.now()}-${cleanName}` : `${Date.now()}-${cleanName}`;

  const { error } = await supabase.storage.from(bucket).upload(path, file, { upsert: false });
  if (error) throw error;

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}
