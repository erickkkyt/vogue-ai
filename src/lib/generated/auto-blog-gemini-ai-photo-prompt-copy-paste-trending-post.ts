import type { BlogContentBlock, BlogPostSource } from '@/lib/blog-data';

const promptImages = {
  overview:
    'https://media.vogueai.net/blog/auto/gemini-ai-photo-prompt-copy-paste-trending/841c91644416-nanobanana-org-1434-sadie-sink-ice-cream-at-tennis-court-1.jpg',
  portrait:
    'https://media.vogueai.net/blog/auto/gemini-ai-photo-prompt-copy-paste-trending/14dbc1d84665-create-4-5-ultra-realistic-cinematic-studio-1.jpg',
  street:
    'https://media.vogueai.net/blog/auto/gemini-ai-photo-prompt-copy-paste-trending/c220cdb564fb-candid-airport-street-style-portrait-young-woman-1.jpg',
  product:
    'https://media.vogueai.net/blog/auto/gemini-ai-photo-prompt-copy-paste-trending/5f6f232484f0-generation-request-meta-data-task-type-luxury-1.jpg',
} as const;

const trendPrompts = [
  'Editorial profile portrait of [person], relaxed confident expression, natural skin texture, clean styling, soft daylight from a large window, premium Instagram profile photo, 4:5 crop, no text, no watermark.',
  'Street-style cinematic portrait of [person] wearing [outfit], rainy city pavement, blue-hour reflections, fashion-magazine framing, natural motion blur, realistic face, 9:16 vertical, no text.',
  'Luxury couple portrait of [two people], coordinated neutral outfits, rooftop golden-hour background, elegant editorial pose, natural skin texture, gentle film grain, 4:5 crop, no text.',
  'Creator-and-product campaign photo of [person] holding [product], minimal studio set, sculptural shadows, crisp product detail, campaign-ready composition, empty space for later typography, 4:5 crop, no generated text.',
  'K-drama inspired cafe close-up of [person], soft backlight, polished casual outfit, city cafe background, emotional but natural expression, realistic photography, 3:4 crop, no text.',
  'Old-money fashion portrait of [person], tailored blazer, understated jewelry, stone architecture background, muted luxury palette, sharp eyes, natural pose, medium-format photo look, 4:5 crop, no watermark.',
  'Fitness campaign portrait of [person], clean sports styling, studio-white or stadium background, strong rim light, premium activewear editorial, 4:5 crop, no text.',
  'Mirror-selfie beauty portrait of [person], believable phone angle, tidy room or boutique-hotel background, soft flash realism, premium social-photo tone, 4:5 crop, no extra hands or fake text.',
] as const;

const promptFormulaTable = {
  headers: ['Prompt part', 'What to include', 'Why it matters'],
  rows: [
    ['Subject', 'Person, couple, creator, or product scene in plain language.', 'Prevents the model from drifting into generic beauty-photo output.'],
    ['Styling', 'Outfit, hair, makeup, accessories, product material, or brand palette.', 'Adds trend signal without replacing the real brief.'],
    ['Camera and crop', '4:5 feed, 9:16 Story, 3:4 portrait, lens feel, and depth of field.', 'Keeps the image aligned with the publishing surface.'],
    ['Light and mood', 'Daylight, golden hour, studio softbox, neon, or blue hour.', 'This is usually where “trending” actually comes from.'],
    ['Constraint', 'No text, no watermark, realistic hands, natural skin texture.', 'Cuts the most common AI-photo failure modes early.'],
    ['Reference handoff', 'Say exactly what the uploaded reference must preserve.', 'Protects face identity, wardrobe truth, or product shape.'],
  ],
} as const;

const scenarioMatrixTable = {
  headers: ['Goal', 'Best prompt focus', 'Keep fixed', 'Revise first if weak'],
  rows: [
    ['Profile portrait', 'Face realism, simple wardrobe, 4:5 crop, calm light.', 'Face identity, eye clarity, and background separation.', 'Reference handoff before changing style adjectives.'],
    ['Street-style reel cover', 'Vertical crop, movement, location, and lighting contrast.', 'Subject silhouette and title-safe space.', 'Crop and lighting before adding more mood words.'],
    ['Couple photo', 'Pose, wardrobe coordination, emotional tone, and clean background depth.', 'Body scale, skin texture, and relationship framing.', 'Pose simplicity before changing color palette.'],
    ['Creator with product', 'Product visibility, hand pose, set design, and negative space.', 'Product shape, label, and hero placement.', 'Hand complexity and object position first.'],
    ['Beauty or mirror selfie', 'Believable phone angle, room context, and clean skin realism.', 'Face identity and camera perspective.', 'Camera distance and flash styling first.'],
  ],
} as const;

const iterationTable = {
  headers: ['Failure mode', 'Fix first', 'Do not start with'],
  rows: [
    ['Face or product identity drifts', 'Add or tighten the reference-image rule.', 'A full prompt rewrite.'],
    ['The result feels generic', 'Add outfit, season, location, and brand palette.', 'More random “cinematic” adjectives.'],
    ['The crop fights the channel', 'Lock 4:5, 9:16, or 3:4 and name the safe zone.', 'Switching models before fixing framing.'],
    ['Hands, props, or product break', 'Reduce pose complexity and make the object placement explicit.', 'Adding more background elements.'],
    ['Text appears or looks broken', 'Repeat no generated text and reserve empty space for later typography.', 'Trusting the model to render final marketing copy perfectly.'],
  ],
} as const;

const casePromptBlocks = {
  portrait:
    'Prompt: Use my uploaded image as the face reference. Create a premium editorial profile portrait of [person] with soft window light, calm confident expression, natural skin texture, clean hair shape, minimal background separation, 4:5 crop, no text, no watermark. The uploaded image controls face identity, eye shape, and hairline.',
  street:
    'Prompt: Cinematic street-style portrait of [person] walking through a rainy city at blue hour, reflective pavement, clean fashion styling, sharp face realism, premium vertical composition, title-safe top and bottom zones, 9:16 crop, no text, no watermark.',
  product:
    'Prompt: Luxury beauty-social portrait of [person] holding [product] close to the face, soft front beauty light, hydrated natural skin texture, premium clean background, realistic hand anatomy, product shape and cap color preserved, vertical or 4:5 composition, no generated text, no fake label changes.',
} as const;

const toMutableRows = (rows: readonly (readonly string[])[]) =>
  rows.map((row) => [...row]);

const workedExamplePrompt =
  'Premium launch portrait of [person] holding a matte aluminum water bottle, clean charcoal studio background, cool rim light, realistic skin texture, bottle silhouette and lid color preserved, 4:5 feed crop, negative space above the shoulder for later headline, no generated text, no watermark.';

