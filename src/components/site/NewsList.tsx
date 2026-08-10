import Link from "next/link";
import { BrandImage } from "@/components/ui/BrandImage";
import { formatDate } from "@/lib/format";
import { mediaUrl } from "@/lib/cms/media";
import type { NewsArticle } from "@/lib/cms/types";

export function NewsList({ articles }: { articles: NewsArticle[] }) {
  if (articles.length === 0) return null;

  return (
    <section className="border-t border-line py-16 sm:py-24">
      <div className="mx-auto w-full max-w-[1400px] px-5 sm:px-8">
        <div className="flex items-end justify-between">
          <div>
            <p className="eyebrow mb-3">Latest from Medowie</p>
            <h2 className="font-serif text-3xl text-brown sm:text-4xl">News</h2>
          </div>
          <Link href="/news" className="hidden text-xs font-semibold uppercase tracking-[0.1em] text-orange sm:block">
            View All
          </Link>
        </div>

        <div className="mt-8 grid gap-8 sm:grid-cols-3">
          {articles.map((article) => (
            <Link key={article.id} href={`/news/${article.slug}`} className="group block">
              <div className="relative aspect-[4/3]">
                <BrandImage src={mediaUrl(article.heroImage)} alt={article.title} label={article.title} />
              </div>
              {article.category && <p className="eyebrow mt-4 text-[10px]">{article.category}</p>}
              <h3 className="mt-1.5 font-serif text-lg text-brown group-hover:underline">{article.title}</h3>
              {article.publishedDate && (
                <p className="mt-1 text-xs text-grey">{formatDate(article.publishedDate)}</p>
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
