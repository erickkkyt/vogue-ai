type OutputQuality = '1080p' | '4k';

const asObject = (value: unknown): Record<string, unknown> =>
  value && typeof value === 'object' ? (value as Record<string, unknown>) : {};

export function supportsDeferredQualityFinalization(
  provider?: string | null
): boolean {
  return provider === 'veo3.1';
}

export function getRequestedDeferredOutputQuality(
  input: unknown,
  provider?: string | null
): OutputQuality | null {
  if (!supportsDeferredQualityFinalization(provider)) return null;

  const inputObject = asObject(input);
  const quality = inputObject.wmOutputQuality;

  return quality === '1080p' || quality === '4k' ? quality : null;
}

