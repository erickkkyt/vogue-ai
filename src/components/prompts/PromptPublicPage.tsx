'use client';

import { IconBrandX } from '@tabler/icons-react';
import {
  ArrowLeft,
  Check,
  ChevronDown,
  ChevronRight,
  Copy,
  Download,
  Image as ImageIcon,
  ImagePlus,
  Sparkles,
  X,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from 'react';

import type {
  VoguePromptEntry,
  VogueRelatedPromptEntry,
} from '@/lib/prompts';
import PromptResolvedImage, {
  getPromptImageAssetSrc,
} from '@/components/prompts/PromptResolvedImage';
import {
  createFallbackPromptImageAsset,
  isPromptImageVariantSrc,
  type VoguePromptImageAsset,
} from '@/lib/prompt-image-types';
import { getPromptDetailInsights } from '@/lib/prompt-detail-insights';
import { getPromptPagePath } from '@/lib/prompt-page-routes';
import { getUrlWithLocale } from '@/lib/urls/urls';
import { writeVogueAppTransferPayload } from '@/lib/app/composer-transfer';
import type { VogueLocale } from '@/i18n/vogue';
import { getModelById } from '@/lib/effects/workspace-models';
import { getModelIconPathByModelId } from '@/lib/model-icons';
import {
  applyPromptRemixValues,
  buildPromptRemixSegments,
  formatPromptForRemixDisplay,
  getInitialPromptRemixValues,
  getPromptRemixSchema,
  type PromptRemixSegment,
  type PromptRemixValues,
} from '@/lib/prompt-remix';
import { buildPromptDisplaySections } from '@/lib/prompt-display-sections';
import {
  getPromptTransformExampleConfig,
  type PromptTransformExample,
} from '@/lib/prompt-transform-examples';
import { getLinkablePromptSourceUrl } from '@/lib/prompt-source-links';

type PromptLanguageMode = 'original' | VogueLocale;

type PromptImageDisplayDimensions = {
  width: number;
  height: number;
  aspectRatio: string;
};

const MODEL_LABELS: Record<string, string> = {
  gptimage15: 'GPT Image',
  gptimage2: 'GPT Image',
  nanobanana: 'Nano Banana',
  nanobanana2: 'Nano Banana',
  nanobananapro: 'Nano Banana',
  midjourney: 'Midjourney',
};

const MODEL_PROMPT_HUB_HREFS: Record<string, string> = {
  gptimage15: '/gpt-image-prompt',
  gptimage2: '/gpt-image-prompt',
  nanobanana: '/nano-banana-prompt',
  nanobanana2: '/nano-banana-prompt',
  nanobananapro: '/nano-banana-prompt',
  midjourney: '/midjourney-prompt',
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
  art: 'Art',
};

const promptLanguageLabels: Record<string, string> = {
  original: 'Original',
  en: 'English',
  zh: '中文',
  ja: '日本語',
  ko: '한국어',
  fr: 'Français',
  pt: 'Português',
  ru: 'Русский',
};

const promptLanguageOrder: VogueLocale[] = [
  'en',
  'zh',
  'ja',
  'ko',
  'fr',
  'pt',
  'ru',
];

const mediaControlButtonClass =
  'vogue-prompt-media-control inline-flex h-[34px] w-[34px] items-center justify-center rounded-full border border-white/80 bg-white/[0.72] font-[var(--font-vogue-display)] text-slate-900 shadow-[0_5px_14px_rgba(15,23,42,0.075)] ring-1 ring-slate-900/[0.04] backdrop-blur-xl transition duration-200 hover:-translate-y-px hover:bg-white hover:text-slate-950 hover:shadow-[0_8px_18px_rgba(15,23,42,0.10)] active:translate-y-0';

const mediaCounterClass =
  'vogue-prompt-media-counter inline-flex h-[34px] min-w-[46px] items-center justify-center rounded-full border border-white/80 bg-white/[0.72] px-2.5 font-[var(--font-vogue-display)] text-[0.82rem] font-semibold tabular-nums tracking-normal text-slate-950 shadow-[0_5px_14px_rgba(15,23,42,0.075)] ring-1 ring-slate-900/[0.04] backdrop-blur-xl';

const metaChipClass =
  'vogue-prompt-meta-chip inline-flex h-7 shrink-0 max-w-full min-w-0 items-center justify-center gap-1.5 rounded-full border border-slate-200/80 bg-white px-2.5 text-[12px] font-semibold text-slate-700 shadow-[0_8px_18px_rgba(72,92,130,0.06)]';

const remixTokenBaseClassName =
  'vogue-prompt-remix-token mx-[1px] inline cursor-pointer rounded-[999px] px-1.5 py-[1px] text-left text-[0.84rem] font-normal leading-[1.42] align-baseline box-decoration-clone border transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B6DD21]';

const remixTokenActiveClassName =
  'border-[#B6DD21] bg-[#D1FE17] text-slate-950 ring-1 ring-[#D1FE17]/35 shadow-[2px_2px_0_#ffffff,2px_2px_0_1px_rgba(15,23,42,0.10),0_8px_18px_rgba(209,254,23,0.16)]';

const remixTokenIdleClassName =
  'border-[#C9DF60] bg-[#FCFFF0] text-slate-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.92)] hover:border-[#B6DD21] hover:bg-[#F2FF9A] hover:text-slate-950 hover:shadow-[2px_2px_0_#ffffff,2px_2px_0_1px_rgba(15,23,42,0.08),0_6px_16px_rgba(209,254,23,0.13)]';

const remixVariableCardClassName =
  'vogue-prompt-variable-card mt-3 rounded-[24px] border-0 border-r-2 border-b-2 border-[#B6DD21] bg-[#D1FE17] p-4 shadow-[5px_5px_0_rgba(255,255,255,0.9),5px_5px_0_1px_rgba(209,254,23,0.22),0_18px_44px_rgba(15,23,42,0.12)]';

const remixSuggestionButtonBaseClassName =
  'rounded-[15px] border-2 px-3.5 py-2 text-[12px] font-normal text-slate-950 shadow-[0_10px_22px_rgba(15,23,42,0.06)] transition hover:-translate-y-px';

const remixSuggestionButtonIdleClassName =
  'border-[#D1D8E8] bg-white hover:border-[#B6DD21] hover:bg-[#FBFFE8] hover:shadow-[0_14px_26px_rgba(15,23,42,0.08)]';

const remixSuggestionButtonActiveClassName =
  'border-[#B6DD21] bg-[#D1FE17] shadow-[8px_8px_0_#ffffff,8px_8px_0_2px_rgba(15,23,42,0.09),0_18px_34px_rgba(209,254,23,0.22)]';

const defaultTransformSourceLabel = 'Source Image';
const defaultTransformResultLabel = 'Final Result';

const getModelLabel = (modelId?: string) =>
  MODEL_LABELS[modelId ?? ''] ?? 'AI Image';

const getModelPromptHubHref = (modelId?: string) =>
  MODEL_PROMPT_HUB_HREFS[modelId ?? ''] ?? null;

const getCategoryLabel = (categoryKey?: string) =>
  CATEGORY_LABELS[categoryKey ?? ''] ?? 'Creative';

const getPromptDetailCategoryLabel = (entry: VoguePromptEntry) =>
  getCategoryLabel(entry.categoryKey);

const getAuthorHandleLabel = (authorHandle?: string | null) => {
  const trimmedHandle = authorHandle?.trim();
  if (!trimmedHandle) return null;

  return trimmedHandle.startsWith('@') ? trimmedHandle : `@${trimmedHandle}`;
};

const getAuthorInitial = (
  authorName?: string | null,
  authorHandle?: string | null
) => {
  const source =
    authorName?.trim() || authorHandle?.replace(/^@/, '').trim() || 'Vogue AI';

  return source.charAt(0).toUpperCase();
};

const getTransferModel = (modelId?: string) => {
  const fallbackModel = getModelById('gptimage2');
  if (!modelId) return fallbackModel;

  const model = getModelById(modelId);
  return model.id === modelId ? model : fallbackModel;
};

const copyPromptToClipboard = async (prompt: string) => {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(prompt);
      return;
    }
  } catch {
    // Fall through to selection copy below.
  }

  const textarea = document.createElement('textarea');
  textarea.value = prompt;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.left = '-9999px';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  textarea.remove();
};

