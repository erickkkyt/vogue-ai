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
      return block.caption ?? block.alt;
    })
    .join(' ')
    .slice(0, 5000);
}

function getFaqEntriesFromBlocks(blocks: BlogContentBlock[]) {
  const entries: Array<{ question: string; answer: string }> = [];
  let inFaqSection = false;
  let currentQuestion: string | null = null;
  let currentAnswer: string[] = [];

  const flushEntry = () => {
    if (currentQuestion && currentAnswer.length > 0) {
      entries.push({
        question: currentQuestion,
        answer: currentAnswer.join(' '),
      });
    }

    currentQuestion = null;
    currentAnswer = [];
  };

  for (const block of blocks) {
    if (block.type !== 'heading') {
      if (inFaqSection && currentQuestion && block.type === 'paragraph') {
        currentAnswer.push(block.text);
      }
      continue;
    }

    if (block.level === 2 && block.text.toLowerCase() === 'faq') {
      inFaqSection = true;
      continue;
    }

    if (!inFaqSection) {
      continue;
    }

    if (block.level === 2) {
      flushEntry();
      break;
    }

    if (block.level === 3) {
      flushEntry();
      currentQuestion = block.text;
    }
  }

  flushEntry();
  return entries;
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
  const faqEntries = getFaqEntriesFromBlocks(post.content);
  const faqJsonLd =
    faqEntries.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqEntries.map((entry) => ({
            '@type': 'Question',
            name: entry.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: entry.answer,
            },
          })),
        }
      : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleJsonLd).replace(/</g, '\\u003c'),
        }}
      />
      {faqJsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqJsonLd).replace(/</g, '\\u003c'),
          }}
        />
      ) : null}
      <VogueBlogPost locale={locale} post={post} />
    </>
  );
}
