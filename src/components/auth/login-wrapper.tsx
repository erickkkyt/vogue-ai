'use client';

import { AuthDialog } from '@/components/auth/auth-dialog';
import { useRouter } from 'next/navigation';
import {
  cloneElement,
  isValidElement,
  useEffect,
  useState,
  type MouseEvent,
  type ReactElement,
} from 'react';
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

  return (
    <>
      {trigger}
      <AuthDialog
        callbackUrl={effectiveCallbackUrl}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </>
  );
}
