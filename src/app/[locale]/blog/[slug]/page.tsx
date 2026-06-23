import VogueBlogPost from '@/components/blog/VogueBlogPost';
import {
  getAllBlogPostSources,
  getPostBySlug,
  type BlogContentBlock,
} from '@/lib/blog-data';
import { getLanguageAlternates, getUrlWithLocale } from '@/lib/urls/urls';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

type BlogPostPageParams = Promise<{
  locale: string;
  slug: string;
}>;

function getPlainTextFromBlocks(blocks: BlogContentBlock[]) {
  return blocks
    .map((block) => {
      if (block.type === 'paragraph') return block.text;
      if (block.type === 'heading') return block.text;
      if (block.type === 'callout') return `${block.title}. ${block.text}`;
      if (block.type === 'list') return block.items.join(' ');
      if (block.type === 'table') {
        return [
          block.headers.join(' '),
          ...block.rows.map((row) => row.join(' ')),
        ].join(' ');
      }
      if (block.type === 'image') return block.caption ?? block.alt;
      if (block.type === 'video') return block.caption ?? block.title ?? '';
      return '';
    })
    .join(' ')
    .slice(0, 5000);
}

export function generateStaticParams() {
  return getAllBlogPostSources().map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: BlogPostPageParams;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = getPostBySlug(slug, locale);

  if (!post) {
    return {
      title: 'Post Not Found - Vogue AI Blog',
    };
  }

  const title = post.seoTitle ?? `${post.title} | Vogue AI Blog`;
  const description = post.seoDescription ?? post.summary;
  const localizedPath = getUrlWithLocale(`/blog/${post.slug}`, locale);

  return {
    title,
    description,
    alternates: {
      canonical: localizedPath,
      languages: getLanguageAlternates(`/blog/${post.slug}`),
    },
    openGraph: {
      title,
      description,
      url: localizedPath,
      type: 'article',
      publishedTime: post.date,
      modifiedTime: post.updatedAt,
      authors: [post.author],
      images: [
        {
          url: post.image,
          alt: post.imageAlt,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [post.image],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: BlogPostPageParams;
}) {
  const { locale, slug } = await params;
  const post = getPostBySlug(slug, locale);

  if (!post) {
    notFound();
  }

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.summary,
    datePublished: post.date,
    dateModified: post.updatedAt ?? post.date,
    author: {
      '@type': 'Organization',
      name: post.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Vogue AI',
      logo: {
        '@type': 'ImageObject',
        url: 'https://vogueai.net/logo/logo.png',
      },
    },
    image: post.image,
    mainEntityOfPage: `https://vogueai.net${getUrlWithLocale(
      `/blog/${post.slug}`,
      locale
    )}`,
    articleBody: getPlainTextFromBlocks(post.content),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleJsonLd).replace(/</g, '\\u003c'),
        }}
      />
      <VogueBlogPost locale={locale} post={post} />
    </>
  );
}
