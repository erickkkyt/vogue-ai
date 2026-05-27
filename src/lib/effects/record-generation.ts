import 'server-only';

import { randomUUID } from 'crypto';
import { getDb } from '@/db';
import { generationHistory } from '@/db/schema';
import { deriveGenerationOperationalFields } from '@/lib/effects/generation-operational-fields';
import { and, desc, eq, sql } from 'drizzle-orm';
import { createPendingGenerationSlot } from './generation-slot';

export type GenerationStatus =
  | 'pending'
  | 'processing'
  | 'succeeded'
  | 'failed';

export const recordGeneration = async ({
  userId,
  effectId,
  status,
  input,
  output,
  error,
  creditsUsed = 0,
}: {
  userId: string;
  effectId: number;
  status: GenerationStatus;
  input?: unknown;
  output?: unknown;
  error?: string | null;
  creditsUsed?: number;
}) => {
  const id = randomUUID();
  try {
    const db = await getDb();
    const operationalFields = deriveGenerationOperationalFields({ output });
    await db.insert(generationHistory).values({
      id,
      userId,
      effectId,
      status,
      providerTaskId: operationalFields.providerTaskId ?? null,
      lifecyclePhase: operationalFields.lifecyclePhase ?? null,
      lastProviderSyncAt: operationalFields.lastProviderSyncAt,
      input: input ?? null,
      output: output ?? null,
      error: error ?? null,
      creditsUsed,
      createdAt: new Date(),
    });
    return id;
  } catch (recordError) {
    console.error('recordGeneration error:', recordError);
    return null;
  }
};

export const createPendingGenerationRecord = async ({
  userId,
  effectId,
  input,
  output,
  creditsUsed = 0,
}: {
  userId: string;
  effectId: number;
  input?: unknown;
  output?: unknown;
  creditsUsed?: number;
}) => {
  try {
    const db = await getDb();
    return await db.transaction(async (tx) =>
      createPendingGenerationSlot(
        { userId, effectId, input, output, creditsUsed },
        {
          lockUser: async (lockedUserId) => {
            await tx.execute(
              sql`SELECT pg_advisory_xact_lock(hashtext(${lockedUserId}))`
            );
          },
          hasRunningGeneration: async (lockedUserId) => {
            const rows = await tx
              .select({ id: generationHistory.id })
              .from(generationHistory)
              .where(
                and(
                  eq(generationHistory.userId, lockedUserId),
                  sql`${generationHistory.status} in ('pending', 'processing')`
                )
              )
              .limit(1);
            return rows.length > 0;
          },
          insertGeneration: async (record) => {
            await tx.insert(generationHistory).values(record);
          },
        }
      )
    );
  } catch (error) {
    console.error('createPendingGenerationRecord error:', error);
    return null;
  }
};

export const hasRunningGeneration = async ({ userId }: { userId: string }) => {
  try {
    const db = await getDb();
    const rows = await db
      .select({ id: generationHistory.id })
      .from(generationHistory)
      .where(
        and(
          eq(generationHistory.userId, userId),
          sql`${generationHistory.status} in ('pending', 'processing')`
        )
      )
      .limit(1);
    return rows.length > 0;
  } catch (error) {
    console.error('hasRunningGeneration error:', error);
    return false;
  }
};

export const updateGenerationById = async ({
  id,
  status,
  output,
  error,
  creditsUsed,
}: {
  id: string;
  status: GenerationStatus;
  output?: unknown;
  error?: string | null;
  creditsUsed?: number;
}) => {
  try {
    const db = await getDb();
    const operationalFields = deriveGenerationOperationalFields({ output });
    await db
      .update(generationHistory)
      .set({
        status,
        providerTaskId: operationalFields.providerTaskId ?? null,
        lifecyclePhase: operationalFields.lifecyclePhase ?? null,
        lastProviderSyncAt: operationalFields.lastProviderSyncAt,
        output: output ?? null,
        error: error ?? null,
        ...(creditsUsed !== undefined ? { creditsUsed } : {}),
      })
      .where(eq(generationHistory.id, id));
    return true;
  } catch (updateError) {
    console.error('updateGenerationById error:', updateError);
    return false;
  }
};

export const getGenerationById = async ({
  id,
  userId,
  effectId,
}: {
  id: string;
  userId: string;
  effectId?: number;
}) => {
  try {
    const db = await getDb();
    const whereConditions = [
      eq(generationHistory.id, id),
      eq(generationHistory.userId, userId),
    ];
    if (effectId !== undefined) {
      whereConditions.push(eq(generationHistory.effectId, effectId));
    }
    const rows = await db
      .select()
      .from(generationHistory)
      .where(and(...whereConditions))
      .limit(1);
    return rows[0] ?? null;
  } catch (error) {
    console.error('getGenerationById error:', error);
    return null;
  }
};

export const getGenerationByProviderTaskIdGlobal = async ({
  taskId,
}: {
  taskId: string;
}) => {
  try {
    const db = await getDb();
    const rows = await db
      .select()
      .from(generationHistory)
      .where(
        sql`coalesce(${generationHistory.providerTaskId}, ${generationHistory.output} ->> 'providerTaskId', ${generationHistory.output} ->> 'taskId', ${generationHistory.input} ->> 'taskId') = ${taskId}`
      )
      .orderBy(desc(generationHistory.createdAt))
      .limit(1);
    return rows[0] ?? null;
  } catch (error) {
    console.error('getGenerationByProviderTaskIdGlobal error:', error);
    return null;
  }
};

export const updateGenerationByTaskIdGlobal = async ({
  taskId,
  status,
  output,
  error,
}: {
  taskId: string;
  status: GenerationStatus;
  output?: unknown;
  error?: string | null;
}) => {
  const generation = await getGenerationByProviderTaskIdGlobal({ taskId });
  if (!generation) return false;
  return updateGenerationById({
    id: generation.id,
    status,
    output,
    error,
  });
};
