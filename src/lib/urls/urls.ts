import type { Locale } from 'next-intl';

const LOCAL_BASE_URL = 'http://localhost:3000';
const PRODUCTION_BASE_URL = 'https://vogueai.net';
const LOCALES = ['en', 'zh', 'fr', 'ru', 'pt', 'ja', 'ko'] as const;

function trimTrailingSlash(value: string) {
  return value.endsWith('/') ? value.slice(0, -1) : value;
}

export function getBaseUrl() {
  if (typeof window !== 'undefined') return window.location.origin;

  return getConfiguredBaseUrl();
}

export function getConfiguredBaseUrl() {
  return trimTrailingSlash(
    process.env.NEXT_PUBLIC_BASE_URL ||
      process.env.VERCEL_URL?.replace(/^/, 'https://') ||
      LOCAL_BASE_URL
  );
}

function isLocalBaseUrl(value: string) {
  return /^https?:\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0)(:\d+)?$/i.test(
    value
  );
}

function getSeoBaseUrl() {
  const configuredBaseUrl = getConfiguredBaseUrl();
  return isLocalBaseUrl(configuredBaseUrl)
    ? PRODUCTION_BASE_URL
    : configuredBaseUrl;
}

export function getUrlWithLocale(pathname: string, locale?: Locale | string) {
  if (!pathname.startsWith('/')) return pathname;
  if (!locale || locale === 'en') return pathname;
  if (!LOCALES.includes(locale as (typeof LOCALES)[number])) return pathname;
  if (pathname === '/') return `/${locale}`;
  if (pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`) {
    return pathname;
  }

  return `/${locale}${pathname}`;
}

export function getLocalePrefixFromPathname(pathname?: string | null) {
  const firstSegment = pathname?.split('/').filter(Boolean)[0];

  return firstSegment &&
    LOCALES.includes(firstSegment as (typeof LOCALES)[number])
    ? `/${firstSegment}`
    : '';
}

export function getUnlocalizedPathname(pathname: string) {
  const segments = pathname.split('/').filter(Boolean);

  if (
    segments[0] &&
    LOCALES.includes(segments[0] as (typeof LOCALES)[number])
  ) {
    const rest = segments.slice(1).join('/');
    return rest ? `/${rest}` : '/';
  }

  return pathname || '/';
}

export function getAbsoluteUrlWithLocale(
  pathname: string,
  locale?: Locale | string,
  baseUrl = getConfiguredBaseUrl()
) {
  return `${baseUrl}${getUrlWithLocale(pathname, locale)}`;
}

export function getLanguageAlternates(pathname: string) {
  const seoBaseUrl = getSeoBaseUrl();
  return {
    ...Object.fromEntries(
      LOCALES.map((locale) => [
        locale,
        getAbsoluteUrlWithLocale(pathname, locale, seoBaseUrl),
      ])
    ),
    'x-default': getAbsoluteUrlWithLocale(pathname, 'en', seoBaseUrl),
  };
}

export function getUrlWithLocaleInCallbackUrl(
  url: string,
  locale?: Locale | string
) {
  const baseUrl = getConfiguredBaseUrl();

  if (!url.startsWith(baseUrl)) return url;

  const parsed = new URL(url);
  const callbackUrl = parsed.searchParams.get('callbackURL');
  if (!callbackUrl) return url;

  parsed.searchParams.set('callbackURL', getUrlWithLocale(callbackUrl, locale));

  return parsed.toString();
}
