const DEFAULT_CALLBACK_PATH = '/app';
const BASE_ORIGIN = 'https://vogueai.net';
const CONTROL_CHARACTER_PATTERN = /[\u0000-\u001F\u007F]/;

const isSafeRelativePath = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed.startsWith('/') || trimmed.startsWith('//')) return false;
  if (trimmed.includes('\\') || CONTROL_CHARACTER_PATTERN.test(trimmed)) {
    return false;
  }

  try {
    const decodedPrefix = decodeURIComponent(trimmed.slice(0, 24));
    if (decodedPrefix.startsWith('//') || decodedPrefix.includes('\\')) {
      return false;
    }
  } catch {
    return false;
  }

  try {
    const parsed = new URL(trimmed, BASE_ORIGIN);
    return parsed.origin === BASE_ORIGIN && parsed.pathname.startsWith('/');
  } catch {
    return false;
  }
};

export function resolveSafeCallbackPath(
  value: string | null | undefined,
  fallback = DEFAULT_CALLBACK_PATH
) {
  const safeFallback = isSafeRelativePath(fallback)
    ? fallback.trim()
    : DEFAULT_CALLBACK_PATH;
  if (!value) return safeFallback;

  const trimmed = value.trim();
  if (!isSafeRelativePath(trimmed)) return safeFallback;

  const parsed = new URL(trimmed, BASE_ORIGIN);
  return `${parsed.pathname}${parsed.search}${parsed.hash}`;
}
