import { AuthExperienceFlow } from '@/components/auth/auth-experience-flow';
import {
  getAuthPageMetadata,
  type LocalizedAuthPageProps,
} from '@/components/auth/auth-metadata';
import { Suspense } from 'react';

export function generateMetadata({ params }: LocalizedAuthPageProps) {
  return getAuthPageMetadata('login', params);
}

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
