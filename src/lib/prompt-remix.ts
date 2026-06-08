import generatedPromptRemixSchemas from './generated/vogueai-db-prompt-remix-schemas.json';

export type PromptRemixVariable = {
  key: string;
  label: string;
  defaultValue: string;
  suggestions: string[];
};

export type PromptRemixSchema = {
  promptId: string;
  variables: PromptRemixVariable[];
  keepTerms: string[];
};

export type PromptRemixValues = Record<string, string>;

export type PromptRemixSegment =
  | {
      type: 'text';
      text: string;
    }
  | {
      type: 'variable';
      text: string;
      key: string;
      label: string;
    }
  | {
      type: 'keep';
      text: string;
    };

export type PromptRemixVariableRange = {
  key: string;
  label: string;
  defaultValue: string;
  suggestions: string[];
  start: number;
  end: number;
  text: string;
};

const generatedPromptRemixSchemaMap =
  generatedPromptRemixSchemas as Record<string, PromptRemixSchema>;

const createPromptRemixSchema = (
  promptId: string,
  variables: PromptRemixVariable[],
  keepTerms: string[]
): PromptRemixSchema => ({
  promptId,
  variables,
  keepTerms,
});

const withoutDefaultValue = (defaultValue: string, suggestions: string[]) =>
  suggestions.filter((suggestion) => suggestion !== defaultValue);

const naiveAvatarIdentitySuggestions = [
  'close car-selfie face shape, eyewear or eye direction, soft dark hair silhouette, playful mouth direction, and in-car head posture',
  'urban transit face shape, direct gaze, dark hair outline, relaxed mouth expression, and upright commute posture',
  'plant-shop lifestyle face shape, gentle eye direction, dark hair contour, soft mouth expression, and relaxed indoor posture',
  'everyday laundromat face shape, direct gaze, short dark hair outline, compact mouth expression, and casual shoulder posture',
];

const naiveAvatarExpressionSuggestions = [
  'playful close-camera mouth direction and casual selfie attitude',
  'calm direct eye contact with a compact neutral mouth',
  'gentle social-media expression with relaxed eye contact',
  'direct everyday gaze with a tiny confident mouth signal',
];

const naiveAvatarHairSuggestions = [
  'loose dark hair block with a few simple edge strands',
  'simplified dark rounded hair mass with minimal loose strands',
  'clean dark hair silhouette with a few loose minimal strands',
  'short dark hair block with simple curved edges',
];

const naiveAvatarBackgroundSuggestions = [
  'cream blue solid background',
  'soft sky blue solid background',
  'pastel blue solid background',
  'warm cream solid background',
];

const createNaiveAvatarRemixSchema = ({
  backgroundColor,
  expressionAnchor,
  hairShape,
  keyFeatures,
  promptId,
}: {
  backgroundColor: string;
  expressionAnchor: string;
  hairShape: string;
  keyFeatures: string;
  promptId: string;
}) =>
  createPromptRemixSchema(
    promptId,
    [
      {
        key: 'keyFeatures',
        label: 'Identity features',
        defaultValue: keyFeatures,
        suggestions: withoutDefaultValue(
          keyFeatures,
          naiveAvatarIdentitySuggestions
        ),
      },
      {
        key: 'expressionAnchor',
        label: 'Expression',
        defaultValue: expressionAnchor,
        suggestions: withoutDefaultValue(
          expressionAnchor,
          naiveAvatarExpressionSuggestions
        ),
      },
      {
        key: 'hairShape',
        label: 'Hair shape',
        defaultValue: hairShape,
        suggestions: withoutDefaultValue(hairShape, naiveAvatarHairSuggestions),
      },
      {
        key: 'backgroundColor',
        label: 'Background',
        defaultValue: backgroundColor,
        suggestions: withoutDefaultValue(
          backgroundColor,
          naiveAvatarBackgroundSuggestions
        ),
      },
    ],
    [
      'naive digital portrait avatar',
      'childlike editorial avatar',
      'simple flat color blocks',
      '1:1 square head-and-shoulders avatar',
    ]
  );

