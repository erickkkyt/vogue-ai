'use client';

import { AuthExperienceFlow } from '@/components/auth/auth-experience-flow';
import { cn } from '@/lib/utils';
import { XIcon } from 'lucide-react';
import { useEffect, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  callbackUrl?: string;
  children?: ReactNode;
  zIndex?: number;
}

export function AuthDialog({
  open,
  onOpenChange,
  callbackUrl,
  children,
  zIndex = 90,
}: AuthDialogProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const handle = window.setTimeout(() => {
      setMounted(true);
    }, 0);

    return () => window.clearTimeout(handle);
  }, []);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onOpenChange(false);
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onOpenChange, open]);

  if (!mounted || !open) return null;

  return createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center bg-slate-950/35 p-2 backdrop-blur-[2px]"
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
        zIndex,
      }}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onOpenChange(false);
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
          onClick={() => onOpenChange(false)}
          className="absolute right-3 top-3 z-[70] inline-flex size-8 items-center justify-center rounded-full border border-white/45 bg-white/35 text-white/82 shadow-none backdrop-blur-md transition-all hover:border-white/70 hover:bg-white/60 hover:text-slate-950 focus:outline-none focus:ring-2 focus:ring-white/55"
          style={{ zIndex: 100 }}
        >
          <XIcon className="size-4" strokeWidth={1.8} />
          <span className="sr-only">Close</span>
        </button>
        {children ?? (
          <AuthExperienceFlow
            callbackUrl={callbackUrl}
            onAuthenticated={() => onOpenChange(false)}
          />
        )}
      </div>
    </div>,
    document.body
  );
}
