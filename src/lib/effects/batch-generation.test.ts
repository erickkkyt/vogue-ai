import assert from 'node:assert/strict';
import test from 'node:test';

import {
  buildFanoutBatchGenerationResult,
  getBatchProviderTaskIds,
  getRequestedGenerationCount,
  mergeBatchGenerationResults,
  shouldFanOutImageGeneration,
} from './batch-generation';

test('clamps requested image count to the workspace batch limit', () => {
  assert.equal(getRequestedGenerationCount({ n: 4 }), 4);
  assert.equal(getRequestedGenerationCount({ n: 99 }), 4);
  assert.equal(getRequestedGenerationCount({ n: 0 }), 1);
  assert.equal(getRequestedGenerationCount({ n: '3' }), 3);
  assert.equal(getRequestedGenerationCount({}), 1);
});

test('fans out multi-image requests when the provider does not support native count', () => {
  assert.equal(
    shouldFanOutImageGeneration({
      effect: { provider: 'kie.z-image' },
      input: { n: 4 },
    }),
    true
  );
  assert.equal(
    shouldFanOutImageGeneration({
      effect: { provider: 'kie.gpt-image-2' },
      input: { n: 4 },
    }),
    true
  );
  assert.equal(
    shouldFanOutImageGeneration({
      effect: { provider: 'evolink.gpt-image-2' },
      input: { n: 4 },
    }),
    false
  );
  assert.equal(
    shouldFanOutImageGeneration({
      effect: { provider: 'kie.z-image' },
      input: { n: 1 },
    }),
    false
  );
});

test('builds one stored batch output from multiple provider submissions', () => {
  const result = buildFanoutBatchGenerationResult({
    requestedCount: 4,
    results: [
      { status: 'processing', output: { taskId: 'task-a' } },
      { status: 'processing', output: { providerTaskId: 'task-b' } },
      {
        status: 'succeeded',
        output: { taskId: 'task-c', image_urls: ['https://cdn.test/c.png'] },
      },
      { status: 'failed', error: 'rate limited' },
    ],
  });

  assert.equal(result.status, 'processing');
  assert.deepEqual(getBatchProviderTaskIds(result.output), [
    'task-a',
    'task-b',
    'task-c',
  ]);
  assert.deepEqual(
    (result.output as Record<string, unknown>).image_urls,
    ['https://cdn.test/c.png']
  );
});

test('keeps batch processing until accepted tasks are terminal', () => {
  const output = {
    batchMode: 'fanout',
    batchRequestedCount: 2,
    batchProviderTaskIds: ['task-a', 'task-b'],
    batchTasks: [
      { taskId: 'task-a', status: 'processing' },
      { taskId: 'task-b', status: 'processing' },
    ],
  };

  const result = mergeBatchGenerationResults({
    previousOutput: output,
    checkedResults: [
      {
        taskId: 'task-a',
        result: {
          status: 'succeeded',
          output: { taskId: 'task-a', image_urls: ['https://cdn.test/a.png'] },
        },
      },
      {
        taskId: 'task-b',
        result: { status: 'processing', output: { taskId: 'task-b' } },
      },
    ],
  });

  assert.equal(result.status, 'processing');
  assert.deepEqual(result.imageUrls, ['https://cdn.test/a.png']);
});

test('succeeds a fanout batch with every completed image url in order', () => {
  const output = {
    batchMode: 'fanout',
    batchRequestedCount: 2,
    batchProviderTaskIds: ['task-a', 'task-b'],
    batchTasks: [
      { taskId: 'task-a', status: 'processing' },
      { taskId: 'task-b', status: 'processing' },
    ],
  };

  const result = mergeBatchGenerationResults({
    previousOutput: output,
    checkedResults: [
      {
        taskId: 'task-a',
        result: {
          status: 'succeeded',
          output: { taskId: 'task-a', image_urls: ['https://cdn.test/a.png'] },
        },
      },
      {
        taskId: 'task-b',
        result: {
          status: 'succeeded',
          output: { taskId: 'task-b', result_url: 'https://cdn.test/b.png' },
        },
      },
    ],
  });

  assert.equal(result.status, 'succeeded');
  assert.deepEqual(result.imageUrls, [
    'https://cdn.test/a.png',
    'https://cdn.test/b.png',
  ]);
  assert.equal(
    (result.output as Record<string, unknown>).result_url,
    'https://cdn.test/a.png'
  );
});

test('fails a fanout batch only when every accepted task failed', () => {
  const output = {
    batchMode: 'fanout',
    batchRequestedCount: 2,
    batchProviderTaskIds: ['task-a', 'task-b'],
    batchTasks: [
      { taskId: 'task-a', status: 'processing' },
      { taskId: 'task-b', status: 'processing' },
    ],
  };

  const result = mergeBatchGenerationResults({
    previousOutput: output,
    checkedResults: [
      {
        taskId: 'task-a',
        result: { status: 'failed', error: 'failed a' },
      },
      {
        taskId: 'task-b',
        result: { status: 'failed', error: 'failed b' },
      },
    ],
  });

  assert.equal(result.status, 'failed');
  assert.equal(result.error, 'failed a; failed b');
});
