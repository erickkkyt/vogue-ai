export type SocialPromptPageEntry = {
  slug: string;
  candidateId: string;
  title: string;
  seoTitle: string;
  description: string;
  sourceAuthor: string;
  sourceUrl: string;
  sourceType: string;
  sourceExcerpt: string;
  assetAngle: string;
  prompt: string | null;
  promptSummary: string[];
  useCases: string[];
  safetyNotes: string[];
  generatedImages: string[];
  referenceImagePolicy: string;
  updatedAt: string;
};

export const SOCIAL_PROMPT_PAGE_ENTRIES: SocialPromptPageEntry[] = [
  {
    slug: 'watercolor-travel-poster-ai-prompt',
    candidateId: '2026-06-01-cand-003',
    title: 'Watercolor Travel Poster AI Prompt',
    seoTitle: 'Watercolor Travel Poster AI Prompt | Vogue AI',
    description:
      'Create an original watercolor travel poster with ink-line architecture, soft paper texture, editorial spacing, and a reusable destination-poster structure.',
    sourceAuthor: 'Taaruk',
    sourceUrl: 'https://x.com/Taaruk_/status/2060938882146082935',
    sourceType: 'X prompt reference',
    sourceExcerpt:
      'Watercolor ink-line European city travel poster with paper texture.',
    assetAngle:
      'Remixed into a fictional destination poster prompt for VogueAI, Pinterest, and X.',
    prompt: null,
    promptSummary: [
      'Fictional destination instead of copying the source city.',
      'Ink-line architecture plus watercolor wash as the core style stack.',
      'Open headline space so the result works as a real poster asset.',
    ],
    useCases: ['Travel poster', 'Pinterest visual', 'Editorial illustration'],
    safetyNotes: [
      'Use fictional place names or your own destination copy.',
      'Do not reuse the source image as the public output.',
    ],
    generatedImages: [],
    referenceImagePolicy:
      'Reference images are stored only in the internal social workbench.',
    updatedAt: '2026-06-01',
  },
  {
    slug: 'image-to-video-ai-prompt-workflow',
    candidateId: '2026-06-01-cand-001',
    title: 'Image to Video AI Prompt Workflow',
    seoTitle: 'Image to Video AI Prompt Workflow | Vogue AI',
    description:
      'A reusable workflow prompt for turning a still AI image into a controlled short video concept with subject lock, first-two-second action, and camera movement.',
    sourceAuthor: 'Google Trends',
    sourceUrl:
      'https://trends.google.com/trends/explore?q=image+to+video+ai+with+prompt+online+free&date=now+7-d',
    sourceType: 'Search trend',
    sourceExcerpt:
      'Search demand for image-to-video prompt workflows is rising quickly.',
    assetAngle:
      'Turn search demand into a practical visual workflow page and X thread.',
    prompt: null,
    promptSummary: [
      'Starts from a strong still image before describing motion.',
      'Locks subject and scene before adding camera movement.',
      'Keeps the video idea simple enough to reuse in a generator.',
    ],
    useCases: ['Image-to-video prompt', 'Workflow explainer', 'AI video tutorial'],
    safetyNotes: [
      'Use your own still image or a generated image you have rights to use.',
      'Avoid copying another creator workflow screenshot as the public visual.',
    ],
    generatedImages: [],
    referenceImagePolicy:
      'This candidate is trend-led and has no downloaded reference image.',
    updatedAt: '2026-06-01',
  },
  {
    slug: 'double-exposure-city-poster-ai-prompt',
    candidateId: '2026-06-01-cand-005',
    title: 'Double Exposure City Poster AI Prompt',
    seoTitle: 'Double Exposure City Poster AI Prompt | Vogue AI',
    description:
      'Create a cinematic double-exposure poster by blending a fictional founder silhouette with city lights, product-dashboard glow, and premium launch-campaign styling.',
    sourceAuthor: 'Taaruk',
    sourceUrl: 'https://x.com/Taaruk_/status/2061011463255286216',
    sourceType: 'X prompt reference',
    sourceExcerpt:
      'Luxury double-exposure poster combining profile silhouette and city landmark.',
    assetAngle:
      'Removed celebrity and sports references; remixed into a founder/product launch poster.',
    prompt: null,
    promptSummary: [
      'Uses a fictional subject instead of a public figure.',
      'Replaces sports framing with product-launch visual language.',
      'Keeps the double-exposure structure clear and commercially reusable.',
    ],
    useCases: ['Launch poster', 'Founder visual', 'Product campaign key art'],
    safetyNotes: [
      'Do not use real celebrities or recognizable private people.',
      'Avoid real team logos, sports marks, and copied landmarks.',
    ],
    generatedImages: [],
    referenceImagePolicy:
      'Reference images are stored only in the internal social workbench.',
    updatedAt: '2026-06-01',
  },
  {
    slug: 'face-lock-street-fashion-ai-prompt',
    candidateId: '2026-06-01-cand-006',
    title: 'Face Lock Street Fashion AI Prompt',
    seoTitle: 'Face Lock Street Fashion AI Prompt | Vogue AI',
    description:
      'A consent-safe face consistency prompt for user-uploaded portraits, keeping identity stable while changing outfit, pose, lighting, and background.',
    sourceAuthor: 'AiWithTariq',
    sourceUrl: 'https://x.com/AiWithTariq/status/2061257081773297931',
    sourceType: 'X prompt reference',
    sourceExcerpt:
      'Face consistency prompt for realistic street fashion portrait.',
    assetAngle:
      'Turned into a consent-safe user-upload portrait prompt with no public figure references.',
    prompt: null,
    promptSummary: [
      'Frames face lock as an editing brief, not a magic keyword.',
      'Limits changes to outfit, pose, background, lens, and lighting.',
      'Requires user-owned reference imagery and consent-safe usage.',
    ],
    useCases: ['Portrait edit', 'Street fashion test', 'Creator avatar variant'],
    safetyNotes: [
      'Use only your own photo or an image you have permission to edit.',
      'Do not apply this to celebrities, minors, or non-consenting people.',
    ],
    generatedImages: [],
    referenceImagePolicy:
      'Reference images are stored only in the internal social workbench.',
    updatedAt: '2026-06-01',
  },
  {
    slug: 'clay-fashion-magazine-cover-ai-prompt',
    candidateId: '2026-06-01-cand-007',
    title: 'Clay Fashion Magazine Cover AI Prompt',
    seoTitle: 'Clay Fashion Magazine Cover AI Prompt | Vogue AI',
    description:
      'Create a fictional claymation fashion cover with handmade clay texture, studio lighting, clean typography space, and premium editorial hierarchy.',
    sourceAuthor: 'Zephyra Leigh',
    sourceUrl: 'https://x.com/ZephyraLeigh/status/2061252417904156810',
    sourceType: 'X prompt reference',
    sourceExcerpt:
      'Claude-written GPT Image 2 prompt for clay animation fashion cover.',
    assetAngle:
      'Avoided real magazine names and brand collisions with a fictional cover system.',
    prompt: null,
    promptSummary: [
      'Uses a fictional publication name and fictional product details.',
      'Separates clay material texture from magazine layout hierarchy.',
      'Leaves usable masthead and cover-line space.',
    ],
    useCases: ['Magazine cover', 'Claymation ad', 'Fashion concept art'],
    safetyNotes: [
      'Do not use real magazine mastheads or luxury brand logos.',
      'Keep product names and cover lines fictional unless you own the rights.',
    ],
    generatedImages: [],
    referenceImagePolicy:
      'Reference images are stored only in the internal social workbench.',
    updatedAt: '2026-06-01',
  },
  {
    slug: 'ai-brand-key-visual-poster-prompt',
    candidateId: '2026-06-01-cand-008',
    title: 'AI Brand Key Visual Poster Prompt',
    seoTitle: 'AI Brand Key Visual Poster Prompt | Vogue AI',
    description:
      'Create a fictional seasonal food-brand key visual with hero packaging, festival color, headline space, and ad-ready commercial composition.',
    sourceAuthor: '李岳',
    sourceUrl: 'https://x.com/liyue_ai/status/2061005569037877373',
    sourceType: 'X prompt reference',
    sourceExcerpt:
      'Use GPT Image 2 to generate concept key visuals for traditional food brands.',
    assetAngle:
      'Changed real seasonal food brands into a fictional snack brand and original packaging brief.',
    prompt: null,
    promptSummary: [
      'Turns a seasonal brand idea into a fictional commercial brief.',
      'Specifies product, packaging, atmosphere, and headline space.',
      'Keeps the result usable for ad mockups and Pinterest visuals.',
    ],
    useCases: ['Food ad poster', 'Brand key visual', 'Seasonal campaign mockup'],
    safetyNotes: [
      'Use fictional brand names unless you own the brand assets.',
      'Do not copy real packaging, logos, or regional brand identifiers.',
    ],
    generatedImages: [],
    referenceImagePolicy:
      'Reference images are stored only in the internal social workbench.',
    updatedAt: '2026-06-01',
  },
];

export function getSocialPromptPageBySlug(slug: string) {
  return SOCIAL_PROMPT_PAGE_ENTRIES.find((entry) => entry.slug === slug) ?? null;
}
