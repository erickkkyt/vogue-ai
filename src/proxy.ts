import createMiddleware from 'next-intl/middleware';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { LOCALES, routing } from './i18n/routing';
import { getCanonicalPromptPathFromRouteSlug } from './lib/prompt-page-route-map';

const intlMiddleware = createMiddleware(routing);

const defaultLocaleStandalonePaths = new Set([
  '/app',
  '/login',
  '/auth/error',
  '/auth/forgot-password',
  '/auth/login',
  '/auth/register',
  '/auth/reset-password',
]);

const singleLanguageCanonicalPaths = new Set([
  '/ai-baby-podcast',
  '/ai-baby-generator',
  '/veo-3-generator',
  '/hailuo-ai-video-generator',
  '/seedance',
  '/lipsync',
  '/effect',
  '/model',
  '/earth-zoom',
  '/ai-image-prompt',
  '/gpt-image-prompt',
  '/nano-banana-prompt',
  '/midjourney-prompt',
  '/privacy-policy',
  '/terms-of-service',
]);

const legacyCanonicalRedirects = new Map([['/effect/earth-zoom', '/earth-zoom']]);

function isPromptDetailPath(pathname: string) {
  const segments = pathname.split('/').filter(Boolean);

  return segments[0] === 'prompt' && segments.length >= 2;
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

function getLegacyCanonicalRedirect(pathname: string) {
  const segments = pathname.split('/').filter(Boolean);
  const [locale, ...rest] = segments;
  const unlocalizedPath = LOCALES.includes(locale as (typeof LOCALES)[number])
    ? `/${rest.join('/')}`
    : pathname;

  return legacyCanonicalRedirects.get(unlocalizedPath) ?? null;
}

export function proxy(request: NextRequest) {
  const promptDetailRedirect = getPromptDetailRedirect(
    request.nextUrl.pathname
  );

  if (promptDetailRedirect) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = promptDetailRedirect;

    return NextResponse.redirect(redirectUrl, 301);
  }

  const legacyCanonicalRedirect = getLegacyCanonicalRedirect(
    request.nextUrl.pathname
  );

  if (legacyCanonicalRedirect) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = legacyCanonicalRedirect;

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

  if (isPromptDetailPath(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  if (singleLanguageCanonicalPaths.has(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  if (defaultLocaleStandalonePaths.has(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
