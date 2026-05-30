import {
  DEFAULT_LOCALE,
  LOCALES,
} from '@/i18n/routing';
import { AUTO_BLOG_POSTS } from '@/lib/generated/auto-blog-posts';
import { getUrlWithLocale } from '@/lib/urls/urls';

export type VogueLocale = (typeof LOCALES)[number];

export type BlogArticleTagSlug =
  | 'review'
  | 'comparison'
  | 'tutorial'
  | 'use-case';

export type BlogModelTag = {
  slug: string;
  title: string;
  href: string;
};

export type BlogContentBlock =
  | {
      type: 'paragraph';
      text: string;
    }
  | {
      type: 'heading';
      text: string;
      level?: 2 | 3 | 4;
    }
  | {
      type: 'list';
      items: string[];
    }
  | {
      type: 'table';
      headers: string[];
      rows: string[][];
    }
  | {
      type: 'image';
      src: string;
      alt: string;
      caption?: string;
      width?: number;
      height?: number;
    }
  | {
      type: 'callout';
      title: string;
      text: string;
    };

export type BlogPostLocalization = {
  title: string;
  summary: string;
  content?: BlogContentBlock[];
  seoTitle?: string;
  seoDescription?: string;
};

export type BlogPostSource = {
  slug: string;
  date: string;
  updatedAt?: string;
  author: string;
  image: string;
  imageAlt: string;
  articleType: BlogArticleTagSlug;
  modelTags: string[];
  readingMinutes: number;
  localizations: Record<'en', BlogPostLocalization> &
    Partial<Record<Exclude<VogueLocale, 'en'>, BlogPostLocalization>>;
};

export type BlogPost = BlogPostSource &
  Omit<BlogPostLocalization, 'content'> & {
    content: BlogContentBlock[];
    locale: VogueLocale;
    href: string;
    tagLabel: string;
    modelTagItems: BlogModelTag[];
    availableLocales: VogueLocale[];
  };

export const BLOG_ARTICLE_TAGS: Array<{
  slug: BlogArticleTagSlug;
  labelKey: keyof typeof BLOG_TAG_LABELS.en;
}> = [
  { slug: 'tutorial', labelKey: 'tutorial' },
  { slug: 'use-case', labelKey: 'useCase' },
  { slug: 'comparison', labelKey: 'comparison' },
  { slug: 'review', labelKey: 'review' },
];

export const BLOG_TAG_LABELS = {
  en: {
    all: 'All posts',
    tutorial: 'Tutorial',
    useCase: 'Use case',
    comparison: 'Comparison',
    review: 'Review',
  },
  zh: {
    all: '全部文章',
    tutorial: '教程',
    useCase: '场景',
    comparison: '对比',
    review: '评测',
  },
  fr: {
    all: 'Tous les articles',
    tutorial: 'Tutoriel',
    useCase: "Cas d'usage",
    comparison: 'Comparaison',
    review: 'Avis',
  },
  ru: {
    all: 'Все статьи',
    tutorial: 'Руководство',
    useCase: 'Сценарий',
    comparison: 'Сравнение',
    review: 'Обзор',
  },
  pt: {
    all: 'Todos os posts',
    tutorial: 'Tutorial',
    useCase: 'Caso de uso',
    comparison: 'Comparação',
    review: 'Análise',
  },
  ja: {
    all: 'すべての記事',
    tutorial: 'チュートリアル',
    useCase: '活用例',
    comparison: '比較',
    review: 'レビュー',
  },
  ko: {
    all: '전체 글',
    tutorial: '튜토리얼',
    useCase: '활용 사례',
    comparison: '비교',
    review: '리뷰',
  },
} satisfies Record<VogueLocale, Record<string, string>>;

