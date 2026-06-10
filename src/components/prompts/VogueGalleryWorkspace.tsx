'use client';

import {
  getVogueCopyFromMessages,
  type VogueUICopy,
} from '@/i18n/vogue';
import type {
  VoguePromptEntry,
  VoguePromptGalleryEntry,
} from '@/lib/prompts';
import {
  VOGUE_PROMPT_CATEGORY_DEFINITIONS,
  getVoguePromptCategoryKey,
  type VoguePromptCategoryKey,
} from '@/lib/prompt-taxonomy';
import { getVoguePromptImageDimensions } from '@/lib/prompt-image-dimensions';
import { getUrlWithLocale } from '@/lib/urls/urls';
import {
  VoguePromptComposer,
  type VogueComposerModel,
  type VogueComposerParameter,
  type VogueComposerReferenceItem,
} from '@/components/app/VoguePromptComposer';
import {
  IMAGE_WORKSPACE_MODELS,
  getModelById,
  type WorkspaceAspectRatio,
  type WorkspaceGenerationCount,
  type WorkspaceOutputQuality,
  type WorkspaceQualityOption,
} from '@/lib/effects/workspace-models';
import { estimateCreditsForEffect } from '@/lib/effects/pricing';
import {
  countPromptCharacters,
  getGenerationPromptMaxChars,
  truncatePromptToMaxChars,
  validateUploadedImageFile,
} from '@/lib/effects/validation';
import { writeVogueAppTransferPayload } from '@/lib/app/composer-transfer';
import {
  getInitialPromptRemixValues,
  getPromptRemixSchema,
  type PromptRemixValues,
} from '@/lib/prompt-remix';
import { getModelIconPathByModelId } from '@/lib/model-icons';
import { getPromptPagePath } from '@/lib/prompt-page-routes';
import { getVogueWorkspaceModelDescription } from '@/lib/vogue-model-copy';
import { IconBrandX } from '@tabler/icons-react';
import { ExternalLink, Layers, Sparkles } from 'lucide-react';
import Image from 'next/image';
import { useLocale, useMessages } from 'next-intl';
import {
  type ChangeEvent,
  type CSSProperties,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

type GalleryEntry = VoguePromptEntry | VoguePromptGalleryEntry;

type GalleryCounts = {
  total: number;
  models: Record<string, number>;
  categories: Partial<Record<Exclude<VoguePromptCategoryKey, 'all'>, number>>;
};

type GalleryCategory = {
  key: VoguePromptCategoryKey;
  label: string;
  hint: string;
  keywords: string[];
};

type ModelFilter = {
  key: string;
  label: string;
};

const promptDetailLanguageLabels = {
  en: {
    current: 'Current language',
    original: 'Prompt original',
  },
  zh: {
    current: '当前语言',
    original: '原始提示词',
  },
  fr: {
    current: 'Langue actuelle',
    original: 'Prompt original',
  },
  pt: {
    current: 'Idioma atual',
    original: 'Prompt original',
  },
  ru: {
    current: 'Текущий язык',
    original: 'Исходный промпт',
  },
  ja: {
    current: '現在の言語',
    original: '元のプロンプト',
  },
  ko: {
    current: '현재 언어',
    original: '원본 프롬프트',
  },
};

type GalleryMasonryItem = {
  entry: VoguePromptGalleryEntry;
  index: number;
};

type SelectedReference =
  | {
      source: 'remote';
      id: string;
      entryId: string;
      imageUrl: string;
      title: string;
    }
  | {
      source: 'local';
      id: string;
      imageUrl: string;
      objectUrl: string;
      file: File;
      title: string;
    };

const getComposerModels = (
  copy: VogueUICopy
): VogueComposerModel[] =>
  IMAGE_WORKSPACE_MODELS.map((model) => ({
    id: model.id,
    name: model.name,
    iconPath: getModelIconPathByModelId(model.id),
    description: getVogueWorkspaceModelDescription(copy, model.id),
  }));

const scenarioCategoryDefinitions = VOGUE_PROMPT_CATEGORY_DEFINITIONS;

const getScenarioCategories = (copy: VogueUICopy): GalleryCategory[] =>
  scenarioCategoryDefinitions.map((category) => ({
    ...category,
    ...copy.gallery.categories[category.key as keyof typeof copy.gallery.categories],
  }));

const getWorkspaceModelName = (modelId: string | undefined) => {
  if (!modelId) return null;

  const model = getModelById(modelId);
  return model.id === modelId ? model.name : null;
};

const promptOnlyModelLabels: Record<string, string> = {
  midjourney: 'Midjourney',
};

const getPromptModelName = (modelId: string | undefined) => {
  if (!modelId) return null;
  return getWorkspaceModelName(modelId) ?? promptOnlyModelLabels[modelId] ?? null;
};

const modelLabel = (modelId: string | undefined, copy: VogueUICopy) => {
  if (modelId === 'gptimage2') return copy.gallery.modelGptImage2;
  if (modelId === 'gptimage15') return copy.gallery.modelGptImage15;
  return getPromptModelName(modelId) ?? copy.gallery.modelAiImage;
};

const filterModelLabel = (modelId: string | undefined, copy: VogueUICopy) => {
  if (modelId === 'gptimage2') return copy.gallery.gptImageFilter;
  if (modelId === 'gptimage15') return copy.gallery.gptImage15Filter;
  return getPromptModelName(modelId) ?? copy.gallery.aiFilter;
};

const primaryActionStyle = {
  background: '#ffffff',
  borderColor: 'rgba(255, 255, 255, 0.76)',
  color: '#111827',
  boxShadow: '0 10px 22px rgba(0, 0, 0, 0.14)',
};

const sourceIconActionStyle = {
  background: 'rgba(255, 255, 255, 0.72)',
  borderColor: 'rgba(255, 255, 255, 0.42)',
  color: '#111827',
};

const xIconActionStyle = {
  background: 'rgba(17, 24, 39, 0.92)',
  borderColor: 'rgba(17, 24, 39, 0.86)',
  color: '#ffffff',
  boxShadow: '0 12px 24px rgba(0, 0, 0, 0.22)',
};

const MAX_GALLERY_REFERENCE_IMAGES = 6;
const HOMEPAGE_EAGER_CARD_COUNT = 1;
const GALLERY_MASONRY_GAP_PX = 19.2;

const formatGalleryBytes = (value: number) => {
  if (value >= 1024 * 1024) return `${(value / 1024 / 1024).toFixed(1)} MB`;
  if (value >= 1024) return `${Math.ceil(value / 1024)} KB`;
  return `${value} B`;
};

const revokeSelectedReference = (reference: SelectedReference) => {
  if (reference.source === 'local') {
    URL.revokeObjectURL(reference.objectUrl);
  }
};
const GALLERY_MASONRY_ESTIMATED_COLUMN_WIDTH = 384;

const isXSourceUrl = (sourceUrl?: string | null) => {
  if (!sourceUrl) return false;
  try {
    const host = new URL(sourceUrl).hostname.replace(/^www\./, '');
    return host === 'x.com' || host === 'twitter.com';
  } catch {
    return false;
  }
};

const matchesCategory = (
  entry: GalleryEntry,
  categoryKey: VoguePromptCategoryKey
) => {
  if (categoryKey === 'all') return true;

  if (entry.categoryKey) return entry.categoryKey === categoryKey;

  return 'prompt' in entry && getVoguePromptCategoryKey(entry) === categoryKey;
};

const readInitialGalleryFiltersFromUrl = ({
  counts,
  lockedModelId,
}: {
  counts?: GalleryCounts;
  lockedModelId?: string;
}) => {
  if (typeof window === 'undefined') return null;

  const params = new URLSearchParams(window.location.search);
  const modelParam = params.get('model')?.trim();
  const categoryParam = params.get('category')?.trim();
  const model =
    !lockedModelId &&
    modelParam &&
    modelParam !== 'all' &&
    (!counts || counts.models[modelParam])
      ? modelParam
      : null;
  const category = scenarioCategoryDefinitions.some(
    (definition) => definition.key === categoryParam
  )
    ? (categoryParam as VoguePromptCategoryKey)
    : null;

  return model || category ? { model, category } : null;
};

const getEntryCategoryLabel = (entry: GalleryEntry, copy: VogueUICopy) =>
  getScenarioCategories(copy).find(
    (category) => category.key !== 'all' && matchesCategory(entry, category.key)
  )?.label ?? copy.gallery.categories.all.label;

const FALLBACK_GENERATION_COUNTS: WorkspaceGenerationCount[] = [1];
const EMPTY_QUALITY_OPTIONS: WorkspaceQualityOption[] = [];
const EMPTY_OUTPUT_QUALITIES: WorkspaceOutputQuality[] = [];

const formatParameterValue = (value: string) => {
  if (value === 'auto') return 'Auto';
  if (value === 'low') return 'Low';
  if (value === 'medium') return 'Medium';
  if (value === 'high') return 'High';
  if (value === 'standard') return 'Standard';
  if (value === '1k' || value === '2k' || value === '4k') {
    return value.toUpperCase();
  }
  return value;
};

const defaultComposerModel = getModelById('gptimage2');

const getComposerModelId = (modelId: string | undefined) => {
  if (!modelId) return defaultComposerModel.id;

  const model = getModelById(modelId);
  return model.id === modelId ? model.id : defaultComposerModel.id;
};

const getGalleryThumbnailSrc = (
  entryId: string,
  imageIndex: number,
  width = 640
) => {
  const params = new URLSearchParams({
    id: entryId,
    index: String(imageIndex),
    width: String(width),
  });

  return `/api/gpt-image-2-prompts/thumbnail?${params.toString()}`;
};

const getPromptDetailHref = (entry: Pick<GalleryEntry, 'publicId' | 'title'>) =>
  getPromptPagePath(entry);

const getPromptDetailHrefWithImage = (
  entry: Pick<GalleryEntry, 'publicId' | 'title'>,
  imageIndex: number
) =>
  imageIndex <= 0
    ? getPromptDetailHref(entry)
    : `${getPromptDetailHref(entry)}?image=${imageIndex + 1}`;

const getScaledImageHeight = (
  dimensions: { width: number; height: number } | null | undefined,
  targetWidth: number
) =>
  dimensions?.width && dimensions.height
    ? Math.max(1, Math.round((targetWidth * dimensions.height) / dimensions.width))
    : targetWidth;

const getGalleryEntryProjectedHeight = (entry: VoguePromptGalleryEntry) => {
  const dimensions =
    entry.imageDimensions ??
    getVoguePromptImageDimensions(entry.images[0] ?? '');

  return getScaledImageHeight(
    dimensions,
    GALLERY_MASONRY_ESTIMATED_COLUMN_WIDTH
  );
};

const distributeGalleryEntriesIntoColumns = (
  entries: VoguePromptGalleryEntry[],
  columnCount: number
) => {
  const normalizedColumnCount = Math.max(
    1,
    Math.min(columnCount, entries.length || 1)
  );
  const columns = Array.from({ length: normalizedColumnCount }, () => ({
    height: 0,
    items: [] as GalleryMasonryItem[],
  }));

  entries.forEach((entry, index) => {
    let targetColumnIndex = 0;

    for (let columnIndex = 1; columnIndex < columns.length; columnIndex += 1) {
      if (columns[columnIndex].height < columns[targetColumnIndex].height) {
        targetColumnIndex = columnIndex;
      }
    }

    columns[targetColumnIndex].items.push({ entry, index });
    columns[targetColumnIndex].height +=
      getGalleryEntryProjectedHeight(entry) + GALLERY_MASONRY_GAP_PX;
  });

  return columns.map((column) => column.items);
};

const dedupeGalleryEntries = <Entry extends { id: string }>(
  galleryEntries: Entry[]
) => {
  const seenIds = new Set<string>();

  return galleryEntries.filter((entry) => {
    if (seenIds.has(entry.id)) return false;

    seenIds.add(entry.id);
    return true;
  });
};

const mergeUniqueGalleryEntries = <Entry extends { id: string }>(
  currentEntries: Entry[],
  nextEntries: Entry[]
) => {
  const seenIds = new Set(currentEntries.map((entry) => entry.id));
  const uniqueNextEntries = nextEntries.filter((entry) => {
    if (seenIds.has(entry.id)) return false;

    seenIds.add(entry.id);
    return true;
  });

  return uniqueNextEntries.length > 0
    ? [...currentEntries, ...uniqueNextEntries]
    : currentEntries;
};

function PromptCard({
  entry,
  onUsePrompt,
  onUseAsReference,
  onOpenDetails,
  detailHref,
  detailLanguageLabels,
  denseActions,
  eagerLoad,
  isLoading,
  copy,
  imageAltSuffix,
}: {
  entry: GalleryEntry;
  onUsePrompt: (entry: GalleryEntry) => void | Promise<void>;
  onUseAsReference: (
    entry: GalleryEntry,
    imageUrl: string
  ) => void | Promise<void>;
  onOpenDetails: (
    entry: GalleryEntry,
    imageIndex: number
  ) => void | Promise<void>;
  detailHref: string;
  detailLanguageLabels: (typeof promptDetailLanguageLabels)[keyof typeof promptDetailLanguageLabels];
  denseActions: boolean;
  eagerLoad: boolean;
  isLoading?: boolean;
  copy: VogueUICopy;
  imageAltSuffix?: string;
}) {
  const [isRevealed, setIsRevealed] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const activeImage =
    entry.images[Math.min(activeImageIndex, entry.images.length - 1)] ??
    entry.images[0] ??
    '';
  const activeImageDimensions =
    getVoguePromptImageDimensions(activeImage) ??
    ('imageDimensions' in entry ? entry.imageDimensions : null);
  const cardImageWidth = 384;
  const cardImageHeight = getScaledImageHeight(
    activeImageDimensions,
    cardImageWidth
  );
  const isXSource = isXSourceUrl(entry.sourceUrl);
  const entryModelIcon = entry.modelId
    ? getModelIconPathByModelId(entry.modelId)
    : null;
  const entryCategoryTag = getEntryCategoryLabel(entry, copy);

  return (
    <article className="vogue-gallery-card w-full">
      <div
        className={`vogue-gallery-card-shell relative overflow-hidden border bg-white transition duration-300 ${
          denseActions
            ? 'rounded-[18px] shadow-[0_12px_28px_rgba(72,55,44,0.08)]'
            : 'rounded-[24px] shadow-[0_18px_42px_rgba(72,55,44,0.1)]'
        }`}
        role="button"
        tabIndex={0}
        aria-busy={isLoading || undefined}
        onMouseEnter={() => setIsRevealed(true)}
        onMouseLeave={() => setIsRevealed(false)}
        onFocus={() => setIsRevealed(true)}
        onBlur={() => setIsRevealed(false)}
        onClick={(event) => {
          const target = event.target as HTMLElement;
          if (target.closest('button, a')) return;
          void onOpenDetails(entry, activeImageIndex);
        }}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            void onOpenDetails(entry, activeImageIndex);
          }
        }}
        style={{
          borderColor: isRevealed
            ? 'rgba(72, 55, 44, 0.18)'
            : 'rgba(72, 55, 44, 0.08)',
          boxShadow: isRevealed
            ? '0 26px 58px rgba(72, 55, 44, 0.16)'
            : '0 18px 42px rgba(72, 55, 44, 0.1)',
          transform: isRevealed ? 'translateY(-3px)' : 'translateY(0)',
        }}
      >
        <a href={detailHref} className="sr-only">
          {detailLanguageLabels.current}: {copy.gallery.viewDetails}
        </a>
        <Image
          src={getGalleryThumbnailSrc(entry.id, activeImageIndex, 640)}
          alt={imageAltSuffix ? `${entry.title} ${imageAltSuffix}` : entry.title}
          width={cardImageWidth}
          height={cardImageHeight}
          sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="vogue-gallery-card-image block h-auto w-full object-cover transition duration-700"
          loading={eagerLoad ? 'eager' : 'lazy'}
          fetchPriority={eagerLoad ? 'high' : 'auto'}
          decoding="async"
          style={{
            aspectRatio: activeImageDimensions?.aspectRatio,
            transform: isRevealed ? 'scale(1.018)' : 'scale(1)',
          }}
        />
        <div
          data-card-overlay
          className="vogue-gallery-card-overlay pointer-events-none absolute inset-0 bg-gradient-to-b from-black/5 via-black/0 to-black/76 transition-opacity duration-300"
          style={{ opacity: isRevealed ? 1 : 0 }}
        />
        {entry.images.length > 1 ? (
          <div
            className="vogue-gallery-card-thumbs absolute left-3 right-3 top-3 z-10 flex gap-1.5 overflow-x-auto transition-opacity duration-300"
            style={{ opacity: isRevealed ? 1 : 0 }}
          >
            {entry.images.map((imageUrl, imageIndex) => {
              const thumbnailDimensions =
                getVoguePromptImageDimensions(imageUrl) ??
                ('imageDimensions' in entry ? entry.imageDimensions : null);

              return (
                <button
                  key={`${entry.id}-${imageUrl}`}
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    setActiveImageIndex(imageIndex);
                  }}
                  className={`relative h-9 w-9 shrink-0 overflow-hidden rounded-[10px] border bg-black/55 shadow-[0_8px_18px_rgba(0,0,0,0.28)] backdrop-blur transition ${
                    imageIndex === activeImageIndex
                      ? 'border-white'
                      : 'border-white/35 hover:border-white/70'
                  }`}
                >
                  <Image
                    src={getGalleryThumbnailSrc(entry.id, imageIndex, 128)}
                    alt={`${entry.title} ${imageIndex + 1}`}
                    width={64}
                    height={getScaledImageHeight(thumbnailDimensions, 64)}
                    sizes="36px"
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </button>
              );
            })}
          </div>
        ) : null}
        <div
          className="vogue-gallery-card-caption absolute inset-x-0 bottom-0 z-10 p-3.5 transition-all duration-300"
          style={{
            opacity: isRevealed ? 1 : 0,
            transform: isRevealed ? 'translateY(0)' : 'translateY(12px)',
            pointerEvents: isRevealed ? 'auto' : 'none',
          }}
        >
          <div className="mb-2.5">
            <span className="line-clamp-2 text-base font-black leading-tight text-white drop-shadow">
              {entry.title}
            </span>
            <div className="vogue-card-meta mt-2 flex items-center gap-1.5">
              {entryModelIcon ? (
                <span
                  aria-hidden="true"
                  className="vogue-card-model-mark inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/72 shadow-[0_4px_10px_rgba(0,0,0,0.18)] ring-1 ring-white/28 backdrop-blur-sm"
                >
                  <Image
                    src={entryModelIcon}
                    alt=""
                    width={16}
                    height={16}
                    className="h-4 w-4 object-contain"
                  />
                </span>
              ) : null}
              <span className="vogue-card-category-tag inline-flex h-5 items-center rounded-full bg-white/16 px-2 text-[11px] font-semibold leading-none text-white/90 shadow-[0_6px_16px_rgba(0,0,0,0.14)] ring-1 ring-white/22 backdrop-blur-sm">
                {entryCategoryTag}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              title={copy.gallery.usePrompt}
              onClick={(event) => {
                event.stopPropagation();
                void onUsePrompt(entry);
              }}
              className={`inline-flex h-8 items-center justify-center gap-1.5 rounded-[11px] border text-[12px] font-medium transition hover:-translate-y-0.5 hover:bg-white ${
                denseActions ? 'w-10 shrink-0 px-0' : 'shrink-0 px-3.5'
              }`}
              style={primaryActionStyle}
            >
              <Sparkles className="h-3 w-3" />
              <span className={denseActions ? 'sr-only' : ''}>
                {copy.gallery.usePrompt}
              </span>
            </button>
            <button
              type="button"
              title={copy.gallery.useAsReference}
              onClick={(event) => {
                event.stopPropagation();
                void onUseAsReference(entry, activeImage);
              }}
              className={`inline-flex h-8 items-center justify-center gap-1.5 rounded-[11px] border text-[12px] font-medium transition hover:-translate-y-0.5 hover:bg-white ${
                denseActions ? 'w-10 shrink-0 px-0' : 'shrink-0 px-3.5'
              }`}
              style={primaryActionStyle}
            >
              <Layers className="h-3 w-3" />
              <span className={denseActions ? 'sr-only' : ''}>
                {copy.gallery.useAsRefShort}
              </span>
            </button>
            {entry.sourceUrl && (
              <a
                href={entry.sourceUrl}
                target="_blank"
                rel="noreferrer"
                title={copy.gallery.openSource}
                className="ml-auto flex h-8 w-8 shrink-0 items-center justify-center rounded-[11px] border transition hover:-translate-y-0.5"
                style={isXSource ? xIconActionStyle : sourceIconActionStyle}
              >
                {isXSource ? (
                  <IconBrandX className="h-4 w-4" />
                ) : (
                  <ExternalLink className="h-4 w-4" />
                )}
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

export default function VogueGalleryWorkspace({
  entries,
  counts,
  pageSize = 80,
  maxEntries,
  maxEntriesCta,
  heading,
  description,
  initialModel = 'all',
  initialScenario = 'all',
  lockedModelId,
  headingLevel = 'h1',
  imageAltSuffix,
  surfaceStyle,
  gallerySort = 'default',
}: {
  entries: VoguePromptGalleryEntry[];
  counts?: GalleryCounts;
  pageSize?: number;
  maxEntries?: number;
  maxEntriesCta?: {
    href: string;
    label: string;
    description: string;
  };
  heading: string;
  description: string;
  initialModel?: string;
  initialScenario?: VoguePromptCategoryKey;
  lockedModelId?: string;
  headingLevel?: 'h1' | 'h2';
  imageAltSuffix?: string;
  surfaceStyle?: CSSProperties;
  gallerySort?: 'default' | 'homepageFresh';
}) {
  const locale = useLocale();
  const messages = useMessages();
  const copy = getVogueCopyFromMessages(messages);
  const promptDetailLabels =
    promptDetailLanguageLabels[
      locale as keyof typeof promptDetailLanguageLabels
    ] ?? promptDetailLanguageLabels.en;
  const cappedInitialEntries = useMemo(() => {
    const dedupedEntries = dedupeGalleryEntries(entries);
    return maxEntries ? dedupedEntries.slice(0, maxEntries) : dedupedEntries;
  }, [entries, maxEntries]);
  const [galleryEntries, setGalleryEntries] =
    useState<VoguePromptGalleryEntry[]>(() => cappedInitialEntries);
  const [nextOffset, setNextOffset] = useState(cappedInitialEntries.length);
  const [hasMoreEntries, setHasMoreEntries] = useState(
    () =>
      cappedInitialEntries.length >= pageSize &&
      (!maxEntries || cappedInitialEntries.length < maxEntries)
  );
  const [isLoadingEntries, setIsLoadingEntries] = useState(false);
  const [selectedModel, setSelectedModel] = useState(
    lockedModelId ?? initialModel
  );
  const [selectedScenario, setSelectedScenario] =
    useState<VoguePromptCategoryKey>(initialScenario);
  const [columnCount, setColumnCount] = useState(2);
  const [prompt, setPrompt] = useState('');
  const [composerRemixPromptId, setComposerRemixPromptId] = useState<
    string | null
  >(null);
  const [composerRemixValues, setComposerRemixValues] =
    useState<PromptRemixValues>({});
  const [composerOpen, setComposerOpen] = useState(false);
  const [composerFocusKey, setComposerFocusKey] = useState(0);
  const [selectedProviderId, setSelectedProviderId] = useState('gptimage2');
  const [aspectRatio, setAspectRatio] = useState<WorkspaceAspectRatio>(
    defaultComposerModel.defaultAspectRatio
  );
  const [quality, setQuality] = useState<WorkspaceQualityOption>(
    defaultComposerModel.defaultQuality || 'medium'
  );
  const [outputQuality, setOutputQuality] = useState<WorkspaceOutputQuality>(
    defaultComposerModel.defaultOutputQuality || '1k'
  );
  const [generationCount, setGenerationCount] =
    useState<WorkspaceGenerationCount>(
      defaultComposerModel.defaultGenerationCount || 1
    );
  const [selectedReferences, setSelectedReferences] = useState<
    SelectedReference[]
  >([]);
  const [referenceUploadError, setReferenceUploadError] = useState<
    string | null
  >(null);
  const [loadingDetailId, setLoadingDetailId] = useState<string | null>(null);
  const [isCompactViewport, setIsCompactViewport] = useState(false);
  const galleryFrameRef = useRef<HTMLDivElement | null>(null);
  const galleryFileInputRef = useRef<HTMLInputElement | null>(null);
  const selectedReferencesRef = useRef<SelectedReference[]>([]);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const didMountRef = useRef(false);
  const didApplyInitialUrlFiltersRef = useRef(false);
  const inFlightGalleryPageKeysRef = useRef<Set<string>>(new Set());
  const fullEntryCacheRef = useRef<Map<string, VoguePromptEntry>>(new Map());
  const composerModels = useMemo(() => getComposerModels(copy), [copy]);
  const scenarioCategories = useMemo(
    () => getScenarioCategories(copy),
    [copy]
  );

  useEffect(() => {
    if (didApplyInitialUrlFiltersRef.current) return;
    didApplyInitialUrlFiltersRef.current = true;

    const initialUrlFilters = readInitialGalleryFiltersFromUrl({
      counts,
      lockedModelId,
    });

    if (!initialUrlFilters) return;

    const frame = window.requestAnimationFrame(() => {
      if (initialUrlFilters.model) {
        setSelectedModel(initialUrlFilters.model);
      }

      if (initialUrlFilters.category) {
        setSelectedScenario(initialUrlFilters.category);
      }
    });

    return () => window.cancelAnimationFrame(frame);
  }, [counts, lockedModelId]);

  useEffect(() => {
    const updateCompactViewport = () => {
      setIsCompactViewport(window.innerWidth <= 640);
    };

    updateCompactViewport();
    window.addEventListener('resize', updateCompactViewport);
    return () => window.removeEventListener('resize', updateCompactViewport);
  }, []);

  useEffect(() => {
    selectedReferencesRef.current = selectedReferences;
  }, [selectedReferences]);

  useEffect(
    () => () => {
      selectedReferencesRef.current.forEach(revokeSelectedReference);
    },
    []
  );

  useEffect(() => {
    const element = galleryFrameRef.current;
    if (!element) return;

    const syncColumnCount = (width: number) => {
      if (width >= 1440) {
        setColumnCount(4);
      } else if (width >= 980) {
        setColumnCount(3);
      } else if (width >= 640) {
        setColumnCount(2);
      } else {
        setColumnCount(2);
      }
    };

    syncColumnCount(element.getBoundingClientRect().width);
    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width;
      if (width) syncColumnCount(width);
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const modelFilters = useMemo<ModelFilter[]>(() => {
    const models = counts
      ? Object.keys(counts.models)
      : Array.from(
          new Set(galleryEntries.map((entry) => entry.modelId || 'unknown'))
        );

    return [
      { key: 'all', label: copy.gallery.modelAll },
      ...models.map((modelId) => ({
        key: modelId,
        label: filterModelLabel(modelId, copy),
      })),
    ];
  }, [copy, counts, galleryEntries]);

  const modelCounts = useMemo(
    () => {
      if (counts) {
        return {
          all: counts.total,
          ...counts.models,
        };
      }

      return modelFilters.reduce<Record<string, number>>((nextCounts, model) => {
        nextCounts[model.key] =
          model.key === 'all'
            ? galleryEntries.length
            : galleryEntries.filter(
                (entry) => (entry.modelId || 'unknown') === model.key
              ).length;
        return nextCounts;
      }, {});
    },
    [counts, galleryEntries, modelFilters]
  );

  const scenarioCounts = useMemo(
    () => {
      if (counts) {
        return {
          all: counts.total,
          ...counts.categories,
        };
      }

      return scenarioCategoryDefinitions.reduce<Record<string, number>>(
        (nextCounts, category) => {
          nextCounts[category.key] = galleryEntries.filter((entry) =>
            matchesCategory(entry, category.key)
          ).length;
          return nextCounts;
        },
        {}
      );
    },
    [counts, galleryEntries]
  );

  const filteredEntries = useMemo(() => {
    return galleryEntries.filter((entry) => {
      if (selectedModel !== 'all' && (entry.modelId || 'unknown') !== selectedModel) {
        return false;
      }

      return matchesCategory(entry, selectedScenario);
    });
  }, [galleryEntries, selectedModel, selectedScenario]);
  const galleryColumns = useMemo(
    () => distributeGalleryEntriesIntoColumns(filteredEntries, columnCount),
    [columnCount, filteredEntries]
  );
  const eagerCardCount = HOMEPAGE_EAGER_CARD_COUNT;
  const selectedGalleryTotal =
    selectedScenario !== 'all'
      ? (scenarioCounts[selectedScenario] ?? filteredEntries.length)
      : selectedModel !== 'all'
        ? (modelCounts[selectedModel] ?? filteredEntries.length)
        : (modelCounts.all ?? filteredEntries.length);
  const showMaxEntriesCta = Boolean(
    maxEntriesCta &&
      maxEntries &&
      galleryEntries.length >= maxEntries &&
      selectedGalleryTotal > galleryEntries.length
  );

  const selectedComposerModel = useMemo(
    () => getModelById(selectedProviderId),
    [selectedProviderId]
  );
  const composerRemixSchema = useMemo(
    () =>
      composerRemixPromptId ? getPromptRemixSchema(composerRemixPromptId) : null,
    [composerRemixPromptId]
  );
  const supportedGenerationCounts =
    selectedComposerModel.supportedGenerationCounts ?? FALLBACK_GENERATION_COUNTS;
  const qualityOptions =
    selectedComposerModel.qualityOptions ?? EMPTY_QUALITY_OPTIONS;
  const outputQualityOptions =
    selectedComposerModel.supportedOutputQualities ?? EMPTY_OUTPUT_QUALITIES;
  const promptMaxChars = getGenerationPromptMaxChars({
    modelId: selectedComposerModel.id,
  });
  const promptCharacterCount = countPromptCharacters(prompt);
  const galleryCreditEstimate = estimateCreditsForEffect({
    effect: selectedComposerModel,
    input: {
      n: generationCount,
      quality,
      wmOutputQuality: outputQuality,
    },
  });
  const applySelectedProvider = useCallback(
    (nextModelId: string) => {
      const nextModel = getModelById(nextModelId);
      setSelectedProviderId(nextModel.id);
      setAspectRatio(nextModel.defaultAspectRatio);
      setQuality(nextModel.defaultQuality || 'medium');
      setOutputQuality(nextModel.defaultOutputQuality || '1k');
      setGenerationCount(nextModel.defaultGenerationCount || 1);
      setPrompt((value) =>
        truncatePromptToMaxChars(
          value,
          getGenerationPromptMaxChars({ modelId: nextModel.id })
        )
      );
    },
    [
      setAspectRatio,
      setGenerationCount,
      setOutputQuality,
      setPrompt,
      setQuality,
      setSelectedProviderId,
    ]
  );
  const fetchGalleryEntries = useCallback(
    async ({ offset, replace }: { offset: number; replace: boolean }) => {
      const remainingEntrySlots = maxEntries
        ? Math.max(0, maxEntries - offset)
        : pageSize;
      const requestLimit = maxEntries
        ? Math.min(pageSize, remainingEntrySlots)
        : pageSize;

      if (requestLimit <= 0) {
        setHasMoreEntries(false);
        return;
      }

      const requestKey = [
        locale,
        selectedModel,
        selectedScenario,
        requestLimit,
        offset,
        gallerySort,
        maxEntries ?? 'all',
      ].join(':');

      if (inFlightGalleryPageKeysRef.current.has(requestKey)) return;

      inFlightGalleryPageKeysRef.current.add(requestKey);
      setIsLoadingEntries(true);
      try {
        const params = new URLSearchParams({
          mode: 'gallery',
          locale,
          limit: String(requestLimit),
          offset: String(offset),
        });

        if (selectedModel !== 'all') params.set('model', selectedModel);
        if (selectedScenario !== 'all') {
          params.set('category', selectedScenario);
        }
        if (gallerySort === 'homepageFresh') {
          params.set('sort', gallerySort);
        }

        const response = await fetch(
          `/api/gpt-image-2-prompts/entries?${params.toString()}`
        );
        if (!response.ok) return;

        const payload = (await response.json()) as {
          entries?: VoguePromptGalleryEntry[];
          hasMore?: boolean;
        };
        const nextEntries = payload.entries ?? [];

        const nextLoadedCount = offset + nextEntries.length;
        const reachedEntryCap = Boolean(
          maxEntries && nextLoadedCount >= maxEntries
        );

        setGalleryEntries((current) => {
          const mergedEntries = replace
            ? dedupeGalleryEntries(nextEntries)
            : mergeUniqueGalleryEntries(current, nextEntries);

          return maxEntries
            ? mergedEntries.slice(0, maxEntries)
            : mergedEntries;
        });
        setNextOffset(maxEntries ? Math.min(nextLoadedCount, maxEntries) : nextLoadedCount);
        setHasMoreEntries(Boolean(payload.hasMore) && !reachedEntryCap);
      } finally {
        inFlightGalleryPageKeysRef.current.delete(requestKey);
        setIsLoadingEntries(false);
      }
    },
    [gallerySort, locale, maxEntries, pageSize, selectedModel, selectedScenario]
  );

  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }

    void fetchGalleryEntries({ offset: 0, replace: true });
  }, [fetchGalleryEntries]);

  useEffect(() => {
    const element = loadMoreRef.current;
    if (!element || !hasMoreEntries || isLoadingEntries) return;

    const observer = new IntersectionObserver(
      (observerEntries) => {
        if (observerEntries.some((entry) => entry.isIntersecting)) {
          void fetchGalleryEntries({ offset: nextOffset, replace: false });
        }
      },
      { rootMargin: '600px 0px' }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [fetchGalleryEntries, hasMoreEntries, isLoadingEntries, nextOffset]);

  const galleryComposerParameters = useMemo<VogueComposerParameter[]>(
    () => [
      {
        id: 'aspectRatio',
        label: copy.app.parameterLabels.aspectRatio,
        value: aspectRatio,
        options: selectedComposerModel.supportedAspectRatios,
        formatLabel: formatParameterValue,
        onChange: (value) => setAspectRatio(value as WorkspaceAspectRatio),
      },
      {
        id: 'outputQuality',
        label: copy.app.parameterLabels.resolution,
        value: outputQuality,
        options: outputQualityOptions,
        formatLabel: formatParameterValue,
        onChange: (value) =>
          setOutputQuality(value as WorkspaceOutputQuality),
      },
      {
        id: 'quality',
        label: copy.app.parameterLabels.quality,
        value: quality,
        options: qualityOptions,
        formatLabel: formatParameterValue,
        onChange: (value) => setQuality(value as WorkspaceQualityOption),
      },
      {
        id: 'generationCount',
        label: copy.app.parameterLabels.imageNumber,
        value: String(generationCount),
        options: supportedGenerationCounts.map(String),
        formatLabel: (value) => `${value}x`,
        onChange: (value) =>
          setGenerationCount(Number(value) as WorkspaceGenerationCount),
      },
    ],
    [
      aspectRatio,
      copy,
      generationCount,
      outputQuality,
      outputQualityOptions,
      quality,
      qualityOptions,
      selectedComposerModel.supportedAspectRatios,
      supportedGenerationCounts,
    ]
  );

  const selectedReferenceItems = useMemo<VogueComposerReferenceItem[]>(
    () =>
      selectedReferences.map((reference) => ({
        id: reference.id,
        url: reference.imageUrl,
        name: reference.title,
      })),
    [selectedReferences]
  );
  const generateHref = useMemo(() => {
    const params = new URLSearchParams({
      target: 'image',
      model: selectedComposerModel.id,
      autostart: '1',
      aspectRatio,
      outputQuality,
      quality,
      generationCount: String(generationCount),
    });
    return `${getUrlWithLocale('/app', locale)}?${params.toString()}`;
  }, [
    aspectRatio,
    generationCount,
    locale,
    outputQuality,
    quality,
    selectedComposerModel.id,
  ]);
  const persistGenerateTransfer = useCallback(() => {
    const localReferenceFiles = selectedReferences.flatMap((reference) =>
      reference.source === 'local'
        ? [
            {
              id: reference.id,
              file: reference.file,
              name: reference.title,
            },
          ]
        : []
    );

    writeVogueAppTransferPayload({
      source: 'gallery',
      createdAt: Date.now(),
      model: selectedComposerModel.id,
      prompt,
      aspectRatio,
      outputQuality,
      quality,
      generationCount,
      referenceImages: selectedReferences.flatMap((reference) =>
        reference.source === 'remote' ? [reference.imageUrl] : []
      ),
      referenceImageItems: selectedReferences.map((reference) =>
        reference.source === 'local'
          ? {
              source: 'local',
              id: reference.id,
              name: reference.title,
            }
          : {
              source: 'remote',
              url: reference.imageUrl,
            }
      ),
      localReferenceFiles: localReferenceFiles,
      remixPromptId: composerRemixSchema?.promptId,
      remixValues: composerRemixSchema ? composerRemixValues : undefined,
    });
  }, [
    aspectRatio,
    composerRemixSchema,
    composerRemixValues,
    generationCount,
    outputQuality,
    prompt,
    quality,
    selectedComposerModel.id,
    selectedReferences,
  ]);
  const composerShellStyle = {
    position: 'fixed' as const,
    left: isCompactViewport ? 12 : 272,
    right: isCompactViewport ? 12 : 24,
    bottom: 12,
    zIndex: 50,
  };

  const openComposer = () => {
    setComposerOpen(true);
    setComposerFocusKey((current) => current + 1);
  };

  const handleGalleryFilesSelected = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    event.target.value = '';
    if (files.length === 0) return;

    const incoming: SelectedReference[] = [];
    for (const [index, file] of files.entries()) {
      const validation = validateUploadedImageFile(file);
      if (!validation.ok) {
        incoming.forEach(revokeSelectedReference);
        setReferenceUploadError(
          validation.code === 'IMAGE_TOO_LARGE'
            ? copy.app.errors.referenceTooLarge.replace(
                '{maxSize}',
                formatGalleryBytes(validation.maxBytes)
              )
            : copy.app.errors.referenceType
        );
        return;
      }

      const objectUrl = URL.createObjectURL(file);
      incoming.push({
        source: 'local',
        id: `local:${Date.now()}:${index}:${file.name}`,
        imageUrl: objectUrl,
        objectUrl,
        file,
        title: file.name,
      });
    }

    setSelectedReferences((current) => {
      const availableSlots = MAX_GALLERY_REFERENCE_IMAGES - current.length;

      if (incoming.length > availableSlots) {
        incoming.forEach(revokeSelectedReference);
        setReferenceUploadError(
          availableSlots > 0
            ? copy.app.errors.limitedReferenceSlots
                .replace('{count}', String(availableSlots))
                .replace('{plural}', availableSlots > 1 ? 's' : '')
                .replace('{verb}', availableSlots > 1 ? 'are' : 'is')
            : copy.app.errors.noReferenceSlots
        );
        return current;
      }

      setReferenceUploadError(null);
      return [...current, ...incoming];
    });
    openComposer();
  };

  const fetchFullPromptEntry = useCallback(
    async (entry: GalleryEntry) => {
      if ('prompt' in entry && entry.prompt) {
        return entry as VoguePromptEntry;
      }

      const cachedEntry = fullEntryCacheRef.current.get(entry.id);
      if (cachedEntry) return cachedEntry;

      setLoadingDetailId(entry.id);
      try {
        const params = new URLSearchParams({
          id: entry.id,
          locale,
        });
        const response = await fetch(
          `/api/gpt-image-2-prompts/entries?${params.toString()}`
        );
        if (!response.ok) {
          throw new Error(`Failed to load prompt entry ${entry.id}`);
        }

        const payload = (await response.json()) as {
          entry?: VoguePromptEntry;
        };
        if (!payload.entry) {
          throw new Error(`Prompt entry ${entry.id} was empty`);
        }

        fullEntryCacheRef.current.set(entry.id, payload.entry);
        return payload.entry;
      } finally {
        setLoadingDetailId((current) => (current === entry.id ? null : current));
      }
    },
    [locale]
  );

  const applyGalleryPrompt = async (
    entry: GalleryEntry,
    promptText?: string
  ) => {
    const fullEntry = promptText
      ? (entry as VoguePromptEntry)
      : await fetchFullPromptEntry(entry);
    const nextPrompt = promptText ?? fullEntry.prompt;
    const nextModelId = getComposerModelId(entry.modelId);
    const nextPromptMaxChars = getGenerationPromptMaxChars({
      modelId: nextModelId,
    });
    const nextRemixSchema = getPromptRemixSchema(fullEntry.id);
    const shouldUseRemixSchema = Boolean(
      nextRemixSchema && nextPrompt === fullEntry.prompt
    );

    setPrompt(truncatePromptToMaxChars(nextPrompt, nextPromptMaxChars));
    setComposerRemixPromptId(
      shouldUseRemixSchema ? nextRemixSchema?.promptId ?? null : null
    );
    setComposerRemixValues(
      shouldUseRemixSchema
        ? getInitialPromptRemixValues(nextRemixSchema)
        : {}
    );
    applySelectedProvider(nextModelId);
    openComposer();
  };

  const applyGalleryReference = async (
    entry: GalleryEntry,
    imageUrl: string
  ) => {
    const fullEntry = await fetchFullPromptEntry(entry);
    const imageIndex = entry.images.indexOf(imageUrl);
    const referenceImageUrl =
      fullEntry.images[Math.max(0, imageIndex)] ??
      fullEntry.images[0] ??
      imageUrl;
    setSelectedReferences((current) => {
      const id = `${entry.id}:${referenceImageUrl}`;
      const nextReference: SelectedReference = {
        source: 'remote',
        id,
        entryId: entry.id,
        imageUrl: referenceImageUrl,
        title: entry.title,
      };
      const deduped = current.filter((reference) => reference.id !== id);
      const nextReferences = [...deduped, nextReference].slice(
        -MAX_GALLERY_REFERENCE_IMAGES
      );
      const keptIds = new Set(nextReferences.map((reference) => reference.id));
      current.forEach((reference) => {
        if (!keptIds.has(reference.id)) revokeSelectedReference(reference);
      });
      return nextReferences;
    });
    setReferenceUploadError(null);
    openComposer();
  };

  const openPromptDetail = (detailEntry: GalleryEntry, imageIndex: number) => {
    if (typeof window === 'undefined') return;

    window.location.assign(getPromptDetailHrefWithImage(detailEntry, imageIndex));
  };

  return (
    <section
      className="vogue-gallery-surface"
      aria-labelledby="vogue-prompt-gallery-heading"
      style={surfaceStyle}
    >
      <div
        ref={galleryFrameRef}
        className={`vogue-gallery-frame mx-auto max-w-[1740px] px-3 pt-3 sm:px-5 sm:pt-5 lg:px-5 lg:pt-5 ${
          composerOpen ? 'pb-40 sm:pb-44 lg:pb-48' : 'pb-8 sm:pb-10 lg:pb-12'
        }`}
      >
        {headingLevel === 'h1' ? (
          <h1 id="vogue-prompt-gallery-heading" className="sr-only">
            {heading}
          </h1>
        ) : (
          <h2 id="vogue-prompt-gallery-heading" className="sr-only">
            {heading}
          </h2>
        )}
        <p className="sr-only">{description}</p>

        <div className="vogue-gallery-board rounded-[28px] border border-white/82 bg-white/66 p-3 shadow-[0_24px_70px_rgba(72,55,44,0.1)] ring-1 ring-[rgba(72,55,44,0.07)] backdrop-blur-xl sm:p-4 lg:rounded-[32px] lg:p-5">
          <div
            aria-label={copy.gallery.filtersAria}
            className={`vogue-filter-strip mb-5 flex flex-col gap-2 px-1 ${
              lockedModelId
                ? ''
                : 'lg:flex-row lg:items-center lg:justify-between'
            }`}
          >
            {!lockedModelId ? (
              <div className="min-w-0 lg:flex-none">
                <FilterRail
                  label={copy.gallery.modelFilter}
                  options={modelFilters}
                  selectedKey={selectedModel}
                  counts={modelCounts}
                  onSelect={setSelectedModel}
                  promptCountLabel={copy.gallery.promptCountAria}
                  variant="model"
                  getIconSrc={(key) =>
                    key === 'all' ? null : getModelIconPathByModelId(key)
                  }
                />
              </div>
            ) : null}
            <div className="min-w-0 flex-1">
              <FilterRail
                label={copy.gallery.useFilter}
                options={scenarioCategories}
                selectedKey={selectedScenario}
                counts={scenarioCounts}
                onSelect={(key) =>
                  setSelectedScenario(key as VoguePromptCategoryKey)
                }
                promptCountLabel={copy.gallery.promptCountAria}
                tone="warm"
              />
            </div>
          </div>

          <div
            id="prompt-library-grid"
            className="vogue-gallery-masonry"
            aria-label={copy.gallery.gridAria}
            style={
              {
                '--vogue-gallery-column-count': galleryColumns.length,
              } as CSSProperties
            }
          >
            {galleryColumns.map((column, columnIndex) => (
              <div
                key={`prompt-library-column-${columnIndex}`}
                className="vogue-gallery-masonry-column"
              >
                {column.map(({ entry, index }) => (
                  <PromptCard
                        key={entry.id}
                        entry={entry}
                        onUsePrompt={applyGalleryPrompt}
                        onUseAsReference={applyGalleryReference}
                        detailHref={getPromptDetailHref(entry)}
                        detailLanguageLabels={promptDetailLabels}
                        denseActions={columnCount >= 4}
                    eagerLoad={index < eagerCardCount}
                    isLoading={loadingDetailId === entry.id}
                    copy={copy}
                    onOpenDetails={openPromptDetail}
                    imageAltSuffix={imageAltSuffix}
                  />
                ))}
              </div>
            ))}
          </div>
          {hasMoreEntries ? (
            <div ref={loadMoreRef} aria-hidden="true" className="h-10" />
          ) : null}
          {showMaxEntriesCta && maxEntriesCta ? (
            <div className="mt-5 rounded-[18px] border border-[rgba(79,103,255,0.16)] bg-white/82 px-5 py-5 text-center shadow-[0_18px_46px_rgba(72,55,44,0.08)] sm:px-6">
              <p className="text-[15px] font-semibold leading-6 text-slate-950">
                {maxEntriesCta.description}
              </p>
              <a
                href={getUrlWithLocale(maxEntriesCta.href, locale)}
                className="mt-4 inline-flex h-11 items-center justify-center rounded-[8px] bg-slate-950 px-5 text-[14px] font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800"
              >
                {maxEntriesCta.label}
              </a>
            </div>
          ) : null}
          {filteredEntries.length === 0 && !isLoadingEntries ? (
            <div className="rounded-[16px] border border-slate-200 bg-white/78 px-5 py-12 text-center shadow-[0_18px_50px_rgba(72,92,130,0.1)]">
              <p className="text-sm font-semibold text-slate-600">
                {copy.gallery.noMatches}
              </p>
            </div>
          ) : null}
        </div>
      </div>
      <input
        ref={galleryFileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        multiple
        className="hidden"
        onChange={handleGalleryFilesSelected}
      />
      {composerOpen ? (
        <div style={composerShellStyle}>
          <div className="mx-auto w-full max-w-4xl space-y-2">
            {referenceUploadError ? (
              <div className="mx-2 rounded-[14px] border border-amber-200/80 bg-white/92 px-3 py-2 text-[12px] font-semibold text-amber-700 shadow-[0_12px_30px_rgba(112,90,76,0.1)] backdrop-blur-xl">
                {referenceUploadError}
              </div>
            ) : null}
            <VoguePromptComposer
              variant="gallery"
              prompt={prompt}
              onPromptChange={(value) =>
                setPrompt(truncatePromptToMaxChars(value, promptMaxChars))
              }
              remixSchema={composerRemixSchema}
              remixValues={composerRemixValues}
              onRemixValuesChange={setComposerRemixValues}
              promptCharacterCount={promptCharacterCount}
              promptMaxChars={promptMaxChars}
              placeholder={copy.gallery.composerPlaceholder}
              models={composerModels}
              selectedModelId={selectedProviderId}
              onSelectedModelIdChange={applySelectedProvider}
              referenceItems={selectedReferenceItems}
              maxReferenceImages={MAX_GALLERY_REFERENCE_IMAGES}
              addReferenceLabel={copy.gallery.useAsRefShort}
              onAddReference={() => galleryFileInputRef.current?.click()}
              onRemoveReference={(id) =>
                setSelectedReferences((current) => {
                  const nextReferences = current.filter((reference) => {
                    if (reference.id !== id) return true;
                    revokeSelectedReference(reference);
                    return false;
                  });
                  if (nextReferences.length < MAX_GALLERY_REFERENCE_IMAGES) {
                    setReferenceUploadError(null);
                  }
                  return nextReferences;
                })
              }
              parameters={galleryComposerParameters}
              credits={{
                estimate: galleryCreditEstimate,
              }}
              generateHref={generateHref}
              onGenerateNavigate={persistGenerateTransfer}
              autoFocusPrompt={true}
              promptFocusKey={composerFocusKey}
            />
          </div>
        </div>
      ) : null}
    </section>
  );
}

function FilterRail({
  label,
  options,
  selectedKey,
  counts,
  onSelect,
  promptCountLabel,
  tone = 'neutral',
  variant = 'plain',
  getIconSrc,
}: {
  label: string;
  options: Array<{ key: string; label: string }>;
  selectedKey: string;
  counts: Record<string, number>;
  onSelect: (key: string) => void;
  promptCountLabel: string;
  tone?: 'neutral' | 'warm';
  variant?: 'plain' | 'model';
  getIconSrc?: (key: string) => string | null;
}) {
  const isModelVariant = variant === 'model';

  return (
    <div className="flex min-w-0 items-center">
      <nav
        aria-label={label}
        className={`flex min-w-0 flex-1 items-center overflow-x-auto ${
          isModelVariant ? 'gap-1' : 'gap-1.5'
        } ${
          tone === 'warm' ? 'lg:justify-end' : ''
        }`}
      >
        {options.map((option) => {
          const isActive = selectedKey === option.key;
          const iconSrc = getIconSrc?.(option.key);

          return (
            <button
              key={option.key}
              type="button"
              onClick={() => onSelect(option.key)}
              aria-label={`${option.label} ${counts[option.key] ?? 0} ${promptCountLabel}`}
              className={`vogue-filter-chip relative flex min-w-max items-center justify-center gap-1.5 rounded-[12px] border text-left text-[13px] font-medium leading-none tracking-normal transition duration-200 ${
                isModelVariant
                  ? 'h-9 px-3 sm:h-9 sm:px-3.5'
                  : 'h-8 px-2.5 py-1 sm:h-[32px] sm:px-3'
              } ${
                isActive
                  ? 'vogue-filter-chip-active'
                  : 'border-transparent bg-transparent text-slate-500 hover:bg-white/36 hover:text-slate-900'
              }`}
            >
              {iconSrc ? (
                <span
                  aria-hidden="true"
                  className={`relative z-10 inline-flex shrink-0 items-center justify-center ${
                    isModelVariant ? 'h-5 w-5' : 'h-3.5 w-3.5'
                  }`}
                >
                  <Image
                    src={iconSrc}
                    alt=""
                    width={isModelVariant ? 16 : 14}
                    height={isModelVariant ? 16 : 14}
                    className={`object-contain ${
                      isModelVariant ? 'h-4 w-4' : 'h-3.5 w-3.5'
                    }`}
                  />
                </span>
              ) : null}
              <span className="relative z-10">{option.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
