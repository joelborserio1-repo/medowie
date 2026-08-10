import type { Metadata } from "next";
import { PageHero } from "@/components/site/PageHero";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatDate } from "@/lib/format";
import { getDocumentsByCategory } from "@/lib/data/documents";
import { getSiteSettings } from "@/lib/data/settings";
import type { DocumentCategory, DocumentRecord } from "@/lib/supabase/types";

export const metadata: Metadata = {
  title: "Forms & Contracts",
  description: "Stallion service contracts, semen order forms and breeding documents from Medowie Lodge.",
  alternates: { canonical: "/forms" },
};

export default async function FormsPage() {
  const [grouped, settings] = await Promise.all([
    getDocumentsByCategory().catch(() => null),
    getSiteSettings().catch(() => null),
  ]);

  const categories = grouped ? (Object.entries(grouped) as [DocumentCategory, DocumentRecord[]][]) : [];
  const hasAny = categories.some(([, docs]) => docs.length > 0);

  const collectionInfo = [
    settings?.collection_days ? { label: "Collection Days", value: settings.collection_days } : null,
    settings?.collection_cutoff_time ? { label: "Order Cut-Off", value: settings.collection_cutoff_time } : null,
  ].filter((c): c is { label: string; value: string } => Boolean(c));

  return (
    <div>
      <PageHero
        eyebrow="Medowie Lodge"
        heading="Forms & Contracts"
        intro="Stallion service contracts, semen order forms and breeding documents."
      />

      <section className="py-14">
        <div className="mx-auto w-full max-w-[1400px] px-5 sm:px-8">
          {!hasAny ? (
            <EmptyState
              heading="Documents coming soon"
              message="Contracts and order forms will be published here once confirmed for the current season. Contact Medowie Lodge directly in the meantime."
            />
          ) : (
            <div className="space-y-12">
              {categories.map(([category, docs]) =>
                docs.length === 0 ? null : (
                  <div key={category}>
                    <h2 className="font-serif text-2xl text-brown">{category}</h2>
                    <ul className="mt-4 divide-y divide-line border-y border-line">
                      {docs.map((doc) => (
                        <li key={doc.id} className="flex flex-wrap items-center justify-between gap-2 py-4">
                          <div>
                            <p className="text-sm font-semibold text-charcoal">{doc.title}</p>
                            <p className="mt-0.5 text-xs text-grey">
                              {[doc.season, doc.description, doc.updated_at ? `Updated ${formatDate(doc.updated_at)}` : null]
                                .filter(Boolean)
                                .join(" · ")}
                            </p>
                          </div>
                          <a
                            href={doc.file_url}
                            className="text-xs font-semibold uppercase tracking-[0.1em] text-orange hover:underline"
                          >
                            Download →
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </section>

      {collectionInfo.length > 0 && (
        <section className="border-t border-line py-14">
          <div className="mx-auto w-full max-w-[1400px] px-5 sm:px-8">
            <p className="eyebrow mb-3">Collection Information</p>
            <dl className="grid gap-6 sm:grid-cols-3">
              {collectionInfo.map((c) => (
                <div key={c.label}>
                  <dt className="text-[11px] font-semibold uppercase tracking-[0.08em] text-earth">{c.label}</dt>
                  <dd className="mt-1 text-sm text-charcoal">{c.value}</dd>
                </div>
              ))}
            </dl>
            {settings?.collection_instructions && (
              <p className="mt-6 max-w-2xl text-sm leading-relaxed text-grey">{settings.collection_instructions}</p>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