export const BLOG_PAGE_COPY = {
  en: {
    eyebrow: 'Vogue AI Journal',
    heading: 'Vogue AI Blog',
    subtitle:
      'Learn how to use Vogue AI prompt examples, reference images, and generation tools to quickly create product visuals, posters, avatars, UI mockups, and creative artwork.',
    featured: 'Featured guides',
    categories: 'Topics',
    latest: 'Latest articles',
    readMore: 'Read article',
    by: 'By',
    published: 'Published',
    updated: 'Updated',
    readingTime: 'min read',
    allPosts: 'All posts',
    morePosts: 'More from Vogue AI',
    backToBlog: 'Back to blog',
    tableOfContents: 'In this article',
    noPosts: 'No posts match this topic yet.',
  },
  zh: {
    eyebrow: 'Vogue AI 博客',
    heading: 'Vogue AI 博客',
    subtitle:
      '学习如何使用 Vogue AI 的提示词案例、参考图片和生成工具，快速完成产品图、海报、头像、UI 与创意视觉。',
    featured: '精选指南',
    categories: '主题',
    latest: '最新文章',
    readMore: '阅读全文',
    by: '作者',
    published: '发布',
    updated: '更新',
    readingTime: '分钟阅读',
    allPosts: '全部文章',
    morePosts: '更多 Vogue AI 文章',
    backToBlog: '返回博客',
    tableOfContents: '本文目录',
    noPosts: '这个主题暂时没有文章。',
  },
  fr: {
    eyebrow: 'Journal Vogue AI',
    heading: 'Blog Vogue AI',
    subtitle:
      'Apprenez à utiliser les exemples de prompts, les images de référence et les outils de génération de Vogue AI pour créer rapidement des visuels produit, des affiches, des avatars, des maquettes UI et des créations visuelles.',
    featured: 'Guides à la une',
    categories: 'Sujets',
    latest: 'Derniers articles',
    readMore: "Lire l'article",
    by: 'Par',
    published: 'Publié',
    updated: 'Mis à jour',
    readingTime: 'min de lecture',
    allPosts: 'Tous les articles',
    morePosts: 'Plus de Vogue AI',
    backToBlog: 'Retour au blog',
    tableOfContents: 'Dans cet article',
    noPosts: 'Aucun article pour ce sujet pour le moment.',
  },
  ru: {
    eyebrow: 'Журнал Vogue AI',
    heading: 'Блог Vogue AI',
    subtitle:
      'Узнайте, как использовать примеры промптов Vogue AI, референсные изображения и инструменты генерации, чтобы быстро создавать продуктовые визуалы, постеры, аватары, UI-макеты и креативные изображения.',
    featured: 'Избранные материалы',
    categories: 'Темы',
    latest: 'Новые статьи',
    readMore: 'Читать',
    by: 'Автор',
    published: 'Опубликовано',
    updated: 'Обновлено',
    readingTime: 'мин чтения',
    allPosts: 'Все статьи',
    morePosts: 'Еще от Vogue AI',
    backToBlog: 'Назад в блог',
    tableOfContents: 'В статье',
    noPosts: 'Пока нет статей по этой теме.',
  },
  pt: {
    eyebrow: 'Diário Vogue AI',
    heading: 'Blog Vogue AI',
    subtitle:
      'Aprenda a usar exemplos de prompts, imagens de referência e ferramentas de geração do Vogue AI para criar rapidamente visuais de produto, pôsteres, avatares, mockups de UI e peças criativas.',
    featured: 'Guias em destaque',
    categories: 'Tópicos',
    latest: 'Artigos recentes',
    readMore: 'Ler artigo',
    by: 'Por',
    published: 'Publicado',
    updated: 'Atualizado',
    readingTime: 'min de leitura',
    allPosts: 'Todos os posts',
    morePosts: 'Mais do Vogue AI',
    backToBlog: 'Voltar ao blog',
    tableOfContents: 'Neste artigo',
    noPosts: 'Ainda não há posts para este tópico.',
  },
  ja: {
    eyebrow: 'Vogue AI ブログ',
    heading: 'Vogue AI ブログ',
    subtitle:
      'Vogue AI のプロンプト事例、参考画像、生成ツールを使って、商品ビジュアル、ポスター、アバター、UI、クリエイティブ素材をすばやく作る方法を学べます。',
    featured: '注目ガイド',
    categories: 'トピック',
    latest: '最新記事',
    readMore: '記事を読む',
    by: '著者',
    published: '公開',
    updated: '更新',
    readingTime: '分で読めます',
    allPosts: 'すべての記事',
    morePosts: 'Vogue AI の関連記事',
    backToBlog: 'ブログへ戻る',
    tableOfContents: 'この記事の内容',
    noPosts: 'このトピックの記事はまだありません。',
  },
  ko: {
    eyebrow: 'Vogue AI 블로그',
    heading: 'Vogue AI 블로그',
    subtitle:
      'Vogue AI의 프롬프트 예시, 레퍼런스 이미지, 생성 도구를 활용해 제품 비주얼, 포스터, 아바타, UI, 크리에이티브 이미지를 빠르게 완성하는 방법을 배울 수 있습니다.',
    featured: '추천 가이드',
    categories: '주제',
    latest: '최신 글',
    readMore: '글 읽기',
    by: '작성',
    published: '게시',
    updated: '업데이트',
    readingTime: '분 읽기',
    allPosts: '전체 글',
    morePosts: 'Vogue AI 더 보기',
    backToBlog: '블로그로 돌아가기',
    tableOfContents: '이 글에서',
    noPosts: '아직 이 주제의 글이 없습니다.',
  },
} satisfies Record<VogueLocale, Record<string, string>>;

