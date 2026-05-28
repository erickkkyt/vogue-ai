import 'server-only';

import { getEffectById } from './effects';
import {
  resolveProviderSyncTransition,
  resolveTimeoutTransition,
} from './generation-orchestrator';
import { readProviderTaskId } from './generation-output';
import {
  continueGptImage2GenerationAfterProviderFailure,
  createAdapterForStoredGptImage2Generation,
  isGptImage2Effect,
} from './gpt-image-2-provider-chain';
import { persistEffectOutputIfNeeded } from './output-storage';
import { getGenerationById, updateGenerationById } from './record-generation';

const POLL_INTERVAL_MS = 20_000;
const POLL_TIMEOUT_MS = 10 * 60 * 1000;
const GPT_IMAGE_2_ZOMBIE_TIMEOUT_MS = 24 * 60 * 60 * 1000;
const runningPollers = new Set<string>();

export type GenerationStatusPassResult = {
  shouldRetry: boolean;
  retryAfterMs: number;
};

const asObject = (value: unknown): Record<string, unknown> =>
  value && typeof value === 'object' ? (value as Record<string, unknown>) : {};

const readString = (value: unknown) =>
  typeof value === 'string' && value ? value : null;

export const runGenerationStatusPass = async ({
  wmTaskId,
  userId,
  effectId,
}: {
  wmTaskId: string;
  userId: string;
  effectId: number;
}): Promise<GenerationStatusPassResult> => {
  const effect = await getEffectById(effectId);
  const generation = effect
    ? await getGenerationById({ id: wmTaskId, userId, effectId })
    : null;
  if (!effect || !generation) return { shouldRetry: false, retryAfterMs: 0 };

  const output = asObject(generation.output);
  const providerTaskId =
    typeof generation.providerTaskId === 'string'
      ? generation.providerTaskId
      : readString(output.providerTaskId) ?? readString(output.taskId);

  const timeoutMs = isGptImage2Effect(effect)
    ? GPT_IMAGE_2_ZOMBIE_TIMEOUT_MS
    : POLL_TIMEOUT_MS;
  const isTimeoutExceeded =
    Date.now() - new Date(generation.createdAt).getTime() >= timeoutMs;
  if (isTimeoutExceeded && generation.status !== 'succeeded') {
    const transition = resolveTimeoutTransition({
      generationId: wmTaskId,
      output: generation.output,
    });
    await updateGenerationById({
      id: wmTaskId,
      status: transition.publicStatus,
      output: transition.output,
      error: transition.error,
    });
    return { shouldRetry: false, retryAfterMs: 0 };
  }

  if (!providerTaskId) return { shouldRetry: true, retryAfterMs: POLL_INTERVAL_MS };

  const adapter = createAdapterForStoredGptImage2Generation({ effect, output });
  if (!adapter.checkStatus) return { shouldRetry: false, retryAfterMs: 0 };

  let result = await adapter.checkStatus(providerTaskId);
  let syncProviderTaskId = providerTaskId;
  if (result.status === 'failed') {
    const fallback = await continueGptImage2GenerationAfterProviderFailure({
      effect,
      input: generation.input,
      previousOutput: generation.output,
      failedProviderTaskId: providerTaskId,
      providerError: result.error ?? null,
    });
    if (fallback) {
      result = fallback.result;
      syncProviderTaskId = readProviderTaskId(fallback.result.output) ?? providerTaskId;
    }
  }
  const transition = resolveProviderSyncTransition({
    generationId: wmTaskId,
    previousOutput: generation.output,
    providerStatus: result.status,
    providerTaskId: syncProviderTaskId,
    providerOutput: result.output,
    providerError: result.error ?? null,
  });
  const storedOutput =
    transition.publicStatus === 'succeeded'
      ? await persistEffectOutputIfNeeded({
          output: transition.output,
          wmTaskId,
          effectId,
          effectType: effect.type,
          userId,
        })
      : transition.output;

  await updateGenerationById({
    id: wmTaskId,
    status: transition.publicStatus,
    output: storedOutput,
    error: transition.error,
  });

  return {
    shouldRetry: transition.publicStatus === 'processing',
    retryAfterMs: POLL_INTERVAL_MS,
  };
};

export function startBackendPollingForGeneration({
  wmTaskId,
  userId,
  effectId,
}: {
  wmTaskId: string;
  userId: string;
  effectId: number;
}) {
  const key = `${userId}:${effectId}:${wmTaskId}`;
  if (runningPollers.has(key)) return;
  runningPollers.add(key);

  void (async () => {
    let result = await runGenerationStatusPass({ wmTaskId, userId, effectId });
    while (result.shouldRetry) {
      await new Promise((resolve) => setTimeout(resolve, result.retryAfterMs));
      result = await runGenerationStatusPass({ wmTaskId, userId, effectId });
    }
  })().finally(() => {
    runningPollers.delete(key);
  });
}
