import assert from 'node:assert/strict';
import test from 'node:test';

import {
  applyExternalPromptBracketReplacements,
  normalizeExternalPromptBrackets,
} from './external-prompt-bracket-remix';

test('external bracket normalizer turns editable placeholders into schema defaults', () => {
  const sourcePrompt =
    'Create a premium poster for [COUNTRY NAME]. [Inputs] Brand: [BRAND NAME]. Keep JSON labels ["front view","side view"].';

  const normalized = normalizeExternalPromptBrackets('x-example', sourcePrompt);

  assert.match(normalized.prompt, /Japan/);
  assert.match(normalized.prompt, /AURELIA/);
  assert.match(normalized.prompt, /Inputs:/);
  assert.match(normalized.prompt, /\["front view","side view"\]/);
  assert.doesNotMatch(normalized.prompt, /\[COUNTRY NAME\]/);
  assert.doesNotMatch(normalized.prompt, /\[BRAND NAME\]/);
  assert.equal(normalized.schema?.variables.length, 2);
  assert.equal(
    normalized.schema?.variables.every((variable) =>
      normalized.prompt.includes(variable.defaultValue)
    ),
    true
  );
});

test('external bracket replacement map repairs localized copies without changing other text', () => {
  const sourcePrompt = 'Design a campaign for [BRAND NAME] in [CITY].';
  const localizedPrompt = '为 [BRAND NAME] 在 [CITY] 设计一个高端广告视觉。';
  const normalized = normalizeExternalPromptBrackets('x-example', sourcePrompt);

  const repaired = applyExternalPromptBracketReplacements(
    localizedPrompt,
    normalized.replacements
  );

  assert.equal(repaired, '为 AURELIA 在 Kyoto 设计一个高端广告视觉。');
});

test('external bracket normalizer emits schema keys compatible with prompt schema variables', () => {
  const sourcePrompt =
    'Design a campaign for [BRAND NAME] in [COUNTRY NAME] with a hero view of [CITY].';

  const normalized = normalizeExternalPromptBrackets('x-example', sourcePrompt);
  const variables = normalized.schema?.variables ?? [];

  assert.deepEqual(
    variables.map((variable) => variable.key),
    ['brand_name', 'country_name', 'city']
  );
  assert.doesNotMatch(normalized.prompt, /\[(?:BRAND|COUNTRY|CITY)[^\]]*\]/);
  assert.match(normalized.prompt, /AURELIA/);
  assert.match(normalized.prompt, /Japan/);
  assert.match(normalized.prompt, /Kyoto/);
});
