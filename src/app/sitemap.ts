import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.medowielodge.com.au";

const STATIC_ROUTES = [
  "",
  "/stallions",
  "/training",
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
  const supabase = await createClient();

  const [{ data: stallions }, { data: horses }, { data: news }] = await Promise.all([
    supabase.from("stallions").select("slug, updated_at").eq("status", "published"),
    supabase.from("horses_for_sale").select("slug, updated_at").neq("status", "archive"),
    supabase.from("news").select("slug, updated_at").eq("status", "published"),
  ]);

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${siteUrl}${route}`,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.6,
  }));

  const stallionEntries: MetadataRoute.Sitemap = (stallions ?? []).map((s) => ({
    url: `${siteUrl}/stallions/${s.slug}`,
    lastModified: s.updated_at,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const horseEntries: MetadataRoute.Sitemap = (horses ?? []).map((h) => ({
    url: `${siteUrl}/horses-for-sale/${h.slug}`,
    lastModified: h.updated_at,
    changeFrequency: "weekly",
    priority: 0.5,
  }));

  const newsEntries: MetadataRoute.Sitemap = (news ?? []).map((n) => ({
    url: `${siteUrl}/news/${n.slug}`,
    lastModified: n.updated_at,
    changeFrequency: "monthly",
    priority: 0.4,
  }));

  return [...staticEntries, ...stallionEntries, ...horseEntries, ...newsEntries];
}