const vogueAi20260608NaiveAvatarRemixSchemas = Object.fromEntries(
  [
    createNaiveAvatarRemixSchema({
      promptId:
        'vogueai-20260608-naive-digital-portrait-avatar-from-selfie-source-02',
      keyFeatures:
        'close car-selfie face shape, eyewear or eye direction, soft dark hair silhouette, playful mouth direction, and in-car head posture',
      expressionAnchor:
        'playful close-camera mouth direction and casual selfie attitude',
      hairShape: 'loose dark hair block with a few simple edge strands',
      backgroundColor: 'cream blue solid background',
    }),
    createNaiveAvatarRemixSchema({
      promptId:
        'vogueai-20260608-naive-digital-portrait-avatar-from-selfie-source-03',
      keyFeatures:
        'urban transit face shape, direct gaze, dark hair outline, relaxed mouth expression, and upright commute posture',
      expressionAnchor: 'calm direct eye contact with a compact neutral mouth',
      hairShape: 'simplified dark rounded hair mass with minimal loose strands',
      backgroundColor: 'soft sky blue solid background',
    }),
    createNaiveAvatarRemixSchema({
      promptId:
        'vogueai-20260608-naive-digital-portrait-avatar-from-selfie-source-06',
      keyFeatures:
        'plant-shop lifestyle face shape, gentle eye direction, dark hair contour, soft mouth expression, and relaxed indoor posture',
      expressionAnchor:
        'gentle social-media expression with relaxed eye contact',
      hairShape: 'clean dark hair silhouette with a few loose minimal strands',
      backgroundColor: 'pastel blue solid background',
    }),
    createNaiveAvatarRemixSchema({
      promptId:
        'vogueai-20260608-naive-digital-portrait-avatar-from-selfie-source-08',
      keyFeatures:
        'everyday laundromat face shape, direct gaze, short dark hair outline, compact mouth expression, and casual shoulder posture',
      expressionAnchor: 'direct everyday gaze with a tiny confident mouth signal',
      hairShape: 'short dark hair block with simple curved edges',
      backgroundColor: 'cream blue solid background',
    }),
  ].map((schema) => [schema.promptId, schema])
) as Record<string, PromptRemixSchema>;

const retroPosterPoseSuggestions = [
  'close selfie head angle, eyewear or eye direction, hair outline, mouth expression, and compact in-car composition skeleton',
  'urban transit gaze, mouth expression, hair contour, upright head angle, shoulder posture, and commute-scene framing',
  'gaze direction, mouth expression, hair contour, hand or prop posture, and relaxed plant-shop lifestyle framing',
  'head angle, hair outline, direct expression, shoulder posture, and laundromat-location composition skeleton',
];

const retroPosterBackgroundSuggestions = [
  'soft pink and cream split field with one cobalt blue block',
  'deep cobalt blue field with cream negative space and a small red accent block',
  'vivid green and cream split color field',
  'soft pink and cream background with one cobalt graphic block',
];

const retroPosterPaletteSuggestions = [
  'soft pink, cream white, deep cobalt blue, bright red, and warm yellow accents',
  'deep cobalt blue, bright red, warm yellow, cream white, and soft pink skin tones',
  'vivid green, warm yellow, deep cobalt blue, bright red, and cream white',
  'soft pink, cream white, deep cobalt blue, bright red, and warm yellow',
];

const retroPosterTextureSuggestions = [
  'medium screen-print grain with subtle color misregistration',
  'medium risograph grain with visible halftone dots',
  'strong paper grain with slight ink bleeding',
  'coarse paper grain and local halftone dots',
];

const retroPosterMoodSuggestions = [
  'independent street-style portrait poster',
  'vintage city photography exhibition poster',
  'vintage art magazine portrait cover without text',
  'retro independent everyday-location portrait poster',
];

