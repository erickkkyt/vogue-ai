import assert from 'node:assert/strict';
import test from 'node:test';

import {
  resolveWorkspaceGenerationTimeEstimate,
  resolveWorkspaceGenerationTimeEstimateForTier,
  resolveWorkspaceStandardGenerationTimeEstimate,
} from './generation-time-estimate';

test('estimates faster image generation time by model and quality', () => {
  assert.equal(
    resolveWorkspaceGenerationTimeEstimate({
      assetType: 'image',
      modelId: 'gptimage2',
      quality: 'low',
      outputQuality: '1k',
    }),
    45
  );
  assert.equal(
    resolveWorkspaceGenerationTimeEstimate({
      assetType: 'image',
      modelId: 'gptimage2',
      quality: 'high',
      outputQuality: '2k',
    }),
    60
  );
  assert.equal(
    resolveWorkspaceGenerationTimeEstimate({
      assetType: 'image',
      modelId: 'nanobanana',
    }),
    30
  );
  assert.equal(
    resolveWorkspaceGenerationTimeEstimate({
      assetType: 'image',
      modelId: 'nanobanana2',
    }),
    45
  );
  assert.equal(
    resolveWorkspaceGenerationTimeEstimate({
      assetType: 'image',
      modelId: 'nanobananapro',
    }),
    45
  );
  assert.equal(
    resolveWorkspaceGenerationTimeEstimate({
      assetType: 'image',
      modelId: 'zimage',
    }),
    45
  );
});

test('adds standard queue display time for standard users', () => {
  assert.equal(
    resolveWorkspaceStandardGenerationTimeEstimate({
      assetType: 'image',
      modelId: 'gptimage2',
      quality: 'low',
    }),
    60
  );
  assert.equal(
    resolveWorkspaceStandardGenerationTimeEstimate({
      assetType: 'image',
      modelId: 'gptimage2',
      quality: 'high',
    }),
    80
  );
  assert.equal(
    resolveWorkspaceStandardGenerationTimeEstimate({
      assetType: 'image',
      modelId: 'gptimage15',
    }),
    80
  );
  assert.equal(
    resolveWorkspaceStandardGenerationTimeEstimate({
      assetType: 'image',
      modelId: 'nanobanana',
    }),
    45
  );
  assert.equal(
    resolveWorkspaceStandardGenerationTimeEstimate({
      assetType: 'image',
      modelId: 'zimage',
    }),
    60
  );
});

test('resolves visible ETA by access tier', () => {
  assert.equal(
    resolveWorkspaceGenerationTimeEstimateForTier({
      accessTier: 'faster',
      assetType: 'image',
      modelId: 'gptimage2',
      quality: 'high',
    }),
    60
  );
  assert.equal(
    resolveWorkspaceGenerationTimeEstimateForTier({
      accessTier: 'standard',
      assetType: 'image',
      modelId: 'gptimage2',
      quality: 'high',
    }),
    80
  );
});
