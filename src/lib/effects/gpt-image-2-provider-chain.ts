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
const NANO_BANANA_2_KIE_PROVIDER = 'kie.nano-banana-2';
const NANO_BANANA_2_EVOLINK_PROVIDER = 'evolink.nano-banana-2';
const NANO_BANANA_2_AI302_PROVIDER = '302.nano-banana-2';
const NANO_BANANA_KIE_PROVIDER = 'kie.nano-banana';
const NANO_BANANA_EVOLINK_PROVIDER = 'evolink.nano-banana';
const NANO_BANANA_AI302_PROVIDER = '302.nano-banana';
const NANO_BANANA_PRO_KIE_PROVIDER = 'kie.nano-banana-pro';
const NANO_BANANA_PRO_EVOLINK_PROVIDER = 'evolink.nano-banana-pro';
const NANO_BANANA_PRO_AI302_PROVIDER = '302.nano-banana-pro';

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

export const NANO_BANANA_2_PROVIDER_CHAIN = [
  NANO_BANANA_2_EVOLINK_PROVIDER,
  NANO_BANANA_2_KIE_PROVIDER,
  NANO_BANANA_2_AI302_PROVIDER,
] as const;

export const NANO_BANANA_PROVIDER_CHAIN = [
  NANO_BANANA_EVOLINK_PROVIDER,
  NANO_BANANA_KIE_PROVIDER,
  NANO_BANANA_AI302_PROVIDER,
] as const;

export const NANO_BANANA_PRO_PROVIDER_CHAIN = [
  NANO_BANANA_PRO_EVOLINK_PROVIDER,
  NANO_BANANA_PRO_KIE_PROVIDER,
  NANO_BANANA_PRO_AI302_PROVIDER,
] as const;

