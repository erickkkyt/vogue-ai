import PerformanceMonitor, {
  PerformanceHints,
} from '@/components/common/PerformanceMonitor';
import VogueSidebarShell from '@/components/app/VogueSidebarShell';
import { PricingDialogProvider } from '@/components/pricing/PricingDialogProvider';
import { routing } from '@/i18n/routing';
import { hasLocale, NextIntlClientProvider, type Locale } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Script from 'next/script';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  metadataBase: new URL('https://vogueai.net'),
  title: 'Free AI Image Prompts for GPT Image 2 & Nano Banana | Vogue AI',
  description:
    'Browse free AI image prompts for products, posters, portraits, UI and social posts. Copy GPT Image 2, Nano Banana and Midjourney prompts, then generate in Vogue AI.',
  openGraph: {
    title: 'Free AI Image Prompts for GPT Image 2 & Nano Banana | Vogue AI',
    description:
      'Browse free AI image prompts for products, posters, portraits, UI and social posts. Copy GPT Image 2, Nano Banana and Midjourney prompts, then generate in Vogue AI.',
    url: 'https://vogueai.net',
    siteName: 'Vogue AI',
    images: [
      {
        url: '/social-share.jpg',
        width: 1200,
        height: 630,
        alt: 'Vogue AI free AI image prompts gallery',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free AI Image Prompts for GPT Image 2 & Nano Banana | Vogue AI',
    description:
      'Browse free AI image prompts for products, posters, portraits, UI and social posts. Copy GPT Image 2, Nano Banana and Midjourney prompts, then generate in Vogue AI.',
    images: ['/social-share.jpg'],
  },
  robots: {
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
};

interface LocaleLayoutProps {
  children: ReactNode;
  params: Promise<{ locale: Locale }>;
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const clarityProjectId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID?.trim();
  const googleAnalyticsId =
    process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID?.trim();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link
          rel="dns-prefetch"
          href="https://pub-3626123a908346a7a8be8d9295f44e26.r2.dev"
        />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
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
      </head>
      <body className="antialiased">
        <NextIntlClientProvider>
          <PricingDialogProvider>
            <VogueSidebarShell>{children}</VogueSidebarShell>
          </PricingDialogProvider>
        </NextIntlClientProvider>
        <div id="portal-root"></div>
        {process.env.NODE_ENV === 'development' && (
          <>
            <PerformanceMonitor />
            <PerformanceHints />
          </>
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
