import {
  generatePrivacyPolicyMetadata,
  PrivacyPolicyPageContent,
} from '../../privacy-policy/page';

type LocalizedPrivacyPolicyParams = Promise<{
  locale: string;
}>;

export async function generateMetadata({
  params,
}: {
  params: LocalizedPrivacyPolicyParams;
}) {
  const { locale } = await params;
  return generatePrivacyPolicyMetadata(locale);
}

export default async function LocalizedPrivacyPolicyPage({
  params,
}: {
  params: LocalizedPrivacyPolicyParams;
}) {
  const { locale } = await params;
  return <PrivacyPolicyPageContent locale={locale} />;
}
