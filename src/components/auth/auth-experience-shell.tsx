'use client';

import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { AuthShowcasePanel } from './auth-showcase-panel';

interface AuthExperienceShellProps {
  children: React.ReactNode;
  className?: string;
}

export function AuthExperienceShell({
  children,
  className,
}: AuthExperienceShellProps) {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(min-width: 1024px)');
    const sync = () => setIsDesktop(query.matches);

    sync();
    query.addEventListener('change', sync);

    return () => query.removeEventListener('change', sync);
  }, []);

  return (
    <div
      className={cn(
        'vogue-auth-shell grid overflow-hidden rounded-[24px] border border-white/70 bg-white/90 shadow-[0_22px_62px_rgba(72,92,130,0.13)] lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1fr)]',
        className
      )}
      style={
        isDesktop
          ? {
              gridTemplateColumns: 'minmax(0, 0.82fr) minmax(0, 1fr)',
            }
          : undefined
      }
    >
      {children}
      <AuthShowcasePanel />
    </div>
  );
}
