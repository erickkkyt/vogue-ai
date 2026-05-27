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
    }) => workspaceUtils.WorkspaceAssetItem
  )({
    id: 'live-123',
    prompt: 'Editorial product photo',
    modelId: 'gptimage2',
    modelLabel: 'GPT Image 2',
    paramsLabel: '1 image | 1:1 | 1K | medium',
    createdAt: '2026-05-27T08:00:00.000Z',
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
    createdAt: '2026-05-27T08:00:00.000Z',
  });

  const reconciledTask = (
    reconcileOptimisticWorkspaceTask as (params: {
      task: workspaceUtils.WorkspaceAssetItem;
      provisionalTaskId: string;
      generationId: string;
      status: workspaceUtils.WorkspaceAssetStatus;
      mediaUrl: string | null;
    }) => workspaceUtils.WorkspaceAssetItem
  )({
    task: provisionalTask,
    provisionalTaskId: 'live-123',
    generationId: 'generation-456',
    status: 'processing',
    mediaUrl: null,
  });

  assert.equal(reconciledTask.id, 'generation-456');
  assert.equal(reconciledTask.taskId, 'generation-456');
  assert.equal(reconciledTask.status, 'processing');
  assert.equal(reconciledTask.prompt, 'Editorial product photo');
  assert.equal(reconciledTask.createdAt, '2026-05-27T08:00:00.000Z');
});
