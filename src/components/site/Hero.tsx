import { BrandImage } from "@/components/ui/BrandImage";
import { Button } from "@/components/ui/Button";

export function Hero({ imageUrl }: { imageUrl?: string | null }) {
  return (
    <section className="relative flex h-[68vh] min-h-[440px] items-end overflow-hidden bg-brown text-warm-white">
      <div className="absolute inset-0">
        {/* Static fallback: shown for prefers-reduced-motion, and while/if the video doesn't load. The
            video sits on top at full opacity so this never shows through once it's playing. */}
        <BrandImage src={imageUrl} alt="Medowie Lodge" label="Medowie Lodge" className="opacity-90" />
        <video
          className="absolute inset-0 h-full w-full object-cover motion-reduce:hidden"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
        >
          <source src="/video/hero.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/10 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1400px] px-5 pb-12 sm:px-8 sm:pb-16">
        <p className="eyebrow mb-3 text-warm-white/90">Medowie, New South Wales</p>
        <h1 className="font-serif text-5xl leading-[1.05] sm:text-7xl">Medowie Lodge</h1>
        <p className="mt-3 text-sm font-semibold uppercase tracking-[0.16em] text-warm-white/85 sm:text-base">
          Standardbred Stud &amp; Racing Stables
        </p>
        <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-warm-white/85">
          Breeding, training and preparing Standardbreds from Medowie in the Hunter Region of New South
          Wales.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Button href="/stallions">View Our Stallions</Button>
          <Button href="/book-a-mare" variant="ghost">
            Book a Mare
          </Button>
        </div>
      </div>
    </section>
  );
}
