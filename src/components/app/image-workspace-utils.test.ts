import assert from 'node:assert/strict';
import test from 'node:test';
import * as workspaceUtils from './image-workspace-utils';

test('workspace optimistic task helpers create and reconcile a live pending card', () => {
  const createOptimisticWorkspaceTask = (
    workspaceUtils as Record<string, unknown>
  ).createOptimisticWorkspaceTask;
  const reconcileOptimisticWorkspaceTask = (
    workspaceUtils as Record<string, unknown>
  ).reconcileOptimisticWorkspaceTask;

  assert.equal(typeof createOptimisticWorkspaceTask, 'function');
  assert.equal(typeof reconcileOptimisticWorkspaceTask, 'function');

  const provisionalTask = (
    createOptimisticWorkspaceTask as (params: {
      id: string;
      prompt: string;
      modelId: string;
      modelLabel: string;
      paramsLabel: string;
      createdAt: string;
      expectedGenerationSeconds?: number | null;
      standardGenerationSeconds?: number | null;
      fasterGenerationSeconds?: number | null;
      generationAccessTier?: 'standard' | 'faster' | null;
    }) => workspaceUtils.WorkspaceAssetItem
  )({
    id: 'live-123',
    prompt: 'Editorial product photo',
    modelId: 'gptimage2',
    modelLabel: 'GPT Image 2',
    paramsLabel: '1 image | 1:1 | 1K | medium',
    createdAt: '2026-05-27T08:00:00.000Z',
    expectedGenerationSeconds: 70,
    standardGenerationSeconds: 70,
    fasterGenerationSeconds: 35,
    generationAccessTier: 'standard',
  });

  assert.deepEqual(provisionalTask, {
    id: 'live-123',
    taskId: 'live-123',
    status: 'pending',
    prompt: 'Editorial product photo',
    modelId: 'gptimage2',
    modelLabel: 'GPT Image 2',
    paramsLabel: '1 image | 1:1 | 1K | medium',
    assetType: 'image',
    mediaUrl: null,
    mediaUrls: [],
    createdAt: '2026-05-27T08:00:00.000Z',
    expectedGenerationSeconds: 70,
    standardGenerationSeconds: 70,
    fasterGenerationSeconds: 35,
    generationAccessTier: 'standard',
  });

  const reconciledTask = (
    reconcileOptimisticWorkspaceTask as (params: {
      task: workspaceUtils.WorkspaceAssetItem;
      provisionalTaskId: string;
      generationId: string;
      status: workspaceUtils.WorkspaceAssetStatus;
      mediaUrl: string | null;
      mediaUrls?: string[];
    }) => workspaceUtils.WorkspaceAssetItem
  )({
    task: provisionalTask,
    provisionalTaskId: 'live-123',
    generationId: 'generation-456',
    status: 'processing',
    mediaUrl: null,
    mediaUrls: ['https://cdn.test/a.png', 'https://cdn.test/b.png'],
  });

  assert.equal(reconciledTask.id, 'generation-456');
  assert.equal(reconciledTask.taskId, 'generation-456');
  assert.equal(reconciledTask.status, 'processing');
  assert.equal(reconciledTask.prompt, 'Editorial product photo');
  assert.equal(reconciledTask.mediaUrl, null);
  assert.deepEqual(reconciledTask.mediaUrls, [
    'https://cdn.test/a.png',
    'https://cdn.test/b.png',
  ]);
  assert.equal(reconciledTask.createdAt, '2026-05-27T08:00:00.000Z');
});
