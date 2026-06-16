import assert from 'node:assert/strict';
import test from 'node:test';

import {
  collectRemixVariableProtectedTokens,
  protectPromptForLocalization,
  type PromptRemixSchemaMapForI18n,
} from './vogue-prompt-i18n-protection';

test('protects remix variable defaults while allowing surrounding prompt text to localize', () => {
  const subject =
    'friendly bald founder with round glasses, trimmed beard, thick eyebrows, and a small confident smile';
  const viewAngle =
    'head-only 3/4 angle, centered in a square 1:1 composition';
  const entry = {
    id: 'friendly-logo-image-01',
    parentId: 'friendly-logo-page',
    prompt: `Reference Role: vector mascot logo. Person Description: ${subject}. View Angle: ${viewAngle}.`,
  };
  const remixSchemas: PromptRemixSchemaMapForI18n = {
    'friendly-logo-image-01': {
      variables: [
        { defaultValue: subject },
        { defaultValue: viewAngle },
        { defaultValue: 'not present in this prompt' },
      ],
    },
  };

  const variableTokens = collectRemixVariableProtectedTokens(
    entry,
    remixSchemas
  );
  const protectedPrompt = protectPromptForLocalization(
    entry.prompt,
    variableTokens
  );

  assert.deepEqual(variableTokens, [subject, viewAngle]);
  assert.doesNotMatch(protectedPrompt.value, new RegExp(subject));
  assert.doesNotMatch(protectedPrompt.value, new RegExp(viewAngle));
  assert.match(protectedPrompt.value, /@@VOGUE_KEEP_0@@/);

  const localizedWithMarkers = protectedPrompt.value
    .replace('Reference Role', '参考身份')
    .replace('Person Description', '人物描述')
    .replace('View Angle', '视角');

  assert.equal(
    protectedPrompt.restore(localizedWithMarkers),
    `参考身份: vector mascot logo. 人物描述: ${subject}. 视角: ${viewAngle}.`
  );
});

test('falls back to parent remix schema for page-level prompt translations', () => {
  const appName = 'FocusFlow';
  const entry = {
    id: 'landing-hero-page',
    parentId: 'landing-hero-parent',
    prompt: `Create a landing hero for ${appName} with a clear dashboard preview.`,
  };
  const remixSchemas: PromptRemixSchemaMapForI18n = {
    'landing-hero-parent': {
      variables: [{ defaultValue: appName }],
    },
  };

  assert.deepEqual(collectRemixVariableProtectedTokens(entry, remixSchemas), [
    appName,
  ]);
});
