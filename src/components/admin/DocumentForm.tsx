import { Field, TextArea, Select, Checkbox, SubmitButton } from "@/components/admin/FormField";
import { upsertDocument } from "@/app/admin/(dashboard)/forms/actions";
import type { DocumentRecord, Stallion } from "@/lib/supabase/types";

const CATEGORY_OPTIONS = [
  "Stallion Service Contracts",
  "Semen Order Forms",
  "Breeding Information",
  "Other Documents",
].map((v) => ({ value: v, label: v }));

export function DocumentForm({ document, stallions }: { document?: DocumentRecord; stallions: Pick<Stallion, "id" | "name">[] }) {
  return (
    <form action={upsertDocument} className="space-y-6">
      {document && <input type="hidden" name="id" value={document.id} />}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Title" name="title" defaultValue={document?.title} required />
        <Select label="Category" name="category" defaultValue={document?.category ?? "Other Documents"} options={CATEGORY_OPTIONS} />
        <Field label="Season (e.g. 2026/2027)" name="season" defaultValue={document?.season} />
        <Select
          label="Stallion (optional)"
          name="stallion_id"
          defaultValue={document?.stallion_id ?? ""}
          options={[{ value: "", label: "None" }, ...stallions.map((s) => ({ value: s.id, label: s.name }))]}
        />
        <Field label="File URL" name="file_url" defaultValue={document?.file_url} required className="sm:col-span-2" />
      </div>
      <TextArea label="Description" name="description" defaultValue={document?.description} rows={3} />
      <Checkbox label="Active (visible on Forms & Contracts page)" name="active" defaultChecked={document?.active ?? true} />
      <SubmitButton label={document ? "Save Document" : "Add Document"} />
    </form>
  );
}
