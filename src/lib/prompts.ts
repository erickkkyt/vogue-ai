import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { normalizeVogueLocale, type VogueLocale } from '@/i18n/vogue';
import { getCloudflareEnv, isCloudflareWorkerRuntime } from './cloudflare';
import {
  VOGUE_PROMPT_CATEGORY_DEFINITIONS,
  type VoguePromptConcreteCategoryKey,
} from './prompt-taxonomy';
import {
  INDEXABLE_PROMPT_PAGE_LIMIT,
  VOGUE_INDEXABLE_PROMPT_PUBLIC_IDS as indexablePromptPublicIds,
  isVogueFeaturedPromptEntry,
} from './prompts/runtime-ids';
import type {
  PromptGalleryOptions,
  VoguePromptEntry,
  VoguePromptGalleryEntry,
  VogueRelatedPromptEntry,
} from './prompts/types';

export {
  INDEXABLE_PROMPT_PAGE_LIMIT,
  VOGUE_FEATURED_PROMPT_IDS,
  VOGUE_FEATURED_PROMPT_PUBLIC_IDS,
  VOGUE_INDEXABLE_PROMPT_PUBLIC_IDS,
  VOGUE_PROMPT_ENTRY_COUNT,
  isIndexablePromptPublicId,
  isVogueFeaturedPromptEntry,
} from './prompts/runtime-ids';
export type {
  PromptGalleryOptions,
  VoguePromptEntry,
  VoguePromptGalleryEntry,
  VoguePromptImagePrompt,
  VogueRelatedPromptEntry,
} from './prompts/types';

type RuntimePromptData = {
  schemaVersion: 1;
  entryCount: number;
  featuredPromptIds: string[];
  indexablePromptPublicIds: string[];
  localizedFields: Record<
    VogueLocale,
    Record<string, { title: string; publishedLabel: string }>
  >;
  entries: VoguePromptEntry[];
  relatedByPublicId: Record<string, string[]>;
  indexableRelatedByPublicId: Record<string, string[]>;
};

type RuntimePromptIndexes = {
  data: RuntimePromptData;
  entries: VoguePromptEntry[];
  promptEntriesById: Map<string, VoguePromptEntry>;
};

let runtimePromptIndexesPromise: Promise<RuntimePromptIndexes> | null = null;
let runtimePromptIndexesSync: RuntimePromptIndexes | null = null;

async function readPromptRuntimeDataText() {
  const assets = getCloudflareEnv()?.ASSETS;

  if (assets) {
    const response = await assets.fetch(
      new URL('/data/prompts/runtime.json', 'https://assets.local')
    );

    if (!response.ok) {
      throw new Error(`Failed to read prompt runtime data: ${response.status}`);
    }

    return response.text();
  }

  const { readFile } = await import('node:fs/promises');
  return readFile(join(process.cwd(), 'public/data/prompts/runtime.json'), 'utf8');
}

function parseRuntimeIndexes(source: string): RuntimePromptIndexes {
  const data = JSON.parse(source) as RuntimePromptData;
  const promptEntriesById = new Map<string, VoguePromptEntry>();

  for (const entry of data.entries) {
    promptEntriesById.set(entry.id, entry);
    promptEntriesById.set(entry.publicId, entry);
    if (entry.seoSlug) {
      promptEntriesById.set(entry.seoSlug, entry);
    }
  }

  return {
    data,
    entries: data.entries,
    promptEntriesById,
  };
}

async function getRuntimePromptIndexes() {
  runtimePromptIndexesPromise ??= readPromptRuntimeDataText().then(
    parseRuntimeIndexes
  );

  return runtimePromptIndexesPromise;
}

function getRuntimePromptIndexesSyncForNode() {
  if (isCloudflareWorkerRuntime()) {
    throw new Error(
      'Synchronous prompt runtime access is not supported in Cloudflare Workers'
    );
  }

  runtimePromptIndexesSync ??= parseRuntimeIndexes(
    readFileSync(join(process.cwd(), 'public/data/prompts/runtime.json'), 'utf8')
  );

  return runtimePromptIndexesSync;
}

