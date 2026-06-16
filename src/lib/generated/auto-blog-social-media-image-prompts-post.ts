import type { BlogContentBlock, BlogPostSource } from '@/lib/blog-data';

const promptLibraryImages = {
  hero:
    'https://media.vogueai.net/blog/auto/social-media-image-prompts/65b58f1af7f1-social-media-post-sunlit-streetwear-jacket-portrait-1.jpg',
  story:
    'https://media.vogueai.net/blog/auto/social-media-image-prompts/7a9ae927611c-ultra-photorealistic-vertical-instagram-story-style-3x2-1.jpg',
  streetArt:
    'https://media.vogueai.net/blog/auto/social-media-image-prompts/82fcbca1e546-stencil-street-art-style-banksy-silhouette-slouched-1.jpg',
} as const;

const promptBlocks = [
  'Instagram product post: Square social media image for [product], centered hero subject, clean brand-color background, crisp material detail, soft commercial lighting, subtle shadow, generous empty space for caption overlay, 1:1 aspect ratio, no generated text, no watermark.',
  'Vertical story launch: Ultra-photorealistic 9:16 Instagram Story visual for [offer or launch], main subject in the lower third, bright lifestyle lighting, clear swipe-safe negative space at top, energetic creator-brand mood, no readable text, no logo distortion.',
  'Creator portrait post: Editorial social media portrait of [person or persona] wearing [wardrobe], confident natural pose, sunlit streetwear campaign style, sharp eyes, authentic skin texture, 4:5 feed crop, background separated but not blurred into mush, no text.',
  'Campaign teaser poster: High-contrast social campaign image for [topic], bold focal subject, graphic color blocking, clean space for a future headline, modern poster composition, 9:16 crop, keep all text areas empty for later design.',
  'Carousel cover image: Polished educational carousel cover for [theme], one clear visual metaphor, tidy desktop or studio setting, restrained brand palette, strong central composition, 4:5 aspect ratio, no small text, no UI clutter.',
] as const;

const workedPrompt =
  'Editorial social media image for a lightweight streetwear jacket, model walking through a sunlit city street, jacket silhouette clearly visible, relaxed confident pose, warm natural light, crisp fabric texture, modern creator campaign mood, 4:5 Instagram feed crop, clean upper-left negative space for future headline, no generated text, no watermark.';

type ContentCopy = {
  intro: string;
  tldrHeading: string;
  tldrItems: string[];
  matrixHeading: string;
  matrixHeaders: string[];
  matrixRows: string[][];
  promptHeading: string;
  promptIntro: string;
  heroAlt: string;
  heroCaption: string;
  storyAlt: string;
  storyCaption: string;
  anatomyHeading: string;
  anatomyHeaders: string[];
  anatomyRows: string[][];
  workflowHeading: string;
  workflowIntro: string;
  workflowItems: string[];
  workedHeading: string;
  rawBriefHeading: string;
  rawBrief: string;
  promptVersionHeading: string;
  streetAlt: string;
  streetCaption: string;
  diagnosisHeading: string;
  diagnosis: string;
  calloutTitle: string;
  calloutText: string;
  mistakeHeading: string;
  mistakeHeaders: string[];
  mistakeRows: string[][];
  vogueHeading: string;
  vogueText: string;
  vogueItems: string[];
  faqHeading: string;
  faq: Array<{ question: string; answer: string }>;
};

function buildContent(copy: ContentCopy): BlogContentBlock[] {
  return [
    { type: 'paragraph', text: copy.intro },
    { type: 'heading', level: 2, text: copy.tldrHeading },
    { type: 'list', items: copy.tldrItems },
    {
      type: 'image',
      src: promptLibraryImages.hero,
      alt: copy.heroAlt,
      caption: copy.heroCaption,
    },
    { type: 'heading', level: 2, text: copy.matrixHeading },
    {
      type: 'table',
      headers: copy.matrixHeaders,
      rows: copy.matrixRows,
    },
    { type: 'heading', level: 2, text: copy.promptHeading },
    { type: 'paragraph', text: copy.promptIntro },
    { type: 'list', items: [...promptBlocks] },
    {
      type: 'image',
      src: promptLibraryImages.story,
      alt: copy.storyAlt,
      caption: copy.storyCaption,
    },
    { type: 'heading', level: 2, text: copy.anatomyHeading },
    {
      type: 'table',
      headers: copy.anatomyHeaders,
      rows: copy.anatomyRows,
    },
    { type: 'heading', level: 2, text: copy.workflowHeading },
    { type: 'paragraph', text: copy.workflowIntro },
    { type: 'list', items: copy.workflowItems },
    { type: 'heading', level: 2, text: copy.workedHeading },
    { type: 'heading', level: 3, text: copy.rawBriefHeading },
    { type: 'paragraph', text: copy.rawBrief },
    { type: 'heading', level: 3, text: copy.promptVersionHeading },
    { type: 'list', items: [workedPrompt] },
    {
      type: 'image',
      src: promptLibraryImages.streetArt,
      alt: copy.streetAlt,
      caption: copy.streetCaption,
    },
    { type: 'heading', level: 3, text: copy.diagnosisHeading },
    { type: 'paragraph', text: copy.diagnosis },
    { type: 'callout', title: copy.calloutTitle, text: copy.calloutText },
    { type: 'heading', level: 2, text: copy.mistakeHeading },
    {
      type: 'table',
      headers: copy.mistakeHeaders,
      rows: copy.mistakeRows,
    },
    { type: 'heading', level: 2, text: copy.vogueHeading },
    { type: 'paragraph', text: copy.vogueText },
    { type: 'list', items: copy.vogueItems },
    { type: 'heading', level: 2, text: copy.faqHeading },
    ...copy.faq.flatMap<BlogContentBlock>((item) => [
      { type: 'heading', level: 3, text: item.question },
      { type: 'paragraph', text: item.answer },
    ]),
  ];
}

