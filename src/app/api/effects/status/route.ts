import { getDb } from '@/db';
import { generationHistory } from '@/db/schema';
import {
  isBatchGenerationOutput,
  mergeBatchGenerationResults,
} from '@/lib/effects/batch-generation';
import { checkBatchGenerationTasks } from '@/lib/effects/batch-status-sync';
import { getEffectById } from '@/lib/effects/effects';
import { getUserGenerationAccessTier } from '@/lib/effects/generation-access-server';
import {
  publicStatusFromProvider,
} from '@/lib/effects/generation-output';
import {
  continueImageGenerationAfterProviderFailure,
  createAdapterForStoredImageGeneration,
} from '@/lib/effects/gpt-image-2-provider-chain';
import { persistGenerationOutputAssets } from '@/lib/effects/output-assets';
import { enqueueEffectsStatusCheck } from '@/lib/effects/queue';
import {
  applyResultRevealGate,
  type GenerationStatus,
} from '@/lib/effects/result-reveal-gate';
import { settleGenerationStatus } from '@/lib/effects/generation-settlement';
import { startBackendPollingForGeneration } from '@/lib/effects/server-poller';
import { getSession } from '@/lib/server';
import { and, eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const url = new URL(request.url);
  const generationId = url.searchParams.get('id');
  if (!generationId) {
    return NextResponse.json({ error: 'id is required' }, { status: 400 });
  }

  const db = await getDb();
  const rows = await db
    .select()
    .from(generationHistory)
    .where(
      and(
        eq(generationHistory.id, generationId),
        eq(generationHistory.userId, session.user.id)
      )
    )
    .limit(1);
  const generation = rows[0];
  if (!generation) {
    return NextResponse.json({ error: 'Generation not found' }, { status: 404 });
  }

  const generationAccessTier = await getUserGenerationAccessTier(
    session.user.id
  );
  const isProcessingBatch =
    generation.status === 'processing' &&
    isBatchGenerationOutput(generation.output);

  if (
    generation.status !== 'processing' ||
    (!generation.providerTaskId && !isProcessingBatch)
  ) {
    let responseGeneration = generation;
    const terminalGeneration =
      generation.status === 'succeeded' || generation.status === 'failed';
    if (terminalGeneration) {
      await settleGenerationStatus({
        generationId: generation.id,
        userId: session.user.id,
        effectName: 'generation',
        status: generation.status as GenerationStatus,
        output: generation.output,
        error: generation.error,
        creditsUsed: generation.creditsUsed,
      });
      const updatedRows = await db
        .select()
        .from(generationHistory)
        .where(eq(generationHistory.id, generation.id))
        .limit(1);
      responseGeneration = updatedRows[0] ?? generation;
    }
    const revealGate = applyResultRevealGate({
      accessTier: generationAccessTier,
      status: responseGeneration.status as GenerationStatus,
      output: responseGeneration.output,
    });
    if (revealGate.shouldStoreOutput) {
      await db
        .update(generationHistory)
        .set({ output: revealGate.outputForStore })
        .where(eq(generationHistory.id, generation.id));
    }
    return NextResponse.json({
      ...responseGeneration,
      status: revealGate.responseStatus,
      output: revealGate.outputForResponse,
    });
  }

  const effect = await getEffectById(generation.effectId);
  if (!effect) return NextResponse.json(generation);

  if (isProcessingBatch) {
    const batchResult = mergeBatchGenerationResults({
      previousOutput: generation.output,
      checkedResults: await checkBatchGenerationTasks({
        effect,
        input: generation.input,
        output: generation.output,
      }),
    });
    const outputForStore =
      batchResult.status === 'succeeded'
        ? await persistGenerationOutputAssets({
            generationId: generation.id,
            userId: session.user.id,
            output: batchResult.output,
            assetType: effect.type === 1 ? 'video' : 'image',
          })
        : batchResult.output;
    const revealGate = applyResultRevealGate({
      accessTier: generationAccessTier,
      status: batchResult.status,
      output: outputForStore,
    });

    await settleGenerationStatus({
      generationId: generation.id,
      userId: session.user.id,
      effectName: effect.name,
      status: batchResult.status,
      output: revealGate.outputForStore,
      error: batchResult.error ?? generation.error,
      creditsUsed: generation.creditsUsed,
    });

    if (batchResult.status === 'processing') {
      const queueResult = await enqueueEffectsStatusCheck({
        wmTaskId: generation.id,
        userId: session.user.id,
        effectId: effect.id,
        attempt: 1,
        source: 'retry',
      });
      if (!queueResult.enqueued) {
        startBackendPollingForGeneration({
          wmTaskId: generation.id,
          userId: session.user.id,
          effectId: effect.id,
        });
      }
    }

    const updatedRows = await db
      .select()
      .from(generationHistory)
      .where(eq(generationHistory.id, generation.id))
      .limit(1);
    const updatedGeneration = updatedRows[0] ?? generation;
    return NextResponse.json({
      ...updatedGeneration,
      status: revealGate.responseStatus,
      output: revealGate.outputForResponse,
    });
  }

  const adapter = createAdapterForStoredImageGeneration({
    effect,
    output: generation.output,
  });
  if (!adapter.checkStatus) return NextResponse.json(generation);

  const currentProviderTaskId = generation.providerTaskId;
  if (!currentProviderTaskId) return NextResponse.json(generation);

  let result = await adapter.checkStatus(currentProviderTaskId);
  if (result.status === 'failed') {
    const fallback = await continueImageGenerationAfterProviderFailure({
      effect,
      input: generation.input,
      previousOutput: generation.output,
      failedProviderTaskId: currentProviderTaskId,
      providerError: result.error ?? null,
    });
    if (fallback) {
      result = fallback.result;
    }
  }
  const status = publicStatusFromProvider(result.status);
  const outputForStore =
    result.status === 'succeeded'
      ? await persistGenerationOutputAssets({
          generationId: generation.id,
          userId: session.user.id,
          output: result.output ?? generation.output,
          assetType: effect.type === 1 ? 'video' : 'image',
        })
      : result.output ?? generation.output;
  const revealGate = applyResultRevealGate({
    accessTier: generationAccessTier,
    status,
    output: outputForStore,
  });

  await settleGenerationStatus({
    generationId: generation.id,
    userId: session.user.id,
    effectName: effect.name,
    status,
    output: revealGate.outputForStore,
    error: result.error ?? generation.error,
    creditsUsed: generation.creditsUsed,
  });

  if (status === 'processing') {
    const queueResult = await enqueueEffectsStatusCheck({
      wmTaskId: generation.id,
      userId: session.user.id,
      effectId: effect.id,
      attempt: 1,
      source: 'retry',
    });
    if (!queueResult.enqueued) {
      startBackendPollingForGeneration({
        wmTaskId: generation.id,
        userId: session.user.id,
        effectId: effect.id,
      });
    }
  }

  const updatedRows = await db
    .select()
    .from(generationHistory)
    .where(eq(generationHistory.id, generation.id))
    .limit(1);
  const updatedGeneration = updatedRows[0] ?? generation;
  return NextResponse.json({
    ...updatedGeneration,
    status: revealGate.responseStatus,
    output: revealGate.outputForResponse,
  });
}
