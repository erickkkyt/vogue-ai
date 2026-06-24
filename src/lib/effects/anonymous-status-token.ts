import { createHmac, randomUUID, timingSafeEqual } from 'crypto';

export type AnonymousStatusTokenPayload = {
  version: 1;
  effectId: number;
  wmTaskId: string;
  providerTaskId: string;
  selectedProvider?: string | null;
  issuedAt: number;
  expiresAt: number;
  nonce: string;
};

type AnonymousStatusTokenOptions = {
  now?: number;
  ttlMs?: number;
  secret?: string;
};

type VerifyAnonymousStatusTokenOptions = AnonymousStatusTokenOptions & {
  expectedEffectId?: number;
};

const DEFAULT_STATUS_TOKEN_TTL_MS = 60 * 60 * 1000;
const MIN_STATUS_TOKEN_TTL_MS = 60 * 1000;
const MAX_STATUS_TOKEN_TTL_MS = 24 * 60 * 60 * 1000;

const encodeBase64Url = (value: string) =>
  Buffer.from(value)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');

const decodeBase64Url = (value: string) => {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const padding = normalized.length % 4;
  const padded =
    padding === 0 ? normalized : `${normalized}${'='.repeat(4 - padding)}`;
  return Buffer.from(padded, 'base64').toString('utf8');
};

const readOptionalString = (value: unknown) =>
  typeof value === 'string' && value ? value : null;

export function normalizeAnonymousStatusTokenTtlMs(value?: number | string) {
  const parsed =
    typeof value === 'number' ? value : Number.parseInt(value ?? '', 10) * 1000;
  if (!Number.isFinite(parsed)) return DEFAULT_STATUS_TOKEN_TTL_MS;
  return Math.min(
    Math.max(Math.floor(parsed), MIN_STATUS_TOKEN_TTL_MS),
    MAX_STATUS_TOKEN_TTL_MS
  );
}

export function resolveAnonymousStatusTokenSecret(
  env: Record<string, string | undefined> = process.env
) {
  const secret =
    env.ANONYMOUS_STATUS_SECRET ||
    env.ANONYMOUS_TRIAL_SECRET ||
    env.BETTER_AUTH_SECRET;
  if (!secret?.trim()) {
    throw new Error(
      'ANONYMOUS_STATUS_SECRET, ANONYMOUS_TRIAL_SECRET, or BETTER_AUTH_SECRET is required'
    );
  }
  return secret;
}

const signEncodedPayload = (encodedPayload: string, secret: string) =>
  encodeBase64Url(
    createHmac('sha256', secret).update(encodedPayload).digest('base64')
  );

const isValidPayload = (
  value: unknown
): value is AnonymousStatusTokenPayload => {
  if (!value || typeof value !== 'object') return false;
  const payload = value as Record<string, unknown>;
  return (
    payload.version === 1 &&
    typeof payload.effectId === 'number' &&
    Number.isFinite(payload.effectId) &&
    typeof payload.wmTaskId === 'string' &&
    payload.wmTaskId.length > 0 &&
    typeof payload.providerTaskId === 'string' &&
    payload.providerTaskId.length > 0 &&
    (payload.selectedProvider === undefined ||
      payload.selectedProvider === null ||
      typeof payload.selectedProvider === 'string') &&
    typeof payload.issuedAt === 'number' &&
    Number.isFinite(payload.issuedAt) &&
    typeof payload.expiresAt === 'number' &&
    Number.isFinite(payload.expiresAt) &&
    typeof payload.nonce === 'string' &&
    payload.nonce.length > 0
  );
};

export function createAnonymousStatusToken({
  effectId,
  wmTaskId,
  providerTaskId,
  selectedProvider,
  now = Date.now(),
  ttlMs = normalizeAnonymousStatusTokenTtlMs(
    process.env.ANONYMOUS_STATUS_TOKEN_TTL_SECONDS
  ),
  secret = resolveAnonymousStatusTokenSecret(),
}: {
  effectId: number;
  wmTaskId: string;
  providerTaskId: string;
  selectedProvider?: string | null;
} & AnonymousStatusTokenOptions) {
  const payload: AnonymousStatusTokenPayload = {
    version: 1,
    effectId,
    wmTaskId,
    providerTaskId,
    selectedProvider: readOptionalString(selectedProvider),
    issuedAt: now,
    expiresAt: now + ttlMs,
    nonce: randomUUID(),
  };
  const encodedPayload = encodeBase64Url(JSON.stringify(payload));
  const signature = signEncodedPayload(encodedPayload, secret);
  return `${encodedPayload}.${signature}`;
}

export function verifyAnonymousStatusToken({
  token,
  expectedEffectId,
  now = Date.now(),
  secret = resolveAnonymousStatusTokenSecret(),
}: {
  token: string;
} & VerifyAnonymousStatusTokenOptions) {
  const parts = token.split('.');
  if (parts.length !== 2) {
    throw new Error('Invalid anonymous status token');
  }

  const [encodedPayload, encodedSignature] = parts;
  if (!encodedPayload || !encodedSignature) {
    throw new Error('Invalid anonymous status token');
  }

  const expectedSignature = signEncodedPayload(encodedPayload, secret);
  const providedSignature = Buffer.from(encodedSignature);
  const expectedSignatureBuffer = Buffer.from(expectedSignature);
  if (
    providedSignature.length !== expectedSignatureBuffer.length ||
    !timingSafeEqual(providedSignature, expectedSignatureBuffer)
  ) {
    throw new Error('Invalid anonymous status token signature');
  }

  let parsedPayload: unknown;
  try {
    parsedPayload = JSON.parse(decodeBase64Url(encodedPayload));
  } catch {
    throw new Error('Invalid anonymous status token payload');
  }

  if (!isValidPayload(parsedPayload)) {
    throw new Error('Invalid anonymous status token payload');
  }
  if (
    typeof expectedEffectId === 'number' &&
    parsedPayload.effectId !== expectedEffectId
  ) {
    throw new Error('Anonymous status token effect mismatch');
  }
  if (parsedPayload.expiresAt < now) {
    throw new Error('Anonymous status token expired');
  }

  return parsedPayload;
}
