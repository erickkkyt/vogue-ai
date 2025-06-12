/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // 添加规则以忽略未转义的实体
    ignoreDuringBuilds: true,
  },
  images: {
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
        ],
      },
    ];
  },
};

export default nextConfig; 