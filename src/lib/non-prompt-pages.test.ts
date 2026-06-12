import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';

import { proxy } from '@/proxy';
import { NextRequest } from 'next/server';

const RETIRED_NON_PROMPT_PATHS = [
  '/effect',
  '/model',
  '/earth-zoom',
  '/effect/earth-zoom',
  '/seedance',
  '/ai-baby-podcast',
  '/lipsync',
  '/hailuo-ai-video-generator',
  '/veo-3-generator',
  '/ai-baby-generator',
];

const RETIRED_ROUTE_FILES = [
  'src/app/[locale]/ai-baby-generator/page.tsx',
  'src/app/[locale]/ai-baby-podcast/page.tsx',
  'src/app/[locale]/earth-zoom/page.tsx',
  'src/app/[locale]/effect/page.tsx',
  'src/app/[locale]/hailuo-ai-video-generator/page.tsx',
  'src/app/[locale]/lipsync/page.tsx',
  'src/app/[locale]/model/page.tsx',
  'src/app/[locale]/seedance/page.tsx',
  'src/app/[locale]/veo-3-generator/page.tsx',
  'src/app/ai-baby-generator/page.tsx',
  'src/app/ai-baby-generator/layout.tsx',
  'src/app/ai-baby-podcast/page.tsx',
  'src/app/ai-baby-podcast/layout.tsx',
  'src/app/earth-zoom/page.tsx',
  'src/app/earth-zoom/layout.tsx',
  'src/app/effect/page.tsx',
  'src/app/effect/layout.tsx',
  'src/app/hailuo-ai-video-generator/page.tsx',
  'src/app/hailuo-ai-video-generator/layout.tsx',
  'src/app/lipsync/page.tsx',
  'src/app/lipsync/layout.tsx',
  'src/app/model/page.tsx',
  'src/app/model/layout.tsx',
  'src/app/seedance/page.tsx',
  'src/app/seedance/layout.tsx',
  'src/app/veo-3-generator/page.tsx',
  'src/app/veo-3-generator/layout.tsx',
];

const RETIRED_FRAMEWORK_FILES = [
  'src/components/non-prompt/NonPromptCollectionPage.tsx',
  'src/components/non-prompt/NonPromptToolPage.tsx',
  'src/lib/non-prompt-breadcrumbs.ts',
  'src/lib/non-prompt-collection-metadata.ts',
  'src/lib/non-prompt-collections.ts',
  'src/lib/non-prompt-page-metadata.ts',
  'src/lib/non-prompt-pages.ts',
  'src/components/common/MediaLink.tsx',
  'src/components/shared/DashboardSection.tsx',
  'src/components/shared/FeaturesSectionDemo.tsx',
  'src/config/media.ts',
];

test('retired non-prompt implementation files are removed', () => {
  for (const path of [...RETIRED_ROUTE_FILES, ...RETIRED_FRAMEWORK_FILES]) {
    assert.equal(existsSync(join(process.cwd(), path)), false, path);
  }
});

test('retired non-prompt URLs still return 410 for SEO cleanup', () => {
  for (const path of RETIRED_NON_PROMPT_PATHS) {
    const canonicalResponse = proxy(
      new NextRequest(`http://localhost:3000${path}`)
    );
    const localizedResponse = proxy(
      new NextRequest(`http://localhost:3000/zh${path}`)
    );

    assert.equal(canonicalResponse.status, 410, path);
    assert.equal(localizedResponse.status, 410, `/zh${path}`);
  }
});
