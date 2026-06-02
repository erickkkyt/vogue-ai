import type { BlogContentBlock, BlogPostSource } from '@/lib/blog-data';

const styleTransferImages = {
  styleReference:
    'https://media.vogueai.net/prompt-libraries/awesome-ai-prompts/midjourney/x-2061040008937582812/exploring-style-sref-229435892-midjourney-8-1-2.jpg',
  animeStyle:
    'https://media.vogueai.net/blog/auto/change-image-to-specific-art-style/e0ef32d5a2b4-1-midjourney-elf-witch-japanese-anime-style-1.jpg',
  watercolorStyle:
    'https://media.vogueai.net/prompt-libraries/awesome-ai-prompts/nano-banana/x-2061036537693790354/beautiful-watercolor-style-travel-poster-illustrated-map-1.jpg',
} as const;

const copyablePromptBlocks = [
  'Anime style transfer: Use my uploaded image as the subject reference. Preserve the main subject identity, pose, camera angle, and key silhouette. Recreate the image in clean Japanese anime style, crisp linework, controlled cel shading, expressive but not exaggerated features, soft cinematic background, same composition, 4:5 aspect ratio, no text, no watermark.',
  'Watercolor style transfer: Use my uploaded image as the structure reference. Keep the subject, framing, horizon line, and important objects recognizable. Render it as delicate watercolor illustration on textured paper, soft pigment bleed, restrained ink edges, natural light, airy palette, no text, no watermark.',
  'Oil painting style transfer: Use my uploaded photo as the subject reference. Preserve face identity or product shape exactly, then reinterpret lighting and surface texture as a classic oil painting with visible brushwork, layered warm shadows, museum-quality color depth, stable anatomy, same crop, no text.',
  'Editorial poster style transfer: Use my uploaded image as the layout reference. Keep the subject placement and negative space, transform the look into a high-fashion editorial poster, bold contrast, refined grain, controlled palette, clean headline-safe area, no generated typography.',
  'Cartoon style transfer: Use my uploaded image as the subject reference. Preserve the pose, outfit, and main proportions, convert the rendering into a polished cartoon illustration with simple shapes, friendly expression, clean background, limited color palette, no text, no watermark.',
] as const;

type LocalizedImageText = {
  styleAlt: string;
  styleCaption: string;
  animeAlt: string;
  animeCaption: string;
  watercolorAlt: string;
  watercolorCaption: string;
};

const defaultImageText: LocalizedImageText = {
  styleAlt: 'Style-reference prompt example for changing an image into a specific art style',
  styleCaption:
    'Style transfer works best when the prompt separates what the reference image preserves from what the new art style may reinterpret.',
  animeAlt: 'Anime-style prompt-library example for art style transfer',
  animeCaption:
    'A named style is not enough. The prompt also needs identity, pose, linework, shading, crop, and text rules.',
  watercolorAlt: 'Watercolor-style prompt-library example for image style transfer',
  watercolorCaption:
    'Texture-heavy styles need material words and preservation rules, otherwise the subject can dissolve into decoration.',
};

type LocalizedCopy = {
  intro: string;
  tldrHeading: string;
  tldr: string[];
  workflowHeading: string;
  workflowIntro: string;
  workflowHeaders: string[];
  workflowRows: string[][];
  imagePlanHeading: string;
  imagePlan: string[];
  templateHeading: string;
  templateIntro: string;
  recipeHeading: string;
  recipeHeaders: string[];
  recipeRows: string[][];
  exampleHeading: string;
  exampleSourceHeading: string;
  exampleSourceBody: string;
  examplePromptHeading: string;
  examplePromptList: string[];
  exampleDiagnosisHeading: string;
  exampleDiagnosisBody: string;
  checkHeading: string;
  checkBody: string;
  checkList: string[];
  modelHeading: string;
  modelHeaders: string[];
  modelRows: string[][];
  failureHeading: string;
  failureHeaders: string[];
  failureRows: string[][];
  handoffHeading: string;
  handoff: string[];
  revisionTitle: string;
  revisionText: string;
  imageText?: Partial<LocalizedImageText>;
  faq: Array<[string, string]>;
};

function createContent(copy: LocalizedCopy): BlogContentBlock[] {
  const imageText = { ...defaultImageText, ...copy.imageText };

  return [
    {
      type: 'paragraph',
      text: copy.intro,
    },
    {
      type: 'heading',
      level: 2,
      text: copy.tldrHeading,
    },
    {
      type: 'list',
      items: copy.tldr,
    },
    {
      type: 'image',
      src: styleTransferImages.styleReference,
      alt: imageText.styleAlt,
      caption: imageText.styleCaption,
    },
    {
      type: 'heading',
      level: 2,
      text: copy.workflowHeading,
    },
    {
      type: 'paragraph',
      text: copy.workflowIntro,
    },
    {
      type: 'table',
      headers: copy.workflowHeaders,
      rows: copy.workflowRows,
    },
    {
      type: 'heading',
      level: 2,
      text: copy.imagePlanHeading,
    },
    {
      type: 'list',
      items: copy.imagePlan,
    },
    {
      type: 'heading',
      level: 2,
      text: copy.templateHeading,
    },
    {
      type: 'paragraph',
      text: copy.templateIntro,
    },
    {
      type: 'image',
      src: styleTransferImages.animeStyle,
      alt: imageText.animeAlt,
      caption: imageText.animeCaption,
    },
    {
      type: 'list',
      items: [...copyablePromptBlocks],
    },
    {
      type: 'heading',
      level: 2,
      text: copy.recipeHeading,
    },
    {
      type: 'table',
      headers: copy.recipeHeaders,
      rows: copy.recipeRows,
    },
    {
      type: 'heading',
      level: 2,
      text: copy.exampleHeading,
    },
    {
      type: 'heading',
      level: 3,
      text: copy.exampleSourceHeading,
    },
    {
      type: 'paragraph',
      text: copy.exampleSourceBody,
    },
    {
      type: 'heading',
      level: 3,
      text: copy.examplePromptHeading,
    },
    {
      type: 'list',
      items: copy.examplePromptList,
    },
    {
      type: 'heading',
      level: 3,
      text: copy.exampleDiagnosisHeading,
    },
    {
      type: 'paragraph',
      text: copy.exampleDiagnosisBody,
    },
    {
      type: 'callout',
      title: copy.revisionTitle,
      text: copy.revisionText,
    },
    {
      type: 'heading',
      level: 2,
      text: copy.checkHeading,
    },
    {
      type: 'image',
      src: styleTransferImages.watercolorStyle,
      alt: imageText.watercolorAlt,
      caption: imageText.watercolorCaption,
    },
    {
      type: 'paragraph',
      text: copy.checkBody,
    },
    {
      type: 'list',
      items: copy.checkList,
    },
    {
      type: 'heading',
      level: 2,
      text: copy.modelHeading,
    },
    {
      type: 'table',
      headers: copy.modelHeaders,
      rows: copy.modelRows,
    },
    {
      type: 'heading',
      level: 2,
      text: copy.failureHeading,
    },
    {
      type: 'table',
      headers: copy.failureHeaders,
      rows: copy.failureRows,
    },
    {
      type: 'heading',
      level: 2,
      text: copy.handoffHeading,
    },
    {
      type: 'list',
      items: copy.handoff,
    },
    {
      type: 'heading',
      level: 2,
      text: 'FAQ',
    },
    ...copy.faq.flatMap(([question, answer]): BlogContentBlock[] => [
      { type: 'heading', level: 3, text: question },
      { type: 'paragraph', text: answer },
    ]),
  ];
}

