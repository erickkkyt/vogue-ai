import { estimateCreditsForEffect } from '@/lib/effects/pricing';
import { z } from 'zod';
import { BaseAdapter, type GenerationResult } from './base-adapter';

const AI302_API_BASE = 'https://api.302.ai';
const AI302_GPT_IMAGE_2_PROVIDER = '302.gpt-image-2';
const GPT_IMAGE_2_MODEL = 'gpt-image-2';
const SUPPORTED_QUALITIES = ['low', 'medium', 'high'] as const;
const SUPPORTED_OUTPUT_QUALITIES = ['1k', '2k', '4k'] as const;
const PIXEL_SIZE_PATTERN = /^\d{2,4}[x×]\d{2,4}$/i;
const SUPPORTED_IMAGE_RATIOS = [
  'auto',
  '1:1',
  '1:2',
  '2:1',
  '1:3',
  '3:1',
  '2:3',
  '3:2',
  '3:4',
  '4:3',
  '4:5',
  '5:4',
  '9:16',
  '16:9',
  '9:21',
  '21:9',
] as const;

type Ai302RequestMode = 'generation' | 'edit';

const RATIO_TO_SIZE: Record<
  (typeof SUPPORTED_IMAGE_RATIOS)[number],
  'auto' | '1024x1024' | '1536x1024' | '1024x1536'
> = {
  auto: 'auto',
  '1:1': '1024x1024',
  '1:2': '1024x1536',
  '2:1': '1536x1024',
  '1:3': '1024x1536',
  '3:1': '1536x1024',
  '2:3': '1024x1536',
  '3:2': '1536x1024',
  '3:4': '1024x1536',
  '4:3': '1536x1024',
  '4:5': '1024x1536',
  '5:4': '1536x1024',
  '9:16': '1024x1536',
  '16:9': '1536x1024',
  '9:21': '1024x1536',
  '21:9': '1536x1024',
};

const isSupportedImageSize = (value: string) =>
  SUPPORTED_IMAGE_RATIOS.includes(
    value as (typeof SUPPORTED_IMAGE_RATIOS)[number]
  ) || PIXEL_SIZE_PATTERN.test(value);

const inputSchema = z.object({
  prompt: z.string().min(1, 'prompt is required'),
  aspect_ratio: z
    .string()
    .refine(isSupportedImageSize, 'Unsupported GPT Image 2 size')
    .optional(),
  size: z.enum(['standard', 'high']).optional(),
  quality: z.enum(SUPPORTED_QUALITIES).optional(),
  wmOutputQuality: z.enum(SUPPORTED_OUTPUT_QUALITIES).optional(),
  image_urls: z.array(z.string().url()).max(16).optional(),
  image_url: z.string().url().optional(),
  n: z.number().int().min(1).max(10).optional(),
});

type Ai302Input = z.infer<typeof inputSchema>;

const asRecord = (value: unknown) =>
  value && typeof value === 'object'
    ? (value as Record<string, unknown>)
    : null;

const readString = (value: unknown) =>
  typeof value === 'string' && value ? value : null;

const readStatus = (value: unknown) =>
  typeof value === 'string' ? value.toLowerCase() : '';

const readNumber = (value: unknown) =>
  typeof value === 'number' && Number.isFinite(value) ? value : null;

const readTaskId = (payload: Record<string, unknown>) =>
  readString(payload.task_id) ??
  readString(payload.taskId) ??
  readString(payload.id);

const isUrlLike = (value: string) =>
  /^https?:\/\//i.test(value) || /^data:image\//i.test(value);

const collectImageUrls = (value: unknown, urls: string[]) => {
  if (typeof value === 'string') {
    if (isUrlLike(value)) urls.push(value);
    return;
  }

  if (Array.isArray(value)) {
    for (const item of value) collectImageUrls(item, urls);
    return;
  }

  const record = asRecord(value);
  if (!record) return;

  for (const key of [
    'url',
    'image_url',
    'result_url',
    'data',
    'result',
    'output',
    'images',
  ]) {
    collectImageUrls(record[key], urls);
  }
};

const getImageUrls = (payload: Record<string, unknown>) => {
  const urls: string[] = [];
  collectImageUrls(payload, urls);
  return Array.from(new Set(urls));
};

const getErrorMessage = (payload: Record<string, unknown>) => {
  const error = asRecord(payload.error);
  return (
    readString(payload.message) ??
    readString(payload.error) ??
    readString(payload.err) ??
    readString(error?.message) ??
    readString(error?.code)
  );
};

