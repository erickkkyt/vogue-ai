import { redirect } from 'next/navigation';

type PricingRedirectSearchParams = {
  pricing?: string | string[];
  pricingTab?: string | string[];
  tab?: string | string[];
};

function getFirstSearchValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function normalizePricingTab(value: string | undefined) {
  if (value === 'monthly' || value === 'yearly') return value;
  if (value === 'one-time' || value === 'credits' || value === 'credit-packs') {
    return 'one-time';
  }
  return null;
}

function buildPricingRedirectSearch(params: PricingRedirectSearchParams = {}) {
  const search = new URLSearchParams({ pricing: '1' });
  const requestedTab =
    normalizePricingTab(getFirstSearchValue(params.tab)) ??
    normalizePricingTab(getFirstSearchValue(params.pricingTab)) ??
    normalizePricingTab(getFirstSearchValue(params.pricing));

  if (requestedTab) {
    search.set('tab', requestedTab);
  }

  return search.toString();
}

export default async function LocalizedPricingRedirectPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<PricingRedirectSearchParams>;
}) {
  const { locale } = await params;
  const search = buildPricingRedirectSearch(
    searchParams ? await searchParams : undefined
  );

  redirect(`/${locale}?${search}`);
}
