import 'server-only';

import { getDb } from '@/db';
import { payment } from '@/db/schema';
import { PaymentScenes } from '@/payment/types';
import { and, desc, eq } from 'drizzle-orm';
import type { GenerationAccessTier } from './generation-access';

const STANDARD_SUBSCRIPTION_INACTIVE_STATUSES = new Set([
  'canceled',
  'expired',
  'failed',
  'incomplete_expired',
  'unpaid',
]);

export const getUserGenerationAccessTier = async (
  userId: string
): Promise<GenerationAccessTier> => {
  try {
    const db = await getDb();
    const rows = await db
      .select({
        status: payment.status,
        paid: payment.paid,
        periodEnd: payment.periodEnd,
      })
      .from(payment)
      .where(
        and(
          eq(payment.userId, userId),
          eq(payment.scene, PaymentScenes.SUBSCRIPTION),
          eq(payment.paid, true)
        )
      )
      .orderBy(desc(payment.createdAt))
      .limit(1);

    const subscription = rows[0];
    if (
      subscription?.paid &&
      !STANDARD_SUBSCRIPTION_INACTIVE_STATUSES.has(
        subscription.status.trim().toLowerCase()
      ) &&
      (!subscription.periodEnd || subscription.periodEnd.getTime() > Date.now())
    ) {
      return 'faster';
    }
  } catch (error) {
    console.error('getUserGenerationAccessTier error:', error);
  }

  return 'standard';
};

export const getUserHasPaidGenerationEntitlement = async (userId: string) => {
  try {
    const db = await getDb();
    const rows = await db
      .select({ id: payment.id })
      .from(payment)
      .where(and(eq(payment.userId, userId), eq(payment.paid, true)))
      .limit(1);

    return rows.length > 0;
  } catch (error) {
    console.error('getUserHasPaidGenerationEntitlement error:', error);
  }

  return false;
};