const mapSize = (aspectRatio?: string) => {
  if (!aspectRatio) return 'auto';
  const normalized = aspectRatio.replace('×', 'x');
  if (PIXEL_SIZE_PATTERN.test(normalized)) return normalized.toLowerCase();
  return (
    RATIO_TO_SIZE[aspectRatio as (typeof SUPPORTED_IMAGE_RATIOS)[number]] ??
    'auto'
  );
};

const mapQuality = ({
  size,
  quality,
}: {
  size: 'standard' | 'high' | undefined;
  quality: 'low' | 'medium' | 'high' | undefined;
}) => {
  if (quality) return quality;
  return size === 'high' ? 'high' : 'medium';
};

const createOutput = ({
  taskId,
  mode,
  size,
  requestedOutputQuality,
  referenceImageCount,
}: {
  taskId?: string | null;
  mode: Ai302RequestMode;
  size: string;
  requestedOutputQuality?: string;
  referenceImageCount?: number;
}) => ({
  provider: '302',
  providerKey: AI302_GPT_IMAGE_2_PROVIDER,
  taskId,
  providerRequest: {
    mode,
    size,
    requestedOutputQuality: requestedOutputQuality ?? null,
    referenceImageCount: referenceImageCount ?? 0,
  },
});

const parseJson = async (response: Response) => {
  try {
    return (await response.json()) as Record<string, unknown>;
  } catch {
    return {};
  }
};

const getFilenameForImageUrl = (imageUrl: string, contentType: string) => {
  try {
    const pathname = new URL(imageUrl).pathname;
    const filename = pathname.split('/').filter(Boolean).pop();
    if (filename) return filename;
  } catch {}

  if (contentType.includes('jpeg') || contentType.includes('jpg')) {
    return 'reference-image.jpg';
  }
  if (contentType.includes('webp')) return 'reference-image.webp';
  return 'reference-image.png';
};

const fetchReferenceImage = async (imageUrl: string) => {
  const response = await fetch(imageUrl);
  if (!response.ok) {
    throw new Error(`Could not fetch reference image: ${response.status}`);
  }

  const blob = await response.blob();
  const contentType =
    blob.type || response.headers.get('content-type') || 'image/png';
  const typedBlob =
    blob.type === contentType
      ? blob
      : new Blob([await blob.arrayBuffer()], { type: contentType });

  return {
    blob: typedBlob,
    filename: getFilenameForImageUrl(imageUrl, contentType),
  };
};

export class Ai302ImageAdapter extends BaseAdapter {
  private getApiKey() {
    const key = process.env.AI302_API_KEY;
    if (!key) throw new Error('AI302_API_KEY is not configured');
    return key;
  }

  private assertSupportedProvider() {
    if (this.effect.provider !== AI302_GPT_IMAGE_2_PROVIDER) {
      throw new Error(`Unsupported 302 provider: ${this.effect.provider}`);
    }
  }

  estimateCost(input: unknown) {
    return estimateCreditsForEffect({
      effect: this.effect,
      input:
        input && typeof input === 'object'
          ? (input as Record<string, unknown>)
          : {},
    });
  }

  async createGeneration(input: unknown): Promise<GenerationResult> {
    this.assertSupportedProvider();

    const parsed = inputSchema.safeParse(input);
    if (!parsed.success) {
      return {
        status: 'failed',
        error: parsed.error.issues[0]?.message || 'Invalid input',
      };
    }

    const params = parsed.data;
    const imageUrls = params.image_urls?.length
      ? params.image_urls
      : params.image_url
        ? [params.image_url]
        : [];

    return imageUrls.length > 0
      ? this.createEditGeneration(params, imageUrls)
      : this.createTextGeneration(params);
  }

