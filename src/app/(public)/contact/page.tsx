import type { Metadata } from "next";
import { PageHero } from "@/components/site/PageHero";
import { ContactForm } from "@/components/forms/ContactForm";
import { Button } from "@/components/ui/Button";
import { getSiteSettings } from "@/lib/data/settings";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Medowie Lodge for stallion bookings, training and general enquiries.",
  alternates: { canonical: "/contact" },
};

const ENQUIRY_TYPES = [
  {
    label: "Breeding Enquiries",
    copy: "Stallion bookings, semen orders and breeding questions — contact Darren Reay directly.",
    href: "/book-a-mare",
    cta: "Book a Mare",
  },
  {
    label: "Training Enquiries",
    copy: "Race training, breaking-in and yearling preparation enquiries.",
    href: "/training",
    cta: "Training Enquiry",
  },
  {
    label: "General Enquiries",
    copy: "For anything else, use the form below or contact Medowie Lodge directly.",
    href: "#contact-form",
    cta: "Send a Message",
  },
];

export default async function ContactPage() {
  const settings = await getSiteSettings().catch(() => null);
  const address = [settings?.address_line1, settings?.address_line2, settings?.suburb, settings?.state, settings?.postcode]
    .filter(Boolean)
    .join(", ");
  const mapQuery = address ? encodeURIComponent(`Medowie Lodge, ${address}, Australia`) : null;

  return (
    <div>
      <PageHero eyebrow="Get in Touch" heading="Contact" />

      <section className="border-b border-line py-14">
        <div className="mx-auto grid w-full max-w-[1400px] gap-8 px-5 sm:px-8 md:grid-cols-3">
          {ENQUIRY_TYPES.map((type) => (
            <div key={type.label} className="border border-line p-6">
              <h2 className="font-serif text-xl text-brown">{type.label}</h2>
              <p className="mt-2 text-sm leading-relaxed text-grey">{type.copy}</p>
              <a href={type.href} className="mt-4 inline-block text-xs font-semibold uppercase tracking-[0.1em] text-orange hover:underline">
                {type.cta} →
              </a>
            </div>
          ))}
        </div>
      </section>

      <section className="border-b border-line py-14">
        <div className="mx-auto grid w-full max-w-[1400px] gap-12 px-5 sm:px-8 lg:grid-cols-[360px_1fr]">
          <div>
            <p className="eyebrow mb-2">Medowie Lodge</p>
            {settings?.email && <p className="font-serif text-2xl text-brown">Darren Reay</p>}
            {address && <p className="mt-3 text-sm leading-relaxed text-grey">{address}</p>}

            <div className="mt-6 space-y-1 text-sm">
              {settings?.phone && (
                <p>
                  <a href={`tel:${settings.phone.replace(/\s+/g, "")}`} className="text-charcoal hover:text-orange">
                    {settings.phone}
                  </a>
                </p>
              )}
              {settings?.email && (
                <p>
                  <a href={`mailto:${settings.email}`} className="text-charcoal hover:text-orange">
                    {settings.email}
                  </a>
                </p>
              )}
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row lg:flex-col">
              {settings?.phone && (
                <Button href={`tel:${settings.phone.replace(/\s+/g, "")}`} variant="secondary" className="w-full">
                  Call
                </Button>
              )}
              {settings?.email && (
                <Button href={`mailto:${settings.email}`} variant="secondary" className="w-full">
                  Email
                </Button>
              )}
              {mapQuery && (
                <Button href={`https://www.google.com/maps/dir/?api=1&destination=${mapQuery}`} variant="secondary" className="w-full">
                  Directions
                </Button>
              )}
            </div>

            {settings?.facebook_url && (
              <a href={settings.facebook_url} target="_blank" rel="noreferrer" className="mt-6 inline-block text-sm font-semibold text-orange hover:underline">
                Facebook →
              </a>
            )}
          </div>

          <div id="contact-form">
            <ContactForm />
          </div>
        </div>
      </section>

      {mapQuery && (
        <section className="h-[420px] w-full">
          <iframe
            title="Medowie Lodge location"
            src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
            className="h-full w-full border-0"
            loading="lazy"
          />
        </section>
      )}
    </div>
  );
}
