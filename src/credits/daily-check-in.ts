import 'server-only';

export type DailyCheckInRewardState = {
  campaignKey: string;
  dayIndex: number;
  complete: boolean;
  available: boolean;
  creditsGranted: number;
};

const DEFAULT_STATE: DailyCheckInRewardState = {
  campaignKey: 'default',
  dayIndex: 0,
  complete: false,
  available: false,
  creditsGranted: 0,
};

export async function getDailyCheckInRewardState(
  _userId: string
): Promise<DailyCheckInRewardState> {
  return DEFAULT_STATE;
}

export async function claimDailyCheckInReward(_userId: string) {
  throw new Error('daily_check_in_db_not_ready');
}

