type PromptTaxonomyEntry = {
  id: string;
  title: string;
  prompt: string;
  description?: string;
  modelId?: string;
};

export const VOGUE_PROMPT_CATEGORY_KEYS = [
  'all',
  'product',
  'poster',
  'avatar',
  'ui',
  'diagram',
  'anime',
  'photo',
  'art',
  'epic',
] as const;

export type VoguePromptCategoryKey =
  (typeof VOGUE_PROMPT_CATEGORY_KEYS)[number];

export type VoguePromptConcreteCategoryKey = Exclude<
  VoguePromptCategoryKey,
  'all'
>;

export const VOGUE_PROMPT_CATEGORY_DEFINITIONS: Array<{
  key: VoguePromptCategoryKey;
  keywords: string[];
}> = [
  {
    key: 'all',
    keywords: [],
  },
  {
    key: 'product',
    keywords: [
      'product',
      'ecommerce',
      'e-commerce',
      'skincare',
      'packaging',
      'brand',
      'brand icon',
      'icon collection',
      'merch',
      'commercial',
      'advertisement',
      'ad creative',
      'appliance',
      'bottle',
      'perfume',
      'watch',
      'juice',
      'food',
      'fried chicken',
      'toy',
      'vinyl toy',
      'logo',
      'shopify',
      'amazon',
    ],
  },
  {
    key: 'poster',
    keywords: [
      'poster',
      'flyer',
      'thumbnail',
      'wallpaper',
      'cover',
      'promo',
      'announcement',
      'movie poster',
      'event poster',
      'key visual',
      'campaign',
      'postage stamp',
    ],
  },
  {
    key: 'avatar',
    keywords: [
      'portrait',
      'selfie',
      'avatar',
      'idol',
      'headshot',
      'homewear',
      'fashion portrait',
      'beauty portrait',
      'editorial portrait',
      'identity reference',
    ],
  },
  {
    key: 'ui',
    keywords: [
      'screenshot',
      'ui',
      'homepage',
      'landing page',
      'webpage',
      'dashboard',
      'website',
      'app',
      'mockup',
      'profile page',
      'x post',
      'social media feed',
      'screen',
      'livestream',
      'live stream',
      'interface',
    ],
  },
  {
    key: 'diagram',
    keywords: [
      'infographic',
      'diagram',
      'labeled',
      'blueprint',
      'chart',
      'map',
      'notes',
      'worksheet',
      'question answer',
      'exam',
      'educational',
      'dieline',
      'journal',
      'travel route',
      'route map',
      'travel diary',
      'slide',
      'technical',
      'guide',
      'manual',
      'process',
      'breakdown',
      'storyboard',
      'sequence sheet',
      '2x2 grid',
      '4-column',
      '5-row grid',
      'grid',
      'reference style',
      'design board',
      'character board',
      'style guide',
    ],
  },
  {
    key: 'anime',
    keywords: [
      'anime',
      'manga',
      'comic',
      'cosplayer',
      'game character',
      'chibi',
      'ghibli',
      'pixar',
      'k-pop',
      'kpop',
    ],
  },
  {
    key: 'photo',
    keywords: [
      'photo',
      'photography',
      'photorealistic',
      'iphone',
      'raw',
      '35mm',
      'film',
      'snapshot',
      'cinematic',
      'dslr',
      'studio lighting',
      'documentary',
      'realistic',
      'ultra-realistic',
    ],
  },
  {
    key: 'art',
    keywords: [
      'illustration',
      'art print',
      'ornament',
      'print',
      'engraving',
      'engraved',
      'collage',
      'magazine',
      'gongbi',
      'peony',
      'mandarin ducks',
      'botanical',
      'peacock',
      'crane',
      'chrysanthemum',
      'coloring book',
      'vector',
      'crayon',
      'doodle',
      'painting',
      'silk',
      'relief',
      'landscape',
      'watercolor',
      'paper cut',
      'paper-cut',
      'abstract',
    ],
  },
  {
    key: 'epic',
    keywords: [
      'epic portrait',
      'epic narrative',
      'silhouette',
      'myth',
      'legend',
      'dynasty',
      'graduation memory',
      'collectible epic',
    ],
  },
];

const VOGUE_PROMPT_CATEGORY_TIE_BREAK_ORDER: VoguePromptConcreteCategoryKey[] = [
  'ui',
  'diagram',
  'product',
  'poster',
  'epic',
  'art',
  'anime',
  'avatar',
  'photo',
];

const VOGUE_PROMPT_DEFAULT_CATEGORY: VoguePromptConcreteCategoryKey = 'photo';