const getImagePrompt = (
  entry: VoguePromptEntry,
  imageIndex: number,
  mode: PromptLanguageMode
) => {
  const imagePrompt = entry.imagePrompts?.[imageIndex];
  const originalPrompt = imagePrompt?.prompt || entry.originalPrompt || entry.prompt;

  if (mode === 'original') return originalPrompt;

  return (
    imagePrompt?.promptTranslations?.[mode] ??
    entry.promptTranslations?.[mode] ??
    originalPrompt
  );
};

const getAvailablePromptLanguages = (
  entry: VoguePromptEntry,
  imageIndex: number
) => {
  const imagePromptTranslations =
    entry.imagePrompts?.[imageIndex]?.promptTranslations ?? {};
  const entryPromptTranslations = entry.promptTranslations ?? {};
  const translatedLanguages = promptLanguageOrder.filter(
    (language) =>
      imagePromptTranslations[language]?.trim() ||
      entryPromptTranslations[language]?.trim()
  );

  return ['original', ...translatedLanguages] as PromptLanguageMode[];
};

export default function PromptPublicPage({
  entry,
  initialImageIndex = 0,
  relatedPrompts = [],
  locale = 'en',
}: {
  entry: VoguePromptEntry;
  initialImageIndex?: number;
  relatedPrompts?: VogueRelatedPromptEntry[];
  locale?: string;
}) {
  const normalizedInitialImageIndex =
    entry.images.length > 0
      ? Math.min(Math.max(initialImageIndex, 0), entry.images.length - 1)
      : 0;
  const [activeImageIndex, setActiveImageIndex] = useState(
    normalizedInitialImageIndex
  );
  const [promptLanguageMode, setPromptLanguageMode] =
    useState<PromptLanguageMode>('original');
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const [moreDetailsOpen, setMoreDetailsOpen] = useState(false);
  const [remixOverrides, setRemixOverrides] = useState<
    Record<string, PromptRemixValues>
  >({});
  const [measuredImageDimensionsBySrc, setMeasuredImageDimensionsBySrc] =
    useState<Record<string, PromptImageDisplayDimensions>>({});
  const [activeRemixVariableKey, setActiveRemixVariableKey] = useState<
    string | null
  >(null);
  const [customRemixValue, setCustomRemixValue] = useState('');
  const languageMenuRef = useRef<HTMLDivElement | null>(null);
  const moreDetailsRef = useRef<HTMLDetailsElement | null>(null);
  const resolvedImageAssets = useMemo(
    () =>
      entry.imageAssets?.length
        ? entry.imageAssets
        : entry.images.map(createFallbackPromptImageAsset),
    [entry.imageAssets, entry.images]
  );
  const activeImageAsset =
    resolvedImageAssets[
      Math.min(activeImageIndex, Math.max(resolvedImageAssets.length - 1, 0))
    ] ??
    resolvedImageAssets[0] ??
    null;
  const activeImage =
    activeImageAsset?.originalUrl ??
    entry.images[activeImageIndex] ??
    entry.images[0] ??
    '';
  const activeImagePrompt = entry.imagePrompts?.[activeImageIndex];
  const activePromptRemixId = activeImagePrompt?.sourceId || entry.id;
  const activeImageSrc =
    getPromptImageAssetSrc(activeImageAsset, 1200) || activeImage;
  const activeImageWidth = activeImageAsset?.width;
  const activeImageHeight = activeImageAsset?.height;
  const activeImageMeasuredKey = activeImageSrc || activeImage;
  const measuredActiveImageDimensions =
    measuredImageDimensionsBySrc[activeImageMeasuredKey];
  const sourceActiveImageDimensions =
    typeof activeImageWidth === 'number' && typeof activeImageHeight === 'number'
      ? {
          width: activeImageWidth,
          height: activeImageHeight,
          aspectRatio:
            activeImageAsset?.aspectRatio ??
            `${activeImageWidth} / ${activeImageHeight}`,
        }
      : null;
  const activeImageDimensions =
    sourceActiveImageDimensions ?? measuredActiveImageDimensions ?? null;
  const activeImageHasSourceDimensions = Boolean(sourceActiveImageDimensions);
  const activeImageIsPortrait =
    activeImageDimensions
      ? activeImageDimensions.height > activeImageDimensions.width
      : null;
  const activeImageSizingClass = activeImageIsPortrait
    ? 'md:h-[min(calc(100dvh-7rem),88vh)] md:w-auto md:max-h-[min(calc(100dvh-7rem),88vh)] md:max-w-[min(92%,980px)] lg:h-[min(calc(100dvh-8rem),86vh)] lg:w-auto lg:max-h-[min(calc(100dvh-8rem),86vh)] lg:max-w-[min(92%,1120px)]'
    : activeImageIsPortrait === false
      ? 'md:h-auto md:w-[min(90%,980px)] md:max-h-[min(calc(100dvh-7rem),88vh)] md:max-w-none lg:h-auto lg:w-[min(90%,1120px)] lg:max-h-[min(calc(100dvh-8rem),86vh)] lg:max-w-none'
      : 'md:h-auto md:w-auto md:max-h-[min(calc(100dvh-7rem),88vh)] md:max-w-[min(92%,980px)] lg:h-auto lg:w-auto lg:max-h-[min(calc(100dvh-8rem),86vh)] lg:max-w-[min(92%,1120px)]';
  const activeImageClassName = `vogue-prompt-active-image h-auto w-auto max-h-[calc(44dvh-5rem)] max-w-[min(86%,560px)] rounded-[18px] object-contain shadow-[0_18px_54px_rgba(15,23,42,0.14)] ring-1 ring-slate-900/[0.06] ${activeImageSizingClass}`;
  const recordActiveImageDimensions = (image: HTMLImageElement) => {
    const width = image.naturalWidth;
    const height = image.naturalHeight;
    if (!width || !height) return;

    const dimensions = {
      width,
      height,
      aspectRatio: `${width} / ${height}`,
    };
    const dimensionKeys = [
      activeImageMeasuredKey,
      activeImage,
      image.currentSrc,
      image.src,
    ].filter(Boolean);

    setMeasuredImageDimensionsBySrc((current) => {
      const alreadyMeasured = dimensionKeys.every((key) => {
        const existing = current[key];
        return (
          existing?.width === width &&
          existing.height === height &&
          existing.aspectRatio === dimensions.aspectRatio
        );
      });
      if (alreadyMeasured) return current;

      return dimensionKeys.reduce(
        (next, key) => ({
          ...next,
          [key]: dimensions,
        }),
        { ...current }
      );
    });
  };
  const transformExampleConfig = getPromptTransformExampleConfig(entry.id);
  const activeTransformExample =
    transformExampleConfig?.examples[activeImageIndex] ?? null;
  const linkableSourceUrl = getLinkablePromptSourceUrl(entry.sourceUrl);
  const isXSource = Boolean(linkableSourceUrl);
  const isVogueAiSource = entry.sourceType === 'vogueai';
  const modelLabel = getModelLabel(entry.modelId);
  const modelHubHref = getModelPromptHubHref(entry.modelId);
  const modelIconPath = entry.modelId
    ? getModelIconPathByModelId(entry.modelId)
    : null;
  const entryDisplayTitle = entry.title;
  const activeDisplayTitle =
    activeImagePrompt?.title?.trim() || entryDisplayTitle;
  const activeImageAlt = activeDisplayTitle;
  const authorHandleLabel = getAuthorHandleLabel(entry.authorHandle);
  const authorLabel = authorHandleLabel || entry.authorName || 'Vogue AI';
  const authorDisplayName = entry.authorName || authorHandleLabel || 'Vogue AI';
  const authorInitial = getAuthorInitial(entry.authorName, authorHandleLabel);
  const transferModel = getTransferModel(entry.modelId);
  const categoryLabel = getPromptDetailCategoryLabel(entry);
  const composerHref = getUrlWithLocale('/app', locale);
  const homeHref = getUrlWithLocale('/', locale);
  const promptDetailHref = getPromptPagePath(entry);
  const promptInsights = getPromptDetailInsights(entry);
  const getImageHref = (imageIndex: number) =>
    imageIndex <= 0
      ? promptDetailHref
      : `${promptDetailHref}?image=${imageIndex + 1}`;
  const getImageDisplayTitle = (imageIndex: number) =>
    entry.imagePrompts?.[imageIndex]?.title?.trim() ||
    `${entryDisplayTitle} ${imageIndex + 1}`;
  const availablePromptLanguages = useMemo<PromptLanguageMode[]>(() => {
    return getAvailablePromptLanguages(entry, activeImageIndex);
  }, [activeImageIndex, entry]);
  const visiblePrompt = getImagePrompt(
    entry,
    activeImageIndex,
    promptLanguageMode
  );
  const promptRemixSchema = useMemo(
    () => getPromptRemixSchema(activePromptRemixId, entry.id),
    [activePromptRemixId, entry.id]
  );
  const defaultRemixValues = useMemo(
    () => getInitialPromptRemixValues(promptRemixSchema),
    [promptRemixSchema]
  );
  const remixValues = useMemo(() => {
    if (!promptRemixSchema) return {};

    return {
      ...defaultRemixValues,
      ...(remixOverrides[promptRemixSchema.promptId] ?? {}),
    };
  }, [defaultRemixValues, promptRemixSchema, remixOverrides]);
  const remixEnabled = Boolean(
    promptRemixSchema?.variables.length &&
      promptRemixSchema.variables.every((variable) =>
        visiblePrompt.includes(variable.defaultValue)
      )
  );
  const remixedPrompt = useMemo(
    () =>
      remixEnabled
        ? applyPromptRemixValues(
            visiblePrompt,
            promptRemixSchema,
            remixValues
          )
        : visiblePrompt,
    [promptRemixSchema, remixEnabled, remixValues, visiblePrompt]
  );
  const remixDisplayPrompt = useMemo(
    () => formatPromptForRemixDisplay(remixedPrompt),
    [remixedPrompt]
  );
  const promptDisplaySections = useMemo(
    () => buildPromptDisplaySections(remixDisplayPrompt),
    [remixDisplayPrompt]
  );
  const activeRemixVariable = useMemo(
    () =>
      promptRemixSchema?.variables.find(
        (variable) => variable.key === activeRemixVariableKey
      ) ?? null,
    [activeRemixVariableKey, promptRemixSchema]
  );
  const currentPromptForActions = remixEnabled ? remixedPrompt : visiblePrompt;
  const languageMenuId = `${entry.id}-prompt-language-menu`;
  const modelChipContent = (
    <>
      {modelIconPath ? (
        <Image
          src={modelIconPath}
          alt=""
          width={18}
          height={18}
          unoptimized
          className="h-3.5 w-3.5 rounded-full object-contain"
        />
      ) : (
        <Sparkles className="h-3.5 w-3.5" />
      )}
      <span>{modelLabel}</span>
    </>
  );

  useEffect(() => {
    document.title = `${activeDisplayTitle} | Vogue AI`;
  }, [activeDisplayTitle]);

  useEffect(() => {
    if (!languageMenuOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (
        target instanceof Node &&
        languageMenuRef.current?.contains(target)
      ) {
        return;
      }

      setLanguageMenuOpen(false);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setLanguageMenuOpen(false);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown, true);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown, true);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [languageMenuOpen]);

  useEffect(() => {
    if (!moreDetailsOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (
        target instanceof Node &&
        moreDetailsRef.current?.contains(target)
      ) {
        return;
      }

      setMoreDetailsOpen(false);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMoreDetailsOpen(false);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown, true);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown, true);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [moreDetailsOpen]);

  const selectPromptLanguage = (mode: PromptLanguageMode) => {
    setPromptLanguageMode(mode);
    setLanguageMenuOpen(false);
    setActiveRemixVariableKey(null);
  };

  const selectImage = (
    event: MouseEvent<HTMLAnchorElement>,
    imageIndex: number
  ) => {
    event.preventDefault();
    setActiveImageIndex(imageIndex);
    setPromptLanguageMode('original');
    setLanguageMenuOpen(false);
    setMoreDetailsOpen(false);
    setActiveRemixVariableKey(null);

    window.history.replaceState(null, '', getImageHref(imageIndex));
  };

  const persistPromptTransfer = () => {
    writeVogueAppTransferPayload({
      source: 'gallery',
      createdAt: Date.now(),
      model: transferModel.id,
      prompt: currentPromptForActions,
      aspectRatio: transferModel.defaultAspectRatio,
      outputQuality: transferModel.defaultOutputQuality ?? '1k',
      quality: transferModel.defaultQuality ?? 'medium',
      generationCount: transferModel.defaultGenerationCount ?? 1,
      referenceImages: [],
      referenceImageItems: [],
      remixPromptId: remixEnabled ? promptRemixSchema?.promptId : undefined,
      remixValues: remixEnabled ? remixValues : undefined,
    });
  };

  const openRemixVariable = (key: string) => {
    const variable = promptRemixSchema?.variables.find(
      (candidate) => candidate.key === key
    );

    setActiveRemixVariableKey(key);
    setCustomRemixValue(
      variable ? remixValues[key] ?? variable.defaultValue : ''
    );
  };

  const updateRemixVariable = (key: string, value: string) => {
    if (!promptRemixSchema) return;

    setRemixOverrides((current) => ({
      ...current,
      [promptRemixSchema.promptId]: {
        ...(current[promptRemixSchema.promptId] ?? {}),
        [key]: value,
      },
    }));
    setActiveRemixVariableKey(null);
    setCustomRemixValue('');
  };

  const applyCustomRemixValue = () => {
    if (!activeRemixVariable) return;

    updateRemixVariable(
      activeRemixVariable.key,
      customRemixValue.trim() || activeRemixVariable.defaultValue
    );
  };

  const renderPromptSegment = (
    segment: PromptRemixSegment,
    index: number,
    keyPrefix: string
  ) => {
    if (segment.type === 'variable') {
      const isActive = activeRemixVariableKey === segment.key;

      return (
        <span
          key={`${keyPrefix}-${segment.key}-${index}`}
          role="button"
          tabIndex={0}
          onClick={() => openRemixVariable(segment.key)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              openRemixVariable(segment.key);
            }
          }}
          className={`${remixTokenBaseClassName} ${
            isActive ? remixTokenActiveClassName : remixTokenIdleClassName
          }`}
          title={`Swap ${segment.label}`}
        >
          {segment.text}
        </span>
      );
    }

    if (segment.type === 'keep') {
      return <span key={`${keyPrefix}-keep-${index}`}>{segment.text}</span>;
    }

    return <span key={`${keyPrefix}-text-${index}`}>{segment.text}</span>;
  };

  const renderPromptSectionContent = (
    text: string,
    sectionIndex: number
  ) => {
    if (!remixEnabled || !promptRemixSchema) return text;

    return buildPromptRemixSegments(
      text,
      promptRemixSchema,
      remixValues
    ).map((segment, index) =>
      renderPromptSegment(segment, index, `section-${sectionIndex}`)
    );
  };

  const persistReferenceTransfer = () => {
    const referenceImages = activeImage ? [activeImage] : [];

    writeVogueAppTransferPayload({
      source: 'gallery',
      createdAt: Date.now(),
      model: transferModel.id,
      prompt: '',
      aspectRatio: transferModel.defaultAspectRatio,
      outputQuality: transferModel.defaultOutputQuality ?? '1k',
      quality: transferModel.defaultQuality ?? 'medium',
      generationCount: transferModel.defaultGenerationCount ?? 1,
      referenceImages,
      referenceImageItems: referenceImages.map((url) => ({
        source: 'remote',
        url,
      })),
    });
  };

  return (
    <main
      className="vogue-prompt-detail-page h-dvh max-h-dvh overflow-hidden bg-[#eef4fb] font-[var(--font-vogue-sans)] text-slate-950"
      data-vogue-prompt-public-page
    >
      <div className="vogue-prompt-detail-surface grid h-dvh max-h-dvh grid-rows-[44dvh_56dvh] overflow-hidden bg-[#eef4fb] md:grid-cols-[minmax(0,1fr)_minmax(340px,34vw)] md:grid-rows-none lg:grid-cols-[minmax(0,1fr)_minmax(420px,31vw)] lg:grid-rows-none">
        <section className="vogue-prompt-detail-media relative h-[44dvh] max-h-[44dvh] overflow-hidden bg-[#eef4fb] md:h-dvh md:max-h-dvh lg:h-dvh lg:max-h-dvh">
          <div
            className="vogue-prompt-media-toolbar absolute right-4 top-4 z-20 flex items-center gap-1.5"
            data-single-image={entry.images.length <= 1 || undefined}
          >
            {activeImage ? (
              <a
                href={activeImage}
                download
                target="_blank"
                rel="noreferrer"
                aria-label="Download image"
                className={`${mediaControlButtonClass} vogue-prompt-download-control`}
                title="Download image"
              >
                <Download className="h-3.5 w-3.5" strokeWidth={2.1} />
                <span className="sr-only">Download image</span>
              </a>
            ) : null}
            <div
              className={mediaCounterClass}
              aria-label={`${activeImageIndex + 1} of ${entry.images.length}`}
            >
              {activeImageIndex + 1} / {entry.images.length}
            </div>
            <Link
              href={homeHref}
              aria-label="Close"
              className={`${mediaControlButtonClass} vogue-prompt-close-control`}
              title="Close"
            >
              <ArrowLeft
                className="vogue-prompt-mobile-back-icon hidden h-4 w-4"
                strokeWidth={2.2}
              />
              <X
                className="vogue-prompt-desktop-close-icon h-3.5 w-3.5"
                strokeWidth={2.15}
              />
              <span className="sr-only">Close</span>
            </Link>
          </div>

          <div className="vogue-prompt-media-stage relative flex h-full max-h-full items-center justify-center px-4 py-14 sm:px-8 md:h-dvh md:max-h-dvh md:px-8 md:py-20 lg:h-dvh lg:max-h-dvh lg:px-16 lg:py-24">
            {activeImage ? (
              activeTransformExample ? (
                <TransformBeforeAfterMedia
                  example={activeTransformExample}
                  resultImage={activeImageSrc}
                  resultImageAlt={activeImageAlt}
                  resultImageDimensions={activeImageDimensions}
                />
              ) : activeImageAsset && activeImageHasSourceDimensions ? (
                <PromptResolvedImage
                  key={activeImage}
                  asset={activeImageAsset}
                  preferredWidth={1200}
                  alt={activeImageAlt}
                  width={activeImageDimensions?.width ?? 1200}
                  height={activeImageDimensions?.height ?? 1600}
                  sizes="(min-width: 1024px) 78vw, 86vw"
                  preload
                  className={activeImageClassName}
                  style={{
                    aspectRatio: activeImageDimensions?.aspectRatio ?? undefined,
                  }}
                  onLoad={(event) =>
                    recordActiveImageDimensions(event.currentTarget)
                  }
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={activeImage}
                  src={activeImageSrc}
                  alt={activeImageAlt}
                  decoding="async"
                  fetchPriority="high"
                  className={activeImageClassName}
                  style={{
                    aspectRatio: activeImageDimensions?.aspectRatio ?? undefined,
                  }}
                  onLoad={(event) =>
                    recordActiveImageDimensions(event.currentTarget)
                  }
                />
              )
            ) : (
              <div className="flex aspect-[4/5] w-full max-w-[720px] items-center justify-center rounded-[20px] border border-slate-200 bg-white/70">
                <ImageIcon className="h-10 w-10 text-slate-300" />
              </div>
            )}
          </div>

          {resolvedImageAssets.length > 1 ? (
            <div className="vogue-prompt-thumbnail-rail absolute inset-x-4 bottom-4 z-20 flex justify-center gap-2 overflow-x-auto sm:inset-x-auto sm:bottom-auto sm:right-6 sm:top-1/2 sm:max-h-[calc(100dvh-160px)] sm:-translate-y-1/2 sm:flex-col">
              {resolvedImageAssets.map((imageAsset, imageIndex) => (
                (() => {
                  return (
                    <a
                      key={`${entry.id}-public-${imageAsset.originalUrl}`}
                      href={getImageHref(imageIndex)}
                      aria-label={`Show ${getImageDisplayTitle(imageIndex)}`}
                      aria-pressed={imageIndex === activeImageIndex}
                      role="button"
                      onClick={(event) => selectImage(event, imageIndex)}
                      className={`vogue-prompt-thumbnail-item h-[58px] w-[58px] shrink-0 overflow-hidden rounded-[14px] border bg-white/70 transition ${
                        imageIndex === activeImageIndex
                          ? 'border-slate-950'
                          : 'border-transparent hover:border-slate-400/70'
                      }`}
                    >
                      <PromptResolvedImage
                        asset={imageAsset}
                        preferredWidth={160}
                        alt={getImageDisplayTitle(imageIndex)}
                        width={imageAsset.width ?? 96}
                        height={imageAsset.height ?? 96}
                        sizes="58px"
                        className="h-full w-full rounded-[13px] object-cover"
                        loading="lazy"
                      />
                    </a>
                  );
                })()
              ))}
            </div>
          ) : null}
        </section>

        <aside className="vogue-prompt-detail-panel grid h-[56dvh] max-h-[56dvh] min-w-0 grid-cols-[minmax(0,1fr)] grid-rows-[auto_minmax(0,1fr)_auto] overflow-hidden border-t border-slate-200 bg-white md:h-dvh md:max-h-dvh md:border-l md:border-t-0 lg:h-dvh lg:max-h-dvh lg:border-l lg:border-t-0">
          <div className="vogue-prompt-panel-header min-w-0 w-full max-w-full border-b border-slate-200 px-5 pb-3.5 pt-5">
            <h1 className="vogue-prompt-title-line !text-[1rem] font-semibold !leading-snug text-slate-950">
              {activeDisplayTitle}
            </h1>
            <div className="vogue-prompt-meta-row mt-3 flex min-w-0 flex-wrap items-center gap-2 text-[12px] font-semibold">
              <span
                className={`vogue-prompt-author-chip ${metaChipClass}`}
                title={authorLabel}
              >
                <span className="min-w-0 truncate">{authorLabel}</span>
              </span>
              <span className={`vogue-prompt-category-chip ${metaChipClass}`}>
                {categoryLabel}
              </span>
              {modelHubHref ? (
                <Link
                  href={modelHubHref}
                  className={`vogue-prompt-model-chip ${metaChipClass}`}
                  title={`More ${modelLabel} prompts`}
                >
                  {modelChipContent}
                </Link>
              ) : (
                <span className={`vogue-prompt-model-chip ${metaChipClass}`}>
                  {modelChipContent}
                </span>
              )}
            </div>

            <div className="vogue-prompt-mobile-identity-card">
              <span
                className="vogue-prompt-mobile-author-avatar"
                aria-hidden="true"
              >
                {authorInitial}
              </span>
              <div className="min-w-0">
                <p className="vogue-prompt-mobile-title">{activeDisplayTitle}</p>
                <div className="vogue-prompt-mobile-author-line">
                  <span className="min-w-0 truncate">{authorDisplayName}</span>
                  {authorHandleLabel &&
                  authorHandleLabel !== authorDisplayName ? (
                    <span className="min-w-0 truncate text-slate-500">
                      {authorHandleLabel}
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
          </div>

          <div className="vogue-prompt-panel-body min-w-0 w-full max-w-full flex min-h-0 flex-col gap-3 overflow-y-auto px-6 pb-5 pt-5">
            <div className="vogue-prompt-mobile-prompt-section vogue-prompt-copy-card min-w-0 max-w-full shrink-0 rounded-[18px] bg-[#f6f9fc] px-4 py-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] ring-1 ring-[#d9e6ef]/80">
              <div className="mb-2.5 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[13px] font-semibold text-slate-500">
                    Prompt
                  </p>
                </div>
                <div className="flex min-w-0 shrink-0 items-center gap-2">
                  {availablePromptLanguages.length > 1 ? (
                    <div ref={languageMenuRef} className="relative">
                      <button
                        type="button"
                        className="vogue-prompt-language-trigger inline-flex h-8 w-auto items-center justify-center gap-1.5 whitespace-nowrap rounded-[11px] border border-slate-200/80 bg-[#f8fafc] px-2.5 text-[12px] font-semibold text-slate-900 shadow-[0_7px_16px_rgba(72,92,130,0.07),inset_0_1px_0_rgba(255,255,255,0.86)] transition hover:border-slate-300 hover:bg-white hover:shadow-[0_10px_20px_rgba(72,92,130,0.1),inset_0_1px_0_rgba(255,255,255,0.9)] focus:outline-none focus:ring-2 focus:ring-slate-200"
                        aria-label="Prompt language"
                        aria-haspopup="listbox"
                        aria-expanded={languageMenuOpen}
                        aria-controls={languageMenuOpen ? languageMenuId : undefined}
                        onClick={() => setLanguageMenuOpen((open) => !open)}
                      >
                        <span className="truncate">
                          {promptLanguageLabels[promptLanguageMode] ??
                            promptLanguageMode.toUpperCase()}
                        </span>
                        <ChevronDown
                          className={`h-3.5 w-3.5 shrink-0 text-slate-500 transition ${
                            languageMenuOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      {languageMenuOpen ? (
                        <div
                          id={languageMenuId}
                          role="listbox"
                          className="vogue-prompt-language-menu absolute right-0 top-[calc(100%+0.45rem)] z-40 min-w-[9rem] rounded-[14px] border border-slate-200/80 bg-white/95 p-1.5 shadow-[0_18px_38px_rgba(72,92,130,0.16),inset_0_1px_0_rgba(255,255,255,0.92)] ring-1 ring-white/80 backdrop-blur-xl"
                        >
                          {availablePromptLanguages.map((mode) => {
                            const isActive = promptLanguageMode === mode;

                            return (
                              <button
                                key={mode}
                                type="button"
                                role="option"
                                aria-selected={isActive}
                                onClick={() => selectPromptLanguage(mode)}
                                className={`flex h-8 w-full items-center justify-between gap-3 rounded-[10px] px-2.5 text-left text-[12px] font-semibold transition ${
                                  isActive
                                    ? 'bg-slate-950 text-white shadow-[0_8px_18px_rgba(15,23,42,0.14)]'
                                    : 'text-slate-600 hover:bg-[#f6f8fb] hover:text-slate-950'
                                }`}
                              >
                                <span>
                                  {promptLanguageLabels[mode] ??
                                    mode.toUpperCase()}
                                </span>
                                {isActive ? (
                                  <Check className="h-3.5 w-3.5" />
                                ) : null}
                              </button>
                            );
                          })}
                        </div>
                      ) : null}
                    </div>
                  ) : null}
                  <button
                    type="button"
                    onClick={() =>
                      void copyPromptToClipboard(currentPromptForActions)
                    }
                    className="inline-flex h-8 w-8 items-center justify-center rounded-[10px] border border-slate-200 bg-white text-slate-700 shadow-[0_8px_18px_rgba(72,92,130,0.06)] transition hover:bg-slate-950 hover:text-white"
                    title="Copy prompt"
                  >
                    <Copy className="h-3.5 w-3.5" />
                    <span className="sr-only">Copy prompt</span>
                  </button>
                </div>
              </div>
              <div className="vogue-prompt-mobile-scroll-frame">
                <span
                  className="vogue-prompt-mobile-scroll-cue vogue-prompt-mobile-scroll-cue-top"
                  aria-hidden="true"
                >
                  <ChevronDown className="h-3.5 w-3.5 rotate-180" />
                </span>
                <div className="vogue-prompt-text-scroll min-h-[12rem] max-h-[clamp(220px,38vh,420px)] overflow-y-auto pr-2">
                  <div className="vogue-prompt-field vogue-prompt-section-list space-y-2.5 text-slate-700">
                    {promptDisplaySections.map((section, sectionIndex) => (
                      <p
                        key={`${section.key}-${sectionIndex}`}
                        className="vogue-prompt-section-text whitespace-normal break-words text-[0.9rem] leading-[1.62] text-slate-700"
                      >
                        {renderPromptSectionContent(
                          section.text,
                          sectionIndex
                        )}
                      </p>
                    ))}
                  </div>
                </div>
                <span
                  className="vogue-prompt-mobile-scroll-cue vogue-prompt-mobile-scroll-cue-bottom"
                  aria-hidden="true"
                >
                  <ChevronDown className="h-3.5 w-3.5" />
                </span>
              </div>
              {remixEnabled && activeRemixVariable ? (
                <div className={remixVariableCardClassName}>
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-[13px] font-extrabold text-slate-950">
                        Swap the subject. Keep the look.
                      </div>
                      <div className="mt-1.5 flex max-w-full items-center gap-1.5 text-[11px] font-normal leading-none">
                        <span className="shrink-0 uppercase tracking-[0.12em] text-slate-500">
                          Variable:
                        </span>
                        <span className="min-w-0 truncate text-slate-800">
                          {activeRemixVariable.label}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveRemixVariableKey(null)}
                      className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white/90 text-slate-500 transition hover:bg-slate-950 hover:text-white"
                      title="Close"
                    >
                      <X className="h-3.5 w-3.5" />
                      <span className="sr-only">Close</span>
                    </button>
                  </div>
                  <div className="mb-3 flex flex-wrap gap-2.5">
                    {activeRemixVariable.suggestions.map((suggestion) => {
                      const isCurrentSuggestion =
                        suggestion === customRemixValue;

                      return (
                        <button
                          key={suggestion}
                          type="button"
                          onClick={() => setCustomRemixValue(suggestion)}
                          className={`${remixSuggestionButtonBaseClassName} ${
                            isCurrentSuggestion
                              ? remixSuggestionButtonActiveClassName
                              : remixSuggestionButtonIdleClassName
                          }`}
                        >
                          {suggestion}
                        </button>
                      );
                    })}
                  </div>
                  <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-2">
                    <input
                      value={customRemixValue}
                      onChange={(event) =>
                        setCustomRemixValue(event.target.value)
                      }
                      onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                          applyCustomRemixValue();
                        }

                        if (event.key === 'Escape') {
                          setActiveRemixVariableKey(null);
                        }
                      }}
                      className="h-10 min-w-0 rounded-[13px] border border-[#D1D8E8] bg-white px-3 text-[13px] font-normal text-slate-900 outline-none transition focus:border-[#B6DD21] focus:bg-white focus:ring-2 focus:ring-[#D1FE17]/25"
                    />
                    <button
                      type="button"
                      onClick={applyCustomRemixValue}
                      className="inline-flex h-10 items-center justify-center whitespace-nowrap rounded-[13px] bg-slate-950 px-4 text-[13px] font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_8px_18px_rgba(15,23,42,0.18)] transition hover:bg-slate-800"
                    >
                      Change Variable
                    </button>
                  </div>
                </div>
              ) : null}
            </div>

            <div className="vogue-prompt-info-card min-w-0 max-w-full shrink-0 rounded-[16px] bg-white px-4 py-1.5 shadow-[0_10px_24px_rgba(72,92,130,0.06)] ring-1 ring-slate-200/70">
              <InfoRow label="Model" value={modelLabel} />
              <InfoRow label="Type" value={categoryLabel} />
              {activeImageDimensions ? (
                <InfoRow
                  label="Image"
                  value={`${activeImageDimensions.width} x ${activeImageDimensions.height}`}
                />
              ) : null}
              <SourceInfoRow
                sourceUrl={linkableSourceUrl}
                isXSource={isXSource}
                isVogueAiSource={isVogueAiSource}
              />
            </div>

            <details className="vogue-prompt-mobile-info-details min-w-0 max-w-full shrink-0 rounded-[14px] border border-slate-200/80 bg-white px-3.5 py-2.5 shadow-[0_8px_18px_rgba(72,92,130,0.05)]">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-[12px] font-semibold text-slate-600 marker:hidden">
                <span>Image info</span>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
              </summary>
              <div className="mt-2 border-t border-slate-100 pt-1">
                <InfoRow label="Model" value={modelLabel} />
                <InfoRow label="Type" value={categoryLabel} />
                {activeImageDimensions ? (
                  <InfoRow
                    label="Image"
                    value={`${activeImageDimensions.width} x ${activeImageDimensions.height}`}
                  />
                ) : null}
                <SourceInfoRow
                  sourceUrl={linkableSourceUrl}
                  isXSource={isXSource}
                  isVogueAiSource={isVogueAiSource}
                />
              </div>
            </details>

            {relatedPrompts.length > 0 ? (
              <section className="vogue-prompt-related-list min-w-0 max-w-full shrink-0 px-1">
                <div className="mb-1.5 px-1 text-[12px] font-semibold leading-4 text-slate-500">
                  More related prompts
                </div>
                <div className="grid gap-1">
                  {relatedPrompts.map((relatedPrompt) => {
                    const relatedImageAsset = relatedPrompt.imageAssets?.[0] ?? null;

                    return (
                      <Link
                        key={relatedPrompt.publicId}
                        href={getPromptPagePath(relatedPrompt)}
                        className="vogue-prompt-related-row group grid min-w-0 grid-cols-[44px_minmax(0,1fr)_16px] items-center gap-2.5 rounded-[12px] px-1.5 py-1.5 transition hover:bg-white hover:shadow-[0_8px_18px_rgba(72,92,130,0.07)]"
                      >
                        {relatedImageAsset ? (
                          <PromptResolvedImage
                            asset={relatedImageAsset}
                            preferredWidth={128}
                            alt=""
                            width={relatedImageAsset.width ?? 92}
                            height={relatedImageAsset.height ?? 92}
                            sizes="44px"
                            loading="lazy"
                            className="h-[44px] w-[44px] rounded-[10px] object-cover ring-1 ring-slate-900/[0.04]"
                          />
                        ) : (
                          <span className="flex h-[44px] w-[44px] items-center justify-center rounded-[10px] bg-slate-100 text-slate-300">
                            <ImageIcon className="h-4 w-4" />
                          </span>
                        )}
                        <span className="line-clamp-2 min-w-0 text-[12px] font-semibold leading-4 text-slate-700 transition group-hover:text-slate-950">
                          {relatedPrompt.title}
                        </span>
                        <ChevronRight className="h-3.5 w-3.5 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-slate-500" />
                      </Link>
                    );
                  })}
                </div>
              </section>
            ) : null}

            <details
              ref={moreDetailsRef}
              open={moreDetailsOpen}
              onToggle={(event) => setMoreDetailsOpen(event.currentTarget.open)}
              className="vogue-prompt-more-details group relative z-20 shrink-0"
            >
              <summary className="inline-flex h-8 cursor-pointer list-none items-center gap-1.5 rounded-full border border-slate-200/85 bg-white/[0.92] px-3 text-[12px] font-semibold text-slate-700 shadow-[0_8px_18px_rgba(72,92,130,0.07)] transition hover:-translate-y-px hover:border-slate-300 hover:bg-white hover:text-slate-950 marker:hidden">
                <Sparkles className="h-3.5 w-3.5 text-slate-500" />
                <span>More details</span>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400 transition group-open:rotate-180" />
              </summary>
              <div className="vogue-prompt-seo-popover fixed bottom-[7.25rem] left-5 right-5 z-50 max-h-[min(310px,calc(100dvh-10rem))] overflow-y-auto rounded-[18px] border border-white/80 bg-white/[0.96] p-3 shadow-[0_18px_40px_rgba(72,92,130,0.14)] ring-1 ring-slate-900/[0.05] backdrop-blur-xl md:left-auto md:right-4 md:w-[min(360px,calc(34vw-1.5rem))] md:max-h-[min(340px,calc(100dvh-9rem))] lg:left-auto lg:right-6 lg:w-[min(400px,calc(31vw-2rem))] lg:max-h-[min(360px,calc(100dvh-10rem))]">
                <div className="mb-3 flex items-start justify-between gap-4 border-b border-slate-100 pb-3">
                  <div className="min-w-0">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                      Prompt details
                    </div>
                    <div className="mt-1 text-[12px] font-semibold leading-5 text-slate-900">
                      Structure, variables, and practical uses for this prompt.
                    </div>
                  </div>
                  <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-950 text-white shadow-[0_10px_24px_rgba(15,23,42,0.18)]">
                    <Sparkles className="h-3.5 w-3.5" />
                  </span>
                </div>

                <div className="space-y-3">
                  <DetailPopoverSection title="Why it works">
                    <p className="!text-[13px] leading-5 text-slate-700">
                      {promptInsights.whyItWorks}
                    </p>
                  </DetailPopoverSection>

                  <DetailPopoverSection title="Prompt anatomy">
                    <dl className="space-y-2">
                      {promptInsights.anatomy.map((item) => (
                        <div
                          key={item.label}
                          className="grid grid-cols-[82px_minmax(0,1fr)] gap-3"
                        >
                          <dt className="text-[11px] font-semibold text-slate-500">
                            {item.label}
                          </dt>
                          <dd className="min-w-0 !text-[13px] leading-5 text-slate-700">
                            {item.value}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </DetailPopoverSection>

                  <DetailPopoverSection title="Variables">
                    <div className="flex flex-wrap gap-1.5">
                      {promptInsights.variables.map((variable) => (
                        <span
                          key={variable}
                          className="rounded-full border border-slate-200 bg-[#f8fafc] px-2.5 py-1 text-[11px] font-semibold text-slate-700"
                        >
                          {variable}
                        </span>
                      ))}
                    </div>
                  </DetailPopoverSection>

                  <DetailPopoverSection title="Best uses">
                    <ul className="space-y-1.5">
                      {promptInsights.useCases.map((useCase) => (
                        <li
                          key={useCase}
                          className="!text-[13px] leading-5 text-slate-700"
                        >
                          {useCase}
                        </li>
                      ))}
                    </ul>
                    <p className="mt-3 !text-[13px] leading-5 text-slate-700">
                      {promptInsights.modelFit}
                    </p>
                  </DetailPopoverSection>

                  <DetailPopoverSection title="Try variations">
                    <ul className="space-y-1.5">
                      {promptInsights.adaptationTips.map((tip) => (
                        <li
                          key={tip}
                          className="!text-[13px] leading-5 text-slate-700"
                        >
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </DetailPopoverSection>
                </div>
              </div>
            </details>
          </div>

          <div className="vogue-prompt-panel-footer min-w-0 w-full max-w-full shrink-0 border-t border-slate-200 bg-white px-6 pb-6 pt-6">
            <div className="grid min-w-0 grid-cols-2 gap-4">
              <Link
                href={composerHref}
                onClick={persistPromptTransfer}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-[14px] border border-slate-950 bg-slate-950 px-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800"
              >
                <Sparkles className="h-4 w-4" />
                Use as Prompt
              </Link>
              <Link
                href={composerHref}
                onClick={persistReferenceTransfer}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-[14px] border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-950 shadow-[0_12px_26px_rgba(72,92,130,0.08)] transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-[#f7fbff]"
              >
                <ImagePlus className="h-4 w-4" />
                Use as Ref
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}

function TransformBeforeAfterMedia({
  example,
  resultImage,
  resultImageAlt,
  resultImageDimensions,
}: {
  example: PromptTransformExample;
  resultImage: string;
  resultImageAlt: string;
  resultImageDimensions?: Pick<
    VoguePromptImageAsset,
    'width' | 'height' | 'aspectRatio'
  > | null;
}) {
  const frameAspectRatio = resultImageDimensions?.aspectRatio ?? '1 / 1';

  return (
    <div className="vogue-prompt-before-after-view relative flex h-full max-h-full w-full max-w-[min(96%,1120px)] items-center justify-center gap-3 lg:max-w-[min(88%,1240px)] lg:gap-5">
      <TransformExampleImageCard
        src={example.sourceImage}
        alt={example.sourceLabel ?? defaultTransformSourceLabel}
        label={example.sourceLabel ?? defaultTransformSourceLabel}
        width={example.sourceWidth ?? 1122}
        height={example.sourceHeight ?? 1402}
        frameAspectRatio={frameAspectRatio}
        priority
      />
      <div
        className="vogue-prompt-before-after-arrow flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/80 bg-white/80 text-slate-700 shadow-[0_10px_24px_rgba(15,23,42,0.1)] ring-1 ring-slate-900/[0.04] backdrop-blur-xl"
        aria-hidden="true"
      >
        <ChevronRight className="h-4 w-4" strokeWidth={2.2} />
      </div>
      <TransformExampleImageCard
        src={resultImage}
        alt={resultImageAlt}
        label={example.resultLabel ?? defaultTransformResultLabel}
        width={resultImageDimensions?.width ?? 1200}
        height={resultImageDimensions?.height ?? 1200}
        frameAspectRatio={frameAspectRatio}
        priority
      />
    </div>
  );
}

function TransformExampleImageCard({
  src,
  alt,
  label,
  width,
  height,
  frameAspectRatio,
  priority = false,
}: {
  src: string;
  alt: string;
  label: string;
  width: number;
  height: number;
  frameAspectRatio: string;
  priority?: boolean;
}) {
  const skipImageOptimizer =
    src.includes('/prompt-tests/ref-transform-') ||
    isPromptImageVariantSrc(src);

  return (
    <figure className="vogue-prompt-before-after-card relative flex min-w-0 flex-1 basis-0 flex-col items-center gap-2">
      <figcaption className="inline-flex h-7 max-w-full items-center rounded-full border border-white/80 bg-white/82 px-2.5 text-[11px] font-semibold text-slate-700 shadow-[0_8px_18px_rgba(15,23,42,0.08)] ring-1 ring-slate-900/[0.04] backdrop-blur-xl">
        <span className="truncate">{label}</span>
      </figcaption>
      <div
        className="vogue-prompt-before-after-image-frame w-full max-w-[min(34vw,560px)] overflow-hidden rounded-[18px] bg-white shadow-[0_18px_54px_rgba(15,23,42,0.14)] ring-1 ring-slate-900/[0.06] lg:max-w-[min(34vw,620px)]"
        style={{ aspectRatio: frameAspectRatio }}
      >
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          unoptimized={skipImageOptimizer}
          sizes="(max-width: 640px) 45vw, 34vw"
          priority={priority}
          loading={priority ? undefined : 'lazy'}
          className="vogue-prompt-before-after-image h-full w-full object-cover"
        />
      </div>
    </figure>
  );
}

function DetailPopoverSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-[14px] border border-slate-100 bg-[#fbfcfe] px-3.5 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.82)]">
      <div className="mb-2 text-[12px] font-semibold leading-4 text-slate-950">
        {title}
      </div>
      {children}
    </section>
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

function SourceInfoRow({
  sourceUrl,
  isXSource,
  isVogueAiSource,
}: {
  sourceUrl?: string | null;
  isXSource: boolean;
  isVogueAiSource: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-6 py-2.5">
      <span className="text-[13px] text-slate-500">Source</span>
      {sourceUrl && isXSource ? (
        <a
          href={sourceUrl}
          target="_blank"
          rel="noreferrer"
          aria-label="X"
          title="X"
          className="inline-flex min-w-0 items-center gap-1.5 text-[13px] font-semibold text-slate-800 transition hover:text-slate-950"
        >
          <IconBrandX className="h-3.5 w-3.5" />
        </a>
      ) : isVogueAiSource ? (
        <span className="text-[13px] font-semibold text-slate-800">
          Vogue AI
        </span>
      ) : (
        <span className="text-[13px] font-semibold text-slate-800">
          Vogue AI
        </span>
      )}
    </div>
  );
}
