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

type ProviderFallbackDecisionInput = ProviderFallbackAttempt;

const asObject = (value: unknown): Record<string, unknown> =>
  value && typeof value === 'object' ? (value as Record<string, unknown>) : {};

const getProviderFailureMessage = ({
  status,
  error,
}: {
  provider: string;
  status: ProviderStatus;
  error?: string | null;
}) => {
  if (error) return error;
  return `Provider returned ${status}`;
};

const getNoFeedbackMessage = (status: ProviderStatus) =>
  `Provider returned ${status} without a task id`;

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
  initialAttempts = [],
  shouldStopOnFailure,
}: {
  providers: ProviderFallbackEntry[];
  initialAttempts?: ProviderFallbackAttempt[];
  shouldStopOnFailure?: (attempt: ProviderFallbackDecisionInput) => boolean;
}) {
  const attempts: ProviderFallbackAttempt[] = [...initialAttempts];

  for (const providerEntry of providers) {
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
        ? getNoFeedbackMessage(result.status)
        : getProviderFailureMessage({
            provider: providerEntry.provider,
            status: result.status,
            error: result.error,
          });

    const attempt = {
      attempt: attempts.length + 1,
      provider: providerEntry.provider,
      status: result.status,
      accepted,
      providerTaskId,
      error,
    };

    attempts.push(attempt);

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

    if (shouldStopOnFailure?.(attempt)) {
      return {
        selectedProvider: null,
        attempts,
        result: {
          status: 'failed' as const,
          error: attempt.error ?? 'Provider returned a non-retryable failure',
          output: withFallbackOutput({
            selectedProvider: null,
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
      error: `All image providers failed: ${attempts
        .map((attempt) => `${attempt.provider}: ${attempt.error}`)
        .join('; ')}`,
      output: withFallbackOutput({
        selectedProvider: null,
        attempts,
      }),
    },
  };
}