const enCopy: LocalizedCopy = {
  intro:
    'To change an image to a specific art style, upload the original image, tell the model what must stay fixed, then name the new style with concrete visual controls. The prompt should protect subject identity, pose, crop, and important objects while changing rendering, texture, color, and lighting.',
  tldrHeading: 'TL;DR: preserve the subject, change the rendering',
  tldr: [
    'Start with a reference image whenever identity, pose, product shape, or layout must survive.',
    'Write one preservation sentence before the style words: what stays fixed, what can change, and what should not appear.',
    'Use named style families such as anime, watercolor, oil painting, editorial poster, cartoon, or cinematic illustration.',
    'Add material controls: linework, paper grain, brushwork, cel shading, film grain, color palette, and lighting.',
    'Judge the first result by failure mode: identity drift, weak style, over-stylization, messy background, or broken generated text.',
  ],
  workflowHeading: 'Reference-image style transfer workflow',
  workflowIntro:
    'The workflow is simple, but the order matters. If you name the style before protecting the source image, the model may make a beautiful picture that no longer matches the original subject.',
  workflowHeaders: ['Step', 'What to write', 'Why it matters'],
  workflowRows: [
    ['1. Upload the image', 'Use the original as a subject or layout reference.', 'The image carries identity, pose, camera angle, product shape, and composition.'],
    ['2. Declare preservation rules', 'Preserve [identity / pose / silhouette / layout / key objects].', 'This prevents the style from replacing the actual job.'],
    ['3. Name the art style', 'Anime, watercolor, oil painting, cartoon, editorial poster, or another specific style.', 'A named family gives the model a visual direction.'],
    ['4. Add style controls', 'Linework, shading, palette, texture, medium, background, and lighting.', 'Concrete controls beat vague words like artistic or beautiful.'],
    ['5. Add output rules', 'Aspect ratio, no text, no watermark, same crop, clean background, or headline-safe area.', 'The result remains usable in a real design or marketing workflow.'],
  ],
  imagePlanHeading: 'Image plan for this guide',
  imagePlan: [
    'Hero and first body image: a Midjourney style-reference example, because the article is about style controls rather than a generic image edit.',
    'Prompt template section: an anime-style example, because anime is a common high-intent style-transfer request.',
    'Texture section: a watercolor-style poster example, because watercolor exposes the biggest risk of losing subject structure.',
    'All images are first-party Vogue AI prompt-library assets and keep the cover equal to the first body image.',
  ],
  templateHeading: 'Copyable prompts for common art styles',
  templateIntro:
    'Copy one block, replace the bracketed fields, and keep the prompt in English when you paste it into Vogue AI. The explanation around the prompt can be localized, but the public prompt block should stay copyable.',
  recipeHeading: 'Style recipe matrix',
  recipeHeaders: ['Style target', 'Preserve from the source', 'Add to the prompt', 'First result check'],
  recipeRows: [
    ['Anime', 'Face identity, pose, outfit, and camera angle.', 'Clean linework, cel shading, controlled expressions, simple background.', 'Check whether the face became too generic or the pose changed.'],
    ['Watercolor', 'Subject outline, horizon line, important props, and crop.', 'Paper grain, pigment bleed, soft edges, airy palette, restrained ink.', 'Check whether details dissolved or contrast became too weak.'],
    ['Oil painting', 'Anatomy, product shape, face structure, and composition.', 'Brushwork, layered color, warm shadows, canvas texture, museum lighting.', 'Check whether the style is strong without distorting the subject.'],
    ['Editorial poster', 'Subject placement and negative space.', 'Bold contrast, refined grain, campaign lighting, clear text-safe area.', 'Check whether the frame still leaves room for real typography.'],
    ['Cartoon', 'Pose, outfit, proportions, and main silhouette.', 'Simplified shapes, friendly expression, limited palette, clean background.', 'Check whether simplification removed the recognizable parts.'],
  ],
  exampleHeading: 'Worked example: turn one photo into watercolor',
  exampleSourceHeading: 'Source image goal',
  exampleSourceBody:
    'Assume the uploaded image is a product photo of a handmade ceramic coffee dripper on a kitchen counter. The shape, glaze color, and camera crop must remain stable, but the final result should look like a delicate watercolor editorial illustration.',
  examplePromptHeading: 'Prompt version 1',
  examplePromptList: [
    'Use my uploaded image as the structure reference. Preserve the ceramic coffee dripper shape, glaze color, rim angle, counter placement, camera crop, and main shadow direction. Recreate the scene as a delicate watercolor editorial illustration on textured cold-press paper, soft pigment bleed, restrained ink outlines, warm morning light, airy neutral background, same 4:5 composition, no text, no watermark.',
  ],
  exampleDiagnosisHeading: 'First-result diagnosis',
  exampleDiagnosisBody:
    'If the watercolor look is good but the dripper shape changes, strengthen the preservation sentence before adding more style words. If the shape is correct but the image still looks like a filter, add medium-specific controls such as cold-press paper, pigment bleed, dry-brush edges, and restrained ink outlines.',
  checkHeading: 'Texture-heavy styles need extra constraints',
  checkBody:
    'Watercolor, oil painting, crayon, risograph, pencil, and paper-cut styles are useful because they change material texture. They are also risky because texture can swallow identity. Add a review checklist before you generate many variations.',
  checkList: [
    'Identity: the same face, product shape, logo placement, or object outline remains recognizable.',
    'Composition: crop, camera angle, and subject placement still match the source image.',
    'Style strength: the new medium is visible without turning the result into a generic illustration.',
    'Background: the background supports the style instead of adding random props.',
    'Production rule: generated text is removed or reserved as a blank area for later design work.',
  ],
  modelHeading: 'Which Vogue AI model to use',
  modelHeaders: ['Goal', 'GPT Image 2', 'Nano Banana', 'Midjourney'],
  modelRows: [
    ['Preserve the source closely', 'Best first choice for instruction following and reference-aware edits.', 'Good for fast exploration when exact identity is less strict.', 'Use when style discovery matters more than close reconstruction.'],
    ['Explore many style directions', 'Use when you need controlled variants from one prompt skeleton.', 'Useful for quick social or creator-style variations.', 'Strong for style-reference exploration and art-direction mood boards.'],
    ['Prepare a production asset', 'Best when layout, product shape, or face fidelity matters.', 'Good for fast drafts before final selection.', 'Useful for a mood target that may be refined elsewhere.'],
  ],
  failureHeading: 'Failure fixes',
  failureHeaders: ['Failure', 'Fix first', 'Avoid first'],
  failureRows: [
    ['Identity drift', 'Make the reference handoff explicit and name what must not change.', 'Adding more style adjectives.'],
    ['Style is too weak', 'Add medium-specific controls: linework, brushwork, paper grain, shading, or palette.', 'Changing the source image immediately.'],
    ['Over-stylization', 'Lower the style intensity and restate same crop, same pose, same silhouette.', 'Switching to a totally different style family.'],
    ['Messy background', 'Specify clean background, fewer props, or preserve original background layout.', 'Adding more cinematic language.'],
    ['Broken text or logo', 'Ask for no generated text and reserve clean space for later typography.', 'Asking the model to spell a final headline perfectly.'],
  ],
  handoffHeading: 'Vogue AI handoff checklist',
  handoff: [
    'Pick the closest prompt-library example before writing from scratch.',
    'Upload the source image and decide what role it plays: identity, product shape, pose, layout, or palette.',
    'Copy one prompt block and replace only the bracketed variables for the first generation.',
    'Save the first version that preserves the subject and shows the target style clearly.',
    'Create variants by changing one control at a time: style family, texture, palette, lighting, or crop.',
  ],
  revisionTitle: 'Revision rule',
  revisionText:
    'Fix preservation before aesthetics. A beautiful style transfer is not useful if the person, product, pose, or layout no longer matches the source image.',
  faq: [
    ['How do I change an image to a specific art style?', 'Upload the image, state what must stay fixed, name the target art style, add style controls, and generate a first result. Then revise the largest failure first.'],
    ['What should the reference image control?', 'It should control the parts that matter to the job: identity, product shape, pose, layout, color palette, or key objects. Say this directly in the prompt.'],
    ['Which art styles work well?', 'Anime, watercolor, oil painting, editorial poster, cartoon, risograph, pencil sketch, cinematic illustration, and fashion editorial all work when the style controls are specific.'],
    ['Should prompt blocks stay in English?', 'For public copy-paste blocks, yes. English prompts are easier to reuse across Vogue AI models, while the surrounding article can be fully localized.'],
    ['How do I stop the subject from changing?', 'Put preservation rules before style rules, use a clear reference handoff, and inspect the first result for identity drift before adding more style language.'],
    ['What if the result looks like a simple filter?', 'Add medium-specific details such as cel shading, ink linework, paper grain, pigment bleed, brush texture, or poster grain. Style transfer needs material language, not only a style name.'],
  ],
};

