import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BrandImage } from "@/components/ui/BrandImage";
import { formatDate } from "@/lib/format";
import { mediaUrl } from "@/lib/cms/media";
import { getNewsBySlug } from "@/lib/data/news";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = await getNewsBySlug(slug).catch(() => null);
  if (!article) return {};
  return {
    title: article.metaTitle ?? article.title,
    description: article.metaDescription ?? article.excerpt ?? undefined,
    alternates: { canonical: `/news/${slug}` },
  };
}

export default async function NewsArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getNewsBySlug(slug).catch(() => null);
  if (!article || article.state !== "published") notFound();

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    datePublished: article.publishedDate,
    author: article.author ? { "@type": "Person", name: article.author } : undefined,
  };

  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />

      <div className="relative aspect-[16/9] max-h-[480px] w-full sm:aspect-[21/9]">
        <BrandImage src={mediaUrl(article.heroImage)} alt={article.title} label={article.title} priority />
      </div>

      <div className="mx-auto w-full max-w-3xl px-5 py-12 sm:px-8">
        {article.category && <p className="eyebrow mb-3">{article.category}</p>}
        <h1 className="font-serif text-4xl text-brown">{article.title}</h1>
        <p className="mt-3 text-sm text-grey">
          {[formatDate(article.publishedDate), article.author].filter(Boolean).join(" · ")}
        </p>

        {article.body && (
          <div className="mt-8 whitespace-pre-line text-[16px] leading-relaxed text-charcoal">{article.body}</div>
        )}
      </div>
    </article>
  );
}
