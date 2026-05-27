import { releaseReservedCredits } from '@/credits/credits';
import { getDb } from '@/db';
import { generationHistory } from '@/db/schema';
import { getEffectById } from '@/lib/effects/effects';
import { deriveGenerationOperationalFields } from '@/lib/effects/generation-operational-fields';
import {
  publicStatusFromProvider,
  readProviderTaskId,
} from '@/lib/effects/generation-output';
import { createAdapterForStoredGptImage2Generation } from '@/lib/effects/gpt-image-2-provider-chain';
import { persistGenerationOutputAssets } from '@/lib/effects/output-assets';
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

  if (generation.status !== 'processing' || !generation.providerTaskId) {
    return NextResponse.json(generation);
  }

  const effect = await getEffectById(generation.effectId);
  if (!effect) return NextResponse.json(generation);

  const adapter = createAdapterForStoredGptImage2Generation({
    effect,
    output: generation.output,
  });
  if (!adapter.checkStatus) return NextResponse.json(generation);

  const result = await adapter.checkStatus(generation.providerTaskId);
  const status = publicStatusFromProvider(result.status);
  const providerTaskId =
    readProviderTaskId(result.output) ?? generation.providerTaskId;
  const operationalFields = deriveGenerationOperationalFields({
    output: result.output,
  });
  const outputForStore =
    result.status === 'succeeded'
      ? await persistGenerationOutputAssets({
          generationId: generation.id,
          userId: session.user.id,
          output: result.output ?? generation.output,
          assetType: effect.type === 1 ? 'video' : 'image',
        })
      : result.output ?? generation.output;

  if (result.status === 'failed' && generation.creditsUsed > 0) {
    await releaseReservedCredits({
      userId: session.user.id,
      referenceId: generation.id,
      description: `Refunded failed ${effect.name} generation`,
    });
  }

  const updatedRows = await db
    .update(generationHistory)
    .set({
      status,
      providerTaskId,
      lifecyclePhase: operationalFields.lifecyclePhase ?? null,
      lastProviderSyncAt:
        operationalFields.lastProviderSyncAt ??
        (providerTaskId ? new Date() : null),
      output: outputForStore,
      error: result.error ?? generation.error,
      creditsUsed: result.status === 'failed' ? 0 : generation.creditsUsed,
    })
    .where(eq(generationHistory.id, generation.id))
    .returning();

  return NextResponse.json(updatedRows[0] ?? generation);
}