const enContent = buildContent({
  intro:
    'Social media image prompts work best when they read like channel-ready creative briefs. A useful prompt names the destination, crop, subject hierarchy, brand controls, reference-image needs, and the part of the frame that must stay clean for final design text.',
  tldrHeading: 'TL;DR: build the post before the style',
  tldrItems: [
    'Start with the destination: 1:1 feed post, 4:5 portrait feed, 9:16 story, carousel cover, paid-social concept, or campaign teaser.',
    'Lock subject hierarchy before mood: decide the hero object, how large it appears, where it sits, and what the viewer should read first.',
    'Keep generated text out of the image unless typography is the experiment; reserve clean space for the final headline, logo, price, or legal copy.',
    'Use a reference image whenever product shape, face identity, wardrobe, packaging, color palette, or UI layout must stay recognizable.',
    'Diagnose the first result by channel failure: crop, safe area, focal point, identity drift, clutter, or unusable text space.',
  ],
  heroAlt: 'Sunlit streetwear social media post prompt example from the Vogue AI library',
  heroCaption:
    'This GPT Image 2 prompt-library image works as the article cover because it already behaves like a social post: one clear subject, lifestyle context, strong feed crop, and room for later design decisions.',
  matrixHeading: 'Scenario matrix for social media image prompts',
  matrixHeaders: ['Social job', 'Prompt pattern', 'Best model fit', 'First failure to check'],
  matrixRows: [
    ['Product feed post', 'Product, square crop, studio or lifestyle setting, material detail, brand-color background.', 'GPT Image 2 when product control and instruction following matter.', 'Wrong silhouette, distorted packaging, or background competing with the product.'],
    ['Story launch visual', '9:16 frame, subject placement, swipe-safe negative space, lifestyle energy, no generated text.', 'Nano Banana for fast vertical variations and creator-style exploration.', 'Subject too centered, no safe headline area, or clutter around the sticker zone.'],
    ['Creator portrait', 'Person, wardrobe, expression, daylight or editorial lighting, 4:5 crop, identity rule.', 'GPT Image 2 with a reference when identity matters; Midjourney for mood-first concepts.', 'Face drift, waxy skin, extra fingers, or crop too tight for platform use.'],
    ['Campaign teaser', 'Bold focal subject, poster composition, high contrast, negative space for later typography.', 'Midjourney for stylized poster routes; GPT Image 2 for tighter instruction control.', 'Gibberish text, weak focal point, or no room for design copy.'],
    ['Carousel cover', 'One visual metaphor, central composition, restrained palette, educational or brand context.', 'GPT Image 2 for controlled hierarchy and reusable templates.', 'Too many objects, tiny pseudo-text, or unclear topic signal.'],
  ],
  promptHeading: 'Copyable social media image prompts',
  promptIntro:
    'Copy one block, replace the bracketed variables, and keep the output rule intact for the first generation. These prompt blocks stay in English because they are meant to be pasted directly into image tools.',
  storyAlt: 'Vertical story-style prompt example from the Vogue AI prompt library',
  storyCaption:
    'This Nano Banana example belongs beside story prompts because the tall frame, subject placement, and open composition make it easier to plan stickers, captions, or call-to-action overlays later.',
  anatomyHeading: 'Prompt anatomy that keeps social images usable',
  anatomyHeaders: ['Prompt part', 'What to specify', 'Why it matters on social'],
  anatomyRows: [
    ['Channel', 'Feed, story, reel cover, carousel, ad teaser, profile post, or Pinterest-style pin.', 'The channel decides crop, density, preview behavior, and how much empty space the image needs.'],
    ['Subject', 'Product, person, offer, scene, visual metaphor, or reference image.', 'A weak subject produces attractive images that do not communicate the post topic.'],
    ['Hierarchy', 'Main subject size, placement, background separation, and focal contrast.', 'Users scan quickly; the image needs one obvious read before the details.'],
    ['Brand controls', 'Palette, material, wardrobe, lighting mood, set design, and reference handoff.', 'These controls keep a set of posts from looking like unrelated one-off generations.'],
    ['Text policy', 'No generated text, clean headline area, lower-third space, or typography-only experiment.', 'Final typography is usually more reliable in a design tool than inside generation.'],
    ['Review rule', 'The one failure you will inspect first after generation.', 'It keeps iteration practical instead of rewriting the prompt from taste alone.'],
  ],
  workflowHeading: 'Production workflow: from prompt library to post draft',
  workflowIntro:
    'The fastest social workflow is not to invent a fresh prompt from zero. Start from a prompt-library image that already solves a similar post job, then adapt the structure while changing the subject, reference, and channel rules.',
  workflowItems: [
    'Pick the closest visual family: product ad, creator portrait, story frame, poster, carousel cover, or brand mood image.',
    'Copy the structure, not the exact subject. Keep crop, hierarchy, lighting, and text policy; replace the product, person, offer, or campaign topic.',
    'Add a reference image if identity or product accuracy matters. State exactly what the reference controls.',
    'Generate one controlled first draft, then revise only the biggest channel failure before changing the style.',
    'Save the solved prompt as a reusable label such as story-launch-9x16-safe-top or feed-product-1x1-clean-bg.',
  ],
  workedHeading: 'Worked example: launch post to reusable prompt',
  rawBriefHeading: 'Raw brief',
  rawBrief:
    'You need a launch image for a lightweight streetwear jacket. It should work as a 4:5 Instagram feed post and a paid social concept. The jacket silhouette, color, and model pose matter; headline text will be added later.',
  promptVersionHeading: 'Prompt version 1',
  streetAlt: 'Graphic poster-style social campaign example from the Vogue AI prompt library',
  streetCaption:
    'Use a more graphic Midjourney-style example when the social job is a campaign teaser or poster hook, where mood and thumbnail impact matter more than exact product documentation.',
  diagnosisHeading: 'First-result diagnosis',
  diagnosis:
    'If the jacket looks right but there is no headline space, keep the subject sentence and change crop, placement, and negative-space rules. If the pose and street mood work but the jacket changes shape, add a reference image and state that the reference controls silhouette, color, zipper, and closure details.',
  calloutTitle: 'Revision rule',
  calloutText:
    'Fix channel usability before style. Crop, safe area, subject hierarchy, and identity control decide whether the image can become a real post.',
  mistakeHeading: 'Mistake and fix table',
  mistakeHeaders: ['Failure', 'Fix first', 'Avoid'],
  mistakeRows: [
    ['The image looks good but not usable as a post', 'Add exact crop, safe area, platform destination, and preview behavior.', 'Adding more mood adjectives.'],
    ['No space for headline, price, or logo', 'Reserve a clean top, side, or lower-third area.', 'Asking the model to render final marketing text.'],
    ['Product or face identity drifts', 'Attach a reference and say what must stay fixed.', 'Changing the whole style direction.'],
    ['The post feels generic', 'Add audience, campaign moment, brand palette, material cues, and usage context.', 'Starting from a broad "viral social media post" prompt.'],
    ['Carousel cover is too busy', 'Reduce to one visual metaphor and one focal object.', 'Adding more icons, labels, or tiny text.'],
  ],
  vogueHeading: 'Using Vogue AI for social prompt workflows',
  vogueText:
    'Inside Vogue AI, start from the prompt-library example closest to the social job, then adapt the structure in the workspace. Use GPT Image 2 when instruction control matters, Nano Banana for quick vertical/social variations, and Midjourney when the campaign needs a stylized concept route.',
  vogueItems: [
    'For product posts, protect product shape and packaging before changing the background.',
    'For creator portraits, use a reference when identity, hair, wardrobe, or pose continuity matters.',
    'For stories, decide the safe area before generating so the final design has room for stickers or text.',
    'For carousel covers, remove small text from the prompt and add typography after generation.',
    'For campaign teasers, build two routes: one literal product route and one graphic hook route, then compare thumbnail clarity.',
  ],
  faqHeading: 'FAQ',
  faq: [
    {
      question: 'What makes a good social media image prompt?',
      answer:
        'A good prompt names the platform format, subject, hierarchy, brand controls, safe area, reference rule, and output rule. It should produce a usable first draft, not just a visually interesting image.',
    },
    {
      question: 'Should I include text in the generated image?',
      answer:
        'Usually no. Reserve clean space for a headline, price, logo, or disclaimer, then add final typography in a design tool where spelling, spacing, and brand rules are easier to control.',
    },
    {
      question: 'Which aspect ratio should I prompt for?',
      answer:
        'Use 1:1 for square feed posts, 4:5 for portrait feed posts, 9:16 for stories and reel covers, and 2:3 or 4:5 when the same concept needs a Pinterest-style pin.',
    },
    {
      question: 'When do social prompts need a reference image?',
      answer:
        'Use a reference when identity matters: product silhouette, packaging, face, wardrobe, UI layout, color palette, or a campaign style that must stay consistent across multiple posts.',
    },
    {
      question: 'How many prompt versions should I test?',
      answer:
        'Start with one structured prompt, diagnose the biggest channel failure, and make one targeted revision. Testing five vague prompts is usually less useful than improving one controlled brief.',
    },
    {
      question: 'Can the same prompt work across Instagram, TikTok, Pinterest, and ads?',
      answer:
        'The subject and brand controls can stay the same, but crop, safe area, density, text policy, and preview behavior should change by placement.',
    },
  ],
});

