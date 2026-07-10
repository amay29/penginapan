import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // @ts-ignore - silences type errors if turbopack is not yet typed
  turbopack: {
    root: process.cwd(),
  },
  images: {
    unoptimized: true, // Bypass Next.js server-side image processing (Unsplash already optimizes images via CDN)
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default nextConfig;