const createRetroPosterRemixSchema = ({
  backgroundTreatment,
  identityAndPose,
  posterMood,
  printPalette,
  promptId,
  textureStrength,
}: {
  backgroundTreatment: string;
  identityAndPose: string;
  posterMood: string;
  printPalette: string;
  promptId: string;
  textureStrength: string;
}) =>
  createPromptRemixSchema(
    promptId,
    [
      {
        key: 'identityAndPose',
        label: 'Pose anchor',
        defaultValue: identityAndPose,
        suggestions: withoutDefaultValue(
          identityAndPose,
          retroPosterPoseSuggestions
        ),
      },
      {
        key: 'backgroundTreatment',
        label: 'Background',
        defaultValue: backgroundTreatment,
        suggestions: withoutDefaultValue(
          backgroundTreatment,
          retroPosterBackgroundSuggestions
        ),
      },
      {
        key: 'printPalette',
        label: 'Palette',
        defaultValue: printPalette,
        suggestions: withoutDefaultValue(
          printPalette,
          retroPosterPaletteSuggestions
        ),
      },
      {
        key: 'textureStrength',
        label: 'Texture',
        defaultValue: textureStrength,
        suggestions: withoutDefaultValue(
          textureStrength,
          retroPosterTextureSuggestions
        ),
      },
      {
        key: 'posterMood',
        label: 'Poster mood',
        defaultValue: posterMood,
        suggestions: withoutDefaultValue(
          posterMood,
          retroPosterMoodSuggestions
        ),
      },
    ],
    [
      'retro art print portrait poster',
      'risograph-inspired photo treatment',
      'screen-print grain',
      'scanned magazine texture',
    ]
  );

const vogueAi20260608RetroPosterRemixSchemas = Object.fromEntries(
  [
    createRetroPosterRemixSchema({
      promptId:
        'vogueai-20260608-retro-art-print-portrait-poster-from-photo-source-02',
      identityAndPose:
        'close selfie head angle, eyewear or eye direction, hair outline, mouth expression, and compact in-car composition skeleton',
      backgroundTreatment:
        'soft pink and cream split field with one cobalt blue block',
      printPalette:
        'soft pink, cream white, deep cobalt blue, bright red, and warm yellow accents',
      textureStrength: 'medium screen-print grain with subtle color misregistration',
      posterMood: 'independent street-style portrait poster',
    }),
    createRetroPosterRemixSchema({
      promptId:
        'vogueai-20260608-retro-art-print-portrait-poster-from-photo-source-03',
      identityAndPose:
        'urban transit gaze, mouth expression, hair contour, upright head angle, shoulder posture, and commute-scene framing',
      backgroundTreatment:
        'deep cobalt blue field with cream negative space and a small red accent block',
      printPalette:
        'deep cobalt blue, bright red, warm yellow, cream white, and soft pink skin tones',
      textureStrength: 'medium risograph grain with visible halftone dots',
      posterMood: 'vintage city photography exhibition poster',
    }),
    createRetroPosterRemixSchema({
      promptId:
        'vogueai-20260608-retro-art-print-portrait-poster-from-photo-source-06',
      identityAndPose:
        'gaze direction, mouth expression, hair contour, hand or prop posture, and relaxed plant-shop lifestyle framing',
      backgroundTreatment: 'vivid green and cream split color field',
      printPalette:
        'vivid green, warm yellow, deep cobalt blue, bright red, and cream white',
      textureStrength: 'strong paper grain with slight ink bleeding',
      posterMood: 'vintage art magazine portrait cover without text',
    }),
    createRetroPosterRemixSchema({
      promptId:
        'vogueai-20260608-retro-art-print-portrait-poster-from-photo-source-08',
      identityAndPose:
        'head angle, hair outline, direct expression, shoulder posture, and laundromat-location composition skeleton',
      backgroundTreatment:
        'soft pink and cream background with one cobalt graphic block',
      printPalette:
        'soft pink, cream white, deep cobalt blue, bright red, and warm yellow',
      textureStrength: 'coarse paper grain and local halftone dots',
      posterMood: 'retro independent everyday-location portrait poster',
    }),
  ].map((schema) => [schema.promptId, schema])
) as Record<string, PromptRemixSchema>;

const hollywoodStarletArchetypeSuggestions = [
  'a fictional noir Hollywood starlet with elegant lethal glamour',
  'a fictional sunlit Hollywood muse with cool magazine attitude',
  'a fictional silver-screen spy actress with razor-clean elegance',
  'a fictional old-Hollywood comeback queen with dangerous charm',
];

