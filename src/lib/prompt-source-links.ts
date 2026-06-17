const LINKABLE_PROMPT_SOURCE_HOSTS = new Set(['x.com', 'twitter.com']);
const SUPPRESSED_PROMPT_SOURCE_NAME_PATTERN =
  /\b(?:meigen|nanobanana(?:\.org)?|nanobanana org|nano banana inspiration)\b/i;

export function getPromptSourceUrlHost(sourceUrl?: string | null) {
  const trimmedUrl = sourceUrl?.trim();
  if (!trimmedUrl) return null;

  try {
    return new URL(trimmedUrl).hostname.replace(/^www\./, '').toLowerCase();
  } catch {
    return null;
  }
}

export function isPromptSourceUrlLinkable(sourceUrl?: string | null) {
  const host = getPromptSourceUrlHost(sourceUrl);
  return host ? LINKABLE_PROMPT_SOURCE_HOSTS.has(host) : false;
}

export function getLinkablePromptSourceUrl(sourceUrl?: string | null) {
  const trimmedUrl = sourceUrl?.trim();
  return trimmedUrl && isPromptSourceUrlLinkable(trimmedUrl)
    ? trimmedUrl
    : undefined;
}

export function getPublicPromptSourceUrl(sourceUrl?: string | null) {
  return getLinkablePromptSourceUrl(sourceUrl) ?? null;
}

export function hasSuppressedPromptSourceName(value?: string | null) {
  return Boolean(
    value?.trim() && SUPPRESSED_PROMPT_SOURCE_NAME_PATTERN.test(value)
  );
}
