import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { StallionForm } from "@/components/admin/StallionForm";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { GalleryManager } from "@/components/admin/GalleryManager";
import { DocumentManager } from "@/components/admin/DocumentManager";
import { Field, TextArea, SubmitButton, Checkbox } from "@/components/admin/FormField";
import {
  deleteStallion,
  duplicateStallion,
  addHighlight,
  deleteHighlight,
  addEligibility,
  deleteEligibility,
  addVideo,
  deleteVideo,
  addProgeny,
  deleteProgeny,
  bulkImportProgeny,
  upsertPedigree,
} from "../actions";

export default async function EditStallionPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ import?: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const { import: importResult } = await searchParams;
  const supabase = await createClient();

  const [{ data: stallion }, { data: highlights }, { data: eligibility }, { data: gallery }, { data: videos }, { data: documents }, { data: progeny }, { data: pedigree }] =
    await Promise.all([
      supabase.from("stallions").select("*").eq("id", id).maybeSingle(),
      supabase.from("stallion_highlights").select("*").eq("stallion_id", id).order("display_order"),
      supabase.from("stallion_eligibility").select("*").eq("stallion_id", id).order("display_order"),
      supabase.from("stallion_gallery").select("*").eq("stallion_id", id).order("display_order"),
      supabase.from("stallion_videos").select("*").eq("stallion_id", id).order("display_order"),
      supabase.from("stallion_documents").select("*").eq("stallion_id", id).order("display_order"),
      supabase.from("stallion_progeny").select("*").eq("stallion_id", id).order("display_order"),
      supabase.from("stallion_pedigree").select("*").eq("stallion_id", id).maybeSingle(),
    ]);

  if (!stallion) notFound();

  const deleteAction = deleteStallion.bind(null, id);
  const duplicateAction = duplicateStallion.bind(null, id);
  const addHighlightAction = addHighlight.bind(null, id);
  const addEligibilityAction = addEligibility.bind(null, id);
  const addVideoAction = addVideo.bind(null, id);
  const addProgenyAction = addProgeny.bind(null, id);
  const bulkImportProgenyAction = bulkImportProgeny.bind(null, id);
  const savePedigreeAction = upsertPedigree.bind(null, id);

  const importMessage =
    importResult === "empty" || importResult === "none"
      ? "No valid rows were found — check the data and try again."
      : importResult && /^\d+$/.test(importResult)
        ? `Imported ${importResult} progeny record${importResult === "1" ? "" : "s"}.`
        : null;

  return (
    <div>
      <AdminPageHeader title={`Edit — ${stallion.name}`} />

      <div className="mb-8 flex gap-4">
        <form action={duplicateAction}>
          <button type="submit" className="text-xs font-semibold uppercase tracking-wide text-charcoal hover:text-orange">
            Duplicate
          </button>
        </form>
        <DeleteButton action={deleteAction} confirmMessage={`Delete ${stallion.name}? This cannot be undone.`} />
      </div>

      <StallionForm stallion={stallion} />

      {/* Career Highlights */}
      <section className="mt-14 border-t border-line pt-8">
        <h2 className="mb-4 font-serif text-xl text-brown">Career Highlights</h2>
        <ul className="mb-4 divide-y divide-line border-y border-line">
          {(highlights ?? []).map((h) => (
            <li key={h.id} className="flex items-center justify-between gap-4 py-2 text-sm">
              <span>
                {h.year} — {h.race} ({h.result}) {h.track}
              </span>
              <form action={deleteHighlight.bind(null, id, h.id)}>
                <button className="text-xs text-grey hover:text-orange-dark">Remove</button>
              </form>
            </li>
          ))}
        </ul>
        <form action={addHighlightAction} className="grid gap-3 sm:grid-cols-6">
          <Field label="Year" name="year" />
          <Field label="Race" name="race" className="sm:col-span-2" />
          <Field label="Grade" name="grade" />
          <Field label="Result" name="result" />
          <Field label="Track" name="track" />
          <Field label="Notes" name="notes" className="sm:col-span-6" />
          <div className="sm:col-span-6">
            <SubmitButton label="Add Highlight" />
          </div>
        </form>
      </section>

      {/* Eligibility */}
      <section className="mt-14 border-t border-line pt-8">
        <h2 className="mb-4 font-serif text-xl text-brown">Eligible Schemes</h2>
        <div className="mb-4 flex flex-wrap gap-2">
          {(eligibility ?? []).map((e) => (
            <form key={e.id} action={deleteEligibility.bind(null, id, e.id)}>
              <button className="border border-line px-3 py-1 text-xs text-charcoal hover:border-orange">
                {e.label} ×
              </button>
            </form>
          ))}
        </div>
        <form action={addEligibilityAction} className="flex gap-3">
          <Field label="Add scheme" name="label" className="flex-1" />
          <div className="self-end">
            <SubmitButton label="Add" />
          </div>
        </form>
      </section>

      {/* Pedigree */}
      <section className="mt-14 border-t border-line pt-8">
        <h2 className="mb-4 font-serif text-xl text-brown">Pedigree</h2>
        <form action={savePedigreeAction} className="grid gap-4 sm:grid-cols-2">
          <Field label="Sire's Sire" name="sires_sire" defaultValue={pedigree?.sires_sire} />
          <Field label="Sire's Dam" name="sires_dam" defaultValue={pedigree?.sires_dam} />
          <Field label="Dam's Sire" name="dams_sire" defaultValue={pedigree?.dams_sire} />
          <Field label="Dam's Dam" name="dams_dam" defaultValue={pedigree?.dams_dam} />
          <div className="sm:col-span-2">
            <SubmitButton label="Save Pedigree" />
          </div>
        </form>
      </section>

      {/* Gallery */}
      <section className="mt-14 border-t border-line pt-8">
        <h2 className="mb-2 font-serif text-xl text-brown">Photo Carousel</h2>
        <p className="mb-4 text-sm text-grey">
          These photos appear in the image carousel at the top of the stallion&apos;s page.
        </p>
        <GalleryManager
          stallionId={id}
          folder={stallion.slug}
          images={(gallery ?? []).map((g) => ({ id: g.id, image_url: g.image_url, alt_text: g.alt_text }))}
        />
      </section>

      {/* Videos */}
      <section className="mt-14 border-t border-line pt-8">
        <h2 className="mb-4 font-serif text-xl text-brown">Videos</h2>
        <ul className="mb-4 divide-y divide-line border-y border-line">
          {(videos ?? []).map((v) => (
            <li key={v.id} className="flex items-center justify-between gap-4 py-2 text-sm">
              <span className="truncate">{v.title ?? v.youtube_url}</span>
              <form action={deleteVideo.bind(null, id, v.id)}>
                <button className="shrink-0 text-xs text-grey hover:text-orange-dark">Remove</button>
              </form>
            </li>
          ))}
        </ul>
        <form action={addVideoAction} className="grid gap-3 sm:grid-cols-3">
          <Field label="YouTube URL" name="youtube_url" className="sm:col-span-2" />
          <Field label="Title" name="title" />
          <div className="sm:col-span-3">
            <SubmitButton label="Add Video" />
          </div>
        </form>
      </section>

      {/* Documents */}
      <section className="mt-14 border-t border-line pt-8">
        <h2 className="mb-2 font-serif text-xl text-brown">Contracts &amp; Forms</h2>
        <p className="mb-4 text-sm text-grey">
          PDFs listed in the &ldquo;Contracts &amp; Forms&rdquo; section on the stallion&apos;s page.
        </p>
        <DocumentManager
          stallionId={id}
          folder={stallion.slug}
          documents={(documents ?? []).map((d) => ({ id: d.id, title: d.title, file_url: d.file_url }))}
        />
      </section>

      {/* Progeny */}
      <section className="mt-14 border-t border-line pt-8">
        <h2 className="mb-1 font-serif text-xl text-brown">Progeny</h2>
        <p className="mb-4 text-sm text-grey">
          {(progeny ?? []).length} record{(progeny ?? []).length === 1 ? "" : "s"} on file.
        </p>

        {importMessage && (
          <p className="mb-6 rounded-brand border border-line bg-parchment px-4 py-3 text-sm text-charcoal">
            {importMessage}
          </p>
        )}

        {/* Bulk import from Excel */}
        <div className="mb-8 rounded-brand border border-line bg-parchment p-5">
          <h3 className="font-serif text-lg text-brown">Bulk Import from Spreadsheet</h3>
          <p className="mt-1 text-sm text-grey">
            Copy the rows straight out of Excel (or paste CSV) and drop them in below. Use this exact column
            order — a header row is optional and skipped automatically:
          </p>
          <p className="mt-2 overflow-x-auto whitespace-nowrap rounded-brand border border-line bg-warm-white px-3 py-2 font-mono text-[11px] text-charcoal">
            Name | Foaling Date | Dam | Broodmare Sire | Country of Birth | Sex | Lifetime Prizemoney | Best
            Mile Rate | Lifetime Starts | Lifetime Wins
          </p>
          <form action={bulkImportProgenyAction} className="mt-4">
            <TextArea
              label="Paste rows"
              name="rows"
              rows={6}
              placeholder={"Smooth Satin\t12/09/2019\tSilk Stockings\tArt Major\tAUS\tMare\t184300\t1:52.3\t41\t9"}
            />
            <div className="mt-3 flex flex-wrap items-center gap-6">
              <Checkbox label="Replace all existing progeny for this stallion" name="mode" value="replace" />
              <SubmitButton label="Import Progeny" />
            </div>
          </form>
        </div>

        {/* Existing progeny */}
        <ul className="mb-6 divide-y divide-line border-y border-line">
          {(progeny ?? []).map((p) => (
            <li key={p.id} className="flex items-center justify-between gap-4 py-2 text-sm">
              <span className="text-charcoal">
                {p.name} {p.featured && <span className="text-orange">★</span>}
                <span className="ml-2 text-xs text-grey">
                  {[p.dam, p.mile_rate, p.wins ? `${p.wins} wins` : null].filter(Boolean).join(" · ")}
                </span>
              </span>
              <form action={deleteProgeny.bind(null, id, p.id)}>
                <button className="shrink-0 text-xs text-grey hover:text-orange-dark">Remove</button>
              </form>
            </li>
          ))}
          {(progeny ?? []).length === 0 && (
            <li className="py-3 text-sm text-grey">No progeny recorded yet.</li>
          )}
        </ul>

        {/* Add a single progeny */}
        <h3 className="mb-3 font-serif text-lg text-brown">Add a Single Runner</h3>
        <form action={addProgenyAction} className="grid gap-3 sm:grid-cols-4">
          <Field label="Name" name="name" />
          <Field label="Foaling Date" name="foaled_date" type="date" />
          <Field label="Sex" name="sex" />
          <Field label="Country of Birth" name="country_of_birth" />
          <Field label="Dam" name="dam" />
          <Field label="Broodmare Sire" name="damsire" />
          <Field label="Best Mile Rate" name="mile_rate" />
          <Field label="Lifetime Prizemoney" name="earnings" type="number" step="0.01" />
          <Field label="Lifetime Starts" name="starts" type="number" />
          <Field label="Lifetime Wins" name="wins" type="number" />
          <TextArea label="Description (optional)" name="description" className="sm:col-span-4" rows={2} />
          <Checkbox label="Mark as notable progeny" name="featured" />
          <div className="sm:col-span-4">
            <SubmitButton label="Add Progeny" />
          </div>
        </form>
      </section>
    </div>
  );
}
