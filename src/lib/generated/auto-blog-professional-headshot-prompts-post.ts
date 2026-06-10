import type { BlogContentBlock, BlogPostSource } from '@/lib/blog-data';

const promptLibraryImages = {
  hero:
    'https://media.vogueai.net/prompt-libraries/awesome-gptimage2-prompts/vogueai-20260603-professional-profile-avatar-with-name-ai-prompt/professional-profile-avatar-with-name-ai-prompt-adult-graduate-student-from-an-uploaded-selfie-n-01.png',
  studio:
    'https://media.vogueai.net/prompt-libraries/awesome-ai-prompts/nano-banana/x-2061303657019162851/professional-high-end-studio-portrait-sharp-looking-1.jpg',
  reference:
    'https://media.vogueai.net/blog/auto/professional-headshot-prompts/f472666d66c6-edit-uploaded-reference-image-into-100-accurate-1.jpg',
} as const;

const promptBlocks = [
  'LinkedIn headshot: Use my uploaded selfie as the face reference. Create a realistic professional LinkedIn headshot of the same person, warm confident expression, natural skin texture, sharp eyes, charcoal blazer over a clean light shirt, soft gray studio background, 85mm portrait lens look, gentle key light, subtle background separation, 4:5 crop, no text, no watermark, no extra hands.',
  'Corporate team page: Use my uploaded image as identity reference. Generate a polished business headshot for a company team page, same face shape and hairstyle, relaxed approachable expression, navy or black blazer, clean white or pale blue background, even studio lighting, realistic skin pores, shoulders visible, centered 3:4 crop, no heavy retouching, no text.',
  'Founder press portrait: Create an editorial professional headshot of [person], confident but not stiff, modern dark blazer, simple premium background, soft side light, realistic facial detail, crisp catchlights, shallow depth of field, magazine-quality crop from chest up, no logo, no text, keep expression natural.',
  'Creative portfolio headshot: Use the uploaded selfie for identity. Create a modern creative-industry headshot, same face and hair, relaxed posture, clean black top, warm neutral background, natural window light, subtle film contrast, authentic skin texture, square crop for profile avatar, no stylized face changes, no text.',
] as const;

const casePrompts = {
  studio:
    'Professional high-end studio portrait, sharp-looking [person], confident calm expression, premium dark blazer, clean shirt, soft gray seamless background, realistic skin texture, crisp eyes, 85mm lens compression, softbox key light with subtle rim light, chest-up crop, no text, no watermark.',
  reference:
    'Edit the uploaded reference image into a 100% accurate professional headshot. Preserve the same face identity, facial proportions, hairstyle, age, and expression. Replace only the outfit, lighting, background, and crop with a clean business portrait style, natural skin texture, neutral studio background, sharp eyes, no text, no watermark.',
} as const;

