import ImageWorkspace from '@/components/app/ImageWorkspace';
import { getVogueCopyFromMessages } from '@/i18n/vogue';
import { getLanguageAlternates, getUrlWithLocale } from '@/lib/urls/urls';
import type { Metadata } from 'next';
import { getMessages } from 'next-intl/server';
import { redirect } from 'next/navigation';

const APP_PATH = '/app';

export async function generateAppMetadata(locale: string): Promise<Metadata> {
  const copy = getVogueCopyFromMessages(await getMessages({ locale }));

  return {
    title: `${copy.common.app} - Vogue AI`,
    description: copy.home.metaDescription,
    alternates: {
      canonical: getUrlWithLocale(APP_PATH, locale),
      languages: getLanguageAlternates(APP_PATH),
    },
  };
}

export function generateMetadata(): Promise<Metadata> {
  return generateAppMetadata('en');
}

export function AppPageContent() {
  return (
    <div className="min-h-screen bg-[var(--vogue-page)] text-slate-950">
      <ImageWorkspace />
    </div>
  );
}

export default function AppFallbackPage() {
  redirect('/en/app');
}
