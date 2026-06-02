import { ForgotPasswordForm } from '@/components/auth/forgot-password-form';
import {
  getAuthPageMetadata,
  type LocalizedAuthPageProps,
} from '@/components/auth/auth-metadata';
import { Suspense } from 'react';

export function generateMetadata({ params }: LocalizedAuthPageProps) {
  return getAuthPageMetadata('forgotPassword', params);
}

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
