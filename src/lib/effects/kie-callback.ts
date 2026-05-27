export function resolveKieCallbackUrl() {
  const explicitCallbackUrl = process.env.KIE_CALLBACK_URL?.trim();
  if (explicitCallbackUrl) return explicitCallbackUrl;

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    'http://localhost:3000';

  return `${baseUrl.replace(/\/+$/, '')}/api/effects/callback`;
}
