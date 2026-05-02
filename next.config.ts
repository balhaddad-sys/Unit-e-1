import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Wasta is RTL by default for game content; we set lang="ar" in root layout.
  // No image optimization needed yet (we'll add it when we add NPC portraits).
  experimental: {
    // Server actions disabled for now — game state is fully client-side.
    serverActions: { bodySizeLimit: "2mb" },
  },
};

export default nextConfig;
