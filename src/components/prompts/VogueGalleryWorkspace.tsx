'use client';

import {
  getVogueCopyFromMessages,
  type VogueUICopy,
} from '@/i18n/vogue';
import { isVogueFeaturedPromptEntry } from '@/lib/prompts/runtime-ids';
import type {
  VoguePromptEntry,
  VoguePromptGalleryEntry,
} from '@/lib/prompts/types';
import {
  VOGUE_PROMPT_CATEGORY_DEFINITIONS,
  getVoguePromptCategoryKey,
  type VoguePromptCategoryKey,
  type VoguePromptConcreteCategoryKey,
} from '@/lib/prompt-taxonomy';
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
import PromptResolvedImage from '@/components/prompts/PromptResolvedImage';
import { createFallbackPromptImageAsset } from '@/lib/prompt-image-types';
import { getPromptPagePath } from '@/lib/prompt-page-routes';
import { getLinkablePromptSourceUrl } from '@/lib/prompt-source-links';
import { getVogueWorkspaceModelDescription } from '@/lib/vogue-model-copy';
import { IconBrandX } from '@tabler/icons-react';
import {
  Check,
  ChevronDown,
  Gem,
  Layers,
  SlidersHorizontal,
  Sparkles,
  X,
} from 'lucide-react';
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
  useSyncExternalStore,
} from 'react';
import {
  GALLERY_CARD_IMAGE_SIZES,
  buildResponsiveGalleryColumns,
} from './vogue-gallery-masonry';

const FEATURED_MODEL_FILTER_KEY = 'featured';

type GalleryEntry = VoguePromptEntry | VoguePromptGalleryEntry;

type GalleryCounts = {
  total: number;
  featured: number;
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
const concreteScenarioCategoryKeys = scenarioCategoryDefinitions
  .filter(
    (
      category
    ): category is (typeof scenarioCategoryDefinitions)[number] & {
      key: VoguePromptConcreteCategoryKey;
    } =>
      category.key !== 'all'
  )
  .map((category) => category.key);
const concreteScenarioCategoryKeySet = new Set<VoguePromptCategoryKey>(
  concreteScenarioCategoryKeys
);
const isConcreteScenarioCategoryKey = (
  key: string | null | undefined
): key is VoguePromptConcreteCategoryKey =>
  Boolean(key && concreteScenarioCategoryKeySet.has(key as VoguePromptCategoryKey));

const getScenarioCategories = (copy: VogueUICopy): GalleryCategory[] =>
  scenarioCategoryDefinitions.map((category) => ({
    ...category,
    ...copy.gallery.categories[category.key as keyof typeof copy.gallery.categories],
  }));

const normalizeTypeKeys = (
  keys: Array<string | null | undefined>
): VoguePromptConcreteCategoryKey[] => {
  const requestedKeys = new Set(
    keys
      .map((key) => key?.trim())
      .filter(isConcreteScenarioCategoryKey)
  );

  return concreteScenarioCategoryKeys.filter((key) => requestedKeys.has(key));
};

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

const xIconActionStyle = {
  background: 'rgba(17, 24, 39, 0.92)',
  borderColor: 'rgba(17, 24, 39, 0.86)',
  color: '#ffffff',
  boxShadow: '0 12px 24px rgba(0, 0, 0, 0.22)',
};

const MAX_GALLERY_REFERENCE_IMAGES = 6;
const HOMEPAGE_EAGER_CARD_COUNT = 1;
const GALLERY_MASONRY_GAP_PX = 19.2;
const GALLERY_DESKTOP_MEDIA_QUERY = '(min-width: 980px)';
type GalleryMasonryVariant = 'mobile' | 'desktop';

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

const subscribeGalleryViewport = (onStoreChange: () => void) => {
  if (typeof window === 'undefined') return () => {};

  const query = window.matchMedia(GALLERY_DESKTOP_MEDIA_QUERY);
  query.addEventListener('change', onStoreChange);

  return () => query.removeEventListener('change', onStoreChange);
};

const getGalleryViewportSnapshot = (): GalleryMasonryVariant => {
  if (typeof window === 'undefined') return 'desktop';

  return window.matchMedia(GALLERY_DESKTOP_MEDIA_QUERY).matches
    ? 'desktop'
    : 'mobile';
};

const getGalleryViewportServerSnapshot = (): GalleryMasonryVariant => 'desktop';

const matchesCategory = (
  entry: GalleryEntry,
  categoryKey: VoguePromptCategoryKey
) => {
  if (categoryKey === 'all') return true;

  if (entry.categoryKey) return entry.categoryKey === categoryKey;

  return 'prompt' in entry && getVoguePromptCategoryKey(entry) === categoryKey;
};

const matchesSelectedTypes = (
  entry: GalleryEntry,
  selectedTypeKeys: VoguePromptConcreteCategoryKey[]
) =>
  selectedTypeKeys.length === 0 ||
  selectedTypeKeys.some((categoryKey) => matchesCategory(entry, categoryKey));

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
  const isFeaturedParam =
    params.get('featured') === '1' || modelParam === FEATURED_MODEL_FILTER_KEY;
  const categoryParam = params.get('category')?.trim();
  const typeKeys = normalizeTypeKeys([
    ...(params.get('types')?.split(',') ?? []),
    categoryParam,
  ]);
  const model = isFeaturedParam
    ? FEATURED_MODEL_FILTER_KEY
    : !lockedModelId &&
        modelParam &&
        modelParam !== 'all' &&
        (!counts || counts.models[modelParam])
      ? modelParam
      : null;

  return model || typeKeys.length ? { model, typeKeys } : null;
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
  dimensions:
    | { width: number | null; height: number | null }
    | null
    | undefined,
  targetWidth: number
) =>
  dimensions?.width && dimensions.height
    ? Math.max(1, Math.round((targetWidth * dimensions.height) / dimensions.width))
    : targetWidth;

