import type { BlogContentBlock, BlogPostSource } from '@/lib/blog-data';

const promptLibraryImages = {
  hero:
    'https://media.vogueai.net/prompt-libraries/awesome-gptimage2-prompts/vogueai-20260615-east-asian-lantern-festival-storyboard-workflow-ai-prompt/east-asian-lantern-festival-storyboard-workflow-ai-prompt-ai-image-prompt-x2065167193348641159-v1-schema-01.png',
  identity:
    'https://media.vogueai.net/blog/auto/how-to-create-consistent-ai-images/61a63d78ca44-create-dark-moody-photorealistic-portrait-young-man-1.jpg',
  style:
    'https://media.vogueai.net/prompt-libraries/awesome-ai-prompts/midjourney/x-2057589390797685231/lloydcreates-fashion-editorial-supermodel-absurdres-light-shadow-1.jpg',
} as const;

const promptBlocks = [
  'Reference-led character: Use the uploaded reference as the identity anchor for [character]. Preserve face shape, hairstyle, age range, body proportions, and signature wardrobe color. Create a new [scene] with [lighting], [camera angle], and [aspect ratio]. Keep identity consistent, no extra people, no text, no watermark.',
  'Consistent product set: Use the uploaded product reference to preserve silhouette, material, color, label placement, and scale. Generate a [channel] image on a [background] with [lighting], [camera angle], and [composition]. Do not redesign the product, no fake logo text, no watermark.',
  'Series style system: Create image [number] in the same visual system as the previous frame: [palette], [lens], [lighting], [texture], [background language], and [render style]. Change only [variable]. Keep subject identity, framing rhythm, and atmosphere consistent.',
  'Revision prompt: Keep the previous image direction. Fix only [failure]: [specific correction]. Preserve subject identity, camera distance, palette, background, and aspect ratio. Do not introduce new props, people, logos, or text.',
] as const;

const enContent: BlogContentBlock[] = [
  { type: 'paragraph', text: 'To create consistent AI images, treat every generation as part of a small production system: one reference anchor, one reusable prompt skeleton, one style sheet, and one revision rule. Consistency usually fails when you keep rewriting the prompt instead of protecting the variables that must stay fixed.' },
  { type: 'heading', level: 2, text: 'TL;DR: the repeatable workflow' },
  { type: 'list', items: ['Use a reference image whenever identity, product shape, face, wardrobe, logo placement, or UI layout matters.', 'Separate fixed controls from variables: identity, style, camera, palette, aspect ratio, background, and changeable scene detail.', 'Generate a first image, diagnose the biggest drift, then revise only that control instead of rewriting the full prompt.', 'Save the solved prompt as a named recipe, then duplicate it for the next image in the series.', 'Inside Vogue AI, choose GPT Image 2 for controlled instruction following, Nano Banana for quick reference-led variations, and Midjourney for stylized mood exploration.'] },
  { type: 'heading', level: 2, text: 'Who this is for' },
  { type: 'paragraph', text: 'This workflow is for creators, marketers, founders, and designers who need a character, product, campaign, or visual style to survive across multiple images. It is not a guarantee of pixel-perfect continuity; it is a practical way to reduce drift while keeping enough flexibility to build a usable series.' },
  { type: 'heading', level: 2, text: 'Image plan for this guide' },
  { type: 'table', headers: ['Role', 'Source', 'Why it fits'], rows: [['Hero', 'GPT Image 2 storyboard workflow prompt-library image', 'A multi-frame lantern festival storyboard is the clearest visual metaphor for consistency across a series, so it belongs in frontmatter only.'], ['Identity section', 'Nano Banana dark portrait example', 'A portrait reference is the right nearby image for character consistency and identity drift.'], ['Style section', 'Midjourney fashion editorial example', 'A fashion editorial frame shows how palette, lighting, lens, and mood can stay stable even when the subject changes.']] },
  { type: 'heading', level: 2, text: 'Consistency is four controls, not one magic prompt' },
  { type: 'table', headers: ['Control', 'What stays fixed', 'What can change', 'Common failure'], rows: [['Identity', 'Face, product shape, wardrobe anchor, brand marks, UI hierarchy.', 'Pose, scene, crop, expression, background.', 'The model invents a new person or redesigns the product.'], ['Composition', 'Aspect ratio, camera distance, focal point, negative space.', 'Scene detail, props, channel format.', 'Every image feels like a different campaign.'], ['Style', 'Palette, lighting, lens, texture, realism level.', 'Subject action, seasonal theme, environment.', 'The series jumps from cinematic to cartoon to studio photo.'], ['Revision rule', 'The solved prompt skeleton and reference handoff.', 'One failure at a time.', 'Fixing one problem creates three new problems.']] },
  { type: 'heading', level: 2, text: 'Step 1: choose the anchor before writing the prompt' },
  { type: 'paragraph', text: 'If the image must look like the same person, object, package, interface, or campaign, start with an anchor. In Vogue AI, that usually means uploading or selecting a reference image and writing exactly what the reference controls. Do not ask the model to infer which parts are sacred.' },
  { type: 'image', src: promptLibraryImages.identity, alt: 'Nano Banana portrait example for consistent character identity', caption: 'Use a portrait example near identity instructions because the hardest consistency problem is often preserving a recognizable face while changing scene, lighting, or wardrobe.' },
  { type: 'list', items: ['For a character, anchor face shape, age range, hairstyle, body proportions, and one wardrobe signature.', 'For a product, anchor silhouette, color, material, label placement, and scale.', 'For a brand series, anchor palette, lighting, negative space, typography-safe area, and art direction.', 'For a UI or app screen, anchor hierarchy, device framing, and which elements must remain recognizable.'] },
  { type: 'heading', level: 2, text: 'Step 2: write a prompt skeleton with fixed and variable fields' },
  { type: 'paragraph', text: 'A consistent prompt should be boring in the right places. Keep the identity, camera, palette, and output rules stable. Change only the scene variable, product context, pose, or channel requirement.' },
  { type: 'list', items: [...promptBlocks] },
  { type: 'heading', level: 2, text: 'Step 3: build a style sheet for the series' },
  { type: 'paragraph', text: 'A style sheet is a short list of repeatable visual decisions. It is more useful than a long paragraph because you can paste the same controls into every image and see what changed.' },
  { type: 'image', src: promptLibraryImages.style, alt: 'Midjourney fashion editorial example for consistent style', caption: 'This example is useful for style consistency: the lesson is the stable lighting, shadow language, editorial crop, and fashion mood, not copying the exact subject.' },
  { type: 'table', headers: ['Style sheet field', 'Example value', 'Why it matters'], rows: [['Palette', 'Black, bone white, muted gold, one red accent.', 'Prevents each image from inventing a new color system.'], ['Lighting', 'Soft key light, deep side shadow, subtle rim light.', 'Keeps mood consistent across scenes.'], ['Lens and crop', 'Portrait 85mm feel, chest-up crop, 3:4 ratio.', 'Makes the series feel like one shoot.'], ['Background', 'Minimal studio wall, faint texture, no text.', 'Removes noisy one-off details.'], ['Output rule', 'No watermark, no generated typography, preserve reference identity.', 'Protects production usability.']] },
  { type: 'heading', level: 2, text: 'Step 4: diagnose the first result before generating more' },
  { type: 'paragraph', text: 'The first result is a diagnostic. If identity is wrong, strengthen the reference handoff. If the composition is messy, change crop and negative space. If the image feels off-brand, fix palette and lighting. Switching models or adding more adjectives too early hides the real problem.' },
  { type: 'heading', level: 2, text: 'Worked example: one character across three scenes' },
  { type: 'paragraph', text: 'Raw job: create three images of the same young ceramic artist for a launch story: studio portrait, product-making moment, and outdoor market booth. The person must remain recognizable, but pose and environment can change.' },
  { type: 'list', items: ['Anchor: one portrait reference controls face shape, hairstyle, age range, and warm earth-tone jacket.', 'Style sheet: natural daylight, soft film contrast, shallow depth of field, warm clay and cream palette, 3:4 aspect ratio.', 'Variable field: scene changes from studio portrait to hands shaping clay to market booth.', 'Review rule: reject any image where face identity, jacket color, or palette drifts before judging artistic taste.'] },
  { type: 'heading', level: 3, text: 'Prompt version 1' },
  { type: 'list', items: ['Use the uploaded portrait as the identity anchor for a young ceramic artist. Preserve face shape, hairstyle, age range, and warm earth-tone jacket. Create a natural daylight studio portrait in a ceramics workspace, soft film contrast, shallow depth of field, clay and cream palette, 3:4 aspect ratio, no extra people, no text, no watermark.'] },
  { type: 'heading', level: 3, text: 'Revision rule' },
  { type: 'paragraph', text: 'If the face changes, do not change the scene yet. Add: the uploaded reference controls facial identity and hair; only the background and pose may change. If the identity is correct but the series looks disconnected, paste the same style sheet into every scene prompt.' },
  { type: 'heading', level: 2, text: 'Mistakes and fixes' },
  { type: 'table', headers: ['Problem', 'Fix first', 'Avoid'], rows: [['Same prompt creates different people', 'Use a reference anchor and name which identity traits must stay fixed.', 'Adding more personality adjectives.'], ['Product keeps changing shape', 'State that the reference controls silhouette, material, label position, and scale.', 'Asking for a more premium style before fixing identity.'], ['Style drifts across a series', 'Create a pasted style sheet for palette, lighting, lens, crop, and background.', 'Letting each prompt invent a new mood.'], ['Generated text breaks the asset', 'Reserve blank space and add typography later outside the image.', 'Asking the model to spell final copy perfectly.'], ['Good first image gets worse after revisions', 'Use a revision prompt that fixes one named failure only.', 'Stacking every new idea into the same prompt.']] },
  { type: 'heading', level: 2, text: 'Model choice inside Vogue AI' },
  { type: 'paragraph', text: 'Use model choice as a workflow decision, not as a shortcut around clarity. GPT Image 2 is a strong first choice when the instructions are precise and the reference handoff matters. Nano Banana is useful for quick variations and social-first experiments. Midjourney is useful when the series depends on mood, fashion framing, or expressive style exploration.' },
  { type: 'links', title: 'Use this workflow in Vogue AI', items: [
    { label: 'Open the Vogue AI workspace', href: '/', description: 'Test a reference-led prompt and save the version that keeps identity stable.' },
    { label: 'Read prompt engineering tips', href: '/blog/prompt-engineering-tips', description: 'Use the same fixed-control approach for product, portrait, poster, and UI prompts.' },
    { label: 'Review prompt anatomy for AI images', href: '/blog/prompt-anatomy-for-ai-images', description: 'Break a visual prompt into subject, reference role, style, composition, and output constraints.' },
  ] },
  { type: 'heading', level: 2, text: 'Final checklist before you call the set consistent' },
  { type: 'list', items: ['Can someone recognize the same character, product, or brand system without reading the prompt?', 'Did the fixed controls stay fixed across at least three images?', 'Did you save the prompt version that solved the problem?', 'Are generated text, logos, hands, and product details acceptable for the actual channel?', 'Can the next image be made by changing one variable instead of rewriting the prompt?'] },
  { type: 'heading', level: 2, text: 'FAQ' },
  { type: 'heading', level: 3, text: 'Can I create consistent AI images for free?' },
  { type: 'paragraph', text: 'You can practice the workflow with free or trial tools, but reliable consistency usually depends more on reference handling, saved prompts, and revision discipline than on price alone.' },
  { type: 'heading', level: 3, text: 'Do I need a reference image?' },
  { type: 'paragraph', text: 'Use one whenever identity matters. If only mood or style matters, a written style sheet may be enough.' },
  { type: 'heading', level: 3, text: 'How do I keep the same character in different scenes?' },
  { type: 'paragraph', text: 'Anchor the character with a reference, define stable identity traits, keep camera and palette consistent, and change only the scene variable.' },
  { type: 'heading', level: 3, text: 'Why does my product keep changing?' },
  { type: 'paragraph', text: 'The prompt probably treats the product as an idea instead of a fixed object. Tell the model the reference controls silhouette, material, color, label placement, and scale.' },
  { type: 'heading', level: 3, text: 'Should I use the same seed?' },
  { type: 'paragraph', text: 'A seed can help in tools that expose it, but it does not replace a reference anchor and stable prompt skeleton.' },
  { type: 'heading', level: 3, text: 'Can this workflow create consistent character video?' },
  { type: 'paragraph', text: 'It can prepare stronger still-image references for video workflows, but video consistency adds motion, timing, and frame-to-frame constraints that need separate review.' },
];

