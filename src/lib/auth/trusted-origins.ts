const LOCAL_AUTH_TRUSTED_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:3026',
  'http://localhost:8787',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:3026',
  'http://127.0.0.1:8787',
] as const;

function normalizeTrustedOrigin(value: string) {
  const trimmed = value.trim().replace(/\/+$/, '');
  if (!trimmed) return null;
  if (trimmed.includes('*')) return trimmed;

  try {
    return new URL(trimmed).origin;
  } catch {
    return trimmed;
  }
}

function isLocalOrigin(value: string) {
  return /^https?:\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0)(:\d+)?$/i.test(
    value
  );
}

export function getTrustedAuthOrigins({
  configuredBaseUrl,
  env = process.env,
}: {
  configuredBaseUrl: string;
  env?: Record<string, string | undefined>;
}) {
  const configuredOrigin = normalizeTrustedOrigin(configuredBaseUrl);
  const origins = [
    configuredOrigin,
    ...(configuredOrigin && isLocalOrigin(configuredOrigin)
      ? LOCAL_AUTH_TRUSTED_ORIGINS
      : []),
    ...(env.BETTER_AUTH_TRUSTED_ORIGINS ?? '')
      .split(',')
      .map(normalizeTrustedOrigin),
  ].filter((origin): origin is string => Boolean(origin));

  return Array.from(new Set(origins));
}
