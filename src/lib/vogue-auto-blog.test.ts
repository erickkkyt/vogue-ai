import assert from 'node:assert/strict';
import test from 'node:test';

import { LOCALES } from '@/i18n/routing';
import {
  getAllBlogPostSources,
  getBlogPosts,
  type BlogContentBlock,
} from '@/lib/blog-data';
import { AUTO_BLOG_POSTS } from '@/lib/generated/auto-blog-posts';

const GENERATED_POST_SLUGS = AUTO_BLOG_POSTS.map((post) => post.slug) as string[];

function getGeneratedPost(slug: string) {
  const post = getAllBlogPostSources().find(
    (candidate) => candidate.slug === slug
  );

  assert.ok(post, `${slug} is missing from getAllBlogPostSources()`);
  return post;
}

function countFaqQuestions(content: BlogContentBlock[]) {
  const faqIndex = content.findIndex(
    (block) =>
      block.type === 'heading' && block.level === 2 && block.text === 'FAQ'
  );

  if (faqIndex === -1) return 0;

  return content
    .slice(faqIndex + 1)
    .filter((block) => block.type === 'heading' && block.level === 3).length;
}

function getFaqQuestionTexts(content: BlogContentBlock[]) {
  const faqIndex = content.findIndex(
    (block) =>
      block.type === 'heading' && block.level === 2 && block.text === 'FAQ'
  );

  if (faqIndex === -1) return [];

  return content
    .slice(faqIndex + 1)
    .flatMap((block) =>
      block.type === 'heading' && block.level === 3 ? [block.text] : []
    );
}

function getLocalizedReviewText(content: BlogContentBlock[]) {
  const copyablePromptPattern =
    /\[[^\]]+\]|8K ultra|Cinematic sci-fi|Cartoon illustration|Minimal line-art poster|Cinematic concept art|Editorial fantasy portrait|Stylized character sheet|Surreal gallery artwork/;

  return content
    .flatMap((block) => {
      if (block.type === 'paragraph') return [block.text];
      if (block.type === 'heading') return [block.text];
      if (block.type === 'callout') return [block.title, block.text];
      if (block.type === 'table') {
        return [
          ...block.headers,
          ...block.rows.flat(),
        ];
      }
      if (block.type === 'image') return [block.alt, block.caption ?? ''];
      if (block.type === 'list') {
        return block.items.filter((item) => !copyablePromptPattern.test(item));
      }
      return [];
    })
    .join('\n');
}

function isPromptLibraryImage(url: string) {
  return (
    /^https:\/\/media\.vogueai\.net\/prompt-libraries\//.test(url) ||
    /^https:\/\/media\.vogueai\.net\/blog\/auto\//.test(url) ||
    /^https:\/\/pub-911e4fa03f0c4323a80d8f3dc99d1c7f\.r2\.dev\/prompt-libraries\//.test(
      url
    )
  );
}

test('public blog sources exclude internal template articles', () => {
  const slugs = getAllBlogPostSources().map((post) => post.slug);

  for (const slug of GENERATED_POST_SLUGS) {
    assert.ok(slugs.includes(slug));
  }
  assert.ok(!slugs.includes('vogue-ai-blog-template'));
});

test('VogueAI auto-blog output is wired into the structured blog source with every public locale', () => {
  for (const slug of GENERATED_POST_SLUGS) {
    const post = getGeneratedPost(slug);

    assert.equal(post.articleType, 'tutorial');
    assert.equal(post.author, 'Vogue AI Team');
    assert.ok(post.readingMinutes >= 9);
    assert.ok(post.modelTags.includes('gpt-image-2'));
    assert.ok(post.modelTags.includes('nano-banana'));
    assert.ok(isPromptLibraryImage(post.image));

    const englishImages = post.localizations.en.content?.filter(
      (block) => block.type === 'image'
    );

    assert.ok(englishImages?.length, `${post.slug} should include a library image block`);

    for (const locale of LOCALES) {
      const localized = post.localizations[locale];

      assert.ok(localized, `${post.slug} missing ${locale} localization`);
      assert.ok(localized.title, `${post.slug} missing ${locale} title`);
      assert.ok(localized.summary, `${post.slug} missing ${locale} summary`);
      const localizedContent = localized.content ?? [];

      assert.ok(localizedContent.length, `${post.slug} missing ${locale} body content`);
      assert.ok(
        localizedContent.filter((block) => block.type === 'heading').length >= 10,
        `${post.slug} ${locale} body is missing article sections`
      );
      assert.ok(
        localizedContent.filter((block) => block.type === 'list').length >= 4,
        `${post.slug} ${locale} body is missing actionable checklists`
      );
      assert.ok(
        localizedContent.filter((block) => block.type === 'table').length >= 2,
        `${post.slug} ${locale} body is missing decision tables`
      );
      assert.ok(
        countFaqQuestions(localizedContent) >= 6,
        `${post.slug} ${locale} body needs a deeper FAQ`
      );
    }
  }
});

