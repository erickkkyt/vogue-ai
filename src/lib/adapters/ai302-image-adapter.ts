import { estimateCreditsForEffect } from '@/lib/effects/pricing';
import { z } from 'zod';
import { BaseAdapter, type GenerationResult } from './base-adapter';

const AI302_API_BASE = 'https://api.302.ai';
const AI302_PROVIDER_CONFIG = {
  '302.gpt-image-2': {
    kind: 'openai-images',
    model: 'gpt-image-2',
    maxReferenceImages: 16,
  },
  '302.nano-banana-2': {
    kind: 'wavespeed',
    textPath: '/ws/api/v3/google/nano-banana-2/text-to-image',
    editPath: '/ws/api/v3/google/nano-banana-2/edit',
    maxReferenceImages: 14,
    supportsResolution: true,
  },
  '302.nano-banana': {
    kind: 'legacy-submit',
    textPath: '/302/submit/gemini-2.5-flash-image-async',
    editPath: '/302/submit/gemini-2.5-flash-image-edit-async',
    resultPath: '/302/submit/gemini-2.5-flash-image-async',
    maxReferenceImages: 5,
    supportsResolution: false,
  },
  '302.nano-banana-pro': {
    kind: 'wavespeed',
    textPath: '/ws/api/v3/google/nano-banana-pro/text-to-image',
    editPath: '/ws/api/v3/google/nano-banana-pro/edit',
    maxReferenceImages: 14,
    supportsResolution: true,
  },
} as const;

type Ai302ProviderKey = keyof typeof AI302_PROVIDER_CONFIG;
type Ai302ProviderConfig = (typeof AI302_PROVIDER_CONFIG)[Ai302ProviderKey];

const SUPPORTED_QUALITIES = ['low', 'medium', 'high'] as const;
const SUPPORTED_OUTPUT_QUALITIES = ['1k', '2k', '4k'] as const;
const PIXEL_SIZE_PATTERN = /^\d{2,4}[x×]\d{2,4}$/i;
const SUPPORTED_IMAGE_SIZES = [
  'auto',
  '1024x1024',
  '1536x1024',
  '1024x1536',
] as const;
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
const SUPPORTED_NANO_IMAGE_RATIOS = [
  '1:1',
  '3:2',
  '2:3',
  '3:4',
  '4:3',
  '4:5',
  '5:4',
  '9:16',
  '16:9',
  '21:9',
] as const;

type Ai302RequestMode = 'generation' | 'edit';

const RATIO_TO_SIZE: Record<
  (typeof SUPPORTED_IMAGE_RATIOS)[number],
  (typeof SUPPORTED_IMAGE_SIZES)[number]
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
    .refine(isSupportedImageSize, 'Unsupported image size')
    .optional(),
  size: z.enum(['standard', 'high']).optional(),
  quality: z.enum(SUPPORTED_QUALITIES).optional(),
  wmOutputQuality: z.enum(SUPPORTED_OUTPUT_QUALITIES).optional(),
  image_urls: z.array(z.string().url()).max(16).optional(),
  image_url: z.string().url().optional(),
  n: z.number().int().min(1).max(10).optional(),
  callBackUrl: z.string().url().optional(),
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
  readString(payload.request_id) ??
  readString(payload.id);

const isUrlLike = (value: string) =>
  /^https?:\/\//i.test(value) || /^data:image\//i.test(value);

