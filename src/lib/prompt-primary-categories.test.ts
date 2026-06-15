import assert from 'node:assert/strict';
import test from 'node:test';

import {
  VOGUE_PROMPT_CATEGORY_KEYS,
  type VoguePromptConcreteCategoryKey,
} from './prompt-taxonomy';
import { getPromptEntryById } from './prompts';

const getEntryByTitle = (title: string) => {
  const entry = [
    '010107002',
    '030101019',
    '010102080',
    '010105003',
    '020109001',
    '010204002',
    '010106022',
    '010104024',
    '030101020',
    '010107005',
    '030101002',
    '010205052',
  ]
    .map((publicId) => getPromptEntryById(publicId, 'en'))
    .find((candidate) => candidate?.title === title);

  assert.ok(entry, `expected prompt entry titled "${title}"`);
  return entry;
};

test('prompt taxonomy exposes the confirmed primary category set', () => {
  assert.deepEqual(VOGUE_PROMPT_CATEGORY_KEYS, [
    'all',
    'product',
    'brandAds',
    'poster',
    'portrait',
    'fashion',
    'social',
    'ui',
    'diagram',
    'anime',
    'photo',
    'art',
  ]);
});

test('prompt entries keep legacy public ids while using refined primary categories', () => {
  const expectedCategories: Array<{
    publicId: string;
    title: string;
    categoryKey: VoguePromptConcreteCategoryKey;
  }> = [
    {
      publicId: '010107002',
      title: 'Soft Airy 35Mm Portrait',
      categoryKey: 'portrait',
    },
    {
      publicId: '030101019',
      title: 'Brand Visual Design Guide Board AI',
      categoryKey: 'brandAds',
    },
    {
      publicId: '010102080',
      title: 'VTuber Chat Stream Thumbnail',
      categoryKey: 'social',
    },
    {
      publicId: '010105003',
      title: 'Vogue Magazine Fashion Grid Collage',
      categoryKey: 'fashion',
    },
    {
      publicId: '020109001',
      title: 'Anti-Gravity Gymnastics Myth',
      categoryKey: 'art',
    },
    {
      publicId: '010204002',
      title: 'Concept Off Duty Car Selfie Itgirl Green',
      categoryKey: 'portrait',
    },
    {
      publicId: '010106022',
      title: 'Anime Character Blueprint Sheet',
      categoryKey: 'diagram',
    },
    {
      publicId: '010104024',
      title: 'YouTube Thumbnail Japanese AI Design Webinar Thumbnail',
      categoryKey: 'social',
    },
    {
      publicId: '030101020',
      title: 'Personal Image Diagnosis Consulting Board AI',
      categoryKey: 'diagram',
    },
    {
      publicId: '010107005',
      title: 'Spy Thriller Character Board',
      categoryKey: 'diagram',
    },
    {
      publicId: '030101002',
      title: 'Creator Personal Brand Identity Mockup AI Prompt',
      categoryKey: 'brandAds',
    },
    {
      publicId: '010205052',
      title: 'Premium Liquid Glass Bento Grid Product',
      categoryKey: 'product',
    },
  ];

  for (const expected of expectedCategories) {
    const entry = getPromptEntryById(expected.publicId, 'en');

    assert.ok(entry, `expected ${expected.publicId} to keep resolving`);
    assert.equal(entry.title, expected.title);
    assert.equal(entry.categoryKey, expected.categoryKey);
  }
});

test('refined primary categories do not leave avatar or epic entries behind', () => {
  const entries = [
    getEntryByTitle('Soft Airy 35Mm Portrait'),
    getEntryByTitle('Brand Visual Design Guide Board AI'),
    getEntryByTitle('VTuber Chat Stream Thumbnail'),
    getEntryByTitle('Vogue Magazine Fashion Grid Collage'),
    getEntryByTitle('Anti-Gravity Gymnastics Myth'),
  ];

  assert.equal(
    entries.some((entry) => ['avatar', 'epic'].includes(entry.categoryKey ?? '')),
    false
  );
});
