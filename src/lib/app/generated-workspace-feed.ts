import 'server-only';

import { getDb } from '@/db';
import {
  effect,
  generationAssetLink,
  generationHistory,
  userAsset,
} from '@/db/schema';
import { IMAGE_WORKSPACE_MODELS } from '@/lib/effects/workspace-models';
import { isResultRevealVisible } from '@/lib/effects/result-reveal-gate';
import { and, desc, eq, inArray } from 'drizzle-orm';

export type GeneratedWorkspaceItemStatus =
  | 'pending'
  | 'processing'
  | 'succeeded'
  | 'failed';

export type GeneratedWorkspaceItem = {
  id: string;
  taskId: string;
  status: GeneratedWorkspaceItemStatus;
  prompt: string | null;
  modelId: string | null;
  modelLabel: string | null;
  paramsLabel: string | null;
  assetType: 'image' | 'video';
  mediaUrl: string | null;
  mediaUrls?: string[];
  createdAt: string;
};

type AssetOutputRecord = {
  publicUrl: string | null;
  createdAt: Date | null;
};

const workspaceModelIdByEffectId = new Map(
  IMAGE_WORKSPACE_MODELS.map((model) => [model.effectId, model.id])
);

const resolveWorkspaceModelId = (effectId: number | null) =>
  effectId === null ? null : (workspaceModelIdByEffectId.get(effectId) ?? null);

const appendAssetRecord = ({
  map,
  generationId,
  candidate,
}: {
  map: Map<string, AssetOutputRecord[]>;
  generationId: string;
  candidate: AssetOutputRecord;
}) => {
  const existing = map.get(generationId) ?? [];
  map.set(generationId, [...existing, candidate]);
};

const resolveStatus = (status: string): GeneratedWorkspaceItemStatus => {
  if (status === 'succeeded') return 'succeeded';
  if (status === 'failed') return 'failed';
  if (status === 'pending') return 'pending';
  return 'processing';
};

const getPrompt = (input: unknown) => {
  if (!input || typeof input !== 'object') return null;
  const prompt = (input as Record<string, unknown>).prompt;
  return typeof prompt === 'string' && prompt.trim() ? prompt : null;
};

const getOutputFallbackUrls = (output: unknown) => {
  if (!output || typeof output !== 'object') return [] as string[];
  const payload = output as Record<string, unknown>;
  const urls: string[] = [];
  if (typeof payload.result_url === 'string') urls.push(payload.result_url);
  if (Array.isArray(payload.image_urls)) {
    for (const item of payload.image_urls) {
      if (typeof item === 'string' && item) urls.push(item);
    }
  }
  return Array.from(new Set(urls));
};

const formatParams = (input: unknown) => {
  if (!input || typeof input !== 'object') return null;
  const payload = input as Record<string, unknown>;
  const aspectRatio =
    typeof payload.aspect_ratio === 'string' ? payload.aspect_ratio : null;
  const quality =
    typeof payload.quality === 'string'
      ? payload.quality
      : typeof payload.wmOutputQuality === 'string'
        ? payload.wmOutputQuality.toUpperCase()
        : null;
  const parts = [aspectRatio, quality].filter((item): item is string =>
    Boolean(item)
  );
  return parts.length > 0 ? parts.join(' | ') : null;
};

export async function loadGeneratedWorkspaceFeed({
  userId,
  limit = 60,
}: {
  userId: string;
  limit?: number;
}): Promise<GeneratedWorkspaceItem[]> {
  const db = await getDb();
  const generations = await db
    .select({
      id: generationHistory.id,
      status: generationHistory.status,
      input: generationHistory.input,
      output: generationHistory.output,
      createdAt: generationHistory.createdAt,
      effectId: effect.id,
      effectName: effect.name,
      effectType: effect.type,
    })
    .from(generationHistory)
    .leftJoin(effect, eq(effect.id, generationHistory.effectId))
    .where(eq(generationHistory.userId, userId))
    .orderBy(desc(generationHistory.createdAt), desc(generationHistory.id))
    .limit(Math.max(limit * 2, limit));

  if (generations.length === 0) return [];

  const generationIds = generations.map((item) => item.id);
  const linkedAssets = await db
    .select({
      role: generationAssetLink.role,
      generationId: generationAssetLink.generationId,
      publicUrl: userAsset.publicUrl,
      createdAt: userAsset.createdAt,
    })
    .from(generationAssetLink)
    .leftJoin(userAsset, eq(userAsset.id, generationAssetLink.assetId))
    .where(
      and(
        inArray(generationAssetLink.generationId, generationIds),
        eq(generationAssetLink.role, 'output')
      )
    );

  const outputMap = new Map<string, AssetOutputRecord[]>();
  for (const item of linkedAssets) {
    appendAssetRecord({
      map: outputMap,
      generationId: item.generationId,
      candidate: {
        publicUrl: item.publicUrl,
        createdAt: item.createdAt,
      },
    });
  }

  return generations
    .map((item): GeneratedWorkspaceItem | null => {
      const assetType =
        item.effectType === 1 ? 'video' : item.effectType === 2 ? 'image' : null;
      if (!assetType) return null;

      const linkedOutputUrls = (outputMap.get(item.id) ?? [])
        .filter((record) => record.publicUrl)
        .sort(
          (a, b) =>
            (a.createdAt ?? new Date(0)).getTime() -
            (b.createdAt ?? new Date(0)).getTime()
        )
        .map((record) => record.publicUrl!)
        .filter((url, index, urls) => urls.indexOf(url) === index);
      const mediaUrls =
        linkedOutputUrls.length > 0
          ? linkedOutputUrls
          : getOutputFallbackUrls(item.output);
      const mediaUrl = mediaUrls[0] ?? null;
      const status = resolveStatus(item.status);
      const revealVisible =
        status === 'succeeded' &&
        isResultRevealVisible({ status, output: item.output });
      const visibleStatus =
        status === 'succeeded' && !revealVisible ? 'processing' : status;

      return {
        id: item.id,
        taskId: item.id,
        status: visibleStatus,
        prompt: getPrompt(item.input),
        modelId: resolveWorkspaceModelId(item.effectId),
        modelLabel: item.effectName ?? null,
        paramsLabel: formatParams(item.input),
        assetType,
        mediaUrl: revealVisible || status !== 'succeeded' ? mediaUrl : null,
        mediaUrls: revealVisible || status !== 'succeeded' ? mediaUrls : [],
        createdAt: item.createdAt.toISOString(),
      };
    })
    .filter((item): item is GeneratedWorkspaceItem => item !== null)
    .slice(0, limit);
}