const zhCopy: LocalizedCopy = {
  intro:
    '把一张图改成指定艺术风格时，关键不是只写“变成某某风格”，而是先说明原图里哪些东西必须保留，再说明新的渲染方式。提示词要保护主体身份、姿势、裁切和关键物体，同时允许线条、材质、配色和光线变化。',
  tldrHeading: 'TL;DR：保留主体，改变渲染',
  tldr: [
    '只要身份、姿势、产品形状或版式要保留，就先上传参考图。',
    '风格词之前先写保留规则：什么不变、什么可以变、什么不要出现。',
    '使用明确风格族：anime、watercolor、oil painting、editorial poster、cartoon 或 cinematic illustration。',
    '补充材质控制：linework、paper grain、brushwork、cel shading、film grain、color palette 和 lighting。',
    '第一张结果按 failure mode 判断：身份漂移、风格太弱、过度风格化、背景混乱或生成文字错误。',
  ],
  workflowHeading: '参考图到风格迁移的工作流',
  workflowIntro:
    '流程不复杂，但顺序很重要。如果先写风格、不先保护原图，模型很容易生成一张好看的图，却不像原来的主体。',
  workflowHeaders: ['步骤', '要写什么', '为什么重要'],
  workflowRows: [
    ['1. 上传图片', '把原图作为 subject 或 layout reference。', '图片承载身份、姿势、镜头角度、产品形状和构图。'],
    ['2. 声明保留规则', 'Preserve [identity / pose / silhouette / layout / key objects].', '避免风格把真正的任务替换掉。'],
    ['3. 命名目标风格', 'Anime、watercolor、oil painting、cartoon、editorial poster 等。', '明确的风格族会给模型稳定方向。'],
    ['4. 添加风格控制', '线条、阴影、色板、质感、媒介、背景和光线。', '具体控制比“artistic”“beautiful”更可靠。'],
    ['5. 添加输出规则', '画幅、no text、no watermark、same crop、clean background 或 headline-safe area。', '结果才能进入真实设计或营销流程。'],
  ],
  imagePlanHeading: '本文配图计划',
  imagePlan: [
    '首图和封面：Midjourney style-reference 示例，因为主题是风格控制，而不是普通图片编辑。',
    '模板段落：anime style 示例，因为动漫风格是高频风格迁移需求。',
    '材质段落：watercolor poster 示例，因为水彩最容易暴露主体结构丢失问题。',
    '所有图片都来自 Vogue AI 第一方 prompt-library，并保持封面等于第一张正文图。',
  ],
  templateHeading: '常见艺术风格的可复制提示词',
  templateIntro:
    '复制一个 block，替换方括号变量，然后在 Vogue AI 里保持英文粘贴。文章说明可以本地化，但公开提示词块要保持可复制。',
  recipeHeading: '风格配方矩阵',
  recipeHeaders: ['目标风格', '从原图保留', '提示词里添加', '第一张结果检查'],
  recipeRows: [
    ['Anime', '脸部身份、姿势、服装和镜头角度。', '干净线稿、cel shading、受控表情、简洁背景。', '检查脸是否变得过于通用，姿势是否被改掉。'],
    ['Watercolor', '主体轮廓、地平线、重要道具和裁切。', '纸张颗粒、颜料晕染、柔边、轻盈色板、克制墨线。', '检查细节是否溶掉，反差是否太弱。'],
    ['Oil painting', '解剖结构、产品形状、脸部结构和构图。', '笔触、叠色、暖阴影、画布质感、博物馆式光线。', '检查风格足够强但没有扭曲主体。'],
    ['Editorial poster', '主体位置和留白。', '强反差、精致颗粒、campaign lighting、文字安全区。', '检查画面是否仍给真实排版留空间。'],
    ['Cartoon', '姿势、服装、比例和主轮廓。', '简化形状、友好表情、有限色板、干净背景。', '检查简化后是否丢失可识别部分。'],
  ],
  exampleHeading: '实战例子：把一张照片变成水彩',
  exampleSourceHeading: '原图目标',
  exampleSourceBody:
    '假设上传的是一张手工陶瓷咖啡滤杯的产品照，放在厨房台面上。形状、釉色和镜头裁切必须稳定，但最终要像一张细腻的水彩编辑插画。',
  examplePromptHeading: 'Prompt version 1',
  examplePromptList: enCopy.examplePromptList,
  exampleDiagnosisHeading: '第一张结果诊断',
  exampleDiagnosisBody:
    '如果水彩效果很好但滤杯形状变了，不要继续加风格词，先强化 preserve 句子。如果形状正确但像普通滤镜，就补充冷压纸、颜料晕染、干刷边缘、克制墨线等媒介细节。',
  checkHeading: '材质风格需要额外约束',
  checkBody:
    'Watercolor、oil painting、crayon、risograph、pencil 和 paper-cut 的价值在于改变材质，但风险是材质吞掉身份。生成多版本前先放一个检查清单。',
  checkList: [
    '身份：同一个脸、产品形状、logo 位置或物体轮廓仍可识别。',
    '构图：裁切、镜头角度和主体位置仍接近原图。',
    '风格强度：新媒介清楚可见，但没有变成普通插画。',
    '背景：背景服务风格，而不是随机增加道具。',
    '生产规则：生成文字移除，或留空给后续设计。',
  ],
  modelHeading: '在 Vogue AI 里选哪个模型',
  modelHeaders: ['目标', 'GPT Image 2', 'Nano Banana', 'Midjourney'],
  modelRows: [
    ['尽量贴近原图', '指令遵循和 reference-aware 编辑的首选。', '适合快速探索，前提是身份要求没那么严格。', '适合风格发现，不适合强还原。'],
    ['探索多个风格方向', '用同一 prompt skeleton 做受控变体。', '适合快速社媒或 creator style 变化。', '适合 style-reference 探索和 art-direction mood board。'],
    ['准备生产资产', '当版式、产品形状或脸部保真重要时优先。', '适合作为快速草稿再筛选。', '适合先建立 mood target，再到别处细化。'],
  ],
  failureHeading: '失败修复表',
  failureHeaders: ['失败', '先修什么', '先避免什么'],
  failureRows: [
    ['身份漂移', '明确 reference handoff，并写出什么不能变。', '继续堆风格形容词。'],
    ['风格太弱', '添加媒介控制：线稿、笔触、纸纹、阴影或色板。', '立刻换原图。'],
    ['过度风格化', '降低风格强度，并重申 same crop、same pose、same silhouette。', '直接换完全不同风格族。'],
    ['背景混乱', '指定 clean background、更少道具或保留原背景版式。', '添加更多 cinematic 词。'],
    ['文字或 logo 错误', '要求 no generated text，并留出干净区域后期排版。', '要求模型完美拼写最终标题。'],
  ],
  handoffHeading: 'Vogue AI 执行检查清单',
  handoff: [
    '从最接近的 prompt-library 示例开始，不要空白页硬写。',
    '上传原图，并决定它控制身份、产品形状、姿势、版式还是色板。',
    '复制一个提示词 block，第一轮只替换变量。',
    '保存第一个既保留主体、又清楚呈现目标风格的版本。',
    '后续变体一次只改一个控制项：风格族、材质、色板、光线或裁切。',
  ],
  revisionTitle: '迭代规则',
  revisionText:
    '先修保真，再修审美。如果人物、产品、姿势或版式已经不像原图，再漂亮的风格迁移也不可用。',
  imageText: {
    styleAlt: '把图片改成指定艺术风格的 style-reference 示例',
    styleCaption: '稳定的风格迁移要先拆清楚：参考图保留什么，新风格可以重新解释什么。',
    animeAlt: '用于艺术风格迁移的 anime style 示例',
    animeCaption: '只写风格名称不够，还要写身份、姿势、线条、阴影、裁切和文字规则。',
    watercolorAlt: '用于图片风格迁移的 watercolor style 示例',
    watercolorCaption: '材质很强的风格需要明确保留规则，否则主体会被装饰感吞掉。',
  },
  faq: [
    ['怎样把图片改成指定艺术风格？', '上传图片，说明哪些必须保留，命名目标风格，添加风格控制，然后生成第一版，再按最大失败点迭代。'],
    ['参考图应该控制什么？', '控制任务真正需要保留的部分：身份、产品形状、姿势、版式、色板或关键物体。要在提示词里直接写清楚。'],
    ['哪些艺术风格比较好用？', 'Anime、watercolor、oil painting、editorial poster、cartoon、risograph、pencil sketch、cinematic illustration 和 fashion editorial 都可以。'],
    ['提示词块一定要英文吗？', '公开的 copy-paste block 最好保持英文，方便跨 Vogue AI 模型复用；说明文字可以完全本地化。'],
    ['如何阻止主体变化？', '把保留规则放在风格规则前，明确 reference handoff，并先检查身份漂移，再继续加风格语言。'],
    ['结果像简单滤镜怎么办？', '添加具体媒介词，比如 cel shading、ink linework、paper grain、pigment bleed、brush texture 或 poster grain。'],
  ],
};

