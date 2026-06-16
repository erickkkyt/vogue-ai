import 'server-only';

import { randomUUID } from 'crypto';
import { getDb } from '@/db';
import { generationAssetLink, userAsset } from '@/db/schema';
import { and, eq, inArray, sql } from 'drizzle-orm';

export type AssetType = 'image' | 'video' | 'audio';
export type AssetSource = 'upload' | 'provider' | 'derived';
export type AssetRole = 'input' | 'output' | 'reference';

export async function recordUserAsset({
  userId,
  type,
  source,
  bucket,
  objectKey,
  publicUrl,
  mimeType,
  sizeBytes,
  sha256,
  metadata,
}: {
  userId: string;
  type: AssetType;
  source: AssetSource;
  bucket: string;
  objectKey: string;
  publicUrl: string;
  mimeType?: string;
  sizeBytes?: number;
  sha256?: string;
  metadata?: unknown;
}) {
  const db = await getDb();
  const existing = await db
    .select({ id: userAsset.id })
    .from(userAsset)
    .where(
      and(eq(userAsset.bucket, bucket), eq(userAsset.objectKey, objectKey))
    )
    .limit(1);

  if (existing[0]?.id) return existing[0].id;

  const id = randomUUID();
  await db.insert(userAsset).values({
    id,
    userId,
    type,
    source,
    bucket,
    objectKey,
    publicUrl,
    mimeType: mimeType ?? null,
    sizeBytes: sizeBytes ?? null,
    sha256: sha256 ?? null,
    metadata: metadata ?? null,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  return id;
}

export async function linkGenerationAsset({
  generationId,
  assetId,
  role,
}: {
  generationId: string;
  assetId: string;
  role: AssetRole;
}) {
  const db = await getDb();
  const existing = await db
    .select({ id: generationAssetLink.id })
    .from(generationAssetLink)
    .where(
      and(
        eq(generationAssetLink.generationId, generationId),
        eq(generationAssetLink.assetId, assetId),
        eq(generationAssetLink.role, role)
      )
    )
    .limit(1);

  if (existing[0]?.id) return existing[0].id;

  const id = randomUUID();
  await db.insert(generationAssetLink).values({
    id,
    generationId,
    assetId,
    role,
    createdAt: new Date(),
  });
  return id;
}

export async function findLinkedOutputAssetByProviderUrl({
  generationId,
  providerUrl,
}: {
  generationId: string;
  providerUrl: string;
}) {
  const db = await getDb();
  const rows = await db
    .select({
      id: userAsset.id,
      publicUrl: userAsset.publicUrl,
      objectKey: userAsset.objectKey,
    })
    .from(generationAssetLink)
    .innerJoin(userAsset, eq(userAsset.id, generationAssetLink.assetId))
    .where(
      and(
        eq(generationAssetLink.generationId, generationId),
        eq(generationAssetLink.role, 'output'),
        sql`${userAsset.metadata}->>'providerUrl' = ${providerUrl}`
      )
    )
    .orderBy(userAsset.createdAt)
    .limit(1);

  return rows[0] ?? null;
}

export async function linkGenerationInputAssetsByUrls({
  generationId,
  userId,
  urls,
}: {
  generationId: string;
  userId: string;
  urls: string[];
}) {
  const normalizedUrls = urls
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
  if (normalizedUrls.length === 0) return;

  const db = await getDb();
  const assets = await db
    .select({ id: userAsset.id })
    .from(userAsset)
    .where(
      and(
        eq(userAsset.userId, userId),
        inArray(userAsset.publicUrl, normalizedUrls)
      )
    );

  for (const asset of assets) {
    await linkGenerationAsset({
      generationId,
      assetId: asset.id,
      role: 'input',
    });
  }
}
