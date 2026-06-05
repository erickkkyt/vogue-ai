import importedPromptEntries from './generated/awesome-gptimage2-prompts.json';
import importedSiteAdditionEntries from './generated/awesome-gptimage2-site-additions.json';
import importedNanoBananaPromptEntries from './generated/awesome-ai-prompts-nano-banana.json';
import importedMidjourneyPromptEntries from './generated/awesome-ai-prompts-midjourney.json';
import promptSeoSlugs from './generated/prompt-seo-slugs.json';
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
  getVoguePromptClassificationTitle,
  getVoguePromptDisplayTitle,
  type VoguePromptCategoryKey,
  type VoguePromptConcreteCategoryKey,
} from './prompt-taxonomy';
import {
  getVoguePromptImageDimensions,
  type VoguePromptImageDimensions,
} from './prompt-image-dimensions';
import { createPromptSeoSlug } from './prompt-slug-utils';
import { normalizeVogueLocale, type VogueLocale } from '@/i18n/vogue';

export type VoguePromptEntry = {
  id: string;
  publicId: string;
  seoSlug?: string;
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
  | 'seoSlug'
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

export type VogueRelatedPromptEntry = Pick<
  VoguePromptEntry,
  | 'id'
  | 'publicId'
  | 'seoSlug'
  | 'title'
  | 'images'
  | 'modelId'
  | 'categoryKey'
>;

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

const INDEXABLE_PROMPT_CORE_PAGE_LIMIT = 80;
const INDEXABLE_PROMPT_MODEL_PAGE_SIZE = 18;
const INDEXABLE_PROMPT_MODEL_PAGE_MODEL_IDS = [
  'nanobanana',
  'midjourney',
] as const;

export const INDEXABLE_PROMPT_PAGE_LIMIT =
  INDEXABLE_PROMPT_CORE_PAGE_LIMIT +
  INDEXABLE_PROMPT_MODEL_PAGE_MODEL_IDS.length *
    INDEXABLE_PROMPT_MODEL_PAGE_SIZE;

const promptSeoSlugMap = promptSeoSlugs as Record<string, string>;

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
    const classificationTitle = getVoguePromptClassificationTitle(entry);
    const imagePromptText =
      entry.imagePrompts
        ?.map((imagePrompt) =>
          `${imagePrompt.title ?? ''} ${imagePrompt.prompt}`.trim()
        )
        .join(' ') ?? '';
    const categoryKey = getVoguePromptCategoryKey({
      ...entry,
      title: classificationTitle,
    });

    return {
      ...entry,
      title: displayTitle,
      sourceTitle: entry.sourceTitle ?? entry.title,
      categoryKey,
      publishedAtMs: getPromptPublishedAtMs(entry.publishedLabel),
      categoryText: `${entry.title} ${displayTitle} ${classificationTitle} ${entry.description ?? ''} ${entry.prompt} ${imagePromptText}`,
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

const entries = assignPublicPromptIds(baseEntries).map((entry) => ({
  ...entry,
  seoSlug: promptSeoSlugMap[entry.publicId] ?? createPromptSeoSlug(entry),
}));

export const VOGUE_PROMPT_ENTRY_COUNT = entries.length;

const promptEntriesById = new Map<string, VoguePromptEntry>();

for (const entry of entries) {
  promptEntriesById.set(entry.id, entry);
  promptEntriesById.set(entry.publicId, entry);
}

const relatedPromptEntriesByCategory = entries.reduce(
  (categoryMap, entry) => {
    if (!entry.categoryKey) return categoryMap;

    const categoryEntries = categoryMap.get(entry.categoryKey) ?? [];
    categoryEntries.push(entry);
    categoryMap.set(entry.categoryKey, categoryEntries);

    return categoryMap;
  },
  new Map<VoguePromptConcreteCategoryKey, VoguePromptEntry[]>()
);

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
  const entry = promptEntriesById.get(id) ?? null;

  return entry ? getLocalizedPromptEntry(entry, locale) : null;
}

const appendUniqueIndexablePromptEntries = (
  target: VoguePromptEntry[],
  selectedPublicIds: Set<string>,
  candidates: VoguePromptEntry[],
  limit: number
) => {
  for (const candidate of candidates) {
    if (target.length >= limit) break;
    if (selectedPublicIds.has(candidate.publicId)) continue;

    target.push(candidate);
    selectedPublicIds.add(candidate.publicId);
  }
};

const indexablePromptPageEntries = (() => {
  const selectedEntries: VoguePromptEntry[] = [];
  const selectedPublicIds = new Set<string>();

  appendUniqueIndexablePromptEntries(
    selectedEntries,
    selectedPublicIds,
    entries,
    INDEXABLE_PROMPT_CORE_PAGE_LIMIT
  );

  for (const modelId of INDEXABLE_PROMPT_MODEL_PAGE_MODEL_IDS) {
    appendUniqueIndexablePromptEntries(
      selectedEntries,
      selectedPublicIds,
      entries
        .filter((entry) => entry.modelId === modelId)
        .toSorted(comparePromptEntriesForGallery),
      selectedEntries.length + INDEXABLE_PROMPT_MODEL_PAGE_SIZE
    );
  }

  return selectedEntries;
})();

export function getIndexablePromptPageEntries(limit = INDEXABLE_PROMPT_PAGE_LIMIT) {
  return indexablePromptPageEntries
    .slice(0, Math.max(1, Math.min(limit, INDEXABLE_PROMPT_PAGE_LIMIT)))
    .map((entry) => getLocalizedPromptEntry(entry, 'en'));
}

export function getStaticPromptPageEntries() {
  return entries.map((entry) => getLocalizedPromptEntry(entry, 'en'));
}

const RELATED_PROMPT_STOP_WORDS = new Set([
  'and',
  'are',
  'for',
  'from',
  'image',
  'into',
  'prompt',
  'style',
  'the',
  'this',
  'use',
  'using',
  'with',
]);

const RELATED_PROMPT_AFFINITY_GROUPS = [
  ['post', 'posts', 'feed', 'social', 'twitter', 'profile', 'page'],
  ['dashboard', 'interface', 'screen', 'website', 'homepage', 'landing', 'app'],
  ['poster', 'cover', 'flyer', 'campaign', 'thumbnail'],
  ['product', 'ecommerce', 'packaging', 'brand', 'advertisement', 'mockup'],
  ['portrait', 'avatar', 'headshot', 'selfie', 'identity'],
  ['diagram', 'infographic', 'map', 'chart', 'blueprint', 'breakdown'],
] as const;

const RELATED_PROMPT_ADJACENT_CATEGORY_KEYS: Record<
  VoguePromptConcreteCategoryKey,
  VoguePromptConcreteCategoryKey[]
> = {
  product: ['poster', 'diagram', 'ui', 'photo'],
  poster: ['art', 'product', 'diagram', 'epic', 'photo'],
  avatar: ['photo', 'art', 'anime'],
  ui: ['diagram', 'product', 'poster'],
  diagram: ['ui', 'product', 'poster', 'art'],
  anime: ['art', 'avatar', 'poster'],
  photo: ['avatar', 'art', 'poster', 'product'],
  art: ['poster', 'anime', 'photo', 'avatar', 'diagram'],
  epic: ['poster', 'art', 'photo'],
};

const RELATED_PROMPT_DEFAULT_LINK_COUNT = 3;
const RELATED_PROMPT_COVERAGE_RANK_LIMIT = 240;
const RELATED_PROMPT_COVERAGE_MAX_SCORE_DROP = 110;
const RELATED_PROMPT_COVERAGE_MIN_SCORE = 95;
const RELATED_PROMPT_RECIPROCAL_MAX_SCORE_DROP = 260;
const RELATED_PROMPT_RECIPROCAL_MIN_SCORE = 30;

type ScoredRelatedPromptEntry = {
  entry: VoguePromptEntry;
  score: number;
};

type RelatedPromptCoverageOpportunity = {
  candidate: ScoredRelatedPromptEntry;
  replaced: ScoredRelatedPromptEntry;
  scoreDrop: number;
  sourceEntry: VoguePromptEntry;
};

type RelatedPromptDiversityOpportunity = RelatedPromptCoverageOpportunity & {
  improvesCoverage: boolean;
  replacedIndex: number;
};

const getRelatedPromptText = (entry: VoguePromptEntry) => {
  const promptTranslationText = Object.values(entry.promptTranslations ?? {}).join(' ');
  const imagePromptText =
    entry.imagePrompts
      ?.map((imagePrompt) =>
        [
          imagePrompt.title,
          imagePrompt.prompt,
          ...Object.values(imagePrompt.promptTranslations ?? {}),
        ]
          .filter(Boolean)
          .join(' ')
      )
      .join(' ') ?? '';

  return `${entry.title} ${entry.sourceTitle ?? ''} ${
    entry.categoryText ?? ''
  } ${promptTranslationText} ${imagePromptText}`;
};

const getRelatedPromptTokens = (entry: VoguePromptEntry) =>
  new Set(
    getRelatedPromptText(entry)
      .toLowerCase()
      .split(/[^a-z0-9]+/i)
      .filter(
        (token) =>
          token.length > 3 &&
          !RELATED_PROMPT_STOP_WORDS.has(token) &&
          !/^\d+$/.test(token)
      )
  );

const relatedPromptTokenCache = new Map<string, Set<string>>();

const getCachedRelatedPromptTokens = (entry: VoguePromptEntry) => {
  const cacheKey = entry.publicId || entry.id;
  const cachedTokens = relatedPromptTokenCache.get(cacheKey);

  if (cachedTokens) return cachedTokens;

  const tokens = getRelatedPromptTokens(entry);
  relatedPromptTokenCache.set(cacheKey, tokens);

  return tokens;
};

const hasAnyToken = (tokens: Set<string>, values: readonly string[]) =>
  values.some((value) => tokens.has(value));

const getRelatedPromptAffinityScore = (
  sourceTokens: Set<string>,
  candidateTokens: Set<string>
) =>
  RELATED_PROMPT_AFFINITY_GROUPS.reduce(
    (score, group) =>
      hasAnyToken(sourceTokens, group) && hasAnyToken(candidateTokens, group)
        ? score + 24
        : score,
    0
  );

const getRelatedPromptScore = (
  sourceEntry: VoguePromptEntry,
  candidateEntry: VoguePromptEntry,
  sourceTokens: Set<string>,
  candidateTokens = getRelatedPromptTokens(candidateEntry)
) => {
  let sharedTokenCount = 0;

  for (const token of candidateTokens) {
    if (sourceTokens.has(token)) sharedTokenCount += 1;
  }

  return (
    (candidateEntry.categoryKey === sourceEntry.categoryKey ? 100 : 0) +
    (candidateEntry.modelId === sourceEntry.modelId ? 30 : 0) +
    Math.min(sharedTokenCount * 5, 45) +
    getRelatedPromptAffinityScore(sourceTokens, candidateTokens) +
    (candidateEntry.sourceType === sourceEntry.sourceType ? 4 : 0) +
    Math.min(candidateEntry.images.length, 4)
  );
};

const compareScoredRelatedPromptEntries = (
  left: ScoredRelatedPromptEntry,
  right: ScoredRelatedPromptEntry
) => {
  const scoreDelta = right.score - left.score;
  if (scoreDelta !== 0) return scoreDelta;

  const sourceOrderDelta = left.entry.sourceOrder - right.entry.sourceOrder;
  if (sourceOrderDelta !== 0) return sourceOrderDelta;

  return left.entry.publicId.localeCompare(right.entry.publicId);
};

const getRelatedPromptCandidateEntries = (sourceEntry: VoguePromptEntry) => {
  const categoryEntries = sourceEntry.categoryKey
    ? relatedPromptEntriesByCategory.get(sourceEntry.categoryKey)
    : null;

  return categoryEntries && categoryEntries.length > 1
    ? categoryEntries
    : entries;
};

const getDiverseRelatedPromptCandidateEntries = (
  sourceEntry: VoguePromptEntry
) => {
  const candidateEntries = new Map<string, VoguePromptEntry>();
  const addEntries = (nextEntries?: VoguePromptEntry[]) => {
    for (const entry of nextEntries ?? []) {
      if (entry.publicId !== sourceEntry.publicId) {
        candidateEntries.set(entry.publicId, entry);
      }
    }
  };

  addEntries(getRelatedPromptCandidateEntries(sourceEntry));

  for (const categoryKey of sourceEntry.categoryKey
    ? RELATED_PROMPT_ADJACENT_CATEGORY_KEYS[sourceEntry.categoryKey]
    : []) {
    addEntries(relatedPromptEntriesByCategory.get(categoryKey));
  }

  return [...candidateEntries.values()];
};

const getRankedRelatedPromptCandidates = (
  sourceEntry: VoguePromptEntry,
  scoringSourceEntry = sourceEntry,
  candidateEntries = getRelatedPromptCandidateEntries(sourceEntry)
) => {
  const sourceTokens =
    scoringSourceEntry.publicId === sourceEntry.publicId
      ? getCachedRelatedPromptTokens(sourceEntry)
      : getRelatedPromptTokens(scoringSourceEntry);

  return candidateEntries
    .filter((entry) => entry.publicId !== sourceEntry.publicId)
    .map((entry) => ({
      entry,
      score: getRelatedPromptScore(
        scoringSourceEntry,
        entry,
        sourceTokens,
        getCachedRelatedPromptTokens(entry)
      ),
    }))
    .toSorted(compareScoredRelatedPromptEntries);
};

const isCoverageCandidateStrongEnough = (
  sourceEntry: VoguePromptEntry,
  candidate: ScoredRelatedPromptEntry,
  replaced: ScoredRelatedPromptEntry
) =>
  candidate.entry.categoryKey === sourceEntry.categoryKey &&
  candidate.score >= RELATED_PROMPT_COVERAGE_MIN_SCORE &&
  replaced.score - candidate.score <= RELATED_PROMPT_COVERAGE_MAX_SCORE_DROP;

const isReciprocalReplacementStrongEnough = (
  sourceEntry: VoguePromptEntry,
  candidate: ScoredRelatedPromptEntry,
  replaced: ScoredRelatedPromptEntry
) =>
  candidate.score >= RELATED_PROMPT_RECIPROCAL_MIN_SCORE &&
  replaced.score - candidate.score <= RELATED_PROMPT_RECIPROCAL_MAX_SCORE_DROP;

const createsImmediateReciprocalLink = (
  selectedEntries: Map<string, ScoredRelatedPromptEntry[]>,
  sourceEntry: VoguePromptEntry,
  candidate: ScoredRelatedPromptEntry
) =>
  (selectedEntries.get(candidate.entry.publicId) ?? []).some(
    (relatedCandidate) =>
      relatedCandidate.entry.publicId === sourceEntry.publicId
  );

const reduceImmediateReciprocalLinks = ({
  diversityRankings,
  graphSourceEntries,
  incomingCounts,
  selectedEntries,
}: {
  diversityRankings: Map<string, ScoredRelatedPromptEntry[]>;
  graphSourceEntries: VoguePromptEntry[];
  incomingCounts: Map<string, number>;
  selectedEntries: Map<string, ScoredRelatedPromptEntry[]>;
}) => {
  const opportunities: RelatedPromptDiversityOpportunity[] = [];
  let appliedCount = 0;

  for (const sourceEntry of graphSourceEntries) {
    const selectedCandidates = selectedEntries.get(sourceEntry.publicId) ?? [];
    const selectedIds = new Set(
      selectedCandidates.map((candidate) => candidate.entry.publicId)
    );
    const rankedCandidates = diversityRankings.get(sourceEntry.publicId) ?? [];

    for (
      let replacedIndex = selectedCandidates.length - 1;
      replacedIndex >= 0;
      replacedIndex -= 1
    ) {
      const replaced = selectedCandidates[replacedIndex];

      if (
        !replaced ||
        !createsImmediateReciprocalLink(selectedEntries, sourceEntry, replaced)
      ) {
        continue;
      }

      const candidates = rankedCandidates.filter((candidate) => {
        if (selectedIds.has(candidate.entry.publicId)) return false;
        if (
          !isReciprocalReplacementStrongEnough(
            sourceEntry,
            candidate,
            replaced
          )
        ) {
          return false;
        }

        return !createsImmediateReciprocalLink(
          selectedEntries,
          sourceEntry,
          candidate
        );
      });
      const candidate =
        candidates.find(
          (candidate) => (incomingCounts.get(candidate.entry.publicId) ?? 0) === 0
        ) ?? candidates[0];

      if (!candidate) continue;

      opportunities.push({
        candidate,
        improvesCoverage:
          (incomingCounts.get(candidate.entry.publicId) ?? 0) === 0,
        replaced,
        replacedIndex,
        scoreDrop: replaced.score - candidate.score,
        sourceEntry,
      });
    }
  }

  opportunities
    .toSorted((left, right) => {
      if (left.improvesCoverage !== right.improvesCoverage) {
        return left.improvesCoverage ? -1 : 1;
      }

      const scoreDropDelta = left.scoreDrop - right.scoreDrop;
      if (scoreDropDelta !== 0) return scoreDropDelta;

      const replacedIndexDelta = right.replacedIndex - left.replacedIndex;
      if (replacedIndexDelta !== 0) return replacedIndexDelta;

      const candidateScoreDelta = right.candidate.score - left.candidate.score;
      if (candidateScoreDelta !== 0) return candidateScoreDelta;

      const sourceOrderDelta =
        left.sourceEntry.sourceOrder - right.sourceEntry.sourceOrder;
      if (sourceOrderDelta !== 0) return sourceOrderDelta;

      return left.candidate.entry.publicId.localeCompare(
        right.candidate.entry.publicId
      );
    })
    .forEach((opportunity) => {
      const selectedCandidates =
        selectedEntries.get(opportunity.sourceEntry.publicId) ?? [];

      if (
        selectedCandidates[opportunity.replacedIndex]?.entry.publicId !==
          opportunity.replaced.entry.publicId ||
        selectedCandidates.some(
          (candidate) =>
            candidate.entry.publicId === opportunity.candidate.entry.publicId
        ) ||
        createsImmediateReciprocalLink(
          selectedEntries,
          opportunity.sourceEntry,
          opportunity.candidate
        )
      ) {
        return;
      }

      selectedCandidates[opportunity.replacedIndex] = opportunity.candidate;
      incomingCounts.set(
        opportunity.replaced.entry.publicId,
        (incomingCounts.get(opportunity.replaced.entry.publicId) ?? 0) - 1
      );
      incomingCounts.set(
        opportunity.candidate.entry.publicId,
        (incomingCounts.get(opportunity.candidate.entry.publicId) ?? 0) + 1
      );
      appliedCount += 1;
    });

  return appliedCount;
};

const relatedPromptCoverageGraphCache = new Map<
  string,
  Map<string, ScoredRelatedPromptEntry[]>
>();

const getCoverageGraphCacheKey = () => 'all';

const getCoverageAdjustedRelatedPromptGraph = (
  sourceEntry: VoguePromptEntry
) => {
  const cacheKey = getCoverageGraphCacheKey();
  const cachedGraph = relatedPromptCoverageGraphCache.get(cacheKey);

  if (cachedGraph) return cachedGraph;

  const rankings = new Map<string, ScoredRelatedPromptEntry[]>();
  const diversityRankings = new Map<string, ScoredRelatedPromptEntry[]>();
  const selectedEntries = new Map<string, ScoredRelatedPromptEntry[]>();
  const incomingCounts = new Map<string, number>();
  const graphSourceEntries = entries;

  for (const entry of graphSourceEntries) {
    incomingCounts.set(entry.publicId, 0);
  }

  for (const graphSourceEntry of graphSourceEntries) {
    const rankedCandidates = getRankedRelatedPromptCandidates(graphSourceEntry).slice(
      0,
      RELATED_PROMPT_COVERAGE_RANK_LIMIT
    );
    const selectedCandidates = rankedCandidates.slice(
      0,
      RELATED_PROMPT_DEFAULT_LINK_COUNT
    );
    const diverseRankedCandidates = getRankedRelatedPromptCandidates(
      graphSourceEntry,
      graphSourceEntry,
      getDiverseRelatedPromptCandidateEntries(graphSourceEntry)
    ).slice(0, RELATED_PROMPT_COVERAGE_RANK_LIMIT);

    rankings.set(graphSourceEntry.publicId, rankedCandidates);
    diversityRankings.set(graphSourceEntry.publicId, diverseRankedCandidates);
    selectedEntries.set(graphSourceEntry.publicId, selectedCandidates);

    for (const candidate of selectedCandidates) {
      incomingCounts.set(
        candidate.entry.publicId,
        (incomingCounts.get(candidate.entry.publicId) ?? 0) + 1
      );
    }
  }

  const opportunities: RelatedPromptCoverageOpportunity[] = [];

  for (const graphSourceEntry of graphSourceEntries) {
    const selectedCandidates =
      selectedEntries.get(graphSourceEntry.publicId) ?? [];
    const replaced = selectedCandidates[RELATED_PROMPT_DEFAULT_LINK_COUNT - 1];

    if (
      selectedCandidates.length < RELATED_PROMPT_DEFAULT_LINK_COUNT ||
      !replaced ||
      (incomingCounts.get(replaced.entry.publicId) ?? 0) <= 1
    ) {
      continue;
    }

    const selectedIds = new Set(
      selectedCandidates.map((candidate) => candidate.entry.publicId)
    );
    const rankedCandidates = rankings.get(graphSourceEntry.publicId) ?? [];

    for (const candidate of rankedCandidates.slice(RELATED_PROMPT_DEFAULT_LINK_COUNT)) {
      if (selectedIds.has(candidate.entry.publicId)) continue;
      if ((incomingCounts.get(candidate.entry.publicId) ?? 0) > 0) continue;
      if (!isCoverageCandidateStrongEnough(graphSourceEntry, candidate, replaced)) {
        continue;
      }
      if (createsImmediateReciprocalLink(selectedEntries, graphSourceEntry, candidate)) {
        continue;
      }

      opportunities.push({
        candidate,
        replaced,
        scoreDrop: replaced.score - candidate.score,
        sourceEntry: graphSourceEntry,
      });
      break;
    }
  }

  opportunities
    .toSorted((left, right) => {
      const scoreDropDelta = left.scoreDrop - right.scoreDrop;
      if (scoreDropDelta !== 0) return scoreDropDelta;

      const candidateScoreDelta = right.candidate.score - left.candidate.score;
      if (candidateScoreDelta !== 0) return candidateScoreDelta;

      const sourceOrderDelta =
        left.sourceEntry.sourceOrder - right.sourceEntry.sourceOrder;
      if (sourceOrderDelta !== 0) return sourceOrderDelta;

      return left.candidate.entry.publicId.localeCompare(
        right.candidate.entry.publicId
      );
    })
    .forEach((opportunity) => {
      const selectedCandidates =
        selectedEntries.get(opportunity.sourceEntry.publicId) ?? [];
      const replacementIndex = RELATED_PROMPT_DEFAULT_LINK_COUNT - 1;

      if (
        selectedCandidates[replacementIndex]?.entry.publicId !==
          opportunity.replaced.entry.publicId ||
        (incomingCounts.get(opportunity.replaced.entry.publicId) ?? 0) <= 1 ||
        (incomingCounts.get(opportunity.candidate.entry.publicId) ?? 0) > 0
      ) {
        return;
      }

      selectedCandidates[replacementIndex] = opportunity.candidate;
      incomingCounts.set(
        opportunity.replaced.entry.publicId,
        (incomingCounts.get(opportunity.replaced.entry.publicId) ?? 0) - 1
      );
      incomingCounts.set(opportunity.candidate.entry.publicId, 1);
    });

  for (let passIndex = 0; passIndex < 4; passIndex += 1) {
    const appliedCount = reduceImmediateReciprocalLinks({
      diversityRankings,
      graphSourceEntries,
      incomingCounts,
      selectedEntries,
    });

    if (appliedCount === 0) break;
  }

  relatedPromptCoverageGraphCache.set(cacheKey, selectedEntries);

  return selectedEntries;
};

const toRelatedPromptEntry = (
  entry: VoguePromptEntry
): VogueRelatedPromptEntry => ({
  id: entry.id,
  publicId: entry.publicId,
  seoSlug: entry.seoSlug,
  title: entry.title,
  images: entry.images,
  modelId: entry.modelId,
  categoryKey: entry.categoryKey,
});

const buildRelatedPromptEntryMap = () => {
  const coverageGraph = entries[0]
    ? getCoverageAdjustedRelatedPromptGraph(entries[0])
    : new Map<string, ScoredRelatedPromptEntry[]>();
  const relatedEntryMap = new Map<string, VogueRelatedPromptEntry[]>();

  for (const sourceEntry of entries) {
    const selectedCandidates = coverageGraph.get(sourceEntry.publicId) ?? [];

    relatedEntryMap.set(
      sourceEntry.publicId,
      selectedCandidates.map(({ entry }) => toRelatedPromptEntry(entry))
    );
  }

  return relatedEntryMap;
};

let precomputedRelatedPromptEntries:
  | Map<string, VogueRelatedPromptEntry[]>
  | null = null;

const getPrecomputedRelatedPromptEntries = () => {
  if (!precomputedRelatedPromptEntries) {
    precomputedRelatedPromptEntries = buildRelatedPromptEntryMap();
  }

  return precomputedRelatedPromptEntries;
};

export function getRelatedPromptEntries(
  entryOrPublicId: VoguePromptEntry | string,
  limit = 3
): VogueRelatedPromptEntry[] {
  const canonicalSourceEntry =
    typeof entryOrPublicId === 'string'
      ? entries.find(
          (entry) =>
            entry.publicId === entryOrPublicId || entry.id === entryOrPublicId
        )
      : entries.find(
          (entry) =>
            entry.publicId === entryOrPublicId.publicId ||
            entry.id === entryOrPublicId.id
        ) ?? entryOrPublicId;
  const scoringSourceEntry =
    typeof entryOrPublicId === 'string'
      ? canonicalSourceEntry
      : entryOrPublicId;
  const normalizedLimit = Math.max(0, Math.min(limit, 6));

  if (!canonicalSourceEntry || !scoringSourceEntry || normalizedLimit === 0) {
    return [];
  }

  if (normalizedLimit <= RELATED_PROMPT_DEFAULT_LINK_COUNT) {
    return (
      getPrecomputedRelatedPromptEntries().get(canonicalSourceEntry.publicId) ??
      []
    ).slice(0, normalizedLimit);
  }

  const rankedCandidates =
    normalizedLimit >= RELATED_PROMPT_DEFAULT_LINK_COUNT
      ? getCoverageAdjustedRelatedPromptGraph(canonicalSourceEntry).get(
          canonicalSourceEntry.publicId
        ) ?? []
      : getRankedRelatedPromptCandidates(
          canonicalSourceEntry,
          scoringSourceEntry
        );
  const selectedCandidates =
    normalizedLimit <= RELATED_PROMPT_DEFAULT_LINK_COUNT
      ? rankedCandidates.slice(0, normalizedLimit)
      : [
          ...rankedCandidates,
          ...getRankedRelatedPromptCandidates(
            canonicalSourceEntry,
            scoringSourceEntry
          ).filter(
            (candidate) =>
              !rankedCandidates.some(
                (selectedCandidate) =>
                  selectedCandidate.entry.publicId === candidate.entry.publicId
              )
          ),
        ].slice(0, normalizedLimit);

  return selectedCandidates.map(({ entry }) => toRelatedPromptEntry(entry));
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
  const thumbnailUrls = firstImage
    ? [
        `/api/gpt-image-2-prompts/thumbnail?id=${encodeURIComponent(
          localizedEntry.id
        )}&index=0`,
      ]
    : [];

  return {
    id: localizedEntry.id,
    publicId: localizedEntry.publicId,
    seoSlug: localizedEntry.seoSlug,
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

export function getPromptGalleryCounts(options: PromptGalleryOptions = {}) {
  return entries.filter((entry) => matchesGalleryOptions(entry, options)).reduce<{
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
