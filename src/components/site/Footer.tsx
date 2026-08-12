import Link from "next/link";
import { getSiteSettings } from "@/lib/data/settings";

const FOOTER_LINKS = [
  { label: "Stallions", href: "/stallions" },
  { label: "Yearling Preparation", href: "/yearling-preparation" },
  { label: "Horses for Sale", href: "/horses-for-sale" },
  { label: "Contact", href: "/contact" },
];

export async function Footer() {
  const settings = await getSiteSettings().catch(() => null);

  const year = new Date().getFullYear();

  return (
    <footer className="bg-brown text-warm-white">
      <div className="mx-auto grid w-full max-w-[1400px] gap-10 px-5 py-14 sm:px-8 md:grid-cols-3">
        <div>
          <p className="font-serif text-xl">MEDOWIE LODGE</p>
          <p className="mt-2 text-sm text-warm-white/70">
            Standardbred Stud &amp; Racing Stables
            <br />
            {settings?.suburb ?? "Medowie"} {settings?.state ?? "NSW"}
          </p>
        </div>

        <nav aria-label="Footer" className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
          {FOOTER_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="text-warm-white/80 hover:text-orange">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="text-sm text-warm-white/80">
          {settings?.phone && (
            <p>
              <a href={`tel:${settings.phone.replace(/\s+/g, "")}`} className="hover:text-orange">
                {settings.phone}
              </a>
            </p>
          )}
          {settings?.email && (
            <p className="mt-1">
              <a href={`mailto:${settings.email}`} className="hover:text-orange">
                {settings.email}
              </a>
            </p>
          )}
          {settings?.facebook_url && (
            <p className="mt-4">
              <a
                href={settings.facebook_url}
                target="_blank"
                rel="noreferrer"
                className="hover:text-orange"
              >
                Facebook
              </a>
            </p>
          )}
        </div>
      </div>

      <div className="border-t border-warm-white/15">
        <div className="mx-auto w-full max-w-[1400px] px-5 py-5 text-xs leading-relaxed text-warm-white/60 sm:px-8">
          <p>© {year} Medowie Lodge.</p>
          <p>Website information subject to change. Service fees and availability should be confirmed directly with Medowie Lodge.</p>
        </div>
      </div>
    </footer>
  );
}
