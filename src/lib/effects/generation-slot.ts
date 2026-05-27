import { randomUUID } from 'crypto';
import { deriveGenerationOperationalFields } from './generation-operational-fields';

export type PendingGenerationSlot = {
  id: string;
  userId: string;
  effectId: number;
  status: 'pending';
  providerTaskId: string | null;
  lifecyclePhase: string | null;
  lastProviderSyncAt: Date | null;
  input: unknown;
  output: unknown;
  error: null;
  creditsUsed: number;
  createdAt: Date;
};

type PendingGenerationSlotDeps = {
  lockUser: (userId: string) => Promise<void>;
  hasRunningGeneration: (userId: string) => Promise<boolean>;
  insertGeneration: (record: PendingGenerationSlot) => Promise<void>;
};

export async function createPendingGenerationSlot(
  {
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
  },
  deps: PendingGenerationSlotDeps
) {
  await deps.lockUser(userId);
  if (await deps.hasRunningGeneration(userId)) {
    return null;
  }

  const stamp = new Date();
  const operationalFields = deriveGenerationOperationalFields({ output });
  const record: PendingGenerationSlot = {
    id: randomUUID(),
    userId,
    effectId,
    status: 'pending',
    providerTaskId: operationalFields.providerTaskId ?? null,
    lifecyclePhase: operationalFields.lifecyclePhase ?? null,
    lastProviderSyncAt: operationalFields.lastProviderSyncAt,
    input: input ?? null,
    output: output ?? null,
    error: null,
    creditsUsed,
    createdAt: stamp,
  };
  await deps.insertGeneration(record);

  return record.id;
}
