import 'server-only';

import {
  isBatchGenerationOutput,
  mergeBatchGenerationResults,
} from './batch-generation';
import { checkBatchGenerationTasks } from './batch-status-sync';
import { getEffectById } from './effects';
import {
  resolveProviderSyncTransition,
  resolveTimeoutTransition,
} from './generation-orchestrator';
import { getUserGenerationAccessTier } from './generation-access-server';
import { readProviderTaskId } from './generation-output';
import {
  continueImageGenerationAfterProviderFailure,
  createAdapterForStoredImageGeneration,
  isImageProviderFallbackEffect,
} from './gpt-image-2-provider-chain';
import { persistEffectOutputIfNeeded } from './output-storage';
import { getGenerationById } from './record-generation';
import { applyResultRevealGate } from './result-reveal-gate';
import { settleGenerationStatus } from './generation-settlement';

const POLL_INTERVAL_MS = 20_000;
const POLL_TIMEOUT_MS = 10 * 60 * 1000;
const IMAGE_FALLBACK_ZOMBIE_TIMEOUT_MS = 24 * 60 * 60 * 1000;
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

  const timeoutMs = isImageProviderFallbackEffect(effect)
    ? IMAGE_FALLBACK_ZOMBIE_TIMEOUT_MS
    : POLL_TIMEOUT_MS;
  const isTimeoutExceeded =
    Date.now() - new Date(generation.createdAt).getTime() >= timeoutMs;
  if (isTimeoutExceeded && generation.status !== 'succeeded') {
    const transition = resolveTimeoutTransition({
      generationId: wmTaskId,
      output: generation.output,
    });
    const generationAccessTier = await getUserGenerationAccessTier(userId);
    const revealGate = applyResultRevealGate({
      accessTier: generationAccessTier,
      status: transition.publicStatus,
      output: transition.output,
    });
    await settleGenerationStatus({
      generationId: wmTaskId,
      userId,
      effectName: effect.name,
      status: transition.publicStatus,
      output: revealGate.outputForStore,
      error: transition.error,
      creditsUsed: generation.creditsUsed,
    });
    return { shouldRetry: false, retryAfterMs: 0 };
  }

  const isBatchOutput = isBatchGenerationOutput(generation.output);
  if (!providerTaskId && !isBatchOutput) {
    return { shouldRetry: true, retryAfterMs: POLL_INTERVAL_MS };
  }

  if (isBatchOutput) {
    const batchResult = mergeBatchGenerationResults({
      previousOutput: generation.output,
      checkedResults: await checkBatchGenerationTasks({
        effect,
        input: generation.input,
        output: generation.output,
      }),
    });
    const storedOutput =
      batchResult.status === 'succeeded'
        ? await persistEffectOutputIfNeeded({
            output: batchResult.output,
            wmTaskId,
            effectId,
            effectType: effect.type,
            userId,
          })
        : batchResult.output;
    const generationAccessTier = await getUserGenerationAccessTier(userId);
    const revealGate = applyResultRevealGate({
      accessTier: generationAccessTier,
      status: batchResult.status,
      output: storedOutput,
    });

    await settleGenerationStatus({
      generationId: wmTaskId,
      userId,
      effectName: effect.name,
      status: batchResult.status,
      output: revealGate.outputForStore,
      error: batchResult.error ?? generation.error,
      creditsUsed: generation.creditsUsed,
    });

    return {
      shouldRetry: batchResult.status === 'processing',
      retryAfterMs: POLL_INTERVAL_MS,
    };
  }

  if (!providerTaskId) return { shouldRetry: true, retryAfterMs: POLL_INTERVAL_MS };

  const adapter = createAdapterForStoredImageGeneration({ effect, output });
  if (!adapter.checkStatus) return { shouldRetry: false, retryAfterMs: 0 };

  let result = await adapter.checkStatus(providerTaskId);
  let syncProviderTaskId = providerTaskId;
  if (result.status === 'failed') {
    const fallback = await continueImageGenerationAfterProviderFailure({
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
  const generationAccessTier = await getUserGenerationAccessTier(userId);
  const revealGate = applyResultRevealGate({
    accessTier: generationAccessTier,
    status: transition.publicStatus,
    output: storedOutput,
  });

  await settleGenerationStatus({
    generationId: wmTaskId,
    userId,
    effectName: effect.name,
    status: transition.publicStatus,
    output: revealGate.outputForStore,
    error: transition.error,
    creditsUsed: generation.creditsUsed,
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
