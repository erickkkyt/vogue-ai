import { ResetPasswordForm } from '@/components/auth/reset-password-form';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

type ResetPasswordPageProps = {
  searchParams: Promise<{ token?: string; error?: string }>;
};

export const metadata: Metadata = {
  title: 'Reset Password - Vogue AI',
  robots: {
    index: false,
    follow: true,
  },
};

export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const { token, error } = await searchParams;

  if (!token || error === 'invalid_token') notFound();

  return (
    <div className="flex min-h-[calc(100svh-5rem)] items-center justify-center">
      <div className="w-full max-w-sm">
        <ResetPasswordForm token={token} />
      </div>
    </div>
  );
}