const zhContent = buildContent({
  intro:
    '社媒图片提示词最好写成能直接执行的渠道创意 brief。它需要说明发布位置、画面比例、主体层级、品牌控制、参考图需求，以及哪一块画面必须留给后期标题、Logo、价格或说明文字。',
  tldrHeading: 'TL;DR：先搭好帖子，再写风格',
  tldrItems: [
    '先确定目标渠道：1:1 Feed、4:5 竖版 Feed、9:16 Story、轮播封面、付费广告概念图或活动预热视频。',
    '先锁主体层级，再加氛围词：谁是主角、占画面多大、放在哪里、用户第一眼应该读到什么。',
    '除非测试字体设计，否则不要让模型生成最终文案；把标题、Logo、价格和合规文字留给后期设计。',
    '只要产品形状、人物身份、服装、包装、品牌色或 UI 结构必须稳定，就加入参考图并说明它控制什么。',
    '第一轮结果按渠道问题来诊断：裁切、留白、焦点、身份漂移、杂乱度、文字空间是否可用。',
  ],
  heroAlt: 'Vogue AI 图库中的阳光街头服饰社媒帖子提示词示例',
  heroCaption:
    '这张 GPT Image 2 图适合作为封面，因为它已经像一张可发布的社媒图：主体清楚、生活方式场景明确、Feed 裁切稳定，也给后续设计留下空间。',
  matrixHeading: '社媒图片提示词场景矩阵',
  matrixHeaders: ['社媒任务', '提示词模式', '更适合的模型', '第一轮先检查'],
  matrixRows: [
    ['产品 Feed 图', '产品、方图、棚拍或生活方式场景、材质细节、品牌色背景。', '需要产品控制和指令稳定时优先 GPT Image 2。', '轮廓错误、包装变形、背景抢产品。'],
    ['Story 发布图', '9:16 画面、主体位置、滑动安全留白、生活方式能量、不生成文字。', 'Nano Banana 适合快速探索竖版和创作者风格变体。', '主体过于居中、没有标题安全区、贴纸区域过乱。'],
    ['创作者肖像', '人物、服装、表情、日光或编辑感布光、4:5 裁切、身份规则。', '身份重要时用 GPT Image 2 加参考图；情绪概念优先时可用 Midjourney。', '脸部漂移、皮肤蜡感、多手指、裁切过紧。'],
    ['活动预热视频', '强焦点主体、海报构图、高对比、为后期排版留负空间。', 'Midjourney 适合风格化海报路线；GPT Image 2 适合更精确的控制。', '乱码文字、焦点弱、没有设计文案空间。'],
    ['轮播封面', '一个视觉隐喻、中央构图、克制配色、教育或品牌语境。', 'GPT Image 2 适合可复用模板和稳定层级。', '物体太多、伪小字太多、主题信号不清楚。'],
  ],
  promptHeading: '可直接复制的社媒图片提示词',
  promptIntro:
    '复制下面任一块，替换方括号变量，并保留输出规则。Prompt block 保持英文，因为它们是给图片工具直接粘贴使用的。',
  storyAlt: 'Vogue AI 图库中的竖版 Story 风格提示词示例',
  storyCaption:
    '这张 Nano Banana 示例适合放在 Story 段落旁边：竖版画幅、主体位置和开放构图都方便后期加入贴纸、标题或行动按钮。',
  anatomyHeading: '让社媒图片可用的提示词结构',
  anatomyHeaders: ['提示词部分', '需要写清楚什么', '为什么影响社媒可用性'],
  anatomyRows: [
    ['渠道', 'Feed、Story、Reel 封面、轮播、广告预热、头像帖或 Pinterest 风 Pin。', '渠道决定裁切、信息密度、预览方式以及需要多少留白。'],
    ['主体', '产品、人物、活动、场景、视觉隐喻或参考图。', '主体弱时，结果可能好看但无法传达帖子主题。'],
    ['层级', '主主体大小、位置、背景分离、焦点对比。', '用户快速扫图，画面必须先有一个明确第一读点。'],
    ['品牌控制', '配色、材质、服装、灯光氛围、场景设计、参考图交接。', '这些控制让一组帖子看起来像同一套品牌资产，而不是随机生成图。'],
    ['文字策略', '不生成文字、留标题区、留底部条，或明确是字体实验。', '最终文字通常在设计工具里更可靠，拼写、间距和品牌规范更容易控制。'],
    ['复查规则', '生成后先看哪一个失败点。', '这能避免只凭审美重写整条 prompt。'],
  ],
  workflowHeading: '生产流程：从图库示例到帖子初稿',
  workflowIntro:
    '最快的社媒工作流不是从零写 prompt，而是先找一个已经解决类似任务的图库示例，然后保留结构，替换主体、参考图和渠道规则。',
  workflowItems: [
    '选择最接近的视觉家族：产品广告、创作者肖像、Story 画面、海报、轮播封面或品牌氛围图。',
    '复制结构，不复制题材。保留比例、层级、灯光和文字策略，替换产品、人物、活动或 campaign topic。',
    '如果身份或产品准确性重要，加入参考图，并写清楚参考图控制哪些内容。',
    '先生成一个受控初稿，只修最大的渠道失败点，再考虑改风格。',
    '把成功版本保存成可复用标签，例如 story-launch-9x16-safe-top 或 feed-product-1x1-clean-bg。',
  ],
  workedHeading: '完整示例：从新品发布帖到可复用提示词',
  rawBriefHeading: '原始需求',
  rawBrief:
    '你需要为一件轻量街头夹克做发布图。它要适配 4:5 Instagram Feed，也能作为付费社媒概念图。夹克轮廓、颜色和模特姿势很重要，标题文字会后期加入。',
  promptVersionHeading: '提示词版本 1',
  streetAlt: 'Vogue AI 图库中的图形海报风社媒活动示例',
  streetCaption:
    '当任务是活动预热或海报钩子时，可以用更图形化的 Midjourney 风格示例。此时情绪和缩略图冲击力往往比产品记录准确性更重要。',
  diagnosisHeading: '第一轮诊断',
  diagnosis:
    '如果夹克正确但没有标题空间，保留主体句，只修改裁切、位置和负空间规则。如果姿势和街景氛围正确但夹克形状变了，就加入参考图，并说明参考图控制轮廓、颜色、拉链和闭合细节。',
  calloutTitle: '修订规则',
  calloutText:
    '先修渠道可用性，再修风格。裁切、安全区、主体层级和身份控制决定这张图能不能变成真实帖子。',
  mistakeHeading: '常见错误和修法',
  mistakeHeaders: ['失败表现', '优先修法', '避免'],
  mistakeRows: [
    ['图片好看但不能当帖子用', '补充精确比例、安全区、平台目标和预览方式。', '继续添加氛围形容词。'],
    ['没有标题、价格或 Logo 空间', '指定顶部、侧边或底部干净区域。', '让模型直接生成最终营销文字。'],
    ['产品或人脸身份漂移', '加入参考图，并说明必须固定的部分。', '整条换风格。'],
    ['帖子看起来很泛', '加入受众、活动时刻、品牌色、材质线索和使用场景。', '从“viral social media post”这种宽泛 prompt 开始。'],
    ['轮播封面太杂', '缩减到一个视觉隐喻和一个焦点物体。', '继续添加图标、标签和小字。'],
  ],
  vogueHeading: '在 Vogue AI 中使用社媒提示词工作流',
  vogueText:
    '在 Vogue AI 中，先从最接近社媒任务的 prompt-library 示例开始，再进入 workspace 改结构。需要指令控制时用 GPT Image 2，需要快速竖版/社媒变体时用 Nano Banana，需要风格化 campaign 概念时用 Midjourney。',
  vogueItems: [
    '产品帖：先保护产品形状和包装，再换背景。',
    '创作者肖像：身份、发型、服装或姿势连续性重要时使用参考图。',
    'Story：生成前先决定安全区，给贴纸或文字留空间。',
    '轮播封面：从 prompt 中移除小字，后期再做排版。',
    '活动预热视频：同时做一条真实产品路线和一条图形钩子路线，再比较缩略图清晰度。',
  ],
  faqHeading: 'FAQ',
  faq: [
    { question: '什么是好的社媒图片提示词？', answer: '好的提示词会写清平台格式、主体、层级、品牌控制、安全区、参考图规则和输出限制。目标是得到可继续设计的初稿，而不只是好看的图片。' },
    { question: '生成图里要不要包含文字？', answer: '通常不要。先留出标题、价格、Logo 或免责声明空间，再在设计工具里做最终排版，拼写、间距和品牌规范会更可靠。' },
    { question: '应该写什么比例？', answer: '方形 Feed 用 1:1，竖版 Feed 用 4:5，Story 和 Reel 封面用 9:16，需要 Pinterest 风 Pin 时优先 2:3 或 4:5。' },
    { question: '什么时候必须使用参考图？', answer: '当产品轮廓、包装、人脸、服装、UI 布局、色彩体系或一套 campaign 风格必须保持一致时，就应该用参考图。' },
    { question: '应该测试几个 prompt 版本？', answer: '先用一条结构化 prompt 生成，诊断最大的渠道失败点，再做一次针对性修订。五条模糊 prompt 通常不如一条受控 brief 的迭代有效。' },
    { question: '同一条 prompt 能跨 Instagram、TikTok、Pinterest 和广告使用吗？', answer: '主体和品牌控制可以保留，但裁切、安全区、信息密度、文字策略和预览行为需要按平台调整。' },
  ],
});

