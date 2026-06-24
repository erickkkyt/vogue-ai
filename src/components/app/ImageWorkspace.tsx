'use client';

import { authClient } from '@/lib/auth-client';
import AssetPreviewOverlay from '@/components/assets/AssetPreviewOverlay';
import { getVogueCopyFromMessages, type VogueUICopy } from '@/i18n/vogue';
import {
  VoguePromptComposer,
  type VogueComposerModel,
  type VogueComposerParameter,
  type VogueComposerReferenceItem,
} from '@/components/app/VoguePromptComposer';
import {
  buildWorkspaceMediaInput,
  appendItemsToAvailableSlots,
} from '@/lib/effects/workspace-media';
import {
  readVogueAppTransferPayload,
  type VogueAppTransferLocalReference,
} from '@/lib/app/composer-transfer';
import {
  getInitialPromptRemixValues,
  getPromptRemixSchema,
  type PromptRemixValues,
} from '@/lib/prompt-remix';
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
  type GenerationAccessTier,
  resolveGenerationAccessTierFromSubscriptionState,
} from '@/lib/effects/generation-access';
import {
  resolveWorkspaceGenerationTimeEstimate,
  resolveWorkspaceGenerationTimeEstimateForTier,
  resolveWorkspaceStandardGenerationTimeEstimate,
} from '@/lib/effects/generation-time-estimate';
import { getVogueWorkspaceModelDescription } from '@/lib/vogue-model-copy';
import {
  generateAnonymousEffect,
  generateEffect,
  getAnonymousEffectStatus,
  getAnonymousTrialStatus,
  getEffectStatus,
  precheckEffect,
  type EffectClientStatus,
  resolveWmTaskId,
} from '@/lib/effects/client-api';
import {
  countPromptCharacters,
  getGenerationPromptMaxChars,
  truncatePromptToMaxChars,
  validateGenerationPrompt,
  validateUploadedImageFile,
} from '@/lib/effects/validation';
import { getModelIconPathByModelId } from '@/lib/model-icons';
import { uploadFileFromBrowser } from '@/storage/client';
import { getUrlWithLocale } from '@/lib/urls/urls';
import {
  createEmptySlots,
  createOptimisticWorkspaceTask,
  createRemoteReference,
  fillSlots,
  formatBytes,
  formatDate,
  formatParamsLabel,
  getStatusLabel,
  mergeWorkspaceTimelineAssets,
  normalizeStatus,
  reconcileOptimisticWorkspaceTask,
  readOutputImageUrls,
  resizeReferenceSlots,
  revokeReference,
  type ReferenceImageItem,
  type TimelineFilter,
  type WorkspaceAssetItem,
} from './image-workspace-utils';
import {
  APP_QUERY_KEYS,
  WORKSPACE_STATUS_POLL_INTERVAL_MS,
  shouldPollWorkspaceGenerationStatus,
} from './app-query-config';
import {
  invalidateAppCredits,
  setKnownAppCredits,
  useAppCreditsQuery,
} from './app-query-hooks';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Copy,
  Download,
  GalleryVerticalEnd,
  ImageIcon,
  Loader2,
  Lock,
  Maximize2,
  RefreshCw,
  Sparkles,
  Zap,
} from 'lucide-react';
import { useLocale, useMessages } from 'next-intl';
import Image from 'next/image';
import { usePathname, useSearchParams } from 'next/navigation';
import {
  type ChangeEvent,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

type RecentAssetsQueryData = {
  items?: WorkspaceAssetItem[];
};

type WorkspaceGenerationStatusData = {
  status?: EffectClientStatus;
  output?: unknown;
  error?: string;
};

type ComposerNotice = {
  tone: 'info' | 'warning' | 'error';
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  secondaryActionLabel?: string;
  secondaryActionHref?: string;
  badgeLabel?: string;
};

const FALLBACK_GENERATION_COUNTS: WorkspaceGenerationCount[] = [1];
const EMPTY_QUALITY_OPTIONS: WorkspaceQualityOption[] = [];
const EMPTY_OUTPUT_QUALITY_OPTIONS: WorkspaceOutputQuality[] = [];
const EMPTY_WORKSPACE_ASSETS: WorkspaceAssetItem[] = [];
const ANONYMOUS_TRIAL_STORAGE_KEY = 'vogue-anonymous-trial-used';
const LEGACY_ANONYMOUS_TRIAL_STORAGE_KEY = 'gptimg-anonymous-trial-used';
const ANONYMOUS_TRIAL_MODEL_ID = 'gptimage2';
const ANONYMOUS_TRIAL_PARAMETER_TOKENS = ['Auto', '1K', 'Low', '1x'];
const ANONYMOUS_TRIAL_ASPECT_RATIO: WorkspaceAspectRatio = 'auto';
const ANONYMOUS_TRIAL_QUALITY: WorkspaceQualityOption = 'low';
const ANONYMOUS_TRIAL_OUTPUT_QUALITY: WorkspaceOutputQuality = '1k';
const ANONYMOUS_TRIAL_GENERATION_COUNT: WorkspaceGenerationCount = 1;
const ANONYMOUS_STATUS_POLL_ATTEMPTS = 120;
const ANONYMOUS_STATUS_POLL_INTERVAL_MS = 4000;
const ANONYMOUS_STANDARD_REVEAL_DELAY_MS = 10_000;
const GENERATION_PROGRESS_SOFT_CAP_PERCENT = 88;
const GENERATION_PROGRESS_TAIL_CAP_PERCENT = 98;

const wait = (milliseconds: number) =>
  new Promise((resolve) => window.setTimeout(resolve, milliseconds));

const fetchRecentWorkspaceAssets =
  async (): Promise<RecentAssetsQueryData> => {
    const response = await fetch('/api/assets/recent', { cache: 'no-store' });
    if (!response.ok) throw new Error('Unable to refresh recent assets');

    return (await response.json()) as RecentAssetsQueryData;
  };

const fetchWorkspaceGenerationStatus = async ({
  effectId,
  taskId,
}: {
  effectId: number;
  taskId: string;
}): Promise<WorkspaceGenerationStatusData> => {
  const response = await getEffectStatus({
    wmTaskId: taskId,
    effectId,
  });
  if (!response.ok) {
    throw new Error(response.data.error || 'Unable to refresh generation');
  }

  return response.data;
};

const readStringField = (value: unknown, key: string) => {
  if (!value || typeof value !== 'object') return null;
  const record = value as Record<string, unknown>;
  return typeof record[key] === 'string' && record[key] ? record[key] : null;
};

const getProviderTaskIdFromOutput = (output: unknown) =>
  readStringField(output, 'providerTaskId') ?? readStringField(output, 'taskId');

const getAnonymousLocalTrialUsed = () => {
  if (typeof window === 'undefined') return false;
  return (
    window.localStorage.getItem(ANONYMOUS_TRIAL_STORAGE_KEY) === '1' ||
    window.localStorage.getItem(LEGACY_ANONYMOUS_TRIAL_STORAGE_KEY) === '1'
  );
};

const setAnonymousLocalTrialUsed = (used: boolean) => {
  if (typeof window === 'undefined') return;
  if (used) {
    window.localStorage.setItem(ANONYMOUS_TRIAL_STORAGE_KEY, '1');
    return;
  }
  window.localStorage.removeItem(ANONYMOUS_TRIAL_STORAGE_KEY);
  window.localStorage.removeItem(LEGACY_ANONYMOUS_TRIAL_STORAGE_KEY);
};

const createLocalReferenceFromTransfer = ({
  file,
  name,
}: VogueAppTransferLocalReference): ReferenceImageItem => {
  const objectUrl = URL.createObjectURL(file);

  return {
    source: 'local',
    url: objectUrl,
    objectUrl,
    file,
    name: name || file.name || 'reference-image',
  };
};

const getSubmittedGenerationTiming = ({
  accessTier,
  modelId,
  outputQuality,
  quality,
}: {
  accessTier: GenerationAccessTier;
  modelId: string;
  outputQuality?: WorkspaceOutputQuality;
  quality?: WorkspaceQualityOption;
}) => ({
  expectedGenerationSeconds: resolveWorkspaceGenerationTimeEstimateForTier({
    accessTier,
    assetType: 'image',
    modelId,
    outputQuality,
    quality,
  }),
  standardGenerationSeconds: resolveWorkspaceStandardGenerationTimeEstimate({
    assetType: 'image',
    modelId,
    outputQuality,
    quality,
  }),
  fasterGenerationSeconds: resolveWorkspaceGenerationTimeEstimate({
    assetType: 'image',
    modelId,
    outputQuality,
    quality,
  }),
  generationAccessTier: accessTier,
});

const getGenerationProgressState = ({
  expectedSeconds,
  nowMs,
  startedAtMs,
}: {
  expectedSeconds: number;
  nowMs: number;
  startedAtMs: number;
}) => {
  const elapsedSeconds = Math.max(0, (nowMs - startedAtMs) / 1000);

  if (elapsedSeconds <= expectedSeconds) {
    const percent = Math.max(
      5,
      Math.min(
        GENERATION_PROGRESS_SOFT_CAP_PERCENT,
        (elapsedSeconds / expectedSeconds) *
          GENERATION_PROGRESS_SOFT_CAP_PERCENT
      )
    );

    return {
      isTail: false,
      percent,
      remainingSeconds: Math.max(
        1,
        Math.ceil(expectedSeconds - elapsedSeconds)
      ),
    };
  }

  const tailElapsedSeconds = elapsedSeconds - expectedSeconds;
  const tailProgress =
    GENERATION_PROGRESS_SOFT_CAP_PERCENT +
    (GENERATION_PROGRESS_TAIL_CAP_PERCENT -
      GENERATION_PROGRESS_SOFT_CAP_PERCENT) *
      (1 - Math.exp(-tailElapsedSeconds / 70));

  return {
    isTail: true,
    percent: Math.min(GENERATION_PROGRESS_TAIL_CAP_PERCENT, tailProgress),
    remainingSeconds: 0,
  };
};

const removeAutoStartSearchParam = () => {
  if (typeof window === 'undefined') return;
  const nextUrl = new URL(window.location.href);
  nextUrl.searchParams.delete('autostart');
  window.history.replaceState(null, '', nextUrl.toString());
};

function ActionTooltip({ label }: { label: string }) {
  return (
    <span className="pointer-events-none absolute bottom-[calc(100%+9px)] left-1/2 z-30 -translate-x-1/2 translate-y-1 whitespace-nowrap rounded-[8px] bg-slate-950 px-2.5 py-1.5 text-[12px] font-semibold leading-none text-white opacity-0 shadow-[0_14px_30px_rgba(15,23,42,0.22)] transition duration-150 group-hover/action:translate-y-0 group-hover/action:opacity-100 group-focus-within/action:translate-y-0 group-focus-within/action:opacity-100">
      {label}
    </span>
  );
}

function ComposerNoticeRail({ notice }: { notice: ComposerNotice | null }) {
  if (!notice) return null;

  const isInfo = notice.tone === 'info';
  const isError = notice.tone === 'error';
  const Icon = isError ? AlertCircle : isInfo ? Zap : Lock;
  const descriptionClassName = `mt-0.5 text-[12px] font-medium leading-5 ${
    isInfo ? 'hidden sm:block' : ''
  } ${isError ? 'text-red-700' : 'text-[#4d4a38]'}`;
  const actionClassName = `mt-2 shrink-0 flex-wrap items-center gap-2 sm:mt-0 sm:justify-end ${
    isInfo ? 'hidden sm:flex' : 'flex'
  }`;

  return (
    <div
      className={`vogue-composer-notice-rail relative overflow-hidden rounded-t-[20px] rounded-b-none border border-b-0 border-l-[5px] px-3 py-2 shadow-[0_16px_38px_rgba(118,92,70,0.12)] ring-1 ring-white/80 backdrop-blur-xl sm:flex sm:items-center sm:justify-between sm:gap-4 sm:rounded-t-[24px] sm:px-5 sm:py-3 ${
        isError
          ? 'border-red-200 border-l-red-500 bg-red-50/96 text-red-950'
          : isInfo
            ? 'border-[#D7FF00]/60 border-l-[#D7FF00] bg-[linear-gradient(180deg,#fbffdf_0%,#fffef7_100%)] text-[#171a23]'
            : 'border-[#D7FF00]/80 border-l-[#D7FF00] bg-[linear-gradient(180deg,#fbffdf_0%,#fffef7_100%)] text-[#171a23]'
      }`}
      role={isInfo ? 'status' : 'alert'}
    >
      <div className="flex min-w-0 items-start gap-2.5 sm:gap-3">
        <span
          className={`mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full ring-1 ring-white/80 sm:h-7 sm:w-7 ${
            isError
              ? 'bg-red-100 text-red-700'
              : 'bg-[#D7FF00] text-[#171a23]'
          }`}
        >
          <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </span>
        <div className="min-w-0">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <p className="min-w-0 text-[13px] sm:text-[14px] font-semibold leading-5 tracking-normal">
              {notice.title}
            </p>
            {notice.badgeLabel ? (
              <span className="inline-flex h-5 shrink-0 items-center rounded-full border border-[#D7FF00] bg-[#F6FFC7] px-2 text-[10px] font-semibold text-[#171a23] shadow-[0_5px_14px_rgba(118,92,70,0.08)] sm:h-6 sm:px-2.5 sm:text-[11px]">
                {notice.badgeLabel}
              </span>
            ) : null}
          </div>
          {notice.description ? (
            <p className={descriptionClassName}>
              {notice.description}
            </p>
          ) : null}
        </div>
      </div>

      <div className={actionClassName}>
        {notice.secondaryActionHref && notice.secondaryActionLabel ? (
          <a
            href={notice.secondaryActionHref}
            className="inline-flex h-9 shrink-0 items-center justify-center rounded-[13px] border border-[#D7FF00] bg-[#fbffd7] px-3.5 text-[13px] font-semibold text-[#171a23] shadow-[0_8px_18px_rgba(118,92,70,0.08)] transition hover:bg-[#F2FF9A]"
          >
            {notice.secondaryActionLabel}
          </a>
        ) : null}
        {notice.actionHref && notice.actionLabel ? (
          <a
            href={notice.actionHref}
            className="inline-flex h-9 shrink-0 items-center justify-center rounded-[13px] bg-slate-950 px-4 text-[13px] font-semibold text-white shadow-[0_12px_26px_rgba(15,23,42,0.2)] transition hover:bg-[#4f67ff]"
          >
            {notice.actionLabel}
          </a>
        ) : null}
      </div>
    </div>
  );
}

function AssetTile({
  item,
  active,
  cardRef,
  locale,
  copy,
  nowMs,
  onPreview,
  onUsePrompt,
  onUseReference,
}: {
  item: WorkspaceAssetItem;
  active?: boolean;
  cardRef?: (node: HTMLElement | null) => void;
  locale: string;
  copy: VogueUICopy;
  nowMs: number;
  onPreview: (item: WorkspaceAssetItem) => void;
  onUsePrompt: (prompt: string) => void;
  onUseReference: (url: string) => void;
}) {
  const isBusy = item.status === 'pending' || item.status === 'processing';
  const promptText = item.prompt || copy.app.noPromptSaved;
  const itemGenerationAccessTier =
    item.generationAccessTier === 'faster' ? 'faster' : 'standard';
  const isFasterGeneration = itemGenerationAccessTier === 'faster';
  const generationSpeedLabel = isFasterGeneration
    ? copy.app.progress.fasterLabel
    : copy.app.progress.slowLabel;
  const itemStandardGenerationSeconds =
    item.standardGenerationSeconds ?? item.expectedGenerationSeconds ?? null;
  const itemFasterGenerationSeconds =
    item.fasterGenerationSeconds ?? item.expectedGenerationSeconds ?? null;
  const shouldShowGenerationTimeComparison =
    typeof itemStandardGenerationSeconds === 'number' &&
    typeof itemFasterGenerationSeconds === 'number' &&
    itemStandardGenerationSeconds > itemFasterGenerationSeconds;
  const shouldShowUpgradeGenerationCta = !isFasterGeneration;
  const expectedGenerationSeconds =
    isFasterGeneration
      ? (itemFasterGenerationSeconds ?? itemStandardGenerationSeconds ?? 70)
      : (itemStandardGenerationSeconds ?? itemFasterGenerationSeconds ?? 70);
  const startedAtMs = new Date(item.createdAt).getTime();
  const taskProgress =
    isBusy && Number.isFinite(startedAtMs)
      ? getGenerationProgressState({
          expectedSeconds: expectedGenerationSeconds,
          nowMs,
          startedAtMs,
        })
      : null;
  const modelIconPath = item.modelId
    ? getModelIconPathByModelId(item.modelId)
    : null;
  const mediaUrls = useMemo(() => {
    const urls = item.mediaUrls?.length
      ? item.mediaUrls
      : item.mediaUrl
        ? [item.mediaUrl]
        : [];
    return Array.from(new Set(urls.filter(Boolean)));
  }, [item.mediaUrl, item.mediaUrls]);
  const [selectedMediaIndex, setActiveMediaIndex] = useState(0);
  const activeMediaIndex =
    mediaUrls.length === 0
      ? 0
      : Math.min(selectedMediaIndex, mediaUrls.length - 1);
  const activeMediaUrl = mediaUrls[activeMediaIndex] ?? null;
  const showCarouselControls = mediaUrls.length > 1;
  const showPreviousMedia = () => {
    setActiveMediaIndex((current) =>
      mediaUrls.length === 0
        ? 0
        : (current - 1 + mediaUrls.length) % mediaUrls.length
    );
  };
  const showNextMedia = () => {
    setActiveMediaIndex((current) =>
      mediaUrls.length === 0 ? 0 : (current + 1) % mediaUrls.length
    );
  };
  const downloadHref = useMemo(() => {
    const params = new URLSearchParams({ taskId: item.taskId });
    if (activeMediaUrl) params.set('url', activeMediaUrl);
    return `/api/assets/download?${params.toString()}`;
  }, [activeMediaUrl, item.taskId]);
  const metadataPillClass =
    'inline-flex h-7 shrink-0 items-center gap-1.5 rounded-full border px-2.5 text-[11px] font-semibold leading-none shadow-[0_8px_18px_rgba(72,92,130,0.06)] sm:h-8 sm:px-3 sm:text-xs';

  return (
    <article
      ref={cardRef}
      className={`scroll-mt-6 scroll-mb-56 grid gap-3 rounded-[20px] border bg-white/74 p-3 sm:gap-4 sm:rounded-[26px] sm:p-4 md:grid-cols-[280px_minmax(0,1fr)] ${
        active ? 'border-slate-950' : 'border-slate-200'
      }`}
    >
      <div className="relative h-[220px] w-full overflow-hidden rounded-[18px] bg-white/82 text-slate-500 sm:h-[240px] sm:rounded-[22px]">
        <button
          type="button"
          disabled={!activeMediaUrl}
          onClick={() =>
            activeMediaUrl && onPreview({ ...item, mediaUrl: activeMediaUrl })
          }
          className="group absolute inset-0 flex items-center justify-center disabled:cursor-default"
        >
          {activeMediaUrl ? (
            <Image
              src={activeMediaUrl}
              alt={item.prompt || item.modelLabel || copy.app.generatedAssetAlt}
              fill
              sizes="(min-width: 768px) 280px, 100vw"
              unoptimized
              className="h-full w-full object-contain object-center"
            />
          ) : (
            <div className="flex flex-col items-center gap-2 text-xs text-slate-500">
              {isBusy ? (
                <Loader2 className="h-5 w-5 animate-spin text-[#4f67ff]" />
              ) : (
                <ImageIcon className="h-5 w-5" />
              )}
              <span>{getStatusLabel(item.status, copy)}</span>
            </div>
          )}
          {activeMediaUrl ? (
            <span className="pointer-events-none absolute right-2 top-2 flex h-8 w-8 scale-95 items-center justify-center rounded-full bg-slate-950/55 text-white opacity-0 shadow-[0_12px_26px_rgba(15,23,42,0.2)] backdrop-blur-md transition duration-200 group-hover:scale-100 group-hover:opacity-100 group-focus-visible:scale-100 group-focus-visible:opacity-100">
              <Maximize2 className="h-3.5 w-3.5" />
            </span>
          ) : null}
        </button>
        {showCarouselControls ? (
          <>
            <button
              type="button"
              onClick={showPreviousMedia}
              className="absolute left-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-white/82 text-slate-900 shadow-[0_10px_24px_rgba(15,23,42,0.16)] backdrop-blur-md transition hover:bg-white"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={showNextMedia}
              className="absolute right-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-white/82 text-slate-900 shadow-[0_10px_24px_rgba(15,23,42,0.16)] backdrop-blur-md transition hover:bg-white"
              aria-label="Next image"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <span className="absolute bottom-2 left-1/2 z-10 inline-flex h-7 -translate-x-1/2 items-center rounded-full border border-white/70 bg-white/86 px-2.5 text-[11px] font-semibold tabular-nums text-slate-700 shadow-[0_10px_22px_rgba(15,23,42,0.14)] backdrop-blur-md">
              {activeMediaIndex + 1} / {mediaUrls.length}
            </span>
          </>
        ) : null}
      </div>
      <div className="flex min-w-0 flex-col justify-between gap-3 sm:gap-4">
        <div className="space-y-2.5 sm:space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`vogue-workspace-model-pill ${metadataPillClass} border-slate-200 bg-white/82 text-slate-700`}
            >
              {modelIconPath ? (
                <Image
                  src={modelIconPath}
                  alt=""
                  width={16}
                  height={16}
                  className="h-4 w-4 object-contain"
                />
              ) : (
                <ImageIcon className="h-3.5 w-3.5 text-slate-500" />
              )}
              <span>{item.modelLabel || copy.app.imageModel}</span>
            </span>
            {item.paramsLabel ? (
              <span
                className={`vogue-workspace-params-pill ${metadataPillClass} border-slate-200 bg-white/82 text-slate-700`}
              >
                {item.paramsLabel}
              </span>
            ) : null}
            <span
              className={`vogue-workspace-status-pill ${metadataPillClass} border-slate-200 bg-white/82 text-slate-700`}
            >
              {getStatusLabel(item.status, copy)}
            </span>
          </div>

          <div
            className="rounded-[14px] border border-slate-200/70 bg-white/66 sm:rounded-[18px]"
            title={item.prompt ?? undefined}
          >
            <p
              className="max-h-[3.25rem] overflow-hidden px-3 py-2 text-[13px] font-semibold leading-[1.55] text-slate-900 [scrollbar-color:rgba(100,116,139,0.7)_transparent] [scrollbar-width:thin] sm:h-36 sm:max-h-none sm:overflow-y-auto sm:px-4 sm:py-3 sm:pr-3 sm:text-[15px] sm:leading-6 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-400/70 [&::-webkit-scrollbar-track]:bg-transparent"
            >
              {promptText}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="space-y-1 text-xs text-slate-500">
            <p>{formatDate(item.createdAt, locale)}</p>
            {taskProgress ? (
              <div className="w-full min-w-[220px] max-w-[360px] space-y-1.5 pt-1">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="h-1.5 min-w-[90px] flex-1 overflow-hidden rounded-full border border-[#dfe6ff] bg-slate-100">
                    <div
                      className="h-full rounded-full bg-[linear-gradient(90deg,#4f67ff,#9daeff)] transition-[width] duration-1000 ease-linear"
                      style={{ width: `${taskProgress.percent}%` }}
                    />
                  </div>
                  {isFasterGeneration ? (
                    <span className="inline-flex h-5 shrink-0 items-center rounded-full border border-[#dfe6ff] bg-[#f0f4ff] px-2 text-[10px] font-semibold leading-none tracking-normal text-[#4f67ff]">
                      {generationSpeedLabel}
                    </span>
                  ) : shouldShowUpgradeGenerationCta ? (
                    <a
                      aria-label={`${generationSpeedLabel} ${copy.app.progress.upgradeCta}`}
                      className="inline-flex h-5 max-w-full shrink-0 items-center gap-1 rounded-full border border-[#dfe6ff] bg-white px-2 text-[10px] font-semibold leading-none tracking-normal text-[#4f67ff] shadow-[0_6px_14px_rgba(79,103,255,0.10)] transition hover:border-[#b9c6ff] hover:bg-[#f0f4ff] hover:text-[#2f4cff]"
                      href={getUrlWithLocale('/pricing', locale)}
                      title={copy.app.progress.upgradeCta}
                    >
                      <span>{generationSpeedLabel}</span>
                      <span aria-hidden="true" className="text-[#9daeff]">
                        ·
                      </span>
                      <span>{copy.app.progress.upgradeCta}</span>
                    </a>
                  ) : null}
                </div>
                <div className="flex min-h-4 items-center justify-between gap-3 text-[11px] font-medium text-slate-500">
                  <span className="tabular-nums text-slate-700">
                    {Math.round(taskProgress.percent)}%
                  </span>
                  <span className="truncate text-right">
                    {taskProgress.isTail
                      ? copy.app.progress.almostDone
                      : copy.app.progress.timeLeft.replace(
                          '{seconds}',
                          String(taskProgress.remainingSeconds)
                        )}
                  </span>
                </div>
                {isFasterGeneration && shouldShowGenerationTimeComparison ? (
                  <div className="flex min-h-5 flex-wrap items-center gap-2 text-[11px] font-semibold leading-none text-slate-500">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2 py-1">
                      <span className="line-through decoration-slate-400">
                        {itemStandardGenerationSeconds}s
                      </span>
                      <span className="text-slate-900">
                        {itemFasterGenerationSeconds}s
                      </span>
                    </span>
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="group/action relative inline-flex">
              <button
                type="button"
                disabled={!item.prompt}
                onClick={() => item.prompt && onUsePrompt(item.prompt)}
                className="flex h-9 items-center justify-center rounded-[10px] border border-slate-200 bg-white px-3 text-slate-600 transition hover:border-slate-400 hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label={copy.app.tooltips.copyPrompt}
              >
                <Copy className="h-4 w-4" />
              </button>
              <ActionTooltip label={copy.app.tooltips.copyPrompt} />
            </span>
            <span className="group/action relative inline-flex">
              <button
                type="button"
                disabled={!activeMediaUrl}
                onClick={() => activeMediaUrl && onUseReference(activeMediaUrl)}
                className="flex h-9 items-center justify-center rounded-[10px] border border-slate-200 bg-white px-3 text-slate-600 transition hover:border-slate-400 hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label={copy.app.tooltips.regenerate}
              >
                <RefreshCw className="h-4 w-4" />
              </button>
              <ActionTooltip label={copy.app.tooltips.regenerate} />
            </span>
            <span className="group/action relative inline-flex">
              <a
                href={downloadHref}
                className={`flex h-9 items-center justify-center rounded-[10px] border border-slate-200 bg-white px-3 text-slate-600 transition hover:border-slate-400 hover:text-slate-950 ${
                  activeMediaUrl ? '' : 'pointer-events-none opacity-40'
                }`}
                aria-label={copy.app.tooltips.download}
                aria-disabled={!activeMediaUrl}
              >
                <Download className="h-4 w-4" />
              </a>
              <ActionTooltip label={copy.app.tooltips.download} />
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}

function WorkspaceTimeline({
  items,
  currentTask,
  activeItemRef,
  bottomRef,
  locale,
  copy,
  nowMs,
  onPreview,
  onUsePrompt,
  onUseReference,
  emptyMessage,
}: {
  items: WorkspaceAssetItem[];
  currentTask: WorkspaceAssetItem | null;
  activeItemRef?: (node: HTMLElement | null) => void;
  bottomRef?: (node: HTMLDivElement | null) => void;
  locale: string;
  copy: VogueUICopy;
  nowMs: number;
  onPreview: (item: WorkspaceAssetItem) => void;
  onUsePrompt: (prompt: string) => void;
  onUseReference: (url: string) => void;
  emptyMessage: string;
}) {
  return (
    <section className="flex min-h-0 flex-1 flex-col">
      {items.length > 0 ? (
        <div className="grid gap-4 overflow-y-auto pr-1">
          {items.map((item) => (
            <AssetTile
              key={item.taskId}
              item={item}
              active={currentTask?.taskId === item.taskId}
              cardRef={
                currentTask?.taskId === item.taskId ? activeItemRef : undefined
              }
              locale={locale}
              copy={copy}
              nowMs={nowMs}
              onPreview={onPreview}
              onUsePrompt={onUsePrompt}
              onUseReference={onUseReference}
            />
          ))}
          <div
            ref={bottomRef}
            aria-hidden="true"
            className="h-px scroll-mb-56"
          />
        </div>
      ) : (
        <div className="rounded-[16px] border border-dashed border-slate-300/90 bg-white/38 px-4 py-3 text-center text-[13px] font-medium text-slate-500 sm:rounded-[22px] sm:py-8 sm:text-[14px]">
          {emptyMessage}
        </div>
      )}
    </section>
  );
}

function WorkspaceContent() {
  const locale = useLocale();
  const messages = useMessages();
  const copy = getVogueCopyFromMessages(messages);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const assetsHref = useMemo(() => getUrlWithLocale('/assets', locale), [locale]);
  const [resultFilter, setResultFilter] = useState<TimelineFilter>('all');
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const referenceImagesRef = useRef<Array<ReferenceImageItem | null>>([]);
  const hasAutoStartedRef = useRef(false);
  const generateRef = useRef<(() => Promise<void>) | null>(null);
  const activeTimelineItemRef = useRef<HTMLElement | null>(null);
  const timelineBottomRef = useRef<HTMLDivElement | null>(null);
  const pendingAutoScrollTaskIdRef = useRef<string | null>(null);
  const lastAutoScrolledTaskIdRef = useRef<string | null>(null);
  const hasScrolledInitialTimelineRef = useRef(false);
  const initialModel = searchParams.get('model') || 'gptimage2';
  const initialPrompt = searchParams.get('prompt') || '';
  const initialAutoStart = searchParams.get('autostart') === '1';
  const initialReferenceImages = searchParams
    .getAll('referenceImage')
    .filter(Boolean);
  const initialModelRecord = getModelById(initialModel);
  const initialAspectRatio = searchParams.get('aspectRatio');
  const initialQuality = searchParams.get('quality');
  const initialOutputQuality =
    searchParams.get('outputQuality') || searchParams.get('resolution');
  const initialGenerationCount = Number(searchParams.get('generationCount'));
  const initialImageLimit = initialModelRecord.mediaSchema?.image.max ?? 0;
  const [modelId, setModelId] = useState(initialModelRecord.id);
  const model = useMemo(() => getModelById(modelId), [modelId]);
  const imageSlotLimit = model.mediaSchema?.image.max ?? 0;
  const promptMaxChars = getGenerationPromptMaxChars({ modelId: model.id });
  const [prompt, setPrompt] = useState(
    truncatePromptToMaxChars(initialPrompt, promptMaxChars)
  );
  const [workspaceRemixPromptId, setWorkspaceRemixPromptId] = useState<
    string | null
  >(null);
  const [workspaceRemixValues, setWorkspaceRemixValues] =
    useState<PromptRemixValues>({});
  const workspaceRemixSchema = useMemo(
    () =>
      workspaceRemixPromptId
        ? getPromptRemixSchema(workspaceRemixPromptId)
        : null,
    [workspaceRemixPromptId]
  );
  const [referenceImages, setReferenceImages] = useState<
    Array<ReferenceImageItem | null>
  >(() => {
    const slots = createEmptySlots<ReferenceImageItem>(initialImageLimit);
    if (initialReferenceImages.length > 0 && initialImageLimit > 0) {
      initialReferenceImages
        .slice(0, initialImageLimit)
        .forEach((referenceImage, index) => {
          slots[index] = createRemoteReference(referenceImage);
        });
    }
    return slots;
  });
  const [aspectRatio, setAspectRatio] = useState<WorkspaceAspectRatio>(
    initialAspectRatio &&
      initialModelRecord.supportedAspectRatios.includes(
        initialAspectRatio as WorkspaceAspectRatio
      )
      ? (initialAspectRatio as WorkspaceAspectRatio)
      : initialModelRecord.defaultAspectRatio
  );
  const [quality, setQuality] = useState<WorkspaceQualityOption>(
    initialQuality &&
      initialModelRecord.qualityOptions?.includes(
        initialQuality as WorkspaceQualityOption
      )
      ? (initialQuality as WorkspaceQualityOption)
      : initialModelRecord.defaultQuality || 'medium'
  );
  const [outputQuality, setOutputQuality] = useState<WorkspaceOutputQuality>(
    initialOutputQuality &&
      initialModelRecord.supportedOutputQualities?.includes(
        initialOutputQuality as WorkspaceOutputQuality
      )
      ? (initialOutputQuality as WorkspaceOutputQuality)
      : initialModelRecord.defaultOutputQuality || '1k'
  );
  const [generationCount, setGenerationCount] =
    useState<WorkspaceGenerationCount>(
      initialModelRecord.supportedGenerationCounts?.includes(
        initialGenerationCount as WorkspaceGenerationCount
      )
        ? (initialGenerationCount as WorkspaceGenerationCount)
        : initialModelRecord.defaultGenerationCount || 1
    );
  const [currentTask, setCurrentTask] = useState<WorkspaceAssetItem | null>(
    null
  );
  const [generationProgressNowMs, setGenerationProgressNowMs] = useState(() =>
    Date.now()
  );
  const [anonymousTrialRemaining, setAnonymousTrialRemaining] = useState<
    number | null
  >(null);
  const [transferReady, setTransferReady] = useState(false);
  const hasHydrated = transferReady;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewItem, setPreviewItem] = useState<WorkspaceAssetItem | null>(
    null
  );
  const { data: session, isPending: isSessionPending } = authClient.useSession();
  const isAuthenticated = Boolean(session?.user);
  const sessionUserId = session?.user?.id ?? null;
  const queryClient = useQueryClient();
  const sessionUser = session?.user as
    | ({ subscriptionState?: unknown } & Record<string, unknown>)
    | undefined;
  const sessionUserName =
    typeof sessionUser?.name === 'string' ? sessionUser.name.trim() : '';
  const sessionUserEmail =
    typeof sessionUser?.email === 'string' ? sessionUser.email.trim() : '';
  const ownerName = sessionUserName || sessionUserEmail || 'Vogue AI';
  const ownerImage =
    typeof sessionUser?.image === 'string' && sessionUser.image.trim()
      ? sessionUser.image
      : null;
  const userSubscriptionState =
    typeof sessionUser?.subscriptionState === 'string'
      ? sessionUser.subscriptionState
      : null;
  const creditsQuery = useAppCreditsQuery(sessionUserId);
  const recentAssetsQuery = useQuery({
    queryKey: APP_QUERY_KEYS.recentAssets(sessionUserId ?? 'anonymous'),
    queryFn: fetchRecentWorkspaceAssets,
    enabled: isAuthenticated,
    staleTime: 15_000,
  });
  const credits =
    creditsQuery.data?.authenticated &&
    typeof creditsQuery.data.currentCredits === 'number'
      ? creditsQuery.data.currentCredits
      : null;
  const serverGenerationAccessTier =
    creditsQuery.data?.generationAccessTier === 'faster'
      ? 'faster'
      : creditsQuery.data?.generationAccessTier === 'standard'
        ? 'standard'
        : null;
  const recentAssets = recentAssetsQuery.data?.items ?? EMPTY_WORKSPACE_ASSETS;
  const generationAccessTier = isAuthenticated
    ? serverGenerationAccessTier ??
      resolveGenerationAccessTierFromSubscriptionState(userSubscriptionState)
    : 'standard';
  const isAnonymousPreviewMode =
    hasHydrated && !isSessionPending && !isAuthenticated;
  const anonymousTrialCount = isAnonymousPreviewMode
    ? anonymousTrialRemaining
    : null;

  const promptCharCount = countPromptCharacters(prompt.trim());
  const promptValidation = validateGenerationPrompt(prompt, {
    maxChars: promptMaxChars,
    required: true,
  });
  const supportedGenerationCounts =
    model.supportedGenerationCounts ?? FALLBACK_GENERATION_COUNTS;
  const qualityOptions = model.qualityOptions ?? EMPTY_QUALITY_OPTIONS;
  const outputQualityOptions =
    model.supportedOutputQualities ?? EMPTY_OUTPUT_QUALITY_OPTIONS;
  const pricingEffect = model;
  const totalCreditEstimate = estimateCreditsForEffect({
    effect: pricingEffect,
    input: {
      n: generationCount,
      quality,
      wmOutputQuality: outputQuality,
    },
  });
  const anonymousParameterSummary = ANONYMOUS_TRIAL_PARAMETER_TOKENS.join(' | ');
  const anonymousGenerateMetaLabel = isAnonymousPreviewMode
    ? anonymousTrialCount === null
      ? copy.app.anonymous.trialChecking
      : copy.app.anonymous.trialLabel.replace(
          '{count}',
          String(anonymousTrialCount)
        )
    : undefined;
  const loginCallbackUrl = useMemo(() => {
    const callbackParams = new URLSearchParams();
    callbackParams.set('model', model.id);
    if (prompt.trim()) callbackParams.set('prompt', prompt.trim());
    callbackParams.set('aspectRatio', aspectRatio);
    callbackParams.set('outputQuality', outputQuality);
    callbackParams.set('quality', quality);
    callbackParams.set('generationCount', String(generationCount));
    referenceImages.forEach((referenceImage) => {
      if (referenceImage?.url) {
        callbackParams.append('referenceImage', referenceImage.url);
      }
    });
    const callbackQuery = callbackParams.toString();
    return `${pathname || '/app'}${callbackQuery ? `?${callbackQuery}` : ''}`;
  }, [
    aspectRatio,
    generationCount,
    model.id,
    outputQuality,
    pathname,
    prompt,
    quality,
    referenceImages,
  ]);
  const anonymousContinueHref = useMemo(
    () =>
      `${getUrlWithLocale('/login', locale)}?callbackUrl=${encodeURIComponent(
        loginCallbackUrl
      )}`,
    [locale, loginCallbackUrl]
  );
  const composerNotice = useMemo<ComposerNotice | null>(() => {
    const pricingHref = getUrlWithLocale('/pricing', locale);

    if (error) {
      const isAnonymousTrialUsedError =
        error === copy.app.anonymous.usedDescription;
      const insufficientCreditsPrefix =
        copy.app.errors.insufficientCredits.split('{credits}')[0] ?? '';
      const shouldShowPricingAction =
        error.startsWith(insufficientCreditsPrefix);
      const shouldShowLoginAction =
        isAnonymousTrialUsedError ||
        error === copy.app.anonymous.referenceUploadsRequireSignIn;

      if (isAnonymousTrialUsedError) {
        return {
          tone: 'warning',
          title: copy.app.anonymous.usedTitle,
          description: copy.app.anonymous.usedDescription,
          actionHref: anonymousContinueHref,
          actionLabel: copy.app.anonymous.ctaContinue,
          secondaryActionHref: pricingHref,
          secondaryActionLabel: copy.app.anonymous.ctaFasterGeneration,
          badgeLabel: copy.app.anonymous.trialRemainingBadge.replace(
            '{count}',
            '0'
          ),
        };
      }

      return {
        tone: 'warning',
        title: error,
        actionHref: shouldShowLoginAction
          ? anonymousContinueHref
          : shouldShowPricingAction
            ? pricingHref
            : undefined,
        actionLabel: shouldShowLoginAction
          ? copy.app.anonymous.ctaContinue
          : shouldShowPricingAction
            ? copy.app.anonymous.ctaFasterGeneration
            : undefined,
      };
    }

    if (!isAnonymousPreviewMode) return null;

    const trialExhausted = anonymousTrialCount === 0;
    return {
      tone: trialExhausted ? 'warning' : 'info',
      title: trialExhausted
        ? copy.app.anonymous.usedTitle
        : copy.app.anonymous.modeTitle,
      description: trialExhausted
        ? copy.app.anonymous.usedDescription
        : copy.app.anonymous.description,
      actionHref: anonymousContinueHref,
      actionLabel: trialExhausted
        ? copy.app.anonymous.ctaContinue
        : copy.app.anonymous.ctaFreeCredits,
      secondaryActionHref: trialExhausted ? pricingHref : undefined,
      secondaryActionLabel: trialExhausted
        ? copy.app.anonymous.ctaFasterGeneration
        : undefined,
      badgeLabel:
        anonymousTrialCount === null
          ? undefined
          : copy.app.anonymous.trialRemainingBadge.replace(
              '{count}',
              String(anonymousTrialCount)
            ),
    };
  }, [
    anonymousTrialCount,
    anonymousContinueHref,
    copy.app.anonymous.ctaContinue,
    copy.app.anonymous.ctaFasterGeneration,
    copy.app.anonymous.ctaFreeCredits,
    copy.app.anonymous.description,
    copy.app.anonymous.modeTitle,
    copy.app.anonymous.referenceUploadsRequireSignIn,
    copy.app.anonymous.trialRemainingBadge,
    copy.app.anonymous.usedDescription,
    copy.app.anonymous.usedTitle,
    copy.app.errors.insufficientCredits,
    error,
    isAnonymousPreviewMode,
    locale,
  ]);

  // Gallery handoff is stored in browser sessionStorage, so it must be applied
  // after the app shell mounts.
  useEffect(() => {
    const transferPayload = readVogueAppTransferPayload();
    if (!transferPayload) {
      window.queueMicrotask(() => setTransferReady(true));
      return;
    }

    const transferModel = getModelById(transferPayload.model);
    const transferImageLimit = transferModel.mediaSchema?.image.max ?? 0;
    const transferPromptMaxChars = getGenerationPromptMaxChars({
      modelId: transferModel.id,
    });
    const nextGenerationCount = Number(transferPayload.generationCount);

    window.queueMicrotask(() => {
      setModelId(transferModel.id);
      setPrompt(
        truncatePromptToMaxChars(transferPayload.prompt, transferPromptMaxChars)
      );
      const transferRemixSchema = transferPayload.remixPromptId
        ? getPromptRemixSchema(transferPayload.remixPromptId)
        : null;
      setWorkspaceRemixPromptId(transferRemixSchema?.promptId ?? null);
      setWorkspaceRemixValues({
        ...getInitialPromptRemixValues(transferRemixSchema),
        ...(transferPayload.remixValues ?? {}),
      });
      setAspectRatio(
        transferModel.supportedAspectRatios.includes(
          transferPayload.aspectRatio as WorkspaceAspectRatio
        )
          ? (transferPayload.aspectRatio as WorkspaceAspectRatio)
          : transferModel.defaultAspectRatio
      );
      setQuality(
        transferModel.qualityOptions?.includes(
          transferPayload.quality as WorkspaceQualityOption
        )
          ? (transferPayload.quality as WorkspaceQualityOption)
          : transferModel.defaultQuality || 'medium'
      );
      setOutputQuality(
        transferModel.supportedOutputQualities?.includes(
          transferPayload.outputQuality as WorkspaceOutputQuality
        )
          ? (transferPayload.outputQuality as WorkspaceOutputQuality)
          : transferModel.defaultOutputQuality || '1k'
      );
      setGenerationCount(
        transferModel.supportedGenerationCounts?.includes(
          nextGenerationCount as WorkspaceGenerationCount
        )
          ? (nextGenerationCount as WorkspaceGenerationCount)
          : transferModel.defaultGenerationCount || 1
      );
      setReferenceImages((current) => {
        current.forEach(revokeReference);

        const slots = createEmptySlots<ReferenceImageItem>(transferImageLimit);
        const localReferenceFiles = new Map(
          transferPayload.localReferenceFiles.map((reference) => [
            reference.id,
            reference,
          ])
        );
        const transferReferenceItems =
          transferPayload.referenceImageItems.length > 0
            ? transferPayload.referenceImageItems
            : transferPayload.referenceImages.map((url) => ({
                source: 'remote' as const,
                url,
              }));

        transferReferenceItems
          .slice(0, transferImageLimit)
          .forEach((referenceImage, index) => {
            if (referenceImage.source === 'remote') {
              slots[index] = createRemoteReference(referenceImage.url);
              return;
            }

            const localReference = localReferenceFiles.get(referenceImage.id);
            if (localReference) {
              slots[index] = createLocalReferenceFromTransfer(localReference);
            }
          });

        return slots;
      });
      setTransferReady(true);
    });
  }, []);

  useEffect(() => {
    if (!isAnonymousPreviewMode) return;

    let active = true;
    const localTrialUsed = getAnonymousLocalTrialUsed();
    window.queueMicrotask(() => {
      if (active) setAnonymousTrialRemaining(localTrialUsed ? 0 : 1);
    });

    void getAnonymousTrialStatus()
      .then((response) => {
        if (!active) return;

        if (!response.ok) {
          setAnonymousTrialRemaining(localTrialUsed ? 0 : 1);
          return;
        }

        const remaining =
          typeof response.data.trialRemaining === 'number'
            ? response.data.trialRemaining
            : response.data.trialUsed
              ? 0
              : 1;
        setAnonymousTrialRemaining(remaining > 0 ? 1 : 0);
        setAnonymousLocalTrialUsed(remaining <= 0);
      })
      .catch(() => {
        if (active) {
          setAnonymousTrialRemaining(localTrialUsed ? 0 : 1);
        }
      });

    return () => {
      active = false;
    };
  }, [isAnonymousPreviewMode]);

  useEffect(() => {
    if (!isAnonymousPreviewMode) return;

    const anonymousModel = getModelById(ANONYMOUS_TRIAL_MODEL_ID);
    const anonymousImageLimit = anonymousModel.mediaSchema?.image.max ?? 0;
    window.queueMicrotask(() => {
      if (modelId !== anonymousModel.id) {
        setModelId(anonymousModel.id);
      }
      if (aspectRatio !== ANONYMOUS_TRIAL_ASPECT_RATIO) {
        setAspectRatio(ANONYMOUS_TRIAL_ASPECT_RATIO);
      }
      if (quality !== ANONYMOUS_TRIAL_QUALITY) {
        setQuality(ANONYMOUS_TRIAL_QUALITY);
      }
      if (outputQuality !== ANONYMOUS_TRIAL_OUTPUT_QUALITY) {
        setOutputQuality(ANONYMOUS_TRIAL_OUTPUT_QUALITY);
      }
      if (generationCount !== ANONYMOUS_TRIAL_GENERATION_COUNT) {
        setGenerationCount(ANONYMOUS_TRIAL_GENERATION_COUNT);
      }
      setReferenceImages((previous) =>
        previous.length === anonymousImageLimit
          ? previous
          : resizeReferenceSlots(previous, anonymousImageLimit)
      );
    });
  }, [
    aspectRatio,
    generationCount,
    isAnonymousPreviewMode,
    modelId,
    outputQuality,
    quality,
  ]);

  const invalidateCredits = useCallback(() => {
    invalidateAppCredits(queryClient, sessionUserId);
  }, [queryClient, sessionUserId]);

  const invalidateRecentAssets = useCallback(() => {
    if (!sessionUserId) return;

    void queryClient.invalidateQueries({
      queryKey: APP_QUERY_KEYS.recentAssets(sessionUserId),
    });
  }, [queryClient, sessionUserId]);

  const setActiveTimelineItemRef = useCallback(
    (node: HTMLElement | null) => {
      activeTimelineItemRef.current = node;
    },
    []
  );

  const setTimelineBottomRef = useCallback(
    (node: HTMLDivElement | null) => {
      timelineBottomRef.current = node;
    },
    []
  );

  const requestCurrentTaskScroll = useCallback((taskId: string) => {
    pendingAutoScrollTaskIdRef.current = taskId;
  }, []);

  useEffect(() => {
    const taskId = currentTask?.taskId;
    if (!taskId || pendingAutoScrollTaskIdRef.current !== taskId) return;
    if (lastAutoScrolledTaskIdRef.current === taskId) return;

    let frame = 0;
    let secondFrame = 0;
    let fallbackTimer = 0;

    const scrollToCurrentTask = () => {
      const element = activeTimelineItemRef.current;
      if (!element) {
        fallbackTimer = window.setTimeout(scrollToCurrentTask, 50);
        return;
      }

      const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;
      element.scrollIntoView({
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
        block: 'center',
        inline: 'nearest',
      });
      lastAutoScrolledTaskIdRef.current = taskId;
      pendingAutoScrollTaskIdRef.current = null;
    };

    frame = window.requestAnimationFrame(() => {
      secondFrame = window.requestAnimationFrame(scrollToCurrentTask);
    });

    return () => {
      window.cancelAnimationFrame(frame);
      window.cancelAnimationFrame(secondFrame);
      window.clearTimeout(fallbackTimer);
    };
  }, [currentTask?.taskId]);

  const setKnownCredits = useCallback(
    (currentCredits: number) => {
      setKnownAppCredits(queryClient, sessionUserId, currentCredits);
    },
    [queryClient, sessionUserId]
  );

  const precheckEffectMutation = useMutation({
    mutationFn: precheckEffect,
  });
  const generateEffectMutation = useMutation({
    mutationFn: generateEffect,
    onSettled: () => {
      invalidateCredits();
    },
  });
  const anonymousGenerateMutation = useMutation({
    mutationFn: generateAnonymousEffect,
  });

  const activeServerTask =
    currentTask &&
    !currentTask.taskId.startsWith('live-') &&
    !currentTask.isAnonymous &&
    shouldPollWorkspaceGenerationStatus(currentTask.status)
      ? currentTask
      : null;
  const activeServerTaskEffectId = activeServerTask
    ? getModelById(activeServerTask.modelId).effectId
    : null;
  const generationStatusQuery = useQuery({
    queryKey: APP_QUERY_KEYS.generationStatus(
      activeServerTask?.taskId ?? 'idle'
    ),
    queryFn: () =>
      fetchWorkspaceGenerationStatus({
        taskId: activeServerTask!.taskId,
        effectId: activeServerTaskEffectId!,
      }),
    enabled: Boolean(activeServerTask && activeServerTaskEffectId),
    refetchInterval: (query) =>
      shouldPollWorkspaceGenerationStatus(
        normalizeStatus(query.state.data?.status ?? activeServerTask?.status)
      )
        ? WORKSPACE_STATUS_POLL_INTERVAL_MS
        : false,
  });

  useEffect(() => {
    referenceImagesRef.current = referenceImages;
  }, [referenceImages]);

  useEffect(() => {
    return () => {
      referenceImagesRef.current.forEach(revokeReference);
    };
  }, []);

  useEffect(() => {
    if (
      currentTask?.status !== 'pending' &&
      currentTask?.status !== 'processing'
    ) {
      return;
    }

    const timer = window.setInterval(() => {
      setGenerationProgressNowMs(Date.now());
    }, 1000);

    return () => window.clearInterval(timer);
  }, [currentTask?.status, currentTask?.taskId]);

  useEffect(() => {
    if (!activeServerTask?.taskId || !generationStatusQuery.data) return;

    const data = generationStatusQuery.data;
    const nextStatus = normalizeStatus(data.status);
    const nextUrls = readOutputImageUrls(data.output);
    const [nextUrl] = nextUrls;
    window.queueMicrotask(() => {
      setCurrentTask((previous) =>
        previous?.taskId === activeServerTask.taskId
          ? {
              ...previous,
              status: nextStatus,
              mediaUrl: nextUrl || previous.mediaUrl,
              mediaUrls: nextUrls.length > 0 ? nextUrls : previous.mediaUrls,
            }
          : previous
      );

      if (nextStatus === 'failed') {
        setError(data.error || copy.app.errors.generationFailed);
      }
      if (nextStatus === 'succeeded' || nextStatus === 'failed') {
        invalidateRecentAssets();
        invalidateCredits();
      }
    });
  }, [
    activeServerTask?.taskId,
    copy.app.errors.generationFailed,
    generationStatusQuery.data,
    invalidateCredits,
    invalidateRecentAssets,
  ]);

  useEffect(() => {
    if (!activeServerTask?.taskId || !generationStatusQuery.isError) return;

    window.queueMicrotask(() => {
      setError(copy.app.errors.refreshFailed);
    });
  }, [
    activeServerTask?.taskId,
    copy.app.errors.refreshFailed,
    generationStatusQuery.isError,
  ]);

  const applyModel = (nextModelId: string) => {
    const nextModel = getModelById(nextModelId);
    const nextImageSlotLimit = nextModel.mediaSchema?.image.max ?? 0;
    setModelId(nextModel.id);
    setAspectRatio(nextModel.defaultAspectRatio);
    setQuality(nextModel.defaultQuality || 'medium');
    setOutputQuality(nextModel.defaultOutputQuality || '1k');
    setGenerationCount(nextModel.defaultGenerationCount || 1);
    setReferenceImages((previous) =>
      resizeReferenceSlots(previous, nextImageSlotLimit)
    );
    setPrompt((value) =>
      truncatePromptToMaxChars(
        value,
        getGenerationPromptMaxChars({ modelId: nextModel.id })
      )
    );
  };

  const handlePromptChange = (value: string) => {
    setPrompt(truncatePromptToMaxChars(value, promptMaxChars));
    setError(null);
  };

  const handleFilesSelected = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    event.target.value = '';
    if (files.length === 0) return;

    const incoming: ReferenceImageItem[] = [];
    for (const file of files) {
      const validation = validateUploadedImageFile(file);
      if (!validation.ok) {
      setError(
        validation.code === 'IMAGE_TOO_LARGE'
          ? copy.app.errors.referenceTooLarge.replace(
              '{maxSize}',
              formatBytes(validation.maxBytes)
            )
          : copy.app.errors.referenceType
      );
        incoming.forEach(revokeReference);
        return;
      }
      const objectUrl = URL.createObjectURL(file);
      incoming.push({
        source: 'local',
        url: objectUrl,
        objectUrl,
        file,
        name: file.name,
      });
    }

    const result = appendItemsToAvailableSlots({
      current: referenceImages,
      incoming,
      limit: imageSlotLimit,
    });
    if (!result.ok) {
      incoming.forEach(revokeReference);
      setError(
        result.availableSlots > 0
          ? copy.app.errors.limitedReferenceSlots
              .replace('{count}', String(result.availableSlots))
              .replace('{plural}', result.availableSlots > 1 ? 's' : '')
              .replace('{verb}', result.availableSlots > 1 ? 'are' : 'is')
          : copy.app.errors.noReferenceSlots
      );
      return;
    }
    setError(null);
    setReferenceImages(fillSlots(result.next, imageSlotLimit));
  };

  const removeReferenceImage = (index: number) => {
    setReferenceImages((previous) => {
      const next = [...previous];
      revokeReference(next[index] ?? null);
      next[index] = null;
      return fillSlots(next, imageSlotLimit);
    });
  };

  const addReferenceFromUrl = (url: string) => {
    const result = appendItemsToAvailableSlots({
      current: referenceImages,
      incoming: [createRemoteReference(url)],
      limit: imageSlotLimit,
    });
    if (!result.ok) {
      setError(copy.app.errors.noReferenceSlots);
      return;
    }
    setReferenceImages(fillSlots(result.next, imageSlotLimit));
    setError(null);
  };

  const uploadReferences = async () => {
    const next = [...referenceImages];
    const uploadedUrls: string[] = [];

    for (const [index, item] of next.entries()) {
      if (!item) continue;
      if (item.source === 'remote' || !item.file) {
        uploadedUrls.push(item.url);
        continue;
      }

      const upload = await uploadFileFromBrowser(
        item.file,
        model.uploadPath,
        model.imageBucketName
      );
      revokeReference(item);
      next[index] = createRemoteReference(upload.url);
      uploadedUrls.push(upload.url);
    }

    setReferenceImages(fillSlots(next, imageSlotLimit));
    return uploadedUrls;
  };

  const buildInput = (imageUrls: string[]) => {
    const mediaInput = model.mediaSchema
      ? buildWorkspaceMediaInput({
          mediaSchema: model.mediaSchema,
          imageSlotUrls: fillSlots(imageUrls, imageSlotLimit),
          videoSlotUrls: [],
          audioSlotUrls: [],
        })
      : { imageUrls };

    return {
      prompt: prompt.trim(),
      ...(mediaInput.imageUrls.length > 0
        ? { image_urls: mediaInput.imageUrls }
        : {}),
      aspect_ratio: aspectRatio,
      quality,
      wmOutputQuality: outputQuality,
      n: generationCount,
    };
  };

  const pollAnonymousStatus = async ({
    wmTaskId,
    statusToken,
  }: {
    wmTaskId: string;
    statusToken: string;
  }) => {
    for (let attempt = 0; attempt < ANONYMOUS_STATUS_POLL_ATTEMPTS; attempt += 1) {
      if (attempt > 0) {
        await wait(ANONYMOUS_STATUS_POLL_INTERVAL_MS);
      }

      const response = await getAnonymousEffectStatus({
        statusToken,
      });
      if (!response.ok) {
        throw new Error(response.data.error || copy.app.errors.refreshFailed);
      }

      const nextStatus = normalizeStatus(response.data.status);
      const mediaUrls = readOutputImageUrls(response.data.output);
      const [mediaUrl] = mediaUrls;
      if (nextStatus === 'succeeded') {
        const anonymousRevealReadyAtMs =
          Date.now() + ANONYMOUS_STANDARD_REVEAL_DELAY_MS;
        setCurrentTask((previous) =>
          previous?.taskId === wmTaskId
            ? {
                ...previous,
                status: 'processing',
              }
            : previous
        );
        await wait(anonymousRevealReadyAtMs - Date.now());
        setCurrentTask((previous) =>
          previous?.taskId === wmTaskId
            ? {
                ...previous,
                status: 'succeeded',
                mediaUrl: mediaUrl || previous.mediaUrl,
                mediaUrls:
                  mediaUrls.length > 0 ? mediaUrls : previous.mediaUrls,
              }
            : previous
        );
        return;
      }

      setCurrentTask((previous) =>
        previous?.taskId === wmTaskId
          ? {
              ...previous,
              status: nextStatus,
              mediaUrl: mediaUrl || previous.mediaUrl,
              mediaUrls:
                mediaUrls.length > 0 ? mediaUrls : previous.mediaUrls,
            }
          : previous
      );

      if (nextStatus === 'failed') {
        throw new Error(response.data.error || copy.app.errors.generationFailed);
      }
    }

    throw new Error(copy.app.errors.refreshFailed);
  };

  const generateAnonymous = async (trimmedPrompt: string) => {
    if (anonymousTrialCount === null) return;
    if (anonymousTrialCount === 0) {
      setError(copy.app.anonymous.usedDescription);
      return;
    }

    const hasLocalReferenceImage = referenceImages.some(
      (referenceImage) => referenceImage?.source === 'local'
    );
    if (hasLocalReferenceImage) {
      setError(copy.app.anonymous.referenceUploadsRequireSignIn);
      return;
    }

    setLoading(true);
    setError(null);

    const createdAt = new Date().toISOString();
    const provisionalTaskId = `anonymous-${Date.now()}`;
    let activeTaskId = provisionalTaskId;
    const submittedGenerationTiming = getSubmittedGenerationTiming({
      accessTier: 'standard',
      modelId: ANONYMOUS_TRIAL_MODEL_ID,
      outputQuality: ANONYMOUS_TRIAL_OUTPUT_QUALITY,
      quality: ANONYMOUS_TRIAL_QUALITY,
    });

    try {
      requestCurrentTaskScroll(provisionalTaskId);
      setResultFilter('all');
      setCurrentTask({
        ...createOptimisticWorkspaceTask({
          id: provisionalTaskId,
          prompt: trimmedPrompt,
          modelId: ANONYMOUS_TRIAL_MODEL_ID,
          modelLabel: getModelById(ANONYMOUS_TRIAL_MODEL_ID).name,
          paramsLabel: anonymousParameterSummary,
          createdAt,
          ...submittedGenerationTiming,
        }),
        isAnonymous: true,
      });

      const anonymousReferenceImageUrls = referenceImages.flatMap(
        (referenceImage) =>
          referenceImage?.source === 'remote' ? [referenceImage.url] : []
      );
      const response = await anonymousGenerateMutation.mutateAsync({
        input: {
          prompt: trimmedPrompt,
          ...(anonymousReferenceImageUrls.length > 0
            ? { image_urls: anonymousReferenceImageUrls }
            : {}),
        },
      });

      if (response.status === 429) {
        setAnonymousTrialRemaining(0);
        setAnonymousLocalTrialUsed(true);
      }

      if (!response.ok) {
        throw new Error(
          response.data.error || copy.app.errors.generationFailed
        );
      }

      setAnonymousTrialRemaining(0);
      setAnonymousLocalTrialUsed(true);

      const wmTaskId = resolveWmTaskId(response.data) ?? provisionalTaskId;
      const providerTaskId =
        response.data.providerTaskId ??
        getProviderTaskIdFromOutput(response.data.output);
      const statusToken =
        typeof response.data.statusToken === 'string'
          ? response.data.statusToken
          : null;
      activeTaskId = wmTaskId;
      const nextStatus = normalizeStatus(response.data.status);
      const mediaUrls = readOutputImageUrls(response.data.output);
      const [mediaUrl] = mediaUrls;
      const visibleNextStatus =
        nextStatus === 'succeeded' ? 'processing' : nextStatus;
      const visibleMediaUrl = nextStatus === 'succeeded' ? null : mediaUrl;
      const visibleMediaUrls = nextStatus === 'succeeded' ? [] : mediaUrls;

      setCurrentTask((previous) =>
        previous
          ? {
              ...reconcileOptimisticWorkspaceTask({
                task: previous,
                provisionalTaskId,
                generationId: wmTaskId,
                status: visibleNextStatus,
                mediaUrl: visibleMediaUrl ?? null,
                mediaUrls: visibleMediaUrls,
              }),
              isAnonymous: true,
            }
          : {
              id: wmTaskId,
              taskId: wmTaskId,
              status: visibleNextStatus,
              prompt: trimmedPrompt,
              modelId: ANONYMOUS_TRIAL_MODEL_ID,
              modelLabel: getModelById(ANONYMOUS_TRIAL_MODEL_ID).name,
              paramsLabel: anonymousParameterSummary,
              assetType: 'image',
              mediaUrl: visibleMediaUrl ?? null,
              mediaUrls: visibleMediaUrls,
              createdAt,
              ...submittedGenerationTiming,
              isAnonymous: true,
            }
      );

      if (nextStatus === 'failed') {
        throw new Error(response.data.error || copy.app.errors.generationFailed);
      }
      if (nextStatus === 'succeeded') {
        const anonymousRevealReadyAtMs =
          Date.now() + ANONYMOUS_STANDARD_REVEAL_DELAY_MS;
        await wait(anonymousRevealReadyAtMs - Date.now());
        setCurrentTask((previous) =>
          previous?.taskId === wmTaskId
            ? {
                ...previous,
                status: 'succeeded',
                mediaUrl: mediaUrl || previous.mediaUrl,
                mediaUrls:
                  mediaUrls.length > 0 ? mediaUrls : previous.mediaUrls,
              }
            : previous
        );
        return;
      }
      if (nextStatus === 'pending' || nextStatus === 'processing') {
        if (!providerTaskId || !statusToken) {
          throw new Error(copy.app.errors.refreshFailed);
        }
        await pollAnonymousStatus({ wmTaskId, statusToken });
      }
    } catch (generateError) {
      const message =
        generateError instanceof Error
          ? generateError.message
          : copy.app.errors.generationFailed;
      setError(message);
      setCurrentTask((previous) =>
        previous &&
        (previous.taskId === provisionalTaskId || previous.taskId === activeTaskId)
          ? {
              ...previous,
              status: 'failed',
              isAnonymous: true,
            }
          : previous
      );
    } finally {
      setLoading(false);
    }
  };

  const redirectToLogin = () => {
    window.location.href = anonymousContinueHref;
  };

  const generate = async () => {
    const validation = validateGenerationPrompt(prompt, {
      maxChars: promptMaxChars,
      required: true,
    });
    if (!validation.ok) {
      setError(
        validation.code === 'PROMPT_TOO_LONG'
          ? copy.app.errors.promptTooLong.replace(
              '{maxChars}',
              String(validation.maxChars)
            )
          : copy.app.errors.promptRequired
      );
      return;
    }

    if (isSessionPending || !hasHydrated) {
      return;
    }

    if (!session?.user) {
      await generateAnonymous(validation.trimmedPrompt);
      return;
    }

    const estimatedRequiredCredits = Math.ceil(totalCreditEstimate);
    const hasKnownInsufficientCredits =
      credits !== null && credits < estimatedRequiredCredits;
    if (hasKnownInsufficientCredits) {
      setError(
        copy.app.errors.insufficientCredits.replace(
          '{credits}',
          String(estimatedRequiredCredits)
        )
      );
      return;
    }

    setLoading(true);
    setError(null);

    const createdAt = new Date().toISOString();
    const provisionalTaskId = `live-${Date.now()}`;
    let activeTaskId = provisionalTaskId;
    let hasOptimisticTask = false;
    const submittedGenerationTiming = getSubmittedGenerationTiming({
      accessTier: generationAccessTier,
      modelId: model.id,
      outputQuality,
      quality,
    });

    try {
      const precheckInput = buildInput([]);
      const precheckResponse = await precheckEffectMutation.mutateAsync({
        effectId: model.effectId,
        input: precheckInput,
      });
      const precheck = precheckResponse.data;
      if (precheckResponse.status === 401) {
        redirectToLogin();
        return;
      }
      if (!precheckResponse.ok) {
        setError(
          precheck?.error ||
            copy.app.errors.insufficientCredits.replace(
              '{credits}',
              String(precheck?.requiredCredits ?? totalCreditEstimate)
            )
        );
        if (typeof precheck?.currentCredits === 'number') {
          setKnownCredits(precheck.currentCredits);
        }
        return;
      }

      requestCurrentTaskScroll(provisionalTaskId);
      setResultFilter('all');
      setCurrentTask(
        createOptimisticWorkspaceTask({
          id: provisionalTaskId,
          prompt: validation.trimmedPrompt,
          modelId: model.id,
          modelLabel: model.name,
          paramsLabel: formatParamsLabel({
            aspectRatio,
            outputQuality,
            quality,
            generationCount,
            copy,
          }),
          createdAt,
          ...submittedGenerationTiming,
        })
      );
      hasOptimisticTask = true;

      const uploadedReferenceUrls = await uploadReferences();
      const input = buildInput(uploadedReferenceUrls);
      const response = await generateEffectMutation.mutateAsync({
        effectId: model.effectId,
        input,
      });
      const data = response.data;
      if (response.status === 401) {
        redirectToLogin();
        return;
      }
      if (!response.ok) {
        throw new Error(data.error || copy.app.errors.generationFailed);
      }

      const taskId = data.generationId ?? crypto.randomUUID();
      activeTaskId = taskId;
      const nextStatus = normalizeStatus(data.status);
      const mediaUrls = readOutputImageUrls(data.output);
      const [mediaUrl] = mediaUrls;
      const fallbackTask: WorkspaceAssetItem = {
        id: taskId,
        taskId,
        status: nextStatus,
        prompt: validation.trimmedPrompt,
        modelId: model.id,
        modelLabel: model.name,
        paramsLabel: formatParamsLabel({
          aspectRatio,
          outputQuality,
          quality,
          generationCount,
          copy,
        }),
        assetType: 'image',
        mediaUrl: mediaUrl ?? null,
        mediaUrls,
        createdAt,
        ...submittedGenerationTiming,
      };
      setCurrentTask((previous) =>
        previous
          ? reconcileOptimisticWorkspaceTask({
              task: previous,
              provisionalTaskId,
              generationId: taskId,
              status: nextStatus,
              mediaUrl: mediaUrl ?? null,
              mediaUrls,
            })
          : fallbackTask
      );
      if (nextStatus === 'succeeded') {
        invalidateRecentAssets();
      }
      invalidateCredits();
    } catch (generateError) {
      const message =
        generateError instanceof Error
          ? generateError.message
          : copy.app.errors.generationFailed;
      setError(message);
      if (hasOptimisticTask) {
        setCurrentTask((previous) =>
          previous &&
          (previous.taskId === provisionalTaskId ||
            previous.taskId === activeTaskId)
            ? {
                ...previous,
                status: 'failed',
              }
            : previous
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generateRef.current = generate;
  });

  useEffect(() => {
    if (!initialAutoStart || hasAutoStartedRef.current || loading || !transferReady) {
      return;
    }

    if (isSessionPending || !hasHydrated) {
      return;
    }

    if (isAnonymousPreviewMode && anonymousTrialCount === null) {
      return;
    }

    if (!promptValidation.ok) {
      hasAutoStartedRef.current = true;
      removeAutoStartSearchParam();
      return;
    }

    if (isAnonymousPreviewMode && anonymousTrialCount === 0) {
      hasAutoStartedRef.current = true;
      removeAutoStartSearchParam();
      window.queueMicrotask(() => setError(copy.app.anonymous.usedDescription));
      return;
    }

    hasAutoStartedRef.current = true;
    removeAutoStartSearchParam();
    window.queueMicrotask(() => {
      void generateRef.current?.();
    });
  }, [
    anonymousTrialCount,
    copy.app.anonymous.usedDescription,
    hasHydrated,
    initialAutoStart,
    isAnonymousPreviewMode,
    isSessionPending,
    loading,
    promptValidation.ok,
    transferReady,
  ]);

  const visibleAssets = useMemo(() => {
    return mergeWorkspaceTimelineAssets({ currentTask, recentAssets });
  }, [currentTask, recentAssets]);
  const timelineItems = useMemo(
    () =>
      resultFilter === 'all'
        ? visibleAssets
        : visibleAssets.filter((item) => item.assetType === resultFilter),
    [resultFilter, visibleAssets]
  );

  useEffect(() => {
    if (hasScrolledInitialTimelineRef.current) return;
    if (!recentAssetsQuery.isSuccess) return;
    if (timelineItems.length === 0) return;
    if (pendingAutoScrollTaskIdRef.current) return;

    let frame = 0;
    let secondFrame = 0;
    let fallbackTimer = 0;

    const scrollToTimelineBottom = () => {
      const element = timelineBottomRef.current;
      if (!element) {
        fallbackTimer = window.setTimeout(scrollToTimelineBottom, 50);
        return;
      }

      element.scrollIntoView({
        behavior: 'auto',
        block: 'end',
        inline: 'nearest',
      });
      hasScrolledInitialTimelineRef.current = true;
    };

    frame = window.requestAnimationFrame(() => {
      secondFrame = window.requestAnimationFrame(scrollToTimelineBottom);
    });

    return () => {
      window.cancelAnimationFrame(frame);
      window.cancelAnimationFrame(secondFrame);
      window.clearTimeout(fallbackTimer);
    };
  }, [recentAssetsQuery.isSuccess, timelineItems.length]);

  const composerModels = useMemo<VogueComposerModel[]>(
    () =>
      IMAGE_WORKSPACE_MODELS.map((item) => ({
        id: item.id,
        name: item.name,
        iconPath: getModelIconPathByModelId(item.id),
        description: getVogueWorkspaceModelDescription(copy, item.id),
      })),
    [copy]
  );

  const referenceItems = useMemo<VogueComposerReferenceItem[]>(
    () =>
      referenceImages.flatMap((item, index) =>
        item
          ? [
              {
                id: String(index),
                url: item.url,
                name: item.name,
              },
            ]
          : []
      ),
    [referenceImages]
  );

  const handleGenerationCountChange = useCallback(
    (value: string) =>
      setGenerationCount(Number(value) as WorkspaceGenerationCount),
    [setGenerationCount]
  );
  const handleAspectRatioChange = useCallback(
    (value: string) => setAspectRatio(value as WorkspaceAspectRatio),
    [setAspectRatio]
  );
  const handleOutputQualityChange = useCallback(
    (value: string) => setOutputQuality(value as WorkspaceOutputQuality),
    [setOutputQuality]
  );
  const handleQualityChange = useCallback(
    (value: string) => setQuality(value as WorkspaceQualityOption),
    [setQuality]
  );

  const composerParameters = useMemo<VogueComposerParameter[]>(
    () => [
      {
        id: 'aspectRatio',
        label: copy.app.parameterLabels.aspectRatio,
        value: aspectRatio,
        options: model.supportedAspectRatios,
        onChange: handleAspectRatioChange,
      },
      {
        id: 'outputQuality',
        label: copy.app.parameterLabels.resolution,
        value: outputQuality,
        options: outputQualityOptions,
        formatLabel: (value) => value.toUpperCase(),
        onChange: handleOutputQualityChange,
      },
      {
        id: 'quality',
        label: copy.app.parameterLabels.quality,
        value: quality,
        options: qualityOptions,
        onChange: handleQualityChange,
      },
      {
        id: 'generationCount',
        label: copy.app.parameterLabels.imageNumber,
        value: String(generationCount),
        options: supportedGenerationCounts.map(String),
        formatLabel: (value) => `${value}x`,
        onChange: handleGenerationCountChange,
      },
    ],
    [
      aspectRatio,
      copy,
      generationCount,
      handleAspectRatioChange,
      handleGenerationCountChange,
      handleOutputQualityChange,
      handleQualityChange,
      model.supportedAspectRatios,
      outputQuality,
      outputQualityOptions,
      quality,
      qualityOptions,
      supportedGenerationCounts,
    ]
  );

  return (
    <main className="flex min-h-screen flex-col bg-[var(--vogue-page)] text-slate-950">
      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-3 px-3 py-3 sm:gap-4 sm:px-6 sm:py-6 lg:px-8">
        <section className="flex min-h-0 flex-1 flex-col gap-3 sm:gap-4">
          <div className="flex items-center justify-between gap-3 sm:gap-4">
            <div className="flex flex-wrap items-center gap-5 sm:gap-8">
              {(['all', 'video', 'image'] as const).map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setResultFilter(filter)}
                  className={`inline-flex h-9 items-center justify-center border-b text-[14px] font-semibold tracking-normal transition-colors sm:h-10 sm:text-[15px] ${
                    resultFilter === filter
                      ? 'border-slate-950 text-slate-950'
                      : 'border-transparent text-slate-500 hover:text-slate-950'
                  }`}
                >
                  {copy.app.filters[filter]}
                </button>
              ))}
            </div>

            <a
              href={assetsHref}
              aria-label={copy.app.assets}
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-[14px] border border-slate-200 bg-white/82 px-0 text-[14px] font-semibold text-slate-700 shadow-[0_12px_28px_rgba(72,92,130,0.08)] transition hover:border-slate-300 hover:bg-white hover:text-slate-950 sm:h-11 sm:w-auto sm:rounded-[18px] sm:px-4 sm:text-[15px]"
            >
              <GalleryVerticalEnd className="h-4 w-4" />
              <span className="sr-only sm:not-sr-only">{copy.app.assets}</span>
            </a>
          </div>

          <WorkspaceTimeline
            items={timelineItems}
            currentTask={currentTask}
            activeItemRef={setActiveTimelineItemRef}
            bottomRef={setTimelineBottomRef}
            locale={locale}
            copy={copy}
            nowMs={generationProgressNowMs}
            onPreview={setPreviewItem}
            onUsePrompt={handlePromptChange}
            onUseReference={addReferenceFromUrl}
            emptyMessage={copy.app.emptyHistory}
          />
        </section>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        multiple
        className="hidden"
        onChange={handleFilesSelected}
      />

      <div className="sticky bottom-0 z-40 bg-gradient-to-t from-[var(--vogue-page)] via-[rgba(244,248,255,0.92)] to-transparent px-3 pb-[calc(5.25rem+env(safe-area-inset-bottom))] pt-3 backdrop-blur-md sm:px-4 sm:pb-3 sm:pt-5 lg:px-6">
        <div className="mx-auto max-w-7xl">
          <ComposerNoticeRail notice={composerNotice} />
          <VoguePromptComposer
            variant="workspace"
            prompt={prompt}
            onPromptChange={handlePromptChange}
            remixSchema={workspaceRemixSchema}
            remixValues={workspaceRemixValues}
            onRemixValuesChange={setWorkspaceRemixValues}
            promptCharacterCount={promptCharCount}
            promptMaxChars={promptMaxChars}
            placeholder={copy.app.promptPlaceholder}
            models={composerModels}
            selectedModelId={model.id}
            onSelectedModelIdChange={applyModel}
            referenceItems={referenceItems}
            maxReferenceImages={imageSlotLimit}
            addReferenceLabel={copy.app.addReference}
            onAddReference={
              !isAnonymousPreviewMode && imageSlotLimit > 0
                ? () => fileInputRef.current?.click()
                : undefined
            }
            onRemoveReference={isAnonymousPreviewMode ? undefined : (id) => removeReferenceImage(Number(id))}
            parameters={composerParameters}
            credits={
              isAnonymousPreviewMode
                ? undefined
                : {
                    available: credits,
                    estimate: totalCreditEstimate,
                  }
            }
            onGenerate={generate}
            generateDisabled={
              !promptValidation.ok ||
              (isAnonymousPreviewMode &&
                (anonymousTrialCount === null || anonymousTrialCount === 0))
            }
            generateDisabledLabel={
              isAnonymousPreviewMode && anonymousTrialCount === 0
                ? copy.app.anonymous.usedTitle
                : undefined
            }
            modelLocked={isAnonymousPreviewMode}
            lockedParameterSummary={anonymousParameterSummary}
            lockedParameterTitle={
              isAnonymousPreviewMode
                ? copy.app.anonymous.parameterTitle
                : undefined
            }
            lockedControlsShowIcon={!isAnonymousPreviewMode}
            generateMetaLabel={anonymousGenerateMetaLabel}
            isGenerating={loading}
            attachedStatusBar={Boolean(composerNotice)}
            mobileCompact
          />
        </div>
      </div>

      {previewItem ? (
        <AssetPreviewOverlay
          item={previewItem}
          owner={{
            name: ownerName,
            image: ownerImage,
          }}
          copy={copy}
          locale={locale}
          onUsePrompt={(value) => {
            handlePromptChange(value);
          }}
          onUseAsReference={(url) => {
            addReferenceFromUrl(url);
          }}
          onClose={() => setPreviewItem(null)}
        />
      ) : null}
    </main>
  );
}

export default function ImageWorkspace() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[var(--vogue-page)] text-slate-950">
          <Loader2 className="h-6 w-6 animate-spin text-[#4f67ff]" />
        </main>
      }
    >
      <WorkspaceContent />
    </Suspense>
  );
}
