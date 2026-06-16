export type ExternalPromptRemixVariable = {
  key: string;
  label: string;
  defaultValue: string;
  suggestions: string[];
};

export type ExternalPromptRemixSchema = {
  promptId: string;
  variables: ExternalPromptRemixVariable[];
  keepTerms: string[];
};

export type ExternalPromptBracketNormalization = {
  prompt: string;
  schema: ExternalPromptRemixSchema | null;
  replacements: Record<string, string>;
};

const bracketTokenPattern = /\[([^\]\n]{1,120})\]/g;

const structuralBracketLabels = new Set(['inputs', 'input', 'outputs', 'output']);

const placeholderKeywords = [
  'accent',
  'aesthetic',
  'background',
  'brand',
  'campaign',
  'city',
  'closing',
  'collection',
  'color',
  'country',
  'dessert',
  'destination',
  'direction',
  'doodle',
  'dynasty',
  'environment',
  'everyday_object',
  'fabric',
  'feature',
  'finish',
  'flower',
  'food',
  'garment',
  'headline',
  'industry',
  'insert',
  'keyword',
  'kids',
  'landmark',
  'letter',
  'lighting',
  'main word',
  'material',
  'message',
  'mood',
  'name',
  'number',
  'object',
  'outfit',
  'person',
  'place',
  'player',
  'pokemon',
  'poster no',
  'product',
  'prop',
  'random',
  'region',
  'role',
  'short tagline',
  'state',
  'strap',
  'style',
  'subject',
  'subtitle',
  'surface',
  'tagline',
  'text',
  'texture',
  'theme',
  'title',
  'topic',
  'upload',
  'vegetable',
  'watch',
];

const defaultSuggestions = (defaultValue: string, suggestions: string[]) =>
  suggestions
    .map((suggestion) => suggestion.trim())
    .filter((suggestion) => suggestion && suggestion !== defaultValue)
    .slice(0, 4);

const titleCase = (value: string) =>
  value
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()
    .replace(/\b[a-z]/g, (match) => match.toUpperCase());

