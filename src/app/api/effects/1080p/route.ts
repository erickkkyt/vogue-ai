import { withDbRequestContext } from '@/db';
import { createAdapter } from '@/lib/adapters/adapter-factory';
import { getEffectById } from '@/lib/effects/effects';
import { getGenerationById } from '@/lib/effects/record-generation';
import { settleGenerationStatus } from '@/lib/effects/generation-settlement';
import { persistVideoOutputIfNeeded } from '@/lib/effects/video-storage';
import { getSession } from '@/lib/server';
import { NextResponse } from 'next/server';

type QualityAdapter = ReturnType<typeof createAdapter> & {
  get1080pVideo?: (taskId: string, index: number) => Promise<{
    status: 'pending' | 'processing' | 'succeeded' | 'failed';
    output?: unknown;
    error?: string;
  }>;
};

export async function GET(request: Request) {
  return withDbRequestContext(() => get1080pEffect(request));
}

async function get1080pEffect(request: Request) {
  const session = await getSession();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const wmTaskId = searchParams.get('wmTaskId');
  const effectId = Number.parseInt(searchParams.get('effectId') ?? '', 10);
  const index = Number.parseInt(searchParams.get('index') ?? '0', 10);
  if (!wmTaskId || Number.isNaN(effectId) || Number.isNaN(index) || index < 0) {
    return NextResponse.json(
      { error: 'Missing or invalid wmTaskId/effectId/index' },
      { status: 400 }
    );
  }

  const effect = await getEffectById(effectId);
  const generation = effect
    ? await getGenerationById({ id: wmTaskId, userId: session.user.id, effectId })
    : null;
  if (!effect || !generation) {
    return NextResponse.json({ error: 'Task not found' }, { status: 404 });
  }

  const generationOutput =
    generation.output && typeof generation.output === 'object'
      ? (generation.output as Record<string, unknown>)
      : {};
  const providerTaskId =
    typeof generation.providerTaskId === 'string'
      ? generation.providerTaskId
      : typeof generationOutput.providerTaskId === 'string'
        ? generationOutput.providerTaskId
        : typeof generationOutput.taskId === 'string'
          ? generationOutput.taskId
          : null;
  if (!providerTaskId) {
    return NextResponse.json(
      { error: 'Provider task is not ready yet' },
      { status: 409 }
    );
  }

  const adapter = createAdapter(effect) as QualityAdapter;
  if (!adapter.get1080pVideo) {
    return NextResponse.json(
      { error: '1080p fetch not supported for this effect' },
      { status: 400 }
    );
  }

  const result = await adapter.get1080pVideo(providerTaskId, index);
  const output =
    result.status === 'succeeded'
      ? await persistVideoOutputIfNeeded({
          output: result.output ?? generationOutput,
          wmTaskId,
          effectId,
          userId: generation.userId,
        })
      : (result.output ?? generationOutput);
  const status =
    result.status === 'succeeded'
      ? 'succeeded'
      : result.status === 'failed'
        ? 'failed'
        : 'processing';
  await settleGenerationStatus({
    generationId: wmTaskId,
    userId: generation.userId,
    effectName: effect.name,
    status,
    output,
    error: result.error ?? null,
    creditsUsed: generation.creditsUsed,
  });

  return NextResponse.json({
    success: status === 'succeeded',
    wmTaskId,
    status,
    output,
    error: status === 'failed' ? result.error ?? '1080p task failed' : null,
  });
}
