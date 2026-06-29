import type { BlogContentBlock, BlogPostSource } from '@/lib/blog-data';

const promptLibraryImages = {
  hero:
    'https://media.vogueai.net/prompt-libraries/awesome-gptimage2-prompts/vogueai-20260611-visual-poster-ai-prompt-5/visual-poster-ai-prompt-5-visual-poster-x2064660281733550305-v1-schema-01.png',
  hierarchy:
    'https://media.vogueai.net/blog/auto/system-prompts-and-models-of-ai-tools/68c756e2be1b-celebrity-information-system-profile-01-identity-bio-1.jpg',
  modelFit:
    'https://media.vogueai.net/blog/auto/system-prompts-and-models-of-ai-tools/144c00fb8b1f-does-anyone-realize-how-hard-it-is-1.jpg',
} as const;

const promptBlocks = [
  'System-aware product prompt: Create a premium product hero image for [product]. Preserve the product silhouette and material cues. Use [model family] strengths for [photorealism / stylized mood / fast variation]. 4:5 aspect ratio, clean background, no text, no watermark.',
  'Reference-safe portrait prompt: Use the uploaded image only for face identity, hair shape, and age cues. Change wardrobe, lighting, pose, and background into [campaign style]. Keep the person recognizable, avoid extra hands, no text.',
  'Instruction hierarchy test prompt: Generate [scene]. Must keep [non-negotiable element]. Prefer [style direction] only if it does not conflict with the subject, crop, identity, or safety rules. If the style conflicts, preserve the subject first.',
  'Model-fit rewrite prompt: Rewrite this visual brief for GPT Image 2, Nano Banana, and Midjourney. Keep the same subject and output goal, but change the wording to match each model family: instruction control, fast variation, or stylized exploration.',
] as const;

