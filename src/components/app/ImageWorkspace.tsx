'use client';

import { authClient } from '@/lib/auth-client';
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
import { readVogueAppTransferPayload } from '@/lib/app/composer-transfer';
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
  getAnonymousEffectStatus,
  getAnonymousTrialStatus,
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
  Copy,
  Download,
  GalleryVerticalEnd,
  ImageIcon,
  Loader2,
  Maximize2,
  RefreshCw,
  Sparkles,
  X,
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

type GenerateResponse = {
  error?: string;
  output?: unknown;
  generationId?: string;
  wmTaskId?: string;
  providerTaskId?: string;
  status?: string;
  creditsUsed?: number;
  trialUsed?: boolean;
  trialRemaining?: number;
};

const FALLBACK_GENERATION_COUNTS: WorkspaceGenerationCount[] = [1];
const EMPTY_QUALITY_OPTIONS: WorkspaceQualityOption[] = [];
const EMPTY_OUTPUT_QUALITY_OPTIONS: WorkspaceOutputQuality[] = [];
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

const readStringField = (value: unknown, key: string) => {
  if (!value || typeof value !== 'object') return null;
  const record = value as Record<string, unknown>;
  return typeof record[key] === 'string' && record[key] ? record[key] : null;
};

const getProviderTaskIdFromOutput = (output: unknown) =>
  readStringField(output, 'providerTaskId') ?? readStringField(output, 'taskId');

const getSelectedProviderFromOutput = (output: unknown) =>
  readStringField(output, 'selectedProvider');

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

