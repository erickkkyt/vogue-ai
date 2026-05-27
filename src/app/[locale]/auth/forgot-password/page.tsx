import { ForgotPasswordForm } from '@/components/auth/forgot-password-form';
import type { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Forgot Password - Vogue AI',
  robots: {
    index: false,
    follow: true,
  },
};

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-[calc(100svh-5rem)] items-center justify-center">
      <div className="w-full max-w-sm">
        <Suspense fallback={<div className="h-[420px]" />}>
          <ForgotPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}

