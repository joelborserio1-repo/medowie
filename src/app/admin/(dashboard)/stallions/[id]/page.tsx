import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { StallionForm } from "@/components/admin/StallionForm";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { Field, TextArea, SubmitButton, Checkbox } from "@/components/admin/FormField";
import {
  deleteStallion,
  duplicateStallion,
  addHighlight,
  deleteHighlight,
  addEligibility,
  deleteEligibility,
  addGalleryImage,
  deleteGalleryImage,
  addVideo,
  deleteVideo,
  addDocument,
  deleteDocument,
  addProgeny,
  deleteProgeny,
  upsertPedigree,
} from "../actions";

export default async function EditStallionPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
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
  const addGalleryAction = addGalleryImage.bind(null, id);
  const addVideoAction = addVideo.bind(null, id);
  const addDocumentAction = addDocument.bind(null, id);
  const addProgenyAction = addProgeny.bind(null, id);
  const savePedigreeAction = upsertPedigree.bind(null, id);

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
        <h2 className="mb-4 font-serif text-xl text-brown">Media Gallery</h2>
        <ul className="mb-4 divide-y divide-line border-y border-line">
          {(gallery ?? []).map((g) => (
            <li key={g.id} className="flex items-center justify-between gap-4 py-2 text-sm">
              <span className="truncate">{g.image_url}</span>
              <form action={deleteGalleryImage.bind(null, id, g.id)}>
                <button className="shrink-0 text-xs text-grey hover:text-orange-dark">Remove</button>
              </form>
            </li>
          ))}
        </ul>
        <form action={addGalleryAction} className="grid gap-3 sm:grid-cols-3">
          <Field label="Image URL" name="image_url" className="sm:col-span-2" />
          <Field label="Alt Text" name="alt_text" />
          <div className="sm:col-span-3">
            <SubmitButton label="Add Image" />
          </div>
        </form>
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
        <h2 className="mb-4 font-serif text-xl text-brown">Documents</h2>
        <ul className="mb-4 divide-y divide-line border-y border-line">
          {(documents ?? []).map((d) => (
            <li key={d.id} className="flex items-center justify-between gap-4 py-2 text-sm">
              <span className="truncate">{d.title}</span>
              <form action={deleteDocument.bind(null, id, d.id)}>
                <button className="shrink-0 text-xs text-grey hover:text-orange-dark">Remove</button>
              </form>
            </li>
          ))}
        </ul>
        <form action={addDocumentAction} className="grid gap-3 sm:grid-cols-3">
          <Field label="Title" name="title" />
          <Field label="File URL" name="file_url" className="sm:col-span-2" />
          <div className="sm:col-span-3">
            <SubmitButton label="Add Document" />
          </div>
        </form>
      </section>

      {/* Progeny */}
      <section className="mt-14 border-t border-line pt-8">
        <h2 className="mb-4 font-serif text-xl text-brown">Progeny</h2>
        <ul className="mb-4 divide-y divide-line border-y border-line">
          {(progeny ?? []).map((p) => (
            <li key={p.id} className="flex items-center justify-between gap-4 py-2 text-sm">
              <span>
                {p.name} {p.featured && <span className="text-orange">★</span>}
              </span>
              <form action={deleteProgeny.bind(null, id, p.id)}>
                <button className="text-xs text-grey hover:text-orange-dark">Remove</button>
              </form>
            </li>
          ))}
        </ul>
        <form action={addProgenyAction} className="grid gap-3 sm:grid-cols-4">
          <Field label="Name" name="name" />
          <Field label="Sex" name="sex" />
          <Field label="Foaled Year" name="foaled_year" type="number" />
          <Field label="Dam" name="dam" />
          <Field label="Damsire" name="damsire" />
          <Field label="Mile Rate" name="mile_rate" />
          <Field label="Wins" name="wins" type="number" />
          <Field label="Earnings" name="earnings" type="number" step="0.01" />
          <Field label="Image URL" name="image_url" className="sm:col-span-2" />
          <Field label="Profile URL" name="profile_url" className="sm:col-span-2" />
          <TextArea label="Notes" name="notes" className="sm:col-span-4" rows={2} />
          <Checkbox label="Feature this progeny" name="featured" />
          <div className="sm:col-span-4">
            <SubmitButton label="Add Progeny" />
          </div>
        </form>
      </section>
    </div>
  );
}
