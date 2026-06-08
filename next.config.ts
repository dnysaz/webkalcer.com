import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
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
