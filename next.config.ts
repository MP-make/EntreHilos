import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "via.placeholder.com",
      },
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
      },
      {
        protocol: "https",
        hostname: "ventify-xead3.firebasestorage.app",
      },
      {
        protocol: "https",
        hostname: "rydogoubjnytzfctfnxz.supabase.co",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/category/:slug*",
        destination: "/catalogo/:slug*",
      },
    ];
  },
};

export default nextConfig;