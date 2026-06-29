import type { Metadata } from 'next';

import { isIndexablePromptPublicId } from '@/lib/prompts/runtime-ids';
import type { VoguePromptEntry } from '@/lib/prompts/types';
import { getPromptPagePath } from '@/lib/prompt-page-routes';
import {
  getPromptSeoAngles,
  getPromptSeoDescriptor,
  getPromptSeoSignal,
  getPromptSeoSourceText,
  normalizePromptSeoWhitespace,
  stripPromptTitleSuffix,
  truncatePromptSeoText,
} from '@/lib/prompt-seo-signals';

const BASE_URL = 'https://vogueai.net';

const MODEL_LABELS: Record<string, string> = {
  gptimage2: 'GPT Image 2',
  nanobanana: 'Nano Banana',
  midjourney: 'Midjourney',
};

const CATEGORY_LABELS: Record<string, string> = {
  product: 'Product',
  brandAds: 'Brand / Ads',
  poster: 'Poster',
  portrait: 'Portrait',
  fashion: 'Fashion',
  social: 'Social',
  ui: 'UI',
  diagram: 'Diagram',
  anime: 'Anime',
  photo: 'Photo',
  art: 'Art-style',
};

const CATEGORY_USE_CASES: Record<string, string> = {
  product: 'product mockups and ecommerce visuals',
  brandAds: 'brand systems, campaign visuals, and advertising concepts',
  poster: 'poster layouts and campaign key visuals',
  portrait: 'portrait, headshot, and profile-image concepts',
  fashion: 'fashion editorials, styling studies, and outfit visuals',
  social: 'creator posts, thumbnails, and social-platform visuals',
  ui: 'interface mockups and product UI explorations',
  diagram: 'diagrams, maps, and explanatory graphics',
  anime: 'anime character and stylized scene concepts',
  photo: 'photo-real image concepts and editorial references',
  art: 'illustration, art direction, and visual style studies',
};

const CATEGORY_SHORT_USE_CASES: Record<string, string> = {
  product: 'product mockups',
  brandAds: 'brand and ad concepts',
  poster: 'poster layouts',
  portrait: 'portrait concepts',
  fashion: 'fashion visuals',
  social: 'social-ready visuals',
  ui: 'interface mockups',
  diagram: 'explanatory diagrams',
  anime: 'anime scenes',
  photo: 'editorial photo concepts',
  art: 'art-direction studies',
};

const GENERIC_TITLE_WORDS = new Set([
  'ai',
  'ad',
  'art',
  'collector',
  'character',
  'cinematic',
  'concept',
  'commerce',
  'data',
  'defined',
  'dashboard',
  'design',
  'editorial',
  'fashion',
  'high',
  'epic',
  'face',
  'facial',
  'featuring',
  'features',
  'full',
  'grade',
  'graduation',
  'hero',
  'illustration',
  'image',
  'infographic',
  'lp',
  'main',
  'manga',
  'marketing',
  'mockup',
  'narrative',
  'page',
  'photo',
  'portrait',
  'product',
  'prompt',
  'realistic',
  'sheet',
  'storyboard',
  'style',
  'stylized',
  'ui',
  'ultra',
  'visual',
]);

const WEAK_TITLE_SIGNAL_WORDS = new Set([
  'argument',
  'button',
  'date',
  'default',
  'description',
  'headline',
  'identity',
  'name',
  'number',
  'office',
  'phone',
  'soft',
  'stamp',
  'subheadline',
  'text',
  'theme',
  'title',
  'uploaded',
  'version',
]);

const OUTPUT_KEYWORDS = [
  { pattern: /\bstoryboard\b/i, value: 'Storyboard' },
  { pattern: /\binfographic\b/i, value: 'Infographic' },
  { pattern: /\bdashboard\b/i, value: 'Dashboard UI' },
  { pattern: /\blanding page\b/i, value: 'Landing Page' },
  { pattern: /\bmanga\b/i, value: 'Manga Page' },
  { pattern: /\bthumbnail\b/i, value: 'Thumbnail' },
  { pattern: /\bposter\b/i, value: 'Poster' },
  { pattern: /\bportrait\b/i, value: 'Portrait' },
  { pattern: /\bmockup\b/i, value: 'Mockup' },
  { pattern: /\bcollage\b/i, value: 'Collage' },
  { pattern: /\bavatar\b/i, value: 'Avatar' },
] as const;