function localizeEntryFields(
  data: RuntimePromptData,
  entry: VoguePromptEntry,
  locale?: string | null
) {
  const promptLocale = normalizeVogueLocale(locale);
  return data.localizedFields[promptLocale]?.[entry.id] ?? null;
}

function getLocalizedPromptEntryFromData(
  data: RuntimePromptData,
  entry: VoguePromptEntry,
  locale?: string | null
): VoguePromptEntry {
  const localizedFields = localizeEntryFields(data, entry, locale);

  return {
    ...entry,
    title: localizedFields?.title ?? entry.title,
    originalPrompt: entry.originalPrompt ?? entry.prompt,
    publishedLabel: localizedFields?.publishedLabel ?? entry.publishedLabel,
  };
}

export async function getLocalizedPromptEntriesAsync(
  locale?: string | null,
  limit?: number
) {
  const { data, entries } = await getRuntimePromptIndexes();

  return entries
    .slice(0, limit ?? entries.length)
    .map((entry) => getLocalizedPromptEntryFromData(data, entry, locale));
}

export function getLocalizedPromptEntries(
  locale?: string | null,
  limit?: number
) {
  const { data, entries } = getRuntimePromptIndexesSyncForNode();

  return entries
    .slice(0, limit ?? entries.length)
    .map((entry) => getLocalizedPromptEntryFromData(data, entry, locale));
}

export async function getFeaturedPromptEntriesAsync(limit?: number) {
  return getLocalizedPromptEntriesAsync('en', limit);
}

export function getFeaturedPromptEntries(limit?: number) {
  return getLocalizedPromptEntries('en', limit);
}

export async function getPromptEntryByIdAsync(
  id: string,
  locale?: string | null
) {
  const { data, promptEntriesById } = await getRuntimePromptIndexes();
  const entry = promptEntriesById.get(id) ?? null;

  return entry ? getLocalizedPromptEntryFromData(data, entry, locale) : null;
}

export function getPromptEntryById(id: string, locale?: string | null) {
  const { data, promptEntriesById } = getRuntimePromptIndexesSyncForNode();
  const entry = promptEntriesById.get(id) ?? null;

  return entry ? getLocalizedPromptEntryFromData(data, entry, locale) : null;
}

export async function getIndexablePromptPageEntriesAsync(
  limit = INDEXABLE_PROMPT_PAGE_LIMIT
) {
  const normalizedLimit = Math.max(0, Math.min(limit, INDEXABLE_PROMPT_PAGE_LIMIT));
  const entries = await Promise.all(
    indexablePromptPublicIds
      .slice(0, normalizedLimit)
      .map((publicId) => getPromptEntryByIdAsync(publicId, 'en'))
  );

  return entries.filter((entry): entry is VoguePromptEntry => Boolean(entry));
}

export function getIndexablePromptPageEntries(
  limit = INDEXABLE_PROMPT_PAGE_LIMIT
) {
  const normalizedLimit = Math.max(0, Math.min(limit, INDEXABLE_PROMPT_PAGE_LIMIT));

  return indexablePromptPublicIds
    .slice(0, normalizedLimit)
    .map((publicId) => getPromptEntryById(publicId, 'en'))
    .filter((entry): entry is VoguePromptEntry => Boolean(entry));
}

export async function getStaticPromptPageEntriesAsync() {
  return getLocalizedPromptEntriesAsync('en');
}

export function getStaticPromptPageEntries() {
  return getLocalizedPromptEntries('en');
}

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

const getHomepageGallerySortMs = (entry: VoguePromptEntry) =>
  entry.galleryPublishedAtMs ?? entry.publishedAtMs ?? 0;

const comparePromptEntriesForHomepageGallery = (
  left: VoguePromptEntry,
  right: VoguePromptEntry
) => {
  const homepagePublishedAtDelta =
    getHomepageGallerySortMs(right) - getHomepageGallerySortMs(left);

  if (homepagePublishedAtDelta !== 0) return homepagePublishedAtDelta;

  return comparePromptEntriesForGallery(left, right);
};

