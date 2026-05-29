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
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <NextIntlClientProvider locale="en" messages={messages}>
          <PricingDialogProvider>
            <VogueSidebarShell>{children}</VogueSidebarShell>
          </PricingDialogProvider>
        </NextIntlClientProvider>
        <div id="portal-root" />
      </body>
    </html>
  );
}
