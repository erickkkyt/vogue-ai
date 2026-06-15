import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import gscPromptRedirects from "./src/lib/generated/gsc-prompt-redirects.json";

const nextConfig: NextConfig = {
  async redirects() {
    return gscPromptRedirects.map(({ source, destination }) => ({
      source,
      destination,
      permanent: true,
    }));
  },
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  compress: true,
  images: {
    formats: ["image/webp", "image/avif"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    localPatterns: [
      {
        pathname: "/**",
      },
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-3626123a908346a7a8be8d9295f44e26.r2.dev",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "pub-911e4fa03f0c4323a80d8f3dc99d1c7f.r2.dev",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "pub-dd9404e72d594f05acd661a8179747d2.r2.dev",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "pub-7cd78fc1ea1c48a29b472661774035a5.r2.dev",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "pub-da4c030f32c04b9f98cd49773cbf82b5.r2.dev",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "media.vogueai.net",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
        pathname: "/**",
      },
    ],
  },
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
