import type { BlogContentBlock, BlogPostSource } from '@/lib/blog-data';

const promptLibraryImages = {
  lineArt:
    'https://media.vogueai.net/blog/auto/best-prompts-for-ai-art/695a81d01cec-create-8k-ultra-detailed-minimalist-line-art-1.jpg',
  cinematic:
    'https://media.vogueai.net/blog/auto/best-prompts-for-ai-art/4c6e61b97e55-youmind-13055-artemis-ii-1.jpg',
  character:
    'https://media.vogueai.net/prompt-libraries/awesome-ai-prompts/midjourney/x-2057827823034007688/cartoon-illustration-yellow-furry-monster-three-eyes-1.jpg',
} as const;

const promptBlocks = [
  'Minimal line-art poster: 8K ultra-detailed minimalist line art of [subject], clean black ink on warm white paper, elegant negative space, precise contour lines, subtle paper grain, balanced poster composition, 4:5 aspect ratio, no text, no watermark.',
  'Cinematic concept art: Wide cinematic scene of [hero subject] crossing [environment], dramatic atmospheric perspective, readable foreground-middle-background layers, golden hour side light, production-design detail, 16:9 frame, no text.',
  'Editorial fantasy portrait: A lone [subject] in [setting], high-fashion fantasy editorial art direction, strong silhouette, layered costume texture, controlled rim light, painterly background depth, 3:4 portrait crop, expressive face, no text.',
  'Stylized character sheet: Full-body character design of [character], distinctive shape language, readable costume silhouette, expressive pose, coherent color palette, polished animation concept-art finish, simple background, no text.',
  'Surreal gallery artwork: Museum-quality surreal artwork of [subject] merging with [unexpected material], restrained palette, tactile texture, precise lighting, elegant composition, high detail without clutter, 1:1 square format.',
] as const;

const casePrompts = {
  lineArt:
    '8K ultra-detailed minimalist line art of a quiet rooftop garden at sunrise, clean black ink on warm white paper, elegant negative space, precise contour lines, subtle paper grain, balanced poster composition, 4:5 aspect ratio, no text, no watermark.',
  cinematic:
    'Cinematic sci-fi illustration of an Artemis-style deep-space crew capsule approaching the moon, crisp spacecraft silhouette, blue-black star field, sunlit lunar rim, NASA-inspired realism, dramatic scale, clean foreground-to-background depth, 16:9 frame, no text, no watermark.',
  character:
    'Cartoon illustration of a small yellow furry monster with three eyes, rounded body, playful expression, tiny arms, soft studio lighting, bold readable silhouette, polished children-book character design, simple background, no text.',
} as const;

type LocaleCopy = {
  intro: string;
  quickHeading: string;
  quickList: string[];
  overviewImageAlt: string;
  overviewImageCaption: string;
  chooserHeading: string;
  chooserIntro: string;
  chooserHeaders: string[];
  chooserRows: string[][];
  formulaHeading: string;
  formulaIntro: string;
  formulaHeaders: string[];
  formulaRows: string[][];
  promptPackHeading: string;
  promptPackIntro: string;
  promptLabel: string;
  caseOneHeading: string;
  caseOneBody: string;
  caseOneCaption: string;
  caseTwoHeading: string;
  caseTwoBody: string;
  caseTwoCaption: string;
  caseTwoImageAlt: string;
  caseThreeHeading: string;
  caseThreeBody: string;
  caseThreeCaption: string;
  caseThreeImageAlt: string;
  workflowHeading: string;
  workflowIntro: string;
  workflowList: string[];
  revisionRuleTitle: string;
  revisionRuleText: string;
  diagnosisHeading: string;
  diagnosisIntro: string;
  diagnosisHeaders: string[];
  diagnosisRows: string[][];
  modelHeading: string;
  modelIntro: string;
  modelList: string[];
  faqHeading: string;
  faq: Array<[string, string]>;
};

function createContent(copy: LocaleCopy): BlogContentBlock[] {
  return [
    { type: 'paragraph', text: copy.intro },
    { type: 'heading', level: 2, text: copy.quickHeading },
    { type: 'list', items: copy.quickList },
    {
      type: 'image',
      src: promptLibraryImages.lineArt,
      alt: copy.overviewImageAlt,
      caption: copy.overviewImageCaption,
    },
    { type: 'heading', level: 2, text: copy.chooserHeading },
    { type: 'paragraph', text: copy.chooserIntro },
    { type: 'table', headers: copy.chooserHeaders, rows: copy.chooserRows },
    { type: 'heading', level: 2, text: copy.formulaHeading },
    { type: 'paragraph', text: copy.formulaIntro },
    { type: 'table', headers: copy.formulaHeaders, rows: copy.formulaRows },
    { type: 'heading', level: 2, text: copy.promptPackHeading },
    { type: 'paragraph', text: copy.promptPackIntro },
    { type: 'list', items: [...promptBlocks] },
    { type: 'heading', level: 2, text: copy.caseOneHeading },
    { type: 'paragraph', text: copy.caseOneBody },
    { type: 'list', items: [`${copy.promptLabel}: ${casePrompts.lineArt}`] },
    { type: 'heading', level: 2, text: copy.caseTwoHeading },
    {
      type: 'image',
      src: promptLibraryImages.cinematic,
      alt: copy.caseTwoImageAlt,
      caption: copy.caseTwoCaption,
    },
    { type: 'paragraph', text: copy.caseTwoBody },
    { type: 'list', items: [`${copy.promptLabel}: ${casePrompts.cinematic}`] },
    { type: 'heading', level: 2, text: copy.caseThreeHeading },
    {
      type: 'image',
      src: promptLibraryImages.character,
      alt: copy.caseThreeImageAlt,
      caption: copy.caseThreeCaption,
    },
    { type: 'paragraph', text: copy.caseThreeBody },
    { type: 'list', items: [`${copy.promptLabel}: ${casePrompts.character}`] },
    { type: 'heading', level: 2, text: copy.workflowHeading },
    { type: 'paragraph', text: copy.workflowIntro },
    { type: 'list', items: copy.workflowList },
    {
      type: 'callout',
      title: copy.revisionRuleTitle,
      text: copy.revisionRuleText,
    },
    { type: 'heading', level: 2, text: copy.diagnosisHeading },
    { type: 'paragraph', text: copy.diagnosisIntro },
    { type: 'table', headers: copy.diagnosisHeaders, rows: copy.diagnosisRows },
    { type: 'heading', level: 2, text: copy.modelHeading },
    { type: 'paragraph', text: copy.modelIntro },
    { type: 'list', items: copy.modelList },
    { type: 'heading', level: 2, text: copy.faqHeading },
    ...copy.faq.flatMap(([question, answer]) => [
      { type: 'heading' as const, level: 3 as const, text: question },
      { type: 'paragraph' as const, text: answer },
    ]),
  ];
}