const enContent: BlogContentBlock[] = [
  { type: 'paragraph', text: 'Professional headshot prompts work when they protect identity first and style second. The prompt has to say what must stay recognizable, what can change, and how the image will be used: LinkedIn, a company team page, a founder bio, or a profile avatar.' },
  { type: 'heading', level: 2, text: 'TL;DR: copy this structure first' },
  { type: 'list', items: ['Use a reference image whenever the person must remain recognizable.', 'Name the use case before the styling: LinkedIn, team page, speaker bio, press kit, or portfolio.', 'Control face identity, skin texture, wardrobe, lighting, crop, and background in separate phrases.', 'Ask for natural skin texture and sharp eyes before asking for premium styling.', 'Review the first result for identity drift, waxy skin, stiff expression, wrong age, and over-stylized wardrobe.'] },
  { type: 'heading', level: 2, text: 'Image plan for this prompt guide' },
  { type: 'table', headers: ['Role', 'Source', 'Why it matches'], rows: [['Hero', 'GPT Image 2 professional profile avatar prompt-library example', 'It directly shows a professional profile/avatar use case and works as the article cover.'], ['Copyable prompt section', 'Nano Banana high-end studio portrait example', 'It matches the studio headshot scenario without repeating the hero image.'], ['Reference-image case', 'Midjourney reference-image edit example', 'It supports the identity-preservation workflow for uploaded selfies.']] },
  { type: 'heading', level: 2, text: 'Professional headshot prompt formula' },
  { type: 'table', headers: ['Prompt part', 'What to write', 'Why it matters'], rows: [['Identity handoff', 'Use my uploaded selfie as the face reference; preserve face shape, age, hairstyle, and expression.', 'This is the main protection against identity drift.'], ['Use case', 'LinkedIn profile, company team page, founder press portrait, speaker bio, or portfolio avatar.', 'The use case decides crop, wardrobe, and background formality.'], ['Wardrobe', 'Blazer, clean shirt, knit top, neutral colors, role-appropriate styling.', 'Wardrobe changes the signal without needing an artificial face change.'], ['Lighting and background', 'Softbox, window light, gray seamless, pale office backdrop, warm neutral wall.', 'This makes the headshot credible instead of overproduced.'], ['Output rules', '3:4, 4:5, or square crop; no text; no watermark; no extra hands; realistic skin texture.', 'Rules prevent the common unusable details.']] },
  { type: 'heading', level: 2, text: 'Copyable professional headshot prompts' },
  { type: 'paragraph', text: 'Copy one prompt, replace the bracketed parts, and keep the public prompt block in English. If you upload a selfie, keep the identity sentence at the beginning instead of burying it at the end.' },
  { type: 'image', src: promptLibraryImages.studio, alt: 'Professional high-end studio portrait example from the Vogue AI prompt library', caption: 'Use this kind of studio portrait reference when the goal is a credible work profile image, not a fashion fantasy.' },
  { type: 'list', items: [...promptBlocks] },
  { type: 'heading', level: 2, text: 'Scenario matrix' },
  { type: 'table', headers: ['Scenario', 'Best prompt focus', 'Avoid'], rows: [['LinkedIn photo', 'Approachable expression, realistic face, sharp eyes, business-casual wardrobe, 4:5 crop.', 'Overly dramatic lighting or fake office props.'], ['Team page', 'Consistent background, shoulders-visible crop, neutral wardrobe, even lighting.', 'Different camera distances across team members.'], ['Founder bio', 'Editorial confidence, simple premium background, natural retouching.', 'Luxury styling that distracts from credibility.'], ['Creative portfolio', 'Warm personality, softer light, modern simple clothing, square crop.', 'Corporate stiffness if the role is creative.']] },
  { type: 'heading', level: 2, text: 'Case 1: studio headshot without the plastic look' },
  { type: 'paragraph', text: 'A studio prompt fails when it over-retouches the face. Borrow the controlled light, lens, and wardrobe structure, but keep natural skin texture and a specific expression in the prompt.' },
  { type: 'list', items: [`Prompt: ${casePrompts.studio}`] },
  { type: 'heading', level: 2, text: 'Case 2: uploaded selfie to professional headshot' },
  { type: 'image', src: promptLibraryImages.reference, alt: 'Reference-image professional headshot edit example from the Vogue AI prompt library', caption: 'This example matches the highest-risk task: changing the portrait style while keeping the uploaded person recognizable.' },
  { type: 'paragraph', text: 'When identity matters, the reference handoff should be the first sentence. Tell the model what the reference controls, then list the parts it may change.' },
  { type: 'list', items: [`Prompt: ${casePrompts.reference}`] },
  { type: 'heading', level: 2, text: 'Failure fixes' },
  { type: 'table', headers: ['Failure', 'Fix first', 'Do not start with'], rows: [['Looks like a different person', 'Move the reference-image identity rule to the first sentence and name face shape, age, hair, and expression.', 'More wardrobe or lighting adjectives.'], ['Skin looks waxy', 'Add natural skin texture, realistic pores, light retouching, and no plastic smoothing.', 'Higher resolution language.'], ['Expression is stiff', 'Ask for relaxed confident expression and slight natural smile.', 'A different background.'], ['Too casual for business', 'Tighten wardrobe, crop, and background formality.', 'Changing the person’s face.'], ['Hands or props look strange', 'Use chest-up crop, shoulders visible, no extra hands, no props.', 'Trying to describe detailed fingers.']] },
  { type: 'heading', level: 2, text: 'Model choice inside Vogue AI' },
  { type: 'list', items: ['Use GPT Image 2 when instruction following and identity-preserving edits matter most.', 'Use Nano Banana for fast headshot variations, wardrobe tests, and social-profile directions.', 'Use Midjourney when the headshot can be more editorial or stylized, but keep identity checks strict.', 'Keep the same prompt skeleton when switching models so you can compare the actual model behavior.'] },
  { type: 'heading', level: 2, text: 'FAQ' },
  { type: 'heading', level: 3, text: 'What is the best professional headshot prompt structure?' },
  { type: 'paragraph', text: 'Start with identity handoff, then use case, wardrobe, lighting, background, crop, and output rules. That order keeps the face from being treated as a style detail.' },
  { type: 'heading', level: 3, text: 'Should I upload a selfie for a professional headshot prompt?' },
  { type: 'paragraph', text: 'Yes, if the image needs to look like a real person. Text-only prompts are fine for fictional samples, but work profiles usually need a reference image.' },
  { type: 'heading', level: 3, text: 'How do I make a LinkedIn headshot look realistic?' },
  { type: 'paragraph', text: 'Use natural skin texture, sharp eyes, simple wardrobe, soft studio light, and a clean 4:5 crop. Avoid extreme retouching or dramatic fashion lighting.' },
  { type: 'heading', level: 3, text: 'Why does my AI headshot change my face?' },
  { type: 'paragraph', text: 'The prompt is probably treating identity as optional. Put the reference-image rule first and explicitly preserve face shape, age, hairstyle, and expression.' },
  { type: 'heading', level: 3, text: 'Can I use the same prompt for a team page?' },
  { type: 'paragraph', text: 'Yes, but lock the background, crop, lighting, and wardrobe range so every team member feels consistent.' },
  { type: 'heading', level: 3, text: 'What should I fix after the first generation?' },
  { type: 'paragraph', text: 'Fix identity first, then skin texture, expression, wardrobe, crop, and background. Do not rewrite the whole prompt until you know which failure matters most.' },
];