const hasPhrase = (value: string, phrase: string) =>
  value.toLowerCase().includes(phrase.toLowerCase());

const getTitleSpecificity = (title: string) =>
  stripPromptTitleSuffix(title)
    .toLowerCase()
    .split(/[^a-z0-9]+/i)
    .filter((word) => word.length > 2 && !GENERIC_TITLE_WORDS.has(word))
    .length;

const scoreTitleSignal = (value: string) => {
  const words = value
    .toLowerCase()
    .split(/[^a-z0-9]+/i)
    .filter((word) => word.length > 2);
  const usefulWords = words.filter(
    (word) =>
      !GENERIC_TITLE_WORDS.has(word) && !WEAK_TITLE_SIGNAL_WORDS.has(word)
  );
  const weakWords = words.filter((word) => WEAK_TITLE_SIGNAL_WORDS.has(word));

  return usefulWords.length * 8 + Math.min(value.length, 72) / 8 - weakWords.length * 5;
};

const sortTitleSignals = (signals: string[]) =>
  signals
    .filter(Boolean)
    .toSorted((left, right) => scoreTitleSignal(right) - scoreTitleSignal(left));

const appendOutputKeyword = (value: string, outputKeyword: string) =>
  hasPhrase(value, outputKeyword) ? value : `${value} ${outputKeyword}`;

const DESCRIPTION_WEAK_FOCUS_WORDS = new Set([
  ...GENERIC_TITLE_WORDS,
  ...WEAK_TITLE_SIGNAL_WORDS,
  'ai',
  'copy',
  'do',
  'focus',
  'graph',
  'infer',
  'inferred',
  'parametric',
  'python',
  'strongly',
]);

