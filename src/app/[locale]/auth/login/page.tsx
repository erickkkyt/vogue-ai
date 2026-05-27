import { AuthExperienceFlow } from '@/components/auth/auth-experience-flow';
import type { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Login - Vogue AI',
  robots: {
    index: false,
    follow: true,
  },
};

export default function LoginPage() {
  return (
    <div className="flex min-h-[calc(100svh-5rem)] items-center justify-center">
      <div className="mx-auto w-full max-w-[1040px]">
        <Suspense fallback={<div className="min-h-[640px]" />}>
          <AuthExperienceFlow initialMode="login" />
        </Suspense>
      </div>
    </div>
  );
}
