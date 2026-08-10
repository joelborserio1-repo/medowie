"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/browser";

const BUCKETS = ["stallions", "horses-for-sale", "yearlings", "training", "news", "documents", "general"];

export function MediaUploader() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [bucket, setBucket] = useState(BUCKETS[0]);
  const [folder, setFolder] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setError(null);
    const supabase = createClient();

    for (const file of Array.from(files)) {
      const cleanName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "-");
      const path = folder ? `${folder}/${Date.now()}-${cleanName}` : `${Date.now()}-${cleanName}`;

      const { error: uploadError } = await supabase.storage.from(bucket).upload(path, file, { upsert: false });
      if (uploadError) {
        setError(uploadError.message);
        continue;
      }

      const { data: publicUrl } = supabase.storage.from(bucket).getPublicUrl(path);

      await supabase.from("media_assets").insert({
        bucket,
        path,
        url: publicUrl.publicUrl,
        folder: folder || null,
      });
    }

    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
    router.refresh();
  }

  return (
    <div className="border border-line bg-warm-white p-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <label>
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-grey">Bucket</span>
          <select
            value={bucket}
            onChange={(e) => setBucket(e.target.value)}
            className="w-full border border-line bg-warm-white px-3 py-2.5 text-sm"
          >
            {BUCKETS.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-grey">Folder (optional)</span>
          <input
            value={folder}
            onChange={(e) => setFolder(e.target.value)}
            placeholder="e.g. tiger-tara"
            className="w-full border border-line bg-warm-white px-3 py-2.5 text-sm"
          />
        </label>
        <label>
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-grey">Upload Files</span>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,application/pdf"
            multiple
            onChange={handleUpload}
            disabled={uploading}
            className="w-full text-sm"
          />
        </label>
      </div>
      {uploading && <p className="mt-3 text-sm text-grey">Uploading…</p>}
      {error && <p className="mt-3 text-sm text-orange-dark">{error}</p>}
    </div>
  );
}
