import assert from 'node:assert/strict';
import test from 'node:test';

import { LOCALES } from '@/i18n/routing';
import {
  getAllBlogPostSources,
  getBlogPosts,
  type BlogContentBlock,
} from '@/lib/blog-data';

const GENERATED_POST_SLUGS = [
  'copy-paste-ai-image-prompts',
  'text-to-image-prompts',
] as const;

function getGeneratedPost(slug: (typeof GENERATED_POST_SLUGS)[number]) {
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

test('generated blog covers are derived from each article body instead of a shared fallback image', () => {
  const textToImage = getBlogPosts('en').find(
    (post) => post.slug === 'text-to-image-prompts'
  );
  const copyPaste = getBlogPosts('en').find(
    (post) => post.slug === 'copy-paste-ai-image-prompts'
  );

  assert.ok(textToImage);
  assert.ok(copyPaste);
  assert.notEqual(textToImage.image, copyPaste.image);

  const textToImageBodyImages = (textToImage.content ?? []).filter(
    (block) => block.type === 'image'
  );
  const copyPasteBodyImages = (copyPaste.content ?? []).filter(
    (block) => block.type === 'image'
  );

  assert.equal(textToImage.image, textToImageBodyImages[0]?.src);
  assert.equal(copyPaste.image, copyPasteBodyImages[0]?.src);
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
