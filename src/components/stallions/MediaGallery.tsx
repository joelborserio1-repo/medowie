import { BrandImage } from "@/components/ui/BrandImage";
import type { StallionGalleryImage, StallionVideo } from "@/lib/supabase/types";

function youtubeEmbedUrl(url: string): string | null {
  const match = url.match(/(?:youtu\.be\/|v=)([\w-]{11})/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
}

export function MediaGallery({ gallery, videos }: { gallery: StallionGalleryImage[]; videos: StallionVideo[] }) {
  if (gallery.length === 0 && videos.length === 0) return null;

  return (
    <section className="border-b border-line py-14">
      <div className="mx-auto w-full max-w-[1400px] px-5 sm:px-8">
        <p className="eyebrow mb-3">Gallery</p>
        <h2 className="font-serif text-3xl text-brown">Media</h2>

        {gallery.length > 0 && (
          <div className="mt-8 grid gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {gallery.map((img) => (
              <div key={img.id} className="relative aspect-square">
                <BrandImage src={img.image_url} alt={img.alt_text ?? ""} />
              </div>
            ))}
          </div>
        )}

        {videos.length > 0 && (
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {videos.map((v) => {
              const embed = youtubeEmbedUrl(v.youtube_url);
              return (
                <div key={v.id}>
                  {embed && (
                    <div className="relative aspect-video">
                      <iframe
                        src={embed}
                        title={v.title ?? "Stallion video"}
                        className="absolute inset-0 h-full w-full border border-line"
                        allowFullScreen
                      />
                    </div>
                  )}
                  {v.title && <p className="mt-2 text-sm text-grey">{v.title}</p>}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