const enCopy: LocaleCopy = {
  intro:
    'The best prompts for AI art are not magic phrases. They are compact art-direction briefs that tell the model what to draw, how to frame it, what visual language to use, and what must not drift after the first generation.',
  quickHeading: 'TL;DR: use art direction, not adjective piles',
  quickList: [
    'Start with the job: poster, portrait, concept art, character sheet, surreal artwork, or gallery image.',
    'Write the six controls in order: subject, medium, composition, light, texture, and constraints.',
    'Keep prompt blocks in English so they stay copyable across GPT Image 2, Nano Banana, and Midjourney workflows.',
    'Use a reference image only when identity, silhouette, palette, costume, product shape, or layout must stay stable.',
    'After the first result, fix one failure mode before changing the whole prompt.',
  ],
  overviewImageAlt:
    'Minimalist line-art AI prompt example from the Vogue AI prompt library',
  overviewImageCaption:
    'This example is useful as the overview image because the prompt has a clear medium, strong negative space, controlled texture, and no generated text.',
  chooserHeading: 'Pick the right prompt type before you write',
  chooserIntro:
    'Most weak AI art prompts fail before the first word because the user has not decided the job. Choose the job first, then copy the closest structure.',
  chooserHeaders: ['If you need', 'Use this prompt type', 'Prioritize', 'First failure to check'],
  chooserRows: [
    ['A clean poster or cover', 'Minimal line-art poster', 'Medium, line weight, negative space, and paper texture.', 'Too much decoration or weak silhouette.'],
    ['A story frame or environment', 'Cinematic concept art', 'Readable subject path, foreground-middle-background layers, scale, and light source.', 'Flat depth or unclear focal point.'],
    ['A memorable mascot or avatar', 'Stylized character sheet', 'Shape language, expression, costume silhouette, and palette.', 'Extra anatomy, muddy pose, or inconsistent costume.'],
    ['A polished portrait', 'Editorial fantasy portrait', 'Expression, wardrobe texture, crop, and rim light.', 'Over-smoothed skin, weak costume detail, or wrong crop.'],
    ['A gallery-style idea', 'Surreal artwork', 'Concept contrast, material transformation, restraint, and tactile texture.', 'Cluttered symbolism or generic surrealism.'],
  ],
  formulaHeading: 'The 6-part AI art prompt formula',
  formulaIntro:
    'This formula gives you a stable skeleton. When a result fails, change one row rather than rewriting the entire prompt.',
  formulaHeaders: ['Prompt part', 'What to write', 'Why it matters'],
  formulaRows: [
    ['Subject', 'Name the person, object, creature, place, or scene plainly.', 'The model needs a stable anchor before style instructions matter.'],
    ['Medium', 'Line art, oil painting, watercolor, anime, 3D render, editorial photo, or concept art.', 'Medium changes texture, detail density, and the expected finish.'],
    ['Composition', 'Portrait crop, wide frame, centered poster, negative space, camera distance, or layered scene.', 'Composition prevents the first result from becoming visually busy.'],
    ['Light', 'Softbox, rim light, moonlight, golden hour, hard flash, gallery lighting, or backlight.', 'Lighting creates depth, mood, and production value.'],
    ['Texture', 'Ink line, paper grain, brushed metal, silk, fur, stone, fog, or paint impasto.', 'Texture turns a generic image into a specific art direction.'],
    ['Constraints', 'No text, no watermark, preserve silhouette, simple background, stable anatomy, or empty headline area.', 'Constraints remove common failure modes before they appear.'],
  ],
  promptPackHeading: 'Copyable AI art prompt examples',
  promptPackIntro:
    'Copy one prompt, replace the bracketed variables, and keep the structure stable for the first generation. Do not mix all five styles in one prompt.',
  promptLabel: 'Prompt',
  caseOneHeading: 'Case 1: minimal poster control',
  caseOneBody:
    'The line-art prompt works because it names the medium and limits the visual field. Negative space, paper grain, and no text are not decoration. They are production controls.',
  caseOneCaption:
    'Line-art prompts need medium, line weight, negative space, and paper texture before mood words.',
  caseTwoHeading: 'Case 2: cinematic narrative art',
  caseTwoBody:
    'For cinematic art, the subject has to move through a readable environment. The prompt should describe scale, foreground and background layers, the light source, and the frame.',
  caseTwoCaption:
    'This Nano Banana prompt-library image is a good cinematic example because the hero object, environment scale, and layered light are easy to read.',
  caseTwoImageAlt:
    'Cinematic space concept prompt example from the Vogue AI prompt library',
  caseThreeHeading: 'Case 3: stylized character art',
  caseThreeBody:
    'Character prompts need thumbnail readability. Shape language, expression, silhouette, and a simple background are usually more valuable than a long list of style references.',
  caseThreeCaption:
    'This Midjourney prompt-library image works for character art because the silhouette, expression, and palette can be judged at a glance.',
  caseThreeImageAlt:
    'Yellow furry monster character prompt example from the Vogue AI prompt library',
  workflowHeading: 'A repeatable workflow inside Vogue AI',
  workflowIntro:
    'Use Vogue AI as a controlled iteration surface, not only as a prompt box. Start from a prompt-library example, generate one draft, then diagnose the first failure.',
  workflowList: [
    'Choose the closest prompt-library example by job, not by prettiness.',
    'Copy the prompt structure and replace only the subject, setting, channel, or style variables.',
    'Generate one controlled draft before adding reference images or switching models.',
    'If identity or shape is wrong, add a reference image and say exactly what it controls.',
    'Save the first prompt that solves the job, then duplicate it for the next artwork.',
  ],
  revisionRuleTitle: 'Revision rule',
  revisionRuleText:
    'Change one control layer at a time. If every clause changes at once, you cannot tell what improved the artwork.',
  diagnosisHeading: 'What to change after the first result',
  diagnosisIntro:
    'A strong prompt system needs a repair path. Use the first result as a diagnostic, then change only the control that failed.',
  diagnosisHeaders: ['Failure mode', 'Fix first', 'Avoid'],
  diagnosisRows: [
    ['Generic AI look', 'Add medium, material texture, audience, and a more specific lighting setup.', 'More abstract adjectives.'],
    ['Weak subject', 'Move the subject to the first clause and define silhouette, pose, or camera distance.', 'Starting with style references only.'],
    ['Messy composition', 'Add crop, negative space, foreground-background layers, or a simpler background.', 'Switching models before fixing the frame.'],
    ['Style drift', 'Keep one medium and one art direction instead of mixing multiple aesthetics.', 'Stacking every favorite style in one prompt.'],
    ['Bad text or watermark', 'Ask for no text and leave typography for a design tool.', 'Expecting perfect final lettering inside the image.'],
  ],
  modelHeading: 'Model fit in Vogue AI',
  modelIntro:
    'The same prompt skeleton can move across models, but each model should get a slightly different emphasis.',
  modelList: [
    'Use GPT Image 2 when you need stricter instruction control, reference-led revisions, or cleaner constraint following.',
    'Use Nano Banana when you want fast ideation, variations, and lightweight image-to-image exploration.',
    'Use Midjourney when you want expressive mood, fashion framing, stylized characters, or exploratory concept art.',
    'For production-style work, keep the prompt skeleton stable and compare model outputs against the same first failure checklist.',
  ],
  faqHeading: 'FAQ',
  faq: [
    ['What is the best prompt for AI art?', 'The best prompt is the one that controls subject, medium, composition, lighting, texture, and output rules for your exact job. A short structured prompt often beats a long decorative one.'],
    ['Should AI art prompts be long?', 'Only as long as needed to control the image. Add detail when it protects subject, frame, style, or output format. Remove detail when it creates conflicting directions.'],
    ['Can I use the same prompt in different models?', 'Yes, but keep the skeleton stable and change only the model-specific emphasis. GPT Image 2 rewards constraints, Nano Banana is useful for variation, and Midjourney is strong for stylized exploration.'],
    ['When should I use a reference image?', 'Use a reference image when identity, silhouette, costume, color palette, product shape, or existing artwork direction must stay close to the source. Do not add one when you only need loose inspiration.'],
    ['Why does my AI art look generic?', 'Generic output usually comes from missing medium, composition, lighting, texture, or audience context. Add concrete art-direction controls before adding more mood words.'],
    ['Should prompts include artist names?', 'You can usually get cleaner control by describing medium, era, lighting, palette, and composition directly. That also makes the prompt easier to adapt across tools and locales.'],
    ['What should I do when the first image is close but not usable?', 'Keep the working parts. Fix one layer: subject, composition, light, texture, or constraint. A full rewrite often loses the strongest part of the first result.'],
  ],
};

const zhCopy: LocaleCopy = {
  ...enCopy,
  intro:
    '真正好用的 AI 艺术提示词不是神奇咒语，而是一份压缩过的艺术指导：告诉模型画什么、怎么构图、使用什么视觉语言，以及第一轮生成后哪些部分不能漂移。',
  quickHeading: 'TL;DR：写清艺术指导，不要堆形容词',
  quickList: [
    '先确定任务：海报、人像、概念图、角色设定、超现实作品，还是画廊感作品。',
    '按顺序写 6 个控制项：主体、媒介、构图、光线、质感和约束。',
    '公开可复制的提示词块保留英文，方便在 GPT Image 2、Nano Banana、Midjourney 工作流中直接使用。',
    '只有身份、轮廓、配色、服装、产品外形或版式必须稳定时，才加入参考图。',
    '第一轮结果出来后，一次只修一个失败点，不要整段重写。',
  ],
  overviewImageAlt: 'Vogue AI 提示词库中的极简线稿示例',
  overviewImageCaption:
    '这张图适合做总览示例，因为提示词明确了媒介、留白、质感控制，并且排除了生成文字。',
  chooserHeading: '先选提示词类型，再开始写',
  chooserIntro:
    '很多弱提示词失败在第一句之前：还没决定这张图到底承担什么任务。先选任务，再复制最接近的结构。',
  chooserHeaders: ['你需要', '提示词类型', '优先控制', '先检查'],
  chooserRows: [
    ['干净的海报或封面', '极简线稿海报', '媒介、线条粗细、留白和纸张质感。', '装饰太多，或者主体轮廓不够清楚。'],
    ['叙事画面或环境图', '电影感概念图', '主体动线、前中后景层次、尺度和光源。', '空间太平，或者视觉焦点不清。'],
    ['有记忆点的吉祥物或头像', '风格化角色设定', '造型语言、表情、服装轮廓和配色。', '肢体多余、姿势含糊，或服装不统一。'],
    ['精致的人像', '编辑风幻想人像', '表情、服装质感、裁切和轮廓光。', '皮肤过度磨平、服装细节弱，或裁切错误。'],
    ['画廊感创意作品', '超现实艺术图', '概念反差、材质转化、克制感和触觉质感。', '符号太乱，或者变成通用超现实风格。'],
  ],
  formulaHeading: 'AI 艺术提示词的 6 段公式',
  formulaIntro:
    '这个公式给你一个稳定骨架。结果失败时，改其中一行，不要重写整段。',
  formulaHeaders: ['部分', '写什么', '为什么重要'],
  formulaRows: [
    ['主体', '直接写清人物、物体、生物、地点或场景。', '风格指令生效前，模型需要一个稳定锚点。'],
    ['媒介', '线稿、油画、水彩、动漫、3D 渲染、编辑摄影或概念图。', '媒介会影响质感、细节密度和最终完成度。'],
    ['构图', '人像裁切、宽画幅、居中海报、留白、镜头距离或分层场景。', '构图能防止第一轮结果变得拥挤。'],
    ['光线', '柔光箱、轮廓光、月光、黄金时刻、硬闪、展厅光或背光。', '光线决定深度、情绪和制作感。'],
    ['质感', '墨线、纸纹、拉丝金属、丝绸、毛发、石材、雾气或厚涂笔触。', '质感能把通用图变成具体的艺术方向。'],
    ['约束', '不要文字、不要水印、保留轮廓、简单背景、稳定人体结构或留出标题区。', '约束可以提前移除常见失败点。'],
  ],
  promptPackHeading: '可复制的 AI 艺术提示词示例',
  promptPackIntro:
    '复制一个提示词，替换括号变量，第一轮保持结构稳定。不要把五种风格混在同一个提示词里。',
  promptLabel: '提示词',
  caseOneHeading: '案例 1：极简海报控制',
  caseOneBody:
    '线稿提示词有效，是因为它明确了媒介并限制画面范围。留白、纸张纹理和不要文字不是装饰，而是生产控制。',
  caseOneCaption:
    '线稿提示词要先写清媒介、线条粗细、留白和纸张质感，再补情绪词。',
  caseTwoHeading: '案例 2：电影感叙事画面',
  caseTwoBody:
    '电影感画面需要主体在可读环境中移动。提示词应该描述尺度、前中后景层次、光源和画幅。',
  caseTwoCaption:
    '这个 Nano Banana 示例适合电影感画面，因为主物体、环境尺度和分层光线都很清楚。',
  caseTwoImageAlt: 'Vogue AI 提示词库中的太空电影感概念图示例',
  caseThreeHeading: '案例 3：风格化角色设定',
  caseThreeBody:
    '角色提示词要先保证缩略图可读。造型语言、表情、轮廓和简单背景，通常比堆很多风格参考更重要。',
  caseThreeCaption:
    '这个 Midjourney 示例适合角色设定，因为轮廓、表情和配色一眼就能判断。',
  caseThreeImageAlt: 'Vogue AI 提示词库中的黄色毛绒怪物角色示例',
  workflowHeading: '在 Vogue AI 里的可重复流程',
  workflowIntro:
    '把 Vogue AI 当成可控迭代界面，而不只是提示词输入框。从提示词库示例开始，生成一版，再诊断第一个失败点。',
  workflowList: [
    '按任务选择最接近的提示词库示例，不按“好看”选择。',
    '复制提示词结构，只替换主体、场景、渠道或风格变量。',
    '先生成一版可控草稿，再加参考图或切换模型。',
    '如果身份或外形错了，加参考图，并说明它控制什么。',
    '保存解决问题的第一版提示词，下一张图从它复制。',
  ],
  revisionRuleTitle: '修订规则',
  revisionRuleText:
    '一次只改一个控制层。如果每个分句都同时改变，你就无法判断到底是哪一处改善了画面。',
  diagnosisHeading: '第一轮结果后应该改什么',
  diagnosisIntro:
    '强提示词系统必须有修复路径。把第一轮结果当诊断，只改失败的控制层。',
  diagnosisHeaders: ['失败点', '先修', '避免'],
  diagnosisRows: [
    ['通用 AI 味太重', '补充媒介、材质、受众和更具体的布光。', '继续堆抽象形容词。'],
    ['主体太弱', '把主体移到第一句，并定义轮廓、姿势或镜头距离。', '只从风格参考开始写。'],
    ['构图混乱', '加入裁切、留白、前后景层次，或简化背景。', '还没修画幅就先换模型。'],
    ['风格漂移', '只保留一个媒介和一个艺术方向。', '把所有喜欢的风格塞进同一段。'],
    ['文字或水印出错', '明确不要文字，把排版留给设计工具。', '期待模型直接生成完美标题字。'],
  ],
  modelHeading: 'Vogue AI 中的模型选择',
  modelIntro:
    '同一套提示词骨架可以跨模型使用，但每个模型的强调点不同。',
  modelList: [
    '需要更严格的指令控制、参考图修订或约束跟随时，用 GPT Image 2。',
    '需要快速构思、多版本变化或轻量图生图探索时，用 Nano Banana。',
    '需要强情绪、时尚构图、风格化角色或概念探索时，用 Midjourney。',
    '偏生产型任务里，保持提示词骨架不变，用同一张失败检查表比较模型输出。',
  ],
  faqHeading: 'FAQ',
  faq: [
    ['什么是最好的 AI 艺术提示词？', '最好的提示词能围绕具体任务控制主体、媒介、构图、光线、质感和输出规则。结构清楚的短提示词，通常比装饰性很强的长提示词更稳。'],
    ['AI 艺术提示词应该写很长吗？', '只写到足够控制画面即可。能保护主体、画幅、风格或输出格式的细节要保留，会制造冲突的细节要删掉。'],
    ['同一个提示词能跨模型使用吗？', '可以，但要保持骨架稳定，只调整模型侧重点。GPT Image 2 更适合约束跟随，Nano Banana 适合快速变化，Midjourney 适合风格探索。'],
    ['什么时候需要参考图？', '当身份、轮廓、服装、配色、产品外形或既有艺术方向必须贴近原图时使用参考图。如果只是寻找灵感，不一定要加。'],
    ['为什么我的 AI 艺术图很通用？', '通常是缺少媒介、构图、光线、质感或受众语境。先补具体的艺术指导，再考虑增加情绪词。'],
    ['提示词里要写艺术家名字吗？', '更稳定的做法是直接描述媒介、时代、光线、配色和构图。这样更容易跨工具复用，也更容易本地化。'],
    ['第一张图接近但不能用怎么办？', '保留有效部分，只修一个层级：主体、构图、光线、质感或约束。全段重写往往会丢掉第一张图里最有价值的部分。'],
  ],
};

