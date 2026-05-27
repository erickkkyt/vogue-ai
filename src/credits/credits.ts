import { randomUUID } from 'crypto';
import { REGISTER_GIFT_CREDITS_AMOUNT } from '@/config/product-policy';
import { getDb } from '@/db';
import { creditTransaction, userCredit } from '@/db/schema';
import { and, asc, eq, or, sql } from 'drizzle-orm';
import {
  CREDIT_TRANSACTION_TYPE,
  type CreditReferenceType,
  type CreditTransactionType,
} from './types';

type AddCreditsParams = {
  userId: string;
  amount: number;
  type: CreditTransactionType;
  description: string;
  planId?: string;
  priceId?: string;
  subscriptionId?: string;
  referenceType?: CreditReferenceType;
  referenceId?: string;
};

type ReserveCreditsParams = {
  userId: string;
  amount: number;
  description: string;
  referenceId: string;
};

const now = () => new Date();

export function getRegisterGiftCreditsAmount() {
  return REGISTER_GIFT_CREDITS_AMOUNT;
}

export async function getUserCredits(userId: string) {
  const db = await getDb();
  const rows = await db
    .select({ currentCredits: userCredit.currentCredits })
    .from(userCredit)
    .where(eq(userCredit.userId, userId))
    .limit(1);

  return rows[0]?.currentCredits ?? 0;
}

export async function addRegisterGiftCredits(userId: string) {
  const amount = getRegisterGiftCreditsAmount();
  if (!Number.isFinite(amount) || amount <= 0) return;

  await addCredits({
    userId,
    amount,
    type: CREDIT_TRANSACTION_TYPE.REGISTER_GIFT,
    description: 'Welcome credits',
    referenceType: 'register',
    referenceId: userId,
  });
}

export async function addCredits({
  userId,
  amount,
  type,
  description,
  planId,
  priceId,
  subscriptionId,
  referenceType,
  referenceId,
}: AddCreditsParams) {
  if (!userId || !description) throw new Error('Invalid credit params');
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error('Credit amount must be positive');
  }
  if (!!referenceType !== !!referenceId) {
    throw new Error('referenceType and referenceId must be provided together');
  }

  const db = await getDb();
  await db.transaction(async (tx) => {
    await tx.execute(sql`SELECT pg_advisory_xact_lock(hashtext(${userId}))`);

    if (referenceType && referenceId) {
      const existing = await tx
        .select({ id: creditTransaction.id })
        .from(creditTransaction)
        .where(
          and(
            eq(creditTransaction.type, type),
            eq(creditTransaction.referenceType, referenceType),
            eq(creditTransaction.referenceId, referenceId)
          )
        )
        .limit(1);
      if (existing.length > 0) return;
    }

    const creditRows = await tx
      .select({
        id: userCredit.id,
        currentCredits: userCredit.currentCredits,
      })
      .from(userCredit)
      .where(eq(userCredit.userId, userId))
      .orderBy(asc(userCredit.createdAt));

    const stamp = now();
    if (creditRows.length === 0) {
      await tx.insert(userCredit).values({
        id: randomUUID(),
        userId,
        currentCredits: amount,
        createdAt: stamp,
        updatedAt: stamp,
      });
    } else {
      await tx
        .update(userCredit)
        .set({
          currentCredits: creditRows[0].currentCredits + amount,
          updatedAt: stamp,
        })
        .where(eq(userCredit.id, creditRows[0].id));
    }

    await tx.insert(creditTransaction).values({
      id: randomUUID(),
      userId,
      type,
      amount,
      remainingAmount: amount,
      description,
      planId,
      priceId,
      subscriptionId,
      referenceType,
      referenceId,
      createdAt: stamp,
      updatedAt: stamp,
    });
  });
}

