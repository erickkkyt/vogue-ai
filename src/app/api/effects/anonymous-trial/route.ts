import { NextResponse } from 'next/server';

const ANONYMOUS_TRIAL_COOKIE = 'vogue_anonymous_trial_used';
const LEGACY_ANONYMOUS_TRIAL_COOKIE = 'gptimg_anonymous_trial_used';

export async function GET(request: Request) {
  const cookie = request.headers.get('cookie') ?? '';
  const trialUsed =
    cookie.includes(`${ANONYMOUS_TRIAL_COOKIE}=1`) ||
    cookie.includes(`${LEGACY_ANONYMOUS_TRIAL_COOKIE}=1`);

  return NextResponse.json({
    trialUsed,
    trialRemaining: trialUsed ? 0 : 1,
  });
}