const frContent = buildContent({
  intro:
    "Un prompt d'image pour les réseaux sociaux doit fonctionner comme un brief créatif prêt pour un canal précis. Il indique la destination, le cadrage, la hiérarchie du sujet, les règles de marque, le besoin éventuel d'image de référence et la zone qui doit rester propre pour le texte final.",
  tldrHeading: 'TL;DR : construisez le post avant le style',
  tldrItems: [
    'Commencez par la destination : post 1:1, feed portrait 4:5, story 9:16, couverture de carrousel, concept paid social ou teaser de campagne.',
    'Verrouillez la hiérarchie avant l’ambiance : sujet principal, taille dans le cadre, placement et première lecture.',
    'Évitez le texte généré sauf si vous testez la typographie ; gardez une zone propre pour le titre, le logo, le prix ou les mentions.',
    'Ajoutez une image de référence quand la forme du produit, le visage, la tenue, le packaging, la palette ou l’interface doivent rester reconnaissables.',
    'Évaluez le premier rendu par échec de canal : crop, zone sûre, point focal, dérive d’identité, encombrement ou espace texte inutilisable.',
  ],
  heroAlt: 'Exemple de prompt social streetwear ensoleillé dans la bibliothèque Vogue AI',
  heroCaption:
    'Cette image GPT Image 2 fonctionne comme couverture car elle se comporte déjà comme un post social : sujet clair, contexte lifestyle, crop de feed solide et espace pour les décisions de design.',
  matrixHeading: 'Matrice de scénarios pour prompts social media image',
  matrixHeaders: ['Tâche sociale', 'Structure de prompt', 'Modèle le plus adapté', 'Premier échec à vérifier'],
  matrixRows: [
    ['Post produit', 'Produit, format carré, studio ou lifestyle, détail matière, fond couleur de marque.', 'GPT Image 2 quand le contrôle produit et le respect des consignes comptent.', 'Silhouette fausse, packaging déformé ou arrière-plan qui concurrence le produit.'],
    ['Visuel de story', 'Cadre 9:16, placement du sujet, zone sûre, énergie lifestyle, pas de texte généré.', 'Nano Banana pour explorer vite des variantes verticales et creator-style.', 'Sujet trop centré, pas de zone titre, éléments trop chargés autour des stickers.'],
    ['Portrait créateur', 'Personne, tenue, expression, lumière éditoriale ou daylight, crop 4:5, règle d’identité.', 'GPT Image 2 avec référence si l’identité compte ; Midjourney pour les pistes mood-first.', 'Visage qui dérive, peau plastique, doigts en trop ou crop trop serré.'],
    ['Teaser campagne', 'Sujet fort, composition poster, contraste élevé, espace négatif pour la typo finale.', 'Midjourney pour les routes poster stylisées ; GPT Image 2 pour un contrôle plus strict.', 'Texte illisible, point focal faible ou aucun espace pour la copie design.'],
    ['Couverture carrousel', 'Une métaphore visuelle, composition centrale, palette sobre, contexte éducatif ou marque.', 'GPT Image 2 pour une hiérarchie contrôlée et des templates réutilisables.', 'Trop d’objets, pseudo-texte minuscule ou signal de sujet flou.'],
  ],
  promptHeading: 'Prompts social media image à copier',
  promptIntro:
    'Copiez un bloc, remplacez les variables entre crochets et gardez la règle de sortie pour la première génération. Les blocs restent en anglais car ils sont destinés au copier-coller dans les outils image.',
  storyAlt: 'Exemple de prompt vertical story dans la bibliothèque Vogue AI',
  storyCaption:
    'Cet exemple Nano Banana est placé avec les prompts de story : cadre vertical, sujet lisible et composition ouverte pour ajouter ensuite stickers, titre ou appel à l’action.',
  anatomyHeading: 'Anatomie du prompt pour une image sociale utilisable',
  anatomyHeaders: ['Élément', 'À préciser', 'Pourquoi cela compte'],
  anatomyRows: [
    ['Canal', 'Feed, story, reel cover, carrousel, teaser publicitaire, profil ou pin Pinterest-style.', 'Le canal fixe le crop, la densité, le preview et le niveau d’espace vide nécessaire.'],
    ['Sujet', 'Produit, personne, offre, scène, métaphore ou image de référence.', 'Un sujet faible produit de jolies images qui ne disent pas le sujet du post.'],
    ['Hiérarchie', 'Taille du sujet, placement, séparation du fond et contraste focal.', 'L’utilisateur scanne vite ; l’image doit avoir une lecture immédiate.'],
    ['Contrôles de marque', 'Palette, matière, tenue, lumière, décor et consignes de référence.', 'Ils évitent que chaque post ressemble à une génération isolée.'],
    ['Politique de texte', 'Pas de texte généré, zone titre propre, lower-third, ou test typographique assumé.', 'La typographie finale est plus fiable dans un outil de design.'],
    ['Règle de revue', 'Le premier échec à inspecter après génération.', 'Cela évite de réécrire le prompt uniquement au goût.'],
  ],
  workflowHeading: 'Workflow de production : de la bibliothèque au post',
  workflowIntro:
    'Le workflow le plus rapide ne part pas de zéro. Choisissez une image de bibliothèque qui résout déjà une tâche proche, puis adaptez la structure en changeant le sujet, la référence et les règles de canal.',
  workflowItems: [
    'Choisissez la famille visuelle la plus proche : pub produit, portrait créateur, story, poster, carrousel ou mood de marque.',
    'Copiez la structure, pas le sujet exact. Gardez crop, hiérarchie, lumière et règle de texte ; remplacez produit, personne, offre ou campagne.',
    'Ajoutez une référence si l’identité ou la précision produit compte, et dites exactement ce qu’elle contrôle.',
    'Générez un premier rendu contrôlé, puis corrigez le plus gros échec de canal avant de changer le style.',
    'Enregistrez la version gagnante avec un libellé réutilisable comme story-launch-9x16-safe-top.',
  ],
  workedHeading: 'Exemple complet : du lancement au prompt réutilisable',
  rawBriefHeading: 'Brief brut',
  rawBrief:
    'Vous devez créer une image de lancement pour une veste streetwear légère. Elle doit fonctionner en feed Instagram 4:5 et en concept paid social. La silhouette, la couleur et la pose comptent ; le titre sera ajouté plus tard.',
  promptVersionHeading: 'Version de prompt 1',
  streetAlt: 'Exemple de campagne sociale façon poster graphique dans Vogue AI',
  streetCaption:
    'Utilisez une piste Midjourney plus graphique quand le besoin est un teaser de campagne ou un hook de poster, où l’impact en vignette compte plus que la documentation produit exacte.',
  diagnosisHeading: 'Diagnostic du premier rendu',
  diagnosis:
    'Si la veste est correcte mais sans espace de titre, gardez la phrase sujet et changez crop, placement et espace négatif. Si la pose fonctionne mais que la veste change, ajoutez une référence et dites qu’elle contrôle silhouette, couleur, zip et fermeture.',
  calloutTitle: 'Règle de révision',
  calloutText:
    'Corrigez l’usage canal avant le style. Crop, zone sûre, hiérarchie et contrôle d’identité décident si l’image peut devenir un vrai post.',
  mistakeHeading: 'Erreurs et corrections',
  mistakeHeaders: ['Échec', 'Correction prioritaire', 'À éviter'],
  mistakeRows: [
    ['Belle image mais inutilisable en post', 'Ajoutez crop, zone sûre, destination et preview.', 'Empiler des adjectifs de mood.'],
    ['Aucun espace pour titre, prix ou logo', 'Réservez une zone propre en haut, côté ou bas.', 'Demander au modèle de composer le texte final.'],
    ['Produit ou visage qui dérive', 'Ajoutez une référence et listez ce qui doit rester fixe.', 'Changer toute la direction de style.'],
    ['Post trop générique', 'Ajoutez audience, moment de campagne, palette, matière et contexte.', 'Partir d’un prompt vague de type viral social media post.'],
    ['Couverture carrousel trop chargée', 'Réduisez à une métaphore et un objet focal.', 'Ajouter icônes, labels et micro-texte.'],
  ],
  vogueHeading: 'Utiliser ce workflow social dans Vogue AI',
  vogueText:
    'Dans Vogue AI, partez de l’exemple de prompt-library le plus proche, puis adaptez la structure dans le workspace. Utilisez GPT Image 2 pour le contrôle, Nano Banana pour les variantes verticales rapides, et Midjourney pour les routes stylisées de campagne.',
  vogueItems: [
    'Pour les posts produit, protégez forme et packaging avant de changer le fond.',
    'Pour les portraits, utilisez une référence si identité, cheveux, tenue ou pose doivent rester cohérents.',
    'Pour les stories, décidez la zone sûre avant génération.',
    'Pour les carrousels, retirez le petit texte du prompt et ajoutez la typo ensuite.',
    'Pour les teasers, créez une route produit littérale et une route hook graphique, puis comparez la lisibilité en vignette.',
  ],
  faqHeading: 'FAQ',
  faq: [
    { question: "Qu'est-ce qu'un bon prompt social media image ?", answer: 'Il indique format, sujet, hiérarchie, marque, zone sûre, référence et règle de sortie. Il doit produire un brouillon utilisable, pas seulement une image jolie.' },
    { question: "Faut-il inclure du texte dans l'image générée ?", answer: 'Le plus souvent non. Réservez un espace propre, puis ajoutez le titre, le prix, le logo ou les mentions dans un outil de design.' },
    { question: 'Quel ratio demander ?', answer: '1:1 pour feed carré, 4:5 pour feed portrait, 9:16 pour story et reel cover, 2:3 ou 4:5 pour un pin Pinterest-style.' },
    { question: 'Quand utiliser une image de référence ?', answer: 'Dès que silhouette produit, packaging, visage, tenue, UI, palette ou style de campagne doivent rester cohérents.' },
    { question: 'Combien de versions tester ?', answer: 'Commencez par un prompt structuré, corrigez le plus gros échec de canal, puis faites une révision ciblée.' },
    { question: 'Le même prompt marche-t-il sur Instagram, TikTok, Pinterest et en publicité ?', answer: 'Le sujet et la marque peuvent rester, mais crop, zone sûre, densité, texte et preview doivent changer selon le placement.' },
  ],
});

