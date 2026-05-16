import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "m.media-amazon.com" },
      { protocol: "https", hostname: "**.amazon.com" },
      { protocol: "http", hostname: "ia.media-imdb.com" },
    ],
  },
  serverExternalPackages: ["msedge-tts", "ws"],
  transpilePackages: ["remotion", "@remotion/player"],
};

export default nextConfig;
