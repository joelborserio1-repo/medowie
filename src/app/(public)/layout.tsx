import type { Metadata } from "next";
import { cormorant, inter } from "@/lib/fonts";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { getSiteSettings } from "@/lib/data/settings";
import { mediaUrl } from "@/lib/cms/media";
import "../globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.medowielodge.com.au";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings().catch(() => null);
  const title = settings?.seoDefaultTitle ?? "Medowie Lodge — Standardbred Stud & Harness Racing Stables";
  const description =
    settings?.seoDefaultDescription ??
    "Medowie Lodge is a Standardbred stud and harness racing stable at Medowie, NSW.";
  const ogImage = mediaUrl(settings?.ogImage);

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
      images: ogImage ? [ogImage] : undefined,
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
    name: settings?.businessName ?? "Medowie Lodge",
    description: settings?.seoDefaultDescription,
    telephone: settings?.phone,
    email: settings?.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: settings?.addressLine1,
      addressLocality: settings?.suburb,
      addressRegion: settings?.state,
      postalCode: settings?.postcode,
      addressCountry: "AU",
    },
    url: siteUrl,
    sameAs: settings?.facebookUrl ? [settings.facebookUrl] : undefined,
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
