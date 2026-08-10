import { strapiFind } from "@/lib/cms/client";
import type { HorseForSale } from "@/lib/cms/types";

export async function getAvailableHorses(limit?: number): Promise<HorseForSale[]> {
  return strapiFind<HorseForSale>("/horses-for-sale", {
    filters: { state: { $in: ["available", "under_offer", "upcoming"] } },
    sort: ["displayOrder:asc"],
    populate: "*",
    pagination: limit ? { limit } : undefined,
  });
}

export async function getArchivedHorses(): Promise<HorseForSale[]> {
  return strapiFind<HorseForSale>("/horses-for-sale", {
    filters: { state: { $in: ["sold", "archive"] } },
    sort: ["saleDate:desc"],
    populate: "*",
  });
}

export async function getHorseBySlug(slug: string): Promise<HorseForSale | null> {
  const results = await strapiFind<HorseForSale>("/horses-for-sale", {
    filters: { slug: { $eq: slug } },
    populate: "*",
  });
  return results[0] ?? null;
}
