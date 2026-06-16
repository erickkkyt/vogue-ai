import AppQueryProvider from '@/components/app/AppQueryProvider';
import VogueSidebarShell from '@/components/app/VogueSidebarShell';
import { PricingDialogProvider } from '@/components/pricing/PricingDialogProvider';
import { NextIntlClientProvider } from 'next-intl';
import type { ReactNode } from 'react';

import messages from '../../messages/en.json';

interface NonPromptStandaloneLayoutProps {
  children: ReactNode;
}

export default function NonPromptStandaloneLayout({
  children,
}: NonPromptStandaloneLayoutProps) {
  return (
    <NextIntlClientProvider locale="en" messages={messages}>
      <PricingDialogProvider>
        <AppQueryProvider>
          <VogueSidebarShell>{children}</VogueSidebarShell>
        </AppQueryProvider>
      </PricingDialogProvider>
    </NextIntlClientProvider>
  );
}
