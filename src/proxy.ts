import createMiddleware from 'next-intl/middleware';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { LOCALES, routing } from './i18n/routing';

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
  '/effect/earth-zoom',
  '/privacy-policy',
  '/terms-of-service',
]);

function isPromptDetailPath(pathname: string) {
  const segments = pathname.split('/').filter(Boolean);

  return segments[0] === 'prompt' && segments.length >= 2;
}

function getPromptDetailRedirect(pathname: string) {
  const segments = pathname.split('/').filter(Boolean);
  const [locale, ...rest] = segments;

  if (!LOCALES.includes(locale as (typeof LOCALES)[number])) return null;
  if (rest[0] !== 'prompt' || rest.length < 2) return null;

  return `/${rest.join('/')}`;
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

export function proxy(request: NextRequest) {
  const promptDetailRedirect = getPromptDetailRedirect(
    request.nextUrl.pathname
  );

  if (promptDetailRedirect) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = promptDetailRedirect;

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
