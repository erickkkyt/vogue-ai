import assert from 'node:assert/strict';
import Module from 'node:module';
import test from 'node:test';

type CleanupStaleGenerations = typeof import('./stale-generations')['cleanupStaleGenerations'];

const loadCleanupStaleGenerations = async (): Promise<CleanupStaleGenerations> => {
  const moduleLoader = Module as unknown as {
    _load: (
      request: string,
      parent: unknown,
      isMain: boolean
    ) => unknown;
  };
  const originalLoad = moduleLoader._load;
  moduleLoader._load = function loadWithServerOnlyShim(
    request,
    parent,
    isMain
  ) {
    if (request === 'server-only') return {};
    return originalLoad.call(this, request, parent, isMain);
  };

  try {
    return (await import('./stale-generations')).cleanupStaleGenerations;
  } finally {
    moduleLoader._load = originalLoad;
  }
};

test('cleanup stale generations scans old nonterminal tasks and reports outcomes', async () => {
  const cleanupStaleGenerations = await loadCleanupStaleGenerations();
  const calls: Array<[string, Record<string, unknown>]> = [];
  const now = new Date('2026-06-17T12:00:00.000Z');

  const result = await cleanupStaleGenerations({
    now,
    staleAfterMs: 10 * 60 * 1000,
    loadStaleGenerations: async (params) => {
      calls.push(['load', params]);
      return [
        {
          id: 'generation-failed',
          userId: 'user-1',
          effectId: 16,
          status: 'processing',
          createdAt: new Date('2026-06-17T11:00:00.000Z'),
        },
        {
          id: 'generation-succeeded',
          userId: 'user-2',
          effectId: 17,
          status: 'pending',
          createdAt: new Date('2026-06-17T11:20:00.000Z'),
        },
      ];
    },
    runStatusPass: async (task) => {
      calls.push(['run', task]);
      return {
        shouldRetry: false,
        retryAfterMs: 0,
        status: task.id === 'generation-failed' ? 'failed' : 'succeeded',
      };
    },
  });

  assert.deepEqual(calls, [
    [
      'load',
      {
        before: new Date('2026-06-17T11:50:00.000Z'),
        limit: 50,
      },
    ],
    [
      'run',
      {
        id: 'generation-failed',
        userId: 'user-1',
        effectId: 16,
        status: 'processing',
        createdAt: new Date('2026-06-17T11:00:00.000Z'),
      },
    ],
    [
      'run',
      {
        id: 'generation-succeeded',
        userId: 'user-2',
        effectId: 17,
        status: 'pending',
        createdAt: new Date('2026-06-17T11:20:00.000Z'),
      },
    ],
  ]);
  assert.deepEqual(result, {
    scannedCount: 2,
    processedCount: 2,
    failedCount: 1,
    succeededCount: 1,
    errorCount: 0,
  });
});

test('cleanup stale generations counts per-task errors and continues', async () => {
  const cleanupStaleGenerations = await loadCleanupStaleGenerations();
  const result = await cleanupStaleGenerations({
    loadStaleGenerations: async () => [
      {
        id: 'generation-error',
        userId: 'user-1',
        effectId: 16,
        status: 'processing',
        createdAt: new Date('2026-06-17T11:00:00.000Z'),
      },
      {
        id: 'generation-ok',
        userId: 'user-2',
        effectId: 17,
        status: 'processing',
        createdAt: new Date('2026-06-17T11:00:00.000Z'),
      },
    ],
    runStatusPass: async (task) => {
      if (task.id === 'generation-error') {
        throw new Error('provider unavailable');
      }

      return {
        shouldRetry: false,
        retryAfterMs: 0,
        status: 'failed',
      };
    },
    logError: () => {},
  });

  assert.deepEqual(result, {
    scannedCount: 2,
    processedCount: 1,
    failedCount: 1,
    succeededCount: 0,
    errorCount: 1,
  });
});
