export type FeaturedCurationCandidate = {
  id: string;
  publicId: string;
  title: string;
  sourceTitle?: string;
  categoryKey?: string | null;
  images?: readonly string[];
  imageAssets?: ReadonlyArray<{
    width?: number | null;
    height?: number | null;
  }>;
};

export type FeaturedCurationScore = {
  score: number;
  bucket: string;
  reasons: string[];
  penalties: string[];
  reject: boolean;
};

type WeightedPattern = {
  pattern: RegExp;
  weight: number;
  reason: string;
};

const meigenStylePositiveSignals: WeightedPattern[] = [
  { pattern: /\b(editorial|fashion|magazine|cover|beauty)\b/, weight: 5, reason: 'editorial-fashion' },
  { pattern: /\b(poster|visual poster|hero poster|theme card|social card)\b/, weight: 5, reason: 'poster-template' },
  { pattern: /\b(campaign|commercial|advertising|ad poster|concept board)\b/, weight: 5, reason: 'commercial-campaign' },
  { pattern: /\b(travel|aviation|postage|stamp|boarding pass|passport|map collage)\b/, weight: 4, reason: 'travel-culture' },
  { pattern: /\b(football|supporter|world cup|nba|sports)\b/, weight: 7, reason: 'sports-poster' },
  { pattern: /\b(food|burger|beverage|tea|dessert|packaging|xiaohongshu cover)\b/, weight: 4, reason: 'food-product' },
  { pattern: /\b(skincare|bottle|product category|product campaign|product ad|juice ad|splash ad)\b/, weight: 5, reason: 'object-led-product' },
  { pattern: /\b(close-up photo|floating profile card|kinetic motion|motion blur)\b/, weight: 5, reason: 'object-closeup' },
  { pattern: /\b(fantasy|anime fantasy|character|stormglass|sword|warrior|cosmic|spacecraft)\b/, weight: 4, reason: 'fantasy-character' },
  { pattern: /\b(diorama|papercraft|layered|collage|six panel|scrapbook)\b/, weight: 4, reason: 'crafted-composition' },
  { pattern: /\b(identity|mockup|stickers|logo|brand|atelier|product render)\b/, weight: 3, reason: 'brand-system' },
  { pattern: /\b(cinematic|retro|vintage|monochrome|silhouette|night|low orbit|blue hour)\b/, weight: 3, reason: 'cinematic-mood' },
  { pattern: /\b(mood board|atlas visualization|key visual|y2k inspired)\b/, weight: 5, reason: 'graphic-key-visual' },
  { pattern: /\b(architecture|window view|city|urban|nomad|ceramicist)\b/, weight: 3, reason: 'place-object' },
];

const negativeSignals: WeightedPattern[] = [
  { pattern: /\b(selfie|mirror selfie|iphone portrait|webtoon selfie)\b/, weight: -12, reason: 'selfie-webtoon' },
  { pattern: /\b(terminal|permission|codex|screenshot|wireframe|ui)\b/, weight: -12, reason: 'engineering-artifact' },
  { pattern: /\b(report|analysis|diagnosis|consulting board|physiognomy|palmistry|command center|process flow|knowledge card|infographic)\b/, weight: -12, reason: 'utility-card' },
  { pattern: /\b(youtube thumbnail|thumbnail social media|storyboard|relationship chart|product page|e commerce|prompt sheet|presentation board|competition presentation|development board|design board|design sheet|eye macro|visual poster ai)\b/, weight: -12, reason: 'utility-sheet' },
  { pattern: /\b(fifa world cup final live|live match|match screenshot|artistic 16:9 character|stylized anime character illustration|lead character|bazi)\b/, weight: -12, reason: 'generic-or-low-tone' },
  { pattern: /\b(louis vuitton|white louis)\b/, weight: -12, reason: 'direct-brand-reference' },
  { pattern: /\b(children|child|baby|toddler|kids)\b/, weight: -12, reason: 'childlike-poster' },
  { pattern: /\b(person|ai image ai)\b/, weight: -12, reason: 'generic-title' },
  { pattern: /\b(profile avatar|headshot card|business profile|idea of logo)\b/, weight: -7, reason: 'profile-card' },
  { pattern: /\b(kids|child|emoji|sticker pack)\b/, weight: -5, reason: 'low-editorial-signal' },
];

const hardRejectPatterns = [
  /\b(terminal|permission|codex|screenshot|wireframe)\b/,
  /\b(selfie|mirror selfie|iphone portrait|webtoon selfie)\b/,
  /\b(analysis|diagnosis|consulting board|physiognomy|palmistry|command center|process flow|knowledge card|infographic)\b/,
  /\b(youtube thumbnail|thumbnail social media|storyboard|relationship chart|product page|e commerce|prompt sheet|presentation board|competition presentation|development board|design board|design sheet|eye macro|visual poster ai)\b/,
  /\b(fifa world cup final live|live match|match screenshot|artistic 16:9 character|stylized anime character illustration|lead character|bazi)\b/,
  /\b(louis vuitton|white louis)\b/,
  /\bidea of logo\b/,
  /\b(children|child|baby|toddler|kids)\b/,
  /^person$/,
  /^ai image ai (product|diagram|social|photo)?$/,
];

