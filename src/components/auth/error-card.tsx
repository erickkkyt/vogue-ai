'use client';

import { TriangleAlertIcon } from 'lucide-react';
import { useAuthCopy } from './auth-copy';
import { AuthSimpleCard } from './auth-simple-card';

export function ErrorCard() {
  const { copy, localePrefix } = useAuthCopy();

  return (
    <AuthSimpleCard
      title={copy.authErrorTitle}
      bottomLabel={copy.backToLogin}
      bottomHref={`${localePrefix}/auth/login`}
    >
      <div className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-4 text-red-700">
        <TriangleAlertIcon className="size-4" />
        <p className="text-sm font-medium">{copy.authErrorTryAgain}</p>
      </div>
    </AuthSimpleCard>
  );
}