const localeCopies: Record<'en' | 'zh' | 'fr' | 'ru' | 'pt' | 'ja' | 'ko', LocaleCopy> = {
  en: enCopy,
  zh: zhCopy,
  fr: {
    ...enCopy,
    intro:
      'Un bon prompt d\'art IA fonctionne comme un brief de direction artistique compact : sujet, cadrage, langage visuel, lumière et limites à ne pas laisser dériver après la première génération.',
    quickHeading: "TL;DR : écrivez une direction artistique, pas une pile d'adjectifs",
    quickList: [
      'Commencez par l\'usage : affiche, portrait, concept art, fiche personnage, œuvre surréaliste ou image de galerie.',
      'Écrivez les six contrôles dans l\'ordre : sujet, médium, composition, lumière, texture et contraintes.',
      'Gardez les blocs de prompt copiables en anglais pour les utiliser directement dans GPT Image 2, Nano Banana et Midjourney.',
      'Ajoutez une image de référence seulement si l\'identité, la silhouette, la palette, le costume, la forme produit ou la mise en page doit rester stable.',
      'Après le premier résultat, corrigez un seul mode d\'échec avant de modifier tout le prompt.',
    ],
    overviewImageAlt:
      'Exemple de prompt IA en line art minimaliste dans la bibliothèque Vogue AI',
    overviewImageCaption:
      'Cet exemple fonctionne comme image d\'ensemble car le prompt fixe le médium, l\'espace négatif, la texture et l\'absence de texte généré.',
    chooserHeading: "Choisir le type de prompt avant d'écrire",
    chooserIntro:
      "La plupart des prompts faibles échouent parce que le travail visuel n'est pas défini. Choisissez d'abord l'usage, puis adaptez la structure la plus proche.",
    chooserHeaders: ['Besoin', 'Type de prompt', 'À prioriser', 'Premier échec à vérifier'],
    chooserRows: [
      ['Affiche ou couverture propre', 'Affiche line art minimaliste', 'Médium, épaisseur du trait, espace négatif et texture papier.', 'Trop de décoration ou silhouette faible.'],
      ['Cadre narratif ou environnement', 'Concept art cinématique', 'Trajet du sujet, couches avant-plan/milieu/arrière-plan, échelle et source lumineuse.', 'Profondeur plate ou point focal flou.'],
      ['Mascotte ou avatar mémorable', 'Fiche personnage stylisée', 'Langage de forme, expression, silhouette du costume et palette.', 'Anatomie en trop, pose confuse ou costume incohérent.'],
      ['Portrait travaillé', 'Portrait fantasy éditorial', 'Expression, texture du vêtement, cadrage et rim light.', 'Peau trop lissée, détails faibles ou mauvais cadrage.'],
      ['Idée façon galerie', 'Œuvre surréaliste', 'Contraste conceptuel, transformation de matière, retenue et texture tactile.', 'Symboles trop chargés ou surréalisme générique.'],
    ],
    formulaHeading: 'La formule de prompt d\'art IA en 6 parties',
    formulaIntro:
      'Cette formule donne un squelette stable. Si le rendu échoue, modifiez une ligne plutôt que de réécrire tout le prompt.',
    formulaHeaders: ['Partie', 'Quoi écrire', 'Pourquoi c\'est utile'],
    formulaRows: [
      ['Sujet', 'Nommez simplement la personne, l\'objet, la créature, le lieu ou la scène.', 'Le modèle a besoin d\'un ancrage stable avant les instructions de style.'],
      ['Médium', 'Line art, peinture à l\'huile, aquarelle, anime, rendu 3D, photo éditoriale ou concept art.', 'Le médium change la texture, la densité de détails et la finition attendue.'],
      ['Composition', 'Cadrage portrait, format large, affiche centrée, espace négatif, distance caméra ou scène en couches.', 'La composition évite un premier rendu visuellement chargé.'],
      ['Lumière', 'Softbox, rim light, clair de lune, golden hour, flash dur, lumière de galerie ou contre-jour.', 'La lumière crée profondeur, humeur et valeur de production.'],
      ['Texture', 'Trait d\'encre, grain papier, métal brossé, soie, fourrure, pierre, brume ou impasto.', 'La texture transforme une image générique en direction artistique précise.'],
      ['Contraintes', 'Pas de texte, pas de watermark, préserver la silhouette, fond simple, anatomie stable ou zone de titre vide.', 'Les contraintes retirent les erreurs courantes avant qu\'elles apparaissent.'],
    ],
    promptPackHeading: 'Exemples de prompts d\'art IA copiables',
    promptPackIntro:
      'Copiez un prompt, remplacez les variables entre crochets et gardez la structure stable pour la première génération. Ne mélangez pas les cinq styles dans un seul prompt.',
    promptLabel: 'Prompt',
    caseOneHeading: 'Cas 1 : contrôler un poster minimal',
    caseOneBody:
      'Le prompt line art fonctionne parce qu\'il nomme le médium et limite le champ visuel. L\'espace négatif, le grain papier et l\'absence de texte sont des contrôles de production.',
    caseOneCaption:
      'Les prompts line art doivent fixer médium, épaisseur du trait, espace négatif et texture papier avant les mots d\'ambiance.',
    caseTwoHeading: 'Cas 2 : art narratif cinématique',
    caseTwoBody:
      'Pour une image cinématique, le sujet doit traverser un environnement lisible. Décrivez l\'échelle, les plans, la source lumineuse et le format.',
    caseTwoCaption:
      'Cette image Nano Banana est un bon exemple cinématique : objet principal, échelle de l\'environnement et lumière en couches restent lisibles.',
    caseTwoImageAlt:
      'Exemple de concept spatial cinématique dans la bibliothèque Vogue AI',
    caseThreeHeading: 'Cas 3 : personnage stylisé',
    caseThreeBody:
      'Un prompt de personnage doit rester lisible en vignette. Langage de forme, expression, silhouette et fond simple valent souvent mieux qu\'une longue liste de références.',
    caseThreeCaption:
      'Cette image Midjourney fonctionne pour le personnage car silhouette, expression et palette se jugent d\'un coup d\'œil.',
    caseThreeImageAlt:
      'Exemple de personnage monstre jaune dans la bibliothèque Vogue AI',
    workflowHeading: 'Workflow répétable dans Vogue AI',
    workflowIntro:
      'Utilisez Vogue AI comme surface d\'itération contrôlée, pas seulement comme champ de prompt. Partez d\'un exemple de bibliothèque, générez une version, puis diagnostiquez le premier échec.',
    workflowList: [
      'Choisissez l\'exemple de bibliothèque le plus proche par usage, pas par beauté.',
      'Copiez la structure et remplacez seulement le sujet, le décor, le canal ou les variables de style.',
      'Générez un brouillon contrôlé avant d\'ajouter une image de référence ou de changer de modèle.',
      'Si l\'identité ou la forme est fausse, ajoutez une référence et dites exactement ce qu\'elle contrôle.',
      'Sauvegardez le premier prompt qui résout le problème, puis dupliquez-le pour l\'image suivante.',
    ],
    revisionRuleTitle: 'Règle de révision',
    revisionRuleText:
      'Modifiez une seule couche de contrôle à la fois. Si chaque clause change ensemble, vous ne saurez pas ce qui a amélioré l\'image.',
    diagnosisHeading: 'Que changer après le premier résultat',
    diagnosisIntro:
      'Un bon système de prompt a besoin d\'un chemin de réparation. Utilisez le premier résultat comme diagnostic, puis ne changez que la couche qui a échoué.',
    diagnosisHeaders: ['Échec', 'Corriger d\'abord', 'À éviter'],
    diagnosisRows: [
      ['Rendu IA générique', 'Ajoutez médium, matière, audience et lumière plus précise.', 'Encore plus d\'adjectifs abstraits.'],
      ['Sujet faible', 'Placez le sujet dans la première clause et définissez silhouette, pose ou distance caméra.', 'Commencer seulement par des références de style.'],
      ['Composition confuse', 'Ajoutez cadrage, espace négatif, plans avant/arrière ou fond plus simple.', 'Changer de modèle avant de corriger le cadre.'],
      ['Style instable', 'Gardez un seul médium et une seule direction artistique.', 'Empiler toutes vos esthétiques préférées dans un prompt.'],
      ['Texte ou watermark mauvais', 'Demandez aucun texte et réservez la typographie à un outil de design.', 'Attendre un lettrage final parfait dans l\'image.'],
    ],
    modelHeading: 'Choisir le modèle dans Vogue AI',
    modelIntro:
      'Le même squelette peut passer d\'un modèle à l\'autre, mais chaque modèle demande un accent différent.',
    modelList: [
      'Utilisez GPT Image 2 pour un contrôle d\'instructions plus strict, des révisions avec référence ou un meilleur respect des contraintes.',
      'Utilisez Nano Banana pour l\'idéation rapide, les variations et l\'exploration image-to-image légère.',
      'Utilisez Midjourney pour l\'ambiance expressive, le cadrage mode, les personnages stylisés ou le concept art exploratoire.',
      'Pour un travail de production, gardez le même squelette et comparez les modèles avec la même liste d\'échecs.',
    ],
    faqHeading: 'FAQ',
    faq: [
      ['Quel est le meilleur prompt pour l\'art IA ?', 'Celui qui contrôle le sujet, le médium, la composition, la lumière, la texture et les règles de sortie pour votre usage exact. Un prompt court et structuré bat souvent un long prompt décoratif.'],
      ['Un prompt d\'art IA doit-il être long ?', 'Seulement assez long pour contrôler l\'image. Ajoutez du détail quand il protège le sujet, le cadrage, le style ou le format. Retirez ce qui crée des directions contradictoires.'],
      ['Puis-je utiliser le même prompt dans plusieurs modèles ?', 'Oui, mais gardez le squelette stable et changez seulement l\'accent propre au modèle. GPT Image 2 aime les contraintes, Nano Banana aide les variations, Midjourney explore mieux les styles.'],
      ['Quand utiliser une image de référence ?', 'Quand l\'identité, la silhouette, le costume, la palette, la forme produit ou la direction visuelle doit rester proche de la source. Pour une inspiration lâche, ce n\'est pas obligatoire.'],
      ['Pourquoi mon image IA paraît-elle générique ?', 'Il manque souvent un médium, une composition, une lumière, une texture ou un contexte d\'audience. Ajoutez des contrôles concrets avant plus de mots d\'ambiance.'],
      ['Faut-il inclure des noms d\'artistes ?', 'Vous contrôlez souvent mieux le résultat en décrivant directement médium, époque, lumière, palette et composition. Le prompt devient aussi plus facile à adapter.'],
      ['Que faire si la première image est proche mais inutilisable ?', 'Gardez ce qui fonctionne et corrigez une seule couche : sujet, composition, lumière, texture ou contrainte. Une réécriture complète perd souvent la meilleure partie du rendu.'],
    ],
  },
  ru: {
    ...enCopy,
    intro:
      'Хороший промпт для AI-арта работает как короткий арт-дирекшн: он фиксирует объект, кадр, визуальный язык, свет и то, что не должно расползаться после первой генерации.',
    quickHeading: 'TL;DR: задавайте арт-дирекшн, а не набор эпитетов',
    quickList: [
      'Начните с задачи: постер, портрет, концепт-арт, лист персонажа, сюрреалистичная работа или галерейное изображение.',
      'Запишите шесть уровней контроля по порядку: объект, медиум, композиция, свет, фактура и ограничения.',
      'Копируемые блоки промптов оставляйте на английском, чтобы их можно было напрямую использовать в GPT Image 2, Nano Banana и Midjourney.',
      'Добавляйте референс только если личность, силуэт, палитра, костюм, форма продукта или макет должны оставаться стабильными.',
      'После первого результата исправляйте один тип ошибки, прежде чем менять весь промпт.',
    ],
    overviewImageAlt:
      'Пример минималистичного line-art промпта из библиотеки Vogue AI',
    overviewImageCaption:
      'Этот пример хорош для обзора: промпт задает медиум, отрицательное пространство, контролируемую фактуру и запрет на текст.',
    chooserHeading: 'Сначала выберите тип промпта',
    chooserIntro:
      'Слабые промпты часто проваливаются еще до первого слова: задача изображения не определена. Сначала выберите работу, затем копируйте ближайшую структуру.',
    chooserHeaders: ['Если нужно', 'Тип промпта', 'Главный фокус', 'Что проверить сначала'],
    chooserRows: [
      ['Чистый постер или обложка', 'Минималистичный line-art постер', 'Медиум, толщина линий, отрицательное пространство и фактура бумаги.', 'Слишком много декора или слабый силуэт.'],
      ['История или окружение', 'Кинематографичный концепт-арт', 'Путь объекта, слои переднего/среднего/заднего плана, масштаб и источник света.', 'Плоская глубина или неясный фокус.'],
      ['Запоминающийся маскот или аватар', 'Стилизованный лист персонажа', 'Язык формы, выражение, силуэт костюма и палитра.', 'Лишняя анатомия, мутная поза или несогласованный костюм.'],
      ['Полированный портрет', 'Редакционный fantasy-портрет', 'Выражение, фактура одежды, кадрирование и контровой свет.', 'Слишком гладкая кожа, слабые детали костюма или неверный кроп.'],
      ['Галерейная идея', 'Сюрреалистичная работа', 'Контраст идеи, трансформация материала, сдержанность и тактильная фактура.', 'Перегруженные символы или общий сюрреализм.'],
    ],
    formulaHeading: 'Формула AI-арт промпта из 6 частей',
    formulaIntro:
      'Эта формула дает стабильный каркас. Если результат неудачен, меняйте одну строку, а не весь промпт.',
    formulaHeaders: ['Часть', 'Что написать', 'Зачем это нужно'],
    formulaRows: [
      ['Объект', 'Прямо назовите человека, предмет, существо, место или сцену.', 'Модели нужен стабильный якорь до любых стилевых указаний.'],
      ['Медиум', 'Line art, масло, акварель, anime, 3D-рендер, редакционное фото или концепт-арт.', 'Медиум меняет фактуру, плотность деталей и ожидаемую отделку.'],
      ['Композиция', 'Портретный кроп, широкий кадр, центрированный постер, отрицательное пространство, дистанция камеры или слоистая сцена.', 'Композиция не дает первому результату стать визуально шумным.'],
      ['Свет', 'Softbox, контровой свет, лунный свет, golden hour, жесткая вспышка, галерейный свет или backlight.', 'Свет создает глубину, настроение и ощущение продакшена.'],
      ['Фактура', 'Чернильная линия, зерно бумаги, брашированный металл, шелк, мех, камень, туман или густой мазок.', 'Фактура превращает общую картинку в конкретный арт-дирекшн.'],
      ['Ограничения', 'Без текста, без watermark, сохранить силуэт, простой фон, стабильная анатомия или пустая зона под заголовок.', 'Ограничения убирают частые ошибки до их появления.'],
    ],
    promptPackHeading: 'Копируемые примеры AI-арт промптов',
    promptPackIntro:
      'Скопируйте один промпт, замените переменные в скобках и оставьте структуру стабильной для первой генерации. Не смешивайте все пять стилей в одном промпте.',
    promptLabel: 'Промпт',
    caseOneHeading: 'Кейс 1: контроль минималистичного постера',
    caseOneBody:
      'Line-art промпт работает потому, что называет медиум и ограничивает визуальное поле. Отрицательное пространство, зерно бумаги и запрет на текст — это производственные ограничения, а не украшения.',
    caseOneCaption:
      'Для line-art промпта сначала нужны медиум, толщина линий, отрицательное пространство и фактура бумаги.',
    caseTwoHeading: 'Кейс 2: кинематографичная сцена',
    caseTwoBody:
      'В кинематографичном арте объект должен двигаться через читаемое окружение. Опишите масштаб, слои переднего и заднего плана, источник света и формат кадра.',
    caseTwoCaption:
      'Этот пример Nano Banana читается как кино: главный объект, масштаб среды и слоистый свет хорошо различимы.',
    caseTwoImageAlt:
      'Кинематографичный космический концепт из библиотеки Vogue AI',
    caseThreeHeading: 'Кейс 3: стилизованный персонаж',
    caseThreeBody:
      'Промпт персонажа должен быть читаемым даже в миниатюре. Язык формы, выражение, силуэт и простой фон часто важнее длинного списка стилевых референсов.',
    caseThreeCaption:
      'Этот пример Midjourney подходит для персонажа: силуэт, выражение и палитра оцениваются с первого взгляда.',
    caseThreeImageAlt:
      'Желтый пушистый персонаж-монстр из библиотеки Vogue AI',
    workflowHeading: 'Повторяемый процесс в Vogue AI',
    workflowIntro:
      'Используйте Vogue AI как поверхность контролируемой итерации, а не только как поле ввода. Начните с примера из библиотеки, создайте один черновик и диагностируйте первый сбой.',
    workflowList: [
      'Выбирайте ближайший пример по задаче, а не по красоте.',
      'Копируйте структуру и меняйте только объект, окружение, канал или стилевую переменную.',
      'Сначала создайте контролируемый черновик, затем добавляйте референс или меняйте модель.',
      'Если личность или форма неверна, добавьте референс и точно укажите, что он контролирует.',
      'Сохраните первый промпт, который решил задачу, и дублируйте его для следующей работы.',
    ],
    revisionRuleTitle: 'Правило правки',
    revisionRuleText:
      'Меняйте один уровень контроля за раз. Если все фразы меняются одновременно, вы не поймете, что улучшило изображение.',
    diagnosisHeading: 'Что менять после первого результата',
    diagnosisIntro:
      'Сильной системе промптов нужен путь ремонта. Используйте первый результат как диагностику и меняйте только тот уровень, который провалился.',
    diagnosisHeaders: ['Проблема', 'Что исправить сначала', 'Чего избегать'],
    diagnosisRows: [
      ['Общий AI-вид', 'Добавьте медиум, фактуру материала, аудиторию и более конкретный свет.', 'Еще больше абстрактных эпитетов.'],
      ['Слабый объект', 'Поставьте объект в первую фразу и задайте силуэт, позу или дистанцию камеры.', 'Начинать только со стилевых референсов.'],
      ['Грязная композиция', 'Добавьте кроп, отрицательное пространство, слои сцены или более простой фон.', 'Менять модель до исправления кадра.'],
      ['Стиль плывет', 'Оставьте один медиум и один арт-дирекшн.', 'Складывать все любимые эстетики в один промпт.'],
      ['Плохой текст или watermark', 'Запросите отсутствие текста и добавьте типографику в дизайн-инструменте.', 'Ждать идеальную финальную надпись внутри изображения.'],
    ],
    modelHeading: 'Выбор модели в Vogue AI',
    modelIntro:
      'Один и тот же каркас можно переносить между моделями, но каждой модели нужен свой акцент.',
    modelList: [
      'Используйте GPT Image 2 для более строгого следования инструкциям, правок по референсу и чистого соблюдения ограничений.',
      'Используйте Nano Banana для быстрой идеи, вариаций и легкого image-to-image поиска.',
      'Используйте Midjourney для выразительного настроения, fashion-кадра, стилизованных персонажей и исследовательского концепт-арта.',
      'Для продакшен-задач держите каркас стабильным и сравнивайте модели по одной и той же таблице ошибок.',
    ],
    faqHeading: 'FAQ',
    faq: [
      ['Какой промпт лучше всего подходит для AI-арта?', 'Лучший промпт контролирует объект, медиум, композицию, свет, фактуру и правила вывода под конкретную задачу. Короткий структурированный промпт часто сильнее длинного декоративного.'],
      ['Промпт для AI-арта должен быть длинным?', 'Он должен быть настолько длинным, насколько нужно для контроля изображения. Добавляйте детали, когда они защищают объект, кадр, стиль или формат, и удаляйте конфликтующие указания.'],
      ['Можно использовать один промпт в разных моделях?', 'Да, если каркас остается стабильным. GPT Image 2 лучше держит ограничения, Nano Banana удобен для вариаций, Midjourney силен в стилевой разведке.'],
      ['Когда нужна референс-картинка?', 'Когда личность, силуэт, костюм, палитра, форма продукта или существующий визуальный стиль должны оставаться близкими к источнику. Для свободного вдохновения она не обязательна.'],
      ['Почему мой AI-арт выглядит слишком общим?', 'Чаще всего не хватает медиума, композиции, света, фактуры или контекста аудитории. Сначала добавьте конкретные арт-дирекшн элементы, а не новые слова настроения.'],
      ['Нужно ли писать имена художников?', 'Обычно чище работает прямое описание медиума, эпохи, света, палитры и композиции. Так промпт проще адаптировать между инструментами и языками.'],
      ['Что делать, если первое изображение близко, но не годится?', 'Сохраните рабочие части и исправьте один уровень: объект, композицию, свет, фактуру или ограничение. Полная перепись часто теряет лучшую часть результата.'],
    ],
  },
  pt: {
    ...enCopy,
    intro:
      'Um bom prompt para arte com IA funciona como um brief compacto de direção de arte: assunto, enquadramento, linguagem visual, luz e limites do que não pode se perder depois da primeira geração.',
    quickHeading: 'TL;DR: use direção de arte, não uma pilha de adjetivos',
    quickList: [
      'Comece pelo uso: pôster, retrato, concept art, ficha de personagem, arte surreal ou imagem de galeria.',
      'Escreva os seis controles em ordem: assunto, mídia, composição, luz, textura e restrições.',
      'Mantenha os blocos de prompt copiáveis em inglês para usar direto em GPT Image 2, Nano Banana e Midjourney.',
      'Use imagem de referência apenas quando identidade, silhueta, paleta, roupa, forma do produto ou layout precisam ficar estáveis.',
      'Depois do primeiro resultado, corrija um modo de falha antes de mudar o prompt inteiro.',
    ],
    overviewImageAlt:
      'Exemplo de prompt de line art minimalista na biblioteca Vogue AI',
    overviewImageCaption:
      'Este exemplo funciona como visão geral porque o prompt define mídia, espaço negativo, textura controlada e ausência de texto gerado.',
    chooserHeading: 'Escolha o tipo de prompt antes de escrever',
    chooserIntro:
      'Muitos prompts fracos falham porque o trabalho visual não foi decidido. Escolha o uso primeiro, depois adapte a estrutura mais próxima.',
    chooserHeaders: ['Se você precisa', 'Tipo de prompt', 'Priorize', 'Primeira falha a verificar'],
    chooserRows: [
      ['Pôster ou capa limpa', 'Pôster minimalista em line art', 'Mídia, espessura da linha, espaço negativo e textura de papel.', 'Decoração demais ou silhueta fraca.'],
      ['Cena narrativa ou ambiente', 'Concept art cinematográfico', 'Caminho do assunto, camadas de frente/meio/fundo, escala e fonte de luz.', 'Profundidade plana ou foco visual pouco claro.'],
      ['Mascote ou avatar memorável', 'Ficha de personagem estilizada', 'Linguagem de forma, expressão, silhueta da roupa e paleta.', 'Anatomia extra, pose confusa ou roupa inconsistente.'],
      ['Retrato polido', 'Retrato editorial de fantasia', 'Expressão, textura da roupa, corte e luz de recorte.', 'Pele lisa demais, detalhe fraco da roupa ou corte errado.'],
      ['Ideia com cara de galeria', 'Arte surreal', 'Contraste conceitual, transformação de material, contenção e textura tátil.', 'Simbolismo carregado ou surrealismo genérico.'],
    ],
    formulaHeading: 'A fórmula de prompt para arte com IA em 6 partes',
    formulaIntro:
      'Esta fórmula dá um esqueleto estável. Quando o resultado falhar, mude uma linha em vez de reescrever o prompt inteiro.',
    formulaHeaders: ['Parte', 'O que escrever', 'Por que importa'],
    formulaRows: [
      ['Assunto', 'Nomeie claramente a pessoa, objeto, criatura, lugar ou cena.', 'O modelo precisa de uma âncora estável antes das instruções de estilo.'],
      ['Mídia', 'Line art, pintura a óleo, aquarela, anime, render 3D, foto editorial ou concept art.', 'A mídia muda textura, densidade de detalhe e acabamento esperado.'],
      ['Composição', 'Corte retrato, quadro amplo, pôster centralizado, espaço negativo, distância de câmera ou cena em camadas.', 'A composição evita que o primeiro resultado fique visualmente ocupado.'],
      ['Luz', 'Softbox, rim light, luar, golden hour, flash duro, luz de galeria ou contraluz.', 'A luz cria profundidade, clima e valor de produção.'],
      ['Textura', 'Linha de tinta, grão de papel, metal escovado, seda, pelo, pedra, névoa ou impasto.', 'A textura transforma uma imagem genérica em direção de arte específica.'],
      ['Restrições', 'Sem texto, sem watermark, preservar silhueta, fundo simples, anatomia estável ou área vazia para título.', 'As restrições removem falhas comuns antes de aparecerem.'],
    ],
    promptPackHeading: 'Exemplos copiáveis de prompts para arte com IA',
    promptPackIntro:
      'Copie um prompt, troque as variáveis entre colchetes e mantenha a estrutura estável na primeira geração. Não misture os cinco estilos em um único prompt.',
    promptLabel: 'Prompt',
    caseOneHeading: 'Caso 1: controle de poster minimalista',
    caseOneBody:
      'O prompt de line art funciona porque nomeia a mídia e limita o campo visual. Espaço negativo, grão de papel e ausência de texto são controles de produção.',
    caseOneCaption:
      'Prompts de line art precisam de mídia, peso da linha, espaço negativo e textura de papel antes de palavras de clima.',
    caseTwoHeading: 'Caso 2: arte narrativa cinematográfica',
    caseTwoBody:
      'Para arte cinematográfica, o assunto precisa atravessar um ambiente legível. Descreva escala, camadas de frente e fundo, fonte de luz e enquadramento.',
    caseTwoCaption:
      'Esta imagem da biblioteca Nano Banana é um bom exemplo cinematográfico porque o objeto principal, a escala do ambiente e a luz em camadas ficam fáceis de ler.',
    caseTwoImageAlt:
      'Exemplo de concept art espacial cinematográfico da biblioteca Vogue AI',
    caseThreeHeading: 'Caso 3: personagem estilizado',
    caseThreeBody:
      'Prompts de personagem precisam funcionar em miniatura. Linguagem de forma, expressão, silhueta e fundo simples costumam valer mais que uma longa lista de referências.',
    caseThreeCaption:
      'Esta imagem Midjourney funciona para personagem porque silhueta, expressão e paleta podem ser avaliadas de relance.',
    caseThreeImageAlt:
      'Exemplo de personagem monstro amarelo da biblioteca Vogue AI',
    workflowHeading: 'Workflow repetível no Vogue AI',
    workflowIntro:
      'Use o Vogue AI como uma superfície de iteração controlada, não apenas como caixa de prompt. Comece por um exemplo da biblioteca, gere um rascunho e diagnostique a primeira falha.',
    workflowList: [
      'Escolha o exemplo mais próximo pelo trabalho, não apenas pelo visual bonito.',
      'Copie a estrutura e substitua só assunto, cenário, canal ou variável de estilo.',
      'Gere um rascunho controlado antes de adicionar referência ou trocar de modelo.',
      'Se identidade ou forma estiver errada, adicione referência e diga exatamente o que ela controla.',
      'Salve o primeiro prompt que resolve o trabalho e duplique para a próxima arte.',
    ],
    revisionRuleTitle: 'Regra de revisão',
    revisionRuleText:
      'Mude uma camada de controle por vez. Se todas as frases mudam juntas, você não sabe o que melhorou a imagem.',
    diagnosisHeading: 'O que mudar depois do primeiro resultado',
    diagnosisIntro:
      'Um bom sistema de prompt precisa de um caminho de reparo. Use o primeiro resultado como diagnóstico e mude apenas o controle que falhou.',
    diagnosisHeaders: ['Falha', 'Corrija primeiro', 'Evite'],
    diagnosisRows: [
      ['Visual genérico de IA', 'Adicione mídia, textura material, público e configuração de luz mais específica.', 'Mais adjetivos abstratos.'],
      ['Assunto fraco', 'Mova o assunto para a primeira frase e defina silhueta, pose ou distância da câmera.', 'Começar apenas por referências de estilo.'],
      ['Composição bagunçada', 'Adicione corte, espaço negativo, camadas de fundo ou fundo mais simples.', 'Trocar de modelo antes de corrigir o quadro.'],
      ['Estilo instável', 'Mantenha uma mídia e uma direção de arte.', 'Empilhar todas as estéticas favoritas no mesmo prompt.'],
      ['Texto ou watermark ruim', 'Peça sem texto e deixe a tipografia para uma ferramenta de design.', 'Esperar lettering final perfeito dentro da imagem.'],
    ],
    modelHeading: 'Escolha de modelo no Vogue AI',
    modelIntro:
      'O mesmo esqueleto de prompt pode passar por modelos diferentes, mas cada modelo pede uma ênfase ligeiramente diferente.',
    modelList: [
      'Use GPT Image 2 quando precisar de controle de instrução mais rígido, revisões com referência ou melhor obediência a restrições.',
      'Use Nano Banana para ideação rápida, variações e exploração leve de image-to-image.',
      'Use Midjourney para clima expressivo, enquadramento de moda, personagens estilizados ou concept art exploratório.',
      'Em trabalho de produção, mantenha o esqueleto estável e compare modelos pela mesma lista de falhas.',
    ],
    faqHeading: 'FAQ',
    faq: [
      ['Qual é o melhor prompt para arte com IA?', 'O melhor prompt controla assunto, mídia, composição, luz, textura e regras de saída para o trabalho exato. Um prompt curto e estruturado costuma vencer um longo texto decorativo.'],
      ['Prompts de arte com IA devem ser longos?', 'Só o suficiente para controlar a imagem. Adicione detalhe quando protege assunto, quadro, estilo ou formato. Remova detalhe quando cria direções conflitantes.'],
      ['Posso usar o mesmo prompt em modelos diferentes?', 'Sim, mas mantenha o esqueleto estável e mude apenas a ênfase do modelo. GPT Image 2 favorece restrições, Nano Banana ajuda variações e Midjourney explora estilo.'],
      ['Quando devo usar imagem de referência?', 'Use quando identidade, silhueta, roupa, paleta, forma do produto ou direção visual existente precisa ficar perto da fonte. Para inspiração solta, não é obrigatório.'],
      ['Por que minha arte com IA parece genérica?', 'Geralmente faltam mídia, composição, luz, textura ou contexto de público. Adicione controles concretos antes de colocar mais palavras de clima.'],
      ['Devo incluir nomes de artistas?', 'Você costuma ter controle mais limpo descrevendo mídia, época, luz, paleta e composição diretamente. Isso também facilita adaptar o prompt entre ferramentas e idiomas.'],
      ['O que fazer quando a primeira imagem está próxima, mas não serve?', 'Mantenha as partes boas e corrija uma camada: assunto, composição, luz, textura ou restrição. Reescrever tudo pode perder a melhor parte do resultado.'],
    ],
  },
  ja: {
    ...enCopy,
    intro:
      '良い AI アート向けプロンプトは、魔法の言葉ではありません。何を描くか、どう構図を作るか、どんな視覚言語を使うか、初回生成後に崩してはいけない条件をまとめた短いアートディレクションです。',
    quickHeading: 'TL;DR：形容詞を足す前にアート指示を固める',
    quickList: [
      'まず用途を決めます。ポスター、ポートレート、コンセプトアート、キャラクター設定、超現実作品、ギャラリー風の画像のどれかを選びます。',
      '6 つの制御項目を順番に書きます。主題、媒体、構図、光、質感、制約です。',
      'コピー用のプロンプト本体は英語のままにして、GPT Image 2、Nano Banana、Midjourney でそのまま使えるようにします。',
      '本人性、シルエット、配色、衣装、商品の形、レイアウトを保ちたいときだけ参考画像を使います。',
      '最初の結果を見たら、プロンプト全体を書き換える前に失敗点を 1 つだけ直します。',
    ],
    overviewImageAlt:
      'Vogue AI プロンプトライブラリのミニマル線画プロンプト例',
    overviewImageCaption:
      'この例は、媒体、余白、質感、文字を入れない条件が明確なので、全体像を説明する画像として使いやすいです。',
    chooserHeading: '書く前にプロンプトの型を選ぶ',
    chooserIntro:
      '弱いプロンプトの多くは、最初の単語を書く前に失敗しています。画像の役割を先に決め、近い構造をコピーします。',
    chooserHeaders: ['作りたいもの', '使う型', '優先する制御', '最初に見る失敗'],
    chooserRows: [
      ['すっきりしたポスターや表紙', 'ミニマル線画ポスター', '媒体、線の太さ、余白、紙の質感。', '装飾が多すぎる、またはシルエットが弱い。'],
      ['物語性のある場面や背景', '映画的なコンセプトアート', '主題の動線、前景・中景・背景、スケール、光源。', '奥行きが平坦、または焦点が曖昧。'],
      ['覚えやすいマスコットやアバター', 'スタイル化されたキャラクター設定', '形の言語、表情、衣装のシルエット、配色。', '余分な解剖表現、曖昧なポーズ、衣装の不統一。'],
      ['完成度の高いポートレート', 'エディトリアル調ファンタジーポートレート', '表情、衣装の質感、切り抜き、リムライト。', '肌が滑らかすぎる、衣装の情報が弱い、切り抜きが違う。'],
      ['ギャラリー作品のような発想', '超現実アート', 'コンセプトの対比、素材変化、抑制、触覚的な質感。', '象徴が多すぎる、または凡庸な超現実表現になる。'],
    ],
    formulaHeading: 'AI アート用プロンプトの 6 パート公式',
    formulaIntro:
      'この公式は安定した骨組みです。結果が失敗したら、全体を書き換えずに 1 行だけ変えます。',
    formulaHeaders: ['パート', '書く内容', '効く理由'],
    formulaRows: [
      ['主題', '人物、物体、生き物、場所、場面をはっきり書きます。', 'スタイル指示の前に、モデルには安定した対象が必要です。'],
      ['媒体', '線画、油彩、水彩、アニメ、3D レンダー、エディトリアル写真、コンセプトアート。', '媒体は質感、細部の密度、仕上がりを変えます。'],
      ['構図', '縦長ポートレート、横長フレーム、中央配置のポスター、余白、カメラ距離、階層のある場面。', '構図は初回結果が雑然とするのを防ぎます。'],
      ['光', 'ソフトボックス、リムライト、月光、夕方の光、硬いフラッシュ、ギャラリー照明、逆光。', '光は奥行き、雰囲気、制作感を作ります。'],
      ['質感', 'インク線、紙目、ブラッシュメタル、シルク、毛、石、霧、厚塗り。', '質感があると、汎用的な画像が具体的なアート指示になります。'],
      ['制約', '文字なし、ウォーターマークなし、シルエット維持、単純な背景、安定した人体、見出し用の空白。', '制約はよくある失敗を先に減らします。'],
    ],
    promptPackHeading: 'コピーできる AI アート用プロンプト例',
    promptPackIntro:
      '1 つのプロンプトをコピーし、角括弧の変数だけを差し替え、初回生成では構造を変えないでください。5 つのスタイルを 1 つのプロンプトに混ぜないほうが安定します。',
    promptLabel: 'プロンプト',
    caseOneHeading: 'ケース 1：ミニマルポスターの制御',
    caseOneBody:
      '線画プロンプトが効く理由は、媒体を指定し、画面の範囲を絞っているからです。余白、紙の粒子、文字なしという条件は装飾ではなく制作上の制御です。',
    caseOneCaption:
      '線画プロンプトでは、雰囲気語より先に媒体、線の太さ、余白、紙の質感を決めます。',
    caseTwoHeading: 'ケース 2：映画的な物語画面',
    caseTwoBody:
      '映画的なアートでは、主題が読みやすい環境の中を動いている必要があります。スケール、前景と背景の層、光源、画角を書きます。',
    caseTwoCaption:
      'この Nano Banana の例は、主役の物体、環境のスケール、重なった光が読み取りやすいので映画的な例として使えます。',
    caseTwoImageAlt:
      'Vogue AI プロンプトライブラリの宇宙シネマ風コンセプト例',
    caseThreeHeading: 'ケース 3：スタイル化されたキャラクター',
    caseThreeBody:
      'キャラクター用プロンプトでは、サムネイルでも読めることが重要です。形の言語、表情、シルエット、単純な背景は、長いスタイル参照より役に立つことがあります。',
    caseThreeCaption:
      'この Midjourney の例は、シルエット、表情、配色を一目で判断できるのでキャラクター例として使えます。',
    caseThreeImageAlt:
      'Vogue AI プロンプトライブラリの黄色い毛むくじゃらキャラクター例',
    workflowHeading: 'Vogue AI で繰り返せる作業手順',
    workflowIntro:
      'Vogue AI は単なる入力欄ではなく、制御しながら試作する場所として使います。ライブラリの例から始め、1 枚作り、最初の失敗点を診断します。',
    workflowList: [
      '見た目の好みではなく、用途に近いライブラリ例を選びます。',
      '構造をコピーし、主題、場所、配信先、スタイル変数だけを置き換えます。',
      '参考画像を足したりモデルを替えたりする前に、まず 1 枚の制御された下書きを作ります。',
      '本人性や形が違う場合は、参考画像を追加し、それが何を保つのかを明記します。',
      '課題を解決した最初のプロンプトを保存し、次の作品ではそこから複製します。',
    ],
    revisionRuleTitle: '修正ルール',
    revisionRuleText:
      '一度に変える制御層は 1 つだけにします。すべての句を同時に変えると、何が改善につながったのか分からなくなります。',
    diagnosisHeading: '最初の結果後に何を変えるか',
    diagnosisIntro:
      '強いプロンプト運用には修正経路が必要です。最初の結果を診断として使い、失敗した制御だけを変えます。',
    diagnosisHeaders: ['失敗パターン', '先に直すこと', '避けること'],
    diagnosisRows: [
      ['汎用的な AI っぽさ', '媒体、素材の質感、想定読者、より具体的な光を追加します。', '抽象的な形容詞をさらに足す。'],
      ['主題が弱い', '主題を最初の句に移し、シルエット、ポーズ、カメラ距離を定義します。', 'スタイル参照だけで始める。'],
      ['構図が散らかる', '切り抜き、余白、前景と背景、または単純な背景を追加します。', 'フレームを直す前にモデルを替える。'],
      ['スタイルがぶれる', '媒体とアート方向を 1 つずつに絞ります。', '好きな美学をすべて 1 つに詰め込む。'],
      ['文字や透かしが崩れる', '文字なしにして、タイポグラフィはデザインツールで入れます。', '画像内で完璧な最終文字を期待する。'],
    ],
    modelHeading: 'Vogue AI でのモデル選び',
    modelIntro:
      '同じ骨組みは複数モデルで使えますが、モデルごとに強調する部分を少し変えます。',
    modelList: [
      '指示の厳密な制御、参考画像を使った修正、制約の追従を重視するなら GPT Image 2 を使います。',
      '素早い発想、バリエーション、軽い画像から画像への探索には Nano Banana を使います。',
      '強い雰囲気、ファッション的な構図、スタイル化されたキャラクター、探索的なコンセプトアートには Midjourney を使います。',
      '制作向けの作業では、同じ骨組みを保ち、同じ失敗チェック表でモデル出力を比べます。',
    ],
    faqHeading: 'FAQ',
    faq: [
      ['AI アートに最適なプロンプトとは？', '具体的な用途に対して、主題、媒体、構図、光、質感、出力ルールを制御できるプロンプトです。短くても構造が明確なほうが、装飾的な長文より安定します。'],
      ['AI アートのプロンプトは長いほうがよいですか？', '画像を制御するのに必要な長さで十分です。主題、フレーム、スタイル、形式を守る詳細は残し、方向が衝突する詳細は削ります。'],
      ['同じプロンプトを別のモデルで使えますか？', '使えます。ただし骨組みを保ち、モデルごとの強調だけ変えます。GPT Image 2 は制約、Nano Banana は変化、Midjourney はスタイル探索に向いています。'],
      ['参考画像はいつ使うべきですか？', '本人性、シルエット、衣装、配色、商品の形、既存のビジュアル方向を保ちたいときに使います。ゆるい着想だけなら必須ではありません。'],
      ['AI アートが汎用的に見えるのはなぜですか？', '媒体、構図、光、質感、想定読者が足りないことが多いです。雰囲気語を増やす前に、具体的なアート指示を足します。'],
      ['アーティスト名を入れるべきですか？', '媒体、時代感、光、配色、構図を直接書いたほうが制御しやすいことが多いです。ツールや言語をまたいで調整もしやすくなります。'],
      ['最初の画像が惜しいけれど使えない場合は？', '良い部分を残し、主題、構図、光、質感、制約のどれか 1 つを直します。全体を書き換えると、最初の結果の良い部分まで失いやすいです。'],
    ],
  },
  ko: {
    ...enCopy,
    intro:
      '좋은 AI 아트 프롬프트는 마법 문장이 아니라 짧은 아트 디렉션입니다. 무엇을 그릴지, 어떻게 구도를 잡을지, 어떤 시각 언어를 쓸지, 첫 생성 후 무엇이 흔들리면 안 되는지를 정합니다.',
    quickHeading: 'TL;DR: 형용사보다 아트 디렉션을 먼저 정하기',
    quickList: [
      '먼저 작업을 정합니다: 포스터, 인물, 콘셉트 아트, 캐릭터 시트, 초현실 작품, 갤러리형 이미지.',
      '여섯 가지 제어 항목을 순서대로 씁니다: 주제, 매체, 구도, 빛, 질감, 제약.',
      '복사해서 쓰는 프롬프트 본문은 영어로 유지해 GPT Image 2, Nano Banana, Midjourney에서 바로 사용할 수 있게 합니다.',
      '정체성, 실루엣, 팔레트, 의상, 제품 형태, 레이아웃이 안정적으로 유지되어야 할 때만 참고 이미지를 씁니다.',
      '첫 결과가 나온 뒤에는 전체 프롬프트를 바꾸기 전에 실패 지점 하나만 고칩니다.',
    ],
    overviewImageAlt:
      'Vogue AI 프롬프트 라이브러리의 미니멀 라인 아트 예시',
    overviewImageCaption:
      '이 예시는 매체, 여백, 제어된 질감, 생성 텍스트 금지가 명확해 전체 흐름을 보여주기에 적합합니다.',
    chooserHeading: '쓰기 전에 프롬프트 유형 고르기',
    chooserIntro:
      '약한 프롬프트는 첫 단어를 쓰기 전부터 실패하는 경우가 많습니다. 이미지가 해야 할 일을 먼저 정하고 가장 가까운 구조를 복사하세요.',
    chooserHeaders: ['필요한 결과', '프롬프트 유형', '우선 제어할 것', '먼저 확인할 실패'],
    chooserRows: [
      ['깔끔한 포스터나 커버', '미니멀 라인 아트 포스터', '매체, 선 굵기, 여백, 종이 질감.', '장식이 너무 많거나 실루엣이 약함.'],
      ['이야기가 있는 장면이나 환경', '시네마틱 콘셉트 아트', '주제의 이동 경로, 전경/중경/배경, 스케일, 광원.', '깊이가 평평하거나 초점이 불명확함.'],
      ['기억에 남는 마스코트나 아바타', '스타일화된 캐릭터 시트', '형태 언어, 표정, 의상 실루엣, 팔레트.', '불필요한 해부 구조, 흐릿한 포즈, 일관성 없는 의상.'],
      ['완성도 있는 인물 이미지', '에디토리얼 판타지 인물', '표정, 의상 질감, 크롭, 림 라이트.', '피부가 지나치게 매끈함, 의상 디테일 부족, 잘못된 크롭.'],
      ['갤러리 작품 같은 아이디어', '초현실 아트워크', '개념 대비, 소재 변형, 절제, 촉각적인 질감.', '상징이 과하거나 일반적인 초현실 이미지가 됨.'],
    ],
    formulaHeading: 'AI 아트 프롬프트 6단계 공식',
    formulaIntro:
      '이 공식은 안정적인 뼈대입니다. 결과가 실패하면 전체를 다시 쓰지 말고 한 줄만 바꾸세요.',
    formulaHeaders: ['부분', '무엇을 쓸지', '왜 중요한지'],
    formulaRows: [
      ['주제', '사람, 물체, 생물, 장소, 장면을 명확하게 씁니다.', '스타일 지시가 효과를 내기 전에 모델에는 안정적인 기준점이 필요합니다.'],
      ['매체', '라인 아트, 유화, 수채화, 애니메이션, 3D 렌더, 에디토리얼 사진, 콘셉트 아트.', '매체는 질감, 디테일 밀도, 완성 느낌을 바꿉니다.'],
      ['구도', '세로 인물 크롭, 와이드 프레임, 중앙 포스터, 여백, 카메라 거리, 층이 있는 장면.', '구도는 첫 결과가 복잡해지는 것을 막습니다.'],
      ['빛', '소프트박스, 림 라이트, 달빛, 골든아워, 강한 플래시, 갤러리 조명, 역광.', '빛은 깊이, 분위기, 제작감을 만듭니다.'],
      ['질감', '잉크 선, 종이 결, 브러시드 메탈, 실크, 털, 돌, 안개, 두꺼운 붓질.', '질감은 일반 이미지를 구체적인 아트 디렉션으로 바꿉니다.'],
      ['제약', '텍스트 없음, 워터마크 없음, 실루엣 유지, 단순 배경, 안정적인 인체, 제목을 넣을 빈 공간.', '제약은 흔한 실패를 미리 줄입니다.'],
    ],
    promptPackHeading: '복사해서 쓰는 AI 아트 프롬프트 예시',
    promptPackIntro:
      '프롬프트 하나를 복사하고 대괄호 안 변수만 바꾼 뒤, 첫 생성에서는 구조를 유지하세요. 다섯 가지 스타일을 한 프롬프트에 섞지 않는 편이 안정적입니다.',
    promptLabel: '프롬프트',
    caseOneHeading: '케이스 1: 미니멀 포스터 제어',
    caseOneBody:
      '라인 아트 프롬프트가 효과적인 이유는 매체를 지정하고 시각 범위를 제한하기 때문입니다. 여백, 종이 결, 텍스트 없음은 장식이 아니라 제작 제어입니다.',
    caseOneCaption:
      '라인 아트 프롬프트는 분위기 단어보다 매체, 선 굵기, 여백, 종이 질감이 먼저 필요합니다.',
    caseTwoHeading: '케이스 2: 시네마틱 서사 이미지',
    caseTwoBody:
      '시네마틱 아트에서는 주제가 읽기 쉬운 환경 속을 지나가야 합니다. 스케일, 전경과 배경의 층, 광원, 프레임을 설명하세요.',
    caseTwoCaption:
      '이 Nano Banana 예시는 주인공 물체, 환경의 스케일, 층을 이룬 빛이 잘 읽혀 시네마틱 사례로 적합합니다.',
    caseTwoImageAlt:
      'Vogue AI 프롬프트 라이브러리의 우주 시네마틱 콘셉트 예시',
    caseThreeHeading: '케이스 3: 스타일화된 캐릭터',
    caseThreeBody:
      '캐릭터 프롬프트는 썸네일에서도 읽혀야 합니다. 형태 언어, 표정, 실루엣, 단순한 배경은 긴 스타일 참고 목록보다 더 중요할 때가 많습니다.',
    caseThreeCaption:
      '이 Midjourney 예시는 실루엣, 표정, 팔레트를 한눈에 판단할 수 있어 캐릭터 사례로 적합합니다.',
    caseThreeImageAlt:
      'Vogue AI 프롬프트 라이브러리의 노란 털복숭이 캐릭터 예시',
    workflowHeading: 'Vogue AI에서 반복할 수 있는 작업 흐름',
    workflowIntro:
      'Vogue AI를 단순한 입력창이 아니라 제어된 반복 제작 화면으로 사용하세요. 라이브러리 예시에서 시작해 한 장을 만들고 첫 실패를 진단합니다.',
    workflowList: [
      '예쁜 이미지가 아니라 작업 목적에 가장 가까운 라이브러리 예시를 고릅니다.',
      '구조를 복사하고 주제, 배경, 채널, 스타일 변수만 바꿉니다.',
      '참고 이미지를 추가하거나 모델을 바꾸기 전에 제어된 초안을 한 장 생성합니다.',
      '정체성이나 형태가 틀리면 참고 이미지를 추가하고 무엇을 제어하는지 정확히 적습니다.',
      '문제를 해결한 첫 프롬프트를 저장하고 다음 작품은 거기서 복제합니다.',
    ],
    revisionRuleTitle: '수정 규칙',
    revisionRuleText:
      '한 번에 하나의 제어층만 바꾸세요. 모든 절을 동시에 바꾸면 무엇이 이미지를 개선했는지 알 수 없습니다.',
    diagnosisHeading: '첫 결과 후 무엇을 바꿀지',
    diagnosisIntro:
      '좋은 프롬프트 시스템에는 수정 경로가 필요합니다. 첫 결과를 진단 자료로 보고 실패한 제어만 바꾸세요.',
    diagnosisHeaders: ['실패 유형', '먼저 고칠 것', '피할 것'],
    diagnosisRows: [
      ['일반적인 AI 느낌', '매체, 소재 질감, 대상 독자, 더 구체적인 조명을 추가합니다.', '추상 형용사를 더 많이 붙이기.'],
      ['주제가 약함', '주제를 첫 절로 옮기고 실루엣, 포즈, 카메라 거리를 정의합니다.', '스타일 참고만으로 시작하기.'],
      ['구도가 지저분함', '크롭, 여백, 전경/배경 층, 더 단순한 배경을 추가합니다.', '프레임을 고치기 전에 모델부터 바꾸기.'],
      ['스타일이 흔들림', '매체 하나와 아트 방향 하나만 유지합니다.', '좋아하는 미학을 한 프롬프트에 모두 쌓기.'],
      ['텍스트나 워터마크 오류', '텍스트 없음을 요청하고 타이포그래피는 디자인 도구에서 처리합니다.', '이미지 안에서 완벽한 최종 문자를 기대하기.'],
    ],
    modelHeading: 'Vogue AI 모델 선택',
    modelIntro:
      '같은 프롬프트 뼈대도 모델을 옮길 수 있지만, 각 모델마다 강조점을 조금 다르게 두어야 합니다.',
    modelList: [
      '더 엄격한 지시 제어, 참고 이미지 기반 수정, 깨끗한 제약 준수가 필요하면 GPT Image 2를 사용합니다.',
      '빠른 아이디어, 변형, 가벼운 이미지-투-이미지 탐색에는 Nano Banana를 사용합니다.',
      '표현적인 분위기, 패션식 프레이밍, 스타일화된 캐릭터, 탐색형 콘셉트 아트에는 Midjourney를 사용합니다.',
      '제작형 작업에서는 프롬프트 뼈대를 유지하고 같은 실패 체크리스트로 모델 출력을 비교합니다.',
    ],
    faqHeading: 'FAQ',
    faq: [
      ['AI 아트에 가장 좋은 프롬프트는 무엇인가요?', '정확한 작업에 맞춰 주제, 매체, 구도, 빛, 질감, 출력 규칙을 제어하는 프롬프트입니다. 짧아도 구조가 명확한 프롬프트가 장식적인 긴 문장보다 안정적인 경우가 많습니다.'],
      ['AI 아트 프롬프트는 길어야 하나요?', '이미지를 제어하는 데 필요한 만큼만 길면 됩니다. 주제, 프레임, 스타일, 출력 형식을 보호하는 디테일은 남기고 서로 충돌하는 지시는 줄이세요.'],
      ['같은 프롬프트를 다른 모델에서도 쓸 수 있나요?', '가능합니다. 뼈대는 유지하고 모델별 강조점만 바꾸세요. GPT Image 2는 제약 준수, Nano Banana는 변형, Midjourney는 스타일 탐색에 유리합니다.'],
      ['참고 이미지는 언제 써야 하나요?', '정체성, 실루엣, 의상, 팔레트, 제품 형태, 기존 시각 방향이 원본에 가까워야 할 때 사용합니다. 느슨한 영감만 필요하다면 꼭 필요하지 않습니다.'],
      ['왜 제 AI 아트가 너무 일반적으로 보이나요?', '매체, 구도, 빛, 질감, 대상 독자 맥락이 부족한 경우가 많습니다. 분위기 단어를 늘리기 전에 구체적인 아트 디렉션을 추가하세요.'],
      ['아티스트 이름을 넣어야 하나요?', '매체, 시대감, 빛, 팔레트, 구도를 직접 설명하는 편이 더 깨끗하게 제어되는 경우가 많습니다. 도구와 언어를 넘겨 조정하기도 쉽습니다.'],
      ['첫 이미지가 거의 맞지만 쓸 수 없다면 어떻게 하나요?', '잘 된 부분은 남기고 주제, 구도, 빛, 질감, 제약 중 하나만 고칩니다. 전체를 다시 쓰면 첫 결과의 강점까지 잃기 쉽습니다.'],
    ],
  },
};

