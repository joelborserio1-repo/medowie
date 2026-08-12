import type { Metadata } from "next";
import { PageHero } from "@/components/site/PageHero";
import { EmptyState } from "@/components/ui/EmptyState";
import { FormDocumentRow } from "@/components/site/FormDocumentRow";
import { getDocumentsByCategory } from "@/lib/data/documents";
import { getSiteSettings } from "@/lib/data/settings";
import type { DocumentCategory, FormDocument } from "@/lib/cms/types";

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

  const categories = grouped ? (Object.entries(grouped) as [DocumentCategory, FormDocument[]][]) : [];
  const hasAny = categories.some(([, docs]) => docs.length > 0);

  const collectionInfo = [
    settings?.collectionDays ? { label: "Collection Days", value: settings.collectionDays } : null,
    settings?.collectionCutoffTime ? { label: "Order Cut-Off", value: settings.collectionCutoffTime } : null,
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
                        <FormDocumentRow key={doc.id} doc={doc} />
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
            {settings?.collectionInstructions && (
              <p className="mt-6 max-w-2xl text-sm leading-relaxed text-grey">{settings.collectionInstructions}</p>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
