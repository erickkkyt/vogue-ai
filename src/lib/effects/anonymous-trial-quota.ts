import { createHmac, randomUUID } from 'crypto';
import { ANONYMOUS_TRIAL_LIMIT_PER_DAY } from '@/config/product-policy';
import { getDb } from '@/db';
import { anonymousTrialQuota } from '@/db/schema';
import { and, eq, sql } from 'drizzle-orm';

type ReserveStoreParams = {
  fingerprintHash: string;
  windowKey: string;
  limit: number;
  now: Date;
};

type UsageStoreParams = {
  fingerprintHash: string;
  windowKey: string;
};

export type AnonymousTrialQuotaStore = {
  reserve: (params: ReserveStoreParams) => Promise<{
    allowed: boolean;
    usedCount: number;
  }>;
  getUsage: (params: UsageStoreParams) => Promise<number>;
};

type AnonymousTrialQuotaOptions = {
  store?: AnonymousTrialQuotaStore;
  now?: Date;
  limit?: number | string;
  secret?: string;
};

export type AnonymousTrialQuotaResult = {
  allowed: boolean;
  usedCount: number;
  remaining: number;
  limit: number;
  fingerprintHash: string;
  windowKey: string;
};

const UNKNOWN_IP = 'unknown-ip';
const UNKNOWN_USER_AGENT = 'unknown-user-agent';
const UNKNOWN_LANGUAGE = 'unknown-language';

const normalizeHeaderValue = (value: string | null, fallback: string, max = 256) =>
  value?.trim().toLowerCase().replace(/\s+/g, ' ').slice(0, max) || fallback;

export function normalizeAnonymousTrialLimit(value: number | string | undefined) {
  const parsed =
    typeof value === 'number' ? value : Number.parseInt(value ?? '', 10);
  if (!Number.isFinite(parsed) || parsed < 1) return 1;
  return Math.min(Math.floor(parsed), 20);
}

export function getAnonymousTrialWindowKey(now = new Date()) {
  return now.toISOString().slice(0, 10);
}

export function resolveAnonymousTrialSecret(
  env: Record<string, string | undefined> = process.env
) {
  const secret = env.ANONYMOUS_TRIAL_SECRET || env.BETTER_AUTH_SECRET;
  if (!secret?.trim()) {
    throw new Error('ANONYMOUS_TRIAL_SECRET or BETTER_AUTH_SECRET is required');
  }
  return secret;
}

export function resolveAnonymousTrialClientIp(headers: Headers) {
  const forwardedFor = headers.get('x-forwarded-for');
  const forwardedIp = forwardedFor
    ?.split(',')
    .map((value) => value.trim())
    .find(Boolean);
  return (
    forwardedIp ||
    headers.get('cf-connecting-ip')?.trim() ||
    headers.get('x-real-ip')?.trim() ||
    UNKNOWN_IP
  );
}

export function buildAnonymousTrialFingerprintHash(
  request: Request,
  secret = resolveAnonymousTrialSecret()
) {
  const headers = request.headers;
  const fingerprint = JSON.stringify({
    ip: resolveAnonymousTrialClientIp(headers),
    userAgent: normalizeHeaderValue(
      headers.get('user-agent'),
      UNKNOWN_USER_AGENT,
      512
    ),
    language: normalizeHeaderValue(
      headers.get('accept-language'),
      UNKNOWN_LANGUAGE,
      128
    ),
  });

  return createHmac('sha256', secret).update(fingerprint).digest('hex');
}

const createQuotaResult = ({
  allowed,
  usedCount,
  limit,
  fingerprintHash,
  windowKey,
}: {
  allowed: boolean;
  usedCount: number;
  limit: number;
  fingerprintHash: string;
  windowKey: string;
}): AnonymousTrialQuotaResult => ({
  allowed,
  usedCount,
  remaining: Math.max(limit - usedCount, 0),
  limit,
  fingerprintHash,
  windowKey,
});

