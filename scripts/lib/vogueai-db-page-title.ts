type DbTitleRow = {
  title?: string;
  template_id: string;
  prompt_schema_json?: string;
  prompt_instances_json?: string;
};

type TitleOptions = {
  includeSourceMotif?: boolean;
  duplicateIndex?: number;
};

type PromptInstance = {
  variables?: Record<string, unknown>;
};

const genericTitleOverrides: Record<string, string> = {
  'nba-finals-og-putback-rim-pov-poster-v1':
    'NBA Finals Putback Rim POV Poster AI Prompt',
  'nba-finals-wemby-vs-brunson-city-duel-poster-v1':
    'NBA Finals City Duel Poster AI Prompt',
  'nba-finals-new-york-front-page-brunson-og-poster-v1':
    'NBA Finals New York Front Page Poster AI Prompt',
  'nba-finals-knicks-four-heroes-illustration-poster-v1':
    'NBA Finals Four Heroes Illustration Poster AI Prompt',
  'ai-image-prompt-x2063737218003333288-v1':
    'Luxury Product Alchemy AI Prompt',
  'bright-clean-graphic-publicity-visual-v1':
    'Fictional Hollywood Starlet Publicity Poster AI Prompt',
  'claude-fable-5-vs-mythos-5-epic-tech-poster-v1':
    'Claude Fable 5 vs Mythos 5 Epic Tech Poster AI Prompt',
  'ai-image-prompt-x2062080407781392432-v1':
    'Virtual Creator Editorial Portrait AI Prompt',
  'ai-image-prompt-x2062325077912519045-v1':
    'Startup Founder Editorial Portrait AI Prompt',
  'ai-image-prompt-x2062447548577784083-v1':
    'Soft Waves Editorial Portrait Set AI Prompt',
  'ai-image-prompt-x2062696495741391006-v1':
    'Editorial Portrait Collage Set AI Prompt',
  'ai-image-prompt-x2062687215734645033-v1':
    'Astronaut Silhouette Universe Poster AI Prompt',
  'ai-image-prompt-x2062693385245261873-v1':
    'Cinematic Cosmic Spacecraft Vista AI Prompt',
};

const wordDisplayOverrides: Record<string, string> = {
  ai: 'AI',
  app: 'App',
  bazi: 'Bazi',
  ceo: 'CEO',
  cg: 'CG',
  e: 'e',
  gt: 'GT',
  hdr: 'HDR',
  iphone: 'iPhone',
  ip: 'IP',
  k: 'K',
  kv: 'KV',
  moss: 'Moss',
  nike: 'Nike',
  rice: 'Rice',
  sci: 'Sci',
  ui: 'UI',
  vanta: 'Vanta',
  wechat: 'WeChat',
  xiaohongshu: 'Xiaohongshu',
  youtube: 'YouTube',
  vs: 'vs',
  '3d': '3D',
};

const genericTitlePatterns = [
  /^ai\s*(image\s*)?prompt$/i,
  /^ai\s*图片\s*prompt$/i,
  /^视觉海报$/i,
  /^编辑人像$/i,
  /^社交自拍视觉$/i,
  /^体育应援海报$/i,
  /^ai-image-prompt-x\d+/i,
  /^visual-poster-x\d+/i,
  /^editorial-portrait-x\d+/i,
  /^social-selfie-prompt-x\d+/i,
  /^sports-supporter-poster-x\d+/i,
];

function parseJson<T>(value: string | undefined, fallback: T): T {
  try {
    return JSON.parse(value || '') as T;
  } catch {
    return fallback;
  }
}

function slugify(value: string, fallback = 'prompt') {
  const slug = value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');

  return slug || fallback;
}

function titleCaseFromSlug(value: string) {
  return value
    .split('-')
    .filter(Boolean)
    .map((word) => {
      const override = wordDisplayOverrides[word.toLowerCase()];
      if (override) return override;
      return `${word.charAt(0).toUpperCase()}${word.slice(1)}`;
    })
    .join(' ');
}

