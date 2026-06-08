import assert from 'node:assert/strict';
import test from 'node:test';

import { buildPromptDisplaySections } from './prompt-display-sections';

test('splits compact prompts into lightly spaced readable prompt paragraphs', () => {
  const prompt =
    'Create a reusable modern app landing hero material with controlled variables. theme: A reusable modern app landing hero material built around FocusFlow, an AI task planner. screen modules: tasks, calendar, progress analytics. composition: 16:9 composition, clear focal subject. style: Clean product UI and screenshot design language. restrictions: no watermark, no random extra text subject: FocusFlow, an AI task planner, as the primary visual subject color palette: violet and warm orange controls the palette. typography: visible headline: "Plan Less. Finish More." Keep the visual style consistent with the template while changing only the listed variables.';

  const paragraphs = buildPromptDisplaySections(prompt);

  assert.deepEqual(
    paragraphs.map((section) => section.text),
    [
      'Create a reusable modern app landing hero material with controlled variables.',
      'Theme: A reusable modern app landing hero material built around FocusFlow, an AI task planner.',
      'Screen modules: tasks, calendar, progress analytics.',
      'Composition: 16:9 composition, clear focal subject.',
      'Style: Clean product UI and screenshot design language.',
      'Restrictions: no watermark, no random extra text',
      'Subject: FocusFlow, an AI task planner, as the primary visual subject',
      'Color palette: violet and warm orange controls the palette.',
      'Typography: visible headline: "Plan Less. Finish More."',
      'Keep the visual style consistent with the template while changing only the listed variables.',
    ]
  );
});

test('falls back to a single prompt section when no schema labels are present', () => {
  assert.deepEqual(buildPromptDisplaySections('A clean cinematic portrait.'), [
    {
      key: 'prompt',
      text: 'A clean cinematic portrait.',
    },
  ]);
});
