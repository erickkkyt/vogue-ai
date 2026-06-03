import importedPromptEntries from './generated/awesome-gptimage2-prompts.json';
import importedSiteAdditionEntries from './generated/awesome-gptimage2-site-additions.json';
import importedNanoBananaPromptEntries from './generated/awesome-ai-prompts-nano-banana.json';
import importedMidjourneyPromptEntries from './generated/awesome-ai-prompts-midjourney.json';
import frPromptTranslations from './generated/awesome-gptimage2-prompts.i18n.fr.json';
import jaPromptTranslations from './generated/awesome-gptimage2-prompts.i18n.ja.json';
import koPromptTranslations from './generated/awesome-gptimage2-prompts.i18n.ko.json';
import ptPromptTranslations from './generated/awesome-gptimage2-prompts.i18n.pt.json';
import ruPromptTranslations from './generated/awesome-gptimage2-prompts.i18n.ru.json';
import zhPromptTranslations from './generated/awesome-gptimage2-prompts.i18n.zh.json';
import frSiteAdditionTranslations from './generated/awesome-gptimage2-site-additions.i18n.fr.json';
import jaSiteAdditionTranslations from './generated/awesome-gptimage2-site-additions.i18n.ja.json';
import koSiteAdditionTranslations from './generated/awesome-gptimage2-site-additions.i18n.ko.json';
import ptSiteAdditionTranslations from './generated/awesome-gptimage2-site-additions.i18n.pt.json';
import ruSiteAdditionTranslations from './generated/awesome-gptimage2-site-additions.i18n.ru.json';
import zhSiteAdditionTranslations from './generated/awesome-gptimage2-site-additions.i18n.zh.json';
import enAwesomeAiPromptTranslations from './generated/awesome-ai-prompts.i18n.en.json';
import frAwesomeAiPromptTranslations from './generated/awesome-ai-prompts.i18n.fr.json';
import jaAwesomeAiPromptTranslations from './generated/awesome-ai-prompts.i18n.ja.json';
import koAwesomeAiPromptTranslations from './generated/awesome-ai-prompts.i18n.ko.json';
import ptAwesomeAiPromptTranslations from './generated/awesome-ai-prompts.i18n.pt.json';
import ruAwesomeAiPromptTranslations from './generated/awesome-ai-prompts.i18n.ru.json';
import zhAwesomeAiPromptTranslations from './generated/awesome-ai-prompts.i18n.zh.json';
import {
  VOGUE_PROMPT_CATEGORY_DEFINITIONS,
  getVoguePromptCategoryKey,
  getVoguePromptDisplayTitle,
  type VoguePromptCategoryKey,
  type VoguePromptConcreteCategoryKey,
} from './prompt-taxonomy';
import {
  getVoguePromptImageDimensions,
  type VoguePromptImageDimensions,
} from './prompt-image-dimensions';
import { normalizeVogueLocale, type VogueLocale } from '@/i18n/vogue';

export type VoguePromptEntry = {
  id: string;
  publicId: string;
  sourceOrder: number;
  title: string;
  sourceTitle?: string;
  description?: string;
  images: string[];
  imagePrompts?: VoguePromptImagePrompt[];
  prompt: string;
  originalPrompt?: string;
  promptTranslations?: Partial<Record<VogueLocale, string>>;
  modelId?: string;
  authorName?: string;
  authorHandle?: string;
  publishedLabel: string;
  publishedAtMs?: number;
  sourceUrl?: string;
  sourceType?: string;
  languages?: string[];
  categoryText?: string;
  categoryKey?: VoguePromptConcreteCategoryKey;
};

export type VoguePromptImagePrompt = {
  image: string;
  prompt: string;
  promptTranslations?: Partial<Record<VogueLocale, string>>;
  sourceId?: string;
  title?: string;
};

export type VoguePromptGalleryEntry = Pick<
  VoguePromptEntry,
  | 'id'
  | 'publicId'
  | 'sourceOrder'
  | 'title'
  | 'sourceTitle'
  | 'images'
  | 'modelId'
  | 'authorName'
  | 'authorHandle'
  | 'publishedLabel'
  | 'publishedAtMs'
  | 'sourceUrl'
  | 'sourceType'
  | 'languages'
  | 'categoryKey'
> & {
  imageCount: number;
  imageDimensions?: VoguePromptImageDimensions | null;
};

