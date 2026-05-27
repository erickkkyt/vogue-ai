import type { EffectRecord } from './effects';

export function estimateCreditsForEffect({
  effect,
  input,
}: {
  effect: EffectRecord;
  input: Record<string, unknown>;
}) {
  const base = effect.credit ?? 0;
  const n = typeof input.n === 'number' && input.n > 1 ? Math.min(input.n, 4) : 1;
  const qualityMultiplier =
    input.wmOutputQuality === '4k' ? 2 : input.quality === 'high' ? 1.5 : 1;

  return Math.ceil(base * n * qualityMultiplier);
}
