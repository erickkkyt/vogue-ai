import { defineRouting } from 'next-intl/routing';

export const DEFAULT_LOCALE = 'en';
export const LOCALES = ['en', 'zh', 'fr', 'ru', 'pt', 'ja', 'ko'] as const;
export const LOCALE_COOKIE_NAME = 'NEXT_LOCALE';

export const routing = defineRouting({
  locales: LOCALES,
  defaultLocale: DEFAULT_LOCALE,
  localeDetection: true,
  alternateLinks: true,
  localeCookie: {
    name: LOCALE_COOKIE_NAME,
  },
  localePrefix: 'as-needed',
});