type PromptGalleryOptions = {
  limit?: number;
  offset?: number;
  modelId?: string | null;
  categoryKey?: VoguePromptCategoryKey | null;
};

type PromptLocalizedFields = {
  title: string;
  prompt: string;
};

type PromptTranslationMap = Record<string, PromptLocalizedFields>;

const promptTranslationMaps: Record<VogueLocale, PromptTranslationMap> = {
  en: {
    ...enAwesomeAiPromptTranslations,
  },
  zh: {
    ...zhPromptTranslations,
    ...zhSiteAdditionTranslations,
    ...zhAwesomeAiPromptTranslations,
  },
  fr: {
    ...frPromptTranslations,
    ...frSiteAdditionTranslations,
    ...frAwesomeAiPromptTranslations,
  },
  ru: {
    ...ruPromptTranslations,
    ...ruSiteAdditionTranslations,
    ...ruAwesomeAiPromptTranslations,
  },
  pt: {
    ...ptPromptTranslations,
    ...ptSiteAdditionTranslations,
    ...ptAwesomeAiPromptTranslations,
  },
  ja: {
    ...jaPromptTranslations,
    ...jaSiteAdditionTranslations,
    ...jaAwesomeAiPromptTranslations,
  },
  ko: {
    ...koPromptTranslations,
    ...koSiteAdditionTranslations,
    ...koAwesomeAiPromptTranslations,
  },
};

const PROMPT_SOURCE_CODES = {
  x: '01',
  other: '02',
  vogueai: '03',
} as const;

const PROMPT_MODEL_CODES: Record<string, string> = {
  gptimage2: '01',
  nanobanana: '02',
  midjourney: '03',
};

const PROMPT_CATEGORY_CODES: Record<VoguePromptConcreteCategoryKey, string> = {
  product: '01',
  poster: '02',
  avatar: '03',
  ui: '04',
  diagram: '05',
  anime: '06',
  photo: '07',
  art: '08',
  epic: '09',
};

const legacyPromptPublicIds = new Map<string, string>([
  ['x-2059998163532952054', '010307008'],
  ['vogueai-20260603-codex-macos-permission-dialog-ai-prompt', '030104001'],
  ['vogueai-20260603-watercolor-travel-poster-ai-prompt', '030108001'],
  ['vogueai-20260603-double-exposure-city-poster-ai-prompt', '030102001'],
]);

export const INDEXABLE_PROMPT_PAGE_LIMIT = 80;

const legacyPublicIdOrderPrefix = [
  'x-2045092449803284923',
  'x-2044592146255352100',
  'x-2045358053831172358',
  'x-2045836887684694395',
  'x-2045875219307655337',
  'x-2045396918965285111',
  'x-2045368305079447853',
  'x-2045504669401653414',
  'x-2045385588065313057',
  'x-2046115431144902732',
] as const;

const legacyPublicIdRank = new Map<string, number>(
  legacyPublicIdOrderPrefix.map((id, index) => [id, index] as const)
);

const visualDuplicatePromptIds = new Set([
  'x-2046546991006802057-r0-youtube-thumbnail-explosive-japanese-x-monetization-thumbnail',
  'x-2046546991006802057-r1-youtube-thumbnail-japanese-x-monetization-thumbnail',
  'x-2046546991006802057-r2-youtube-thumbnail-flashy-x-monetization-youtube-thumbnail',
  'x-2046956068417278208-r0-convex-mirror-night-street-selfie',
  'x-2047086715911999728-r1-cyberpunk-girl-with-giant-mech-claw',
  'x-2046971122558611682-r0-e-commerce-main-image-split-screen-athleisure-couch-ad',
  'x-2046929515092554025-r1-e-commerce-main-image-child-three-view-clothing-reference',
  'x-2047085107979419924-r1-minimal-sci-fi-anime-girl-portrait',
]);

const getPromptPublishedAtMs = (publishedLabel: string) => {
  const publishedAtMs = new Date(publishedLabel).getTime();

  return Number.isNaN(publishedAtMs) ? 0 : publishedAtMs;
};