const MODEL_TAGS: Record<string, BlogModelTag> = {
  'vogue-ai': {
    slug: 'vogue-ai',
    title: 'Vogue AI',
    href: '/',
  },
  'gpt-image-2': {
    slug: 'gpt-image-2',
    title: 'GPT Image 2',
    href: '/?model=gptimage2',
  },
  'nano-banana': {
    slug: 'nano-banana',
    title: 'Nano Banana',
    href: '/?model=nanobanana',
  },
  midjourney: {
    slug: 'midjourney',
    title: 'Midjourney',
    href: '/?model=midjourney',
  },
  'veo-3': {
    slug: 'veo-3',
    title: 'Veo 3',
    href: '/veo-3-generator',
  },
  'ai-baby': {
    slug: 'ai-baby',
    title: 'AI Baby',
    href: '/ai-baby-generator',
  },
};

const localeDateTags: Record<VogueLocale, string> = {
  en: 'en-US',
  zh: 'zh-CN',
  fr: 'fr-FR',
  ru: 'ru-RU',
  pt: 'pt-BR',
  ja: 'ja-JP',
  ko: 'ko-KR',
};

const promptThumbnail = (id: string, index = 0) =>
  `/api/gpt-image-2-prompts/thumbnail?id=${encodeURIComponent(
    id
  )}&index=${index}`;

function normalizeLocale(locale?: string | null): VogueLocale {
  return LOCALES.includes(locale as VogueLocale)
    ? (locale as VogueLocale)
    : DEFAULT_LOCALE;
}

function getLocalizedPostSource(
  post: BlogPostSource,
  locale?: string | null
): Omit<BlogPostLocalization, 'content'> & {
  content: BlogContentBlock[];
  locale: VogueLocale;
} {
  const normalizedLocale = normalizeLocale(locale);
  const fallback = post.localizations.en;
  const localized = post.localizations[normalizedLocale] ?? fallback;

  return {
    ...fallback,
    ...localized,
    content: localized.content ?? fallback.content ?? [],
    locale: normalizedLocale,
  };
}

