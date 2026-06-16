import type { Metadata } from 'next';
import BlogPostPage, {
  generateMetadata as generateLocalizedMetadata,
  generateStaticParams,
} from '../../[locale]/blog/[slug]/page';

export { generateStaticParams };

type BlogPostPageParams = Promise<{
  slug: string;
}>;

export async function generateMetadata({
  params,
}: {
  params: BlogPostPageParams;
}): Promise<Metadata> {
  const { slug } = await params;

  return generateLocalizedMetadata({
    params: Promise.resolve({ locale: 'en', slug }),
  });
}

export default async function BlogPostFallbackPage({
  params,
}: {
  params: BlogPostPageParams;
}) {
  const { slug } = await params;

  return BlogPostPage({
    params: Promise.resolve({ locale: 'en', slug }),
  });
}
