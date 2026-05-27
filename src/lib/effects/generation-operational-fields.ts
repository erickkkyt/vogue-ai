const asObject = (value: unknown): Record<string, unknown> =>
  value && typeof value === 'object' ? (value as Record<string, unknown>) : {};

const readString = (value: unknown) =>
  typeof value === 'string' && value ? value : null;

export function deriveGenerationOperationalFields({
  output,
}: {
  output?: unknown;
}) {
  const outputObject = asObject(output);
  const providerTaskId =
    readString(outputObject.providerTaskId) ?? readString(outputObject.taskId);
  const lifecyclePhase = readString(outputObject.lifecyclePhase);

  return {
    providerTaskId,
    lifecyclePhase,
    lastProviderSyncAt: providerTaskId ? new Date() : null,
  };
}

