import { getDb } from '@/db';
import { effect } from '@/db/schema';
import {
  GPT_IMAGE_15_PRICING_SCHEMA,
  GPT_IMAGE_2_PRICING_SCHEMA,
  NANO_BANANA_2_PRICING_SCHEMA,
  NANO_BANANA_PRICING_SCHEMA,
  NANO_BANANA_PRO_PRICING_SCHEMA,
  Z_IMAGE_PRICING_SCHEMA,
} from '@/lib/effects/pricing';
import { eq, inArray } from 'drizzle-orm';

export type EffectRecord = typeof effect.$inferSelect;

const now = () => new Date();

const imageUrlsField = { type: 'any', required: false };

const aspectRatioField = {
  type: 'enum',
  required: true,
  values: ['1:1', '16:9', '9:16', '2:3', '3:2', 'auto'],
};

const zImageAspectRatioField = {
  type: 'enum',
  required: true,
  values: ['1:1', '4:3', '3:4', '16:9', '9:16'],
};

const gptImage2AspectRatioField = {
  type: 'enum',
  required: false,
  values: [
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
  ],
};

const gptImage2QualityField = {
  type: 'enum',
  required: false,
  values: ['low', 'medium', 'high'],
};

const gptImage2OutputQualityField = {
  type: 'enum',
  required: false,
  values: ['1k', '2k', '4k'],
};

export const STATIC_IMAGE_EFFECTS: EffectRecord[] = [
  {
    id: 16,
    name: 'GPT Image 2',
    type: 2,
    model: 'gpt-image-2',
    version: '2',
    credit: 10,
    linkName: 'gpt-image-2',
    prePrompt: null,
    description:
      'GPT Image 2 image generation supporting text-to-image and image-to-image.',
    platform: 'kie',
    api: 'https://api.kie.ai/api/v1/jobs/createTask',
    isOpen: 1,
    provider: 'kie.gpt-image-2',
    inputSchema: {
      prompt: { type: 'string', required: true },
      aspect_ratio: gptImage2AspectRatioField,
      quality: gptImage2QualityField,
      wmOutputQuality: gptImage2OutputQualityField,
      image_urls: imageUrlsField,
      n: { type: 'number', required: false },
    },
    pricingSchema: GPT_IMAGE_2_PRICING_SCHEMA,
    createdAt: now(),
  },
  {
    id: 15,
    name: 'GPT Image 1.5',
    type: 2,
    model: 'gpt-image-1.5',
    version: '1.5',
    credit: 4,
    linkName: 'gpt-image-1-5',
    prePrompt: null,
    description:
      'GPT Image 1.5 image generation supporting text-to-image and image-to-image.',
    platform: 'kie',
    api: 'https://api.kie.ai/api/v1/jobs/createTask',
    isOpen: 1,
    provider: 'kie.gpt-image-1.5',
    inputSchema: {
      prompt: { type: 'string', required: true },
      aspect_ratio: {
        type: 'enum',
        required: true,
        values: ['1:1', '2:3', '3:2'],
      },
      size: {
        type: 'enum',
        required: true,
        values: ['standard', 'high'],
      },
      image_urls: imageUrlsField,
      n: { type: 'number', required: false },
    },
    pricingSchema: GPT_IMAGE_15_PRICING_SCHEMA,
    createdAt: now(),
  },
  {
    id: 17,
    name: 'Z-Image',
    type: 2,
    model: 'z-image',
    version: '1',
    credit: 1,
    linkName: 'z-image',
    prePrompt: null,
    description: 'Z-Image text-to-image generation.',
    platform: 'kie',
    api: 'https://api.kie.ai/api/v1/jobs/createTask',
    isOpen: 1,
    provider: 'kie.z-image',
    inputSchema: {
      prompt: { type: 'string', required: true, maxLength: 1000 },
      aspect_ratio: zImageAspectRatioField,
      nsfw_checker: { type: 'boolean', required: false },
      n: { type: 'number', required: false },
    },
    pricingSchema: Z_IMAGE_PRICING_SCHEMA,
    createdAt: now(),
  },
  {
    id: 4,
    name: 'Nano Banana 2',
    type: 2,
    model: 'nano-banana-2',
    version: '2',
    credit: 6,
    linkName: 'nano-banana-2',
    prePrompt: null,
    description: 'Google Nano Banana 2 image generation.',
    platform: 'kie',
    api: 'https://api.kie.ai/api/v1/jobs/createTask',
    isOpen: 1,
    provider: 'kie.nano-banana-2',
    inputSchema: {
      prompt: { type: 'string', required: true },
      aspect_ratio: aspectRatioField,
      wmOutputQuality: {
        type: 'enum',
        required: true,
        values: ['1k', '2k', '4k'],
      },
      image_urls: imageUrlsField,
      n: { type: 'number', required: false },
    },
    pricingSchema: NANO_BANANA_2_PRICING_SCHEMA,
    createdAt: now(),
  },
  {
    id: 5,
    name: 'Nano Banana',
    type: 2,
    model: 'google/nano-banana',
    version: '1',
    credit: 4,
    linkName: 'nano-banana',
    prePrompt: null,
    description: 'Google Nano Banana image generation.',
    platform: 'kie',
    api: 'https://api.kie.ai/api/v1/jobs/createTask',
    isOpen: 1,
    provider: 'kie.nano-banana',
    inputSchema: {
      prompt: { type: 'string', required: true },
      aspect_ratio: aspectRatioField,
      n: { type: 'number', required: false },
    },
    pricingSchema: NANO_BANANA_PRICING_SCHEMA,
    createdAt: now(),
  },
  {
    id: 6,
    name: 'Nano Banana Pro',
    type: 2,
    model: 'nano-banana-pro',
    version: '1',
    credit: 8,
    linkName: 'nano-banana-pro',
    prePrompt: null,
    description: 'Nano Banana Pro image generation and image-to-image.',
    platform: 'kie',
    api: 'https://api.kie.ai/api/v1/jobs/createTask',
    isOpen: 1,
    provider: 'kie.nano-banana-pro',
    inputSchema: {
      prompt: { type: 'string', required: true },
      aspect_ratio: aspectRatioField,
      wmOutputQuality: {
        type: 'enum',
        required: true,
        values: ['2k', '4k'],
      },
      image_urls: imageUrlsField,
      n: { type: 'number', required: false },
    },
    pricingSchema: NANO_BANANA_PRO_PRICING_SCHEMA,
    createdAt: now(),
  },
];