const HOMEPAGE_FRESH_DIVERSIFIED_ENTRY_COUNT = 20;
const HOMEPAGE_FRESH_CATEGORY_CAP = 4;
const HOMEPAGE_FRESH_FIRST_THREE_CATEGORY_CAP = 1;
const HOMEPAGE_FRESH_FIRST_SCREEN_ENTRY_COUNT = 6;
const HOMEPAGE_FRESH_FIRST_SCREEN_CATEGORY_CAP = 2;
const HOMEPAGE_FRESH_DEFAULT_DEFERRED_CATEGORY_KEYS = new Set(['ui', 'diagram']);
const HOMEPAGE_FRESH_MODEL_SEQUENCE = [
  'gptimage2',
  'gptimage2',
  'gptimage2',
  'nanobanana',
  'gptimage2',
  'gptimage2',
  'gptimage2',
  'midjourney',
  'gptimage2',
  'gptimage2',
  'gptimage2',
  'nanobanana',
  'gptimage2',
  'gptimage2',
  'gptimage2',
  'nanobanana',
  'gptimage2',
  'gptimage2',
  'gptimage2',
  'midjourney',
] as const;

const isConcreteCategoryKey = (
  categoryKey?: PromptGalleryOptions['categoryKey'] | null
): categoryKey is VoguePromptConcreteCategoryKey =>
  Boolean(categoryKey && categoryKey !== 'all');

const getConcreteCategoryFilters = (options: PromptGalleryOptions = {}) => {
  if (options.categoryKeys?.length) {
    return new Set(options.categoryKeys);
  }

  return isConcreteCategoryKey(options.categoryKey)
    ? new Set([options.categoryKey])
    : null;
};

const matchesGalleryOptions = (
  entry: VoguePromptEntry,
  options: PromptGalleryOptions = {}
) => {
  if (options.featured && !isVogueFeaturedPromptEntry(entry)) return false;

  if (options.modelId && options.modelId !== 'all') {
    if ((entry.modelId || 'unknown') !== options.modelId) return false;
  }

  const categoryFilters = getConcreteCategoryFilters(options);
  if (categoryFilters) {
    return Boolean(entry.categoryKey && categoryFilters.has(entry.categoryKey));
  }

  return true;
};

const getHomepageFreshCategoryCap = (selectedCount: number) => {
  const nextPosition = selectedCount + 1;

  if (nextPosition <= 3) return HOMEPAGE_FRESH_FIRST_THREE_CATEGORY_CAP;
  if (nextPosition <= HOMEPAGE_FRESH_FIRST_SCREEN_ENTRY_COUNT) {
    return HOMEPAGE_FRESH_FIRST_SCREEN_CATEGORY_CAP;
  }

  return HOMEPAGE_FRESH_CATEGORY_CAP;
};

