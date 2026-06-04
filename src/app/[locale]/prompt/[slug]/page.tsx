import { buildPromptPageMetadata } from '@/lib/prompt-page-seo';
import { getPromptEntryById } from '@/lib/prompts';
import {
  getPromptPagePath,
  getPromptPublicIdFromRouteSlug,
} from '@/lib/prompt-page-routes';
import {
  SOCIAL_PROMPT_PAGE_ENTRIES,
  getSocialPromptPageBySlug,
} from '@/lib/social-prompt-pages';
import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';

type LocalizedPromptPageParams = Promise<{
  locale: string;
  slug: string;
}>;

export function generateStaticParams() {
  return SOCIAL_PROMPT_PAGE_ENTRIES.map((entry) => ({
    slug: entry.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: LocalizedPromptPageParams;
}): Promise<Metadata> {
  const { slug } = await params;
  const promptPublicId = getPromptPublicIdFromRouteSlug(slug);
  const promptEntry = promptPublicId
    ? getPromptEntryById(promptPublicId, 'en')
    : null;

  if (promptEntry) {
    const metadata = buildPromptPageMetadata(promptEntry);
    const canonical = getPromptPagePath(promptEntry);

    return {
      ...metadata,
      alternates: {
        canonical,
      },
      openGraph: {
        ...metadata.openGraph,
        url: canonical,
      },
      robots: {
        index: false,
        follow: true,
      },
    };
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

  const canonicalPath = `/prompt/${entry.slug}`;
  const image = entry.generatedImages[0] ?? '/social-share.jpg';

  return {
    title: entry.seoTitle,
    description: entry.description,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      title: entry.seoTitle,
      description: entry.description,
      url: canonicalPath,
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

export default async function LocalizedPromptPage({
  params,
}: {
  params: LocalizedPromptPageParams;
}) {
  const { slug } = await params;
  const promptPublicId = getPromptPublicIdFromRouteSlug(slug);
  const promptEntry = promptPublicId
    ? getPromptEntryById(promptPublicId, 'en')
    : null;

  if (promptEntry) {
    redirect(getPromptPagePath(promptEntry));
  }

  const entry = getSocialPromptPageBySlug(slug);

  if (!entry) {
    notFound();
  }

  redirect(`/prompt/${entry.slug}`);
}