export const IMAGE_WORKSPACE_MODELS = [
  {
    id: 'gptimage2',
    name: 'GPT Image 2',
    effectId: 16,
    defaultAspectRatio: 'auto',
    supportedAspectRatios: ['auto', '1:1', '16:9', '9:16', '4:5', '3:2'],
    defaultQuality: 'low',
    qualityOptions: ['low', 'medium', 'high'],
    defaultOutputQuality: '2k',
    supportedOutputQualities: ['1k', '2k', '4k'],
    defaultGenerationCount: 1,
    supportedGenerationCounts: [1, 2, 3, 4],
  },
  {
    id: 'gptimage15',
    name: 'GPT Image 1.5',
    effectId: 15,
    defaultAspectRatio: '1:1',
    supportedAspectRatios: ['1:1', '2:3', '3:2'],
    defaultQuality: 'standard',
    qualityOptions: ['standard', 'high'],
    defaultGenerationCount: 1,
    supportedGenerationCounts: [1, 2, 3, 4],
  },
  {
    id: 'zimage',
    name: 'Z-Image',
    effectId: 17,
    defaultAspectRatio: '1:1',
    supportedAspectRatios: ['1:1', '4:3', '3:4', '16:9', '9:16'],
    defaultGenerationCount: 1,
    supportedGenerationCounts: [1, 2, 3, 4],
  },
  {
    id: 'nanobanana2',
    name: 'Nano Banana 2',
    effectId: 4,
    defaultAspectRatio: '1:1',
    supportedAspectRatios: ['1:1', '16:9', '9:16', '2:3', '3:2', 'auto'],
    defaultOutputQuality: '1k',
    supportedOutputQualities: ['1k', '2k', '4k'],
    defaultGenerationCount: 1,
    supportedGenerationCounts: [1, 2, 3, 4],
  },
  {
    id: 'nanobanana',
    name: 'Nano Banana',
    effectId: 5,
    defaultAspectRatio: '1:1',
    supportedAspectRatios: ['1:1', '16:9', '9:16', '2:3', '3:2', 'auto'],
    defaultOutputQuality: '1k',
    supportedOutputQualities: ['1k'],
    defaultGenerationCount: 1,
    supportedGenerationCounts: [1, 2, 3, 4],
  },
  {
    id: 'nanobananapro',
    name: 'Nano Banana Pro',
    effectId: 6,
    defaultAspectRatio: '1:1',
    supportedAspectRatios: ['1:1', '16:9', '9:16', '2:3', '3:2', 'auto'],
    defaultOutputQuality: '2k',
    supportedOutputQualities: ['2k', '4k'],
    defaultGenerationCount: 1,
    supportedGenerationCounts: [1, 2, 3, 4],
  },
] as const;

export async function getEffectById(id: number): Promise<EffectRecord | null> {
  try {
    const db = await getDb();
    const rows = await db
      .select()
      .from(effect)
      .where(eq(effect.id, id))
      .limit(1);
    if (rows[0]) return rows[0];
  } catch (error) {
    console.warn('effect lookup fell back to static config:', error);
  }

  return STATIC_IMAGE_EFFECTS.find((item) => item.id === id) ?? null;
}

export async function getEffectsByIds(ids: number[]): Promise<EffectRecord[]> {
  const uniqueIds = [...new Set(ids)].filter((id) => Number.isFinite(id));
  if (uniqueIds.length === 0) return [];

  try {
    const db = await getDb();
    const rows = await db
      .select()
      .from(effect)
      .where(inArray(effect.id, uniqueIds));
    const foundIds = new Set(rows.map((item) => item.id));
    const staticFallbacks = STATIC_IMAGE_EFFECTS.filter(
      (item) => uniqueIds.includes(item.id) && !foundIds.has(item.id)
    );
    return [...rows, ...staticFallbacks];
  } catch (error) {
    console.warn('effects lookup fell back to static config:', error);
    return STATIC_IMAGE_EFFECTS.filter((item) => uniqueIds.includes(item.id));
  }
}

export async function ensureEffectRow(record: EffectRecord) {
  const db = await getDb();
  await db
    .insert(effect)
    .values(record)
    .onConflictDoNothing({ target: effect.id });
}

export const getImageWorkspaceModels = () => IMAGE_WORKSPACE_MODELS;

export const getModelById = (modelId: string) =>
  IMAGE_WORKSPACE_MODELS.find((model) => model.id === modelId) ??
  IMAGE_WORKSPACE_MODELS[0];
