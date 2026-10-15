import Image from "next/image";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { MediaUploader } from "@/components/admin/MediaUploader";
import { CopyUrlButton } from "@/components/admin/CopyUrlButton";
import { deleteMediaAsset, updateMediaAlt } from "./actions";

const PAGE_SIZE = 60;

export default async function AdminMediaPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  await requireAdmin();
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const supabase = await createClient();
  const { data: assets } = await supabase
    .from("media_assets")
    .select("*")
    .order("created_at", { ascending: false })
    .range(from, to);

  const results = assets ?? [];
  const hasNextPage = results.length === PAGE_SIZE;

  return (
    <div>
      <AdminPageHeader title="Media Library" />
      <div className="mb-8">
        <MediaUploader />
      </div>

      {results.length === 0 && page === 1 && <p className="mb-4 text-xs text-grey">No media uploaded yet.</p>}

      <div className="grid gap-6 sm:grid-cols-3 lg:grid-cols-4">
        {results.map((asset) => (
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
      </div>

      {(page > 1 || hasNextPage) && (
        <div className="mt-8 flex items-center justify-between">
          {page > 1 ? (
            <Link href={`/admin/media?page=${page - 1}`} className="text-xs font-semibold uppercase tracking-[0.1em] text-orange hover:underline">
              ← Newer
            </Link>
          ) : (
            <span />
          )}
          {hasNextPage && (
            <Link href={`/admin/media?page=${page + 1}`} className="text-xs font-semibold uppercase tracking-[0.1em] text-orange hover:underline">
              Older →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
