import type { GenerationAccessTier } from '@/lib/effects/generation-access';
import type { VogueUICopy } from '@/i18n/vogue';

export type WorkspaceAssetStatus =
  | 'pending'
  | 'processing'
  | 'succeeded'
  | 'failed';

export type WorkspaceAssetItem = {
  id: string;
  taskId: string;
  status: WorkspaceAssetStatus;
  prompt: string | null;
  modelId: string | null;
  modelLabel: string | null;
  paramsLabel: string | null;
  assetType: 'image' | 'video';
  mediaUrl: string | null;
  createdAt: string;
  expectedGenerationSeconds?: number | null;
  standardGenerationSeconds?: number | null;
  fasterGenerationSeconds?: number | null;
  generationAccessTier?: GenerationAccessTier | null;
  isAnonymous?: boolean;
};

export type ReferenceImageItem = {
  source: 'remote' | 'local';
  url: string;
  name: string;
  file?: File;
  objectUrl?: string;
};

export type TimelineFilter = 'all' | 'video' | 'image';

export const createOptimisticWorkspaceTask = ({
  id,
  prompt,
  modelId,
  modelLabel,
  paramsLabel,
  createdAt,
  expectedGenerationSeconds,
  standardGenerationSeconds,
  fasterGenerationSeconds,
  generationAccessTier,
}: {
  id: string;
  prompt: string;
  modelId: string;
  modelLabel: string;
  paramsLabel: string;
  createdAt: string;
  expectedGenerationSeconds?: number | null;
  standardGenerationSeconds?: number | null;
  fasterGenerationSeconds?: number | null;
  generationAccessTier?: GenerationAccessTier | null;
}): WorkspaceAssetItem => ({
  id,
  taskId: id,
  status: 'pending',
  prompt,
  modelId,
  modelLabel,
  paramsLabel,
  assetType: 'image',
  mediaUrl: null,
  createdAt,
  expectedGenerationSeconds,
  standardGenerationSeconds,
  fasterGenerationSeconds,
  generationAccessTier,
});

export const reconcileOptimisticWorkspaceTask = ({
  task,
  provisionalTaskId,
  generationId,
  status,
  mediaUrl,
}: {
  task: WorkspaceAssetItem;
  provisionalTaskId: string;
  generationId: string;
  status: WorkspaceAssetStatus;
  mediaUrl: string | null;
}): WorkspaceAssetItem => {
  if (task.taskId !== provisionalTaskId) return task;

  return {
    ...task,
    id: generationId,
    taskId: generationId,
    status,
    mediaUrl: mediaUrl ?? task.mediaUrl,
  };
};

export const getStatusLabel = (
  status: WorkspaceAssetStatus,
  copy: VogueUICopy
) => {
  if (status === 'succeeded') return copy.app.statuses.succeeded;
  if (status === 'failed') return copy.app.statuses.failed;
  if (status === 'pending') return copy.app.statuses.pending;
  return copy.app.statuses.processing;
};

export const normalizeStatus = (
  status?: string | null
): WorkspaceAssetStatus => {
  if (status === 'succeeded') return 'succeeded';
  if (status === 'failed') return 'failed';
  if (status === 'pending') return 'pending';
  return 'processing';
};

export const getFileNameFromUrl = (value: string) => {
  try {
    const pathname = new URL(value).pathname;
    return pathname.split('/').filter(Boolean).pop() || 'reference-image';
  } catch {
    return 'reference-image';
  }
};

export const createRemoteReference = (url: string): ReferenceImageItem => ({
  source: 'remote',
  url,
  name: getFileNameFromUrl(url),
});

export const revokeReference = (item: ReferenceImageItem | null) => {
  if (item?.objectUrl) {
    URL.revokeObjectURL(item.objectUrl);
  }
};

export const createEmptySlots = <T,>(limit: number) =>
  Array.from({ length: limit }, () => null) as Array<T | null>;

export const fillSlots = <T,>(items: Array<T | null>, limit: number) =>
  Array.from({ length: limit }, (_, index) => items[index] ?? null);

export const resizeReferenceSlots = (
  items: Array<ReferenceImageItem | null>,
  limit: number
) => {
  items.slice(limit).forEach(revokeReference);
  return fillSlots(items, limit);
};

export const readOutputImageUrls = (output: unknown): string[] => {
  if (!output || typeof output !== 'object') return [];
  const payload = output as Record<string, unknown>;
  if (Array.isArray(payload.image_urls)) {
    return payload.image_urls.filter(
      (item): item is string => typeof item === 'string' && item.length > 0
    );
  }
  return typeof payload.result_url === 'string' && payload.result_url
    ? [payload.result_url]
    : [];
};

export const formatParamsLabel = ({
  aspectRatio,
  outputQuality,
  quality,
  generationCount,
  copy,
}: {
  aspectRatio: string;
  outputQuality?: string;
  quality?: string;
  generationCount: number;
  copy: VogueUICopy;
}) =>
  [
    `${generationCount} ${
      generationCount > 1 ? copy.app.imagesUnit : copy.app.imageUnit
    }`,
    aspectRatio,
    outputQuality?.toUpperCase(),
    quality,
  ]
    .filter(Boolean)
    .join(' | ');

export const formatDate = (value: string, locale: string) =>
  new Intl.DateTimeFormat(locale, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));

export const formatBytes = (value: number) => {
  if (value >= 1024 * 1024) return `${(value / 1024 / 1024).toFixed(1)} MB`;
  if (value >= 1024) return `${Math.ceil(value / 1024)} KB`;
  return `${value} B`;
};
