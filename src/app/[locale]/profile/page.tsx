import { generateProfileMetadata, ProfilePageContent } from '../../profile/page';

type LocalizedProfileParams = Promise<{
  locale: string;
}>;

export async function generateMetadata({
  params,
}: {
  params: LocalizedProfileParams;
}) {
  const { locale } = await params;
  return generateProfileMetadata(locale);
}

export default function LocalizedProfilePage() {
  return <ProfilePageContent />;
}
