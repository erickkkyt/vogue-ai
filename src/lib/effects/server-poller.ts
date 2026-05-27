import 'server-only';

import { getEffectById } from './effects';
import {
  resolveProviderSyncTransition,
  resolveTimeoutTransition,
} from './generation-orchestrator';
import { createAdapterForStoredGptImage2Generation } from './gpt-image-2-provider-chain';
import { persistEffectOutputIfNeeded } from './output-storage';
import { getGenerationById, updateGenerationById } from './record-generation';

const POLL_INTERVAL_MS = 20_000;
const POLL_TIMEOUT_MS = 10 * 60 * 1000;
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
  if (!providerTaskId) return { shouldRetry: true, retryAfterMs: POLL_INTERVAL_MS };

  const isTimeoutExceeded =
    Date.now() - new Date(generation.createdAt).getTime() >= POLL_TIMEOUT_MS;
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

  const adapter = createAdapterForStoredGptImage2Generation({ effect, output });
  if (!adapter.checkStatus) return { shouldRetry: false, retryAfterMs: 0 };

  const result = await adapter.checkStatus(providerTaskId);
  const transition = resolveProviderSyncTransition({
    generationId: wmTaskId,
    previousOutput: generation.output,
    providerStatus: result.status,
    providerTaskId,
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

  void runGenerationStatusPass({ wmTaskId, userId, effectId }).finally(() => {
    runningPollers.delete(key);
  });
}

