import 'server-only';

import { persistGenerationOutputAssets } from './output-assets';

export async function persistEffectOutputIfNeeded({
  output,
  wmTaskId,
  effectType,
  userId,
  watermarkOutput = false,
}: {
  output: unknown;
  wmTaskId: string;
  effectId: number;
  effectType: number;
  userId?: string;
  watermarkOutput?: boolean;
}) {
  if (!userId) return output;

  return persistGenerationOutputAssets({
    generationId: wmTaskId,
    userId,
    output,
    assetType: effectType === 1 ? 'video' : 'image',
    watermarkOutput,
  });
}
