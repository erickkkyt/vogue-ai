import { createHmac, timingSafeEqual } from 'crypto';
import { getEffectById } from '@/lib/effects/effects';
import { resolveProviderSyncTransition } from '@/lib/effects/generation-orchestrator';
import { resolveStoredGptImage2Provider } from '@/lib/effects/gpt-image-2-provider-chain';
import { resolveOutputMedia } from '@/lib/effects/output-media';
import { persistEffectOutputIfNeeded } from '@/lib/effects/output-storage';
import {
  extractProviderCallbackTaskId,
  resolveEffectCallbackKind,
  resolveProviderCallbackError,
  resolveProviderCallbackPayloadData,
  resolveProviderCallbackStatus,
} from '@/lib/effects/provider-callback';
import {
  getGenerationByProviderTaskIdGlobal,
  updateGenerationById,
} from '@/lib/effects/record-generation';
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
    ? resolveStoredGptImage2Provider({
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

  const transition =
    generation && generationEffect
      ? resolveProviderSyncTransition({
          generationId: generation.id,
          previousOutput: generationOutput,
          providerStatus: status,
          providerTaskId: taskId,
          providerOutput: outputBase,
          providerError: callbackError,
        })
      : null;

  if (generation && generationEffect && transition) {
    const output =
      status === 'succeeded'
        ? await persistEffectOutputIfNeeded({
            output: transition.output,
            wmTaskId: generation.id,
            effectId: generation.effectId,
            effectType: generationEffect.type,
            userId: generation.userId,
          })
        : transition.output;
    await updateGenerationById({
      id: generation.id,
      status: transition.publicStatus,
      output,
      error:
        transition.publicStatus === 'failed'
          ? callbackError || 'Callback reported failure'
          : null,
    });
  }

  return NextResponse.json({
    success: true,
    status: transition?.publicStatus ?? status,
    taskId,
  });
}