export function createInMemoryAnonymousTrialQuotaStore(): AnonymousTrialQuotaStore {
  const usage = new Map<string, number>();
  const keyFor = ({ fingerprintHash, windowKey }: UsageStoreParams) =>
    `${fingerprintHash}:${windowKey}`;

  return {
    async reserve(params) {
      const key = keyFor(params);
      const current = usage.get(key) ?? 0;
      if (current >= params.limit) {
        return { allowed: false, usedCount: current };
      }

      const next = current + 1;
      usage.set(key, next);
      return { allowed: true, usedCount: next };
    },
    async getUsage(params) {
      return usage.get(keyFor(params)) ?? 0;
    },
  };
}

export function createDrizzleAnonymousTrialQuotaStore(): AnonymousTrialQuotaStore {
  return {
    async reserve({ fingerprintHash, windowKey, limit, now }) {
      const db = await getDb();
      return await db.transaction(async (tx) => {
        await tx.execute(
          sql`SELECT pg_advisory_xact_lock(hashtext(${`${fingerprintHash}:${windowKey}`}))`
        );

        const rows = await tx
          .select({
            id: anonymousTrialQuota.id,
            usedCount: anonymousTrialQuota.usedCount,
          })
          .from(anonymousTrialQuota)
          .where(
            and(
              eq(anonymousTrialQuota.fingerprintHash, fingerprintHash),
              eq(anonymousTrialQuota.windowKey, windowKey)
            )
          )
          .limit(1);

        const existing = rows[0];
        if (!existing) {
          await tx.insert(anonymousTrialQuota).values({
            id: randomUUID(),
            fingerprintHash,
            windowKey,
            usedCount: 1,
            firstUsedAt: now,
            lastUsedAt: now,
          });
          return { allowed: true, usedCount: 1 };
        }

        if (existing.usedCount >= limit) {
          return { allowed: false, usedCount: existing.usedCount };
        }

        const nextUsedCount = existing.usedCount + 1;
        await tx
          .update(anonymousTrialQuota)
          .set({
            usedCount: nextUsedCount,
            lastUsedAt: now,
          })
          .where(eq(anonymousTrialQuota.id, existing.id));
        return { allowed: true, usedCount: nextUsedCount };
      });
    },
    async getUsage({ fingerprintHash, windowKey }) {
      const db = await getDb();
      const rows = await db
        .select({ usedCount: anonymousTrialQuota.usedCount })
        .from(anonymousTrialQuota)
        .where(
          and(
            eq(anonymousTrialQuota.fingerprintHash, fingerprintHash),
            eq(anonymousTrialQuota.windowKey, windowKey)
          )
        )
        .limit(1);
      return rows[0]?.usedCount ?? 0;
    },
  };
}

const resolveQuotaContext = (
  request: Request,
  options: AnonymousTrialQuotaOptions
) => {
  const now = options.now ?? new Date();
  const limit = normalizeAnonymousTrialLimit(
    options.limit ?? ANONYMOUS_TRIAL_LIMIT_PER_DAY
  );
  const fingerprintHash = buildAnonymousTrialFingerprintHash(
    request,
    options.secret ?? resolveAnonymousTrialSecret()
  );
  const windowKey = getAnonymousTrialWindowKey(now);

  return {
    now,
    limit,
    fingerprintHash,
    windowKey,
    store: options.store ?? createDrizzleAnonymousTrialQuotaStore(),
  };
};

export async function reserveAnonymousTrialQuota(
  request: Request,
  options: AnonymousTrialQuotaOptions = {}
) {
  const context = resolveQuotaContext(request, options);
  const reservation = await context.store.reserve(context);
  return createQuotaResult({
    ...reservation,
    limit: context.limit,
    fingerprintHash: context.fingerprintHash,
    windowKey: context.windowKey,
  });
}

export async function getAnonymousTrialAvailability(
  request: Request,
  options: AnonymousTrialQuotaOptions = {}
) {
  const context = resolveQuotaContext(request, options);
  const usedCount = await context.store.getUsage(context);
  return createQuotaResult({
    allowed: usedCount < context.limit,
    usedCount,
    limit: context.limit,
    fingerprintHash: context.fingerprintHash,
    windowKey: context.windowKey,
  });
}
