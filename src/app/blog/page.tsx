import type { Metadata } from 'next';
import BlogListPage, {
  generateMetadata as generateLocalizedMetadata,
} from '../[locale]/blog/page';

type BlogPageSearchParams = Promise<{
  tag?: string | string[];
}>;

export function generateMetadata(): Promise<Metadata> {
  return generateLocalizedMetadata({
    params: Promise.resolve({ locale: 'en' }),
  });
}

export default function BlogFallbackPage({
  searchParams,
}: {
  searchParams?: BlogPageSearchParams;
}) {
  return BlogListPage({
    params: Promise.resolve({ locale: 'en' }),
    searchParams,
  });
}
