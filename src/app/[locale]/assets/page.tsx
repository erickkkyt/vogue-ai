import { AssetsPageContent, generateAssetsMetadata } from '../../assets/page';

type LocalizedAssetsParams = Promise<{
  locale: string;
}>;

type LocalizedAssetsSearchParams = Promise<{
  limit?: string;
}>;

export async function generateMetadata({
  params,
}: {
  params: LocalizedAssetsParams;
}) {
  const { locale } = await params;
  return generateAssetsMetadata(locale);
}

export default async function LocalizedAssetsPage({
  params,
  searchParams,
}: {
  params: LocalizedAssetsParams;
  searchParams: LocalizedAssetsSearchParams;
}) {
  const { locale } = await params;
  return <AssetsPageContent locale={locale} searchParams={searchParams} />;
}
