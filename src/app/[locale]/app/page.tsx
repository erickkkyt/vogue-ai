import { AppPageContent, generateAppMetadata } from '../../app/page';

type LocalizedAppParams = Promise<{
  locale: string;
}>;

export async function generateMetadata({
  params,
}: {
  params: LocalizedAppParams;
}) {
  const { locale } = await params;
  return generateAppMetadata(locale);
}

export default function LocalizedAppPage() {
  return <AppPageContent />;
}
