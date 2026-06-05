import { generateHomeMetadata, HomePage } from '../page';

type LocalizedHomeParams = Promise<{
  locale: string;
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
}: {
  params: LocalizedHomeParams;
}) {
  const { locale } = await params;
  return <HomePage locale={locale} />;
}
