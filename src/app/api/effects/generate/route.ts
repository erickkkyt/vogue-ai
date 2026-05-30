import { randomUUID } from 'crypto';
import {
  confirmReservedCredits,
  getUserCredits,
  releaseReservedCredits,
  reserveCredits,
} from '@/credits/credits';
import { getDb } from '@/db';
import { generationHistory } from '@/db/schema';
import { createAdapter } from '@/lib/adapters/adapter-factory';
import { linkGenerationInputAssetsByUrls } from '@/lib/assets/user-assets';
import { ensureEffectRow, getEffectById } from '@/lib/effects/effects';
import { getUserGenerationAccessTier } from '@/lib/effects/generation-access-server';
import { publicStatusFromProvider } from '@/lib/effects/generation-output';
import { deriveGenerationOperationalFields } from '@/lib/effects/generation-operational-fields';
import { buildProviderGenerationInput } from '@/lib/effects/generation-input';
import {
  createImageGenerationWithFallback,
  isImageProviderFallbackEffect,
} from '@/lib/effects/gpt-image-2-provider-chain';
import { resolveKieCallbackUrl } from '@/lib/effects/kie-callback';
import { persistGenerationOutputAssets } from '@/lib/effects/output-assets';
import { estimateCreditsForEffect } from '@/lib/effects/pricing';
import { enqueueEffectsStatusCheck } from '@/lib/effects/queue';
import { applyResultRevealGate } from '@/lib/effects/result-reveal-gate';
import { startBackendPollingForGeneration } from '@/lib/effects/server-poller';
import {
  getGenerationPromptMaxChars,
  validateGenerationPrompt,
} from '@/lib/effects/validation';
import { getSession } from '@/lib/server';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

type GenerateRequest = {
  effectId: number;
  input?: Record<string, unknown>;
};

export async function POST(request: Request) {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const payload = (await request.json().catch(() => null)) as
    | GenerateRequest
    | null;
  if (!payload?.effectId) {
    return NextResponse.json({ error: 'effectId is required' }, { status: 400 });
  }

  const effect = await getEffectById(payload.effectId);
  if (!effect || effect.isOpen === 0) {
    return NextResponse.json({ error: 'Effect not found' }, { status: 404 });
  }

  const input = { ...(payload.input ?? {}) };
  const promptValidation = validateGenerationPrompt(
    typeof input.prompt === 'string' ? input.prompt : '',
    {
      required: true,
      maxChars: getGenerationPromptMaxChars({ provider: effect.provider }),
    }
  );
  if (!promptValidation.ok) {
    return NextResponse.json(
      {
        error:
          promptValidation.code === 'PROMPT_TOO_LONG'
            ? `Prompt must be ${promptValidation.maxChars} characters or fewer.`
            : 'Prompt is required.',
      },
      { status: 400 }
    );
  }

  const adapterInput = buildProviderGenerationInput({
    rawInput: input,
    prompt: promptValidation.trimmedPrompt,
    callbackUrl: resolveKieCallbackUrl(),
  });
  const requiredCredits = estimateCreditsForEffect({
    effect,
    input: adapterInput,
  });
  const generationAccessTier = await getUserGenerationAccessTier(
    session.user.id
  );
  const currentCredits = await getUserCredits(session.user.id);
  if (currentCredits < requiredCredits) {
    return NextResponse.json(
      { error: 'Insufficient credits', currentCredits, requiredCredits },
      { status: 402 }
    );
  }

  await ensureEffectRow(effect);

  const db = await getDb();
  const generationId = randomUUID();
  const stamp = new Date();
  await db.insert(generationHistory).values({
    id: generationId,
    userId: session.user.id,
    effectId: effect.id,
    status: 'pending',
    providerTaskId: null,
    lifecyclePhase: null,
    lastProviderSyncAt: null,
    input: adapterInput,
    creditsUsed: 0,
    createdAt: stamp,
  });

  let reserved = false;
  try {
    await reserveCredits({
      userId: session.user.id,
      amount: requiredCredits,
      description: `Reserved credits for ${effect.name}`,
      referenceId: generationId,
    });
    reserved = true;

    const inputImageUrls = Array.isArray(adapterInput.image_urls)
      ? adapterInput.image_urls.filter(
          (item): item is string => typeof item === 'string'
        )
      : typeof adapterInput.image_url === 'string'
        ? [adapterInput.image_url]
        : [];
    if (inputImageUrls.length > 0) {
      await linkGenerationInputAssetsByUrls({
        generationId,
        userId: session.user.id,
        urls: inputImageUrls,
      }).catch((assetError) => {
        console.error('link input assets failed:', assetError);
      });
    }

    const result = isImageProviderFallbackEffect(effect)
      ? (
          await createImageGenerationWithFallback({
            effect,
            input: adapterInput,
          })
        ).result
      : await createAdapter(effect).createGeneration(adapterInput);
    const publicStatus = publicStatusFromProvider(result.status);
    const operationalFields = deriveGenerationOperationalFields({
      output: result.output,
    });
    const outputForStore =
      result.status === 'succeeded'
        ? await persistGenerationOutputAssets({
            generationId,
            userId: session.user.id,
            output: result.output ?? null,
            assetType: effect.type === 1 ? 'video' : 'image',
        })
        : result.output ?? null;
    const revealGate = applyResultRevealGate({
      accessTier: generationAccessTier,
      status: publicStatus,
      output: outputForStore,
    });

    if (result.status === 'failed') {
      await releaseReservedCredits({
        userId: session.user.id,
        referenceId: generationId,
        description: `Released credits for failed ${effect.name} generation`,
      });
      reserved = false;
    } else {
      await confirmReservedCredits({
        userId: session.user.id,
        referenceId: generationId,
        description: `${effect.name} image generation`,
      });
      reserved = false;
    }

    await db
      .update(generationHistory)
      .set({
        status: publicStatus,
        providerTaskId: operationalFields.providerTaskId ?? null,
        lifecyclePhase: operationalFields.lifecyclePhase ?? null,
        lastProviderSyncAt: operationalFields.lastProviderSyncAt,
        output: revealGate.outputForStore,
        error: result.error ?? null,
        creditsUsed: result.status === 'failed' ? 0 : requiredCredits,
      })
      .where(eq(generationHistory.id, generationId));

    if (publicStatus === 'processing') {
      const queueResult = await enqueueEffectsStatusCheck({
        wmTaskId: generationId,
        userId: session.user.id,
        effectId: effect.id,
        attempt: 1,
        source: 'generate',
      });
      if (!queueResult.enqueued) {
        startBackendPollingForGeneration({
          wmTaskId: generationId,
          userId: session.user.id,
          effectId: effect.id,
        });
      }
    }

    return NextResponse.json({
      success: revealGate.responseStatus === 'succeeded',
      status: revealGate.responseStatus,
      generationId,
      output: revealGate.outputForResponse,
      error: result.error ?? null,
      creditsUsed: result.status === 'failed' ? 0 : requiredCredits,
    });
  } catch (error) {
    if (reserved) {
      await releaseReservedCredits({
        userId: session.user.id,
        referenceId: generationId,
        description: `Released credits for errored ${effect.name} generation`,
      }).catch((releaseError) => {
        console.error('release reserved credits failed:', releaseError);
      });
    }

    const message = error instanceof Error ? error.message : 'Generation failed';
    await db
      .update(generationHistory)
      .set({
        status: 'failed',
        error: message,
        creditsUsed: 0,
      })
      .where(eq(generationHistory.id, generationId));

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
