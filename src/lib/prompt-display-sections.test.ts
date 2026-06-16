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

test('recognizes bracketed schema labels from DB-backed prompt templates', () => {
  const sections = buildPromptDisplaySections(
    'Create a vertical fashion poster. 【Theme】: silent couture archive 【Collection title】: Ghost Trace 【Fashion / product direction】: transparent layered outerwear. 【Main color palette】: pale ash and pearl white. 【Model direction】: an adult high-fashion model. 【Editorial copy】: A quiet study of material and motion.'
  );

  assert.deepEqual(
    sections.map((section) => section.text),
    [
      'Create a vertical fashion poster.',
      'Theme: silent couture archive',
      'Collection title: Ghost Trace',
      'Fashion / product direction: transparent layered outerwear.',
      'Main color palette: pale ash and pearl white.',
      'Model direction: an adult high-fashion model.',
      'Editorial copy: A quiet study of material and motion.',
    ]
  );
});

test('splits long unlabeled prompts into readable sentence groups', () => {
  const sections = buildPromptDisplaySections(
    'Create a high-impact portrait poster with a contemporary sports-comic aesthetic that feels energetic, premium, and visually engaging. The overall composition should combine international football excitement with modern comic-book artwork. Incorporate signature halftone textures, dynamic typography, motion lines, speed effects, layered graphic shapes, comic-inspired panels, bold overlays, explosive accents, and decorative poster ornaments. The subject must be portrayed wearing an authentic national team jersey with realistic fabric simulation, premium textile textures, stitching, natural folds, realistic shadows, and professional finishing. Keep the final result editorial, collectible, polished, and suitable for a premium campaign poster.'
  );

  assert.ok(sections.length > 1);
  assert.ok(sections.every((section) => section.text.length > 0));
});