function humanizeSlug(value: string) {
  return titleCaseFromSlug(slugify(value.replace(/_/g, ' ')));
}

function compactWhitespace(value: string) {
  return value.replace(/\s+/g, ' ').trim();
}

function ensurePromptSuffix(title: string) {
  const cleaned = compactWhitespace(title)
    .replace(/\s+AI\s+Prompt\s+AI\s+Prompt$/i, ' AI Prompt')
    .replace(/\s+Prompt\s+AI\s+Prompt$/i, ' AI Prompt')
    .replace(/\s+AI\s+Prompt$/i, '');

  return `${cleaned} AI Prompt`;
}

function isUsefulTitle(title: string | undefined) {
  const value = compactWhitespace(title || '');
  if (!value || /[\u3400-\u9fff]/.test(value)) return false;
  return !genericTitlePatterns.some((pattern) => pattern.test(value));
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

function firstVariables(row: DbTitleRow) {
  const instances = parseJson<PromptInstance[]>(
    row.prompt_instances_json,
    []
  );
  return instances[0]?.variables ?? {};
}

function valueFor(
  variables: Record<string, unknown>,
  ...keys: string[]
) {
  for (const key of keys) {
    const value = stringifyVariableValue(variables[key]);
    if (value && !/^source-specific\b/i.test(value)) return value;
  }
  return '';
}

function cleanTitlePhrase(value: string) {
  return compactWhitespace(value)
    .replace(/^the\s+attached\s+/i, '')
    .replace(/^fictional\s+/i, '')
    .replace(/^ultra-realistic\s+/i, '')
    .replace(/^adult\s+/i, '')
    .replace(/\bfrom the uploaded photo\b/i, '')
    .replace(/\bcalled\s+/i, '')
    .replace(/\s+with\s+.+$/i, '')
    .replace(/\s+showing\s+.+$/i, '')
    .replace(/\s+inspired by\s+.+$/i, '')
    .replace(/\s+seen from\s+.+$/i, '')
    .replace(/\s+repeated consistently.+$/i, '')
    .replace(/\s+translated into.+$/i, '')
    .replace(/\s+preserved exactly.+$/i, '');
}

function phraseTitle(value: string, maxWords = 5) {
  const cleaned = cleanTitlePhrase(value);
  if (!cleaned) return '';

  return titleCaseFromSlug(slugify(cleaned).split('-').slice(0, maxWords).join('-'));
}

function sourceCharacteristics(row: DbTitleRow) {
  const schema = parseJson<Record<string, unknown>>(row.prompt_schema_json, {});
  const rawCharacteristics = schema.source_characteristics;
  return Array.isArray(rawCharacteristics)
    ? rawCharacteristics.map(stringifyVariableValue).filter(Boolean)
    : [];
}

function isGenericCharacteristic(value: string) {
  return (
    value.length < 8 ||
    /^editable placeholders\b/i.test(value) ||
    /^source visual mechanism$/i.test(value) ||
    /^source-specific/i.test(value) ||
    /^portrait-forward composition$/i.test(value) ||
    /^character-first fantasy styling$/i.test(value) ||
    /^distinct prop\/world cue$/i.test(value) ||
    /^controlled anime\/3d concept-art rendering$/i.test(value) ||
    /^hero athlete poster language$/i.test(value) ||
    /^jersey\/back-number\/tournament energy$/i.test(value) ||
    /^cinematic stadium lighting$/i.test(value) ||
    /^using the uploaded image/i.test(value) ||
    /uploaded image as the reference/i.test(value) ||
    /appetizing food hero image/i.test(value) ||
    /brand packaging design proposal|packaging proposal board/i.test(value) ||
    /^(reference-aware|commercial product hero|destination-led|fantasy character concept|sports editorial poster|controlled editorial portrait|general visual template|sports supporter content frame)/i.test(
      value
    )
  );
}

function motifFromCharacteristic(value: string) {
  const compacted = compactWhitespace(value)
    .replace(/\[[^\]]+\]/g, ' ')
    .replace(/\{[^}]+\}/g, ' ')
    .replace(/\b\d+:\d+\b/g, ' ')
    .replace(/\b\d+x\d+\b/gi, ' ')
    .replace(/^prompt template:\s*/i, '')
    .replace(/^(create|generate|design|render|transform|using|use)\s+(a|an|the)?\s*/i, '');

  const specials: Array<[RegExp, string]> = [
    [/iphone portrait/i, 'iPhone Portrait'],
    [/cloud portrait/i, 'Cloud Portrait'],
    [/action figure|microsoft surface/i, 'Action Figure'],
    [/one complete 3d illustration|complete 3d illustration.*cartoon figure|cartoon figure with a tiny head/i, '3D Character'],
    [/high-fashion editorial|nike sweatshirt/i, 'High Fashion Pose'],
    [/premium fashion editorial.*sports car|custom sports car wheel|modified vehicle/i, 'Sports Car Editorial'],
    [/hand-painted korean webtoon/i, 'Outdoor Webtoon'],
    [/ultra-detailed 3d cgi pixar|bathroom mirror selfie|cultural figures/i, '3D Mirror Selfie'],
    [/nine-panel|3x3/i, 'Nine Panel'],
    [/overhead cinematic shot/i, 'Overhead Shot'],
    [/crimson roses|bundle of deep crimson roses/i, 'Rose Overhead'],
    [/cozy bed|lifestyle photo/i, 'Cozy Bed'],
    [/adidas|aeroblade/i, 'Aero Sneaker'],
    [/rain-soaked|explosion/i, 'Rain Action'],
    [/supermarket sale flyer/i, 'Supermarket Flyer'],
    [/dutch golden age|renaissance/i, 'Renaissance Food'],
    [/\bkv\b|logo/i, 'KV Layout'],
    [/beach motion|runs happily toward/i, 'Beach Motion'],
    [/beauty campaign|translucent serif/i, 'Beauty Campaign'],
    [/korean-style commercial photograph|sports magazine cover/i, 'Magazine Cover'],
    [/high-end fashion editorial|luxury magazine cover/i, 'Fashion Cover'],
    [/ivory-white textured dress|gold jhumka/i, 'Ivory Dress'],
    [/large mockups and material|material swatches/i, 'Mockup Board'],
    [/collectible travel card|metro pass|boarding pass/i, 'Travel Card'],
    [/stylized travel poster|graphic collage/i, 'Tourist Collage'],
    [/passport-style photo prints/i, 'Passport Print'],
    [/tilt-shift miniature/i, 'Tilt Shift Map'],
    [/movie poster.*crayon|crayon drawing/i, 'Crayon Poster'],
    [/book, course, or event|ad creative production/i, 'Ad Creative'],
    [/urban nomad project/i, 'Urban Nomad'],
    [/legacy poster|player/i, 'Player Legacy'],
    [/last dance/i, 'Last Dance'],
    [/female football travel vlogger/i, 'Travel Vlogger'],
    [/country name/i, 'Country Supporter'],
    [/cinematic minimalist portrait/i, 'Gradient Silhouette'],
    [/round shutter-style sunglasses/i, 'Orange Lens'],
    [/morning portrait|waist-up/i, 'Morning Crop'],
  ];
  const special = specials.find(([pattern]) => pattern.test(compacted));
  if (special) return special[1];

  return phraseTitle(compacted, 4);
}

