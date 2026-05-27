import { getUserCredits } from '@/credits/credits';
import { getEffectById } from '@/lib/effects/effects';
import { estimateCreditsForEffect } from '@/lib/effects/pricing';
import {
  getGenerationPromptMaxChars,
  validateGenerationPrompt,
} from '@/lib/effects/validation';
import { getSession } from '@/lib/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const payload = (await request.json().catch(() => null)) as {
    effectId?: number;
    input?: Record<string, unknown>;
  } | null;

  if (!payload?.effectId) {
    return NextResponse.json({ error: 'effectId is required' }, { status: 400 });
  }

  const effect = await getEffectById(payload.effectId);
  if (!effect || effect.isOpen === 0) {
    return NextResponse.json({ error: 'Effect not found' }, { status: 404 });
  }

  const input = payload.input ?? {};
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

  const requiredCredits = estimateCreditsForEffect({ effect, input });
  const currentCredits = await getUserCredits(session.user.id);

  return NextResponse.json({
    ok: currentCredits >= requiredCredits,
    currentCredits,
    requiredCredits,
  });
}