test('generated blog covers use owned media instead of a shared fallback image', () => {
  const posts = GENERATED_POST_SLUGS
    .map((slug) => getBlogPosts('en').find((post) => post.slug === slug))
    .filter((post): post is NonNullable<typeof post> => Boolean(post));

  assert.equal(posts.length, GENERATED_POST_SLUGS.length);

  for (const post of posts) {
    const bodyImages = (post.content ?? []).filter(
      (block) => block.type === 'image'
    );
    assert.ok(bodyImages.length >= 1, `${post.slug} needs at least one body image`);
    assert.ok(isPromptLibraryImage(post.image), `${post.slug} needs an owned cover image`);
  }

  const uniqueCoverCount = new Set(posts.map((post) => post.image)).size;
  assert.ok(
    uniqueCoverCount >= 2,
    'generated auto-blog covers should not all collapse to one fallback image'
  );
});

test('Instagram image prompts guide keeps SEO metadata and body media publish-ready', () => {
  const post = getGeneratedPost('instagram-image-prompts');
  const bodyImages = post.localizations.en.content?.filter(
    (block) => block.type === 'image'
  ) ?? [];

  assert.equal(post.date, '2026-06-18');
  assert.equal(post.updatedAt, '2026-06-18');
  assert.ok(bodyImages.length >= 3, 'Instagram guide needs multiple semantic examples');
  assert.ok(
    bodyImages.every((block) => block.src !== post.image),
    'Instagram guide should not reuse the article hero as a body example'
  );
  assert.equal(
    post.localizations.zh?.seoTitle,
    'Instagram Image Prompts 工作流指南'
  );
  assert.equal(
    post.localizations.ja?.seoTitle,
    'Instagram Image Prompts 実践ガイド'
  );
  assert.equal(
    post.localizations.ko?.seoTitle,
    'Instagram Image Prompts 실전 가이드'
  );
});

test('copy-paste prompt guide follows a publish-ready handbook structure', () => {
  const post = getGeneratedPost('copy-paste-ai-image-prompts');
  const englishContent = post.localizations.en.content ?? [];
  const serializedContent = JSON.stringify(englishContent);
  const headingTexts = englishContent
    .filter((block) => block.type === 'heading')
    .map((block) => block.text);
  const tables = englishContent.filter((block) => block.type === 'table');

  assert.ok(
    headingTexts.includes('TL;DR: copy the structure, not the whole idea'),
    'guide needs first-screen value'
  );
  assert.ok(headingTexts.includes('Scenario matrix'), 'guide needs a scenario matrix');
  assert.ok(
    headingTexts.includes('Worked example: turn one product request into a reusable brief'),
    'guide needs a complete worked example'
  );
  assert.ok(
    headingTexts.includes('Mistake and fix table'),
    'guide needs a mistake/fix section'
  );
  assert.ok(
    headingTexts.includes('Use the pattern in Vogue AI without overfitting'),
    'guide needs product-specific workflow guidance'
  );
  assert.ok(
    tables.some(
      (block) =>
        block.headers.includes('Job') &&
        block.headers.includes('Reference image') &&
        block.rows.length >= 4
    ),
    'scenario matrix should cover multiple jobs'
  );
  assert.ok(
    tables.some(
      (block) =>
        block.headers.includes('Failure') &&
        block.headers.includes('Fix first') &&
        block.rows.length >= 5
    ),
    'mistake/fix table should cover common failure modes'
  );
  assert.ok(
    englishContent.some(
      (block) =>
        block.type === 'list' &&
        block.items.some((item) => item.startsWith('Product hero:'))
    ),
    'guide needs copyable prompt blocks'
  );
  assert.ok(
    countFaqQuestions(englishContent) >= 6,
    'FAQ needs enough real questions for broad search intent'
  );
  assert.doesNotMatch(serializedContent, /Start in Vogue AI|Open gallery/);
});

