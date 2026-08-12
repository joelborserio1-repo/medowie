"use client";

import { useState } from "react";
import Image from "next/image";

export interface CarouselImage {
  src: string;
  alt: string;
}

export function StallionImageCarousel({
  images,
  fallbackLabel,
}: {
  images: CarouselImage[];
  fallbackLabel: string;
}) {
  const [active, setActive] = useState(0);

  if (images.length === 0) {
    return (
      <div
        className="flex aspect-[4/3] items-center justify-center bg-parchment"
        role="img"
        aria-label={fallbackLabel}
      >
        <div className="px-6 text-center">
          <p className="eyebrow text-earth">Photograph pending</p>
          <p className="mt-2 font-serif text-2xl text-brown">{fallbackLabel}</p>
        </div>
      </div>
    );
  }

  const total = images.length;
  const current = images[Math.min(active, total - 1)];
  const goTo = (i: number) => setActive((i + total) % total);

  return (
    <div>
      <div className="relative aspect-[4/3] overflow-hidden bg-charcoal">
        <Image
          key={current.src}
          src={current.src}
          alt={current.alt}
          fill
          priority
          sizes="(min-width: 1024px) 55vw, 100vw"
          className="object-cover"
        />

        {total > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous photo"
              onClick={() => goTo(active - 1)}
              className="absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-brown/70 text-lg text-warm-white transition-colors hover:bg-brown"
            >
              &#8249;
            </button>
            <button
              type="button"
              aria-label="Next photo"
              onClick={() => goTo(active + 1)}
              className="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-brown/70 text-lg text-warm-white transition-colors hover:bg-brown"
            >
              &#8250;
            </button>
            <span className="absolute bottom-3 right-3 rounded-full bg-brown/80 px-3 py-1 text-xs font-semibold tracking-[0.08em] text-warm-white">
              {Math.min(active, total - 1) + 1} / {total}
            </span>
          </>
        )}
      </div>

      {total > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={img.src}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show photo ${i + 1}`}
              aria-current={i === active}
              className={`relative h-16 w-24 flex-shrink-0 overflow-hidden border-2 transition-colors ${
                i === active ? "border-orange" : "border-transparent hover:border-line"
              }`}
            >
              <Image src={img.src} alt="" fill sizes="96px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
