'use client';

import { AuthExperienceFlow } from '@/components/auth/auth-experience-flow';
import { cn } from '@/lib/utils';
import { XIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  cloneElement,
  isValidElement,
  useEffect,
  useState,
  type MouseEvent,
  type ReactElement,
} from 'react';
import { createPortal } from 'react-dom';
import { getLocalePrefix } from './auth-copy';

interface LoginWrapperProps {
  children: React.ReactNode;
  mode?: 'modal' | 'redirect';
  asChild?: boolean;
  callbackUrl?: string;
}

type TriggerProps = {
  onClick?: (event: MouseEvent<HTMLElement>) => void;
};

export function LoginWrapper({
  children,
  mode = 'redirect',
  asChild,
  callbackUrl,
}: LoginWrapperProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState<string | undefined>(undefined);
  const effectiveCallbackUrl = callbackUrl ?? currentPath;

  useEffect(() => {
    const handle = window.setTimeout(() => {
      setMounted(true);
      setCurrentPath(`${window.location.pathname}${window.location.search ?? ''}`);
    }, 0);

    return () => window.clearTimeout(handle);
  }, []);

  useEffect(() => {
    if (!isModalOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsModalOpen(false);
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isModalOpen]);

  if (!mounted) return null;

  const localePrefix = getLocalePrefix(currentPath ?? null);
  const loginPath = effectiveCallbackUrl
    ? `${localePrefix}/auth/login?callbackUrl=${encodeURIComponent(effectiveCallbackUrl)}`
    : `${localePrefix}/auth/login`;

  const handleRedirect = () => router.push(loginPath);

  if (mode !== 'modal') {
    return (
      <span onClick={handleRedirect} className="cursor-pointer">
        {children}
      </span>
    );
  }

  const openModal = (event: MouseEvent<HTMLElement>) => {
    const child = isValidElement<TriggerProps>(children) ? children : null;

    child?.props.onClick?.(event);
    if (!event.defaultPrevented) setIsModalOpen(true);
  };

  const trigger =
    asChild && isValidElement<TriggerProps>(children) ? (
      cloneElement(children as ReactElement<TriggerProps>, {
        onClick: openModal,
      })
    ) : (
      <button type="button" onClick={openModal} className="contents">
        {children}
      </button>
    );

  const modal = isModalOpen
    ? createPortal(
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 p-2 backdrop-blur-[2px]"
          role="presentation"
          style={{
            alignItems: 'center',
            background: 'rgba(15,23,42,0.35)',
            backdropFilter: 'blur(2px)',
            display: 'flex',
            inset: 0,
            justifyContent: 'center',
            padding: 8,
            position: 'fixed',
            zIndex: 90,
          }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setIsModalOpen(false);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Sign in"
            className={cn(
              'relative max-h-[calc(100svh-1rem)] w-full max-w-[calc(100%-1rem)] overflow-y-auto sm:max-w-[1040px] lg:max-w-[1040px] lg:overflow-visible',
              'animate-in fade-in-0 zoom-in-95 duration-200'
            )}
            style={{ maxHeight: 'calc(100svh - 1rem)' }}
          >
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="absolute right-3 top-3 z-[70] inline-flex size-8 items-center justify-center rounded-full border border-white/45 bg-white/35 text-white/82 shadow-none backdrop-blur-md transition-all hover:border-white/70 hover:bg-white/60 hover:text-slate-950 focus:outline-none focus:ring-2 focus:ring-white/55"
              style={{ zIndex: 100 }}
            >
              <XIcon className="size-4" strokeWidth={1.8} />
              <span className="sr-only">Close</span>
            </button>
            <AuthExperienceFlow callbackUrl={effectiveCallbackUrl} />
          </div>
        </div>,
        document.body
      )
    : null;

  return (
    <>
      {trigger}
      {modal}
    </>
  );
}