const toVariableKey = (descriptor: string) => {
  const key = descriptor
    .replace(/\$+/g, '')
    .replace(/['"`]/g, '')
    .replace(/\be\.g\..*$/i, '')
    .replace(/[^A-Za-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .trim()
    .toLowerCase();

  if (!key) return 'custom_value';
  return /^\d/.test(key) ? `value_${key}` : key;
};

const cleanDescriptorForLabel = (descriptor: string) =>
  descriptor
    .replace(/\$+/g, '')
    .replace(/\be\.g\..*$/i, '')
    .replace(/\s*[-—:]\s*$/g, '')
    .replace(/\s+/g, ' ')
    .trim();

const hasMostlyUppercaseLetters = (value: string) => {
  const letters = value.match(/[A-Za-z]/g) ?? [];
  if (letters.length < 3) return false;

  const uppercaseLetters = letters.filter(
    (letter) => letter === letter.toUpperCase()
  ).length;
  return uppercaseLetters / letters.length >= 0.72;
};

const hasSimplePlaceholderShape = (value: string) => {
  const cleaned = value.trim();
  if (!cleaned || cleaned.length > 120) return false;
  if (/^[{"'`]/.test(cleaned)) return false;
  if (cleaned.includes('","') || cleaned.includes('", "')) return false;
  if (/[{}[\]]/.test(cleaned)) return false;
  if (/[\u3040-\u30ff\u4e00-\u9fff\uac00-\ud7af]/.test(cleaned)) {
    return false;
  }
  return true;
};

export const isExternalPromptBracketPlaceholder = (descriptor: string) => {
  const cleaned = descriptor.trim();
  const lower = cleaned.toLowerCase();
  if (!hasSimplePlaceholderShape(cleaned)) return false;
  if (structuralBracketLabels.has(lower)) return false;
  if (splitOptionDefaults(cleaned).length >= 2) return true;
  if (hasMostlyUppercaseLetters(cleaned)) return true;
  if (placeholderKeywords.some((keyword) => lower.includes(keyword))) return true;
  if (/^[a-z]+(?:_[a-z]+)+$/.test(cleaned)) return true;
  if (/^[\p{L}]+(?:\s+[\p{L}]+){0,6}$/u.test(cleaned)) return true;
  if (/[—:]/.test(cleaned)) return true;
  if (/^\(.+\)$/.test(cleaned)) return true;
  return false;
};

const splitOptionDefaults = (descriptor: string) =>
  descriptor
    .split('/')
    .map((part) => part.replace(/\be\.g\..*$/i, '').trim())
    .filter(Boolean);

const defaultFromOptions = (descriptor: string) => {
  const options = splitOptionDefaults(descriptor);
  if (options.length < 2 || options.length > 8) return null;

  const defaultValue = options[0]
    .replace(/^(insert|enter|replace)\s+/i, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
  if (!defaultValue || defaultValue.length > 60) return null;

  return {
    defaultValue,
    suggestions: defaultSuggestions(
      defaultValue,
      options.slice(1).map((option) => option.toLowerCase())
    ),
  };
};

const getDefaultForDescriptor = (descriptor: string) => {
  const cleaned = cleanDescriptorForLabel(descriptor);
  const lower = cleaned.toLowerCase();

  if (/keyword\s*1\b/.test(lower)) {
    return {
      defaultValue: 'speed',
      suggestions: defaultSuggestions('speed', [
        'precision',
        'legacy',
        'glory',
        'victory',
      ]),
    };
  }
  if (/keyword\s*2\b/.test(lower)) {
    return {
      defaultValue: 'precision',
      suggestions: defaultSuggestions('precision', [
        'speed',
        'legacy',
        'glory',
        'victory',
      ]),
    };
  }
  if (/keyword\s*3\b/.test(lower)) {
    return {
      defaultValue: 'legacy',
      suggestions: defaultSuggestions('legacy', [
        'speed',
        'precision',
        'glory',
        'victory',
      ]),
    };
  }
  if (/keyword\s*4\b/.test(lower)) {
    return {
      defaultValue: 'victory',
      suggestions: defaultSuggestions('victory', [
        'speed',
        'precision',
        'legacy',
        'glory',
      ]),
    };
  }

  const mapped = [
    {
      match: /sub-?tagline|tagline|subtitle|message|benefit|closing|statement|subline/,
      defaultValue: 'Made for brighter days',
      suggestions: [
        'Every journey starts here',
        'Built for what comes next',
        'Fresh energy, clean mornings',
        'Designed to move beautifully',
      ],
    },
    {
      match: /country.*national|national.*color/,
      defaultValue: 'Japan blue and white',
      suggestions: [
        'Morocco red and green',
        'Brazil yellow and green',
        'Italy green, white, and red',
        'South Korea red, blue, and white',
      ],
    },
    {
      match: /brand.*(color|colour)|primary.*color|accent.*color/,
      defaultValue: 'deep teal',
      suggestions: ['tomato red', 'warm gold', 'cobalt blue', 'soft cream'],
    },
    {
      match: /monochromatic color/,
      defaultValue: 'deep emerald',
      suggestions: ['ink black', 'warm ivory', 'cobalt blue', 'oxblood red'],
    },
    {
      match: /color|colour|palette/,
      defaultValue: 'deep teal',
      suggestions: ['tomato red', 'warm sand', 'cobalt blue', 'cream white'],
    },
    {
      match: /brand.*(type|industry)|industry/,
      defaultValue: 'premium skincare brand',
      suggestions: [
        'luxury travel brand',
        'modern coffee brand',
        'high-end tech brand',
        'boutique fashion label',
      ],
    },
    {
      match: /brand/,
      defaultValue: 'AURELIA',
      suggestions: ['NOVA ATLAS', 'VERDANT', 'LUMEN', 'SAFFRON HOUSE'],
    },
    {
      match: /country|national/,
      defaultValue: 'Japan',
      suggestions: ['Morocco', 'Brazil', 'Italy', 'South Korea'],
    },
    {
      match: /city|destination|place|region/,
      defaultValue: 'Kyoto',
      suggestions: ['Lisbon', 'Marrakech', 'Seoul', 'Mexico City'],
    },
    {
      match: /landmark/,
      defaultValue: 'Fushimi Inari Shrine',
      suggestions: [
        'Hassan II Mosque',
        'Colosseum',
        'N Seoul Tower',
        'Golden Gate Bridge',
      ],
    },
    {
      match: /product.*category/,
      defaultValue: 'premium skincare serum',
      suggestions: [
        'specialty coffee blend',
        'wireless earbuds',
        'running shoe',
        'ceramic homeware line',
      ],
    },
    {
      match: /product detail/,
      defaultValue: 'brushed titanium edges and centered logo mark',
      suggestions: [
        'hand-blown glass body and embossed label',
        'woven texture, leather pull tab, and brass zipper',
        'ceramic cap, soft-touch bottle, and clean label grid',
      ],
    },
    {
      match: /product.*name/,
      defaultValue: 'Aurelia Serum',
      suggestions: ['Nova Brew', 'Lumen Buds', 'Atlas Runner', 'Verdant Plate'],
    },
    {
      match: /\bproduct\b/,
      defaultValue: 'hydrating serum',
      suggestions: [
        'specialty coffee can',
        'wireless earbuds',
        'trail running shoe',
        'ceramic tea cup',
      ],
    },
    {
      match: /football star/,
      defaultValue: 'elite world-cup winger',
      suggestions: [
        'creative midfield playmaker',
        'clinical striker',
        'explosive forward',
        'captain-level defender',
      ],
    },
    {
      match: /player.*style/,
      defaultValue: 'fast technical winger',
      suggestions: [
        'clinical striker',
        'creative midfield playmaker',
        'explosive forward',
        'commanding captain',
      ],
    },
    {
      match: /person|player/,
      defaultValue: 'Maya Torres',
      suggestions: ['Ava Chen', 'Leo Martin', 'Noah Silva', 'Yuna Park'],
    },
    {
      match: /role|winger|striker|midfielder|forward/,
      defaultValue: 'winger',
      suggestions: ['striker', 'midfielder', 'forward', 'captain'],
    },
    {
      match: /number|poster no/,
      defaultValue: '10',
      suggestions: ['07', '11', '23', '99'],
    },
    {
      match: /main word|headline|title|text|letter/,
      defaultValue: 'AURORA',
      suggestions: ['KINETIC', 'NOVA', 'VERDANT', 'LUMEN'],
    },
    {
      match: /feature.*1/,
      defaultValue: 'fast setup',
      suggestions: ['smart automation', 'clean sharing', 'studio-quality output'],
    },
    {
      match: /feature.*2/,
      defaultValue: 'smart automation',
      suggestions: ['fast setup', 'clean sharing', 'studio-quality output'],
    },
    {
      match: /feature.*3/,
      defaultValue: 'clean sharing',
      suggestions: ['fast setup', 'smart automation', 'studio-quality output'],
    },
    {
      match: /feature.*4/,
      defaultValue: 'studio-quality output',
      suggestions: ['fast setup', 'smart automation', 'clean sharing'],
    },
    {
      match: /list of features|functions/,
      defaultValue: 'fast setup, smart automation, clean sharing',
      suggestions: [
        'bright hydration, soft texture, daily comfort',
        'real-time edits, team review, export-ready files',
        'durable fabric, flexible fit, weather protection',
      ],
    },
    {
      match: /style keyword|design trait/,
      defaultValue: 'rounded 3D minimal',
      suggestions: [
        'flat editorial geometric',
        'hand-drawn playful',
        'bold outline poster',
        'soft shadow premium',
      ],
    },
    {
      match: /style|aesthetic|mood/,
      defaultValue: 'premium editorial style',
      suggestions: [
        'cinematic documentary style',
        'playful retro poster style',
        'minimal luxury style',
        'handcrafted travel style',
      ],
    },
    {
      match: /material finish|finish/,
      defaultValue: 'satin finish',
      suggestions: ['brushed titanium', 'matte ceramic', 'gloss enamel', 'soft grain'],
    },
    {
      match: /material/,
      defaultValue: 'brushed aluminum',
      suggestions: ['matte ceramic', 'soft leather', 'woven linen', 'clear glass'],
    },
    {
      match: /fabric/,
      defaultValue: 'soft linen',
      suggestions: ['washed cotton', 'brushed wool', 'technical nylon', 'silk twill'],
    },
    {
      match: /texture/,
      defaultValue: 'fine paper grain',
      suggestions: ['soft film grain', 'brushed metal texture', 'woven fabric texture'],
    },
    {
      match: /surface/,
      defaultValue: 'matte ceramic surface',
      suggestions: ['warm wooden surface', 'brushed steel surface', 'cream paper surface'],
    },
    {
      match: /strap/,
      defaultValue: 'black alligator leather',
      suggestions: ['brushed steel bracelet', 'woven nylon strap', 'dark rubber strap'],
    },
    {
      match: /background/,
      defaultValue: 'soft cream studio backdrop',
      suggestions: [
        'sunlit city street',
        'deep blue graphic field',
        'warm paper texture',
        'minimal gallery wall',
      ],
    },
    {
      match: /environment/,
      defaultValue: 'sunlit modern studio',
      suggestions: [
        'cozy neighborhood cafe',
        'rainy city street',
        'minimal gallery interior',
        'warm market alley',
      ],
    },
    {
      match: /lighting|light/,
      defaultValue: 'soft golden side light',
      suggestions: [
        'clean studio lighting',
        'dramatic rim light',
        'overcast daylight',
        'neon night glow',
      ],
    },
    {
      match: /direction/,
      defaultValue: 'front-facing hero composition',
      suggestions: [
        'three-quarter side view',
        'top-down flat lay',
        'close macro crop',
        'wide environmental view',
      ],
    },
    {
      match: /prop|flower|ribbon|book|candle|pearl|notebook/,
      defaultValue: 'linen notebook and ceramic cup',
      suggestions: [
        'fresh flowers and ribbon',
        'travel stamps and postcards',
        'coffee cup and pastry plate',
        'minimal tools and paper swatches',
      ],
    },
    {
      match: /object|subject|upload|\$subject/,
      defaultValue: 'ceramic fox mascot',
      suggestions: [
        'stylish portrait subject',
        'wireless earbuds',
        'paper crane',
        'vintage camera',
      ],
    },
    {
      match: /everyday_object/,
      defaultValue: 'coffee mug',
      suggestions: ['canvas tote bag', 'desk lamp', 'notebook', 'ceramic bowl'],
    },
    {
      match: /vegetable/,
      defaultValue: 'tomato',
      suggestions: ['carrot', 'eggplant', 'broccoli', 'red pepper'],
    },
    {
      match: /comfort_food|dessert|food/,
      defaultValue: 'ramen bowl',
      suggestions: ['strawberry cake', 'mint tea set', 'fresh pastry', 'taco plate'],
    },
    {
      match: /pokemon/,
      defaultValue: 'Pikachu',
      suggestions: ['Eevee', 'Charizard', 'Bulbasaur', 'Squirtle'],
    },
    {
      match: /garment|fashion|outfit|streetwear|kids/,
      defaultValue: 'relaxed linen jacket',
      suggestions: [
        'oversized denim set',
        'technical rain shell',
        'soft knit cardigan',
        'tailored wool coat',
      ],
    },
    {
      match: /watch/,
      defaultValue: 'slim rose-gold dress watch',
      suggestions: [
        'brushed steel sport watch',
        'black ceramic chronograph',
        'vintage field watch',
      ],
    },
    {
      match: /topic|keyword|random|variable_state|variable_subject/,
      defaultValue: 'artisan coffee',
      suggestions: ['urban cycling', 'quiet luxury', 'summer travel', 'smart home'],
    },
  ].find(({ match }) => match.test(lower));

  if (mapped) {
    return {
      defaultValue: mapped.defaultValue,
      suggestions: defaultSuggestions(mapped.defaultValue, mapped.suggestions),
    };
  }

  const optionDefault = defaultFromOptions(cleaned);
  if (optionDefault) return optionDefault;

  const cleanedDefault = cleaned
    .replace(/^(insert|enter|replace)\s+/i, '')
    .replace(/\s+/g, ' ')
    .trim();

  const defaultValue = cleanedDefault
    ? cleanedDefault.charAt(0) === cleanedDefault.charAt(0).toUpperCase() &&
      cleanedDefault.slice(1) !== cleanedDefault.slice(1).toUpperCase()
      ? titleCase(cleanedDefault)
      : cleanedDefault.toLowerCase()
    : 'custom detail';

  return {
    defaultValue,
    suggestions: defaultSuggestions(defaultValue, [
      'premium editorial detail',
      'cinematic lifestyle detail',
      'minimal luxury detail',
      'playful cultural detail',
    ]),
  };
};

const createVariable = (
  descriptor: string,
  defaultValue: string,
  suggestions: string[]
): ExternalPromptRemixVariable => ({
  key: toVariableKey(descriptor),
  label: titleCase(cleanDescriptorForLabel(descriptor) || 'Custom detail'),
  defaultValue,
  suggestions,
});

const dedupeVariableKey = (
  variable: ExternalPromptRemixVariable,
  variablesByKey: Map<string, ExternalPromptRemixVariable>
) => {
  if (!variablesByKey.has(variable.key)) return variable;

  const existing = variablesByKey.get(variable.key);
  if (existing?.defaultValue === variable.defaultValue) return existing;

  let index = 2;
  let nextKey = `${variable.key}${index}`;
  while (variablesByKey.has(nextKey)) {
    index += 1;
    nextKey = `${variable.key}${index}`;
  }

  return {
    ...variable,
    key: nextKey,
  };
};

export function normalizeExternalPromptBrackets(
  promptId: string,
  prompt: string
): ExternalPromptBracketNormalization {
  const variablesByKey = new Map<string, ExternalPromptRemixVariable>();
  const variableByToken = new Map<string, ExternalPromptRemixVariable>();
  const replacements: Record<string, string> = {};

  const normalizedPrompt = prompt.replace(
    bracketTokenPattern,
    (token, descriptor: string) => {
      const cleaned = descriptor.trim();
      const lower = cleaned.toLowerCase();

      if (structuralBracketLabels.has(lower)) {
        replacements[token] = `${titleCase(cleaned)}:`;
        return replacements[token];
      }

      if (!isExternalPromptBracketPlaceholder(cleaned)) return token;

      const existing = variableByToken.get(token);
      if (existing) return existing.defaultValue;

      const { defaultValue, suggestions } = getDefaultForDescriptor(cleaned);
      const usedDefaultValues = new Set(
        [...variablesByKey.values()].map((variable) => variable.defaultValue)
      );
      const resolvedDefaultValue = usedDefaultValues.has(defaultValue)
        ? suggestions.find((suggestion) => !usedDefaultValues.has(suggestion)) ??
          `${defaultValue} ${variablesByKey.size + 1}`
        : defaultValue;
      const resolvedSuggestions = defaultSuggestions(
        resolvedDefaultValue,
        [defaultValue, ...suggestions]
      );
      const nextVariable = dedupeVariableKey(
        createVariable(cleaned, resolvedDefaultValue, resolvedSuggestions),
        variablesByKey
      );
      variableByToken.set(token, nextVariable);
      variablesByKey.set(nextVariable.key, nextVariable);
      replacements[token] = nextVariable.defaultValue;

      return nextVariable.defaultValue;
    }
  );

  const variables = [...variablesByKey.values()];

  return {
    prompt: normalizedPrompt,
    schema:
      variables.length > 0
        ? {
            promptId,
            variables,
            keepTerms: [],
          }
        : null,
    replacements,
  };
}

export function applyExternalPromptBracketReplacements(
  prompt: string,
  replacements: Record<string, string>
) {
  let nextPrompt = prompt;
  for (const [token, replacement] of Object.entries(replacements)) {
    nextPrompt = nextPrompt.split(token).join(replacement);
  }
  return nextPrompt;
}
