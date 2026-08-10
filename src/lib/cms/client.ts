import "server-only";

const STRAPI_URL = process.env.STRAPI_URL ?? "http://localhost:1337";

type QueryValue = string | number | boolean | null | undefined | QueryObject | QueryValue[];
interface QueryObject {
  [key: string]: QueryValue;
}

/** Builds Strapi's bracketed query string (filters[key][$eq]=value) from a plain object. */
function serializeQuery(params: QueryObject, prefix = ""): string[] {
  const parts: string[] = [];

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) continue;
    const paramKey = prefix ? `${prefix}[${key}]` : key;

    if (Array.isArray(value)) {
      value.forEach((item, i) => {
        if (typeof item === "object" && item !== null) {
          parts.push(...serializeQuery(item as QueryObject, `${paramKey}[${i}]`));
        } else {
          parts.push(`${encodeURIComponent(`${paramKey}[${i}]`)}=${encodeURIComponent(String(item))}`);
        }
      });
    } else if (typeof value === "object") {
      parts.push(...serializeQuery(value as QueryObject, paramKey));
    } else {
      parts.push(`${encodeURIComponent(paramKey)}=${encodeURIComponent(String(value))}`);
    }
  }

  return parts;
}

export interface StrapiListResponse<T> {
  data: T[];
  meta: { pagination: { page: number; pageSize: number; pageCount: number; total: number } };
}

export interface StrapiSingleResponse<T> {
  data: T | null;
}

/**
 * Fetches from Strapi's REST API. Server-only — never called from a Client
 * Component. Revalidates every 60s (ISR-style); pass revalidate to override.
 */
export async function strapiFetch<T>(
  path: string,
  query?: QueryObject,
  options?: { revalidate?: number | false }
): Promise<T> {
  const qs = query ? serializeQuery(query).join("&") : "";
  const url = `${STRAPI_URL}/api${path}${qs ? `?${qs}` : ""}`;
  const apiToken = process.env.STRAPI_API_TOKEN;

  const res = await fetch(url, {
    headers: apiToken ? { Authorization: `Bearer ${apiToken}` } : {},
    next: options?.revalidate === false ? undefined : { revalidate: options?.revalidate ?? 60 },
  });

  if (!res.ok) {
    throw new Error(`Strapi request failed (${res.status}): ${path}`);
  }

  return res.json();
}

export async function strapiFind<T>(path: string, query?: QueryObject, revalidate?: number): Promise<T[]> {
  const result = await strapiFetch<StrapiListResponse<T>>(path, query, { revalidate });
  return result.data ?? [];
}

export async function strapiFindOne<T>(path: string, query?: QueryObject, revalidate?: number): Promise<T | null> {
  const result = await strapiFetch<StrapiSingleResponse<T>>(path, query, { revalidate });
  return result.data ?? null;
}
