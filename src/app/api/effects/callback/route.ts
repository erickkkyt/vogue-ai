import { createHmac, timingSafeEqual } from 'crypto';
import { getEffectById } from '@/lib/effects/effects';
import {
  getUserGenerationAccessTier,
  getUserHasPaidGenerationEntitlement,
} from '@/lib/effects/generation-access-server';
import { readProviderTaskId } from '@/lib/effects/generation-output';
import { resolveProviderSyncTransition } from '@/lib/effects/generation-orchestrator';
import {
  continueImageGenerationAfterProviderFailure,
  resolveStoredImageProvider,
} from '@/lib/effects/gpt-image-2-provider-chain';
import { resolveOutputMedia } from '@/lib/effects/output-media';
import { persistEffectOutputIfNeeded } from '@/lib/effects/output-storage';
import {
  extractProviderCallbackTaskId,
  resolveEffectCallbackKind,
  resolveProviderCallbackError,
  resolveProviderCallbackPayloadData,
  resolveProviderCallbackStatus,
} from '@/lib/effects/provider-callback';
import { enqueueEffectsStatusCheck } from '@/lib/effects/queue';
import {
  getGenerationByProviderTaskIdGlobal,
} from '@/lib/effects/record-generation';
import { applyResultRevealGate } from '@/lib/effects/result-reveal-gate';
import { settleGenerationStatus } from '@/lib/effects/generation-settlement';
import { startBackendPollingForGeneration } from '@/lib/effects/server-poller';
import { shouldWatermarkGenerationOutput } from '@/lib/effects/watermark-access';
import { NextResponse } from 'next/server';

const asObject = (value: unknown): Record<string, unknown> =>
  value && typeof value === 'object' ? (value as Record<string, unknown>) : {};

const verifyKieCallbackSignature = ({
  request,
  providerTaskId,
}: {
  request: Request;
  providerTaskId: string;
}) => {
  const signingKey = process.env.KIE_WEBHOOK_SECRET;
  if (!signingKey) {
    return {
      ok: false,
      status: 503,
      error: 'KIE webhook signing key is not configured',
    };
  }

  const timestamp = request.headers.get('X-Webhook-Timestamp');
  const signature = request.headers
    .get('X-Webhook-Signature')
    ?.replace(/^sha256=/i, '')
    .trim();
  if (!timestamp || !signature) {
    return { ok: false, status: 401, error: 'Missing callback signature headers' };
  }

  const expectedSignature = createHmac('sha256', signingKey)
    .update(`${providerTaskId}.${timestamp}`)
    .digest('base64');
  const expectedBuffer = Buffer.from(expectedSignature);
  const receivedBuffer = Buffer.from(signature);
  if (
    expectedBuffer.length !== receivedBuffer.length ||
    !timingSafeEqual(expectedBuffer, receivedBuffer)
  ) {
    return { ok: false, status: 401, error: 'Invalid callback signature' };
  }

  return { ok: true } as const;
};

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => null)) as Record<
    string,
    unknown
  > | null;
  if (!payload) {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const taskId = extractProviderCallbackTaskId(payload);
  if (!taskId) {
    return NextResponse.json({ error: 'Missing taskId' }, { status: 400 });
  }

  const generation = await getGenerationByProviderTaskIdGlobal({ taskId });
  const generationEffect = generation
    ? await getEffectById(generation.effectId)
    : null;
  const generationOutput = generation ? asObject(generation.output) : {};
  const callbackProvider = generationEffect
    ? resolveStoredImageProvider({
        effect: generationEffect,
        output: generationOutput,
      })
    : null;
  if (resolveEffectCallbackKind(callbackProvider) === 'kie') {
    const signatureValidation = verifyKieCallbackSignature({
      request,
      providerTaskId: taskId,
    });
    if (!signatureValidation.ok) {
      return NextResponse.json(
        { error: signatureValidation.error },
        { status: signatureValidation.status }
      );
    }
  }

  const status = resolveProviderCallbackStatus({
    provider: callbackProvider,
    payload,
  });
  const callbackError = resolveProviderCallbackError({
    provider: callbackProvider,
    payload,
  });
  const callbackData = resolveProviderCallbackPayloadData({
    provider: callbackProvider,
    payload,
  });
  const mediaOutput = resolveOutputMedia(callbackData);
  const outputBase =
    status === 'succeeded'
      ? {
          ...(generationEffect?.type === 1
            ? { video_urls: mediaOutput.resultUrls }
            : {}),
          ...(generationEffect?.type === 2
            ? { image_urls: mediaOutput.resultUrls }
            : {}),
          result_urls: mediaOutput.resultUrls,
          result_url: mediaOutput.resultUrl ?? mediaOutput.resultUrls[0],
          raw: callbackData,
        }
      : { raw: callbackData };

  let providerStatus: 'pending' | 'processing' | 'succeeded' | 'failed' =
    status;
  let providerTaskId = taskId;
  let providerOutput: unknown = outputBase;
  let providerError = callbackError;

  if (generation && generationEffect && status === 'failed') {
    const fallback = await continueImageGenerationAfterProviderFailure({
      effect: generationEffect,
      input: generation.input,
      previousOutput: generationOutput,
      failedProviderTaskId: taskId,
      providerError: callbackError,
    });
    if (fallback) {
      providerStatus = fallback.result.status;
      providerTaskId = readProviderTaskId(fallback.result.output) ?? taskId;
      providerOutput = fallback.result.output;
      providerError = fallback.result.error ?? null;
    }
  }

  const transition =
    generation && generationEffect
      ? resolveProviderSyncTransition({
          generationId: generation.id,
          previousOutput: generationOutput,
          providerStatus,
          providerTaskId,
          providerOutput,
          providerError,
        })
      : null;

  if (generation && generationEffect && transition) {
    const generationAccessTier = await getUserGenerationAccessTier(
      generation.userId
    );
    const hasPaidEntitlement = await getUserHasPaidGenerationEntitlement(
      generation.userId
    );
    const watermarkOutput = shouldWatermarkGenerationOutput({
      hasPaidEntitlement,
    });
    const output =
      transition.publicStatus === 'succeeded'
        ? await persistEffectOutputIfNeeded({
            output: transition.output,
            wmTaskId: generation.id,
            effectId: generation.effectId,
            effectType: generationEffect.type,
            userId: generation.userId,
            watermarkOutput,
          })
        : transition.output;
    const revealGate = applyResultRevealGate({
      accessTier: generationAccessTier,
      status: transition.publicStatus,
      output,
    });
    await settleGenerationStatus({
      generationId: generation.id,
      userId: generation.userId,
      effectName: generationEffect.name,
      status: transition.publicStatus,
      output: revealGate.outputForStore,
      error:
        transition.publicStatus === 'failed'
          ? providerError || 'Callback reported failure'
          : null,
      creditsUsed: generation.creditsUsed,
    });

    if (transition.publicStatus === 'processing') {
      const queueResult = await enqueueEffectsStatusCheck({
        wmTaskId: generation.id,
        userId: generation.userId,
        effectId: generation.effectId,
        attempt: 1,
        source: 'callback',
      });
      if (!queueResult.enqueued) {
        startBackendPollingForGeneration({
          wmTaskId: generation.id,
          userId: generation.userId,
          effectId: generation.effectId,
        });
      }
    }
  }

  return NextResponse.json({
    success: true,
    status: transition?.publicStatus ?? status,
    taskId,
  });
}