const getStrongTitleCategory = (
  entry: PromptTaxonomyEntry
): VoguePromptConcreteCategoryKey | null => {
  const title = entry.title.toLowerCase();

  if (
    /\b(ui|dashboard|website|homepage|landing page|webpage|screenshot|x post|profile page|social media feed|livestream|live stream|interface)\b/.test(title)
  ) {
    return 'ui';
  }

  if (
    /\b(infographic|diagram|grid|storyboard|character sheet|design sheet|reference sheet|blueprint|map|atlas|calendar|chart|dieline|timeline|cutaway|breakdown)\b/.test(title)
  ) {
    return 'diagram';
  }

  if (
    /\b(product|packaging|logo|brand|campaign|ad|advertising|commercial|ecommerce|e-commerce|t-shirt|sneaker|food|cosmetic|perfume|bottle)\b/.test(title)
  ) {
    return 'product';
  }

  if (/\b(anime|manga|ghibli|cosplayer|cosplay|k-pop|kpop)\b/.test(title)) {
    return 'anime';
  }

  if (/\b(poster|thumbnail|cover|wallpaper|flyer|postage stamp|stamp)\b/.test(title)) {
    return 'poster';
  }

  if (
    /\b(illustration|artwork|watercolor|painting|doodle|crayon|engraving|engraved|vector|collage|paper cut|paper-cut|botanical)\b/.test(title)
  ) {
    return 'art';
  }

  return null;
};

const metadataOverrides: Record<
  string,
  {
    title?: string;
    categoryKey?: VoguePromptConcreteCategoryKey;
  }