const getHomepageFreshDiversifiedEntries = (
  sortedEntries: VoguePromptEntry[],
  options: PromptGalleryOptions
) => {
  const targetCount = Math.min(
    HOMEPAGE_FRESH_DIVERSIFIED_ENTRY_COUNT,
    sortedEntries.length
  );
  if (targetCount <= 1) return sortedEntries;

  const selectedEntries: VoguePromptEntry[] = [];
  const selectedIds = new Set<string>();
  const categoryCounts = new Map<string, number>();
  const shouldDiversifyModels = !(options.modelId && options.modelId !== 'all');
  const shouldCapCategories =
    !options.categoryKeys?.length && !isConcreteCategoryKey(options.categoryKey);
  const shouldDeferDefaultCategories =
    shouldCapCategories &&
    sortedEntries.filter(
      (entry) =>
        !HOMEPAGE_FRESH_DEFAULT_DEFERRED_CATEGORY_KEYS.has(
          entry.categoryKey ?? 'unknown'
        )
    ).length >= targetCount;

  const findNextEntry = (modelId?: string, relaxCategoryCap = false) =>
    sortedEntries.find((entry) => {
      if (selectedIds.has(entry.id)) return false;
      if (modelId && entry.modelId !== modelId) return false;
      if (
        shouldDeferDefaultCategories &&
        HOMEPAGE_FRESH_DEFAULT_DEFERRED_CATEGORY_KEYS.has(
          entry.categoryKey ?? 'unknown'
        )
      ) {
        return false;
      }
      if (!shouldCapCategories || relaxCategoryCap) return true;

      return (
        (categoryCounts.get(entry.categoryKey ?? 'unknown') ?? 0) <
        getHomepageFreshCategoryCap(selectedEntries.length)
      );
    }) ?? null;

  const selectEntry = (entry: VoguePromptEntry) => {
    selectedEntries.push(entry);
    selectedIds.add(entry.id);
    categoryCounts.set(
      entry.categoryKey ?? 'unknown',
      (categoryCounts.get(entry.categoryKey ?? 'unknown') ?? 0) + 1
    );
  };

  for (let index = 0; index < targetCount; index += 1) {
    const scheduledModelId = shouldDiversifyModels
      ? HOMEPAGE_FRESH_MODEL_SEQUENCE[index]
      : undefined;
    const nextEntry =
      (scheduledModelId ? findNextEntry(scheduledModelId) : null) ??
      (scheduledModelId ? findNextEntry(scheduledModelId, true) : null) ??
      findNextEntry() ??
      findNextEntry(undefined, true);

    if (!nextEntry) break;
    selectEntry(nextEntry);
  }

  if (selectedEntries.length === 0) return sortedEntries;

  return [
    ...selectedEntries,
    ...sortedEntries.filter((entry) => !selectedIds.has(entry.id)),
  ];
};

const getPromptGallerySortedEntries = (
  promptEntries: VoguePromptEntry[],
  options: PromptGalleryOptions
) => {
  const sortedEntries = promptEntries.toSorted(
    options.sort === 'homepageFresh'
      ? comparePromptEntriesForHomepageGallery
      : comparePromptEntriesForGallery
  );

  return options.sort === 'homepageFresh'
    ? getHomepageFreshDiversifiedEntries(sortedEntries, options)
    : sortedEntries;
};

const toPromptGalleryEntry = (
  data: RuntimePromptData,
  entry: VoguePromptEntry,
  locale?: string | null
): VoguePromptGalleryEntry => {
  const localizedEntry = getLocalizedPromptEntryFromData(data, entry, locale);
  const defaultImageIndex = localizedEntry.defaultImageIndex ?? 0;
  const defaultImage = localizedEntry.images[defaultImageIndex];
  const defaultImageAsset = localizedEntry.imageAssets?.[defaultImageIndex] ?? null;
  const thumbnailUrls = defaultImageAsset?.variants?.['640']
    ? [defaultImageAsset.variants['640']]
    : defaultImage
      ? [defaultImage]
      : [];

  return {
    id: localizedEntry.id,
    publicId: localizedEntry.publicId,
    seoSlug: localizedEntry.seoSlug,
    sourceOrder: localizedEntry.sourceOrder,
    title: localizedEntry.title,
    sourceTitle: localizedEntry.sourceTitle,
    images: thumbnailUrls,
    imageAssets: defaultImageAsset ? [defaultImageAsset] : [],
    imageCount: localizedEntry.images.length,
    imageDimensions: defaultImageAsset?.width && defaultImageAsset.height
      ? {
          width: defaultImageAsset.width,
          height: defaultImageAsset.height,
          aspectRatio:
            defaultImageAsset.aspectRatio ??
            `${defaultImageAsset.width} / ${defaultImageAsset.height}`,
        }
      : null,
    modelId: localizedEntry.modelId,
    authorName: localizedEntry.authorName,
    authorHandle: localizedEntry.authorHandle,
    publishedLabel: localizedEntry.publishedLabel,
    publishedAtMs: localizedEntry.publishedAtMs,
    galleryPublishedAt: localizedEntry.galleryPublishedAt,
    galleryPublishedAtMs: localizedEntry.galleryPublishedAtMs,
    sourceUrl: localizedEntry.sourceUrl,
    sourceType: localizedEntry.sourceType,
    languages: localizedEntry.languages,
    categoryKey: localizedEntry.categoryKey,
  };
};

