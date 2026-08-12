"use client";

import { useId, useRef, useState } from "react";
import { uploadToBucket } from "@/lib/upload";

/**
 * Single-file document (PDF) picker with drag & drop. Stores the resulting
 * public URL in a hidden input so it submits inside the parent server-action
 * form — no copy/paste required.
 */
export function DocumentInput({
  label,
  name,
  defaultValue,
  folder,
  helpText,
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
  folder: string;
  helpText?: string;
}) {
  const inputId = useId();
  const fileRef = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState(defaultValue ?? "");
  const [fileName, setFileName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFiles(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const publicUrl = await uploadToBucket("documents", folder, file);
      setUrl(publicUrl);
      setFileName(file.name);
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
          {uploading ? "Uploading…" : url ? "Replace file — drag & drop or click" : "Drag & drop a PDF, or click to choose"}
        </span>
        <span className="mt-1 text-earth">PDF</span>
        <input
          id={inputId}
          ref={fileRef}
          type="file"
          accept="application/pdf"
          className="sr-only"
          disabled={uploading}
          onChange={(e) => handleFiles(e.target.files)}
        />
      </label>

      {url && (
        <div className="mt-2 flex items-center justify-between gap-3 text-xs">
          <a href={url} target="_blank" rel="noopener noreferrer" className="truncate text-orange-dark underline">
            {fileName || "View current file"}
          </a>
          <button
            type="button"
            onClick={() => {
              setUrl("");
              setFileName("");
            }}
            className="shrink-0 font-semibold uppercase tracking-wide text-grey hover:text-orange-dark"
          >
            Remove
          </button>
        </div>
      )}

      <input type="hidden" name={name} value={url} />
      {helpText && <p className="mt-1 text-[11px] text-earth">{helpText}</p>}
      {error && <p className="mt-1 text-[11px] text-orange-dark">{error}</p>}
    </div>
  );
}
