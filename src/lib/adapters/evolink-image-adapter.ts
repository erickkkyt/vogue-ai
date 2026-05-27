import { estimateCreditsForEffect } from '@/lib/effects/pricing';
import { z } from 'zod';
import { BaseAdapter, type GenerationResult } from './base-adapter';

const EVOLINK_API_BASE = 'https://api.evolink.ai/v1';
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

const inputSchema = z.object({
  prompt: z.string().min(1, 'prompt is required'),
  aspect_ratio: z.enum(SUPPORTED_IMAGE_RATIOS).optional(),
  quality: z.enum(['low', 'medium', 'high']).optional(),
  wmOutputQuality: z.enum(['1k', '2k', '4k']).optional(),
  image_urls: z.array(z.string().url()).max(16).optional(),
  image_url: z.string().url().optional(),
  n: z.number().int().min(1).max(4).optional(),
});

const readString = (value: unknown) =>
  typeof value === 'string' && value ? value : null;

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
    const requestBody: Record<string, unknown> = {
      model: 'gpt-image-2',
      prompt: params.prompt.trim(),
      n: params.n ?? 1,
      quality: params.quality ?? 'medium',
      size: params.aspect_ratio ?? 'auto',
      resolution: params.wmOutputQuality?.toUpperCase() ?? '2K',
    };
    if (imageUrls.length > 0) requestBody.image_urls = imageUrls;

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
      const status = String(data.status || '').toLowerCase();
      const imageUrlsOut = getResults(data);
      const first = imageUrlsOut[0] ?? null;

      if (!response.ok || !taskId) {
        return {
          status: 'failed',
          error: readString(data.message) ?? 'Evolink API error',
        };
      }

      if (status === 'completed' && first) {
        return {
          status: 'succeeded',
          output: { taskId, image_urls: imageUrlsOut, result_url: first },
        };
      }

      return {
        status: status === 'failed' ? 'failed' : 'processing',
        output: { taskId },
        error: status === 'failed' ? 'Generation failed' : undefined,
      };
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
        `${EVOLINK_API_BASE}/tasks/${encodeURIComponent(taskId)}`,
        {
          headers: { Authorization: `Bearer ${this.getApiKey()}` },
        }
      );
      const data = (await response.json()) as Record<string, unknown>;
      const status = String(data.status || '').toLowerCase();
      const imageUrls = getResults(data);
      const first = imageUrls[0] ?? null;

      if (!response.ok) {
        return { status: 'failed', error: 'Status check failed' };
      }
      if (status === 'completed' && first) {
        return {
          status: 'succeeded',
          output: { taskId, image_urls: imageUrls, result_url: first },
        };
      }
      if (status === 'failed') return { status: 'failed', error: 'Failed' };
      return { status: 'processing', output: { taskId } };
    } catch (error) {
      return {
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown network error',
      };
    }
  }
}
