import {
  type BlogContentBlock,
  type BlogPost,
  formatBlogDate,
  getBlogCopy,
  getRelatedBlogPosts,
} from '@/lib/blog-data';
import { getUrlWithLocale } from '@/lib/urls/urls';
import { cn } from '@/lib/utils';
import {
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  Clock3,
  Mail,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

type VogueBlogPostProps = {
  locale: string;
  post: BlogPost;
};

function getBlockId(text: string, index: number) {
  const slug = text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  return slug || `section-${index}`;
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

function renderBlogBlock(
  block: BlogContentBlock,
  index: number,
  locale: string
) {
  if (block.type === 'paragraph') {
    return (
      <p key={index} className="text-[16px] leading-8 text-slate-700">
        {block.text}
      </p>
    );
  }

  if (block.type === 'heading') {
    const id = getBlockId(block.text, index);

    if (block.level === 3) {
      return (
        <h3
          key={index}
          id={id}
          className="scroll-mt-24 pt-2 text-[1.2rem] font-semibold leading-snug text-slate-900"
        >
          {block.text}
        </h3>
      );
    }

    if (block.level === 4) {
      return (
        <h4
          key={index}
          id={id}
          className="scroll-mt-24 text-[1rem] font-semibold leading-snug text-slate-800"
        >
          {block.text}
        </h4>
      );
    }

    return (
      <h2
        key={index}
        id={id}
        className="scroll-mt-24 border-t border-[var(--vogue-border)] pt-7 text-[1.55rem] font-semibold leading-tight text-slate-950 first:border-t-0 first:pt-0"
      >
        {block.text}
      </h2>
    );
  }

  if (block.type === 'list') {
    return (
      <ul
        key={index}
        className="grid gap-3 border-l-2 border-[rgba(79,103,255,0.24)] pl-5 text-[15px] leading-7 text-slate-700"
      >
        {block.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    );
  }

  if (block.type === 'table') {
    return (
      <div
        key={index}
        className="overflow-x-auto rounded-[8px] border border-[var(--vogue-border)] bg-white/80"
      >
        <table className="w-full min-w-[640px] border-collapse text-left text-[14px] leading-6">
          <thead className="bg-[rgba(79,103,255,0.07)] text-[12px] uppercase text-slate-500">
            <tr>
              {block.headers.map((header) => (
                <th
                  key={header}
                  scope="col"
                  className="border-b border-[var(--vogue-border)] px-4 py-3 font-semibold"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--vogue-border)] text-slate-700">
            {block.rows.map((row, rowIndex) => (
              <tr key={`${row.join('-')}-${rowIndex}`}>
                {row.map((cell, cellIndex) => (
                  <td
                    key={`${cell}-${cellIndex}`}
                    className="align-top px-4 py-3"
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (block.type === 'links') {
    return (
      <aside
        key={index}
        className="rounded-[8px] border border-[rgba(79,103,255,0.18)] bg-white/84 p-5 shadow-[0_14px_34px_rgba(72,55,44,0.07)]"
      >
        {block.title ? (
          <p className="text-[13px] font-semibold text-[var(--vogue-accent-strong)]">
            {block.title}
          </p>
        ) : null}
        <div className="mt-3 grid gap-2">
          {block.items.map((item) => {
            const href = item.href.startsWith('/')
              ? getUrlWithLocale(item.href, locale)
              : item.href;
            const isExternal = /^https?:\/\//i.test(item.href);

            return (
              <Link
                key={`${item.href}-${item.label}`}
                href={href}
                className="group flex min-w-0 items-start justify-between gap-3 rounded-[6px] border border-[var(--vogue-border)] bg-[rgba(255,253,251,0.76)] px-3 py-3 transition hover:border-[rgba(79,103,255,0.28)] hover:bg-white"
              >
                <span className="min-w-0">
                  <span className="block text-[14px] font-semibold leading-5 text-slate-900">
                    {item.label}
                  </span>
                  {item.description ? (
                    <span className="mt-1 block text-[13px] leading-5 text-slate-500">
                      {item.description}
                    </span>
                  ) : null}
                </span>
                <ArrowUpRight
                  aria-hidden="true"
                  className={cn(
                    'mt-0.5 h-4 w-4 shrink-0 text-slate-400 transition group-hover:text-[var(--vogue-accent-strong)]',
                    !isExternal && 'rotate-45'
                  )}
                />
              </Link>
            );
          })}
        </div>
      </aside>
    );
  }

  if (block.type === 'image') {
    const width = block.width ?? 1200;
    const height = block.height ?? 720;

    return (
      <figure
        key={index}
        className="overflow-hidden rounded-[8px] border border-[var(--vogue-border)] bg-white/76 shadow-[0_18px_46px_rgba(72,55,44,0.08)]"
      >
        <div
          className="relative mx-auto w-full overflow-hidden bg-[#f8f2ed]"
          style={{
            aspectRatio: `${width} / ${height}`,
            maxHeight: 720,
            maxWidth: width,
          }}
        >
          <Image
            src={block.src}
            alt={block.alt}
            fill
            loading={index <= 6 ? 'eager' : 'lazy'}
            unoptimized={isRemoteBlogImage(block.src)}
            sizes="(min-width: 1280px) 800px, 100vw"
            className="object-contain"
          />
        </div>
        {block.caption ? (
          <figcaption className="border-t border-[var(--vogue-border)] px-4 py-3 text-[13px] leading-6 text-slate-500">
            {block.caption}
          </figcaption>
        ) : null}
      </figure>
    );
  }

  if (block.type === 'video') {
    const width = block.width ?? 1200;
    const height = block.height ?? 720;
    const label = block.title ?? block.caption ?? 'Vogue AI blog video';

    return (
      <figure
        key={index}
        className="overflow-hidden rounded-[8px] border border-[var(--vogue-border)] bg-white/76 shadow-[0_18px_46px_rgba(72,55,44,0.08)]"
      >
        <div
          className="mx-auto w-full overflow-hidden bg-slate-950"
          style={{
            aspectRatio: `${width} / ${height}`,
            maxHeight: 720,
            maxWidth: width,
          }}
        >
          <video
            src={block.src}
            poster={block.poster}
            controls={block.controls ?? true}
            playsInline
            preload="metadata"
            muted={block.muted}
            loop={block.loop}
            autoPlay={block.autoPlay}
            aria-label={label}
            className="h-full w-full object-contain"
          />
        </div>
        {block.caption ? (
          <figcaption className="border-t border-[var(--vogue-border)] px-4 py-3 text-[13px] leading-6 text-slate-500">
            {block.caption}
          </figcaption>
        ) : null}
      </figure>
    );
  }

  return (
    <aside
      key={index}
      className="rounded-[8px] border border-[rgba(79,103,255,0.16)] bg-[rgba(241,237,255,0.72)] p-5 shadow-[0_14px_34px_rgba(79,103,255,0.08)]"
    >
      <p className="text-[13px] font-semibold text-[var(--vogue-accent-strong)]">
        {block.title}
      </p>
      <p className="mt-2 text-[15px] leading-7 text-slate-700">{block.text}</p>
    </aside>
  );
}

function BlogTableOfContents({
  post,
  title,
}: {
  post: BlogPost;
  title: string;
}) {
  const headings = post.content
    .map((block, index) => ({ block, index }))
    .filter(
      (
        item
      ): item is {
        block: Extract<BlogContentBlock, { type: 'heading' }>;
        index: number;
      } => item.block.type === 'heading'
    );

  if (headings.length === 0) return null;

  return (
    <nav
      aria-label={title}
      className="rounded-[8px] border border-[var(--vogue-border)] bg-[rgba(255,253,251,0.78)] p-4 shadow-[0_16px_42px_rgba(72,55,44,0.08)]"
    >
      <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-slate-500">
        {title}
      </p>
      <ol className="mt-3 grid gap-1.5 text-[13px]">
        {headings.map(({ block, index }) => {
          const level = block.level ?? 2;

          return (
            <li
              key={`${block.text}-${index}`}
              className={cn(
                'min-w-0',
                level === 3 && 'pl-4',
                level === 4 && 'pl-8'
              )}
            >
              <a
                href={`#${getBlockId(block.text, index)}`}
                className={cn(
                  'block min-w-0 truncate rounded-[6px] px-2 py-1.5 leading-5 transition hover:bg-white/78 hover:text-slate-950',
                  level === 2 && 'font-semibold text-slate-800',
                  level === 3 &&
                    'border-l border-[rgba(79,103,255,0.24)] text-slate-600',
                  level === 4 &&
                    'border-l border-[var(--vogue-border)] text-[12px] text-slate-500'
                )}
              >
                {block.text}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default function VogueBlogPost({ locale, post }: VogueBlogPostProps) {
  const copy = getBlogCopy(locale);
  const relatedPosts = getRelatedBlogPosts(post, locale);

  return (
    <main className="bg-[var(--vogue-page)] text-slate-950">
      <section className="border-b border-[var(--vogue-border)] bg-[linear-gradient(180deg,#fffaf7_0%,#fbf2ed_100%)] px-4 py-7 sm:px-6 lg:px-8 lg:py-9">
        <div className="mx-auto max-w-7xl">
          <Link
            href={getUrlWithLocale('/blog', locale)}
            className="inline-flex items-center gap-2 text-[13px] font-semibold text-slate-500 transition hover:text-slate-950"
          >
            <ArrowLeft className="h-4 w-4" />
            {copy.backToBlog}
          </Link>

          <div className="mt-4 max-w-6xl">
            <div>
              <div className="flex flex-wrap items-center gap-2 text-[12px] font-semibold text-slate-500">
                <Link
                  href={`${getUrlWithLocale('/blog', locale)}?tag=${post.articleType}`}
                  className="rounded-full border border-[rgba(79,103,255,0.18)] bg-[rgba(79,103,255,0.07)] px-2.5 py-1 text-[var(--vogue-accent-strong)]"
                >
                  {post.tagLabel}
                </Link>
                <span aria-hidden="true">/</span>
                <span className="inline-flex items-center gap-1">
                  <CalendarDays className="h-3.5 w-3.5" />
                  {copy.published} {formatBlogDate(post.date, locale)}
                </span>
                <span aria-hidden="true">/</span>
                <span className="inline-flex items-center gap-1">
                  <Clock3 className="h-3.5 w-3.5" />
                  {post.readingMinutes} {copy.readingTime}
                </span>
              </div>

              <h1 className="mt-3 max-w-6xl text-[2.35rem] font-semibold leading-[1.08] text-slate-950 sm:text-[3rem] lg:text-[3.35rem]">
                {post.title}
              </h1>
              <p className="mt-3 max-w-5xl text-[17px] leading-8 text-slate-600">
                {post.summary}
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-3 text-[13px] text-slate-500">
                <span>
                  {copy.by} {post.author}
                </span>
                {post.updatedAt ? (
                  <>
                    <span aria-hidden="true">/</span>
                    <span>
                      {copy.updated} {formatBlogDate(post.updatedAt, locale)}
                    </span>
                  </>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[minmax(0,800px)_minmax(280px,1fr)] lg:items-start">
          <article className="min-w-0 rounded-[8px] border border-[var(--vogue-border)] bg-[rgba(255,253,251,0.84)] px-5 py-7 shadow-[0_18px_50px_rgba(72,55,44,0.08)] sm:px-8 sm:py-9">
            <div className="blog-article-flow grid gap-6">
              {post.content.map((block, index) =>
                renderBlogBlock(block, index, locale)
              )}
            </div>
          </article>

          <aside className="grid gap-4 lg:sticky lg:top-24">
            <div className="max-h-[calc(100vh-8rem)] overflow-y-auto">
              <BlogTableOfContents post={post} title={copy.tableOfContents} />
            </div>
          </aside>
        </div>
      </section>

      {relatedPosts.length > 0 ? (
        <section className="border-t border-[var(--vogue-border)] px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
          <div className="mx-auto max-w-7xl">
            <div className="mb-5 flex items-center gap-2">
              <Mail className="h-4 w-4 text-[var(--vogue-accent-strong)]" />
              <h2 className="text-[1.15rem] font-semibold text-slate-950">
                {copy.morePosts}
              </h2>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.slug}
                  href={relatedPost.href}
                  className="group rounded-[8px] border border-[var(--vogue-border)] bg-[rgba(255,253,251,0.8)] p-4 shadow-[0_14px_34px_rgba(72,55,44,0.07)] transition hover:-translate-y-0.5 hover:border-[rgba(79,103,255,0.22)]"
                >
                  <span className="text-[12px] font-semibold text-[var(--vogue-accent-strong)]">
                    {relatedPost.tagLabel}
                  </span>
                  <h3 className="mt-3 text-[1.05rem] font-semibold leading-snug text-slate-950">
                    {relatedPost.title}
                  </h3>
                  <p className="mt-2 line-clamp-3 text-[13px] leading-6 text-slate-600">
                    {relatedPost.summary}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </main>
  );
}
