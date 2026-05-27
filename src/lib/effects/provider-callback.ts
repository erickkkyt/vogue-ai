type CallbackProviderKind = 'kie' | 'ark' | 'generic';
type CallbackStatus = 'processing' | 'succeeded' | 'failed';
type CallbackRecord = Record<string, unknown>;

const asObject = (value: unknown): CallbackRecord | null =>
  value && typeof value === 'object' ? (value as CallbackRecord) : null;

const readString = (value: unknown) =>
  typeof value === 'string' && value ? value : null;

const readStatus = (value: unknown) =>
  typeof value === 'string' ? value.toLowerCase() : '';

const collectPayloadCandidates = (payload: CallbackRecord) => {
  const records: CallbackRecord[] = [];
  const append = (value: unknown) => {
    const record = asObject(value);
    if (record) records.push(record);
  };

  append(payload);
  const data = asObject(payload.data);
  const result = asObject(payload.result);
  const response = asObject(payload.response);
  const info = asObject(payload.info);
  const error = asObject(payload.error);
  append(data);
  append(result);
  append(response);
  append(info);
  append(error);
  append(data?.result);
  append(result?.data);
  append(response?.data);
  append(response?.result);

  return records;
};

const hasArkStyleStatus = (payload: CallbackRecord) =>
  collectPayloadCandidates(payload).some((candidate) =>
    readStatus(candidate.status)
  );

const resolveKieCallbackStatus = (payload: CallbackRecord): CallbackStatus => {
  const data = asObject(payload.data);
  const successFlag = data?.successFlag;
  const code = typeof payload.code === 'number' ? payload.code : null;

  if (successFlag === 1) return 'succeeded';
  if (successFlag === 2 || successFlag === 3) return 'failed';
  if (code === 200) return 'succeeded';
  if (code && code >= 400) return 'failed';
  return 'processing';
};

const resolveArkCallbackStatus = (payload: CallbackRecord): CallbackStatus => {
  const status =
    collectPayloadCandidates(payload)
      .map((candidate) => readStatus(candidate.status))
      .find(Boolean) ?? '';

  if (['failed', 'error', 'cancelled', 'canceled', 'expired'].includes(status)) {
    return 'failed';
  }
  if (['succeeded', 'success', 'done', 'completed'].includes(status)) {
    return 'succeeded';
  }
  return 'processing';
};

export const resolveEffectCallbackKind = (
  provider: string | null | undefined
): CallbackProviderKind => {
  if (provider === 'veo3.1' || provider?.startsWith('kie.')) return 'kie';
  if (provider?.startsWith('volcengine.')) return 'ark';
  return 'generic';
};

export const extractProviderCallbackTaskId = (payload: unknown) => {
  const root = asObject(payload);
  if (!root) return null;

  for (const candidate of collectPayloadCandidates(root)) {
    const taskId =
      readString(candidate.taskId) ??
      readString(candidate.task_id) ??
      readString(candidate.id);
    if (taskId) return taskId;
  }

  return null;
};

export const resolveProviderCallbackStatus = ({
  provider,
  payload,
}: {
  provider?: string | null;
  payload: unknown;
}): CallbackStatus => {
  const root = asObject(payload);
  if (!root) return 'processing';

  const kind = resolveEffectCallbackKind(provider);
  if (kind === 'kie') return resolveKieCallbackStatus(root);
  if (kind === 'ark') return resolveArkCallbackStatus(root);
  return hasArkStyleStatus(root)
    ? resolveArkCallbackStatus(root)
    : resolveKieCallbackStatus(root);
};

export const resolveProviderCallbackError = ({
  provider,
  payload,
}: {
  provider?: string | null;
  payload: unknown;
}) => {
  const root = asObject(payload);
  if (!root) return null;

  const kind = resolveEffectCallbackKind(provider);
  const candidates = collectPayloadCandidates(root);

  if (kind === 'kie') {
    const kieMessage =
      readString(root.msg) ??
      candidates.map((candidate) => readString(candidate.msg)).find(Boolean);
    if (kieMessage) return kieMessage;
  }

  for (const candidate of candidates) {
    const error = asObject(candidate.error);
    const message =
      readString(candidate.message) ??
      readString(candidate.msg) ??
      readString(error?.message);
    if (message) return message;
  }

  return null;
};

export const resolveProviderCallbackPayloadData = ({
  provider,
  payload,
}: {
  provider?: string | null;
  payload: unknown;
}) => {
  const root = asObject(payload);
  if (!root) return {};

  const kind = resolveEffectCallbackKind(provider);
  if (kind === 'ark' || (kind === 'generic' && hasArkStyleStatus(root))) {
    return root;
  }

  return asObject(root.data) ?? root;
};

