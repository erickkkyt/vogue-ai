export const VOGUE_APP_TRANSFER_STORAGE_KEY =
  'vogue-ai:app-composer-transfer';

export type VogueAppTransferReferenceImage =
  | {
      source: 'remote';
      url: string;
    }
  | {
      source: 'local';
      id: string;
      name: string;
    };

export type VogueAppTransferLocalReference = {
  id: string;
  file: File;
  name: string;
};

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
  referenceImageItems: VogueAppTransferReferenceImage[];
  localReferenceTransferId?: string;
};

const isBrowser = () => typeof window !== 'undefined';

declare global {
  interface Window {
    __VOGUE_APP_TRANSFER_LOCAL_REFERENCES__?: Map<
      string,
      VogueAppTransferLocalReference[]
    >;
  }
}

const getLocalReferenceStore = () => {
  if (!isBrowser()) return null;

  window.__VOGUE_APP_TRANSFER_LOCAL_REFERENCES__ ??= new Map();
  return window.__VOGUE_APP_TRANSFER_LOCAL_REFERENCES__;
};

const createTransferId = () =>
  globalThis.crypto?.randomUUID?.() ??
  `transfer-${Date.now()}-${Math.random().toString(36).slice(2)}`;

const normalizeReferenceImageItems = (
  value: unknown,
  fallbackUrls: string[]
): VogueAppTransferReferenceImage[] => {
  if (!Array.isArray(value)) {
    return fallbackUrls.map((url) => ({ source: 'remote', url }));
  }

  return value.flatMap((item): VogueAppTransferReferenceImage[] => {
    if (!item || typeof item !== 'object') return [];

    const record = item as Record<string, unknown>;
    if (record.source === 'remote' && typeof record.url === 'string') {
      return record.url ? [{ source: 'remote', url: record.url }] : [];
    }

    if (
      record.source === 'local' &&
      typeof record.id === 'string' &&
      typeof record.name === 'string'
    ) {
      return record.id ? [{ source: 'local', id: record.id, name: record.name }] : [];
    }

    return [];
  });
};

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

  const referenceImages = Array.isArray(payload.referenceImages)
    ? payload.referenceImages.filter(
        (referenceImage): referenceImage is string =>
          typeof referenceImage === 'string' && referenceImage.length > 0
      )
    : [];

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
    referenceImages,
    referenceImageItems: normalizeReferenceImageItems(
      payload.referenceImageItems,
      referenceImages
    ),
    localReferenceTransferId:
      typeof payload.localReferenceTransferId === 'string'
        ? payload.localReferenceTransferId
        : undefined,
  };
};

export function writeVogueAppTransferPayload(
  payload: VogueAppTransferPayload & {
    localReferenceFiles?: VogueAppTransferLocalReference[];
  }
) {
  if (!isBrowser()) return;

  const { localReferenceFiles = [], ...serializablePayload } = payload;
  const nextPayload: VogueAppTransferPayload = {
    ...serializablePayload,
  };

  if (localReferenceFiles.length > 0) {
    const transferId = createTransferId();
    getLocalReferenceStore()?.set(transferId, localReferenceFiles);
    nextPayload.localReferenceTransferId = transferId;
  }

  window.sessionStorage.setItem(
    VOGUE_APP_TRANSFER_STORAGE_KEY,
    JSON.stringify(nextPayload)
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
    const payload = normalizePayload(JSON.parse(rawPayload));
    if (!payload) return null;

    const localReferenceFiles =
      payload.localReferenceTransferId
        ? getLocalReferenceStore()?.get(payload.localReferenceTransferId) ?? []
        : [];

    if (payload.localReferenceTransferId) {
      getLocalReferenceStore()?.delete(payload.localReferenceTransferId);
    }

    return {
      ...payload,
      localReferenceFiles,
    };
  } catch {
    return null;
  }
}
