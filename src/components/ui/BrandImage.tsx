import Image from "next/image";
import { clsx } from "clsx";

/**
 * Renders a Supabase-hosted photo, or — when none has been uploaded yet — a
 * plain brand-toned panel with the subject's name. No stock or AI imagery.
 */
export function BrandImage({
  src,
  alt,
  label,
  className,
  sizes,
  priority,
  fill = true,
}: {
  src: string | null | undefined;
  alt: string;
  label?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  fill?: boolean;
}) {
  if (!src) {
    return (
      <div
        className={clsx(
          "flex items-center justify-center bg-parchment",
          fill ? "absolute inset-0" : "h-full w-full",
          className
        )}
        role="img"
        aria-label={alt}
      >
        <div className="px-6 text-center">
          <p className="eyebrow text-earth">Photograph pending</p>
          {label && <p className="mt-2 font-serif text-lg text-brown">{label}</p>}
        </div>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      sizes={sizes ?? "100vw"}
      priority={priority}
      className={clsx("object-cover", className)}
    />
  );
}
