import { estimateCreditsForEffect } from '@/lib/effects/pricing';
import { z } from 'zod';
import { BaseAdapter, type GenerationResult } from './base-adapter';

const API_BASE = 'https://api.kie.ai/api/v1';

const providerConfig = {
  'kie.gpt-image-2': 'gpt-image-2-text-to-image',
  'kie.gpt-image-1.5': 'gpt-image/1.5-text-to-image',
  'kie.nano-banana-2': 'nano-banana-2',
  'kie.nano-banana': 'google/nano-banana',
  'kie.nano-banana-pro': 'nano-banana-pro',
} as const;

type ProviderKey = keyof typeof providerConfig;

const inputSchema = z.object({
  prompt: z.string().min(1, 'prompt is required'),
  size: z.enum(['standard', 'high']).optional(),
  quality: z.enum(['low', 'medium', 'high', 'standard']).optional(),
  aspect_ratio: z.string().optional(),
  wmOutputQuality: z.enum(['1k', '2k', '4k']).optional(),
  image_urls: z.array(z.string().url()).optional(),
  image_url: z.string().url().optional(),
  callBackUrl: z.string().url().optional(),
});

const asProviderKey = (provider: string): ProviderKey | null =>
  provider in providerConfig ? (provider as ProviderKey) : null;

const parseResultUrls = (resultJson: unknown) => {
  if (typeof resultJson !== 'string') return [] as string[];
  try {
    const parsed = JSON.parse(resultJson) as Record<string, unknown>;
    const resultUrls = parsed.resultUrls;
    if (!Array.isArray(resultUrls)) return [] as string[];
    return resultUrls.filter((item): item is string => typeof item === 'string');
  } catch {
    return [];
  }
};

export class KieMarketAdapter extends BaseAdapter {
  private getApiKey() {
    const key = process.env.KIE_API_KEY;
    if (!key) throw new Error('KIE_API_KEY is not configured');
    return key;
  }

  private getModel() {
    const provider = asProviderKey(this.effect.provider);
    if (!provider) throw new Error(`Unsupported KIE provider: ${this.effect.provider}`);
    return providerConfig[provider];
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
    const inputPayload: Record<string, unknown> = {
      prompt: params.prompt.trim(),
      aspect_ratio:
        this.effect.provider === 'kie.gpt-image-2'
          ? params.aspect_ratio ?? 'auto'
          : params.aspect_ratio ?? '1:1',
    };

    if (this.effect.provider === 'kie.gpt-image-2') {
      if (imageUrls.length > 0) inputPayload.input_urls = imageUrls.slice(0, 16);
    } else if (this.effect.provider === 'kie.gpt-image-1.5') {
      const size = params.size ?? params.quality;
      inputPayload.quality = size === 'high' ? 'high' : 'medium';
      if (imageUrls.length > 0) inputPayload.input_urls = imageUrls.slice(0, 16);
    } else {
      inputPayload.output_format = 'png';
      inputPayload.resolution = params.wmOutputQuality?.toUpperCase() ?? '1K';
      if (imageUrls.length > 0) inputPayload.image_input = imageUrls.slice(0, 8);
    }

    const model =
      this.effect.provider === 'kie.gpt-image-2' && imageUrls.length > 0
        ? 'gpt-image-2-image-to-image'
        : this.effect.provider === 'kie.gpt-image-2'
          ? 'gpt-image-2-text-to-image'
          : this.effect.provider === 'kie.gpt-image-1.5' &&
              imageUrls.length > 0
            ? 'gpt-image/1.5-image-to-image'
            : this.getModel();

    try {
      const response = await fetch(`${API_BASE}/jobs/createTask`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.getApiKey()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          ...(params.callBackUrl ? { callBackUrl: params.callBackUrl } : {}),
          input: inputPayload,
        }),
      });
      const data = (await response.json()) as Record<string, unknown>;
      const dataObject =
        data.data && typeof data.data === 'object'
          ? (data.data as Record<string, unknown>)
          : {};
      const taskId =
        typeof dataObject.taskId === 'string' ? dataObject.taskId : null;
      const code = typeof data.code === 'number' ? data.code : null;
      const msg = typeof data.msg === 'string' ? data.msg : 'KIE API error';

      if (!response.ok || code !== 200 || !taskId) {
        return { status: 'failed', error: msg };
      }

      return { status: 'processing', output: { taskId } };
    } catch (error) {
      return {
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown network error',
      };
    }
  }

  async checkStatus(taskId: string): Promise<GenerationResult> {
    try {
      const response = await fetch(
        `${API_BASE}/jobs/recordInfo?taskId=${encodeURIComponent(taskId)}`,
        { headers: { Authorization: `Bearer ${this.getApiKey()}` } }
      );
      const data = (await response.json()) as Record<string, unknown>;
      const result =
        data.data && typeof data.data === 'object'
          ? (data.data as Record<string, unknown>)
          : {};
      const state = typeof result.state === 'string' ? result.state : 'waiting';
      const msg =
        typeof data.msg === 'string' ? data.msg : 'Status check failed';

      if (!response.ok || data.code !== 200) return { status: 'failed', error: msg };
      if (state === 'fail') {
        return {
          status: 'failed',
          error:
            typeof result.failMsg === 'string' && result.failMsg
              ? result.failMsg
              : msg,
        };
      }
      if (state === 'success') {
        const urls = parseResultUrls(result.resultJson);
        const first = urls[0] ?? null;
        return {
          status: 'succeeded',
          output: { taskId, image_urls: urls, result_url: first },
        };
      }

      return { status: 'processing', output: { taskId } };
    } catch (error) {
      return {
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown network error',
      };
    }
  }
}
