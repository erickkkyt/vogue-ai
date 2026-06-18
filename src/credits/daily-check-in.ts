import 'server-only';

import { randomUUID } from 'crypto';
import { DAILY_CHECK_IN_CREDITS } from '@/config/product-policy';
import { getDb } from '@/db';
import { creditTransaction, dailyCheckIn, userCredit } from '@/db/schema';
import { and, asc, eq, sql } from 'drizzle-orm';
import { CREDIT_TRANSACTION_TYPE } from './types';

export const DAILY_CHECK_IN_CAMPAIGN_KEY = 'daily-free-credits-v1';
export { DAILY_CHECK_IN_CREDITS };

export type DailyCheckInRewardState = {
  campaignKey: string;
  dayIndex: number;
  complete: boolean;
  available: boolean;
  creditsGranted: number;
  currentCredits: number;
};

type DailyCheckInContext = {
  userId: string;
  campaignKey: string;
  dayIndex: number;
  credits: number;
  now: Date;
};

type DailyCheckInClaimResult = {
  claimed: boolean;
  creditsGranted: number;
  currentCredits: number;
};

export type DailyCheckInStore = {
  getClaim: (context: DailyCheckInContext) => Promise<{
    creditsGranted: number;
  } | null>;
  getCurrentCredits: (userId: string) => Promise<number>;
  claim: (context: DailyCheckInContext) => Promise<DailyCheckInClaimResult>;
};

type DailyCheckInOptions = {
  store?: DailyCheckInStore;
  now?: Date;
};

export function getDailyCheckInDayIndex(now = new Date()) {
  return Math.floor(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()) /
      86_400_000
  );
}

function createState({
  campaignKey,
  dayIndex,
  creditsGranted,
  currentCredits,
}: {
  campaignKey: string;
  dayIndex: number;
  creditsGranted: number;
  currentCredits: number;
}): DailyCheckInRewardState {
  const complete = creditsGranted > 0;
  return {
    campaignKey,
    dayIndex,
    complete,
    available: !complete,
    creditsGranted,
    currentCredits,
  };
}

function resolveContext(userId: string, options: DailyCheckInOptions = {}) {
  if (!userId) throw new Error('Invalid user id');

  const now = options.now ?? new Date();
  return {
    userId,
    campaignKey: DAILY_CHECK_IN_CAMPAIGN_KEY,
    dayIndex: getDailyCheckInDayIndex(now),
    credits: DAILY_CHECK_IN_CREDITS,
    now,
    store: options.store ?? createDrizzleDailyCheckInStore(),
  };
}

export function createInMemoryDailyCheckInStore(): DailyCheckInStore {
  const claims = new Map<string, number>();
  const credits = new Map<string, number>();
  const keyFor = ({ userId, campaignKey, dayIndex }: DailyCheckInContext) =>
    `${userId}:${campaignKey}:${dayIndex}`;

  return {
    async getClaim(context) {
      const creditsGranted = claims.get(keyFor(context));
      return typeof creditsGranted === 'number' ? { creditsGranted } : null;
    },
    async getCurrentCredits(userId) {
      return credits.get(userId) ?? 0;
    },
    async claim(context) {
      const key = keyFor(context);
      const existing = claims.get(key);
      if (typeof existing === 'number') {
        return {
          claimed: false,
          creditsGranted: existing,
          currentCredits: credits.get(context.userId) ?? 0,
        };
      }

      const currentCredits = (credits.get(context.userId) ?? 0) + context.credits;
      credits.set(context.userId, currentCredits);
      claims.set(key, context.credits);
      return {
        claimed: true,
        creditsGranted: context.credits,
        currentCredits,
      };
    },
  };
}

