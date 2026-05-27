import { getPostBySlug } from '@/lib/blog-data';
import { getUrlWithLocale } from '@/lib/urls/urls';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

type BlogPostPageParams = Promise<{
  slug: string;
}>;

export async function generateMetadata({
  params,
}: {
  params: BlogPostPageParams;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug, 'en');

  return {
    title: post?.seoTitle ?? post?.title ?? 'Vogue AI Blog',
    description: post?.seoDescription ?? post?.summary,
    alternates: {
      canonical: getUrlWithLocale(`/blog/${slug}`, 'en'),
    },
    robots: {
      index: false,
      follow: true,
    },
  };
}

export default async function BlogPostFallbackPage({
  params,
}: {
  params: BlogPostPageParams;
}) {
  const { slug } = await params;

  redirect(`/en/blog/${slug}`);
}
