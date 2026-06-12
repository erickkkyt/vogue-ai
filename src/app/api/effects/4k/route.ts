import { createAdapter } from '@/lib/adapters/adapter-factory';
import { getEffectById } from '@/lib/effects/effects';
import { resolveKieCallbackUrl } from '@/lib/effects/kie-callback';
import { getGenerationById } from '@/lib/effects/record-generation';
import { settleGenerationStatus } from '@/lib/effects/generation-settlement';
import { persistVideoOutputIfNeeded } from '@/lib/effects/video-storage';
import { getSession } from '@/lib/server';
import { NextResponse } from 'next/server';

type QualityAdapter = ReturnType<typeof createAdapter> & {
  get4kVideo?: (
    taskId: string,
    index: number,
    callbackUrl?: string
  ) => Promise<{
    status: 'pending' | 'processing' | 'succeeded' | 'failed';
    output?: unknown;
    error?: string;
  }>;
};

type FourKRequest = {
  wmTaskId?: string;
  effectId?: number;
  index?: number;
};

export async function POST(request: Request) {
  const session = await getSession();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const payload = (await request.json().catch(() => null)) as FourKRequest | null;
  if (!payload?.wmTaskId || !Number.isFinite(payload.effectId)) {
    return NextResponse.json(
      { error: 'wmTaskId and effectId are required' },
      { status: 400 }
    );
  }

  const effect = await getEffectById(payload.effectId as number);
  const generation = effect
    ? await getGenerationById({
        id: payload.wmTaskId,
        userId: session.user.id,
        effectId: effect.id,
      })
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
  if (!adapter.get4kVideo) {
    return NextResponse.json(
      { error: '4k fetch not supported for this effect' },
      { status: 400 }
    );
  }

  const index = Number.isFinite(payload.index) ? Number(payload.index) : 0;
  const result = await adapter.get4kVideo(
    providerTaskId,
    index,
    resolveKieCallbackUrl()
  );
  const output =
    result.status === 'succeeded'
      ? await persistVideoOutputIfNeeded({
          output: result.output ?? generationOutput,
          wmTaskId: payload.wmTaskId,
          effectId: effect.id,
          userId: generation.userId,
        })
      : (result.output ?? generationOutput);
  const status = result.status === 'failed' ? 'failed' : result.status;
  await settleGenerationStatus({
    generationId: payload.wmTaskId,
    userId: generation.userId,
    effectName: effect.name,
    status,
    output,
    error: result.error ?? null,
    creditsUsed: generation.creditsUsed,
  });

  return NextResponse.json({
    success: status === 'succeeded',
    wmTaskId: payload.wmTaskId,
    status,
    output,
    error: status === 'failed' ? '4K task failed, please retry.' : null,
  });
}
