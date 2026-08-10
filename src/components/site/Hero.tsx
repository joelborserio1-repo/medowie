import { BrandImage } from "@/components/ui/BrandImage";
import { Button } from "@/components/ui/Button";

export function Hero({ imageUrl }: { imageUrl?: string | null }) {
  return (
    <section className="relative flex h-[68vh] min-h-[440px] items-end overflow-hidden bg-brown text-warm-white">
      <div className="absolute inset-0">
        <BrandImage src={imageUrl} alt="Medowie Lodge" label="Medowie Lodge" className="opacity-90" />
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
