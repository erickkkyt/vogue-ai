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
import PricingDialog, { type PricingTab } from './PricingDialog';

const PRICING_LINK_LOCALES = ['en', 'zh', 'fr', 'ru', 'pt', 'ja', 'ko'];

type PricingDialogContextValue = {
  openPricingDialog: (initialTab?: PricingTab | null) => void;
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

function getPricingTabFromUrl(url: URL): PricingTab | null {
  const tab =
    url.searchParams.get('tab') ??
    url.searchParams.get('pricingTab') ??
    url.searchParams.get('pricing');

  if (tab === 'one-time' || tab === 'credits' || tab === 'credit-packs') {
    return 'one-time';
  }
  if (tab === 'monthly') return 'monthly';
  if (tab === 'yearly') return 'yearly';
  return null;
}

function removePricingSearchParam() {
  const url = new URL(window.location.href);
  if (!url.searchParams.has('pricing')) return;

  url.searchParams.delete('pricing');
  url.searchParams.delete('tab');
  url.searchParams.delete('pricingTab');
  window.history.replaceState(
    window.history.state,
    '',
    `${url.pathname}${url.search}${url.hash}`
  );
}

export function PricingDialogProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [initialTab, setInitialTab] = useState<PricingTab | null>(null);

  const openPricingDialog = useCallback((requestedTab?: PricingTab | null) => {
    setInitialTab(requestedTab ?? null);
    setOpen(true);
  }, []);

  const setPricingDialogOpen = useCallback((nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) removePricingSearchParam();
  }, []);

  useEffect(() => {
    let pricingSearchParamTimer: number | null = null;

    const currentUrl = new URL(window.location.href);
    if (currentUrl.searchParams.has('pricing')) {
      pricingSearchParamTimer = window.setTimeout(() => {
        setInitialTab(getPricingTabFromUrl(currentUrl));
        setOpen(true);
      }, 0);
    }

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
      setInitialTab(getPricingTabFromUrl(url));
      setOpen(true);
    };

    document.addEventListener('click', handlePricingLinkClick, true);
    return () => {
      if (pricingSearchParamTimer !== null) {
        window.clearTimeout(pricingSearchParamTimer);
      }
      document.removeEventListener('click', handlePricingLinkClick, true);
    };
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
      <PricingDialog
        initialTab={initialTab}
        open={open}
        onOpenChange={setPricingDialogOpen}
      />
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