const hollywoodMascotSuggestions = [
  'a tiny rounded black-cat film-camera icon perched on the hair contour',
  'a small rounded sunburst character touching the sunglasses frame',
  'a tiny chrome moon icon clipped to the glove edge',
  'a small pearl microphone mascot tucked beside the title',
];

const hollywoodPaletteSuggestions = [
  'clear blush pink, pale lemon, ink black, warm white, and a tiny scarlet accent',
  'soft sky blue, cream white, bright yellow, coral red, and clean black linework',
  'ivory white, lacquer black, champagne gold, and one sharp crimson accent',
  'mint green, warm cream, clean black, and a small hot-pink accent',
];

const createHollywoodPosterRemixSchema = ({
  centralTitle,
  mascotSymbol,
  palette,
  promptId,
  starletArchetype,
  topHandwrittenTitle,
}: {
  centralTitle: string;
  mascotSymbol: string;
  palette: string;
  promptId: string;
  starletArchetype: string;
  topHandwrittenTitle: string;
}) =>
  createPromptRemixSchema(
    promptId,
    [
      {
        key: 'starletArchetype',
        label: 'Starlet',
        defaultValue: starletArchetype,
        suggestions: withoutDefaultValue(
          starletArchetype,
          hollywoodStarletArchetypeSuggestions
        ),
      },
      {
        key: 'mascotSymbol',
        label: 'Mascot',
        defaultValue: mascotSymbol,
        suggestions: withoutDefaultValue(
          mascotSymbol,
          hollywoodMascotSuggestions
        ),
      },
      {
        key: 'topHandwrittenTitle',
        label: 'Top title',
        defaultValue: topHandwrittenTitle,
        suggestions: withoutDefaultValue(topHandwrittenTitle, [
          'Night Darling',
          'Hello, Stardust',
          'Silver Trouble',
          'Dear Midnight',
        ]),
      },
      {
        key: 'centralTitle',
        label: 'Central title',
        defaultValue: centralTitle,
        suggestions: withoutDefaultValue(centralTitle, [
          'STARLET',
          'MUSE',
          'ICON',
          'NOIR',
        ]),
      },
      {
        key: 'palette',
        label: 'Palette',
        defaultValue: palette,
        suggestions: withoutDefaultValue(palette, hollywoodPaletteSuggestions),
      },
    ],
    [
      'bright clean graphic publicity poster',
      'high-key flat color field',
      'sparse readable typography',
    ]
  );

const vogueAi20260608HollywoodPosterRemixSchemas = Object.fromEntries(
  [
    createHollywoodPosterRemixSchema({
      promptId:
        'vogueai-20260608-fictional-hollywood-starlet-publicity-poster-source-01',
      starletArchetype:
        'a fictional noir Hollywood starlet with elegant lethal glamour',
      mascotSymbol:
        'a tiny rounded black-cat film-camera icon perched on the hair contour',
      topHandwrittenTitle: 'Night Darling',
      centralTitle: 'STARLET',
      palette:
        'clear blush pink, pale lemon, ink black, warm white, and a tiny scarlet accent',
    }),
    createHollywoodPosterRemixSchema({
      promptId:
        'vogueai-20260608-fictional-hollywood-starlet-publicity-poster-source-02',
      starletArchetype:
        'a fictional sunlit Hollywood muse with cool magazine attitude',
      mascotSymbol:
        'a small rounded sunburst character touching the sunglasses frame',
      topHandwrittenTitle: 'Hello, Stardust',
      centralTitle: 'MUSE',
      palette:
        'soft sky blue, cream white, bright yellow, coral red, and clean black linework',
    }),
  ].map((schema) => [schema.promptId, schema])
) as Record<string, PromptRemixSchema>;

const luxuryCampaignConceptSuggestions = [
  'rainforest jewel alchemy with the ring emerging from a wet sculptural leaf',
  'a moonlit silk tide luxury campaign with the necklace floating over folds of cream silk',
  'a velvet eclipse campaign with the product floating above black lacquer',
  'a champagne gallery campaign with the product resting inside soft glass reflections',
];

