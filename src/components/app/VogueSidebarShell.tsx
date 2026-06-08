'use client';

import { LoginWrapper } from '@/components/auth/login-wrapper';
import {
  getVogueAccountCopy,
  getVogueAccountSectionFromPath,
  VogueAccountAvatar,
  VogueAccountDialog,
  type VogueAccountSection,
} from '@/components/account/VogueAccountCenter';
import { VogueBrandLockup } from '@/components/common/VogueBrand';
import {
  getVogueCopyFromMessages,
  normalizeVogueLocale,
  SUPPORTED_VOGUE_LOCALES,
  type VogueLocale,
  type VogueUICopy,
} from '@/i18n/vogue';
import {
  LocaleLink,
  useLocalePathname,
  useLocaleRouter,
} from '@/i18n/navigation';
import { authClient } from '@/lib/auth-client';
import {
  BookOpen,
  Check,
  ChevronRight,
  CircleDollarSign,
  GalleryVerticalEnd,
  Globe2,
  Home,
  Image as ImageIcon,
  LogIn,
  LogOut,
  UserRound,
  WalletCards,
  Zap,
} from 'lucide-react';
import { useLocale, useMessages } from 'next-intl';
import { useParams, usePathname as useRawPathname } from 'next/navigation';
import type { MouseEvent, ReactNode } from 'react';
import { useEffect, useRef, useState, useTransition } from 'react';

type SidebarLink = {
  href: string;
  labelKey: keyof VogueUICopy['sidebar'] | keyof VogueUICopy['common'];
  icon: ReactNode;
};

const primaryLinks: SidebarLink[] = [
  {
    href: '/',
    labelKey: 'home',
    icon: <Home className="h-4 w-4 shrink-0" />,
  },
  {
    href: '/app',
    labelKey: 'imageWorkspace',
    icon: <ImageIcon className="h-4 w-4 shrink-0" />,
  },
  {
    href: '/assets',
    labelKey: 'projectAssets',
    icon: <GalleryVerticalEnd className="h-4 w-4 shrink-0" />,
  },
];

const exploreLinks: SidebarLink[] = [
  {
    href: '/pricing',
    labelKey: 'pricing',
    icon: <CircleDollarSign className="h-4 w-4 shrink-0" />,
  },
  {
    href: '/blog',
    labelKey: 'blog',
    icon: <BookOpen className="h-4 w-4 shrink-0" />,
  },
];

const mobileLinks: SidebarLink[] = [
  {
    href: '/',
    labelKey: 'home',
    icon: <Home className="h-4 w-4 shrink-0" />,
  },
  {
    href: '/app',
    labelKey: 'workspace',
    icon: <ImageIcon className="h-4 w-4 shrink-0" />,
  },
  {
    href: '/assets',
    labelKey: 'assets',
    icon: <GalleryVerticalEnd className="h-4 w-4 shrink-0" />,
  },
  {
    href: '/pricing',
    labelKey: 'pricing',
    icon: <CircleDollarSign className="h-4 w-4 shrink-0" />,
  },
];

const languageLabels = {
  en: 'English',
  zh: '中文',
  fr: 'Français',
  ru: 'Русский',
  pt: 'Português',
  ja: '日本語',
  ko: '한국어',
} satisfies Record<(typeof SUPPORTED_VOGUE_LOCALES)[number], string>;

const accountMenuCopy = {
  en: {
    language: 'Language',
    menu: 'Account menu',
  },
  zh: {
    language: '多语言',
    menu: '账户菜单',
  },
  fr: {
    language: 'Langue',
    menu: 'Menu du compte',
  },
  ru: {
    language: 'Язык',
    menu: 'Меню аккаунта',
  },
  pt: {
    language: 'Idioma',
    menu: 'Menu da conta',
  },
  ja: {
    language: '言語',
    menu: 'アカウントメニュー',
  },
  ko: {
    language: '언어',
    menu: '계정 메뉴',
  },
} as const satisfies Record<VogueLocale, { language: string; menu: string }>;

