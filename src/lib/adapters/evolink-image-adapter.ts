import { estimateCreditsForEffect } from '@/lib/effects/pricing';
import { z } from 'zod';
import { BaseAdapter, type GenerationResult } from './base-adapter';

const EVOLINK_API_BASE = 'https://api.evolink.ai/v1';
const PROVIDER_CONFIG = {
  'evolink.gpt-image-2': {
    model: 'gpt-image-2',
    maxReferenceImages: 16,
    supportsImageCount: true,
    qualityMode: 'gpt-image-2',
  },
  'evolink.nano-banana-2': {
    model: 'gemini-3.1-flash-image-preview',
    maxReferenceImages: 14,
    supportsImageCount: false,
    qualityMode: 'resolution',
  },
  'evolink.nano-banana': {
    model: 'nano-banana-beta',
    maxReferenceImages: 5,
    supportsImageCount: false,
    qualityMode: 'none',
  },
  'evolink.nano-banana-pro': {
    model: 'gemini-3-pro-image-preview',
    maxReferenceImages: 14,
    supportsImageCount: false,
    qualityMode: 'resolution',
  },
} as const;

type ProviderKey = keyof typeof PROVIDER_CONFIG;

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
const SUPPORTED_RESOLUTIONS = ['1K', '2K', '4K'] as const;
const SUPPORTED_QUALITIES = ['low', 'medium', 'high'] as const;
const PIXEL_SIZE_PATTERN = /^\d{2,4}[x×]\d{2,4}$/i;

const isSupportedImageSize = (value: string) =>
  SUPPORTED_IMAGE_RATIOS.includes(
    value as (typeof SUPPORTED_IMAGE_RATIOS)[number]
  ) || PIXEL_SIZE_PATTERN.test(value);

const mapResolution = (
  value: '1k' | '2k' | '4k' | undefined
): (typeof SUPPORTED_RESOLUTIONS)[number] | undefined => {
  if (!value) return undefined;
  if (value === '2k') return '2K';
  if (value === '4k') return '4K';
  return '1K';
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

const inputSchema = z.object({
  prompt: z.string().min(1, 'prompt is required'),
  aspect_ratio: z
    .string()
    .refine(isSupportedImageSize, 'Unsupported image size')
    .optional(),
  size: z.enum(['standard', 'high']).optional(),
  quality: z.enum(SUPPORTED_QUALITIES).optional(),
  wmOutputQuality: z.enum(['1k', '2k', '4k']).optional(),
  image_urls: z.array(z.string().url()).max(16).optional(),
  image_url: z.string().url().optional(),
  n: z.number().int().min(1).max(10).optional(),
  callBackUrl: z.string().url().optional(),
});

const asRecord = (value: unknown) =>
  value && typeof value === 'object'
    ? (value as Record<string, unknown>)
    : null;

const readString = (value: unknown) =>
  typeof value === 'string' && value ? value : null;

const readStatus = (value: unknown) =>
  typeof value === 'string' ? value.toLowerCase() : '';

const getErrorMessage = (payload: Record<string, unknown>) => {
  const error = asRecord(payload.error);
  return (
    readString(payload.message) ??
    readString(payload.error) ??
    readString(error?.message) ??
    readString(error?.code)
  );
};

const getResults = (payload: Record<string, unknown>) => {
  const results = payload.results;
  if (!Array.isArray(results)) return [] as string[];
  return results.filter((item): item is string => typeof item === 'string');
};

export class EvolinkImageAdapter extends BaseAdapter {
  private getApiKey() {
    const key = process.env.EVOLINK_API_KEY;
    if (!key) throw new Error('EVOLINK_API_KEY is not configured');
    return key;
  }

  private getProviderConfig() {
    if (!(this.effect.provider in PROVIDER_CONFIG)) {
      throw new Error(`Unsupported Evolink provider: ${this.effect.provider}`);
    }
    return PROVIDER_CONFIG[this.effect.provider as ProviderKey];
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
    const requestBody: Record<string, unknown> = {
      model: config.model,
      prompt: params.prompt.trim(),
    };

    if (config.supportsImageCount) {
      requestBody.n = params.n ?? 1;
    }
    if (params.aspect_ratio) {
      requestBody.size = params.aspect_ratio;
    }

    const resolution = mapResolution(params.wmOutputQuality);
    if (resolution && config.qualityMode === 'resolution') {
      requestBody.quality = resolution;
    } else if (resolution && config.qualityMode === 'gpt-image-2') {
      requestBody.resolution = resolution;
    }
    if (config.qualityMode === 'gpt-image-2') {
      requestBody.quality = mapQuality({
        size: params.size,
        quality: params.quality,
      });
    }

    if (imageUrls.length > 0) {
      requestBody.image_urls = imageUrls.slice(0, config.maxReferenceImages);
    }
    if (params.callBackUrl) requestBody.callback_url = params.callBackUrl;

    try {
      const response = await fetch(`${EVOLINK_API_BASE}/images/generations`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.getApiKey()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
      const data = (await response.json()) as Record<string, unknown>;
      const taskId = readString(data.id);
      const status = readStatus(data.status);
      const imageUrlsOut = getResults(data);
      const first = imageUrlsOut[0] ?? null;

      if (!response.ok || !taskId) {
        return {
          status: 'failed',
          error: getErrorMessage(data) ?? 'Evolink API error',
        };
      }

      if (status === 'completed' && first) {
        return {
          status: 'succeeded',
          output: { taskId, image_urls: imageUrlsOut, result_url: first },
        };
      }

      return {
        status:
          status === 'failed'
            ? 'failed'
            : status === 'processing'
              ? 'processing'
              : 'pending',
        output: { taskId },
        error:
          status === 'failed'
            ? (getErrorMessage(data) ?? 'Generation failed')
            : undefined,
      };
    } catch (error) {
      return {
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown network error',
      };
    }
  }

  async checkStatus(taskId: string): Promise<GenerationResult> {
    this.getProviderConfig();

    try {
      const response = await fetch(
        `${EVOLINK_API_BASE}/tasks/${encodeURIComponent(taskId)}`,
        {
          headers: { Authorization: `Bearer ${this.getApiKey()}` },
        }
      );
      const data = (await response.json()) as Record<string, unknown>;
      const status = readStatus(data.status);
      const imageUrls = getResults(data);
      const first = imageUrls[0] ?? null;

      if (!response.ok) {
        return {
          status: 'failed',
          error: getErrorMessage(data) ?? 'Status check failed',
        };
      }
      if (status === 'completed' && first) {
        return {
          status: 'succeeded',
          output: { taskId, image_urls: imageUrls, result_url: first },
        };
      }
      if (status === 'completed') {
        return {
          status: 'failed',
          error: 'Evolink task completed without any image results',
        };
      }
      if (status === 'failed') {
        return {
          status: 'failed',
          error: getErrorMessage(data) ?? 'Generation failed',
        };
      }
      return {
        status: status === 'pending' ? 'pending' : 'processing',
        output: { taskId },
      };
    } catch (error) {
      return {
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown network error',
      };
    }
  }
}