> = {
  'x-2055485138080014769': {
    title: 'Flagship Smartphone Infographic',
    categoryKey: 'diagram',
  },
  'x-2055511800834334829': {
    title: 'Stylized Anime Character Illustration',
    categoryKey: 'anime',
  },
  'x-2055507450170835295': {
    title: 'Grotesque Fashion Caricature',
    categoryKey: 'art',
  },
  'x-2055493256092561816': {
    title: 'Identity-Preserved Editorial Portrait',
    categoryKey: 'avatar',
  },
  'x-2055091040147603647': {
    title: 'Anti-Gravity Drive Infographic',
    categoryKey: 'diagram',
  },
  'x-2055036470583263712': {
    title: 'Emotional Expression Grid',
    categoryKey: 'diagram',
  },
  'x-2055073221477834803': {
    title: 'Geometric Cubist Caricature Portrait',
    categoryKey: 'art',
  },
  'x-2054895030582862295': {
    title: 'Luxury Fashion Collage Ad',
    categoryKey: 'product',
  },
  'x-2054942313781313621': {
    title: 'Erling Haaland PS1 Game Cover',
    categoryKey: 'poster',
  },
  'x-2054959927643476123': {
    title: 'Stealth Vegetable Recipe Poster',
    categoryKey: 'diagram',
  },
  'x-2054985505230438836': {
    title: 'Colored-Pencil Identity Portrait',
    categoryKey: 'avatar',
  },
  'x-2054038998453244175': {
    title: 'Cinematic Character Design Board',
    categoryKey: 'diagram',
  },
  'x-2054089860701733058': {
    title: 'Sci-Fi Character Development Board',
    categoryKey: 'diagram',
  },
  'x-2054202646618407231': {
    title: 'Healthy Breakfast Ad Poster',
    categoryKey: 'product',
  },
  'x-2053861275503890861': {
    title: 'Virgo Zodiac Poster',
    categoryKey: 'poster',
  },
  'x-2053693605148336137': {
    title: 'Crayon Style Portrait',
    categoryKey: 'art',
  },
  'x-2046176145075515600-r3-youtube-thumbnail-vtuber-chat-stream-thumbnail': {
    title: 'VTuber Chat Stream Thumbnail',
    categoryKey: 'poster',
  },
  'x-2044802802149650631-r2-product-marketing-18-panel-mascot-brand-identity-document': {
    title: 'Mascot Brand Identity Board',
    categoryKey: 'product',
  },
  'x-2057774955241128419': {
    title: 'Pastel Coquette Studio Portrait',
    categoryKey: 'avatar',
  },
  'x-2057787675298476353': {
    title: 'Pastel Angel Wing Portrait',
    categoryKey: 'avatar',
  },
  'x-2057871529145139378': {
    title: 'Floating Swimsuit Fashion Portrait',
    categoryKey: 'avatar',
  },
  'x-2057141299644620886': {
    title: 'Celebrity Biometric Portrait',
    categoryKey: 'avatar',
  },
  'x-2057236063576326259': {
    title: 'Billie Eilish Likeness Portrait',
    categoryKey: 'avatar',
  },
  'x-2056523538077753455': {
    title: 'Punjabi Village Lifestyle Portrait',
    categoryKey: 'photo',
  },
  'x-2057652843277165024': {
    title: 'Commercial Food Splash Ad',
    categoryKey: 'product',
  },
  'x-2055491388310237685': {
    title: 'Adidas Running Shoe Campaign',
    categoryKey: 'product',
  },
  'x-2054139543423492547': {
    title: 'Product Category Campaign Poster',
    categoryKey: 'product',
  },
  'x-2047218442030166086-r1-product-marketing-openai-merch-poster-grid': {
    title: 'OpenAI Merch Product Campaign',
    categoryKey: 'product',
  },
  'x-2047008188285792724-e-commerce-main-image-3d-product-box-dieline-visualization': {
    title: 'E-Commerce 3D Product Box Main Image',
    categoryKey: 'product',
  },
  'x-2053843881553502219': {
    title: 'Cinematic Character Design Sheet',
    categoryKey: 'diagram',
  },
  'x-2054001359649906715': {
    title: 'Universe History Calendar Infographic',
    categoryKey: 'diagram',
  },
  'x-2053752582515122358': {
    title: 'World Monuments Infographic Poster',
    categoryKey: 'diagram',
  },
  'x-2053791622702432453': {
    title: 'Cinematic Atlas Visualization',
    categoryKey: 'diagram',
  },
  'x-2053948918782971994': {
    title: 'Cinematic Storyboard Sheet',
    categoryKey: 'diagram',
  },
  'x-2055493824227532906': {
    title: 'Photorealistic Ghibli Movie Poster',
    categoryKey: 'anime',
  },
  'x-2055486388145893605': {
    title: 'Ghibli-Inspired Anime Portrait Poster',
    categoryKey: 'anime',
  },
  'x-2054097062346821680': {
    title: 'Cancer Zodiac Poster',
    categoryKey: 'poster',
  },
  'x-2055506404455374935': {
    title: 'Minimalist Storybook Illustration',
    categoryKey: 'art',
  },
  'x-2053822435062141367': {
    title: 'Dubai Travel Poster Collage',
    categoryKey: 'poster',
  },
  'x-2055473321035399313': {
    title: 'Streetwear Editorial Poster',
    categoryKey: 'poster',
  },
  'x-2054054476429009086': {
    title: 'Beige Fashion Poster Collage',
    categoryKey: 'poster',
  },
  'x-2056702911305183536': {
    title: 'Extruded Comic Font Poster',
    categoryKey: 'poster',
  },
  'x-2057680450743927225': {
    title: 'Lake Como Garden Bench Portrait',
    categoryKey: 'avatar',
  },
  'x-2056736787624874489': {
    title: 'Branded Flower Packaging Designs',
    categoryKey: 'product',
  },
  'x-2054067438770348059': {
    title: 'Outdoor Gear Infographic',
    categoryKey: 'diagram',
  },
  'x-2054173645258510352': {
    title: 'Cat Cooking Storyboard Sheet',
    categoryKey: 'diagram',
  },
  'x-2054015202098839660': {
    title: 'Vintage Travel Stamp Illustration',
    categoryKey: 'poster',
  },
  'x-2054196121980002523': {
    title: 'Swiss Modernist Travel Poster',
    categoryKey: 'poster',
  },
  'x-2054068032226656326': {
    title: 'Cinematic Reference Portrait',
    categoryKey: 'avatar',
  },
  'x-2054074888512807237': {
    title: 'Ethereal Studio Portrait',
    categoryKey: 'photo',
  },
  'x-2054118230726447333': {
    title: 'Neo-Romantic Character Artwork',
    categoryKey: 'art',
  },
  'x-2054116116109422706': {
    title: 'High-Fashion Editorial Portrait',
    categoryKey: 'avatar',
  },
  'x-2054029294381502779': {
    title: 'Natural Korean Idol Portrait',
    categoryKey: 'avatar',
  },
  'x-2054059099864887415': {
    title: 'Ugly Doodle Portrait',
    categoryKey: 'art',
  },
  'x-2054055909912084962': {
    title: 'Identity-Anchored Portrait Study',
    categoryKey: 'avatar',
  },
  'x-2054012568650309959': {
    title: 'Nightclub Bar Conversation Photo',
    categoryKey: 'photo',
  },
  'x-2054151000181674281': {
    title: 'VIP Lounge Whisper Photo',
    categoryKey: 'photo',
  },
  'x-2057654938109366618': {
    title: 'Spacebugs Version Comparison',
    categoryKey: 'diagram',
  },
  'x-2053441934371229719': {
    title: 'Japanese Logo Design Variations',
    categoryKey: 'product',
  },
  'x-2057819460086460605': {
    title: 'Roller-Skating Flamingo Illustration',
    categoryKey: 'art',
  },
  'x-2024899363772739861': {
    title: 'Glass Sports Logo Render',
    categoryKey: 'product',
  },
  'x-2021638376193994875': {
    title: 'Plasticine Pop Culture Object Render',
    categoryKey: 'art',
  },
  'x-2061346154642805147': {
    title: 'Luxury Country Travel Portal Poster',
    categoryKey: 'poster',
  },
  'x-2061440881685680521': {
    title: 'Negative-Space Optical Illusion Poster',
    categoryKey: 'poster',
  },
  'x-2061328524821365211': {
    title: 'Moss-Textured Brand Logo Artifact',
    categoryKey: 'product',
  },
  'x-2061402388079038497': {
    title: 'Astronaut Cat Style Reference',
    categoryKey: 'photo',
  },
  'x-2061357185678881068': {
    title: 'Bane Character Style Reference',
    categoryKey: 'photo',
  },
  'x-2061373514276651047': {
    title: 'Balcony Iced Coffee Lifestyle Portrait',
    categoryKey: 'photo',
  },
  'x-2061402388079038497-nano-banana': {
    title: 'Photorealistic Astronaut Cat Edit',
    categoryKey: 'photo',
  },
  'x-2061289055565062313': {
    title: 'Moody Whiskey Lounge Portrait',
    categoryKey: 'photo',
  },
  'x-2061103821305356445': {
    title: 'Monochrome Editorial Smile Portrait',
    categoryKey: 'photo',
  },
  'x-2061071716500300220': {
    title: 'Whimsical Character Illustration Sheet',
    categoryKey: 'diagram',
  },
  'x-2060269923826348215': {
    title: 'Glass and Paper Pac-Man Ghost Styles',
    categoryKey: 'photo',
  },
  'x-2061424768038187138': {
    title: 'Streetwear Product Catalog Layout',
    categoryKey: 'product',
  },
  'x-2061415416765788585': {
    title: 'Kael Character Sheet',
    categoryKey: 'diagram',
  },
  'x-2061419533190181095': {
    title: 'Black-and-White Engraved Portrait',
    categoryKey: 'art',
  },
  'x-2061358875539079244': {
    title: 'Overhead Studio Fashion Portrait',
    categoryKey: 'photo',
  },
  'x-2058565306323550580': {
    title: 'Playful Gaming Couch Portrait',
    categoryKey: 'photo',
  },
  'x-2059907675123511485': {
    title: 'UFO Style Reference Poster',
    categoryKey: 'diagram',
  },
  'x-2061290699224387653': {
    title: 'Vogue Magazine Fashion Grid Collage',
    categoryKey: 'diagram',
  },
  'x-2061388564303380815': {
    title: 'Science Projection Close-Up Portrait',
    categoryKey: 'photo',
  },
  'x-2061421399043092885': {
    title: 'Spy Thriller Character Board',
    categoryKey: 'photo',
  },
  'x-2061450776925585435': {
    title: 'Modern Juice Ad Poster',
    categoryKey: 'product',
  },
  'x-2061402223419269277': {
    title: 'Kawaii Cafe Friends Illustration',
    categoryKey: 'art',
  },
  'x-2061368984944201957': {
    title: 'Red Editorial Digital Collage',
    categoryKey: 'art',
  },
  'x-2061342540176167002': {
    title: 'Futuristic Sportswear Editorial Poster',
    categoryKey: 'poster',
  },
  'x-2061384949266309409': {
    title: 'Floating Profile Card Close-Up Photo',
    categoryKey: 'photo',
  },
  'x-2061289299060924451': {
    title: 'Layered Fashion Collage Poster',
    categoryKey: 'poster',
  },
  'x-2061426838434398461': {
    title: 'Solar System Vertical Infographic',
    categoryKey: 'diagram',
  },
  'x-2061359665053872163': {
    title: 'Luxury Fashion Lookbook Grid',
    categoryKey: 'diagram',
  },
  'x-2061310711800967395': {
    title: 'Renaissance Character Sheet',
    categoryKey: 'diagram',
  },
  'x-2061305471492096301': {
    title: 'Mixed-Media Championship Sports Poster',
    categoryKey: 'poster',
  },
  'x-2061335069730726389': {
    title: 'Female Football Double-Exposure Poster',
    categoryKey: 'poster',
  },
  'x-2061421488188932217': {
    title: 'Dark Luxury Gothic Magazine Cover',
    categoryKey: 'poster',
  },
  'x-2061439592549466615': {
    title: 'Golden Window Cinematic Portrait',
    categoryKey: 'photo',
  },
  'x-2061383887801155647': {
    title: 'Rainbow Wax Typography Render',
    categoryKey: 'photo',
  },
  'x-2061370516762776013': {
    title: 'Sprite Splash Jumping Fashion Photo',
    categoryKey: 'photo',
  },
  'x-2061425365197746295': {
    title: 'Deep-Focus Indoor Fashion Photo',
    categoryKey: 'photo',
  },
  'x-2061434976755986561': {
    title: 'Deep-Focus Blonde Fashion Photo',
    categoryKey: 'photo',
  },
  'x-2061322298909732998': {
    title: 'Creator Funnel Prompt Slide',
    categoryKey: 'diagram',
  },
  'x-2061332108967293372': {
    title: 'Human and Pet Face Close-Up',
    categoryKey: 'photo',
  },
  'x-2061440508497637649': {
    title: 'Retro-Futuristic Character Children',
    categoryKey: 'photo',
  },
  'x-2061086983900815644': {
    title: 'Cricketer Balcony Landscape Illustration',
    categoryKey: 'art',
  },
  'x-2061133532387254571': {
    title: 'Orange Studio Profile Portrait',
    categoryKey: 'avatar',
  },
  'x-2061227005195006118': {
    title: 'Tennis Career Portrait Infographic',
    categoryKey: 'avatar',
  },
  'x-2061040008937582812': {
    title: 'Japanese Optimus Prime Movie Poster',
    categoryKey: 'poster',
  },
  'x-2061085293944467746': {
    title: 'Yorkshire Terrier Style Reference',
    categoryKey: 'photo',
  },
  'x-2060360526870298989': {
    title: 'TIE Fighter Style Reference',
    categoryKey: 'photo',
  },
  'x-2059866378362843608': {
    title: 'Polaroid Chihuahua Style Reference',
    categoryKey: 'photo',
  },
  'x-2059907805331460232': {
    title: 'Polaroid Chihuahua Style Reference',
    categoryKey: 'diagram',
  },
  'x-2059228072264544389': {
    title: 'Pac-Man Style Reference',
    categoryKey: 'photo',
  },
  'x-2059273353228157181': {
    title: 'Xenomorph Style Reference',
    categoryKey: 'photo',
  },
  'x-2058820373274058884': {
    title: 'Pac-Man Style Reference',
    categoryKey: 'photo',
  },
};

