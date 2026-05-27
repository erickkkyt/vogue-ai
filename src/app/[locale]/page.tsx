import { generateHomeMetadata, HomePage } from '../page';

type LocalizedHomeParams = Promise<{
  locale: string;
}>;

type LocalizedHomeSearchParams = Promise<{
  model?: string | string[];
  category?: string | string[];
}>;

export async function generateMetadata({
  params,
}: {
  params: LocalizedHomeParams;
}) {
  const { locale } = await params;
  return generateHomeMetadata(locale);
}

export default async function LocalizedHomePage({
  params,
  searchParams,
}: {
  params: LocalizedHomeParams;
  searchParams?: LocalizedHomeSearchParams;
}) {
  const { locale } = await params;
  return <HomePage locale={locale} searchParams={searchParams} />;
}