export const bestPromptsForAiArtAutoBlogPost: BlogPostSource = {
  slug: 'best-prompts-for-ai-art',
  date: '2026-06-03',
  updatedAt: '2026-06-03',
  author: 'Vogue AI Team',
  image: promptLibraryImages.lineArt,
  imageAlt: 'Minimalist line-art AI prompt example from the Vogue AI prompt library',
  articleType: 'tutorial',
  modelTags: ['vogue-ai', 'gpt-image-2', 'nano-banana', 'midjourney'],
  readingMinutes: 11,
  localizations: {
    en: {
      title: 'Best prompts for AI art: copyable examples that stay controllable',
      summary:
        'Copy structured AI art prompt examples for posters, concept art, portraits, characters, and surreal artwork, then improve the first result inside Vogue AI.',
      seoTitle: 'Best Prompts for AI Art: Copyable Examples',
      seoDescription:
        'Use copyable AI art prompt examples with subject, medium, composition, lighting, texture, constraints, model-fit notes, and first-result fixes.',
      content: createContent(localeCopies.en),
    },
    zh: {
      title: 'AI 艺术提示词：可复制、可控的示例',
      summary:
        '复制适用于海报、概念图、人像、角色和超现实作品的提示词结构，并在 Vogue AI 中稳定迭代第一轮结果。',
      seoTitle: 'AI 艺术提示词可复制示例指南',
      seoDescription:
        '使用包含主体、媒介、构图、光线、质感、约束和模型选择建议的 AI 艺术提示词示例。',
      content: createContent(localeCopies.zh),
    },
    fr: {
      title: 'Prompts pour art IA : exemples copiables et contrôlables',
      summary:
        'Des structures de prompts pour affiches, concept art, portraits, personnages et œuvres surréalistes, à adapter dans Vogue AI.',
      seoTitle: 'Prompts pour art IA : exemples copiables',
      seoDescription:
        'Utilisez des exemples de prompts pour art IA avec sujet, médium, composition, lumière, texture, contraintes et corrections.',
      content: createContent(localeCopies.fr),
    },
    ru: {
      title: 'Промпты для AI-арта: копируемые и управляемые примеры',
      summary:
        'Структуры промптов для постеров, концепт-арта, портретов, персонажей и сюрреалистичных работ, которые удобно адаптировать в Vogue AI.',
      seoTitle: 'Промпты для AI-арта: копируемые примеры',
      seoDescription:
        'Используйте примеры промптов для AI-арта с объектом, медиумом, композицией, светом, фактурой, ограничениями и правилами исправления.',
      content: createContent(localeCopies.ru),
    },
    pt: {
      title: 'Prompts para arte com IA: exemplos copiáveis com controle',
      summary:
        'Estruturas de prompts para pôsteres, concept art, retratos, personagens e arte surreal, prontas para adaptar no Vogue AI.',
      seoTitle: 'Prompts para arte com IA: exemplos copiáveis',
      seoDescription:
        'Use exemplos de prompts para arte com IA com assunto, mídia, composição, luz, textura, restrições e correções.',
      content: createContent(localeCopies.pt),
    },
    ja: {
      title: 'AI アート用プロンプト：コピーしやすく制御しやすい例',
      summary:
        'ポスター、コンセプトアート、ポートレート、キャラクター、超現実作品に使えるプロンプト構造を Vogue AI で調整する実践ガイドです。',
      seoTitle: 'AI アート用プロンプトのコピー例ガイド',
      seoDescription:
        '主題、媒体、構図、光、質感、制約、モデル選び、修正ルールを含む AI アート用プロンプト例。',
      content: createContent(localeCopies.ja),
    },
    ko: {
      title: 'AI 아트 프롬프트: 복사하기 쉽고 제어하기 쉬운 예시',
      summary:
        '포스터, 콘셉트 아트, 인물, 캐릭터, 초현실 작품에 쓸 수 있는 프롬프트 구조를 Vogue AI에서 안정적으로 조정하는 가이드입니다.',
      seoTitle: 'AI 아트 프롬프트 복사용 예시 가이드',
      seoDescription:
        '주제, 매체, 구도, 빛, 질감, 제약, 모델 선택과 수정 규칙을 포함한 AI 아트 프롬프트 예시.',
      content: createContent(localeCopies.ko),
    },
  },
};