const enContent: BlogContentBlock[] = [
  {
    type: 'paragraph',
    text: 'People searching gemini ai photo prompt copy paste trending usually do not need a longer list of trend words. They need a social-photo prompt they can paste, generate, and still control after the first result. Inside Vogue AI, the closest starting point for this query is usually the Nano Banana social-photo lane, not a generic poster or isolated product shot. The fastest path is to lock the job, crop, lighting, reference handoff, and text rule first, then use styling words as the last layer.',
  },
  {
    type: 'heading',
    level: 2,
    text: 'TL;DR: keep the trend, fix the job',
  },
  {
    type: 'list',
    items: [
      'The best Gemini photo prompts define the image job first: profile photo, street-style Reel cover, couple portrait, creator-with-product shot, or mirror-selfie beauty post.',
      '“Trending” usually comes from styling, crop, and lighting, not from piling on random adjectives.',
      'Keep prompt blocks in English for copy-paste reuse across Gemini and Vogue AI.',
      'Use a reference image when face identity, hairstyle, wardrobe truth, or product shape must survive the prompt.',
      'After the first result, change one layer at a time: identity, crop, location, wardrobe, or light.',
    ],
  },
  {
    type: 'heading',
    level: 2,
    text: 'What this keyword usually means',
  },
  {
    type: 'paragraph',
    text: 'Most people searching this query want fast social-photo wins: a profile portrait that looks premium, a fashion photo that looks current, a couple shot that feels shareable, or a creator image that makes the product look native to social media. In Vogue AI, those examples usually map best to Nano Banana references because that library already has identity-led portraits, vertical street frames, and product-in-frame beauty shots. That is why the useful structure here is not “best AI art prompt.” It is “best controllable social-photo prompt.”',
  },
  {
    type: 'list',
    items: [
      'Good fit: portrait photos, couple photos, creator-fashion posts, product-in-hand shots, vertical social covers, and beauty or selfie-style edits.',
      'Poor fit: prompts that rely on exact readable long text, legal claims, or pixel-perfect brand typography inside the generated image.',
      'Best first move: copy one stable prompt pattern, replace the bracketed fields, and judge the first result by failure mode rather than taste.',
    ],
  },
  {
    type: 'heading',
    level: 2,
    text: '8 copy-paste Gemini photo prompts while the trend is still useful',
  },
  {
    type: 'paragraph',
    text: 'These blocks stay in English on purpose so they remain copyable across tools. If you are starting inside Vogue AI, use Nano Banana examples as the visual anchor for this keyword first, then replace only the bracketed variables and keep the rest stable for pass one.',
  },
  {
    type: 'image',
    src: promptImages.overview,
    alt: 'Nano Banana social-photo example from the Vogue AI prompt library',
    caption:
      'Use a broader social-photo example like this to lock the overall output taste first, then move into a narrower case such as identity-led portraits or product-in-frame beauty shots.',
  },
  {
    type: 'list',
    items: [...trendPrompts],
  },
  {
    type: 'heading',
    level: 2,
    text: 'Prompt anatomy that keeps the photo controllable',
  },
  {
    type: 'table',
    headers: [...promptFormulaTable.headers],
    rows: toMutableRows(promptFormulaTable.rows),
  },
  {
    type: 'heading',
    level: 2,
    text: 'Scenario matrix',
  },
  {
    type: 'table',
    headers: [...scenarioMatrixTable.headers],
    rows: toMutableRows(scenarioMatrixTable.rows),
  },
  {
    type: 'heading',
    level: 2,
    text: 'Case 1: reference-led profile portrait',
  },
  {
    type: 'image',
    src: promptImages.portrait,
    alt: 'Reference-led profile portrait case from Vogue AI',
    caption:
      'Use this pattern when the person must stay recognizable and the trend layer should only affect light, crop, and styling.',
  },
  {
    type: 'paragraph',
    text: 'This is the most durable version of the trend. Instead of asking for “viral portrait” and hoping the face survives, you lock the identity first and let the style move around it.',
  },
  {
    type: 'list',
    items: [casePromptBlocks.portrait],
  },
  {
    type: 'heading',
    level: 2,
    text: 'Case 2: street-style Story or Reel cover',
  },
  {
    type: 'image',
    src: promptImages.street,
    alt: 'Street-style campaign case from Vogue AI',
    caption:
      'This type of example matters when the photo must read fast on vertical social surfaces and still look fashion-led rather than random.',
  },
  {
    type: 'paragraph',
    text: 'The trend signal here comes from crop, motion, and lighting contrast. If the frame already works vertically, you often do not need more adjectives. You need a cleaner title-safe zone and better subject separation.',
  },
  {
    type: 'list',
    items: [casePromptBlocks.street],
  },
  {
    type: 'heading',
    level: 2,
    text: 'Case 3: product plus person campaign shot',
  },
  {
    type: 'image',
    src: promptImages.product,
    alt: 'Creator and product campaign case from Vogue AI',
    caption:
      'Use this pattern when the product still has to read clearly inside a fashionable social photo instead of disappearing into pure portrait styling.',
  },
  {
    type: 'paragraph',
    text: 'This is where many “trending” prompts fail. They produce a pretty portrait but a weak product. The fix is to state the product role explicitly: the product is not a prop, it is the second hero subject.',
  },
  {
    type: 'list',
    items: [casePromptBlocks.product],
  },
  {
    type: 'heading',
    level: 2,
    text: 'Worked example: from vague brief to usable prompt',
  },
  {
    type: 'heading',
    level: 3,
    text: 'Raw brief',
  },
  {
    type: 'paragraph',
    text: 'You need a launch photo for a new matte aluminum water bottle. The image should work in a feed post and look like a premium creator campaign. The bottle silhouette and lid color must stay stable, and the top of the frame needs room for later text.',
  },
  {
    type: 'heading',
    level: 3,
    text: 'Prompt version 1',
  },
  {
    type: 'list',
    items: [workedExamplePrompt],
  },
  {
    type: 'heading',
    level: 3,
    text: 'First revision after generation',
  },
  {
    type: 'paragraph',
    text: 'If the bottle looks premium but the lid color changes, do not rewrite the whole prompt. Add a reference image and say it controls the bottle silhouette, lid color, and label placement. If the bottle is correct but the result feels flat, keep identity stable and only push the lighting and wardrobe layer.',
  },
  {
    type: 'callout',
    title: 'Revision rule',
    text: 'Treat trend words as the last layer, not the first. Identity, crop, and object truth should be stable before you chase more mood.',
  },
  {
    type: 'heading',
    level: 2,
    text: 'What to change after the first result',
  },
  {
    type: 'list',
    items: [
      'If the face changes too much, add a reference image and say it controls face shape, hairstyle, and expression.',
      'If the photo feels generic, add wardrobe, season, location, and one named lighting setup.',
      'If the crop fights the channel, lock 4:5 for feed, 9:16 for Story or Reel, or 3:4 for a tighter portrait.',
      'If the hand pose or product looks broken, reduce pose complexity and state exactly where the product sits in frame.',
      'If the model tries to generate text, repeat no generated text and reserve empty space for later typography.',
    ],
  },
  {
    type: 'table',
    headers: [...iterationTable.headers],
    rows: toMutableRows(iterationTable.rows),
  },
  {
    type: 'heading',
    level: 2,
    text: 'Use the same prompt inside Vogue AI without losing control',
  },
  {
    type: 'paragraph',
    text: 'Gemini is fine for fast first-pass social-photo ideas. Vogue AI becomes more useful when you want to keep the winning prompt as a reusable asset, switch models without rewriting the brief, and attach a reference image when identity matters. For this keyword, Nano Banana is usually the best first lane inside Vogue AI because the gallery examples already look like social-native Gemini outputs rather than generic ad comps.',
  },
  {
    type: 'list',
    items: [
      'Use GPT Image 2 when instruction following, product truth, and controlled revisions matter most.',
      'Use Nano Banana when you want quick variations on the same social-photo idea without rebuilding the brief.',
      'Use Midjourney when the real job is editorial mood exploration rather than strict identity fidelity.',
      'Save the working prompt with a plain label such as profile-portrait-4x5-reference-window-light so the next iteration starts from a controlled baseline.',
    ],
  },
  {
    type: 'heading',
    level: 2,
    text: 'FAQ',
  },
  {
    type: 'heading',
    level: 3,
    text: 'Can I copy these prompts directly into Gemini?',
  },
  {
    type: 'paragraph',
    text: 'Yes. Replace the bracketed variables first and keep the rest stable for the first pass. The stable parts are what preserve crop, realism, and output discipline.',
  },
  {
    type: 'heading',
    level: 3,
    text: 'What makes a Gemini photo prompt feel trending?',
  },
  {
    type: 'paragraph',
    text: 'Usually it is the combination of wardrobe, lighting, crop, and a social-native composition. The trend layer is rarely the main subject sentence by itself.',
  },
  {
    type: 'heading',
    level: 3,
    text: 'Should prompts for boys and girls be different?',
  },
  {
    type: 'paragraph',
    text: 'Only the styling variables need to move. The same camera, crop, realism rule, and reference handoff can often stay stable across both.',
  },
  {
    type: 'heading',
    level: 3,
    text: 'When should I add a reference image?',
  },
  {
    type: 'paragraph',
    text: 'Use one when face identity, hairstyle, wardrobe truth, product shape, label placement, or brand palette has to survive the trend styling.',
  },
  {
    type: 'heading',
    level: 3,
    text: 'Can Vogue AI reuse Gemini prompts?',
  },
  {
    type: 'paragraph',
    text: 'Yes. Paste the same English prompt, then change only the model and reference-image rules. That lets you compare the model, not a rewritten brief.',
  },
  {
    type: 'heading',
    level: 3,
    text: 'Should I ask the model to add final text?',
  },
  {
    type: 'paragraph',
    text: 'Only for rough layout placeholders. If the final post needs a real headline, legal copy, or exact branding, reserve clean space and add typography later in a design tool.',
  },
];

