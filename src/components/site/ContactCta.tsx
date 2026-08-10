import { BrandImage } from "@/components/ui/BrandImage";
import { Button } from "@/components/ui/Button";
import type { SiteSettings } from "@/lib/cms/types";

export function ContactCta({ settings }: { settings: SiteSettings | null }) {
  return (
    <section className="relative flex min-h-[420px] items-center overflow-hidden bg-brown text-warm-white">
      <div className="absolute inset-0">
        <BrandImage src={null} alt="Medowie Lodge" label="Medowie Lodge" className="opacity-30" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1400px] px-5 py-16 sm:px-8">
        <p className="eyebrow mb-3 text-warm-white/90">Breeding Enquiries</p>
        <h2 className="max-w-xl font-serif text-3xl sm:text-4xl">
          For stallion bookings, semen orders and breeding enquiries, contact Darren Reay.
        </h2>

        <div className="mt-8 flex flex-wrap items-center gap-x-10 gap-y-4">
          {settings?.phone && (
            <div>
              <p className="eyebrow text-[10px] text-warm-white/70">Phone</p>
              <p className="mt-1 font-serif text-2xl">{settings.phone}</p>
            </div>
          )}
          {settings?.email && (
            <div>
              <p className="eyebrow text-[10px] text-warm-white/70">Email</p>
              <p className="mt-1 font-serif text-2xl">{settings.email}</p>
            </div>
          )}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          {settings?.phone && (
            <Button href={`tel:${settings.phone.replace(/\s+/g, "")}`} variant="ghost">
              Call Darren
            </Button>
          )}
          {settings?.email && (
            <Button href={`mailto:${settings.email}`} variant="ghost">
              Email Medowie Lodge
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
