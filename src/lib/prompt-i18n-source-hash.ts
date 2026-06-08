import { createHash } from 'node:crypto';

export type PromptTranslationSource = {
  title: string;
  prompt: string;
  [key: string]: unknown;
};

export function getPromptTranslationSourceHash(source: PromptTranslationSource) {
  return createHash('sha256')
    .update(
      JSON.stringify({
        title: source.title.trim(),
        prompt: source.prompt.trim(),
      })
    )
    .digest('hex')
    .slice(0, 16);
}
