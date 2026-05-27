import { getAnonymousTrialAvailability } from '@/lib/effects/anonymous-trial-quota';
import { NextResponse } from 'next/server';

const ANONYMOUS_TRIAL_COOKIE = 'gptimg_anonymous_trial_used';

export async function GET(request: Request) {
  const trialUsed = request.headers
    .get('cookie')
    ?.includes(`${ANONYMOUS_TRIAL_COOKIE}=1`);
  if (trialUsed) {
    return NextResponse.json({
      trialUsed: true,
      trialRemaining: 0,
    });
  }

  const quota = await getAnonymousTrialAvailability(request).catch((error) => {
    console.error('effects.anonymous-trial quota error:', error);
    return null;
  });
  if (!quota) {
    return NextResponse.json({
      trialUsed: true,
      trialRemaining: 0,
      unavailable: true,
    });
  }

  return NextResponse.json({
    trialUsed: !quota.allowed,
    trialRemaining: quota.remaining,
  });
}
