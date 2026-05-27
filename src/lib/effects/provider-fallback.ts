import type { GenerationResult } from '@/lib/adapters/base-adapter';
import { readProviderTaskId } from './generation-output';

type ProviderStatus = GenerationResult['status'];

export type ProviderFallbackAttempt = {
  attempt: number;
  provider: string;
  status: ProviderStatus;
  accepted: boolean;
  providerTaskId: string | null;
  error: string | null;
};

export type ProviderFallbackEntry = {
  provider: string;
  createGeneration: () => Promise<GenerationResult>;
};

const asObject = (value: unknown): Record<string, unknown> =>
  value && typeof value === 'object' ? (value as Record<string, unknown>) : {};

const isAcceptedProviderResult = (result: GenerationResult) => {
  if (result.status === 'succeeded') return true;
  if (result.status === 'pending' || result.status === 'processing') {
    return Boolean(readProviderTaskId(result.output));
  }
  return false;
};

const withFallbackOutput = ({
  output,
  selectedProvider,
  attempts,
}: {
  output?: unknown;
  selectedProvider: string | null;
  attempts: ProviderFallbackAttempt[];
}) => ({
  ...asObject(output),
  selectedProvider,
  providerAttempts: attempts,
});

export async function runProviderFallbackChain({
  providers,
}: {
  providers: ProviderFallbackEntry[];
}) {
  const attempts: ProviderFallbackAttempt[] = [];

  for (const [index, providerEntry] of providers.entries()) {
    let result: GenerationResult;
    try {
      result = await providerEntry.createGeneration();
    } catch (error) {
      result = {
        status: 'failed',
        error:
          error instanceof Error ? error.message : 'Unknown provider error',
      };
    }

    const providerTaskId = readProviderTaskId(result.output);
    const accepted = isAcceptedProviderResult(result);
    const missingFeedback =
      !accepted &&
      (result.status === 'pending' || result.status === 'processing') &&
      !providerTaskId;
    const error = accepted
      ? null
      : missingFeedback
        ? `Provider returned ${result.status} without a task id`
        : result.error || `Provider returned ${result.status}`;

    attempts.push({
      attempt: index + 1,
      provider: providerEntry.provider,
      status: result.status,
      accepted,
      providerTaskId,
      error,
    });

    if (accepted) {
      return {
        selectedProvider: providerEntry.provider,
        attempts,
        result: {
          ...result,
          output: withFallbackOutput({
            output: result.output,
            selectedProvider: providerEntry.provider,
            attempts,
          }),
        },
      };
    }
  }

  return {
    selectedProvider: null,
    attempts,
    result: {
      status: 'failed' as const,
      error: `All GPT Image 2 providers failed: ${attempts
        .map((attempt) => `${attempt.provider}: ${attempt.error}`)
        .join('; ')}`,
      output: withFallbackOutput({
        selectedProvider: null,
        attempts,
      }),
    },
  };
}
