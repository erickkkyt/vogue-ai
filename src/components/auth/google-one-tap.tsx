'use client';

import { websiteConfig } from '@/config/website';
import { authClient } from '@/lib/auth-client';
import { DEFAULT_LOGIN_REDIRECT } from '@/routes';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { getLocalePrefix } from './auth-copy';

interface GoogleOneTapProps {
  callbackUrl?: string;
}

let oneTapInFlight = false;

export function GoogleOneTap({ callbackUrl: propCallbackUrl }: GoogleOneTapProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const session = authClient.useSession();
  const hasPromptedRef = useRef(false);
  const resetTimerRef = useRef<number | null>(null);

  const paramCallbackUrl = searchParams.get('callbackUrl');
  const localePrefix = getLocalePrefix(pathname);
  const defaultCallbackUrl = `${localePrefix}${DEFAULT_LOGIN_REDIRECT}`;
  const callbackUrl = propCallbackUrl || paramCallbackUrl || defaultCallbackUrl;

  useEffect(() => {
    const hasClientId = !!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const isSignedIn = !!session.data?.user?.id;

    if (
      !websiteConfig.auth.enableGoogleOneTap ||
      !websiteConfig.auth.enableGoogleLogin ||
      !hasClientId
    ) {
      return;
    }

    if (session.isPending || isSignedIn || hasPromptedRef.current) return;
    if (oneTapInFlight) return;

    const resetPromptState = () => {
      hasPromptedRef.current = false;
      oneTapInFlight = false;
      if (resetTimerRef.current !== null) {
        window.clearTimeout(resetTimerRef.current);
        resetTimerRef.current = null;
      }
    };

    const runOneTap = () => {
      if (hasPromptedRef.current || oneTapInFlight) return;

      hasPromptedRef.current = true;
      oneTapInFlight = true;
      resetTimerRef.current = window.setTimeout(resetPromptState, 12000);

      authClient
        .oneTap({
          callbackURL: callbackUrl,
          nonce: window.crypto?.randomUUID?.(),
          onPromptNotification: resetPromptState,
        })
        .then(resetPromptState)
        .catch((error) => {
          console.error('google one tap error:', error);
          resetPromptState();
        });
    };

    let timeoutId: number | null = null;
    let idleId: number | null = null;
    const isDesktop = window.matchMedia('(min-width: 768px)').matches;

    const cleanupDelay = () => {
      if (typeof window.cancelIdleCallback === 'function' && idleId !== null) {
        window.cancelIdleCallback(idleId);
      }
      if (timeoutId !== null) window.clearTimeout(timeoutId);
      window.removeEventListener('pointerdown', runOneTap);
      window.removeEventListener('keydown', runOneTap);
      window.removeEventListener('touchstart', runOneTap);
      window.removeEventListener('scroll', runOneTap);
    };

    window.addEventListener('pointerdown', runOneTap, { passive: true });
    window.addEventListener('keydown', runOneTap, { passive: true });
    window.addEventListener('touchstart', runOneTap, { passive: true });
    window.addEventListener('scroll', runOneTap, { passive: true });

    if (typeof window.requestIdleCallback === 'function') {
      idleId = window.requestIdleCallback(runOneTap, {
        timeout: isDesktop ? 3000 : 4500,
      });
    } else {
      timeoutId = window.setTimeout(runOneTap, isDesktop ? 1800 : 2600);
    }

    return () => {
      cleanupDelay();
      resetPromptState();
    };
  }, [callbackUrl, session.data?.user?.id, session.isPending]);

  return null;
}