const phraseTitleOverrides: Array<[RegExp, string]> = [
  [/flagship smartphone/i, 'Flagship Smartphone Infographic'],
  [/born to be golden at the end of an era/i, 'Golden Era Fashion Portrait'],
  [/anti-?gravity drive/i, 'Anti-Gravity Drive Infographic'],
  [/anime character/i, 'Stylized Anime Character Illustration'],
  [/character design board/i, 'Cinematic Character Design Board'],
  [/character development board/i, 'Character Development Board'],
  [/storyboard sheet/i, 'Cinematic Storyboard Sheet'],
  [/survival thriller storyboard/i, 'Winter Survival Thriller Storyboard'],
  [/postage stamp/i, 'Vintage Travel Stamp Illustration'],
  [/swiss modernist typography/i, 'Swiss Modernist Travel Poster'],
  [/high-fashion editorial portrait/i, 'High-Fashion Editorial Portrait'],
  [/colored-pencil illustration/i, 'Colored-Pencil Portrait'],
  [/fashion caricature/i, 'Fashion Caricature Sketch'],
  [/recipe poster/i, 'Recipe Infographic Poster'],
  [/realistic lego style minifigure/i, 'Realistic LEGO Minifigure Portrait'],
  [/y2k cyber-pop room/i, 'Y2K Cyber-Pop Editorial Portrait'],
  [/cancer zodiac/i, 'Cancer Zodiac Poster'],
  [/virgo.*create a poster/i, 'Virgo Zodiac Poster'],
  [/whole image into crayon style/i, 'Crayon Style Portrait'],
  [/product page/i, 'Product Page Mockup'],
  [/landing page/i, 'Landing Page Mockup'],
  [/dashboard/i, 'Dashboard UI Concept'],
  [/travel guide/i, 'Travel Guide Layout'],
];

