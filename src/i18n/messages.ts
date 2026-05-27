import type { Locale, Messages } from 'next-intl';
import enMessages from '../../messages/en.json';
import frMessages from '../../messages/fr.json';
import jaMessages from '../../messages/ja.json';
import koMessages from '../../messages/ko.json';
import ptMessages from '../../messages/pt.json';
import ruMessages from '../../messages/ru.json';
import zhMessages from '../../messages/zh.json';
import { routing } from './routing';

const asMessages = (value: unknown): Messages =>
  value && typeof value === 'object' ? (value as Messages) : {};

const messagesCatalog: Record<string, Messages> = {
  en: asMessages(enMessages),
  fr: asMessages(frMessages),
  ja: asMessages(jaMessages),
  ko: asMessages(koMessages),
  pt: asMessages(ptMessages),
  ru: asMessages(ruMessages),
  zh: asMessages(zhMessages),
};

export const defaultMessages: Messages =
  messagesCatalog[routing.defaultLocale] ?? asMessages(enMessages);

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const mergeMessages = (base: Messages, override: Messages): Messages => {
  const merge = (left: unknown, right: unknown): unknown => {
    if (Array.isArray(right)) return right;
    if (!isRecord(left) || !isRecord(right)) return right ?? left;

    return Object.keys({ ...left, ...right }).reduce<Record<string, unknown>>(
      (next, key) => {
        next[key] = key in right ? merge(left[key], right[key]) : left[key];
        return next;
      },
      {}
    );
  };

  return asMessages(merge(base, override));
};

export async function getMessagesForLocale(locale: Locale | string) {
  const normalizedLocale = routing.locales.includes(
    locale as (typeof routing.locales)[number]
  )
    ? locale
    : routing.defaultLocale;
  const localeMessages =
    messagesCatalog[normalizedLocale] ?? messagesCatalog[routing.defaultLocale];

  if (normalizedLocale === routing.defaultLocale) {
    return localeMessages;
  }

  return mergeMessages(defaultMessages, localeMessages);
}
