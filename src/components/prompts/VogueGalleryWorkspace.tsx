'use client';

import {
  getVogueCopyFromMessages,
  normalizeVogueLocale,
  type VogueLocale,
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
} from '@/lib/effects/validation';
import { writeVogueAppTransferPayload } from '@/lib/app/composer-transfer';
import { getModelIconPathByModelId } from '@/lib/model-icons';
import { getVogueWorkspaceModelDescription } from '@/lib/vogue-model-copy';
import { IconBrandX } from '@tabler/icons-react';
import { Copy, Download, ExternalLink, Layers, Sparkles, X } from 'lucide-react';
import Image from 'next/image';
import { useLocale, useMessages } from 'next-intl';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

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

type SelectedReference = {
  id: string;
  entryId: string;
  imageUrl: string;
  title: string;
};

type SelectedDetail = {
  entry: VoguePromptEntry;
  imageIndex: number;
} | null;

type PromptDisplayMode = 'current' | 'original';

const promptVersionLabels: Record<
  VogueLocale,
  Record<PromptDisplayMode, string>
> = {
  en: {
    current: 'Current',
    original: 'Original',
  },
  zh: {
    current: '当前语言',
    original: '原始提示词',
  },
  fr: {
    current: 'Langue actuelle',
    original: 'Prompt original',
  },
  ru: {
    current: 'Текущий язык',
    original: 'Исходный промпт',
  },
  pt: {
    current: 'Idioma atual',
    original: 'Prompt original',
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

const getPromptVersionLabels = (locale?: string | null) =>
  promptVersionLabels[normalizeVogueLocale(locale)];

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

const detailPrimaryActionStyle = {
  background: '#111827',
  borderColor: '#111827',
  color: '#ffffff',
  boxShadow: '0 16px 34px rgba(15, 23, 42, 0.18)',
};

const detailSecondaryActionStyle = {
  background: '#ffffff',
  borderColor: 'rgba(203, 213, 225, 0.72)',
  color: '#111827',
  boxShadow: '0 12px 26px rgba(72, 92, 130, 0.1)',
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
const HOMEPAGE_EAGER_CARD_COUNT = 2;

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

const getEntryCategoryLabel = (entry: GalleryEntry, copy: VogueUICopy) =>
  getScenarioCategories(copy).find(
    (category) => category.key !== 'all' && matchesCategory(entry, category.key)
  )?.label ?? copy.gallery.categories.all.label;

const renderPromptText = (prompt: string) =>
  prompt.split(/(\[[^\]\n]{2,80}\])/g).map((part, index) => {
    if (/^\[[^\]\n]{2,80}\]$/.test(part)) {
      return (
        <span
          key={`${part}-${index}`}
          className="mx-0.5 inline-flex rounded-[6px] bg-[#eaf3ff] px-1.5 py-0.5 font-medium text-slate-800 ring-1 ring-[#d4e6ff]/80"
        >
          {part}
        </span>
      );
    }

    return <span key={`${index}-${part.slice(0, 12)}`}>{part}</span>;
  });

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

const getGalleryThumbnailSrc = (entryId: string, imageIndex: number) =>
  `/api/gpt-image-2-prompts/thumbnail?id=${encodeURIComponent(
    entryId
  )}&index=${imageIndex}`;

const getScaledImageHeight = (
  dimensions: { width: number; height: number } | null | undefined,
  targetWidth: number
) =>
  dimensions?.width && dimensions.height
    ? Math.max(1, Math.round((targetWidth * dimensions.height) / dimensions.width))
    : targetWidth;

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
  denseActions,
  eagerLoad,
  isLoading,
  copy,
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
  denseActions: boolean;
  eagerLoad: boolean;
  isLoading?: boolean;
  copy: VogueUICopy;
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
    <article style={{ breakInside: 'avoid', marginBottom: '1.2rem' }}>
      <div
        className={`relative overflow-hidden border bg-white transition duration-300 ${
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
        <Image
          src={getGalleryThumbnailSrc(entry.id, activeImageIndex)}
          alt={entry.title}
          width={cardImageWidth}
          height={cardImageHeight}
          unoptimized
          className="block h-auto w-full object-cover transition duration-700"
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
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/5 via-black/0 to-black/76 transition-opacity duration-300"
          style={{ opacity: isRevealed ? 1 : 0 }}
        />
        {entry.images.length > 1 ? (
          <div
            className="absolute left-3 right-3 top-3 z-10 flex gap-1.5 overflow-x-auto transition-opacity duration-300"
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
                    src={getGalleryThumbnailSrc(entry.id, imageIndex)}
                    alt={`${entry.title} ${imageIndex + 1}`}
                    width={64}
                    height={getScaledImageHeight(thumbnailDimensions, 64)}
                    unoptimized
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
          className="absolute inset-x-0 bottom-0 z-10 p-3.5 transition-all duration-300"
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
  heading,
  description,
  initialModel = 'all',
  initialScenario = 'all',
}: {
  entries: VoguePromptGalleryEntry[];
  counts?: GalleryCounts;
  pageSize?: number;
  heading: string;
  description: string;
  initialModel?: string;
  initialScenario?: VoguePromptCategoryKey;
}) {
  const locale = useLocale();
  const messages = useMessages();
  const copy = getVogueCopyFromMessages(messages);
  const [galleryEntries, setGalleryEntries] =
    useState<VoguePromptGalleryEntry[]>(() => dedupeGalleryEntries(entries));
  const [nextOffset, setNextOffset] = useState(entries.length);
  const [hasMoreEntries, setHasMoreEntries] =
    useState(entries.length >= pageSize);
  const [isLoadingEntries, setIsLoadingEntries] = useState(false);
  const [selectedModel, setSelectedModel] = useState(initialModel);
  const [selectedScenario, setSelectedScenario] =
    useState<VoguePromptCategoryKey>(initialScenario);
  const [columnCount, setColumnCount] = useState(1);
  const [prompt, setPrompt] = useState('');
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
  const [selectedDetail, setSelectedDetail] = useState<SelectedDetail>(null);
  const [loadingDetailId, setLoadingDetailId] = useState<string | null>(null);
  const [isCompactViewport, setIsCompactViewport] = useState(false);
  const galleryFrameRef = useRef<HTMLDivElement | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const didMountRef = useRef(false);
  const inFlightGalleryPageKeysRef = useRef<Set<string>>(new Set());
  const fullEntryCacheRef = useRef<Map<string, VoguePromptEntry>>(new Map());
  const composerModels = useMemo(() => getComposerModels(copy), [copy]);
  const scenarioCategories = useMemo(
    () => getScenarioCategories(copy),
    [copy]
  );

  useEffect(() => {
    const updateCompactViewport = () => {
      setIsCompactViewport(window.innerWidth <= 640);
    };

    updateCompactViewport();
    window.addEventListener('resize', updateCompactViewport);
    return () => window.removeEventListener('resize', updateCompactViewport);
  }, []);

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
        setColumnCount(1);
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

  const selectedComposerModel = useMemo(
    () => getModelById(selectedProviderId),
    [selectedProviderId]
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
      const requestKey = [
        locale,
        selectedModel,
        selectedScenario,
        pageSize,
        offset,
      ].join(':');

      if (inFlightGalleryPageKeysRef.current.has(requestKey)) return;

      inFlightGalleryPageKeysRef.current.add(requestKey);
      setIsLoadingEntries(true);
      try {
        const params = new URLSearchParams({
          mode: 'gallery',
          locale,
          limit: String(pageSize),
          offset: String(offset),
        });

        if (selectedModel !== 'all') params.set('model', selectedModel);
        if (selectedScenario !== 'all') {
          params.set('category', selectedScenario);
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

        setGalleryEntries((current) =>
          replace
            ? dedupeGalleryEntries(nextEntries)
            : mergeUniqueGalleryEntries(current, nextEntries)
        );
        setNextOffset(offset + nextEntries.length);
        setHasMoreEntries(Boolean(payload.hasMore));
      } finally {
        inFlightGalleryPageKeysRef.current.delete(requestKey);
        setIsLoadingEntries(false);
      }
    },
    [locale, pageSize, selectedModel, selectedScenario]
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

  const isPromptDetailOpen = Boolean(selectedDetail);

  useEffect(() => {
    if (!isPromptDetailOpen) {
      delete document.body.dataset.voguePromptDetailOpen;
      return;
    }

    document.body.dataset.voguePromptDetailOpen = 'true';

    return () => {
      delete document.body.dataset.voguePromptDetailOpen;
    };
  }, [isPromptDetailOpen]);

  const selectedReferenceItems = selectedReferences.map((reference) => ({
    id: reference.id,
    url: reference.imageUrl,
    name: reference.title,
  }));
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
    writeVogueAppTransferPayload({
      source: 'gallery',
      createdAt: Date.now(),
      model: selectedComposerModel.id,
      prompt,
      aspectRatio,
      outputQuality,
      quality,
      generationCount,
      referenceImages: selectedReferences.map((reference) => reference.imageUrl),
    });
  }, [
    aspectRatio,
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
    setPrompt(truncatePromptToMaxChars(nextPrompt, nextPromptMaxChars));
    applySelectedProvider(nextModelId);
    openComposer();
  };

  const applyGalleryReference = async (
    entry: GalleryEntry,
    imageUrl: string,
    promptText?: string
  ) => {
    const fullEntry = promptText
      ? (entry as VoguePromptEntry)
      : await fetchFullPromptEntry(entry);
    const nextPrompt = promptText ?? fullEntry.prompt;
    const imageIndex = entry.images.indexOf(imageUrl);
    const referenceImageUrl =
      fullEntry.images[Math.max(0, imageIndex)] ??
      fullEntry.images[0] ??
      imageUrl;
    const nextModelId = getComposerModelId(entry.modelId);
    const nextPromptMaxChars = getGenerationPromptMaxChars({
      modelId: nextModelId,
    });
    setPrompt(truncatePromptToMaxChars(nextPrompt, nextPromptMaxChars));
    setSelectedReferences((current) => {
      const id = `${entry.id}:${referenceImageUrl}`;
      const nextReference = {
        id,
        entryId: entry.id,
        imageUrl: referenceImageUrl,
        title: entry.title,
      };
      const deduped = current.filter((reference) => reference.id !== id);
      return [...deduped, nextReference].slice(-MAX_GALLERY_REFERENCE_IMAGES);
    });
    applySelectedProvider(nextModelId);
    openComposer();
  };

  return (
    <section
      className="vogue-gallery-surface"
      aria-labelledby="vogue-prompt-gallery-heading"
    >
      <div
        ref={galleryFrameRef}
        className={`mx-auto max-w-[1740px] px-3 pt-3 sm:px-5 sm:pt-5 lg:px-5 lg:pt-5 ${
          composerOpen ? 'pb-40 sm:pb-44 lg:pb-48' : 'pb-8 sm:pb-10 lg:pb-12'
        }`}
      >
        <h1 id="vogue-prompt-gallery-heading" className="sr-only">
          {heading}
        </h1>
        <p className="sr-only">{description}</p>

        <div className="rounded-[28px] border border-white/82 bg-white/66 p-3 shadow-[0_24px_70px_rgba(72,55,44,0.1)] ring-1 ring-[rgba(72,55,44,0.07)] backdrop-blur-xl sm:p-4 lg:rounded-[32px] lg:p-5">
          <div
            aria-label={copy.gallery.filtersAria}
            className="vogue-filter-strip mb-5 flex flex-col gap-2 px-1 lg:flex-row lg:items-center lg:justify-between"
          >
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
            className="vogue-gallery-columns"
            aria-label={copy.gallery.gridAria}
          >
            {filteredEntries.map((entry, index) => (
              <PromptCard
                key={entry.id}
                entry={entry}
                onUsePrompt={applyGalleryPrompt}
                onUseAsReference={applyGalleryReference}
                denseActions={columnCount >= 4}
                eagerLoad={index < HOMEPAGE_EAGER_CARD_COUNT}
                isLoading={loadingDetailId === entry.id}
                copy={copy}
                onOpenDetails={async (detailEntry, imageIndex) => {
                  try {
                    const fullEntry = await fetchFullPromptEntry(detailEntry);
                    const normalizedImageIndex = Math.max(
                      0,
                      Math.min(imageIndex, fullEntry.images.length - 1)
                    );

                    setSelectedDetail({
                      entry: fullEntry,
                      imageIndex: normalizedImageIndex,
                    });
                  } catch (error) {
                    console.error(error);
                  }
                }}
              />
            ))}
          </div>
          {hasMoreEntries ? (
            <div ref={loadMoreRef} aria-hidden="true" className="h-10" />
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
      {composerOpen ? (
        <div style={composerShellStyle}>
          <div className="mx-auto w-full max-w-4xl">
            <VoguePromptComposer
              variant="gallery"
              prompt={prompt}
              onPromptChange={(value) =>
                setPrompt(truncatePromptToMaxChars(value, promptMaxChars))
              }
              promptCharacterCount={promptCharacterCount}
              promptMaxChars={promptMaxChars}
              placeholder={copy.gallery.composerPlaceholder}
              models={composerModels}
              selectedModelId={selectedProviderId}
              onSelectedModelIdChange={applySelectedProvider}
              referenceItems={selectedReferenceItems}
              maxReferenceImages={MAX_GALLERY_REFERENCE_IMAGES}
              addReferenceLabel={copy.gallery.useAsRefShort}
              onAddReference={() =>
                document
                  .getElementById('prompt-library-grid')
                  ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }
              onRemoveReference={(id) =>
                setSelectedReferences((current) =>
                  current.filter((reference) => reference.id !== id)
                )
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
      {selectedDetail ? (
        <PromptDetailDialog
          key={selectedDetail.entry.id}
          entry={selectedDetail.entry}
          activeImageIndex={selectedDetail.imageIndex}
          copy={copy}
          onActiveImageChange={(imageIndex) =>
            setSelectedDetail((current) =>
              current ? { ...current, imageIndex } : current
            )
          }
          onClose={() => setSelectedDetail(null)}
          onUsePrompt={(promptText) => {
            applyGalleryPrompt(selectedDetail.entry, promptText);
            setSelectedDetail(null);
          }}
          onUseAsReference={(promptText) => {
            const imageUrl =
              selectedDetail.entry.images[selectedDetail.imageIndex] ??
              selectedDetail.entry.images[0] ??
              '';
            applyGalleryReference(selectedDetail.entry, imageUrl, promptText);
            setSelectedDetail(null);
          }}
        />
      ) : null}
    </section>
  );
}

function PromptDetailDialog({
  entry,
  activeImageIndex,
  copy,
  onActiveImageChange,
  onClose,
  onUsePrompt,
  onUseAsReference,
}: {
  entry: VoguePromptEntry;
  activeImageIndex: number;
  copy: VogueUICopy;
  onActiveImageChange: (imageIndex: number) => void;
  onClose: () => void;
  onUsePrompt: (promptText: string) => void;
  onUseAsReference: (promptText: string) => void;
}) {
  const locale = useLocale();
  const [promptDisplayMode, setPromptDisplayMode] =
    useState<PromptDisplayMode>('current');
  const activeImage = entry.images[activeImageIndex] ?? entry.images[0] ?? '';
  const activeImageDimensions = getVoguePromptImageDimensions(activeImage);
  const isXSource = isXSourceUrl(entry.sourceUrl);
  const versionLabels = getPromptVersionLabels(locale);
  const originalPrompt = entry.originalPrompt?.trim()
    ? entry.originalPrompt
    : entry.prompt;
  const hasPromptVariants = originalPrompt.trim() !== entry.prompt.trim();
  const visiblePrompt =
    promptDisplayMode === 'original' && hasPromptVariants
      ? originalPrompt
      : entry.prompt;
  const backdropStyle = activeImage
    ? { backgroundImage: `url("${activeImage}")` }
    : undefined;
  const copyVisiblePrompt = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(visiblePrompt);
        return;
      }
    } catch {
      // Fall through to the selection-based copy path below.
    }

    const textarea = document.createElement('textarea');
    textarea.value = visiblePrompt;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    textarea.remove();
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={entry.title}
      className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-100/82 p-4 backdrop-blur-xl"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 70,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        background: 'rgba(239, 245, 255, 0.82)',
        backdropFilter: 'blur(18px)',
      }}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        className="relative grid overflow-hidden rounded-[24px] border border-slate-200 bg-white text-slate-900 shadow-[0_40px_140px_rgba(72,92,130,0.26)]"
        style={{
          height: 'min(900px, calc(100vh - 2rem))',
          width: 'min(1680px, calc(100vw - 2rem))',
          gridTemplateColumns:
            typeof window !== 'undefined' && window.innerWidth >= 1280
              ? 'minmax(0, 1.12fr) 460px'
              : '1fr',
        }}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 z-30 inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white/90 text-slate-800 shadow-[0_12px_34px_rgba(72,92,130,0.16)] backdrop-blur transition hover:bg-slate-950 hover:text-white"
        >
          <X className="h-5 w-5" />
          <span className="sr-only">{copy.common.close}</span>
        </button>

        <div className="relative min-h-0 min-w-0 overflow-hidden bg-[#eef5ff]">
          {backdropStyle ? (
            <div
              className="pointer-events-none absolute inset-0 scale-110 bg-cover bg-center opacity-50 blur-[120px]"
              style={backdropStyle}
            />
          ) : null}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_12%,rgba(255,255,255,0.72),transparent_38%),linear-gradient(90deg,rgba(238,245,255,0.96)_0%,rgba(238,245,255,0.26)_22%,rgba(238,245,255,0.26)_78%,rgba(238,245,255,0.96)_100%)]" />
          <div className="absolute right-16 top-4 z-20 flex items-center gap-2">
            {activeImage ? (
              <a
                href={activeImage}
                download
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white/86 text-slate-700 shadow-[0_10px_24px_rgba(72,92,130,0.12)] backdrop-blur transition hover:bg-slate-950 hover:text-white"
                title={copy.gallery.downloadImage}
              >
                <Download className="h-4 w-4" />
              </a>
            ) : null}
            <div className="inline-flex h-10 min-w-10 items-center justify-center rounded-full border border-slate-200 bg-white/86 px-3 text-sm font-bold text-slate-800 shadow-[0_10px_24px_rgba(72,92,130,0.12)] backdrop-blur">
              {activeImageIndex + 1}/{entry.images.length}
            </div>
          </div>

          <div className="relative flex h-full items-center justify-center px-6 py-6 sm:px-8 lg:px-12">
            {activeImage ? (
              <Image
                src={activeImage}
                alt={entry.title}
                width={activeImageDimensions?.width ?? 1200}
                height={activeImageDimensions?.height ?? 1600}
                unoptimized
                className="max-h-full max-w-full object-contain"
                priority
                style={{
                  aspectRatio: activeImageDimensions?.aspectRatio,
                }}
              />
            ) : (
              <div className="aspect-[4/5] w-full max-w-[760px] rounded-[20px] border border-slate-200 bg-white/70" />
            )}
          </div>

          {entry.images.length > 1 ? (
            <div className="absolute inset-x-4 bottom-4 z-20 flex justify-center gap-2 overflow-x-auto sm:inset-x-auto sm:bottom-auto sm:right-5 sm:top-1/2 sm:max-h-[calc(100vh-160px)] sm:-translate-y-1/2 sm:flex-col">
              {entry.images.map((imageUrl, imageIndex) => (
                <button
                  key={`${entry.id}-detail-${imageUrl}`}
                  type="button"
                  onClick={() => onActiveImageChange(imageIndex)}
                  className={`h-[58px] w-[58px] shrink-0 overflow-hidden rounded-[14px] border transition ${
                    imageIndex === activeImageIndex
                      ? 'border-slate-950'
                      : 'border-transparent hover:border-slate-400/70'
                  }`}
                >
                  <Image
                    src={imageUrl}
                    alt={`${entry.title} ${imageIndex + 1}`}
                    width={getVoguePromptImageDimensions(imageUrl)?.width ?? 96}
                    height={getVoguePromptImageDimensions(imageUrl)?.height ?? 96}
                    unoptimized
                    className="h-full w-full rounded-[13px] object-cover"
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <aside className="flex min-h-0 flex-col border-t border-slate-200 bg-white/98 xl:border-l xl:border-t-0">
          <div className="shrink-0 space-y-3 border-b border-slate-200 px-6 pb-4 pr-16 pt-6">
            <h2 className="text-[1.34rem] font-semibold leading-tight text-slate-950">
              {entry.title}
            </h2>
            <div className="flex items-center gap-2 text-[13px] font-medium text-slate-500">
              <span>{copy.gallery.by}</span>
              <span className="truncate text-slate-800">
                {entry.authorName || entry.authorHandle || '@VogueAI'}
              </span>
              {entry.publishedLabel ? (
                <>
                  <span className="text-slate-300">·</span>
                  <span className="shrink-0">{entry.publishedLabel}</span>
                </>
              ) : null}
            </div>
          </div>

          <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-hidden px-6 pb-7 pt-5">
            <div className="min-h-[220px] flex-1 overflow-y-auto rounded-[18px] bg-[linear-gradient(180deg,#fbfdff,#f4f9ff)] px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.92),0_12px_30px_rgba(72,92,130,0.06)] ring-1 ring-[#dbe8ff]/55">
              <div className="mb-3 flex items-center justify-between gap-3">
                <p className="text-[11px] font-medium text-slate-500">
                  {copy.gallery.prompt}
                </p>
                <div className="flex shrink-0 items-center gap-2">
                  {hasPromptVariants ? (
                    <div className="inline-flex rounded-[10px] border border-slate-200 bg-white/86 p-0.5 shadow-[0_8px_18px_rgba(72,92,130,0.06)]">
                      {(['current', 'original'] as const).map((mode) => {
                        const isActive = promptDisplayMode === mode;

                        return (
                          <button
                            key={mode}
                            type="button"
                            onClick={() => setPromptDisplayMode(mode)}
                            className={`h-7 rounded-[8px] px-2.5 text-[11px] font-semibold transition ${
                              isActive
                                ? 'bg-slate-950 text-white shadow-[0_8px_18px_rgba(15,23,42,0.14)]'
                                : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                            }`}
                          >
                            {versionLabels[mode]}
                          </button>
                        );
                      })}
                    </div>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => void copyVisiblePrompt()}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-[10px] border border-slate-200 bg-white/88 text-slate-700 shadow-[0_8px_18px_rgba(72,92,130,0.06)] transition hover:bg-slate-950 hover:text-white"
                    title={copy.gallery.copyPrompt}
                  >
                    <Copy className="h-3.5 w-3.5" />
                    <span className="sr-only">{copy.gallery.copyPrompt}</span>
                  </button>
                </div>
              </div>
              <p className="whitespace-pre-wrap text-[0.93rem] leading-[1.64] text-slate-700">
                {renderPromptText(visiblePrompt)}
              </p>
            </div>

            <div className="shrink-0 rounded-[16px] bg-white px-4 py-1.5 shadow-[0_10px_24px_rgba(72,92,130,0.06)] ring-1 ring-slate-200/70">
              <InfoRow
                label={copy.gallery.model}
                value={modelLabel(entry.modelId, copy)}
              />
              <InfoRow
                label={copy.gallery.useCase}
                value={getEntryCategoryLabel(entry, copy)}
              />
              {activeImageDimensions ? (
                <InfoRow
                  label={copy.gallery.image}
                  value={`${activeImageDimensions.width} x ${activeImageDimensions.height}`}
                />
              ) : null}
              <div className="flex items-center justify-between gap-6 py-2.5">
                <span className="text-[13px] text-slate-500">
                  {copy.gallery.source}
                </span>
                {entry.sourceUrl ? (
                  <a
                    href={entry.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={isXSource ? 'X' : copy.gallery.openSource}
                    title={isXSource ? 'X' : copy.gallery.openSource}
                    className="inline-flex min-w-0 items-center gap-1.5 text-[13px] font-semibold text-slate-800 transition hover:text-slate-950"
                  >
                    {!isXSource ? copy.gallery.open : null}
                    {isXSource ? (
                      <IconBrandX className="h-3 w-3" />
                    ) : (
                      <ExternalLink className="h-3 w-3" />
                    )}
                  </a>
                ) : (
                  <span className="text-[13px] text-slate-500">
                    {copy.gallery.unknown}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="shrink-0 border-t border-slate-200 bg-[linear-gradient(180deg,rgba(248,251,255,0.9),rgba(255,255,255,1))] px-6 pb-6 pt-7">
            <div className="grid grid-cols-2 items-center gap-4">
              <button
                type="button"
                onClick={() => onUsePrompt(visiblePrompt)}
                className="vogue-detail-primary-action inline-flex h-11 items-center justify-center gap-2 rounded-[14px] border px-3 text-sm font-semibold transition hover:-translate-y-0.5 hover:bg-slate-800"
                style={detailPrimaryActionStyle}
              >
                <Sparkles className="h-4 w-4" />
                {copy.gallery.usePrompt}
              </button>
              <button
                type="button"
                onClick={() => onUseAsReference(visiblePrompt)}
                className="vogue-detail-secondary-action inline-flex h-11 items-center justify-center gap-2 rounded-[14px] border px-3 text-sm font-semibold transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-[#f7fbff]"
                style={detailSecondaryActionStyle}
              >
                <Layers className="h-4 w-4" />
                {copy.gallery.useAsRefShort}
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-6 border-b border-slate-100 py-2.5 last:border-b-0">
      <span className="text-[13px] text-slate-500">{label}</span>
      <span className="min-w-0 truncate text-right text-[13px] text-slate-800">
        {value}
      </span>
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
