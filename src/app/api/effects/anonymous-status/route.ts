import { getEffectById } from '@/lib/effects/effects';
import { resolveProviderSyncTransition } from '@/lib/effects/generation-orchestrator';
import { createAdapterForStoredGptImage2Generation } from '@/lib/effects/gpt-image-2-provider-chain';
import { getPublicGenerationErrorMessage } from '@/lib/effects/public-error';
import { NextResponse } from 'next/server';

const ANONYMOUS_TRIAL_EFFECT_ID = 16;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const wmTaskId = searchParams.get('wmTaskId');
  const providerTaskId = searchParams.get('providerTaskId');
  const selectedProvider = searchParams.get('selectedProvider');

  if (!wmTaskId || !providerTaskId) {
    return NextResponse.json(
      { error: 'Missing wmTaskId or providerTaskId' },
      { status: 400 }
    );
  }

  const effect = await getEffectById(ANONYMOUS_TRIAL_EFFECT_ID);
  if (!effect) {
    return NextResponse.json({ error: 'Effect not found' }, { status: 404 });
  }

  const selectedOutput = selectedProvider ? { selectedProvider } : {};
  const adapter = createAdapterForStoredGptImage2Generation({
    effect,
    output: selectedOutput,
  });
  if (!adapter.checkStatus) {
    return NextResponse.json(
      { error: 'Status check not supported for this effect' },
      { status: 400 }
    );
  }

  try {
    const result = await adapter.checkStatus(providerTaskId);
    const transition = resolveProviderSyncTransition({
      generationId: wmTaskId,
      previousOutput: {
        ...selectedOutput,
        providerTaskId,
        taskId: providerTaskId,
      },
      providerStatus: result.status,
      providerTaskId,
      providerOutput: result.output,
      providerError: result.error ?? null,
    });

    return NextResponse.json({
      success: transition.publicStatus === 'succeeded',
      wmTaskId,
      status: transition.publicStatus,
      output: transition.output,
      error:
        transition.publicStatus === 'failed'
          ? getPublicGenerationErrorMessage(transition.error)
          : null,
    });
  } catch (error) {
    console.error('effects.anonymous-status error:', error);
    return NextResponse.json(
      { error: 'Failed to query task status, please retry.' },
      { status: 500 }
    );
  }
}

