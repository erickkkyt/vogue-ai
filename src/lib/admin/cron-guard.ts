import { timingSafeEqual } from 'crypto';
import { NextResponse } from 'next/server';

export type CronSecretValidationInput = {
  configuredSecret: string | null | undefined;
  authorization: string | null | undefined;
  headerSecret: string | null | undefined;
  querySecret?: string | null | undefined;
};

type CronSecretValidationResult =
  | { ok: true }
  | { ok: false; status: 401 | 503; error: string };

const toBuffer = (value: string) => Buffer.from(value, 'utf8');

const safeEqual = (provided: string, expected: string) => {
  const providedBuffer = toBuffer(provided);
  const expectedBuffer = toBuffer(expected);
  return (
    providedBuffer.length === expectedBuffer.length &&
    timingSafeEqual(providedBuffer, expectedBuffer)
  );
};

const extractBearerToken = (authorization: string | null | undefined) => {
  const match = authorization?.match(/^Bearer\s+(.+)$/i);
  return match?.[1]?.trim() || null;
};

export function validateCronRequestSecret({
  configuredSecret,
  authorization,
  headerSecret,
}: CronSecretValidationInput): CronSecretValidationResult {
  const secret = configuredSecret?.trim();
  if (!secret) {
    return {
      ok: false,
      status: 503,
      error: 'Cron secret is not configured.',
    };
  }

  const candidates = [extractBearerToken(authorization), headerSecret?.trim()]
    .filter((value): value is string => Boolean(value));
  if (candidates.some((candidate) => safeEqual(candidate, secret))) {
    return { ok: true };
  }

  return {
    ok: false,
    status: 401,
    error: 'Unauthorized cron request.',
  };
}

export const getConfiguredCronSecret = (
  env: Record<string, string | undefined> = process.env
) => env.CRON_SECRET || env.VOGUE_CRON_SECRET || null;

export function requireCronRequest(
  request: Request,
  env: Record<string, string | undefined> = process.env
) {
  return validateCronRequestSecret({
    configuredSecret: getConfiguredCronSecret(env),
    authorization: request.headers.get('authorization'),
    headerSecret: request.headers.get('x-cron-secret'),
  });
}

export function cronGuardErrorResponse(
  result: Exclude<CronSecretValidationResult, { ok: true }>
) {
  const publicError =
    result.status === 503 ? 'Cron endpoint unavailable.' : result.error;
  return NextResponse.json({ error: publicError }, { status: result.status });
}