const ruContent = buildContent({
  intro:
    'Prompt для social media image должен быть готовым к каналу creative brief. Он задает площадку, кадрирование, иерархию объекта, бренд-контроль, необходимость reference image и область, которая должна остаться чистой для финального текста.',
  tldrHeading: 'TL;DR: сначала соберите пост, потом стиль',
  tldrItems: [
    'Начните с назначения: 1:1 feed, 4:5 portrait feed, 9:16 story, carousel cover, paid-social concept или campaign teaser.',
    'Сначала зафиксируйте иерархию: главный объект, размер в кадре, позицию и первую визуальную точку.',
    'Не просите модель писать финальный текст, если это не тест типографики; оставьте чистое место для заголовка, логотипа, цены или дисклеймера.',
    'Используйте reference image, если форма продукта, лицо, одежда, упаковка, палитра или UI должны остаться узнаваемыми.',
    'Первый результат проверяйте по ошибкам канала: crop, safe area, focal point, identity drift, clutter или отсутствие места под текст.',
  ],
  heroAlt: 'Пример social media prompt с уличной одеждой из библиотеки Vogue AI',
  heroCaption:
    'Эта GPT Image 2 картинка подходит для обложки: один ясный объект, lifestyle-контекст, удачный feed crop и место для дальнейшего дизайна.',
  matrixHeading: 'Матрица сценариев для social media image prompts',
  matrixHeaders: ['Задача', 'Паттерн prompt', 'Лучший выбор модели', 'Что проверить первым'],
  matrixRows: [
    ['Пост с продуктом', 'Продукт, квадрат, студия или lifestyle, фактура, фон в цветах бренда.', 'GPT Image 2, когда важны контроль продукта и следование инструкциям.', 'Неверный силуэт, искаженная упаковка или фон спорит с продуктом.'],
    ['Story для запуска', '9:16, позиция объекта, безопасная зона, lifestyle-энергия, без текста.', 'Nano Banana для быстрых вертикальных и creator-style вариантов.', 'Объект слишком по центру, нет места под заголовок, зона стикеров перегружена.'],
    ['Портрет автора', 'Человек, одежда, выражение, editorial/daylight light, crop 4:5, правило идентичности.', 'GPT Image 2 с reference для идентичности; Midjourney для mood-first концептов.', 'Лицо меняется, кожа пластиковая, лишние пальцы или слишком тесный crop.'],
    ['Тизер кампании', 'Сильный объект, poster composition, высокий контраст, negative space для типографики.', 'Midjourney для стилизованных poster routes; GPT Image 2 для точного контроля.', 'Нечитаемый текст, слабый фокус или нет места под дизайн-копи.'],
    ['Обложка карусели', 'Одна визуальная метафора, центральная композиция, сдержанная палитра, образовательный или бренд-контекст.', 'GPT Image 2 для контролируемой иерархии и reusable templates.', 'Слишком много объектов, псевдомелкий текст или неясная тема.'],
  ],
  promptHeading: 'Копируемые social media image prompts',
  promptIntro:
    'Скопируйте блок, замените переменные в квадратных скобках и сохраните output rule для первой генерации. Prompt blocks остаются на английском, потому что их нужно вставлять прямо в image tools.',
  storyAlt: 'Вертикальный story-style пример из библиотеки Vogue AI',
  storyCaption:
    'Этот Nano Banana пример подходит к story prompts: вертикальный кадр, читаемый объект и открытая композиция помогают позже добавить stickers, caption или CTA.',
  anatomyHeading: 'Анатомия prompt для usable social image',
  anatomyHeaders: ['Часть prompt', 'Что указать', 'Почему это важно'],
  anatomyRows: [
    ['Канал', 'Feed, story, reel cover, carousel, ad teaser, profile post или Pinterest-style pin.', 'Канал определяет crop, плотность, preview и объем пустого пространства.'],
    ['Объект', 'Продукт, человек, оффер, сцена, метафора или reference image.', 'Слабый объект дает красивую картинку, которая не объясняет тему поста.'],
    ['Иерархия', 'Размер объекта, позиция, отделение от фона и focal contrast.', 'Пользователь быстро сканирует изображение; нужна ясная первая точка чтения.'],
    ['Бренд-контроль', 'Палитра, материал, одежда, свет, декор и reference handoff.', 'Это делает серию постов связной, а не набором случайных генераций.'],
    ['Политика текста', 'No generated text, clean headline area, lower-third или typography experiment.', 'Финальную типографику надежнее делать в design tool.'],
    ['Правило проверки', 'Одна ошибка, которую вы проверяете первой.', 'Это удерживает итерацию практичной и не дает переписывать prompt по вкусу.'],
  ],
  workflowHeading: 'Production workflow: от prompt library к черновику поста',
  workflowIntro:
    'Самый быстрый social workflow не начинается с нуля. Найдите prompt-library image, которая уже решает похожую задачу, затем адаптируйте структуру: subject, reference и channel rules.',
  workflowItems: [
    'Выберите близкую визуальную семью: product ad, creator portrait, story frame, poster, carousel cover или brand mood image.',
    'Копируйте структуру, не точный subject. Оставьте crop, hierarchy, lighting и text policy; замените продукт, человека, оффер или тему.',
    'Добавьте reference, если важна идентичность или точность продукта, и укажите, что именно он контролирует.',
    'Сгенерируйте один контролируемый первый draft, затем исправьте самый крупный channel failure.',
    'Сохраните рабочую версию с названием вроде story-launch-9x16-safe-top.',
  ],
  workedHeading: 'Пример: от launch post к reusable prompt',
  rawBriefHeading: 'Исходный brief',
  rawBrief:
    'Нужна launch image для легкой streetwear jacket. Она должна работать как Instagram feed 4:5 и paid social concept. Важны силуэт, цвет и поза модели; headline будет добавлен позже.',
  promptVersionHeading: 'Версия prompt 1',
  streetAlt: 'Графический poster-style пример social campaign из Vogue AI',
  streetCaption:
    'Более графичный Midjourney-style пример подходит для campaign teaser или poster hook, где mood и thumbnail impact важнее точной продуктовой документации.',
  diagnosisHeading: 'Диагностика первого результата',
  diagnosis:
    'Если куртка выглядит правильно, но нет места под headline, сохраните subject sentence и поменяйте crop, placement и negative space. Если поза работает, но форма куртки меняется, добавьте reference image и закрепите silhouette, color, zipper и closure details.',
  calloutTitle: 'Правило ревизии',
  calloutText:
    'Сначала исправляйте применимость к каналу, потом стиль. Crop, safe area, hierarchy и identity control решают, станет ли изображение настоящим постом.',
  mistakeHeading: 'Ошибки и исправления',
  mistakeHeaders: ['Ошибка', 'Что исправить первым', 'Чего избегать'],
  mistakeRows: [
    ['Картинка красивая, но не подходит для поста', 'Добавьте crop, safe area, destination и preview behavior.', 'Больше mood adjectives.'],
    ['Нет места для заголовка, цены или логотипа', 'Зарезервируйте чистую область сверху, сбоку или снизу.', 'Просить модель рисовать финальный текст.'],
    ['Продукт или лицо меняются', 'Добавьте reference и перечислите фиксированные элементы.', 'Менять весь стиль.'],
    ['Пост выглядит generic', 'Добавьте audience, campaign moment, brand palette, material cues и usage context.', 'Начинать с широкого viral social media post prompt.'],
    ['Carousel cover перегружен', 'Оставьте одну метафору и один focal object.', 'Добавлять иконки, labels и tiny text.'],
  ],
  vogueHeading: 'Social prompt workflow в Vogue AI',
  vogueText:
    'В Vogue AI начните с ближайшего prompt-library примера, затем адаптируйте структуру в workspace. GPT Image 2 подходит для instruction control, Nano Banana для быстрых vertical/social variations, Midjourney для stylized campaign concepts.',
  vogueItems: [
    'Для product posts сначала защитите форму продукта и packaging, потом меняйте фон.',
    'Для portraits используйте reference, если важны identity, hair, wardrobe или pose continuity.',
    'Для stories задайте safe area до генерации.',
    'Для carousel covers уберите small text из prompt и добавьте typography позже.',
    'Для campaign teasers сделайте literal product route и graphic hook route, затем сравните thumbnail clarity.',
  ],
  faqHeading: 'FAQ',
  faq: [
    { question: 'Что делает social media image prompt хорошим?', answer: 'Он задает формат платформы, subject, hierarchy, brand controls, safe area, reference rule и output rule. Цель - usable first draft, а не просто красивая картинка.' },
    { question: 'Нужно ли включать текст в generated image?', answer: 'Обычно нет. Оставьте чистую область для headline, price, logo или disclaimer, а финальную типографику добавьте в design tool.' },
    { question: 'Какой aspect ratio выбрать?', answer: '1:1 для square feed, 4:5 для portrait feed, 9:16 для stories и reel covers, 2:3 или 4:5 для Pinterest-style pin.' },
    { question: 'Когда нужен reference image?', answer: 'Когда важны product silhouette, packaging, face, wardrobe, UI layout, color palette или campaign style consistency.' },
    { question: 'Сколько версий prompt тестировать?', answer: 'Начните с одного structured prompt, найдите главный channel failure и сделайте targeted revision.' },
    { question: 'Один prompt подойдет для Instagram, TikTok, Pinterest и ads?', answer: 'Subject и brand controls могут сохраниться, но crop, safe area, density, text policy и preview behavior нужно менять под placement.' },
  ],
});

const ptContent = buildContent({
  intro:
    'Um prompt de social media image funciona melhor como um brief criativo pronto para o canal. Ele define destino, enquadramento, hierarquia do assunto, controles de marca, necessidade de referência e a área que deve ficar limpa para o texto final.',
  tldrHeading: 'TL;DR: monte o post antes do estilo',
  tldrItems: [
    'Comece pelo destino: feed 1:1, feed vertical 4:5, story 9:16, capa de carrossel, conceito de anúncio ou teaser de campanha.',
    'Trave a hierarquia antes do clima: assunto principal, tamanho no quadro, posição e primeira leitura.',
    'Evite texto gerado, salvo em testes de tipografia; deixe espaço limpo para título, logo, preço ou aviso legal.',
    'Use imagem de referência quando forma do produto, rosto, roupa, embalagem, paleta ou UI precisam continuar reconhecíveis.',
    'Avalie o primeiro resultado por falha de canal: corte, área segura, foco, identidade, poluição visual ou falta de espaço para texto.',
  ],
  heroAlt: 'Exemplo de post social streetwear ensolarado da biblioteca Vogue AI',
  heroCaption:
    'Esta imagem GPT Image 2 funciona como capa porque já parece um post social: assunto claro, contexto lifestyle, bom corte de feed e espaço para decisões de design.',
  matrixHeading: 'Matriz de cenários para social media image prompts',
  matrixHeaders: ['Tarefa social', 'Padrão de prompt', 'Modelo mais indicado', 'Primeira falha a verificar'],
  matrixRows: [
    ['Post de produto', 'Produto, formato quadrado, estúdio ou lifestyle, detalhe de material, fundo com cor da marca.', 'GPT Image 2 quando controle do produto e instrução importam.', 'Silhueta errada, embalagem distorcida ou fundo competindo com o produto.'],
    ['Visual de story', 'Frame 9:16, posição do assunto, espaço seguro, energia lifestyle, sem texto gerado.', 'Nano Banana para variações verticais rápidas e estilo creator.', 'Assunto muito central, sem área para título ou stickers demais.'],
    ['Retrato creator', 'Pessoa, roupa, expressão, luz editorial ou daylight, crop 4:5, regra de identidade.', 'GPT Image 2 com referência quando identidade importa; Midjourney para conceitos mood-first.', 'Rosto muda, pele artificial, dedos extras ou corte apertado.'],
    ['Teaser de campanha', 'Assunto forte, composição de pôster, alto contraste, espaço negativo para tipografia.', 'Midjourney para rotas estilizadas; GPT Image 2 para controle mais rígido.', 'Texto sem sentido, foco fraco ou sem espaço para copy.'],
    ['Capa de carrossel', 'Uma metáfora visual, composição central, paleta contida, contexto educativo ou de marca.', 'GPT Image 2 para hierarquia controlada e templates reutilizáveis.', 'Objetos demais, pseudo-texto pequeno ou tema pouco claro.'],
  ],
  promptHeading: 'Social media image prompts para copiar',
  promptIntro:
    'Copie um bloco, substitua as variáveis entre colchetes e mantenha a regra de saída na primeira geração. Os blocos ficam em inglês porque são feitos para colar direto em ferramentas de imagem.',
  storyAlt: 'Exemplo vertical de story da biblioteca Vogue AI',
  storyCaption:
    'Este exemplo Nano Banana combina com prompts de story porque o frame vertical, a posição do assunto e a composição aberta facilitam adicionar stickers, título ou CTA depois.',
  anatomyHeading: 'Anatomia do prompt para imagens sociais úteis',
  anatomyHeaders: ['Parte do prompt', 'O que especificar', 'Por que importa'],
  anatomyRows: [
    ['Canal', 'Feed, story, reel cover, carrossel, teaser de anúncio, perfil ou pin estilo Pinterest.', 'O canal decide corte, densidade, preview e espaço vazio necessário.'],
    ['Assunto', 'Produto, pessoa, oferta, cena, metáfora visual ou imagem de referência.', 'Um assunto fraco gera imagens bonitas que não comunicam o tema do post.'],
    ['Hierarquia', 'Tamanho, posição, separação do fundo e contraste focal.', 'A leitura é rápida; a imagem precisa de um primeiro ponto claro.'],
    ['Controles de marca', 'Paleta, material, roupa, luz, cenário e regra de referência.', 'Mantêm uma série de posts visualmente consistente.'],
    ['Política de texto', 'Sem texto gerado, área de título limpa, lower-third ou experimento tipográfico.', 'A tipografia final é mais confiável numa ferramenta de design.'],
    ['Regra de revisão', 'A primeira falha a checar após gerar.', 'Evita reescrever o prompt por gosto subjetivo.'],
  ],
  workflowHeading: 'Fluxo de produção: da biblioteca ao rascunho do post',
  workflowIntro:
    'O fluxo mais rápido não começa do zero. Escolha uma imagem da biblioteca que já resolva uma tarefa parecida e adapte a estrutura trocando assunto, referência e regras do canal.',
  workflowItems: [
    'Escolha a família visual mais próxima: anúncio de produto, retrato creator, story, pôster, capa de carrossel ou mood de marca.',
    'Copie a estrutura, não o assunto exato. Mantenha crop, hierarquia, luz e regra de texto; troque produto, pessoa, oferta ou campanha.',
    'Adicione referência quando identidade ou precisão do produto importam, dizendo exatamente o que ela controla.',
    'Gere um primeiro rascunho controlado e corrija a maior falha de canal antes de mudar o estilo.',
    'Salve a versão resolvida com um rótulo reutilizável, como story-launch-9x16-safe-top.',
  ],
  workedHeading: 'Exemplo completo: do lançamento ao prompt reutilizável',
  rawBriefHeading: 'Brief original',
  rawBrief:
    'Você precisa de uma imagem de lançamento para uma jaqueta streetwear leve. Ela deve funcionar como post Instagram 4:5 e conceito de paid social. Silhueta, cor e pose importam; o título será adicionado depois.',
  promptVersionHeading: 'Versão de prompt 1',
  streetAlt: 'Exemplo de campanha social em estilo pôster gráfico no Vogue AI',
  streetCaption:
    'Use um exemplo mais gráfico estilo Midjourney quando a tarefa for teaser de campanha ou gancho de pôster, onde impacto de miniatura vale mais que documentação exata do produto.',
  diagnosisHeading: 'Diagnóstico do primeiro resultado',
  diagnosis:
    'Se a jaqueta está correta mas não há espaço para título, mantenha a frase do assunto e mude crop, posição e espaço negativo. Se a pose funciona mas a jaqueta muda, adicione referência e diga que ela controla silhueta, cor, zíper e fechamento.',
  calloutTitle: 'Regra de revisão',
  calloutText:
    'Corrija a utilidade no canal antes do estilo. Crop, área segura, hierarquia e identidade decidem se a imagem pode virar um post real.',
  mistakeHeading: 'Erros e correções',
  mistakeHeaders: ['Falha', 'Corrigir primeiro', 'Evitar'],
  mistakeRows: [
    ['Imagem bonita, mas inútil como post', 'Adicione crop, área segura, destino e preview.', 'Mais adjetivos de clima.'],
    ['Sem espaço para título, preço ou logo', 'Reserve área limpa no topo, lateral ou rodapé.', 'Pedir texto final ao modelo.'],
    ['Produto ou rosto mudam', 'Adicione referência e liste o que deve ficar fixo.', 'Trocar toda a direção visual.'],
    ['Post genérico', 'Adicione público, momento de campanha, paleta, material e uso.', 'Começar com viral social media post amplo.'],
    ['Capa de carrossel lotada', 'Reduza a uma metáfora e um objeto focal.', 'Adicionar ícones, labels e texto minúsculo.'],
  ],
  vogueHeading: 'Usando o workflow social no Vogue AI',
  vogueText:
    'No Vogue AI, parta do exemplo da prompt-library mais próximo e adapte a estrutura no workspace. Use GPT Image 2 para controle, Nano Banana para variações verticais rápidas e Midjourney para rotas de campanha estilizadas.',
  vogueItems: [
    'Em posts de produto, proteja forma e embalagem antes de trocar o fundo.',
    'Em retratos, use referência quando identidade, cabelo, roupa ou pose precisam continuar.',
    'Em stories, defina a área segura antes de gerar.',
    'Em capas de carrossel, remova texto pequeno do prompt e adicione tipografia depois.',
    'Em teasers, crie uma rota literal de produto e uma rota de gancho gráfico, depois compare a clareza em miniatura.',
  ],
  faqHeading: 'FAQ',
  faq: [
    { question: 'O que torna bom um social media image prompt?', answer: 'Ele define formato, assunto, hierarquia, controles de marca, área segura, referência e regra de saída. O objetivo é um rascunho utilizável, não só uma imagem bonita.' },
    { question: 'Devo incluir texto na imagem gerada?', answer: 'Geralmente não. Reserve espaço limpo e adicione título, preço, logo ou aviso numa ferramenta de design.' },
    { question: 'Qual proporção usar?', answer: '1:1 para feed quadrado, 4:5 para feed retrato, 9:16 para stories e reel covers, 2:3 ou 4:5 para pin estilo Pinterest.' },
    { question: 'Quando usar imagem de referência?', answer: 'Quando silhueta do produto, embalagem, rosto, roupa, layout de UI, paleta ou estilo de campanha precisam ser consistentes.' },
    { question: 'Quantas versões testar?', answer: 'Comece com um prompt estruturado, diagnostique a maior falha de canal e faça uma revisão direcionada.' },
    { question: 'O mesmo prompt serve para Instagram, TikTok, Pinterest e anúncios?', answer: 'Assunto e marca podem permanecer, mas crop, área segura, densidade, texto e preview devem mudar por placement.' },
  ],
});

