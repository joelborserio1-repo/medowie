import type { MetadataRoute } from "next";
import { getPublishedStallions } from "@/lib/data/stallions";
import { getAvailableHorses, getArchivedHorses } from "@/lib/data/horses";
import { getAllNews } from "@/lib/data/news";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.medowielodge.com.au";

const STATIC_ROUTES = [
  "",
  "/stallions",
  "/yearling-preparation",
  "/horses-for-sale",
  "/about",
  "/forms",
  "/contact",
  "/book-a-mare",
  "/news",
  "/results",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [stallions, availableHorses, archivedHorses, news] = await Promise.all([
    getPublishedStallions().catch(() => []),
    getAvailableHorses().catch(() => []),
    getArchivedHorses().catch(() => []),
    getAllNews().catch(() => []),
  ]);

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${siteUrl}${route}`,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.6,
  }));

  const stallionEntries: MetadataRoute.Sitemap = stallions.map((s) => ({
    url: `${siteUrl}/stallions/${s.slug}`,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const horseEntries: MetadataRoute.Sitemap = [...availableHorses, ...archivedHorses].map((h) => ({
    url: `${siteUrl}/horses-for-sale/${h.slug}`,
    changeFrequency: "weekly",
    priority: 0.5,
  }));

  const newsEntries: MetadataRoute.Sitemap = news.map((n) => ({
    url: `${siteUrl}/news/${n.slug}`,
    changeFrequency: "monthly",
    priority: 0.4,
  }));

  return [...staticEntries, ...stallionEntries, ...horseEntries, ...newsEntries];
}
