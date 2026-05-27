import {
  BillingsPageContent,
  generateBillingsMetadata,
} from '../../billings/page';

type LocalizedBillingsParams = Promise<{
  locale: string;
}>;

export async function generateMetadata({
  params,
}: {
  params: LocalizedBillingsParams;
}) {
  const { locale } = await params;
  return generateBillingsMetadata(locale);
}

export default function LocalizedBillingsPage() {
  return <BillingsPageContent />;
}
