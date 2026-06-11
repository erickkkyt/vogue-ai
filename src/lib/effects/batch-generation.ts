import type { GenerationResult } from '@/lib/adapters/base-adapter';
import type { EffectRecord } from './effects';
import type { ProviderGenerationStatus } from './generation-output';
import { readProviderTaskId } from './generation-output';

export const MAX_BATCH_GENERATION_COUNT = 4;

const NATIVE_IMAGE_COUNT_PROVIDERS = new Set([
  'evolink.gpt-image-2',
  '302.gpt-image-2',
]);

export type BatchGenerationTask = {
  taskId: string;
  status: ProviderGenerationStatus;
  output?: unknown;
  error?: string | null;
};

type BatchGenerationOutput = {
  batchMode: 'fanout';
  batchRequestedCount: number;
  batchProviderTaskIds: string[];
  batchTasks: BatchGenerationTask[];
  taskId?: string;
  providerTaskId?: string;
  image_urls?: string[];
  result_url?: string;
  [key: string]: unknown;
};

const asObject = (value: unknown): Record<string, unknown> =>
  value && typeof value === 'object' ? (value as Record<string, unknown>) : {};

const isProviderStatus = (value: unknown): value is ProviderGenerationStatus =>
  value === 'pending' ||
  value === 'processing' ||
  value === 'succeeded' ||
  value === 'failed';

const uniqueStrings = (values: string[]) => Array.from(new Set(values));

export const readImageUrlsFromOutput = (output: unknown): string[] => {
  const payload = asObject(output);
  const urls: string[] = [];
  const resultUrl = payload.result_url;
  if (typeof resultUrl === 'string' && resultUrl) urls.push(resultUrl);
  const imageUrls = payload.image_urls;
  if (Array.isArray(imageUrls)) {
    for (const item of imageUrls) {
      if (typeof item === 'string' && item) urls.push(item);
    }
  }
  return uniqueStrings(urls);
};

export const getRequestedGenerationCount = (input: unknown) => {
  const payload = asObject(input);
  const rawCount = payload.n;
  const numericCount =
    typeof rawCount === 'number'
      ? rawCount
      : typeof rawCount === 'string'
        ? Number.parseInt(rawCount, 10)
        : 1;
  if (!Number.isFinite(numericCount)) return 1;
  return Math.min(
    MAX_BATCH_GENERATION_COUNT,
    Math.max(1, Math.trunc(numericCount))
  );
};

export const toSingleImageGenerationInput = (input: unknown) => ({
  ...asObject(input),
  n: 1,
});

export const providerSupportsNativeImageCount = (provider?: string | null) =>
  typeof provider === 'string' && NATIVE_IMAGE_COUNT_PROVIDERS.has(provider);

export const shouldFanOutImageGeneration = ({
  effect,
  input,
}: {
  effect: Pick<EffectRecord, 'provider'> | { provider?: string | null };
  input: unknown;
}) =>
  getRequestedGenerationCount(input) > 1 &&
  !providerSupportsNativeImageCount(effect.provider);

const createBatchTask = ({
  taskId,
  result,
}: {
  taskId: string;
  result: GenerationResult;
}): BatchGenerationTask => ({
  taskId,
  status: result.status,
  output: result.output,
  error: result.error ?? null,
});

const getTaskIdForResult = (result: GenerationResult, index: number) =>
  readProviderTaskId(result.output) ??
  (result.status === 'succeeded' &&
  readImageUrlsFromOutput(result.output).length > 0
    ? `completed-${index + 1}`
    : null);

export const getBatchProviderTaskIds = (output: unknown): string[] => {
  const payload = asObject(output);
  if (Array.isArray(payload.batchProviderTaskIds)) {
    return payload.batchProviderTaskIds.filter(
      (item): item is string => typeof item === 'string' && item.length > 0
    );
  }
  const batchTasks = payload.batchTasks;
  if (!Array.isArray(batchTasks)) return [];
  return batchTasks.flatMap((task) => {
    const taskId = asObject(task).taskId;
    return typeof taskId === 'string' && taskId ? [taskId] : [];
  });
};

export const isBatchGenerationOutput = (output: unknown) =>
  asObject(output).batchMode === 'fanout' &&
  getBatchProviderTaskIds(output).length > 0;

