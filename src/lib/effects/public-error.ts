const DEFAULT_GENERATION_ERROR = 'Generation failed, please retry.';

export const INAPPROPRIATE_CONTENT_ERROR =
  'This request may include inappropriate content. Please adjust the prompt and try again. No credits were charged.';

export const TEMPORARILY_BUSY_ERROR =
  'The generation service is temporarily busy. Your credits were refunded. Please retry in a few minutes.';

const INTERNAL_ERROR_PATTERNS = [
  /api[_\s-]?key/i,
  /secret/i,
  /token/i,
  /not configured/i,
  /unauthorized/i,
  /forbidden/i,
  /database/i,
  /connection string/i,
];

const INAPPROPRIATE_CONTENT_ERROR_PREFIXES = [
  'Content policy violation.',
  'Contains inappropriate content.',
  'We’re so sorry, but the prompt may violate OpenAI’s content policies.',
  "We're so sorry, but the prompt may violate OpenAI's content policies.",
];

const TEMPORARILY_BUSY_ERROR_PREFIXES = [
  'Resource temporarily exhausted.',
  'Service busy.',
  'Playground task failed.',
];

const PUBLIC_ERROR_PREFIXES = ['Invalid parameters.', 'Task timed out after 10 minutes'];

const normalizeWhitespace = (message: string) =>
  message
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .join('\n')
    .trim();

export const getPublicGenerationErrorMessage = (
  error: string | null | undefined
) => {
  if (!error) return DEFAULT_GENERATION_ERROR;

  const normalized = normalizeWhitespace(error);
  if (!normalized) return DEFAULT_GENERATION_ERROR;

  if (INTERNAL_ERROR_PATTERNS.some((pattern) => pattern.test(normalized))) {
    return DEFAULT_GENERATION_ERROR;
  }
  if (
    INAPPROPRIATE_CONTENT_ERROR_PREFIXES.some((prefix) =>
      normalized.startsWith(prefix)
    )
  ) {
    return INAPPROPRIATE_CONTENT_ERROR;
  }
  if (
    TEMPORARILY_BUSY_ERROR_PREFIXES.some((prefix) =>
      normalized.startsWith(prefix)
    )
  ) {
    return TEMPORARILY_BUSY_ERROR;
  }
  if (PUBLIC_ERROR_PREFIXES.some((prefix) => normalized.startsWith(prefix))) {
    return normalized;
  }

  return DEFAULT_GENERATION_ERROR;
};