const luxurySupportingElementSuggestions = [
  'glossy leaves, dew, dark stone, and soft water reflections',
  'silk folds, shell fragments, pale sand texture, and glass reflections',
  'black velvet, mirrored glass, gold dust, and soft architectural shadows',
  'translucent resin, champagne bubbles, polished marble, and warm highlights',
];

const luxuryEnvironmentSuggestions = [
  'wet black stone with organic leaf forms and subtle atmospheric glow',
  'cream silk and sculptural shell forms with shallow depth of field',
  'deep black lacquer with floating glass reflections and controlled negative space',
  'warm marble plinth with champagne-toned refractions and soft studio haze',
];

const luxuryPaletteSuggestions = [
  'emerald green against deep burgundy-black and warm gold highlights',
  'cream pearl whites against deep cobalt shadows and champagne highlights',
  'onyx black against antique gold and a small ruby reflection',
  'warm ivory against champagne gold and soft smoky blue shadows',
];

const luxuryLightingSuggestions = [
  'soft directional light with controlled gold highlights, gentle rim light, and shallow depth of field',
  'cinematic moon-soft light, controlled highlights, subtle rim glow, and elegant shadows',
  'pinpoint jewelry sparkle with a narrow rim light and deep velvet shadows',
  'diffused gallery light with glossy specular accents and soft falling shadows',
];

const createLuxuryProductRemixSchema = ({
  campaignConcept,
  contrastPalette,
  lighting,
  promptId,
  supportingElements,
  surfaceOrEnvironment,
}: {
  campaignConcept: string;
  contrastPalette: string;
  lighting: string;
  promptId: string;
  supportingElements: string;
  surfaceOrEnvironment: string;
}) =>
  createPromptRemixSchema(
    promptId,
    [
      {
        key: 'campaignConcept',
        label: 'Concept',
        defaultValue: campaignConcept,
        suggestions: withoutDefaultValue(
          campaignConcept,
          luxuryCampaignConceptSuggestions
        ),
      },
      {
        key: 'supportingElements',
        label: 'Elements',
        defaultValue: supportingElements,
        suggestions: withoutDefaultValue(
          supportingElements,
          luxurySupportingElementSuggestions
        ),
      },
      {
        key: 'surfaceOrEnvironment',
        label: 'Surface',
        defaultValue: surfaceOrEnvironment,
        suggestions: withoutDefaultValue(
          surfaceOrEnvironment,
          luxuryEnvironmentSuggestions
        ),
      },
      {
        key: 'contrastPalette',
        label: 'Palette',
        defaultValue: contrastPalette,
        suggestions: withoutDefaultValue(
          contrastPalette,
          luxuryPaletteSuggestions
        ),
      },
      {
        key: 'lighting',
        label: 'Lighting',
        defaultValue: lighting,
        suggestions: withoutDefaultValue(lighting, luxuryLightingSuggestions),
      },
    ],
    [
      'cinematic high-end luxury campaign image',
      'macro product hero',
      'elegant negative space',
      'shallow depth of field',
    ]
  );

const vogueAi20260608LuxuryProductRemixSchemas = Object.fromEntries(
  [
    createLuxuryProductRemixSchema({
      promptId: 'vogueai-20260608-luxury-product-alchemy-source-01',
      campaignConcept:
        'rainforest jewel alchemy with the ring emerging from a wet sculptural leaf',
      supportingElements:
        'glossy leaves, dew, dark stone, and soft water reflections',
      surfaceOrEnvironment:
        'wet black stone with organic leaf forms and subtle atmospheric glow',
      contrastPalette:
        'emerald green against deep burgundy-black and warm gold highlights',
      lighting:
        'soft directional light with controlled gold highlights, gentle rim light, and shallow depth of field',
    }),
    createLuxuryProductRemixSchema({
      promptId: 'vogueai-20260608-luxury-product-alchemy-source-02',
      campaignConcept:
        'a moonlit silk tide luxury campaign with the necklace floating over folds of cream silk',
      supportingElements:
        'silk folds, shell fragments, pale sand texture, and glass reflections',
      surfaceOrEnvironment:
        'cream silk and sculptural shell forms with shallow depth of field',
      contrastPalette:
        'cream pearl whites against deep cobalt shadows and champagne highlights',
      lighting:
        'cinematic moon-soft light, controlled highlights, subtle rim glow, and elegant shadows',
    }),
  ].map((schema) => [schema.promptId, schema])
) as Record<string, PromptRemixSchema>;

