import Footer from '@/components/common/Footer';
import HomeFAQ, { getHomeFAQCopy } from '@/components/home/HomeFAQ';
import VogueGalleryWorkspace from '@/components/prompts/VogueGalleryWorkspace';
import { getVogueCopyFromMessages } from '@/i18n/vogue';
import { getLanguageAlternates, getUrlWithLocale } from '@/lib/urls/urls';
import {
  getLocalizedPromptGalleryEntries,
  getPromptGalleryCounts,
} from '@/lib/prompts';
import {
  VOGUE_PROMPT_CATEGORY_KEYS,
  type VoguePromptCategoryKey,
} from '@/lib/prompt-taxonomy';
import type { Metadata } from 'next';
import { getMessages } from 'next-intl/server';
import { redirect } from 'next/navigation';

const HOME_PATH = '/';
const HOME_GALLERY_PAGE_SIZE = 36;
type HomeSearchParams = Promise<{
  model?: string | string[];
  category?: string | string[];
}>;

const readFirstSearchParam = (value?: string | string[]) =>
  Array.isArray(value) ? value[0] : value;

export async function generateHomeMetadata(locale: string): Promise<Metadata> {
  const copy = getVogueCopyFromMessages(await getMessages({ locale }));
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

export async function HomePage({
  locale,
  searchParams,
}: {
  locale: string;
  searchParams?: HomeSearchParams;
}) {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const galleryCounts = getPromptGalleryCounts();
  const modelParam = readFirstSearchParam(resolvedSearchParams.model);
  const categoryParam = readFirstSearchParam(resolvedSearchParams.category);
  const initialModel =
    modelParam && modelParam !== 'all' && galleryCounts.models[modelParam]
      ? modelParam
      : 'all';
  const initialScenario =
    categoryParam &&
    VOGUE_PROMPT_CATEGORY_KEYS.includes(categoryParam as VoguePromptCategoryKey)
      ? (categoryParam as VoguePromptCategoryKey)
      : 'all';
  const copy = getVogueCopyFromMessages(await getMessages({ locale }));
  const entries = getLocalizedPromptGalleryEntries(locale, {
    limit: HOME_GALLERY_PAGE_SIZE,
    modelId: initialModel,
    categoryKey: initialScenario,
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
          key={`${locale}:${initialModel}:${initialScenario}`}
          entries={entries}
          counts={galleryCounts}
          pageSize={HOME_GALLERY_PAGE_SIZE}
          heading={copy.home.h1}
          description={copy.home.srDescription}
          initialModel={initialModel}
          initialScenario={initialScenario}
        />

        <HomeFAQ locale={locale} />
      </main>
      <Footer />
    </>
  );
}

export default function HomeFallbackPage() {
  redirect('/en');
}