test('copy-paste prompt guide keeps a complete first-result iteration section', () => {
  const post = getGeneratedPost('copy-paste-ai-image-prompts');
  const englishContent = post.localizations.en.content ?? [];
  const iterationHeadingIndex = englishContent.findIndex(
    (block) =>
      block.type === 'heading' &&
      block.text === 'What to change after the first result'
  );

  assert.notEqual(iterationHeadingIndex, -1, 'missing first-result iteration heading');

  const iterationSection = englishContent.slice(iterationHeadingIndex + 1);

  assert.ok(
    iterationSection.some((block) => block.type === 'paragraph'),
    'first-result section needs explanatory copy'
  );
  assert.ok(
    iterationSection.some((block) => block.type === 'list' && block.items.length >= 4),
    'first-result section needs concrete change checklist'
  );
  assert.ok(
    iterationSection.some((block) => block.type === 'callout'),
    'first-result section needs a closing rule'
  );
  assert.ok(
    !iterationSection.some(
      (block) => block.type === 'callout' && block.title === 'Start in Vogue AI'
    ),
    'first-result section should not include a weak product CTA'
  );
  assert.ok(
    iterationSection.some((block) => block.type === 'heading' && block.text === 'FAQ'),
    'first-result section needs an FAQ'
  );
  assert.ok(
    iterationSection.filter((block) => block.type === 'heading' && block.level === 3)
      .length >= 3,
    'FAQ needs concrete questions'
  );
});

test('text-to-image prompt guide covers formula, scenario fit, and first-generation fixes', () => {
  const post = getGeneratedPost('text-to-image-prompts');
  const englishContent = post.localizations.en.content ?? [];
  const headingTexts = englishContent
    .filter((block) => block.type === 'heading')
    .map((block) => block.text);
  const tables = englishContent.filter((block) => block.type === 'table');
  const imageBlocks = englishContent.filter((block) => block.type === 'image');

  assert.equal(post.readingMinutes, 9);
  assert.ok(headingTexts.includes('TL;DR: write prompts like a reusable production brief'));
  assert.ok(headingTexts.includes('Text to image prompt formula'));
  assert.ok(headingTexts.includes('Scenario matrix'));
  assert.ok(headingTexts.includes('Copyable text to image prompt examples'));
  assert.ok(headingTexts.includes('Two real prompt-library cases you can reuse'));
  assert.ok(
    headingTexts.includes('Case 1: product-shot structure with material and background control')
  );
  assert.ok(
    headingTexts.includes('Case 2: reference-led portrait structure for identity protection')
  );
  assert.ok(headingTexts.includes('What to change after the first generation'));
  assert.ok(
    imageBlocks.length >= 3,
    'text-to-image guide should include multiple prompt-library case images'
  );
  assert.ok(
    tables.some(
      (block) =>
        block.headers.includes('Prompt part') &&
        block.headers.includes('What to include') &&
        block.rows.length >= 6
    ),
    'text-to-image guide needs a reusable formula table'
  );
  assert.ok(
    tables.some(
      (block) =>
        block.headers.includes('Goal') &&
        block.headers.includes('Prompt focus') &&
        block.rows.length >= 4
    ),
    'text-to-image guide needs a scenario matrix'
  );
  assert.ok(
    englishContent.some(
      (block) =>
        block.type === 'list' &&
        block.items.some((item) => item.startsWith('Product launch hero:'))
    ),
    'text-to-image guide needs copyable prompt examples'
  );
  assert.ok(
    englishContent.some(
      (block) =>
        block.type === 'list' &&
        block.items.some((item) =>
          item.startsWith(
            'Prompt: A premium street-food product photograph of crispy fried momos'
          )
        )
    ),
    'text-to-image guide needs a real product-shot case prompt'
  );
  assert.ok(
    englishContent.some(
      (block) =>
        block.type === 'list' &&
        block.items.some((item) =>
          item.startsWith(
            'Prompt: Use my uploaded image as the face reference.'
          )
        )
    ),
    'text-to-image guide needs a real identity-reference case prompt'
  );
  assert.ok(countFaqQuestions(englishContent) >= 6);
});

