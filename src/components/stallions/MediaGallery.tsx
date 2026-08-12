"use client";

import { useState } from "react";
import Image from "next/image";
import { mediaUrl, type StrapiMedia } from "@/lib/cms/media";
import type { StallionVideo } from "@/lib/cms/types";

function youtubeId(url: string): string | null {
  const match = url.match(/(?:youtu\.be\/|v=)([\w-]{11})/);
  return match ? match[1] : null;
}

type Slide =
  | { kind: "image"; key: string; src: string; alt: string; thumb: string }
  | { kind: "video"; key: string; embedUrl: string; title: string; thumb: string };

export function MediaGallery({ gallery, videos }: { gallery: StrapiMedia[]; videos: StallionVideo[] }) {
  const imageSlides: Slide[] = gallery.flatMap((img) => {
    const src = mediaUrl(img);
    if (!src) return [];
    return [{ kind: "image" as const, key: `img-${img.id}`, src, alt: img.alternativeText ?? "", thumb: src }];
  });

  const videoSlides: Slide[] = videos.flatMap((v) => {
    const id = youtubeId(v.youtubeUrl);
    if (!id) return [];
    return [
      {
        kind: "video" as const,
        key: `video-${v.id}`,
        embedUrl: `https://www.youtube.com/embed/${id}`,
        title: v.title ?? "Stallion video",
        thumb: `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
      },
    ];
  });

  const slides = [...imageSlides, ...videoSlides];
  const [active, setActive] = useState(0);

  if (slides.length === 0) return null;

  const current = slides[active];
  const goTo = (i: number) => setActive((i + slides.length) % slides.length);

  return (
    <section className="border-b border-line py-14">
      <div className="mx-auto w-full max-w-[1400px] px-5 sm:px-8">
        <p className="eyebrow mb-3">Gallery</p>
        <h2 className="font-serif text-3xl text-brown">Media</h2>

        <div className="relative mt-8 aspect-video bg-charcoal">
          {current.kind === "image" ? (
            <Image src={current.src} alt={current.alt} fill sizes="(min-width: 1024px) 1400px, 100vw" className="object-contain" />
          ) : (
            <iframe
              key={current.key}
              src={`${current.embedUrl}?autoplay=0`}
              title={current.title}
              className="absolute inset-0 h-full w-full"
              allowFullScreen
            />
          )}

          {slides.length > 1 && (
            <>
              <button
                type="button"
                aria-label="Previous"
                onClick={() => goTo(active - 1)}
                className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center bg-warm-white/90 text-brown hover:bg-warm-white"
              >
                ‹
              </button>
              <button
                type="button"
                aria-label="Next"
                onClick={() => goTo(active + 1)}
                className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center bg-warm-white/90 text-brown hover:bg-warm-white"
              >
                ›
              </button>
            </>
          )}
        </div>

        {slides.length > 1 && (
          <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
            {slides.map((slide, i) => (
              <button
                key={slide.key}
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Show slide ${i + 1}`}
                className={`relative h-16 w-24 flex-shrink-0 overflow-hidden border-2 ${
                  i === active ? "border-orange" : "border-transparent"
                }`}
              >
                <Image src={slide.thumb} alt="" fill sizes="96px" className="object-cover" unoptimized={slide.kind === "video"} />
                {slide.kind === "video" && (
                  <span className="absolute inset-0 flex items-center justify-center bg-charcoal/30 text-warm-white">▶</span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
