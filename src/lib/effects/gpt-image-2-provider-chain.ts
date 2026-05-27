import type { GenerationResult } from '@/lib/adapters/base-adapter';
import { createAdapter } from '@/lib/adapters/adapter-factory';
import type { EffectRecord } from './effects';
import { runProviderFallbackChain } from './provider-fallback';

const GPT_IMAGE_2_MODEL = 'gpt-image-2';
const GPT_IMAGE_2_KIE_PROVIDER = 'kie.gpt-image-2';
const GPT_IMAGE_2_EVOLINK_PROVIDER = 'evolink.gpt-image-2';
const GPT_IMAGE_2_AI302_PROVIDER = '302.gpt-image-2';

export const GPT_IMAGE_2_PROVIDER_CHAIN = [
  GPT_IMAGE_2_KIE_PROVIDER,
  GPT_IMAGE_2_EVOLINK_PROVIDER,
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

const isConfiguredGptImage2Provider = (provider: string) =>
  GPT_IMAGE_2_PROVIDER_CHAIN.includes(
    provider as (typeof GPT_IMAGE_2_PROVIDER_CHAIN)[number]
  );

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
  providerChain = GPT_IMAGE_2_PROVIDER_CHAIN,
  createAdapterForEffect = createAdapter,
}: {
  effect: EffectRecord;
  input: unknown;
  providerChain?: readonly string[];
  createAdapterForEffect?: (effect: EffectRecord) => AdapterLike;
}) =>
  runProviderFallbackChain({
    providers: providerChain.map((provider) => ({
      provider,
      createGeneration: () =>
        createAdapterForEffect({
          ...effect,
          provider,
        }).createGeneration(input),
    })),
  });