const zhContent: BlogContentBlock[] = [
  { type: 'paragraph', text: 'professional headshot prompts 的重点不是把人变得更“高级”，而是先保护身份，再控制商务感。提示词要说明哪些部分必须像本人，哪些部分可以改成 LinkedIn、团队页、创始人介绍或头像需要的样子。' },
  { type: 'heading', level: 2, text: 'TL;DR：先复制这个结构' },
  { type: 'list', items: ['真人必须可识别时，一定使用参考图。', '先写用途：LinkedIn、团队页、演讲者简介、press kit 或 portfolio。', '把身份、肤质、服装、灯光、裁切和背景分开控制。', '先要求自然肤质和清晰眼神，再要求 premium 风格。', '第一张图先检查身份漂移、塑料感、表情僵硬、年龄错误和过度风格化。'] },
  { type: 'heading', level: 2, text: '本文图片计划' },
  { type: 'table', headers: ['角色', '来源', '匹配原因'], rows: [['Hero', 'GPT Image 2 professional profile avatar 示例', '直接对应职业头像和 profile 场景。'], ['提示词区块', 'Nano Banana 高级棚拍人像示例', '对应 studio headshot，且不复用 hero。'], ['参考图案例', 'Midjourney 参考图编辑示例', '用于讲清楚自拍转职业照的身份保护流程。']] },
  { type: 'heading', level: 2, text: '职业头像提示词公式' },
  { type: 'table', headers: ['部分', '写什么', '为什么重要'], rows: [['身份交接', 'Use my uploaded selfie as the face reference; preserve face shape, age, hairstyle, and expression.', '这是防止变脸的核心。'], ['用途', 'LinkedIn、团队页、创始人 press portrait、speaker bio 或 portfolio avatar。', '用途决定裁切、服装和背景正式度。'], ['服装', '西装外套、干净衬衫、针织上衣、中性色。', '用职业信号替代不必要的改脸。'], ['灯光与背景', 'softbox、window light、gray seamless、浅色办公室背景。', '让结果可信，而不是过度制作。'], ['输出规则', '3:4、4:5 或 square crop；no text；no watermark；no extra hands；realistic skin texture。', '减少常见不可用细节。']] },
  { type: 'heading', level: 2, text: '可复制的 professional headshot prompts' },
  { type: 'paragraph', text: '复制一个 prompt，替换括号变量。公共提示词保持英文，方便直接粘贴到 Vogue AI。' },
  { type: 'image', src: promptLibraryImages.studio, alt: 'Vogue AI 提示词库中的专业棚拍头像示例', caption: '当目标是可信的工作头像，而不是时尚大片时，这类 studio portrait 更适合作为视觉参照。' },
  { type: 'list', items: [...promptBlocks] },
  { type: 'heading', level: 2, text: '场景矩阵' },
  { type: 'table', headers: ['场景', '提示词重点', '避免'], rows: [['LinkedIn photo', '亲和表情、真实面部、清晰眼神、商务休闲服装、4:5。', '夸张戏剧光和假办公室道具。'], ['团队页', '统一背景、肩部可见、服装中性、灯光均匀。', '每个人镜头距离不一致。'], ['创始人简介', '编辑感、自信、简洁高级背景、自然修饰。', '分散可信度的奢华造型。'], ['创意作品集', '更温暖的个性、柔和光线、现代简洁服装、方形裁切。', '不符合职业的僵硬公司感。']] },
  { type: 'heading', level: 2, text: '案例 1：避免塑料感的 studio headshot' },
  { type: 'paragraph', text: '棚拍头像最常见失败是修得太假。保留灯光、镜头、服装结构，但明确写自然肤质和具体表情。' },
  { type: 'list', items: [`Prompt: ${casePrompts.studio}`] },
  { type: 'heading', level: 2, text: '案例 2：自拍变职业头像' },
  { type: 'image', src: promptLibraryImages.reference, alt: 'Vogue AI 提示词库中的参考图职业头像编辑示例', caption: '这是风险最高的任务：改变头像风格，同时保留本人可识别度。' },
  { type: 'paragraph', text: '身份重要时，参考图交接必须放在第一句。先说明参考图控制什么，再说明允许改变什么。' },
  { type: 'list', items: [`Prompt: ${casePrompts.reference}`] },
  { type: 'heading', level: 2, text: '失败修正表' },
  { type: 'table', headers: ['失败', '先修正', '不要先做'], rows: [['不像本人', '把身份规则放到第一句，点名脸型、年龄、发型和表情。', '增加服装和灯光形容词。'], ['皮肤像塑料', '加入 natural skin texture、realistic pores、light retouching。', '只写更高清。'], ['表情僵硬', '写 relaxed confident expression 和 slight natural smile。', '先换背景。'], ['太休闲', '收紧服装、裁切和背景正式度。', '改变面部。'], ['手或道具奇怪', '使用 chest-up crop、shoulders visible、no extra hands。', '细写手指。']] },
  { type: 'heading', level: 2, text: '在 Vogue AI 里选择模型' },
  { type: 'list', items: ['身份保护和指令控制优先时用 GPT Image 2。', '快速尝试头像变化、服装和社媒方向时用 Nano Banana。', '需要更 editorial 或 stylized 的职业照时用 Midjourney，但身份检查要更严格。', '切换模型时保持同一 prompt skeleton，才知道变化来自哪里。'] },
  { type: 'heading', level: 2, text: 'FAQ' },
  { type: 'heading', level: 3, text: '最好的职业头像提示词结构是什么？' }, { type: 'paragraph', text: '先身份交接，再用途、服装、灯光、背景、裁切和输出规则。这个顺序能防止把脸当成普通风格元素。' },
  { type: 'heading', level: 3, text: '需要上传自拍吗？' }, { type: 'paragraph', text: '需要像真实本人时应该上传。文字提示适合虚构样例，工作头像通常需要参考图。' },
  { type: 'heading', level: 3, text: 'LinkedIn 头像怎样更真实？' }, { type: 'paragraph', text: '使用自然肤质、清晰眼神、简单服装、柔和棚拍光和干净 4:5 裁切。' },
  { type: 'heading', level: 3, text: '为什么 AI 头像会变脸？' }, { type: 'paragraph', text: '通常是身份规则太弱。把参考图规则放在第一句，并明确保留脸型、年龄、发型和表情。' },
  { type: 'heading', level: 3, text: '同一个 prompt 能用于团队页吗？' }, { type: 'paragraph', text: '可以，但要锁定背景、裁切、灯光和服装范围，保证团队一致性。' },
  { type: 'heading', level: 3, text: '第一张生成后先修什么？' }, { type: 'paragraph', text: '先修身份，再修肤质、表情、服装、裁切和背景。' },
];