const curatedPromptRemixSchemas: Record<string, PromptRemixSchema> = {
  ...vogueAi20260608NaiveAvatarRemixSchemas,
  ...vogueAi20260608RetroPosterRemixSchemas,
  ...vogueAi20260608HollywoodPosterRemixSchemas,
  ...vogueAi20260608LuxuryProductRemixSchemas,
  'vogueai-20260603-watercolor-travel-poster-ai-prompt': {
    promptId: 'vogueai-20260603-watercolor-travel-poster-ai-prompt',
    variables: [
      {
        key: 'landmark',
        label: 'Landmark',
        defaultValue: 'Sanssouci Palace',
        suggestions: [
          'Eiffel Tower',
          'Tower Bridge',
          'Kiyomizu-dera',
          'Brooklyn Bridge',
        ],
      },
      {
        key: 'city',
        label: 'City',
        defaultValue: 'Potsdam',
        suggestions: ['Paris', 'London', 'Kyoto', 'New York'],
      },
      {
        key: 'country',
        label: 'Country',
        defaultValue: 'Germany',
        suggestions: ['France', 'United Kingdom', 'Japan', 'United States'],
      },
      {
        key: 'viewpoint',
        label: 'Viewpoint',
        defaultValue: 'a graceful pedestrian path',
        suggestions: [
          'a quiet riverside street corner',
          'a temple approach lined with maple trees',
          'a garden path after light rain',
          'a narrow old-town alley',
        ],
      },
      {
        key: 'time',
        label: 'Light',
        defaultValue: 'warm late-afternoon light',
        suggestions: [
          'soft spring morning light',
          'pale morning light after rain',
          'misty golden hour',
          'quiet blue-hour glow',
        ],
      },
      {
        key: 'title',
        label: 'Title',
        defaultValue: 'Sanssouci',
        suggestions: ['Paris', 'London', 'Kyoto', 'Brooklyn'],
      },
      {
        key: 'subtitle',
        label: 'Subtitle',
        defaultValue: 'Potsdam, Germany',
        suggestions: [
          'La Seine, France',
          'Tower Bridge, London',
          'Higashiyama, Kyoto',
          'Brooklyn, New York',
        ],
      },
    ],
    keepTerms: [
      'watercolor and fine ink urban sketch',
      'visible cotton paper texture',
      'refined travel journal aesthetic',
      'large clean whitespace',
      'soft sepia ink',
    ],
  },
  'vogueai-20260603-double-exposure-city-poster-ai-prompt': {
    promptId: 'vogueai-20260603-double-exposure-city-poster-ai-prompt',
    variables: [
      {
        key: 'cityA',
        label: 'City A',
        defaultValue: 'San Antonio',
        suggestions: ['Los Angeles', 'Chicago', 'Miami', 'Tokyo'],
      },
      {
        key: 'cityB',
        label: 'City B',
        defaultValue: 'New York',
        suggestions: ['Boston', 'Seattle', 'Paris', 'Seoul'],
      },
      {
        key: 'subjectA',
        label: 'Subject A',
        defaultValue: 'Victor Wembanyama',
        suggestions: [
          'a fictional home-team guard',
          'a rising basketball star',
          'a streetball captain',
          'a masked tournament MVP',
        ],
      },
      {
        key: 'subjectB',
        label: 'Subject B',
        defaultValue: 'Jalen Brunson',
        suggestions: [
          'a fictional away-team scorer',
          'a veteran playmaker',
          'a downtown shooting guard',
          'a calm playoff closer',
        ],
      },
      {
        key: 'moodA',
        label: 'Color A',
        defaultValue: 'silver, black, and white light',
        suggestions: [
          'crimson and gold arena light',
          'deep purple and sunset orange light',
          'teal and white neon light',
          'forest green and cream light',
        ],
      },
      {
        key: 'moodB',
        label: 'Color B',
        defaultValue: 'deep royal blue and orange light',
        suggestions: [
          'midnight navy and copper light',
          'electric blue and white light',
          'black and red tunnel light',
          'violet and silver light',
        ],
      },
      {
        key: 'headline',
        label: 'Headline',
        defaultValue: 'GAME NIGHT',
        suggestions: ['CITY SHOWDOWN', 'RIVALRY NIGHT', 'FINAL RUN', 'THE REMATCH'],
      },
      {
        key: 'subtitle',
        label: 'Subtitle',
        defaultValue: 'SAN ANTONIO vs NEW YORK',
        suggestions: [
          'LOS ANGELES vs BOSTON',
          'CHICAGO vs MIAMI',
          'TOKYO vs SEOUL',
          'HOME CITY vs AWAY CITY',
        ],
      },
    ],
    keepTerms: [
      'cinematic double exposure',
      'high-end sports magazine cover look',
      'bright rim-light collision line',
      'clean lower area reserved for typography',
      'realistic editorial portrait lighting',
    ],
  },
  'vogueai-20260603-codex-macos-permission-dialog-ai-prompt': {
    promptId: 'vogueai-20260603-codex-macos-permission-dialog-ai-prompt',
    variables: [
      {
        key: 'agent',
        label: 'Agent',
        defaultValue: 'Codex',
        suggestions: ['VogueAI', 'Design Bot', 'Build Agent', 'Research Copilot'],
      },
      {
        key: 'app',
        label: 'Target app',
        defaultValue: 'OnlyFans',
        suggestions: ['Figma', 'Steam', 'Xcode', 'Photoshop'],
      },
      {
        key: 'action',
        label: 'Funny action',
        defaultValue: 'pretend it is researching creator subscription business models',
        suggestions: [
          'rename every layer before the designer notices',
          'verify whether the bug also happens at 144 FPS',
          'open one more tab for serious product research',
          'turn the meeting notes into a suspiciously polished deck',
        ],
      },
      {
        key: 'tone',
        label: 'Tone',
        defaultValue: 'deadpan tech humor',
        suggestions: [
          'dry startup humor',
          'quiet product-team sarcasm',
          'deadpan developer humor',
          'polite system warning humor',
        ],
      },
      {
        key: 'button',
        label: 'Button',
        defaultValue: 'Allow',
        suggestions: ['Allow', 'Open App', 'Continue', 'Not Now'],
      },
    ],
    keepTerms: [
      'realistic macOS screenshot',
      'dark cinematic UI',
      'clean typography',
      'centered macOS permission dialog',
      'English only',
    ],
  },
};

