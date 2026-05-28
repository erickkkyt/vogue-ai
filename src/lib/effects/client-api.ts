export type EffectClientStatus =
  | 'pending'
  | 'processing'
  | 'succeeded'
  | 'failed';

export type EffectClientResponse<T extends Record<string, unknown>> = {
  ok: boolean;
  status: number;
  data: T;
};

type BaseEffectPayload = {
  effectId: number;
  input: Record<string, unknown>;
};

type PrecheckResponse = {
  error?: string;
  currentCredits?: number;
  requiredCredits?: number;
};

type GenerateResponse = {
  status?: EffectClientStatus;
  generationId?: string;
  wmTaskId?: string;
  providerTaskId?: string;
  output?: unknown;
  error?: string;
  requiredCredits?: number;
  trialUsed?: boolean;
  trialRemaining?: number;
};

type StatusResponse = {
  status?: EffectClientStatus;
  output?: unknown;
  error?: string;
};

type AnonymousTrialResponse = {
  trialUsed?: boolean;
  trialRemaining?: number;
};

export type EffectMetadata = {
  id: number;
  provider: string;
  inputSchema?: unknown;
  pricingSchema?: unknown;
};

type EffectsMetadataResponse = {
  effects?: Record<string, EffectMetadata>;
  error?: string;
};

const safeJson = async <T extends Record<string, unknown>>(
  response: Response
): Promise<T> => {
  try {
    return (await response.json()) as T;
  } catch {
    return {} as T;
  }
};

export const precheckEffect = async (
  payload: BaseEffectPayload
): Promise<EffectClientResponse<PrecheckResponse>> => {
  const response = await fetch('/api/effects/precheck', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  return {
    ok: response.ok,
    status: response.status,
    data: await safeJson<PrecheckResponse>(response),
  };
};

export const generateEffect = async (
  payload: BaseEffectPayload
): Promise<EffectClientResponse<GenerateResponse>> => {
  const response = await fetch('/api/effects/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  return {
    ok: response.ok,
    status: response.status,
    data: await safeJson<GenerateResponse>(response),
  };
};

export const generateAnonymousEffect = async (payload: {
  input: Pick<BaseEffectPayload['input'], 'prompt'> & {
    image_urls?: string[];
  };
}): Promise<EffectClientResponse<GenerateResponse>> => {
  const response = await fetch('/api/effects/anonymous-generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  return {
    ok: response.ok,
    status: response.status,
    data: await safeJson<GenerateResponse>(response),
  };
};

export const getEffectStatus = async (params: {
  wmTaskId: string;
  effectId: number;
  syncProvider?: 0 | 1;
}): Promise<EffectClientResponse<StatusResponse>> => {
  const query = new URLSearchParams({
    wmTaskId: params.wmTaskId,
    id: params.wmTaskId,
    effectId: String(params.effectId),
    syncProvider: String(params.syncProvider ?? 1),
  });
  const response = await fetch(`/api/effects/status?${query.toString()}`);

  return {
    ok: response.ok,
    status: response.status,
    data: await safeJson<StatusResponse>(response),
  };
};

export const getAnonymousEffectStatus = async (params: {
  wmTaskId: string;
  providerTaskId: string;
  selectedProvider?: string | null;
}): Promise<EffectClientResponse<StatusResponse>> => {
  const query = new URLSearchParams({
    wmTaskId: params.wmTaskId,
    providerTaskId: params.providerTaskId,
  });
  if (params.selectedProvider) query.set('selectedProvider', params.selectedProvider);

  const response = await fetch(`/api/effects/anonymous-status?${query.toString()}`);

  return {
    ok: response.ok,
    status: response.status,
    data: await safeJson<StatusResponse>(response),
  };
};

export const getAnonymousTrialStatus = async (): Promise<
  EffectClientResponse<AnonymousTrialResponse>
> => {
  const response = await fetch('/api/effects/anonymous-trial', {
    cache: 'no-store',
  });

  return {
    ok: response.ok,
    status: response.status,
    data: await safeJson<AnonymousTrialResponse>(response),
  };
};

export const getEffectsMetadata = async (
  ids: number[]
): Promise<EffectClientResponse<EffectsMetadataResponse>> => {
  const query = new URLSearchParams({
    ids: [...new Set(ids)].filter((id) => Number.isFinite(id)).join(','),
  });
  const response = await fetch(`/api/effects/metadata?${query.toString()}`);

  return {
    ok: response.ok,
    status: response.status,
    data: await safeJson<EffectsMetadataResponse>(response),
  };
};

export const resolveWmTaskId = (payload: {
  wmTaskId?: string;
  generationId?: string;
  output?: unknown;
}): string | null => {
  if (typeof payload.wmTaskId === 'string' && payload.wmTaskId) {
    return payload.wmTaskId;
  }
  if (typeof payload.generationId === 'string' && payload.generationId) {
    return payload.generationId;
  }
  if (payload.output && typeof payload.output === 'object') {
    const outputRecord = payload.output as Record<string, unknown>;
    if (typeof outputRecord.wmTaskId === 'string' && outputRecord.wmTaskId) {
      return outputRecord.wmTaskId;
    }
  }

  return null;
};