export function getVogueAiDbTitleMotif(row: DbTitleRow) {
  for (const characteristic of sourceCharacteristics(row)) {
    if (isGenericCharacteristic(characteristic)) continue;
    const motif = motifFromCharacteristic(characteristic);
    if (motif) return motif;
  }
  return '';
}

function brandTitle(value: string) {
  return phraseTitle(value, 4);
}

function productTitle(value: string) {
  const cleaned = cleanTitlePhrase(value)
    .replace(/\blimited-edition\b/i, '')
    .replace(/\bpremium\b/i, '')
    .replace(/\bproduct photo\b/i, 'product')
    .replace(/\s+/g, ' ')
    .trim();
  return phraseTitle(cleaned, 4);
}

function categoryTitle(category: string, variables: Record<string, unknown>) {
  const brand = brandTitle(valueFor(variables, 'fictional_brand', 'brand_name'));
  const product =
    productTitle(
      valueFor(variables, 'product_category', 'product', 'product_line', 'product_reference')
    ) || brand;
  const subject = phraseTitle(
    valueFor(
      variables,
      'subject',
      'main_subject',
      'adult_subject',
      'character_identity',
      'reference_subject',
      'streamer_subject'
    ),
    4
  );

  switch (category) {
    case 'reference_selfie_transform':
      return `${phraseTitle(valueFor(variables, 'transformation_style'), 4) || 'Reference'} Selfie Transform`;
    case 'product_ad_poster':
      return `${[brand, product].filter(Boolean).join(' ') || 'Product'} Ad Poster`;
    case 'vector_mascot_logo':
      return `${phraseTitle(valueFor(variables, 'person_description'), 3) || 'Vector Mascot'} Logo`;
    case 'travel_collage_poster':
      return `${phraseTitle(valueFor(variables, 'destination'), 3) || 'Travel'} Collage Poster`;
    case 'ui_livestream_screenshot':
      return `${subject || 'Livestream'} UI Screenshot`;
    case 'food_commercial_poster':
      return `${phraseTitle(valueFor(variables, 'headline_text'), 4) || product || 'Food'} Commercial Poster`;
    case 'fantasy_character_concept':
      return `${subject || 'Fantasy Character'} Concept`;
    case 'bw_cinematic_emotional_portrait':
      return 'Black And White Cinematic Emotional Portrait';
    case 'sports_editorial_poster':
      return `${phraseTitle(valueFor(variables, 'headline_text'), 4) || 'Sports'} Editorial Poster`;
    case 'packaging_proposal_board':
      return `${brand || product || 'Brand'} Packaging Proposal Board`;
    case 'animation_story_workflow':
      return `${phraseTitle(valueFor(variables, 'world_setting', 'story_premise'), 4) || 'Animation'} Storyboard Workflow`;
    case 'emotion_grid':
      return `${subject || '3D Avatar'} Emotion Grid`;
    case 'double_exposure_persona':
      return `${phraseTitle(valueFor(variables, 'caption_text', 'persona'), 6) || 'Persona'} Double Exposure Poster`;
    case 'editorial_portrait':
      return `${phraseTitle(valueFor(variables, 'setting', 'portrait_mood', 'adult_subject'), 4) || 'Editorial'} Portrait`;
    case 'brand_triptych_editorial':
      return `${brand || 'Brand'} Triptych Editorial`;
    case 'food_step_infographic':
      return `${product || 'Food'} Step Infographic`;
    case 'layered_papercraft_poster':
      return `${phraseTitle(valueFor(variables, 'scene', 'subject'), 4) || 'Layered Papercraft'} Poster`;
    case 'general_visual_template':
      return `${subject || 'Reusable Visual'} Poster`;
    case 'sports_supporter_vlogger':
      return 'Football Supporter Vlogger Poster';
    case 'character_guardian_poster':
      return `${subject || 'Guardian Character'} Poster`;
    case 'photo_edit_coin_count':
      return 'Coin Counting Photo Edit';
    case 'smartphone_video_scene':
      return 'Smartphone Video Scene';
    case 'logo_mark':
      return `${brand || 'Logo'} Mark Design`;
    case 'translucent_object_product_render':
      return `${product || 'Translucent Object'} Product Render`;
    case 'infographic_diagram':
      return 'Infographic Diagram';
    case 'seasonal_eye_macro_grid':
      return 'Seasonal Eye Macro Grid';
    case 'concept_glossary_poster':
      return 'Concept Glossary Poster';
    case 'terrain_pareidolia_logo':
      return `${phraseTitle(valueFor(variables, 'brand_symbol'), 3) || 'Terrain'} Pareidolia Logo`;
    case 'needle_felted_miniature':
      return 'Needle Felted Miniature';
    case 'architecture_window_view':
      return 'Architecture Window View Photo';
    case 'ink_editorial_illustration':
      return `${phraseTitle(valueFor(variables, 'setting'), 3) || 'Ink'} Editorial Illustration`;
    case 'premium_vehicle_poster':
      return `${product || 'Premium Vehicle'} Poster`;
    case 'anime_character_theme_card':
      return `${phraseTitle(valueFor(variables, 'character_name'), 3) || 'Anime Character'} Theme Card`;
    case 'luxury_product_photo_poster':
      return `${brand || 'Luxury Product'} Photo Poster`;
    default:
      return humanizeSlug(category || 'visual-template');
  }
}

