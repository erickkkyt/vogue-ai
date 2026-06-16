import assert from 'node:assert/strict';
import test from 'node:test';

import {
  getLinkedOutputUrls,
  getOutputFallbackUrls,
  readProviderUrlFromAssetMetadata,
  resolveWorkspaceMediaUrls,
} from './generated-workspace-feed-utils';

test('workspace feed prefers canonical generation output urls over duplicated asset links', () => {
  const mediaUrls = resolveWorkspaceMediaUrls({
    output: {
      result_url: 'https://media.vogueai.net/effects/generation/images/final.png',
      image_urls: ['https://media.vogueai.net/effects/generation/images/final.png'],
    },
    linkedOutputRecords: [
      {
        publicUrl: 'https://media.vogueai.net/effects/generation/images/a.png',
        providerUrl: 'https://provider.test/original.png',
        createdAt: new Date('2026-06-14T21:08:54.000Z'),
      },
      {
        publicUrl: 'https://media.vogueai.net/effects/generation/images/b.png',
        providerUrl: 'https://provider.test/original.png',
        createdAt: new Date('2026-06-14T21:08:55.000Z'),
      },
      {
        publicUrl: 'https://media.vogueai.net/effects/generation/images/c.png',
        providerUrl: 'https://provider.test/original.png',
        createdAt: new Date('2026-06-14T21:10:16.000Z'),
      },
    ],
  });

  assert.deepEqual(mediaUrls, [
    'https://media.vogueai.net/effects/generation/images/final.png',
  ]);
});

test('workspace feed dedupes linked outputs by provider url for legacy rows', () => {
  const mediaUrls = getLinkedOutputUrls([
    {
      publicUrl: 'https://media.vogueai.net/effects/generation/images/a.png',
      providerUrl: 'https://provider.test/original.png',
      createdAt: new Date('2026-06-14T21:08:54.000Z'),
    },
    {
      publicUrl: 'https://media.vogueai.net/effects/generation/images/b.png',
      providerUrl: 'https://provider.test/original.png',
      createdAt: new Date('2026-06-14T21:08:55.000Z'),
    },
    {
      publicUrl: 'https://media.vogueai.net/effects/generation/images/other.png',
      providerUrl: 'https://provider.test/other.png',
      createdAt: new Date('2026-06-14T21:08:56.000Z'),
    },
  ]);

  assert.deepEqual(mediaUrls, [
    'https://media.vogueai.net/effects/generation/images/a.png',
    'https://media.vogueai.net/effects/generation/images/other.png',
  ]);
});

test('workspace feed reads image_urls before result_url and removes exact duplicates', () => {
  assert.deepEqual(
    getOutputFallbackUrls({
      image_urls: [
        'https://media.vogueai.net/effects/generation/images/a.png',
        'https://media.vogueai.net/effects/generation/images/b.png',
      ],
      result_url: 'https://media.vogueai.net/effects/generation/images/a.png',
    }),
    [
      'https://media.vogueai.net/effects/generation/images/a.png',
      'https://media.vogueai.net/effects/generation/images/b.png',
    ]
  );
});

test('workspace feed extracts provider urls from asset metadata', () => {
  assert.equal(
    readProviderUrlFromAssetMetadata({
      providerUrl: 'https://provider.test/original.png',
      generationId: 'generation-1',
    }),
    'https://provider.test/original.png'
  );
  assert.equal(readProviderUrlFromAssetMetadata({ providerUrl: '' }), null);
  assert.equal(readProviderUrlFromAssetMetadata(null), null);
});
