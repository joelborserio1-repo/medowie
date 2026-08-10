import { formatDate, formatFee } from "@/lib/format";
import type { Stallion, StallionEligibility } from "@/lib/cms/types";

export function BreedingInformation({
  stallion,
  eligibility,
}: {
  stallion: Stallion;
  eligibility: StallionEligibility[];
}) {
  const rows = [
    { label: "Service Fee", value: formatFee(stallion.serviceFee, stallion.includesGst) },
    { label: "Gait", value: stallion.gait },
    { label: "Foaled", value: formatDate(stallion.foaledDate) },
    { label: "Height", value: stallion.height },
    { label: "Colour", value: stallion.colour },
    { label: "Country", value: stallion.countrySuffix },
    { label: "Sire", value: stallion.sire },
    { label: "Dam", value: stallion.dam },
    { label: "Damsire", value: stallion.damsire },
  ].filter((r) => r.value);

  return (
    <section className="border-b border-line py-14">
      <div className="mx-auto w-full max-w-[1400px] px-5 sm:px-8">
        <p className="eyebrow mb-3">Details</p>
        <h2 className="font-serif text-3xl text-brown">Breeding Information</h2>

        <dl className="mt-8 grid gap-x-8 gap-y-4 sm:grid-cols-3">
          {rows.map((r) => (
            <div key={r.label} className="border-t border-line pt-3">
              <dt className="text-[11px] font-semibold uppercase tracking-[0.08em] text-earth">{r.label}</dt>
              <dd className="mt-1 text-sm text-charcoal">{r.value}</dd>
            </div>
          ))}
        </dl>

        {stallion.semenNotes && <p className="mt-6 text-sm text-grey">{stallion.semenNotes}</p>}

        {eligibility.length > 0 && (
          <div className="mt-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-earth">Eligible Schemes</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {eligibility.map((e) => (
                <span key={e.id} className="border border-line px-3 py-1 text-xs text-charcoal">
                  {e.label}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