function mergeMotifIntoTitle(baseTitle: string, category: string, motif: string) {
  if (!motif) return baseTitle;
  if (baseTitle.toLowerCase().includes(motif.toLowerCase())) return baseTitle;

  switch (category) {
    case 'reference_selfie_transform':
      return /webtoon/i.test(motif)
        ? `${motif} Selfie Transform`
        : `${motif} Webtoon Selfie Transform`;
    case 'product_ad_poster':
      return baseTitle.replace(/\s+Ad Poster$/i, ` ${motif} Ad Poster`);
    case 'travel_collage_poster':
      return /collage$/i.test(motif)
        ? baseTitle.replace(/\s+Collage Poster$/i, ` ${motif} Poster`)
        : baseTitle.replace(/\s+Collage Poster$/i, ` ${motif} Collage Poster`);
    case 'fantasy_character_concept':
      return /character/i.test(motif)
        ? `${motif} Concept`
        : `${motif} Character Concept`;
    case 'sports_editorial_poster':
      return baseTitle.replace(/\s+Editorial Poster$/i, ` ${motif} Editorial Poster`);
    case 'editorial_portrait':
      return /editorial/i.test(motif)
        ? `${motif} Portrait`
        : `${motif} Editorial Portrait`;
    case 'general_visual_template':
      return `${motif} Visual Poster`;
    case 'sports_supporter_vlogger':
      return `${motif} Football Supporter Poster`;
    case 'packaging_proposal_board':
      return /board$/i.test(motif)
        ? baseTitle.replace(/\s+Packaging Proposal Board$/i, ` ${motif}`)
        : baseTitle.replace(
            /\s+Packaging Proposal Board$/i,
            ` ${motif} Packaging Board`
          );
    default:
      return `${motif} ${baseTitle}`;
  }
}

