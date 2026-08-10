import { strapiFind } from "@/lib/cms/client";
import type { Result } from "@/lib/cms/types";

export async function getLatestResults(limit = 5): Promise<Result[]> {
  return strapiFind<Result>("/results", {
    filters: { state: { $eq: "published" } },
    sort: ["date:desc"],
    pagination: { limit },
    populate: "*",
  });
}

export async function getAllResults(): Promise<Result[]> {
  return strapiFind<Result>("/results", {
    filters: { state: { $eq: "published" } },
    sort: ["date:desc"],
    populate: "*",
  });
}
