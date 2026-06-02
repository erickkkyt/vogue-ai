'use client';

import { useEffect } from 'react';

export function HtmlLangEffect({ locale }: { locale: string }) {
  useEffect(() => {
    const previousLang = document.documentElement.lang;

    document.documentElement.lang = locale;

    return () => {
      document.documentElement.lang = previousLang || 'en';
    };
  }, [locale]);

  return null;
}
