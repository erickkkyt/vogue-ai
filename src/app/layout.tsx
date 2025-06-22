import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Script from 'next/script'; // 导入 Script 组件
import PerformanceMonitor, { PerformanceHints } from '../components/common/PerformanceMonitor';
import "./globals.css";

// TODO: 更新 metadata 以匹配多工具平台主题
export const metadata: Metadata = {
  metadataBase: new URL('https://www.vogueai.net'), // 替换为您的生产环境域名
  title: "Vogue AI - AI Creative Suite", // 默认标题，不使用模板
  description: "AI Creative Suite: AI Baby Generator, Veo 3 Video Generator, and AI Baby Podcast. Create professional AI content with our advanced tools.", // 更新描述
  openGraph: {
    title: "Vogue AI - AI Creative Suite",
    description: "AI Creative Suite: AI Baby Generator, Veo 3 Video Generator, and AI Baby Podcast. Create professional AI content with our advanced tools.",
    url: "https://www.vogueai.net", // 替换为您的生产环境域名
    siteName: "Vogue AI", // 您的网站名称
          images: [
        {
          url: '/social-share.jpg', // 确保您在 public 文件夹下有这个文件
          width: 1200,
          height: 630,
          alt: 'Vogue AI - AI Creative Suite Social Share Image',
        },
      ],
    locale: 'en_US', // 根据您的目标受众调整
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Vogue AI - AI Creative Suite",
    description: "AI Creative Suite: AI Baby Generator, Veo 3 Video Generator, and AI Baby Podcast. Create professional AI content with our advanced tools.",
    // siteId: 'YourTwitterSiteID', // 如果有，您的 Twitter 网站 ID
    // creator: '@YourTwitterHandle', // 如果有，您的 Twitter @用户名
    // creatorId: 'YourTwitterCreatorID', // 如果有，您的 Twitter 创建者 ID
    images: ['/social-share.jpg'], // 确保您在 public 文件夹下有这个文件
  },
  robots: { // 默认的 robots.txt 指令
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  // 如果您有图标，可以这样添加
  // icons: {
  //   icon: '/favicon.ico',
  //   shortcut: '/favicon-16x16.png',
  //   apple: '/apple-touch-icon.png',
  // },
  // manifest: '/site.webmanifest', // 如果您有 PWA manifest
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        {/* 预加载关键资源 */}
        <link rel="preload" href="/background.png" as="image" />
        <link rel="preload" href="/logo/logo.png" as="image" />
        <link rel="dns-prefetch" href="https://pub-3626123a908346a7a8be8d9295f44e26.r2.dev" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />
        <Script
          id="clarity-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "ryvv8c2qs8");
            `,
          }}
        />
        {/* Google AdSense 脚本 - 延迟加载 */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6313486072364487"
          crossOrigin="anonymous"
          strategy="lazyOnload"
        />
      </head>
      {/* 应用新的字体变量到 body */}
      <body className="antialiased">
        {children}
        <div id="portal-root"></div>
        {/* 性能监控组件 - 仅在开发环境中显示 */}
        {process.env.NODE_ENV === 'development' && (
          <>
            <PerformanceMonitor />
            <PerformanceHints />
          </>
        )}
        {/* Google tag (gtag.js) - 延迟加载 */}
        <Script
          strategy="lazyOnload"
          src="https://www.googletagmanager.com/gtag/js?id=G-MJ7Q9993FF"
        />
        <Script
          id="gtag-init"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-MJ7Q9993FF');
            `,
          }}
        />
      </body>
    </html>
  );
}