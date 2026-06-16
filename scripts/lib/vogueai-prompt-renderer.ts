export type PromptVariableMap = Record<string, unknown>;

const KEEP_STYLE_SENTENCE =
  'Keep the visual style consistent with the template while changing only the listed variables.';

const SECTION_LABELS = [
  'intent',
  'theme',
  'signature elements',
  'layout logic',
  'transformation rule',
  'annotation system',
  'worldbuilding',
  'composition',
  'style',
  'restrictions',
  'subject',
  'scene',
  'setting',
  'color palette',
  'typography',
  'lighting',
  'camera',
  'materials',
  'texture',
  'paper environment',
  'screen modules',
  'guide sections',
  'info modules',
  'rating system',
  'board modules',
  'board sections',
  'analysis modules',
  'ui regions',
  'card sections',
  'data modules',
  'detail modules',
  'label items',
  'technical annotations',
];

const VARIABLE_SECTION_LABELS = [
  'accent color',
  'adult character',
  'adult subject',
  'adult supporter',
  'annotation style',
  'app categories',
  'app name',
  'background',
  'background color',
  'background mood',
  'background style',
  'beach setting',
  'body color',
  'brand colors',
  'brand mood',
  'brand name',
  'breakdown modules',
  'caption style',
  'character',
  'character identity',
  'character theme',
  'chat lines',
  'chat messages',
  'chat topic',
  'city',
  'city elements',
  'color accents',
  'color grade',
  'color mood',
  'corridor scene',
  'cosmic environment',
  'costume',
  'costume palette',
  'country',
  'cover lines',
  'cover title',
  'cultural event',
  'cultural style',
  'destination',
  'diagnosis focus',
  'display name',
  'doodles',
  'duel scene',
  'emergence action',
  'environment',
  'environmental effects',
  'equipment',
  'exhibition topic',
  'film stock mood',
  'film title',
  'finish',
  'flag and landmarks',
  'food name',
  'foreground elements',
  'future setting',
  'game name',
  'grid layout',
  'group members',
  'hairstyle set',
  'hands',
  'headline',
  'hero',
  'hero identity',
  'hero object',
  'hero subject',
  'host identity',
  'iconic moment',
  'illustration style',
  'ink language',
  'ink style',
  'inner universe',
  'landmarks',
  'landscape',
  'layout',
  'life stages',
  'local details',
  'local landmark',
  'location',
  'main silhouette',
  'main visual',
  'message style',
  'model',
  'mood palette',
  'motion pose',
  'music era',
  'neon palette',
  'outfit',
  'outfit items',
  'outfit props',
  'outfit theme',
  'overlay elements',
  'palette',
  'panel foods',
  'person',
  'person profile',
  'photo style',
  'photo texture',
  'pose',
  'pose crop',
  'pose expression',
  'pose or panel system',
  'poster text',
  'poster title',
  'presenter character',
  'primary subject',
  'process steps',
  'product',
  'product category',
  'product grid',
  'product language',
  'product object',
  'professional role',
  'project type',
  'quadrants',
  'record or artist mood',
  'reference layout',
  'render style',
  'report focus',
  'scale element',
  'school era',
  'screen layout',
  'scroll world',
  'seal text',
  'season light',
  'semantic mood',
  'sharing mood',
  'source photo subject',
  'spacecraft type',
  'spec sections',
  'stadium scene',
  'stage details',
  'stamp design',
  'stream title',
  'stream topic',
  'student group',
  'style goal',
  'target person',
  'target word',
  'temperament',
  'text stickers',
  'time of day',
  'time periods',
  'title',
  'title text',
  'topic',
  'type structure',
  'ui platform',
  'user input type',
  'vehicle model',
  'viewer count',
  'visual metaphor',
  'visual style',
  'visual theme',
  'wardrobe',
  'wardrobe or props',
  'warrior type',
  'watercolor language',
  'weapon detail',
  'world setting',
];

const ALL_SECTION_LABELS = Array.from(
  new Set([...SECTION_LABELS, ...VARIABLE_SECTION_LABELS])
);