const collectImageUrls = (value: unknown, urls: string[]) => {
  if (typeof value === 'string') {
    if (isUrlLike(value)) {
      urls.push(value);
      return;
    }
    try {
      collectImageUrls(JSON.parse(value), urls);
    } catch {}
    return;
  }

  if (value instanceof Blob) return;
  if (value instanceof ArrayBuffer) return;
  if (value && ArrayBuffer.isView(value)) return;

  if (value instanceof URL) {
    collectImageUrls(value.toString(), urls);
    return;
  }

  if (value && typeof value === 'object' && 'href' in value) {
    const href = (value as { href?: unknown }).href;
    if (typeof href === 'string') collectImageUrls(href, urls);
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
    'outputs',
    'images',
    'candidates',
    'parts',
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

const isResultPendingMessage = (value: string | null) =>
  value?.trim().toLowerCase() === 'result pending';

const mapSize = (aspectRatio?: string) => {
  if (!aspectRatio) return 'auto';
  const normalized = aspectRatio.replace('×', 'x');
  if (PIXEL_SIZE_PATTERN.test(normalized)) return normalized.toLowerCase();
  return (
    RATIO_TO_SIZE[aspectRatio as (typeof SUPPORTED_IMAGE_RATIOS)[number]] ??
    'auto'
  );
};

const mapNanoAspectRatio = (aspectRatio?: string) => {
  if (!aspectRatio || aspectRatio === 'auto') return '1:1';
  const normalized = aspectRatio.replace('×', 'x').toLowerCase();
  if (normalized === '1024x1024') return '1:1';
  if (normalized === '1536x1024') return '3:2';
  if (normalized === '1024x1536') return '2:3';
  if (
    SUPPORTED_NANO_IMAGE_RATIOS.includes(
      aspectRatio as (typeof SUPPORTED_NANO_IMAGE_RATIOS)[number]
    )
  ) {
    return aspectRatio;
  }
  return '1:1';
};

const mapNanoResolution = (value: Ai302Input['wmOutputQuality']) => {
  if (value === '1k' || value === '2k' || value === '4k') return value;
  return undefined;
};

const mapQuality = ({
  size,
  quality,
}: {
  size: 'standard' | 'high' | undefined;
  quality: 'low' | 'medium' | 'high' | undefined;
}): (typeof SUPPORTED_QUALITIES)[number] => {
  if (quality) return quality;
  return size === 'high' ? 'high' : 'medium';
};

const createOutput = ({
  providerKey,
  taskId,
  mode,
  size,
  requestedOutputQuality,
  referenceImageCount,
}: {
  providerKey: Ai302ProviderKey;
  taskId?: string | null;
  mode: Ai302RequestMode;
  size: string;
  requestedOutputQuality?: string;
  referenceImageCount?: number;
}) => ({
  provider: '302',
  providerKey,
  taskId,
  providerRequest: {
    mode,
    size,
    requestedResolution: requestedOutputQuality ?? null,
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

  private getProviderConfig() {
    if (!(this.effect.provider in AI302_PROVIDER_CONFIG)) {
      throw new Error(`Unsupported 302 provider: ${this.effect.provider}`);
    }
    return AI302_PROVIDER_CONFIG[this.effect.provider as Ai302ProviderKey];
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
    const config = this.getProviderConfig();
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
      ? this.createEditGeneration(config, params, imageUrls)
      : this.createTextGeneration(config, params);
  }

  async checkStatus(taskId: string): Promise<GenerationResult> {
    const config = this.getProviderConfig();
    const providerKey = this.effect.provider as Ai302ProviderKey;

    try {
      const response = await fetch(this.getStatusUrl(config, taskId), {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${this.getApiKey()}`,
        },
      });
      const data = await parseJson(response);
      const payload = asRecord(data.data) ?? data;

      if (!response.ok) {
        return {
          status: 'failed',
          error: getErrorMessage(data) ?? '302 status check failed',
        };
      }

      const status = readStatus(payload.status) || readStatus(data.status);
      if (status === 'failed' || status === 'error') {
        return {
          status: 'failed',
          error:
            getErrorMessage(payload) ??
            getErrorMessage(data) ??
            '302 generation failed',
        };
      }

      if (
        status === 'pending' ||
        status === 'in_queue' ||
        status === 'queued' ||
        status === 'created' ||
        status === 'submitted' ||
        status === 'starting' ||
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
            providerKey,
            taskId,
          },
        };
      }

      const errorMessage = getErrorMessage(data);
      const statusCode = readNumber(data.status_code);
      if (
        isResultPendingMessage(errorMessage) &&
        (statusCode === null || statusCode === 200)
      ) {
        return {
          status: 'processing',
          output: {
            provider: '302',
            providerKey,
            taskId,
          },
        };
      }

      const imageUrls = getImageUrls(data);
      const first = imageUrls[0] ?? null;
      if (first) {
        return {
          status: 'succeeded',
          output: {
            provider: '302',
            providerKey,
            image_urls: imageUrls,
            result_url: first,
            taskId,
          },
        };
      }

      const successMessage =
        readStatus(payload.message) === 'success' ||
        readStatus(data.message) === 'success';
      if (errorMessage && !successMessage) {
        return { status: 'failed', error: errorMessage };
      }

      if (statusCode !== null && statusCode >= 400) {
        return {
          status: 'failed',
          error: `302 generation failed with status code ${statusCode}`,
        };
      }

      if (
        status === 'completed' ||
        status === 'complete' ||
        status === 'succeeded' ||
        status === 'success' ||
        status === 'done'
      ) {
        return {
          status: 'failed',
          error: '302 generation completed without image output',
        };
      }

      return {
        status: 'processing',
        output: {
          provider: '302',
          providerKey,
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
    config: Ai302ProviderConfig,
    params: Ai302Input
  ): Promise<GenerationResult> {
    const providerKey = this.effect.provider as Ai302ProviderKey;

    if (config.kind !== 'openai-images') {
      const body = this.createNanoRequestBody(config, params);
      return this.submitGeneration({
        path: config.textPath,
        body: JSON.stringify(body),
        mode: 'generation',
        size: String(body.aspect_ratio ?? '1:1'),
        providerKey,
        requestedOutputQuality: params.wmOutputQuality,
      });
    }

    const size = mapSize(params.aspect_ratio);
    const requestBody: Record<string, unknown> = {
      model: config.model,
      prompt: params.prompt.trim(),
      n: params.n ?? 1,
      size,
      quality: mapQuality({ size: params.size, quality: params.quality }),
    };

    return this.submitGeneration({
      path: '/v1/images/generations',
      query: '?response_format=url&async=true',
      body: JSON.stringify(requestBody),
      mode: 'generation',
      size,
      providerKey,
      requestedOutputQuality: params.wmOutputQuality,
    });
  }

  private async createEditGeneration(
    config: Ai302ProviderConfig,
    params: Ai302Input,
    imageUrls: string[]
  ): Promise<GenerationResult> {
    const providerKey = this.effect.provider as Ai302ProviderKey;

    if (config.kind !== 'openai-images') {
      const references = imageUrls.slice(0, config.maxReferenceImages);
      const body = this.createNanoRequestBody(config, params, references);
      return this.submitGeneration({
        path: config.editPath,
        body: JSON.stringify(body),
        mode: 'edit',
        size: String(body.aspect_ratio ?? '1:1'),
        providerKey,
        requestedOutputQuality: params.wmOutputQuality,
        referenceImageCount: references.length,
      });
    }

    const size = mapSize(params.aspect_ratio);

    try {
      const images = await Promise.all(
        imageUrls.slice(0, config.maxReferenceImages).map(fetchReferenceImage)
      );
      const form = new FormData();
      form.append('model', config.model);
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
        query: '?response_format=url&async=true',
        body: form,
        mode: 'edit',
        size,
        providerKey,
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
    query = '',
    body,
    mode,
    size,
    providerKey,
    requestedOutputQuality,
    referenceImageCount,
  }: {
    path: string;
    query?: string;
    body: BodyInit;
    mode: Ai302RequestMode;
    size: string;
    providerKey: Ai302ProviderKey;
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
      const response = await fetch(`${AI302_API_BASE}${path}${query}`, {
        method: 'POST',
        headers,
        body,
      });
      const data = await parseJson(response);
      const payload = asRecord(data.data) ?? data;
      const taskId = readTaskId(payload) ?? readTaskId(data);
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
              providerKey,
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
            providerKey,
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

  private createNanoRequestBody(
    config: Exclude<Ai302ProviderConfig, { kind: 'openai-images' }>,
    params: Ai302Input,
    imageUrls: string[] = []
  ) {
    const body: Record<string, unknown> = {
      prompt: params.prompt.trim(),
    };

    if (config.kind === 'legacy-submit') {
      if (imageUrls.length > 0) {
        body.image_urls = imageUrls;
      } else {
        body.aspect_ratio = mapNanoAspectRatio(params.aspect_ratio);
      }
      return body;
    }

    body.aspect_ratio = mapNanoAspectRatio(params.aspect_ratio);
    body.enable_base64_output = false;
    body.enable_sync_mode = false;

    const resolution = mapNanoResolution(params.wmOutputQuality);
    if (config.supportsResolution && resolution) {
      body.resolution = resolution;
    }

    if (imageUrls.length > 0) {
      body.images = imageUrls;
    }

    return body;
  }

  private getStatusUrl(config: Ai302ProviderConfig, taskId: string) {
    const encodedTaskId = encodeURIComponent(taskId);
    if (config.kind === 'openai-images') {
      return `${AI302_API_BASE}/async_result?task_id=${encodedTaskId}`;
    }
    if (config.kind === 'legacy-submit') {
      return `${AI302_API_BASE}${config.resultPath}?request_id=${encodedTaskId}`;
    }
    return `${AI302_API_BASE}/ws/api/v3/predictions/${encodedTaskId}/result`;
  }
}