const getPromptSourceCode = (
  sourceUrl?: string | null,
  sourceType?: string | null
) => {
  if (sourceType === 'vogueai') return PROMPT_SOURCE_CODES.vogueai;
  if (sourceType === 'x') return PROMPT_SOURCE_CODES.x;
  if (!sourceUrl) return PROMPT_SOURCE_CODES.other;

  try {
    const host = new URL(sourceUrl).hostname.replace(/^www\./, '');

    return host === 'x.com' || host === 'twitter.com'
      ? PROMPT_SOURCE_CODES.x
      : PROMPT_SOURCE_CODES.other;
  } catch {
    return PROMPT_SOURCE_CODES.other;
  }
};

const getPromptModelCode = (modelId?: string | null) =>
  PROMPT_MODEL_CODES[modelId ?? ''] ?? '99';

const getPromptCategoryCode = (
  categoryKey?: VoguePromptConcreteCategoryKey | null
) => PROMPT_CATEGORY_CODES[categoryKey ?? 'photo'];

const comparePromptEntriesForPublicIds = (
  left: VoguePromptEntry,
  right: VoguePromptEntry
) => {
  const leftLegacyRank = legacyPublicIdRank.get(left.id);
  const rightLegacyRank = legacyPublicIdRank.get(right.id);

  if (leftLegacyRank !== undefined && rightLegacyRank !== undefined) {
    return leftLegacyRank - rightLegacyRank;
  }

  if (leftLegacyRank !== undefined) {
    return -1;
  }

  if (rightLegacyRank !== undefined) {
    return 1;
  }

  return left.sourceOrder - right.sourceOrder;
};

const comparePromptEntriesForGallery = (
  left: VoguePromptEntry,
  right: VoguePromptEntry
) => {
  const publishedAtDelta =
    (right.publishedAtMs ?? 0) - (left.publishedAtMs ?? 0);

  if (publishedAtDelta !== 0) return publishedAtDelta;

  const sourceOrderDelta = left.sourceOrder - right.sourceOrder;
  if (sourceOrderDelta !== 0) return sourceOrderDelta;

  return left.id.localeCompare(right.id);
};

const buildPromptTranslations = (entry: VoguePromptEntry) => {
  const translations: Partial<Record<VogueLocale, string>> = {};

  for (const [locale, translationMap] of Object.entries(promptTranslationMaps) as Array<
    [VogueLocale, PromptTranslationMap]
  >) {
    const translatedPrompt = translationMap[entry.id]?.prompt?.trim();
    if (!translatedPrompt) continue;

    const sanitizedPrompt = sanitizeLocalizedText(translatedPrompt, locale);
    if (sanitizedPrompt.trim() === entry.prompt.trim()) continue;

    translations[locale] = sanitizedPrompt;
  }

  return translations;
};

const buildImagePromptTranslations = (entry: VoguePromptEntry) =>
  entry.imagePrompts?.map((imagePrompt) => {
    const translations: Partial<Record<VogueLocale, string>> = {};
    const sourceId = imagePrompt.sourceId;

    if (sourceId) {
      for (const [locale, translationMap] of Object.entries(promptTranslationMaps) as Array<
        [VogueLocale, PromptTranslationMap]
      >) {
        const translatedPrompt = translationMap[sourceId]?.prompt?.trim();
        if (!translatedPrompt) continue;

        const sanitizedPrompt = sanitizeLocalizedText(translatedPrompt, locale);
        if (sanitizedPrompt.trim() === imagePrompt.prompt.trim()) continue;

        translations[locale] = sanitizedPrompt;
      }
    }

    return {
      ...imagePrompt,
      promptTranslations:
        Object.keys(translations).length > 0 ? translations : undefined,
    };
  });

const sanitizeLocalizedText = (
  value: string,
  _locale: VogueLocale
) => {
  let nextValue = value;

  nextValue = nextValue
    .replace(/\bSaas\b/g, 'SaaS')
    .replace(/\bAi\b/g, 'AI')
    .replace(/\bIphone\b/g, 'iPhone')
    .replace(/\bYoutube\b/g, 'YouTube')
    .replace(/\bGta\b/g, 'GTA')
    .replace(/\bTotk\b/g, 'TOTK')
    .replace(/\bEa Fc\b/g, 'EA FC')
    .replace(/\bTiktok\b/g, 'TikTok')
    .replace(/\bPov\b/g, 'POV')
    .replace(/Douyin Tiktok/g, 'Douyin/TikTok');

  return nextValue;
};