const cleanDescriptionFocus = (
  value: string,
  promptTitle: string
) => {
  if (/\btype\s+image(?:\s+prompt)?\s+title\b/i.test(value)) return '';
  if (/\bstyle\s+photorealistic\s+fashion\s+photography\s+subject\s+name\b/i.test(value)) {
    return '';
  }
  if (/^exploring\s+style\s+sref\b/i.test(value)) return '';

  const cleanedValue = normalizePromptSeoWhitespace(value)
    .replace(/^(?:do\s+this(?:\s+for\s+ai)?|turn\s+person\s+photo\s+into|create|design|generate|make|use)\s+/i, '')
    .replace(/\b(?:class|variables?|parametric|python|scene graph)\b/gi, ' ')
    .replace(/^features\b.*$/i, '')
    .replace(/\s+features\b.*$/i, '')
    .replace(/\s+\b(?:based|based on)\b$/i, '')
    .replace(/\s+\d+$/g, '')
    .replace(/[,:;.\s-]+$/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (!cleanedValue) return '';
  if (hasPhrase(promptTitle, cleanedValue)) return '';

  const words = cleanedValue
    .toLowerCase()
    .split(/[^a-z0-9]+/i)
    .filter(Boolean);
  const usefulWordCount = words.filter(
    (word) => word.length > 2 && !DESCRIPTION_WEAK_FOCUS_WORDS.has(word)
  ).length;

  if (usefulWordCount < 2) return '';
  if (/^(?:topic|title|image|prompt|style|subject|theme)$/i.test(cleanedValue)) {
    return '';
  }

  return cleanedValue;
};

const getDescriptionFocus = (entry: VoguePromptEntry, promptTitle: string) => {
  const candidates = [
    getMidjourneyParameterFocus(entry),
    getPromptSeoDescriptor(entry, 8),
    ...getPromptSeoAngles(entry, 8),
    getPromptSeoSignal(entry, 140),
  ];
  const seen = new Set<string>();

  for (const candidate of candidates) {
    if (!candidate) continue;

    const focus = cleanDescriptionFocus(candidate, promptTitle);
    const fingerprint = focus.toLowerCase();

    if (!focus || seen.has(fingerprint)) continue;
    seen.add(fingerprint);

    return truncatePromptSeoText(focus, 58);
  }

  return '';
};

const getInlineCategoryLabel = (categoryLabel: string) =>
  categoryLabel === 'UI' ? 'UI' : categoryLabel.toLowerCase();

const getSourceHandleTitleLabel = (authorHandle?: string | null) => {
  const handle = authorHandle?.replace(/^@/, '').trim();
  if (!handle) return '';

  return handle
    .split(/[_\s-]+/)
    .filter(Boolean)
    .map((part) => `${part.slice(0, 1).toUpperCase()}${part.slice(1)}`)
    .join(' ');
};

const getCleanSourceTitleCandidate = (entry: VoguePromptEntry) => {
  if (!entry.sourceTitle || entry.sourceTitle === entry.title) return '';

  const candidate = normalizePromptSeoWhitespace(entry.sourceTitle)
    .replace(/^(?:prompt\s+)?(?:create|design|generate|yapper\s+so)\s+/i, '')
    .replace(/^type\s+image\s+prompt\s+/i, '');
  const promptTitle = stripPromptTitleSuffix(entry.title);

  if (
    /\btype\s+image\s+prompt\s+title\b/i.test(candidate) ||
    /\bstyle\s+photorealistic\s+fashion\s+photography\s+subject\s+name\b/i.test(candidate) ||
    /^exploring\s+style\s+sref\b/i.test(candidate)
  ) {
    return '';
  }

  if (hasPhrase(candidate, promptTitle) || hasPhrase(promptTitle, candidate)) {
    return '';
  }

  return scoreTitleSignal(candidate) >= 14 ? candidate : '';
};


const isTemplateLikeTitle = (title: string) =>
  /^(?:dark fantasy\. art nouveau\. fantastic realism\. mysterious\. oil|full page colored manga illustration|collectible epic narrative graduation poster|generation request meta data task type(?:\s+2x2)?|hand drawn style infographic|high fashion y2k inspired editorial artwork|hyper realistic exploded vertical infographic|image|landing page mockup|photorealistic fashion photography photo|square|travel poster|type image|argument name|version description|vintage travel stamp illustration|visually rich infographic|subject identity likeness calibration referanced image facial)$/i.test(
    stripPromptTitleSuffix(title)
  );

const getOutputKeyword = (entry: VoguePromptEntry, categoryLabel: string) => {
  const title = stripPromptTitleSuffix(entry.title);
  const signal = getPromptSeoSignal(entry, 140);
  const source = `${title} ${signal}`;
  const matchedKeyword = OUTPUT_KEYWORDS.find((item) =>
    item.pattern.test(source)
  );

  return matchedKeyword?.value ?? categoryLabel;
};

const getMidjourneyStyleCode = (entry: VoguePromptEntry) => {
  if (entry.modelId !== 'midjourney') return null;

  const source = normalizePromptSeoWhitespace(
    `${entry.sourceTitle ?? ''} ${getPromptSeoSignal(entry, 180)} ${
      getPromptSeoDescriptor(entry, 8) ?? ''
    }`
  );
  const srefMatch = source.match(/\bsref\s+(\d{6,10})\b/i);
  const longNumberMatch = source.match(/\b(\d{6,10})\b/);

  return srefMatch?.[1] ?? longNumberMatch?.[1] ?? null;
};

const getMidjourneyParameterFocus = (entry: VoguePromptEntry) => {
  if (entry.modelId !== 'midjourney') return '';

  const sourceText = getPromptSeoSourceText(entry);
  const aspectRatio = sourceText.match(/--ar\s+([0-9]+(?::[0-9]+)?)/i)?.[1];
  const version = sourceText.match(/--v\s+([0-9]+(?:\.[0-9]+)?)/i)?.[1];

  if (!aspectRatio && !version) return '';

  return normalizePromptSeoWhitespace(
    `${aspectRatio ? `${aspectRatio} aspect ratio` : ''} ${
      version ? `Midjourney v${version}` : 'Midjourney'
    } setup`
  );
};

const isPoorPromptTitle = (title: string) =>
  stripPromptTitleSuffix(title).length < 5 ||
  /^[^a-z0-9]*\d?[^a-z0-9]*$/i.test(stripPromptTitleSuffix(title));

const cleanPromptTitleBase = (base: string) =>
  normalizePromptSeoWhitespace(base)
    .replace(
      /\bAI\s+(?=(?:Art-style|Avatar|Brand|Collage|Dashboard|Diagram|Fashion|Image|Infographic|Landing|Manga|Mockup|Photo|Portrait|Poster|Product|Social|Storyboard|UI)\b)/i,
      ''
    )
    .replace(/\s+AI$/i, '');

const buildPromptTitleValue = (base: string, titleBudget: number) => {
  const normalizedBase = cleanPromptTitleBase(base);
  const promptSuffix =
    normalizedBase.length + ' AI Prompt'.length < 29
      ? ' AI Image Prompt'
      : ' AI Prompt';
  const srefSuffixMatch = normalizedBase.match(/\s+Sref\s+\d{6,10}$/i);
  if (srefSuffixMatch) {
    const srefSuffix = srefSuffixMatch[0];
    const baseWithoutSref = normalizedBase.slice(0, -srefSuffix.length);
    const romanSuffixMatch = baseWithoutSref.match(/\s+(?:I|II|III|IV|V|VI|VII|VIII|IX|X)$/i);
    const romanSuffix = romanSuffixMatch?.[0] ?? '';
    const baseWithoutSuffix = romanSuffix
      ? baseWithoutSref.slice(0, -romanSuffix.length)
      : baseWithoutSref;
    const baseBudget =
      titleBudget - promptSuffix.length - srefSuffix.length - romanSuffix.length;

    return `${truncatePromptSeoText(
      baseWithoutSuffix,
      baseBudget
    )}${romanSuffix}${srefSuffix}${promptSuffix}`;
  }

  const baseBudget = titleBudget - promptSuffix.length;
  const compactBase = (value: string) => {
    if (value.length <= baseBudget) return truncatePromptSeoText(value, baseBudget);

    const words = value.split(/\s+/).filter(Boolean);
    const usefulTailWords: string[] = [];

    for (let index = words.length - 1; index >= 0; index -= 1) {
      const normalizedWord = words[index].toLowerCase().replace(/[^a-z0-9]+/g, '');
      if (!normalizedWord) continue;
      if (GENERIC_TITLE_WORDS.has(normalizedWord)) continue;
      if (WEAK_TITLE_SIGNAL_WORDS.has(normalizedWord)) continue;
      if (/^\d+$/.test(normalizedWord)) continue;

      usefulTailWords.unshift(words[index]);
      if (usefulTailWords.length >= 2) break;
    }

    const usefulTail = usefulTailWords.join(' ');
    if (usefulTail && baseBudget - usefulTail.length > 16) {
      const prefix = truncatePromptSeoText(
        value,
        baseBudget - usefulTail.length - 1
      );

      if (!hasPhrase(prefix, usefulTail)) {
        const prefixWords = prefix.split(/\s+/).filter(Boolean);
        const tailWords = usefulTail.split(/\s+/).filter(Boolean);
        const adjustedTail =
          prefixWords.at(-1)?.toLowerCase() === tailWords[0]?.toLowerCase()
            ? tailWords.slice(1).join(' ')
            : usefulTail;

        return adjustedTail ? `${prefix} ${adjustedTail}` : prefix;
      }
    }

    return truncatePromptSeoText(value, baseBudget);
  };

  return `${compactBase(normalizedBase)}${promptSuffix}`;
};

const getPromptTitleBaseCandidates = (entry: VoguePromptEntry) => {
  const modelLabel = MODEL_LABELS[entry.modelId ?? ''] ?? 'AI Image';
  const categoryLabel = CATEGORY_LABELS[entry.categoryKey ?? ''] ?? 'Image';
  const promptTitle = stripPromptTitleSuffix(entry.title);
  const outputKeyword = getOutputKeyword(entry, categoryLabel);
  const angles = getPromptSeoAngles(entry, 4);
  const descriptor = getPromptSeoDescriptor(entry, 7);
  const angleCandidates = angles.filter((angle) => !hasPhrase(promptTitle, angle));
  const midjourneyStyleCode = getMidjourneyStyleCode(entry);
  const cleanSourceTitleCandidate = getCleanSourceTitleCandidate(entry);
  const usefulTitleWords = getTitleSpecificity(promptTitle);
  const titleWordCount = promptTitle.split(/[^a-z0-9]+/i).filter(Boolean).length;
  const sourceHandleTitleLabel = getSourceHandleTitleLabel(entry.authorHandle);
  const sourceVariantTitleCandidates =
    sourceHandleTitleLabel &&
    /^spring guangzhou city poster(?:\s+\d{8,})?$/i.test(promptTitle)
      ? [`${sourceHandleTitleLabel} Guangzhou Spring Poster`]
      : [];
  const titleIsSpecific =
    !isTemplateLikeTitle(promptTitle) &&
    promptTitle.length <= 42 &&
    (usefulTitleWords >= 2 ||
      /\bui\s+ux\s+mockup\b/i.test(promptTitle) ||
      (usefulTitleWords >= 1 && titleWordCount <= 3));
  const longEntityTitleCandidate =
    !titleIsSpecific &&
    !isTemplateLikeTitle(promptTitle) &&
    usefulTitleWords >= 2
      ? appendOutputKeyword(promptTitle, outputKeyword)
      : '';
  const imageSetTitleCandidate =
    isPoorPromptTitle(promptTitle) && descriptor
      ? `${descriptor} ${entry.images.length > 1 ? 'Image Set' : 'Single Image'}`
      : '';
  const specificTitleBase =
    titleIsSpecific && midjourneyStyleCode && promptTitle.length <= 8 && descriptor
      ? `${promptTitle} ${descriptor.replace(/\b\d{6,10}\b/g, '')} Sref ${midjourneyStyleCode}`
      : titleIsSpecific && midjourneyStyleCode
      ? `${promptTitle} Sref ${midjourneyStyleCode}`
      : titleIsSpecific && !hasPhrase(promptTitle, outputKeyword)
        ? `${promptTitle} ${outputKeyword}`
        : promptTitle;
  const specificTitleCandidates = titleIsSpecific
    ? [...sourceVariantTitleCandidates, specificTitleBase]
    : sourceVariantTitleCandidates;
  const sourceTitleCandidates = cleanSourceTitleCandidate
    ? [appendOutputKeyword(cleanSourceTitleCandidate, outputKeyword)]
    : [];
  const fashionSubjectMatch = descriptor?.match(
    /^([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,2})\s+Features\b/
  );
  const fashionOutfitAngle = angles.find((angle) =>
    /\b(?:ribbed|sleeve|jeans|heels|dress|jacket|coat|outfit|wardrobe)\b/i.test(
      angle
    )
  );
  const fashionTitleCandidates =
    /^photorealistic fashion photography photo$/i.test(promptTitle)
      ? [
          fashionSubjectMatch
            ? `${fashionSubjectMatch[1]} Fashion Photo`
            : '',
          fashionOutfitAngle
            ? `${fashionOutfitAngle} Fashion Photo`
            : 'Photorealistic Fashion Photo',
        ]
      : [];
  const authorTitleCandidates =
    /^full page colored manga illustration$/i.test(promptTitle) && entry.authorName
      ? [`${entry.authorName} ${outputKeyword}`]
      : [];
  const genericTitleCandidates = titleIsSpecific
    ? []
    : [
        ...fashionTitleCandidates,
        ...authorTitleCandidates,
        imageSetTitleCandidate,
        longEntityTitleCandidate,
        ...sourceTitleCandidates,
        ...sortTitleSignals([
          descriptor ?? '',
          ...angleCandidates,
        ]).map((signal) => appendOutputKeyword(signal, outputKeyword)),
      ];
  const candidates = [
    ...specificTitleCandidates,
    ...genericTitleCandidates,
    promptTitle.length <= 42 ? promptTitle : '',
    descriptor ? `${descriptor} ${categoryLabel}` : '',
    ...angleCandidates.map((angle) => `${angle} ${categoryLabel}`),
    `${modelLabel} ${categoryLabel}`,
    `${categoryLabel} ${modelLabel} Visual`,
  ];

  return candidates.filter(Boolean);
};

const fitTitle = (entry: VoguePromptEntry) => {
  const suffix = ' | Vogue AI';
  const promptTitle = stripPromptTitleSuffix(entry.title);
  const titleBudget = 60 - suffix.length;

  for (const candidate of getPromptTitleBaseCandidates(entry)) {
    const title = `${buildPromptTitleValue(candidate, titleBudget)}${suffix}`;

    if (title.length >= 40 && title.length <= 60) return title;
  }

  return `${buildPromptTitleValue(promptTitle, titleBudget)}${suffix}`;
};

const fitDescription = (entry: VoguePromptEntry) => {
  const modelLabel = MODEL_LABELS[entry.modelId ?? ''] ?? 'AI image model';
  const categoryLabel = CATEGORY_LABELS[entry.categoryKey ?? ''] ?? 'creative';
  const entryTitle = stripPromptTitleSuffix(entry.title);
  const entryTitleIsSpecific =
    !isTemplateLikeTitle(entryTitle) && getTitleSpecificity(entryTitle) >= 2;
  const promptTitle = truncatePromptSeoText(
    buildPromptTitleValue(
      entryTitleIsSpecific
        ? entryTitle
        : getPromptTitleBaseCandidates(entry)[0] ?? entry.title,
      54
    )
      .replace(/\s+AI(?:\s+Image)?\s+Prompt$/i, ''),
    52
  );
  const useCase =
    CATEGORY_SHORT_USE_CASES[entry.categoryKey ?? ''] ??
    CATEGORY_USE_CASES[entry.categoryKey ?? ''] ??
    'visual exploration';
  const focus = getDescriptionFocus(entry, promptTitle);
  const categoryDescription = getInlineCategoryLabel(categoryLabel);
  const buildDescription = (
    focusMaxLength: number,
    includeFocus: boolean,
    useClause: 'full' | 'reference' | 'compact' = 'full'
  ) => {
    const focusClause =
      includeFocus && focus
        ? ` focused on ${truncatePromptSeoText(focus, focusMaxLength)}`
        : '';
    const useClauseText =
      useClause === 'full'
        ? `${useCase}, image reference review, reusable prompt variables, and fast remixing in Vogue AI`
        : useClause === 'reference'
          ? `${useCase}, image reference review, and remixing in Vogue AI`
          : `${useCase} and fast remixing in Vogue AI`;

    return normalizePromptSeoWhitespace(
      `${promptTitle} is a ${modelLabel} ${categoryDescription} prompt${focusClause}. Use it for ${useClauseText}.`
    );
  };
  const candidates = [
    buildDescription(58, true),
    buildDescription(44, true),
    buildDescription(34, true),
    buildDescription(0, false),
    buildDescription(44, true, 'reference'),
    buildDescription(34, true, 'reference'),
    buildDescription(0, false, 'reference'),
    buildDescription(34, true, 'compact'),
    buildDescription(0, false, 'compact'),
  ];
  const matchingCandidate = candidates.find(
    (candidate) =>
      candidate.length >= 140 &&
      candidate.length <= 166 &&
      /Vogue AI/.test(candidate)
  );

  if (matchingCandidate) return matchingCandidate;

  const fallback =
    candidates.find(
      (candidate) => candidate.length < 166 && /Vogue AI/.test(candidate)
    ) ??
    candidates.find((candidate) => candidate.length < 166) ??
    candidates.at(-1) ??
    '';

  return `${truncatePromptSeoText(fallback, 165).replace(/[,:;.\s-]+$/, '')}.`;
};

const getPrimaryImageUrl = (entry: VoguePromptEntry) =>
  entry.images[0] ?? '/social-share.jpg';

const toAbsoluteUrl = (pathOrUrl: string) => {
  if (/^https?:\/\//.test(pathOrUrl)) return pathOrUrl;
  return `${BASE_URL}${pathOrUrl.startsWith('/') ? '' : '/'}${pathOrUrl}`;
};

export const getPromptPageCanonicalPath = (entry: VoguePromptEntry) =>
  getPromptPagePath(entry);

export const isIndexablePromptPage = isIndexablePromptPublicId;

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
        text: getPromptSeoSourceText(entry),
        inLanguage: 'en',
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
