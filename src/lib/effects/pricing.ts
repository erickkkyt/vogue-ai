type PricingPrimitive = string | number | boolean;

type PricingRule = {
  when: Record<string, PricingPrimitive>;
  credits: number;
};

type PricingSchemaBase = {
  version?: number;
};

type FixedPricingSchema = PricingSchemaBase & {
  strategy: 'fixed';
  credits: number;
};

type MatrixPricingSchema = PricingSchemaBase & {
  strategy: 'matrix';
  fallbackCredits?: number;
  rules: PricingRule[];
};

export type EffectPricingSchema = FixedPricingSchema | MatrixPricingSchema;

export type PricingEffectLike = {
  credit?: number | null;
  provider?: string | null;
  pricingSchema?: unknown;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

export const NANO_BANANA_2_PRICING_SCHEMA: EffectPricingSchema = {
  version: 1,
  strategy: 'matrix',
  fallbackCredits: 6,
  rules: [
    { when: { wmOutputQuality: '1k' }, credits: 6 },
    { when: { wmOutputQuality: '2k' }, credits: 8 },
    { when: { wmOutputQuality: '4k' }, credits: 12 },
  ],
};

export const NANO_BANANA_PRICING_SCHEMA: EffectPricingSchema = {
  version: 1,
  strategy: 'fixed',
  credits: 4,
};

export const NANO_BANANA_PRO_PRICING_SCHEMA: EffectPricingSchema = {
  version: 1,
  strategy: 'matrix',
  fallbackCredits: 8,
  rules: [
    { when: { wmOutputQuality: '2k' }, credits: 8 },
    { when: { wmOutputQuality: '4k' }, credits: 14 },
  ],
};

export const GPT_IMAGE_15_PRICING_SCHEMA: EffectPricingSchema = {
  version: 1,
  strategy: 'matrix',
  fallbackCredits: 4,
  rules: [
    { when: { size: 'standard' }, credits: 4 },
    { when: { size: 'high' }, credits: 20 },
  ],
};

export const GPT_IMAGE_2_PRICING_SCHEMA: EffectPricingSchema = {
  version: 1,
  strategy: 'matrix',
  fallbackCredits: 10,
  rules: [
    { when: { wmOutputQuality: '1k', quality: 'low' }, credits: 4 },
    { when: { wmOutputQuality: '1k', quality: 'medium' }, credits: 10 },
    { when: { wmOutputQuality: '1k', quality: 'high' }, credits: 30 },
    { when: { wmOutputQuality: '2k', quality: 'low' }, credits: 6 },
    { when: { wmOutputQuality: '2k', quality: 'medium' }, credits: 16 },
    { when: { wmOutputQuality: '2k', quality: 'high' }, credits: 50 },
    { when: { wmOutputQuality: '4k', quality: 'low' }, credits: 8 },
    { when: { wmOutputQuality: '4k', quality: 'medium' }, credits: 24 },
    { when: { wmOutputQuality: '4k', quality: 'high' }, credits: 80 },
  ],
};

const GPT_IMAGE_2_PROVIDERS = new Set([
  'kie.gpt-image-2',
  'evolink.gpt-image-2',
  '302.gpt-image-2',
]);

export const IMAGE_EFFECT_PRICING_SCHEMA_BY_PROVIDER: Record<
  string,
  EffectPricingSchema
> = {
  'kie.nano-banana-2': NANO_BANANA_2_PRICING_SCHEMA,
  'evolink.nano-banana-2': NANO_BANANA_2_PRICING_SCHEMA,
  '302.nano-banana-2': NANO_BANANA_2_PRICING_SCHEMA,
  'kie.nano-banana': NANO_BANANA_PRICING_SCHEMA,
  'evolink.nano-banana': NANO_BANANA_PRICING_SCHEMA,
  '302.nano-banana': NANO_BANANA_PRICING_SCHEMA,
  'kie.nano-banana-pro': NANO_BANANA_PRO_PRICING_SCHEMA,
  'evolink.nano-banana-pro': NANO_BANANA_PRO_PRICING_SCHEMA,
  '302.nano-banana-pro': NANO_BANANA_PRO_PRICING_SCHEMA,
  'kie.gpt-image-1.5': GPT_IMAGE_15_PRICING_SCHEMA,
  'kie.gpt-image-2': GPT_IMAGE_2_PRICING_SCHEMA,
  'evolink.gpt-image-2': GPT_IMAGE_2_PRICING_SCHEMA,
  '302.gpt-image-2': GPT_IMAGE_2_PRICING_SCHEMA,
};

const normalizePricingSchema = (value: unknown): EffectPricingSchema | null => {
  if (!isRecord(value)) return null;

  if (value.strategy === 'fixed' && typeof value.credits === 'number') {
    return {
      strategy: 'fixed',
      credits: value.credits,
    };
  }

  if (value.strategy === 'matrix' && Array.isArray(value.rules)) {
    const rules = value.rules.flatMap((rule): PricingRule[] => {
      if (!isRecord(rule) || !isRecord(rule.when)) return [];
      if (typeof rule.credits !== 'number') return [];

      return [
        {
          when: Object.fromEntries(
            Object.entries(rule.when).filter(
              (entry): entry is [string, PricingPrimitive] =>
                typeof entry[1] === 'string' ||
                typeof entry[1] === 'number' ||
                typeof entry[1] === 'boolean'
            )
          ),
          credits: rule.credits,
        },
      ];
    });

    return {
      strategy: 'matrix',
      fallbackCredits:
        typeof value.fallbackCredits === 'number'
          ? value.fallbackCredits
          : undefined,
      rules,
    };
  }

  return null;
};

const getFallbackCredits = (
  effect: PricingEffectLike,
  schema?: MatrixPricingSchema | null
) => schema?.fallbackCredits ?? effect.credit ?? 0;

const getProviderPricingSchema = (provider?: string | null) =>
  provider ? IMAGE_EFFECT_PRICING_SCHEMA_BY_PROVIDER[provider] ?? null : null;

const getPricingSchemaForEffect = (effect: PricingEffectLike) =>
  normalizePricingSchema(effect.pricingSchema) ??
  getProviderPricingSchema(effect.provider);

const normalizePricingInputForEffect = (
  effect: PricingEffectLike,
  input: Record<string, unknown>
) => {
  if (
    effect.provider === 'kie.gpt-image-1.5' &&
    input.size === undefined &&
    (input.quality === 'standard' || input.quality === 'high')
  ) {
    return { ...input, size: input.quality };
  }

  return input;
};

const applyGenerationCountMultiplier = ({
  effect,
  input,
  credits,
}: {
  effect: PricingEffectLike;
  input: Record<string, unknown>;
  credits: number;
}) => {
  if (!effect.provider || !GPT_IMAGE_2_PROVIDERS.has(effect.provider)) {
    return credits;
  }

  const multiplier =
    typeof input.n === 'number' && input.n > 1 ? Math.min(input.n, 4) : 1;
  return credits * multiplier;
};

export function estimateCreditsForEffect({
  effect,
  input,
}: {
  effect: PricingEffectLike;
  input: Record<string, unknown>;
}) {
  const pricingInput = normalizePricingInputForEffect(effect, input);
  const pricingSchema = getPricingSchemaForEffect(effect);

  if (pricingSchema?.strategy === 'fixed') {
    return applyGenerationCountMultiplier({
      effect,
      input: pricingInput,
      credits: pricingSchema.credits,
    });
  }

  if (pricingSchema?.strategy === 'matrix') {
    const matchedRule = pricingSchema.rules.find((rule) =>
      Object.entries(rule.when).every(
        ([key, value]) => pricingInput[key] === value
      )
    );
    const credits =
      matchedRule?.credits ?? getFallbackCredits(effect, pricingSchema);

    return applyGenerationCountMultiplier({
      effect,
      input: pricingInput,
      credits,
    });
  }

  const credits = effect.credit ?? 0;
  return applyGenerationCountMultiplier({
    effect,
    input: pricingInput,
    credits,
  });
}