const promptRemixSchemas: Record<string, PromptRemixSchema> = {
  ...curatedPromptRemixSchemas,
  ...generatedPromptRemixSchemaMap,
};

const escapeRegExp = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const replaceAllLiteral = (source: string, target: string, replacement: string) => {
  if (!target || target === replacement) return source;
  return source.replace(new RegExp(escapeRegExp(target), 'g'), replacement);
};

const getResolvedVariableValue = (
  variable: PromptRemixVariable,
  values: PromptRemixValues
) => values[variable.key]?.trim() || variable.defaultValue;

export const getPromptRemixSchema = (
  promptId: string,
  fallbackPromptId?: string | null
) =>
  promptRemixSchemas[promptId] ??
  (fallbackPromptId ? promptRemixSchemas[fallbackPromptId] : null) ??
  null;

export const getInitialPromptRemixValues = (
  schema: PromptRemixSchema | null
): PromptRemixValues =>
  Object.fromEntries(
    (schema?.variables ?? []).map((variable) => [
      variable.key,
      variable.defaultValue,
    ])
  );

export const applyPromptRemixValues = (
  prompt: string,
  schema: PromptRemixSchema | null,
  values: PromptRemixValues
) => {
  if (!schema) return prompt;

  return schema.variables.reduce((nextPrompt, variable) => {
    const nextValue = getResolvedVariableValue(variable, values);
    return replaceAllLiteral(nextPrompt, variable.defaultValue, nextValue);
  }, prompt);
};

export const formatPromptForRemixDisplay = (prompt: string) =>
  prompt.replace(/\s+/g, ' ').trim();

