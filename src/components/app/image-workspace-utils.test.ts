import assert from 'node:assert/strict';
import test from 'node:test';
import * as workspaceUtils from './image-workspace-utils';

const makeWorkspaceItem = (
  overrides: Partial<workspaceUtils.WorkspaceAssetItem> & {
    taskId: string;
    createdAt: string;
  }
): workspaceUtils.WorkspaceAssetItem => {
  const { taskId, createdAt, ...itemOverrides } = overrides;

  return {
    id: taskId,
    taskId,
    status: 'succeeded',
    prompt: null,
    modelId: null,
    modelLabel: null,
    paramsLabel: null,
    assetType: 'image',
    mediaUrl: null,
    mediaUrls: [],
    createdAt,
    ...itemOverrides,
  };
};

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

test('workspace timeline places newly generated live cards after older history', () => {
  const mergeWorkspaceTimelineAssets = (
    workspaceUtils as Record<string, unknown>
  ).mergeWorkspaceTimelineAssets;

  assert.equal(typeof mergeWorkspaceTimelineAssets, 'function');

  const currentTask = makeWorkspaceItem({
    taskId: 'live-current',
    status: 'pending',
    prompt: 'New card',
    createdAt: '2026-06-15T05:07:00.000Z',
  });
  const recentAssets = [
    makeWorkspaceItem({
      taskId: 'history-newer',
      prompt: 'Recent server card',
      createdAt: '2026-06-15T05:05:00.000Z',
    }),
    makeWorkspaceItem({
      taskId: 'history-older',
      prompt: 'Older server card',
      createdAt: '2026-06-15T05:00:00.000Z',
    }),
  ];

  const timeline = (
    mergeWorkspaceTimelineAssets as (params: {
      currentTask: workspaceUtils.WorkspaceAssetItem | null;
      recentAssets: workspaceUtils.WorkspaceAssetItem[];
    }) => workspaceUtils.WorkspaceAssetItem[]
  )({ currentTask, recentAssets });

  assert.deepEqual(
    timeline.map((item) => item.taskId),
    ['history-older', 'history-newer', 'live-current']
  );
});

test('workspace timeline keeps server-completed duplicate tasks in position', () => {
  const mergeWorkspaceTimelineAssets = (
    workspaceUtils as Record<string, unknown>
  ).mergeWorkspaceTimelineAssets as (params: {
    currentTask: workspaceUtils.WorkspaceAssetItem | null;
    recentAssets: workspaceUtils.WorkspaceAssetItem[];
  }) => workspaceUtils.WorkspaceAssetItem[];

  const currentTask = makeWorkspaceItem({
    taskId: 'generation-1',
    status: 'processing',
    prompt: 'Live task',
    mediaUrl: null,
    mediaUrls: [],
    createdAt: '2026-06-15T05:07:00.000Z',
  });
  const recentAssets = [
    makeWorkspaceItem({
      taskId: 'generation-1',
      status: 'succeeded',
      prompt: 'Server task',
      mediaUrl: 'https://cdn.test/final.png',
      mediaUrls: ['https://cdn.test/final.png'],
      createdAt: '2026-06-15T05:07:00.000Z',
    }),
    makeWorkspaceItem({
      taskId: 'history-older',
      prompt: 'Older server card',
      createdAt: '2026-06-15T05:00:00.000Z',
    }),
  ];

  const timeline = mergeWorkspaceTimelineAssets({
    currentTask,
    recentAssets,
  });

  assert.deepEqual(
    timeline.map((item) => item.taskId),
    ['history-older', 'generation-1']
  );
  assert.equal(timeline[1].status, 'succeeded');
  assert.equal(timeline[1].mediaUrl, 'https://cdn.test/final.png');
});
