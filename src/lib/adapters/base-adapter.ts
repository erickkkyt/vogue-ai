import type { EffectRecord } from '@/lib/effects/effects';
import type { ProviderGenerationStatus } from '@/lib/effects/generation-output';

export type GenerationResult = {
  status: ProviderGenerationStatus;
  output?: unknown;
  error?: string;
};

export abstract class BaseAdapter {
  protected effect: EffectRecord;

  constructor(effect: EffectRecord) {
    this.effect = effect;
  }

  abstract createGeneration(input: unknown): Promise<GenerationResult>;

  async checkStatus?(taskId: string): Promise<GenerationResult>;

  estimateCost?(input: unknown): number;
}
