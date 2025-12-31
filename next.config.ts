import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['images.unsplash.com'],
    // Disable image optimization for cPanel shared hosting
    unoptimized: process.env.NODE_ENV === 'production',
  },
  // Important for custom server
  compress: true,
  poweredByHeader: false,
};

export default nextConfig;