function stripTemplateSuffix(templateId: string) {
  return templateId
    .replace(/-v\d+$/i, '')
    .replace(/-x\d+$/i, '');
}

export function getVogueAiDbPublicTitle(row: DbTitleRow, options: TitleOptions = {}) {
  const override = genericTitleOverrides[row.template_id];
  if (override) return override;

  const schema = parseJson<Record<string, unknown>>(row.prompt_schema_json, {});
  const classificationLabel = String(schema.classification_label || '').trim();
  if (classificationLabel && isUsefulTitle(classificationLabel)) {
    return ensurePromptSuffix(classificationLabel.replace(/^safe\s+/i, '').trim());
  }

  const category = String(schema.category || '').trim();
  if (category) {
    let title = categoryTitle(category, firstVariables(row));
    if (options.includeSourceMotif) {
      const motif = getVogueAiDbTitleMotif(row);
      title = mergeMotifIntoTitle(title, category, motif);
      if (options.duplicateIndex && options.duplicateIndex > 1) {
        title = `${title} ${options.duplicateIndex}`;
      }
    }
    return ensurePromptSuffix(title);
  }

  if (isUsefulTitle(row.title)) {
    return ensurePromptSuffix(row.title || '');
  }

  return ensurePromptSuffix(humanizeSlug(stripTemplateSuffix(row.template_id)));
}
