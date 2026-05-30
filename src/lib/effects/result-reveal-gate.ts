import type { GenerationAccessTier } from './generation-access';

export const STANDARD_RESULT_REVEAL_DELAY_MS = 10_000;

export type GenerationStatus = 'pending' | 'processing' | 'succeeded' | 'failed';
type OutputRecord = Record<string, unknown>;

const asNullableObject = (value: unknown): OutputRecord | null =>
  value && typeof value === 'object' ? (value as OutputRecord) : null;

const readDate = (value: unknown): Date | null => {
  if (typeof value !== 'string' || !value) return null;

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const stripInternalRevealFields = (output: OutputRecord): OutputRecord => {
  const {
    resultRevealPending: _resultRevealPending,
    resultRevealReadyAt: _resultRevealReadyAt,
    resultRevealTier: _resultRevealTier,
    ...publicOutput
  } = output;

  return publicOutput;
};

const redactHeldOutput = (output: OutputRecord): OutputRecord => {
  const {
    base_result_url: _baseResultUrl,
    result_url: _resultUrl,
    result_urls: _resultUrls,
    stored_result_url: _storedResultUrl,
    imageUrl: _imageUrl,
    image_url: _image_url,
    image_urls: _imageUrls,
    videoUrl: _videoUrl,
    video_url: _video_url,
    video_urls: _videoUrls,
    publicUrl: _publicUrl,
    url: _url,
    urls: _urls,
    ...safeOutput
  } = output;

  return stripInternalRevealFields(safeOutput);
};

export const applyResultRevealGate = ({
  accessTier,
  now = new Date(),
  output,
  status,
}: {
  accessTier: GenerationAccessTier;
  now?: Date;
  output: unknown;
  status: GenerationStatus;
}) => {
  const outputObject = asNullableObject(output);

  if (status !== 'succeeded' || accessTier === 'faster') {
    return {
      outputForResponse: outputObject
        ? stripInternalRevealFields(outputObject)
        : null,
      outputForStore: outputObject,
      responseStatus: status,
      shouldStoreOutput: false,
    };
  }

  const succeededOutput = outputObject ?? {};
  const existingReadyAt = readDate(succeededOutput.resultRevealReadyAt);
  const revealReadyAt =
    existingReadyAt ??
    new Date(now.getTime() + STANDARD_RESULT_REVEAL_DELAY_MS);
  const outputForStore = {
    ...succeededOutput,
    resultRevealReadyAt: revealReadyAt.toISOString(),
    resultRevealTier: 'standard',
  };

  if (now.getTime() >= revealReadyAt.getTime()) {
    return {
      outputForResponse: stripInternalRevealFields(outputForStore),
      outputForStore,
      responseStatus: 'succeeded' as const,
      shouldStoreOutput: !existingReadyAt,
    };
  }

  return {
    outputForResponse: redactHeldOutput(outputForStore),
    outputForStore,
    responseStatus: 'processing' as const,
    shouldStoreOutput: !existingReadyAt,
  };
};

export const isResultRevealVisible = ({
  now = new Date(),
  output,
  status,
}: {
  now?: Date;
  output: unknown;
  status: string;
}) => {
  if (status !== 'succeeded') return true;

  const revealReadyAt = readDate(asNullableObject(output)?.resultRevealReadyAt);
  return !revealReadyAt || now.getTime() >= revealReadyAt.getTime();
};
