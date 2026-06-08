import assert from 'node:assert/strict';
import test from 'node:test';

import { getPromptTranslationSourceHash } from './prompt-i18n-source-hash';

test('prompt translation source hash only depends on source title and prompt', () => {
  const base = getPromptTranslationSourceHash({
    title: 'Reusable App Landing Hero',
    prompt: 'theme: built around FocusFlow. color palette: teal and ivory.',
  });
  const sameSource = getPromptTranslationSourceHash({
    title: 'Reusable App Landing Hero',
    prompt: 'theme: built around FocusFlow. color palette: teal and ivory.',
    image: 'https://example.com/changed-image.png',
  });
  const changedPrompt = getPromptTranslationSourceHash({
    title: 'Reusable App Landing Hero',
    prompt: 'theme: built around SpendWise. color palette: blue and gold.',
  });

  assert.equal(base, sameSource);
  assert.notEqual(base, changedPrompt);
});
