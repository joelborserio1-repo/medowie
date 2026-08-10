import type { Metadata } from "next";
import { cormorant, inter } from "@/lib/fonts";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { getSiteSettings } from "@/lib/data/settings";
import "../globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.medowielodge.com.au";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings().catch(() => null);
  const title = settings?.seo_default_title ?? "Medowie Lodge — Standardbred Stud & Harness Racing Stables";
  const description =
    settings?.seo_default_description ??
    "Medowie Lodge is a Standardbred stud and harness racing stable at Medowie, NSW.";

  return {
    metadataBase: new URL(siteUrl),
    title: { default: title, template: "%s — Medowie Lodge" },
    description,
    openGraph: {
      title,
      description,
      url: siteUrl,
      siteName: "Medowie Lodge",
      locale: "en_AU",
      type: "website",
      images: settings?.og_image_url ? [settings.og_image_url] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: { canonical: "/" },
  };
}

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings().catch(() => null);

  const localBusinessJsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: settings?.business_name ?? "Medowie Lodge",
    description: settings?.seo_default_description,
    telephone: settings?.phone,
    email: settings?.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: settings?.address_line1,
      addressLocality: settings?.suburb,
      addressRegion: settings?.state,
      postalCode: settings?.postcode,
      addressCountry: "AU",
    },
    url: siteUrl,
    sameAs: settings?.facebook_url ? [settings.facebook_url] : undefined,
  };

  return (
    <html lang="en-AU" className={`${cormorant.variable} ${inter.variable}`}>
      <body className="flex min-h-screen flex-col antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:bg-orange focus:px-4 focus:py-2 focus:text-warm-white"
        >
          Skip to content
        </a>
        <Header />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
