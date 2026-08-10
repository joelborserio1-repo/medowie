import { strapiFind } from "@/lib/cms/client";
import type { Stallion } from "@/lib/cms/types";

export async function getPublishedStallions(): Promise<Stallion[]> {
  return strapiFind<Stallion>("/stallions", {
    filters: { state: { $eq: "published" } },
    sort: ["displayOrder:asc"],
    populate: "*",
  });
}

export async function getArchivedStallions(): Promise<Stallion[]> {
  return strapiFind<Stallion>("/stallions", {
    filters: { state: { $eq: "archived" } },
    sort: ["displayOrder:asc"],
    populate: "*",
  });
}

export async function getFeaturedStallion(): Promise<Stallion | null> {
  const results = await strapiFind<Stallion>("/stallions", {
    filters: { state: { $eq: "published" }, featured: { $eq: true } },
    sort: ["displayOrder:asc"],
    pagination: { limit: 1 },
    populate: "*",
  });
  return results[0] ?? null;
}

export async function getStallionBySlug(slug: string): Promise<Stallion | null> {
  const results = await strapiFind<Stallion>("/stallions", {
    filters: { slug: { $eq: slug } },
    populate: "*",
  });
  return results[0] ?? null;
}

export async function getStallionNavItems(): Promise<Pick<Stallion, "name" | "slug" | "countrySuffix">[]> {
  try {
    return await strapiFind<Stallion>("/stallions", {
      filters: { state: { $eq: "published" } },
      sort: ["displayOrder:asc"],
      fields: ["name", "slug", "countrySuffix"],
    });
  } catch {
    return [];
  }
}