const localizePublishedLabel = (publishedLabel: string, locale: VogueLocale) => {
  const trimmedLabel = publishedLabel.trim();

  if (!trimmedLabel) {
    return '';
  }

  const parsedDate = new Date(trimmedLabel);

  if (Number.isNaN(parsedDate.getTime())) {
    return trimmedLabel;
  }

  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(parsedDate);
};

const baseEntries = (
  [
    ...(importedPromptEntries as VoguePromptEntry[]),
    ...(importedSiteAdditionEntries as VoguePromptEntry[]),
    ...(importedNanoBananaPromptEntries as VoguePromptEntry[]),
    ...(importedMidjourneyPromptEntries as VoguePromptEntry[]),
  ] as VoguePromptEntry[]
)
  .map((entry) => {
    const displayTitle = getVoguePromptDisplayTitle(entry);
    const imagePromptText =
      entry.imagePrompts
        ?.map((imagePrompt) =>
          `${imagePrompt.title ?? ''} ${imagePrompt.prompt}`.trim()
        )
        .join(' ') ?? '';
    const categoryKey = getVoguePromptCategoryKey({
      ...entry,
      title: displayTitle,
    });

    return {
      ...entry,
      title: displayTitle,
      sourceTitle: entry.sourceTitle ?? entry.title,
      categoryKey,
      publishedAtMs: getPromptPublishedAtMs(entry.publishedLabel),
      categoryText: `${entry.title} ${displayTitle} ${entry.description ?? ''} ${entry.prompt} ${imagePromptText}`,
    };
  })
  .filter(
    (entry) =>
      entry.prompt && entry.images?.length > 0 && !visualDuplicatePromptIds.has(entry.id)
  )
  .toSorted(comparePromptEntriesForPublicIds);

const assignPublicPromptIds = (promptEntries: VoguePromptEntry[]) => {
  const groupCounts = new Map<string, number>();
  const reservedPublicIds = new Set(legacyPromptPublicIds.values());
  const usedPublicIds = new Set<string>();

  return promptEntries.map((entry) => {
    const legacyPublicId = legacyPromptPublicIds.get(entry.id);
    if (legacyPublicId) {
      usedPublicIds.add(legacyPublicId);
      return {
        ...entry,
        publicId: legacyPublicId,
      };
    }

    const sourceCode = getPromptSourceCode(entry.sourceUrl, entry.sourceType);
    const modelCode = getPromptModelCode(entry.modelId);
    const categoryCode = getPromptCategoryCode(entry.categoryKey);
    const groupKey = `${sourceCode}${modelCode}${categoryCode}`;
    let sequence = (groupCounts.get(groupKey) ?? 0) + 1;
    let publicId = `${groupKey}${String(sequence).padStart(3, '0')}`;

    while (reservedPublicIds.has(publicId) || usedPublicIds.has(publicId)) {
      sequence += 1;
      publicId = `${groupKey}${String(sequence).padStart(3, '0')}`;
    }
    groupCounts.set(groupKey, sequence);
    usedPublicIds.add(publicId);

    return {
      ...entry,
      publicId,
    };
  });
};

const entries = assignPublicPromptIds(baseEntries);

export const VOGUE_PROMPT_ENTRY_COUNT = entries.length;

export function getLocalizedPromptEntry(
  entry: VoguePromptEntry,
  locale?: string | null
): VoguePromptEntry {
  const promptLocale = normalizeVogueLocale(locale);

  const localizedFields = promptTranslationMaps[promptLocale][entry.id] ?? null;
  const hasCuratedDisplayTitle =
    Boolean(entry.sourceTitle) && entry.sourceTitle !== entry.title;

  return {
    ...entry,
    title: localizedFields?.title
      ? sanitizeLocalizedText(localizedFields.title, promptLocale)
      : hasCuratedDisplayTitle
        ? entry.title
        : sanitizeLocalizedText(entry.title, promptLocale),
    prompt: sanitizeLocalizedText(entry.prompt, promptLocale),
    originalPrompt: entry.prompt,
    imagePrompts: buildImagePromptTranslations(entry),
    promptTranslations: buildPromptTranslations(entry),
    publishedLabel: localizePublishedLabel(entry.publishedLabel, promptLocale),
  };
}

export function getLocalizedPromptEntries(
  locale?: string | null,
  limit = entries.length
) {
  return entries
    .slice(0, limit)
    .map((entry) => getLocalizedPromptEntry(entry, locale));
}

