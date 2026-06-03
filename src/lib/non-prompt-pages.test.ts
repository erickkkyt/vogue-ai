import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';

import { getNonPromptBreadcrumbParent } from '@/lib/non-prompt-breadcrumbs';
import { createNonPromptPageMetadata } from '@/lib/non-prompt-page-metadata';
import {
  NON_PROMPT_COLLECTION_CONFIGS,
  NON_PROMPT_COLLECTION_SLUGS,
  type NonPromptCollectionSlug,
} from '@/lib/non-prompt-collections';
import {
  NON_PROMPT_PAGE_CONFIGS,
  NON_PROMPT_PAGE_SLUGS,
  type NonPromptPageSlug,
} from '@/lib/non-prompt-pages';

const read = (path: string) => readFileSync(join(process.cwd(), path), 'utf8');

const expectedSlugs: NonPromptPageSlug[] = [
  'ai-baby-generator',
  'ai-baby-podcast',
  'earth-zoom',
  'hailuo-ai-video-generator',
  'lipsync',
  'seedance',
  'veo-3-generator',
];

const expectedCollectionSlugs: NonPromptCollectionSlug[] = ['effect', 'model'];

const routePathBySlug: Record<NonPromptPageSlug, string> = {
  'ai-baby-generator': 'src/app/[locale]/ai-baby-generator/page.tsx',
  'ai-baby-podcast': 'src/app/[locale]/ai-baby-podcast/page.tsx',
  'earth-zoom': 'src/app/[locale]/earth-zoom/page.tsx',
  'hailuo-ai-video-generator':
    'src/app/[locale]/hailuo-ai-video-generator/page.tsx',
  lipsync: 'src/app/[locale]/lipsync/page.tsx',
  seedance: 'src/app/[locale]/seedance/page.tsx',
  'veo-3-generator': 'src/app/[locale]/veo-3-generator/page.tsx',
};

const collectionRoutePathBySlug: Record<NonPromptCollectionSlug, string> = {
  effect: 'src/app/[locale]/effect/page.tsx',
  model: 'src/app/[locale]/model/page.tsx',
};

