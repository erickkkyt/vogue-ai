import 'server-only';

export type WatermarkWorkerResult = {
  url: string;
  key: string;
  contentType?: string;
  sizeBytes?: number;
};

const getWatermarkWorkerUrl = () => process.env.WATERMARK_WORKER_URL?.trim();

const getWatermarkWorkerSecret = () =>
  process.env.WATERMARK_WORKER_SECRET?.trim();

const isWatermarkEnabled = () => process.env.WATERMARK_ENABLED === 'true';

const assertWatermarkWorkerReady = () => {
  if (!isWatermarkEnabled()) {
    throw new Error('Watermarking is not enabled');
  }

  if (!getWatermarkWorkerUrl() || !getWatermarkWorkerSecret()) {
    throw new Error('Watermark worker is not configured');
  }
};

const asObject = (value: unknown): Record<string, unknown> | null =>
  value && typeof value === 'object' ? (value as Record<string, unknown>) : null;

const readWorkerResult = (value: unknown): WatermarkWorkerResult => {
  const payload = asObject(value);
  if (!payload) {
    throw new Error('Watermark worker returned an invalid response');
  }

  const url = payload.url;
  const key = payload.key;

  if (typeof url !== 'string' || typeof key !== 'string') {
    throw new Error('Watermark worker returned an invalid response');
  }

  return {
    url,
    key,
    contentType:
      typeof payload.contentType === 'string' ? payload.contentType : undefined,
    sizeBytes:
      typeof payload.sizeBytes === 'number' ? payload.sizeBytes : undefined,
  };
};

export const getWatermarkObjectKey = ({
  generationId,
  index,
}: {
  generationId: string;
  index: number;
}) => `effects/${generationId}/images/${generationId}-${index}-watermarked.webp`;

export const createWatermarkedImage = async ({
  sourceUrl,
  objectKey,
}: {
  sourceUrl: string;
  objectKey: string;
}) => {
  assertWatermarkWorkerReady();

  const response = await fetch(getWatermarkWorkerUrl() as string, {
    method: 'POST',
    headers: {
      authorization: `Bearer ${getWatermarkWorkerSecret()}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({ sourceUrl, objectKey }),
  });

  const payload = (await response.json().catch(() => null)) as unknown;
  if (!response.ok) {
    const error = asObject(payload)?.error;
    throw new Error(
      typeof error === 'string'
        ? `Watermark worker failed: ${error}`
        : `Watermark worker failed with ${response.status}`
    );
  }

  return readWorkerResult(payload);
};
