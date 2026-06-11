import 'server-only';

import type { GenerationResult } from '@/lib/adapters/base-adapter';
import type { EffectRecord } from './effects';
import { readBatchGenerationTasks } from './batch-generation';
import {
  continueImageGenerationAfterProviderFailure,
  createAdapterForStoredImageGeneration,
} from './gpt-image-2-provider-chain';

export const checkBatchGenerationTasks = async ({
  effect,
  input,
  output,
}: {
  effect: EffectRecord;
  input: unknown;
  output: unknown;
}) => {
  const checkedResults: Array<{ taskId: string; result: GenerationResult }> = [];

  for (const task of readBatchGenerationTasks(output)) {
    if (task.status === 'succeeded' || task.status === 'failed') {
      checkedResults.push({
        taskId: task.taskId,
        result: {
          status: task.status,
          output: task.output,
          error: task.error ?? undefined,
        },
      });
      continue;
    }

    const adapter = createAdapterForStoredImageGeneration({
      effect,
      output: task.output,
    });
    if (!adapter.checkStatus) continue;

    let result = await adapter.checkStatus(task.taskId);
    if (result.status === 'failed') {
      const fallback = await continueImageGenerationAfterProviderFailure({
        effect,
        input,
        previousOutput: task.output,
        failedProviderTaskId: task.taskId,
        providerError: result.error ?? null,
      });
      if (fallback) {
        result = fallback.result;
      }
    }
    checkedResults.push({ taskId: task.taskId, result });
  }

  return checkedResults;
};
