import { REFERENCE_IMAGE_MAX_FILE_SIZE } from '@/lib/constants';

const DEFAULT_MAX_PROMPT_CHARS = 2000;
const GPT_IMAGE_2_MAX_PROMPT_CHARS = 6000;
const Z_IMAGE_MAX_PROMPT_CHARS = 1000;
const GPT_IMAGE_2_MODEL_ID = 'gptimage2';
const Z_IMAGE_MODEL_ID = 'zimage';
const GPT_IMAGE_2_PROVIDERS = [
  'evolink.gpt-image-2',
  'kie.gpt-image-2',
  '302.gpt-image-2',
] as const;
const Z_IMAGE_PROVIDERS = ['kie.z-image'] as const;
const ALLOWED_IMAGE_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
] as const;

type PromptValidationSuccess = {
  ok: true;
  trimmedPrompt: string;
  charCount: number;
};

type PromptValidationFailure = {
  ok: false;
  code: 'PROMPT_REQUIRED' | 'PROMPT_TOO_LONG';
  trimmedPrompt: string;
  charCount: number;
  maxChars: number;
};

type UploadedImageValidationSuccess = {
  ok: true;
};

type UploadedImageValidationFailure = {
  ok: false;
  code: 'IMAGE_TOO_LARGE' | 'IMAGE_TYPE_UNSUPPORTED';
  maxBytes: number;
  allowedTypes?: readonly string[];
};

export const countPromptCharacters = (prompt: string) =>
  Array.from(prompt).length;

export const truncatePromptToMaxChars = (
  prompt: string,
  maxChars = DEFAULT_MAX_PROMPT_CHARS
) => Array.from(prompt).slice(0, maxChars).join('');

export function getGenerationPromptMaxChars({
  modelId,
  provider,
}: {
  modelId?: string | null;
  provider?: string | null;
} = {}) {
  if (
    modelId === Z_IMAGE_MODEL_ID ||
    Z_IMAGE_PROVIDERS.includes(
      provider as (typeof Z_IMAGE_PROVIDERS)[number]
    )
  ) {
    return Z_IMAGE_MAX_PROMPT_CHARS;
  }

  return modelId === GPT_IMAGE_2_MODEL_ID ||
    GPT_IMAGE_2_PROVIDERS.includes(
      provider as (typeof GPT_IMAGE_2_PROVIDERS)[number]
    )
    ? GPT_IMAGE_2_MAX_PROMPT_CHARS
    : DEFAULT_MAX_PROMPT_CHARS;
}

export function validateGenerationPrompt(
  prompt: string,
  options?: { maxChars?: number; required?: boolean }
): PromptValidationSuccess | PromptValidationFailure {
  const maxChars = options?.maxChars ?? DEFAULT_MAX_PROMPT_CHARS;
  const required = options?.required ?? true;
  const trimmedPrompt = prompt.trim();
  const charCount = countPromptCharacters(trimmedPrompt);
  if (required && !trimmedPrompt) {
    return {
      ok: false,
      code: 'PROMPT_REQUIRED',
      trimmedPrompt,
      charCount,
      maxChars,
    };
  }
  if (charCount > maxChars) {
    return {
      ok: false,
      code: 'PROMPT_TOO_LONG',
      trimmedPrompt,
      charCount,
      maxChars,
    };
  }
  return { ok: true, trimmedPrompt, charCount };
}

export const validateUploadedImageFile = (file: {
  size: number;
  type: string;
}): UploadedImageValidationSuccess | UploadedImageValidationFailure => {
  if (file.size > REFERENCE_IMAGE_MAX_FILE_SIZE) {
    return {
      ok: false,
      code: 'IMAGE_TOO_LARGE',
      maxBytes: REFERENCE_IMAGE_MAX_FILE_SIZE,
    };
  }

  if (
    !ALLOWED_IMAGE_MIME_TYPES.includes(
      file.type as (typeof ALLOWED_IMAGE_MIME_TYPES)[number]
    )
  ) {
    return {
      ok: false,
      code: 'IMAGE_TYPE_UNSUPPORTED',
      maxBytes: REFERENCE_IMAGE_MAX_FILE_SIZE,
      allowedTypes: ALLOWED_IMAGE_MIME_TYPES,
    };
  }

  return { ok: true };
};

export const generationValidationConstraints = {
  maxPromptChars: DEFAULT_MAX_PROMPT_CHARS,
  gptImage2MaxPromptChars: GPT_IMAGE_2_MAX_PROMPT_CHARS,
  zImageMaxPromptChars: Z_IMAGE_MAX_PROMPT_CHARS,
  maxImageFileBytes: REFERENCE_IMAGE_MAX_FILE_SIZE,
  allowedImageMimeTypes: ALLOWED_IMAGE_MIME_TYPES,
} as const;
