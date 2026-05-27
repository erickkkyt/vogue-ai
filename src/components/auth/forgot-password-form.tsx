'use client';

import { authClient } from '@/lib/auth-client';
import { Loader2Icon } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { useAuthCopy } from './auth-copy';
import { AuthSimpleCard } from './auth-simple-card';

export function ForgotPasswordForm() {
  const searchParams = useSearchParams();
  const { copy, localePrefix } = useAuthCopy();
  const [email, setEmail] = useState(() => searchParams.get('email') ?? '');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isPending, setIsPending] = useState(false);

  const resetPath = useMemo(
    () => `${localePrefix}/auth/reset-password`,
    [localePrefix]
  );

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    await authClient.requestPasswordReset(
      {
        email,
        redirectTo: resetPath,
      },
      {
        onRequest: () => {
          setIsPending(true);
          setError('');
          setSuccess('');
        },
        onResponse: () => setIsPending(false),
        onSuccess: () => setSuccess(copy.resetEmailSent),
        onError: (ctx) => setError(`${ctx.error.status}: ${ctx.error.message}`),
      }
    );
  };

  return (
    <AuthSimpleCard
      title={copy.forgotPasswordTitle}
      bottomLabel={copy.backToLogin}
      bottomHref={`${localePrefix}/auth/login`}
    >
      <form onSubmit={onSubmit} className="space-y-6">
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
            required
            className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-200 disabled:opacity-60"
          />
        </label>

        {error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}
        {success ? (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {success}
          </div>
        ) : null}

        <button
          disabled={isPending || !email}
          type="submit"
          className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-slate-950 text-sm font-semibold text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? <Loader2Icon className="mr-2 size-4 animate-spin" /> : null}
          <span>{isPending ? copy.processing : copy.sendResetLink}</span>
        </button>
      </form>
    </AuthSimpleCard>
  );
}
