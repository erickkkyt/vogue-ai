import 'server-only';

import { persistGenerationOutputAssets } from './output-assets';

export async function persistVideoOutputIfNeeded({
  output,
  wmTaskId,
  userId,
}: {
  output: unknown;
  wmTaskId: string;
  effectId: number;
  userId: string;
}) {
  return persistGenerationOutputAssets({
    generationId: wmTaskId,
    userId,
    output,
    assetType: 'video',
  });
}

