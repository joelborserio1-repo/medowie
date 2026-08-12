"use client";

import { useRef, useState, useTransition } from "react";
import { addGalleryImage, deleteGalleryImage } from "@/app/admin/(dashboard)/stallions/actions";
import { uploadToBucket } from "@/lib/upload";

interface GalleryItem {
  id: string;
  image_url: string;
  alt_text: string | null;
}

export function GalleryManager({
  stallionId,
  folder,
  images,
}: {
  stallionId: string;
  folder: string;
  images: GalleryItem[];
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState<GalleryItem[]>(images);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError(null);
    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) continue;
      try {
        const url = await uploadToBucket("stallions", folder, file);
        const formData = new FormData();
        formData.set("image_url", url);
        formData.set("alt_text", "");
        await addGalleryImage(stallionId, formData);
        setItems((prev) => [...prev, { id: url, image_url: url, alt_text: null }]);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Upload failed.");
      }
    }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  }

  function handleRemove(item: GalleryItem) {
    setItems((prev) => prev.filter((i) => i.id !== item.id));
    // Newly-uploaded items use their URL as a temporary id; a real DB id is a UUID.
    if (item.id === item.image_url) return;
    startTransition(() => {
      void deleteGalleryImage(stallionId, item.id);
    });
  }

  return (
    <div>
      <label
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFiles(e.dataTransfer.files);
        }}
        className={`flex cursor-pointer flex-col items-center justify-center border-2 border-dashed px-4 py-8 text-center text-sm transition-colors ${
          dragOver ? "border-orange bg-orange/5" : "border-line hover:border-orange"
        }`}
      >
        <span className="font-semibold text-charcoal">
          {uploading ? "Uploading…" : "Drag & drop photos here, or click to choose"}
        </span>
        <span className="mt-1 text-xs text-earth">You can add several at once. They save automatically.</span>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          className="sr-only"
          disabled={uploading}
          onChange={(e) => handleFiles(e.target.files)}
        />
      </label>

      {error && <p className="mt-2 text-xs text-orange-dark">{error}</p>}

      {items.length > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {items.map((item) => (
            <div key={item.id} className="group relative border border-line">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.image_url} alt={item.alt_text ?? ""} className="aspect-[4/3] w-full object-cover" />
              <button
                type="button"
                onClick={() => handleRemove(item)}
                className="absolute right-1 top-1 rounded-[3px] bg-brown/80 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-warm-white opacity-0 transition-opacity group-hover:opacity-100"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
