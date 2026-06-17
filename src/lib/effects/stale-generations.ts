import 'server-only';

import { getDb } from '@/db';
import { generationHistory } from '@/db/schema';
import { and, asc, inArray, lt } from 'drizzle-orm';
import { getGenerationById, type GenerationStatus } from './record-generation';
import {
  runGenerationStatusPass,
  type GenerationStatusPassResult,
} from './server-poller';

export type CleanupStaleGenerationsResult = {
  scannedCount: number;
  processedCount: number;
  failedCount: number;
  succeededCount: number;
  errorCount: number;
};

type StaleGeneration = {
  id: string;
  userId: string;
  effectId: number;
  status: GenerationStatus;
  createdAt: Date;
};

type LoadStaleGenerations = (params: {
  before: Date;
  limit: number;
}) => Promise<StaleGeneration[]>;

type RunStatusPass = (
  task: StaleGeneration
) => Promise<GenerationStatusPassResult & { status?: GenerationStatus | null }>;

export type CleanupStaleGenerationsOptions = {
  now?: Date;
  staleAfterMs?: number;
  limit?: number;
  loadStaleGenerations?: LoadStaleGenerations;
  runStatusPass?: RunStatusPass;
  logError?: typeof console.error;
};

const DEFAULT_STALE_AFTER_MS = 10 * 60 * 1000;
const DEFAULT_LIMIT = 50;
const NONTERMINAL_STATUSES: GenerationStatus[] = ['pending', 'processing'];

const defaultLoadStaleGenerations: LoadStaleGenerations = async ({
  before,
  limit,
}) => {
  const db = await getDb();

  const rows = await db
    .select({
      id: generationHistory.id,
      userId: generationHistory.userId,
      effectId: generationHistory.effectId,
      status: generationHistory.status,
      createdAt: generationHistory.createdAt,
    })
    .from(generationHistory)
    .where(
      and(
        inArray(generationHistory.status, NONTERMINAL_STATUSES),
        lt(generationHistory.createdAt, before)
      )
    )
    .orderBy(asc(generationHistory.createdAt))
    .limit(limit);

  return rows.map((row) => ({
    ...row,
    status: row.status as GenerationStatus,
  }));
};

const defaultRunStatusPass: RunStatusPass = async (task) => {
  const result = await runGenerationStatusPass({
    wmTaskId: task.id,
    userId: task.userId,
    effectId: task.effectId,
  });
  const updated = await getGenerationById({
    id: task.id,
    userId: task.userId,
    effectId: task.effectId,
  });

  return {
    ...result,
    status: (updated?.status as GenerationStatus | undefined) ?? task.status,
  };
};

export async function cleanupStaleGenerations({
  now = new Date(),
  staleAfterMs = DEFAULT_STALE_AFTER_MS,
  limit = DEFAULT_LIMIT,
  loadStaleGenerations = defaultLoadStaleGenerations,
  runStatusPass = defaultRunStatusPass,
  logError = console.error,
}: CleanupStaleGenerationsOptions = {}): Promise<CleanupStaleGenerationsResult> {
  const before = new Date(now.getTime() - staleAfterMs);
  let tasks: StaleGeneration[];

  try {
    tasks = await loadStaleGenerations({ before, limit });
  } catch (error) {
    logError('cleanup stale generations load failed:', error);
    return {
      scannedCount: 0,
      processedCount: 0,
      failedCount: 0,
      succeededCount: 0,
      errorCount: 1,
    };
  }

  const result: CleanupStaleGenerationsResult = {
    scannedCount: tasks.length,
    processedCount: 0,
    failedCount: 0,
    succeededCount: 0,
    errorCount: 0,
  };

  for (const task of tasks) {
    try {
      const statusResult = await runStatusPass(task);
      result.processedCount += 1;

      if (statusResult.status === 'failed') {
        result.failedCount += 1;
      }
      if (statusResult.status === 'succeeded') {
        result.succeededCount += 1;
      }
    } catch (error) {
      result.errorCount += 1;
      logError('cleanup stale generation failed:', {
        generationId: task.id,
        userId: task.userId,
        effectId: task.effectId,
        error,
      });
    }
  }

  return {
    ...result,
  };
}