const enContent: BlogContentBlock[] = [
  {
    type: 'paragraph',
    text: 'System prompts and model instructions shape how AI tools interpret your visible prompt. You usually cannot see the hidden system prompt, but you can still write better image prompts by understanding instruction hierarchy, model fit, reference-image handoff, and the limits the tool may enforce before your prompt is executed.',
  },
  {
    type: 'heading',
    level: 2,
    text: 'TL;DR: write prompts that cooperate with the tool',
  },
  {
    type: 'list',
    items: [
      'Treat the system prompt as the tool policy and behavior layer that your user prompt must work inside.',
      'Put non-negotiable visual facts before optional style language: subject, identity, crop, reference use, and output rules.',
      'Choose the model family by job: GPT Image 2 for instruction control, Nano Banana for quick image variations, and Midjourney for mood-led exploration.',
      'Do not chase hidden prompts. Build visible prompts that state what must stay fixed, what may change, and how the first result will be judged.',
      'When a result fails, diagnose whether the conflict came from hierarchy, model limits, reference ambiguity, or unsafe/impossible wording.',
    ],
  },
  {
    type: 'heading',
    level: 2,
    text: 'What a system prompt does in an AI image tool',
  },
  {
    type: 'paragraph',
    text: 'A system prompt is the instruction layer set by the tool or model provider. It can define tone, safety boundaries, formatting behavior, tool use, refusal behavior, and how the model should prioritize instructions. In an image tool, that means your visible prompt is not the only instruction in the room.',
  },
  {
    type: 'table',
    headers: ['Instruction layer', 'Who controls it', 'What it changes for image prompts'],
    rows: [
      ['System prompt', 'Tool or model provider', 'Safety rules, default behavior, output boundaries, and instruction priority.'],
      ['Developer or app instruction', 'The product interface', 'Model routing, prompt-library defaults, reference-image handling, and workspace constraints.'],
      ['User prompt', 'You', 'Subject, scene, style, crop, reference role, and review criteria.'],
      ['Reference image', 'You and the model', 'Identity, composition, palette, object shape, or mood when the role is explicit.'],
      ['Model behavior', 'Model family', 'How strictly instructions are followed, how style is interpreted, and which details drift first.'],
    ],
  },
  {
    type: 'heading',
    level: 2,
    text: 'Instruction hierarchy for visual prompts',
  },
  {
    type: 'image',
    src: promptLibraryImages.hierarchy,
    alt: 'Profile-style prompt-library image used to explain identity and instruction hierarchy',
    caption:
      'A profile-style visual is useful here because identity, biography cues, and allowed transformations depend on clear hierarchy: what must stay fixed and what the model may reinterpret.',
  },
  {
    type: 'paragraph',
    text: 'Hierarchy matters because style language often competes with identity and layout. If your prompt says "exact product shape" and later asks for a surreal melting poster, the model has to decide which instruction wins. Strong prompts make that decision explicit.',
  },
  {
    type: 'list',
    items: [
      'First: identity and subject facts that must not change.',
      'Second: composition, crop, aspect ratio, and channel requirements.',
      'Third: reference-image role: identity, palette, layout, texture, or mood.',
      'Fourth: style, lighting, lens, material, and atmosphere.',
      'Fifth: negative rules such as no text, no watermark, no extra hands, and no logo distortion.',
    ],
  },
  {
    type: 'heading',
    level: 2,
    text: 'Scenario matrix: prompt system, model, and failure mode',
  },
  {
    type: 'table',
    headers: ['Job', 'Best visible instruction', 'Model fit', 'Likely failure'],
    rows: [
      ['Product image', 'Preserve shape, material, packaging, crop, and background before style.', 'GPT Image 2 or Nano Banana when reference control matters.', 'Pretty image, wrong product silhouette.'],
      ['Portrait variation', 'State exactly what the reference controls and what can change.', 'Nano Banana for quick variations; GPT Image 2 for tighter instruction following.', 'Face drift or over-stylized identity.'],
      ['Fashion concept', 'Name mood, garment structure, pose, and camera distance.', 'Midjourney when the concept is exploratory and not identity-critical.', 'Strong mood but weak real-world specificity.'],
      ['Poster visual', 'Reserve empty headline area and avoid generated text.', 'GPT Image 2 for layout control; Midjourney for mood exploration.', 'Cluttered frame or fake unreadable typography.'],
      ['UI mockup', 'Keep interface hierarchy and device framing clear.', 'GPT Image 2 when structure matters most.', 'Decorative screen noise instead of useful hierarchy.'],
    ],
  },
  {
    type: 'heading',
    level: 2,
    text: 'Copyable prompts for system-aware image work',
  },
  {
    type: 'paragraph',
    text: 'Use these blocks as visible prompts. They do not expose hidden system prompts; they help your prompt cooperate with the instruction layers that already exist in the tool.',
  },
  {
    type: 'list',
    items: [...promptBlocks],
  },
  {
    type: 'heading',
    level: 2,
    text: 'Worked example: diagnose a weak first result',
  },
  {
    type: 'heading',
    level: 3,
    text: 'Raw job',
  },
  {
    type: 'paragraph',
    text: 'You need a launch poster for a silver smart ring. The ring shape and finish must stay stable, the frame needs clean headline space, and the mood should feel premium rather than sci-fi.',
  },
  {
    type: 'heading',
    level: 3,
    text: 'Prompt version 1',
  },
  {
    type: 'list',
    items: [
      'Premium launch poster for a silver smart ring, exact ring silhouette and brushed-metal finish, centered product hero, deep charcoal background, soft rim light, clean negative space above the ring for future headline, 4:5 aspect ratio, no generated text, no watermark.',
    ],
  },
  {
    type: 'heading',
    level: 3,
    text: 'Diagnosis rule',
  },
  {
    type: 'paragraph',
    text: 'If the ring looks beautiful but the silhouette changes, the failure is not a style problem. Add a reference image and state that it controls silhouette, thickness, finish, and logo position. If the silhouette is correct but the frame is too busy, keep the identity instructions and revise crop, background, and negative space.',
  },
  {
    type: 'callout',
    title: 'Revision rule',
    text: 'Fix hierarchy before style. Strengthen the non-negotiable instruction, then change only one optional control such as lighting, background, or model family.',
  },
  {
    type: 'heading',
    level: 2,
    text: 'How model families change prompt behavior',
  },
  {
    type: 'image',
    src: promptLibraryImages.modelFit,
    alt: 'Stylized Midjourney prompt-library image used to explain model-fit behavior',
    caption:
      'A stylized model-family example belongs near model-fit guidance because it shows where mood and composition can become the main value instead of strict object preservation.',
  },
  {
    type: 'paragraph',
    text: 'The same visible prompt can behave differently across model families. That is not only a prompt-quality issue; it is a model-fit issue. In Vogue AI, use model tags as a routing choice instead of treating every prompt as universal text.',
  },
  {
    type: 'list',
    items: [
      'GPT Image 2: use for controlled product visuals, layout-sensitive posters, UI mockups, and edits where instruction following matters.',
      'Nano Banana: use for fast variations, social image experiments, reference-led portraits, and lightweight image-to-image exploration.',
      'Midjourney: use for fashion mood, editorial atmosphere, stylized concepts, and exploratory art direction.',
      'Switch models only after you know what failed. A wrong silhouette needs reference handoff; a flat mood may need a different model family.',
    ],
  },
  {
    type: 'heading',
    level: 2,
    text: 'Mistake and fix table',
  },
  {
    type: 'table',
    headers: ['Failure', 'Likely cause', 'Fix first'],
    rows: [
      ['The model ignores a key object detail', 'The prompt made style louder than identity.', 'Move the object detail into the first sentence and mark it non-negotiable.'],
      ['The reference image changes too much', 'The reference role is vague.', 'Say whether the reference controls identity, palette, layout, texture, or mood.'],
      ['The result has fake text', 'The prompt asked the model to design final typography.', 'Reserve empty headline space and add text later in a design tool.'],
      ['The style is strong but off-brief', 'The model family favors mood over strict control.', 'Try a control-oriented model or reduce optional style language.'],
      ['The tool refuses or softens the request', 'The request conflicts with safety or product policy.', 'Reframe the task around allowed visual goals and remove prohibited claims.'],
    ],
  },
  {
    type: 'heading',
    level: 2,
    text: 'Use this inside Vogue AI',
  },
  {
    type: 'paragraph',
    text: 'In Vogue AI, start from a prompt-library example that matches the job, then adapt the visible prompt around hierarchy. Use the workspace to test one model family, inspect the first failure, and then decide whether to tighten instructions, add a reference image, or switch model tags.',
  },
  {
    type: 'list',
    items: [
      'Open the prompt example closest to your visual job, not the prettiest image in the gallery.',
      'Keep public prompt blocks in English when you want predictable copy-paste behavior across tools.',
      'Use reference images for identity, product shape, packaging, UI hierarchy, and palette continuity.',
      'Save the prompt version that fixes the failure, then reuse that version as the next controlled starting point.',
    ],
  },
  {
    type: 'links',
    title: 'Next steps in Vogue AI',
    items: [
      {
        label: 'Open the Vogue AI workspace',
        href: '/',
        description:
          'Test one visible prompt across model families and diagnose the first failure.',
      },
      {
        label: 'Read prompt engineering tips',
        href: '/blog/prompt-engineering-tips',
        description:
          'Turn instruction hierarchy into repeatable product, portrait, poster, and UI prompts.',
      },
      {
        label: 'Create consistent AI images',
        href: '/blog/how-to-create-consistent-ai-images',
        description:
          'Apply reference anchors and revision rules when identity or product shape must stay fixed.',
      },
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
    text: 'Can I see the system prompt of an AI tool?',
  },
  {
    type: 'paragraph',
    text: 'Usually no. Most products do not expose hidden system prompts. You can still improve results by writing visible prompts that respect instruction hierarchy and model limits.',
  },
  {
    type: 'heading',
    level: 3,
    text: 'Is a system prompt the same as a user prompt?',
  },
  {
    type: 'paragraph',
    text: 'No. A system prompt is set by the tool or provider. A user prompt is the instruction you type. The system layer normally has higher priority.',
  },
  {
    type: 'heading',
    level: 3,
    text: 'Why does the same prompt look different in different models?',
  },
  {
    type: 'paragraph',
    text: 'Model families interpret style, references, and constraints differently. Treat model selection as part of the prompt design, especially for image work.',
  },
  {
    type: 'heading',
    level: 3,
    text: 'Should I ask the AI to reveal its hidden instructions?',
  },
  {
    type: 'paragraph',
    text: 'No. That usually does not help your creative task. Write a clearer visible brief instead: what stays fixed, what can change, and how to judge the result.',
  },
  {
    type: 'heading',
    level: 3,
    text: 'How do reference images interact with prompts?',
  },
  {
    type: 'paragraph',
    text: 'Reference images work best when you define their job. Say whether the reference controls identity, product shape, palette, composition, or mood.',
  },
  {
    type: 'heading',
    level: 3,
    text: 'When should I switch models instead of rewriting?',
  },
  {
    type: 'paragraph',
    text: 'Switch after diagnosing the failure. If the prompt is clear but the model keeps prioritizing mood over structure, choose a model family better suited to control.',
  },
  {
    type: 'heading',
    level: 3,
    text: 'Do system prompts make prompt engineering useless?',
  },
  {
    type: 'paragraph',
    text: 'No. They make prompt engineering more practical. Good prompts cooperate with the tool instead of fighting hidden defaults and model behavior.',
  },
];

type SupportedBlogLocale = 'zh' | 'fr' | 'ru' | 'pt' | 'ja' | 'ko';

type SystemCopy = {
  intro: string;
  tldrHeading: string;
  tldrItems: string[];
  systemHeading: string;
  systemText: string;
  layerHeaders: string[];
  layerRows: string[][];
  hierarchyHeading: string;
  hierarchyAlt: string;
  hierarchyCaption: string;
  hierarchyText: string;
  hierarchyItems: string[];
  matrixHeading: string;
  matrixHeaders: string[];
  matrixRows: string[][];
  promptsHeading: string;
  promptsText: string;
  workedHeading: string;
  rawJobHeading: string;
  rawJobText: string;
  promptVersionHeading: string;
  diagnosisHeading: string;
  diagnosisText: string;
  revisionTitle: string;
  revisionText: string;
  modelHeading: string;
  modelAlt: string;
  modelCaption: string;
  modelText: string;
  modelItems: string[];
  mistakeHeading: string;
  mistakeHeaders: string[];
  mistakeRows: string[][];
  vogueHeading: string;
  vogueText: string;
  vogueItems: string[];
  linksTitle: string;
  links: Array<{ label: string; href: string; description: string }>;
  faqHeading: string;
  faq: Array<[string, string]>;
};

const localizedCopy = {
  zh: {
    intro:
      '系统提示词和模型指令会影响 AI 工具如何理解你看得见的提示词。大多数产品不会公开隐藏的系统提示词，但你仍然可以通过理解指令层级、模型适配、参考图交接和工具边界，写出更稳定的图像提示词。',
    tldrHeading: '快速结论：让提示词配合工具工作',
    tldrItems: [
      '把系统提示词理解为工具的策略和行为层，你的用户提示词必须在这一层里工作。',
      '把不可妥协的视觉事实放在风格词之前：主体、身份、裁切、参考图角色和输出规则。',
      '按任务选模型：GPT Image 2 适合指令控制，Nano Banana 适合快速图像变体，Midjourney 适合以情绪为主的探索。',
      '不要追逐隐藏提示词。写清楚什么必须固定、什么可以改变、第一张结果如何判断。',
      '结果失败时，先判断冲突来自指令层级、模型限制、参考图含糊，还是不安全或不可能的表述。',
    ],
    systemHeading: 'AI 图像工具里的系统提示词做什么',
    systemText:
      '系统提示词是工具或模型提供方设置的指令层。它可能定义语气、安全边界、格式行为、工具调用、拒绝策略和指令优先级。在图像工具里，这意味着你输入的可见提示词不是唯一的指令。',
    layerHeaders: ['指令层', '谁控制', '对图像提示词的影响'],
    layerRows: [
      ['系统提示词', '工具或模型提供方', '安全规则、默认行为、输出边界和指令优先级。'],
      ['开发者或应用指令', '产品界面', '模型路由、图库默认值、参考图处理方式和工作区限制。'],
      ['用户提示词', '用户', '主体、场景、风格、裁切、参考图角色和审核标准。'],
      ['参考图', '用户和模型共同作用', '当角色明确时，控制身份、构图、色板、物体形状或情绪。'],
      ['模型行为', '模型系列', '决定指令遵循程度、风格解释方式和哪些细节最先漂移。'],
    ],
    hierarchyHeading: '视觉提示词的指令层级',
    hierarchyAlt: '用于解释身份和指令层级的个人资料风格图库图',
    hierarchyCaption:
      '个人资料风格的图适合解释层级：身份、背景线索和可改变范围都取决于清楚写明什么必须固定、什么可以由模型重新解释。',
    hierarchyText:
      '层级很重要，因为风格语言经常和身份、版式互相竞争。如果提示词同时说“保持产品精确形状”和“做成融化的超现实海报”，模型必须判断哪条指令优先。强提示词会把这个优先级写清楚。',
    hierarchyItems: [
      '第一层：不能改变的身份和主体事实。',
      '第二层：构图、裁切、画幅比例和渠道要求。',
      '第三层：参考图角色，例如身份、色板、布局、质感或情绪。',
      '第四层：风格、光线、镜头、材质和氛围。',
      '第五层：负面规则，例如无文字、无水印、不要多余的手、不要扭曲 Logo。',
    ],
    matrixHeading: '场景矩阵：提示词系统、模型和失败模式',
    matrixHeaders: ['任务', '最佳可见指令', '模型适配', '可能失败'],
    matrixRows: [
      ['产品图', '先写保持形状、材质、包装、裁切和背景，再写风格。', '参考控制重要时用 GPT Image 2 或 Nano Banana。', '画面漂亮，但产品轮廓错了。'],
      ['肖像变体', '明确参考图控制什么、什么可以改变。', '快速变体用 Nano Banana，更强指令遵循用 GPT Image 2。', '脸部漂移或身份被过度风格化。'],
      ['时装概念', '写清情绪、服装结构、姿势和镜头距离。', '概念探索且身份不关键时用 Midjourney。', '情绪很强，但现实细节弱。'],
      ['海报视觉', '预留标题空间，避免生成最终文字。', '版式控制用 GPT Image 2，情绪探索用 Midjourney。', '画面拥挤或出现不可读假字。'],
      ['UI Mockup', '保持界面层级和设备框架清楚。', '结构最重要时用 GPT Image 2。', '屏幕变成装饰噪声，而不是有用层级。'],
    ],
    promptsHeading: '适合系统感知图像工作的可复制提示词',
    promptsText:
      '下面这些是可见提示词，不会暴露隐藏系统提示词。它们的作用是让你的提示词和工具中已有的指令层协同工作。',
    workedHeading: '完整示例：诊断一个弱的第一结果',
    rawJobHeading: '原始任务',
    rawJobText:
      '你需要为一枚银色智能戒指制作发布海报。戒指形状和表面质感必须稳定，画面需要干净的标题留白，情绪应该高级而不是科幻。',
    promptVersionHeading: '提示词版本 1',
    diagnosisHeading: '诊断规则',
    diagnosisText:
      '如果戒指很好看但轮廓变了，这不是风格问题。添加参考图，并说明它控制轮廓、厚度、表面质感和 Logo 位置。如果轮廓正确但画面太忙，就保留身份指令，只修裁切、背景和留白。',
    revisionTitle: '修正规则',
    revisionText:
      '先修层级，再修风格。强化不可妥协的指令，然后只改变一个可选控制项，比如光线、背景或模型系列。',
    modelHeading: '模型系列如何改变提示词行为',
    modelAlt: '用于解释模型适配行为的 Midjourney 风格化图库图',
    modelCaption:
      '风格化示例适合放在模型适配段落，因为它显示了情绪和构图什么时候会成为主要价值，而不是严格保持物体。',
    modelText:
      '同一个可见提示词在不同模型系列里可能表现不同。这不只是提示词质量问题，也是模型适配问题。在 Vogue AI 里，把模型标签当成路由选择，而不是把每条提示词当成通用文本。',
    modelItems: [
      'GPT Image 2：适合受控产品图、版式敏感海报、UI mockup，以及重视指令遵循的编辑任务。',
      'Nano Banana：适合快速变体、社媒图实验、参考图肖像和轻量图生图探索。',
      'Midjourney：适合时装情绪、编辑氛围、风格化概念和探索性艺术指导。',
      '先知道哪里失败，再换模型。错误轮廓需要加强参考图交接；平淡情绪可能需要不同模型系列。',
    ],
    mistakeHeading: '错误与修正表',
    mistakeHeaders: ['失败', '可能原因', '先修什么'],
    mistakeRows: [
      ['模型忽略关键物体细节', '风格语言比身份更响亮。', '把物体细节移到第一句，并标记为不可妥协。'],
      ['参考图变化过大', '参考图角色太含糊。', '说明参考图控制身份、色板、布局、质感还是情绪。'],
      ['结果出现假字', '提示词要求模型设计最终排版。', '预留标题空间，在设计工具里添加文字。'],
      ['风格很强但偏题', '模型系列更偏情绪而不是严格控制。', '换控制型模型，或减少可选风格语言。'],
      ['工具拒绝或弱化请求', '请求和安全或产品策略冲突。', '围绕允许的视觉目标重写，移除禁止性表述。'],
    ],
    vogueHeading: '在 Vogue AI 中怎么用',
    vogueText:
      '在 Vogue AI 里，从最接近视觉任务的图库示例开始，而不是从最漂亮的图开始。围绕层级改写可见提示词，测试一个模型系列，检查第一处失败，再决定是收紧指令、添加参考图，还是切换模型标签。',
    vogueItems: [
      '打开最接近任务的提示词示例，而不是图库里最漂亮的图片。',
      '需要跨工具稳定复制时，公共提示词块保持英文。',
      '身份、产品形状、包装、UI 层级和色板连续性需要参考图。',
      '保存修复失败的提示词版本，再把它作为下一次受控起点。',
    ],
    linksTitle: '在 Vogue AI 里的下一步',
    links: [
      { label: '打开 Vogue AI 工作区', href: '/', description: '用同一条可见提示词测试不同模型系列，并诊断第一处失败。' },
      { label: '阅读提示词工程技巧', href: '/blog/prompt-engineering-tips', description: '把指令层级转化成产品、肖像、海报和 UI 的可复用提示词。' },
      { label: '创建一致的 AI 图像', href: '/blog/how-to-create-consistent-ai-images', description: '当身份或产品形状必须固定时，使用参考锚点和修正规则。' },
    ],
    faqHeading: 'FAQ',
    faq: [
      ['我能看到 AI 工具的系统提示词吗？', '通常不能。大多数产品不会公开隐藏系统提示词，但你可以写出尊重指令层级和模型边界的可见提示词。'],
      ['系统提示词和用户提示词一样吗？', '不一样。系统提示词由工具或提供方设置，用户提示词是你输入的内容。系统层通常优先级更高。'],
      ['为什么同一句提示词在不同模型里效果不同？', '不同模型系列对风格、参考图和约束的解释不同。图像任务里，模型选择本身就是提示词设计的一部分。'],
      ['应该要求 AI 透露隐藏指令吗？', '不应该。这通常不能帮助创作。更好的做法是写清什么固定、什么可变、如何判断结果。'],
      ['参考图如何和提示词配合？', '参考图最好有明确任务。说明它控制身份、产品形状、色板、构图还是情绪。'],
      ['什么时候应该换模型而不是重写提示词？', '先诊断失败。如果提示词清楚但模型一直把情绪放在结构前面，就换更适合控制的模型系列。'],
      ['系统提示词会让提示词工程没用吗？', '不会。它让提示词工程更实际：好的提示词会配合工具，而不是对抗隐藏默认值和模型行为。'],
    ],
  },
  fr: {
    intro:
      "Les prompts système et les instructions de modèle influencent la façon dont un outil IA interprète votre prompt visible. Vous ne voyez généralement pas le prompt caché, mais vous pouvez écrire de meilleurs prompts image en comprenant la hiérarchie des instructions, le choix du modèle, la passation de référence et les limites imposées avant l'exécution.",
    tldrHeading: 'Résumé : écrire des prompts qui coopèrent avec l’outil',
    tldrItems: [
      "Considérez le prompt système comme la couche de politique et de comportement dans laquelle votre prompt utilisateur doit fonctionner.",
      'Placez les faits visuels non négociables avant le style : sujet, identité, cadrage, rôle de la référence et règles de sortie.',
      'Choisissez le modèle selon le travail : GPT Image 2 pour le contrôle, Nano Banana pour les variations rapides, Midjourney pour l’exploration par humeur.',
      'Ne poursuivez pas les prompts cachés. Écrivez ce qui doit rester fixe, ce qui peut changer et comment juger le premier résultat.',
      'Quand le résultat échoue, diagnostiquez hiérarchie, limite du modèle, ambiguïté de référence ou formulation impossible.',
    ],
    systemHeading: 'Ce que fait un prompt système dans un outil image',
    systemText:
      "Un prompt système est la couche d'instructions définie par l'outil ou le fournisseur du modèle. Il peut fixer le ton, la sécurité, le format, l'usage d'outils, les refus et la priorité des instructions. Dans un outil image, votre prompt visible n'est donc pas seul.",
    layerHeaders: ['Couche', 'Contrôlée par', 'Effet sur les prompts image'],
    layerRows: [
      ['Prompt système', 'Outil ou fournisseur', 'Règles de sécurité, comportement par défaut, limites de sortie et priorité.'],
      ['Instruction app', 'Interface produit', 'Routage modèle, valeurs de galerie, gestion des références et contraintes de workspace.'],
      ['Prompt utilisateur', 'Vous', 'Sujet, scène, style, cadrage, rôle de référence et critères de revue.'],
      ['Image de référence', 'Vous et le modèle', 'Identité, composition, palette, forme ou humeur quand le rôle est explicite.'],
      ['Comportement modèle', 'Famille de modèle', 'Niveau de suivi des instructions, interprétation du style et détails qui dérivent en premier.'],
    ],
    hierarchyHeading: 'Hiérarchie des instructions pour prompts visuels',
    hierarchyAlt: "Image type profil pour expliquer identité et hiérarchie d'instructions",
    hierarchyCaption:
      "Un visuel type profil aide ici, car l'identité, les indices biographiques et les transformations autorisées dépendent de ce qui reste fixe et de ce que le modèle peut réinterpréter.",
    hierarchyText:
      'La hiérarchie compte parce que le style concurrence souvent identité et mise en page. Si un prompt demande une forme produit exacte puis un poster surréaliste fondu, le modèle doit décider quelle instruction gagne. Un bon prompt rend cette priorité explicite.',
    hierarchyItems: [
      'D’abord : identité et faits sujet qui ne doivent pas changer.',
      'Ensuite : composition, cadrage, ratio et exigences de canal.',
      'Puis : rôle de la référence, comme identité, palette, mise en page, texture ou humeur.',
      'Ensuite : style, lumière, optique, matériau et atmosphère.',
      'Enfin : règles négatives, comme pas de texte, pas de filigrane, pas de mains en trop et pas de logo déformé.',
    ],
    matrixHeading: 'Matrice : système, modèle et mode d’échec',
    matrixHeaders: ['Travail', 'Meilleure instruction visible', 'Modèle adapté', 'Échec probable'],
    matrixRows: [
      ['Image produit', 'Préserver forme, matière, packaging, cadrage et fond avant le style.', 'GPT Image 2 ou Nano Banana si la référence compte.', 'Belle image, mauvaise silhouette.'],
      ['Variation portrait', 'Dire exactement ce que la référence contrôle et ce qui peut changer.', 'Nano Banana pour vitesse ; GPT Image 2 pour contrôle.', 'Dérive du visage ou identité trop stylisée.'],
      ['Concept mode', 'Nommer humeur, structure du vêtement, pose et distance caméra.', 'Midjourney si l’exploration prime sur l’identité.', 'Mood fort mais faible précision réelle.'],
      ['Visuel poster', 'Réserver une zone titre et éviter le texte généré.', 'GPT Image 2 pour layout ; Midjourney pour mood.', 'Cadre chargé ou faux texte illisible.'],
      ['Maquette UI', 'Garder hiérarchie interface et cadre appareil clairs.', 'GPT Image 2 quand la structure prime.', 'Écran décoratif au lieu d’une hiérarchie utile.'],
    ],
    promptsHeading: 'Prompts copiables pour un travail image conscient du système',
    promptsText:
      'Ces blocs sont des prompts visibles. Ils ne révèlent pas les prompts cachés ; ils aident votre prompt à coopérer avec les couches déjà présentes dans l’outil.',
    workedHeading: 'Exemple : diagnostiquer un premier résultat faible',
    rawJobHeading: 'Brief brut',
    rawJobText:
      'Vous avez besoin d’un poster de lancement pour une bague connectée argentée. La forme et la finition doivent rester stables, le cadre doit garder une zone titre propre et l’ambiance doit être premium plutôt que science-fiction.',
    promptVersionHeading: 'Version de prompt 1',
    diagnosisHeading: 'Règle de diagnostic',
    diagnosisText:
      'Si la bague est belle mais change de silhouette, ce n’est pas un problème de style. Ajoutez une référence et dites qu’elle contrôle silhouette, épaisseur, finition et logo. Si la silhouette est bonne mais le cadre trop chargé, gardez les instructions d’identité et révisez cadrage, fond et espace négatif.',
    revisionTitle: 'Règle de révision',
    revisionText:
      'Corrigez la hiérarchie avant le style. Renforcez l’instruction non négociable, puis changez un seul contrôle optionnel comme lumière, fond ou famille de modèle.',
    modelHeading: 'Comment les familles de modèles changent le comportement',
    modelAlt: 'Image Midjourney stylisée pour expliquer le choix de modèle',
    modelCaption:
      'Un exemple stylisé convient ici, car il montre quand humeur et composition deviennent la valeur principale au lieu de la préservation stricte de l’objet.',
    modelText:
      'Le même prompt visible peut se comporter différemment selon la famille de modèles. Ce n’est pas seulement une question de qualité de prompt ; c’est aussi un choix de modèle. Dans Vogue AI, utilisez les tags comme routage.',
    modelItems: [
      'GPT Image 2 : visuels produit contrôlés, posters sensibles au layout, maquettes UI et éditions où le suivi compte.',
      'Nano Banana : variations rapides, images sociales, portraits avec référence et exploration image-to-image légère.',
      'Midjourney : humeur mode, atmosphère éditoriale, concepts stylisés et direction artistique exploratoire.',
      'Changez de modèle seulement après le diagnostic. Une mauvaise silhouette demande une meilleure référence ; une humeur plate peut demander une autre famille.',
    ],
    mistakeHeading: 'Table erreurs et corrections',
    mistakeHeaders: ['Échec', 'Cause probable', 'Corriger d’abord'],
    mistakeRows: [
      ['Le modèle ignore un détail objet', 'Le style parle plus fort que l’identité.', 'Mettre ce détail dans la première phrase et le marquer non négociable.'],
      ['La référence change trop', 'Le rôle de la référence est vague.', 'Dire si elle contrôle identité, palette, layout, texture ou humeur.'],
      ['Le résultat contient du faux texte', 'Le prompt demande une typographie finale.', 'Réserver l’espace titre et ajouter le texte dans un outil de design.'],
      ['Le style est fort mais hors brief', 'Le modèle favorise le mood au contrôle strict.', 'Essayer un modèle plus contrôlé ou réduire le style optionnel.'],
      ['L’outil refuse ou adoucit la demande', 'La demande touche une règle de sécurité ou produit.', 'Reformuler autour d’un objectif visuel autorisé.'],
    ],
    vogueHeading: 'L’utiliser dans Vogue AI',
    vogueText:
      'Dans Vogue AI, partez de l’exemple de galerie le plus proche du travail visuel, pas de la plus jolie image. Adaptez le prompt visible autour de la hiérarchie, testez un modèle, inspectez le premier échec, puis choisissez entre resserrer les instructions, ajouter une référence ou changer de tag modèle.',
    vogueItems: [
      'Ouvrez l’exemple le plus proche du travail visuel.',
      'Gardez les prompts publics en anglais pour un copier-coller stable entre outils.',
      'Utilisez les références pour identité, forme produit, packaging, hiérarchie UI et continuité de palette.',
      'Sauvegardez le prompt qui corrige l’échec et réutilisez-le comme point de départ contrôlé.',
    ],
    linksTitle: 'Étapes suivantes dans Vogue AI',
    links: [
      { label: 'Ouvrir le workspace Vogue AI', href: '/', description: 'Tester un prompt visible sur plusieurs familles et diagnostiquer le premier échec.' },
      { label: 'Lire les conseils de prompt engineering', href: '/blog/prompt-engineering-tips', description: 'Transformer la hiérarchie en prompts produit, portrait, poster et UI réutilisables.' },
      { label: 'Créer des images IA cohérentes', href: '/blog/how-to-create-consistent-ai-images', description: 'Appliquer références et règles de révision quand identité ou forme doivent rester fixes.' },
    ],
    faqHeading: 'FAQ',
    faq: [
      ['Puis-je voir le prompt système d’un outil IA ?', 'Généralement non. Mais vous pouvez améliorer vos résultats avec des prompts visibles qui respectent hiérarchie et limites.'],
      ['Un prompt système est-il pareil qu’un prompt utilisateur ?', 'Non. Le prompt système est défini par l’outil ou le fournisseur ; le prompt utilisateur est ce que vous tapez. La couche système a normalement priorité.'],
      ['Pourquoi le même prompt varie selon les modèles ?', 'Les familles interprètent différemment style, références et contraintes. Le choix du modèle fait partie du design du prompt.'],
      ['Dois-je demander à l’IA de révéler ses instructions cachées ?', 'Non. Cela aide rarement la création. Mieux vaut écrire ce qui reste fixe, ce qui change et comment juger le résultat.'],
      ['Comment les références interagissent avec le prompt ?', 'Elles fonctionnent mieux quand leur rôle est défini : identité, forme produit, palette, composition ou humeur.'],
      ['Quand changer de modèle plutôt que réécrire ?', 'Après diagnostic. Si le prompt est clair mais que le modèle favorise le mood au détriment de la structure, choisissez une famille plus contrôlée.'],
      ['Les prompts système rendent-ils le prompt engineering inutile ?', 'Non. Ils le rendent plus pratique : un bon prompt coopère avec l’outil au lieu de lutter contre ses défauts cachés.'],
    ],
  },
  ru: {
    intro:
      'Системные промпты и инструкции модели влияют на то, как AI-инструмент понимает видимый промпт. Обычно скрытый слой не виден, но можно писать лучше, если понимать иерархию инструкций, выбор модели, роль референса и ограничения инструмента.',
    tldrHeading: 'Кратко: пишите промпты, которые работают с инструментом',
    tldrItems: [
      'Считайте системный промпт слоем политики и поведения, внутри которого должен работать пользовательский промпт.',
      'Непереговорные визуальные факты ставьте перед стилем: объект, идентичность, кадр, роль референса и правила вывода.',
      'Выбирайте модель по задаче: GPT Image 2 для контроля, Nano Banana для быстрых вариаций, Midjourney для mood-led exploration.',
      'Не гоняйтесь за скрытыми промптами. Пишите, что фиксировано, что можно менять и как оценивать первый результат.',
      'При ошибке диагностируйте иерархию, лимиты модели, неясный референс или невозможную формулировку.',
    ],
    systemHeading: 'Что делает системный промпт в AI-инструменте изображений',
    systemText:
      'Системный промпт — это слой инструкций от инструмента или провайдера модели. Он может задавать тон, безопасность, формат, использование инструментов, отказы и приоритеты. В инструменте изображений ваш видимый промпт не является единственной инструкцией.',
    layerHeaders: ['Слой', 'Кто контролирует', 'Как влияет на изображения'],
    layerRows: [
      ['Системный промпт', 'Инструмент или провайдер', 'Безопасность, поведение по умолчанию, границы вывода и приоритет.'],
      ['Инструкция приложения', 'Интерфейс продукта', 'Маршрутизация модели, настройки галереи, обработка референсов и ограничения workspace.'],
      ['Пользовательский промпт', 'Вы', 'Объект, сцена, стиль, кадр, роль референса и критерии проверки.'],
      ['Референс', 'Вы и модель', 'Идентичность, композиция, палитра, форма объекта или настроение при явной роли.'],
      ['Поведение модели', 'Семейство модели', 'Степень следования инструкциям, трактовка стиля и первые дрейфующие детали.'],
    ],
    hierarchyHeading: 'Иерархия инструкций для визуальных промптов',
    hierarchyAlt: 'Профильное изображение для объяснения идентичности и иерархии',
    hierarchyCaption:
      'Профильный визуал полезен, потому что идентичность, биографические признаки и допустимые изменения зависят от явной иерархии.',
    hierarchyText:
      'Иерархия важна: стиль часто конкурирует с идентичностью и layout. Если промпт требует точную форму продукта, а затем сюрреалистичный плавящийся постер, модель должна выбрать приоритет. Сильный промпт делает выбор явным.',
    hierarchyItems: [
      'Первое: идентичность и факты объекта, которые нельзя менять.',
      'Второе: композиция, кадр, соотношение сторон и требования канала.',
      'Третье: роль референса — идентичность, палитра, layout, текстура или настроение.',
      'Четвертое: стиль, свет, объектив, материал и атмосфера.',
      'Пятое: негативные правила — без текста, водяных знаков, лишних рук и искаженных логотипов.',
    ],
    matrixHeading: 'Матрица: система промпта, модель и ошибка',
    matrixHeaders: ['Задача', 'Лучшая видимая инструкция', 'Подходящая модель', 'Вероятная ошибка'],
    matrixRows: [
      ['Продукт', 'Сначала сохранить форму, материал, упаковку, кадр и фон, потом стиль.', 'GPT Image 2 или Nano Banana при важном референсе.', 'Красивая картинка, неправильный силуэт.'],
      ['Портрет', 'Явно сказать, что контролирует референс и что можно менять.', 'Nano Banana для скорости; GPT Image 2 для контроля.', 'Дрейф лица или чрезмерная стилизация.'],
      ['Fashion concept', 'Назвать настроение, структуру одежды, позу и дистанцию камеры.', 'Midjourney для исследования без критичной идентичности.', 'Сильное настроение, слабая конкретика.'],
      ['Постер', 'Оставить место под заголовок и избегать сгенерированного текста.', 'GPT Image 2 для layout; Midjourney для настроения.', 'Загруженный кадр или нечитаемый псевдотекст.'],
      ['UI mockup', 'Сохранить иерархию интерфейса и рамку устройства.', 'GPT Image 2, если структура важнее всего.', 'Декоративный шум вместо полезной иерархии.'],
    ],
    promptsHeading: 'Копируемые промпты для system-aware image work',
    promptsText:
      'Это видимые промпты. Они не раскрывают скрытые системные инструкции, а помогают работать с уже существующими слоями инструмента.',
    workedHeading: 'Пример: диагностика слабого первого результата',
    rawJobHeading: 'Исходная задача',
    rawJobText:
      'Нужен launch poster для серебряного smart ring. Форма и отделка должны быть стабильными, кадр требует чистого места под заголовок, настроение — премиальное, не sci-fi.',
    promptVersionHeading: 'Версия промпта 1',
    diagnosisHeading: 'Правило диагностики',
    diagnosisText:
      'Если кольцо красивое, но силуэт меняется, это не проблема стиля. Добавьте референс и скажите, что он контролирует силуэт, толщину, отделку и логотип. Если силуэт верный, но кадр перегружен, сохраните идентичность и правьте кадр, фон и свободное место.',
    revisionTitle: 'Правило правки',
    revisionText:
      'Сначала правьте иерархию, потом стиль. Усильте непереговорную инструкцию и меняйте один опциональный контроль: свет, фон или семейство модели.',
    modelHeading: 'Как семейства моделей меняют поведение',
    modelAlt: 'Стилизованное изображение Midjourney для объяснения model fit',
    modelCaption:
      'Стилизованный пример уместен рядом с model fit: он показывает, когда настроение и композиция важнее строгого сохранения объекта.',
    modelText:
      'Один и тот же видимый промпт может вести себя по-разному в разных семействах. Это не только качество промпта, но и выбор модели. В Vogue AI используйте теги модели как маршрутизацию.',
    modelItems: [
      'GPT Image 2: контролируемые продуктовые визуалы, чувствительные к layout постеры, UI mockups и edits с важным следованием.',
      'Nano Banana: быстрые вариации, социальные изображения, портреты с референсом и легкое image-to-image.',
      'Midjourney: fashion mood, editorial atmosphere, stylized concepts и exploratory art direction.',
      'Меняйте модель только после диагностики. Неверный силуэт требует референса; плоское настроение может требовать другой семьи.',
    ],
    mistakeHeading: 'Ошибки и исправления',
    mistakeHeaders: ['Ошибка', 'Вероятная причина', 'Что исправить сначала'],
    mistakeRows: [
      ['Модель игнорирует деталь объекта', 'Стиль громче идентичности.', 'Перенести деталь в первую фразу и назвать ее непереговорной.'],
      ['Референс меняется слишком сильно', 'Роль референса неясна.', 'Сказать, контролирует ли он идентичность, палитру, layout, текстуру или mood.'],
      ['Появляется fake text', 'Промпт просит финальную типографику.', 'Оставить место под заголовок и добавить текст в дизайн-инструменте.'],
      ['Стиль сильный, но не по brief', 'Модель предпочитает mood строгому контролю.', 'Попробовать более контролируемую модель или уменьшить стиль.'],
      ['Инструмент отказывает или смягчает запрос', 'Запрос конфликтует с безопасностью или политикой продукта.', 'Переформулировать вокруг разрешенной визуальной цели.'],
    ],
    vogueHeading: 'Как использовать в Vogue AI',
    vogueText:
      'В Vogue AI начинайте с примера галереи, близкого к задаче, а не с самой красивой картинки. Адаптируйте видимый промпт вокруг иерархии, тестируйте одно семейство модели, проверяйте первую ошибку и выбирайте: усилить инструкции, добавить референс или сменить тег.',
    vogueItems: [
      'Откройте пример, ближайший к визуальной задаче.',
      'Публичные prompt blocks держите на английском для предсказуемого копирования.',
      'Используйте референсы для идентичности, формы продукта, упаковки, UI-иерархии и палитры.',
      'Сохраните версию промпта, которая исправила ошибку, и используйте ее как контролируемую отправную точку.',
    ],
    linksTitle: 'Следующие шаги в Vogue AI',
    links: [
      { label: 'Открыть workspace Vogue AI', href: '/', description: 'Проверить один видимый prompt на разных семействах и диагностировать первую ошибку.' },
      { label: 'Прочитать prompt engineering tips', href: '/blog/prompt-engineering-tips', description: 'Превратить иерархию в повторяемые промпты для продукта, портрета, постера и UI.' },
      { label: 'Создать стабильные AI-изображения', href: '/blog/how-to-create-consistent-ai-images', description: 'Использовать референсы и правила правки, когда идентичность или форма должны оставаться фиксированными.' },
    ],
    faqHeading: 'FAQ',
    faq: [
      ['Можно ли увидеть системный промпт AI-инструмента?', 'Обычно нет. Но можно улучшить результаты, уважая иерархию инструкций и лимиты модели.'],
      ['Системный промпт — это то же самое, что пользовательский?', 'Нет. Системный задает инструмент или провайдер; пользовательский вводите вы. Системный слой обычно приоритетнее.'],
      ['Почему один промпт выглядит по-разному в моделях?', 'Семейства по-разному трактуют стиль, референсы и ограничения. Выбор модели — часть prompt design.'],
      ['Нужно ли просить AI раскрыть скрытые инструкции?', 'Нет. Это редко помогает творческой задаче. Лучше написать, что фиксировано, что меняется и как оценивать результат.'],
      ['Как референсы взаимодействуют с промптами?', 'Лучше всего, когда роль референса явна: идентичность, форма продукта, палитра, композиция или настроение.'],
      ['Когда менять модель вместо переписывания?', 'После диагностики. Если промпт ясен, но модель ставит настроение выше структуры, выберите более контролируемую семью.'],
      ['Системные промпты делают prompt engineering бесполезным?', 'Нет. Они делают его практичнее: хороший промпт сотрудничает с инструментом, а не борется с скрытыми настройками.'],
    ],
  },
  pt: {
    intro:
      'Prompts de sistema e instruções de modelo moldam como uma ferramenta de IA interpreta seu prompt visível. Normalmente você não vê o prompt oculto, mas pode escrever melhores prompts de imagem entendendo hierarquia de instruções, encaixe do modelo, uso de referência e limites aplicados antes da execução.',
    tldrHeading: 'Resumo: escreva prompts que cooperam com a ferramenta',
    tldrItems: [
      'Trate o prompt de sistema como a camada de política e comportamento na qual seu prompt de usuário precisa operar.',
      'Coloque fatos visuais não negociáveis antes do estilo: sujeito, identidade, corte, papel da referência e regras de saída.',
      'Escolha o modelo por tarefa: GPT Image 2 para controle, Nano Banana para variações rápidas e Midjourney para exploração por mood.',
      'Não persiga prompts ocultos. Escreva o que fica fixo, o que muda e como o primeiro resultado será julgado.',
      'Quando falhar, diagnostique se o conflito veio de hierarquia, limite do modelo, referência ambígua ou pedido impossível.',
    ],
    systemHeading: 'O que um prompt de sistema faz em uma ferramenta de imagem',
    systemText:
      'Um prompt de sistema é a camada definida pela ferramenta ou pelo provedor do modelo. Ele pode definir tom, segurança, formato, uso de ferramentas, recusas e prioridade de instruções. Em uma ferramenta de imagem, seu prompt visível não é a única instrução.',
    layerHeaders: ['Camada', 'Quem controla', 'O que muda nos prompts'],
    layerRows: [
      ['Prompt de sistema', 'Ferramenta ou provedor', 'Regras de segurança, comportamento padrão, limites de saída e prioridade.'],
      ['Instrução do app', 'Interface do produto', 'Roteamento de modelo, padrões da biblioteca, referência e limites do workspace.'],
      ['Prompt do usuário', 'Você', 'Sujeito, cena, estilo, corte, papel da referência e critério de revisão.'],
      ['Imagem de referência', 'Você e o modelo', 'Identidade, composição, paleta, forma do objeto ou mood quando o papel é claro.'],
      ['Comportamento do modelo', 'Família do modelo', 'Rigor das instruções, interpretação de estilo e detalhes que derivam primeiro.'],
    ],
    hierarchyHeading: 'Hierarquia de instruções para prompts visuais',
    hierarchyAlt: 'Imagem em estilo de perfil para explicar identidade e hierarquia',
    hierarchyCaption:
      'Um visual de perfil ajuda porque identidade, pistas biográficas e transformações permitidas dependem de uma hierarquia clara: o que fica fixo e o que pode ser reinterpretado.',
    hierarchyText:
      'Hierarquia importa porque linguagem de estilo compete com identidade e layout. Se o prompt pede forma exata do produto e depois um pôster surreal derretido, o modelo precisa decidir o que vence. Bons prompts deixam essa prioridade explícita.',
    hierarchyItems: [
      'Primeiro: identidade e fatos do sujeito que não mudam.',
      'Segundo: composição, corte, proporção e requisitos do canal.',
      'Terceiro: papel da referência, como identidade, paleta, layout, textura ou mood.',
      'Quarto: estilo, luz, lente, material e atmosfera.',
      'Quinto: regras negativas, como sem texto, sem marca d’água, sem mãos extras e sem distorcer logo.',
    ],
    matrixHeading: 'Matriz: sistema, modelo e modo de falha',
    matrixHeaders: ['Tarefa', 'Melhor instrução visível', 'Modelo indicado', 'Falha provável'],
    matrixRows: [
      ['Imagem de produto', 'Preservar forma, material, embalagem, corte e fundo antes do estilo.', 'GPT Image 2 ou Nano Banana quando referência importa.', 'Imagem bonita, silhueta errada.'],
      ['Variação de retrato', 'Dizer exatamente o que a referência controla e o que pode mudar.', 'Nano Banana para velocidade; GPT Image 2 para controle.', 'Rosto deriva ou identidade fica estilizada demais.'],
      ['Conceito de moda', 'Nomear mood, estrutura da roupa, pose e distância da câmera.', 'Midjourney quando identidade não é crítica.', 'Mood forte, pouca especificidade real.'],
      ['Visual de pôster', 'Reservar espaço de título e evitar texto gerado.', 'GPT Image 2 para layout; Midjourney para mood.', 'Frame poluído ou tipografia falsa ilegível.'],
      ['Mockup de UI', 'Manter hierarquia da interface e moldura do dispositivo claras.', 'GPT Image 2 quando estrutura é prioridade.', 'Tela decorativa sem hierarquia útil.'],
    ],
    promptsHeading: 'Prompts copiáveis para trabalho de imagem consciente do sistema',
    promptsText:
      'Estes blocos são prompts visíveis. Eles não expõem prompts ocultos; ajudam seu prompt a cooperar com as camadas que já existem na ferramenta.',
    workedHeading: 'Exemplo: diagnosticar um primeiro resultado fraco',
    rawJobHeading: 'Tarefa bruta',
    rawJobText:
      'Você precisa de um pôster de lançamento para um anel inteligente prateado. A forma e o acabamento devem ficar estáveis, o quadro precisa de espaço limpo para título e o mood deve ser premium, não sci-fi.',
    promptVersionHeading: 'Prompt versão 1',
    diagnosisHeading: 'Regra de diagnóstico',
    diagnosisText:
      'Se o anel ficou bonito mas a silhueta mudou, não é problema de estilo. Adicione referência e diga que ela controla silhueta, espessura, acabamento e posição do logo. Se a silhueta está correta mas o quadro está cheio, mantenha identidade e revise corte, fundo e espaço negativo.',
    revisionTitle: 'Regra de revisão',
    revisionText:
      'Corrija hierarquia antes de estilo. Fortaleça a instrução não negociável e mude só um controle opcional, como luz, fundo ou família de modelo.',
    modelHeading: 'Como famílias de modelo mudam o comportamento',
    modelAlt: 'Imagem estilizada Midjourney para explicar encaixe de modelo',
    modelCaption:
      'Um exemplo estilizado pertence aqui porque mostra quando mood e composição viram o principal valor, em vez da preservação rígida do objeto.',
    modelText:
      'O mesmo prompt visível pode se comportar de forma diferente entre modelos. Isso não é só qualidade do prompt; é encaixe de modelo. No Vogue AI, use tags de modelo como escolha de roteamento.',
    modelItems: [
      'GPT Image 2: visuais de produto controlados, pôsteres sensíveis a layout, mockups de UI e edições com instrução forte.',
      'Nano Banana: variações rápidas, experimentos sociais, retratos com referência e exploração leve image-to-image.',
      'Midjourney: mood de moda, atmosfera editorial, conceitos estilizados e direção de arte exploratória.',
      'Troque de modelo só depois de diagnosticar. Silhueta errada precisa de referência; mood plano pode precisar de outra família.',
    ],
    mistakeHeading: 'Tabela de erros e correções',
    mistakeHeaders: ['Falha', 'Causa provável', 'Corrigir primeiro'],
    mistakeRows: [
      ['O modelo ignora detalhe do objeto', 'O estilo ficou mais forte que a identidade.', 'Mover o detalhe para a primeira frase e marcar como não negociável.'],
      ['A referência muda demais', 'O papel da referência está vago.', 'Dizer se ela controla identidade, paleta, layout, textura ou mood.'],
      ['O resultado tem texto falso', 'O prompt pediu tipografia final.', 'Reservar espaço de título e adicionar texto em ferramenta de design.'],
      ['Estilo forte mas fora do brief', 'O modelo favorece mood em vez de controle.', 'Usar modelo mais controlado ou reduzir linguagem opcional de estilo.'],
      ['A ferramenta recusa ou suaviza', 'O pedido conflita com política de segurança ou produto.', 'Reformular em torno de um objetivo visual permitido.'],
    ],
    vogueHeading: 'Use isso dentro do Vogue AI',
    vogueText:
      'No Vogue AI, comece pelo exemplo da biblioteca mais próximo da tarefa visual, não pela imagem mais bonita. Adapte o prompt visível pela hierarquia, teste uma família, inspecione a primeira falha e então decida entre apertar instruções, adicionar referência ou trocar tags.',
    vogueItems: [
      'Abra o exemplo de prompt mais próximo do trabalho visual.',
      'Mantenha blocos públicos em inglês quando quiser copy-paste previsível entre ferramentas.',
      'Use referências para identidade, forma do produto, embalagem, hierarquia de UI e continuidade de paleta.',
      'Salve a versão que corrige a falha e reutilize como próximo ponto de partida controlado.',
    ],
    linksTitle: 'Próximos passos no Vogue AI',
    links: [
      { label: 'Abrir o workspace Vogue AI', href: '/', description: 'Teste um prompt visível entre famílias de modelo e diagnostique a primeira falha.' },
      { label: 'Ler dicas de prompt engineering', href: '/blog/prompt-engineering-tips', description: 'Transforme hierarquia em prompts reutilizáveis de produto, retrato, pôster e UI.' },
      { label: 'Criar imagens IA consistentes', href: '/blog/how-to-create-consistent-ai-images', description: 'Aplique âncoras de referência e regras de revisão quando identidade ou forma precisam ficar fixas.' },
    ],
    faqHeading: 'FAQ',
    faq: [
      ['Posso ver o prompt de sistema de uma ferramenta IA?', 'Normalmente não. Mas você melhora resultados escrevendo prompts visíveis que respeitam hierarquia e limites.'],
      ['Prompt de sistema é igual ao prompt do usuário?', 'Não. O sistema é definido pela ferramenta ou provedor; o usuário é o que você digita. A camada de sistema costuma ter prioridade.'],
      ['Por que o mesmo prompt muda entre modelos?', 'Famílias interpretam estilo, referências e restrições de formas diferentes. Escolha de modelo faz parte do design do prompt.'],
      ['Devo pedir à IA para revelar instruções ocultas?', 'Não. Isso raramente ajuda a criação. Escreva melhor o que fica fixo, o que muda e como julgar o resultado.'],
      ['Como imagens de referência interagem com prompts?', 'Elas funcionam melhor quando o papel é claro: identidade, forma do produto, paleta, composição ou mood.'],
      ['Quando trocar de modelo em vez de reescrever?', 'Depois de diagnosticar. Se o prompt é claro mas o modelo prioriza mood sobre estrutura, escolha uma família mais controlada.'],
      ['Prompts de sistema tornam prompt engineering inútil?', 'Não. Eles tornam a prática mais objetiva: bons prompts cooperam com a ferramenta em vez de lutar contra padrões ocultos.'],
    ],
  },
  ja: {
    intro:
      'システムプロンプトとモデル指示は、AI ツールが見えているプロンプトをどう解釈するかに影響します。隠れたシステムプロンプトは通常見えませんが、指示の階層、モデル適性、参照画像の渡し方、実行前に適用される制限を理解すれば、より安定した画像プロンプトを書けます。',
    tldrHeading: '要点：ツールと協調するプロンプトを書く',
    tldrItems: [
      'システムプロンプトを、ユーザープロンプトが中で動くポリシーと振る舞いの層として考えます。',
      '譲れない視覚事実をスタイル語の前に置きます。主体、身元、裁切、参照の役割、出力ルールです。',
      'タスクでモデルを選びます。指示制御は GPT Image 2、速い変形は Nano Banana、ムード探索は Midjourney です。',
      '隠れたプロンプトを追わず、何を固定し、何を変え、最初の結果をどう判断するかを書きます。',
      '失敗したら、階層、モデル制限、参照の曖昧さ、不可能な表現のどれが原因かを診断します。',
    ],
    systemHeading: 'AI 画像ツールのシステムプロンプトの役割',
    systemText:
      'システムプロンプトは、ツールやモデル提供者が設定する指示層です。口調、安全境界、形式、ツール使用、拒否、指示の優先順位を定義できます。画像ツールでは、入力したプロンプトだけが指示ではありません。',
    layerHeaders: ['指示層', '管理者', '画像プロンプトへの影響'],
    layerRows: [
      ['システムプロンプト', 'ツールまたはモデル提供者', '安全ルール、既定動作、出力境界、優先順位。'],
      ['アプリ指示', '製品インターフェース', 'モデルルーティング、ギャラリー既定値、参照画像処理、ワークスペース制約。'],
      ['ユーザープロンプト', 'あなた', '主体、場面、スタイル、裁切、参照の役割、確認基準。'],
      ['参照画像', 'あなたとモデル', '役割が明確なら、身元、構図、色、物体形状、ムードを制御。'],
      ['モデル挙動', 'モデルファミリー', '指示遵守、スタイル解釈、最初にズレる詳細。'],
    ],
    hierarchyHeading: '視覚プロンプトの指示階層',
    hierarchyAlt: '身元と指示階層を説明するプロフィール風画像',
    hierarchyCaption:
      'プロフィール風のビジュアルは、身元、人物情報、許される変換が、何を固定し何を再解釈してよいかに依存することを説明しやすいです。',
    hierarchyText:
      '階層は重要です。スタイル語は身元やレイアウトと競合します。正確な商品形状を求めながら、溶けるシュールなポスターも求めると、モデルはどちらを優先するか選ぶ必要があります。強いプロンプトはその優先順位を明示します。',
    hierarchyItems: [
      '第一：変えてはいけない身元と主体の事実。',
      '第二：構図、裁切、比率、チャンネル要件。',
      '第三：参照画像の役割。身元、色、レイアウト、質感、ムードなど。',
      '第四：スタイル、光、レンズ、素材、雰囲気。',
      '第五：文字なし、透かしなし、余分な手なし、ロゴ変形なしなどの否定ルール。',
    ],
    matrixHeading: 'シナリオ表：システム、モデル、失敗モード',
    matrixHeaders: ['仕事', '最適な見える指示', 'モデル適性', '起きやすい失敗'],
    matrixRows: [
      ['商品画像', 'スタイルより前に形、素材、包装、裁切、背景を保つ。', '参照制御が重要なら GPT Image 2 または Nano Banana。', 'きれいだが商品の形が違う。'],
      ['ポートレート変形', '参照が何を制御し、何を変えてよいかを書く。', '速さは Nano Banana、制御は GPT Image 2。', '顔がズレる、または身元が過度にスタイル化される。'],
      ['ファッション概念', 'ムード、服の構造、ポーズ、カメラ距離を書く。', '身元が重要でない探索なら Midjourney。', 'ムードは強いが具体性が弱い。'],
      ['ポスター', '見出し領域を空け、生成文字を避ける。', 'レイアウトは GPT Image 2、ムードは Midjourney。', '画面が混む、偽文字が出る。'],
      ['UI モックアップ', 'インターフェース階層とデバイス枠を明確に保つ。', '構造が最重要なら GPT Image 2。', '有用な階層ではなく装飾的な画面になる。'],
    ],
    promptsHeading: 'システムを意識した画像作業用プロンプト',
    promptsText:
      '以下は見えるプロンプトです。隠れたシステムプロンプトを公開するものではなく、ツール内の既存の指示層と協調するための書き方です。',
    workedHeading: '実例：弱い初回結果を診断する',
    rawJobHeading: '元の依頼',
    rawJobText:
      '銀色のスマートリングのローンチポスターが必要です。リングの形と仕上げは安定させ、見出し用のきれいな余白を残し、ムードは SF ではなくプレミアムにします。',
    promptVersionHeading: 'プロンプト版 1',
    diagnosisHeading: '診断ルール',
    diagnosisText:
      'リングは美しいのにシルエットが変わるなら、スタイルの問題ではありません。参照画像を加え、シルエット、厚み、仕上げ、ロゴ位置を制御すると書きます。シルエットは正しいが画面が混むなら、身元指示を保ったまま裁切、背景、余白を直します。',
    revisionTitle: '修正ルール',
    revisionText:
      'スタイルより前に階層を直します。譲れない指示を強め、光、背景、モデルファミリーなど一つの任意項目だけを変更します。',
    modelHeading: 'モデルファミリーが挙動を変える理由',
    modelAlt: 'モデル適性を説明する Midjourney 風スタイル画像',
    modelCaption:
      'スタイル化された例は、厳密な物体保持よりもムードや構図が主価値になる場面を示すため、この段落に適しています。',
    modelText:
      '同じ見えるプロンプトでも、モデルファミリーによって結果は変わります。これはプロンプト品質だけでなく、モデル適性の問題です。Vogue AI ではモデルタグをルーティング選択として使います。',
    modelItems: [
      'GPT Image 2：制御された商品ビジュアル、レイアウト重視のポスター、UI モックアップ、指示遵守が重要な編集。',
      'Nano Banana：速いバリエーション、SNS 画像実験、参照付きポートレート、軽い image-to-image 探索。',
      'Midjourney：ファッションムード、編集的雰囲気、スタイル化された概念、探索的アートディレクション。',
      '失敗を把握してからモデルを変えます。シルエット違いは参照が必要で、ムードの弱さは別モデルが必要かもしれません。',
    ],
    mistakeHeading: '失敗と修正表',
    mistakeHeaders: ['失敗', '考えられる原因', '先に直すこと'],
    mistakeRows: [
      ['物体の重要な細部を無視する', 'スタイルが身元より強い。', '細部を最初の文に置き、譲れないと書く。'],
      ['参照画像が変わりすぎる', '参照の役割が曖昧。', '身元、色、レイアウト、質感、ムードのどれを制御するかを書く。'],
      ['偽文字が出る', '最終タイポグラフィをモデルに頼んでいる。', '見出し領域を空け、文字はデザインツールで追加する。'],
      ['スタイルは強いが依頼から外れる', 'モデルが厳密な制御よりムードを優先する。', '制御型モデルを使うか、任意のスタイル語を減らす。'],
      ['ツールが拒否または弱める', '安全または製品ポリシーと衝突している。', '許可された視覚目標に言い換える。'],
    ],
    vogueHeading: 'Vogue AI での使い方',
    vogueText:
      'Vogue AI では、最もきれいな画像ではなく、作業に最も近いプロンプト例から始めます。階層に沿って見えるプロンプトを直し、一つのモデルを試し、最初の失敗を確認してから、指示を締めるか、参照画像を追加するか、モデルタグを変えるかを決めます。',
    vogueItems: [
      '視覚タスクに最も近いプロンプト例を開きます。',
      'ツール間で安定してコピーしたい公開プロンプトは英語のままにします。',
      '身元、商品形状、包装、UI 階層、色の連続性には参照画像を使います。',
      '失敗を直したプロンプト版を保存し、次の制御された出発点にします。',
    ],
    linksTitle: 'Vogue AI で次に試すこと',
    links: [
      { label: 'Vogue AI ワークスペースを開く', href: '/', description: '一つの見えるプロンプトを複数モデルで試し、最初の失敗を診断します。' },
      { label: 'プロンプト設計のコツを読む', href: '/blog/prompt-engineering-tips', description: '指示階層を商品、人物、ポスター、UI の再利用可能なプロンプトへ変換します。' },
      { label: '一貫した AI 画像を作る', href: '/blog/how-to-create-consistent-ai-images', description: '身元や商品形状を固定したいときに、参照アンカーと修正ルールを使います。' },
    ],
    faqHeading: 'FAQ',
    faq: [
      ['AI ツールのシステムプロンプトは見られますか？', '通常は見られません。ただし、指示階層とモデル制限を尊重する見えるプロンプトで結果を改善できます。'],
      ['システムプロンプトはユーザープロンプトと同じですか？', '違います。システムプロンプトはツールや提供者が設定し、ユーザープロンプトはあなたが入力します。通常はシステム層の優先順位が高いです。'],
      ['同じプロンプトがモデルごとに違うのはなぜですか？', 'モデルファミリーはスタイル、参照、制約を別々に解釈します。モデル選択もプロンプト設計の一部です。'],
      ['隠れた指示を見せてと頼むべきですか？', 'いいえ。創作にはほとんど役立ちません。何を固定し、何を変え、どう判断するかを書く方が有効です。'],
      ['参照画像はプロンプトとどう連携しますか？', '参照の役割を明確にすると機能します。身元、商品形状、色、構図、ムードのどれを制御するかを書きます。'],
      ['書き直すよりモデルを変えるべき時は？', '診断後です。プロンプトは明確なのに構造よりムードが優先されるなら、より制御型のモデルを選びます。'],
      ['システムプロンプトでプロンプト設計は不要になりますか？', 'なりません。むしろ実務的になります。良いプロンプトはツールと協調します。'],
    ],
  },
  ko: {
    intro:
      '시스템 프롬프트와 모델 지시는 AI 도구가 사용자의 보이는 프롬프트를 해석하는 방식에 영향을 줍니다. 숨겨진 시스템 프롬프트는 보통 볼 수 없지만, 지시 계층, 모델 적합성, 레퍼런스 이미지 전달, 실행 전 적용되는 한계를 이해하면 더 좋은 이미지 프롬프트를 쓸 수 있습니다.',
    tldrHeading: '핵심 요약: 도구와 협력하는 프롬프트 쓰기',
    tldrItems: [
      '시스템 프롬프트를 사용자 프롬프트가 작동해야 하는 정책과 행동의 층으로 봅니다.',
      '스타일보다 바뀌면 안 되는 시각 사실을 먼저 둡니다: 주제, 정체성, 크롭, 레퍼런스 역할, 출력 규칙.',
      '작업에 맞춰 모델을 고릅니다: 지시 제어는 GPT Image 2, 빠른 변형은 Nano Banana, 무드 탐색은 Midjourney.',
      '숨겨진 프롬프트를 쫓지 말고 무엇이 고정되고 무엇이 바뀌며 첫 결과를 어떻게 판단할지 씁니다.',
      '결과가 실패하면 계층 충돌, 모델 한계, 레퍼런스 모호함, 불가능한 표현 중 무엇인지 진단합니다.',
    ],
    systemHeading: 'AI 이미지 도구에서 시스템 프롬프트가 하는 일',
    systemText:
      '시스템 프롬프트는 도구나 모델 제공자가 설정하는 지시 층입니다. 톤, 안전 경계, 형식, 도구 사용, 거절 방식, 지시 우선순위를 정의할 수 있습니다. 이미지 도구에서는 사용자가 입력한 보이는 프롬프트만 지시가 아닙니다.',
    layerHeaders: ['지시 층', '관리 주체', '이미지 프롬프트에 미치는 영향'],
    layerRows: [
      ['시스템 프롬프트', '도구 또는 모델 제공자', '안전 규칙, 기본 동작, 출력 경계, 지시 우선순위.'],
      ['앱 지시', '제품 인터페이스', '모델 라우팅, 프롬프트 라이브러리 기본값, 레퍼런스 처리, 워크스페이스 제약.'],
      ['사용자 프롬프트', '사용자', '주제, 장면, 스타일, 크롭, 레퍼런스 역할, 검수 기준.'],
      ['레퍼런스 이미지', '사용자와 모델', '역할이 명확할 때 정체성, 구도, 팔레트, 물체 형태, 무드 제어.'],
      ['모델 동작', '모델 계열', '지시 준수 정도, 스타일 해석, 먼저 흔들리는 디테일.'],
    ],
    hierarchyHeading: '비주얼 프롬프트의 지시 계층',
    hierarchyAlt: '정체성과 지시 계층을 설명하는 프로필 스타일 이미지',
    hierarchyCaption:
      '프로필 스타일 이미지는 정체성, 인물 단서, 허용되는 변형이 무엇을 고정하고 무엇을 모델이 재해석해도 되는지에 달려 있음을 보여줍니다.',
    hierarchyText:
      '계층은 중요합니다. 스타일 언어는 종종 정체성과 레이아웃과 경쟁합니다. 제품 형태를 정확히 유지하라고 하면서 초현실적으로 녹아내리는 포스터를 요청하면 모델은 무엇을 우선할지 결정해야 합니다. 좋은 프롬프트는 이 우선순위를 명확히 씁니다.',
    hierarchyItems: [
      '첫째: 바뀌면 안 되는 정체성과 주제 사실.',
      '둘째: 구도, 크롭, 화면비, 채널 요구사항.',
      '셋째: 레퍼런스 이미지의 역할. 정체성, 팔레트, 레이아웃, 질감, 무드 등.',
      '넷째: 스타일, 조명, 렌즈, 소재, 분위기.',
      '다섯째: 텍스트 없음, 워터마크 없음, 추가 손 없음, 로고 왜곡 없음 같은 부정 규칙.',
    ],
    matrixHeading: '시나리오 매트릭스: 시스템, 모델, 실패 모드',
    matrixHeaders: ['작업', '가장 좋은 보이는 지시', '모델 적합성', '가능한 실패'],
    matrixRows: [
      ['제품 이미지', '스타일보다 형태, 소재, 패키지, 크롭, 배경 보존을 먼저 씁니다.', '레퍼런스 제어가 중요하면 GPT Image 2 또는 Nano Banana.', '이미지는 예쁘지만 제품 실루엣이 틀림.'],
      ['포트레이트 변형', '레퍼런스가 무엇을 제어하고 무엇이 바뀔 수 있는지 명시합니다.', '빠른 변형은 Nano Banana, 제어는 GPT Image 2.', '얼굴 드리프트 또는 과한 스타일화.'],
      ['패션 콘셉트', '무드, 의상 구조, 포즈, 카메라 거리를 씁니다.', '정체성이 핵심이 아니면 Midjourney.', '무드는 강하지만 현실 디테일이 약함.'],
      ['포스터 비주얼', '헤드라인 공간을 남기고 생성 텍스트를 피합니다.', '레이아웃은 GPT Image 2, 무드는 Midjourney.', '프레임이 복잡하거나 가짜 글자가 생김.'],
      ['UI 목업', '인터페이스 계층과 디바이스 프레임을 명확히 유지합니다.', '구조가 중요하면 GPT Image 2.', '유용한 계층 대신 장식적 화면 노이즈가 생김.'],
    ],
    promptsHeading: '시스템을 고려한 이미지 작업용 복사 프롬프트',
    promptsText:
      '아래 블록은 보이는 프롬프트입니다. 숨겨진 시스템 프롬프트를 노출하지 않고, 도구 안에 이미 있는 지시 층과 협력하도록 돕습니다.',
    workedHeading: '예시: 약한 첫 결과 진단하기',
    rawJobHeading: '원본 작업',
    rawJobText:
      '은색 스마트 링의 론칭 포스터가 필요합니다. 링 형태와 마감은 안정적이어야 하고, 깔끔한 헤드라인 공간이 필요하며, 무드는 SF보다 프리미엄에 가까워야 합니다.',
    promptVersionHeading: '프롬프트 버전 1',
    diagnosisHeading: '진단 규칙',
    diagnosisText:
      '링은 예쁘지만 실루엣이 바뀌었다면 스타일 문제가 아닙니다. 레퍼런스를 추가하고 실루엣, 두께, 마감, 로고 위치를 제어한다고 씁니다. 실루엣은 맞지만 프레임이 복잡하다면 정체성 지시는 유지하고 크롭, 배경, 여백만 수정합니다.',
    revisionTitle: '수정 규칙',
    revisionText:
      '스타일보다 계층을 먼저 고칩니다. 바뀌면 안 되는 지시를 강화한 뒤 조명, 배경, 모델 계열 같은 선택 제어 하나만 바꿉니다.',
    modelHeading: '모델 계열이 프롬프트 동작을 바꾸는 방식',
    modelAlt: '모델 적합성을 설명하는 스타일화된 Midjourney 이미지',
    modelCaption:
      '스타일화된 예시는 엄격한 물체 보존보다 무드와 구도가 주요 가치가 되는 경우를 보여주므로 모델 적합성 설명에 맞습니다.',
    modelText:
      '같은 보이는 프롬프트도 모델 계열에 따라 다르게 동작합니다. 이는 프롬프트 품질뿐 아니라 모델 적합성의 문제입니다. Vogue AI에서는 모델 태그를 라우팅 선택으로 사용합니다.',
    modelItems: [
      'GPT Image 2: 제어된 제품 비주얼, 레이아웃 민감 포스터, UI 목업, 지시 준수가 중요한 편집.',
      'Nano Banana: 빠른 변형, 소셜 이미지 실험, 레퍼런스 기반 포트레이트, 가벼운 image-to-image 탐색.',
      'Midjourney: 패션 무드, 에디토리얼 분위기, 스타일화된 콘셉트, 탐색적 아트 디렉션.',
      '무엇이 실패했는지 안 뒤 모델을 바꿉니다. 잘못된 실루엣은 레퍼런스 전달 문제이고, 밋밋한 무드는 다른 모델 계열이 필요할 수 있습니다.',
    ],
    mistakeHeading: '실패와 수정 표',
    mistakeHeaders: ['실패', '가능한 원인', '먼저 고칠 것'],
    mistakeRows: [
      ['모델이 핵심 물체 디테일을 무시함', '스타일이 정체성보다 강함.', '그 디테일을 첫 문장으로 옮기고 바뀌면 안 된다고 표시합니다.'],
      ['레퍼런스 이미지가 너무 많이 변함', '레퍼런스 역할이 모호함.', '정체성, 팔레트, 레이아웃, 질감, 무드 중 무엇을 제어하는지 씁니다.'],
      ['가짜 텍스트가 생김', '최종 타이포그래피를 모델에게 요청함.', '헤드라인 공간을 예약하고 텍스트는 디자인 도구에서 추가합니다.'],
      ['스타일은 강하지만 브리프와 다름', '모델이 엄격한 제어보다 무드를 선호함.', '제어형 모델을 쓰거나 선택적 스타일 언어를 줄입니다.'],
      ['도구가 거절하거나 약화함', '요청이 안전 또는 제품 정책과 충돌함.', '허용되는 시각 목표 중심으로 다시 씁니다.'],
    ],
    vogueHeading: 'Vogue AI에서 사용하는 방법',
    vogueText:
      'Vogue AI에서는 가장 예쁜 이미지가 아니라 시각 작업에 가장 가까운 프롬프트 예시에서 시작합니다. 지시 계층에 맞춰 보이는 프롬프트를 조정하고, 한 모델 계열을 테스트하고, 첫 실패를 확인한 뒤 지시를 강화할지, 레퍼런스를 추가할지, 모델 태그를 바꿀지 결정합니다.',
    vogueItems: [
      '시각 작업에 가장 가까운 프롬프트 예시를 엽니다.',
      '도구 간 복사가 안정적이어야 하는 공개 프롬프트 블록은 영어로 유지합니다.',
      '정체성, 제품 형태, 패키지, UI 계층, 팔레트 연속성에는 레퍼런스를 사용합니다.',
      '실패를 수정한 프롬프트 버전을 저장하고 다음 제어된 시작점으로 재사용합니다.',
    ],
    linksTitle: 'Vogue AI에서 다음 단계',
    links: [
      { label: 'Vogue AI 워크스페이스 열기', href: '/', description: '하나의 보이는 프롬프트를 여러 모델 계열에서 테스트하고 첫 실패를 진단합니다.' },
      { label: '프롬프트 엔지니어링 팁 읽기', href: '/blog/prompt-engineering-tips', description: '지시 계층을 제품, 포트레이트, 포스터, UI용 반복 가능한 프롬프트로 바꿉니다.' },
      { label: '일관된 AI 이미지 만들기', href: '/blog/how-to-create-consistent-ai-images', description: '정체성이나 제품 형태가 고정되어야 할 때 레퍼런스 앵커와 수정 규칙을 적용합니다.' },
    ],
    faqHeading: 'FAQ',
    faq: [
      ['AI 도구의 시스템 프롬프트를 볼 수 있나요?', '보통은 볼 수 없습니다. 하지만 지시 계층과 모델 한계를 존중하는 보이는 프롬프트로 결과를 개선할 수 있습니다.'],
      ['시스템 프롬프트는 사용자 프롬프트와 같은가요?', '아닙니다. 시스템 프롬프트는 도구나 제공자가 설정하고, 사용자 프롬프트는 사용자가 입력합니다. 보통 시스템 층의 우선순위가 더 높습니다.'],
      ['같은 프롬프트가 모델마다 다르게 보이는 이유는?', '모델 계열마다 스타일, 레퍼런스, 제약을 다르게 해석합니다. 모델 선택도 프롬프트 설계의 일부입니다.'],
      ['AI에게 숨겨진 지시를 공개하라고 해야 하나요?', '아니요. 창작 작업에는 거의 도움이 되지 않습니다. 무엇이 고정되고 무엇이 바뀌며 어떻게 판단할지 쓰는 것이 더 좋습니다.'],
      ['레퍼런스 이미지는 프롬프트와 어떻게 작동하나요?', '역할이 명확할 때 가장 잘 작동합니다. 정체성, 제품 형태, 팔레트, 구도, 무드 중 무엇을 제어하는지 쓰세요.'],
      ['언제 프롬프트를 다시 쓰기보다 모델을 바꿔야 하나요?', '진단 후입니다. 프롬프트는 명확한데 모델이 구조보다 무드를 계속 우선하면 더 제어형 모델을 선택합니다.'],
      ['시스템 프롬프트 때문에 프롬프트 엔지니어링이 쓸모없어지나요?', '아닙니다. 오히려 더 실용적입니다. 좋은 프롬프트는 도구와 싸우지 않고 협력합니다.'],
    ],
  },
} satisfies Record<SupportedBlogLocale, SystemCopy>;

const localizedContent = (locale: SupportedBlogLocale): BlogContentBlock[] => {
  const copy = localizedCopy[locale];

  return [
    { type: 'paragraph', text: copy.intro },
    { type: 'heading', level: 2, text: copy.tldrHeading },
    { type: 'list', items: copy.tldrItems },
    { type: 'heading', level: 2, text: copy.systemHeading },
    { type: 'paragraph', text: copy.systemText },
    { type: 'table', headers: copy.layerHeaders, rows: copy.layerRows },
    { type: 'heading', level: 2, text: copy.hierarchyHeading },
    { type: 'image', src: promptLibraryImages.hierarchy, alt: copy.hierarchyAlt, caption: copy.hierarchyCaption },
    { type: 'paragraph', text: copy.hierarchyText },
    { type: 'list', items: copy.hierarchyItems },
    { type: 'heading', level: 2, text: copy.matrixHeading },
    { type: 'table', headers: copy.matrixHeaders, rows: copy.matrixRows },
    { type: 'heading', level: 2, text: copy.promptsHeading },
    { type: 'paragraph', text: copy.promptsText },
    { type: 'list', items: [...promptBlocks] },
    { type: 'heading', level: 2, text: copy.workedHeading },
    { type: 'heading', level: 3, text: copy.rawJobHeading },
    { type: 'paragraph', text: copy.rawJobText },
    { type: 'heading', level: 3, text: copy.promptVersionHeading },
    { type: 'list', items: ['Premium launch poster for a silver smart ring, exact ring silhouette and brushed-metal finish, centered product hero, deep charcoal background, soft rim light, clean negative space above the ring for future headline, 4:5 aspect ratio, no generated text, no watermark.'] },
    { type: 'heading', level: 3, text: copy.diagnosisHeading },
    { type: 'paragraph', text: copy.diagnosisText },
    { type: 'callout', title: copy.revisionTitle, text: copy.revisionText },
    { type: 'heading', level: 2, text: copy.modelHeading },
    { type: 'image', src: promptLibraryImages.modelFit, alt: copy.modelAlt, caption: copy.modelCaption },
    { type: 'paragraph', text: copy.modelText },
    { type: 'list', items: copy.modelItems },
    { type: 'heading', level: 2, text: copy.mistakeHeading },
    { type: 'table', headers: copy.mistakeHeaders, rows: copy.mistakeRows },
    { type: 'heading', level: 2, text: copy.vogueHeading },
    { type: 'paragraph', text: copy.vogueText },
    { type: 'list', items: copy.vogueItems },
    { type: 'links', title: copy.linksTitle, items: copy.links },
    { type: 'heading', level: 2, text: copy.faqHeading },
    ...copy.faq.flatMap(([question, answer]) => [
      { type: 'heading' as const, level: 3 as const, text: question },
      { type: 'paragraph' as const, text: answer },
    ]),
  ];
};

export const systemPromptsAndModelsOfAiToolsAutoBlogPost: BlogPostSource = {
  slug: 'system-prompts-and-models-of-ai-tools',
  date: '2026-06-29',
  updatedAt: '2026-06-29',
  author: 'Vogue AI Team',
  image: promptLibraryImages.hero,
  imageAlt: 'Visual poster prompt-library image for system prompts and AI model behavior',
  articleType: 'tutorial',
  modelTags: ['gpt-image-2', 'nano-banana', 'midjourney'],
  readingMinutes: 11,
  localizations: {
    en: {
      title: 'System prompts and models of AI tools, explained for image creators',
      summary:
        'A practical guide to instruction hierarchy, model behavior, reference images, and prompt design for better Vogue AI image workflows.',
      seoTitle: 'System Prompts and Models of AI Tools Guide',
      seoDescription:
        'Learn how system prompts, model behavior, instruction hierarchy, and reference images shape AI image prompts in Vogue AI.',
      content: enContent,
    },
    zh: {
      title: '面向图像创作者的 AI 工具系统提示词与模型指南',
      summary: '了解系统提示词、模型行为、参考图和指令层级如何影响 Vogue AI 图像工作流。',
      seoTitle: 'AI 工具系统提示词与模型指南',
      seoDescription: '学习系统提示词、模型行为、指令层级和参考图如何影响 Vogue AI 图像提示词。',
      content: localizedContent('zh'),
    },
    fr: {
      title: "Prompts système et modèles d'outils IA pour créateurs d'images",
      summary:
        "Un guide pratique sur la hiérarchie d'instructions, le comportement des modèles et les images de référence dans Vogue AI.",
      seoTitle: "Guide des prompts système et modèles d'outils IA",
      seoDescription:
        "Comprenez comment prompts système, modèles, hiérarchie et références influencent les prompts d'image dans Vogue AI.",
      content: localizedContent('fr'),
    },
    ru: {
      title: 'Системные промпты и модели AI-инструментов для визуальных задач',
      summary:
        'Практический гид по иерархии инструкций, поведению моделей и референсам в рабочих процессах Vogue AI.',
      seoTitle: 'Гайд по системным промптам и моделям AI-инструментов',
      seoDescription:
        'Узнайте, как системные промпты, модели, иерархия и референсы влияют на промпты изображений в Vogue AI.',
      content: localizedContent('ru'),
    },
    pt: {
      title: 'Prompts de sistema e modelos de ferramentas de IA para imagens',
      summary:
        'Um guia prático sobre hierarquia de instruções, comportamento de modelos e referências nos fluxos do Vogue AI.',
      seoTitle: 'Guia de Prompts de Sistema e Modelos de IA',
      seoDescription:
        'Entenda como prompts de sistema, modelos, hierarquia e referências moldam prompts de imagem no Vogue AI.',
      content: localizedContent('pt'),
    },
    ja: {
      title: '画像制作向け AI ツールのシステムプロンプトとモデル解説',
      summary:
        'Vogue AI での指示階層、モデル挙動、参考画像、プロンプト設計を実践的に理解するガイドです。',
      seoTitle: 'AI ツールのシステムプロンプトとモデル実践ガイド',
      seoDescription:
        'システムプロンプト、モデル挙動、指示階層、参考画像が Vogue AI の画像プロンプトに与える影響を学びます。',
      content: localizedContent('ja'),
    },
    ko: {
      title: '이미지 제작자를 위한 AI 도구 시스템 프롬프트와 모델 이해',
      summary:
        'Vogue AI에서 지시 계층, 모델 동작, 레퍼런스 이미지, 프롬프트 설계를 실무적으로 이해하는 가이드입니다.',
      seoTitle: 'AI 도구 시스템 프롬프트와 모델 실전 가이드',
      seoDescription:
        '시스템 프롬프트, 모델 동작, 지시 계층, 레퍼런스 이미지가 Vogue AI 이미지 프롬프트에 주는 영향을 배웁니다.',
      content: localizedContent('ko'),
    },
  },
};
