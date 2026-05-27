import { ErrorCard } from '@/components/auth/error-card';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Authentication Error - Vogue AI',
  robots: {
    index: false,
    follow: true,
  },
};

export default function AuthErrorPage() {
  return (
    <div className="flex min-h-[calc(100svh-5rem)] items-center justify-center">
      <div className="w-full max-w-sm">
        <ErrorCard />
      </div>
    </div>
  );
}

