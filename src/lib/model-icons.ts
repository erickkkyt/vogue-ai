const MODEL_ICON_PATHS = {
  bytedance: '/model-icons/bytedance-color.svg',
  google: '/model-icons/google-color.svg',
  grok: '/model-icons/grok.svg',
  hunyuan: '/model-icons/hunyuan-color.svg',
  kling: '/model-icons/kling-color.svg',
  midjourney: '/model-icons/midjourney.svg',
  nanobanana: '/model-icons/nanobanana-color.svg',
  openai: '/model-icons/openai.png',
  qwen: '/model-icons/qwen-color.svg',
  sora: '/model-icons/sora-color.svg',
} as const;

const MODEL_ICON_PATH_BY_MODEL_ID: Record<string, string> = {
  gptimage15: MODEL_ICON_PATHS.openai,
  gptimage2: MODEL_ICON_PATHS.openai,
  midjourney: MODEL_ICON_PATHS.midjourney,
  nanobanana: MODEL_ICON_PATHS.nanobanana,
  nanobanana2: MODEL_ICON_PATHS.nanobanana,
  nanobananapro: MODEL_ICON_PATHS.nanobanana,
};

export const getModelIconPathByModelId = (modelId: string): string | null =>
  MODEL_ICON_PATH_BY_MODEL_ID[modelId] ?? null;
