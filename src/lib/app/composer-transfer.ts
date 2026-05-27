export const VOGUE_APP_TRANSFER_STORAGE_KEY =
  'vogue-ai:app-composer-transfer';

export type VogueAppTransferPayload = {
  source: 'gallery';
  createdAt: number;
  model: string;
  prompt: string;
  aspectRatio: string;
  outputQuality: string;
  quality: string;
  generationCount: number;
  referenceImages: string[];
};

const isBrowser = () => typeof window !== 'undefined';

const normalizePayload = (
  payload: Partial<VogueAppTransferPayload>
): VogueAppTransferPayload | null => {
  if (
    payload.source !== 'gallery' ||
    typeof payload.model !== 'string' ||
    typeof payload.prompt !== 'string'
  ) {
    return null;
  }

  return {
    source: 'gallery',
    createdAt:
      typeof payload.createdAt === 'number' ? payload.createdAt : Date.now(),
    model: payload.model,
    prompt: payload.prompt,
    aspectRatio:
      typeof payload.aspectRatio === 'string' ? payload.aspectRatio : 'auto',
    outputQuality:
      typeof payload.outputQuality === 'string' ? payload.outputQuality : '2k',
    quality: typeof payload.quality === 'string' ? payload.quality : 'medium',
    generationCount:
      typeof payload.generationCount === 'number'
        ? payload.generationCount
        : 1,
    referenceImages: Array.isArray(payload.referenceImages)
      ? payload.referenceImages.filter(
          (referenceImage): referenceImage is string =>
            typeof referenceImage === 'string' && referenceImage.length > 0
        )
      : [],
  };
};

export function writeVogueAppTransferPayload(
  payload: VogueAppTransferPayload
) {
  if (!isBrowser()) return;

  window.sessionStorage.setItem(
    VOGUE_APP_TRANSFER_STORAGE_KEY,
    JSON.stringify(payload)
  );
}

export function readVogueAppTransferPayload() {
  if (!isBrowser()) return null;

  const rawPayload = window.sessionStorage.getItem(
    VOGUE_APP_TRANSFER_STORAGE_KEY
  );
  if (!rawPayload) return null;

  window.sessionStorage.removeItem(VOGUE_APP_TRANSFER_STORAGE_KEY);

  try {
    return normalizePayload(JSON.parse(rawPayload));
  } catch {
    return null;
  }
}
