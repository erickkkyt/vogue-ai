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
  createRemoteReference,
  fillSlots,
  formatBytes,
  formatDate,
  formatParamsLabel,
  getStatusLabel,
  normalizeStatus,
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
  status?: string;
  creditsUsed?: number;
};

const FALLBACK_GENERATION_COUNTS: WorkspaceGenerationCount[] = [1];
const EMPTY_QUALITY_OPTIONS: WorkspaceQualityOption[] = [];
const EMPTY_OUTPUT_QUALITY_OPTIONS: WorkspaceOutputQuality[] = [];

function AssetTile({
  item,
  active,
  locale,
  copy,
  onPreview,
  onUsePrompt,
  onUseReference,
}: {
  item: WorkspaceAssetItem;
  active?: boolean;
  locale: string;
  copy: VogueUICopy;
  onPreview: (item: WorkspaceAssetItem) => void;
  onUsePrompt: (prompt: string) => void;
  onUseReference: (url: string) => void;
}) {
  const isBusy = item.status === 'pending' || item.status === 'processing';

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
        className="relative flex h-[240px] w-full items-center justify-center overflow-hidden rounded-[22px] bg-slate-100 text-slate-500 disabled:cursor-default"
      >
        {item.mediaUrl ? (
          <Image
            src={item.mediaUrl}
            alt={item.prompt || item.modelLabel || copy.app.generatedAssetAlt}
            fill
            sizes="(min-width: 768px) 280px, 100vw"
            unoptimized
            className="h-full w-full object-cover"
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
          <span className="absolute right-2 top-2 rounded-full bg-white/88 p-1.5 text-slate-800 shadow-sm">
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

          <p
            className="line-clamp-3 rounded-[18px] border border-slate-200/70 bg-white/62 px-4 py-3 text-[15px] font-semibold leading-6 text-slate-900"
            title={item.prompt ?? undefined}
          >
            {item.prompt || copy.app.noPromptSaved}
          </p>
        </div>

        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="space-y-1 text-xs text-slate-500">
            <p>{formatDate(item.createdAt, locale)}</p>
            <p>{item.paramsLabel || copy.app.generatedAsset}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={!item.prompt}
              onClick={() => item.prompt && onUsePrompt(item.prompt)}
              className="flex h-9 items-center justify-center rounded-[10px] border border-slate-200 bg-white px-3 text-slate-600 transition hover:border-slate-400 hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-40"
              title={copy.app.usePrompt}
            >
              <Copy className="h-4 w-4" />
            </button>
            <button
              type="button"
              disabled={!item.mediaUrl}
              onClick={() => item.mediaUrl && onUseReference(item.mediaUrl)}
              className="flex h-9 items-center justify-center rounded-[10px] border border-slate-200 bg-white px-3 text-slate-600 transition hover:border-slate-400 hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-40"
              title={copy.app.useAsReference}
            >
              <RefreshCw className="h-4 w-4" />
            </button>
            <a
              href={`/api/assets/download?taskId=${encodeURIComponent(
                item.taskId
              )}`}
              className={`flex h-9 items-center justify-center rounded-[10px] border border-slate-200 bg-white px-3 text-slate-600 transition hover:border-slate-400 hover:text-slate-950 ${
                item.mediaUrl ? '' : 'pointer-events-none opacity-40'
              }`}
              title={copy.app.download}
            >
              <Download className="h-4 w-4" />
            </a>
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
  onPreview,
  onUsePrompt,
  onUseReference,
  emptyMessage,
}: {
  items: WorkspaceAssetItem[];
  currentTask: WorkspaceAssetItem | null;
  locale: string;
  copy: VogueUICopy;
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
  const initialModel = searchParams.get('model') || 'gptimage2';
  const initialPrompt = searchParams.get('prompt') || '';
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
  const [credits, setCredits] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewItem, setPreviewItem] = useState<WorkspaceAssetItem | null>(
    null
  );
  const { data: session } = authClient.useSession();

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
  const totalCreditEstimate =
    model.credit *
    generationCount *
    (outputQuality === '4k' ? 2 : quality === 'high' ? 1.5 : 1);

  // Gallery handoff is stored in browser sessionStorage, so it must be applied
  // after the app shell mounts.
  useEffect(() => {
    const transferPayload = readVogueAppTransferPayload();
    if (!transferPayload) return;

    const transferModel = getModelById(transferPayload.model);
    const transferImageLimit = transferModel.mediaSchema?.image.max ?? 0;
    const transferPromptMaxChars = getGenerationPromptMaxChars({
      modelId: transferModel.id,
    });
    const nextGenerationCount = Number(transferPayload.generationCount);

    // The source of truth is one-time browser sessionStorage written before
    // navigation from the gallery, so this state sync cannot be derived during
    // render without consuming the handoff too early.
    // eslint-disable-next-line react-hooks/set-state-in-effect
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
  }, []);

  const refreshCredits = useCallback(async () => {
    const response = await fetch('/api/user/credits', { cache: 'no-store' });
    if (!response.ok) return;
    const data = (await response.json()) as {
      currentCredits?: number;
      authenticated?: boolean;
    };
    if (data.authenticated && typeof data.currentCredits === 'number') {
      setCredits(data.currentCredits);
    }
  }, [setCredits]);

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
    if (!currentTask?.taskId) return;
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
    if (!session?.user) {
      redirectToLogin();
      return;
    }

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

    setLoading(true);
    setError(null);

    try {
      const uploadedReferenceUrls = await uploadReferences();
      const input = buildInput(uploadedReferenceUrls);
      const precheckResponse = await fetch('/api/effects/precheck', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          effectId: model.effectId,
          input,
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
              String(precheck?.requiredCredits ?? model.credit)
            )
        );
        if (typeof precheck?.currentCredits === 'number') {
          setCredits(precheck.currentCredits);
        }
        return;
      }

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
        setError(data.error || copy.app.errors.generationFailed);
        return;
      }

      const taskId = data.generationId ?? crypto.randomUUID();
      const [mediaUrl] = readOutputImageUrls(data.output);
      const task: WorkspaceAssetItem = {
        id: taskId,
        taskId,
        status: normalizeStatus(data.status),
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
        createdAt: new Date().toISOString(),
      };
      setCurrentTask(task);
      if (task.status === 'succeeded') {
        void refreshRecentAssets();
      }
      void refreshCredits();
    } catch (generateError) {
      setError(
        generateError instanceof Error
          ? generateError.message
          : copy.app.errors.generationFailed
      );
    } finally {
      setLoading(false);
    }
  };

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
        credit: item.credit,
        iconPath: getModelIconPathByModelId(item.id),
        description:
          item.id === model.id
            ? copy.app.activeModelDescription.replace(
                '{credits}',
                String(item.credit)
              )
            : copy.app.baseCreditsDescription.replace(
                '{credits}',
                String(item.credit)
              ),
      })),
    [copy, model.id]
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
        <div className="mx-auto max-w-7xl">
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
              imageSlotLimit > 0
                ? () => fileInputRef.current?.click()
                : undefined
            }
            onRemoveReference={(id) => removeReferenceImage(Number(id))}
            parameters={composerParameters}
            credits={{
              available: credits,
              estimate: totalCreditEstimate,
            }}
            onGenerate={generate}
            generateDisabled={!promptValidation.ok}
            isGenerating={loading}
            errorMessage={error}
          />
        </div>
      </div>

      {previewItem?.mediaUrl ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-100/82 p-4 backdrop-blur-xl">
          <button
            type="button"
            onClick={() => setPreviewItem(null)}
            className="absolute right-5 top-5 rounded-full bg-white/90 p-2 text-slate-800 shadow-sm transition hover:bg-slate-950 hover:text-white"
            title={copy.common.close}
          >
            <X className="h-5 w-5" />
          </button>
          <div className="max-h-[90vh] max-w-[90vw] overflow-hidden rounded-[16px] border border-white bg-white shadow-[0_24px_80px_rgba(72,92,130,0.22)]">
            <Image
              src={previewItem.mediaUrl}
              alt={previewItem.prompt || copy.app.generatedAssetAlt}
              width={1400}
              height={1050}
              unoptimized
              className="max-h-[90vh] max-w-[90vw] object-contain"
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
