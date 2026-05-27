'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import PricingDialog from './PricingDialog';

const PRICING_LINK_LOCALES = ['en', 'zh', 'fr', 'ru', 'pt', 'ja', 'ko'];

type PricingDialogContextValue = {
  openPricingDialog: () => void;
};

const PricingDialogContext =
  createContext<PricingDialogContextValue | null>(null);

function getUnlocalizedPathname(pathname: string) {
  const segments = pathname.split('/').filter(Boolean);
  if (segments[0] && PRICING_LINK_LOCALES.includes(segments[0])) {
    return `/${segments.slice(1).join('/')}`;
  }

  return pathname;
}

function removePricingSearchParam() {
  const url = new URL(window.location.href);
  if (!url.searchParams.has('pricing')) return;

  url.searchParams.delete('pricing');
  window.history.replaceState(
    window.history.state,
    '',
    `${url.pathname}${url.search}${url.hash}`
  );
}

export function PricingDialogProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(() => {
    if (typeof window === 'undefined') return false;
    return new URL(window.location.href).searchParams.has('pricing');
  });

  const openPricingDialog = useCallback(() => {
    setOpen(true);
  }, []);

  const setPricingDialogOpen = useCallback((nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) removePricingSearchParam();
  }, []);

  useEffect(() => {
    const handlePricingLinkClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const target = event.target as HTMLElement | null;
      const anchor = target?.closest('a[href]');
      if (!(anchor instanceof HTMLAnchorElement)) return;
      if (anchor.target && anchor.target !== '_self') return;

      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (getUnlocalizedPathname(url.pathname) !== '/pricing') return;

      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      setOpen(true);
    };

    document.addEventListener('click', handlePricingLinkClick, true);
    return () =>
      document.removeEventListener('click', handlePricingLinkClick, true);
  }, []);

  const value = useMemo(
    () => ({
      openPricingDialog,
    }),
    [openPricingDialog]
  );

  return (
    <PricingDialogContext.Provider value={value}>
      {children}
      <PricingDialog open={open} onOpenChange={setPricingDialogOpen} />
    </PricingDialogContext.Provider>
  );
}

export function usePricingDialog() {
  const context = useContext(PricingDialogContext);
  if (!context) {
    throw new Error(
      'usePricingDialog must be used inside PricingDialogProvider'
    );
  }

  return context;
}
