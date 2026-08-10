import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Local Strapi dev server.
      { protocol: "http", hostname: "localhost", port: "1337" },
      // Strapi on Railway.
      { protocol: "https", hostname: "*.up.railway.app" },
      // Cloudflare R2 media (if the Strapi upload provider is switched to R2 — see docs/DEPLOYMENT.md).
      { protocol: "https", hostname: "*.r2.dev" },
      { protocol: "https", hostname: "*.r2.cloudflarestorage.com" },
    ],
  },
  async redirects() {
    return [
      { source: "/tiger-tara", destination: "/stallions/tiger-tara", permanent: true },
      { source: "/follow-the-stars-aus", destination: "/stallions/follow-the-stars", permanent: true },
      { source: "/my-chaching-chaching", destination: "/stallions/my-chaching-chaching", permanent: true },
      { source: "/timothy-red", destination: "/stallions/timothy-red", permanent: true },
      { source: "/myhighexpectations", destination: "/stallions/my-high-expectations", permanent: true },
      { source: "/contracts", destination: "/forms", permanent: true },
      { source: "/contact-harness-racing-nsw", destination: "/contact", permanent: true },
    ];
  },
};

export default nextConfig;
