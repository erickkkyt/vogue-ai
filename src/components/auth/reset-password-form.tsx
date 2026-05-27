'use client';

import { authClient } from '@/lib/auth-client';
import { EyeIcon, EyeOffIcon, Loader2Icon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuthCopy } from './auth-copy';
import { AuthSimpleCard } from './auth-simple-card';

interface ResetPasswordFormProps {
  token: string;
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const router = useRouter();
  const { copy, localePrefix } = useAuthCopy();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isPending, setIsPending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    await authClient.resetPassword(
      {
        newPassword: password,
        token,
      },
      {
        onRequest: () => {
          setIsPending(true);
          setError('');
        },
        onResponse: () => setIsPending(false),
        onSuccess: () => router.push(`${localePrefix}/auth/login`),
        onError: (ctx) => setError(`${ctx.error.status}: ${ctx.error.message}`),
      }
    );
  };

  return (
    <AuthSimpleCard
      title={copy.resetPasswordTitle}
      bottomLabel={copy.backToLogin}
      bottomHref={`${localePrefix}/auth/login`}
    >
      <form onSubmit={onSubmit} className="space-y-6">
        <label className="block space-y-2">
          <span className="block text-sm font-medium text-slate-700">
            {copy.newPassword}
          </span>
          <div className="relative">
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              disabled={isPending}
              placeholder={copy.passwordPlaceholder}
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              required
              minLength={8}
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 pr-12 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-200 disabled:opacity-60"
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

        {error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <button
          disabled={isPending || password.length < 8}
          type="submit"
          className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-slate-950 text-sm font-semibold text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? <Loader2Icon className="mr-2 size-4 animate-spin" /> : null}
          <span>{isPending ? copy.processing : copy.resetPassword}</span>
        </button>
      </form>
    </AuthSimpleCard>
  );
}