export async function getLocalizedPromptGalleryEntriesAsync(
  locale?: string | null,
  options: PromptGalleryOptions = {}
) {
  const { data, entries } = await getRuntimePromptIndexes();
  const offset = Math.max(0, options.offset ?? 0);
  const limit = Math.max(1, Math.min(options.limit ?? 80, 200));
  const sortedEntries = getPromptGallerySortedEntries(
    entries.filter((entry) => matchesGalleryOptions(entry, options)),
    options
  );

  return sortedEntries
    .slice(offset, offset + limit)
    .map((entry) => toPromptGalleryEntry(data, entry, locale));
}

export function getLocalizedPromptGalleryEntries(
  locale?: string | null,
  options: PromptGalleryOptions = {}
) {
  const { data, entries } = getRuntimePromptIndexesSyncForNode();
  const offset = Math.max(0, options.offset ?? 0);
  const limit = Math.max(1, Math.min(options.limit ?? 80, 200));
  const sortedEntries = getPromptGallerySortedEntries(
    entries.filter((entry) => matchesGalleryOptions(entry, options)),
    options
  );

  return sortedEntries
    .slice(offset, offset + limit)
    .map((entry) => toPromptGalleryEntry(data, entry, locale));
}

export async function getLocalizedIndexablePromptGalleryEntriesAsync(
  locale?: string | null,
  options: PromptGalleryOptions = {}
) {
  const { data, promptEntriesById } = await getRuntimePromptIndexes();
  const indexableEntries = indexablePromptPublicIds
    .map((publicId) => promptEntriesById.get(publicId))
    .filter((entry): entry is VoguePromptEntry => Boolean(entry));
  const offset = Math.max(0, options.offset ?? 0);
  const limit = Math.max(1, Math.min(options.limit ?? 80, 200));

  return getPromptGallerySortedEntries(
    indexableEntries.filter((entry) => matchesGalleryOptions(entry, options)),
    options
  )
    .slice(offset, offset + limit)
    .map((entry) => toPromptGalleryEntry(data, entry, locale));
}

export function getLocalizedIndexablePromptGalleryEntries(
  locale?: string | null,
  options: PromptGalleryOptions = {}
) {
  const { data, promptEntriesById } = getRuntimePromptIndexesSyncForNode();
  const indexableEntries = indexablePromptPublicIds
    .map((publicId) => promptEntriesById.get(publicId))
    .filter((entry): entry is VoguePromptEntry => Boolean(entry));
  const offset = Math.max(0, options.offset ?? 0);
  const limit = Math.max(1, Math.min(options.limit ?? 80, 200));

  return getPromptGallerySortedEntries(
    indexableEntries.filter((entry) => matchesGalleryOptions(entry, options)),
    options
  )
    .slice(offset, offset + limit)
    .map((entry) => toPromptGalleryEntry(data, entry, locale));
}

export async function getPromptGalleryEntryTotalAsync(
  options: PromptGalleryOptions = {}
) {
  const { entries } = await getRuntimePromptIndexes();
  return entries.filter((entry) => matchesGalleryOptions(entry, options)).length;
}

export function getPromptGalleryEntryTotal(options: PromptGalleryOptions = {}) {
  const { entries } = getRuntimePromptIndexesSyncForNode();
  return entries.filter((entry) => matchesGalleryOptions(entry, options)).length;
}

export async function getPromptGalleryCountsAsync(
  options: PromptGalleryOptions = {}
) {
  const { entries } = await getRuntimePromptIndexes();
  return getPromptGalleryCountsFromEntries(entries, options);
}

export function getPromptGalleryCounts(options: PromptGalleryOptions = {}) {
  const { entries } = getRuntimePromptIndexesSyncForNode();
  return getPromptGalleryCountsFromEntries(entries, options);
}

