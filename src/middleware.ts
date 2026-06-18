import createMiddleware from 'next-intl/middleware';
import { NextRequest, type NextRequest as NextRequestType } from 'next/server';
import { NextResponse } from 'next/server';
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE_NAME,
  LOCALES,
  REQUEST_LOCALE_HEADER,
  routing,
} from './i18n/routing';
import { getCanonicalPromptPathFromRouteSlug } from './lib/prompt-page-route-map';

const intlMiddleware = createMiddleware(routing);

type SupportedLocale = (typeof LOCALES)[number];

const defaultLocaleStandalonePaths = new Set([
  '/app',
  '/login',
  '/auth/error',
  '/auth/forgot-password',
  '/auth/login',
  '/auth/register',
  '/auth/reset-password',
  '/payment/return',
]);

const singleLanguageCanonicalPaths = new Set([
  '/free-ai-image-generator',
  '/meigen-alternative',
  '/ai-image-prompt',
  '/gpt-image-prompt',
  '/nano-banana-prompt',
  '/midjourney-prompt',
  '/privacy-policy',
  '/terms-of-service',
]);

const retiredNonPromptPaths = new Set([
  '/effect',
  '/model',
  '/earth-zoom',
  '/effect/earth-zoom',
  '/seedance',
  '/ai-baby-podcast',
  '/lipsync',
  '/hailuo-ai-video-generator',
  '/veo-3-generator',
  '/ai-baby-generator',
]);

function normalizePath(pathname: string) {
  return pathname.length > 1 && pathname.endsWith('/')
    ? pathname.slice(0, -1)
    : pathname;
}

function isSupportedLocale(
  value: string | null | undefined
): value is SupportedLocale {
  return LOCALES.includes(value as (typeof LOCALES)[number]);
}

function getPathLocale(pathname: string) {
  const firstSegment = pathname.split('/').filter(Boolean)[0];

  return isSupportedLocale(firstSegment)
    ? firstSegment
    : null;
}

function getAcceptedLocale(acceptLanguage: string | null) {
  if (!acceptLanguage) return null;

  for (const part of acceptLanguage.split(',')) {
    const locale = part.trim().split(';')[0]?.split('-')[0]?.toLowerCase();

    if (isSupportedLocale(locale)) {
      return locale;
    }
  }

  return null;
}

function getRequestLocale(request: NextRequestType) {
  return (
    getPathLocale(request.nextUrl.pathname) ??
    (isSupportedLocale(request.cookies.get(LOCALE_COOKIE_NAME)?.value)
      ? request.cookies.get(LOCALE_COOKIE_NAME)?.value
      : null) ??
    getAcceptedLocale(request.headers.get('accept-language')) ??
    DEFAULT_LOCALE
  );
}

function getLocalizedRequestHeaders(request: NextRequestType) {
  const requestHeaders = new Headers(request.headers);

  requestHeaders.set(REQUEST_LOCALE_HEADER, getRequestLocale(request));

  return requestHeaders;
}

function nextWithLocale(request: NextRequestType) {
  return NextResponse.next({
    request: {
      headers: getLocalizedRequestHeaders(request),
    },
  });
}

function getIntlRequestWithLocale(request: NextRequestType) {
  return new NextRequest(request.url, {
    headers: getLocalizedRequestHeaders(request),
    method: request.method,
  });
}

function isPromptDetailPath(pathname: string) {
  const segments = pathname.split('/').filter(Boolean);

  return segments[0] === 'prompt' && segments.length >= 2;
}

function isPublicHomePath(pathname: string) {
  if (pathname === '/') return true;

  return LOCALES.some((locale) => pathname === `/${locale}`);
}

function isDefaultLocaleBlogPath(pathname: string) {
  const normalizedPath = normalizePath(pathname);

  return normalizedPath === '/blog' || normalizedPath.startsWith('/blog/');
}

function getDefaultLocaleHomeRedirect(pathname: string) {
  return pathname === `/${DEFAULT_LOCALE}` ? '/' : null;
}

function getPromptDetailRedirect(pathname: string) {
  const segments = pathname.split('/').filter(Boolean);
  const [firstSegment, ...rest] = segments;
  const hasLocalePrefix = LOCALES.includes(
    firstSegment as (typeof LOCALES)[number]
  );
  const promptSegments = hasLocalePrefix ? rest : segments;

  if (promptSegments[0] !== 'prompt' || promptSegments.length < 2) return null;

  const unlocalizedPath = `/${promptSegments.join('/')}`;
  const canonicalPromptPath =
    getCanonicalPromptPathFromRouteSlug(promptSegments[1]) ?? unlocalizedPath;

  if (hasLocalePrefix) return canonicalPromptPath;

  return canonicalPromptPath === pathname ? null : canonicalPromptPath;
}

function getSingleLanguageRedirect(pathname: string) {
  const segments = pathname.split('/').filter(Boolean);
  const [locale, ...rest] = segments;

  if (!LOCALES.includes(locale as (typeof LOCALES)[number])) return null;

  const unlocalizedPath = `/${rest.join('/')}`;

  return singleLanguageCanonicalPaths.has(unlocalizedPath)
    ? unlocalizedPath
    : null;
}

function getUnlocalizedPath(pathname: string) {
  const segments = pathname.split('/').filter(Boolean);
  const [locale, ...rest] = segments;
  const unlocalizedPath = LOCALES.includes(locale as (typeof LOCALES)[number])
    ? `/${rest.join('/')}`
    : pathname;

  return normalizePath(unlocalizedPath);
}

function isRetiredNonPromptPath(pathname: string) {
  return retiredNonPromptPaths.has(getUnlocalizedPath(pathname));
}

export function middleware(request: NextRequest) {
  if (isRetiredNonPromptPath(request.nextUrl.pathname)) {
    return new NextResponse(null, { status: 410, statusText: 'Gone' });
  }

  const promptDetailRedirect = getPromptDetailRedirect(
    request.nextUrl.pathname
  );

  if (promptDetailRedirect) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = promptDetailRedirect;

    return NextResponse.redirect(redirectUrl, 301);
  }

  const defaultLocaleHomeRedirect = getDefaultLocaleHomeRedirect(
    request.nextUrl.pathname
  );

  if (defaultLocaleHomeRedirect) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = defaultLocaleHomeRedirect;

    return NextResponse.redirect(redirectUrl, 301);
  }

  const singleLanguageRedirect = getSingleLanguageRedirect(
    request.nextUrl.pathname
  );

  if (singleLanguageRedirect) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = singleLanguageRedirect;

    return NextResponse.redirect(redirectUrl, 301);
  }

  if (isPublicHomePath(request.nextUrl.pathname)) {
    return nextWithLocale(request);
  }

  if (isDefaultLocaleBlogPath(request.nextUrl.pathname)) {
    return nextWithLocale(request);
  }

  if (isPromptDetailPath(request.nextUrl.pathname)) {
    return nextWithLocale(request);
  }

  if (singleLanguageCanonicalPaths.has(request.nextUrl.pathname)) {
    return nextWithLocale(request);
  }

  if (defaultLocaleStandalonePaths.has(request.nextUrl.pathname)) {
    return nextWithLocale(request);
  }

  return intlMiddleware(getIntlRequestWithLocale(request));
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
