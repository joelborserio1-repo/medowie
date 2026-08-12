"use client";

import { useRef, useState, useTransition } from "react";
import { addDocument, deleteDocument } from "@/app/admin/(dashboard)/stallions/actions";
import { uploadToBucket } from "@/lib/upload";

interface DocItem {
  id: string;
  title: string;
  file_url: string;
}

/**
 * Drag & drop PDF manager for a stallion's "Contracts & Forms". Each dropped
 * file uploads and saves automatically, using its filename as the title.
 */
export function DocumentManager({
  stallionId,
  folder,
  documents,
}: {
  stallionId: string;
  folder: string;
  documents: DocItem[];
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState<DocItem[]>(documents);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  function prettyTitle(filename: string) {
    return filename.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ").trim();
  }

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError(null);
    for (const file of Array.from(files)) {
      try {
        const url = await uploadToBucket("documents", folder, file);
        const title = prettyTitle(file.name) || "Document";
        const formData = new FormData();
        formData.set("title", title);
        formData.set("file_url", url);
        await addDocument(stallionId, formData);
        setItems((prev) => [...prev, { id: url, title, file_url: url }]);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Upload failed.");
      }
    }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  }

  function handleRemove(item: DocItem) {
    setItems((prev) => prev.filter((i) => i.id !== item.id));
    // Freshly-uploaded items use their URL as a temporary id; DB ids are UUIDs.
    if (item.id === item.file_url) return;
    startTransition(() => {
      void deleteDocument(stallionId, item.id);
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
          {uploading ? "Uploading…" : "Drag & drop PDFs here, or click to choose"}
        </span>
        <span className="mt-1 text-xs text-earth">Contracts, service forms, mating hints — they save automatically.</span>
        <input
          ref={fileRef}
          type="file"
          accept="application/pdf"
          multiple
          className="sr-only"
          disabled={uploading}
          onChange={(e) => handleFiles(e.target.files)}
        />
      </label>

      {error && <p className="mt-2 text-xs text-orange-dark">{error}</p>}

      {items.length > 0 && (
        <ul className="mt-4 divide-y divide-line border-y border-line">
          {items.map((item) => (
            <li key={item.id} className="flex items-center justify-between gap-4 py-2 text-sm">
              <a href={item.file_url} target="_blank" rel="noopener noreferrer" className="truncate text-charcoal hover:text-orange">
                {item.title}
              </a>
              <button
                type="button"
                onClick={() => handleRemove(item)}
                className="shrink-0 text-xs font-semibold uppercase tracking-wide text-grey hover:text-orange-dark"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
