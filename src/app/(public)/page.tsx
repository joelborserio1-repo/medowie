import { Hero } from "@/components/site/Hero";
import { OperationIntro } from "@/components/site/OperationIntro";
import { ResultsList } from "@/components/site/ResultsList";
import { NewsList } from "@/components/site/NewsList";
import { ContactCta } from "@/components/site/ContactCta";
import { HorsesForSalePreview } from "@/components/site/HorsesForSalePreview";
import { FacebookFeed } from "@/components/site/FacebookFeed";
import { StallionCard } from "@/components/stallions/StallionCard";
import { FeaturedStallion } from "@/components/stallions/FeaturedStallion";
import { Button } from "@/components/ui/Button";
import { BrandImage } from "@/components/ui/BrandImage";
import { getFeaturedStallion, getPublishedStallions } from "@/lib/data/stallions";
import { getAvailableHorses } from "@/lib/data/horses";
import { getLatestResults } from "@/lib/data/results";
import { getLatestNews } from "@/lib/data/news";
import { getHomepage, getSiteSettings } from "@/lib/data/settings";
import { mediaUrl } from "@/lib/cms/media";

export default async function HomePage() {
  const [stallions, featured, horses, results, news, intro, settings] = await Promise.all([
    getPublishedStallions().catch(() => []),
    getFeaturedStallion().catch(() => null),
    getAvailableHorses(3).catch(() => []),
    getLatestResults(5).catch(() => []),
    getLatestNews(3).catch(() => []),
    getHomepage().catch(() => null),
    getSiteSettings().catch(() => null),
  ]);

  const otherStallions = featured ? stallions.filter((s) => s.id !== featured.id) : stallions;

  return (
    <>
      <Hero
        videoUrl={mediaUrl(intro?.heroVideo)}
        videoStartSeconds={intro?.heroVideoStartSeconds}
        videoEndSeconds={intro?.heroVideoEndSeconds}
      />

      {intro?.introBody && (
        <section className="py-16 sm:py-24">
          <div className="mx-auto grid w-full max-w-[1400px] gap-8 px-5 sm:px-8 md:grid-cols-[220px_1fr]">
            <p className="eyebrow">{intro.introHeading ?? "Medowie Lodge"}</p>
            <div className="max-w-2xl whitespace-pre-line text-[17px] leading-relaxed text-charcoal">
              {intro.introBody}
            </div>
          </div>
        </section>
      )}

      <section className="border-t border-line py-16 sm:py-24">
        <div className="mx-auto w-full max-w-[1400px] px-5 sm:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow mb-3">Standing at Medowie</p>
              <h2 className="font-serif text-3xl text-brown sm:text-4xl">Current Stallions</h2>
            </div>
            <Button href="/stallions" variant="secondary">
              View All Stallions
            </Button>
          </div>

          {stallions.length === 0 ? (
            <p className="mt-8 text-sm text-grey">
              Stallion listings are being finalised for this season — contact Medowie Lodge directly for
              current availability.
            </p>
          ) : (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {(featured ? otherStallions : stallions).slice(0, 6).map((s) => (
                <StallionCard key={s.id} stallion={s} />
              ))}
            </div>
          )}
        </div>
      </section>

      {featured && (
        <section className="border-t border-line py-16 sm:py-24">
          <div className="mx-auto w-full max-w-[1400px] px-5 sm:px-8">
            <FeaturedStallion stallion={featured} />
          </div>
        </section>
      )}

      <OperationIntro />

      <section className="border-t border-line py-16 sm:py-24">
        <div className="mx-auto grid w-full max-w-[1400px] gap-10 px-5 sm:px-8 lg:grid-cols-2 lg:items-center">
          <div className="relative aspect-[4/3]">
            <BrandImage src={null} alt="Race training at Medowie Lodge" label="Race Training" />
          </div>
          <div>
            <p className="eyebrow mb-3">Training</p>
            <h2 className="font-serif text-3xl text-brown sm:text-4xl">
              Breaking-in, race training and preparation.
            </h2>
            <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-grey">
              Darren Reay and team at Medowie Lodge provide breaking-in, yearling preparation and race
              training from the property at Medowie, NSW.
            </p>
            <div className="mt-6">
              <Button href="/training" variant="secondary">
                View Training Services
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-line py-16 sm:py-24">
        <div className="mx-auto grid w-full max-w-[1400px] gap-10 px-5 sm:px-8 lg:grid-cols-2 lg:items-center">
          <div className="order-2 lg:order-1">
            <p className="eyebrow mb-3">Yearling Preparation</p>
            <h2 className="font-serif text-3xl text-brown sm:text-4xl">
              Presented annually at the Sydney and Bathurst sales.
            </h2>
            <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-grey">
              Medowie Lodge presents well-bred, hand-raised yearlings at both the Sydney APG Yearling Sale
              and the Bathurst Yearling Sale, held during February and March each year.
            </p>
            <div className="mt-6">
              <Button href="/yearling-preparation" variant="secondary">
                View Yearling Preparation
              </Button>
            </div>
          </div>
          <div className="relative order-1 aspect-[4/3] lg:order-2">
            <BrandImage src={null} alt="Yearling preparation at Medowie Lodge" label="Yearling Preparation" />
          </div>
        </div>
      </section>

      <HorsesForSalePreview horses={horses} />

      <section className="border-t border-line py-16 text-center sm:py-24">
        <div className="mx-auto w-full max-w-[1400px] px-5 sm:px-8">
          <p className="eyebrow mb-3">Bloodlines</p>
          <h2 className="font-serif text-4xl leading-tight text-brown sm:text-5xl">
            Breeding for performance.
          </h2>
        </div>
      </section>

      <ResultsList results={results} />
      <NewsList articles={news} />
      <FacebookFeed facebookUrl={settings?.facebookUrl} />

      <ContactCta settings={settings} />
    </>
  );
}
