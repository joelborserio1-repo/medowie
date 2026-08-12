import { formatDate } from "@/lib/format";
import { mediaUrl } from "@/lib/cms/media";
import type { FormDocument } from "@/lib/cms/types";

export function FormDocumentRow({ doc }: { doc: FormDocument }) {
  const fileUrl = mediaUrl(doc.file)!;
  const isPdf = doc.file?.mime === "application/pdf";

  const meta = [doc.season, doc.description, doc.updatedAt ? `Updated ${formatDate(doc.updatedAt)}` : null]
    .filter(Boolean)
    .join(" · ");

  const title = (
    <div>
      <p className="text-sm font-semibold text-charcoal">{doc.title}</p>
      {meta && <p className="mt-0.5 text-xs text-grey">{meta}</p>}
    </div>
  );

  const downloadLink = (
    <a href={fileUrl} className="text-xs font-semibold uppercase tracking-[0.1em] text-orange hover:underline">
      Download →
    </a>
  );

  if (!isPdf) {
    return (
      <li className="flex flex-wrap items-center justify-between gap-2 py-4">
        {title}
        {downloadLink}
      </li>
    );
  }

  return (
    <li className="py-4">
      <details>
        <summary className="flex cursor-pointer list-none flex-wrap items-center justify-between gap-2 marker:content-none [&::-webkit-details-marker]:hidden">
          {title}
          <div className="flex items-center gap-4">
            <span className="text-xs font-semibold uppercase tracking-[0.1em] text-brown">View</span>
            {downloadLink}
          </div>
        </summary>
        <iframe src={fileUrl} title={doc.title} className="mt-3 h-[600px] w-full border border-line" />
      </details>
    </li>
  );
}
