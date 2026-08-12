import { Field, TextArea, Select, Checkbox, SubmitButton } from "@/components/admin/FormField";
import { upsertStallion } from "@/app/admin/(dashboard)/stallions/actions";
import type { Stallion } from "@/lib/supabase/types";

const STATUS_OPTIONS = [
  { value: "admin_review", label: "Admin Review Required" },
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
  { value: "archived", label: "Archived" },
];

const GAIT_OPTIONS = [
  { value: "", label: "Not set" },
  { value: "Pacer", label: "Pacer" },
  { value: "Trotter", label: "Trotter" },
];

export function StallionForm({ stallion }: { stallion?: Stallion }) {
  return (
    <form action={upsertStallion} className="space-y-10">
      {stallion && <input type="hidden" name="id" value={stallion.id} />}

      <section>
        <h2 className="mb-4 border-b border-line pb-2 font-serif text-lg text-brown">Identity</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Name" name="name" defaultValue={stallion?.name} required />
          <Field label="Slug" name="slug" defaultValue={stallion?.slug} required />
          <Field label="Country Suffix" name="country_suffix" defaultValue={stallion?.country_suffix} />
          <Select label="Gait" name="gait" defaultValue={stallion?.gait ?? ""} options={GAIT_OPTIONS} />
          <Select label="Status" name="status" defaultValue={stallion?.status ?? "admin_review"} options={STATUS_OPTIONS} />
          <Field label="Display Order" name="display_order" type="number" defaultValue={stallion?.display_order ?? 0} />
        </div>
        <Checkbox label="Feature on homepage" name="featured" defaultChecked={stallion?.featured} className="mt-4" />
      </section>

      <section>
        <h2 className="mb-4 border-b border-line pb-2 font-serif text-lg text-brown">Pedigree &amp; Breeding</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Sire" name="sire" defaultValue={stallion?.sire} />
          <Field label="Dam" name="dam" defaultValue={stallion?.dam} />
          <Field label="Damsire" name="damsire" defaultValue={stallion?.damsire} />
          <Field label="Colour" name="colour" defaultValue={stallion?.colour} />
          <Field label="Foaled Date" name="foaled_date" type="date" defaultValue={stallion?.foaled_date} />
          <Field label="Height" name="height" defaultValue={stallion?.height} />
        </div>
      </section>

      <section>
        <h2 className="mb-4 border-b border-line pb-2 font-serif text-lg text-brown">Service Fee</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Service Fee (AUD)" name="service_fee" type="number" step="0.01" defaultValue={stallion?.service_fee} />
          <Field label="Fee Notes" name="fee_notes" defaultValue={stallion?.fee_notes} className="sm:col-span-2" />
        </div>
        <Checkbox label="Fee includes GST" name="includes_gst" defaultChecked={stallion?.includes_gst ?? true} className="mt-4" />
      </section>

      <section>
        <h2 className="mb-4 border-b border-line pb-2 font-serif text-lg text-brown">Racing Statistics</h2>
        <p className="mb-3 text-xs text-grey">Leave blank if unverified — blank fields are hidden on the public page.</p>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Mile Rate" name="mile_rate" defaultValue={stallion?.mile_rate} />
          <Field label="Career Earnings (AUD)" name="career_earnings" type="number" step="0.01" defaultValue={stallion?.career_earnings} />
          <Field label="Starts" name="starts" type="number" defaultValue={stallion?.starts} />
          <Field label="Wins" name="wins" type="number" defaultValue={stallion?.wins} />
          <Field label="Seconds" name="seconds" type="number" defaultValue={stallion?.seconds} />
          <Field label="Thirds" name="thirds" type="number" defaultValue={stallion?.thirds} />
        </div>
      </section>

      <section>
        <h2 className="mb-4 border-b border-line pb-2 font-serif text-lg text-brown">Copy</h2>
        <div className="grid gap-4">
          <Field label="Headline" name="headline" defaultValue={stallion?.headline} />
          <TextArea label="Short Description" name="short_description" defaultValue={stallion?.short_description} rows={3} />
          <TextArea label="Full Biography" name="full_biography" defaultValue={stallion?.full_biography} rows={8} />
          <TextArea label="Mating Information" name="mating_information" defaultValue={stallion?.mating_information} rows={5} />
          <Field label="Mating Hints PDF URL" name="mating_pdf_url" defaultValue={stallion?.mating_pdf_url} />
        </div>
      </section>

      <section>
        <h2 className="mb-4 border-b border-line pb-2 font-serif text-lg text-brown">Semen &amp; Availability</h2>
        <div className="flex flex-wrap gap-6">
          <Checkbox label="Chilled semen — Australia" name="semen_chilled_au" defaultChecked={stallion?.semen_chilled_au} />
          <Checkbox label="Frozen semen — Australia" name="semen_frozen_au" defaultChecked={stallion?.semen_frozen_au} />
          <Checkbox label="Frozen semen — New Zealand" name="semen_frozen_nz" defaultChecked={stallion?.semen_frozen_nz} />
        </div>
        <TextArea label="Availability Notes" name="semen_notes" defaultValue={stallion?.semen_notes} rows={3} className="mt-4" />
      </section>

      <section>
        <h2 className="mb-4 border-b border-line pb-2 font-serif text-lg text-brown">Images &amp; Documents</h2>
        <p className="mb-3 text-xs text-grey">
          Upload photos on the Media page, then paste the resulting URL here.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Hero Image URL" name="hero_image_url" defaultValue={stallion?.hero_image_url} />
          <Field label="Profile Image URL" name="profile_image_url" defaultValue={stallion?.profile_image_url} />
          <Field label="Card Image URL" name="card_image_url" defaultValue={stallion?.card_image_url} />
          <Field label="Pedigree Document URL" name="pedigree_document_url" defaultValue={stallion?.pedigree_document_url} />
        </div>
      </section>

      <section>
        <h2 className="mb-4 border-b border-line pb-2 font-serif text-lg text-brown">SEO</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Meta Title" name="meta_title" defaultValue={stallion?.meta_title} />
          <Field label="Meta Description" name="meta_description" defaultValue={stallion?.meta_description} />
        </div>
      </section>

      <SubmitButton label={stallion ? "Save Stallion" : "Create Stallion"} />
    </form>
  );
}
