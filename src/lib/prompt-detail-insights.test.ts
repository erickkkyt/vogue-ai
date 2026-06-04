import assert from 'node:assert/strict';
import test from 'node:test';

import { getPromptDetailInsights } from './prompt-detail-insights';
import type { VoguePromptEntry } from './prompts';

test('prompt detail insights prefer English prompt translations for SEO signals', () => {
  const entry: VoguePromptEntry = {
    id: 'x-2044592146255352100',
    publicId: '010104001',
    sourceOrder: 1,
    title: 'Oda Nobunaga X Post Page AI Prompt',
    images: [],
    prompt: '織田信長のX投稿ページを作成してください。',
    promptTranslations: {
      en: 'Create an X post page for Oda Nobunaga.',
    },
    imagePrompts: [
      {
        image: '',
        prompt: '織田信長のX投稿ページを作成してください。',
        promptTranslations: {
          en: 'Create an X (Twitter) post page for Oda Nobunaga just before the Honno-ji Incident.',
        },
      },
    ],
    modelId: 'gptimage2',
    categoryKey: 'ui',
    publishedLabel: '2026-06-04',
  };

  const insights = getPromptDetailInsights(entry);

  assert.match(insights.whyItWorks, /clear UI concept job/);
  assert.match(insights.whyItWorks, /Twitter Just Before Honno Incident/);
  assert.match(insights.whyItWorks, /Oda Nobunaga X Post Page/);
  assert.doesNotMatch(insights.whyItWorks, /織田信長/);
  assert.equal(insights.anatomy[1]?.value, 'GPT Image 2 UI concept prompt');
  assert.equal(insights.adaptationTips.length >= 3, true);
});
