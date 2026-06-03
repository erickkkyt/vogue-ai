import type { Metadata } from 'next';

import {
  INDEXABLE_PROMPT_PAGE_LIMIT,
  getIndexablePromptPageEntries,
  type VoguePromptEntry,
} from '@/lib/prompts';

const BASE_URL = 'https://vogueai.net';

const MODEL_LABELS: Record<string, string> = {
  gptimage2: 'GPT Image 2',
  nanobanana: 'Nano Banana',
  midjourney: 'Midjourney',
};

const CATEGORY_LABELS: Record<string, string> = {
  product: 'Product',
  poster: 'Poster',
  avatar: 'Avatar',
  ui: 'UI',
  diagram: 'Diagram',
  anime: 'Anime',
  photo: 'Photo',
  art: 'Art',
  epic: 'Epic',
};

const normalizeWhitespace = (value: string) =>
  value.replace(/\s+/g, ' ').trim();

const truncateWords = (value: string, maxLength: number) => {
  const normalizedValue = normalizeWhitespace(value);
  if (normalizedValue.length <= maxLength) return normalizedValue;

  const truncated = normalizedValue.slice(0, maxLength + 1);
  const lastSpaceIndex = truncated.lastIndexOf(' ');
  const safeCut = lastSpaceIndex > 18 ? lastSpaceIndex : maxLength;

  return normalizedValue.slice(0, safeCut).replace(/[,:;.\s-]+$/, '');
};

const stripPromptTitleSuffix = (title: string) =>
  normalizeWhitespace(title).replace(/\s+AI\s+Prompt$/i, '');

const fitTitle = (entry: VoguePromptEntry) => {
  const suffix = ' AI Prompt | Vogue AI';
  const modelLabel = MODEL_LABELS[entry.modelId ?? ''] ?? 'AI Image';
  const categoryLabel = CATEGORY_LABELS[entry.categoryKey ?? ''] ?? 'Image';
  const promptTitle = stripPromptTitleSuffix(entry.title);
  const baseTitle = `${truncateWords(promptTitle, 55 - suffix.length)}${suffix}`;

  if (baseTitle.length >= 40 && baseTitle.length <= 55) return baseTitle;

  const expandedTitle = `${truncateWords(
    `${promptTitle} ${modelLabel} ${categoryLabel}`,
    55 - suffix.length
  )}${suffix}`;

  if (expandedTitle.length >= 40 && expandedTitle.length <= 55) {
    return expandedTitle;
  }

  const fallbackTitle = `${modelLabel} ${categoryLabel} AI Prompt | Vogue AI`;

  if (fallbackTitle.length >= 40 && fallbackTitle.length <= 55) {
    return fallbackTitle;
  }

  return `${categoryLabel} ${modelLabel} Visual AI Prompt | Vogue AI`;
};

const fitDescription = (entry: VoguePromptEntry) => {
  const modelLabel = MODEL_LABELS[entry.modelId ?? ''] ?? 'AI image model';
  const categoryLabel = CATEGORY_LABELS[entry.categoryKey ?? ''] ?? 'creative';
  const baseDescription = normalizeWhitespace(
    `Copy this ${categoryLabel.toLowerCase()} prompt for ${modelLabel} in Vogue AI. View the source prompt, image preview, creator credit, model tag, and send it into the image composer.`
  );

  if (baseDescription.length >= 140 && baseDescription.length <= 166) {
    return baseDescription;
  }

  const paddedDescription = normalizeWhitespace(
    `${baseDescription} Built for fast visual testing.`
  );

  if (paddedDescription.length >= 140 && paddedDescription.length <= 166) {
    return paddedDescription;
  }

  return `${truncateWords(baseDescription, 165).replace(/[,:;.\s-]+$/, '')}.`;
};

const getPrimaryImageUrl = (entry: VoguePromptEntry) =>
  entry.images[0] ?? '/social-share.jpg';

const toAbsoluteUrl = (pathOrUrl: string) => {
  if (/^https?:\/\//.test(pathOrUrl)) return pathOrUrl;
  return `${BASE_URL}${pathOrUrl.startsWith('/') ? '' : '/'}${pathOrUrl}`;
};

export const getPromptPageCanonicalPath = (entry: VoguePromptEntry) =>
  `/prompt/${entry.publicId}`;

export const isIndexablePromptPage = (publicId: string) =>
  getIndexablePromptPageEntries(INDEXABLE_PROMPT_PAGE_LIMIT).some(
    (entry) => entry.publicId === publicId
  );

export function buildPromptPageMetadata(entry: VoguePromptEntry): Metadata {
  const canonical = getPromptPageCanonicalPath(entry);
  const title = fitTitle(entry);
  const description = fitDescription(entry);
  const image = getPrimaryImageUrl(entry);
  const isIndexable = isIndexablePromptPage(entry.publicId);

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    robots: {
      index: isIndexable,
      follow: true,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      type: 'article',
      images: [
        {
          url: image,
          alt: entry.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}

export function buildPromptPageJsonLd(entry: VoguePromptEntry) {
  const canonicalPath = getPromptPageCanonicalPath(entry);
  const canonicalUrl = `${BASE_URL}${canonicalPath}`;
  const title = fitTitle(entry);
  const description = fitDescription(entry);
  const imageUrl = toAbsoluteUrl(getPrimaryImageUrl(entry));

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CreativeWork',
        '@id': `${canonicalUrl}#creativework`,
        name: entry.title,
        headline: title,
        description,
        text: entry.prompt,
        creator: entry.authorName
          ? {
              '@type': 'Person',
              name: entry.authorName,
            }
          : {
              '@type': 'Organization',
              name: 'Vogue AI',
            },
        datePublished: entry.publishedLabel,
        url: canonicalUrl,
        image: imageUrl,
        isBasedOn: entry.sourceUrl,
      },
      {
        '@type': 'ImageObject',
        '@id': `${canonicalUrl}#primaryimage`,
        url: imageUrl,
        caption: entry.title,
      },
      {
        '@type': 'WebPage',
        '@id': `${canonicalUrl}#webpage`,
        url: canonicalUrl,
        name: title,
        description,
        primaryImageOfPage: {
          '@id': `${canonicalUrl}#primaryimage`,
        },
        mainEntity: {
          '@id': `${canonicalUrl}#creativework`,
        },
      },
    ],
  };
}
