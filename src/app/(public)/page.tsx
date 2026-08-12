import Image from "next/image";
import { Hero } from "@/components/site/Hero";
import { ResultsList } from "@/components/site/ResultsList";
import { NewsList } from "@/components/site/NewsList";
import { HorsesForSalePreview } from "@/components/site/HorsesForSalePreview";
import { FacebookFeed } from "@/components/site/FacebookFeed";
import { StallionCard } from "@/components/stallions/StallionCard";
import { FeaturedStallion } from "@/components/stallions/FeaturedStallion";
import { Button } from "@/components/ui/Button";
import { getFeaturedStallion, getPublishedStallions } from "@/lib/data/stallions";
import { getAvailableHorses } from "@/lib/data/horses";
import { getLatestResults } from "@/lib/data/results";
import { getLatestNews } from "@/lib/data/news";
import { getContentBlock, getSiteSettings } from "@/lib/data/settings";

export default async function HomePage() {
  const [stallions, featured, horses, results, news, intro, settings] = await Promise.all([
    getPublishedStallions().catch(() => []),
    getFeaturedStallion().catch(() => null),
    getAvailableHorses(3).catch(() => []),
    getLatestResults(5).catch(() => []),
    getLatestNews(3).catch(() => []),
    getContentBlock("homepage_intro").catch(() => null),
    getSiteSettings().catch(() => null),
  ]);

  const otherStallions = featured ? stallions.filter((s) => s.id !== featured.id) : stallions;

  return (
    <>
      <Hero
        videoUrl={settings?.hero_video_url}
        videoStartSeconds={settings?.hero_video_start_seconds}
        videoEndSeconds={settings?.hero_video_end_seconds}
      />

      {intro?.body && (
        <section className="py-16 sm:py-24">
          <div className="mx-auto grid w-full max-w-[1400px] gap-8 px-5 sm:px-8 md:grid-cols-[220px_1fr]">
            <p className="eyebrow">{intro.heading ?? "Medowie Lodge"}</p>
            <div className="max-w-2xl whitespace-pre-line text-[17px] leading-relaxed text-charcoal">
              {intro.body}
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

      <section className="border-t border-line py-16 sm:py-24">
        <div className="mx-auto grid w-full max-w-[1400px] gap-10 px-5 sm:px-8 lg:grid-cols-2 lg:items-center">
          <div className="relative aspect-[4/3]">
            <Image
              src="/home/stud.webp"
              alt="Medowie Lodge — Stud and Yearling Preparation"
              width={1625}
              height={968}
              className="h-full w-full object-cover"
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
          </div>
          <div>
            <p className="eyebrow mb-3">The Medowie Lodge Operation</p>
            <h2 className="font-serif text-3xl text-brown sm:text-4xl">
              Stud and yearling preparation under one property.
            </h2>
            <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-grey">
              Quality stallions with chilled and frozen semen available, and well-bred, hand-raised
              yearlings presented annually at the Sydney APG and Bathurst Yearling Sales.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button href="/stallions" variant="secondary">
                View Stallions
              </Button>
              <Button href="/yearling-preparation" variant="secondary">
                View Yearling Preparation
              </Button>
            </div>
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
      <FacebookFeed facebookUrl={settings?.facebook_url} />
    </>
  );
}