const jaContent = buildContent({
  intro:
    'Social media image prompt は、各チャネルですぐ使える短いクリエイティブ brief として書くのが最も有効です。掲載先、比率、主題の階層、ブランド制御、参考画像の必要性、後から文字を置くための余白を明確にします。',
  tldrHeading: 'TL;DR：スタイルの前に投稿設計を作る',
  tldrItems: [
    'まず掲載先を決めます。1:1 feed、4:5 portrait feed、9:16 story、carousel cover、paid social concept、campaign teaser などです。',
    'ムード語の前に主題階層を固定します。主役は何か、どの大きさで、どこに置き、何を最初に読ませるかを決めます。',
    'タイポグラフィ実験でない限り、生成画像に最終テキストを書かせず、見出し、ロゴ、価格、注記のための余白を残します。',
    '商品形状、顔、衣装、パッケージ、配色、UI が認識可能である必要がある場合は参考画像を使います。',
    '初回結果はチャネルの失敗で見ます。crop、安全領域、焦点、identity drift、 clutter、文字スペースです。',
  ],
  heroAlt: 'Vogue AI ライブラリの陽光ストリートウェア social post prompt 例',
  heroCaption:
    'この GPT Image 2 画像は、明確な主題、lifestyle 文脈、feed 向きの crop、後工程の余白があり、記事カバーとして適しています。',
  matrixHeading: 'Social media image prompts のシナリオ表',
  matrixHeaders: ['ソーシャル用途', 'Prompt パターン', '向いているモデル', '最初に確認する失敗'],
  matrixRows: [
    ['商品 Feed 投稿', '商品、正方形、スタジオまたは lifestyle、素材感、ブランドカラー背景。', '商品制御と指示遵守が重要な場合は GPT Image 2。', 'シルエット違い、パッケージ歪み、背景が商品より目立つ。'],
    ['Story ローンチ画像', '9:16、主題配置、safe area、lifestyle 感、生成文字なし。', 'Nano Banana は縦型や creator-style の高速探索に向きます。', '主題が中央すぎる、見出し余白がない、sticker 周辺が混雑。'],
    ['クリエイター肖像', '人物、衣装、表情、editorial/daylight 光、4:5 crop、identity rule。', 'identity が重要なら GPT Image 2 + reference、 mood-first なら Midjourney。', '顔の変化、人工的な肌、指の崩れ、crop が狭すぎる。'],
    ['キャンペーン予告', '強い主題、poster composition、高コントラスト、後から文字を置く余白。', 'スタイライズされた poster route は Midjourney、厳密制御は GPT Image 2。', '意味不明な文字、弱い焦点、design copy の余白不足。'],
    ['カルーセル表紙', '一つの視覚メタファー、中央構図、抑えた配色、教育またはブランド文脈。', '制御された階層と再利用テンプレートには GPT Image 2。', '物が多すぎる、小さな疑似文字、テーマが曖昧。'],
  ],
  promptHeading: 'コピーして使える social media image prompts',
  promptIntro:
    'ブロックをコピーし、角括弧の変数を置き換え、初回生成では output rule を残します。Prompt block は画像ツールに直接貼るため英語のままにします。',
  storyAlt: 'Vogue AI ライブラリの縦型 story-style prompt 例',
  storyCaption:
    'この Nano Banana 例は story prompt に適しています。縦型フレーム、主題配置、開いた構図により、後から sticker、caption、CTA を置きやすくなります。',
  anatomyHeading: '使えるソーシャル画像にする prompt 構造',
  anatomyHeaders: ['Prompt 部分', '指定すること', 'ソーシャルで重要な理由'],
  anatomyRows: [
    ['チャネル', 'Feed、story、reel cover、carousel、ad teaser、profile post、Pinterest-style pin。', 'チャネルが crop、密度、preview、必要な余白を決めます。'],
    ['主題', '商品、人物、offer、scene、visual metaphor、reference image。', '主題が弱いと、きれいでも投稿テーマが伝わりません。'],
    ['階層', '主題サイズ、位置、背景分離、焦点コントラスト。', 'ユーザーは素早く見るため、最初に読む場所が必要です。'],
    ['ブランド制御', '配色、素材、衣装、光、セット、reference handoff。', '投稿セット全体を一貫したブランド資産にします。'],
    ['文字方針', 'No generated text、clean headline area、lower-third、または typography experiment。', '最終タイポグラフィは design tool で作る方が安定します。'],
    ['レビュー規則', '生成後に最初に確認する失敗点。', '好みだけで prompt 全体を書き直すのを防ぎます。'],
  ],
  workflowHeading: '制作フロー：prompt library から投稿ドラフトへ',
  workflowIntro:
    '最速の social workflow はゼロから書くことではありません。似た投稿課題をすでに解いている prompt-library image を選び、subject、reference、channel rules を差し替えます。',
  workflowItems: [
    '近い視覚ファミリーを選びます。product ad、creator portrait、story frame、poster、carousel cover、brand mood image などです。',
    '正確な題材ではなく構造をコピーします。crop、hierarchy、lighting、text policy を残し、商品、人物、offer、campaign topic を替えます。',
    'identity や商品精度が重要なら reference を追加し、何を固定するかを書きます。',
    '一つの制御された first draft を生成し、最大の channel failure だけを直します。',
    '解決した prompt を story-launch-9x16-safe-top のような再利用ラベルで保存します。',
  ],
  workedHeading: '実例：ローンチ投稿から再利用 prompt へ',
  rawBriefHeading: '元の brief',
  rawBrief:
    '軽量 streetwear jacket のローンチ画像が必要です。Instagram feed 4:5 と paid social concept の両方で使います。ジャケットのシルエット、色、モデルのポーズが重要で、見出しは後から追加します。',
  promptVersionHeading: 'Prompt バージョン 1',
  streetAlt: 'Vogue AI のグラフィック poster-style social campaign 例',
  streetCaption:
    'Campaign teaser や poster hook では、正確な商品記録よりも mood と thumbnail impact が重要になるため、よりグラフィックな Midjourney-style 例が役立ちます。',
  diagnosisHeading: '初回結果の診断',
  diagnosis:
    'ジャケットは正しいが見出し余白がない場合、subject sentence は残し、crop、placement、negative space を変えます。ポーズは良いが形が変わる場合、reference image を追加し、silhouette、color、zipper、closure details を固定します。',
  calloutTitle: '修正ルール',
  calloutText:
    'スタイルより先にチャネルで使えるかを直します。crop、safe area、hierarchy、identity control が実際の投稿になるかを決めます。',
  mistakeHeading: 'よくある失敗と修正',
  mistakeHeaders: ['失敗', '先に直すこと', '避けること'],
  mistakeRows: [
    ['画像はきれいだが投稿に使えない', 'crop、safe area、destination、preview behavior を追加。', 'ムード形容詞を増やす。'],
    ['見出し、価格、ロゴの余白がない', '上、横、下に clean area を確保。', 'モデルに最終テキストを書かせる。'],
    ['商品や顔が変わる', 'reference を追加し、固定する要素を書く。', '全体の style direction を変える。'],
    ['投稿が generic に見える', 'audience、campaign moment、brand palette、material cues、usage context を追加。', '広すぎる viral social media post から始める。'],
    ['carousel cover が混雑する', '一つの metaphor と一つの focal object に減らす。', 'アイコン、ラベル、小文字を増やす。'],
  ],
  vogueHeading: 'Vogue AI での social prompt workflow',
  vogueText:
    'Vogue AI では、近い prompt-library example から始め、workspace で構造を調整します。指示制御は GPT Image 2、縦型/social variation は Nano Banana、スタイル化された campaign concept は Midjourney が向いています。',
  vogueItems: [
    'Product posts では、背景を変える前に商品形状と packaging を守ります。',
    'Portraits では、identity、hair、wardrobe、pose continuity が重要なら reference を使います。',
    'Stories では、生成前に safe area を決めます。',
    'Carousel covers では、prompt から small text を外し、typography は後工程で追加します。',
    'Campaign teasers では、literal product route と graphic hook route を作り、thumbnail clarity を比較します。',
  ],
  faqHeading: 'FAQ',
  faq: [
    { question: '良い social media image prompt とは何ですか？', answer: 'Platform format、subject、hierarchy、brand controls、safe area、reference rule、output rule を明確にし、ただ美しい画像ではなく使える first draft を作れる prompt です。' },
    { question: '生成画像に文字を入れるべきですか？', answer: '通常は入れません。headline、price、logo、disclaimer の余白を残し、最終文字は design tool で追加します。' },
    { question: 'どの aspect ratio を指定しますか？', answer: 'Square feed は 1:1、portrait feed は 4:5、stories と reel covers は 9:16、Pinterest-style pin は 2:3 または 4:5 が向いています。' },
    { question: 'いつ reference image が必要ですか？', answer: 'Product silhouette、packaging、face、wardrobe、UI layout、color palette、campaign style consistency が必要なときです。' },
    { question: '何個の prompt version を試すべきですか？', answer: '一つの structured prompt から始め、最大の channel failure を診断し、targeted revision を一回ずつ行う方が有効です。' },
    { question: '同じ prompt は Instagram、TikTok、Pinterest、広告に使えますか？', answer: 'Subject と brand controls は残せますが、crop、safe area、density、text policy、preview behavior は placement ごとに変える必要があります。' },
  ],
});

