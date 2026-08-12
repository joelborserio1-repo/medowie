"use client";

import { useEffect, useRef } from "react";

/**
 * Plays a looping background video clipped to [startSeconds, endSeconds] —
 * both editable from /admin (Homepage → Hero Video). Native <video>
 * has no built-in trim, so this seeks to the start point once metadata is
 * ready and jumps back to it whenever playback reaches the end point,
 * instead of looping the whole file.
 *
 * Uses native addEventListener in a useEffect rather than React's
 * on-prop handlers: `loadedmetadata` doesn't bubble, and for a
 * preload="auto" video it can fire before hydration attaches React's
 * delegated listeners, so the synthetic handler silently never runs.
 * The readyState check below covers that case directly.
 *
 * Deliberately doesn't use the `autoPlay` or `loop` attributes:
 * - `autoPlay` races our own seek to `startSeconds` (the browser can start
 *   playback from 0 as soon as loadedmetadata fires, winning the race and
 *   silently dropping the seek) — calling play() ourselves, after seeking,
 *   avoids that.
 * - Native `loop` restarts from 0, not from `startSeconds` — so once
 *   `endSeconds` is unset and the clip plays out to its real end, every
 *   loop after the first would replay the untrimmed start. Handling `ended`
 *   ourselves keeps every loop trimmed the same way.
 */
export function HeroVideo({
  src,
  startSeconds,
  endSeconds,
}: {
  src: string;
  startSeconds?: number | null;
  endSeconds?: number | null;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const start = startSeconds ?? 0;

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    const applyStart = () => {
      if (start > 0) video.currentTime = start;
      video.play().catch(() => {});
    };

    if (video.readyState >= 1) {
      applyStart();
    } else {
      video.addEventListener("loadedmetadata", applyStart, { once: true });
    }

    const handleTimeUpdate = () => {
      if (endSeconds && video.currentTime >= endSeconds) {
        video.currentTime = start;
      }
    };
    const handleEnded = () => {
      video.currentTime = start;
      video.play().catch(() => {});
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("loadedmetadata", applyStart);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("ended", handleEnded);
    };
  }, [start, endSeconds]);

  return (
    <video
      ref={ref}
      className="absolute inset-0 h-full w-full object-cover motion-reduce:hidden"
      muted
      playsInline
      preload="auto"
      aria-hidden="true"
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