  async checkStatus(taskId: string): Promise<GenerationResult> {
    this.assertSupportedProvider();

    try {
      const response = await fetch(
        `${AI302_API_BASE}/async_result?task_id=${encodeURIComponent(taskId)}`,
        {
          headers: {
            Authorization: `Bearer ${this.getApiKey()}`,
          },
        }
      );
      const data = await parseJson(response);

      if (!response.ok) {
        return {
          status: 'failed',
          error: getErrorMessage(data) ?? '302 status check failed',
        };
      }

      const status = readStatus(data.status);
      if (status === 'failed' || status === 'error') {
        return {
          status: 'failed',
          error: getErrorMessage(data) ?? '302 generation failed',
        };
      }

      if (
        status === 'pending' ||
        status === 'queued' ||
        status === 'running' ||
        status === 'processing'
      ) {
        return {
          status:
            status === 'pending' || status === 'queued'
              ? 'pending'
              : 'processing',
          output: {
            provider: '302',
            providerKey: AI302_GPT_IMAGE_2_PROVIDER,
            taskId,
          },
        };
      }

      const errorMessage = getErrorMessage(data);
      const statusCode = readNumber(data.status_code);
      if (
        errorMessage?.trim().toLowerCase() === 'result pending' &&
        (statusCode === null || statusCode === 200)
      ) {
        return {
          status: 'processing',
          output: {
            provider: '302',
            providerKey: AI302_GPT_IMAGE_2_PROVIDER,
            taskId,
          },
        };
      }

      if (errorMessage) return { status: 'failed', error: errorMessage };

      const imageUrls = getImageUrls(data);
      const first = imageUrls[0] ?? null;
      if (first) {
        return {
          status: 'succeeded',
          output: {
            provider: '302',
            providerKey: AI302_GPT_IMAGE_2_PROVIDER,
            image_urls: imageUrls,
            result_url: first,
            taskId,
          },
        };
      }

      return {
        status: 'processing',
        output: {
          provider: '302',
          providerKey: AI302_GPT_IMAGE_2_PROVIDER,
          taskId,
        },
      };
    } catch (error) {
      return {
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown network error',
      };
    }
  }

  private async createTextGeneration(
    params: Ai302Input
  ): Promise<GenerationResult> {
    const size = mapSize(params.aspect_ratio);
    const requestBody = {
      model: GPT_IMAGE_2_MODEL,
      prompt: params.prompt.trim(),
      n: params.n ?? 1,
      size,
      quality: mapQuality({ size: params.size, quality: params.quality }),
    };

    return this.submitGeneration({
      path: '/v1/images/generations',
      body: JSON.stringify(requestBody),
      mode: 'generation',
      size,
      requestedOutputQuality: params.wmOutputQuality,
    });
  }

  private async createEditGeneration(
    params: Ai302Input,
    imageUrls: string[]
  ): Promise<GenerationResult> {
    const size = mapSize(params.aspect_ratio);

    try {
      const images = await Promise.all(imageUrls.map(fetchReferenceImage));
      const form = new FormData();
      form.append('model', GPT_IMAGE_2_MODEL);
      form.append('prompt', params.prompt.trim());
      for (const image of images) {
        form.append('image', image.blob, image.filename);
      }
      form.append('n', String(params.n ?? 1));
      form.append('size', size);
      form.append(
        'quality',
        mapQuality({ size: params.size, quality: params.quality })
      );

      return this.submitGeneration({
        path: '/v1/images/edits',
        body: form,
        mode: 'edit',
        size,
        requestedOutputQuality: params.wmOutputQuality,
        referenceImageCount: images.length,
      });
    } catch (error) {
      return {
        status: 'failed',
        error:
          error instanceof Error
            ? error.message
            : 'Unknown reference image error',
      };
    }
  }

  private async submitGeneration({
    path,
    body,
    mode,
    size,
    requestedOutputQuality,
    referenceImageCount,
  }: {
    path: string;
    body: BodyInit;
    mode: Ai302RequestMode;
    size: string;
    requestedOutputQuality?: string;
    referenceImageCount?: number;
  }): Promise<GenerationResult> {
    const headers: HeadersInit = {
      Authorization: `Bearer ${this.getApiKey()}`,
    };
    if (typeof body === 'string') {
      headers['Content-Type'] = 'application/json';
    }

    try {
      const response = await fetch(
        `${AI302_API_BASE}${path}?response_format=url&async=true`,
        { method: 'POST', headers, body }
      );
      const data = await parseJson(response);
      const taskId = readTaskId(data);
      const imageUrls = getImageUrls(data);
      const first = imageUrls[0] ?? null;

      if (!response.ok) {
        return {
          status: 'failed',
          error: getErrorMessage(data) ?? '302 API error',
        };
      }

      if (first) {
        return {
          status: 'succeeded',
          output: {
            ...createOutput({
              taskId,
              mode,
              size,
              requestedOutputQuality,
              referenceImageCount,
            }),
            image_urls: imageUrls,
            result_url: first,
          },
        };
      }

      if (taskId) {
        return {
          status: 'pending',
          output: createOutput({
            taskId,
            mode,
            size,
            requestedOutputQuality,
            referenceImageCount,
          }),
        };
      }

      return {
        status: 'failed',
        error: getErrorMessage(data) ?? '302 API returned no task id',
      };
    } catch (error) {
      return {
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown network error',
      };
    }
  }
}