const frCopy: LocalizedCopy = {
  intro:
    "Pour changer une image vers un style artistique précis, téléversez l'image source, indiquez ce qui doit rester fixe, puis décrivez le nouveau rendu avec des contrôles visuels concrets. Le prompt doit protéger l'identité, la pose, le cadrage et les objets importants tout en changeant texture, couleur et lumière.",
  tldrHeading: 'TL;DR : préserver le sujet, changer le rendu',
  tldr: [
    "Commencez par une image de référence si l'identité, la pose, la forme du produit ou la mise en page doivent rester stables.",
    'Écrivez une phrase de préservation avant les mots de style : ce qui reste fixe, ce qui peut changer et ce qui ne doit pas apparaître.',
    'Utilisez des familles nommées : anime, watercolor, oil painting, editorial poster, cartoon ou cinematic illustration.',
    'Ajoutez des contrôles de matière : linework, paper grain, brushwork, cel shading, film grain, color palette et lighting.',
    "Jugez le premier résultat par échec : dérive d'identité, style faible, sur-stylisation, arrière-plan confus ou texte généré cassé.",
  ],
  workflowHeading: 'Flux référence-image vers style',
  workflowIntro:
    "L'ordre compte. Si vous nommez le style avant de protéger la source, le modèle peut produire une belle image qui ne correspond plus au sujet original.",
  workflowHeaders: ['Étape', 'À écrire', 'Pourquoi'],
  workflowRows: [
    ["1. Téléverser l'image", 'Utiliser la source comme référence de sujet ou de mise en page.', "Elle porte l'identité, la pose, l'angle, la forme produit et la composition."],
    ['2. Déclarer la préservation', 'Preserve [identity / pose / silhouette / layout / key objects].', 'Cela empêche le style de remplacer la vraie tâche.'],
    ['3. Nommer le style', 'Anime, watercolor, oil painting, cartoon, editorial poster ou autre.', 'Une famille claire donne une direction visuelle stable.'],
    ['4. Ajouter les contrôles', 'Lignes, ombres, palette, texture, médium, fond et lumière.', 'Les contraintes concrètes battent les mots vagues.'],
    ['5. Ajouter les règles de sortie', 'Ratio, no text, no watermark, same crop, clean background ou zone de titre.', 'Le résultat reste utilisable en production.'],
  ],
  imagePlanHeading: "Plan d'images",
  imagePlan: [
    'Couverture et première image : un exemple Midjourney style-reference, car le sujet est le contrôle de style.',
    'Section modèles : un exemple anime, car ce style est une demande fréquente.',
    'Section texture : un poster watercolor, car cette matière montre vite les pertes de structure.',
    'Toutes les images viennent de la prompt-library Vogue AI et la couverture reste la première image du corps.',
  ],
  templateHeading: 'Prompts copiables par style',
  templateIntro:
    'Copiez un bloc, remplacez les variables entre crochets et gardez le prompt en anglais dans Vogue AI. Le commentaire peut être localisé, mais le bloc doit rester directement copiable.',
  recipeHeading: 'Matrice des recettes de style',
  recipeHeaders: ['Style cible', 'À préserver', 'À ajouter', 'Contrôle du premier résultat'],
  recipeRows: [
    ['Anime', 'Identité du visage, pose, tenue et angle.', 'Linework net, cel shading, expressions contrôlées, fond simple.', 'Vérifier si le visage devient générique ou si la pose change.'],
    ['Watercolor', 'Contour du sujet, horizon, objets importants et cadrage.', 'Grain papier, diffusion pigment, bords doux, palette légère.', 'Vérifier si les détails se dissolvent.'],
    ['Oil painting', 'Anatomie, forme produit, structure du visage et composition.', 'Brushwork, couleur en couches, ombres chaudes, texture toile.', "Vérifier que le style n'abîme pas le sujet."],
    ['Editorial poster', 'Placement du sujet et espace négatif.', 'Contraste fort, grain fin, lumière campaign, zone texte propre.', 'Vérifier la place pour une vraie typographie.'],
    ['Cartoon', 'Pose, tenue, proportions et silhouette.', 'Formes simples, expression claire, palette limitée, fond propre.', 'Vérifier que la simplification garde les repères.'],
  ],
  exampleHeading: 'Exemple : transformer une photo en watercolor',
  exampleSourceHeading: 'Objectif source',
  exampleSourceBody:
    "Imaginez une photo produit d'un dripper en céramique sur un plan de cuisine. La forme, la couleur de glaçure et le cadrage doivent rester stables, mais le rendu final doit devenir une illustration éditoriale watercolor.",
  examplePromptHeading: 'Prompt version 1',
  examplePromptList: enCopy.examplePromptList,
  exampleDiagnosisHeading: 'Diagnostic du premier résultat',
  exampleDiagnosisBody:
    'Si le rendu watercolor est bon mais que la forme change, renforcez la phrase de préservation avant les mots de style. Si la forme est correcte mais ressemble à un filtre, ajoutez cold-press paper, pigment bleed, dry-brush edges et restrained ink outlines.',
  checkHeading: 'Les styles texturés demandent plus de contraintes',
  checkBody:
    "Watercolor, oil painting, crayon, risograph, pencil et paper-cut changent la matière. Ils peuvent aussi avaler l'identité. Ajoutez une checklist avant de générer trop de variantes.",
  checkList: [
    "Identité : le visage, la forme produit, le logo ou le contour restent reconnaissables.",
    "Composition : cadrage, angle et placement restent proches de la source.",
    "Force du style : le médium est visible sans devenir une illustration générique.",
    "Arrière-plan : il soutient le style au lieu d'ajouter des objets au hasard.",
    "Production : le texte généré est supprimé ou remplacé par une zone vide.",
  ],
  modelHeading: 'Quel modèle Vogue AI choisir',
  modelHeaders: ['But', 'GPT Image 2', 'Nano Banana', 'Midjourney'],
  modelRows: [
    ['Rester proche de la source', 'Premier choix pour les edits guidés et les références.', 'Bon pour explorer vite si la fidélité stricte est moins critique.', 'À utiliser quand la découverte de style compte plus.'],
    ['Explorer plusieurs styles', 'Variantes contrôlées depuis un même squelette.', 'Variations sociales ou creator style rapides.', 'Très fort pour les mood boards de style-reference.'],
    ['Préparer un asset', 'Prioritaire pour layout, forme produit ou visage.', 'Brouillons rapides avant sélection.', 'Bon pour définir une cible de mood.'],
  ],
  failureHeading: 'Corrections des échecs',
  failureHeaders: ['Échec', 'Corriger d’abord', 'Éviter d’abord'],
  failureRows: [
    ["Dérive d'identité", 'Rendre le reference handoff explicite.', 'Ajouter plus d’adjectifs de style.'],
    ['Style trop faible', 'Ajouter linework, brushwork, paper grain, shading ou palette.', "Changer l'image source immédiatement."],
    ['Sur-stylisation', 'Baisser l’intensité et répéter same crop, same pose, same silhouette.', 'Changer toute la famille de style.'],
    ['Fond confus', 'Demander clean background, moins de props ou garder le layout.', 'Ajouter plus de mots cinematic.'],
    ['Texte ou logo cassé', 'Demander no generated text et réserver une zone propre.', 'Demander un titre final parfaitement orthographié.'],
  ],
  handoffHeading: 'Checklist Vogue AI',
  handoff: [
    "Choisir l'exemple prompt-library le plus proche avant de partir de zéro.",
    "Téléverser la source et décider son rôle : identité, forme produit, pose, layout ou palette.",
    'Copier un bloc et ne remplacer que les variables au premier essai.',
    'Sauvegarder la première version qui garde le sujet et montre clairement le style.',
    'Créer les variantes en changeant un seul contrôle : style, texture, palette, lumière ou crop.',
  ],
  revisionTitle: 'Règle de révision',
  revisionText:
    "Corrigez la fidélité avant l'esthétique. Une belle image stylisée ne sert pas si le sujet, le produit, la pose ou le layout ne correspondent plus à la source.",
  faq: [
    ['Comment changer une image vers un style précis ?', 'Téléversez l’image, dites ce qui reste fixe, nommez le style, ajoutez des contrôles, puis corrigez le plus gros échec.'],
    ['Que doit contrôler la référence ?', 'Les éléments importants : identité, forme produit, pose, layout, palette ou objets clés. Écrivez-le explicitement.'],
    ['Quels styles fonctionnent bien ?', 'Anime, watercolor, oil painting, editorial poster, cartoon, risograph, pencil sketch, cinematic illustration et fashion editorial.'],
    ['Les prompts doivent-ils rester en anglais ?', 'Pour les blocs copiables, oui. Ils restent plus faciles à réutiliser entre les modèles Vogue AI.'],
    ['Comment éviter que le sujet change ?', 'Placez les règles de préservation avant les règles de style et vérifiez la dérive d’identité au premier résultat.'],
    ['Si le résultat ressemble à un filtre ?', 'Ajoutez des détails de médium : cel shading, ink linework, paper grain, pigment bleed, brush texture ou poster grain.'],
  ],
};