type SupportedBlogLocale = 'zh' | 'fr' | 'ru' | 'pt' | 'ja' | 'ko';

type ConsistentCopy = {
  intro: string;
  tldrHeading: string;
  tldrItems: string[];
  whoHeading: string;
  whoText: string;
  imagePlanHeading: string;
  imagePlanHeaders: string[];
  imagePlanRows: string[][];
  controlsHeading: string;
  controlsHeaders: string[];
  controlsRows: string[][];
  anchorHeading: string;
  anchorText: string;
  identityAlt: string;
  identityCaption: string;
  anchorItems: string[];
  skeletonHeading: string;
  skeletonText: string;
  styleHeading: string;
  styleText: string;
  styleAlt: string;
  styleCaption: string;
  styleHeaders: string[];
  styleRows: string[][];
  diagnoseHeading: string;
  diagnoseText: string;
  workedHeading: string;
  workedText: string;
  workedItems: string[];
  promptVersionHeading: string;
  revisionHeading: string;
  revisionText: string;
  mistakesHeading: string;
  mistakesHeaders: string[];
  mistakesRows: string[][];
  modelHeading: string;
  modelText: string;
  linksTitle: string;
  links: Array<{ label: string; href: string; description: string }>;
  checklistHeading: string;
  checklistItems: string[];
  faqHeading: string;
  faq: Array<[string, string]>;
};

