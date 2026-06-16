import AppQueryProvider from '@/components/app/AppQueryProvider';
import VogueSidebarShell from '@/components/app/VogueSidebarShell';
import Footer from '@/components/common/Footer';
import { HtmlLangEffect } from '@/components/common/HtmlLangEffect';
import HomeFAQ, { getHomeFAQCopy } from '@/components/home/HomeFAQ';
import { PricingDialogProvider } from '@/components/pricing/PricingDialogProvider';
import VogueGalleryWorkspace from '@/components/prompts/VogueGalleryWorkspace';
import { getMessagesForLocale } from '@/i18n/messages';
import { getVogueCopyFromMessages } from '@/i18n/vogue';
import { getLanguageAlternates, getUrlWithLocale } from '@/lib/urls/urls';
import {
  getLocalizedPromptGalleryEntries,
  getPromptGalleryCounts,
} from '@/lib/prompts';
import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';

const HOME_PATH = '/';
const HOME_GALLERY_PAGE_SIZE = 12;

export const dynamic = 'force-static';

export async function generateHomeMetadata(locale: string): Promise<Metadata> {
  const copy = getVogueCopyFromMessages(await getMessagesForLocale(locale));
  const title = copy.home.metaTitle;
  const description = copy.home.metaDescription;
  const localizedPath = getUrlWithLocale(HOME_PATH, locale);

  return {
    title,
    description,
    alternates: {
      canonical: localizedPath,
      languages: getLanguageAlternates(HOME_PATH),
    },
    openGraph: {
      title,
      description,
      url: localizedPath,
      images: [
        {
          url: '/social-share.jpg',
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/social-share.jpg'],
    },
  };
}

export function generateMetadata(): Promise<Metadata> {
  return generateHomeMetadata('en');
}

export async function HomePage({ locale }: { locale: string }) {
  const galleryCounts = getPromptGalleryCounts();
  const copy = getVogueCopyFromMessages(await getMessagesForLocale(locale));
  const entries = getLocalizedPromptGalleryEntries(locale, {
    limit: HOME_GALLERY_PAGE_SIZE,
    sort: 'homepageFresh',
  });
  const faqCopy = getHomeFAQCopy(locale);
  const homepageJsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'Vogue AI',
      url: `https://vogueai.net${getUrlWithLocale(HOME_PATH, locale)}`,
      applicationCategory: 'DesignApplication',
      operatingSystem: 'Web',
      description: copy.home.metaDescription,
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
      featureList: copy.home.featureList,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Vogue AI',
      url: 'https://vogueai.net',
      logo: 'https://vogueai.net/logo/logo.png',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: copy.home.itemListName,
      itemListElement: entries.slice(0, 12).map((entry, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'CreativeWork',
          name: entry.title,
          image: entry.images[0],
          creator: entry.authorName
            ? {
                '@type': 'Person',
                name: entry.authorName,
              }
            : undefined,
        },
      })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqCopy.items.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      })),
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(homepageJsonLd).replace(/</g, '\\u003c'),
        }}
      />
      <main className="overflow-hidden bg-[var(--vogue-page)] text-slate-950">
        <VogueGalleryWorkspace
          key={locale}
          entries={entries}
          counts={galleryCounts}
          pageSize={HOME_GALLERY_PAGE_SIZE}
          gallerySort="homepageFresh"
          heading={copy.home.h1}
          description={copy.home.srDescription}
        />

        <HomeFAQ locale={locale} />
      </main>
      <Footer />
    </>
  );
}

export default async function HomeFallbackPage() {
  const messages = await getMessagesForLocale('en');

  return (
    <>
      <HtmlLangEffect locale="en" />
      <NextIntlClientProvider locale="en" messages={messages}>
        <PricingDialogProvider>
          <AppQueryProvider>
            <VogueSidebarShell>
              <HomePage locale="en" />
            </VogueSidebarShell>
          </AppQueryProvider>
        </PricingDialogProvider>
      </NextIntlClientProvider>
    </>
  );
}
