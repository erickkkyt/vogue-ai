'use client';

import { authClient } from '@/lib/auth-client';
import { resolveSafeCallbackPath } from '@/lib/auth/callback-url';
import { cn } from '@/lib/utils';
import {
  ArrowLeftIcon,
  EyeIcon,
  EyeOffIcon,
  Loader2Icon,
  MailIcon,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { VogueBrandLockup } from '../common/VogueBrand';
import { getLocalePrefix, useAuthCopy } from './auth-copy';
import { GoogleOneTap } from './google-one-tap';

interface LoginFormProps {
  callbackUrl?: string;
  mode: 'login' | 'register';
  onSwitchMode: () => void;
  className?: string;
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      focusable="false"
    >
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06L5.84 9.9C6.71 7.3 9.14 5.38 12 5.38z"
      />
    </svg>
  );
}

export function LoginForm({
  callbackUrl: propCallbackUrl,
  mode,
  onSwitchMode,
  className,
}: LoginFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { copy, localePrefix } = useAuthCopy();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [googlePending, setGooglePending] = useState(false);
  const [emailAuthVisible, setEmailAuthVisible] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isShortViewport, setIsShortViewport] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(max-height: 760px)');
    const sync = () => setIsShortViewport(query.matches);

    sync();
    query.addEventListener('change', sync);

    return () => query.removeEventListener('change', sync);
  }, []);

  const callbackUrl = useMemo(() => {
    const callback =
      propCallbackUrl ||
      searchParams.get('callbackUrl') ||
      searchParams.get('next');
    const fallback = `${localePrefix || getLocalePrefix(null)}/app`;

    return resolveSafeCallbackPath(callback, fallback);
  }, [localePrefix, propCallbackUrl, searchParams]);

  const termsHref = `${localePrefix}/terms-of-service`;
  const privacyHref = `${localePrefix}/privacy-policy`;
  const forgotPasswordHref = email
    ? `${localePrefix}/auth/forgot-password?email=${encodeURIComponent(email)}`
    : `${localePrefix}/auth/forgot-password`;
  const hasGoogleClient = !!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const isRegister = mode === 'register';

  const authCallbacks = {
    onRequest: () => {
      setIsPending(true);
      setMessage(null);
      setSuccessMessage(null);
    },
    onResponse: () => setIsPending(false),
    onSuccess: () => {
      if (isRegister) {
        setSuccessMessage(copy.checkEmail);
        setPassword('');
        return;
      }

      router.push(callbackUrl);
      router.refresh();
    },
    onError: (ctx: { error: { message?: string; status?: number } }) => {
      setMessage(ctx.error.message || (isRegister ? copy.signUpFailed : copy.loginFailed));
      setSuccessMessage(null);
    },
  };

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isRegister) {
      await authClient.signUp.email(
        {
          email,
          password,
          name: email.split('@')[0] || 'Vogue AI User',
          callbackURL: callbackUrl,
        },
        authCallbacks
      );
      return;
    }

    await authClient.signIn.email(
      {
        email,
        password,
        callbackURL: callbackUrl,
      },
      authCallbacks
    );
  };

  const signInWithGoogle = async () => {
    setGooglePending(true);
    setMessage(null);
    setSuccessMessage(null);

    await authClient.signIn.social(
      {
        provider: 'google',
        callbackURL: callbackUrl,
      },
      {
        onResponse: () => setGooglePending(false),
        onError: (ctx) => {
          setMessage(ctx.error.message || copy.googleFailed);
          setSuccessMessage(null);
        },
      }
    );
  };

  const switchMode = () => {
    setEmailAuthVisible(false);
    setMessage(null);
    setSuccessMessage(null);
    onSwitchMode();
  };

  return (
    <div
      className={cn(
        'relative flex h-full flex-col justify-between bg-white px-7 py-7 text-slate-950 sm:px-8 sm:py-8',
        className
      )}
      style={{
        background: 'rgba(255,255,255,0.9)',
        color: '#0f172a',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: isShortViewport ? '24px 32px' : '32px 36px',
        position: 'relative',
      }}
    >
      <GoogleOneTap callbackUrl={callbackUrl} />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(147,197,253,0.22),transparent_32%),radial-gradient(circle_at_90%_20%,rgba(45,212,191,0.10),transparent_30%)]" />
      <div
        className="relative z-10 mx-auto flex h-full w-full max-w-[356px] flex-col justify-center gap-6"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: isShortViewport ? 14 : 24,
          justifyContent: 'center',
          marginLeft: 'auto',
          marginRight: 'auto',
          maxWidth: 356,
          position: 'relative',
          width: '100%',
          zIndex: 10,
        }}
      >
        <div>
          <div
            className="mb-6 space-y-5"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: isShortViewport ? 12 : 20,
              marginBottom: isShortViewport ? 14 : 24,
            }}
          >
            <div
              className="space-y-4 text-center"
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: isShortViewport ? 10 : 16,
                textAlign: 'center',
              }}
            >
              <Link
                href={localePrefix || '/'}
                prefetch={false}
                className="mx-auto inline-flex flex-col items-center text-slate-950"
              >
                <VogueBrandLockup
                  orientation="vertical"
                  className="gap-2"
                  markClassName="size-9"
                  wordClassName="text-[36px]"
                  priority
                />
              </Link>
              <p className="text-[13px] font-medium tracking-[0.02em] text-slate-500">
                {copy.modalTitle}
              </p>
            </div>
          </div>

          <div className="min-h-[308px]">
            {!emailAuthVisible ? (
              <div
                className="space-y-4"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: isShortViewport ? 12 : 16,
                }}
              >
                {hasGoogleClient ? (
                  <button
                    type="button"
                    onClick={signInWithGoogle}
                    disabled={googlePending || isPending}
                    className="inline-flex h-[52px] w-full items-center justify-start rounded-[15px] border border-slate-200 bg-white px-4.5 text-left text-[15px] font-semibold text-slate-950 shadow-[0_13px_28px_rgba(72,92,130,0.09)] transition hover:border-slate-300 hover:bg-[#f7fbff] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {googlePending ? (
                      <Loader2Icon className="mr-3 size-5 animate-spin" />
                    ) : (
                      <GoogleIcon className="mr-3 size-5" />
                    )}
                    <span>{copy.continueWithGoogle}</span>
                  </button>
                ) : null}

                {hasGoogleClient ? (
                  <div className="flex items-center gap-3">
                    <div className="h-px flex-1 bg-slate-200" />
                    <span className="text-[11px] font-medium uppercase tracking-[0.24em] text-slate-500">
                      {copy.orContinueWithEmail}
                    </span>
                    <div className="h-px flex-1 bg-slate-200" />
                  </div>
                ) : null}

                <button
                  type="button"
                  onClick={() => {
                    setEmailAuthVisible(true);
                    setMessage(null);
                    setSuccessMessage(null);
                  }}
                  disabled={googlePending || isPending}
                  className="inline-flex h-[52px] w-full items-center justify-start rounded-[15px] border border-slate-200 bg-white px-4.5 text-left text-[15px] font-semibold text-slate-950 shadow-[0_13px_28px_rgba(72,92,130,0.09)] transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <MailIcon className="mr-3 size-5 text-slate-900" />
                  <span>{copy.continueWithEmail}</span>
                </button>

                {message ? (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {message}
                  </div>
                ) : null}
                {successMessage ? (
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                    {successMessage}
                  </div>
                ) : null}
              </div>
            ) : (
              <div
                className="space-y-4"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: isShortViewport ? 12 : 16,
                }}
              >
                <button
                  type="button"
                  aria-label={copy.backToLogin}
                  onClick={() => {
                    setEmailAuthVisible(false);
                    setMessage(null);
                    setSuccessMessage(null);
                  }}
                  className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-950"
                >
                  <ArrowLeftIcon className="size-4" />
                  <span>{copy.backToLogin}</span>
                </button>

                <form
                  onSubmit={submit}
                  className="space-y-5"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: isShortViewport ? 14 : 18,
                  }}
                >
                  <div
                    className="space-y-4"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 14,
                    }}
                  >
                    <label className="block space-y-2">
                      <span className="block text-sm font-medium text-slate-700">
                        {copy.email}
                      </span>
                      <input
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        disabled={isPending}
                        placeholder={copy.emailPlaceholder}
                        type="email"
                        autoComplete="email"
                        autoFocus
                        required
                        className="h-[44px] w-full rounded-[12px] border border-slate-200 bg-white px-3.5 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-200 disabled:opacity-60"
                      />
                    </label>

                    <label className="block space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="block text-sm font-medium text-slate-700">
                          {copy.password}
                        </span>
                        {!isRegister ? (
                          <Link
                            href={forgotPasswordHref}
                            className="text-sm font-normal text-slate-500 transition hover:text-slate-950 hover:underline hover:underline-offset-4"
                          >
                            {copy.forgotPassword}
                          </Link>
                        ) : null}
                      </div>
                      <div className="relative">
                        <input
                          value={password}
                          onChange={(event) => setPassword(event.target.value)}
                          disabled={isPending}
                          placeholder={copy.passwordPlaceholder}
                          type={showPassword ? 'text' : 'password'}
                          autoComplete={isRegister ? 'new-password' : 'current-password'}
                          required
                          className="h-[44px] w-full rounded-[12px] border border-slate-200 bg-white px-3.5 pr-12 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-200 disabled:opacity-60"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((current) => !current)}
                          disabled={isPending}
                          className="absolute right-2 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-950 disabled:opacity-60"
                        >
                          {showPassword ? (
                            <EyeOffIcon className="size-4 text-current" />
                          ) : (
                            <EyeIcon className="size-4 text-current" />
                          )}
                          <span className="sr-only">
                            {showPassword ? copy.hidePassword : copy.showPassword}
                          </span>
                        </button>
                      </div>
                    </label>
                  </div>

                  {message ? (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                      {message}
                    </div>
                  ) : null}
                  {successMessage ? (
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                      {successMessage}
                    </div>
                  ) : null}

                  <button
                    disabled={isPending || googlePending || !email || !password}
                    type="submit"
                    className="inline-flex h-[44px] w-full items-center justify-center rounded-[12px] bg-slate-950 text-sm font-semibold text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isPending ? (
                      <Loader2Icon className="mr-2 size-4 animate-spin" />
                    ) : null}
                    <span>
                      {isPending
                        ? copy.processing
                        : isRegister
                          ? copy.signUp
                          : copy.signIn}
                    </span>
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>

        <div
          className="border-t border-slate-200 pt-5 text-center"
          style={{ paddingTop: isShortViewport ? 14 : 20, textAlign: 'center' }}
        >
          <button
            type="button"
            onClick={switchMode}
            className="text-sm text-slate-500 transition-colors hover:text-slate-950"
          >
            {isRegister ? copy.signInHint : copy.signUpHint}
          </button>
          <p className="mx-auto mt-3 max-w-[300px] text-balance text-xs leading-5 text-slate-500">
            {copy.modalTermsPrefix}{' '}
            <Link
              href={termsHref}
              className="text-slate-600 underline underline-offset-4 transition-colors hover:text-slate-950"
            >
              {copy.modalTermsLink}
            </Link>{' '}
            {copy.modalTermsAnd}{' '}
            <Link
              href={privacyHref}
              className="text-slate-600 underline underline-offset-4 transition-colors hover:text-slate-950"
            >
              {copy.modalPrivacyLink}
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
