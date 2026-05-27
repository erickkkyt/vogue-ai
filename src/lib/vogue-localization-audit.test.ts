import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';

import { getVogueAccountCopy } from '@/components/account/VogueAccountCenter';
import {
  BLOG_PAGE_COPY,
  BLOG_TAG_LABELS,
  getAllBlogPostSources,
} from '@/lib/blog-data';
import {
  getLocalizedPromptGalleryEntries,
  getPromptEntryById,
} from '@/lib/prompts';
import { LOCALES } from '@/i18n/routing';
import {
  getVogueCopyFromMessages,
  SUPPORTED_VOGUE_LOCALES,
  type VogueLocale,
  type VogueUICopy,
} from '@/i18n/vogue';
import type { Messages } from 'next-intl';

const root = process.cwd();
const read = (path: string) => readFileSync(join(root, path), 'utf8');
const readVogueCopy = (locale: VogueLocale): VogueUICopy =>
  getVogueCopyFromMessages(
    JSON.parse(read(`messages/${locale}.json`)) as Messages
  );
const nonEnglishLocales = LOCALES.filter(
  (locale): locale is Exclude<VogueLocale, 'en'> => locale !== 'en'
);

const flattenStrings = (
  value: unknown,
  prefix = ''
): Array<[path: string, text: string]> => {
  if (typeof value === 'string') return [[prefix, value]];
  if (!value || typeof value !== 'object') return [];
  if (Array.isArray(value)) {
    return value.flatMap((item, index) =>
      flattenStrings(item, `${prefix}[${index}]`)
    );
  }

  return Object.entries(value).flatMap(([key, nextValue]) =>
    flattenStrings(nextValue, prefix ? `${prefix}.${key}` : key)
  );
};

const extractProtectedTokens = (text: string) => [
  ...text.matchAll(/\{[^}\n]+\}/g),
  ...text.matchAll(/\[[^\]\n]+\]/g),
  ...text.matchAll(/--[a-z][a-z-]*/gi),
  ...text.matchAll(/\b\d+k\b/gi),
  ...text.matchAll(/\b\d+\s*x\s*\d+\b/gi),
].map((match) => match[0]);

const fallbackBrandAllowlist = [
  'Vogue AI',
  'GPT Image',
  'GPT Image 2',
  'GPTIMG2 AI',
  'Nano Banana',
  'Midjourney',
  'Veo 3',
  'Hailuo AI',
  'Seedance',
  'LipSync',
  'Stripe',
  'ZPAY',
  'Alipay',
  'WeChat Pay',
  'KIE',
  'AI302',
  'SaaS',
  'Web/App',
  'AI Baby Generator',
  'AI Baby Podcast',
  'URL',
];

const exactFallbackTermAllowlist = new Set([
  'AI',
  'Blog',
  'Prompt',
  'Prompts',
  'prompts',
  'Type',
  'Commerce',
  'Design',
  'Avatar',
  'Anime',
  'Photo',
  'Art',
  'Illustration',
  'Image',
  'image',
  'images',
  'Source',
  'Basic',
  'Pro',
  'Creator',
  'Elite',
]);

const hasUnallowedEnglishWords = (text: string) => {
  const stripped = fallbackBrandAllowlist.reduce(
    (nextText, term) => nextText.replaceAll(term, ''),
    text
  );

  if (exactFallbackTermAllowlist.has(stripped.trim())) return false;

  return /[A-Za-z]{3,}/.test(stripped);
};

test('Vogue UI copy exposes the same key paths for every supported locale', () => {
  const englishPaths = flattenStrings(readVogueCopy('en')).map(([path]) => path);

  for (const locale of SUPPORTED_VOGUE_LOCALES) {
    const localizedPaths = flattenStrings(readVogueCopy(locale)).map(
      ([path]) => path
    );

    assert.deepEqual(
      localizedPaths,
      englishPaths,
      `${locale} Vogue message key paths differ from English`
    );
  }
});

