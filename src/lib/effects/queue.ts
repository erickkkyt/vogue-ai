import 'server-only';

export type EffectsQueueSource = 'generate' | 'callback' | 'retry';

export type EffectsStatusCheckMessage = {
  wmTaskId: string;
  userId: string;
  effectId: number;
  attempt: number;
  source: EffectsQueueSource;
};

type EnqueueResult = {
  enqueued: boolean;
  reason?: string;
};

export const enqueueEffectsStatusCheck = async (
  _message: EffectsStatusCheckMessage
): Promise<EnqueueResult> => {
  if (process.env.VOGUE_ENABLE_GPTIMG_QUEUE !== 'true') {
    return {
      enqueued: false,
      reason: 'VOGUE_ENABLE_GPTIMG_QUEUE is not enabled',
    };
  }

  return {
    enqueued: false,
    reason: 'Queue transport is not configured in Vogue AI yet',
  };
};

