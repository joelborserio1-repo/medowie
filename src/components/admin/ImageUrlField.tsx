"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/browser";

export function ImageUrlField({
  label,
  name,
  defaultValue,
  bucket,
  folder,
  className,
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
  bucket: string;
  folder?: string;
  className?: string;
}) {
  const [url, setUrl] = useState(defaultValue ?? "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const supabase = createClient();
      const cleanName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "-");
      const path = folder ? `${folder}/${Date.now()}-${cleanName}` : `${Date.now()}-${cleanName}`;

      const { error: uploadError } = await supabase.storage.from(bucket).upload(path, file, { upsert: false });
      if (uploadError) throw new Error(uploadError.message);

      const { data: publicUrl } = supabase.storage.from(bucket).getPublicUrl(path);

      const { error: insertError } = await supabase
        .from("media_assets")
        .insert({ bucket, path, url: publicUrl.publicUrl, folder: folder || null });
      if (insertError) throw new Error(insertError.message);

      setUrl(publicUrl.publicUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed. Please try again.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  return (
    <div className={className}>
      <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-grey">{label}</span>
      <input
        type="text"
        name={name}
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Paste a URL, or upload a file below"
        className="w-full border border-line bg-warm-white px-3 py-2.5 text-sm text-charcoal focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange"
      />
      <div className="mt-2 flex items-center gap-3 border border-dashed border-line bg-parchment px-3 py-2.5">
        <label className="cursor-pointer rounded-[3px] bg-orange px-6 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-warm-white hover:bg-orange-dark">
          {uploading ? "Uploading…" : "Upload Image"}
          <input type="file" accept="image/*" onChange={handleUpload} disabled={uploading} className="hidden" />
        </label>
        {!uploading && <span className="text-xs text-grey">or paste a URL above</span>}
      </div>
      {error && <p className="mt-1 text-xs text-orange-dark">{error}</p>}
      {url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt="" className="mt-3 h-32 w-32 border border-line object-cover" />
      )}
    </div>
  );
}
