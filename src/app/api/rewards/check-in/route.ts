import {
  claimDailyCheckInReward,
  getDailyCheckInRewardState,
} from '@/credits/daily-check-in';
import { getSession } from '@/lib/server';
import { NextResponse } from 'next/server';

export async function GET() {
  const session = await getSession();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const state = await getDailyCheckInRewardState(session.user.id);
  return NextResponse.json(state);
}

export async function POST() {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const state = await claimDailyCheckInReward(session.user.id);
    return NextResponse.json(state);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'cooldown' || error.message === 'complete') {
        return NextResponse.json({ error: error.message }, { status: 409 });
      }
    }
    throw error;
  }
}