const isPathMatch = (pathname: string, href: string) => {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
};

const getSidebarLabel = (link: SidebarLink, copy: VogueUICopy) =>
  link.labelKey in copy.sidebar
    ? copy.sidebar[link.labelKey as keyof VogueUICopy['sidebar']]
    : copy.common[link.labelKey as keyof VogueUICopy['common']];

const sidebarNavItemBase =
  'group relative flex min-h-10 items-center gap-3 rounded-[12px] border px-3 py-2 text-[14px] font-medium tracking-normal transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--vogue-accent-ring)]';

const sidebarNavItemActive =
  'border-transparent bg-[rgba(29,25,23,0.055)] text-slate-950 before:absolute before:bottom-2 before:left-0 before:top-2 before:w-[2px] before:rounded-r-full before:bg-slate-950/80';

const sidebarNavItemInactive =
  'border-transparent text-slate-600 hover:bg-[rgba(29,25,23,0.045)] hover:text-slate-950';

const isAuthShellPath = (pathname: string) => {
  return (
    pathname === '/login' || pathname === '/auth' || pathname.startsWith('/auth/')
  );
};

const isPromptDetailRoute = (pathname: string) =>
  /^\/prompt\/[^/]+$/.test(pathname);

function NavGroup({
  title,
  links,
  pathname,
  copy,
  withDivider = false,
}: {
  title?: string;
  links: SidebarLink[];
  pathname: string;
  copy: VogueUICopy;
  withDivider?: boolean;
}) {
  return (
    <div
      className={`space-y-2 ${
        withDivider
          ? 'mt-4 border-t border-[var(--vogue-sidebar-line)] pt-4'
          : ''
      }`}
    >
      {title ? (
        <p className="px-3 text-[12px] font-medium tracking-normal text-slate-500">
          {title}
        </p>
      ) : null}
      <ul className="space-y-1">
        {links.map((link) => {
          const active = isPathMatch(pathname, link.href);
          const label = getSidebarLabel(link, copy);

          return (
            <li key={link.href}>
              <LocaleLink
                href={link.href}
                className={`${sidebarNavItemBase} ${
                  active ? sidebarNavItemActive : sidebarNavItemInactive
                }`}
              >
                {link.icon}
                <span className="relative truncate">{label}</span>
              </LocaleLink>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function SidebarAccount({
  locale,
  copy,
}: {
  locale: string;
  copy: VogueUICopy;
}) {
  const { data: session } = authClient.useSession();
  const rawPathname = useRawPathname();
  const localePathname = useLocalePathname();
  const localeRouter = useLocaleRouter();
  const params = useParams();
  const [, startTransition] = useTransition();
  const [credits, setCredits] = useState<number | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const user = session?.user;
  const userId = user?.id;
  const accountCopy = getVogueAccountCopy(locale);
  const localizedMenuCopy = accountMenuCopy[normalizeVogueLocale(locale)];

  useEffect(() => {
    if (!userId) {
      return;
    }

    let active = true;

    fetch('/api/user/credits', { cache: 'no-store' })
      .then((response) => response.json())
      .then((payload: { currentCredits?: number }) => {
        if (active) setCredits(payload.currentCredits ?? 0);
      })
      .catch(() => {
        if (active) setCredits(0);
      });

    return () => {
      active = false;
    };
  }, [userId]);

  useEffect(() => {
    if (!menuOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (menuRef.current?.contains(event.target as Node)) return;
      setMenuOpen(false);
      setLanguageOpen(false);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setMenuOpen(false);
      setLanguageOpen(false);
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [menuOpen]);

  const displayName = user?.name || user?.email?.split('@')[0] || 'Vogue AI User';
  const menuItemClass =
    'flex h-11 w-full items-center gap-3 rounded-[14px] px-3 text-left text-[14px] font-medium text-slate-700 transition hover:bg-[#f3efec] hover:text-slate-950';

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          setMenuOpen(false);
          localeRouter.replace('/');
        },
      },
    });
  };

  const handleLanguageChange = (
    event: MouseEvent<HTMLAnchorElement>,
    nextLocale: VogueLocale
  ) => {
    event.preventDefault();

    setMenuOpen(false);
    setLanguageOpen(false);

    startTransition(() => {
      localeRouter.replace(
        // @ts-expect-error -- current pathname and params come from next-intl for this route.
        { pathname: localePathname, params },
        { locale: nextLocale, scroll: false }
      );
    });
  };

  return (
    <div className="px-2 pb-2 pt-2">
      {user ? (
        <div className="flex items-center justify-between gap-2">
          <div ref={menuRef} className="relative z-[1600] shrink-0">
            <button
              type="button"
              aria-expanded={menuOpen}
              aria-haspopup="menu"
              title={user.email ?? displayName}
              onClick={() => setMenuOpen((open) => !open)}
              className="vogue-sidebar-account-button inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--vogue-accent-ring)]"
            >
              <VogueAccountAvatar
                user={user}
                className="h-8 w-8 text-[13px] shadow-[0_10px_22px_rgba(72,55,44,0.1)]"
              />
              <span className="sr-only">{localizedMenuCopy.menu}</span>
            </button>

            {menuOpen ? (
              <div
                role="menu"
                className="absolute bottom-14 left-0 z-[1600] w-[216px] max-w-[calc(100vw-32px)] overflow-visible rounded-[22px] border border-[#e5ded9] bg-white/96 p-1.5 text-slate-950 shadow-[0_24px_70px_rgba(72,55,44,0.18)] backdrop-blur-xl"
              >
                <div className="flex min-w-0 items-center gap-3 border-b border-[#eee6e1] px-3 py-3">
                  <VogueAccountAvatar user={user} className="h-10 w-10" />
                  <div className="min-w-0">
                    <p className="truncate text-[15px] font-semibold tracking-normal text-slate-950">
                      {displayName}
                    </p>
                    <p className="mt-0.5 truncate text-[13px] text-slate-500">
                      {user.email}
                    </p>
                  </div>
                </div>

                <div className="py-1.5">
                  <LocaleLink
                    role="menuitem"
                    href="/profile"
                    onClick={() => setMenuOpen(false)}
                    className={menuItemClass}
                  >
                    <UserRound className="h-4 w-4 shrink-0" />
                    {accountCopy.sections.profile}
                  </LocaleLink>
                  <LocaleLink
                    role="menuitem"
                    href="/billings"
                    onClick={() => setMenuOpen(false)}
                    className={menuItemClass}
                  >
                    <WalletCards className="h-4 w-4 shrink-0" />
                    {accountCopy.sections.billing}
                  </LocaleLink>

                  <div className="relative">
                    <button
                      type="button"
                      role="menuitem"
                      aria-expanded={languageOpen}
                      aria-haspopup="menu"
                      onClick={() => setLanguageOpen((open) => !open)}
                      className={menuItemClass}
                    >
                      <Globe2 className="h-4 w-4 shrink-0" />
                      <span className="min-w-0 flex-1">
                        {localizedMenuCopy.language}
                      </span>
                      <ChevronRight
                        className={`h-4 w-4 shrink-0 text-slate-400 transition ${
                          languageOpen ? 'text-slate-900' : ''
                        }`}
                      />
                    </button>

                    {languageOpen ? (
                      <div
                        role="menu"
                        className="absolute bottom-0 left-[calc(100%+8px)] z-[1700] max-h-[min(320px,calc(100vh-2rem))] w-[176px] overflow-y-auto rounded-[18px] border border-[#e5ded9] bg-white/96 p-1.5 text-slate-950 shadow-[0_24px_70px_rgba(72,55,44,0.18)] backdrop-blur-xl"
                      >
                        {SUPPORTED_VOGUE_LOCALES.map((language) => (
                          <LocaleLink
                            key={language}
                            role="menuitem"
                            href={localePathname}
                            locale={language}
                            prefetch={false}
                            onClick={(event) =>
                              handleLanguageChange(event, language)
                            }
                            className="flex h-9 items-center gap-2 rounded-[12px] px-3 text-[13px] font-medium text-slate-600 transition hover:bg-[#f8f4f1] hover:text-slate-950"
                          >
                            <span className="min-w-0 flex-1 truncate">
                              {languageLabels[language]}
                            </span>
                            {locale === language ? (
                              <Check className="h-3.5 w-3.5 text-slate-950" />
                            ) : null}
                          </LocaleLink>
                        ))}
                      </div>
                    ) : null}
                  </div>

                  <LocaleLink
                    role="menuitem"
                    href="/assets"
                    onClick={() => setMenuOpen(false)}
                    className={menuItemClass}
                  >
                    <GalleryVerticalEnd className="h-4 w-4 shrink-0" />
                    {copy.common.assets}
                  </LocaleLink>
                </div>

                <div className="border-t border-[#eee6e1] pt-1.5">
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => void handleSignOut()}
                    className={menuItemClass}
                  >
                    <LogOut className="h-4 w-4 shrink-0" />
                    {accountCopy.profile.signOut}
                  </button>
                </div>
              </div>
            ) : null}
          </div>

          <LocaleLink
            href="/pricing"
            title={copy.common.credits}
            className="vogue-sidebar-credit-pill inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full border border-slate-950/90 bg-[#111217] px-3 text-[13px] font-semibold text-white shadow-[0_8px_18px_rgba(15,23,42,0.13)] ring-1 ring-white/50 transition hover:-translate-y-0.5 hover:bg-[#1a1b22] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--vogue-accent-ring)]"
          >
            <Zap className="h-3.5 w-3.5 fill-[#ffc6ec] text-[#ffc6ec]" />
            <span className="tabular-nums">{credits === null ? '--' : credits}</span>
          </LocaleLink>
        </div>
      ) : (
        <div className="vogue-sidebar-anonymous-account-row flex items-center justify-between gap-2">
          <LoginWrapper mode="modal" asChild callbackUrl={rawPathname || '/'}>
            <button
              type="button"
              className="vogue-sidebar-anonymous-login-button inline-flex h-10 min-w-0 flex-1 cursor-pointer items-center justify-center gap-2 rounded-full border border-slate-950/10 bg-[#181817] px-4 text-[14px] font-semibold text-white shadow-[0_12px_26px_rgba(47,35,28,0.16)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#22201e] active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--vogue-accent-ring)]"
            >
              <LogIn className="h-4 w-4 shrink-0 text-[#e8dcff]" />
              <span className="truncate">{copy.common.signIn}</span>
            </button>
          </LoginWrapper>

          <LocaleLink
            href="/pricing"
            title={copy.common.credits}
            className="vogue-sidebar-anonymous-credit-pill inline-flex h-10 shrink-0 items-center gap-1.5 rounded-full px-2.5 text-[13px] font-semibold text-[#04d984] transition hover:-translate-y-0.5 hover:bg-white/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--vogue-accent-ring)]"
          >
            <Zap className="h-3.5 w-3.5 fill-[#04f79b] text-[#04f79b]" />
            <span className="tabular-nums">0</span>
            <span className="max-w-[58px] truncate">{copy.common.credits}</span>
          </LocaleLink>
        </div>
      )}
    </div>
  );
}

function MobileAccountButton({
  pathname,
  copy,
}: {
  pathname: string;
  copy: VogueUICopy;
}) {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  if (user) {
    return (
      <LocaleLink
        href="/profile"
        title={user.email ?? copy.common.account}
        className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--vogue-accent-ring)]"
      >
        <VogueAccountAvatar user={user} className="h-10 w-10" />
        <span className="sr-only">{copy.common.account}</span>
      </LocaleLink>
    );
  }

  return (
    <div className="vogue-mobile-anonymous-account-row flex h-10 w-[160px] shrink-0 items-center justify-end gap-2">
      <LoginWrapper mode="modal" asChild callbackUrl={pathname || '/'}>
        <button
          type="button"
          className="vogue-mobile-anonymous-login-button inline-flex h-10 w-[104px] shrink-0 items-center justify-center gap-2 rounded-full border border-[rgba(72,55,44,0.12)] bg-white/72 px-3 text-sm font-semibold text-slate-900 shadow-[0_10px_24px_rgba(72,55,44,0.08)] transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--vogue-accent-ring)]"
        >
          <LogIn className="h-4 w-4 shrink-0" />
          <span className="min-w-0 truncate">{copy.common.signIn}</span>
        </button>
      </LoginWrapper>

      <LocaleLink
        href="/pricing"
        title={copy.common.credits}
        className="vogue-mobile-anonymous-credit-pill inline-flex h-10 w-12 shrink-0 items-center justify-center gap-1 rounded-full text-sm font-semibold text-[#04b874] transition hover:bg-white/64 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--vogue-accent-ring)]"
      >
        <Zap className="h-3.5 w-3.5 fill-[#04e991] text-[#04e991]" />
        <span className="tabular-nums">0</span>
        <span className="sr-only">{copy.common.credits}</span>
      </LocaleLink>
    </div>
  );
}

