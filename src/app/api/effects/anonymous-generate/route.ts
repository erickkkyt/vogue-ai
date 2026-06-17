import { randomUUID } from 'crypto';
import { withDbRequestContext } from '@/db';
import { getEffectById } from '@/lib/effects/effects';
import {
  resolveGenerationSubmitTransition,
  resolveProviderTaskId,
} from '@/lib/effects/generation-orchestrator';
import { createImageGenerationWithFallback } from '@/lib/effects/gpt-image-2-provider-chain';
import { watermarkAnonymousGenerationOutput } from '@/lib/effects/anonymous-watermark';
import { reserveAnonymousTrialQuota } from '@/lib/effects/anonymous-trial-quota';
import { getPublicGenerationErrorMessage } from '@/lib/effects/public-error';
import { shouldWatermarkAnonymousOutput } from '@/lib/effects/watermark-access';
import {
  getGenerationPromptMaxChars,
  validateGenerationPrompt,
} from '@/lib/effects/validation';
import { NextResponse } from 'next/server';

const ANONYMOUS_TRIAL_COOKIE = 'vogue_anonymous_trial_used';
const LEGACY_ANONYMOUS_TRIAL_COOKIE = 'gptimg_anonymous_trial_used';
const ANONYMOUS_TRIAL_EFFECT_ID = 16;
const DEFAULT_PROMPT_LIBRARY_REFERENCE_IMAGE_ORIGIN =
  'https://pub-911e4fa03f0c4323a80d8f3dc99d1c7f.r2.dev';
const PROMPT_LIBRARY_REFERENCE_IMAGE_PATHS = [
  '/prompt-libraries/awesome-gptimage2-prompts/',
  '/prompt-libraries/awesome-ai-prompts/',
];
const MAX_ANONYMOUS_REFERENCE_IMAGES = 6;
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

const getAllowedPromptLibraryReferenceImageOrigins = () =>
  [
    process.env.R2_IMAGE_PUBLIC_URL,
    DEFAULT_PROMPT_LIBRARY_REFERENCE_IMAGE_ORIGIN,
  ].flatMap((value) => {
    if (!value) return [];

    try {
      return [new URL(value).origin];
    } catch {
      return [];
    }
  });

const isAllowedPromptLibraryReferenceImageUrl = (value: string) => {
  try {
    const url = new URL(value);
    return (
      url.protocol === 'https:' &&
      getAllowedPromptLibraryReferenceImageOrigins().includes(url.origin) &&
      PROMPT_LIBRARY_REFERENCE_IMAGE_PATHS.some((path) =>
        url.pathname.startsWith(path)
      )
    );
  } catch {
    return false;
  }
};

const getAnonymousReferenceImageUrls = (value: unknown) => {
  if (!Array.isArray(value)) return [];

  const imageUrls = value
    .flatMap((item): string[] => {
      if (typeof item !== 'string') return [];
      const trimmedUrl = item.trim();
      return trimmedUrl ? [trimmedUrl] : [];
    })
    .slice(0, MAX_ANONYMOUS_REFERENCE_IMAGES);

  return imageUrls.every(isAllowedPromptLibraryReferenceImageUrl)
    ? imageUrls
    : null;
};

const hasTrialUsedCookie = (request: Request) => {
  const cookie = request.headers.get('cookie') ?? '';
  return (
    cookie.includes(`${ANONYMOUS_TRIAL_COOKIE}=1`) ||
    cookie.includes(`${LEGACY_ANONYMOUS_TRIAL_COOKIE}=1`)
  );
};

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
  return withDbRequestContext(() => postAnonymousGenerate(request));
}

async function postAnonymousGenerate(request: Request) {
  if (hasTrialUsedCookie(request)) {
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
  const referenceImageUrls = getAnonymousReferenceImageUrls(
    inputObject.image_urls
  );
  if (hasBlockedMediaInput(inputObject) || referenceImageUrls === null) {
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
    ...(referenceImageUrls.length > 0
      ? { image_urls: referenceImageUrls }
      : {}),
  };

  try {
    const result = (
      await createImageGenerationWithFallback({
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
    const output =
      transition.publicStatus === 'succeeded' && shouldWatermarkAnonymousOutput()
        ? await watermarkAnonymousGenerationOutput({
            generationId: wmTaskId,
            output: transition.output,
          })
        : transition.output;

    return withTrialUsedCookie(
      NextResponse.json({
        success: transition.publicStatus === 'succeeded',
        status: transition.publicStatus,
        wmTaskId,
        providerTaskId,
        output,
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