const zhContent: BlogContentBlock[] = [
  {
    type: 'paragraph',
    text: '搜 gemini ai photo prompt copy paste trending 的人，通常不是想再收集一串“热门形容词”，而是想要一套复制后还能稳定出片的社媒照片提示词。在 Vogue AI 里，这类关键词最接近的起点通常是 Nano Banana 那条社媒照片库，而不是泛海报图或纯产品静物图。真正决定结果像不像当下流行内容的，往往不是多写几个 viral 或 cinematic，而是先锁住任务类型、裁切、光线、参考图交接和无文字规则。',
  },
  {
    type: 'heading',
    level: 2,
    text: 'TL;DR：保留趋势感，但先把工作目标写清楚',
  },
  {
    type: 'list',
    items: [
      '好用的 Gemini 照片提示词，第一步不是写“viral”或“cinematic”，而是先写清楚这是头像、街拍封面、情侣照、带货人像，还是镜前自拍。',
      '所谓“热门感”，大多来自服装、构图、裁切、光线和社媒版式，而不是更花哨的形容词。',
      '公开提示词块保持英文，才适合直接复制到 Gemini，也方便在 Vogue AI 里复用。',
      '当人脸、发型、服装、产品形状或品牌色必须稳定时，要补参考图，并明确参考图控制哪些部分。',
      '第一张结果出来后，只改一个变量：身份、裁切、地点、穿搭或光线，不要整段重写。',
    ],
  },
  {
    type: 'heading',
    level: 2,
    text: '这个关键词背后，用户真正想要什么',
  },
  {
    type: 'paragraph',
    text: '大多数搜这个词的人，目标都很具体：做一个看起来像流行社媒头像的人像、一个适合发 Reel 或 Story 的时尚竖图、一张情侣氛围照、一个带产品的 creator 照片，或者一张有自拍感但又不廉价的美妆图。在 Vogue AI 里，这一类案例往往最该先从 Nano Banana 的社媒照片样例里找，因为它更接近 Gemini 用户真正想要的出片感。也就是说，你真正要写的是“可控的社媒照片提示词”，不是泛泛的 AI 艺术 prompt。',
  },
  {
    type: 'list',
    items: [
      '适合：头像照、街拍、情侣照、产品入镜的人像、竖版封面、美妆自拍风照片。',
      '不适合：依赖长段可读文字、法律合规声明、像素级品牌排版的图片需求。',
      '最稳的起手式：先复制一个稳定模板，只换方括号变量，再按失败模式修第一张图。',
    ],
  },
  {
    type: 'heading',
    level: 2,
    text: '8 个可直接复制的 Gemini 热门照片提示词',
  },
  {
    type: 'paragraph',
    text: '下面的提示词故意保持英文，这样你可以直接粘贴到 Gemini，也能原样带进 Vogue AI。如果你是在 Vogue AI 里起稿，先看 Nano Banana 的社媒图案例会更准。第一次生成时，只替换方括号变量，其他结构先别动。',
  },
  {
    type: 'image',
    src: promptImages.overview,
    alt: 'Vogue AI 中的 Nano Banana 社媒照片案例',
    caption: '先用这种更宽泛的社媒照片案例校准整体出片感，再往下收窄到“头像稳定”或“人物带产品”这种具体任务。',
  },
  {
    type: 'list',
    items: [...trendPrompts],
  },
  {
    type: 'heading',
    level: 2,
    text: '让照片仍然可控的 prompt anatomy',
  },
  {
    type: 'table',
    headers: ['提示词部分', '应该写什么', '为什么重要'],
    rows: [
      ['主体', '人物、情侣、创作者加产品，或具体场景。', '避免模型直接退化成普通“美女照”或泛化写真。'],
      ['造型', '服装、发型、妆感、饰品、材质、品牌色。', '这才是“热门感”的主要来源之一。'],
      ['镜头与裁切', '4:5、9:16、3:4，镜头距离和景深。', '让图片真正适配 feed、Story 或头像场景。'],
      ['光线和氛围', '自然窗光、golden hour、棚灯、blue hour、霓虹。', '决定画面为什么看起来“像当下流行”。'],
      ['约束', 'no text、no watermark、自然皮肤、真实手部。', '提前减少 AI 照片最常见的失败。'],
      ['参考图交接', '明确上传图控制人脸、产品还是配色。', '保证身份、发型或产品真值不被趋势词冲掉。'],
    ],
  },
  {
    type: 'heading',
    level: 2,
    text: '场景矩阵',
  },
  {
    type: 'table',
    headers: ['目标', '提示词重点', '必须保持不变', '出问题先改哪里'],
    rows: [
      ['头像照', '脸部真实、简单服装、4:5 裁切、柔和光线。', '脸部身份、眼神清晰度、背景分离。', '先补参考图规则，再谈风格词。'],
      ['街拍 Reel 封面', '竖版裁切、动作、地点、强光线对比。', '主体轮廓和标题安全区。', '先修裁切和光线。'],
      ['情侣照', '姿势、服装协调、情绪和背景层次。', '人物比例、皮肤质感和关系感。', '先把姿势简化。'],
      ['人物带产品', '产品可见性、手部姿势、布景和留白。', '产品形状、标签和 hero 位置。', '先修手和产品位置。'],
      ['美妆或自拍风', '真实手机角度、室内场景和干净肤感。', '脸部身份和透视关系。', '先修镜头距离和闪光风格。'],
    ],
  },
  {
    type: 'heading',
    level: 2,
    text: '案例 1：参考图驱动的头像人像',
  },
  {
    type: 'image',
    src: promptImages.portrait,
    alt: 'Vogue AI 中参考图驱动头像案例',
    caption: '当人物必须“还是这个人”，而不是只是“同一种风格的人”时，要先锁身份，再让风格变化。',
  },
  {
    type: 'paragraph',
    text: '这是最耐用的一类“热门 prompt”。与其写“viral portrait”然后赌脸别跑，不如先把身份锁住，再让服装、光线和裁切承担趋势感。',
  },
  {
    type: 'list',
    items: [casePromptBlocks.portrait],
  },
  {
    type: 'heading',
    level: 2,
    text: '案例 2：街拍 Story / Reel cover',
  },
  {
    type: 'image',
    src: promptImages.street,
    alt: 'Vogue AI 中街拍竖图案例',
    caption: '这种案例真正有用的地方在于：它已经把“社媒竖版封面”的构图工作做对了，而不只是好看。',
  },
  {
    type: 'paragraph',
    text: '这类画面的“热门感”主要来自竖版裁切、运动感和灯光反差。如果竖版构图已经成立，很多时候你不需要再叠更多形容词，只需要更清楚的标题安全区和更强的主体分离。',
  },
  {
    type: 'list',
    items: [casePromptBlocks.street],
  },
  {
    type: 'heading',
    level: 2,
    text: '案例 3：人物 + 产品 campaign shot',
  },
  {
    type: 'image',
    src: promptImages.product,
    alt: 'Vogue AI 中人物带产品 campaign 案例',
    caption: '很多“热门人像 prompt”一到产品场景就失真。这个案例要解决的是：照片仍然时尚，但产品不能退成背景道具。',
  },
  {
    type: 'paragraph',
    text: '这也是最容易翻车的场景。模型会给你一张好看的人像，但产品没有成为第二个主角。修法不是多写“premium”，而是明确写出产品角色、手部关系和留白位置。',
  },
  {
    type: 'list',
    items: [casePromptBlocks.product],
  },
  {
    type: 'heading',
    level: 2,
    text: 'Worked example：从模糊需求到可用 prompt',
  },
  {
    type: 'heading',
    level: 3,
    text: '原始 brief',
  },
  {
    type: 'paragraph',
    text: '你要为一只磨砂铝制水瓶做 launch photo。它要能发在 Instagram feed 上，看起来像高级 creator campaign。瓶身轮廓和瓶盖颜色必须稳定，画面顶部还要预留后续标题位置。',
  },
  {
    type: 'heading',
    level: 3,
    text: 'Prompt version 1',
  },
  {
    type: 'list',
    items: [workedExamplePrompt],
  },
  {
    type: 'heading',
    level: 3,
    text: '第一轮生成后怎么修',
  },
  {
    type: 'paragraph',
    text: '如果瓶子质感不错，但瓶盖颜色漂了，不要整段重写。只要补一句参考图规则，说明上传图控制瓶身轮廓、瓶盖颜色和标签位置。如果瓶子是对的，但整张图太平，就保持身份不动，只推进光线和服装层。',
  },
  {
    type: 'callout',
    title: '修图规则',
    text: '趋势词永远是最后一层，不是第一层。先锁身份、裁切和产品真值，再去追 mood。',
  },
  {
    type: 'heading',
    level: 2,
    text: '第一张结果出来后，先改什么',
  },
  {
    type: 'list',
    items: [
      '脸变了：补参考图，并写清脸型、发型和表情必须保留。',
      '画面太普通：补服装、季节、地点和一个明确光线设置。',
      '裁切不适合平台：feed 锁 4:5，Story/Reel 锁 9:16，紧凑头像可锁 3:4。',
      '手或产品出问题：降低姿势复杂度，并明确产品在画面中的位置。',
      '模型偷生成文字：重复 no generated text，并明确后续文字要在设计工具里补。',
    ],
  },
  {
    type: 'table',
    headers: ['失败模式', '先修什么', '不要先做什么'],
    rows: [
      ['脸或产品身份漂移', '补或收紧参考图规则。', '整段 prompt 重写。'],
      ['画面很普通', '补穿搭、季节、地点和品牌色。', '继续堆“cinematic”“viral”这类词。'],
      ['裁切和平台不匹配', '先锁 4:5、9:16 或 3:4，并说明安全区。', '还没修构图就先换模型。'],
      ['手、道具、产品坏掉', '简化姿势，固定物体关系。', '继续往背景里加元素。'],
      ['文字乱出现', '强调 no generated text，并给后期留白。', '指望模型直接出最终营销文案。'],
    ],
  },
  {
    type: 'heading',
    level: 2,
    text: '放进 Vogue AI 之后，怎么保留控制力',
  },
  {
    type: 'paragraph',
    text: 'Gemini 适合快速试社媒照片方向。Vogue AI 更适合把效果好的 prompt 变成可复用资产：你可以换模型但不重写 brief，也可以在身份重要时挂参考图。对这个关键词来说，Nano Banana 往往是最贴题的第一站，因为图库里的样例本来就更像社媒原生照片，而不是泛广告海报。这样你比较的是模型差异，不是文字差异。',
  },
  {
    type: 'list',
    items: [
      '需要强控制、产品真值、可迭代修图时，用 GPT Image 2。',
      '需要同一思路下快速变体时，用 Nano Banana。',
      '真正要的是时尚情绪探索而不是严格真值时，用 Midjourney。',
      '把有效版本用简单标签存下来，比如 profile-portrait-4x5-reference-window-light，下次从受控版本开始，而不是从零写。',
    ],
  },
  {
    type: 'heading',
    level: 2,
    text: 'FAQ',
  },
  {
    type: 'heading',
    level: 3,
    text: '这些提示词可以直接复制到 Gemini 吗？',
  },
  {
    type: 'paragraph',
    text: '可以。第一次只替换方括号变量，其他结构先保持不动。真正保护结果稳定性的，是裁切、真实感和输出规则。'},
  {
    type: 'heading',
    level: 3,
    text: '什么会让 Gemini 照片看起来“很热门”？',
  },
  {
    type: 'paragraph',
    text: '大多数时候是服装、光线、裁切和社媒构图共同决定的，不是某个单独的“热门词”。',
  },
  {
    type: 'heading',
    level: 3,
    text: '男生 prompt 和女生 prompt 需要完全不同吗？',
  },
  {
    type: 'paragraph',
    text: '不需要。大多数情况下，只改造型变量就够了，镜头、裁切、真实感和参考图交接可以保持一致。',
  },
  {
    type: 'heading',
    level: 3,
    text: '什么时候一定要加参考图？',
  },
  {
    type: 'paragraph',
    text: '当人脸、发型、服装、产品形状、标签位置或品牌色必须稳定时，就该加参考图。',
  },
  {
    type: 'heading',
    level: 3,
    text: 'Vogue AI 能直接复用 Gemini 的提示词吗？',
  },
  {
    type: 'paragraph',
    text: '能。你可以保留英文 prompt，只调整模型和参考图规则。这样比较的是模型，不是改写后的新 brief。',
  },
  {
    type: 'heading',
    level: 3,
    text: '要不要让模型直接生成最终文字？',
  },
  {
    type: 'paragraph',
    text: '除非只是看布局草图，否则不建议。真正要上线的标题、品牌词和合规文案，最好留白后再进设计工具。',
  },
];