const sectionBoundaryBody = `\\s+(?:${ALL_SECTION_LABELS.map(escapeRegExp).join(
  '|'
)})\\s*:|\\s+${escapeRegExp(
  KEEP_STYLE_SENTENCE
)}|$`;
const sectionBoundary = `(?=${sectionBoundaryBody})`;
const sourceScaffoldBoundaryBody = `\\s+(?:${ALL_SECTION_LABELS.map(
  escapeRegExp
).join('|')})\\s*:`;

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function compactWhitespace(value: string) {
  return value.replace(/\s+/g, ' ').trim();
}

function normalizeKey(key: string) {
  return key
    .replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
    .replace(/[^a-z0-9]+/gi, '_')
    .replace(/^_+|_+$/g, '')
    .toLowerCase();
}

function humanizeKey(key: string) {
  return normalizeKey(key).replace(/_/g, ' ');
}

function normalizePlaceholderDescriptor(value: string) {
  return value
    .replace(/\$+/g, '')
    .replace(/['"`]/g, '')
    .replace(/\be\.g\..*$/i, '')
    .replace(/[^a-z0-9]+/gi, '_')
    .replace(/^_+|_+$/g, '')
    .toLowerCase();
}

function stringifyVariableValue(value: unknown): string {
  if (Array.isArray(value)) {
    return value.map(stringifyVariableValue).filter(Boolean).join(', ');
  }
  if (value && typeof value === 'object') {
    return Object.values(value).map(stringifyVariableValue).filter(Boolean).join(', ');
  }
  return String(value ?? '').trim();
}

function cleanupSourceMechanism(value: string) {
  return compactWhitespace(
    value
      .split(';')
      .map((part) => part.trim())
      .filter(Boolean)
      .filter((part) => !/^editable placeholders\s*:/i.test(part))
      .join('. ')
  );
}

function stripInternalPromptScaffold(prompt: string) {
  return compactWhitespace(
    prompt.replace(
      new RegExp(
        `^Reference Role:\\s*([^.\\n]+)\\.\\s*Visual Goal:\\s*.*?\\.\\s*Source Mechanism:\\s*([\\s\\S]*?)(?=${sourceScaffoldBoundaryBody}|$)`,
        'i'
      ),
      (_match, role: string, mechanism: string) => {
        const cleanedMechanism = cleanupSourceMechanism(mechanism);
        return cleanedMechanism
          ? `Create a reusable ${role.trim()} with ${cleanedMechanism}.`
          : `Create a reusable ${role.trim()}.`;
      }
    )
  );
}

function stripConcreteVariableList(prompt: string) {
  return compactWhitespace(
    prompt
      .replace(
        /\s+Concrete variant variables:\s*.*?(?=\s+Keep the visual style consistent with the template while changing only the listed variables\.?|$)/gi,
        ' '
      )
      .replace(/\s+Apply these variables:\s*\{[\s\S]*?\}\s*\.?(?=\s|$)/gi, ' ')
  );
}

function stripGenericPlaceholderSections(prompt: string) {
  return compactWhitespace(
    prompt
      .replace(
        /\b[A-Za-z][A-Za-z0-9 /&-]{2,50}:\s*(?:source-specific|alternate)\b[^.]*\.?/gi,
        ' '
      )
      .replace(/\beditable placeholders\s*:\s*[^.]*\.?/gi, ' ')
      .replace(/\beditable placeholders\s*,\s*/gi, ' ')
  );
}

function stripUnresolvedBracketPlaceholderClauses(prompt: string) {
  return compactWhitespace(
    prompt
      .split(/(?<=[.;])\s+/)
      .filter((clause) => !/\[[A-Z][A-Z0-9 _/-]{1,80}\]/.test(clause))
      .join(' ')
  );
}

function cleanupDuplicateResolvedPlaceholders(prompt: string) {
  return prompt.replace(/\bthemed around ([^.;]+?) and \1\b/gi, 'themed around $1');
}

function cleanupPromptPunctuation(prompt: string) {
  return compactWhitespace(
    prompt
      .replace(
        /Card design details:\s*([^.]+?)-inspired lettering/gi,
        'Card design details: local culture-inspired lettering informed by $1'
      )
      .replace(
        /\((styled as [^.]+?)\.\s+Card design details:/gi,
        '($1). Card design details:'
      )
      .replace(/\bpassport pa\b/gi, 'passport page')
      .replace(/\bembossed surf\b/gi, 'embossed surface')
      .replace(/\.{2,}/g, '.')
      .replace(/\s+\.(?=\s|$)/g, '.')
      .replace(/\(\s*;/g, '(')
      .replace(/\s+([,.;:])/g, '$1')
  );
}

function hasSection(prompt: string, label: string) {
  return new RegExp(`\\b${escapeRegExp(label)}\\s*:`, 'i').test(prompt);
}

function punctuateSectionValue(value: string) {
  return /[.!?"]$/.test(value.trim()) ? value.trim() : `${value.trim()}.`;
}

function replaceSection(prompt: string, label: string, replacement: string) {
  const regex = new RegExp(
    `\\b${escapeRegExp(label)}\\s*:\\s*.*?${sectionBoundary}`,
    'i'
  );
  if (!regex.test(prompt)) return null;
  return prompt.replace(regex, `${label}: ${punctuateSectionValue(replacement)}`);
}

function appendToSection(prompt: string, label: string, addition: string) {
  const regex = new RegExp(
    `(\\b${escapeRegExp(label)}\\s*:\\s*.*?)(?=${sectionBoundaryBody})`,
    'i'
  );
  if (!regex.test(prompt)) return null;
  return prompt.replace(regex, (_match, section: string) => {
    const trimmed = section.trimEnd();
    const separator = /[.!?]$/.test(trimmed) ? ' ' : '. ';
    return `${trimmed}${separator}${addition}`;
  });
}

function insertSection(
  prompt: string,
  label: string,
  value: string,
  preferredBefore: string[]
) {
  const section = `${label}: ${value}`;
  for (const targetLabel of preferredBefore) {
    const regex = new RegExp(`\\s+${escapeRegExp(targetLabel)}\\s*:`, 'i');
    const match = regex.exec(prompt);
    if (!match) continue;
    return `${prompt.slice(0, match.index)} ${section}.${prompt.slice(
      match.index
    )}`;
  }

  const keepIndex = prompt.search(
    new RegExp(`\\s+${escapeRegExp(KEEP_STYLE_SENTENCE)}`, 'i')
  );
  if (keepIndex >= 0) {
    return `${prompt.slice(0, keepIndex)} ${section}.${prompt.slice(keepIndex)}`;
  }

  return `${prompt} ${section}.`;
}

function findSubjectValue(variables: PromptVariableMap) {
  const subjectLike = Object.entries(variables)
    .map(([key, value]) => [normalizeKey(key), stringifyVariableValue(value)] as const)
    .filter(([, value]) => value.length > 0 && value.length <= 180)
    .find(([key]) =>
      /^(app_name|brand_name|topic|food_name|destination|city|country|product|subject|primary_subject|hero_subject|hero|hero_identity|adult_subject|adult_character|character|character_identity|person|person_profile|source_photo_subject|target_person|main_silhouette|product_object|vehicle_model|spacecraft_type)$/.test(
        key
      )
    );

  return subjectLike?.[1] ?? '';
}

function getIndefiniteArticle(value: string) {
  const normalized = value.trim().toLowerCase();
  if (/^(ai|api|ml|mvp|npc|seo|xr)\b/.test(normalized)) return 'an';
  if (/^(hour|honest|honor)\b/.test(normalized)) return 'an';
  if (/^(user|unified|unique|university|utility)\b/.test(normalized)) {
    return 'a';
  }
  return /^[aeio]/.test(normalized) ? 'an' : 'a';
}

function applyProductCategory(
  prompt: string,
  value: string,
  variables: PromptVariableMap
) {
  const subjectValue = findSubjectValue(variables);
  const article = getIndefiniteArticle(value);
  let next = prompt;

  if (subjectValue) {
    const builtAroundWithCategory = new RegExp(
      `built around ${escapeRegExp(subjectValue)},?\\s+(?:a|an)\\s+${escapeRegExp(
        value
      )}`,
      'i'
    );
    next = next.replace(
      builtAroundWithCategory,
      `built around ${subjectValue}, ${article} ${value}`
    );

    const builtAround = new RegExp(
      `built around ${escapeRegExp(subjectValue)}(?!,?\\s+(?:a|an)\\s+${escapeRegExp(
        value
      )})`,
      'i'
    );
    next = next.replace(
      builtAround,
      `built around ${subjectValue}, ${article} ${value}`
    );

    const subjectWithCategoryAs = new RegExp(
      `(subject:\\s*${escapeRegExp(
        subjectValue
      )}),?\\s+(?:a|an)\\s+${escapeRegExp(value)},?(\\s+as\\s+)`,
      'i'
    );
    next = next.replace(
      subjectWithCategoryAs,
      `$1, ${article} ${value},$2`
    );

    const subjectAs = new RegExp(
      `(subject:\\s*${escapeRegExp(subjectValue)})(\\s+as\\s+)`,
      'i'
    );
    next = next.replace(subjectAs, `$1, ${article} ${value},$2`);
  }

  if (next.includes(value)) return next;
  return insertSection(next, 'product category', value, [
    'composition',
    'style',
    'restrictions',
  ]);
}

function colorPaletteValue(value: string) {
  return `${value} controls the palette, accents, background, and supporting visual elements`;
}

function isGlobalColorKey(key: string) {
  return /^(brand_colors|palette|color_palette|color_mood|mood_palette|neon_palette|accent_color|color_accents|visual_theme)$/.test(
    key
  );
}

function isTypographyKey(key: string) {
  return /(^|_)(headline|poster_title|poster_text|title_text|cover_title|cover_lines|stream_title|game_name|film_title|seal_text|display_name|title)$/.test(
    key
  );
}

function isModuleKey(key: string) {
  return /(modules|sections|regions|messages|items|steps|layout|grid|annotations|system|rating_system|label_language|chat_lines|viewer_count)$/.test(
    key
  );
}

function isStyleKey(key: string) {
  return /(visual_style|style_goal|render_style|photo_style|illustration_style|watercolor_language|ink_language|caption_style|sharing_mood|brand_mood|music_era|record_or_artist_mood|temperament|finish|product_language|film_stock_mood|background_mood|color_grade|season_light)$/.test(
    key
  );
}

function insertionTargetsForKey(key: string) {
  if (/scene|setting|environment|world|background|landscape|location/.test(key)) {
    return ['composition', 'style', 'restrictions'];
  }
  if (/wardrobe|outfit|costume|pose|hairstyle|hands|equipment|weapon/.test(key)) {
    return ['scene', 'lighting', 'camera', 'composition', 'style'];
  }
  if (isModuleKey(key)) {
    return ['composition', 'style', 'restrictions'];
  }
  if (isTypographyKey(key)) {
    return ['restrictions', 'subject', 'scene', 'lighting'];
  }
  if (isStyleKey(key)) {
    return ['restrictions', 'subject', 'scene', 'lighting'];
  }
  return ['composition', 'style', 'restrictions'];
}

const placeholderAliasesByKey: Record<string, string[]> = {
  destination: ['city', 'country', 'city name', 'country name', 'place'],
  location: ['city', 'country', 'place'],
  product: ['dish', 'object', 'product object'],
  product_object: ['dish', 'object', 'product'],
  food_name: ['dish', 'dish name'],
  ingredients: ['ingredient'],
  culture_details: [
    'local culture',
    'local culture / regional design',
    'regional design',
    'local street character',
  ],
  landmark_set: ['iconic landmark', 'landmark', 'landmarks'],
  headline_text: ['dish name', 'tagline', 'headline', 'title'],
  title_text: ['dish name', 'tagline', 'headline', 'title'],
  display_name: ['name', 'person description'],
  person_description: ['person description', 'name'],
  source_photo_subject: ['name', 'subject'],
  target_person: ['name', 'subject'],
  subject: ['name', 'subject'],
};

function placeholderCandidatesForKey(rawKey: string, normalizedKey: string) {
  const baseCandidates = [
    rawKey,
    normalizedKey,
    rawKey.replace(/_/g, ' '),
    normalizedKey.replace(/_/g, ' '),
    humanizeKey(rawKey),
    humanizeKey(normalizedKey),
    ...(placeholderAliasesByKey[normalizedKey] ?? []),
  ];

  return Array.from(
    new Set(
      baseCandidates
        .map((candidate) => candidate.trim())
        .filter(Boolean)
    )
  );
}

function isGenericPublicPlaceholderValue(value: string) {
  return /^(?:source-specific|alternate)\b/i.test(value);
}

function replaceVariablePlaceholders(
  prompt: string,
  rawKey: string,
  normalizedKey: string,
  value: string
) {
  const candidates = placeholderCandidatesForKey(rawKey, normalizedKey);
  let next = prompt;

  for (const candidate of candidates) {
    next = next.replace(
      new RegExp(`\\{\\s*${escapeRegExp(candidate)}\\s*\\}`, 'gi'),
      value
    );
    next = next.replace(
      new RegExp(`\\[\\s*${escapeRegExp(candidate)}\\s*\\]`, 'gi'),
      value
    );
  }

  return next
    .replace(/\{\s*([^}\n]{1,120})\s*\}/g, (token, descriptor: string) =>
      normalizePlaceholderDescriptor(descriptor) === normalizedKey ? value : token
    )
    .replace(/\[\s*([^\]\n]{1,120})\s*\]/g, (token, descriptor: string) =>
      normalizePlaceholderDescriptor(descriptor) === normalizedKey ? value : token
    );
}

function applyVariable(prompt: string, rawKey: string, value: string, variables: PromptVariableMap) {
  const key = normalizeKey(rawKey);
  if (!value || value.length > 240 || isGenericPublicPlaceholderValue(value)) {
    return prompt;
  }

  const placeholderReplacedPrompt = replaceVariablePlaceholders(
    prompt,
    rawKey,
    key,
    value
  );
  if (placeholderReplacedPrompt !== prompt) return placeholderReplacedPrompt;

  if (key === 'product_category') {
    return applyProductCategory(prompt, value, variables);
  }
  if (prompt.includes(value)) return prompt;

  if (isGlobalColorKey(key)) {
    const replacement = colorPaletteValue(value);
    return (
      replaceSection(prompt, 'color palette', replacement) ??
      insertSection(prompt, 'color palette', replacement, [
        'typography',
        'lighting',
        'camera',
        'materials',
        'restrictions',
      ])
    );
  }

  if (isTypographyKey(key)) {
    const label = key.includes('headline') ? 'visible headline' : humanizeKey(key);
    const addition = `${label}: "${value}"`;
    return (
      appendToSection(prompt, 'typography', addition) ??
      insertSection(prompt, 'typography', addition, [
        'lighting',
        'camera',
        'materials',
        'restrictions',
      ])
    );
  }

  const label = humanizeKey(key);
  const sectionValue = `${value}`;
  if (hasSection(prompt, label)) {
    return replaceSection(prompt, label, sectionValue) ?? prompt;
  }

  if (isStyleKey(key)) {
    return (
      appendToSection(prompt, 'style', `${label}: ${value}.`) ??
      insertSection(prompt, label, sectionValue, insertionTargetsForKey(key))
    );
  }

  if (isModuleKey(key)) {
    return insertSection(prompt, label, sectionValue, insertionTargetsForKey(key));
  }

  if (/^(lighting|camera|materials|composition|scene|setting|background|environment|location)$/.test(key)) {
    return (
      replaceSection(prompt, label, sectionValue) ??
      insertSection(prompt, label, sectionValue, insertionTargetsForKey(key))
    );
  }

  return insertSection(prompt, label, sectionValue, insertionTargetsForKey(key));
}

export function renderInlineVariablePrompt(
  prompt: string,
  variables?: PromptVariableMap
) {
  let next = stripGenericPlaceholderSections(
    stripConcreteVariableList(stripInternalPromptScaffold(prompt))
  );
  if (!variables) {
    return cleanupPromptPunctuation(
      stripUnresolvedBracketPlaceholderClauses(
        cleanupDuplicateResolvedPlaceholders(next)
      )
    );
  }

  for (const [key, value] of Object.entries(variables)) {
    next = applyVariable(next, key, stringifyVariableValue(value), variables);
  }

  return cleanupPromptPunctuation(
    stripUnresolvedBracketPlaceholderClauses(
      cleanupDuplicateResolvedPlaceholders(stripGenericPlaceholderSections(next))
    )
  );
}
