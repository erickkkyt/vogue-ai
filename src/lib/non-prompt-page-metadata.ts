import type { Metadata } from 'next';

import {
  getNonPromptPageConfig,
  type NonPromptPageSlug,
} from '@/lib/non-prompt-pages';

export function createNonPromptPageMetadata(
  slug: NonPromptPageSlug
): Metadata {
  const config = getNonPromptPageConfig(slug);
  const canonical = `https://vogueai.net${config.path}`;

  return {
    title: config.metadata.title,
    description: config.metadata.description,
    keywords: [],
    alternates: {
      canonical,
    },
    openGraph: {
      title: config.metadata.title,
      description: config.metadata.description,
      url: canonical,
      images: [
        {
          url: config.metadata.image,
          width: 1200,
          height: 630,
          alt: config.metadata.imageAlt,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: config.metadata.title,
      description: config.metadata.description,
      images: [config.metadata.image],
    },
  };
}
