import type { StallionVideo } from "@/lib/supabase/types";

function youtubeId(url: string): string | null {
  const match = url.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/);
  return match ? match[1] : null;
}

/**
 * Video Replays — a clean, responsive grid of embedded YouTube videos.
 * Supports any number of videos per stallion; new videos added in the admin
 * simply flow into the grid, so the layout never needs reworking.
 */
export function VideoReplays({ videos }: { videos: StallionVideo[] }) {
  const embeds = videos
    .map((v) => ({ video: v, id: youtubeId(v.youtube_url) }))
    .filter((e): e is { video: StallionVideo; id: string } => Boolean(e.id));

  if (embeds.length === 0) return null;

  return (
    <section id="videos" className="scroll-mt-24 border-b border-line py-14">
      <div className="mx-auto w-full max-w-[1400px] px-5 sm:px-8">
        <p className="eyebrow mb-3">Replays</p>
        <h2 className="font-serif text-3xl text-brown">Video Replays</h2>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {embeds.map(({ video, id }) => (
            <figure key={video.id} className="overflow-hidden rounded-brand border border-line bg-warm-white">
              <div className="relative aspect-video bg-charcoal">
                <iframe
                  src={`https://www.youtube.com/embed/${id}`}
                  title={video.title ?? "Stallion race replay"}
                  className="absolute inset-0 h-full w-full"
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              {video.title && (
                <figcaption className="px-4 py-3 text-sm font-medium text-charcoal">{video.title}</figcaption>
              )}
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