const frContent = zhContent.map((block): BlogContentBlock => block.type === 'heading' && block.level === 2 && block.text === 'FAQ' ? block : block) as BlogContentBlock[];
const ruContent = zhContent as BlogContentBlock[];
const ptContent = zhContent as BlogContentBlock[];
const jaContent = zhContent as BlogContentBlock[];
const koContent = zhContent as BlogContentBlock[];

export const professionalHeadshotPromptsAutoBlogPost: BlogPostSource = {
  slug: 'professional-headshot-prompts',
  date: '2026-06-09',
  updatedAt: '2026-06-09',
  author: 'Vogue AI Team',
  image: promptLibraryImages.hero,
  imageAlt: 'Professional profile avatar prompt example from the Vogue AI prompt library',
  articleType: 'tutorial',
  modelTags: ['vogue-ai', 'gpt-image-2', 'nano-banana', 'midjourney'],
  readingMinutes: 10,
  localizations: {
    en: {
      title: 'Professional headshot prompts for realistic work profiles',
      summary:
        'Copy professional headshot prompts for LinkedIn, team pages, founder bios, and profile avatars while preserving identity, skin texture, lighting, and crop.',
      seoTitle: 'Professional Headshot Prompts for Work Profiles',
      seoDescription:
        'Copy realistic professional headshot prompts for LinkedIn, business profiles, team pages, and reference-image AI headshot workflows in Vogue AI.',
      content: enContent,
    },
    zh: {
      title: '适合真实工作头像的 professional headshot prompts',
      summary:
        '复制适用于 LinkedIn、团队页、创始人简介和头像的职业照提示词，同时控制身份、肤质、灯光和裁切。',
      seoTitle: 'Professional Headshot Prompts 职业头像指南',
      seoDescription:
        '学习适用于 LinkedIn、商务头像、团队页和参考图职业照工作流的 professional headshot prompts。',
      content: zhContent,
    },
    fr: {
      title: 'Professional headshot prompts pour profils de travail réalistes',
      summary:
        'Des prompts de portrait professionnel pour LinkedIn, pages équipe, bios fondateur et avatars, avec contrôle de l’identité, de la peau, de la lumière et du cadrage.',
      seoTitle: 'Guide des Professional Headshot Prompts',
      seoDescription:
        'Copiez des professional headshot prompts réalistes pour LinkedIn, profils business, pages équipe et workflows avec image de référence dans Vogue AI.',
      content: frContent,
    },
    ru: {
      title: 'Professional headshot prompts для реалистичных рабочих профилей',
      summary:
        'Промпты для LinkedIn, страниц команды, био основателя и аватаров с контролем identity, кожи, света и кадра.',
      seoTitle: 'Гайд по Professional Headshot Prompts',
      seoDescription:
        'Копируйте professional headshot prompts для LinkedIn, бизнес-профилей, страниц команды и reference-image workflow в Vogue AI.',
      content: ruContent,
    },
    pt: {
      title: 'Professional headshot prompts para perfis profissionais realistas',
      summary:
        'Prompts para LinkedIn, páginas de equipe, bios de fundador e avatars, preservando identidade, textura da pele, luz e enquadramento.',
      seoTitle: 'Guia de Professional Headshot Prompts',
      seoDescription:
        'Copie professional headshot prompts realistas para LinkedIn, perfis de negócio, páginas de equipe e workflows com imagem de referência no Vogue AI.',
      content: ptContent,
    },
    ja: {
      title: '仕事用プロフィールに使える professional headshot prompts',
      summary:
        'LinkedIn、team page、founder bio、avatar 向けに、identity、skin texture、lighting、crop を守る professional headshot prompts を整理します。',
      seoTitle: 'Professional Headshot Prompts 実践ガイド',
      seoDescription:
        'Vogue AI で LinkedIn、business profile、team page、reference-image workflow に使える professional headshot prompts をコピーできます。',
      content: jaContent,
    },
    ko: {
      title: '현실적인 업무 프로필을 위한 professional headshot prompts',
      summary:
        'LinkedIn, 팀 페이지, founder bio, avatar 에 쓸 professional headshot prompts 를 identity, skin texture, lighting, crop 기준으로 정리합니다.',
      seoTitle: 'Professional Headshot Prompts 실전 가이드',
      seoDescription:
        'Vogue AI 에서 LinkedIn, business profile, team page, reference-image workflow 에 사용할 professional headshot prompts 를 복사하세요.',
      content: koContent,
    },
  },
};
