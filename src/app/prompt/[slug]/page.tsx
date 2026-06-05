import PromptPublicPage from '@/components/prompts/PromptPublicPage';
import SocialPromptPage from '@/components/prompts/SocialPromptPage';
import {
  buildPromptPageJsonLd,
  buildPromptPageMetadata,
} from '@/lib/prompt-page-seo';
import {
  getPromptEntryById,
  getRelatedPromptEntries,
  getStaticPromptPageEntries,
} from '@/lib/prompts';
import {
  getPromptPagePath,
  getPromptPageSlug,
  getPromptPublicIdFromRouteSlug,
  isCanonicalPromptRouteSlug,
} from '@/lib/prompt-page-routes';
import {
  SOCIAL_PROMPT_PAGE_ENTRIES,
  getSocialPromptPageBySlug,
} from '@/lib/social-prompt-pages';
import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';

export const dynamic = 'force-static';
export const dynamicParams = false;

type PromptPageParams = Promise<{
  slug: string;
}>;

export function generateStaticParams() {
  return [
    ...getStaticPromptPageEntries().map((entry) => ({
      slug: getPromptPageSlug(entry),
    })),
    ...SOCIAL_PROMPT_PAGE_ENTRIES.map((entry) => ({
      slug: entry.slug,
    })),
  ];
}

export async function generateMetadata({
  params,
}: {
  params: PromptPageParams;
}): Promise<Metadata> {
  const { slug } = await params;
  const promptPublicId = getPromptPublicIdFromRouteSlug(slug);
  const promptEntry = promptPublicId
    ? getPromptEntryById(promptPublicId, 'en')
    : null;

  if (promptEntry) {
    return buildPromptPageMetadata(promptEntry);
  }

  const entry = getSocialPromptPageBySlug(slug);

  if (!entry) {
    return {
      title: 'Prompt Not Found | Vogue AI',
      robots: {
        index: false,
        follow: true,
      },
    };
  }

  const canonical = `/prompt/${entry.slug}`;
  const image = entry.generatedImages[0] ?? '/social-share.jpg';

  return {
    title: entry.seoTitle,
    description: entry.description,
    alternates: {
      canonical,
    },
    openGraph: {
      title: entry.seoTitle,
      description: entry.description,
      url: canonical,
      type: 'article',
      modifiedTime: entry.updatedAt,
      images: [
        {
          url: image,
          alt: entry.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: entry.seoTitle,
      description: entry.description,
      images: [image],
    },
  };
}

export default async function PromptPage({
  params,
}: {
  params: PromptPageParams;
}) {
  const { slug } = await params;
  const promptPublicId = getPromptPublicIdFromRouteSlug(slug);
  const promptEntry = promptPublicId
    ? getPromptEntryById(promptPublicId, 'en')
    : null;

  if (promptEntry) {
    if (!isCanonicalPromptRouteSlug(slug, promptEntry)) {
      permanentRedirect(getPromptPagePath(promptEntry));
    }

    const promptJsonLd = buildPromptPageJsonLd(promptEntry);

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(promptJsonLd).replace(/</g, '\\u003c'),
          }}
        />
        <PromptPublicPage
          entry={promptEntry}
          relatedPrompts={getRelatedPromptEntries(promptEntry, 3)}
          locale="en"
        />
      </>
    );
  }

  const entry = getSocialPromptPageBySlug(slug);

  if (!entry) {
    notFound();
  }

  const promptJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: entry.title,
    description: entry.description,
    creator: {
      '@type': 'Organization',
      name: 'Vogue AI',
    },
    dateModified: entry.updatedAt,
    url: `https://vogueai.net/prompt/${entry.slug}`,
    image: entry.generatedImages[0] ?? 'https://vogueai.net/social-share.jpg',
    isBasedOn: entry.sourceUrl,
    ...(entry.prompt ? { text: entry.prompt } : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(promptJsonLd).replace(/</g, '\\u003c'),
        }}
      />
      <SocialPromptPage entry={entry} />
    </>
  );
}
