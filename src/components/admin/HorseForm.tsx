import { Field, TextArea, Select, Checkbox, SubmitButton } from "@/components/admin/FormField";
import { upsertHorse } from "@/app/admin/(dashboard)/horses-for-sale/actions";
import type { HorseForSale } from "@/lib/supabase/types";

const STATUS_OPTIONS = [
  { value: "available", label: "Available" },
  { value: "under_offer", label: "Under Offer" },
  { value: "upcoming", label: "Upcoming" },
  { value: "sold", label: "Sold" },
  { value: "archive", label: "Archive" },
];

const SALE_TYPE_OPTIONS = [
  "Private Sale",
  "Yearling Sale",
  "Shares",
  "Broodmare",
  "Racehorse",
  "Weanling",
  "Other",
].map((v) => ({ value: v, label: v }));

const PRICE_TYPE_OPTIONS = [
  { value: "poa", label: "POA" },
  { value: "fixed", label: "Fixed Price" },
  { value: "shares", label: "Shares" },
];

const GAIT_OPTIONS = [
  { value: "", label: "Not set" },
  { value: "Pacer", label: "Pacer" },
  { value: "Trotter", label: "Trotter" },
];

export function HorseForm({ horse }: { horse?: HorseForSale }) {
  return (
    <form action={upsertHorse} className="space-y-10">
      {horse && <input type="hidden" name="id" value={horse.id} />}

      <section>
        <h2 className="mb-4 border-b border-line pb-2 font-serif text-lg text-brown">Identity</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Name" name="name" defaultValue={horse?.name} required />
          <Field label="Slug" name="slug" defaultValue={horse?.slug} required />
          <Select label="Status" name="status" defaultValue={horse?.status ?? "available"} options={STATUS_OPTIONS} />
          <Select label="Sale Type" name="sale_type" defaultValue={horse?.sale_type ?? "Private Sale"} options={SALE_TYPE_OPTIONS} />
          <Field label="Display Order" name="display_order" type="number" defaultValue={horse?.display_order ?? 0} />
        </div>
        <Checkbox label="Feature on homepage" name="featured" defaultChecked={horse?.featured} className="mt-4" />
      </section>

      <section>
        <h2 className="mb-4 border-b border-line pb-2 font-serif text-lg text-brown">Horse Details</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Year Foaled" name="year_foaled" type="number" defaultValue={horse?.year_foaled} />
          <Field label="Sex" name="sex" defaultValue={horse?.sex} />
          <Select label="Gait" name="gait" defaultValue={horse?.gait ?? ""} options={GAIT_OPTIONS} />
          <Field label="Colour" name="colour" defaultValue={horse?.colour} />
          <Field label="Sire" name="sire" defaultValue={horse?.sire} />
          <Field label="Dam" name="dam" defaultValue={horse?.dam} />
          <Field label="Damsire" name="damsire" defaultValue={horse?.damsire} />
          <Field label="Location" name="location" defaultValue={horse?.location} />
        </div>
        <TextArea label="Description" name="description" defaultValue={horse?.description} className="mt-4" />
      </section>

      <section>
        <h2 className="mb-4 border-b border-line pb-2 font-serif text-lg text-brown">Price</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <Select label="Price Type" name="price_type" defaultValue={horse?.price_type ?? "poa"} options={PRICE_TYPE_OPTIONS} />
          <Field label="Price (AUD)" name="price" type="number" step="0.01" defaultValue={horse?.price} />
          <Field label="Sold Price (AUD)" name="sold_price" type="number" step="0.01" defaultValue={horse?.sold_price} />
        </div>
        <Checkbox label="Show sold price publicly" name="show_sold_price" defaultChecked={horse?.show_sold_price} className="mt-4" />
      </section>

      <section>
        <h2 className="mb-4 border-b border-line pb-2 font-serif text-lg text-brown">Sale Record</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Sale Name" name="sale_name" defaultValue={horse?.sale_name} />
          <Field label="Sale Date" name="sale_date" type="date" defaultValue={horse?.sale_date} />
          <Field label="Lot Number" name="lot_number" defaultValue={horse?.lot_number} />
        </div>
      </section>

      <section>
        <h2 className="mb-4 border-b border-line pb-2 font-serif text-lg text-brown">Media &amp; Links</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Hero Image URL" name="hero_image_url" defaultValue={horse?.hero_image_url} />
          <Field label="Pedigree Document URL" name="pedigree_document_url" defaultValue={horse?.pedigree_document_url} />
          <Field label="Video URL" name="video_url" defaultValue={horse?.video_url} />
          <Field label="External Catalogue URL" name="external_catalogue_url" defaultValue={horse?.external_catalogue_url} />
        </div>
      </section>

      <SubmitButton label={horse ? "Save Horse" : "Create Listing"} />
    </form>
  );
}
