import { strapiFind } from "@/lib/cms/client";
import type { NewsArticle } from "@/lib/cms/types";

export async function getLatestNews(limit = 3): Promise<NewsArticle[]> {
  return strapiFind<NewsArticle>("/news-articles", {
    filters: { state: { $eq: "published" } },
    sort: ["publishedDate:desc"],
    pagination: { limit },
    populate: "*",
  });
}

export async function getAllNews(): Promise<NewsArticle[]> {
  return strapiFind<NewsArticle>("/news-articles", {
    filters: { state: { $eq: "published" } },
    sort: ["publishedDate:desc"],
    populate: "*",
  });
}

export async function getNewsBySlug(slug: string): Promise<NewsArticle | null> {
  const results = await strapiFind<NewsArticle>("/news-articles", {
    filters: { slug: { $eq: slug } },
    populate: "*",
  });
  return results[0] ?? null;
}
