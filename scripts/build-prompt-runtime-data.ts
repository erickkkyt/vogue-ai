import {
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { dirname, join } from 'node:path';
import {
  getIndexablePromptPageEntries,
  getIndexableRelatedPromptEntries,
  getLocalizedPromptEntries,
  getPromptEntryById,
  getRelatedPromptEntries,
  getStaticPromptPageEntries,
  VOGUE_FEATURED_PROMPT_IDS,
  VOGUE_PROMPT_ENTRY_COUNT,
  type VoguePromptEntry,
  type VoguePromptImagePrompt,
  type VogueRelatedPromptEntry,
} from '../src/lib/prompts/source';
import { LOCALES } from '../src/i18n/routing';
import type { VogueLocale } from '../src/i18n/vogue';
import { getPublicPromptSourceUrl } from '../src/lib/prompt-source-links';

type RuntimeLocalizedFieldMap = Record<
  VogueLocale,
  Record<string, { title: string; publishedLabel: string }>
>;

type RuntimePromptData = {
  schemaVersion: 1;
  generatedAt: string;
  entryCount: number;
  featuredPromptIds: readonly string[];
  indexablePromptPublicIds: string[];
  localizedFields: RuntimeLocalizedFieldMap;
  entries: VoguePromptEntry[];
  relatedByPublicId: Record<string, string[]>;
  indexableRelatedByPublicId: Record<string, string[]>;
};
type RuntimePromptDataWithoutGeneratedAt = Omit<RuntimePromptData, 'generatedAt'>;

const DATA_DIR = 'public/data/prompts';
const DETAIL_DIR = join(DATA_DIR, 'detail');
const RUNTIME_DATA_PATH = join(DATA_DIR, 'runtime.json');
const FEATURED_IDS_PATH = join(DATA_DIR, 'featured.json');
const INDEXABLE_IDS_PATH = join(DATA_DIR, 'indexable-public-ids.json');
const META_PATH = join(DATA_DIR, 'meta.json');
const SIZE_REPORT_PATH = '.tmp/prompt-runtime-data-size.json';

function ensureParent(path: string) {
  mkdirSync(dirname(path), { recursive: true });
}

function writeJson(path: string, value: unknown) {
  ensureParent(path);
  writeFileSync(path, `${JSON.stringify(value)}\n`);
}

function withoutGeneratedAt(
  runtimeData: RuntimePromptData
): RuntimePromptDataWithoutGeneratedAt {
  const { generatedAt: _generatedAt, ...stableRuntimeData } = runtimeData;

  return stableRuntimeData;
}

function resolveGeneratedAt(runtimeData: RuntimePromptDataWithoutGeneratedAt) {
  if (!existsSync(RUNTIME_DATA_PATH)) {
    return new Date().toISOString();
  }

  try {
    const previousRuntimeData = JSON.parse(
      readFileSync(RUNTIME_DATA_PATH, 'utf8')
    ) as RuntimePromptData;
    const previousStableRuntimeData = withoutGeneratedAt(previousRuntimeData);

    if (JSON.stringify(previousStableRuntimeData) === JSON.stringify(runtimeData)) {
      return previousRuntimeData.generatedAt;
    }
  } catch {
    return new Date().toISOString();
  }

  return new Date().toISOString();
}

function stripImagePromptRuntimeFields(
  imagePrompt: VoguePromptImagePrompt,
  includePromptTranslations = false
): VoguePromptImagePrompt {
  return {
    image: imagePrompt.image,
    prompt: imagePrompt.prompt,
    promptTranslations: includePromptTranslations
      ? imagePrompt.promptTranslations
      : undefined,
    sourceId: imagePrompt.sourceId,
    title: imagePrompt.title,
  };
}

function toRuntimeEntry(
  entry: VoguePromptEntry,
  { includePromptTranslations = false } = {}
): VoguePromptEntry {
  return {
    id: entry.id,
    publicId: entry.publicId,
    seoSlug: entry.seoSlug,
    sourceOrder: entry.sourceOrder,
    title: entry.title,
    sourceTitle: entry.sourceTitle,
    description: entry.description,
    images: entry.images,
    imagePrompts: entry.imagePrompts?.map((imagePrompt) =>
      stripImagePromptRuntimeFields(imagePrompt, includePromptTranslations)
    ),
    prompt: entry.prompt,
    originalPrompt: entry.originalPrompt ?? entry.prompt,
    promptTranslations: includePromptTranslations
      ? entry.promptTranslations
      : undefined,
    modelId: entry.modelId,
    authorName: entry.authorName,
    authorHandle: entry.authorHandle,
    publishedLabel: entry.publishedLabel,
    publishedAtMs: entry.publishedAtMs,
    galleryPublishedAt: entry.galleryPublishedAt,
    galleryPublishedAtMs: entry.galleryPublishedAtMs,
    sourceUrl: getPublicPromptSourceUrl(entry.sourceUrl),
    sourceType: entry.sourceType,
    languages: entry.languages,
    categoryKey: entry.categoryKey,
    publicIdCategoryKey: entry.publicIdCategoryKey,
    imageAssets: entry.imageAssets,
    defaultImageIndex: entry.defaultImageIndex,
  };
}

function toLocalizedFields() {
  const localizedFields = Object.fromEntries(
    LOCALES.map((locale) => [locale, {}])
  ) as RuntimeLocalizedFieldMap;

  for (const locale of LOCALES) {
    for (const entry of getLocalizedPromptEntries(locale)) {
      localizedFields[locale][entry.id] = {
        title: entry.title,
        publishedLabel: entry.publishedLabel,
      };
      localizedFields[locale][entry.publicId] = {
        title: entry.title,
        publishedLabel: entry.publishedLabel,
      };
    }
  }

  return localizedFields;
}

function toRelatedMap(
  entries: VoguePromptEntry[],
  getRelated: (entry: VoguePromptEntry, limit: number) => VogueRelatedPromptEntry[]
) {
  return Object.fromEntries(
    entries.map((entry) => [
      entry.publicId,
      getRelated(entry, 6).map((relatedEntry) => relatedEntry.publicId),
    ])
  );
}

function toSearchIndexEntry(entry: VoguePromptEntry) {
  return {
    id: entry.id,
    publicId: entry.publicId,
    slug: entry.seoSlug,
    title: entry.title,
    description: entry.description,
    prompt: entry.prompt,
    modelId: entry.modelId,
    categoryKey: entry.categoryKey,
  };
}

const sourceEntries = getStaticPromptPageEntries();
const runtimeEntries = sourceEntries.map((entry) => toRuntimeEntry(entry));
const indexableEntries = getIndexablePromptPageEntries();

const runtimeDataWithoutGeneratedAt: RuntimePromptDataWithoutGeneratedAt = {
  schemaVersion: 1,
  entryCount: VOGUE_PROMPT_ENTRY_COUNT,
  featuredPromptIds: VOGUE_FEATURED_PROMPT_IDS,
  indexablePromptPublicIds: indexableEntries.map((entry) => entry.publicId),
  localizedFields: toLocalizedFields(),
  entries: runtimeEntries,
  relatedByPublicId: toRelatedMap(sourceEntries, getRelatedPromptEntries),
  // Every routable detail page needs indexable related links, even when the
  // page itself is staged as noindex and excluded from the sitemap.
  indexableRelatedByPublicId: toRelatedMap(
    sourceEntries,
    getIndexableRelatedPromptEntries
  ),
};
const runtimeData: RuntimePromptData = {
  schemaVersion: runtimeDataWithoutGeneratedAt.schemaVersion,
  generatedAt: resolveGeneratedAt(runtimeDataWithoutGeneratedAt),
  entryCount: runtimeDataWithoutGeneratedAt.entryCount,
  featuredPromptIds: runtimeDataWithoutGeneratedAt.featuredPromptIds,
  indexablePromptPublicIds:
    runtimeDataWithoutGeneratedAt.indexablePromptPublicIds,
  localizedFields: runtimeDataWithoutGeneratedAt.localizedFields,
  entries: runtimeDataWithoutGeneratedAt.entries,
  relatedByPublicId: runtimeDataWithoutGeneratedAt.relatedByPublicId,
  indexableRelatedByPublicId:
    runtimeDataWithoutGeneratedAt.indexableRelatedByPublicId,
};

rmSync(DATA_DIR, { recursive: true, force: true });

writeJson(RUNTIME_DATA_PATH, runtimeData);
writeJson(FEATURED_IDS_PATH, VOGUE_FEATURED_PROMPT_IDS);
writeJson(INDEXABLE_IDS_PATH, runtimeData.indexablePromptPublicIds);
writeJson(META_PATH, {
  schemaVersion: runtimeData.schemaVersion,
  generatedAt: runtimeData.generatedAt,
  entryCount: runtimeData.entryCount,
});
writeJson(
  join(DATA_DIR, 'gallery.en.json'),
  runtimeEntries.map((entry) => ({
    id: entry.id,
    publicId: entry.publicId,
    slug: entry.seoSlug,
    title: entry.title,
    image: entry.images[entry.defaultImageIndex ?? 0] ?? entry.images[0],
    modelId: entry.modelId,
    categoryKey: entry.categoryKey,
    publishedAtMs: entry.publishedAtMs,
    galleryPublishedAtMs: entry.galleryPublishedAtMs,
  }))
);
writeJson(join(DATA_DIR, 'search-index.en.json'), runtimeEntries.map(toSearchIndexEntry));
writeJson(
  join(DATA_DIR, 'sitemap.json'),
  indexableEntries.map((entry) => ({
    publicId: entry.publicId,
    slug: entry.seoSlug,
  }))
);
writeJson(
  join(DATA_DIR, 'static-params.json'),
  sourceEntries.map((entry) => ({
    slug: entry.seoSlug ?? entry.publicId,
  }))
);

mkdirSync(DETAIL_DIR, { recursive: true });
for (const entry of runtimeEntries) {
  const detailEntry = getPromptEntryById(entry.publicId, 'en');
  if (!detailEntry) continue;
  writeJson(
    join(DETAIL_DIR, `${entry.publicId}.en.json`),
    toRuntimeEntry(detailEntry, { includePromptTranslations: true })
  );
}

const sizeReport = {
  generatedAt: runtimeData.generatedAt,
  entryCount: runtimeData.entryCount,
  files: {
    [RUNTIME_DATA_PATH]: Buffer.byteLength(JSON.stringify(runtimeData)),
    [FEATURED_IDS_PATH]: Buffer.byteLength(
      JSON.stringify(VOGUE_FEATURED_PROMPT_IDS)
    ),
    [INDEXABLE_IDS_PATH]: Buffer.byteLength(
      JSON.stringify(runtimeData.indexablePromptPublicIds)
    ),
    [META_PATH]: Buffer.byteLength(
      JSON.stringify({
        schemaVersion: runtimeData.schemaVersion,
        generatedAt: runtimeData.generatedAt,
        entryCount: runtimeData.entryCount,
      })
    ),
  },
};

writeJson(SIZE_REPORT_PATH, sizeReport);
console.log(
  `Wrote prompt runtime data: ${runtimeData.entryCount} entries, ${Math.round(
    sizeReport.files[RUNTIME_DATA_PATH] / 1024
  )} KiB runtime manifest`
);