const titleFillerPatterns = [
  /^create\s+/i,
  /^chatgpt\s+/i,
  /^image\s+generation\s+/i,
  /^type\s+image\s+/i,
  /^turn\s+(this|the|person|uploaded)?\s*/i,
  /^use\s+uploaded\s+(photo|portrait|reference image)\s+(as|only as)?\s*/i,
  /^use\s+(user\s+)?uploaded\s+image\s+as\s+(only\s+)?/i,
  /^prompt\s+(is\s+)?/i,
  /^image\s+prompt\s+/i,
  /^promptshare\s+/i,
  /^mpt\s+share\s+/i,
  /^midjourney\s+/i,
  /^do\s+this\s+(for\s+)?/i,
  /^please\s+/i,
  /^objective\s+/i,
  /^function\s+render\s+/i,
  /^style\s+/i,
  /^aspect\s+ratio\s+[0-9:]+\s+/i,
  /^subject\s+/i,
  /^image\s+prompt\s+data\s+/i,
  /^data\s+subject\s+/i,
  /^vs\s+midjourney\s+v\d+(\s+\d+)?\s+/i,
  /^exploring\s+style\s+/i,
  /^share\s+midjourney\s+v?[\d.]*\s+/i,
  /^try\s+this\s+one\s+midjourney\s+v?[\d.]*\s+/i,
];

