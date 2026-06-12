import {
  confirmReservedCredits,
  releaseReservedCredits,
} from '@/credits/credits';
import type { GenerationStatus } from './record-generation';

type ConfirmCredits = typeof confirmReservedCredits;
type ReleaseCredits = typeof releaseReservedCredits;
type UpdateGenerationParams = {
  id: string;
  status: GenerationStatus;
  output?: unknown;
  error?: string | null;
  creditsUsed?: number;
};
type UpdateGeneration = (params: UpdateGenerationParams) => Promise<boolean>;

const updateGenerationRecord: UpdateGeneration = async (params) => {
  const { updateGenerationById } = await import('./record-generation');
  return updateGenerationById(params);
};

export async function settleGenerationStatus({
  generationId,
  userId,
  effectName,
  status,
  output,
  error,
  creditsUsed,
  confirmCredits = confirmReservedCredits,
  releaseCredits = releaseReservedCredits,
  updateGeneration = updateGenerationRecord,
}: {
  generationId: string;
  userId: string;
  effectName: string;
  status: GenerationStatus;
  output?: unknown;
  error?: string | null;
  creditsUsed?: number;
  confirmCredits?: ConfirmCredits;
  releaseCredits?: ReleaseCredits;
  updateGeneration?: UpdateGeneration;
}) {
  const settledCreditsUsed =
    status === 'failed' ? 0 : creditsUsed;

  if (status === 'succeeded' && Number.isFinite(creditsUsed) && creditsUsed! > 0) {
    await confirmCredits({
      userId,
      referenceId: generationId,
      description: `${effectName} image generation`,
    });
  }

  if (status === 'failed') {
    await releaseCredits({
      userId,
      referenceId: generationId,
      description: `Released credits for failed ${effectName} generation`,
    });
  }

  return updateGeneration({
    id: generationId,
    status,
    output,
    error: error ?? null,
    ...(settledCreditsUsed !== undefined
      ? { creditsUsed: settledCreditsUsed }
      : {}),
  });
}
