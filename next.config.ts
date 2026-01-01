import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",

  images: {
    domains: ["images.unsplash.com"],
    unoptimized: true, // REQUIRED for static export
  },

  trailingSlash: true, // IMPORTANT for Apache routing

  poweredByHeader: false,
};

export default nextConfig;
