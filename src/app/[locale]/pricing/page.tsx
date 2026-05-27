import { redirect } from 'next/navigation';

export default async function LocalizedPricingRedirectPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  redirect(`/${locale}?pricing=1`);
}
