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

test('prompt detail insights use current VogueAI category language', () => {
  const categories = [
    ['brandAds', 'brand or ad creative', 'brand system'],
    ['portrait', 'portrait or avatar', 'person identity'],
    ['fashion', 'fashion editorial', 'look styling'],
    ['social', 'social content', 'creator subject'],
  ] as const;

  for (const [categoryKey, promptJob, variableLabel] of categories) {
    const insights = getPromptDetailInsights({
      id: `vogueai-${categoryKey}`,
      publicId: '030101999',
      sourceOrder: 1,
      title: 'Reusable Campaign Prompt AI',
      images: ['https://media.vogueai.net/example.png'],
      prompt:
        'Subject: clean reusable visual system. Composition: structured hero frame. Style: premium editorial direction. Typography: short English headline.',
      modelId: 'gptimage2',
      categoryKey,
      publishedLabel: '2026-06-15',
    });

    assert.equal(insights.anatomy[1]?.value, `GPT Image 2 ${promptJob} prompt`);
    assert.match(insights.whyItWorks, new RegExp(`clear ${promptJob} job`));
    assert.equal(insights.variables[0]?.startsWith(`${variableLabel}:`), true);
    assert.doesNotMatch(insights.whyItWorks, /creative image job/);
  }
});