type LocalizedLocale = 'fr' | 'ru' | 'pt' | 'ja' | 'ko';

const localeCopy = {
  fr: {
    intro:
      "Si vous cherchez gemini ai photo prompt copy paste trending, vous n'avez généralement pas besoin d'une liste plus longue de mots à la mode. Il vous faut un prompt photo social que vous pouvez coller, générer, puis encore contrôler après le premier résultat.",
    tldr: 'TL;DR : gardez la tendance, mais fixez le vrai job',
    tldrItems: [
      "Définissez d'abord le job : photo de profil, couverture verticale, portrait de couple, photo créateur + produit, ou selfie beauté.",
      'La sensation de tendance vient surtout du styling, du cadrage, de la lumière et du format social.',
      'Gardez les blocs de prompts en anglais pour les copier dans Gemini et Vogue AI.',
      "Ajoutez une image de référence quand l'identité, la coiffure, la tenue ou la forme du produit doit rester stable.",
      'Après le premier résultat, changez une seule couche : identité, crop, lieu, tenue ou lumière.',
    ],
    need: 'Ce que la requête veut vraiment dire',
    needText:
      "La plupart des utilisateurs veulent un portrait premium, une image fashion verticale pour Reels ou Stories, une photo de couple partageable, ou un visuel créateur avec produit qui reste social-native.",
    needItems: [
      'Bon fit : portraits, couples, fashion social posts, produit dans la main, couvertures verticales.',
      'Mauvais fit : longs textes lisibles, typographie finale exacte, mentions légales dans limage.',
      'Meilleur départ : copiez un pattern stable, remplacez les variables, puis corrigez le premier échec visible.',
    ],
    promptHeading: '8 prompts photo Gemini à copier pendant que la tendance est utile',
    promptText:
      'Les blocs restent en anglais pour le copier-coller. Changez seulement les variables entre crochets au premier essai.',
    anatomy: 'Prompt anatomy pour garder le contrôle',
    scenario: 'Matrice de scénarios',
    case1: 'Cas 1 : portrait de profil piloté par référence',
    case1Text:
      "C'est le pattern le plus durable quand la personne doit rester reconnaissable. On verrouille d'abord l'identité, puis on laisse le style évoluer.",
    case2: 'Cas 2 : couverture Story ou Reel en street style',
    case2Text:
      'Le signal tendance vient ici du crop vertical, du mouvement et du contraste lumineux. Corrigez le cadrage avant dajouter plus de vocabulaire.',
    case3: 'Cas 3 : produit plus personne en image de campagne',
    case3Text:
      'Cette structure évite le problème classique : un joli portrait mais un produit faible. Le produit doit rester un second sujet héros.',
    worked: "Exemple complet : d'un brief flou à un prompt utilisable",
    raw: 'Brief brut',
    rawText:
      "Vous devez produire une photo de lancement pour une gourde en aluminium mat, utilisable dans le feed et crédible comme campagne créateur premium.",
    v1: 'Prompt version 1',
    revise: 'Première révision après génération',
    reviseText:
      "Si la matière est bonne mais que le couvercle dérive, ajoutez une règle de référence au lieu de tout réécrire. Si l'identité est juste mais le résultat plat, poussez seulement la lumière et le styling.",
    calloutTitle: 'Règle de révision',
    calloutText:
      "Les mots de tendance viennent en dernier. Verrouillez d'abord identité, crop et vérité de l'objet.",
    fixHeading: 'Que changer après le premier résultat',
    fixItems: [
      'Si le visage dérive, ajoutez une référence et nommez ce qui doit rester fixe.',
      'Si le résultat est générique, ajoutez tenue, saison, lieu et lumière.',
      'Si le crop échoue, verrouillez 4:5, 9:16 ou 3:4 selon le canal.',
      'Si les mains ou le produit cassent, simplifiez la pose et fixez la position du produit.',
      'Si du texte apparaît, répétez no generated text et gardez une zone vide pour la typo.',
    ],
    vogue: 'Réutiliser le même prompt dans Vogue AI',
    vogueText:
      "Gemini est utile pour les idées rapides. Vogue AI est plus utile quand vous voulez sauvegarder la bonne version, changer de modèle sans réécrire le brief et ajouter une référence au besoin.",
    vogueItems: [
      'GPT Image 2 pour le contrôle, la fidélité produit et les révisions propres.',
      'Nano Banana pour les variantes rapides.',
      'Midjourney pour une exploration plus éditoriale et mode.',
      'Sauvegardez la bonne version avec un nom simple et réutilisable.',
    ],
    faq: 'FAQ',
    faqItems: [
      ['Puis-je copier ces prompts directement ?', 'Oui. Remplacez dabord les variables, puis gardez le squelette stable.'],
      ['Quest-ce qui rend le rendu tendance ?', 'Le plus souvent : styling, lumière, crop et composition social-native.'],
      ['Faut-il des prompts séparés pour hommes et femmes ?', 'Non, les variables de styling changent, mais le squelette caméra et réalisme peut rester stable.'],
      ['Quand faut-il ajouter une référence ?', "Quand l'identité, la coiffure, la tenue, la forme du produit ou la palette doivent survivre."],
      ['Vogue AI peut-il réutiliser ces prompts ?', 'Oui. Gardez le prompt anglais et changez seulement modèle et règles de référence.'],
      ['Faut-il générer le texte final dans limage ?', 'Seulement comme placeholder. Pour le vrai texte final, laissez une zone vide et ajoutez la typographie après.'],
    ],
  },
  ru: {
    intro:
      'Если вы ищете gemini ai photo prompt copy paste trending, вам обычно нужна не новая пачка модных слов, а social-photo промпт, который можно вставить, сгенерировать и все еще контролировать после первого результата.',
    tldr: 'TL;DR: сохраните тренд, но сначала зафиксируйте задачу',
    tldrItems: [
      'Сначала назовите задачу: аватар, вертикальная обложка, пара, человек с продуктом или selfie-style portrait.',
      'Ощущение тренда чаще идет от стайлинга, кадра, света и social crop.',
      'Промпт-блоки лучше держать на английском для прямого copy-paste.',
      'Добавляйте референс, когда лицо, прическа, одежда или форма продукта должны остаться узнаваемыми.',
      'После первого результата меняйте только один слой: идентичность, crop, локацию, одежду или свет.',
    ],
    need: 'Что обычно стоит за этим запросом',
    needText:
      'Чаще всего пользователю нужен premium portrait, fashion-вертикаль для Reels/Stories, shareable couple shot или creator-photo с продуктом.',
    needItems: [
      'Подходит для: портретов, парных фото, fashion social posts, product-in-hand, вертикальных cover-image.',
      'Плохо подходит для: длинного читаемого текста, точной финальной типографики и юридических формулировок в кадре.',
      'Лучший старт: взять стабильный шаблон, заменить переменные и править первый видимый сбой.',
    ],
    promptHeading: '8 трендовых Gemini photo prompts для копирования',
    promptText:
      'Промпты оставлены на английском для удобного копирования. Сначала меняйте только переменные в скобках.',
    anatomy: 'Анатомия промпта для управляемого результата',
    scenario: 'Сценарная матрица',
    case1: 'Кейс 1: портрет профиля с референсом',
    case1Text:
      'Это самый надежный паттерн, когда человек должен остаться узнаваемым. Сначала фиксируйте идентичность, потом стиль.',
    case2: 'Кейс 2: street-style Story или Reel cover',
    case2Text:
      'Трендовый сигнал здесь дает вертикальный crop, движение и контраст света. Сначала чините кадр, потом атмосферу.',
    case3: 'Кейс 3: человек плюс продукт в campaign shot',
    case3Text:
      'Эта структура нужна, чтобы продукт не превратился в случайный реквизит внутри красивого портрета.',
    worked: 'Полный пример: от размытого брифа к рабочему промпту',
    raw: 'Исходный бриф',
    rawText:
      'Нужно launch-фото для матовой алюминиевой бутылки, которое будет работать в feed и выглядеть как premium creator campaign.',
    v1: 'Prompt version 1',
    revise: 'Первая правка после генерации',
    reviseText:
      'Если материал выглядит хорошо, но цвет крышки уплыл, добавьте правило референса вместо полной переписи. Если идентичность верная, а кадр плоский, меняйте только свет и styling.',
    calloutTitle: 'Правило ревизии',
    calloutText:
      'Трендовые слова идут последними. Сначала зафиксируйте идентичность, crop и truth объекта.',
    fixHeading: 'Что менять после первого результата',
    fixItems: [
      'Если лицо уходит, добавьте референс и назовите фиксируемые детали.',
      'Если кадр общий, добавьте одежду, сезон, место и свет.',
      'Если crop не подходит, зафиксируйте 4:5, 9:16 или 3:4.',
      'Если ломаются руки или продукт, упростите позу и закрепите позицию продукта.',
      'Если появляется текст, повторите no generated text и оставьте пустую зону под типографику.',
    ],
    vogue: 'Как перенести тот же промпт в Vogue AI',
    vogueText:
      'Gemini удобен для быстрых идей. Vogue AI полезнее, когда нужно сохранить рабочую версию, переключать модели без переписывания брифа и подключать референсы.',
    vogueItems: [
      'GPT Image 2 для контроля, product fidelity и чистых правок.',
      'Nano Banana для быстрых вариаций.',
      'Midjourney для более fashion и editorial mood.',
      'Сохраняйте рабочую версию под простым повторяемым именем.',
    ],
    faq: 'FAQ',
    faqItems: [
      ['Можно ли копировать эти промпты напрямую?', 'Да. Сначала замените переменные, а остальной каркас оставьте неизменным.'],
      ['Что делает результат трендовым?', 'Обычно это стайлинг, свет, crop и social-native композиция.'],
      ['Нужны ли отдельные промпты для мужчин и женщин?', 'Нет, чаще меняются только styling-переменные.'],
      ['Когда нужен референс?', 'Когда лицо, прическа, одежда, форма продукта или палитра должны сохраниться.'],
      ['Может ли Vogue AI использовать эти промпты?', 'Да. Оставьте английский промпт и поменяйте только модель и reference rules.'],
      ['Нужно ли просить финальный текст внутри изображения?', 'Только как placeholder. Для финального текста лучше оставить пустое место и добавить типографику позже.'],
    ],
  },
  pt: {
    intro:
      'Se você busca gemini ai photo prompt copy paste trending, normalmente não precisa de mais uma lista de palavras da moda. Precisa de um prompt de foto social que possa colar, gerar e ainda controlar depois do primeiro resultado.',
    tldr: 'TL;DR: mantenha a tendência, mas fixe o job primeiro',
    tldrItems: [
      'Defina o job: retrato de perfil, capa vertical, foto de casal, creator com produto ou selfie beauty.',
      'O ar de tendência costuma vir de styling, crop, luz e composição social.',
      'Mantenha os blocos em inglês para copiar em Gemini e Vogue AI.',
      'Adicione referência quando identidade, cabelo, roupa ou forma do produto precisam ficar estáveis.',
      'Depois do primeiro resultado, mude só uma camada: identidade, crop, lugar, roupa ou luz.',
    ],
    need: 'O que essa busca realmente quer',
    needText:
      'Na prática, a pessoa quer um portrait premium, um vertical fashion para Reels ou Stories, uma foto de casal compartilhável ou uma creator photo com produto.',
    needItems: [
      'Bom fit: retratos, casais, posts fashion, produto na mão, capas verticais.',
      'Mau fit: texto longo legível, tipografia final exata e disclaimers legais dentro da imagem.',
      'Melhor começo: copiar um padrão estável, trocar variáveis e corrigir o primeiro erro real.',
    ],
    promptHeading: '8 prompts de foto Gemini para copiar enquanto a tendência faz sentido',
    promptText:
      'Os blocos ficam em inglês para facilitar o copy-paste. Troque apenas as variáveis entre colchetes no primeiro passe.',
    anatomy: 'Anatomia do prompt para manter controle',
    scenario: 'Matriz de cenários',
    case1: 'Caso 1: retrato de perfil guiado por referência',
    case1Text:
      'Esse é o padrão mais durável quando a pessoa precisa continuar reconhecível. Primeiro trava a identidade; depois o estilo pode variar.',
    case2: 'Caso 2: cover vertical em street style',
    case2Text:
      'Aqui a sensação trend vem do crop vertical, do movimento e do contraste de luz. Corrija o enquadramento antes de empilhar mais mood words.',
    case3: 'Caso 3: campanha com pessoa e produto',
    case3Text:
      'Essa estrutura evita o erro clássico: retrato bonito, mas produto fraco. O produto precisa continuar como segundo herói da cena.',
    worked: 'Exemplo completo: de briefing vago a prompt utilizável',
    raw: 'Brief bruto',
    rawText:
      'Você precisa de uma launch photo para uma garrafa de alumínio fosco que funcione no feed e pareça uma creator campaign premium.',
    v1: 'Prompt version 1',
    revise: 'Primeira revisão depois da geração',
    reviseText:
      'Se o material está bom mas a tampa mudou, adicione regra de referência em vez de reescrever tudo. Se a identidade está certa mas o resultado está sem energia, mude só luz e styling.',
    calloutTitle: 'Regra de revisão',
    calloutText:
      'Palavras de tendência entram por último. Primeiro trave identidade, crop e verdade do objeto.',
    fixHeading: 'O que mudar depois do primeiro resultado',
    fixItems: [
      'Se o rosto muda, adicione referência e nomeie o que deve continuar igual.',
      'Se a imagem parece genérica, adicione roupa, estação, lugar e luz.',
      'Se o crop falha, fixe 4:5, 9:16 ou 3:4.',
      'Se mãos ou produto quebram, simplifique a pose e fixe a posição do produto.',
      'Se aparece texto, repita no generated text e deixe espaço para a tipografia depois.',
    ],
    vogue: 'Como reutilizar o mesmo prompt no Vogue AI',
    vogueText:
      'Gemini serve para ideias rápidas. Vogue AI fica mais útil quando você quer salvar a versão boa, trocar de modelo sem reescrever o brief e anexar referência quando necessário.',
    vogueItems: [
      'GPT Image 2 para controle, fidelidade do produto e revisões limpas.',
      'Nano Banana para variações rápidas.',
      'Midjourney para exploração mais editorial e fashion.',
      'Salve a versão boa com um nome simples e reutilizável.',
    ],
    faq: 'FAQ',
    faqItems: [
      ['Posso copiar esses prompts direto?', 'Sim. Troque primeiro as variáveis e mantenha o esqueleto estável.'],
      ['O que deixa o resultado com cara de tendência?', 'Normalmente styling, luz, crop e composição social-native.'],
      ['Preciso de prompts separados para homens e mulheres?', 'Não necessariamente; na maioria dos casos só mudam as variáveis de styling.'],
      ['Quando usar referência?', 'Quando rosto, cabelo, roupa, forma do produto ou paleta precisam continuar reconhecíveis.'],
      ['O Vogue AI consegue reaproveitar esses prompts?', 'Sim. Mantenha o prompt em inglês e troque só modelo e regras de referência.'],
      ['Vale pedir o texto final dentro da imagem?', 'Só como placeholder. Para copy final, deixe espaço e adicione tipografia depois.'],
    ],
  },
  ja: {
    intro:
      'gemini ai photo prompt copy paste trending を探しているとき、必要なのは流行語を増やすことではなく、貼り付けて生成したあとも制御しやすい social-photo prompt です。',
    tldr: 'TL;DR: トレンド感は残しつつ、先に job を固定する',
    tldrItems: [
      '最初に決めるのは用途です。プロフィール、縦 cover、カップル写真、人物 + 商品、mirror selfie など。',
      'トレンドっぽさは、言葉の派手さよりも styling、crop、light、social-native composition から来ます。',
      'prompt block は English のままにして、Gemini と Vogue AI でコピーしやすくします。',
      '顔、髪型、服、商品形状を守る必要があるなら reference image を追加します。',
      '最初の結果の後は、identity、crop、location、outfit、light のどれか 1 つだけを変えます。',
    ],
    need: 'この検索意図が本当に求めているもの',
    needText:
      '多くの読者が欲しいのは、premium な profile portrait、Reels / Stories 向けの縦型 fashion image、shareable な couple shot、または product-in-hand の creator image です。',
    needItems: [
      '向いている用途: portrait、couple、fashion social post、product-in-hand、vertical cover。',
      '向いていない用途: 長い可読テキスト、最終 typography、法的文言を画像内に正確に入れる仕事。',
      '最善の入り口: 安定した pattern をコピーし、変数だけを置き換え、最初の失敗モードから直すこと。',
    ],
    promptHeading: '今のうちに使える 8 つの Gemini photo prompt',
    promptText:
      'copy-paste しやすいよう prompt は English のままです。最初は角括弧の変数だけを変えてください。',
    anatomy: '制御を残すための prompt anatomy',
    scenario: 'Scenario matrix',
    case1: 'Case 1: 参考画像で固定する profile portrait',
    case1Text:
      '本人性を保ちたいときに最も durable な pattern です。先に identity を固定し、その後で style を動かします。',
    case2: 'Case 2: street-style Story / Reel cover',
    case2Text:
      'このタイプは vertical crop、motion、light contrast が trend signal です。まず framing を直してください。',
    case3: 'Case 3: product plus person campaign shot',
    case3Text:
      'この構造は、portrait はきれいだが product が弱い、という失敗を防ぎます。商品は第二の hero subject です。',
    worked: 'Worked example: 曖昧な brief から使える prompt へ',
    raw: 'Raw brief',
    rawText:
      'マットなアルミボトルの launch photo が必要で、feed でも使え、premium creator campaign に見える必要があります。',
    v1: 'Prompt version 1',
    revise: '最初の修正',
    reviseText:
      '質感は良いのに lid color がずれるなら、全体を書き換えず reference rule を足します。identity が合っていて flat なら、light と styling だけを押します。',
    calloutTitle: 'Revision rule',
    calloutText:
      'trend word は最後の layer です。先に identity、crop、object truth を固定してください。',
    fixHeading: '最初の結果の後に何を変えるか',
    fixItems: [
      '顔が変わるなら reference image を足し、固定したい要素を明言します。',
      'generic なら outfit、season、location、light を追加します。',
      'crop が合わないなら 4:5、9:16、3:4 を固定します。',
      '手や product が壊れるなら pose を簡単にし、product position を明示します。',
      '文字が出るなら no generated text を繰り返し、後で typography を載せる space を残します。',
    ],
    vogue: '同じ prompt を Vogue AI で再利用する',
    vogueText:
      'Gemini は方向出しに便利です。Vogue AI は良い version を保存し、model を変えても brief を書き直さず、必要なら reference image を追加できる点が便利です。',
    vogueItems: [
      'GPT Image 2 は control、product fidelity、clean revision に向きます。',
      'Nano Banana は quick variation に向きます。',
      'Midjourney は editorial / fashion mood exploration に向きます。',
      '良い version は再利用しやすい plain label で保存します。',
    ],
    faq: 'FAQ',
    faqItems: [
      ['そのままコピーできますか？', 'はい。まず変数だけを差し替え、骨格は保ったままにします。'],
      ['何が “trending” に見せるのですか？', '多くの場合、styling、light、crop、social-native composition の組み合わせです。'],
      ['男性用と女性用で完全に別 prompt が必要ですか？', '必ずしも必要ではありません。多くは styling variable だけ変えれば十分です。'],
      ['reference image はいつ使いますか？', '顔、髪型、服、商品形状、palette を守りたいときです。'],
      ['Vogue AI でもそのまま使えますか？', 'はい。English prompt を保ち、model と reference rules だけを変えます。'],
      ['最終テキストを画像に入れるべきですか？', 'placeholder なら可ですが、最終 copy は後で typography を足す方が安全です。'],
    ],
  },
  ko: {
    intro:
      'gemini ai photo prompt copy paste trending 을 찾는다면, 더 많은 유행어보다 중요한 것은 붙여넣고 생성한 뒤에도 계속 제어할 수 있는 social-photo 프롬프트입니다.',
    tldr: 'TL;DR: 트렌드는 살리고, 먼저 job 을 고정하세요',
    tldrItems: [
      '먼저 정할 것은 용도입니다. 프로필, 세로 cover, 커플 사진, 인물 + 제품, mirror selfie 같은 실제 작업입니다.',
      '트렌디한 느낌은 대개 styling, crop, light, social-native composition 에서 옵니다.',
      '프롬프트 블록은 영어로 유지해야 Gemini 와 Vogue AI 에서 그대로 복사하기 쉽습니다.',
      '얼굴, 헤어, 의상, 제품 형태를 지켜야 하면 reference image 를 붙이세요.',
      '첫 결과 뒤에는 identity, crop, location, outfit, light 중 하나만 바꾸세요.',
    ],
    need: '이 검색어가 실제로 원하는 것',
    needText:
      '대부분의 사용자는 premium profile portrait, Reels / Stories 용 세로 fashion photo, shareable couple shot, 또는 product-in-hand creator image 를 원합니다.',
    needItems: [
      '잘 맞는 작업: portrait, couple, fashion social post, product-in-hand, vertical cover.',
      '잘 맞지 않는 작업: 긴 가독성 텍스트, 최종 typography, 법적 문구를 이미지 안에 정확히 넣는 일.',
      '가장 좋은 시작: 안정적인 pattern 을 복사하고 변수만 바꾼 뒤 첫 실패 모드부터 고치는 것.',
    ],
    promptHeading: '지금 바로 복사해 쓸 수 있는 Gemini photo prompt 8개',
    promptText:
      '복사용으로 프롬프트는 영어 그대로 둡니다. 첫 시도에서는 대괄호 변수만 교체하세요.',
    anatomy: '제어를 남기는 prompt anatomy',
    scenario: 'Scenario matrix',
    case1: 'Case 1: reference-led profile portrait',
    case1Text:
      '사람이 계속 같은 사람으로 보여야 할 때 가장 durable 한 패턴입니다. 먼저 identity 를 잠그고, 그다음 스타일을 움직입니다.',
    case2: 'Case 2: street-style Story / Reel cover',
    case2Text:
      '이 유형의 trend signal 은 vertical crop, motion, light contrast 입니다. framing 을 먼저 고치세요.',
    case3: 'Case 3: product plus person campaign shot',
    case3Text:
      '이 구조는 예쁜 portrait 는 나오지만 product 가 약해지는 문제를 막습니다. 제품은 두 번째 hero subject 여야 합니다.',
    worked: 'Worked example: 흐린 brief 를 usable prompt 로 바꾸기',
    raw: 'Raw brief',
    rawText:
      '무광 알루미늄 물병의 launch photo 가 필요하고, feed 에 올려도 premium creator campaign 처럼 보여야 합니다.',
    v1: 'Prompt version 1',
    revise: '첫 수정',
    reviseText:
      '재질은 좋지만 lid color 가 틀리면 전체를 다시 쓰지 말고 reference rule 을 더하세요. identity 가 맞는데 flat 하면 light 와 styling 만 밀어주세요.',
    calloutTitle: 'Revision rule',
    calloutText:
      'trend word 는 마지막 layer 입니다. 먼저 identity, crop, object truth 를 고정하세요.',
    fixHeading: '첫 결과 뒤에 무엇을 바꿀까',
    fixItems: [
      '얼굴이 바뀌면 reference image 를 추가하고 고정할 요소를 명시하세요.',
      '너무 generic 하면 outfit, season, location, light 를 추가하세요.',
      'crop 이 맞지 않으면 4:5, 9:16, 3:4 를 고정하세요.',
      '손이나 제품이 깨지면 pose 를 단순화하고 제품 위치를 명확히 하세요.',
      '텍스트가 생기면 no generated text 를 반복하고 나중 typography 공간을 남기세요.',
    ],
    vogue: '같은 prompt 를 Vogue AI 에서 재사용하기',
    vogueText:
      'Gemini 는 빠른 방향 잡기에 좋고, Vogue AI 는 좋은 version 을 저장하고 모델을 바꿔도 brief 를 다시 쓰지 않으며 reference image 를 붙일 수 있어서 더 실무적입니다.',
    vogueItems: [
      'GPT Image 2 는 control, product fidelity, clean revision 에 적합합니다.',
      'Nano Banana 는 빠른 variation 에 적합합니다.',
      'Midjourney 는 editorial / fashion mood exploration 에 적합합니다.',
      '좋은 version 은 다시 쓰기 쉬운 plain label 로 저장하세요.',
    ],
    faq: 'FAQ',
    faqItems: [
      ['그대로 복사해도 되나요?', '네. 먼저 변수만 바꾸고 프롬프트 뼈대는 유지하세요.'],
      ['무엇이 결과를 트렌디하게 보이게 하나요?', '보통 styling, light, crop, social-native composition 의 조합입니다.'],
      ['남녀별로 완전히 다른 prompt 가 필요한가요?', '대부분은 styling 변수만 바꾸면 충분합니다.'],
      ['reference image 는 언제 쓰나요?', '얼굴, 헤어, 의상, 제품 형태, palette 를 지켜야 할 때입니다.'],
      ['Vogue AI 에서도 재사용할 수 있나요?', '네. 영어 prompt 를 유지하고 model 과 reference rules 만 바꾸면 됩니다.'],
      ['최종 문구를 이미지 안에 넣어야 하나요?', 'placeholder 용도만 권장합니다. 최종 copy 는 나중에 typography 로 넣는 편이 안전합니다.'],
    ],
  },
} as const satisfies Record<
  LocalizedLocale,
  {
    intro: string;
    tldr: string;
    tldrItems: string[];
    need: string;
    needText: string;
    needItems: string[];
    promptHeading: string;
    promptText: string;
    anatomy: string;
    scenario: string;
    case1: string;
    case1Text: string;
    case2: string;
    case2Text: string;
    case3: string;
    case3Text: string;
    worked: string;
    raw: string;
    rawText: string;
    v1: string;
    revise: string;
    reviseText: string;
    calloutTitle: string;
    calloutText: string;
    fixHeading: string;
    fixItems: string[];
    vogue: string;
    vogueText: string;
    vogueItems: string[];
    faq: string;
    faqItems: string[][];
  }
