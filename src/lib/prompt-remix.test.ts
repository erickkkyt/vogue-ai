import assert from 'node:assert/strict';
import test from 'node:test';

import {
  applyPromptRemixValues,
  buildPromptRemixSegments,
  findPromptRemixVariableAtOffset,
  formatPromptForRemixDisplay,
  getInitialPromptRemixValues,
  getPromptRemixSchema,
  replacePromptRemixVariableValue,
  type PromptRemixSchema,
} from './prompt-remix';
import generatedDbPromptRemixSchemas from './generated/vogueai-db-prompt-remix-schemas.json';
import generatedExternalPromptRemixSchemas from './generated/vogueai-external-prompt-remix-schemas.json';
import generatedGptImage2Prompts from './generated/awesome-gptimage2-prompts.json';
import { getPromptEntryById } from './prompts';

test('prompt remix schema highlights variables and keeps the original prompt immutable', () => {
  const schema = getPromptRemixSchema(
    'vogueai-20260603-watercolor-travel-poster-ai-prompt'
  );
  assert.ok(schema);
  const prompt =
    'Theme: Sanssouci Palace travel journal illustration. Style: watercolor and fine ink urban sketch, visible cotton paper texture.';
  const initialValues = getInitialPromptRemixValues(schema);
  const remixedPrompt = applyPromptRemixValues(prompt, schema, {
    ...initialValues,
    landmark: 'Kiyomizu-dera',
  });

  assert.equal(
    prompt,
    'Theme: Sanssouci Palace travel journal illustration. Style: watercolor and fine ink urban sketch, visible cotton paper texture.'
  );
  assert.match(remixedPrompt, /Kiyomizu-dera travel journal/);
  assert.doesNotMatch(remixedPrompt, /Sanssouci Palace/);

  const segments = buildPromptRemixSegments(remixedPrompt, schema, {
    ...initialValues,
    landmark: 'Kiyomizu-dera',
  });
  assert.ok(segments.some((segment) => segment.type === 'variable'));
  assert.ok(segments.some((segment) => segment.type === 'keep'));
});

