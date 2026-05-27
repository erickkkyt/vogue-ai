import {
  generateTermsOfServiceMetadata,
  TermsOfServicePageContent,
} from '../../terms-of-service/page';

type LocalizedTermsOfServiceParams = Promise<{
  locale: string;
}>;

export async function generateMetadata({
  params,
}: {
  params: LocalizedTermsOfServiceParams;
}) {
  const { locale } = await params;
  return generateTermsOfServiceMetadata(locale);
}

export default async function LocalizedTermsOfServicePage({
  params,
}: {
  params: LocalizedTermsOfServiceParams;
}) {
  const { locale } = await params;
  return <TermsOfServicePageContent locale={locale} />;
}