export const buildPromptRemixSegments = (
  prompt: string,
  schema: PromptRemixSchema | null,
  values: PromptRemixValues
): PromptRemixSegment[] => {
  if (!schema) return [{ type: 'text', text: prompt }];

  const candidates = [
    ...schema.variables.flatMap((variable) => {
      const value = getResolvedVariableValue(variable, values);
      if (!value) return [];

      return findLiteralMatches(prompt, value).map((match) => ({
        ...match,
        type: 'variable' as const,
        key: variable.key,
        label: variable.label,
        priority: 2,
      }));
    }),
    ...schema.keepTerms.flatMap((term) =>
      findLiteralMatches(prompt, term).map((match) => ({
        ...match,
        type: 'keep' as const,
        priority: 1,
      }))
    ),
  ].toSorted(
    (left, right) =>
      left.start - right.start ||
      right.priority - left.priority ||
      right.text.length - left.text.length
  );

  const segments: PromptRemixSegment[] = [];
  let cursor = 0;

  for (const candidate of candidates) {
    if (candidate.start < cursor) continue;

    if (candidate.start > cursor) {
      segments.push({
        type: 'text',
        text: prompt.slice(cursor, candidate.start),
      });
    }

    if (candidate.type === 'variable') {
      segments.push({
        type: 'variable',
        text: candidate.text,
        key: candidate.key,
        label: candidate.label,
      });
    } else {
      segments.push({
        type: 'keep',
        text: candidate.text,
      });
    }

    cursor = candidate.end;
  }

  if (cursor < prompt.length) {
    segments.push({
      type: 'text',
      text: prompt.slice(cursor),
    });
  }

  return segments;
};

const findLiteralMatches = (source: string, value: string) => {
  const matches: Array<{ start: number; end: number; text: string }> = [];
  let searchFrom = 0;

  while (searchFrom < source.length) {
    const start = source.indexOf(value, searchFrom);
    if (start === -1) break;

    matches.push({
      start,
      end: start + value.length,
      text: value,
    });
    searchFrom = start + value.length;
  }

  return matches;
};

export const getPromptRemixVariableRanges = (
  prompt: string,
  schema: PromptRemixSchema | null,
  values: PromptRemixValues
): PromptRemixVariableRange[] => {
  if (!schema) return [];

  const candidates = schema.variables
    .flatMap((variable) => {
      const value = getResolvedVariableValue(variable, values);
      if (!value) return [];

      return findLiteralMatches(prompt, value).map((match) => ({
        key: variable.key,
        label: variable.label,
        defaultValue: variable.defaultValue,
        suggestions: variable.suggestions,
        start: match.start,
        end: match.end,
        text: match.text,
      }));
    })
    .toSorted(
      (left, right) =>
        left.start - right.start || right.text.length - left.text.length
    );

  const ranges: PromptRemixVariableRange[] = [];
  let cursor = 0;

  for (const candidate of candidates) {
    if (candidate.start < cursor) continue;
    ranges.push(candidate);
    cursor = candidate.end;
  }

  return ranges;
};

export const findPromptRemixVariableAtOffset = (
  prompt: string,
  schema: PromptRemixSchema | null,
  values: PromptRemixValues,
  offset: number
) =>
  getPromptRemixVariableRanges(prompt, schema, values).find(
    (range) => offset >= range.start && offset <= range.end
  ) ?? null;

export const replacePromptRemixVariableValue = (
  prompt: string,
  schema: PromptRemixSchema | null,
  values: PromptRemixValues,
  key: string,
  nextValue: string
) => {
  if (!schema) return { prompt, values };

  const variable = schema.variables.find((candidate) => candidate.key === key);
  if (!variable) return { prompt, values };

  const currentValue = getResolvedVariableValue(variable, values);
  const resolvedNextValue = nextValue.trim() || variable.defaultValue;
  let nextPrompt = replaceAllLiteral(prompt, currentValue, resolvedNextValue);

  if (nextPrompt === prompt && currentValue !== variable.defaultValue) {
    nextPrompt = replaceAllLiteral(
      prompt,
      variable.defaultValue,
      resolvedNextValue
    );
  }

  return {
    prompt: nextPrompt,
    values: {
      ...values,
      [key]: resolvedNextValue,
    },
  };
};
