import Image from "next/image";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { MediaUploader } from "@/components/admin/MediaUploader";
import { CopyUrlButton } from "@/components/admin/CopyUrlButton";
import { deleteMediaAsset, updateMediaAlt } from "./actions";

export default async function AdminMediaPage() {
  await requireAdmin();
  const supabase = await createClient();
  const { data: assets } = await supabase.from("media_assets").select("*").order("created_at", { ascending: false });

  return (
    <div>
      <AdminPageHeader title="Media Library" />
      <div className="mb-8">
        <MediaUploader />
      </div>

      <div className="grid gap-6 sm:grid-cols-3 lg:grid-cols-4">
        {(assets ?? []).map((asset) => (
          <div key={asset.id} className="border border-line bg-warm-white">
            <div className="relative aspect-square bg-parchment">
              {asset.url.match(/\.(png|jpe?g|webp|gif)$/i) ? (
                <Image src={asset.url} alt={asset.alt_text ?? ""} fill className="object-cover" unoptimized />
              ) : (
                <div className="flex h-full items-center justify-center text-xs text-grey">Document</div>
              )}
            </div>
            <div className="p-3">
              <p className="truncate text-xs text-grey">{asset.path}</p>
              <form action={updateMediaAlt.bind(null, asset.id)} className="mt-2">
                <input
                  name="alt_text"
                  defaultValue={asset.alt_text ?? ""}
                  placeholder="Alt text"
                  className="w-full border border-line px-2 py-1.5 text-xs"
                  onBlur={(e) => e.currentTarget.form?.requestSubmit()}
                />
              </form>
              <div className="mt-2 flex items-center justify-between">
                <CopyUrlButton url={asset.url} />
                <form action={deleteMediaAsset.bind(null, asset.id, asset.bucket, asset.path)}>
                  <button className="text-xs text-grey hover:text-orange-dark">Delete</button>
                </form>
              </div>
            </div>
          </div>
        ))}
        {(assets ?? []).length === 0 && <p className="text-sm text-grey">No media uploaded yet.</p>}
      </div>
    </div>
  );
}
