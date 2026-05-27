import { randomUUID } from 'crypto';
import { getEffectById } from '@/lib/effects/effects';
import {
  resolveGenerationSubmitTransition,
  resolveProviderTaskId,
} from '@/lib/effects/generation-orchestrator';
import { createGptImage2GenerationWithFallback } from '@/lib/effects/gpt-image-2-provider-chain';
import { reserveAnonymousTrialQuota } from '@/lib/effects/anonymous-trial-quota';
import { getPublicGenerationErrorMessage } from '@/lib/effects/public-error';
import {
  getGenerationPromptMaxChars,
  validateGenerationPrompt,
} from '@/lib/effects/validation';
import { NextResponse } from 'next/server';

const ANONYMOUS_TRIAL_COOKIE = 'gptimg_anonymous_trial_used';
const ANONYMOUS_TRIAL_EFFECT_ID = 16;
const ANONYMOUS_TRIAL_INPUT = {
  aspect_ratio: 'auto',
  quality: 'low',
  wmOutputQuality: '1k',
} as const;

type AnonymousGenerateRequest = {
  input?: unknown;
};

const ensureObject = (value: unknown): Record<string, unknown> =>
  typeof value === 'object' && value !== null
    ? (value as Record<string, unknown>)
    : {};

const hasBlockedMediaInput = (input: Record<string, unknown>) =>
  ['video_urls', 'audio_urls'].some((key) => key in input);

const withTrialUsedCookie = (response: NextResponse) => {
  response.cookies.set(ANONYMOUS_TRIAL_COOKIE, '1', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
  });
  return response;
};

export async function POST(request: Request) {
  if (request.headers.get('cookie')?.includes(`${ANONYMOUS_TRIAL_COOKIE}=1`)) {
    return NextResponse.json(
      {
        error: 'Free preview already used. Sign in to generate more.',
        trialUsed: true,
        trialRemaining: 0,
      },
      { status: 429 }
    );
  }

  const payload = (await request.json().catch(() => null)) as
    | AnonymousGenerateRequest
    | null;
  if (!payload) return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });

  const inputObject = ensureObject(payload.input);
  if (hasBlockedMediaInput(inputObject)) {
    return NextResponse.json(
      { error: 'Reference uploads require sign in.' },
      { status: 400 }
    );
  }

  const effect = await getEffectById(ANONYMOUS_TRIAL_EFFECT_ID);
  if (!effect || effect.isOpen === 0) {
    return NextResponse.json({ error: 'Effect not found' }, { status: 404 });
  }

  const promptValidation = validateGenerationPrompt(
    typeof inputObject.prompt === 'string' ? inputObject.prompt : '',
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

  const quota = await reserveAnonymousTrialQuota(request).catch((error) => {
    console.error('effects.anonymous-generate quota error:', error);
    return null;
  });
  if (!quota) {
    return NextResponse.json(
      {
        error: 'Free preview is temporarily unavailable. Sign in to generate more.',
        trialUsed: true,
        trialRemaining: 0,
      },
      { status: 503 }
    );
  }
  if (!quota.allowed) {
    return withTrialUsedCookie(
      NextResponse.json(
        {
          error: 'Free preview already used. Sign in to generate more.',
          trialUsed: true,
          trialRemaining: 0,
        },
        { status: 429 }
      )
    );
  }

  const wmTaskId = randomUUID();
  const adapterInput = {
    prompt: promptValidation.trimmedPrompt,
    ...ANONYMOUS_TRIAL_INPUT,
  };

  try {
    const result = (
      await createGptImage2GenerationWithFallback({
        effect,
        input: adapterInput,
      })
    ).result;
    const resultError =
      'error' in result && typeof result.error === 'string'
        ? result.error
        : null;
    const providerOutput = 'output' in result ? result.output : undefined;
    const providerTaskId = resolveProviderTaskId(providerOutput);
    const transition = resolveGenerationSubmitTransition({
      generationId: wmTaskId,
      providerStatus: result.status,
      providerTaskId,
      previousOutput: {},
      providerOutput,
      providerError: resultError,
    });

    return withTrialUsedCookie(
      NextResponse.json({
        success: transition.publicStatus === 'succeeded',
        status: transition.publicStatus,
        wmTaskId,
        providerTaskId,
        output: transition.output,
        trialUsed: true,
        trialRemaining: 0,
        error:
          transition.publicStatus === 'failed'
            ? getPublicGenerationErrorMessage(transition.error)
            : null,
      })
    );
  } catch (error) {
    console.error('effects.anonymous-generate error:', error);
    return withTrialUsedCookie(
      NextResponse.json(
        {
          error: 'Generation request failed, please retry.',
          trialUsed: true,
          trialRemaining: 0,
        },
        { status: 500 }
      )
    );
  }
}
