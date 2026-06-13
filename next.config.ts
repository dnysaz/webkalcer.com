import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.simpleicons.org" },
      { protocol: "https", hostname: "**.supabase.co" },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/dashboard/invoices/:slug.pdf",
        destination: "/api/invoices/:slug/pdf",
      },
    ];
  },
};

export default nextConfig;