test('Gemini photo prompt guide covers prompt anatomy, real cases, and multi-image depth', () => {
  const post = getGeneratedPost('gemini-ai-photo-prompt-copy-paste-trending');
  const englishContent = post.localizations.en.content ?? [];
  const headingTexts = englishContent
    .filter((block) => block.type === 'heading')
    .map((block) => block.text);
  const tables = englishContent.filter((block) => block.type === 'table');
  const images = englishContent.filter((block) => block.type === 'image');

  assert.equal(post.readingMinutes, 10);
  assert.ok(headingTexts.includes('TL;DR: keep the trend, fix the job'));
  assert.ok(headingTexts.includes('Prompt anatomy that keeps the photo controllable'));
  assert.ok(headingTexts.includes('Scenario matrix'));
  assert.ok(headingTexts.includes('Case 1: reference-led profile portrait'));
  assert.ok(headingTexts.includes('Case 2: street-style Story or Reel cover'));
  assert.ok(headingTexts.includes('Case 3: product plus person campaign shot'));
  assert.ok(
    headingTexts.includes('Worked example: from vague brief to usable prompt')
  );
  assert.ok(headingTexts.includes('What to change after the first result'));
  assert.ok(
    headingTexts.includes('Use the same prompt inside Vogue AI without losing control')
  );
  assert.ok(
    images.length >= 3,
    'Gemini guide should include multiple prompt-library case images'
  );
  assert.ok(
    tables.some(
      (block) =>
        block.headers.includes('Prompt part') &&
        block.headers.includes('What to include') &&
        block.rows.length >= 6
    ),
    'Gemini guide needs a reusable prompt-anatomy table'
  );
  assert.ok(
    tables.some(
      (block) =>
        block.headers.includes('Goal') &&
        block.headers.includes('Best prompt focus') &&
        block.rows.length >= 5
    ),
    'Gemini guide needs a scenario matrix for multiple social-photo jobs'
  );
  assert.ok(
    tables.some(
      (block) =>
        block.headers.includes('Failure mode') &&
        block.headers.includes('Fix first') &&
        block.rows.length >= 5
    ),
    'Gemini guide needs a first-result fix table'
  );
  assert.ok(
    englishContent.some(
      (block) =>
        block.type === 'list' &&
        block.items.some((item) =>
          item.startsWith('Editorial profile portrait of [person]')
        )
    ),
    'Gemini guide needs copyable trend prompt blocks'
  );
  assert.ok(
    englishContent.some(
      (block) =>
        block.type === 'list' &&
        block.items.some((item) =>
          item.startsWith('Prompt: Use my uploaded image as the face reference.')
        )
    ),
    'Gemini guide needs a real reference-led case prompt'
  );
  assert.ok(countFaqQuestions(englishContent) >= 6);
});

test('prompt engineering tips guide meets publish-ready handbook depth', () => {
  const post = getGeneratedPost('prompt-engineering-tips');
  const englishContent = post.localizations.en.content ?? [];
  const headingTexts = englishContent
    .filter((block) => block.type === 'heading')
    .map((block) => block.text);
  const tables = englishContent.filter((block) => block.type === 'table');
  const images = englishContent.filter((block) => block.type === 'image');

  assert.equal(post.readingMinutes, 10);
  assert.ok(headingTexts.includes('TL;DR: write prompts in controllable layers'));
  assert.ok(headingTexts.includes('Who should use these prompt engineering tips'));
  assert.ok(headingTexts.includes('A practical prompt engineering formula'));
  assert.ok(headingTexts.includes('Scenario matrix'));
  assert.ok(headingTexts.includes('Copyable prompt engineering examples'));
  assert.ok(headingTexts.includes('Two reusable case prompts from the library'));
  assert.ok(headingTexts.includes('Failure diagnosis checklist'));
  assert.ok(headingTexts.includes('How to iterate inside Vogue AI'));
  assert.ok(
    images.length >= 3,
    'prompt engineering guide should include multiple prompt-library case images'
  );
  assert.ok(
    images.every((block) =>
      block.src.startsWith(
        'https://media.vogueai.net/blog/auto/prompt-engineering-tips/'
      )
    ),
    'prompt engineering guide images must be mirrored to the Vogue AI owned media domain'
  );
  assert.ok(
    images.every((block) => !block.src.includes('r2.dev')),
    'prompt engineering guide should not publish raw R2 image URLs'
  );
  assert.ok(
    tables.some(
      (block) =>
        block.headers.includes('Layer') &&
        block.headers.includes('What to write') &&
        block.rows.length >= 6
    ),
    'prompt engineering guide needs a reusable formula table'
  );
  assert.ok(
    tables.some(
      (block) =>
        block.headers.includes('Goal') &&
        block.headers.includes('Prompt focus') &&
        block.rows.length >= 5
    ),
    'prompt engineering guide needs a scenario matrix'
  );
  assert.ok(
    tables.some(
      (block) =>
        block.headers.includes('Failure mode') &&
        block.headers.includes('Fix first') &&
        block.rows.length >= 5
    ),
    'prompt engineering guide needs a failure diagnosis table'
  );
  assert.ok(
    englishContent.some(
      (block) =>
        block.type === 'list' &&
        block.items.some((item) => item.startsWith('Product hero:'))
    ),
    'prompt engineering guide needs copyable prompt blocks'
  );
  assert.ok(
    englishContent.some(
      (block) =>
        block.type === 'list' &&
        block.items.some((item) =>
          item.startsWith('Prompt: Premium streetwear T-shirt graphic design')
        )
    ),
    'prompt engineering guide needs a real product-style case prompt'
  );
  assert.ok(
    englishContent.some(
      (block) =>
        block.type === 'list' &&
        block.items.some((item) =>
          item.startsWith('Prompt: High-impact cinematic sports advertising poster')
        )
    ),
    'prompt engineering guide needs a real campaign-poster case prompt'
  );
  assert.ok(countFaqQuestions(englishContent) >= 6);
});