test('prompt remix display compacts source formatting without changing action prompt', () => {
  const prompt = `{
  "ai_agent_name": "Codex",
  "app_name": "OnlyFans",
  "funny_action": "pretend it is researching creator subscription business models",
  "system_style": "macOS"
}`;

  const displayPrompt = formatPromptForRemixDisplay(prompt);

  assert.equal(prompt.split('\n').length, 6);
  assert.equal(displayPrompt.split('\n').length, 1);
  assert.match(displayPrompt, /^\{ "ai_agent_name": "Codex", "app_name":/);
  assert.match(
    displayPrompt,
    /"funny_action": "pretend it is researching creator subscription business models"/
  );
});

test('prompt remix helpers locate the active composer variable and replace it safely', () => {
  const schema = getPromptRemixSchema(
    'vogueai-20260603-double-exposure-city-poster-ai-prompt'
  );
  assert.ok(schema);
  const prompt =
    'Theme: San Antonio vs New York double-exposure basketball poster. Main subjects: Victor Wembanyama on the left and Jalen Brunson on the right. The San Antonio side uses silver, black, and white light.';
  const values = getInitialPromptRemixValues(schema);

  const subjectOffset = prompt.indexOf('Victor Wembanyama') + 3;
  const activeVariable = findPromptRemixVariableAtOffset(
    prompt,
    schema,
    values,
    subjectOffset
  );

  assert.equal(activeVariable?.key, 'subjectA');
  assert.equal(activeVariable?.label, 'Subject A');
  assert.equal(activeVariable?.text, 'Victor Wembanyama');

  const citySwap = replacePromptRemixVariableValue(
    prompt,
    schema,
    values,
    'cityA',
    'Chicago'
  );

  assert.equal(citySwap.values.cityA, 'Chicago');
  assert.match(citySwap.prompt, /Theme: Chicago vs New York/);
  assert.match(citySwap.prompt, /The Chicago side uses/);
  assert.doesNotMatch(citySwap.prompt, /San Antonio/);
});

test('prompt remix schema lookup can prefer an image prompt id and fall back to page id', () => {
  const pageSchema = getPromptRemixSchema(
    'vogueai-20260603-codex-macos-permission-dialog-ai-prompt'
  );
  assert.ok(pageSchema);

  const imageSchema = getPromptRemixSchema(
    'vogueai-20260603-codex-steam-macos-permission-dialog',
    'vogueai-20260603-codex-macos-permission-dialog-ai-prompt'
  );

  assert.equal(
    imageSchema?.promptId,
    'vogueai-20260603-codex-steam-macos-permission-dialog'
  );

  const fallbackSchema = getPromptRemixSchema(
    'vogueai-20260603-codex-onlyfans-macos-permission-dialog',
    'vogueai-20260603-codex-macos-permission-dialog-ai-prompt'
  );

  assert.equal(
    fallbackSchema?.promptId,
    'vogueai-20260603-codex-macos-permission-dialog-ai-prompt'
  );
});

test('generated DB prompt remix schemas expose one variable per default value', () => {
  for (const [promptId, schema] of Object.entries(generatedDbPromptRemixSchemas)) {
    const seenDefaultValues = new Set<string>();

    for (const variable of schema.variables) {
      assert.equal(
        seenDefaultValues.has(variable.defaultValue),
        false,
        `${promptId}:${variable.key} duplicates default value ${variable.defaultValue}`
      );
      seenDefaultValues.add(variable.defaultValue);
    }
  }
});

test('generated external prompt remix schemas expose defaults present in their prompt text', () => {
  const promptBySchemaId = new Map<string, string>();
  const externalSchemas = generatedExternalPromptRemixSchemas as Record<
    string,
    PromptRemixSchema
  >;
  const gptImage2Prompts = generatedGptImage2Prompts as Array<{
    id: string;
    prompt: string;
    imagePrompts?: Array<{
      sourceId?: string;
      prompt: string;
    }>;
  }>;

  for (const entry of gptImage2Prompts) {
    promptBySchemaId.set(entry.id, entry.prompt);
    for (const imagePrompt of entry.imagePrompts ?? []) {
      if (imagePrompt.sourceId) {
        promptBySchemaId.set(imagePrompt.sourceId, imagePrompt.prompt);
      }
    }
  }

  for (const [promptId, schema] of Object.entries(
    externalSchemas
  )) {
    const prompt = promptBySchemaId.get(promptId);
    assert.ok(prompt, `${promptId} should map to a generated prompt`);

    const seenDefaultValues = new Set<string>();
    const variableSegments = buildPromptRemixSegments(
      prompt,
      schema,
      getInitialPromptRemixValues(schema)
    ).filter((segment) => segment.type === 'variable');
    const highlightedVariableKeys = new Set(
      variableSegments.map((segment) => segment.key)
    );

    for (const variable of schema.variables) {
      assert.equal(
        seenDefaultValues.has(variable.defaultValue),
        false,
        `${promptId}:${variable.key} duplicates default value ${variable.defaultValue}`
      );
      seenDefaultValues.add(variable.defaultValue);
      assert.ok(
        prompt.includes(variable.defaultValue),
        `${promptId} should include default value for ${variable.key}`
      );
      assert.equal(
        highlightedVariableKeys.has(variable.key),
        true,
        `${promptId} should highlight ${variable.key}`
      );
    }
  }
});

test('VogueAI before-after prompt pages expose image-level remix variables', () => {
  const publicIds = ['030103001', '030102002', '030102003', '030101001'];

  for (const publicId of publicIds) {
    const entry = getPromptEntryById(publicId, 'en');
    assert.ok(entry, `expected prompt entry ${publicId}`);
    assert.ok(entry.imagePrompts?.length, `expected image prompts for ${publicId}`);

    for (const imagePrompt of entry.imagePrompts ?? []) {
      assert.ok(
        imagePrompt.sourceId,
        `expected image prompt source id for ${publicId}`
      );
      const schema = getPromptRemixSchema(imagePrompt.sourceId, entry.id);
      assert.ok(
        schema,
        `expected remix schema for ${imagePrompt.sourceId ?? publicId}`
      );

      const variableSegments = buildPromptRemixSegments(
        imagePrompt.prompt,
        schema,
        getInitialPromptRemixValues(schema)
      ).filter((segment) => segment.type === 'variable');
      const highlightedVariableKeys = new Set(
        variableSegments.map((segment) => segment.key)
      );

      for (const variable of schema.variables) {
        assert.ok(
          imagePrompt.prompt.includes(variable.defaultValue),
          `${schema.promptId} should include default value for ${variable.key}`
        );
        assert.ok(
          variable.suggestions.length > 0,
          `${schema.promptId} should expose replacement suggestions for ${variable.key}`
        );
        assert.equal(
          highlightedVariableKeys.has(variable.key),
          true,
          `${schema.promptId} should highlight ${variable.key}`
        );
      }
    }
  }
});
