import { Field, TextArea, Select, SubmitButton } from "@/components/admin/FormField";
import { upsertNews } from "@/app/admin/(dashboard)/news/actions";
import type { NewsArticle, Stallion, HorseForSale } from "@/lib/supabase/types";

const STATUS_OPTIONS = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
  { value: "archived", label: "Archived" },
];

const CATEGORY_OPTIONS = ["Stallions", "Racing", "Progeny", "Breeding", "Yearlings", "Medowie Lodge"].map((v) => ({
  value: v,
  label: v,
}));

export function NewsForm({
  article,
  stallions,
  horses,
}: {
  article?: NewsArticle;
  stallions: Pick<Stallion, "id" | "name">[];
  horses: Pick<HorseForSale, "id" | "name">[];
}) {
  return (
    <form action={upsertNews} className="space-y-6">
      {article && <input type="hidden" name="id" value={article.id} />}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Title" name="title" defaultValue={article?.title} required />
        <Field label="Slug" name="slug" defaultValue={article?.slug} required />
        <Select label="Category" name="category" defaultValue={article?.category ?? ""} options={[{ value: "", label: "None" }, ...CATEGORY_OPTIONS]} />
        <Field label="Published Date" name="published_date" type="date" defaultValue={article?.published_date} />
        <Field label="Author" name="author" defaultValue={article?.author} />
        <Select label="Status" name="status" defaultValue={article?.status ?? "draft"} options={STATUS_OPTIONS} />
        <Select
          label="Related Stallion"
          name="related_stallion_id"
          defaultValue={article?.related_stallion_id ?? ""}
          options={[{ value: "", label: "None" }, ...stallions.map((s) => ({ value: s.id, label: s.name }))]}
        />
        <Select
          label="Related Horse"
          name="related_horse_id"
          defaultValue={article?.related_horse_id ?? ""}
          options={[{ value: "", label: "None" }, ...horses.map((h) => ({ value: h.id, label: h.name }))]}
        />
      </div>
      <Field label="Hero Image URL" name="hero_image_url" defaultValue={article?.hero_image_url} />
      <TextArea label="Excerpt" name="excerpt" defaultValue={article?.excerpt} rows={2} />
      <TextArea label="Body" name="body" defaultValue={article?.body} rows={10} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Meta Title" name="meta_title" defaultValue={article?.meta_title} />
        <Field label="Meta Description" name="meta_description" defaultValue={article?.meta_description} />
      </div>
      <SubmitButton label={article ? "Save Article" : "Create Article"} />
    </form>
  );
}