>;

function makeLocalized(locale: LocalizedLocale): BlogContentBlock[] {
  const copy = localeCopy[locale];

  return [
    { type: 'paragraph', text: copy.intro },
    { type: 'heading', level: 2, text: copy.tldr },
    { type: 'list', items: [...copy.tldrItems] },
    { type: 'heading', level: 2, text: copy.need },
    { type: 'paragraph', text: copy.needText },
    { type: 'list', items: [...copy.needItems] },
    { type: 'heading', level: 2, text: copy.promptHeading },
    { type: 'paragraph', text: copy.promptText },
    {
      type: 'image',
      src: promptImages.overview,
      alt: 'Social-photo example from Vogue AI',
      caption:
        locale === 'fr'
          ? 'Cette image donne un point de départ plus large pour cadrer le rendu social avant de passer aux cas plus précis.'
          : locale === 'ru'
            ? 'Этот пример задает более широкий social-photo ориентир, прежде чем переходить к узким кейсам.'
            : locale === 'pt'
              ? 'Essa imagem dá um ponto de partida mais amplo para acertar o clima social-photo antes dos casos mais específicos.'
              : locale === 'ja'
                ? 'より具体的な case に入る前に、social-photo の全体感を合わせる出発点です。'
                : '더 구체적인 case 로 들어가기 전에 social-photo 톤을 맞추는 출발점입니다.',
    },
    { type: 'list', items: [...trendPrompts] },
    { type: 'heading', level: 2, text: copy.anatomy },
    { type: 'table', headers: [...promptFormulaTable.headers], rows: toMutableRows(promptFormulaTable.rows) },
    { type: 'heading', level: 2, text: copy.scenario },
    { type: 'table', headers: [...scenarioMatrixTable.headers], rows: toMutableRows(scenarioMatrixTable.rows) },
    { type: 'heading', level: 2, text: copy.case1 },
    {
      type: 'image',
      src: promptImages.portrait,
      alt: 'Reference-led profile portrait case from Vogue AI',
      caption:
        locale === 'fr'
          ? "Ce pattern protège l'identité avant de bouger le style."
          : locale === 'ru'
            ? 'Этот паттерн сначала защищает идентичность, а уже потом двигает стиль.'
            : locale === 'pt'
              ? 'Esse padrão protege a identidade antes de mover o estilo.'
              : locale === 'ja'
                ? 'このパターンは、スタイルより先に identity を守ります。'
                : '이 패턴은 스타일보다 먼저 identity 를 지킵니다.',
    },
    { type: 'paragraph', text: copy.case1Text },
    { type: 'list', items: [casePromptBlocks.portrait] },
    { type: 'heading', level: 2, text: copy.case2 },
    {
      type: 'image',
      src: promptImages.street,
      alt: 'Street-style vertical cover case from Vogue AI',
      caption:
        locale === 'fr'
          ? 'Ici, le crop vertical et la séparation du sujet font une grande partie du travail.'
          : locale === 'ru'
            ? 'Здесь вертикальный crop и отделение субъекта делают половину работы.'
            : locale === 'pt'
              ? 'Aqui o crop vertical e a separação do sujeito fazem grande parte do trabalho.'
              : locale === 'ja'
                ? 'ここでは vertical crop と subject separation が大きな役割を持ちます。'
                : '여기서는 vertical crop 과 subject separation 이 핵심입니다.',
    },
    { type: 'paragraph', text: copy.case2Text },
    { type: 'list', items: [casePromptBlocks.street] },
    { type: 'heading', level: 2, text: copy.case3 },
    {
      type: 'image',
      src: promptImages.product,
      alt: 'Product plus person campaign case from Vogue AI',
      caption:
        locale === 'fr'
          ? 'Cette structure garde le produit visible au lieu de le perdre derrière le portrait.'
          : locale === 'ru'
            ? 'Эта структура удерживает продукт видимым, а не прячет его за портретом.'
            : locale === 'pt'
              ? 'Essa estrutura mantém o produto visível em vez de deixá-lo virar apenas pano de fundo.'
              : locale === 'ja'
                ? 'この構造は、product が portrait の背景に消えないように保ちます。'
                : '이 구조는 product 가 portrait 뒤 배경으로 사라지지 않게 합니다.',
    },
    { type: 'paragraph', text: copy.case3Text },
    { type: 'list', items: [casePromptBlocks.product] },
    { type: 'heading', level: 2, text: copy.worked },
    { type: 'heading', level: 3, text: copy.raw },
    { type: 'paragraph', text: copy.rawText },
    { type: 'heading', level: 3, text: copy.v1 },
    { type: 'list', items: [workedExamplePrompt] },
    { type: 'heading', level: 3, text: copy.revise },
    { type: 'paragraph', text: copy.reviseText },
    { type: 'callout', title: copy.calloutTitle, text: copy.calloutText },
    { type: 'heading', level: 2, text: copy.fixHeading },
    { type: 'list', items: [...copy.fixItems] },
    { type: 'table', headers: [...iterationTable.headers], rows: toMutableRows(iterationTable.rows) },
    { type: 'heading', level: 2, text: copy.vogue },
    { type: 'paragraph', text: copy.vogueText },
    { type: 'list', items: [...copy.vogueItems] },
    { type: 'heading', level: 2, text: copy.faq },
    ...copy.faqItems.flatMap(([question, answer]) => [
      { type: 'heading', level: 3, text: question } as BlogContentBlock,
      { type: 'paragraph', text: answer } as BlogContentBlock,
    ]),
  ];
}