const IMAGE_PROVIDER_CHAINS = [
  GPT_IMAGE_2_PROVIDER_CHAIN,
  GPT_IMAGE_2_LOW_1K_PROVIDER_CHAIN,
  NANO_BANANA_2_PROVIDER_CHAIN,
  NANO_BANANA_PROVIDER_CHAIN,
  NANO_BANANA_PRO_PROVIDER_CHAIN,
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

const NON_RETRYABLE_FAILURE_PATTERNS = [
  /content failed (the )?review/i,
  /failed the review/i,
  /violated .*policy/i,
  /prohibited use/i,
  /filtered out/i,
  /safety/i,
  /moderation/i,
  /nsfw/i,
] as const;

const isNonRetryableProviderFailure = (error?: string | null) =>
  typeof error === 'string' &&
  NON_RETRYABLE_FAILURE_PATTERNS.some((pattern) => pattern.test(error));

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

const isConfiguredImageProvider = (provider: string) =>
  IMAGE_PROVIDER_CHAINS.some((chain) =>
    (chain as readonly string[]).includes(provider)
  );

const getImageProviderChainForEffect = (effect: {
  provider?: string | null;
}) => {
  switch (effect.provider) {
    case NANO_BANANA_2_KIE_PROVIDER:
    case NANO_BANANA_2_EVOLINK_PROVIDER:
    case NANO_BANANA_2_AI302_PROVIDER:
      return Array.from(NANO_BANANA_2_PROVIDER_CHAIN);
    case NANO_BANANA_KIE_PROVIDER:
    case NANO_BANANA_EVOLINK_PROVIDER:
    case NANO_BANANA_AI302_PROVIDER:
      return Array.from(NANO_BANANA_PROVIDER_CHAIN);
    case NANO_BANANA_PRO_KIE_PROVIDER:
    case NANO_BANANA_PRO_EVOLINK_PROVIDER:
    case NANO_BANANA_PRO_AI302_PROVIDER:
      return Array.from(NANO_BANANA_PRO_PROVIDER_CHAIN);
    default:
      return null;
  }
};

const readStoredProviderChain = (output: unknown) => {
  const providerChain = asObject(output).providerChain;
  if (!Array.isArray(providerChain)) return null;

  const chain = providerChain.filter(
    (provider): provider is string =>
      typeof provider === 'string' && isConfiguredImageProvider(provider)
  );
  const uniqueChain = Array.from(new Set(chain));

  return uniqueChain.length > 0 ? uniqueChain : null;
};

export const isGptImage2Effect = (effect: {
  model?: string | null;
  provider?: string | null;
}) =>
  effect.model === GPT_IMAGE_2_MODEL &&
  typeof effect.provider === 'string' &&
  isConfiguredGptImage2Provider(effect.provider);

export const isNanoBananaFallbackEffect = (effect: {
  provider?: string | null;
}) =>
  typeof effect.provider === 'string' &&
  Boolean(getImageProviderChainForEffect(effect));

export const isImageProviderFallbackEffect = (effect: {
  model?: string | null;
  provider?: string | null;
}) => isGptImage2Effect(effect) || isNanoBananaFallbackEffect(effect);

export const resolveGptImage2ProviderChain = (input?: unknown) => {
  const inputObject = asObject(input);
  return inputObject.quality === 'low' && inputObject.wmOutputQuality === '1k'
    ? Array.from(GPT_IMAGE_2_LOW_1K_PROVIDER_CHAIN)
    : Array.from(GPT_IMAGE_2_PROVIDER_CHAIN);
};

const resolveProviderChain = ({
  effect,
  input,
  output,
  providerChain,
}: {
  effect?: Pick<EffectRecord, 'model' | 'provider'>;
  input?: unknown;
  output?: unknown;
  providerChain?: readonly string[];
}) => {
  if (providerChain) return providerChain;
  const storedChain = readStoredProviderChain(output);
  if (effect) {
    const effectChain = isGptImage2Effect(effect)
      ? resolveGptImage2ProviderChain(input)
      : getImageProviderChainForEffect(effect);
    if (storedChain && effectChain) {
      const configuredChain = effectChain as readonly string[];
      const validStoredChain = storedChain.filter((provider) =>
        configuredChain.includes(provider)
      );
      return [
        ...validStoredChain,
        ...configuredChain.filter(
          (provider) => !validStoredChain.includes(provider)
        ),
      ];
    }
    if (storedChain) return storedChain;
    if (effectChain) return effectChain;
  }
  if (storedChain) return storedChain;
  return resolveGptImage2ProviderChain(input);
};

const withImageFallbackMetadata = <
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

export const resolveStoredImageProvider = ({
  effect,
  output,
}: {
  effect: Pick<EffectRecord, 'model' | 'provider'>;
  output?: unknown;
}) => {
  if (!isImageProviderFallbackEffect(effect)) return effect.provider;
  const selectedProvider = readString(asObject(output).selectedProvider);
  const providerChain = resolveProviderChain({ effect, output });
  return selectedProvider && providerChain.includes(selectedProvider)
    ? selectedProvider
    : effect.provider;
};

export const createAdapterForStoredImageGeneration = ({
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
    provider: resolveStoredImageProvider({ effect, output }),
  });

export const createAdapterForStoredGptImage2Generation =
  createAdapterForStoredImageGeneration;

export const createImageGenerationWithFallback = async ({
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
  const resolvedProviderChain = resolveProviderChain({
    effect,
    input,
    providerChain,
  });
  const fallback = await runProviderFallbackChain({
    providers: resolvedProviderChain.map((provider) => ({
      provider,
      createGeneration: () =>
        createAdapterForEffect({
          ...effect,
          provider,
        }).createGeneration(input),
    })),
    shouldStopOnFailure: (attempt) =>
      isNonRetryableProviderFailure(attempt.error),
  });
  return withImageFallbackMetadata({
    fallback,
    providerChain: resolvedProviderChain,
  });
};

export const createGptImage2GenerationWithFallback =
  createImageGenerationWithFallback;

export const continueImageGenerationAfterProviderFailure = async ({
  effect,
  input,
  previousOutput,
  failedProviderTaskId,
  providerError,
  providerChain,
  createAdapterForEffect = createAdapter,
}: {
  effect: EffectRecord;
  input: unknown;
  previousOutput?: unknown;
  failedProviderTaskId?: string | null;
  providerError?: string | null;
  providerChain?: readonly string[];
  createAdapterForEffect?: (effect: EffectRecord) => AdapterLike;
}) => {
  if (!isImageProviderFallbackEffect(effect)) return null;

  const resolvedProviderChain = resolveProviderChain({
    effect,
    input,
    output: previousOutput,
    providerChain,
  });
  const selectedProvider = resolveStoredImageProvider({
    effect,
    output: previousOutput,
  });
  if (!selectedProvider) return null;

  const selectedProviderIndex = resolvedProviderChain.indexOf(selectedProvider);
  if (selectedProviderIndex === -1) return null;

  const remainingProviders = resolvedProviderChain.slice(
    selectedProviderIndex + 1
  );
  if (remainingProviders.length === 0) return null;

  const initialAttempts = withFailedSelectedProviderAttempt({
    previousOutput,
    selectedProvider,
    failedProviderTaskId,
    providerError,
  });

  if (isNonRetryableProviderFailure(providerError)) {
    return withImageFallbackMetadata({
      fallback: {
        selectedProvider: null,
        attempts: initialAttempts,
        result: {
          status: 'failed',
          error: providerError ?? 'Provider returned a non-retryable failure',
          output: {
            ...asObject(previousOutput),
            selectedProvider: null,
            providerAttempts: initialAttempts,
          },
        },
      },
      providerChain: resolvedProviderChain,
    });
  }

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
    shouldStopOnFailure: (attempt) =>
      isNonRetryableProviderFailure(attempt.error),
  });

  return withImageFallbackMetadata({
    fallback,
    providerChain: resolvedProviderChain,
  });
};

export const continueGptImage2GenerationAfterProviderFailure =
  continueImageGenerationAfterProviderFailure;
