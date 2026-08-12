"use client";

import { useId, useRef, useState } from "react";
import { uploadToBucket } from "@/lib/upload";

export function ImageInput({
  label,
  name,
  defaultValue,
  folder,
  bucket = "stallions",
  helpText,
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
  folder: string;
  bucket?: string;
  helpText?: string;
}) {
  const inputId = useId();
  const fileRef = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState(defaultValue ?? "");
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFiles(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    setUploading(true);
    setError(null);
    try {
      const publicUrl = await uploadToBucket(bucket, folder, file);
      setUrl(publicUrl);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <div>
      <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-grey">{label}</span>

      <div className="flex items-start gap-4">
        {url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={url} alt="" className="h-28 w-40 flex-shrink-0 border border-line object-cover" />
        ) : (
          <div className="flex h-28 w-40 flex-shrink-0 items-center justify-center border border-dashed border-line bg-parchment text-center text-[11px] text-earth">
            No image yet
          </div>
        )}

        <div className="flex-1">
          <label
            htmlFor={inputId}
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
            className={`flex cursor-pointer flex-col items-center justify-center border-2 border-dashed px-4 py-5 text-center text-xs transition-colors ${
              dragOver ? "border-orange bg-orange/5" : "border-line hover:border-orange"
            }`}
          >
            <span className="font-semibold text-charcoal">
              {uploading ? "Uploading…" : "Drag & drop an image, or click to choose"}
            </span>
            <span className="mt-1 text-earth">JPG, PNG or WEBP</span>
            <input
              id={inputId}
              ref={fileRef}
              type="file"
              accept="image/*"
              className="sr-only"
              disabled={uploading}
              onChange={(e) => handleFiles(e.target.files)}
            />
          </label>

          {url && (
            <button
              type="button"
              onClick={() => setUrl("")}
              className="mt-2 text-[11px] font-semibold uppercase tracking-wide text-grey hover:text-orange-dark"
            >
              Remove image
            </button>
          )}
        </div>
      </div>

      {/* Carries the value into the parent server-action form. Editable as a paste fallback. */}
      <input
        type="url"
        name={name}
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="…or paste an image URL"
        className="mt-2 w-full border border-line bg-warm-white px-3 py-2 text-xs text-grey focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange"
      />

      {helpText && <p className="mt-1 text-[11px] text-earth">{helpText}</p>}
      {error && <p className="mt-1 text-[11px] text-orange-dark">{error}</p>}
    </div>
  );
}