const localizedCopy = {
  zh: {
    intro:
      '想创建一致的 AI 图像，不要把每次生成都当成独立灵感，而要当成一个小型制作系统：一个参考锚点、一个可复用提示词骨架、一张风格表和一条修正规则。大多数不稳定不是模型突然变差，而是提示词不断重写，导致本该固定的变量被放松了。',
    tldrHeading: '快速结论：可重复的工作流',
    tldrItems: [
      '只要身份、产品形状、脸、服装、Logo 位置或 UI 布局重要，就先使用参考图。',
      '把固定控制项和可变项分开：身份、风格、镜头、色板、比例、背景和可替换场景细节。',
      '先生成第一张图，找出最大漂移点，再只修正那个控制项，不要整段重写。',
      '把解决问题的提示词保存成命名配方，再复制到下一张系列图里。',
      '在 Vogue AI 中，GPT Image 2 适合精确指令，Nano Banana 适合快速参考图变体，Midjourney 适合探索强风格氛围。',
    ],
    whoHeading: '适合谁使用',
    whoText:
      '这个流程适合需要角色、产品、营销活动或视觉风格在多张图里保持稳定的创作者、营销人员、创业者和设计师。它不是像素级一致性的保证，而是用可复用控制项减少漂移，同时保留足够空间去完成可用的系列视觉。',
    imagePlanHeading: '本文示例图如何使用',
    imagePlanHeaders: ['位置', '来源', '为什么合适'],
    imagePlanRows: [
      ['封面', 'GPT Image 2 分镜工作流图库图', '多画面灯会分镜最能说明系列一致性，因此只作为封面使用。'],
      ['身份段落', 'Nano Banana 暗调肖像示例', '肖像参考图适合解释角色一致性和脸部漂移。'],
      ['风格段落', 'Midjourney 时装编辑示例', '时装编辑图能说明色板、光线、镜头和情绪如何跨主体保持稳定。'],
    ],
    controlsHeading: '一致性靠四个控制项，不靠一句神奇提示词',
    controlsHeaders: ['控制项', '需要固定什么', '可以改变什么', '常见失败'],
    controlsRows: [
      ['身份', '脸、产品形状、服装锚点、品牌标记、UI 层级。', '姿势、场景、裁切、表情、背景。', '模型生成了另一个人，或重新设计了产品。'],
      ['构图', '画幅、镜头距离、视觉焦点、留白。', '场景细节、道具、渠道格式。', '每张图都像不同活动。'],
      ['风格', '色板、光线、镜头、质感、真实程度。', '主体动作、季节主题、环境。', '系列从电影感跳到卡通再跳到棚拍。'],
      ['修正规则', '已解决的提示词骨架和参考图交接方式。', '一次只改一个失败点。', '修一个问题时又制造三个新问题。'],
    ],
    anchorHeading: '步骤 1：先选锚点，再写提示词',
    anchorText:
      '如果图像必须像同一个人、同一个物体、同一套包装、同一个界面或同一场活动，就先确定锚点。在 Vogue AI 里，这通常意味着上传或选择参考图，并明确写出参考图负责控制哪些部分。不要让模型自己猜哪些内容不能变。',
    identityAlt: 'Nano Banana 肖像参考图，用于保持角色身份一致',
    identityCaption:
      '肖像示例应该放在身份说明附近，因为最难的稳定性问题通常是换场景、换光线或换服装时仍保留可识别的脸。',
    anchorItems: [
      '角色：锚定脸型、年龄段、发型、身材比例和一个标志性服装颜色。',
      '产品：锚定轮廓、颜色、材质、标签位置和比例。',
      '品牌系列：锚定色板、光线、留白、文字安全区域和艺术方向。',
      'UI 或应用界面：锚定信息层级、设备框架和必须可识别的产品区域。',
    ],
    skeletonHeading: '步骤 2：写出固定字段和变量字段',
    skeletonText:
      '稳定的提示词应该在关键位置保持“无聊”：身份、镜头、色板和输出规则不变，只改变场景变量、产品语境、姿势或渠道要求。',
    styleHeading: '步骤 3：为系列建立风格表',
    styleText:
      '风格表是一组可以重复粘贴的视觉决策。它比长段形容词更有用，因为你能在每次生成时看到到底是哪一个字段发生了变化。',
    styleAlt: 'Midjourney 时装编辑示例，用于解释稳定风格',
    styleCaption:
      '这张图适合解释风格一致性：重点不是复制同一个主体，而是稳定光线、阴影语言、编辑式裁切和时装情绪。',
    styleHeaders: ['风格字段', '示例值', '为什么重要'],
    styleRows: [
      ['色板', '黑色、骨白、哑金，加一个红色点缀。', '避免每张图发明新的颜色系统。'],
      ['光线', '柔和主光、深侧影、轻微轮廓光。', '让不同场景保持同一种情绪。'],
      ['镜头与裁切', '85mm 肖像感、胸像裁切、3:4 比例。', '让系列像同一次拍摄。'],
      ['背景', '极简棚墙、轻微纹理、无文字。', '减少一次性噪声。'],
      ['输出规则', '无水印、不要生成排版文字、保留参考身份。', '保护最终素材的可用性。'],
    ],
    diagnoseHeading: '步骤 4：先诊断第一张图，再继续生成',
    diagnoseText:
      '第一张图是诊断样张。身份错了，就加强参考图交接；构图乱了，就修改裁切和留白；品牌感不对，就修色板和光线。太早换模型或堆形容词，会遮住真正的问题。',
    workedHeading: '完整示例：同一角色跨三个场景',
    workedText:
      '任务：为一位年轻陶艺师创建三张发布故事图：工作室肖像、制作产品的瞬间、户外市集摊位。人物必须可识别，但姿势和环境可以变化。',
    workedItems: [
      '锚点：一张肖像参考图控制脸型、发型、年龄段和暖土色夹克。',
      '风格表：自然日光、柔和胶片反差、浅景深、陶土与奶油色板、3:4 比例。',
      '变量字段：场景从工作室肖像变为手工制陶，再变为市集摊位。',
      '审核规则：脸部身份、夹克颜色或色板漂移时先拒绝，不要先评价审美好坏。',
    ],
    promptVersionHeading: '提示词版本 1',
    revisionHeading: '修正规则',
    revisionText:
      '如果脸变了，先不要改场景。补充：上传参考图控制面部身份和发型，只有背景和姿势可以改变。如果身份正确但系列不连贯，就把同一张风格表粘贴到每个场景提示词里。',
    mistakesHeading: '常见错误与修正',
    mistakesHeaders: ['问题', '先修什么', '避免什么'],
    mistakesRows: [
      ['同一句提示词生成不同的人', '使用参考锚点，并写清哪些身份特征必须固定。', '继续堆“有个性”的形容词。'],
      ['产品形状一直变化', '说明参考图控制轮廓、材质、标签位置和比例。', '在身份没稳前先追求更高级的风格。'],
      ['系列风格漂移', '粘贴同一张色板、光线、镜头、裁切和背景风格表。', '让每条提示词重新发明情绪。'],
      ['生成文字破坏素材', '预留空白区域，在外部设计工具里加文字。', '要求模型完美拼写最终文案。'],
      ['好看的第一张越修越差', '用修正提示词一次只修一个明确失败点。', '把每个新想法都塞进同一句提示词。'],
    ],
    modelHeading: 'Vogue AI 里的模型选择',
    modelText:
      '把模型选择当成流程决策，而不是绕过清晰提示词的捷径。GPT Image 2 适合精确指令和参考图交接；Nano Banana 适合快速变体和社媒实验；Midjourney 适合依赖情绪、时装构图或强风格探索的系列。',
    linksTitle: '在 Vogue AI 中继续使用这个流程',
    links: [
      { label: '打开 Vogue AI 工作区', href: '/', description: '测试参考图提示词，并保存能稳定身份的版本。' },
      { label: '阅读提示词工程技巧', href: '/blog/prompt-engineering-tips', description: '把固定控制项方法用于产品、肖像、海报和 UI 提示词。' },
      { label: '查看 AI 图像提示词结构', href: '/blog/prompt-anatomy-for-ai-images', description: '把视觉提示词拆成主体、参考图角色、风格、构图和输出限制。' },
    ],
    checklistHeading: '称为“一致”之前的检查清单',
    checklistItems: [
      '不读提示词时，别人能认出同一个角色、产品或品牌系统吗？',
      '至少三张图里，固定控制项真的保持固定了吗？',
      '你保存了解决问题的提示词版本吗？',
      '生成文字、Logo、手部和产品细节能用于实际渠道吗？',
      '下一张图能不能只改一个变量，而不是整段重写？',
    ],
    faqHeading: 'FAQ',
    faq: [
      ['我可以免费创建一致的 AI 图像吗？', '可以用免费或试用工具练习流程，但可靠一致性更多取决于参考图处理、保存提示词和有纪律的修正，而不只是价格。'],
      ['一定需要参考图吗？', '只要身份重要，就应该使用参考图。如果只是情绪或风格重要，文字风格表可能已经足够。'],
      ['怎样让同一角色出现在不同场景？', '用参考图锚定角色，定义稳定身份特征，保持镜头和色板一致，只改变场景变量。'],
      ['为什么我的产品一直变形？', '提示词可能把产品当成概念，而不是固定物体。告诉模型参考图控制轮廓、材质、颜色、标签位置和比例。'],
      ['同一个 seed 有用吗？', '如果工具暴露 seed，它可以帮忙，但不能替代参考锚点和稳定提示词骨架。'],
      ['这个流程能做一致角色视频吗？', '它可以为视频工作流准备更强的静态参考图，但视频一致性还涉及动作、节奏和逐帧约束，需要单独审核。'],
    ],
  },
  fr: {
    intro:
      "Pour créer des images IA cohérentes, traitez chaque génération comme un petit système de production : une référence d'ancrage, un squelette de prompt réutilisable, une feuille de style et une règle de révision. La cohérence échoue surtout quand le prompt est réécrit au lieu de protéger les variables qui doivent rester fixes.",
    tldrHeading: 'Résumé : le workflow répétable',
    tldrItems: [
      "Utilisez une image de référence dès que l'identité, la forme produit, le visage, la tenue, le logo ou la mise en page UI compte.",
      "Séparez les contrôles fixes des variables : identité, style, caméra, palette, ratio, arrière-plan et détail de scène.",
      "Générez une première image, diagnostiquez la dérive principale, puis corrigez seulement ce contrôle.",
      "Enregistrez le prompt résolu comme recette, puis dupliquez-le pour l'image suivante.",
      "Dans Vogue AI, choisissez GPT Image 2 pour les instructions précises, Nano Banana pour les variations rapides avec référence, et Midjourney pour explorer une direction très stylisée.",
    ],
    whoHeading: 'À qui cela s’adresse',
    whoText:
      "Ce workflow s'adresse aux créateurs, marketeurs, fondateurs et designers qui veulent qu'un personnage, un produit, une campagne ou un style survive sur plusieurs images. Il ne promet pas une continuité pixel parfaite, mais réduit la dérive tout en gardant assez de liberté pour produire une série utilisable.",
    imagePlanHeading: 'Rôle des visuels dans ce guide',
    imagePlanHeaders: ['Rôle', 'Source', 'Pourquoi cela convient'],
    imagePlanRows: [
      ['Couverture', 'Image de storyboard GPT Image 2', "Un storyboard multi-images montre clairement la cohérence d'une série ; il reste donc en couverture."],
      ['Section identité', 'Portrait sombre Nano Banana', "Un portrait de référence illustre la stabilité d'un visage et la dérive d'identité."],
      ['Section style', 'Image éditoriale mode Midjourney', "Elle montre comment palette, lumière, optique et humeur peuvent rester stables quand le sujet change."],
    ],
    controlsHeading: 'La cohérence repose sur quatre contrôles',
    controlsHeaders: ['Contrôle', 'Ce qui reste fixe', 'Ce qui peut changer', 'Échec courant'],
    controlsRows: [
      ['Identité', 'Visage, forme produit, tenue repère, marque, hiérarchie UI.', 'Pose, scène, cadrage, expression, arrière-plan.', 'Le modèle invente une autre personne ou redessine le produit.'],
      ['Composition', 'Ratio, distance caméra, point focal, espace négatif.', 'Détails de scène, accessoires, format de canal.', 'Chaque image ressemble à une campagne différente.'],
      ['Style', 'Palette, lumière, optique, texture, niveau de réalisme.', 'Action du sujet, thème saisonnier, environnement.', 'La série saute du cinéma au cartoon puis à la photo studio.'],
      ['Révision', 'Squelette résolu et passation de la référence.', 'Un seul problème nommé à la fois.', 'Corriger un détail crée trois nouveaux problèmes.'],
    ],
    anchorHeading: "Étape 1 : choisissez l'ancre avant le prompt",
    anchorText:
      "Si l'image doit ressembler à la même personne, au même objet, au même packaging, à la même interface ou à la même campagne, commencez par l'ancre. Dans Vogue AI, cela signifie souvent téléverser ou choisir une référence, puis écrire précisément ce qu'elle contrôle.",
    identityAlt: "Portrait Nano Banana utilisé comme référence d'identité",
    identityCaption:
      "Un portrait doit apparaître près des consignes d'identité, car le problème le plus visible est souvent de garder un visage reconnaissable malgré un changement de scène, de lumière ou de tenue.",
    anchorItems: [
      "Personnage : ancrez la forme du visage, l'âge, la coiffure, les proportions et une couleur de tenue distinctive.",
      'Produit : ancrez silhouette, couleur, matière, emplacement de l’étiquette et échelle.',
      'Série de marque : ancrez palette, lumière, espace négatif, zone sûre pour le texte et direction artistique.',
      'UI ou écran : ancrez la hiérarchie, le cadre appareil et les zones produit reconnaissables.',
    ],
    skeletonHeading: 'Étape 2 : séparez champs fixes et variables',
    skeletonText:
      "Un prompt cohérent doit être ennuyeux aux bons endroits. Gardez identité, caméra, palette et règles de sortie stables ; changez seulement la scène, le contexte produit, la pose ou le format.",
    styleHeading: 'Étape 3 : créez une feuille de style',
    styleText:
      "Une feuille de style est une liste courte de décisions visuelles répétables. Elle est plus utile qu'un long paragraphe, car vous voyez immédiatement quel champ a changé.",
    styleAlt: 'Exemple éditorial Midjourney pour un style cohérent',
    styleCaption:
      "L'intérêt de cette image est la stabilité de la lumière, des ombres, du cadrage éditorial et de l'humeur mode, pas la copie exacte du sujet.",
    styleHeaders: ['Champ', 'Exemple', 'Pourquoi cela compte'],
    styleRows: [
      ['Palette', 'Noir, blanc os, or sourd, un accent rouge.', 'Empêche chaque image d’inventer un nouveau système de couleurs.'],
      ['Lumière', 'Source douce, ombre latérale profonde, léger contre-jour.', 'Maintient la même humeur entre les scènes.'],
      ['Optique et cadrage', 'Sensation portrait 85 mm, buste, ratio 3:4.', 'Donne le rythme d’une même séance.'],
      ['Arrière-plan', 'Mur studio minimal, légère texture, aucun texte.', 'Réduit les détails parasites.'],
      ['Règle de sortie', 'Pas de filigrane, pas de typographie générée, identité préservée.', 'Protège l’usage en production.'],
    ],
    diagnoseHeading: 'Étape 4 : diagnostiquez le premier rendu',
    diagnoseText:
      "Le premier résultat sert de diagnostic. Si l'identité est fausse, renforcez la référence. Si la composition est confuse, corrigez cadrage et espace négatif. Si l'image n'est pas dans la marque, corrigez palette et lumière.",
    workedHeading: 'Exemple complet : un personnage dans trois scènes',
    workedText:
      "Brief : créer trois images de la même jeune céramiste pour une histoire de lancement : portrait atelier, fabrication, stand de marché. La personne doit rester reconnaissable, même si la pose et l'environnement changent.",
    workedItems: [
      "Ancre : un portrait contrôle visage, coiffure, âge et veste terre chaude.",
      'Feuille de style : lumière naturelle, contraste film doux, faible profondeur de champ, palette argile et crème, ratio 3:4.',
      'Variable : la scène passe du portrait atelier aux mains modelant l’argile puis au stand de marché.',
      'Règle de revue : rejeter toute dérive du visage, de la veste ou de la palette avant de juger le goût artistique.',
    ],
    promptVersionHeading: 'Version de prompt 1',
    revisionHeading: 'Règle de révision',
    revisionText:
      "Si le visage change, ne changez pas encore la scène. Ajoutez que la référence contrôle l'identité faciale et les cheveux ; seuls l'arrière-plan et la pose peuvent changer. Si l'identité est correcte mais que la série se disperse, collez la même feuille de style dans chaque scène.",
    mistakesHeading: 'Erreurs et corrections',
    mistakesHeaders: ['Problème', 'Corriger d’abord', 'Éviter'],
    mistakesRows: [
      ['Le même prompt crée des personnes différentes', 'Utiliser une référence et nommer les traits fixes.', 'Ajouter plus d’adjectifs de personnalité.'],
      ['Le produit change de forme', 'Dire que la référence contrôle silhouette, matière, étiquette et échelle.', 'Chercher un style plus premium avant de fixer l’identité.'],
      ['Le style dérive', 'Coller la même feuille de style pour palette, lumière, optique, cadrage et fond.', 'Laisser chaque prompt inventer une nouvelle ambiance.'],
      ['Le texte généré casse l’image', 'Réserver un espace vide et ajouter le texte dans un outil de design.', 'Demander une typographie finale parfaite.'],
      ['Une bonne première image se dégrade', 'Corriger un seul échec nommé par révision.', 'Empiler toutes les nouvelles idées dans le même prompt.'],
    ],
    modelHeading: 'Choisir le modèle dans Vogue AI',
    modelText:
      "Traitez le modèle comme une décision de workflow. GPT Image 2 convient aux instructions précises et aux références importantes. Nano Banana est utile pour les variations rapides et sociales. Midjourney est meilleur quand la série dépend de l'humeur, de la mode ou d'une direction artistique expressive.",
    linksTitle: 'Continuer dans Vogue AI',
    links: [
      { label: 'Ouvrir l’espace Vogue AI', href: '/', description: 'Tester un prompt avec référence et enregistrer la version qui stabilise l’identité.' },
      { label: 'Lire les conseils de prompt engineering', href: '/blog/prompt-engineering-tips', description: 'Appliquer les contrôles fixes aux prompts produit, portrait, poster et UI.' },
      { label: 'Voir l’anatomie d’un prompt image', href: '/blog/prompt-anatomy-for-ai-images', description: 'Découper un prompt en sujet, rôle de référence, style, composition et contraintes.' },
    ],
    checklistHeading: 'Checklist finale',
    checklistItems: [
      'Peut-on reconnaître le même personnage, produit ou système sans lire le prompt ?',
      'Les contrôles fixes restent-ils stables sur au moins trois images ?',
      'La version du prompt qui résout le problème est-elle enregistrée ?',
      'Texte, logos, mains et détails produit sont-ils acceptables pour le canal final ?',
      'La prochaine image peut-elle changer une seule variable plutôt que tout réécrire ?',
    ],
    faqHeading: 'FAQ',
    faq: [
      ['Puis-je créer des images IA cohérentes gratuitement ?', "Oui pour pratiquer, mais la fiabilité dépend surtout des références, des prompts sauvegardés et d'une révision disciplinée."],
      ['Ai-je besoin d’une image de référence ?', "Oui dès que l'identité compte. Pour une humeur ou un style, une feuille de style écrite peut suffire."],
      ['Comment garder le même personnage dans différentes scènes ?', "Ancrez-le avec une référence, définissez les traits stables, gardez caméra et palette cohérentes, puis changez seulement la scène."],
      ['Pourquoi mon produit change-t-il ?', "Le prompt traite probablement le produit comme une idée. Dites que la référence contrôle silhouette, matière, couleur, étiquette et échelle."],
      ['Utiliser le même seed aide-t-il ?', "Un seed peut aider dans les outils qui l'exposent, mais il ne remplace pas la référence et le squelette stable."],
      ['Ce workflow marche-t-il pour une vidéo de personnage ?', "Il prépare de meilleures références fixes, mais la vidéo ajoute mouvement, timing et contraintes image par image."],
    ],
  },
  ru: {
    intro:
      'Чтобы создавать стабильные AI-изображения, относитесь к генерации как к небольшой производственной системе: один референс, один повторяемый каркас промпта, одна таблица стиля и одно правило правки. Стабильность чаще ломается не из-за модели, а из-за постоянного переписывания промпта.',
    tldrHeading: 'Кратко: повторяемый процесс',
    tldrItems: [
      'Используйте референс, если важны личность, форма продукта, лицо, одежда, место логотипа или UI-макет.',
      'Разделяйте фиксированные элементы и переменные: идентичность, стиль, камера, палитра, соотношение сторон, фон и детали сцены.',
      'Сначала создайте первый результат, найдите главную ошибку и исправляйте только этот контроль.',
      'Сохраняйте удачный промпт как рецепт и дублируйте его для следующего изображения серии.',
      'В Vogue AI GPT Image 2 подходит для точных инструкций, Nano Banana — для быстрых вариаций с референсом, Midjourney — для сильного стилистического поиска.',
    ],
    whoHeading: 'Кому подходит',
    whoText:
      'Процесс полезен авторам, маркетологам, фаундерам и дизайнерам, которым нужно удержать персонажа, продукт, кампанию или визуальный стиль в серии изображений. Это не обещание пиксельной точности, а практический способ снизить дрейф.',
    imagePlanHeading: 'Как используются изображения в гайде',
    imagePlanHeaders: ['Роль', 'Источник', 'Зачем подходит'],
    imagePlanRows: [
      ['Обложка', 'Storyboard-изображение GPT Image 2', 'Много кадров хорошо объясняют стабильность серии, поэтому картинка остается в обложке.'],
      ['Раздел идентичности', 'Темный портрет Nano Banana', 'Портретный референс помогает объяснить сохранение лица и дрейф идентичности.'],
      ['Раздел стиля', 'Fashion editorial Midjourney', 'Пример показывает, как палитра, свет, оптика и настроение остаются стабильными при смене объекта.'],
    ],
    controlsHeading: 'Стабильность держится на четырех контролях',
    controlsHeaders: ['Контроль', 'Что фиксируем', 'Что можно менять', 'Типичная ошибка'],
    controlsRows: [
      ['Идентичность', 'Лицо, форма продукта, одежда-якорь, брендовые элементы, UI-иерархия.', 'Поза, сцена, кадр, выражение, фон.', 'Модель создает другого человека или переделывает продукт.'],
      ['Композиция', 'Формат, дистанция камеры, фокус, свободное пространство.', 'Детали сцены, реквизит, формат канала.', 'Каждое изображение выглядит как другая кампания.'],
      ['Стиль', 'Палитра, свет, объектив, текстура, уровень реализма.', 'Действие, сезонная тема, окружение.', 'Серия скачет от кино к мультфильму и студийной съемке.'],
      ['Правка', 'Решенный каркас промпта и роль референса.', 'Одна названная ошибка за раз.', 'Исправление одной ошибки создает три новые.'],
    ],
    anchorHeading: 'Шаг 1: выберите якорь до промпта',
    anchorText:
      'Если изображение должно сохранять того же человека, объект, упаковку, интерфейс или кампанию, начните с якоря. В Vogue AI это обычно референс и точное описание того, какие части он контролирует.',
    identityAlt: 'Портрет Nano Banana как референс идентичности',
    identityCaption:
      'Портрет нужен рядом с инструкциями об идентичности: самая заметная проблема — сохранить узнаваемое лицо при смене сцены, света или одежды.',
    anchorItems: [
      'Персонаж: форма лица, возраст, прическа, пропорции и фирменный цвет одежды.',
      'Продукт: силуэт, цвет, материал, положение этикетки и масштаб.',
      'Бренд-серия: палитра, свет, свободное место, безопасная зона текста и арт-дирекция.',
      'UI или экран: иерархия, рамка устройства и узнаваемая область продукта.',
    ],
    skeletonHeading: 'Шаг 2: разделите фиксированные и переменные поля',
    skeletonText:
      'Стабильный промпт должен быть скучным в правильных местах. Идентичность, камера, палитра и правила вывода остаются, меняются только сцена, контекст, поза или формат канала.',
    styleHeading: 'Шаг 3: создайте таблицу стиля',
    styleText:
      'Таблица стиля — короткий список повторяемых визуальных решений. Она полезнее длинного абзаца, потому что сразу видно, какое поле изменилось.',
    styleAlt: 'Midjourney fashion editorial для объяснения стабильного стиля',
    styleCaption:
      'Этот пример полезен не объектом, а стабильным светом, языком теней, редакционным кадром и модным настроением.',
    styleHeaders: ['Поле стиля', 'Пример', 'Зачем важно'],
    styleRows: [
      ['Палитра', 'Черный, костяной белый, приглушенное золото, один красный акцент.', 'Не дает каждой картинке придумывать новую цветовую систему.'],
      ['Свет', 'Мягкий ключевой свет, глубокая боковая тень, слабый контровой свет.', 'Сохраняет настроение между сценами.'],
      ['Оптика и кадр', 'Портрет 85 мм, кадр по грудь, 3:4.', 'Делает серию похожей на одну съемку.'],
      ['Фон', 'Минимальная студийная стена, легкая текстура, без текста.', 'Убирает лишний шум.'],
      ['Правило вывода', 'Без водяных знаков, без сгенерированной типографики, сохранить идентичность.', 'Защищает производственную пригодность.'],
    ],
    diagnoseHeading: 'Шаг 4: диагностируйте первый результат',
    diagnoseText:
      'Первый результат — диагностика. Если неверна идентичность, усилите передачу референса. Если композиция грязная, меняйте кадр и свободное место. Если бренд не читается, правьте палитру и свет.',
    workedHeading: 'Пример: один персонаж в трех сценах',
    workedText:
      'Задача: создать три изображения одной молодой керамистки для истории запуска: портрет в студии, процесс работы и рыночный стенд. Человек должен оставаться узнаваемым, хотя поза и среда меняются.',
    workedItems: [
      'Якорь: портрет контролирует лицо, прическу, возраст и теплую земляную куртку.',
      'Стиль: дневной свет, мягкий пленочный контраст, малая глубина резкости, глина и кремовый цвет, 3:4.',
      'Переменная: сцена меняется от студии к лепке и рыночному стенду.',
      'Проверка: отклонять дрейф лица, цвета куртки или палитры до оценки вкуса.',
    ],
    promptVersionHeading: 'Версия промпта 1',
    revisionHeading: 'Правило правки',
    revisionText:
      'Если лицо меняется, еще не меняйте сцену. Добавьте, что референс контролирует лицо и волосы; менять можно только фон и позу. Если идентичность верна, но серия распадается, вставьте одну и ту же таблицу стиля в каждый сценический промпт.',
    mistakesHeading: 'Ошибки и исправления',
    mistakesHeaders: ['Проблема', 'Что исправить сначала', 'Чего избегать'],
    mistakesRows: [
      ['Один промпт создает разных людей', 'Использовать референс и назвать фиксированные черты.', 'Добавлять больше описаний характера.'],
      ['Форма продукта меняется', 'Указать, что референс контролирует силуэт, материал, этикетку и масштаб.', 'Делать стиль премиальнее до фиксации формы.'],
      ['Стиль дрейфует', 'Вставлять ту же палитру, свет, оптику, кадр и фон.', 'Каждый раз придумывать новое настроение.'],
      ['Сгенерированный текст ломает ассет', 'Оставить место и добавить текст в дизайн-инструменте.', 'Просить модель идеально написать финальный текст.'],
      ['Хороший первый результат ухудшается', 'Исправлять одну названную ошибку за раз.', 'Складывать все новые идеи в один промпт.'],
    ],
    modelHeading: 'Выбор модели в Vogue AI',
    modelText:
      'Выбирайте модель как часть процесса. GPT Image 2 хорош для точных инструкций и референсов. Nano Banana полезен для быстрых вариаций и социальных экспериментов. Midjourney подходит для настроения, модного кадра и выразительной стилистики.',
    linksTitle: 'Продолжить в Vogue AI',
    links: [
      { label: 'Открыть рабочую область Vogue AI', href: '/', description: 'Проверить prompt с референсом и сохранить версию, которая держит идентичность.' },
      { label: 'Прочитать советы по prompt engineering', href: '/blog/prompt-engineering-tips', description: 'Применить фиксированные контроли к продуктам, портретам, постерам и UI.' },
      { label: 'Разобрать анатомию prompt для AI-изображений', href: '/blog/prompt-anatomy-for-ai-images', description: 'Разделить prompt на объект, роль референса, стиль, композицию и ограничения.' },
    ],
    checklistHeading: 'Финальная проверка',
    checklistItems: [
      'Можно ли узнать того же персонажа, продукт или бренд без чтения промпта?',
      'Сохранились ли фиксированные элементы хотя бы в трех изображениях?',
      'Сохранена ли версия промпта, которая решила проблему?',
      'Текст, логотипы, руки и детали продукта пригодны для нужного канала?',
      'Следующее изображение можно сделать сменой одной переменной?',
    ],
    faqHeading: 'FAQ',
    faq: [
      ['Можно ли делать стабильные AI-изображения бесплатно?', 'Да, для практики. Но надежность зависит от референсов, сохраненных промптов и дисциплины правок больше, чем от цены.'],
      ['Нужен ли референс?', 'Нужен, когда важна идентичность. Если важны только настроение или стиль, письменной таблицы стиля может хватить.'],
      ['Как сохранить одного персонажа в разных сценах?', 'Закрепите его референсом, задайте стабильные черты, держите камеру и палитру и меняйте только сцену.'],
      ['Почему продукт постоянно меняется?', 'Промпт, вероятно, описывает продукт как идею, а не фиксированный объект. Укажите, что референс контролирует силуэт, материал, цвет, этикетку и масштаб.'],
      ['Помогает ли один и тот же seed?', 'Может помочь в инструментах, где он есть, но не заменяет референс и стабильный каркас промпта.'],
      ['Можно ли так делать стабильное видео персонажа?', 'Процесс готовит более сильные статичные референсы, но видео добавляет движение, тайминг и покадровые ограничения.'],
    ],
  },
  pt: {
    intro:
      'Para criar imagens IA consistentes, trate cada geração como um pequeno sistema de produção: uma referência âncora, um esqueleto de prompt reutilizável, uma folha de estilo e uma regra de revisão. A consistência costuma falhar quando o prompt é reescrito em vez de proteger as variáveis que precisam ficar fixas.',
    tldrHeading: 'Resumo: o workflow repetível',
    tldrItems: [
      'Use uma imagem de referência sempre que identidade, forma do produto, rosto, roupa, posição do logo ou layout de UI importar.',
      'Separe controles fixos de variáveis: identidade, estilo, câmera, paleta, proporção, fundo e detalhe de cena.',
      'Gere a primeira imagem, diagnostique a maior deriva e revise apenas esse controle.',
      'Salve o prompt resolvido como receita e duplique para a próxima imagem da série.',
      'No Vogue AI, use GPT Image 2 para instruções controladas, Nano Banana para variações rápidas com referência e Midjourney para exploração visual estilizada.',
    ],
    whoHeading: 'Para quem é',
    whoText:
      'Este workflow serve para criadores, marketers, fundadores e designers que precisam manter personagem, produto, campanha ou estilo visual em várias imagens. Não garante continuidade pixel a pixel, mas reduz deriva e mantém flexibilidade para criar uma série utilizável.',
    imagePlanHeading: 'Como os exemplos visuais são usados',
    imagePlanHeaders: ['Papel', 'Fonte', 'Por que combina'],
    imagePlanRows: [
      ['Hero', 'Imagem de storyboard GPT Image 2', 'Um storyboard com vários quadros mostra a consistência de uma série, por isso fica só na capa.'],
      ['Identidade', 'Retrato escuro Nano Banana', 'Um retrato de referência explica bem consistência de personagem e deriva facial.'],
      ['Estilo', 'Editorial de moda Midjourney', 'Mostra como paleta, luz, lente e mood podem ficar estáveis mesmo com outro sujeito.'],
    ],
    controlsHeading: 'Consistência são quatro controles',
    controlsHeaders: ['Controle', 'O que fica fixo', 'O que muda', 'Falha comum'],
    controlsRows: [
      ['Identidade', 'Rosto, forma do produto, roupa âncora, marcas, hierarquia de UI.', 'Pose, cena, corte, expressão, fundo.', 'O modelo inventa outra pessoa ou redesenha o produto.'],
      ['Composição', 'Proporção, distância de câmera, foco e espaço negativo.', 'Detalhe de cena, props e formato do canal.', 'Cada imagem parece uma campanha diferente.'],
      ['Estilo', 'Paleta, iluminação, lente, textura e realismo.', 'Ação, tema sazonal e ambiente.', 'A série pula de cinema para cartoon e depois foto de estúdio.'],
      ['Revisão', 'Esqueleto resolvido e função da referência.', 'Uma falha nomeada por vez.', 'Corrigir uma coisa cria três problemas novos.'],
    ],
    anchorHeading: 'Passo 1: escolha a âncora antes do prompt',
    anchorText:
      'Se a imagem precisa parecer a mesma pessoa, objeto, embalagem, interface ou campanha, comece pela âncora. No Vogue AI, isso geralmente significa subir ou escolher uma referência e escrever exatamente o que ela controla.',
    identityAlt: 'Retrato Nano Banana como referência de identidade',
    identityCaption:
      'O retrato fica perto da orientação de identidade porque o problema mais visível é preservar um rosto reconhecível ao mudar cena, luz ou roupa.',
    anchorItems: [
      'Personagem: rosto, idade, cabelo, proporções e uma cor de roupa marcante.',
      'Produto: silhueta, cor, material, posição do rótulo e escala.',
      'Série de marca: paleta, luz, espaço negativo, área segura para texto e direção de arte.',
      'UI ou tela: hierarquia, moldura do dispositivo e áreas reconhecíveis do produto.',
    ],
    skeletonHeading: 'Passo 2: separe campos fixos e variáveis',
    skeletonText:
      'Um prompt consistente deve ser previsível nos lugares certos. Mantenha identidade, câmera, paleta e regras de saída estáveis; mude só a cena, contexto, pose ou canal.',
    styleHeading: 'Passo 3: crie uma folha de estilo',
    styleText:
      'A folha de estilo é uma lista curta de decisões visuais repetíveis. Ela ajuda mais que um parágrafo longo porque mostra exatamente qual campo mudou.',
    styleAlt: 'Exemplo editorial Midjourney para consistência de estilo',
    styleCaption:
      'O valor desta imagem é a iluminação, linguagem de sombra, corte editorial e mood de moda estáveis, não copiar o sujeito.',
    styleHeaders: ['Campo', 'Exemplo', 'Por que importa'],
    styleRows: [
      ['Paleta', 'Preto, branco osso, dourado suave, um acento vermelho.', 'Evita que cada imagem invente outro sistema de cor.'],
      ['Luz', 'Luz principal suave, sombra lateral profunda e leve contraluz.', 'Mantém o mood entre cenas.'],
      ['Lente e corte', 'Sensação de retrato 85 mm, meio corpo, 3:4.', 'Faz a série parecer uma sessão única.'],
      ['Fundo', 'Parede de estúdio minimalista, textura leve, sem texto.', 'Remove ruído visual.'],
      ['Regra de saída', 'Sem marca d’água, sem tipografia gerada, preservar identidade.', 'Protege o uso em produção.'],
    ],
    diagnoseHeading: 'Passo 4: diagnostique a primeira imagem',
    diagnoseText:
      'A primeira imagem é diagnóstico. Se a identidade falhou, fortaleça a referência. Se a composição está confusa, ajuste corte e espaço negativo. Se a marca não aparece, corrija paleta e luz.',
    workedHeading: 'Exemplo: uma personagem em três cenas',
    workedText:
      'Tarefa: criar três imagens da mesma jovem ceramista para uma história de lançamento: retrato no estúdio, processo de criação e banca em feira. A pessoa deve continuar reconhecível, mas pose e ambiente podem mudar.',
    workedItems: [
      'Âncora: um retrato controla rosto, cabelo, idade e jaqueta em tom terroso.',
      'Estilo: luz natural, contraste suave de filme, pouca profundidade, paleta argila e creme, 3:4.',
      'Variável: a cena muda de retrato no estúdio para mãos modelando argila e depois feira.',
      'Regra de revisão: rejeitar deriva de rosto, cor da jaqueta ou paleta antes de julgar gosto visual.',
    ],
    promptVersionHeading: 'Prompt versão 1',
    revisionHeading: 'Regra de revisão',
    revisionText:
      'Se o rosto mudar, ainda não mude a cena. Acrescente que a referência controla identidade facial e cabelo; só fundo e pose podem mudar. Se a identidade está certa mas a série parece solta, cole a mesma folha de estilo em cada prompt.',
    mistakesHeading: 'Erros e correções',
    mistakesHeaders: ['Problema', 'Corrigir primeiro', 'Evitar'],
    mistakesRows: [
      ['Mesmo prompt cria pessoas diferentes', 'Usar referência e nomear traços fixos.', 'Adicionar mais adjetivos de personalidade.'],
      ['Produto muda de forma', 'Dizer que a referência controla silhueta, material, rótulo e escala.', 'Buscar estilo premium antes de fixar identidade.'],
      ['Estilo deriva', 'Repetir paleta, luz, lente, corte e fundo.', 'Inventar um mood novo a cada prompt.'],
      ['Texto gerado quebra o asset', 'Reservar espaço vazio e adicionar texto em ferramenta de design.', 'Pedir tipografia final perfeita ao modelo.'],
      ['Primeira imagem boa piora nas revisões', 'Corrigir uma falha nomeada por vez.', 'Empilhar todas as ideias novas no mesmo prompt.'],
    ],
    modelHeading: 'Escolha de modelo no Vogue AI',
    modelText:
      'Use o modelo como decisão de workflow. GPT Image 2 é forte quando instruções e referência importam. Nano Banana serve para variações rápidas e social-first. Midjourney funciona melhor quando a série depende de mood, moda ou estilo expressivo.',
    linksTitle: 'Continue no Vogue AI',
    links: [
      { label: 'Abrir o workspace Vogue AI', href: '/', description: 'Teste um prompt com referência e salve a versão que mantém identidade estável.' },
      { label: 'Ler dicas de prompt engineering', href: '/blog/prompt-engineering-tips', description: 'Use controles fixos em prompts de produto, retrato, pôster e UI.' },
      { label: 'Ver a anatomia de prompts de imagem', href: '/blog/prompt-anatomy-for-ai-images', description: 'Divida o prompt em sujeito, papel da referência, estilo, composição e restrições.' },
    ],
    checklistHeading: 'Checklist final',
    checklistItems: [
      'Alguém reconhece o mesmo personagem, produto ou sistema sem ler o prompt?',
      'Os controles fixos ficaram fixos em pelo menos três imagens?',
      'A versão do prompt que resolveu o problema foi salva?',
      'Texto, logos, mãos e detalhes do produto servem para o canal real?',
      'A próxima imagem pode mudar uma variável em vez de reescrever tudo?',
    ],
    faqHeading: 'FAQ',
    faq: [
      ['Posso criar imagens IA consistentes de graça?', 'Dá para praticar com ferramentas grátis ou trial, mas a consistência depende mais de referência, prompts salvos e disciplina de revisão.'],
      ['Preciso de uma imagem de referência?', 'Use sempre que identidade importa. Se só mood ou estilo importa, uma folha de estilo escrita pode bastar.'],
      ['Como manter o mesmo personagem em cenas diferentes?', 'Prenda o personagem a uma referência, defina traços estáveis, mantenha câmera e paleta e mude só a cena.'],
      ['Por que meu produto muda?', 'O prompt provavelmente trata o produto como ideia. Diga que a referência controla silhueta, material, cor, rótulo e escala.'],
      ['Usar o mesmo seed ajuda?', 'Pode ajudar quando a ferramenta expõe seed, mas não substitui referência e esqueleto estável.'],
      ['Esse workflow cria vídeo de personagem consistente?', 'Ele prepara melhores referências estáticas, mas vídeo adiciona movimento, tempo e restrições quadro a quadro.'],
    ],
  },
  ja: {
    intro:
      '一貫した AI 画像を作るには、毎回の生成を単発のアイデアではなく、小さな制作システムとして扱います。必要なのは、参照画像のアンカー、再利用できるプロンプト骨格、スタイル表、修正ルールです。一貫性が崩れる原因は、固定すべき変数を守らずにプロンプトを書き直し続けることです。',
    tldrHeading: '要点：繰り返せるワークフロー',
    tldrItems: [
      '人物、商品の形、顔、服装、ロゴ位置、UI レイアウトが重要なら参照画像を使います。',
      '固定項目と変数を分けます。身元、スタイル、カメラ、色、比率、背景、変更する場面を分離します。',
      '最初の画像を生成し、最大のズレを診断して、その制御項目だけを修正します。',
      '解決したプロンプトを名前付きレシピとして保存し、次のシリーズ画像に複製します。',
      'Vogue AI では、精密な指示には GPT Image 2、参照画像の速いバリエーションには Nano Banana、強いムード探索には Midjourney が向いています。',
    ],
    whoHeading: '向いている人',
    whoText:
      'この方法は、人物、商品、キャンペーン、ビジュアルスタイルを複数画像で保ちたいクリエイター、マーケター、創業者、デザイナー向けです。ピクセル単位の完全一致ではなく、実用的なシリーズを作るためにズレを減らす方法です。',
    imagePlanHeading: 'このガイドの画像の役割',
    imagePlanHeaders: ['役割', 'ソース', '理由'],
    imagePlanRows: [
      ['ヒーロー', 'GPT Image 2 のストーリーボード画像', '複数フレームの例はシリーズの一貫性を説明しやすいため、カバーとして使います。'],
      ['身元セクション', 'Nano Banana の暗めのポートレート', '顔の参照画像は人物の一貫性と身元のズレを説明するのに適しています。'],
      ['スタイルセクション', 'Midjourney のファッション編集画像', '色、光、レンズ、ムードを保ちながら主体を変える考え方を示せます。'],
    ],
    controlsHeading: '一貫性は四つの制御で作る',
    controlsHeaders: ['制御', '固定するもの', '変えてよいもの', 'よくある失敗'],
    controlsRows: [
      ['身元', '顔、商品の形、服装の目印、ブランド要素、UI 階層。', 'ポーズ、場面、切り抜き、表情、背景。', '別人になったり商品が再設計されたりする。'],
      ['構図', '比率、カメラ距離、焦点、余白。', '場面の細部、小物、チャンネル形式。', '各画像が別キャンペーンのように見える。'],
      ['スタイル', '色、光、レンズ、質感、リアリティ。', '主体の動き、季節テーマ、環境。', '映画風、漫画風、スタジオ写真へ飛び移る。'],
      ['修正ルール', '解決済みの骨格と参照画像の役割。', '一度に一つの失敗だけ。', '一つ直すと三つ問題が増える。'],
    ],
    anchorHeading: 'ステップ 1：プロンプト前にアンカーを決める',
    anchorText:
      '同じ人物、物体、パッケージ、画面、キャンペーンに見せたいなら、最初にアンカーを決めます。Vogue AI では参照画像を使い、その参照が何を制御するかを明確に書きます。',
    identityAlt: '人物の身元を保つための Nano Banana ポートレート参照',
    identityCaption:
      '人物説明の近くにポートレート例を置く理由は、場面、光、服装を変えながら顔を認識可能に保つことが最も難しいからです。',
    anchorItems: [
      '人物：顔の形、年齢感、髪型、体型、象徴的な服の色。',
      '商品：シルエット、色、素材、ラベル位置、スケール。',
      'ブランドシリーズ：色、光、余白、文字の安全領域、アートディレクション。',
      'UI や画面：情報階層、デバイス枠、認識すべきプロダクト領域。',
    ],
    skeletonHeading: 'ステップ 2：固定フィールドと変数を分ける',
    skeletonText:
      '安定したプロンプトは、重要な部分では退屈なくらい一定です。身元、カメラ、色、出力ルールを固定し、場面、文脈、ポーズ、チャンネル要件だけを変えます。',
    styleHeading: 'ステップ 3：シリーズ用のスタイル表を作る',
    styleText:
      'スタイル表は、繰り返し使える視覚決定の短いリストです。長い形容詞より、どの項目が変わったかを確認しやすくなります。',
    styleAlt: '一貫したスタイルを説明する Midjourney ファッション編集例',
    styleCaption:
      'この画像の学びは主体のコピーではなく、光、影、編集的な切り取り、ファッションのムードを安定させることです。',
    styleHeaders: ['項目', '例', '重要な理由'],
    styleRows: [
      ['色', '黒、骨白、落ち着いた金、赤のアクセント。', '毎回別の配色になるのを防ぎます。'],
      ['光', '柔らかいキーライト、深い横影、弱いリムライト。', '場面が変わっても同じムードを保ちます。'],
      ['レンズと裁切', '85mm ポートレート感、胸上、3:4。', '同じ撮影シリーズのリズムを作ります。'],
      ['背景', '最小限のスタジオ壁、軽い質感、文字なし。', '一回限りのノイズを減らします。'],
      ['出力ルール', '透かしなし、生成文字なし、参照身元を保持。', '実務で使える素材にします。'],
    ],
    diagnoseHeading: 'ステップ 4：最初の結果を診断する',
    diagnoseText:
      '最初の画像は診断用です。身元が違えば参照の渡し方を強めます。構図が乱れていれば裁切と余白を直します。ブランド感が弱ければ色と光を修正します。',
    workedHeading: '実例：同じ人物を三つの場面へ',
    workedText:
      '依頼：若い陶芸家のローンチストーリーとして、スタジオポートレート、制作中、屋外マーケットの三枚を作る。人物は認識できる必要があり、ポーズと環境は変えてよい。',
    workedItems: [
      'アンカー：一枚のポートレートが顔、髪、年齢感、暖かい土色のジャケットを制御する。',
      'スタイル表：自然光、柔らかいフィルムコントラスト、浅い被写界深度、粘土とクリーム色、3:4。',
      '変数：スタジオ、粘土を成形する手元、マーケットブースへ場面を変更。',
      '確認ルール：顔、ジャケット色、色表がズレたら、好みを判断する前に差し戻す。',
    ],
    promptVersionHeading: 'プロンプト版 1',
    revisionHeading: '修正ルール',
    revisionText:
      '顔が変わったら、まだ場面は変えません。参照画像が顔の身元と髪を制御し、背景とポーズだけが変わると追加します。身元は正しいのにシリーズ感が弱い場合は、同じスタイル表を各場面に貼ります。',
    mistakesHeading: '失敗と修正',
    mistakesHeaders: ['問題', '先に直すこと', '避けること'],
    mistakesRows: [
      ['同じプロンプトで別人になる', '参照アンカーを使い、固定する特徴を書く。', '性格を表す形容詞を増やす。'],
      ['商品形状が変わる', '参照がシルエット、素材、ラベル、スケールを制御すると書く。', '形が安定する前に高級感を足す。'],
      ['スタイルがズレる', '同じ色、光、レンズ、裁切、背景を貼る。', '毎回新しいムードを作る。'],
      ['生成文字が素材を壊す', '空白を確保し、文字は別のデザインツールで入れる。', 'モデルに完璧な文字組みを求める。'],
      ['良い初回画像が修正で悪化する', '一度に一つの失敗だけを直す。', '新しい案を全部同じプロンプトに入れる。'],
    ],
    modelHeading: 'Vogue AI でのモデル選び',
    modelText:
      'モデル選びはワークフロー上の判断です。GPT Image 2 は精密な指示と参照受け渡しに強く、Nano Banana は速いバリエーションや SNS 向け実験に便利で、Midjourney はムードやファッション構図、強いスタイル探索に向いています。',
    linksTitle: 'Vogue AI で続ける',
    links: [
      { label: 'Vogue AI ワークスペースを開く', href: '/', description: '参照画像つきプロンプトを試し、身元が安定する版を保存します。' },
      { label: 'プロンプト設計のコツを読む', href: '/blog/prompt-engineering-tips', description: '商品、人物、ポスター、UI に固定制御の考え方を使います。' },
      { label: 'AI 画像プロンプトの構造を見る', href: '/blog/prompt-anatomy-for-ai-images', description: '主体、参照の役割、スタイル、構図、出力制約に分解します。' },
    ],
    checklistHeading: '最終チェック',
    checklistItems: [
      'プロンプトを読まなくても同じ人物、商品、ブランドだと分かりますか？',
      '少なくとも三枚で固定項目が固定されていますか？',
      '問題を解決したプロンプト版を保存しましたか？',
      '生成文字、ロゴ、手、商品の細部は実際の用途に使えますか？',
      '次の画像は一つの変数だけを変えて作れますか？',
    ],
    faqHeading: 'FAQ',
    faq: [
      ['無料で一貫した AI 画像を作れますか？', '練習はできます。ただし安定性は料金より、参照画像の扱い、保存したプロンプト、修正ルールに左右されます。'],
      ['参照画像は必要ですか？', '身元が重要なら必要です。ムードやスタイルだけなら、文章のスタイル表で足りる場合があります。'],
      ['同じ人物を別の場面に保つには？', '参照画像で固定し、安定した特徴を定義し、カメラと色を保ち、場面だけを変えます。'],
      ['商品が変形するのはなぜですか？', '商品を固定物ではなく概念として書いている可能性があります。参照が形、素材、色、ラベル位置、スケールを制御すると書きます。'],
      ['同じ seed は有効ですか？', 'ツールが seed を公開していれば助けになりますが、参照画像と安定した骨格の代わりにはなりません。'],
      ['この方法で一貫した人物動画も作れますか？', '静止画の参照を強くする準備にはなりますが、動画では動き、タイミング、フレーム間制約を別に確認する必要があります。'],
    ],
  },
  ko: {
    intro:
      '일관된 AI 이미지를 만들려면 매번의 생성을 별도 아이디어가 아니라 작은 제작 시스템으로 다뤄야 합니다. 하나의 레퍼런스 앵커, 재사용 가능한 프롬프트 뼈대, 스타일 시트, 수정 규칙이 필요합니다. 일관성이 깨지는 가장 흔한 이유는 고정해야 할 변수를 지키지 않고 프롬프트를 계속 다시 쓰는 것입니다.',
    tldrHeading: '핵심 요약: 반복 가능한 워크플로',
    tldrItems: [
      '정체성, 제품 형태, 얼굴, 의상, 로고 위치, UI 레이아웃이 중요하면 레퍼런스 이미지를 사용합니다.',
      '고정 제어와 변수 항목을 분리합니다: 정체성, 스타일, 카메라, 팔레트, 화면비, 배경, 장면 디테일.',
      '첫 이미지를 만든 뒤 가장 큰 드리프트를 진단하고, 그 제어 항목만 수정합니다.',
      '문제가 해결된 프롬프트를 레시피로 저장하고 다음 시리즈 이미지에 복제합니다.',
      'Vogue AI에서는 정밀한 지시는 GPT Image 2, 빠른 레퍼런스 변형은 Nano Banana, 강한 무드 탐색은 Midjourney가 적합합니다.',
    ],
    whoHeading: '누구에게 적합한가',
    whoText:
      '이 워크플로는 인물, 제품, 캠페인, 비주얼 스타일을 여러 이미지에서 유지해야 하는 크리에이터, 마케터, 창업자, 디자이너에게 적합합니다. 픽셀 단위의 완전한 연속성을 보장하지는 않지만, 실제로 쓸 수 있는 시리즈를 만들 만큼 드리프트를 줄입니다.',
    imagePlanHeading: '이 가이드의 이미지 역할',
    imagePlanHeaders: ['역할', '출처', '적합한 이유'],
    imagePlanRows: [
      ['히어로', 'GPT Image 2 스토리보드 이미지', '여러 프레임은 시리즈 일관성을 보여주기 좋아서 커버로만 사용합니다.'],
      ['정체성 섹션', 'Nano Banana 어두운 포트레이트', '얼굴 레퍼런스는 캐릭터 일관성과 얼굴 드리프트를 설명하기 좋습니다.'],
      ['스타일 섹션', 'Midjourney 패션 에디토리얼', '팔레트, 조명, 렌즈, 무드가 주제 변경에도 유지되는 방식을 보여줍니다.'],
    ],
    controlsHeading: '일관성은 네 가지 제어에서 나온다',
    controlsHeaders: ['제어 항목', '고정할 것', '바꿀 수 있는 것', '흔한 실패'],
    controlsRows: [
      ['정체성', '얼굴, 제품 형태, 의상 앵커, 브랜드 표시, UI 계층.', '포즈, 장면, 크롭, 표정, 배경.', '모델이 다른 사람을 만들거나 제품을 다시 디자인합니다.'],
      ['구도', '화면비, 카메라 거리, 초점, 여백.', '장면 디테일, 소품, 채널 형식.', '각 이미지가 서로 다른 캠페인처럼 보입니다.'],
      ['스타일', '팔레트, 조명, 렌즈, 질감, 사실감 수준.', '주제 행동, 시즌 테마, 환경.', '시리즈가 영화풍, 만화풍, 스튜디오 사진으로 흔들립니다.'],
      ['수정 규칙', '해결된 프롬프트 뼈대와 레퍼런스 역할.', '한 번에 하나의 실패만.', '하나를 고치다 세 가지 문제가 생깁니다.'],
    ],
    anchorHeading: '1단계: 프롬프트 전에 앵커를 정한다',
    anchorText:
      '같은 사람, 물체, 패키지, 인터페이스, 캠페인처럼 보여야 한다면 먼저 앵커를 정합니다. Vogue AI에서는 보통 레퍼런스 이미지를 업로드하거나 선택하고, 그 레퍼런스가 무엇을 제어하는지 정확히 씁니다.',
    identityAlt: '캐릭터 정체성 유지를 위한 Nano Banana 포트레이트 레퍼런스',
    identityCaption:
      '얼굴을 유지하는 문제가 가장 잘 보이기 때문에, 포트레이트 예시는 정체성 설명 근처에 있어야 합니다. 장면, 조명, 의상을 바꿔도 얼굴은 알아볼 수 있어야 합니다.',
    anchorItems: [
      '캐릭터: 얼굴형, 나이대, 헤어스타일, 신체 비율, 대표 의상 색상.',
      '제품: 실루엣, 색상, 소재, 라벨 위치, 스케일.',
      '브랜드 시리즈: 팔레트, 조명, 여백, 텍스트 안전 영역, 아트 디렉션.',
      'UI 또는 앱 화면: 정보 계층, 디바이스 프레임, 인식 가능한 제품 영역.',
    ],
    skeletonHeading: '2단계: 고정 필드와 변수 필드를 나눈다',
    skeletonText:
      '일관된 프롬프트는 중요한 부분에서 안정적이어야 합니다. 정체성, 카메라, 팔레트, 출력 규칙은 유지하고 장면, 제품 맥락, 포즈, 채널 요구만 바꿉니다.',
    styleHeading: '3단계: 시리즈용 스타일 시트를 만든다',
    styleText:
      '스타일 시트는 반복 가능한 시각 결정을 짧게 정리한 목록입니다. 긴 문단보다 어떤 항목이 바뀌었는지 확인하기 쉽습니다.',
    styleAlt: '일관된 스타일을 설명하는 Midjourney 패션 에디토리얼 예시',
    styleCaption:
      '이 이미지는 주제를 복사하는 예시가 아니라 조명, 그림자, 에디토리얼 크롭, 패션 무드를 안정적으로 유지하는 예시입니다.',
    styleHeaders: ['스타일 항목', '예시값', '중요한 이유'],
    styleRows: [
      ['팔레트', '블랙, 본 화이트, muted gold, 빨간 포인트 하나.', '각 이미지가 새 색상 체계를 만들지 않게 합니다.'],
      ['조명', '부드러운 키라이트, 깊은 측면 그림자, 약한 림라이트.', '장면이 바뀌어도 무드를 유지합니다.'],
      ['렌즈와 크롭', '85mm 포트레이트 느낌, 가슴 위 크롭, 3:4.', '한 번의 촬영처럼 보이게 합니다.'],
      ['배경', '미니멀한 스튜디오 벽, 약한 질감, 텍스트 없음.', '불필요한 디테일을 줄입니다.'],
      ['출력 규칙', '워터마크 없음, 생성된 타이포 없음, 레퍼런스 정체성 유지.', '실제 제작에 쓸 수 있게 보호합니다.'],
    ],
    diagnoseHeading: '4단계: 첫 결과를 먼저 진단한다',
    diagnoseText:
      '첫 결과는 진단용입니다. 정체성이 틀리면 레퍼런스 전달을 강화하고, 구도가 복잡하면 크롭과 여백을 조정합니다. 브랜드감이 맞지 않으면 팔레트와 조명을 고칩니다.',
    workedHeading: '예시: 한 캐릭터를 세 장면으로 만들기',
    workedText:
      '작업: 젊은 도예가의 론칭 스토리를 위해 스튜디오 포트레이트, 제작 장면, 야외 마켓 부스 이미지를 만든다. 인물은 계속 알아볼 수 있어야 하지만 포즈와 환경은 바뀔 수 있다.',
    workedItems: [
      '앵커: 포트레이트 한 장이 얼굴형, 헤어스타일, 나이대, 따뜻한 흙색 재킷을 제어합니다.',
      '스타일 시트: 자연광, 부드러운 필름 대비, 얕은 심도, 점토와 크림 팔레트, 3:4.',
      '변수: 장면이 스튜디오 포트레이트에서 도예 작업, 마켓 부스로 바뀝니다.',
      '검수 규칙: 얼굴 정체성, 재킷 색, 팔레트가 흔들리면 미적 취향을 보기 전에 거절합니다.',
    ],
    promptVersionHeading: '프롬프트 버전 1',
    revisionHeading: '수정 규칙',
    revisionText:
      '얼굴이 바뀌면 아직 장면을 바꾸지 마세요. 업로드한 레퍼런스가 얼굴 정체성과 헤어를 제어하고, 배경과 포즈만 바뀔 수 있다고 추가합니다. 정체성은 맞지만 시리즈가 연결되지 않으면 같은 스타일 시트를 모든 장면 프롬프트에 붙입니다.',
    mistakesHeading: '실수와 수정',
    mistakesHeaders: ['문제', '먼저 고칠 것', '피할 것'],
    mistakesRows: [
      ['같은 프롬프트가 다른 사람을 만든다', '레퍼런스를 쓰고 고정할 정체성 특징을 명시합니다.', '성격 형용사를 더 추가하기.'],
      ['제품 형태가 계속 변한다', '레퍼런스가 실루엣, 소재, 라벨 위치, 스케일을 제어한다고 씁니다.', '형태 안정 전에 프리미엄 스타일을 추가하기.'],
      ['스타일이 흔들린다', '같은 팔레트, 조명, 렌즈, 크롭, 배경을 반복합니다.', '프롬프트마다 새 무드를 만들기.'],
      ['생성 텍스트가 이미지를 망친다', '빈 공간을 예약하고 텍스트는 디자인 도구에서 추가합니다.', '모델에게 완벽한 최종 문구를 쓰게 하기.'],
      ['좋은 첫 이미지가 수정 후 나빠진다', '한 번에 하나의 명확한 실패만 수정합니다.', '모든 새 아이디어를 한 프롬프트에 넣기.'],
    ],
    modelHeading: 'Vogue AI에서 모델 선택',
    modelText:
      '모델 선택은 워크플로 결정입니다. GPT Image 2는 정밀한 지시와 레퍼런스 전달에 강하고, Nano Banana는 빠른 변형과 소셜 실험에 유용하며, Midjourney는 무드, 패션 구도, 표현적 스타일 탐색에 적합합니다.',
    linksTitle: 'Vogue AI에서 계속하기',
    links: [
      { label: 'Vogue AI 워크스페이스 열기', href: '/', description: '레퍼런스 기반 프롬프트를 테스트하고 정체성이 안정된 버전을 저장합니다.' },
      { label: '프롬프트 엔지니어링 팁 읽기', href: '/blog/prompt-engineering-tips', description: '제품, 포트레이트, 포스터, UI 프롬프트에 고정 제어 방식을 적용합니다.' },
      { label: 'AI 이미지 프롬프트 구조 보기', href: '/blog/prompt-anatomy-for-ai-images', description: '주제, 레퍼런스 역할, 스타일, 구도, 출력 제한으로 나눠봅니다.' },
    ],
    checklistHeading: '최종 체크리스트',
    checklistItems: [
      '프롬프트를 읽지 않아도 같은 캐릭터, 제품, 브랜드 시스템으로 보이나요?',
      '최소 세 장에서 고정 제어가 유지되었나요?',
      '문제를 해결한 프롬프트 버전을 저장했나요?',
      '생성 텍스트, 로고, 손, 제품 디테일이 실제 채널에 쓸 수 있나요?',
      '다음 이미지를 한 변수만 바꿔 만들 수 있나요?',
    ],
    faqHeading: 'FAQ',
    faq: [
      ['무료로 일관된 AI 이미지를 만들 수 있나요?', '연습은 가능합니다. 하지만 안정성은 가격보다 레퍼런스 처리, 저장된 프롬프트, 수정 규칙에 더 크게 좌우됩니다.'],
      ['레퍼런스 이미지가 꼭 필요한가요?', '정체성이 중요하면 필요합니다. 무드나 스타일만 중요하다면 글로 된 스타일 시트로 충분할 수 있습니다.'],
      ['같은 캐릭터를 다른 장면에 유지하려면?', '레퍼런스로 캐릭터를 고정하고 안정적 특징을 정의한 뒤 카메라와 팔레트를 유지하고 장면만 바꿉니다.'],
      ['왜 제품이 계속 변하나요?', '프롬프트가 제품을 고정 물체가 아니라 아이디어로 다루고 있을 수 있습니다. 레퍼런스가 실루엣, 소재, 색상, 라벨 위치, 스케일을 제어한다고 쓰세요.'],
      ['같은 seed를 쓰면 도움이 되나요?', '도구가 seed를 제공한다면 도움은 되지만 레퍼런스 앵커와 안정된 프롬프트 뼈대를 대체하지는 못합니다.'],
      ['이 방식으로 일관된 캐릭터 비디오도 만들 수 있나요?', '더 강한 정적 레퍼런스를 준비하는 데는 도움이 되지만, 비디오는 움직임, 타이밍, 프레임 간 제약을 별도로 봐야 합니다.'],
    ],
  },
} satisfies Record<SupportedBlogLocale, ConsistentCopy>;

