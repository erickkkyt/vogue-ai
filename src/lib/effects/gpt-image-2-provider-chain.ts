import type { GenerationResult } from '@/lib/adapters/base-adapter';
import { createAdapter } from '@/lib/adapters/adapter-factory';
import type { EffectRecord } from './effects';
import {
  type ProviderFallbackAttempt,
  runProviderFallbackChain,
} from './provider-fallback';

const GPT_IMAGE_2_MODEL = 'gpt-image-2';
const GPT_IMAGE_2_KIE_PROVIDER = 'kie.gpt-image-2';
const GPT_IMAGE_2_EVOLINK_PROVIDER = 'evolink.gpt-image-2';
const GPT_IMAGE_2_AI302_PROVIDER = '302.gpt-image-2';

export const GPT_IMAGE_2_PROVIDER_CHAIN = [
  GPT_IMAGE_2_KIE_PROVIDER,
  GPT_IMAGE_2_EVOLINK_PROVIDER,
  GPT_IMAGE_2_AI302_PROVIDER,
] as const;

export const GPT_IMAGE_2_LOW_1K_PROVIDER_CHAIN = [
  GPT_IMAGE_2_EVOLINK_PROVIDER,
  GPT_IMAGE_2_KIE_PROVIDER,
  GPT_IMAGE_2_AI302_PROVIDER,
] as const;

type AdapterLike = {
  createGeneration(input: unknown): Promise<GenerationResult>;
  checkStatus?(taskId: string): Promise<GenerationResult>;
};

const asObject = (value: unknown): Record<string, unknown> =>
  value && typeof value === 'object' ? (value as Record<string, unknown>) : {};

const readString = (value: unknown) =>
  typeof value === 'string' && value ? value : null;

const isProviderStatus = (
  value: unknown
): value is GenerationResult['status'] =>
  value === 'pending' ||
  value === 'processing' ||
  value === 'succeeded' ||
  value === 'failed';

const readProviderAttempts = (output: unknown): ProviderFallbackAttempt[] => {
  const attempts = asObject(output).providerAttempts;
  if (!Array.isArray(attempts)) return [];

  return attempts.flatMap((attempt): ProviderFallbackAttempt[] => {
    const attemptObject = asObject(attempt);
    const attemptNumber =
      typeof attemptObject.attempt === 'number' &&
      Number.isFinite(attemptObject.attempt)
        ? attemptObject.attempt
        : null;
    const provider = readString(attemptObject.provider);
    const status = isProviderStatus(attemptObject.status)
      ? attemptObject.status
      : null;

    if (!attemptNumber || !provider || !status) {
      return [];
    }

    return [
      {
        attempt: attemptNumber,
        provider,
        status,
        accepted: attemptObject.accepted === true,
        providerTaskId: readString(attemptObject.providerTaskId),
        error: readString(attemptObject.error),
      },
    ];
  });
};

const withFailedSelectedProviderAttempt = ({
  previousOutput,
  selectedProvider,
  failedProviderTaskId,
  providerError,
}: {
  previousOutput?: unknown;
  selectedProvider: string;
  failedProviderTaskId?: string | null;
  providerError?: string | null;
}) => {
  const attempts = readProviderAttempts(previousOutput);
  const failedAttemptIndex = attempts.findLastIndex(
    (attempt) => attempt.provider === selectedProvider
  );
  const error = providerError ?? 'Provider failed';

  if (failedAttemptIndex === -1) {
    return [
      ...attempts,
      {
        attempt: attempts.length + 1,
        provider: selectedProvider,
        status: 'failed' as const,
        accepted: false,
        providerTaskId: failedProviderTaskId ?? null,
        error,
      },
    ];
  }

  return attempts.map((attempt, index) =>
    index === failedAttemptIndex
      ? {
          ...attempt,
          status: 'failed' as const,
          accepted: false,
          providerTaskId: failedProviderTaskId ?? attempt.providerTaskId,
          error,
        }
      : attempt
  );
};

const isConfiguredGptImage2Provider = (provider: string) =>
  GPT_IMAGE_2_PROVIDER_CHAIN.includes(
    provider as (typeof GPT_IMAGE_2_PROVIDER_CHAIN)[number]
  );

const readStoredProviderChain = (output: unknown) => {
  const providerChain = asObject(output).providerChain;
  if (!Array.isArray(providerChain)) return null;

  const chain = providerChain.filter(
    (provider): provider is (typeof GPT_IMAGE_2_PROVIDER_CHAIN)[number] =>
      typeof provider === 'string' && isConfiguredGptImage2Provider(provider)
  );
  const uniqueChain = Array.from(new Set(chain));

  return uniqueChain.length === GPT_IMAGE_2_PROVIDER_CHAIN.length
    ? uniqueChain
    : null;
};