function getDerivedCoverImage(
  post: BlogPostSource,
  content: BlogContentBlock[]
) {
  const localizedImage = content.find(
    (block): block is Extract<BlogContentBlock, { type: 'image' }> =>
      block.type === 'image'
  );
  const fallbackImage = (post.localizations.en.content ?? []).find(
    (block): block is Extract<BlogContentBlock, { type: 'image' }> =>
      block.type === 'image'
  );
  const coverImage = localizedImage ?? fallbackImage;

  if (!coverImage) {
    return {
      image: post.image,
      imageAlt: post.imageAlt,
    };
  }

  return {
    image: coverImage.src,
    imageAlt: coverImage.alt,
  };
}

function getTagLabel(articleType: BlogArticleTagSlug, locale: VogueLocale) {
  const labelKey =
    BLOG_ARTICLE_TAGS.find((tag) => tag.slug === articleType)?.labelKey ??
    'tutorial';

  return BLOG_TAG_LABELS[locale][labelKey];
}

function toLocalizedPost(post: BlogPostSource, locale?: string | null): BlogPost {
  const localized = getLocalizedPostSource(post, locale);
  const coverImage = getDerivedCoverImage(post, localized.content);
  const modelTagItems = post.modelTags
    .map((tag) => MODEL_TAGS[tag])
    .filter((tag): tag is BlogModelTag => Boolean(tag));

  return {
    ...post,
    ...coverImage,
    ...localized,
    href: getUrlWithLocale(`/blog/${post.slug}`, localized.locale),
    tagLabel: getTagLabel(post.articleType, localized.locale),
    modelTagItems,
    availableLocales: Object.keys(post.localizations) as VogueLocale[],
  };
}

const POSTS: BlogPostSource[] = [...AUTO_BLOG_POSTS];

export const blogPosts = getBlogPosts(DEFAULT_LOCALE);

export function getBlogCopy(locale?: string | null) {
  return BLOG_PAGE_COPY[normalizeLocale(locale)];
}

export function getBlogTagLabels(locale?: string | null) {
  return BLOG_TAG_LABELS[normalizeLocale(locale)];
}

export function getBlogPosts(
  locale?: string | null,
  options?: {
    tag?: BlogArticleTagSlug | null;
  }
) {
  const normalizedLocale = normalizeLocale(locale);
  const posts = POSTS.filter((post) =>
    options?.tag ? post.articleType === options.tag : true
  ).map((post) => toLocalizedPost(post, normalizedLocale));

  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getAllBlogPostSources() {
  return [...POSTS];
}

export function getAvailableBlogArticleTags(locale?: string | null) {
  const normalizedLocale = normalizeLocale(locale);
  const availableTags = new Set(POSTS.map((post) => post.articleType));

  return BLOG_ARTICLE_TAGS.filter((tag) => availableTags.has(tag.slug)).map(
    (tag) => ({
      ...tag,
      label: BLOG_TAG_LABELS[normalizedLocale][tag.labelKey],
      href: getUrlWithLocale(`/blog?tag=${tag.slug}`, normalizedLocale),
    })
  );
}

export function getBlogArticleTagBySlug(slug?: string | null) {
  return BLOG_ARTICLE_TAGS.find((tag) => tag.slug === slug) ?? null;
}

export function getPostBySlug(slug: string, locale?: string | null) {
  const post = POSTS.find((item) => item.slug === slug);
  return post ? toLocalizedPost(post, locale) : undefined;
}

export function getRelatedBlogPosts(post: BlogPost, locale?: string | null) {
  const related = getBlogPosts(locale).filter((item) => item.slug !== post.slug);
  const matching = related.filter(
    (item) =>
      item.articleType === post.articleType ||
      item.modelTags.some((tag) => post.modelTags.includes(tag))
  );

  return [...matching, ...related.filter((item) => !matching.includes(item))]
    .slice(0, 3);
}

export function formatBlogDate(date: string, locale?: string | null) {
  const normalizedLocale = normalizeLocale(locale);

  return new Intl.DateTimeFormat(localeDateTags[normalizedLocale], {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));
}
