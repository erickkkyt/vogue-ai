'use client';

import { cn } from '@/lib/utils';
import Link from 'next/link';
import { getLocalePrefix, useAuthCopy } from './auth-copy';
import { VogueBrandLockup } from '../common/VogueBrand';

interface AuthSimpleCardProps {
  title: string;
  children: React.ReactNode;
  bottomLabel?: string;
  bottomHref?: string;
  className?: string;
}

export function AuthSimpleCard({
  title,
  children,
  bottomLabel,
  bottomHref,
  className,
}: AuthSimpleCardProps) {
  const { localePrefix } = useAuthCopy();

  return (
    <div
      className={cn(
        'w-full rounded-[30px] border border-slate-200 bg-white/86 p-8 text-slate-950 shadow-[0_24px_70px_rgba(72,92,130,0.14)] sm:p-10',
        className
      )}
    >
      <Link
        href={localePrefix || getLocalePrefix(null) || '/'}
        prefetch={false}
        className="mx-auto mb-8 flex flex-col items-center text-slate-950"
      >
        <VogueBrandLockup
          orientation="vertical"
          className="gap-2"
          markClassName="size-10"
          wordClassName="text-[40px]"
          priority
        />
      </Link>
      <h1 className="mb-6 text-center text-xl font-semibold tracking-normal text-slate-950">
        {title}
      </h1>
      {children}
      {bottomLabel && bottomHref ? (
        <div className="mt-6 border-t border-slate-200 pt-5 text-center">
          <Link
            href={bottomHref}
            className="text-sm text-slate-500 transition hover:text-slate-950 hover:underline hover:underline-offset-4"
          >
            {bottomLabel}
          </Link>
        </div>
      ) : null}
    </div>
  );
}
