export type WorkspaceMediaCategory = 'image' | 'video' | 'audio';

export type WorkspaceMediaSlotKind =
  | 'reference-image'
  | 'reference-video'
  | 'reference-audio';

export type WorkspaceMediaSlot = {
  kind: WorkspaceMediaSlotKind;
};

export type WorkspaceMediaSection = {
  max: number;
  slots: WorkspaceMediaSlot[];
};

export type WorkspaceMediaSchema = {
  image: WorkspaceMediaSection;
  video: WorkspaceMediaSection;
  audio: WorkspaceMediaSection;
};

export type WorkspaceMediaSlotUrls = Array<string | null>;

const MAX_REFERENCE_IMAGE_SLOTS = 6;

const createSection = (
  max: number,
  slots: WorkspaceMediaSlot[]
): WorkspaceMediaSection => ({
  max,
  slots,
});

const repeatSlots = (
  kind: WorkspaceMediaSlotKind,
  count: number
): WorkspaceMediaSlot[] => Array.from({ length: count }, () => ({ kind }));

const createImageSection = (count: number): WorkspaceMediaSection => {
  const max = Math.min(count, MAX_REFERENCE_IMAGE_SLOTS);
  return createSection(max, repeatSlots('reference-image', max));
};

export const WORKSPACE_MEDIA_SCHEMAS = {
  gptimage15: {
    image: createImageSection(16),
    video: createSection(0, []),
    audio: createSection(0, []),
  },
  gptimage2: {
    image: createImageSection(16),
    video: createSection(0, []),
    audio: createSection(0, []),
  },
  nanobanana2: {
    image: createImageSection(14),
    video: createSection(0, []),
    audio: createSection(0, []),
  },
  nanobanana: {
    image: createSection(0, []),
    video: createSection(0, []),
    audio: createSection(0, []),
  },
  nanobananapro: {
    image: createImageSection(8),
    video: createSection(0, []),
    audio: createSection(0, []),
  },
} as const satisfies Record<string, WorkspaceMediaSchema>;

export const appendItemsToAvailableSlots = <T>({
  current,
  incoming,
  limit,
}: {
  current: Array<T | null>;
  incoming: T[];
  limit: number;
}):
  | { ok: true; next: Array<T | null> }
  | { ok: false; next: Array<T | null>; availableSlots: number } => {
  const next = current.slice(0, limit);
  const availableSlots = Array.from({ length: limit }).filter(
    (_, index) => (next[index] ?? null) === null
  ).length;

  if (incoming.length === 0) {
    return { ok: true, next };
  }

  if (limit <= 0 || incoming.length > availableSlots) {
    return {
      ok: false,
      next,
      availableSlots,
    };
  }

  const openIndexes = Array.from({ length: limit }).flatMap((_, index) =>
    (next[index] ?? null) === null ? [index] : []
  );

  for (const [offset, item] of incoming.entries()) {
    const openIndex = openIndexes[offset];
    if (openIndex === undefined) {
      break;
    }
    next[openIndex] = item;
  }

  return { ok: true, next };
};

export const getWorkspaceMediaSchema = (
  modelId: string
): WorkspaceMediaSchema | null => {
  if (!Object.prototype.hasOwnProperty.call(WORKSPACE_MEDIA_SCHEMAS, modelId)) {
    return null;
  }

  return WORKSPACE_MEDIA_SCHEMAS[
    modelId as keyof typeof WORKSPACE_MEDIA_SCHEMAS
  ];
};

const flattenUrls = (
  slots: WorkspaceMediaSlot[],
  values: WorkspaceMediaSlotUrls
): string[] =>
  slots.flatMap((_, index) => {
    const value = values[index];
    return typeof value === 'string' && value.trim() ? [value.trim()] : [];
  });

export const buildWorkspaceMediaInput = ({
  mediaSchema,
  imageSlotUrls,
  videoSlotUrls,
  audioSlotUrls,
}: {
  mediaSchema: WorkspaceMediaSchema;
  imageSlotUrls: WorkspaceMediaSlotUrls;
  videoSlotUrls: WorkspaceMediaSlotUrls;
  audioSlotUrls: WorkspaceMediaSlotUrls;
}) => ({
  imageUrls: flattenUrls(mediaSchema.image.slots, imageSlotUrls),
  videoUrls: flattenUrls(mediaSchema.video.slots, videoSlotUrls),
  audioUrls: flattenUrls(mediaSchema.audio.slots, audioSlotUrls),
});
