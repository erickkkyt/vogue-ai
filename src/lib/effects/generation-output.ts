export type ProviderGenerationStatus =
  | 'pending'
  | 'processing'
  | 'succeeded'
  | 'failed';

export const readProviderTaskId = (output: unknown) => {
  if (!output || typeof output !== 'object') return null;
  const taskId = (output as Record<string, unknown>).taskId;
  return typeof taskId === 'string' && taskId ? taskId : null;
};

export const publicStatusFromProvider = (status: ProviderGenerationStatus) => {
  if (status === 'succeeded') return 'succeeded';
  if (status === 'failed') return 'failed';
  return 'processing';
};
