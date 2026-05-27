'use client';

import { AuthExperienceFlow } from '@/components/auth/auth-experience-flow';
import { Suspense } from 'react';

function LoginContent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--vogue-page)] px-4 py-8 text-slate-950 sm:px-6">
      <div className="mx-auto w-full max-w-[1040px]">
        <AuthExperienceFlow initialMode="login" />
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--vogue-page)]" />}>
      <LoginContent />
    </Suspense>
  );
}
