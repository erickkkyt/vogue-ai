import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Script from 'next/script'; // 导入 Script 组件
import "./globals.css";

// TODO: 更新 metadata 以匹配 AI Baby Generator 主题
export const metadata: Metadata = {
  metadataBase: new URL('https://www.babypodcast.pro'), // 替换为您的生产环境域名
  title: {
    default: "AI Baby Generator", // 默认标题
    template: "%s | AI Baby Generator", // 页面特定标题的模板
  },
  description: "Create, optimize, and monetize AI-powered baby videos.", // 示例新描述
  openGraph: {
    title: "AI Baby Generator",
    description: "Create, optimize, and monetize AI-powered baby videos.",
    url: "https://www.babypodcast.pro", // 替换为您的生产环境域名
    siteName: "AI Baby Generator", // 您的网站名称
    images: [
      {
        url: '/social-share.png', // 确保您在 public 文件夹下有这个文件
        width: 1200,
        height: 630,
        alt: 'AI Baby Generator - Social Share Image',
      },
    ],
    locale: 'en_US', // 根据您的目标受众调整
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "AI Baby Generator",
    description: "Create, optimize, and monetize AI-powered baby videos.",
    // siteId: 'YourTwitterSiteID', // 如果有，您的 Twitter 网站 ID
    // creator: '@YourTwitterHandle', // 如果有，您的 Twitter @用户名
    // creatorId: 'YourTwitterCreatorID', // 如果有，您的 Twitter 创建者 ID
    images: ['/social-share.png'], // 确保您在 public 文件夹下有这个文件
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
        <Script
          id="clarity-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "rn16gjya9t");
            `,
          }}
        />
        {/* Google AdSense 脚本 */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6313486072364487"
          crossOrigin="anonymous"
        />
      </head>
      {/* 应用新的字体变量到 body */}
      <body className="antialiased">
        {children}
        <div id="portal-root"></div>
        {/* Google tag (gtag.js) */}
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-GPGTE9VHDR"
        />
        <Script
          id="gtag-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-GPGTE9VHDR');
            `,
          }}
        />
      </body>
    </html>
  );
}