const ruCopy: LocalizedCopy = {
  intro:
    'Чтобы изменить изображение в конкретный художественный стиль, загрузите исходник, сначала опишите, что должно остаться неизменным, а затем задайте новый способ рендера. Prompt должен защищать идентичность, позу, кадрирование и важные объекты, меняя фактуру, цвет и свет.',
  tldrHeading: 'TL;DR: сохраняйте объект, меняйте рендер',
  tldr: [
    'Используйте reference image, если важны идентичность, поза, форма продукта или layout.',
    'Перед стилем напишите правило сохранения: что остается, что может измениться и чего не должно быть.',
    'Называйте конкретные семьи стиля: anime, watercolor, oil painting, editorial poster, cartoon или cinematic illustration.',
    'Добавляйте материальные параметры: linework, paper grain, brushwork, cel shading, film grain, color palette и lighting.',
    'Первый результат оценивайте по сбою: identity drift, слабый стиль, over-stylization, шумный фон или сломанный текст.',
  ],
  workflowHeading: 'Процесс style transfer с reference image',
  workflowIntro:
    'Порядок важен. Если сначала назвать стиль и не защитить исходник, модель может сделать красивую картинку, которая уже не соответствует объекту.',
  workflowHeaders: ['Шаг', 'Что написать', 'Зачем'],
  workflowRows: [
    ['1. Загрузить изображение', 'Используйте исходник как subject или layout reference.', 'Он хранит идентичность, позу, угол камеры, форму продукта и композицию.'],
    ['2. Задать правила сохранения', 'Preserve [identity / pose / silhouette / layout / key objects].', 'Так стиль не заменит настоящую задачу.'],
    ['3. Назвать стиль', 'Anime, watercolor, oil painting, cartoon, editorial poster или другой.', 'Ясная семья стиля дает устойчивое направление.'],
    ['4. Добавить контроллеры', 'Линия, тени, палитра, фактура, медиум, фон и свет.', 'Конкретные параметры надежнее общих слов.'],
    ['5. Добавить правила вывода', 'Aspect ratio, no text, no watermark, same crop, clean background или safe area.', 'Так результат пригоден для дизайна и маркетинга.'],
  ],
  imagePlanHeading: 'План изображений',
  imagePlan: [
    'Обложка и первая картинка: пример Midjourney style-reference, потому что статья о контроле стиля.',
    'Раздел шаблонов: пример anime style для частого запроса на смену стиля.',
    'Раздел фактуры: watercolor poster, потому что акварель быстро показывает потерю структуры.',
    'Все изображения взяты из первой prompt-library Vogue AI, а обложка равна первой картинке в тексте.',
  ],
  templateHeading: 'Готовые prompt blocks для стилей',
  templateIntro:
    'Скопируйте блок, замените переменные в скобках и вставьте в Vogue AI на английском. Объяснение можно локализовать, но публичный prompt block должен оставаться копируемым.',
  recipeHeading: 'Матрица рецептов стиля',
  recipeHeaders: ['Целевой стиль', 'Сохранить из исходника', 'Добавить в prompt', 'Проверка первого результата'],
  recipeRows: [
    ['Anime', 'Лицо, поза, одежда и угол камеры.', 'Чистый linework, cel shading, контролируемая мимика, простой фон.', 'Проверьте, не стало ли лицо слишком общим.'],
    ['Watercolor', 'Контур объекта, горизонт, важные props и crop.', 'Paper grain, pigment bleed, мягкие края, воздушная палитра.', 'Проверьте, не растворились ли детали.'],
    ['Oil painting', 'Анатомию, форму продукта, структуру лица и композицию.', 'Brushwork, layered color, warm shadows, canvas texture.', 'Проверьте силу стиля без деформации объекта.'],
    ['Editorial poster', 'Положение объекта и negative space.', 'Bold contrast, refined grain, campaign lighting, clean text-safe area.', 'Проверьте место для настоящей типографики.'],
    ['Cartoon', 'Позу, одежду, пропорции и силуэт.', 'Простые формы, friendly expression, limited palette, clean background.', 'Проверьте, не исчезли ли узнаваемые детали.'],
  ],
  exampleHeading: 'Пример: превратить фото в watercolor',
  exampleSourceHeading: 'Цель исходника',
  exampleSourceBody:
    'Представьте product photo керамического coffee dripper на кухонной столешнице. Форма, цвет глазури и кадр должны остаться стабильными, а финал должен выглядеть как тонкая watercolor editorial illustration.',
  examplePromptHeading: 'Prompt version 1',
  examplePromptList: enCopy.examplePromptList,
  exampleDiagnosisHeading: 'Диагностика первого результата',
  exampleDiagnosisBody:
    'Если watercolor выглядит хорошо, но форма изменилась, усилите preservation sentence. Если форма верная, но результат похож на фильтр, добавьте cold-press paper, pigment bleed, dry-brush edges и restrained ink outlines.',
  checkHeading: 'Фактурные стили требуют ограничений',
  checkBody:
    'Watercolor, oil painting, crayon, risograph, pencil и paper-cut меняют материальность, но могут поглотить идентичность. Перед серией вариантов добавьте checklist.',
  checkList: [
    'Идентичность: то же лицо, форма продукта, placement логотипа или контур узнаваемы.',
    'Композиция: crop, угол камеры и placement близки к исходнику.',
    'Сила стиля: новый медиум виден, но изображение не становится generic illustration.',
    'Фон: он поддерживает стиль, а не добавляет случайные props.',
    'Production rule: generated text удален или оставлено чистое место.',
  ],
  modelHeading: 'Какой моделью Vogue AI пользоваться',
  modelHeaders: ['Цель', 'GPT Image 2', 'Nano Banana', 'Midjourney'],
  modelRows: [
    ['Близко сохранить источник', 'Лучший первый выбор для instruction following и reference-aware edits.', 'Подходит для быстрого поиска, если строгая идентичность не критична.', 'Когда важнее поиск стиля, чем точная реконструкция.'],
    ['Исследовать стили', 'Контролируемые варианты из одного skeleton.', 'Быстрые social или creator-style варианты.', 'Силен для style-reference exploration и mood boards.'],
    ['Подготовить asset', 'Когда важны layout, форма продукта или лицо.', 'Быстрые черновики перед выбором.', 'Для mood target, который потом дорабатывается.'],
  ],
  failureHeading: 'Исправления сбоев',
  failureHeaders: ['Сбой', 'Сначала исправить', 'Сначала не делать'],
  failureRows: [
    ['Identity drift', 'Явно описать reference handoff и что нельзя менять.', 'Добавлять еще adjectives.'],
    ['Стиль слабый', 'Добавить linework, brushwork, paper grain, shading или palette.', 'Сразу менять исходник.'],
    ['Over-stylization', 'Снизить интенсивность и повторить same crop, same pose, same silhouette.', 'Переходить к другой семье стиля.'],
    ['Шумный фон', 'Указать clean background, fewer props или preserve original layout.', 'Добавлять cinematic language.'],
    ['Сломанный текст или logo', 'Запросить no generated text и оставить area для дизайна.', 'Просить идеальное финальное написание.'],
  ],
  handoffHeading: 'Чеклист Vogue AI',
  handoff: [
    'Сначала выберите ближайший пример prompt-library.',
    'Загрузите источник и решите его роль: identity, product shape, pose, layout или palette.',
    'Скопируйте один block и замените только переменные для первой генерации.',
    'Сохраните первую версию, где субъект сохранен, а стиль виден.',
    'Делайте варианты, меняя по одному контролю: style family, texture, palette, lighting или crop.',
  ],
  revisionTitle: 'Правило ревизии',
  revisionText:
    'Сначала исправляйте faithful preservation, потом эстетику. Красивый style transfer бесполезен, если объект, продукт, поза или layout уже не совпадают с источником.',
  faq: [
    ['Как изменить изображение в конкретный стиль?', 'Загрузите изображение, задайте неизменные части, назовите стиль, добавьте контроллеры и исправьте самый большой сбой.'],
    ['Что должна контролировать reference image?', 'Важные части задачи: identity, product shape, pose, layout, palette или key objects. Напишите это прямо.'],
    ['Какие стили хорошо работают?', 'Anime, watercolor, oil painting, editorial poster, cartoon, risograph, pencil sketch, cinematic illustration и fashion editorial.'],
    ['Нужно ли оставлять prompts на английском?', 'Для публичных copyable blocks лучше да. Так они легче переиспользуются между моделями Vogue AI.'],
    ['Как остановить изменение объекта?', 'Поставьте preservation rules перед style rules и проверьте identity drift до добавления новых style words.'],
    ['Если результат похож на фильтр?', 'Добавьте конкретный медиум: cel shading, ink linework, paper grain, pigment bleed, brush texture или poster grain.'],
  ],
};

