import ImageWorkspace from '@/components/app/ImageWorkspace';
import VogueSidebarShell from '@/components/app/VogueSidebarShell';
import { getVogueCopyFromMessages } from '@/i18n/vogue';
import { getLanguageAlternates, getUrlWithLocale } from '@/lib/urls/urls';
import { PricingDialogProvider } from '@/components/pricing/PricingDialogProvider';
import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

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

export default async function AppFallbackPage() {
  const messages = await getMessages({ locale: 'en' });

  return (
    <NextIntlClientProvider locale="en" messages={messages}>
      <PricingDialogProvider>
        <VogueSidebarShell>
          <AppPageContent />
        </VogueSidebarShell>
      </PricingDialogProvider>
    </NextIntlClientProvider>
  );
}