const makeLocalizedContent = (locale: SupportedBlogLocale): BlogContentBlock[] => {
  const copy = localizedCopy[locale];

  return [
    { type: 'paragraph', text: copy.intro },
    { type: 'heading', level: 2, text: copy.tldrHeading },
    { type: 'list', items: copy.tldrItems },
    { type: 'heading', level: 2, text: copy.whoHeading },
    { type: 'paragraph', text: copy.whoText },
    { type: 'heading', level: 2, text: copy.imagePlanHeading },
    { type: 'table', headers: copy.imagePlanHeaders, rows: copy.imagePlanRows },
    { type: 'heading', level: 2, text: copy.controlsHeading },
    { type: 'table', headers: copy.controlsHeaders, rows: copy.controlsRows },
    { type: 'heading', level: 2, text: copy.anchorHeading },
    { type: 'paragraph', text: copy.anchorText },
    { type: 'image', src: promptLibraryImages.identity, alt: copy.identityAlt, caption: copy.identityCaption },
    { type: 'list', items: copy.anchorItems },
    { type: 'heading', level: 2, text: copy.skeletonHeading },
    { type: 'paragraph', text: copy.skeletonText },
    { type: 'list', items: [...promptBlocks] },
    { type: 'heading', level: 2, text: copy.styleHeading },
    { type: 'paragraph', text: copy.styleText },
    { type: 'image', src: promptLibraryImages.style, alt: copy.styleAlt, caption: copy.styleCaption },
    { type: 'table', headers: copy.styleHeaders, rows: copy.styleRows },
    { type: 'heading', level: 2, text: copy.diagnoseHeading },
    { type: 'paragraph', text: copy.diagnoseText },
    { type: 'heading', level: 2, text: copy.workedHeading },
    { type: 'paragraph', text: copy.workedText },
    { type: 'list', items: copy.workedItems },
    { type: 'heading', level: 3, text: copy.promptVersionHeading },
    { type: 'list', items: ['Use the uploaded portrait as the identity anchor for a young ceramic artist. Preserve face shape, hairstyle, age range, and warm earth-tone jacket. Create a natural daylight studio portrait in a ceramics workspace, soft film contrast, shallow depth of field, clay and cream palette, 3:4 aspect ratio, no extra people, no text, no watermark.'] },
    { type: 'heading', level: 3, text: copy.revisionHeading },
    { type: 'paragraph', text: copy.revisionText },
    { type: 'heading', level: 2, text: copy.mistakesHeading },
    { type: 'table', headers: copy.mistakesHeaders, rows: copy.mistakesRows },
    { type: 'heading', level: 2, text: copy.modelHeading },
    { type: 'paragraph', text: copy.modelText },
    { type: 'links', title: copy.linksTitle, items: copy.links },
    { type: 'heading', level: 2, text: copy.checklistHeading },
    { type: 'list', items: copy.checklistItems },
    { type: 'heading', level: 2, text: copy.faqHeading },
    ...copy.faq.flatMap(([question, answer]) => [
      { type: 'heading' as const, level: 3 as const, text: question },
      { type: 'paragraph' as const, text: answer },
    ]),
  ];
};