export const geminiAiPhotoPromptCopyPasteTrendingAutoBlogPost: BlogPostSource = {
  slug: 'gemini-ai-photo-prompt-copy-paste-trending',
  date: '2026-05-29',
  updatedAt: '2026-05-29',
  author: 'Vogue AI Team',
  image: promptImages.portrait,
  imageAlt: 'Reference-led Nano Banana fashion portrait prompt example from Vogue AI',
  articleType: 'tutorial',
  modelTags: ['vogue-ai', 'gpt-image-2', 'nano-banana', 'midjourney'],
  readingMinutes: 10,
  localizations: {
    en: {
      title: 'Gemini AI photo prompts to copy and paste while the trend is still useful',
      summary:
        'Copy Gemini AI photo prompts for portraits, couple shots, fashion verticals, creator product images, and beauty-style selfies, then reuse the same structure in Vogue AI.',
      seoTitle: 'Gemini AI Photo Prompt Copy Paste Trending Guide',
      seoDescription:
        'Copy Gemini AI photo prompts for portraits, fashion shots, couples, and creator product scenes, then adapt them in Vogue AI with reference rules.',
      content: enContent,
    },
    zh: {
      title: 'Gemini AI 热门照片提示词，可直接复制粘贴',
      summary:
        '复制适合头像、人像、情侣照、时尚竖图、人物带产品和自拍风照片的 Gemini AI 提示词，并在 Vogue AI 中稳定复用。',
      seoTitle: 'Gemini AI 照片提示词复制粘贴指南',
      seoDescription:
        '获取适合人像、时尚、情侣照和人物带产品场景的 Gemini AI 热门照片提示词，并学习在 Vogue AI 中用参考图和模型切换稳定改写。',
      content: zhContent,
    },
    fr: {
      title: 'Prompts photo Gemini AI tendance à copier-coller',
      summary:
        'Copiez des prompts Gemini AI pour portraits, couples, verticales mode, images créateur + produit et selfies beauté, puis réutilisez la même structure dans Vogue AI.',
      seoTitle: 'Guide des prompts photo Gemini AI à copier',
      seoDescription:
        'Prompts Gemini AI tendance pour portraits, mode, couples et scènes produit, avec règles de référence et de choix de modèle dans Vogue AI.',
      content: makeLocalized('fr'),
    },
    ru: {
      title: 'Трендовые фото-промпты Gemini AI для копирования',
      summary:
        'Копируйте промпты Gemini AI для портретов, парных фото, fashion-вертикалей, creator-сцен с продуктом и selfie-style кадров, затем переносите ту же структуру в Vogue AI.',
      seoTitle: 'Фото-промпты Gemini AI для копирования',
      seoDescription:
        'Трендовые фото-промпты Gemini AI для портретов, fashion, пар и product scenes с правилами reference-image и выбора модели в Vogue AI.',
      content: makeLocalized('ru'),
    },
    pt: {
      title: 'Prompts de foto Gemini AI em tendência para copiar',
      summary:
        'Copie prompts Gemini AI para retratos, casais, verticais fashion, creator shots com produto e selfies beauty, depois reutilize a mesma estrutura no Vogue AI.',
      seoTitle: 'Guia de Prompts de Foto Gemini AI para Copiar',
      seoDescription:
        'Prompts de foto Gemini AI em tendência para retratos, moda, casais e cenas com produto, com regras de referência e escolha de modelo no Vogue AI.',
      content: makeLocalized('pt'),
    },
    ja: {
      title: 'コピーして使える Gemini AI 写真トレンド prompt',
      summary:
        'ポートレート、カップル、fashion vertical、人物 + 商品、selfie-style 写真向けの Gemini AI prompt をコピーし、同じ構造を Vogue AI でも再利用します。',
      seoTitle: 'Gemini AI 写真プロンプト コピーガイド',
      seoDescription:
        'Gemini AI の写真トレンド prompt を portrait、fashion、couple、product scene 向けにコピーし、Vogue AI で reference-image と model choice を使い分けます。',
      content: makeLocalized('ja'),
    },
    ko: {
      title: '복사해 쓰는 Gemini AI 사진 트렌드 프롬프트',
      summary:
        '인물, 커플, fashion vertical, 인물 + 제품, selfie-style 사진용 Gemini AI 프롬프트를 복사하고 같은 구조를 Vogue AI 에서도 재사용하세요.',
      seoTitle: 'Gemini AI 사진 프롬프트 복사 가이드',
      seoDescription:
        '인물, 패션, 커플, 제품 장면용 Gemini AI 트렌드 프롬프트와 Vogue AI reference-image / model choice 워크플로를 정리했습니다.',
      content: makeLocalized('ko'),
    },
  },
};