const ptCopy: LocalizedCopy = {
  intro:
    'Para mudar uma imagem para um estilo artístico específico, envie a imagem original, diga o que deve permanecer fixo e só então descreva o novo render com controles visuais concretos. O prompt precisa preservar identidade, pose, recorte e objetos importantes enquanto muda textura, cor e luz.',
  tldrHeading: 'TL;DR: preserve o sujeito, mude o render',
  tldr: [
    'Use uma imagem de referência quando identidade, pose, forma do produto ou layout precisam sobreviver.',
    'Antes dos termos de estilo, escreva o que fica fixo, o que pode mudar e o que não deve aparecer.',
    'Use famílias claras: anime, watercolor, oil painting, editorial poster, cartoon ou cinematic illustration.',
    'Adicione controles de material: linework, paper grain, brushwork, cel shading, film grain, color palette e lighting.',
    'Avalie o primeiro resultado por falha: identity drift, estilo fraco, excesso de estilo, fundo confuso ou texto quebrado.',
  ],
  workflowHeading: 'Fluxo de referência para transferência de estilo',
  workflowIntro:
    'A ordem importa. Se você nomear o estilo antes de proteger a fonte, o modelo pode criar uma imagem bonita que já não corresponde ao sujeito original.',
  workflowHeaders: ['Etapa', 'O que escrever', 'Por que importa'],
  workflowRows: [
    ['1. Enviar a imagem', 'Use a fonte como referência de sujeito ou layout.', 'Ela carrega identidade, pose, ângulo, forma do produto e composição.'],
    ['2. Declarar preservação', 'Preserve [identity / pose / silhouette / layout / key objects].', 'Impede que o estilo substitua a tarefa real.'],
    ['3. Nomear o estilo', 'Anime, watercolor, oil painting, cartoon, editorial poster ou outro.', 'Uma família clara estabiliza a direção visual.'],
    ['4. Adicionar controles', 'Linha, sombra, paleta, textura, meio, fundo e luz.', 'Controles concretos vencem palavras vagas.'],
    ['5. Adicionar regras de saída', 'Aspect ratio, no text, no watermark, same crop, clean background ou safe area.', 'O resultado fica pronto para uso real.'],
  ],
  imagePlanHeading: 'Plano de imagens',
  imagePlan: [
    'Capa e primeira imagem: exemplo Midjourney style-reference, porque o artigo é sobre controle de estilo.',
    'Seção de templates: exemplo anime, por ser uma solicitação comum.',
    'Seção de textura: poster watercolor, porque mostra o risco de perder estrutura.',
    'Todas as imagens vêm da prompt-library da Vogue AI, e a capa é igual à primeira imagem do corpo.',
  ],
  templateHeading: 'Prompts copiáveis por estilo',
  templateIntro:
    'Copie um bloco, troque as variáveis entre colchetes e mantenha o prompt em inglês ao usar no Vogue AI. A explicação pode ser localizada, mas o bloco público precisa ser copiável.',
  recipeHeading: 'Matriz de receitas de estilo',
  recipeHeaders: ['Estilo alvo', 'Preservar da fonte', 'Adicionar ao prompt', 'Checagem inicial'],
  recipeRows: [
    ['Anime', 'Identidade do rosto, pose, roupa e ângulo.', 'Linework limpo, cel shading, expressões controladas, fundo simples.', 'Checar se o rosto ficou genérico ou a pose mudou.'],
    ['Watercolor', 'Contorno, horizonte, objetos importantes e recorte.', 'Paper grain, pigment bleed, bordas suaves, paleta leve.', 'Checar se os detalhes desapareceram.'],
    ['Oil painting', 'Anatomia, forma do produto, rosto e composição.', 'Brushwork, layered color, warm shadows, canvas texture.', 'Checar estilo forte sem distorção.'],
    ['Editorial poster', 'Posição do sujeito e espaço negativo.', 'Bold contrast, refined grain, campaign lighting, text-safe area.', 'Checar espaço para tipografia real.'],
    ['Cartoon', 'Pose, roupa, proporções e silhueta.', 'Formas simples, expressão amigável, paleta limitada, fundo limpo.', 'Checar se a simplificação manteve reconhecimento.'],
  ],
  exampleHeading: 'Exemplo: transformar uma foto em watercolor',
  exampleSourceHeading: 'Meta da imagem fonte',
  exampleSourceBody:
    'Imagine uma foto de produto de um coador de café de cerâmica sobre uma bancada. Forma, cor do esmalte e recorte precisam ficar estáveis, mas o resultado deve parecer uma ilustração editorial watercolor.',
  examplePromptHeading: 'Prompt version 1',
  examplePromptList: enCopy.examplePromptList,
  exampleDiagnosisHeading: 'Diagnóstico do primeiro resultado',
  exampleDiagnosisBody:
    'Se o watercolor está bom mas a forma mudou, fortaleça a frase de preservação antes de adicionar estilo. Se a forma está certa mas parece filtro, adicione cold-press paper, pigment bleed, dry-brush edges e restrained ink outlines.',
  checkHeading: 'Estilos com textura precisam de restrições',
  checkBody:
    'Watercolor, oil painting, crayon, risograph, pencil e paper-cut mudam a materialidade, mas podem engolir a identidade. Adicione uma checklist antes de criar variações demais.',
  checkList: [
    'Identidade: o mesmo rosto, forma de produto, posição de logo ou contorno seguem reconhecíveis.',
    'Composição: recorte, ângulo e posição seguem próximos da fonte.',
    'Força do estilo: o novo meio aparece sem virar ilustração genérica.',
    'Fundo: o fundo apoia o estilo sem adicionar props aleatórios.',
    'Produção: texto gerado é removido ou reservado como área vazia.',
  ],
  modelHeading: 'Qual modelo Vogue AI usar',
  modelHeaders: ['Objetivo', 'GPT Image 2', 'Nano Banana', 'Midjourney'],
  modelRows: [
    ['Preservar a fonte', 'Melhor primeira escolha para edits com referência.', 'Bom para exploração rápida quando identidade exata importa menos.', 'Use quando descoberta de estilo é prioridade.'],
    ['Explorar estilos', 'Variações controladas a partir do mesmo skeleton.', 'Bom para variações sociais rápidas.', 'Forte para style-reference e mood boards.'],
    ['Preparar asset', 'Prioridade para layout, forma de produto ou face fidelity.', 'Rascunhos rápidos antes da seleção.', 'Bom para definir um mood target.'],
  ],
  failureHeading: 'Correções de falha',
  failureHeaders: ['Falha', 'Corrigir primeiro', 'Evitar primeiro'],
  failureRows: [
    ['Identity drift', 'Explicitar o reference handoff e o que não muda.', 'Adicionar mais adjetivos de estilo.'],
    ['Estilo fraco', 'Adicionar linework, brushwork, paper grain, shading ou palette.', 'Trocar a imagem fonte imediatamente.'],
    ['Excesso de estilo', 'Reduzir intensidade e repetir same crop, same pose, same silhouette.', 'Mudar toda a família de estilo.'],
    ['Fundo confuso', 'Pedir clean background, fewer props ou preservar o layout.', 'Adicionar mais linguagem cinematic.'],
    ['Texto ou logo quebrado', 'Pedir no generated text e deixar área limpa.', 'Pedir título final perfeito no render.'],
  ],
  handoffHeading: 'Checklist no Vogue AI',
  handoff: [
    'Escolha o exemplo mais próximo da prompt-library antes de escrever do zero.',
    'Envie a fonte e defina seu papel: identity, product shape, pose, layout ou palette.',
    'Copie um bloco e substitua só as variáveis na primeira geração.',
    'Salve a primeira versão que preserva o sujeito e mostra o estilo.',
    'Crie variações mudando um controle por vez: style family, texture, palette, lighting ou crop.',
  ],
  revisionTitle: 'Regra de revisão',
  revisionText:
    'Corrija fidelidade antes de estética. Uma transferência bonita não serve se pessoa, produto, pose ou layout já não correspondem à fonte.',
  faq: [
    ['Como mudar uma imagem para um estilo específico?', 'Envie a imagem, diga o que deve ficar fixo, nomeie o estilo, adicione controles e corrija a maior falha primeiro.'],
    ['O que a referência deve controlar?', 'As partes importantes: identity, product shape, pose, layout, palette ou key objects. Escreva isso diretamente.'],
    ['Quais estilos funcionam bem?', 'Anime, watercolor, oil painting, editorial poster, cartoon, risograph, pencil sketch, cinematic illustration e fashion editorial.'],
    ['Os prompts devem ficar em inglês?', 'Para blocos copiáveis, sim. Eles ficam mais fáceis de reutilizar entre os modelos Vogue AI.'],
    ['Como evitar que o sujeito mude?', 'Coloque regras de preservação antes das regras de estilo e verifique identity drift no primeiro resultado.'],
    ['E se parecer apenas um filtro?', 'Adicione detalhes do meio: cel shading, ink linework, paper grain, pigment bleed, brush texture ou poster grain.'],
  ],
};

