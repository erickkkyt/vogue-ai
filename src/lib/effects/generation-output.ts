export type ProviderGenerationStatus =
  | 'pending'
  | 'processing'
  | 'succeeded'
  | 'failed';

export const readProviderTaskId = (output: unknown) => {
  if (!output || typeof output !== 'object') return null;
  const outputObject = output as Record<string, unknown>;
  const taskId = outputObject.taskId ?? outputObject.providerTaskId;
  return typeof taskId === 'string' && taskId ? taskId : null;
};

export const publicStatusFromProvider = (status: ProviderGenerationStatus) => {
  if (status === 'succeeded') return 'succeeded';
  if (status === 'failed') return 'failed';
  return 'processing';
};