export const howToCreateConsistentAiImagesAutoBlogPost: BlogPostSource = {
  slug: 'how-to-create-consistent-ai-images',
  date: '2026-06-28',
  updatedAt: '2026-06-28',
  author: 'Vogue AI Team',
  image: promptLibraryImages.hero,
  imageAlt: 'Storyboard workflow example for creating consistent AI images',
  articleType: 'tutorial',
  modelTags: ['vogue-ai', 'gpt-image-2', 'nano-banana', 'midjourney'],
  readingMinutes: 10,
  localizations: {
    en: {
      title: 'How to create consistent AI images without losing control',
      summary: 'A practical Vogue AI workflow for consistent characters, products, and visual series using reference images, prompt skeletons, style sheets, and revision rules.',
      seoTitle: 'How to Create Consistent AI Images',
      seoDescription: 'Learn how to create consistent AI images with references, reusable prompts, style sheets, model choices, mistakes, fixes, and copyable examples.',
      content: enContent,
    },
    zh: { title: '如何创建一致的 AI 图像', summary: '用参考图、提示词骨架、风格表和修正规则，在 Vogue AI 中稳定角色、产品和系列视觉。', seoTitle: '如何创建一致的 AI 图像', seoDescription: '学习用参考图、可复用提示词、风格表、模型选择和修正规则创建一致的 AI 图像。', content: makeLocalizedContent('zh') },
    fr: { title: 'Comment créer des images IA cohérentes', summary: "Un workflow Vogue AI pour stabiliser personnages, produits et séries visuelles avec références, prompts réutilisables et règles de révision.", seoTitle: 'Comment créer des images IA cohérentes', seoDescription: "Apprenez à créer des images IA cohérentes avec références, prompts réutilisables, feuilles de style, choix de modèle et corrections.", content: makeLocalizedContent('fr') },
    ru: { title: 'Как создавать стабильные AI-изображения', summary: 'Практический процесс Vogue AI для персонажей, продуктов и визуальных серий с референсами, prompt-скелетами и правилами правки.', seoTitle: 'Как создавать стабильные AI-изображения', seoDescription: 'Узнайте, как создавать стабильные AI-изображения с референсами, reusable prompts, style sheets, выбором модели и исправлениями.', content: makeLocalizedContent('ru') },
    pt: { title: 'Como criar imagens IA consistentes', summary: 'Um workflow Vogue AI para manter personagens, produtos e séries visuais estáveis com referências, prompts reutilizáveis e regras de revisão.', seoTitle: 'Como criar imagens IA consistentes', seoDescription: 'Aprenda a criar imagens IA consistentes com referências, prompts reutilizáveis, folhas de estilo, escolha de modelo e correções.', content: makeLocalizedContent('pt') },
    ja: { title: '一貫した AI 画像を作る方法', summary: 'reference、prompt skeleton、style sheet、revision rule を使い、Vogue AI で人物、商品、シリーズ表現を安定させる実践ガイドです。', seoTitle: '一貫した AI 画像 実践ガイド', seoDescription: 'reference、再利用 prompt、style sheet、model 選び、修正ルールで一貫した AI 画像を作る方法を学べます。', content: makeLocalizedContent('ja') },
    ko: { title: '일관된 AI 이미지를 만드는 방법', summary: 'reference, prompt skeleton, style sheet, revision rule로 Vogue AI에서 인물, 제품, 시리즈 비주얼을 안정화하는 실전 가이드입니다.', seoTitle: '일관된 AI 이미지 실전 가이드', seoDescription: 'reference, 재사용 prompt, style sheet, model 선택, 수정 규칙으로 일관된 AI 이미지를 만드는 방법을 배웁니다.', content: makeLocalizedContent('ko') },
  },
};
