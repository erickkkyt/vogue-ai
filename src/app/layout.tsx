import type { Metadata } from 'next';
import { headers } from 'next/headers';
import Script from 'next/script';
import type { ReactNode } from 'react';
import PerformanceMonitor, {
  PerformanceHints,
} from '@/components/common/PerformanceMonitor';
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE_NAME,
  LOCALES,
  REQUEST_LOCALE_HEADER,
} from '@/i18n/routing';

import './globals.css';

type SupportedLocale = (typeof LOCALES)[number];

export const metadata: Metadata = {
  metadataBase: new URL('https://vogueai.net'),
};

interface RootLayoutProps {
  children: ReactNode;
}

function isSupportedLocale(
  value: string | null | undefined
): value is SupportedLocale {
  return LOCALES.includes(value as (typeof LOCALES)[number]);
}

function getCookieLocale(cookieHeader: string | null) {
  if (!cookieHeader) return null;

  const cookieLocale = cookieHeader
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${LOCALE_COOKIE_NAME}=`))
    ?.split('=')[1];
  const decodedLocale = cookieLocale ? decodeURIComponent(cookieLocale) : null;

  return isSupportedLocale(decodedLocale) ? decodedLocale : null;
}

function getAcceptedLocale(acceptLanguage: string | null) {
  if (!acceptLanguage) return null;

  for (const part of acceptLanguage.split(',')) {
    const locale = part.trim().split(';')[0]?.split('-')[0]?.toLowerCase();

    if (isSupportedLocale(locale)) return locale;
  }

  return null;
}

function getHtmlLang(requestHeaders: Headers) {
  const explicitLocale = requestHeaders.get(REQUEST_LOCALE_HEADER);

  if (isSupportedLocale(explicitLocale)) return explicitLocale;

  return (
    getCookieLocale(requestHeaders.get('cookie')) ??
    getAcceptedLocale(requestHeaders.get('accept-language')) ??
    DEFAULT_LOCALE
  );
}

export default async function RootLayout({ children }: RootLayoutProps) {
  const requestHeaders = await headers();
  const htmlLang = getHtmlLang(requestHeaders);
  const clarityProjectId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID?.trim();
  const googleAnalyticsId =
    process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID?.trim();

  return (
    <html lang={htmlLang} suppressHydrationWarning>
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
