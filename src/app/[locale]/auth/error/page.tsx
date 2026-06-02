import { ErrorCard } from '@/components/auth/error-card';
import {
  getAuthPageMetadata,
  type LocalizedAuthPageProps,
} from '@/components/auth/auth-metadata';

export function generateMetadata({ params }: LocalizedAuthPageProps) {
  return getAuthPageMetadata('error', params);
}

export default function AuthErrorPage() {
  return (
    <div className="flex min-h-[calc(100svh-5rem)] items-center justify-center">
      <div className="w-full max-w-sm">
        <ErrorCard />
      </div>
    </div>
  );
}