function AssetTile({
  item,
  active,
  locale,
  copy,
  nowMs,
  onPreview,
  onUsePrompt,
  onUseReference,
}: {
  item: WorkspaceAssetItem;
  active?: boolean;
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
  const itemStandardGenerationSeconds =
    item.standardGenerationSeconds ?? item.expectedGenerationSeconds ?? null;
  const itemFasterGenerationSeconds =
    item.fasterGenerationSeconds ?? item.expectedGenerationSeconds ?? null;
  const shouldShowGenerationTimeComparison =
    typeof itemStandardGenerationSeconds === 'number' &&
    typeof itemFasterGenerationSeconds === 'number' &&
    itemStandardGenerationSeconds > itemFasterGenerationSeconds;
  const expectedGenerationSeconds =
    itemGenerationAccessTier === 'faster'
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

  return (
    <article
      className={`grid gap-4 rounded-[26px] border bg-white/74 p-4 shadow-[0_18px_52px_rgba(72,92,130,0.09)] md:grid-cols-[280px_minmax(0,1fr)] ${
        active ? 'border-slate-950' : 'border-slate-200'
      }`}
    >
      <button
        type="button"
        disabled={!item.mediaUrl}
        onClick={() => onPreview(item)}
        className="group relative flex h-[240px] w-full items-center justify-center overflow-hidden rounded-[22px] bg-white/82 text-slate-500 disabled:cursor-default"
      >
        {item.mediaUrl ? (
          <Image
            src={item.mediaUrl}
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
        {item.mediaUrl ? (
          <span className="pointer-events-none absolute right-2 top-2 flex h-8 w-8 scale-95 items-center justify-center rounded-full bg-slate-950/55 text-white opacity-0 shadow-[0_12px_26px_rgba(15,23,42,0.2)] backdrop-blur-md transition duration-200 group-hover:scale-100 group-hover:opacity-100 group-focus-visible:scale-100 group-focus-visible:opacity-100">
            <Maximize2 className="h-3.5 w-3.5" />
          </span>
        ) : null}
      </button>
      <div className="flex min-w-0 flex-col justify-between gap-4">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700">
              {item.modelLabel || copy.app.imageModel}
            </span>
            <span
              className={`shrink-0 rounded-full border px-3 py-1 text-xs font-semibold ${
                item.status === 'succeeded'
                  ? 'border-emerald-100 bg-emerald-50 text-emerald-700'
                  : item.status === 'failed'
                    ? 'border-red-100 bg-red-50 text-red-700'
                    : 'border-blue-100 bg-blue-50 text-blue-700'
              }`}
            >
              {getStatusLabel(item.status, copy)}
            </span>
          </div>

          <div
            className="rounded-[18px] border border-slate-200/70 bg-white/66"
            title={item.prompt ?? undefined}
          >
            <p
              className="h-36 overflow-y-auto px-4 py-3 pr-3 text-[15px] font-semibold leading-6 text-slate-900 [scrollbar-color:rgba(100,116,139,0.7)_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-400/70 [&::-webkit-scrollbar-track]:bg-transparent"
            >
              {promptText}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="space-y-1 text-xs text-slate-500">
            <p>{formatDate(item.createdAt, locale)}</p>
            <p>{item.paramsLabel || copy.app.generatedAsset}</p>
            {taskProgress ? (
              <div className="w-full min-w-[220px] max-w-[360px] space-y-1.5 pt-1">
                <div className="h-1.5 overflow-hidden rounded-full border border-[#dfe6ff] bg-slate-100">
                  <div
                    className="h-full rounded-full bg-[linear-gradient(90deg,#4f67ff,#9daeff)] transition-[width] duration-1000 ease-linear"
                    style={{ width: `${taskProgress.percent}%` }}
                  />
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
                <div className="flex min-h-5 flex-wrap items-center gap-2 text-[11px] font-semibold leading-none text-slate-500">
                  {itemGenerationAccessTier === 'faster' ? (
                    <>
                      <span className="inline-flex items-center gap-1 rounded-full border border-[#dfe6ff] bg-[#f0f4ff] px-2 py-1 text-[#4f67ff]">
                        <Sparkles className="h-3 w-3" />
                        {copy.app.progress.fasterActive}
                      </span>
                      {shouldShowGenerationTimeComparison ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2 py-1">
                          <span className="line-through decoration-slate-400">
                            {itemStandardGenerationSeconds}s
                          </span>
                          <span className="text-slate-900">
                            {itemFasterGenerationSeconds}s
                          </span>
                        </span>
                      ) : null}
                    </>
                  ) : (
                    <>
                      {typeof itemStandardGenerationSeconds === 'number' ? (
                        <span className="rounded-full bg-slate-100 px-2 py-1">
                          {copy.app.progress.estimated}{' '}
                          {itemStandardGenerationSeconds}s
                        </span>
                      ) : null}
                      <a
                        href={getUrlWithLocale('/pricing', locale)}
                        className="rounded-full border border-[#dfe6ff] bg-white px-2 py-1 text-[#4f67ff] transition hover:border-[#4f67ff]/40 hover:bg-[#f0f4ff]"
                      >
                        {copy.app.progress.upgradeCta}
                      </a>
                    </>
                  )}
                </div>
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
                disabled={!item.mediaUrl}
                onClick={() => item.mediaUrl && onUseReference(item.mediaUrl)}
                className="flex h-9 items-center justify-center rounded-[10px] border border-slate-200 bg-white px-3 text-slate-600 transition hover:border-slate-400 hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label={copy.app.tooltips.regenerate}
              >
                <RefreshCw className="h-4 w-4" />
              </button>
              <ActionTooltip label={copy.app.tooltips.regenerate} />
            </span>
            <span className="group/action relative inline-flex">
              <a
                href={`/api/assets/download?taskId=${encodeURIComponent(
                  item.taskId
                )}`}
                className={`flex h-9 items-center justify-center rounded-[10px] border border-slate-200 bg-white px-3 text-slate-600 transition hover:border-slate-400 hover:text-slate-950 ${
                  item.mediaUrl ? '' : 'pointer-events-none opacity-40'
                }`}
                aria-label={copy.app.tooltips.download}
                aria-disabled={!item.mediaUrl}
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
              locale={locale}
              copy={copy}
              nowMs={nowMs}
              onPreview={onPreview}
              onUsePrompt={onUsePrompt}
              onUseReference={onUseReference}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-[22px] border border-dashed border-slate-300/90 bg-white/38 px-4 py-8 text-center text-[14px] font-medium text-slate-500">
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
  const [recentAssets, setRecentAssets] = useState<WorkspaceAssetItem[]>([]);
  const [currentTask, setCurrentTask] = useState<WorkspaceAssetItem | null>(
    null
  );
  const [generationProgressNowMs, setGenerationProgressNowMs] = useState(() =>
    Date.now()
  );
  const [serverGenerationAccessTier, setServerGenerationAccessTier] =
    useState<GenerationAccessTier | null>(null);
  const [credits, setCredits] = useState<number | null>(null);
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
  const sessionUser = session?.user as
    | ({ subscriptionState?: unknown } & Record<string, unknown>)
    | undefined;
  const userSubscriptionState =
    typeof sessionUser?.subscriptionState === 'string'
      ? sessionUser.subscriptionState
      : null;
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
  const visibleGenerationSeconds = resolveWorkspaceGenerationTimeEstimateForTier({
    accessTier: generationAccessTier,
    assetType: 'image',
    modelId: isAnonymousPreviewMode ? ANONYMOUS_TRIAL_MODEL_ID : model.id,
    outputQuality: isAnonymousPreviewMode
      ? ANONYMOUS_TRIAL_OUTPUT_QUALITY
      : outputQuality,
    quality: isAnonymousPreviewMode ? ANONYMOUS_TRIAL_QUALITY : quality,
  });
  const generationEtaLabel = `${copy.app.progress.estimated} ${visibleGenerationSeconds}s`;

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
        transferPayload.referenceImages
          .slice(0, transferImageLimit)
          .forEach((referenceImage, index) => {
            slots[index] = createRemoteReference(referenceImage);
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

  const refreshCredits = useCallback(async () => {
    const response = await fetch('/api/user/credits', { cache: 'no-store' });
    if (!response.ok) return;
    const data = (await response.json()) as {
      currentCredits?: number;
      authenticated?: boolean;
      generationAccessTier?: GenerationAccessTier;
    };
    if (data.authenticated && typeof data.currentCredits === 'number') {
      setCredits(data.currentCredits);
      setServerGenerationAccessTier(
        data.generationAccessTier === 'faster' ? 'faster' : 'standard'
      );
    }
  }, [setCredits, setServerGenerationAccessTier]);

  const refreshRecentAssets = useCallback(async () => {
    if (!session?.user?.id) return;
    const response = await fetch('/api/assets/recent', { cache: 'no-store' });
    if (!response.ok) return;
    const data = (await response.json()) as { items?: WorkspaceAssetItem[] };
    setRecentAssets(data.items ?? []);
  }, [session?.user?.id, setRecentAssets]);

  useEffect(() => {
    if (!session?.user?.id) return;
    // Credits and recent assets are external session-scoped data; they need a
    // client refresh after Better Auth exposes the active user.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refreshCredits();
    void refreshRecentAssets();
  }, [refreshCredits, refreshRecentAssets, session?.user?.id]);

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
    if (!currentTask?.taskId) return;
    if (currentTask.taskId.startsWith('live-')) return;
    if (currentTask.isAnonymous) return;
    if (currentTask.status !== 'pending' && currentTask.status !== 'processing') {
      return;
    }

    let active = true;
    const poll = async () => {
      try {
        const response = await fetch(
          `/api/effects/status?id=${encodeURIComponent(currentTask.taskId)}`,
          { cache: 'no-store' }
        );
        const data = (await response.json()) as {
          status?: string;
          output?: unknown;
          error?: string;
        };
        if (!active || !response.ok) return;

        const nextStatus = normalizeStatus(data.status);
        const [nextUrl] = readOutputImageUrls(data.output);
        setCurrentTask((previous) =>
          previous
            ? {
                ...previous,
                status: nextStatus,
                mediaUrl: nextUrl || previous.mediaUrl,
              }
            : previous
        );

        if (nextStatus === 'failed') {
          setError(data.error || copy.app.errors.generationFailed);
        }
        if (nextStatus === 'succeeded' || nextStatus === 'failed') {
          void refreshRecentAssets();
          void refreshCredits();
        }
      } catch {
        if (active) setError(copy.app.errors.refreshFailed);
      }
    };

    void poll();
    const timer = window.setInterval(poll, 4000);
    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, [
    copy.app.errors.generationFailed,
    copy.app.errors.refreshFailed,
    currentTask?.isAnonymous,
    currentTask?.status,
    currentTask?.taskId,
    refreshCredits,
    refreshRecentAssets,
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
    providerTaskId,
    selectedProvider,
  }: {
    wmTaskId: string;
    providerTaskId: string;
    selectedProvider?: string | null;
  }) => {
    for (let attempt = 0; attempt < ANONYMOUS_STATUS_POLL_ATTEMPTS; attempt += 1) {
      if (attempt > 0) {
        await wait(ANONYMOUS_STATUS_POLL_INTERVAL_MS);
      }

      const response = await getAnonymousEffectStatus({
        wmTaskId,
        providerTaskId,
        selectedProvider,
      });
      if (!response.ok) {
        throw new Error(response.data.error || copy.app.errors.refreshFailed);
      }

      const nextStatus = normalizeStatus(response.data.status);
      const [mediaUrl] = readOutputImageUrls(response.data.output);
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
      const response = await generateAnonymousEffect({
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
      const selectedProvider = getSelectedProviderFromOutput(response.data.output);
      activeTaskId = wmTaskId;
      const nextStatus = normalizeStatus(response.data.status);
      const [mediaUrl] = readOutputImageUrls(response.data.output);
      const visibleNextStatus =
        nextStatus === 'succeeded' ? 'processing' : nextStatus;
      const visibleMediaUrl = nextStatus === 'succeeded' ? null : mediaUrl;

      setCurrentTask((previous) =>
        previous
          ? {
              ...reconcileOptimisticWorkspaceTask({
                task: previous,
                provisionalTaskId,
                generationId: wmTaskId,
                status: visibleNextStatus,
                mediaUrl: visibleMediaUrl ?? null,
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
              }
            : previous
        );
        return;
      }
      if (nextStatus === 'pending' || nextStatus === 'processing') {
        if (!providerTaskId) {
          throw new Error(copy.app.errors.refreshFailed);
        }
        await pollAnonymousStatus({ wmTaskId, providerTaskId, selectedProvider });
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
    const callbackUrl = `${pathname || '/app'}${
      callbackQuery ? `?${callbackQuery}` : ''
    }`;
    window.location.href = `${getUrlWithLocale('/login', locale)}?callbackUrl=${encodeURIComponent(
      callbackUrl
    )}`;
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
      const precheckResponse = await fetch('/api/effects/precheck', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          effectId: model.effectId,
          input: precheckInput,
        }),
      });
      const precheck = (await precheckResponse.json().catch(() => null)) as
        | {
            ok?: boolean;
            currentCredits?: number;
            requiredCredits?: number;
            error?: string;
          }
        | null;
      if (precheckResponse.status === 401) {
        redirectToLogin();
        return;
      }
      if (!precheckResponse.ok || precheck?.ok === false) {
        setError(
          precheck?.error ||
            copy.app.errors.insufficientCredits.replace(
              '{credits}',
              String(precheck?.requiredCredits ?? totalCreditEstimate)
            )
        );
        if (typeof precheck?.currentCredits === 'number') {
          setCredits(precheck.currentCredits);
        }
        return;
      }

      setCurrentTask(createOptimisticWorkspaceTask({
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
      }));
      hasOptimisticTask = true;

      const uploadedReferenceUrls = await uploadReferences();
      const input = buildInput(uploadedReferenceUrls);
      const response = await fetch('/api/effects/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          effectId: model.effectId,
          input,
        }),
      });
      const data = (await response.json()) as GenerateResponse;
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
      const [mediaUrl] = readOutputImageUrls(data.output);
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
            })
          : fallbackTask
      );
      if (nextStatus === 'succeeded') {
        void refreshRecentAssets();
      }
      void refreshCredits();
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
    const map = new Map<string, WorkspaceAssetItem>();
    if (currentTask) map.set(currentTask.taskId, currentTask);
    for (const item of recentAssets) {
      if (!map.has(item.taskId)) map.set(item.taskId, item);
    }
    return Array.from(map.values());
  }, [currentTask, recentAssets]);
  const timelineItems = useMemo(
    () =>
      resultFilter === 'all'
        ? visibleAssets
        : visibleAssets.filter((item) => item.assetType === resultFilter),
    [resultFilter, visibleAssets]
  );

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
        id: 'generationCount',
        label: copy.app.parameterLabels.imageNumber,
        value: String(generationCount),
        options: supportedGenerationCounts.map(String),
        onChange: handleGenerationCountChange,
      },
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
      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-4 px-4 py-6 sm:px-6 lg:px-8">
        <section className="flex min-h-0 flex-1 flex-col gap-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-8">
              {(['all', 'video', 'image'] as const).map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setResultFilter(filter)}
                  className={`inline-flex h-10 items-center justify-center border-b text-[15px] font-semibold tracking-normal transition-colors ${
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
              className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-[18px] border border-slate-200 bg-white/82 px-4 text-[15px] font-semibold text-slate-700 shadow-[0_12px_28px_rgba(72,92,130,0.08)] transition hover:border-slate-300 hover:bg-white hover:text-slate-950"
            >
              <GalleryVerticalEnd className="h-4 w-4" />
              <span>{copy.app.assets}</span>
            </a>
          </div>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          <WorkspaceTimeline
            items={timelineItems}
            currentTask={currentTask}
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

      <div className="sticky bottom-0 z-40 bg-gradient-to-t from-[var(--vogue-page)] via-[rgba(244,248,255,0.92)] to-transparent px-3 pb-3 pt-5 backdrop-blur-md sm:px-4 lg:px-6">
        <div className="mx-auto max-w-7xl space-y-3">
          {isAnonymousPreviewMode ? (
            <div className="flex flex-col gap-3 rounded-[22px] border border-[#dfe6ff] bg-white/92 px-4 py-3 text-slate-900 shadow-[0_16px_44px_rgba(72,92,130,0.12)] sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="text-[14px] font-semibold tracking-normal">
                  {anonymousTrialCount === 0
                    ? copy.app.anonymous.usedTitle
                    : copy.app.anonymous.modeTitle}
                </p>
                <p className="mt-1 text-[12px] font-medium leading-5 text-slate-500">
                  {anonymousTrialCount === 0
                    ? copy.app.anonymous.usedDescription
                    : copy.app.anonymous.description}
                </p>
              </div>
              <a
                href={getUrlWithLocale('/pricing', locale)}
                className="inline-flex h-10 shrink-0 items-center justify-center rounded-[16px] bg-slate-950 px-4 text-[13px] font-semibold text-white shadow-[0_12px_28px_rgba(15,23,42,0.18)] transition hover:bg-[#4f67ff]"
              >
                {anonymousTrialCount === 0
                  ? copy.app.anonymous.ctaContinue
                  : copy.app.anonymous.ctaFreeCredits}
              </a>
            </div>
          ) : null}
          <VoguePromptComposer
            variant="workspace"
            prompt={prompt}
            onPromptChange={handlePromptChange}
            promptCharacterCount={promptCharCount}
            promptMaxChars={promptMaxChars}
            placeholder={copy.app.promptPlaceholder}
            models={composerModels}
            selectedModelId={model.id}
            onSelectedModelIdChange={applyModel}
            modelControlLabel={copy.app.modelControlLabel}
            parameterControlLabel={copy.app.parameterControlLabel}
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
            modelLocked={isAnonymousPreviewMode}
            lockedParameterSummary={anonymousParameterSummary}
            lockedParameterTitle={
              isAnonymousPreviewMode
                ? copy.app.anonymous.parameterTitle
                : undefined
            }
            generateMetaLabel={anonymousGenerateMetaLabel}
            generationEtaLabel={generationEtaLabel}
            isGenerating={loading}
            errorMessage={error}
          />
        </div>
      </div>

      {previewItem?.mediaUrl ? (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed bottom-0 left-0 right-0 top-0 z-[140] flex items-center justify-center bg-[rgba(244,248,255,0.9)] p-4 backdrop-blur-xl min-[641px]:left-[248px] sm:p-6 lg:p-8"
        >
          <div className="absolute right-5 top-5 z-10 flex gap-2 sm:right-7 sm:top-7">
            <a
              href={`/api/assets/download?taskId=${encodeURIComponent(
                previewItem.taskId
              )}`}
              download
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/70 bg-white/92 text-slate-800 shadow-[0_16px_38px_rgba(72,92,130,0.14)] transition hover:bg-slate-950 hover:text-white"
              title={copy.app.download}
            >
              <Download className="h-5 w-5" />
            </a>
            <button
              type="button"
              onClick={() => setPreviewItem(null)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/70 bg-white/92 text-slate-800 shadow-[0_16px_38px_rgba(72,92,130,0.14)] transition hover:bg-slate-950 hover:text-white"
              title={copy.common.close}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="flex max-h-[calc(100vh-4rem)] max-w-full items-center justify-center overflow-hidden rounded-[24px] border border-white/80 bg-white/86 p-2 shadow-[0_30px_90px_rgba(72,92,130,0.24)] sm:max-h-[calc(100vh-5rem)]">
            <Image
              src={previewItem.mediaUrl}
              alt={previewItem.prompt || copy.app.generatedAssetAlt}
              width={1400}
              height={1050}
              unoptimized
              className="h-auto w-auto max-h-[calc(100vh-5.5rem)] max-w-full rounded-[18px] object-contain sm:max-h-[calc(100vh-6.5rem)]"
            />
          </div>
        </div>
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
