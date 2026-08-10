import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Field, TextArea, Select, SubmitButton } from "@/components/admin/FormField";
import { updateContentBlock } from "./actions";

const STATUS_OPTIONS = [
  { value: "draft", label: "Draft (hidden)" },
  { value: "published", label: "Published" },
];

export default async function AdminSiteContentPage() {
  await requireAdmin();
  const supabase = await createClient();
  const { data: blocks } = await supabase.from("site_content_blocks").select("*").order("key");

  return (
    <div>
      <AdminPageHeader title="Site Content" />
      <p className="mb-6 max-w-xl text-sm text-grey">
        These blocks feed the homepage introduction, About, Training and Yearling Preparation pages. Draft
        blocks stay hidden from the public site until published.
      </p>

      <div className="space-y-4">
        {(blocks ?? []).map((block) => (
          <details key={block.id} className="border border-line bg-warm-white">
            <summary className="cursor-pointer px-5 py-4 text-sm font-semibold text-charcoal">
              {block.label}{" "}
              <span className="ml-2 text-xs font-normal uppercase tracking-wide text-grey">({block.status})</span>
            </summary>
            <div className="border-t border-line px-5 py-5">
              <form action={updateContentBlock.bind(null, block.id)} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Heading" name="heading" defaultValue={block.heading} />
                  <Select label="Status" name="status" defaultValue={block.status} options={STATUS_OPTIONS} />
                </div>
                <TextArea label="Body" name="body" defaultValue={block.body} rows={6} />
                <Field label="Image URL" name="image_url" defaultValue={block.image_url} />
                <SubmitButton label="Save" />
              </form>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