const stopWordsAtEnd = new Set([
  'using',
  'with',
  'as',
  'into',
  'from',
  'for',
  'and',
  'the',
  'featuring',
  'based',
  'same',
  'background',
  'color',
  'main',
  'description',
]);

const escapeCategoryKeyword = (keyword: string) =>
  keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const matchesCategoryKeyword = (haystack: string, keyword: string) => {
  if (keyword.length <= 3 && /^[a-z0-9]+$/i.test(keyword)) {
    return new RegExp(
      `(^|[^a-z0-9])${escapeCategoryKeyword(keyword)}($|[^a-z0-9])`,
      'i'
    ).test(haystack);
  }

  return haystack.includes(keyword);
};

const getCategoryScore = (
  entry: PromptTaxonomyEntry,
  category: VoguePromptConcreteCategoryKey
) => {
  const definition = VOGUE_PROMPT_CATEGORY_DEFINITIONS.find(
    (item) => item.key === category
  );
  if (!definition) return 0;

  const priorityText = `${entry.id} ${entry.title}`.toLowerCase();
  const searchText = `${priorityText} ${entry.description ?? ''} ${entry.prompt}`.toLowerCase();

  return definition.keywords.reduce((score, keyword) => {
    if (matchesCategoryKeyword(priorityText, keyword)) {
      return score + 4;
    }

    if (matchesCategoryKeyword(searchText, keyword)) {
      return score + 1;
    }

    return score;
  }, 0);
};

export const getVoguePromptCategoryKey = (
  entry: PromptTaxonomyEntry
): VoguePromptConcreteCategoryKey => {
  const override = metadataOverrides[entry.id]?.categoryKey;
  if (override) return override;

  const strongTitleCategory = getStrongTitleCategory(entry);
  if (strongTitleCategory) return strongTitleCategory;

  const rankedCategories = VOGUE_PROMPT_CATEGORY_TIE_BREAK_ORDER.map(
    (category) => ({
      category,
      score: getCategoryScore(entry, category),
    })
  )
    .filter(({ score }) => score > 0)
    .sort((left, right) => {
      if (right.score !== left.score) return right.score - left.score;

      return (
        VOGUE_PROMPT_CATEGORY_TIE_BREAK_ORDER.indexOf(left.category) -
        VOGUE_PROMPT_CATEGORY_TIE_BREAK_ORDER.indexOf(right.category)
      );
    });

  return rankedCategories[0]?.category ?? VOGUE_PROMPT_DEFAULT_CATEGORY;
};

