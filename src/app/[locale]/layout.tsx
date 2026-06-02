import VogueSidebarShell from '@/components/app/VogueSidebarShell';
import { HtmlLangEffect } from '@/components/common/HtmlLangEffect';
import { PricingDialogProvider } from '@/components/pricing/PricingDialogProvider';
import { routing } from '@/i18n/routing';
import { hasLocale, NextIntlClientProvider, type Locale } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
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

  return (
    <>
      <HtmlLangEffect locale={locale} />
      <NextIntlClientProvider>
        <PricingDialogProvider>
          <VogueSidebarShell>{children}</VogueSidebarShell>
        </PricingDialogProvider>
      </NextIntlClientProvider>
    </>
  );
}