test('non-prompt tool pages are declared through one JSON-backed registry', () => {
  assert.deepEqual([...NON_PROMPT_PAGE_SLUGS].sort(), expectedSlugs);

  for (const slug of expectedSlugs) {
    const config = NON_PROMPT_PAGE_CONFIGS[slug];

    assert.equal(config.slug, slug);
    assert.match(config.path, /^\//);
    assert.ok(config.metadata.title.length >= 40, slug);
    assert.ok(config.metadata.title.length <= 55, slug);
    assert.ok(config.metadata.description.length >= 140, slug);
    assert.ok(config.metadata.description.length <= 155, slug);
    assert.deepEqual(createNonPromptPageMetadata(slug).keywords, [], slug);
    assert.ok(config.workspace.title.length >= 12, slug);
    assert.ok(config.workspace.defaultPrompt.length >= 80, slug);
    assert.ok(config.workspace.controls.length >= 2, slug);
    assert.ok(config.workspace.resultChips.length >= 3, slug);
    assert.equal(config.sections.showcase.items.length, 4, slug);
    assert.equal(config.sections.related.tools.length, 4, slug);
    assert.ok(config.sections.faq.items.length >= 8, slug);

    for (const item of config.sections.faq.items) {
      assert.match(item.question, /\?$/, item.question);
      assert.ok(item.answer.length >= 80, item.question);
    }
  }
});

test('non-prompt collection pages group existing tool detail pages', () => {
  assert.deepEqual(
    [...NON_PROMPT_COLLECTION_SLUGS].sort(),
    expectedCollectionSlugs
  );

  assert.equal(NON_PROMPT_COLLECTION_CONFIGS.effect.path, '/effect');
  assert.equal(NON_PROMPT_COLLECTION_CONFIGS.model.path, '/model');
  assert.deepEqual(NON_PROMPT_COLLECTION_CONFIGS.effect.items, [
    'earth-zoom',
    'ai-baby-generator',
    'ai-baby-podcast',
    'lipsync',
  ]);
  assert.deepEqual(NON_PROMPT_COLLECTION_CONFIGS.model.items, [
    'hailuo-ai-video-generator',
    'seedance',
    'veo-3-generator',
  ]);

  for (const slug of expectedCollectionSlugs) {
    const config = NON_PROMPT_COLLECTION_CONFIGS[slug];

    assert.equal(config.slug, slug);
    assert.match(config.path, /^\//);
    assert.ok(config.metadata.title.length >= 35, slug);
    assert.ok(config.metadata.description.length >= 120, slug);
    assert.ok(config.hero.title.length >= 12, slug);
    assert.ok(config.hero.description.length >= 120, slug);
    assert.ok(config.items.length >= 3, slug);

    for (const itemSlug of config.items) {
      assert.ok(NON_PROMPT_PAGE_CONFIGS[itemSlug], `${slug}.${itemSlug}`);
    }
  }

  assert.equal(
    Object.hasOwn(NON_PROMPT_PAGE_CONFIGS, 'effect'),
    false,
    'effect is a collection page, not a tool detail page'
  );
});

test('non-prompt detail breadcrumb parents point to collection hubs', () => {
  for (const slug of NON_PROMPT_COLLECTION_CONFIGS.effect.items) {
    assert.deepEqual(
      getNonPromptBreadcrumbParent(NON_PROMPT_PAGE_CONFIGS[slug]),
      {
        name: 'AI Effects',
        item: 'https://vogueai.net/effect',
      },
      slug
    );
  }

  for (const slug of NON_PROMPT_COLLECTION_CONFIGS.model.items) {
    assert.deepEqual(
      getNonPromptBreadcrumbParent(NON_PROMPT_PAGE_CONFIGS[slug]),
      {
        name: 'AI Models',
        item: 'https://vogueai.net/model',
      },
      slug
    );
  }
});

test('localized non-prompt routes delegate to the shared template and metadata factory', () => {
  for (const slug of expectedSlugs) {
    const source = read(routePathBySlug[slug]);

    assert.match(source, /NonPromptToolPage/, slug);
    assert.match(source, /createNonPromptPageMetadata/, slug);
    assert.match(source, new RegExp(`getNonPromptPageConfig\\('${slug}'\\)`));
    assert.match(
      source,
      new RegExp(`createNonPromptPageMetadata\\(\\s*'${slug}'\\s*\\)`)
    );
    assert.doesNotMatch(source, /DashboardSection/, slug);
    assert.doesNotMatch(source, /components\/(ai-baby|hailuo|lipsync|seedance|veo-3|effect)/, slug);
  }
});

test('localized non-prompt collection routes delegate to the collection template', () => {
  for (const slug of expectedCollectionSlugs) {
    const source = read(collectionRoutePathBySlug[slug]);

    assert.match(source, /NonPromptCollectionPage/, slug);
    assert.match(source, /createNonPromptCollectionMetadata/, slug);
    assert.match(
      source,
      new RegExp(`getNonPromptCollectionConfig\\('${slug}'\\)`)
    );
    assert.match(
      source,
      new RegExp(`createNonPromptCollectionMetadata\\(\\s*'${slug}'\\s*\\)`)
    );
    assert.doesNotMatch(source, /NonPromptToolPage/, slug);
  }
});

test('root non-prompt routes reuse canonical pages without locale redirect loops', () => {
  for (const slug of expectedSlugs) {
    const config = NON_PROMPT_PAGE_CONFIGS[slug];
    const source = read(`src/app${config.path}/page.tsx`);
    const rootSegment = config.path.split('/').filter(Boolean)[0];
    const layout = read(`src/app/${rootSegment}/layout.tsx`);

    assert.match(source, /export \{[\s\S]*default,[\s\S]*metadata,/, slug);
    assert.doesNotMatch(source, /redirect\(/, slug);
    assert.doesNotMatch(source, /next\/navigation/, slug);
    assert.match(layout, /non-prompt-standalone-layout/, slug);
  }
});

test('root non-prompt collection routes reuse canonical pages without locale redirect loops', () => {
  for (const slug of expectedCollectionSlugs) {
    const config = NON_PROMPT_COLLECTION_CONFIGS[slug];
    const source = read(`src/app${config.path}/page.tsx`);
    const layout = read(`src/app/${slug}/layout.tsx`);

    assert.match(source, /export \{[\s\S]*default,[\s\S]*metadata,/, slug);
    assert.doesNotMatch(source, /redirect\(/, slug);
    assert.doesNotMatch(source, /next\/navigation/, slug);
    assert.match(layout, /non-prompt-standalone-layout/, slug);
  }
});

test('non-prompt framework stays isolated from homepage, app, and prompt gallery surfaces', () => {
  for (const path of [
    'src/app/page.tsx',
    'src/app/[locale]/page.tsx',
    'src/app/app/page.tsx',
    'src/app/[locale]/app/page.tsx',
    'src/components/prompts/VogueGalleryWorkspace.tsx',
    'src/components/app/VoguePromptComposer.tsx',
  ]) {
    const source = read(path);

    assert.doesNotMatch(source, /NonPromptToolPage|non-prompt-pages/, path);
  }
});

test('non-prompt template keeps the refined tool-first UI contract', () => {
  const source = read('src/components/non-prompt/NonPromptToolPage.tsx');

  assert.match(source, /getNonPromptBreadcrumbParent\(config\)/);
  assert.match(source, /item: parentBreadcrumb\.item/);
  assert.doesNotMatch(source, /\{eyebrow\}/);
  assert.doesNotMatch(source, /workspace\.eyebrow/);
  assert.doesNotMatch(source, /Input preview/);
  assert.doesNotMatch(source, /controlSummary/);
  assert.doesNotMatch(source, /Your generated result will appear here/);
  assert.doesNotMatch(source, /workspace\.readyText/);
  assert.doesNotMatch(source, /workspace\.resultChips/);
  assert.doesNotMatch(source, /workspace\.previewLabel/);
  assert.doesNotMatch(source, /workspace\.previewDescription/);
  assert.match(source, /Replace image/);
  assert.doesNotMatch(source, /flex h-8 w-8 shrink-0 items-center justify-center/);
  assert.match(source, /ChevronDown className="h-5 w-5 shrink-0/);
  assert.match(source, /aria-label=\{workspace\.previewTitle\}/);
  assert.match(source, /function ToolPreviewPane/);
  assert.doesNotMatch(source, /left-\[22px\]/);
  assert.doesNotMatch(source, /text-white\/72/);
  assert.match(source, /\[color:rgba\(255,255,255,0\.84\)\]/);
  assert.doesNotMatch(source, /CardGridSection/);
  assert.match(source, /function WhatSection/);
  assert.match(source, /function FeatureMosaicSection/);
  assert.match(source, /function UseCasesSection/);
  assert.match(source, /function ValueSection/);
});

test('non-prompt template uses one page background across outer sections', () => {
  const source = read('src/components/non-prompt/NonPromptToolPage.tsx');

  assert.match(
    source,
    /id="tool"[\s\S]*className="min-h-\[100svh\] bg-\[var\(--vogue-page\)\] px-4 pb-20 pt-10/
  );
  assert.match(source, /className="mb-8 flex flex-wrap items-center gap-2/);
  assert.match(
    source,
    /lg:grid-cols-\[minmax\(360px,0\.82fr\)_minmax\(560px,1\.18fr\)\]/
  );
  assert.match(source, /id="showcase" className="bg-\[var\(--vogue-page\)\] py-20/);
  assert.match(source, /id="what-this-tool-creates" className="bg-\[var\(--vogue-page\)\] py-16/);
  assert.match(source, /id="how-it-works" className="bg-\[var\(--vogue-page\)\] py-16/);
  assert.match(source, /id="features" className="bg-\[var\(--vogue-page\)\] py-16/);
  assert.match(source, /id="use-cases" className="bg-\[var\(--vogue-page\)\] py-16/);
  assert.match(source, /id="why-it-works" className="bg-\[var\(--vogue-page\)\] py-16/);
  assert.match(source, /id="related-tools" className="bg-\[var\(--vogue-page\)\] py-16/);
  assert.match(source, /id="faq" className="bg-\[var\(--vogue-page\)\] py-16/);
  assert.match(source, /section className="bg-\[var\(--vogue-page\)\] px-4 py-16/);
  assert.match(source, /\[\&>footer\]:!bg-\[var\(--vogue-page\)\]/);
  assert.match(source, /\[\&>footer\]:!bg-none/);
  assert.match(source, /min-h-screen bg-\[var\(--vogue-page\)\] !bg-none/);
  assert.doesNotMatch(
    source,
    /bg-\[linear-gradient\(180deg,var\(--vogue-page\)|bg-white\/80 py-20|bg-white\/90 py-16|bg-\[#fffaf7\]\/80 py-16|bg-\[#fffaf7\] py-16|bg-white\/90 px-4 py-16/
  );
});

test('non-prompt collection template uses compact fixed-size media cards', () => {
  const source = read('src/components/non-prompt/NonPromptCollectionPage.tsx');

  assert.match(source, /type CollectionCardMedia =/);
  assert.match(source, /posterSrc\?: string/);
  assert.match(source, /videoSrc\?: string/);
  assert.match(source, /function VisualRouteCard/);
  assert.doesNotMatch(source, /function EmptyTemplateSlot/);
  assert.match(source, /aspect-square/);
  assert.match(source, /h-\[58px\]/);
  assert.match(source, /items-center justify-center/);
  assert.match(source, /text-center/);
  assert.match(source, /collectionCardTitles/);
  assert.match(source, /Earth Zoom Out/);
  assert.match(source, /AI Baby Podcast/);
  assert.match(source, /\{config\.label\}/);
  assert.match(source, /grid-cols-2/);
  assert.match(source, /xl:grid-cols-7/);
  assert.doesNotMatch(source, /config\.hero\.eyebrow/);
  assert.doesNotMatch(source, /config\.hero\.title/);
  assert.doesNotMatch(source, /ImageIcon/);
  assert.doesNotMatch(source, /<Play/);
  assert.doesNotMatch(source, /emptySlotCount/);
  assert.doesNotMatch(source, /inputKindLabel/);
  assert.doesNotMatch(source, /<p[\s\S]*\{tool\.path\}/);
});

test('non-prompt middle sections keep people-first SEO depth', () => {
  for (const slug of expectedSlugs) {
    const config = NON_PROMPT_PAGE_CONFIGS[slug];

    for (const sectionKey of [
      'what',
      'how',
      'features',
      'useCases',
      'value',
    ] as const) {
      const section = config.sections[sectionKey];
      assert.ok(
        section.description.length >= 120,
        `${slug}.${sectionKey} needs a fuller E-E-A-T section description`
      );

      const entries =
        'steps' in section
          ? section.steps
          : 'points' in section
            ? section.points
            : section.items;

      for (const entry of entries) {
        assert.ok(
          entry.description.length >= 80,
          `${slug}.${sectionKey}.${entry.title} needs more specific guidance`
        );
      }
    }
  }
});
