'use client';

import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { useAuthCopy } from './auth-copy';
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
  const { copy } = useAuthCopy();

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
        'vogue-auth-shell grid overflow-hidden rounded-[26px] border border-white/85 bg-[#fbfaf7] shadow-[0_28px_90px_rgba(15,23,42,0.14),0_1px_0_rgba(255,255,255,0.75)_inset] lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1fr)]',
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
      <AuthShowcasePanel showcaseSlides={copy.showcaseSlides} />
    </div>
  );
}