const normalizeTitleToken = (token: string) => {
  const lower = token.toLowerCase();
  const fixed: Record<string, string> = {
    ai: 'AI',
    gpt: 'GPT',
    ui: 'UI',
    ux: 'UX',
    saas: 'SaaS',
    api: 'API',
    ps1: 'PS1',
    '3d': '3D',
    y2k: 'Y2K',
    lego: 'LEGO',
    kpop: 'K-Pop',
    iphone: 'iPhone',
    youtube: 'YouTube',
    tiktok: 'TikTok',
    shopify: 'Shopify',
    midjourney: 'Midjourney',
    chatgpt: 'ChatGPT',
    pacman: 'Pac-Man',
    'pac-man': 'Pac-Man',
    sref: 'SREF',
    dna: 'DNA',
    ufo: 'UFO',
    ue5: 'UE5',
    vtuber: 'VTuber',
  };

  if (/^\d+k$/i.test(token)) return token.toUpperCase();
  if (fixed[lower]) return fixed[lower];

  if (/^[a-z][a-z'’]+$/i.test(token)) {
    return `${token.charAt(0).toUpperCase()}${token.slice(1).toLowerCase()}`;
  }

  if (/^[a-z][a-z'’]+-[a-z][a-z'’]+$/i.test(token)) {
    return token
      .split('-')
      .map(
        (part) => `${part.charAt(0).toUpperCase()}${part.slice(1).toLowerCase()}`
      )
      .join('-');
  }

  return token;
};

const titleCase = (title: string) =>
  title
    .split(/\s+/)
    .filter(Boolean)
    .map((token) => normalizeTitleToken(token))
    .join(' ');

const compactTitle = (title: string) => {
  const words = title.split(/\s+/).filter(Boolean);
  while (
    words.length > 8 ||
    stopWordsAtEnd.has((words[words.length - 1] ?? '').toLowerCase())
  ) {
    words.pop();
  }

  return words.join(' ');
};

const cleanTitleCandidate = (title: string) => {
  let nextTitle = title
    .replace(/&amp;/gi, ' and ')
    .replace(/&/g, ' and ')
    .replace(/[-_]+/g, ' ')
    .replace(/\bnano\s*banana\s+org\s+\d+\b/gi, ' ')
    .replace(/\bnanobanana\s+org\s+\d+\b/gi, ' ')
    .replace(/\b(\d+)\s+(\d+)\b/g, '$1:$2')
    .replace(/\bclose up\b/gi, 'close-up')
    .replace(/\bnight time\b/gi, 'night-time')
    .replace(/\bhigh end\b/gi, 'high-end')
    .replace(/\bk pop\b/gi, 'K-Pop')
    .replace(/\bpac man\b/gi, 'Pac-Man')
    .replace(/\bgpt image\b/gi, 'GPT Image')
    .replace(/\bgptimage\b/gi, 'GPT Image')
    .replace(/\bchatgptapp\b/gi, 'ChatGPT App')
    .replace(/^[1-9]\s+(?=[A-Za-z])/g, '')
    .replace(/\b(prompt|promptshare|sref|ar|sv|sw|stylize|hd|raw)\b/gi, '')
    .replace(/\bv\d+(\.\d+)?\b/gi, '')
    .replace(/\bmidjourney\s+\d+(\.\d+)?\b/gi, '')
    .replace(/\bmidjourney\b/gi, '')
    .replace(/\b\d{6,12}\b/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  for (const pattern of titleFillerPatterns) {
    nextTitle = nextTitle.replace(pattern, '').trim();
  }

  if (!/\bstyle reference\b/i.test(nextTitle)) {
    nextTitle = nextTitle
      .replace(/\b(subject|description|parameters|demographics|identity|name|enter name|referance|reference)\b.*$/i, '')
      .trim();
  }

  return compactTitle(titleCase(nextTitle));
};

const getJsonStringField = (text: string, field: string) => {
  const match = new RegExp(
    `["']${field}["']\\s*:\\s*["']([^"']{3,100})["']`,
    'i'
  ).exec(text);

  return match?.[1]?.trim() ?? null;
};

const withCategorySuffix = (
  title: string,
  categoryKey: VoguePromptConcreteCategoryKey
) => {
  if (/\b(poster|cover|portrait|photo|photograph|infographic|diagram|mockup|ui|illustration|artwork|storyboard|collage|logo|ad)\b/i.test(title)) {
    return title;
  }

  const suffixByCategory: Partial<Record<VoguePromptConcreteCategoryKey, string>> = {
    poster: 'Poster',
    avatar: 'Portrait',
    ui: 'UI Mockup',
    diagram: 'Infographic',
    anime: 'Anime Illustration',
    product: 'Product Visual',
    art: 'Illustration',
    epic: 'Epic Scene',
    photo: 'Photo',
  };

  return `${title} ${suffixByCategory[categoryKey] ?? 'Visual'}`;
};

const normalizePromptCandidate = (candidate: string) =>
  cleanTitleCandidate(
    candidate
      .replace(/#\w+/g, ' ')
      .replace(/--[a-z]+(?:\s+[\w.:/-]+)?/gi, ' ')
      .replace(/\b(prompt\s+share|enjoy and share|hot prompt in comments?)\b.*$/i, ' ')
      .replace(/\s+with\s+midjourney.*$/i, ' ')
      .replace(/\s+in\s+midjourney.*$/i, ' ')
      .replace(/[{}[\]"“”]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
  );

const getMidjourneyPromptTitle = (entry: PromptTaxonomyEntry) => {
  const prompt = entry.prompt.replace(/\s+/g, ' ').trim();

  const bracketPromptSubject = /\[prompt\]\s*([^-[\]]{3,90}?)(?:\s+--|$)/i.exec(prompt)?.[1];
  if (bracketPromptSubject) return normalizePromptCandidate(bracketPromptSubject);

  if (/^sref\s+\d+/i.test(prompt) && /\[prompt\]\s+--sref/i.test(prompt)) {
    return 'Style Reference Code';
  }

  const leadingPromptSubject = /^([^:–—]{3,90}?)(?:\s+--|$)/i.exec(prompt)?.[1];
  if (
    leadingPromptSubject &&
    !/\b(midjourney|prompt\s*share|styles?|sref|code)\b/i.test(leadingPromptSubject)
  ) {
    const normalizedLeadingSubject = normalizePromptCandidate(leadingPromptSubject);
    if (/[a-z]{3,}/i.test(normalizedLeadingSubject)) {
      return normalizedLeadingSubject;
    }
  }

  const srefDescription = /sref\s+\d+.*?sref code\.\s*([^–—.]{4,90}?\b(?:illustration|portrait|poster|scene|style|artwork|design|landscape|photograph)\b[^–—.]*)\./i.exec(prompt)?.[1];
  if (srefDescription) return normalizePromptCandidate(srefDescription);

  const promptShareSubject = /(?:prompt\s*share|promptshare)\s+(.+?)(?:\s+--|$)/i.exec(prompt)?.[1];
  if (promptShareSubject) return normalizePromptCandidate(promptShareSubject);

  const promptsSubject = /\bprompts?\s+(.+?)(?:\s+--|$)/i.exec(prompt)?.[1];
  if (promptsSubject) return normalizePromptCandidate(promptsSubject);

  const exploringSubject = /exploring\s+style\s+--sref\s+\d+\s+(.+?)(?:\s+in\s+midjourney|\s+midjourney|\s+--|$)/i.exec(prompt)?.[1];
  if (exploringSubject) return normalizePromptCandidate(exploringSubject);

  if (/whimsical illustration.*grid of stylized/i.test(prompt)) {
    return 'Whimsical Stylized Cat Grid';
  }

  const srefSubject = /--sref\s+\d+\s+(.+?)(?:\s+--|$)/i.exec(prompt)?.[1];
  if (srefSubject) {
    const normalizedSrefSubject = normalizePromptCandidate(srefSubject);
    if (/[a-z]{3,}/i.test(normalizedSrefSubject)) {
      return normalizedSrefSubject;
    }
  }

  if (/^sref\s+\d+/i.test(prompt) || /\bsref code\b/i.test(prompt)) {
    return 'Style Reference Code';
  }

  return null;
};

const getStructuredPromptTitle = (entry: PromptTaxonomyEntry) => {
  const sourceText = entry.prompt.replace(/\s+/g, ' ').trim();
  const categoryKey = getVoguePromptCategoryKey(entry);
  const explicitTitle = getJsonStringField(sourceText, 'title');
  if (explicitTitle && !/[^\x00-\x7F]/.test(explicitTitle) && !/^\d+\s/.test(explicitTitle)) {
    return withCategorySuffix(cleanTitleCandidate(explicitTitle), categoryKey);
  }

  const styleTitle =
    getJsonStringField(sourceText, 'style') ??
    getJsonStringField(sourceText, 'aesthetic') ??
    getJsonStringField(sourceText, 'camera_style');
  if (
    styleTitle &&
    /\b(portrait|photo|photography|illustration|poster|ad|mockup|product|lifestyle|cinematic|anime|comic|collage)\b/i.test(styleTitle)
  ) {
    return withCategorySuffix(cleanTitleCandidate(styleTitle), categoryKey);
  }

  if (/2x2\s+grid.*coffee bean sculpture/i.test(sourceText)) {
    return 'Coffee Bean Sculpture Grid';
  }

  if (/2x2\s+grid.*famous human achievements/i.test(sourceText)) {
    return 'Historical Achievement Sculpture Grid';
  }

  if (/2x2\s+grid.*everyday objects/i.test(sourceText)) {
    return 'Everyday Object Evolution Grid';
  }

  if (/2x2\s+grid.*complex machines/i.test(sourceText)) {
    return 'Complex Machine Cutaway Grid';
  }

  if (/4-column,\s*5-row grid of 20 close-up portrait/i.test(sourceText)) {
    return 'Expression Reference Portrait Grid';
  }

  const studioTitle = /^studio:\s*([^,]{3,60})/i.exec(sourceText)?.[1];
  if (studioTitle) {
    return `${cleanTitleCandidate(
      studioTitle
        .replace(/\s+(with|in)\s+midjourney.*$/i, '')
        .replace(/\s+\[.*$/i, '')
    )} Studio`;
  }

  const createTarget = /create\s+(?:an?|the)?\s*(?:highly detailed|ultra detailed|premium|minimalist|original|vertical|dreamy)?\s*([^.,:]{6,90}?\b(?:poster|portrait|infographic|storyboard|collage|logo|illustration|ad|mockup|photo|photograph|thumbnail|cover)\b)/i.exec(sourceText)?.[1];
  if (createTarget) return normalizePromptCandidate(createTarget);

  const transformTarget = /(?:transform|turn)\s+.+?\s+into\s+(?:an?|the)?\s*([^.,:]{6,90}?\b(?:portrait|poster|illustration|photo|collage|minifigure|toy|logo|artwork)\b)/i.exec(sourceText)?.[1];
  if (transformTarget) return normalizePromptCandidate(transformTarget);

  return null;
};

export const getVoguePromptDisplayTitle = (entry: PromptTaxonomyEntry) => {
  const explicitOverride = metadataOverrides[entry.id]?.title;
  if (explicitOverride) return explicitOverride;

  const sourceText = `${entry.prompt} ${entry.title}`;
  const phraseOverride = phraseTitleOverrides.find(([pattern]) =>
    pattern.test(sourceText)
  )?.[1];
  if (phraseOverride) return phraseOverride;

  const promptDerivedTitle =
    entry.modelId === 'midjourney'
      ? getMidjourneyPromptTitle(entry) ?? getStructuredPromptTitle(entry)
      : getStructuredPromptTitle(entry);
  if (promptDerivedTitle) return promptDerivedTitle;

  const cleanedTitle = cleanTitleCandidate(entry.title);

  return cleanedTitle || titleCase(entry.title);
};
