import type { Metadata } from 'next';
import Script from 'next/script';
import type { ReactNode } from 'react';
import PerformanceMonitor, {
  PerformanceHints,
} from '@/components/common/PerformanceMonitor';

import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://vogueai.net'),
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  const clarityProjectId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID?.trim();
  const googleAnalyticsId =
    process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID?.trim();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="preconnect" href="https://media.vogueai.net" />
        <link rel="dns-prefetch" href="https://media.vogueai.net" />
        <link
          rel="dns-prefetch"
          href="https://pub-3626123a908346a7a8be8d9295f44e26.r2.dev"
        />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
      </head>
      <body className="antialiased">
        {children}
        <div id="portal-root" />
        {process.env.NODE_ENV === 'development' && (
          <>
            <PerformanceMonitor />
            <PerformanceHints />
          </>
        )}
        {clarityProjectId && (
          <Script
            id="clarity-init"
            strategy="lazyOnload"
            dangerouslySetInnerHTML={{
              __html: `
                (function(c,l,a,r,i,t,y){
                    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                    t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                })(window, document, "clarity", "script", ${JSON.stringify(clarityProjectId)});
              `,
            }}
          />
        )}
        {googleAnalyticsId && (
          <>
            <Script
              strategy="lazyOnload"
              src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(
                googleAnalyticsId
              )}`}
            />
            <Script
              id="gtag-init"
              strategy="lazyOnload"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', ${JSON.stringify(googleAnalyticsId)});
                `,
              }}
            />
          </>
        )}
      </body>
    </html>
  );
}