const koContent = buildContent({
  intro:
    'Social media image prompt는 채널에 바로 맞는 짧은 creative brief처럼 작성해야 합니다. 목적지, 비율, 주제 hierarchy, brand control, reference image 필요 여부, 최종 텍스트를 위해 비워둘 영역을 명확히 합니다.',
  tldrHeading: 'TL;DR: 스타일보다 게시물 구조를 먼저 만들기',
  tldrItems: [
    '먼저 목적지를 정합니다: 1:1 feed, 4:5 portrait feed, 9:16 story, carousel cover, paid-social concept, campaign teaser.',
    '무드 단어보다 subject hierarchy를 먼저 고정합니다. 주인공, 크기, 위치, 첫 시선 포인트를 정합니다.',
    '타이포그래피 실험이 아니라면 generated text를 피하고 headline, logo, price, legal copy를 위한 clean area를 남깁니다.',
    '제품 형태, 얼굴, 의상, 패키지, 브랜드 컬러, UI layout이 유지돼야 하면 reference image를 사용합니다.',
    '첫 결과는 channel failure로 진단합니다: crop, safe area, focal point, identity drift, clutter, text space.',
  ],
  heroAlt: 'Vogue AI 라이브러리의 햇빛 스트리트웨어 social post prompt 예시',
  heroCaption:
    '이 GPT Image 2 이미지는 명확한 주제, lifestyle context, feed-friendly crop, 후속 디자인 여백을 갖추고 있어 article cover로 적합합니다.',
  matrixHeading: 'Social media image prompts 시나리오 매트릭스',
  matrixHeaders: ['소셜 작업', 'Prompt 패턴', '적합한 모델', '먼저 확인할 실패'],
  matrixRows: [
    ['제품 Feed 게시물', '제품, square crop, studio 또는 lifestyle setting, material detail, brand-color background.', '제품 제어와 지시 준수가 중요하면 GPT Image 2.', '잘못된 silhouette, 왜곡된 packaging, 제품보다 강한 background.'],
    ['Story 출시 이미지', '9:16 프레임, 주제 위치, swipe-safe negative space, lifestyle energy, no generated text.', 'Nano Banana는 빠른 vertical variation과 creator-style 탐색에 적합.', 'Subject가 너무 중앙, headline safe area 없음, sticker zone clutter.'],
    ['크리에이터 인물', 'Person, wardrobe, expression, daylight/editorial lighting, 4:5 crop, identity rule.', 'Identity가 중요하면 GPT Image 2 + reference, mood-first concept는 Midjourney.', 'Face drift, waxy skin, extra fingers, crop too tight.'],
    ['캠페인 티저', 'Bold focal subject, poster composition, high contrast, negative space for typography.', 'Stylized poster route는 Midjourney, tighter instruction control은 GPT Image 2.', 'Gibberish text, weak focal point, design copy space 부족.'],
    ['캐러셀 커버', '하나의 visual metaphor, central composition, restrained palette, educational or brand context.', 'Controlled hierarchy와 reusable templates에는 GPT Image 2.', 'Objects too many, tiny pseudo-text, unclear topic signal.'],
  ],
  promptHeading: '복사해서 쓰는 social media image prompts',
  promptIntro:
    '블록 하나를 복사하고 bracket 변수를 바꾼 뒤, 첫 생성에서는 output rule을 유지하세요. Prompt block은 이미지 도구에 바로 붙여넣기 위해 영어로 둡니다.',
  storyAlt: 'Vogue AI 라이브러리의 vertical story-style prompt 예시',
  storyCaption:
    '이 Nano Banana 예시는 story prompt 옆에 적합합니다. 세로 프레임, subject placement, 열린 composition이 stickers, caption, CTA overlay를 나중에 넣기 좋게 만듭니다.',
  anatomyHeading: '실제로 쓸 수 있는 social image prompt 구조',
  anatomyHeaders: ['Prompt 부분', '지정할 내용', '소셜에서 중요한 이유'],
  anatomyRows: [
    ['채널', 'Feed, story, reel cover, carousel, ad teaser, profile post, Pinterest-style pin.', 'Channel이 crop, density, preview, 필요한 empty space를 결정합니다.'],
    ['주제', 'Product, person, offer, scene, visual metaphor, reference image.', 'Subject가 약하면 예쁘지만 게시물 주제가 전달되지 않습니다.'],
    ['계층', 'Main subject size, placement, background separation, focal contrast.', '사용자는 빠르게 스캔하므로 첫 번째 읽기 지점이 필요합니다.'],
    ['브랜드 제어', 'Palette, material, wardrobe, lighting mood, set design, reference handoff.', '여러 게시물이 서로 다른 일회성 이미지처럼 보이지 않게 합니다.'],
    ['텍스트 정책', 'No generated text, clean headline area, lower-third, typography-only experiment.', '최종 typography는 design tool에서 더 안정적입니다.'],
    ['검토 규칙', '생성 후 가장 먼저 볼 실패 하나.', '취향만으로 prompt 전체를 다시 쓰는 일을 줄입니다.'],
  ],
  workflowHeading: 'Production workflow: prompt library에서 post draft까지',
  workflowIntro:
    '가장 빠른 social workflow는 새 prompt를 처음부터 쓰는 것이 아닙니다. 비슷한 게시물 작업을 이미 해결한 prompt-library image를 고르고, subject, reference, channel rules만 바꿉니다.',
  workflowItems: [
    '가장 가까운 visual family를 고릅니다: product ad, creator portrait, story frame, poster, carousel cover, brand mood image.',
    '정확한 subject가 아니라 구조를 복사합니다. crop, hierarchy, lighting, text policy는 유지하고 product, person, offer, campaign topic을 교체합니다.',
    'Identity나 product accuracy가 중요하면 reference를 추가하고 무엇을 제어하는지 명시합니다.',
    'Controlled first draft 하나를 생성한 뒤 가장 큰 channel failure를 먼저 수정합니다.',
    '해결된 prompt를 story-launch-9x16-safe-top 같은 reusable label로 저장합니다.',
  ],
  workedHeading: '예시: launch post에서 reusable prompt로',
  rawBriefHeading: '원본 brief',
  rawBrief:
    '가벼운 streetwear jacket 출시 이미지를 만들어야 합니다. 4:5 Instagram feed post와 paid social concept로 모두 쓸 수 있어야 합니다. 재킷 silhouette, color, model pose가 중요하고 headline text는 나중에 추가됩니다.',
  promptVersionHeading: 'Prompt 버전 1',
  streetAlt: 'Vogue AI 라이브러리의 graphic poster-style social campaign 예시',
  streetCaption:
    'Campaign teaser나 poster hook에는 더 graphic한 Midjourney-style 예시가 좋습니다. 이 경우 정확한 제품 기록보다 mood와 thumbnail impact가 더 중요합니다.',
  diagnosisHeading: '첫 결과 진단',
  diagnosis:
    '재킷은 맞지만 headline space가 없다면 subject sentence는 유지하고 crop, placement, negative space를 바꿉니다. Pose와 street mood는 맞지만 재킷 형태가 바뀐다면 reference image를 추가하고 silhouette, color, zipper, closure details를 고정합니다.',
  calloutTitle: '수정 규칙',
  calloutText:
    '스타일보다 channel usability를 먼저 고치세요. Crop, safe area, subject hierarchy, identity control이 실제 게시물로 쓸 수 있는지를 결정합니다.',
  mistakeHeading: '실패와 수정법',
  mistakeHeaders: ['실패', '먼저 수정할 것', '피할 것'],
  mistakeRows: [
    ['이미지는 좋지만 게시물로 못 씀', 'Exact crop, safe area, platform destination, preview behavior 추가.', 'Mood adjectives만 더 추가.'],
    ['Headline, price, logo 공간 없음', 'Top, side, lower-third clean area 지정.', '모델에게 final marketing text 생성 요청.'],
    ['Product나 face identity drift', 'Reference를 붙이고 고정 요소를 명시.', '전체 style direction 변경.'],
    ['Post가 generic함', 'Audience, campaign moment, brand palette, material cues, usage context 추가.', 'Broad viral social media post prompt로 시작.'],
    ['Carousel cover가 너무 복잡함', 'One visual metaphor와 one focal object로 축소.', 'Icons, labels, tiny text 추가.'],
  ],
  vogueHeading: 'Vogue AI에서 social prompt workflow 사용하기',
  vogueText:
    'Vogue AI에서는 social job에 가장 가까운 prompt-library example에서 시작한 뒤 workspace에서 구조를 조정합니다. Instruction control은 GPT Image 2, 빠른 vertical/social variations는 Nano Banana, stylized campaign concept는 Midjourney가 적합합니다.',
  vogueItems: [
    'Product posts에서는 background를 바꾸기 전에 product shape와 packaging을 보호합니다.',
    'Creator portraits에서는 identity, hair, wardrobe, pose continuity가 중요하면 reference를 사용합니다.',
    'Stories에서는 생성 전에 safe area를 결정합니다.',
    'Carousel covers에서는 small text를 prompt에서 제거하고 typography는 이후에 추가합니다.',
    'Campaign teasers에서는 literal product route와 graphic hook route를 만들고 thumbnail clarity를 비교합니다.',
  ],
  faqHeading: 'FAQ',
  faq: [
    { question: '좋은 social media image prompt란 무엇인가요?', answer: 'Platform format, subject, hierarchy, brand controls, safe area, reference rule, output rule을 명확히 하여 단순히 예쁜 이미지가 아니라 usable first draft를 만드는 prompt입니다.' },
    { question: 'Generated image 안에 text를 넣어야 하나요?', answer: '대부분은 넣지 않는 편이 좋습니다. Headline, price, logo, disclaimer 공간을 남기고 최종 typography는 design tool에서 추가하세요.' },
    { question: '어떤 aspect ratio를 써야 하나요?', answer: 'Square feed는 1:1, portrait feed는 4:5, stories와 reel covers는 9:16, Pinterest-style pin은 2:3 또는 4:5가 적합합니다.' },
    { question: '언제 reference image가 필요하나요?', answer: 'Product silhouette, packaging, face, wardrobe, UI layout, color palette, campaign style consistency가 중요할 때 필요합니다.' },
    { question: 'Prompt version은 몇 개나 테스트해야 하나요?', answer: 'Structured prompt 하나로 시작하고 가장 큰 channel failure를 진단한 뒤 targeted revision을 하는 편이 더 효율적입니다.' },
    { question: '같은 prompt를 Instagram, TikTok, Pinterest, ads에 모두 쓸 수 있나요?', answer: 'Subject와 brand controls는 유지할 수 있지만 crop, safe area, density, text policy, preview behavior는 placement별로 바꿔야 합니다.' },
  ],
});

