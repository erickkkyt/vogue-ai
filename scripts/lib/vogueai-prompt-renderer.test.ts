import assert from 'node:assert/strict';
import test from 'node:test';
import { pathToFileURL } from 'node:url';

import { renderInlineVariablePrompt } from './vogueai-prompt-renderer';

test('inlines DB variables into semantic prompt slots instead of appending a variable list', () => {
  const prompt =
    "Create a reusable modern app landing hero material with controlled variables while preserving the source prompt's visual recipe. theme: A reusable modern app landing hero material built around SpendWise. composition: 16:9 composition, clear focal subject, organized supporting elements, balanced negative space, and no clutter. style: Clean product UI and screenshot design language with believable interface regions, precise spacing, and readable text blocks. restrictions: no watermark, no random extra text, no distorted anatomy, no copied copyrighted composition, avoid real logos and replace brands with fictional or generic marks when publishing subject: SpendWise as the primary visual subject, kept clear and recognizable while the template style remains stable color palette: purple and orange accent palette on a clean light gradient typography: visible text must be short, intentional, readable, and limited to the specified title, labels, UI regions, or annotations Concrete variant variables: app name=SpendWise; product category=personal finance app; brand colors=blue and soft gold; screen modules=budget, subscription tracker, saving goals; headline=Know Where Money Goes.. Keep the visual style consistent with the template while changing only the listed variables.";

  const result = renderInlineVariablePrompt(prompt, {
    app_name: 'SpendWise',
    product_category: 'personal finance app',
    brand_colors: 'blue and soft gold',
    screen_modules: 'budget, subscription tracker, saving goals',
    headline: 'Know Where Money Goes.',
  });

  assert.doesNotMatch(result, /Concrete variant variables/i);
  assert.match(result, /built around SpendWise, a personal finance app/i);
  assert.match(result, /subject: SpendWise, a personal finance app/i);
  assert.match(result, /color palette: blue and soft gold/i);
  assert.doesNotMatch(result, /purple and orange accent palette/i);
  assert.match(
    result,
    /screen modules: budget, subscription tracker, saving goals/i
  );
  assert.match(result, /visible headline: "Know Where Money Goes\."/i);
  assert.doesNotMatch(result, /\.\./);
});

test('matches the upstream KKKK workbench renderer behavior', async () => {
  const upstreamModule = await import(
    pathToFileURL(
      '/Users/kkkk/Desktop/KKKK外链整理/app/backend/src/scripts/voguePromptRenderer.ts'
    ).href
  );
  const renderUpstreamInlineVariablePrompt =
    upstreamModule.renderInlineVariablePrompt as typeof renderInlineVariablePrompt;
  const prompt =
    "Create a reusable streetwear editorial poster while preserving the source prompt's visual recipe. theme: An editorial fashion poster built around Nova. composition: centered model pose, strict negative space, readable headline. style: matte studio photography, premium magazine spacing. restrictions: no watermark, no copied logo, no random text. Concrete variant variables: brand name=Nova; product category=technical rain jacket; brand colors=graphite and safety lime; headline=Weather Moves First. Keep the visual style consistent with the template while changing only the listed variables.";
  const variables = {
    brand_name: 'Nova',
    product_category: 'technical rain jacket',
    brand_colors: 'graphite and safety lime',
    headline: 'Weather Moves First',
  };

  assert.equal(
    renderInlineVariablePrompt(prompt, variables),
    renderUpstreamInlineVariablePrompt(prompt, variables)
  );
});

test('strips legacy apply-variables JSON tails and replaces inline placeholders', () => {
  const prompt =
    'Use Image 1 as the user source selfie. Preserve {key_features}, {expression_anchor}, and {hair_shape}. Use minimal lines over {background_color}. Avoid photorealism. Apply these variables: {"key_features":"direct gaze and short dark hair","expression_anchor":"small confident mouth expression","hair_shape":"simplified rounded hair mass","background_color":"soft sky blue"}.';

  const result = renderInlineVariablePrompt(prompt, {
    key_features: 'direct gaze and short dark hair',
    expression_anchor: 'small confident mouth expression',
    hair_shape: 'simplified rounded hair mass',
    background_color: 'soft sky blue',
  });

  assert.doesNotMatch(result, /Apply these variables/i);
  assert.doesNotMatch(result, /\{key_features\}/i);
  assert.match(result, /direct gaze and short dark hair/i);
  assert.match(result, /small confident mouth expression/i);
  assert.match(result, /simplified rounded hair mass/i);
  assert.match(result, /soft sky blue/i);
});

test('uses the correct article when product category starts with a vowel sound', () => {
  const prompt =
    "Create a reusable modern app landing hero material with controlled variables. theme: A reusable modern app landing hero material built around FocusFlow. composition: 16:9 composition, clear focal subject. style: clean product UI. restrictions: no watermark. subject: FocusFlow as the primary visual subject. Keep the visual style consistent with the template while changing only the listed variables.";
  const result = renderInlineVariablePrompt(prompt, {
    app_name: 'FocusFlow',
    product_category: 'AI task planner',
  });

  assert.match(result, /built around FocusFlow, an AI task planner/i);
  assert.match(result, /subject: FocusFlow, an AI task planner, as/i);
  assert.doesNotMatch(result, /a AI task planner/i);

  const normalizedResult = renderInlineVariablePrompt(
    prompt
      .replace('built around FocusFlow.', 'built around FocusFlow, a AI task planner.')
      .replace(
        'subject: FocusFlow as the primary visual subject.',
        'subject: FocusFlow, a AI task planner, as the primary visual subject.'
      ),
    {
      app_name: 'FocusFlow',
      product_category: 'AI task planner',
    }
  );

  assert.match(normalizedResult, /built around FocusFlow, an AI task planner/i);
  assert.match(
    normalizedResult,
    /subject: FocusFlow, an AI task planner, as/i
  );
  assert.doesNotMatch(normalizedResult, /a AI task planner/i);
});