export async function reserveCredits({
  userId,
  amount,
  description,
  referenceId,
}: ReserveCreditsParams) {
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error('Invalid reserve amount');
  }

  const db = await getDb();
  await db.transaction(async (tx) => {
    await tx.execute(sql`SELECT pg_advisory_xact_lock(hashtext(${userId}))`);

    const existing = await tx
      .select({ type: creditTransaction.type })
      .from(creditTransaction)
      .where(
        and(
          eq(creditTransaction.referenceType, 'generation'),
          eq(creditTransaction.referenceId, referenceId)
        )
      );
    if (
      existing.some((row) =>
        [
          CREDIT_TRANSACTION_TYPE.RESERVE,
          CREDIT_TRANSACTION_TYPE.CONSUME,
          CREDIT_TRANSACTION_TYPE.RELEASED,
        ].includes(row.type as never)
      )
    ) {
      return;
    }

    const rows = await tx
      .select({ id: userCredit.id, currentCredits: userCredit.currentCredits })
      .from(userCredit)
      .where(eq(userCredit.userId, userId))
      .limit(1);
    const current = rows[0]?.currentCredits ?? 0;
    if (!rows[0] || current < amount) {
      throw new Error('Insufficient credits');
    }

    const stamp = now();
    await tx
      .update(userCredit)
      .set({ currentCredits: current - amount, updatedAt: stamp })
      .where(eq(userCredit.id, rows[0].id));
    await tx.insert(creditTransaction).values({
      id: randomUUID(),
      userId,
      type: CREDIT_TRANSACTION_TYPE.RESERVE,
      amount: -amount,
      remainingAmount: null,
      description,
      referenceType: 'generation',
      referenceId,
      createdAt: stamp,
      updatedAt: stamp,
    });
  });
}

export async function confirmReservedCredits({
  userId,
  description,
  referenceId,
}: {
  userId: string;
  description: string;
  referenceId: string;
}) {
  const db = await getDb();
  await db
    .update(creditTransaction)
    .set({
      type: CREDIT_TRANSACTION_TYPE.CONSUME,
      description,
      updatedAt: now(),
    })
    .where(
      and(
        eq(creditTransaction.userId, userId),
        eq(creditTransaction.type, CREDIT_TRANSACTION_TYPE.RESERVE),
        eq(creditTransaction.referenceType, 'generation'),
        eq(creditTransaction.referenceId, referenceId)
      )
    );
}

export async function refundCredits({
  userId,
  amount,
  description,
  referenceId,
}: {
  userId: string;
  amount: number;
  description: string;
  referenceId: string;
}) {
  await addCredits({
    userId,
    amount,
    type: CREDIT_TRANSACTION_TYPE.REFUND,
    description,
    referenceType: 'generation',
    referenceId,
  });
}

export async function releaseReservedCredits({
  userId,
  referenceId,
  description,
}: {
  userId: string;
  referenceId: string;
  description: string;
}) {
  const db = await getDb();
  await db.transaction(async (tx) => {
    await tx.execute(sql`SELECT pg_advisory_xact_lock(hashtext(${userId}))`);

    const reserves = await tx
      .select({ id: creditTransaction.id, amount: creditTransaction.amount })
      .from(creditTransaction)
      .where(
        and(
          eq(creditTransaction.userId, userId),
          or(
            eq(creditTransaction.type, CREDIT_TRANSACTION_TYPE.RESERVE),
            eq(creditTransaction.type, CREDIT_TRANSACTION_TYPE.CONSUME)
          ),
          eq(creditTransaction.referenceType, 'generation'),
          eq(creditTransaction.referenceId, referenceId)
        )
      )
      .limit(1);
    const reserve = reserves[0];
    if (!reserve) return;

    const refundAmount = Math.abs(reserve.amount);
    const rows = await tx
      .select({ id: userCredit.id, currentCredits: userCredit.currentCredits })
      .from(userCredit)
      .where(eq(userCredit.userId, userId))
      .limit(1);
    const stamp = now();

    if (rows[0]) {
      await tx
        .update(userCredit)
        .set({
          currentCredits: rows[0].currentCredits + refundAmount,
          updatedAt: stamp,
        })
        .where(eq(userCredit.id, rows[0].id));
    }

    await tx
      .update(creditTransaction)
      .set({ type: CREDIT_TRANSACTION_TYPE.RELEASED, updatedAt: stamp })
      .where(eq(creditTransaction.id, reserve.id));

    await tx.insert(creditTransaction).values({
      id: randomUUID(),
      userId,
      type: CREDIT_TRANSACTION_TYPE.REFUND,
      amount: refundAmount,
      remainingAmount: refundAmount,
      description,
      referenceType: 'generation',
      referenceId,
      createdAt: stamp,
      updatedAt: stamp,
    });
  });
}
