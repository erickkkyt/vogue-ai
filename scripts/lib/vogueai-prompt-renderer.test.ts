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

test('removes internal schema scaffolding and resolves legacy bracket placeholders', () => {
  const prompt =
    "Reference Role: travel collage poster. Visual Goal: Create a reusable stylized travel collage poster from the original prompt while keeping the source-specific visual mechanism editable through variables. Source Mechanism: destination-led collage poster with landmark layering, cultural details, and campaign-style layout; editable placeholders: CITY, COUNTRY, LOCAL CULTURE / REGIONAL DESIGN, ICONIC LANDMARK, LOCAL STREET CHARACTER; Design a high-end collectible travel card visual in vertical 4:5 orientation, themed around [CITY] and [COUNTRY]; Show a hand gripping an exquisitely crafted [CITY] collectible travel card (styled as a metro pass, museum pass, boarding pass, postcard, passport page); Card design details: [LOCAL CULTURE]-inspired lettering, subtle gold foil accents, vintage transit motifs, decorative travel insignias, embossed surface. Destination: Algeria. Traveler: curious solo traveler in relaxed linen clothing carrying a small camera. Landmark Set: Sahara dunes, Algiers white architecture, Roman ruins, and Mediterranean coastline. Culture Details: market textiles, mint tea, patterned ceramics, local food, and travel-stamp motifs. Poster Palette: sun-washed turquoise, warm sand, tomato red, deep blue, and cream. Title Text: ALGERIA. Local Culture Regional Design: source-specific local culture regional design. Iconic Landmark: source-specific iconic landmark. Subject: Make curious solo traveler in relaxed linen clothing carrying a small camera the clear hero subject.";

  const result = renderInlineVariablePrompt(prompt, {
    destination: 'Algeria',
    traveler: 'curious solo traveler in relaxed linen clothing carrying a small camera',
    landmark_set:
      'Sahara dunes, Algiers white architecture, Roman ruins, and Mediterranean coastline',
    culture_details:
      'market textiles, mint tea, patterned ceramics, local food, and travel-stamp motifs',
    poster_palette: 'sun-washed turquoise, warm sand, tomato red, deep blue, and cream',
    title_text: 'ALGERIA',
    local_culture_regional_design: 'source-specific local culture regional design',
    iconic_landmark: 'source-specific iconic landmark',
  });

  assert.doesNotMatch(result, /Visual Goal|Source Mechanism|editable placeholders/i);
  assert.doesNotMatch(result, /\[[A-Z][A-Z0-9 _/-]+\]/);
  assert.doesNotMatch(result, /source-specific/i);
  assert.match(result, /Create a reusable travel collage poster/i);
  assert.match(result, /themed around Algeria/i);
  assert.match(result, /passport page/i);
  assert.match(result, /embossed surface/i);
  assert.match(result, /local culture-inspired lettering informed by market textiles/i);
  assert.match(result, /market textiles, mint tea/i);
  assert.doesNotMatch(result, /themed around Algeria and Algeria/i);
  assert.doesNotMatch(result, /passport pa\b|embossed surf\b/i);
});

test('keeps source visual mechanics while replacing product placeholder cues', () => {
  const prompt =
    'Reference Role: food commercial poster. Visual Goal: Create a reusable food commercial poster prompt from the original prompt while keeping the source-specific visual mechanism editable through variables. Source Mechanism: appetizing food hero image with styled plating, controlled surface details, and commercial lighting; editable placeholders: DISH, INGREDIENT, poetic Latin or French descriptor, DISH NAME, TAGLINE; Render [DISH] as a Dutch Golden Age or Italian Renaissance oil painting, hyperrealistic with dramatic chiaroscuro lighting; Place the hero dish front and center on dark velvet or stone, ingredients arranged in a baroque composition all around it; Add the dish name in gilded ornate typography at the top: "[DISH NAME]". Product: juicy double cheeseburger with thick beef patties. Product Category: burger. Ingredients: beef patties, melted cheese, lettuce, onion rings, secret sauce, and brioche bun. Headline Text: DOUBLE JUICE BURGER. Tagline: source-specific tagline.';

  const result = renderInlineVariablePrompt(prompt, {
    product: 'juicy double cheeseburger with thick beef patties',
    product_category: 'burger',
    ingredients:
      'beef patties, melted cheese, lettuce, onion rings, secret sauce, and brioche bun',
    headline_text: 'DOUBLE JUICE BURGER',
    tagline: 'source-specific tagline',
  });

  assert.doesNotMatch(result, /Visual Goal|Source Mechanism|editable placeholders/i);
  assert.doesNotMatch(result, /\[[A-Z][A-Z0-9 _/-]+\]/);
  assert.doesNotMatch(result, /source-specific/i);
  assert.match(result, /Render juicy double cheeseburger/i);
  assert.match(result, /"DOUBLE JUICE BURGER"/);
  assert.match(result, /commercial lighting/i);
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