function getPromptGalleryCountsFromEntries(
  entries: VoguePromptEntry[],
  options: PromptGalleryOptions = {}
) {
  return entries.filter((entry) => matchesGalleryOptions(entry, options)).reduce<{
    total: number;
    featured: number;
    models: Record<string, number>;
    categories: Record<VoguePromptConcreteCategoryKey, number>;
  }>(
    (counts, entry) => {
      const modelId = entry.modelId || 'unknown';

      counts.total += 1;
      if (isVogueFeaturedPromptEntry(entry)) counts.featured += 1;
      counts.models[modelId] = (counts.models[modelId] || 0) + 1;
      if (entry.categoryKey) {
        counts.categories[entry.categoryKey] =
          (counts.categories[entry.categoryKey] || 0) + 1;
      }

      return counts;
    },
    {
      total: 0,
      featured: 0,
      models: {},
      categories: Object.fromEntries(
        VOGUE_PROMPT_CATEGORY_DEFINITIONS.filter(
          (category) => category.key !== 'all'
        ).map((category) => [category.key, 0])
      ) as Record<VoguePromptConcreteCategoryKey, number>,
    }
  );
}

export async function getRelatedPromptEntriesAsync(
  entryOrPublicId: VoguePromptEntry | string,
  limit = 3
): Promise<VogueRelatedPromptEntry[]> {
  const { data, promptEntriesById } = await getRuntimePromptIndexes();
  return getRelatedPromptEntriesFromData(
    data.relatedByPublicId,
    promptEntriesById,
    entryOrPublicId,
    limit
  );
}

export function getRelatedPromptEntries(
  entryOrPublicId: VoguePromptEntry | string,
  limit = 3
): VogueRelatedPromptEntry[] {
  const { data, promptEntriesById } = getRuntimePromptIndexesSyncForNode();
  return getRelatedPromptEntriesFromData(
    data.relatedByPublicId,
    promptEntriesById,
    entryOrPublicId,
    limit
  );
}

export async function getIndexableRelatedPromptEntriesAsync(
  entryOrPublicId: VoguePromptEntry | string,
  limit = 3
): Promise<VogueRelatedPromptEntry[]> {
  const { data, promptEntriesById } = await getRuntimePromptIndexes();
  return getRelatedPromptEntriesFromData(
    data.indexableRelatedByPublicId,
    promptEntriesById,
    entryOrPublicId,
    limit
  );
}

export function getIndexableRelatedPromptEntries(
  entryOrPublicId: VoguePromptEntry | string,
  limit = 3
): VogueRelatedPromptEntry[] {
  const { data, promptEntriesById } = getRuntimePromptIndexesSyncForNode();
  return getRelatedPromptEntriesFromData(
    data.indexableRelatedByPublicId,
    promptEntriesById,
    entryOrPublicId,
    limit
  );
}

function getRelatedPromptEntriesFromData(
  relatedByPublicId: Record<string, string[]>,
  promptEntriesById: Map<string, VoguePromptEntry>,
  entryOrPublicId: VoguePromptEntry | string,
  limit: number
) {
  const publicId =
    typeof entryOrPublicId === 'string'
      ? (promptEntriesById.get(entryOrPublicId)?.publicId ?? entryOrPublicId)
      : entryOrPublicId.publicId;

  return (relatedByPublicId[publicId] ?? [])
    .slice(0, limit)
    .map((relatedPublicId) => promptEntriesById.get(relatedPublicId))
    .filter((entry): entry is VoguePromptEntry => Boolean(entry))
    .map(toRelatedPromptEntry);
}

function toRelatedPromptEntry(entry: VoguePromptEntry): VogueRelatedPromptEntry {
  return {
    id: entry.id,
    publicId: entry.publicId,
    seoSlug: entry.seoSlug,
    title: entry.title,
    images: entry.images,
    imageAssets: entry.imageAssets,
    modelId: entry.modelId,
    categoryKey: entry.categoryKey,
  };
}
