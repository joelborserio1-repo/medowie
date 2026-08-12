import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { HorseForm } from "@/components/admin/HorseForm";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { Field, SubmitButton } from "@/components/admin/FormField";
import { deleteHorse, addHorseGalleryImage, deleteHorseGalleryImage } from "../actions";

export default async function EditHorsePage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: horse }, { data: gallery }] = await Promise.all([
    supabase.from("horses_for_sale").select("*").eq("id", id).maybeSingle(),
    supabase.from("horse_gallery").select("*").eq("horse_id", id).order("display_order"),
  ]);

  if (!horse) notFound();

  const deleteAction = deleteHorse.bind(null, id);
  const addGalleryAction = addHorseGalleryImage.bind(null, id);

  return (
    <div>
      <AdminPageHeader title={`Edit — ${horse.name}`} />

      <div className="mb-8">
        <DeleteButton action={deleteAction} confirmMessage={`Delete ${horse.name}? This cannot be undone.`} />
      </div>

      <HorseForm horse={horse} />

      <section className="mt-14 border-t border-line pt-8">
        <h2 className="mb-4 font-serif text-xl text-brown">Gallery</h2>
        <ul className="mb-4 divide-y divide-line border-y border-line">
          {(gallery ?? []).map((g) => (
            <li key={g.id} className="flex items-center justify-between gap-4 py-2 text-sm">
              <span className="truncate">{g.image_url}</span>
              <form action={deleteHorseGalleryImage.bind(null, id, g.id)}>
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
    </div>
  );
}
