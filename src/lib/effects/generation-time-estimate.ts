import type { GenerationAccessTier } from './generation-access';

const GPT_IMAGE_2_EXPECTED_LOW_SECONDS = 45;
const GPT_IMAGE_2_EXPECTED_STANDARD_SECONDS = 60;
const GPT_IMAGE_1_5_EXPECTED_SECONDS = 60;
const NANO_BANANA_EXPECTED_SECONDS_BY_MODEL_ID: Record<string, number> = {
  nanobanana: 30,
  nanobanana2: 45,
  nanobananapro: 45,
};
const STANDARD_QUEUE_EXTRA_SECONDS_BY_MODEL_ID: Record<string, number> = {
  gptimage15: 20,
  nanobanana: 15,
  nanobanana2: 15,
  nanobananapro: 15,
};
const DEFAULT_IMAGE_EXPECTED_GENERATION_SECONDS = 70;
const DEFAULT_VIDEO_EXPECTED_GENERATION_SECONDS = 120;

export const resolveWorkspaceGenerationTimeEstimate = ({
  assetType,
  modelId,
  quality,
}: {
  assetType: 'image' | 'video';
  modelId: string | null | undefined;
  quality?: string | null;
  outputQuality?: string | null;
}) => {
  if (modelId === 'gptimage2') {
    return quality === 'low'
      ? GPT_IMAGE_2_EXPECTED_LOW_SECONDS
      : GPT_IMAGE_2_EXPECTED_STANDARD_SECONDS;
  }

  if (modelId === 'gptimage15') {
    return GPT_IMAGE_1_5_EXPECTED_SECONDS;
  }

  const nanoBananaExpectedSeconds = modelId
    ? NANO_BANANA_EXPECTED_SECONDS_BY_MODEL_ID[modelId]
    : null;
  if (typeof nanoBananaExpectedSeconds === 'number') {
    return nanoBananaExpectedSeconds;
  }

  return assetType === 'video'
    ? DEFAULT_VIDEO_EXPECTED_GENERATION_SECONDS
    : DEFAULT_IMAGE_EXPECTED_GENERATION_SECONDS;
};

export const resolveWorkspaceStandardGenerationTimeEstimate = (
  params: Parameters<typeof resolveWorkspaceGenerationTimeEstimate>[0]
) => {
  const baseSeconds = resolveWorkspaceGenerationTimeEstimate(params);

  if (params.modelId === 'gptimage2') {
    return baseSeconds + (params.quality === 'low' ? 15 : 20);
  }

  const extraSeconds = params.modelId
    ? STANDARD_QUEUE_EXTRA_SECONDS_BY_MODEL_ID[params.modelId]
    : null;

  return typeof extraSeconds === 'number'
    ? baseSeconds + extraSeconds
    : baseSeconds;
};

export const resolveWorkspaceGenerationTimeEstimateForTier = ({
  accessTier,
  ...params
}: Parameters<typeof resolveWorkspaceGenerationTimeEstimate>[0] & {
  accessTier: GenerationAccessTier;
}) =>
  accessTier === 'faster'
    ? resolveWorkspaceGenerationTimeEstimate(params)
    : resolveWorkspaceStandardGenerationTimeEstimate(params);
