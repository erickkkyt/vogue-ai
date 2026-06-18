import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';

import {
  SEO_LANDING_PAGE_SLUGS,
  createSeoLandingMetadata,
  getSeoLandingPageConfig,
  getSeoLandingWorkspaceHref,
} from './seo-landing-pages';

const root = process.cwd();

const read = (path: string) => readFileSync(join(root, path), 'utf8');

test('SEO landing pages expose canonical routes and metadata', () => {
  assert.deepEqual(SEO_LANDING_PAGE_SLUGS, [
    'free-ai-image-generator',
    'meigen-alternative',
  ]);

  const free = getSeoLandingPageConfig('free-ai-image-generator');
  const meigen = getSeoLandingPageConfig('meigen-alternative');

  assert.equal(free.path, '/free-ai-image-generator');
  assert.match(free.title, /Free AI Image Generator No Sign Up/);
  assert.ok(free.title.length <= 60);
  assert.ok(free.metaDescription.length >= 120);
  assert.ok(free.metaDescription.length <= 160);
  assert.equal(free.h1, 'Free AI Image Generator | Vogue AI');
  assert.equal(free.breadcrumbLabel, 'Free AI Image Generator');
  assert.equal(
    free.featureHeading,
    'Why this free AI image generator works'
  );
  assert.equal(
    free.comparison.heading,
    'No-sign-up preview vs signed-in workspace'
  );
  assert.doesNotMatch(free.h1, /No sign up/i);
  assert.match(free.h1, /Vogue AI/);
  assert.doesNotMatch(
    `${free.title} ${free.metaDescription} ${free.intro}`,
    /unlimited|100% free/i
  );
  assert.match(free.metaDescription, /first image/i);
  assert.match(free.metaDescription, /daily free credits/i);
  assert.match(free.intro, /without login/i);
  assert.match(free.intro, /daily free generation credits/i);
  assert.equal(free.faq.length, 8);
  assert.ok(free.gallery.entryIds.length >= 8);
  assert.ok(free.gallery.entryIds.length <= 12);
  assert.ok(
    free.secondaryKeywords.includes('free ai image generator no login')
  );
  assert.deepEqual(
    free.related.map((item) => item.href),
    [
      '/gpt-image-prompt',
      '/ai-image-prompt',
      '/nano-banana-prompt',
      '/midjourney-prompt',
      '/meigen-alternative',
    ]
  );
  for (const config of [free, meigen]) {
    assert.equal(
      config.stats.some(
        (stat) => `${stat.value} ${stat.label}` === 'Z-Image default model'
      ),
      false
    );
  }

  assert.equal(meigen.path, '/meigen-alternative');
  assert.equal(
    meigen.h1,
    'Meigen Alternative：Better AI Image Prompt Gallery'
  );
  assert.equal(
    meigen.featureHeading,
    'Why this is a better AI prompt gallery'
  );
  assert.ok(meigen.title.length <= 60);
  assert.ok(meigen.metaDescription.length >= 120);
  assert.ok(meigen.metaDescription.length <= 160);
  assert.equal(meigen.schemaType, 'CollectionPage');
  assert.equal(meigen.stats[0]?.value, '2000+');
  assert.equal(meigen.faq.length, 8);
  assert.ok(meigen.gallery.entryIds.length >= 8);
  assert.ok(meigen.gallery.entryIds.length <= 12);
  assert.doesNotMatch(
    `${meigen.intro} ${meigen.faq.map((item) => `${item.question} ${item.answer}`).join(' ')}`,
    /affiliated with Meigen/i
  );
  assert.ok(meigen.secondaryKeywords.includes('meigen ai prompt gallery'));
  assert.ok(meigen.secondaryKeywords.includes('generate images from prompts'));
  assert.deepEqual(
    meigen.related.map((item) => item.href),
    [
      '/gpt-image-prompt',
      '/ai-image-prompt',
      '/nano-banana-prompt',
      '/midjourney-prompt',
      '/free-ai-image-generator',
    ]
  );

  assert.equal(
    createSeoLandingMetadata('free-ai-image-generator').alternates?.canonical,
    '/free-ai-image-generator'
  );
  assert.equal(
    createSeoLandingMetadata('meigen-alternative').alternates?.canonical,
    '/meigen-alternative'
  );
});

test('SEO landing routes and sitemap are wired', () => {
  assert.equal(
    existsSync(
      join(root, 'src/app/(prompt-seo)/free-ai-image-generator/page.tsx')
    ),
    true
  );
  assert.equal(
    existsSync(join(root, 'src/app/(prompt-seo)/meigen-alternative/page.tsx')),
    true
  );

  const sitemap = read('src/app/sitemap.ts');
  const middleware = read('src/middleware.ts');
  assert.match(sitemap, /SEO_LANDING_PAGE_SLUGS/);
  assert.match(sitemap, /getSeoLandingPageConfig/);
  assert.match(middleware, /'\/free-ai-image-generator'/);
  assert.match(middleware, /'\/meigen-alternative'/);
});

test('SEO landing workspace links prefill Z-Image prompts', () => {
  const freeHref = getSeoLandingWorkspaceHref('free-ai-image-generator');
  const meigenHref = getSeoLandingWorkspaceHref('meigen-alternative');

  for (const href of [freeHref, meigenHref]) {
    assert.match(href, /^\/app\?/);
    assert.match(href, /model=zimage/);
    assert.match(href, /prompt=/);
  }
});

test('SEO landing hero composer stays prompt-only', () => {
  const composer = read('src/components/seo/SeoLandingHeroComposer.tsx');
  const page = read('src/components/seo/VogueSeoLandingPage.tsx');

  assert.doesNotMatch(composer, /VoguePromptComposer/);
  assert.doesNotMatch(composer, /getModelIconPathByModelId/);
  assert.doesNotMatch(composer, /credits=/);
  assert.match(composer, /home-generate-button/);
  assert.match(composer, /Generate/);
  assert.match(composer, /useState\(''\)/);
  assert.doesNotMatch(composer, /initialPrompt/);
  assert.doesNotMatch(page, /initialPrompt=/);
  assert.doesNotMatch(composer, /home-generate-button__credits/);
  assert.doesNotMatch(composer, /autostart/);
  assert.match(composer, /model: DEFAULT_MODEL_ID/);
  assert.match(page, /config.slug === 'free-ai-image-generator'/);
  assert.match(page, /Browse full ai prompt gallery/);
  assert.match(page, /View gallery/);
  assert.match(page, /Frequently Asked Questions/);
  assert.doesNotMatch(page, /Common questions/);
  assert.doesNotMatch(page, /Why use Vogue AI/);
  assert.doesNotMatch(page, /Open workspace/);
  assert.match(page, /singleLineCardTitles=\{true\}/);
  assert.doesNotMatch(page, /'@type': 'FAQPage'/);
});

test('existing prompt hubs link to SEO landing pages', () => {
  const promptSeo = read('src/lib/prompt-seo-landing-pages.ts');

  assert.match(promptSeo, /href: '\/free-ai-image-generator'/);
  assert.match(promptSeo, /href: '\/meigen-alternative'/);
});
