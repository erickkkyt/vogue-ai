/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // 添加规则以忽略未转义的实体
    ignoreDuringBuilds: true,
  },
  // 性能优化配置
  experimental: {
    // optimizeCss: true, // 暂时禁用，因为需要额外的 critters 依赖
    optimizePackageImports: ['lucide-react'],
  },
  // 压缩配置
  compress: true,
  // 图片优化配置
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pbs.twimg.com',
        port: '',
        pathname: '/profile_images/**', // Allow any image under /profile_images/
      },
      {
        protocol: 'https',
        hostname: 'abs.twimg.com', // 添加 Twitter 默认头像域名
        port: '',
        pathname: '/sticky/default_profile_images/**', // 允许默认头像路径
      },
      {
        protocol: 'https',
        hostname: 'pub-3626123a908346a7a8be8d9295f44e26.r2.dev', // Cloudflare R2 域名
        port: '',
        pathname: '/**', // 允许所有路径
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*', // 应用到所有路径
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'none';",
          },
          // 添加缓存控制头
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // 静态资源缓存优化
      {
        source: '/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // 图片缓存优化
      {
        source: '/:path*\\.(jpg|jpeg|png|gif|ico|svg|webp|avif)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig; 