const normalizeCandidateText = (candidate: FeaturedCurationCandidate) =>
  [
    candidate.title,
    candidate.sourceTitle,
    candidate.categoryKey,
    candidate.id,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

const matchesAny = (text: string, patterns: RegExp[]) =>
  patterns.some((pattern) => pattern.test(text));

export const getFeaturedCurationBucket = (
  candidate: FeaturedCurationCandidate
) => {
  const text = normalizeCandidateText(candidate);

  if (/\b(football|supporter|world cup|nba|sports)\b/.test(text)) {
    return 'sports-poster';
  }
  if (/\b(food|burger|beverage|tea|dessert|packaging|xiaohongshu cover)\b/.test(text)) {
    return 'food-product';
  }
  if (/\b(skincare|bottle|product category|product campaign|product ad|juice ad|splash ad|close-up photo|floating profile card|kinetic motion|motion blur)\b/.test(text)) {
    return 'object-product';
  }
  if (/\b(travel|aviation|postage|stamp|boarding pass|passport|map collage)\b/.test(text)) {
    return 'travel-culture';
  }
  if (/\b(fantasy|anime fantasy|character|stormglass|sword|warrior|cosmic|spacecraft)\b/.test(text)) {
    return 'fantasy-character';
  }
  if (/\b(mood board|atlas visualization|key visual)\b/.test(text)) {
    return 'graphic-key-visual';
  }
  if (/\b(editorial|fashion|magazine|beauty|portrait)\b/.test(text)) {
    return 'editorial-portrait';
  }
  if (/\b(identity|mockup|stickers|logo|brand|atelier|product render)\b/.test(text)) {
    return 'brand-system';
  }
  if (/\b(diorama|papercraft|layered|collage|six panel|scrapbook)\b/.test(text)) {
    return 'crafted-composition';
  }
  if (/\b(architecture|city|urban|ceramicist|object)\b/.test(text)) {
    return 'place-object';
  }
  if (/\bposter\b/.test(text)) return 'poster';
  return candidate.categoryKey ?? 'general';
};

export const scoreFeaturedCandidate = (
  candidate: FeaturedCurationCandidate
): FeaturedCurationScore => {
  const text = normalizeCandidateText(candidate);
  const reasons: string[] = [];
  const penalties: string[] = [];
  let score = 0;

  for (const signal of meigenStylePositiveSignals) {
    if (!signal.pattern.test(text)) continue;
    score += signal.weight;
    reasons.push(signal.reason);
  }

  for (const signal of negativeSignals) {
    if (!signal.pattern.test(text)) continue;
    score += signal.weight;
    penalties.push(signal.reason);
  }

  const primaryImage = candidate.imageAssets?.[0];
  if ((primaryImage?.width ?? 0) >= 900 || (primaryImage?.height ?? 0) >= 900) {
    score += 1;
    reasons.push('large-source-image');
  }
  if (candidate.images?.length) {
    score += 1;
    reasons.push('has-gallery-image');
  }
  if (
    candidate.categoryKey &&
    ['portrait', 'poster', 'brandAds', 'art', 'fashion', 'product', 'social'].includes(
      candidate.categoryKey
    )
  ) {
    score += 1;
    reasons.push(`category-${candidate.categoryKey}`);
  }

  const bucket = getFeaturedCurationBucket(candidate);
  const reject = matchesAny(text, hardRejectPatterns) || score < 5;

  return {
    score,
    bucket,
    reasons: [...new Set(reasons)],
    penalties: [...new Set(penalties)],
    reject,
  };
};

export const rankFeaturedCandidates = <Candidate extends FeaturedCurationCandidate>(
  candidates: readonly Candidate[],
  options: {
    excludedIds?: ReadonlySet<string>;
    limit?: number;
    maxPerBucket?: number;
  } = {}
) => {
  const excludedIds = options.excludedIds ?? new Set<string>();
  const limit = options.limit ?? 50;
  const maxPerBucket = options.maxPerBucket ?? 4;
  const bucketCounts = new Map<string, number>();
  const selected: Candidate[] = [];
  const scoredCandidates = candidates
    .map((candidate, index) => ({
      candidate,
      curation: scoreFeaturedCandidate(candidate),
      index,
    }))
    .filter(
      ({ candidate, curation }) =>
        !curation.reject &&
        !excludedIds.has(candidate.id) &&
        !excludedIds.has(candidate.publicId) &&
        Boolean(candidate.images?.length)
    )
    .sort((left, right) => {
      if (right.curation.score !== left.curation.score) {
        return right.curation.score - left.curation.score;
      }
      return left.index - right.index;
    });

  const selectCandidate = (
    item: (typeof scoredCandidates)[number],
    enforceBucketLimit: boolean
  ) => {
    if (selected.some((entry) => entry.id === item.candidate.id)) return;
    const bucketCount = bucketCounts.get(item.curation.bucket) ?? 0;
    if (enforceBucketLimit && bucketCount >= maxPerBucket) return;
    selected.push(item.candidate);
    bucketCounts.set(item.curation.bucket, bucketCount + 1);
  };

  for (const item of scoredCandidates) {
    if (selected.length >= limit) break;
    const bucketCount = bucketCounts.get(item.curation.bucket) ?? 0;
    if (bucketCount > 0) continue;
    selectCandidate(item, true);
  }

  for (const item of scoredCandidates) {
    if (selected.length >= limit) break;
    selectCandidate(item, true);
  }

  return selected;
};
