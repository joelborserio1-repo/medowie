import type { Stallion, StallionPedigree } from "@/lib/supabase/types";

/**
 * Pedigree section — a compact, breeder-focused pedigree table that lays out
 * the sire and dam lines across generations. Built as a CSS grid so it reads
 * like a classic bracket on desktop and stacks cleanly on mobile. Structured
 * so a more detailed supplied pedigree layout can slot in later without
 * reworking the surrounding page.
 */
export function PedigreeTree({ stallion, pedigree }: { stallion: Stallion; pedigree: StallionPedigree | null }) {
  const hasAny = stallion.sire || stallion.dam || pedigree;
  if (!hasAny) return null;

  const dash = "—";
  const sire = stallion.sire ?? dash;
  const dam = stallion.dam ?? dash;
  const siresSire = pedigree?.sires_sire ?? dash;
  const siresDam = pedigree?.sires_dam ?? dash;
  const damsSire = pedigree?.dams_sire ?? stallion.damsire ?? dash;
  const damsDam = pedigree?.dams_dam ?? dash;

  return (
    <section className="border-b border-line bg-parchment py-14">
      <div className="mx-auto w-full max-w-[1400px] px-5 sm:px-8">
        <p className="eyebrow mb-3">Sire &amp; Dam Lines</p>
        <h2 className="font-serif text-3xl text-brown">Pedigree</h2>

        <div className="mt-8 overflow-hidden rounded-brand border border-line bg-warm-white">
          {/* Two branches: Sire line (top) and Dam line (bottom) */}
          <PedigreeBranch
            label="Sire"
            parent={sire}
            grandSireLabel="Sire's Sire"
            grandSire={siresSire}
            grandDamLabel="Sire's Dam"
            grandDam={siresDam}
          />
          <div className="border-t border-line" />
          <PedigreeBranch
            label="Dam"
            parent={dam}
            grandSireLabel="Broodmare Sire"
            grandSire={damsSire}
            grandDamLabel="Dam's Dam"
            grandDam={damsDam}
          />
        </div>

        {stallion.pedigree_document_url && (
          <a
            href={stallion.pedigree_document_url}
            className="mt-6 inline-block text-xs font-semibold uppercase tracking-[0.1em] text-orange hover:underline"
          >
            Download Full Pedigree →
          </a>
        )}
      </div>
    </section>
  );
}

function PedigreeBranch({
  label,
  parent,
  grandSireLabel,
  grandSire,
  grandDamLabel,
  grandDam,
}: {
  label: string;
  parent: string;
  grandSireLabel: string;
  grandSire: string;
  grandDamLabel: string;
  grandDam: string;
}) {
  return (
    <div className="grid sm:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
      {/* Parent cell */}
      <div className="flex flex-col justify-center border-b border-line bg-brown p-5 text-warm-white sm:border-b-0 sm:border-r">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-warm-white/60">{label}</p>
        <p className="mt-1 font-serif text-2xl leading-tight">{parent}</p>
      </div>

      {/* Grandparents */}
      <div className="grid grid-cols-1 sm:grid-cols-2">
        <PedigreeCell label={grandSireLabel} value={grandSire} className="border-b border-line sm:border-b-0 sm:border-r" />
        <PedigreeCell label={grandDamLabel} value={grandDam} />
      </div>
    </div>
  );
}

function PedigreeCell({ label, value, className = "" }: { label: string; value: string; className?: string }) {
  return (
    <div className={`p-5 ${className}`}>
      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-earth">{label}</p>
      <p className="mt-1 text-[15px] text-charcoal">{value}</p>
    </div>
  );
}