test('prompt engineering localized tables are publish-ready instead of English placeholders', () => {
  const post = getGeneratedPost('prompt-engineering-tips');
  const forbiddenTableFragments = [
    'Layer',
    'What to write',
    'Why it matters',
    'Goal',
    'Prompt focus',
    'Reference image',
    'First check',
    'Failure mode',
    'Fix first',
    'Product hero',
    'wrong identity',
    'generic style',
    'full rewrite',
  ];

  for (const locale of LOCALES.filter((candidate) => candidate !== 'en')) {
    const content = post.localizations[locale]?.content ?? [];
    const tables = content.filter((block) => block.type === 'table');
    const tableText = JSON.stringify(tables);

    assert.ok(
      tables.length >= 3,
      `prompt engineering ${locale} needs localized tables`
    );

    for (const fragment of forbiddenTableFragments) {
      assert.ok(
        !tableText.includes(fragment),
        `prompt engineering ${locale} table still contains English fragment: ${fragment}`
      );
    }
  }
});

test('prompt engineering localizations keep the complete owned image set', () => {
  const post = getGeneratedPost('prompt-engineering-tips');
  const englishImages = post.localizations.en.content?.filter(
    (block) => block.type === 'image'
  ) ?? [];
  const englishImageSources = englishImages.map((block) => block.src);

  assert.equal(englishImages.length, 4);

  for (const locale of LOCALES.filter((candidate) => candidate !== 'en')) {
    const localizedImages = post.localizations[locale]?.content?.filter(
      (block) => block.type === 'image'
    ) ?? [];

    assert.deepEqual(
      localizedImages.map((block) => block.src),
      englishImageSources,
      `prompt engineering ${locale} should keep every owned article image`
    );
    assert.ok(
      localizedImages.every((block) => block.alt && block.alt !== post.imageAlt),
      `prompt engineering ${locale} image alt text should be localized`
    );
  }
});

test('best AI art prompt guide localizations do not inherit English content shells', () => {
  const post = getGeneratedPost('best-prompts-for-ai-art');
  const englishFaqQuestions = getFaqQuestionTexts(
    post.localizations.en.content ?? []
  ).join('|');
  const forbiddenCjkFragments = [
    'Best prompts',
    'Best Prompts',
    'AI art prompt',
    'prompt examples',
    'prompt type',
    'subject',
    'medium',
    'composition',
    'lighting',
    'texture',
    'constraints',
    'minimal poster',
    'cinematic narrative',
    'stylized character',
    'repeatable workflow',
    'model fit',
    'Revision rule',
    'Failure mode',
    'Fix first',
  ];

  for (const locale of ['zh', 'ja', 'ko'] as const) {
    const localized = post.localizations[locale];
    assert.ok(localized, `best prompts guide missing ${locale}`);

    const metadataText = [
      localized.title,
      localized.summary,
      localized.seoTitle ?? '',
      localized.seoDescription ?? '',
    ].join('\n');
    const bodyText = getLocalizedReviewText(localized.content ?? []);
    const faqQuestions = getFaqQuestionTexts(localized.content ?? []).join('|');

    assert.notEqual(
      faqQuestions,
      englishFaqQuestions,
      `best prompts guide ${locale} FAQ still inherits English questions`
    );

    for (const fragment of forbiddenCjkFragments) {
      assert.ok(
        !metadataText.includes(fragment),
        `best prompts guide ${locale} metadata contains English shell: ${fragment}`
      );
      assert.ok(
        !bodyText.includes(fragment),
        `best prompts guide ${locale} body contains English shell: ${fragment}`
      );
    }
  }
});