const jaCopy: LocalizedCopy = {
  intro:
    '画像を特定のアートスタイルに変えるには、元画像をアップロードし、まず何を固定するかを書き、その後で新しい描画スタイルを具体的に指定します。prompt は identity、pose、crop、重要な object を守りつつ、texture、color、lighting を変える必要があります。',
  tldrHeading: '要点：subject を保ち、rendering を変える',
  tldr: [
    'identity、pose、product shape、layout を残したい時は reference image から始めます。',
    'style words の前に preservation sentence を書きます。何を固定し、何を変えてよく、何を出さないかを明確にします。',
    'anime、watercolor、oil painting、editorial poster、cartoon、cinematic illustration のように style family を指定します。',
    'linework、paper grain、brushwork、cel shading、film grain、color palette、lighting など material controls を入れます。',
    '最初の結果は identity drift、弱い style、over-stylization、messy background、broken generated text で診断します。',
  ],
  workflowHeading: 'Reference image から style transfer する流れ',
  workflowIntro:
    '順番が重要です。style を先に書いて source を保護しないと、きれいでも元の subject と違う画像になりやすくなります。',
  workflowHeaders: ['Step', '書く内容', '理由'],
  workflowRows: [
    ['1. 画像をアップロード', '元画像を subject または layout reference として使う。', 'identity、pose、camera angle、product shape、composition を持っているため。'],
    ['2. Preserve rule を書く', 'Preserve [identity / pose / silhouette / layout / key objects].', 'style が本来の仕事を置き換えるのを防ぎます。'],
    ['3. Style を命名', 'Anime、watercolor、oil painting、cartoon、editorial poster など。', '明確な style family が方向性を安定させます。'],
    ['4. Style controls を追加', 'Linework、shading、palette、texture、medium、background、lighting。', '抽象語より具体的な制約が効きます。'],
    ['5. Output rules を追加', 'Aspect ratio、no text、no watermark、same crop、clean background、safe area。', '実際の制作で使える結果にします。'],
  ],
  imagePlanHeading: 'この記事の画像設計',
  imagePlan: [
    'Cover と最初の本文画像：style controls を示す Midjourney style-reference example。',
    'Template section：anime style example。高頻度の style transfer request に対応します。',
    'Texture section：watercolor poster example。subject structure が失われるリスクを説明しやすいためです。',
    'すべて Vogue AI の first-party prompt-library assets で、cover は最初の本文画像と同じです。',
  ],
  templateHeading: 'よく使う style 用 copyable prompts',
  templateIntro:
    '1 つの block をコピーし、角括弧の変数だけ置き換えて Vogue AI に貼ります。説明文はローカライズしても、public prompt block は英語のままにします。',
  recipeHeading: 'Style recipe matrix',
  recipeHeaders: ['Target style', 'Source から保つもの', 'Prompt に足すもの', 'First result check'],
  recipeRows: [
    ['Anime', 'Face identity、pose、outfit、camera angle。', 'Clean linework、cel shading、controlled expressions、simple background。', '顔が generic になったか、pose が変わったか。'],
    ['Watercolor', 'Subject outline、horizon line、important props、crop。', 'Paper grain、pigment bleed、soft edges、airy palette。', 'Details が溶けたか、contrast が弱いか。'],
    ['Oil painting', 'Anatomy、product shape、face structure、composition。', 'Brushwork、layered color、warm shadows、canvas texture。', 'Style が強くても subject が歪んでいないか。'],
    ['Editorial poster', 'Subject placement と negative space。', 'Bold contrast、refined grain、campaign lighting、text-safe area。', '実際の typography の余白があるか。'],
    ['Cartoon', 'Pose、outfit、proportions、main silhouette。', 'Simple shapes、friendly expression、limited palette、clean background。', '単純化で認識要素が消えていないか。'],
  ],
  exampleHeading: 'Worked example：写真を watercolor にする',
  exampleSourceHeading: 'Source image goal',
  exampleSourceBody:
    'アップロード画像は kitchen counter 上の handmade ceramic coffee dripper の product photo だとします。shape、glaze color、camera crop は固定し、仕上がりは delicate watercolor editorial illustration にします。',
  examplePromptHeading: 'Prompt version 1',
  examplePromptList: enCopy.examplePromptList,
  exampleDiagnosisHeading: 'First-result diagnosis',
  exampleDiagnosisBody:
    'Watercolor look は良いのに dripper shape が変わる場合は、style words を足す前に preservation sentence を強めます。Shape が正しいのに filter 感がある場合は cold-press paper、pigment bleed、dry-brush edges、restrained ink outlines を追加します。',
  checkHeading: 'Texture-heavy styles は追加制約が必要',
  checkBody:
    'Watercolor、oil painting、crayon、risograph、pencil、paper-cut は material texture を変えるのが得意ですが、identity を飲み込むことがあります。多くの variations を出す前に checklist を入れます。',
  checkList: [
    'Identity：同じ face、product shape、logo placement、object outline が認識できる。',
    'Composition：crop、camera angle、subject placement が source に近い。',
    'Style strength：new medium が見えるが generic illustration になっていない。',
    'Background：random props ではなく style を支えている。',
    'Production rule：generated text を消すか、後で design する空白を残す。',
  ],
  modelHeading: 'Vogue AI で使う model',
  modelHeaders: ['Goal', 'GPT Image 2', 'Nano Banana', 'Midjourney'],
  modelRows: [
    ['Source を近く保つ', 'Instruction following と reference-aware edits の第一候補。', 'Exact identity がそこまで厳しくない時の高速探索。', 'Close reconstruction より style discovery が重要な時。'],
    ['Style directions を探索', '同じ skeleton から controlled variants を作る。', 'Social や creator-style variations を高速に作る。', 'Style-reference exploration と mood boards に強い。'],
    ['Production asset を作る', 'Layout、product shape、face fidelity が重要な時。', 'Final selection 前の quick drafts。', 'Mood target を作ってから refine する時。'],
  ],
  failureHeading: 'Failure fixes',
  failureHeaders: ['Failure', 'Fix first', 'Avoid first'],
  failureRows: [
    ['Identity drift', 'Reference handoff を明確にし、変えてはいけないものを書く。', 'Style adjectives を増やす。'],
    ['Style が弱い', 'Linework、brushwork、paper grain、shading、palette を追加。', 'Source image をすぐ変える。'],
    ['Over-stylization', 'Style intensity を下げ、same crop、same pose、same silhouette を再指定。', 'Style family を丸ごと変える。'],
    ['Messy background', 'Clean background、fewer props、preserve original layout を指定。', 'Cinematic words を増やす。'],
    ['Broken text/logo', 'No generated text と clean area を指定。', 'Final headline の完全な spelling を頼む。'],
  ],
  handoffHeading: 'Vogue AI handoff checklist',
  handoff: [
    'ゼロから書く前に一番近い prompt-library example を選びます。',
    'Source image を upload し、その役割を identity、product shape、pose、layout、palette から決めます。',
    '最初の generation では 1 つの block をコピーし、変数だけ置き換えます。',
    'Subject を保ちつつ target style が明確な最初の version を保存します。',
    'Variants は style family、texture、palette、lighting、crop のうち 1 つだけ変えて作ります。',
  ],
  revisionTitle: 'Revision rule',
  revisionText:
    'Aesthetics より preservation を先に直します。Person、product、pose、layout が source と違えば、美しい style transfer でも使えません。',
  faq: [
    ['画像を特定の art style に変えるには？', '画像を upload し、固定する部分を書き、target style と controls を追加し、最初の大きな failure を直します。'],
    ['Reference image は何を制御するべき？', 'Identity、product shape、pose、layout、palette、key objects など、仕事で重要な部分です。Prompt に直接書きます。'],
    ['使いやすい styles は？', 'Anime、watercolor、oil painting、editorial poster、cartoon、risograph、pencil sketch、cinematic illustration、fashion editorial です。'],
    ['Prompt blocks は英語のまま？', 'Copyable blocks は英語が適しています。Vogue AI models 間で再利用しやすいからです。'],
    ['Subject の変化を止めるには？', 'Preservation rules を style rules より前に置き、identity drift を確認してから style language を足します。'],
    ['単なる filter に見える時は？', 'Cel shading、ink linework、paper grain、pigment bleed、brush texture、poster grain など medium details を足します。'],
  ],
};

