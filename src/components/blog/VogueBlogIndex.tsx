import { VogueBrandWord } from '@/components/common/VogueBrand';
import {
  type BlogArticleTagSlug,
  type BlogPost,
  formatBlogDate,
  getAvailableBlogArticleTags,
  getBlogCopy,
  getBlogPosts,
  getBlogTagLabels,
} from '@/lib/blog-data';
import { getUrlWithLocale } from '@/lib/urls/urls';
import { cn } from '@/lib/utils';
import {
  ArrowRight,
  CalendarDays,
  Clock3,
  UserRound,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

type VogueBlogIndexProps = {
  locale: string;
  selectedTag?: BlogArticleTagSlug | null;
};

function getTagHref(locale: string, tag?: BlogArticleTagSlug | null) {
  const baseHref = getUrlWithLocale('/blog', locale);
  return tag ? `${baseHref}?tag=${tag}` : baseHref;
}

function isRemoteBlogImage(src: string) {
  return (
    src.startsWith(
      'https://pub-911e4fa03f0c4323a80d8f3dc99d1c7f.r2.dev/prompt-libraries/'
    ) ||
    src.startsWith('https://media.vogueai.net/prompt-libraries/') ||
    src.startsWith('https://media.vogueai.net/blog/auto/')
  );
}

function BlogPostCard({
  post,
  locale,
}: {
  post: BlogPost;
  locale: string;
}) {
  const copy = getBlogCopy(locale);

  return (
    <article className="group grid h-[320px] overflow-hidden rounded-[8px] border border-[var(--vogue-border)] bg-[rgba(255,253,251,0.82)] shadow-[0_12px_28px_rgba(72,55,44,0.06)] transition duration-200 hover:-translate-y-0.5 hover:border-[rgba(79,103,255,0.22)] hover:shadow-[0_18px_38px_rgba(72,55,44,0.1)] md:h-[202px] md:grid-cols-[200px_minmax(0,1fr)]">
      <div className="relative h-[128px] overflow-hidden bg-[#efe4dd] md:h-full">
        <Link
          href={post.href}
          className="absolute inset-0 block"
          aria-label={post.title}
        >
          <Image
            src={post.image}
            alt={post.imageAlt}
            fill
            sizes="(min-width: 768px) 200px, 100vw"
            unoptimized={isRemoteBlogImage(post.image)}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.025]"
          />
        </Link>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-slate-950/42 via-slate-950/12 to-transparent" />
        <Link
          href={getTagHref(locale, post.articleType)}
          className="absolute bottom-3 left-3 z-10 inline-flex max-w-[calc(100%-1.5rem)] items-center rounded-full border border-white/48 bg-white/90 px-2.5 py-1 text-[11px] font-semibold leading-none text-slate-950 shadow-[0_10px_24px_rgba(15,23,42,0.16)] backdrop-blur transition hover:bg-white"
        >
          <span className="truncate">{post.tagLabel}</span>
        </Link>
      </div>

      <div className="flex min-h-0 min-w-0 flex-col p-4">
        <Link href={post.href} className="block min-w-0">
          <h2 className="line-clamp-2 text-[1.08rem] font-semibold leading-tight text-slate-950 sm:text-[1.16rem]">
            {post.title}
          </h2>
          <p className="mt-1.5 line-clamp-2 text-[14px] leading-5 text-slate-600">
            {post.summary}
          </p>
        </Link>

        <div className="mt-auto flex flex-col gap-1.5 border-t border-[var(--vogue-border)] pt-2.5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-[12px] text-slate-500">
            <span className="inline-flex min-w-0 items-center gap-1.5 font-medium text-slate-600">
              <UserRound className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{post.author}</span>
            </span>
            <span aria-hidden="true" className="text-slate-300">
              &middot;
            </span>
            <time
              dateTime={post.date}
              className="inline-flex items-center gap-1.5"
            >
              <CalendarDays className="h-3.5 w-3.5 shrink-0" />
              {formatBlogDate(post.date, locale)}
            </time>
            <span aria-hidden="true" className="text-slate-300">
              &middot;
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock3 className="h-3.5 w-3.5 shrink-0" />
              {post.readingMinutes} {copy.readingTime}
            </span>
          </div>
          <Link
            href={post.href}
            className="inline-flex shrink-0 items-center gap-1.5 text-[13px] font-semibold text-slate-950 transition hover:text-[var(--vogue-accent-strong)]"
          >
            {copy.readMore}
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function VogueBlogIndex({
  locale,
  selectedTag,
}: VogueBlogIndexProps) {
  const copy = getBlogCopy(locale);
  const tagLabels = getBlogTagLabels(locale);
  const posts = getBlogPosts(locale, { tag: selectedTag });
  const availableTags = getAvailableBlogArticleTags(locale);
  const tagOptions = [
    {
      slug: null,
      label: tagLabels.all,
      href: getTagHref(locale),
    },
    ...availableTags.map((tag) => ({
      slug: tag.slug,
      label: tag.label ?? tagLabels[tag.labelKey],
      href: getTagHref(locale, tag.slug),
    })),
  ];

  return (
    <div className="bg-[var(--vogue-page)] text-slate-950">
      <section className="px-4 pb-6 pt-8 sm:px-6 lg:px-8 lg:pb-7 lg:pt-10">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-5xl text-center">
            <h1 className="mx-auto max-w-5xl leading-none text-slate-950">
              <VogueBrandWord
                className="text-[2.65rem] sm:text-[4.1rem] lg:text-[4.75rem]"
                text={copy.heading}
              />
            </h1>
            <p className="mx-auto mt-4 max-w-3xl text-[16px] leading-7 text-slate-600 sm:text-[17px]">
              {copy.subtitle}
            </p>

            <nav
              aria-label={copy.categories}
              className="mx-auto mt-7 flex max-w-full gap-2 overflow-x-auto pb-1 sm:justify-center"
            >
              {tagOptions.map((tag) => {
                const active = selectedTag
                  ? tag.slug === selectedTag
                  : tag.slug === null;

                return (
                  <Link
                    key={tag.slug ?? 'all'}
                    href={tag.href}
                    className={cn(
                      'shrink-0 whitespace-nowrap rounded-[8px] border px-5 py-2.5 text-[14px] font-semibold transition sm:px-6',
                      active
                        ? 'border-slate-950 bg-slate-950 text-white'
                        : 'border-[var(--vogue-border)] bg-white/76 text-slate-600 hover:border-[rgba(79,103,255,0.22)] hover:text-slate-950'
                    )}
                  >
                    {tag.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </section>

      <section className="px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="mx-auto max-w-7xl">
          <div>
            <h2 className="mb-4 text-[1.08rem] font-semibold text-slate-950">
              {selectedTag
                ? tagOptions.find((tag) => tag.slug === selectedTag)?.label
                : copy.featured}
            </h2>

            {posts.length > 0 ? (
              <div className="grid gap-5">
                {posts.map((post) => (
                  <BlogPostCard key={post.slug} locale={locale} post={post} />
                ))}
              </div>
            ) : (
              <div className="rounded-[8px] border border-[var(--vogue-border)] bg-white/70 p-10 text-center text-slate-500">
                {copy.noPosts}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