const localizedContent = {
  zh: zhContent,
  fr: frContent,
  ru: ruContent,
  pt: ptContent,
  ja: jaContent,
  ko: koContent,
} as const;

export const socialMediaImagePromptsAutoBlogPost: BlogPostSource = {
  slug: 'social-media-image-prompts',
  date: '2026-06-16',
  updatedAt: '2026-06-16',
  author: 'Vogue AI Team',
  image: promptLibraryImages.hero,
  imageAlt: 'Sunlit streetwear social media post prompt example from the Vogue AI library',
  articleType: 'tutorial',
  modelTags: ['vogue-ai', 'gpt-image-2', 'nano-banana', 'midjourney'],
  readingMinutes: 12,
  localizations: {
    en: {
      title: 'Social Media Image Prompts for Posts, Stories, and Ads',
      summary:
        'Copy-ready social media image prompts with channel rules, safe-area planning, first-result diagnosis, and a Vogue AI workflow for reusable post visuals.',
      seoTitle: 'Social Media Image Prompts for Posts, Stories, and Ads',
      seoDescription:
        'Copy social media image prompts for feed posts, stories, portraits, carousel covers, and campaign ads with channel-specific crop and safe-area rules.',
      content: enContent,
    },
    zh: {
      title: '适合帖子、Story 和广告的社媒图片提示词',
      summary: '面向 Vogue AI 的社媒图片提示词指南，包含渠道规则、安全区、可复制 prompt、第一轮诊断和可复用帖子工作流。',
      seoTitle: '社媒图片 AI 提示词：帖子、Story 和广告',
      seoDescription: '复制适合 Feed、Story、头像、轮播封面和广告活动的社媒图片 AI 提示词，并按渠道控制比例、留白和参考图。',
      content: localizedContent.zh,
    },
    fr: {
      title: 'Prompts social media image pour posts, stories et pubs',
      summary: 'Prompts prêts à copier avec règles de canal, zone sûre, diagnostic du premier rendu et workflow Vogue AI pour visuels sociaux réutilisables.',
      seoTitle: 'Prompts Social Media Image pour Posts, Stories et Pubs',
      seoDescription: 'Copiez des prompts pour posts, stories, portraits, carrousels et publicités avec règles de crop, zone sûre et référence par canal.',
      content: localizedContent.fr,
    },
    ru: {
      title: 'Social Media Image Prompts для постов, stories и рекламы',
      summary: 'Копируемые prompts с правилами каналов, safe area, диагностикой первого результата и workflow Vogue AI для reusable social visuals.',
      seoTitle: 'Social Media Image Prompts для постов и рекламы',
      seoDescription: 'Копируйте prompts для feed posts, stories, portraits, carousel covers и campaign ads с правилами crop, safe area и reference image.',
      content: localizedContent.ru,
    },
    pt: {
      title: 'Social media image prompts para posts, stories e anúncios',
      summary: 'Prompts prontos para copiar com regras de canal, área segura, diagnóstico do primeiro resultado e fluxo Vogue AI para visuais sociais reutilizáveis.',
      seoTitle: 'Social Media Image Prompts para Posts, Stories e Anúncios',
      seoDescription: 'Copie prompts para feed posts, stories, retratos, carrosséis e anúncios com regras de crop, área segura e referência por canal.',
      content: localizedContent.pt,
    },
    ja: {
      title: '投稿、Story、広告向け Social Media Image Prompts',
      summary: 'チャネル別ルール、安全領域、コピー用 prompt、初回結果の診断、Vogue AI で再利用する投稿ビジュアル制作フローをまとめます。',
      seoTitle: 'Social Media Image Prompts 実践ガイド',
      seoDescription: 'Feed 投稿、Story、ポートレート、カルーセルカバー、広告向け prompt を、crop、safe area、参考画像ルールで整理します。',
      content: localizedContent.ja,
    },
    ko: {
      title: '게시물, Story, 광고를 위한 Social Media Image Prompts',
      summary: '채널별 규칙, safe area, 복사용 prompt, 첫 결과 진단, Vogue AI에서 재사용 가능한 소셜 비주얼 workflow를 정리했습니다.',
      seoTitle: 'Social Media Image Prompts 실전 가이드',
      seoDescription: 'Feed posts, Stories, portraits, carousel covers, campaign ads에 맞는 prompt를 crop, safe area, reference rule로 정리합니다.',
      content: localizedContent.ko,
    },
  },
};

export const socialMediaImagePromptPlan = [
  'Hero: GPT Image 2 sunlit streetwear social post; this is the cover and overview example because it already solves feed composition.',
  'Prompt section: Nano Banana vertical story example; this demonstrates 9:16 social framing and safe-area planning.',
  'Scenario section: Midjourney street-art poster example; this supports campaign teaser prompts where graphic impact matters.',
] as const;