export function createDrizzleDailyCheckInStore(): DailyCheckInStore {
  return {
    async getClaim({ userId, campaignKey, dayIndex }) {
      const db = await getDb();
      const rows = await db
        .select({ creditsGranted: dailyCheckIn.creditsGranted })
        .from(dailyCheckIn)
        .where(
          and(
            eq(dailyCheckIn.userId, userId),
            eq(dailyCheckIn.campaignKey, campaignKey),
            eq(dailyCheckIn.dayIndex, dayIndex)
          )
        )
        .limit(1);

      return rows[0] ?? null;
    },
    async getCurrentCredits(userId) {
      const db = await getDb();
      const rows = await db
        .select({ currentCredits: userCredit.currentCredits })
        .from(userCredit)
        .where(eq(userCredit.userId, userId))
        .limit(1);
      return rows[0]?.currentCredits ?? 0;
    },
    async claim(context) {
      const db = await getDb();
      return await db.transaction(async (tx) => {
        await tx.execute(
          sql`SELECT pg_advisory_xact_lock(hashtext(${context.userId}))`
        );

        const existingClaim = await tx
          .select({ creditsGranted: dailyCheckIn.creditsGranted })
          .from(dailyCheckIn)
          .where(
            and(
              eq(dailyCheckIn.userId, context.userId),
              eq(dailyCheckIn.campaignKey, context.campaignKey),
              eq(dailyCheckIn.dayIndex, context.dayIndex)
            )
          )
          .limit(1);

        const creditRows = await tx
          .select({
            id: userCredit.id,
            currentCredits: userCredit.currentCredits,
          })
          .from(userCredit)
          .where(eq(userCredit.userId, context.userId))
          .orderBy(asc(userCredit.createdAt));
        const currentCredits = creditRows[0]?.currentCredits ?? 0;

        if (existingClaim[0]) {
          return {
            claimed: false,
            creditsGranted: existingClaim[0].creditsGranted,
            currentCredits,
          };
        }

        const nextCredits = currentCredits + context.credits;
        const claimId = randomUUID();
        const referenceId = `${context.userId}:${context.campaignKey}:${context.dayIndex}`;

        if (creditRows[0]) {
          await tx
            .update(userCredit)
            .set({
              currentCredits: nextCredits,
              updatedAt: context.now,
            })
            .where(eq(userCredit.id, creditRows[0].id));
        } else {
          await tx.insert(userCredit).values({
            id: randomUUID(),
            userId: context.userId,
            currentCredits: nextCredits,
            createdAt: context.now,
            updatedAt: context.now,
          });
        }

        await tx.insert(dailyCheckIn).values({
          id: claimId,
          userId: context.userId,
          campaignKey: context.campaignKey,
          dayIndex: context.dayIndex,
          creditsGranted: context.credits,
          checkedInAt: context.now,
          createdAt: context.now,
          updatedAt: context.now,
        });

        await tx.insert(creditTransaction).values({
          id: randomUUID(),
          userId: context.userId,
          type: CREDIT_TRANSACTION_TYPE.DAILY_CHECK_IN,
          amount: context.credits,
          remainingAmount: context.credits,
          description: 'Daily free credits',
          referenceType: 'daily_check_in',
          referenceId,
          createdAt: context.now,
          updatedAt: context.now,
        });

        return {
          claimed: true,
          creditsGranted: context.credits,
          currentCredits: nextCredits,
        };
      });
    },
  };
}

export async function getDailyCheckInRewardState(
  userId: string,
  options: DailyCheckInOptions = {}
): Promise<DailyCheckInRewardState> {
  const context = resolveContext(userId, options);
  const claim = await context.store.getClaim(context);
  const currentCredits = await context.store.getCurrentCredits(userId);

  return createState({
    campaignKey: context.campaignKey,
    dayIndex: context.dayIndex,
    creditsGranted: claim?.creditsGranted ?? 0,
    currentCredits,
  });
}

export async function claimDailyCheckInReward(
  userId: string,
  options: DailyCheckInOptions = {}
) {
  const context = resolveContext(userId, options);
  const result = await context.store.claim(context);
  if (!result.claimed) throw new Error('cooldown');

  return createState({
    campaignKey: context.campaignKey,
    dayIndex: context.dayIndex,
    creditsGranted: result.creditsGranted,
    currentCredits: result.currentCredits,
  });
}