export function getFeaturedPromptEntries(limit = entries.length) {
  return getLocalizedPromptEntries('en', limit);
}

export function getPromptEntryById(id: string, locale?: string | null) {
  const entry =
    entries.find((item) => item.id === id || item.publicId === id) ?? null;

  return entry ? getLocalizedPromptEntry(entry, locale) : null;
}

export function getIndexablePromptPageEntries(limit = INDEXABLE_PROMPT_PAGE_LIMIT) {
  return entries
    .slice(0, Math.max(1, Math.min(limit, INDEXABLE_PROMPT_PAGE_LIMIT)))
    .map((entry) => getLocalizedPromptEntry(entry, 'en'));
}

const isConcreteCategoryKey = (
  categoryKey?: VoguePromptCategoryKey | null
): categoryKey is VoguePromptConcreteCategoryKey =>
  Boolean(categoryKey && categoryKey !== 'all');

const matchesGalleryOptions = (
  entry: VoguePromptEntry,
  options: PromptGalleryOptions = {}
) => {
  if (options.modelId && options.modelId !== 'all') {
    if ((entry.modelId || 'unknown') !== options.modelId) return false;
  }

  if (isConcreteCategoryKey(options.categoryKey)) {
    return entry.categoryKey === options.categoryKey;
  }

  return true;
};

const toPromptGalleryEntry = (
  entry: VoguePromptEntry,
  locale?: string | null
): VoguePromptGalleryEntry => {
  const localizedEntry = getLocalizedPromptEntry(entry, locale);
  const firstImage = localizedEntry.images[0];
  const thumbnailUrls = localizedEntry.images.map(
    (_image, imageIndex) =>
      `/api/gpt-image-2-prompts/thumbnail?id=${encodeURIComponent(
        localizedEntry.id
      )}&index=${imageIndex}`
  );

  return {
    id: localizedEntry.id,
    publicId: localizedEntry.publicId,
    sourceOrder: localizedEntry.sourceOrder,
    title: localizedEntry.title,
    sourceTitle: localizedEntry.sourceTitle,
    images: thumbnailUrls,
    imageCount: localizedEntry.images.length,
    imageDimensions: firstImage
      ? getVoguePromptImageDimensions(firstImage)
      : null,
    modelId: localizedEntry.modelId,
    authorName: localizedEntry.authorName,
    authorHandle: localizedEntry.authorHandle,
    publishedLabel: localizedEntry.publishedLabel,
    publishedAtMs: localizedEntry.publishedAtMs,
    sourceUrl: localizedEntry.sourceUrl,
    sourceType: localizedEntry.sourceType,
    languages: localizedEntry.languages,
    categoryKey: localizedEntry.categoryKey,
  };
};

export function getLocalizedPromptGalleryEntries(
  locale?: string | null,
  options: PromptGalleryOptions = {}
) {
  const offset = Math.max(0, options.offset ?? 0);
  const limit = Math.max(1, Math.min(options.limit ?? 80, 200));

  return entries
    .filter((entry) => matchesGalleryOptions(entry, options))
    .toSorted(comparePromptEntriesForGallery)
    .slice(offset, offset + limit)
    .map((entry) => toPromptGalleryEntry(entry, locale));
}

export function getPromptGalleryEntryTotal(options: PromptGalleryOptions = {}) {
  return entries.filter((entry) => matchesGalleryOptions(entry, options)).length;
}

export function getPromptGalleryCounts() {
  return entries.reduce<{
    total: number;
    models: Record<string, number>;
    categories: Record<VoguePromptConcreteCategoryKey, number>;
  }>(
    (counts, entry) => {
      const modelId = entry.modelId || 'unknown';

      counts.total += 1;
      counts.models[modelId] = (counts.models[modelId] || 0) + 1;
      if (entry.categoryKey) {
        counts.categories[entry.categoryKey] =
          (counts.categories[entry.categoryKey] || 0) + 1;
      }

      return counts;
    },
    {
      total: 0,
      models: {},
      categories: Object.fromEntries(
        VOGUE_PROMPT_CATEGORY_DEFINITIONS.filter(
          (category) => category.key !== 'all'
        ).map((category) => [category.key, 0])
      ) as Record<VoguePromptConcreteCategoryKey, number>,
    }
  );
}
