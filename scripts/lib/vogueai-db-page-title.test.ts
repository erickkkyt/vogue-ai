import assert from 'node:assert/strict';
import test from 'node:test';

import { getVogueAiDbPublicTitle } from './vogueai-db-page-title';

test('builds specific English titles for generic DB prompt rows', () => {
  const title = getVogueAiDbPublicTitle({
    template_id: 'ai-image-prompt-x2064922508537860150-v1',
    title: 'AI 图片 Prompt',
    prompt_schema_json: JSON.stringify({
      category: 'product_ad_poster',
    }),
    prompt_instances_json: JSON.stringify([
      {
        variables: {
          product:
            'fictional limited-edition trail sneaker with translucent sole and sculpted side panels',
          fictional_brand: 'AURORA RUN LAB',
        },
      },
    ]),
  });

  assert.equal(title, 'Aurora Run Lab Trail Sneaker Ad Poster AI Prompt');
  assert.doesNotMatch(title, /AI Image Prompt AI Prompt/i);
});

test('uses schema category when the DB title is a generic Chinese label', () => {
  const title = getVogueAiDbPublicTitle({
    template_id: 'visual-poster-x2065973105823281314-v1',
    title: '视觉海报',
    prompt_schema_json: JSON.stringify({
      category: 'ink_editorial_illustration',
    }),
    prompt_instances_json: JSON.stringify([
      {
        variables: {
          setting: 'empty coastal road with distant cliffs and low clouds',
        },
      },
    ]),
  });

  assert.equal(title, 'Empty Coastal Road Editorial Illustration AI Prompt');
});

test('keeps known curated overrides stable', () => {
  assert.equal(
    getVogueAiDbPublicTitle({
      template_id: 'nba-finals-og-putback-rim-pov-poster-v1',
      title: 'AI 图片 Prompt',
      prompt_schema_json: '{}',
      prompt_instances_json: '[]',
    }),
    'NBA Finals Putback Rim POV Poster AI Prompt'
  );
});

test('can add source motifs to de-duplicate repeated schema titles', () => {
  const title = getVogueAiDbPublicTitle(
    {
      template_id: 'ai-image-prompt-x2064922508537860150-v1',
      title: 'AI 图片 Prompt',
      prompt_schema_json: JSON.stringify({
        category: 'product_ad_poster',
        source_characteristics: [
          'commercial product hero composition with strong feature focus',
          '9:16 vertical, nine-panel 3x3 collage of a Korean female idol portrait series.',
        ],
      }),
      prompt_instances_json: JSON.stringify([
        {
          variables: {
            product:
              'fictional limited-edition trail sneaker with translucent sole and sculpted side panels',
            fictional_brand: 'AURORA RUN LAB',
          },
        },
      ]),
    },
    { includeSourceMotif: true }
  );

  assert.equal(
    title,
    'Aurora Run Lab Trail Sneaker Nine Panel Ad Poster AI Prompt'
  );
});