const koCopy: LocalizedCopy = {
  intro:
    '이미지를 특정 art style로 바꾸려면 원본 이미지를 업로드하고, 먼저 무엇을 고정할지 적은 뒤 새 rendering 방식을 구체적으로 지정해야 합니다. prompt는 identity, pose, crop, key objects를 보존하면서 texture, color, lighting을 바꿔야 합니다.',
  tldrHeading: '요약: subject는 보존하고 rendering만 바꾸기',
  tldr: [
    'identity, pose, product shape, layout을 유지해야 하면 reference image로 시작합니다.',
    'style words 앞에 preservation sentence를 씁니다. 무엇이 고정되고, 무엇이 바뀌며, 무엇이 나오면 안 되는지 적습니다.',
    'anime, watercolor, oil painting, editorial poster, cartoon, cinematic illustration처럼 명확한 style family를 사용합니다.',
    'linework, paper grain, brushwork, cel shading, film grain, color palette, lighting 같은 material controls를 추가합니다.',
    '첫 결과는 identity drift, 약한 style, over-stylization, messy background, broken generated text로 진단합니다.',
  ],
  workflowHeading: 'Reference image 기반 style transfer 흐름',
  workflowIntro:
    '순서가 중요합니다. source를 보호하기 전에 style을 먼저 쓰면, 예쁘지만 원본 subject와 맞지 않는 결과가 나올 수 있습니다.',
  workflowHeaders: ['Step', '무엇을 쓸까', '이유'],
  workflowRows: [
    ['1. 이미지 업로드', '원본을 subject 또는 layout reference로 사용.', 'identity, pose, camera angle, product shape, composition을 담고 있기 때문입니다.'],
    ['2. 보존 규칙 선언', 'Preserve [identity / pose / silhouette / layout / key objects].', 'style이 실제 작업을 대체하지 않게 합니다.'],
    ['3. Style 이름 지정', 'Anime, watercolor, oil painting, cartoon, editorial poster 등.', '명확한 style family가 방향을 안정화합니다.'],
    ['4. Style controls 추가', 'Linework, shading, palette, texture, medium, background, lighting.', '구체적인 제약이 추상적인 단어보다 안정적입니다.'],
    ['5. Output rules 추가', 'Aspect ratio, no text, no watermark, same crop, clean background, safe area.', '실제 디자인/마케팅 작업에 쓸 수 있게 합니다.'],
  ],
  imagePlanHeading: '이미지 사용 계획',
  imagePlan: [
    'Cover와 첫 본문 이미지: style controls를 보여주는 Midjourney style-reference example.',
    'Template section: anime style example. 자주 묻는 style transfer 요청입니다.',
    'Texture section: watercolor poster example. subject structure가 사라지는 위험을 설명하기 좋습니다.',
    '모든 이미지는 Vogue AI first-party prompt-library assets이며 cover는 첫 본문 이미지와 같습니다.',
  ],
  templateHeading: '자주 쓰는 style용 copyable prompts',
  templateIntro:
    '한 block을 복사하고 대괄호 변수만 바꾼 뒤 Vogue AI에 영어로 붙여 넣으세요. 설명은 현지화해도 public prompt block은 복사 가능해야 합니다.',
  recipeHeading: 'Style recipe matrix',
  recipeHeaders: ['Target style', 'Source에서 보존', 'Prompt에 추가', 'First result check'],
  recipeRows: [
    ['Anime', 'Face identity, pose, outfit, camera angle.', 'Clean linework, cel shading, controlled expressions, simple background.', '얼굴이 generic해졌는지, pose가 변했는지 확인.'],
    ['Watercolor', 'Subject outline, horizon line, important props, crop.', 'Paper grain, pigment bleed, soft edges, airy palette.', 'Details가 사라졌거나 contrast가 약한지 확인.'],
    ['Oil painting', 'Anatomy, product shape, face structure, composition.', 'Brushwork, layered color, warm shadows, canvas texture.', 'Style은 강하지만 subject가 왜곡되지 않았는지 확인.'],
    ['Editorial poster', 'Subject placement와 negative space.', 'Bold contrast, refined grain, campaign lighting, text-safe area.', '실제 typography를 넣을 공간이 있는지 확인.'],
    ['Cartoon', 'Pose, outfit, proportions, main silhouette.', 'Simple shapes, friendly expression, limited palette, clean background.', '단순화 후에도 인식 요소가 남았는지 확인.'],
  ],
  exampleHeading: 'Worked example: 사진을 watercolor로 바꾸기',
  exampleSourceHeading: 'Source image goal',
  exampleSourceBody:
    '업로드한 이미지는 주방 카운터 위 handmade ceramic coffee dripper의 product photo라고 가정합니다. shape, glaze color, camera crop은 유지하고 결과는 delicate watercolor editorial illustration처럼 보여야 합니다.',
  examplePromptHeading: 'Prompt version 1',
  examplePromptList: enCopy.examplePromptList,
  exampleDiagnosisHeading: 'First-result diagnosis',
  exampleDiagnosisBody:
    'Watercolor look은 좋지만 dripper shape가 바뀌면 style words를 더하기 전에 preservation sentence를 강화하세요. Shape는 맞지만 filter처럼 보이면 cold-press paper, pigment bleed, dry-brush edges, restrained ink outlines를 추가합니다.',
  checkHeading: 'Texture-heavy styles에는 추가 제약이 필요',
  checkBody:
    'Watercolor, oil painting, crayon, risograph, pencil, paper-cut은 material texture를 바꾸는 데 좋지만 identity를 삼킬 수 있습니다. 여러 variations 전에 checklist를 넣으세요.',
  checkList: [
    'Identity: 같은 face, product shape, logo placement, object outline이 알아볼 수 있어야 합니다.',
    'Composition: crop, camera angle, subject placement가 source와 가까워야 합니다.',
    'Style strength: new medium이 보이지만 generic illustration이 되면 안 됩니다.',
    'Background: random props가 아니라 style을 도와야 합니다.',
    'Production rule: generated text는 제거하거나 디자인용 빈 영역으로 남깁니다.',
  ],
  modelHeading: 'Vogue AI에서 어떤 model을 쓸까',
  modelHeaders: ['Goal', 'GPT Image 2', 'Nano Banana', 'Midjourney'],
  modelRows: [
    ['Source를 가깝게 보존', 'Instruction following과 reference-aware edits의 첫 선택.', '정확한 identity가 덜 중요할 때 빠른 exploration.', 'Close reconstruction보다 style discovery가 중요할 때.'],
    ['여러 style direction 탐색', '같은 skeleton에서 controlled variants 생성.', '빠른 social 또는 creator-style variations.', 'Style-reference exploration과 mood boards에 강함.'],
    ['Production asset 준비', 'Layout, product shape, face fidelity가 중요할 때.', '최종 선택 전 quick drafts.', 'Mood target을 잡은 뒤 refine할 때.'],
  ],
  failureHeading: 'Failure fixes',
  failureHeaders: ['Failure', 'Fix first', 'Avoid first'],
  failureRows: [
    ['Identity drift', 'Reference handoff를 명확히 하고 바뀌면 안 되는 것을 적기.', 'Style adjectives를 더 쌓기.'],
    ['Style이 약함', 'Linework, brushwork, paper grain, shading, palette 추가.', 'Source image를 바로 바꾸기.'],
    ['Over-stylization', 'Style intensity를 낮추고 same crop, same pose, same silhouette 재지정.', '완전히 다른 style family로 변경.'],
    ['Messy background', 'Clean background, fewer props, preserve original layout 지정.', 'Cinematic language 추가.'],
    ['Broken text/logo', 'No generated text와 clean area 지정.', '최종 headline spelling을 모델에 맡기기.'],
  ],
  handoffHeading: 'Vogue AI handoff checklist',
  handoff: [
    '처음부터 쓰기 전에 가장 가까운 prompt-library example을 고릅니다.',
    'Source image를 업로드하고 역할을 identity, product shape, pose, layout, palette 중에서 정합니다.',
    '첫 generation에서는 한 block을 복사하고 변수만 바꿉니다.',
    'Subject를 보존하면서 target style이 잘 보이는 첫 version을 저장합니다.',
    'Variants는 style family, texture, palette, lighting, crop 중 하나만 바꿔 만듭니다.',
  ],
  revisionTitle: 'Revision rule',
  revisionText:
    'Aesthetics보다 preservation을 먼저 고칩니다. 사람, 제품, pose, layout이 source와 다르면 아름다운 style transfer도 쓸 수 없습니다.',
  faq: [
    ['이미지를 특정 art style로 바꾸려면?', '이미지를 업로드하고 고정할 부분을 적은 뒤 target style과 controls를 추가하고 가장 큰 failure부터 수정합니다.'],
    ['Reference image는 무엇을 제어해야 하나요?', 'Identity, product shape, pose, layout, palette, key objects처럼 작업에 중요한 부분입니다. Prompt에 직접 적으세요.'],
    ['어떤 styles가 잘 맞나요?', 'Anime, watercolor, oil painting, editorial poster, cartoon, risograph, pencil sketch, cinematic illustration, fashion editorial입니다.'],
    ['Prompt blocks는 영어여야 하나요?', 'Copyable blocks는 영어가 좋습니다. Vogue AI models 사이에서 재사용하기 쉽습니다.'],
    ['Subject가 바뀌지 않게 하려면?', 'Preservation rules를 style rules 앞에 두고 첫 결과에서 identity drift를 확인한 뒤 style language를 추가합니다.'],
    ['결과가 단순 filter처럼 보이면?', 'Cel shading, ink linework, paper grain, pigment bleed, brush texture, poster grain 같은 medium details를 추가하세요.'],
  ],
};

export const changeImageToSpecificArtStyleAutoBlogPost: BlogPostSource = {
  slug: 'change-image-to-specific-art-style',
  date: '2026-06-02',
  updatedAt: '2026-06-02',
  author: 'Vogue AI Team',
  image: styleTransferImages.styleReference,
  imageAlt: 'Style-reference prompt example for changing an image into a specific art style',
  articleType: 'tutorial',
  modelTags: ['vogue-ai', 'gpt-image-2', 'nano-banana', 'midjourney'],
  readingMinutes: 11,
  localizations: {
    en: {
      title: 'Change an image to a specific art style without losing the subject',
      summary:
        'A practical Vogue AI workflow for turning a reference image into anime, watercolor, oil painting, editorial poster, cartoon, and other controlled art styles.',
      seoTitle: 'Change Image to Specific Art Style With Vogue AI',
      seoDescription:
        'Learn how to change an image to a specific art style with reference-image prompts, preservation rules, model choice, and failure fixes in Vogue AI.',
      content: createContent(enCopy),
    },
    zh: {
      title: '把图片改成指定艺术风格，同时保住主体',
      summary:
        '一套 Vogue AI 实操流程，用参考图把图片稳定改成 anime、水彩、油画、编辑海报、cartoon 等风格。',
      seoTitle: '用 Vogue AI 把图片改成指定艺术风格',
      seoDescription:
        '学习如何用参考图提示词、保留规则、模型选择和失败修复，把图片改成指定艺术风格。',
      content: createContent(zhCopy),
    },
    fr: {
      title: "Changer une image vers un style artistique sans perdre le sujet",
      summary:
        "Un flux Vogue AI pour transformer une image de référence en anime, watercolor, oil painting, poster éditorial, cartoon et autres styles contrôlés.",
      seoTitle: "Changer une image vers un style artistique avec Vogue AI",
      seoDescription:
        "Apprenez à changer une image vers un style précis avec prompts de référence, règles de préservation, choix du modèle et corrections.",
      content: createContent(frCopy),
    },
    ru: {
      title: 'Изменить изображение в конкретный стиль без потери объекта',
      summary:
        'Практический процесс Vogue AI для превращения reference image в anime, watercolor, oil painting, editorial poster, cartoon и другие контролируемые стили.',
      seoTitle: 'Как изменить изображение в художественный стиль',
      seoDescription:
        'Узнайте, как менять изображение в конкретный стиль через reference prompts, правила сохранения, выбор модели и исправления.',
      content: createContent(ruCopy),
    },
    pt: {
      title: 'Mudar uma imagem para um estilo artístico sem perder o sujeito',
      summary:
        'Um fluxo prático do Vogue AI para transformar uma referência em anime, watercolor, oil painting, editorial poster, cartoon e estilos controlados.',
      seoTitle: 'Como Mudar Imagem para Estilo Artístico',
      seoDescription:
        'Aprenda a mudar uma imagem para um estilo específico com prompts de referência, regras de preservação, escolha de modelo e correções.',
      content: createContent(ptCopy),
    },
    ja: {
      title: '画像を特定のアートスタイルに変えても subject を失わない方法',
      summary:
        'Reference image を anime、watercolor、oil painting、editorial poster、cartoon などに変える Vogue AI の実践手順です。',
      seoTitle: '画像を特定のアートスタイルに変える方法',
      seoDescription:
        'Reference prompts、preservation rules、model choice、failure fixes を使って、画像を指定スタイルへ変換します。',
      content: createContent(jaCopy),
    },
    ko: {
      title: '이미지를 특정 아트 스타일로 바꿔도 subject를 잃지 않는 방법',
      summary:
        'Reference image를 anime, watercolor, oil painting, editorial poster, cartoon 등으로 안정적으로 바꾸는 Vogue AI 실전 흐름입니다.',
      seoTitle: '이미지를 특정 아트 스타일로 바꾸는 방법',
      seoDescription:
        'Reference prompts, preservation rules, model choice, failure fixes로 이미지를 원하는 스타일로 바꾸는 방법입니다.',
      content: createContent(koCopy),
    },
  },
};
