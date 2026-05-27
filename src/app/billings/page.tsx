import { VogueAccountRouteSurface } from '@/components/account/VogueAccountRouteSurface';
import { normalizeVogueLocale, type VogueLocale } from '@/i18n/vogue';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

const billingsMetadataCopy: Record<VogueLocale, string> = {
  en: 'Billing & Credits',
  zh: '账单与积分',
  fr: 'Facturation et crédits',
  ru: 'Оплата и кредиты',
  pt: 'Cobrança e créditos',
  ja: '請求とクレジット',
  ko: '청구 및 크레딧',
};

export async function generateBillingsMetadata(
  localeValue: string
): Promise<Metadata> {
  const locale = normalizeVogueLocale(localeValue);

  return {
    title: `${billingsMetadataCopy[locale]} - Vogue AI`,
    robots: {
      index: false,
      follow: false,
    },
  };
}

export function generateMetadata(): Promise<Metadata> {
  return generateBillingsMetadata('en');
}

export function BillingsPageContent() {
  return <VogueAccountRouteSurface route="/billings" />;
}

export default function BillingsFallbackPage() {
  redirect('/en/billings');
}