const getGalleryEntryProjectedHeight = (entry: VoguePromptGalleryEntry) => {
  const imageAsset = entry.imageAssets?.[0] ?? null;
  const dimensions =
    imageAsset?.width && imageAsset.height ? imageAsset : entry.imageDimensions;

  return getScaledImageHeight(
    dimensions,
    GALLERY_MASONRY_ESTIMATED_COLUMN_WIDTH
  );
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
  const resolvedImageAssets =
    entry.imageAssets?.length
      ? entry.imageAssets
      : entry.images.map(createFallbackPromptImageAsset);
  const activeImageAsset =
    resolvedImageAssets[
      Math.min(activeImageIndex, Math.max(resolvedImageAssets.length - 1, 0))
    ] ??
    resolvedImageAssets[0] ??
    null;
  const activeImage =
    activeImageAsset?.originalUrl ??
    entry.images[Math.min(activeImageIndex, entry.images.length - 1)] ??
    entry.images[0] ??
    '';
  const activeImageDimensions =
    activeImageAsset?.width && activeImageAsset.height
      ? activeImageAsset
      : 'imageDimensions' in entry
        ? entry.imageDimensions
        : null;
  const cardImageWidth = 384;
  const cardImageHeight = getScaledImageHeight(
    activeImageDimensions,
    cardImageWidth
  );
  const linkableSourceUrl = getLinkablePromptSourceUrl(entry.sourceUrl);
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
        {activeImageAsset ? (
          <PromptResolvedImage
            asset={activeImageAsset}
            preferredWidth={640}
            alt={imageAltSuffix ? `${entry.title} ${imageAltSuffix}` : entry.title}
            width={cardImageWidth}
            height={cardImageHeight}
            sizes={GALLERY_CARD_IMAGE_SIZES}
            className="vogue-gallery-card-image block h-auto w-full object-cover transition duration-700"
            loading={eagerLoad ? 'eager' : 'lazy'}
            fetchPriority={eagerLoad ? 'high' : 'auto'}
            decoding="async"
            style={{
              aspectRatio: activeImageDimensions?.aspectRatio ?? undefined,
              transform: isRevealed ? 'scale(1.018)' : 'scale(1)',
            }}
          />
        ) : (
          <Image
            src={activeImage}
            alt={imageAltSuffix ? `${entry.title} ${imageAltSuffix}` : entry.title}
            width={cardImageWidth}
            height={cardImageHeight}
            sizes={GALLERY_CARD_IMAGE_SIZES}
            className="vogue-gallery-card-image block h-auto w-full object-cover transition duration-700"
            loading={eagerLoad ? 'eager' : 'lazy'}
            fetchPriority={eagerLoad ? 'high' : 'auto'}
            decoding="async"
            style={{
              aspectRatio: activeImageDimensions?.aspectRatio ?? undefined,
              transform: isRevealed ? 'scale(1.018)' : 'scale(1)',
            }}
          />
        )}
        <div
          data-card-overlay
          className="vogue-gallery-card-overlay pointer-events-none absolute inset-0 bg-gradient-to-b from-black/5 via-black/0 to-black/76 transition-opacity duration-300"
          style={{ opacity: isRevealed ? 1 : 0 }}
        />
        {resolvedImageAssets.length > 1 ? (
          <div
            className="vogue-gallery-card-thumbs absolute left-3 right-3 top-3 z-10 flex gap-1.5 overflow-x-auto transition-opacity duration-300"
            style={{ opacity: isRevealed ? 1 : 0 }}
          >
            {resolvedImageAssets.map((imageAsset, imageIndex) => {
              const thumbnailDimensions =
                imageAsset.width && imageAsset.height
                  ? imageAsset
                  : 'imageDimensions' in entry
                    ? entry.imageDimensions
                    : null;

              return (
                <button
                  key={`${entry.id}-${imageAsset.originalUrl}`}
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
                  <PromptResolvedImage
                    asset={imageAsset}
                    preferredWidth={128}
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
            {linkableSourceUrl && (
              <a
                href={linkableSourceUrl}
                target="_blank"
                rel="noreferrer"
                title={copy.gallery.openSource}
                className="ml-auto flex h-8 w-8 shrink-0 items-center justify-center rounded-[11px] border transition hover:-translate-y-0.5"
                style={xIconActionStyle}
              >
                <IconBrandX className="h-4 w-4" />
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
  const [selectedTypeKeys, setSelectedTypeKeys] = useState<
    VoguePromptConcreteCategoryKey[]
  >(() => normalizeTypeKeys([initialScenario]));
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
  const typeCategories = useMemo(
    () =>
      scenarioCategories.filter(
        (
          category
        ): category is GalleryCategory & { key: VoguePromptConcreteCategoryKey } =>
          category.key !== 'all'
      ),
    [scenarioCategories]
  );
  const selectedTypeParam = selectedTypeKeys.join(',');
  const toggleSelectedType = useCallback(
    (key: VoguePromptConcreteCategoryKey) => {
      setSelectedTypeKeys((current) =>
        current.includes(key)
          ? current.filter((selectedKey) => selectedKey !== key)
          : normalizeTypeKeys([...current, key])
      );
    },
    []
  );
  const clearSelectedTypes = useCallback(() => {
    setSelectedTypeKeys([]);
  }, []);

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

      if (initialUrlFilters.typeKeys.length) {
        setSelectedTypeKeys(initialUrlFilters.typeKeys);
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
      { key: FEATURED_MODEL_FILTER_KEY, label: copy.gallery.categories.all.label },
    ];
  }, [copy, counts, galleryEntries]);

  const modelCounts = useMemo(
    () => {
      if (counts) {
        return {
          all: counts.total,
          [FEATURED_MODEL_FILTER_KEY]: counts.featured,
          ...counts.models,
        };
      }

      return modelFilters.reduce<Record<string, number>>((nextCounts, model) => {
        nextCounts[model.key] =
          model.key === 'all'
            ? galleryEntries.length
            : model.key === FEATURED_MODEL_FILTER_KEY
              ? galleryEntries.filter(isVogueFeaturedPromptEntry).length
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
      if (
        selectedModel === FEATURED_MODEL_FILTER_KEY &&
        !isVogueFeaturedPromptEntry(entry)
      ) {
        return false;
      }

      if (
        selectedModel !== 'all' &&
        selectedModel !== FEATURED_MODEL_FILTER_KEY &&
        (entry.modelId || 'unknown') !== selectedModel
      ) {
        return false;
      }

      return matchesSelectedTypes(entry, selectedTypeKeys);
    });
  }, [galleryEntries, selectedModel, selectedTypeKeys]);
  const responsiveGalleryColumns = useMemo(
    () =>
      buildResponsiveGalleryColumns(
        filteredEntries,
        getGalleryEntryProjectedHeight,
        GALLERY_MASONRY_GAP_PX
      ),
    [filteredEntries]
  );
  const galleryMasonryVariant = useSyncExternalStore(
    subscribeGalleryViewport,
    getGalleryViewportSnapshot,
    getGalleryViewportServerSnapshot
  );
  const activeGalleryColumns =
    galleryMasonryVariant === 'desktop'
      ? responsiveGalleryColumns.desktop
      : responsiveGalleryColumns.mobile;
  const eagerCardCount = HOMEPAGE_EAGER_CARD_COUNT;
  const selectedGalleryTotal =
    selectedTypeKeys.length > 0
      ? selectedTypeKeys.reduce(
          (total, key) => total + (scenarioCounts[key] ?? 0),
          0
        ) || filteredEntries.length
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
  const selectedComposerImageSlotLimit =
    selectedComposerModel.mediaSchema?.image.max ?? 0;
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
      const nextImageSlotLimit = nextModel.mediaSchema?.image.max ?? 0;
      setReferenceUploadError(null);
      setSelectedReferences((current) => {
        const nextReferences = current.slice(0, nextImageSlotLimit);
        const keptIds = new Set(
          nextReferences.map((reference) => reference.id)
        );
        current.forEach((reference) => {
          if (!keptIds.has(reference.id)) revokeSelectedReference(reference);
        });
        return nextReferences;
      });
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
      setSelectedReferences,
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
        selectedTypeParam,
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

        if (selectedModel === FEATURED_MODEL_FILTER_KEY) {
          params.set('featured', '1');
        } else if (selectedModel !== 'all') {
          params.set('model', selectedModel);
        }
        if (selectedTypeKeys.length > 0) {
          params.set('types', selectedTypeKeys.join(','));
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
    [
      gallerySort,
      locale,
      maxEntries,
      pageSize,
      selectedModel,
      selectedTypeKeys,
      selectedTypeParam,
    ]
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

  const closeComposer = () => {
    setComposerOpen(false);
    setReferenceUploadError(null);
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
      const availableSlots =
        Math.min(MAX_GALLERY_REFERENCE_IMAGES, selectedComposerImageSlotLimit) -
        current.length;

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
    const assetIndex =
      entry.imageAssets?.findIndex((asset) => asset.originalUrl === imageUrl) ??
      -1;
    const imageIndex =
      assetIndex >= 0 ? assetIndex : entry.images.indexOf(imageUrl);
    const referenceImageUrl =
      fullEntry.images[Math.max(0, imageIndex)] ??
      fullEntry.images[0] ??
      imageUrl;
    setSelectedReferences((current) => {
      const referenceLimit = Math.min(
        MAX_GALLERY_REFERENCE_IMAGES,
        selectedComposerImageSlotLimit
      );
      if (referenceLimit <= 0) {
        setReferenceUploadError(copy.app.errors.noReferenceSlots);
        return current;
      }
      const id = `${entry.id}:${referenceImageUrl}`;
      const nextReference: SelectedReference = {
        source: 'remote',
        id,
        entryId: entry.id,
        imageUrl: referenceImageUrl,
        title: entry.title,
      };
      const deduped = current.filter((reference) => reference.id !== id);
      const nextReferences = [...deduped, nextReference].slice(-referenceLimit);
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
  const renderGalleryMasonry = (
    columns: typeof responsiveGalleryColumns.mobile,
    variant: 'mobile' | 'desktop'
  ) => (
    <div
      className={`vogue-gallery-masonry vogue-gallery-masonry--${variant}`}
      style={
        {
          '--vogue-gallery-column-count': columns.length,
        } as CSSProperties
      }
    >
      {columns.map((column, columnIndex) => (
        <div
          key={`prompt-library-${variant}-column-${columnIndex}`}
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
              denseActions={false}
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
  );

  return (
    <section
      className="vogue-gallery-surface"
      aria-labelledby="vogue-prompt-gallery-heading"
      style={surfaceStyle}
    >
      <div
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
                    key === 'all' || key === FEATURED_MODEL_FILTER_KEY
                      ? null
                      : getModelIconPathByModelId(key)
                  }
                />
              </div>
            ) : null}
            <div className="min-w-0 lg:ml-auto lg:flex-none">
              <TypeFilterPopover
                copy={copy}
                options={typeCategories}
                selectedKeys={selectedTypeKeys}
                counts={scenarioCounts}
                onToggle={toggleSelectedType}
                onClear={clearSelectedTypes}
                promptCountLabel={copy.gallery.promptCountAria}
              />
            </div>
          </div>

          <div
            id="prompt-library-grid"
            className="vogue-gallery-masonry-layouts"
            aria-label={copy.gallery.gridAria}
          >
            {renderGalleryMasonry(activeGalleryColumns, galleryMasonryVariant)}
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
          <div className="relative mx-auto w-full max-w-4xl space-y-2">
            <button
              aria-label={copy.gallery.closeComposer}
              className="absolute right-2 top-2 z-30 flex h-7 w-7 items-center justify-center rounded-full border border-slate-950/8 bg-white/42 text-slate-500 opacity-55 shadow-[0_8px_18px_rgba(72,55,44,0.08)] backdrop-blur-md transition hover:bg-white/86 hover:text-slate-950 hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950/18"
              onClick={closeComposer}
              title={copy.gallery.closeComposer}
              type="button"
            >
              <X className="h-3.5 w-3.5" />
            </button>
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
              maxReferenceImages={selectedComposerImageSlotLimit}
              addReferenceLabel={copy.gallery.useAsRefShort}
              onAddReference={
                selectedComposerImageSlotLimit > 0
                  ? () => galleryFileInputRef.current?.click()
                  : undefined
              }
              onRemoveReference={(id) =>
                setSelectedReferences((current) => {
                  const nextReferences = current.filter((reference) => {
                    if (reference.id !== id) return true;
                    revokeSelectedReference(reference);
                    return false;
                  });
                  if (nextReferences.length < selectedComposerImageSlotLimit) {
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

function TypeFilterPopover({
  copy,
  options,
  selectedKeys,
  counts,
  onToggle,
  onClear,
  promptCountLabel,
}: {
  copy: VogueUICopy;
  options: Array<GalleryCategory & { key: VoguePromptConcreteCategoryKey }>;
  selectedKeys: VoguePromptConcreteCategoryKey[];
  counts: Record<string, number>;
  onToggle: (key: VoguePromptConcreteCategoryKey) => void;
  onClear: () => void;
  promptCountLabel: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const selectedKeySet = useMemo(() => new Set(selectedKeys), [selectedKeys]);
  const typeFilterLabel = copy.gallery.useFilter;
  const allTypesLabel = copy.gallery.modelAll;
  const summaryLabel =
    selectedKeys.length > 0
      ? `${typeFilterLabel} · ${selectedKeys.length}`
      : typeFilterLabel;
  const typeFilterOptions = useMemo<
    Array<
      | { key: 'all'; label: string }
      | (GalleryCategory & { key: VoguePromptConcreteCategoryKey })
    >
  >(
    () => [{ key: 'all' as const, label: allTypesLabel }, ...options],
    [allTypesLabel, options]
  );

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!rootRef.current?.contains(target)) setIsOpen(false);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('pointerdown', handlePointerDown, true);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown, true);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div ref={rootRef} className="relative flex justify-end">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label={summaryLabel}
        onClick={() => setIsOpen((current) => !current)}
        className="vogue-type-filter-trigger group inline-flex h-8 items-center justify-center gap-1.5 rounded-full border border-[rgba(118,92,70,0.14)] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(248,246,242,0.86))] px-2.5 py-1 text-[13px] font-semibold leading-none text-slate-700 shadow-[0_10px_26px_rgba(72,55,44,0.08)] transition duration-200 hover:-translate-y-0.5 hover:border-[rgba(97,91,255,0.18)] hover:text-slate-950 hover:shadow-[0_16px_34px_rgba(72,55,44,0.12)]"
      >
        <span
          aria-hidden="true"
          className="vogue-type-filter-icon inline-flex h-4 w-4 items-center justify-center text-[#4f46e5]"
        >
          <SlidersHorizontal className="h-4 w-4" />
        </span>
        <span>{typeFilterLabel}</span>
        {selectedKeys.length > 0 ? (
          <span className="vogue-type-count-badge inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[rgba(97,91,255,0.12)] px-1.5 text-[11px] font-bold text-[#4f46e5] ring-1 ring-[rgba(97,91,255,0.14)]">
            {selectedKeys.length}
          </span>
        ) : null}
        <ChevronDown
          className={`h-3.5 w-3.5 text-slate-400 transition group-hover:text-slate-700 ${
            isOpen ? 'rotate-180' : ''
          }`}
          aria-hidden="true"
        />
      </button>

      {isOpen ? (
        <div
          role="menu"
          aria-label={typeFilterLabel}
          className="vogue-type-filter-popover absolute right-0 top-full z-30 mt-2 w-[324px] max-w-[calc(100vw-2rem)] rounded-[20px] border border-[rgba(118,92,70,0.14)] bg-[rgba(255,255,255,0.96)] p-2.5 shadow-[0_26px_76px_rgba(72,55,44,0.16)] backdrop-blur-xl"
        >
          <div className="vogue-type-filter-popover-header mb-2 flex items-center justify-between gap-3 px-1.5 pt-1">
            <div className="flex items-center gap-2">
              <span
                aria-hidden="true"
                className="inline-flex h-5 w-5 items-center justify-center text-[#4f46e5]"
              >
                <SlidersHorizontal className="h-4 w-4" />
              </span>
              <span className="text-[13px] font-bold leading-none text-slate-950">
                {typeFilterLabel}
              </span>
            </div>
            {selectedKeys.length > 0 ? (
              <span className="rounded-full bg-[rgba(97,91,255,0.1)] px-2 py-1 text-[11px] font-bold leading-none text-[#4f46e5]">
                {selectedKeys.length}
              </span>
            ) : null}
          </div>
          <div className="vogue-type-option-grid mt-2 grid grid-cols-2 gap-1.5">
            {typeFilterOptions.map((option) => {
              const isAllOption = option.key === 'all';
              const isSelected = isAllOption ? selectedKeys.length === 0 : selectedKeySet.has(option.key);
              return (
                <button
                  key={option.key}
                  type="button"
                  role="menuitemcheckbox"
                  aria-checked={isSelected}
                  onClick={() => (isAllOption ? onClear() : onToggle(option.key))}
                  aria-label={
                    isAllOption
                      ? option.label
                      : `${option.label} ${counts[option.key] ?? 0} ${promptCountLabel}`
                  }
                  className={`flex min-h-9 items-center justify-between gap-2 rounded-[13px] px-2.5 py-2 text-left text-[13px] font-medium transition ${
                    isSelected
                      ? 'bg-[rgba(97,91,255,0.075)] text-slate-950'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-950'
                  }`}
                >
                  <span className="min-w-0 truncate">{option.label}</span>
                  {isSelected ? <Check className="h-3.5 w-3.5 shrink-0" /> : null}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
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
          isModelVariant ? 'gap-0.5' : 'gap-1.5'
        } ${
          tone === 'warm' ? 'lg:justify-end' : ''
        }`}
      >
        {options.map((option) => {
          const isActive = selectedKey === option.key;
          const iconSrc = getIconSrc?.(option.key);
          const isFeaturedFilter = option.key === FEATURED_MODEL_FILTER_KEY;

          return (
            <button
              key={option.key}
              type="button"
              onClick={() => onSelect(option.key)}
              aria-label={`${option.label} ${counts[option.key] ?? 0} ${promptCountLabel}`}
              className={`vogue-filter-chip relative flex min-w-max items-center justify-center gap-1.5 rounded-[12px] border text-left text-[13px] font-medium leading-none tracking-normal transition duration-200 ${
                isModelVariant
                  ? 'h-8 px-2.5 sm:h-8 sm:px-3'
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
              {isFeaturedFilter ? (
                <span
                  aria-hidden="true"
                  className="relative z-10 inline-flex h-5 w-5 shrink-0 items-center justify-center text-slate-950"
                >
                  <Gem className="h-4 w-4 shrink-0" />
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
