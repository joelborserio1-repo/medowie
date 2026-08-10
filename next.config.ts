import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.supabase.co", pathname: "/storage/v1/object/public/**" },
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
