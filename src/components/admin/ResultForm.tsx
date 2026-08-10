import { Field, TextArea, Select, SubmitButton } from "@/components/admin/FormField";
import { upsertResult } from "@/app/admin/(dashboard)/results/actions";
import type { Result } from "@/lib/supabase/types";

const STATUS_OPTIONS = [
  { value: "published", label: "Published" },
  { value: "draft", label: "Draft" },
];

export function ResultForm({ result }: { result?: Result }) {
  return (
    <form action={upsertResult} className="space-y-6">
      {result && <input type="hidden" name="id" value={result.id} />}
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Date" name="date" type="date" defaultValue={result?.date} required />
        <Field label="Horse" name="horse" defaultValue={result?.horse} required className="sm:col-span-2" />
        <Field label="Race" name="race" defaultValue={result?.race} />
        <Field label="Track" name="track" defaultValue={result?.track} />
        <Field label="Placing" name="placing" defaultValue={result?.placing} />
        <Field label="Trainer" name="trainer" defaultValue={result?.trainer} />
        <Field label="Driver" name="driver" defaultValue={result?.driver} />
        <Field label="Time" name="time" defaultValue={result?.time} />
        <Field label="Image URL" name="image_url" defaultValue={result?.image_url} className="sm:col-span-2" />
        <Field label="External Results URL" name="external_url" defaultValue={result?.external_url} className="sm:col-span-3" />
        <Select label="Status" name="status" defaultValue={result?.status ?? "published"} options={STATUS_OPTIONS} />
      </div>
      <TextArea label="Description" name="description" defaultValue={result?.description} />
      <SubmitButton label={result ? "Save Result" : "Add Result"} />
    </form>
  );
}