test('Vogue UI copy is sourced from locale message catalogs', () => {
  for (const locale of SUPPORTED_VOGUE_LOCALES) {
    const messages = JSON.parse(read(`messages/${locale}.json`)) as {
      Vogue?: unknown;
    };

    assert.deepEqual(
      messages.Vogue,
      readVogueCopy(locale),
      `${locale} Vogue messages do not match runtime messages extraction`
    );
  }
});

test('non-English UI and account copy does not silently reuse English strings', () => {
  const englishCopy = new Map(flattenStrings(readVogueCopy('en')));

  for (const locale of nonEnglishLocales) {
    for (const [path, text] of flattenStrings(readVogueCopy(locale))) {
      if (text !== englishCopy.get(path)) continue;
      if (!hasUnallowedEnglishWords(text)) continue;

      assert.fail(`${locale} Vogue message ${path} falls back to English: ${text}`);
    }

    const englishAccountCopy = new Map(flattenStrings(getVogueAccountCopy('en')));
    for (const [path, text] of flattenStrings(getVogueAccountCopy(locale))) {
      if (text !== englishAccountCopy.get(path)) continue;
      if (!hasUnallowedEnglishWords(text)) continue;

      assert.fail(`${locale} account copy ${path} falls back to English: ${text}`);
    }
  }
});

test('account center copy is localized for every Vogue locale', () => {
  const englishCopy = getVogueAccountCopy('en');

  for (const locale of nonEnglishLocales) {
    const accountCopy = getVogueAccountCopy(locale);

    assert.notEqual(
      accountCopy.title,
      englishCopy.title,
      `${locale} account title falls back to English`
    );
    assert.notEqual(
      accountCopy.billing.upgrade,
      englishCopy.billing.upgrade,
      `${locale} billing CTA falls back to English`
    );
    assert.ok(
      accountCopy.profile.avatar && accountCopy.profile.signOut,
      `${locale} account profile copy is incomplete`
    );
  }
});

test('blog locale copy avoids known machine-translation and missing-accent regressions', () => {
  assert.equal(BLOG_TAG_LABELS.fr.useCase, "Cas d'usage");
  assert.equal(BLOG_TAG_LABELS.pt.comparison, 'Comparação');
  assert.equal(BLOG_TAG_LABELS.pt.review, 'Análise');
  assert.equal(BLOG_PAGE_COPY.zh.heading, 'Vogue AI 博客');
  assert.equal(BLOG_PAGE_COPY.fr.heading, 'Blog Vogue AI');
  assert.equal(BLOG_PAGE_COPY.ru.heading, 'Блог Vogue AI');
  assert.equal(BLOG_PAGE_COPY.pt.heading, 'Blog Vogue AI');
  assert.equal(BLOG_PAGE_COPY.ja.heading, 'Vogue AI ブログ');
  assert.equal(BLOG_PAGE_COPY.ko.heading, 'Vogue AI 블로그');
  assert.match(BLOG_PAGE_COPY.fr.subtitle, /créer/);
  assert.match(BLOG_PAGE_COPY.fr.subtitle, /référence/);
  assert.match(BLOG_PAGE_COPY.fr.published, /Publié/);
  assert.match(BLOG_PAGE_COPY.fr.updated, /Mis à jour/);
  assert.equal(BLOG_PAGE_COPY.pt.categories, 'Tópicos');
  assert.doesNotMatch(BLOG_PAGE_COPY.pt.noPosts, /\bnao\b|\bha\b|\btopico\b/i);
});

test('blog post SEO titles use native workflow terms in Asian locales', () => {
  for (const post of getAllBlogPostSources()) {
    assert.doesNotMatch(post.localizations.ja?.seoTitle ?? '', /\bworkflow\b/i);
    assert.doesNotMatch(post.localizations.ko?.seoTitle ?? '', /\bworkflow\b/i);
  }
});

