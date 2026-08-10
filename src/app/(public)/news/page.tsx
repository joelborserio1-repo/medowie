import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/site/PageHero";
import { BrandImage } from "@/components/ui/BrandImage";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatDate } from "@/lib/format";
import { mediaUrl } from "@/lib/cms/media";
import { getAllNews } from "@/lib/data/news";

export const metadata: Metadata = {
  title: "News",
  description: "Stallion announcements, race results and breeding news from Medowie Lodge.",
  alternates: { canonical: "/news" },
};

export default async function NewsIndexPage() {
  const articles = await getAllNews().catch(() => []);

  return (
    <div>
      <PageHero eyebrow="Medowie Lodge" heading="News" intro="Stallion announcements, race results and breeding news." />

      <section className="py-14">
        <div className="mx-auto w-full max-w-[1400px] px-5 sm:px-8">
          {articles.length === 0 ? (
            <EmptyState heading="No news yet" message="Announcements will appear here as they're published." />
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {articles.map((article) => (
                <Link key={article.id} href={`/news/${article.slug}`} className="group block">
                  <div className="relative aspect-[4/3]">
                    <BrandImage src={mediaUrl(article.heroImage)} alt={article.title} label={article.title} />
                  </div>
                  {article.category && <p className="eyebrow mt-4 text-[10px]">{article.category}</p>}
                  <h2 className="mt-1.5 font-serif text-lg text-brown group-hover:underline">{article.title}</h2>
                  {article.publishedDate && <p className="mt-1 text-xs text-grey">{formatDate(article.publishedDate)}</p>}
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
