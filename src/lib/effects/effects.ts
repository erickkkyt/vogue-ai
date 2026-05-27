import { getDb } from '@/db';
import { effect } from '@/db/schema';
import { eq, inArray } from 'drizzle-orm';

export type EffectRecord = typeof effect.$inferSelect;

const now = () => new Date();

export const STATIC_IMAGE_EFFECTS: EffectRecord[] = [
  {
    id: 16,
    name: 'GPT Image 2',
    type: 2,
    model: 'gpt-image-2',
    version: '2',
    credit: 8,
    linkName: 'gpt-image-2',
    prePrompt: null,
    description: 'Generate production-ready AI images from prompts.',
    platform: 'kie',
    api: 'jobs/createTask',
    isOpen: 1,
    provider: 'kie.gpt-image-2',
    inputSchema: null,
    pricingSchema: null,
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
    description: 'Fast GPT Image 1.5 prompt-to-image generation.',
    platform: 'kie',
    api: 'jobs/createTask',
    isOpen: 1,
    provider: 'kie.gpt-image-1.5',
    inputSchema: null,
    pricingSchema: null,
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
    description: 'Nano Banana 2 image generation.',
    platform: 'kie',
    api: 'jobs/createTask',
    isOpen: 1,
    provider: 'kie.nano-banana-2',
    inputSchema: null,
    pricingSchema: null,
    createdAt: now(),
  },
  {
    id: 5,
    name: 'Nano Banana',
    type: 2,
    model: 'nano-banana',
    version: '1',
    credit: 4,
    linkName: 'nano-banana',
    prePrompt: null,
    description: 'Nano Banana image generation.',
    platform: 'kie',
    api: 'jobs/createTask',
    isOpen: 1,
    provider: 'kie.nano-banana',
    inputSchema: null,
    pricingSchema: null,
    createdAt: now(),
  },
  {
    id: 6,
    name: 'Nano Banana Pro',
    type: 2,
    model: 'nano-banana-pro',
    version: 'pro',
    credit: 8,
    linkName: 'nano-banana-pro',
    prePrompt: null,
    description: 'Nano Banana Pro image generation.',
    platform: 'kie',
    api: 'jobs/createTask',
    isOpen: 1,
    provider: 'kie.nano-banana-pro',
    inputSchema: null,
    pricingSchema: null,
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
    defaultQuality: 'medium',
    qualityOptions: ['low', 'medium', 'high'],
    defaultOutputQuality: '2k',
    supportedOutputQualities: ['1k', '2k', '4k'],
  },
  {
    id: 'gptimage15',
    name: 'GPT Image 1.5',
    effectId: 15,
    defaultAspectRatio: '1:1',
    supportedAspectRatios: ['1:1', '2:3', '3:2'],
    defaultQuality: 'standard',
    qualityOptions: ['standard', 'high'],
  },
  {
    id: 'nanobanana2',
    name: 'Nano Banana 2',
    effectId: 4,
    defaultAspectRatio: '1:1',
    supportedAspectRatios: ['1:1', '16:9', '9:16', '2:3', '3:2', 'auto'],
    defaultOutputQuality: '1k',
    supportedOutputQualities: ['1k', '2k', '4k'],
  },
  {
    id: 'nanobanana',
    name: 'Nano Banana',
    effectId: 5,
    defaultAspectRatio: '1:1',
    supportedAspectRatios: ['1:1', '16:9', '9:16', '2:3', '3:2', 'auto'],
    defaultOutputQuality: '1k',
    supportedOutputQualities: ['1k'],
  },
  {
    id: 'nanobananapro',
    name: 'Nano Banana Pro',
    effectId: 6,
    defaultAspectRatio: '1:1',
    supportedAspectRatios: ['1:1', '16:9', '9:16', '2:3', '3:2', 'auto'],
    defaultOutputQuality: '2k',
    supportedOutputQualities: ['2k', '4k'],
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