export default function VogueSidebarShell({
  children,
}: {
  children: ReactNode;
}) {
  const locale = useLocale();
  const messages = useMessages();
  const copy = getVogueCopyFromMessages(messages);
  const rawPathname = useRawPathname();
  const localePathname = useLocalePathname();
  const localeRouter = useLocaleRouter();
  const accountRouteSection = getVogueAccountSectionFromPath(localePathname);
  const [isNarrow, setIsNarrow] = useState(false);
  const [accountSection, setAccountSection] =
    useState<VogueAccountSection>('profile');
  const activeAccountSection = accountRouteSection ?? accountSection;

  useEffect(() => {
    const query = window.matchMedia('(max-width: 640px)');
    const sync = () => setIsNarrow(query.matches);

    sync();
    query.addEventListener('change', sync);

    return () => query.removeEventListener('change', sync);
  }, []);

  const handleAccountSectionChange = (nextSection: VogueAccountSection) => {
    setAccountSection(nextSection);

    if (!accountRouteSection || nextSection === accountRouteSection) return;

    const nextPath = nextSection === 'profile' ? '/profile' : '/billings';
    localeRouter.replace(nextPath, { scroll: false });
  };

  const handleAccountDialogOpenChange = (open: boolean) => {
    if (open || !accountRouteSection) return;
    localeRouter.push('/app', { scroll: false });
  };

  const accountDialog = (
    <VogueAccountDialog
      open={Boolean(accountRouteSection)}
      section={activeAccountSection}
      locale={locale}
      onSectionChange={handleAccountSectionChange}
      onOpenChange={handleAccountDialogOpenChange}
    />
  );

  if (isAuthShellPath(localePathname)) {
    return <>{children}</>;
  }

  if (isPromptDetailRoute(localePathname)) {
    return (
      <div
        className="vogue-shell prompt-detail-shell"
        style={{
          display: 'block',
          minHeight: '100vh',
          background: '#eef4fb',
          color: 'var(--vogue-text)',
        }}
      >
        <div
          className="vogue-shell-content"
          style={{ minWidth: 0, flexBasis: '100%', width: '100%' }}
        >
          {children}
        </div>
        {accountDialog}
      </div>
    );
  }

  if (isNarrow) {
    return (
      <div
        className="vogue-shell"
        style={{
          minHeight: '100vh',
          background: 'var(--vogue-page)',
          color: 'var(--vogue-text)',
        }}
      >
        <header
          className="vogue-mobile-rail min-h-[62px] border-b border-[var(--vogue-sidebar-line)] px-4 py-3 shadow-[0_12px_32px_rgba(72,55,44,0.07)]"
          style={{
            background:
              'linear-gradient(180deg, rgba(255,250,247,0.98), rgba(255,246,240,0.92))',
            fontFamily: 'var(--font-vogue-sans)',
            fontFeatureSettings: '"cv11", "ss01"',
            letterSpacing: 0,
          }}
        >
          <div className="vogue-mobile-rail-row flex min-w-0 items-center justify-between gap-3">
            <LocaleLink
              href="/"
              className="vogue-mobile-brand-link flex min-w-max shrink-0 items-center gap-2 rounded-[10px]"
            >
              <VogueBrandLockup
                className="vogue-mobile-brand-lockup gap-2"
                markClassName="vogue-mobile-brand-mark size-8"
                wordClassName="vogue-mobile-brand-word text-[22px]"
                priority
              />
            </LocaleLink>
            <MobileAccountButton pathname={rawPathname} copy={copy} />
          </div>

          <nav
            aria-label={copy.sidebar.primaryMobileNavigation}
            className="vogue-mobile-primary-nav mt-3 flex gap-2 overflow-x-auto pb-1"
          >
            {mobileLinks.map((link) => {
              const active = isPathMatch(localePathname, link.href);
              const label = getSidebarLabel(link, copy);

              return (
                <LocaleLink
                  key={link.href}
                  href={link.href}
                  aria-label={label}
                  aria-current={active ? 'page' : undefined}
                  data-active={active || undefined}
                  className="vogue-mobile-primary-nav-link inline-flex h-9 shrink-0 items-center justify-center rounded-full border px-3 text-[13px] font-medium transition"
                >
                  {link.icon}
                  <span className="vogue-mobile-primary-nav-label hidden">
                    {label}
                  </span>
                </LocaleLink>
              );
            })}
          </nav>
        </header>

        <div className="vogue-shell-content" style={{ minWidth: 0 }}>
          {children}
        </div>
        {accountDialog}
      </div>
    );
  }

  return (
    <div
      className="vogue-shell"
      style={{
        display: isNarrow ? 'block' : 'flex',
        minHeight: '100vh',
        background: 'var(--vogue-page)',
        color: 'var(--vogue-text)',
      }}
    >
      <aside
        className="vogue-sidebar z-[80] px-4 py-5"
        style={{
          position: isNarrow ? 'relative' : 'sticky',
          top: 0,
          width: isNarrow ? '100%' : 248,
          height: isNarrow ? 'auto' : '100vh',
          flex: isNarrow ? undefined : '0 0 248px',
          borderRight: isNarrow ? 0 : '1px solid var(--vogue-border)',
          borderBottom: isNarrow ? '1px solid var(--vogue-border)' : 0,
          background:
            'linear-gradient(180deg, rgba(255,250,247,0.98), rgba(255,246,240,0.92))',
          fontFamily: 'var(--font-vogue-sans)',
          fontFeatureSettings: '"cv11", "ss01"',
          letterSpacing: 0,
        }}
      >
        <div className="flex h-full flex-col">
          <LocaleLink
            href="/"
            className="flex min-w-max items-center gap-2.5 rounded-[12px] px-1.5 py-1"
          >
            <VogueBrandLockup
              className="gap-2.5"
              markClassName="size-9"
              wordClassName="text-[26px]"
              priority
            />
          </LocaleLink>

          <div className="mt-7 flex-1 space-y-1 overflow-y-auto">
            <NavGroup
              links={primaryLinks}
              pathname={localePathname}
              copy={copy}
            />
            <NavGroup
              title={copy.sidebar.explore}
              links={exploreLinks}
              pathname={localePathname}
              copy={copy}
              withDivider={true}
            />
          </div>

          <SidebarAccount locale={locale} copy={copy} />
        </div>
      </aside>

      <div
        className="vogue-shell-content"
        style={{ minWidth: 0, flex: '1 1 auto' }}
      >
        {children}
      </div>
      {accountDialog}
    </div>
  );
}