export const buildFanoutBatchGenerationResult = ({
  requestedCount,
  results,
}: {
  requestedCount: number;
  results: GenerationResult[];
}): GenerationResult => {
  const tasks = results.flatMap((result, index): BatchGenerationTask[] => {
    const taskId = getTaskIdForResult(result, index);
    return taskId ? [createBatchTask({ taskId, result })] : [];
  });
  const imageUrls = uniqueStrings(
    tasks.flatMap((task) => readImageUrlsFromOutput(task.output))
  );
  const taskIds = tasks.map((task) => task.taskId);
  const firstTaskId = taskIds[0];
  const errors = results
    .map((result) => result.error)
    .filter(
      (error): error is string => typeof error === 'string' && error.length > 0
    );

  if (!firstTaskId) {
    return {
      status: 'failed',
      error: errors.join('; ') || 'All batch generation requests failed',
      output: {
        batchMode: 'fanout',
        batchRequestedCount: requestedCount,
        batchProviderTaskIds: [],
        batchTasks: [],
      },
    };
  }

  const allAcceptedTerminal = tasks.every(
    (task) => task.status === 'succeeded' || task.status === 'failed'
  );
  const anyAcceptedPending = tasks.some(
    (task) => task.status === 'pending' || task.status === 'processing'
  );
  const anySucceeded = tasks.some((task) => task.status === 'succeeded');
  const status: ProviderGenerationStatus =
    allAcceptedTerminal && anySucceeded && imageUrls.length > 0
      ? 'succeeded'
      : allAcceptedTerminal && !anyAcceptedPending && !anySucceeded
        ? 'failed'
        : 'processing';

  const output: BatchGenerationOutput = {
    batchMode: 'fanout',
    batchRequestedCount: requestedCount,
    batchProviderTaskIds: taskIds,
    batchTasks: tasks,
    taskId: firstTaskId,
    providerTaskId: firstTaskId,
    ...(imageUrls.length > 0
      ? { image_urls: imageUrls, result_url: imageUrls[0] }
      : {}),
  };

  return {
    status,
    output,
    error: status === 'failed' ? errors.join('; ') || 'Batch failed' : undefined,
  };
};

export const readBatchGenerationTasks = (
  output: unknown
): BatchGenerationTask[] => {
  const tasks = asObject(output).batchTasks;
  if (!Array.isArray(tasks)) return [];
  return tasks.flatMap((task): BatchGenerationTask[] => {
    const payload = asObject(task);
    const taskId = payload.taskId;
    if (typeof taskId !== 'string' || !taskId) return [];
    return [
      {
        taskId,
        status: isProviderStatus(payload.status)
          ? payload.status
          : 'processing',
        output: payload.output,
        error: typeof payload.error === 'string' ? payload.error : null,
      },
    ];
  });
};

export const mergeBatchGenerationResults = ({
  previousOutput,
  checkedResults,
}: {
  previousOutput: unknown;
  checkedResults: Array<{ taskId: string; result: GenerationResult }>;
}): {
  status: ProviderGenerationStatus;
  output: BatchGenerationOutput;
  imageUrls: string[];
  providerTaskId: string | null;
  error: string | null;
} => {
  const previous = asObject(previousOutput);
  const resultByTaskId = new Map(
    checkedResults.map((item) => [item.taskId, item.result])
  );
  const previousTasks = readBatchGenerationTasks(previousOutput);
  const taskIds = getBatchProviderTaskIds(previousOutput);
  const sourceTasks: BatchGenerationTask[] =
    previousTasks.length > 0
      ? previousTasks
      : taskIds.map((taskId) => ({
          taskId,
          status: 'processing' as const,
          output: undefined,
          error: null,
        }));

  const tasks = sourceTasks.map((task) => {
    const checked = resultByTaskId.get(task.taskId);
    return checked
      ? createBatchTask({
          taskId: readProviderTaskId(checked.output) ?? task.taskId,
          result: checked,
        })
      : task;
  });
  const imageUrls = uniqueStrings(
    tasks.flatMap((task) => readImageUrlsFromOutput(task.output))
  );
  const hasPending = tasks.some(
    (task) => task.status === 'pending' || task.status === 'processing'
  );
  const hasSucceeded = tasks.some(
    (task) =>
      task.status === 'succeeded' &&
      readImageUrlsFromOutput(task.output).length > 0
  );
  const allFailed =
    tasks.length > 0 && tasks.every((task) => task.status === 'failed');
  const errors = uniqueStrings(
    tasks.flatMap((task) =>
      typeof task.error === 'string' && task.error ? [task.error] : []
    )
  );
  const status: ProviderGenerationStatus = hasPending
    ? 'processing'
    : hasSucceeded
      ? 'succeeded'
      : allFailed
        ? 'failed'
        : 'processing';
  const providerTaskId = tasks[0]?.taskId ?? null;
  const output: BatchGenerationOutput = {
    ...previous,
    batchMode: 'fanout',
    batchRequestedCount:
      typeof previous.batchRequestedCount === 'number'
        ? previous.batchRequestedCount
        : tasks.length,
    batchProviderTaskIds: tasks.map((task) => task.taskId),
    batchTasks: tasks,
    ...(providerTaskId ? { taskId: providerTaskId, providerTaskId } : {}),
    ...(imageUrls.length > 0
      ? { image_urls: imageUrls, result_url: imageUrls[0] }
      : {}),
  };

  return {
    status,
    output,
    imageUrls,
    providerTaskId,
    error:
      status === 'failed'
        ? errors.join('; ') || 'All batch generation tasks failed'
        : null,
  };
};
