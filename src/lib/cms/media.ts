// No "server-only" guard here on purpose: mediaUrl() is a pure string
// transform (no secrets, no fetch) and StallionCard — which calls it — is
// rendered inside the client-side StallionIndexGrid, so this file needs to
// be safe to bundle into a Client Component too.

const STRAPI_URL = process.env.STRAPI_URL ?? process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://localhost:1337";

/** Strapi media file (populated). */
export interface StrapiMedia {
  id: number;
  documentId: string;
  name: string;
  alternativeText: string | null;
  caption: string | null;
  url: string;
  mime: string;
}

/** Resolves a Strapi media object's URL to an absolute URL, whatever the upload provider. */
export function mediaUrl(media: StrapiMedia | null | undefined): string | null {
  if (!media?.url) return null;
  return media.url.startsWith("http") ? media.url : `${STRAPI_URL}${media.url}`;
}
