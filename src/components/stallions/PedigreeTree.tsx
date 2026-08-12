import type { Stallion, StallionPedigree } from "@/lib/supabase/types";

export function PedigreeTree({ stallion, pedigree }: { stallion: Stallion; pedigree: StallionPedigree | null }) {
  const hasAny = stallion.sire || stallion.dam || pedigree;
  if (!hasAny) return null;

  const pedigreeDocUrl = stallion.pedigree_document_url;

  return (
    <section className="border-b border-line py-14">
      <div className="mx-auto w-full max-w-[1400px] px-5 sm:px-8">
        <p className="eyebrow mb-3">Pedigree</p>
        <h2 className="font-serif text-3xl text-brown">Bloodlines</h2>

        <div className="mt-8 grid gap-8 sm:grid-cols-2">
          <div className="border border-line p-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-earth">Sire</p>
            <p className="mt-1 font-serif text-2xl text-brown">{stallion.sire ?? "—"}</p>
            <div className="mt-4 space-y-2 border-t border-line pt-4 text-sm text-grey">
              <p>
                <span className="text-charcoal">Sire&apos;s Sire:</span> {pedigree?.sires_sire ?? "—"}
              </p>
              <p>
                <span className="text-charcoal">Sire&apos;s Dam:</span> {pedigree?.sires_dam ?? "—"}
              </p>
            </div>
          </div>

          <div className="border border-line p-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-earth">Dam</p>
            <p className="mt-1 font-serif text-2xl text-brown">{stallion.dam ?? "—"}</p>
            <div className="mt-4 space-y-2 border-t border-line pt-4 text-sm text-grey">
              <p>
                <span className="text-charcoal">Dam&apos;s Sire:</span> {pedigree?.dams_sire ?? stallion.damsire ?? "—"}
              </p>
              <p>
                <span className="text-charcoal">Dam&apos;s Dam:</span> {pedigree?.dams_dam ?? "—"}
              </p>
            </div>
          </div>
        </div>

        {pedigreeDocUrl && (
          <a
            href={pedigreeDocUrl}
            className="mt-6 inline-block text-xs font-semibold uppercase tracking-[0.1em] text-orange hover:underline"
          >
            Download Full Pedigree →
          </a>
        )}
      </div>
    </section>
  );
}
