type EffectMetadataRecord = {
  id: number;
  provider: string;
  inputSchema: unknown;
  pricingSchema: unknown;
};

type EffectMetadataSource = EffectMetadataRecord & {
  isOpen: number | null;
};

const isPublicEffect = (
  effect: EffectMetadataSource,
  allowlist: ReadonlySet<number>
) => effect.isOpen === 1 || allowlist.has(effect.id);

export function buildPublicEffectsMetadata(
  effects: readonly EffectMetadataSource[],
  allowlist: ReadonlySet<number> = new Set()
) {
  return Object.fromEntries(
    effects
      .filter((effect) => isPublicEffect(effect, allowlist))
      .map((effect) => [
        String(effect.id),
        {
          id: effect.id,
          provider: effect.provider,
          inputSchema: effect.inputSchema,
          pricingSchema: effect.pricingSchema,
        },
      ])
  );
}