export const isGptImage2Effect = (effect: {
  model?: string | null;
  provider?: string | null;
}) =>
  effect.model === GPT_IMAGE_2_MODEL &&
  typeof effect.provider === 'string' &&
  isConfiguredGptImage2Provider(effect.provider);

export const resolveStoredGptImage2Provider = ({
  effect,
  output,
}: {
  effect: Pick<EffectRecord, 'model' | 'provider'>;
  output?: unknown;
}) => {
  if (!isGptImage2Effect(effect)) return effect.provider;
  const selectedProvider = readString(asObject(output).selectedProvider);
  return selectedProvider && isConfiguredGptImage2Provider(selectedProvider)
    ? selectedProvider
    : effect.provider;
};

export const resolveGptImage2ProviderChain = (input?: unknown) => {
  const inputObject = asObject(input);
  return inputObject.quality === 'low' && inputObject.wmOutputQuality === '1k'
    ? Array.from(GPT_IMAGE_2_LOW_1K_PROVIDER_CHAIN)
    : Array.from(GPT_IMAGE_2_PROVIDER_CHAIN);
};

const resolveProviderChain = ({
  input,
  output,
  providerChain,
}: {
  input?: unknown;
  output?: unknown;
  providerChain?: readonly string[];
}) => providerChain ?? readStoredProviderChain(output) ?? resolveGptImage2ProviderChain(input);

const withGptImage2FallbackMetadata = <
  T extends Awaited<ReturnType<typeof runProviderFallbackChain>>,
>({
  fallback,
  providerChain,
  selectedProviderStartedAt = new Date(),
}: {
  fallback: T;
  providerChain: readonly string[];
  selectedProviderStartedAt?: Date;
}) => {
  const output = asObject(fallback.result.output);
  return {
    ...fallback,
    result: {
      ...fallback.result,
      output: {
        ...output,
        providerChain: Array.from(providerChain),
        ...(fallback.selectedProvider
          ? {
              selectedProviderStartedAt:
                selectedProviderStartedAt.toISOString(),
            }
          : {}),
      },
    },
  };
};

export const createAdapterForStoredGptImage2Generation = ({
  effect,
  output,
  createAdapterForEffect = createAdapter,
}: {
  effect: EffectRecord;
  output?: unknown;
  createAdapterForEffect?: (effect: EffectRecord) => AdapterLike;
}) =>
  createAdapterForEffect({
    ...effect,
    provider: resolveStoredGptImage2Provider({ effect, output }),
  });

export const createGptImage2GenerationWithFallback = async ({
  effect,
  input,
  providerChain,
  createAdapterForEffect = createAdapter,
}: {
  effect: EffectRecord;
  input: unknown;
  providerChain?: readonly string[];
  createAdapterForEffect?: (effect: EffectRecord) => AdapterLike;
}) => {
  const resolvedProviderChain = resolveProviderChain({ input, providerChain });
  const fallback = await runProviderFallbackChain({
    providers: resolvedProviderChain.map((provider) => ({
      provider,
      createGeneration: () =>
        createAdapterForEffect({
          ...effect,
          provider,
        }).createGeneration(input),
    })),
  });
  return withGptImage2FallbackMetadata({
    fallback,
    providerChain: resolvedProviderChain,
  });
};

export const continueGptImage2GenerationAfterProviderFailure = async ({
  effect,
  input,
  previousOutput,
  failedProviderTaskId,
  providerError,
  createAdapterForEffect = createAdapter,
}: {
  effect: EffectRecord;
  input: unknown;
  previousOutput?: unknown;
  failedProviderTaskId?: string | null;
  providerError?: string | null;
  createAdapterForEffect?: (effect: EffectRecord) => AdapterLike;
}) => {
  if (!isGptImage2Effect(effect)) return null;

  const outputObject = asObject(previousOutput);
  const selectedProvider = readString(outputObject.selectedProvider);
  if (!selectedProvider || !isConfiguredGptImage2Provider(selectedProvider)) {
    return null;
  }

  const providerChain = resolveProviderChain({ input, output: previousOutput });
  const selectedProviderIndex = providerChain.indexOf(selectedProvider);
  if (selectedProviderIndex === -1) return null;

  const remainingProviders = providerChain.slice(selectedProviderIndex + 1);
  if (remainingProviders.length === 0) return null;

  const initialAttempts = withFailedSelectedProviderAttempt({
    previousOutput,
    selectedProvider,
    failedProviderTaskId,
    providerError,
  });
  const fallback = await runProviderFallbackChain({
    initialAttempts,
    providers: remainingProviders.map((provider) => ({
      provider,
      createGeneration: () =>
        createAdapterForEffect({
          ...effect,
          provider,
        }).createGeneration(input),
    })),
  });

  return withGptImage2FallbackMetadata({
    fallback,
    providerChain,
  });
};
