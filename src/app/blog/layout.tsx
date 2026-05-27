import Footer from '@/components/common/Footer';
import { NextIntlClientProvider } from 'next-intl';
import messages from '../../../messages/en.json';

export default function BlogFallbackLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NextIntlClientProvider locale="en" messages={messages}>
      <div className="flex min-h-screen flex-col">
        <main className="flex-grow bg-[var(--vogue-page)]">{children}</main>
        <Footer />
      </div>
    </NextIntlClientProvider>
  );
}
