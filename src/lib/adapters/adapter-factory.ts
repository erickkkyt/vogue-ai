import type { EffectRecord } from '@/lib/effects/effects';
import { Ai302ImageAdapter } from './ai302-image-adapter';
import { EvolinkImageAdapter } from './evolink-image-adapter';
import { KieMarketAdapter } from './kie-market-adapter';

export function createAdapter(effect: EffectRecord) {
  if (
    effect.provider === 'evolink.gpt-image-2' ||
    effect.provider === 'evolink.nano-banana-2' ||
    effect.provider === 'evolink.nano-banana' ||
    effect.provider === 'evolink.nano-banana-pro'
  ) {
    return new EvolinkImageAdapter(effect);
  }
  if (effect.provider.startsWith('kie.')) {
    return new KieMarketAdapter(effect);
  }
  if (
    effect.provider === '302.gpt-image-2' ||
    effect.provider === '302.nano-banana-2' ||
    effect.provider === '302.nano-banana' ||
    effect.provider === '302.nano-banana-pro'
  ) {
    return new Ai302ImageAdapter(effect);
  }
  throw new Error(`Unsupported effect provider: ${effect.provider}`);
}