test('blog posts provide localized body content for every public locale', () => {
  for (const post of getAllBlogPostSources()) {
    const englishContent = JSON.stringify(post.localizations.en.content ?? []);

    for (const locale of nonEnglishLocales) {
      const localized = post.localizations[locale];

      assert.ok(localized, `${post.slug} missing ${locale} localization`);
      assert.ok(
        localized.content?.length,
        `${post.slug} ${locale} falls back to English body content`
      );
      assert.notEqual(
        JSON.stringify(localized.content),
        englishContent,
        `${post.slug} ${locale} body duplicates English`
      );
    }
  }
});

test('blog post omits generic sidebar CTA strings', () => {
  const source = read('src/components/blog/VogueBlogPost.tsx');

  assert.doesNotMatch(source, /copy\.galleryCta/);
  assert.doesNotMatch(source, /copy\.galleryDescription/);
  assert.doesNotMatch(source, /copy\.modelsLabel/);
  assert.doesNotMatch(source, />\s*Models\s*</);
  assert.doesNotMatch(source, /Browse prompt cards, copy the structure/);
  assert.doesNotMatch(source, />\s*Open gallery\s*</);
});

test('prompt detail labels distinguish localized current copy from English original', () => {
  const source = read('src/components/prompts/VogueGalleryWorkspace.tsx');

  assert.match(source, /current: '当前语言'/);
  assert.match(source, /original: '原始提示词'/);
  assert.match(source, /original: 'Prompt original'/);
  assert.match(source, /original: 'Исходный промпт'/);
  assert.match(source, /original: '元のプロンプト'/);
  assert.match(source, /original: '원본 프롬프트'/);
});

test('featured prompt i18n localizes GPT Image 2, Nano Banana, and Midjourney entries without changing originals', () => {
  const sampleIds = [
    ...getLocalizedPromptGalleryEntries('en', {
      limit: 5,
      modelId: 'gptimage2',
    }).map((entry) => entry.id),
    ...getLocalizedPromptGalleryEntries('en', {
      limit: 5,
      modelId: 'nanobanana',
    }).map((entry) => entry.id),
    ...getLocalizedPromptGalleryEntries('en', {
      limit: 5,
      modelId: 'midjourney',
    }).map((entry) => entry.id),
  ];

  for (const id of sampleIds) {
    const englishEntry = getPromptEntryById(id, 'en');
    assert.ok(englishEntry, `${id} missing English prompt entry`);
    const originalPrompt = englishEntry.originalPrompt ?? englishEntry.prompt;
    const protectedTokens = extractProtectedTokens(originalPrompt);

    for (const locale of nonEnglishLocales) {
      const localizedEntry = getPromptEntryById(id, locale);
      assert.ok(localizedEntry, `${id} missing ${locale} prompt entry`);
      assert.equal(
        localizedEntry.originalPrompt,
        originalPrompt,
        `${id} ${locale} changed originalPrompt`
      );
      assert.notEqual(
        localizedEntry.prompt,
        englishEntry.prompt,
        `${id} ${locale} prompt falls back to English`
      );
      assert.notEqual(
        localizedEntry.title,
        englishEntry.title,
        `${id} ${locale} title falls back to English`
      );
      for (const token of protectedTokens) {
        assert.match(
          localizedEntry.prompt,
          new RegExp(token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')),
          `${id} ${locale} localized prompt dropped protected token ${token}`
        );
      }
    }
  }
});

test('prompt i18n does not hide translation pollution with fragile question-mark replacement', () => {
  const promptsSource = read('src/lib/prompts.ts');
  const generatedI18n = [
    'src/lib/generated/awesome-gptimage2-prompts.i18n.fr.json',
    'src/lib/generated/awesome-gptimage2-prompts.i18n.pt.json',
    'src/lib/generated/awesome-gptimage2-site-additions.i18n.fr.json',
    'src/lib/generated/awesome-gptimage2-site-additions.i18n.pt.json',
  ].map(read);

  assert.doesNotMatch(promptsSource, /replace\(\/\\\?\\\?\/g/);
  for (const content of generatedI18n) {
    assert.doesNotMatch(content, /\?\?/);
  }
});
