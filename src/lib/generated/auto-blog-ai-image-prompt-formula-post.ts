import type { BlogContentBlock, BlogPostSource } from '@/lib/blog-data';

const images = {
  hero:
    'https://media.vogueai.net/prompt-libraries/awesome-gptimage2-prompts/vogueai-20260611-technical-blueprint-product-infographic-ai-prompt/technical-blueprint-product-infographic-ai-prompt-generic-mixed-reality-headset-lens-stack-sensors-01.png',
  product:
    'https://media.vogueai.net/blog/auto/gemini-ai-photo-prompt-copy-paste-trending/a6b15580403b-premium-street-food-product-photograph-crispy-fried-1.jpg',
  campaign:
    'https://media.vogueai.net/blog/auto/gemini-ai-photo-prompt-copy-paste-trending/4905f63747d7-high-impact-cinematic-sports-advertising-poster-featuring-1.jpg',
} as const;

const formulaPromptBlocks = [
  'Formula: [subject] + [job context] + [composition] + [style controls] + [reference handoff] + [output rules] + [review check].',
  'Product hero formula: Premium product photograph of [product], for [channel], [camera angle], [material detail], [background], [lighting], [reference controls], [aspect ratio], no text, no watermark.',
  'Portrait formula: Editorial portrait of [person], for [campaign goal], [crop], [wardrobe palette], [lighting], preserve [identity details] from reference, [aspect ratio], no extra hands, no text.',
  'Social poster formula: Campaign visual for [topic], [main subject], [negative space for headline], [color system], [lighting mood], [channel ratio], keep text area empty.',
] as const;

type LocaleCopy = {
  title: string;
  summary: string;
  seoTitle: string;
  seoDescription: string;
  intro: string;
  tldrHeading: string;
  tldrItems: string[];
  intentHeading: string;
  intentText: string;
  formulaHeading: string;
  formulaRows: string[][];
  matrixHeading: string;
  matrixRows: string[][];
  stepsHeading: string;
  stepItems: string[];
  promptHeading: string;
  promptIntro: string;
  productImageAlt: string;
  imageCaption: string;
  workedHeading: string;
  rawHeading: string;
  rawText: string;
  promptVersionHeading: string;
  campaignImageAlt: string;
  campaignCaption: string;
  diagnosisHeading: string;
  diagnosisText: string;
  ruleTitle: string;
  ruleText: string;
  failureHeading: string;
  failureRows: string[][];
  vogueHeading: string;
  vogueText: string;
  checklistHeading: string;
  checklistItems: string[];
  faqHeading: string;
  faq: Array<[string, string]>;
};

const en: LocaleCopy = {
  title: 'AI image prompt formula for product, portrait, and social visuals',
  summary:
    'A practical AI image prompt formula for turning product, portrait, social, and UI briefs into controlled first drafts inside Vogue AI.',
  seoTitle: 'AI Image Prompt Formula Guide',
  seoDescription:
    'Use this AI image prompt formula to structure subjects, composition, references, output rules, and revisions for more controlled image generations.',
  intro:
    'The best AI image prompt formula is not a magic sentence. It is a repeatable order of controls: subject, job context, composition, style, reference handoff, output rules, and the first review check.',
  tldrHeading: 'TL;DR: use one formula, then swap the variables',
  tldrItems: [
    'Write the subject before style so the model knows what must stay stable.',
    'Name the job context: product page, ad, avatar, poster, gallery card, or UI mockup.',
    'Add composition and output rules before decorative mood words.',
    'Use references only after you state what the reference controls.',
    'Review the first result against one failure mode before rewriting the whole prompt.',
  ],
  intentHeading: 'What this formula is for',
  intentText:
    'Searchers looking for an AI image prompt formula usually need a reusable template, not a list of inspiration. The formula should make the first draft easier to judge and the second draft easier to improve.',
  formulaHeading: 'The seven-part AI image prompt formula',
  formulaRows: [
    ['Part', 'Write this', 'Why it matters'],
    ['Subject', 'The exact product, person, scene, object, or interface.', 'This anchors every later instruction.'],
    ['Job context', 'Where the image will be used and who it is for.', 'A social post, product page, and hero banner need different crops.'],
    ['Composition', 'Crop, camera distance, angle, negative space, and hierarchy.', 'This prevents messy first generations.'],
    ['Style controls', 'Material, palette, lighting, realism, mood, and brand tone.', 'Style works best after the subject is stable.'],
    ['Reference handoff', 'What the uploaded image controls and what can change.', 'This protects identity, packaging, face, UI, or logo placement.'],
    ['Output rules', 'Aspect ratio, text policy, safe area, no watermark, transparent background.', 'These make the result usable in production.'],
    ['Review check', 'The first thing you will inspect after generation.', 'This keeps the next revision focused.'],
  ],
  matrixHeading: 'Formula variants by job',
  matrixRows: [
    ['Job', 'Formula emphasis', 'Reference need', 'First review check'],
    ['Product hero', 'Subject + material + clean background + output ratio.', 'Packaging or silhouette reference when exact shape matters.', 'Product shape and material texture.'],
    ['Portrait campaign', 'Identity + expression + wardrobe + crop.', 'Face reference when likeness matters.', 'Face stability before mood.'],
    ['Social poster', 'Focal subject + negative space + channel ratio.', 'Optional unless the subject is branded.', 'Headline-safe space and clutter.'],
    ['UI mockup', 'Device framing + screen hierarchy + environment.', 'UI screenshot when structure matters.', 'Screen legibility and perspective.'],
  ],
  stepsHeading: 'How to fill the formula without overloading it',
  stepItems: [
    'Start with one sentence for the subject and job.',
    'Add one composition sentence with crop, camera, and negative space.',
    'Add style controls in a separate phrase so you can remove them later.',
    'Add reference instructions only when identity or layout must survive.',
    'End with output rules and the failure you will check first.',
  ],
  promptHeading: 'Copyable formula templates',
  promptIntro:
    'Keep these prompt blocks in English when you paste them into Vogue AI. Replace bracketed variables, then keep the formula stable for the first generation.',
  productImageAlt: 'Product image prompt formula example from the Vogue AI prompt library',
  imageCaption:
    'A product photo prompt benefits from an explicit formula because material, lighting, background, crop, and text policy all affect whether the image is usable.',
  workedHeading: 'Worked example: formula for a launch product image',
  rawHeading: 'Raw brief',
  rawText:
    'Create a launch image for a translucent vitamin serum bottle. It must work as a product-page hero and a paid social crop. The bottle shape, cap color, and label position must stay stable.',
  promptVersionHeading: 'Prompt built from the formula',
  campaignImageAlt: 'Campaign prompt formula example from the Vogue AI prompt library',
  campaignCaption:
    'Campaign-style examples show why formula variables for ratio, negative space, and output rules should be explicit before generation.',
  diagnosisHeading: 'First-result diagnosis',
  diagnosisText:
    'If the image looks premium but the bottle shape changes, the missing piece is reference handoff. If the shape is right but the frame feels like stock photography, adjust job context, crop, and lighting before adding more adjectives.',
  ruleTitle: 'Formula rule',
  ruleText:
    'Do not add all details at once. Fill the seven parts, generate once, then change only the part that explains the failure.',
  failureHeading: 'Common formula mistakes and fixes',
  failureRows: [
    ['Problem', 'Formula part to fix', 'Avoid'],
    ['Generic output', 'Job context and audience.', 'Adding five more style adjectives.'],
    ['Wrong product shape', 'Subject and reference handoff.', 'Switching models before clarifying identity.'],
    ['Bad crop', 'Composition and output rules.', 'Changing the entire prompt.'],
    ['Messy text or logo', 'Output rules and text policy.', 'Asking the model to typeset final marketing copy.'],
    ['Inconsistent series', 'Reusable variables.', 'Writing every prompt from scratch.'],
  ],
  vogueHeading: 'Use the formula inside Vogue AI',
  vogueText:
    'In Vogue AI, start from a prompt-library image that matches the job, then replace the variable fields in the formula. Keep a version note for subject, reference role, ratio, and the first fix you applied.',
  checklistHeading: 'Reusable prompt formula checklist',
  checklistItems: [
    'Can someone identify the exact subject from the first sentence?',
    'Does the prompt name the real channel or use case?',
    'Are crop and negative space explicit?',
    'Does any reference image have a clear job?',
    'Do output rules say what to avoid?',
    'Is there one review check for the first result?',
  ],
  faqHeading: 'FAQ',
  faq: [
    ['What is the best AI image prompt formula?', 'Use subject, job context, composition, style controls, reference handoff, output rules, and a review check. The order matters because each part gives the model a more stable job.'],
    ['Should every prompt use all seven parts?', 'No. Simple ideas can use fewer parts, but production images need the full formula when identity, crop, brand style, or output format matters.'],
    ['Where do style words belong?', 'After subject and composition. Style words are useful, but they should not replace the actual production brief.'],
    ['When should I use a reference image?', 'Use one when the product shape, face, packaging, logo position, color system, or UI hierarchy must stay recognizable.'],
    ['Can I reuse one formula for multiple images?', 'Yes. Keep the structure and swap variables such as product, background, channel, ratio, and reference role.'],
    ['How do I fix a bad first result?', 'Find the failed formula part first. Fix subject, crop, reference handoff, or output rule before rewriting style language.'],
  ],
};

const zh: LocaleCopy = {
  ...en,
  title: 'AI 图片提示词公式：产品、人像和社媒图的可复用结构',
  summary:
    '一套可复用的 AI 图片提示词公式，帮助你把产品、人像、社媒和 UI 需求拆成可控初稿。',
  seoTitle: 'AI 图片提示词公式指南',
  seoDescription:
    '学习 AI 图片提示词公式：主体、场景、构图、风格、参考图交接、输出规则和首轮检查。',
  intro:
    '好的 AI 图片提示词公式不是一句万能咒语，而是一组固定控制顺序：主体、使用场景、构图、风格、参考图交接、输出规则和首轮检查。',
  tldrHeading: 'TL;DR：固定公式，只替换变量',
  tldrItems: [
    '先写主体，再写风格，保证模型知道什么必须稳定。',
    '写清用途：产品页、广告、头像、海报、图库卡片或 UI mockup。',
    '在情绪词之前先给出构图和输出规则。',
    '只有在说明参考图负责什么之后，才加入参考图。',
    '首轮结果只按一个失败点修改，不要整段重写。',
  ],
  intentHeading: '这个公式解决什么问题',
  intentText:
    '搜索 AI image prompt formula 的人通常需要可复用模板，而不是灵感清单。公式的价值是让第一张图更容易判断，第二轮修改更容易执行。',
  formulaHeading: '七段式 AI 图片提示词公式',
  formulaRows: [
    ['部分', '写什么', '为什么重要'],
    ['主体', '明确产品、人物、场景、物体或界面。', '它决定后面所有指令围绕什么保持稳定。'],
    ['使用场景', '图片用于哪里、给谁看。', '产品页、社媒广告和首页横幅需要不同裁切。'],
    ['构图', '裁切、机位距离、角度、留白和视觉层级。', '能减少首轮生成的杂乱和误裁。'],
    ['风格控制', '材质、色板、灯光、真实感、情绪和品牌气质。', '主体稳定后再加风格，结果更可控。'],
    ['参考图交接', '上传图片负责保留什么、哪些可以变化。', '保护身份、包装、人脸、UI 或 logo 位置。'],
    ['输出规则', '比例、文字策略、安全区、无水印、透明背景等。', '让结果更接近可直接生产使用。'],
    ['首轮检查', '生成后先看哪一个成败点。', '避免每次修改都变成整段重写。'],
  ],
  matrixHeading: '按任务选择公式重点',
  matrixRows: [
    ['任务', '公式重点', '是否需要参考图', '首轮先检查'],
    ['产品主图', '主体、材质、干净背景和输出比例。', '形状必须准确时用包装或轮廓参考图。', '产品形状和材质质感。'],
    ['人像活动图', '身份、表情、服装和裁切。', '需要保脸时使用人脸参考图。', '先看脸部稳定，再看氛围。'],
    ['社媒海报', '焦点主体、标题留白和渠道比例。', '除非主体有品牌要求，否则可选。', '标题安全区和画面拥挤度。'],
    ['UI mockup', '设备框、屏幕层级和使用环境。', '需要保留界面结构时用 UI 截图。', '屏幕可读性和透视。'],
  ],
  stepsHeading: '如何填写公式而不堆砌',
  stepItems: [
    '先用一句话写清主体和用途。',
    '单独写构图句，包括裁切、机位和留白。',
    '把风格控制放在独立短语里，后续才方便删改。',
    '只有身份或版式必须保持时，才写参考图规则。',
    '结尾写输出规则，以及首轮要检查的失败点。',
  ],
  promptHeading: '可复制的公式模板',
  promptIntro:
    '这些提示词块保留英文，方便直接粘贴到 Vogue AI。替换括号变量后，首轮生成不要改动整体公式。',
  productImageAlt: 'Vogue AI 提示词库中的产品图公式示例',
  imageCaption:
    '产品图提示词最需要公式化，因为材质、灯光、背景、比例和文字规则都会影响结果是否可用。',
  workedHeading: '实战例子：新品产品图公式',
  rawHeading: '原始需求',
  rawText:
    '为一瓶半透明维生素精华做发布图。它要能用于产品页主图和付费社媒裁切，瓶身形状、瓶盖颜色和标签位置必须稳定。',
  promptVersionHeading: '由公式生成的提示词',
  campaignImageAlt: 'Vogue AI 提示词库中的活动海报公式示例',
  campaignCaption:
    '活动海报类示例能说明：比例、标题留白和输出规则必须在生成前写清楚。',
  diagnosisHeading: '首轮诊断',
  diagnosisText:
    '如果画面很高级但瓶形变了，缺的是参考图交接。如果瓶形正确但像图库图，先改使用场景、裁切和灯光，不要继续堆形容词。',
  ruleTitle: '公式规则',
  ruleText: '不要一次加入所有细节。先填七段公式，生成一次，再只修改解释失败的那一段。',
  failureHeading: '常见公式错误与修正',
  failureRows: [
    ['问题', '应该修正的公式部分', '不要先做什么'],
    ['结果很泛', '使用场景和受众。', '继续堆五个风格形容词。'],
    ['产品形状错误', '主体和参考图交接。', '还没澄清身份就换模型。'],
    ['裁切不可用', '构图和输出规则。', '整段提示词推倒重写。'],
    ['文字或 logo 混乱', '输出规则和文字策略。', '让模型直接排最终营销文案。'],
    ['系列图不一致', '可复用变量。', '每一张都从零写提示词。'],
  ],
  vogueHeading: '在 Vogue AI 中使用这个公式',
  vogueText:
    '在 Vogue AI 里，先选一个和任务相近的提示词库图片，再替换公式变量。保存主体、参考图职责、比例和首轮修正记录。',
  checklistHeading: '可复用公式检查表',
  checklistItems: [
    '第一句话是否能明确识别主体？',
    '是否写清真实渠道或用途？',
    '裁切和留白是否明确？',
    '参考图是否有清楚职责？',
    '输出规则是否说明避免什么？',
    '首轮结果是否只有一个检查点？',
  ],
  faqHeading: 'FAQ',
  faq: [
    ['最好的 AI 图片提示词公式是什么？', '主体、使用场景、构图、风格控制、参考图交接、输出规则和首轮检查。顺序很重要，因为它让模型先理解任务再处理风格。'],
    ['每条提示词都要七段吗？', '不需要。简单创意可以更短，但涉及身份、裁切、品牌风格或输出格式时，完整公式更稳。'],
    ['风格词应该放在哪里？', '放在主体和构图之后。风格词有用，但不能代替真实制作需求。'],
    ['什么时候需要参考图？', '当产品形状、人脸、包装、logo 位置、色彩系统或 UI 层级必须保持时。'],
    ['一个公式能复用到多张图吗？', '可以。保留结构，替换产品、背景、渠道、比例和参考图职责。'],
    ['首轮结果不好怎么改？', '先找失败的是哪一段公式，再改主体、裁切、参考图交接或输出规则。'],
  ],
};

const makeContent = (copy: LocaleCopy): BlogContentBlock[] => [
  { type: 'paragraph', text: copy.intro },
  { type: 'heading', level: 2, text: copy.tldrHeading },
  { type: 'list', items: copy.tldrItems },
  { type: 'heading', level: 2, text: copy.intentHeading },
  { type: 'paragraph', text: copy.intentText },
  { type: 'heading', level: 2, text: copy.formulaHeading },
  {
    type: 'table',
    headers: copy.formulaRows[0],
    rows: copy.formulaRows.slice(1),
  },
  { type: 'heading', level: 2, text: copy.matrixHeading },
  {
    type: 'table',
    headers: copy.matrixRows[0],
    rows: copy.matrixRows.slice(1),
  },
  { type: 'heading', level: 2, text: copy.stepsHeading },
  { type: 'list', items: copy.stepItems },
  { type: 'heading', level: 2, text: copy.promptHeading },
  { type: 'paragraph', text: copy.promptIntro },
  {
    type: 'image',
    src: images.product,
    alt: copy.productImageAlt,
    caption: copy.imageCaption,
  },
  { type: 'list', items: [...formulaPromptBlocks] },
  { type: 'heading', level: 2, text: copy.workedHeading },
  { type: 'heading', level: 3, text: copy.rawHeading },
  { type: 'paragraph', text: copy.rawText },
  { type: 'heading', level: 3, text: copy.promptVersionHeading },
  {
    type: 'list',
    items: [
      'Premium product-page hero photograph of a translucent vitamin serum bottle, centered on a pale blue glass stage, visible liquid refraction, stable bottle silhouette and silver cap, clean label area preserved from reference image, soft studio rim light, subtle reflection, 4:5 aspect ratio, no added text, no watermark.',
    ],
  },
  {
    type: 'image',
    src: images.campaign,
    alt: copy.campaignImageAlt,
    caption: copy.campaignCaption,
  },
  { type: 'heading', level: 3, text: copy.diagnosisHeading },
  { type: 'paragraph', text: copy.diagnosisText },
  { type: 'callout', title: copy.ruleTitle, text: copy.ruleText },
  { type: 'heading', level: 2, text: copy.failureHeading },
  {
    type: 'table',
    headers: copy.failureRows[0],
    rows: copy.failureRows.slice(1),
  },
  { type: 'heading', level: 2, text: copy.vogueHeading },
  { type: 'paragraph', text: copy.vogueText },
  { type: 'heading', level: 2, text: copy.checklistHeading },
  { type: 'list', items: copy.checklistItems },
  { type: 'heading', level: 2, text: copy.faqHeading },
  ...copy.faq.flatMap(([question, answer]) => [
    { type: 'heading' as const, level: 3 as const, text: question },
    { type: 'paragraph' as const, text: answer },
  ]),
];

const fr: LocaleCopy = {
  ...en,
  title: "Formule de prompt d'image IA pour des résultats contrôlés",
  summary:
    'Une formule pratique pour transformer des briefs produit, portrait, social et UI en premiers visuels contrôlés dans Vogue AI.',
  seoTitle: "Guide de formule de prompt d'image IA",
  seoDescription:
    "Structurez sujet, composition, références, règles de sortie et corrections avec une formule de prompt d'image IA réutilisable.",
  intro:
    "Une bonne formule de prompt d'image IA n'est pas une phrase magique. C'est un ordre de contrôle: sujet, contexte, composition, style, référence, règles de sortie et premier diagnostic.",
  tldrHeading: 'TL;DR : gardez la formule, changez les variables',
  tldrItems: [
    'Écrivez le sujet avant le style.',
    "Nommez le contexte d'usage: produit, publicité, avatar, poster ou UI.",
    'Ajoutez composition et règles de sortie avant les mots d’ambiance.',
    'Expliquez ce que la référence contrôle.',
    'Après le premier rendu, corrigez une seule cause.',
  ],
  intentHeading: 'À quoi sert cette formule',
  intentText:
    "L'intention est de disposer d'un modèle réutilisable. La formule rend le premier rendu plus facile à juger et la deuxième version plus facile à améliorer.",
  formulaHeading: "La formule en sept parties",
  formulaRows: [
    ['Partie', 'À écrire', 'Pourquoi cela compte'],
    ['Sujet', 'Le produit, la personne, la scène, l’objet ou l’interface exacts.', 'C’est l’ancre de toutes les consignes suivantes.'],
    ['Contexte', 'Où l’image sera utilisée et pour quel public.', 'Une page produit, une publicité et une bannière ne se cadrent pas pareil.'],
    ['Composition', 'Cadrage, distance, angle, espace vide et hiérarchie.', 'Cela réduit les premiers rendus brouillons.'],
    ['Style', 'Matière, palette, lumière, réalisme, ambiance et ton de marque.', 'Le style fonctionne mieux après stabilisation du sujet.'],
    ['Rôle de la référence', 'Ce que l’image fournie protège et ce qui peut changer.', 'Cela préserve identité, packaging, visage, UI ou position du logo.'],
    ['Règles de sortie', 'Ratio, texte, zone sûre, absence de filigrane, fond transparent.', 'Ces règles rendent l’image exploitable.'],
    ['Contrôle initial', 'Le premier point à vérifier après génération.', 'La révision reste ciblée au lieu de tout réécrire.'],
  ],
  matrixHeading: 'Variantes par type de travail',
  matrixRows: [
    ['Travail', 'Accent de la formule', 'Besoin de référence', 'Premier contrôle'],
    ['Hero produit', 'Sujet, matière, fond propre et ratio de sortie.', 'Référence packaging ou silhouette si la forme doit être exacte.', 'Forme du produit et texture.'],
    ['Portrait de campagne', 'Identité, expression, tenue et cadrage.', 'Référence visage si la ressemblance compte.', 'Stabilité du visage avant l’ambiance.'],
    ['Poster social', 'Sujet focal, espace titre et ratio de canal.', 'Optionnelle sauf sujet de marque.', 'Espace pour le titre et niveau de bruit.'],
    ['Mockup UI', 'Cadre appareil, hiérarchie écran et environnement.', 'Capture UI si la structure doit rester fidèle.', 'Lisibilité et perspective.'],
  ],
  stepsHeading: 'Remplir la formule sans la surcharger',
  stepItems: [
    'Commencez par une phrase pour le sujet et l’usage.',
    'Ajoutez une phrase de composition avec cadrage, caméra et espace vide.',
    'Isolez les contrôles de style pour pouvoir les ajuster ensuite.',
    'Ajoutez la référence seulement si identité ou mise en page doivent survivre.',
    'Terminez par les règles de sortie et le premier défaut à vérifier.',
  ],
  promptHeading: 'Modèles copiables',
  promptIntro:
    'Gardez ces prompts en anglais pour les coller dans Vogue AI. Remplacez les variables, puis gardez la structure stable au premier essai.',
  productImageAlt: 'Exemple de formule de prompt produit dans la bibliothèque Vogue AI',
  imageCaption:
    'Une photo produit gagne à être formulée clairement: matière, lumière, fond, ratio et politique de texte changent le résultat.',
  workedHeading: 'Exemple complet : image de lancement produit',
  rawHeading: 'Brief brut',
  rawText:
    'Créer une image de lancement pour un sérum vitaminé translucide, utilisable en page produit et en social paid. La forme du flacon, le bouchon et l’étiquette doivent rester stables.',
  promptVersionHeading: 'Prompt construit avec la formule',
  campaignImageAlt: 'Exemple de formule de prompt campagne dans la bibliothèque Vogue AI',
  campaignCaption:
    'Les visuels de campagne montrent pourquoi ratio, espace de titre et règles de sortie doivent être définis avant la génération.',
  diagnosisHeading: 'Diagnostic du premier rendu',
  diagnosisText:
    "Si l'image est premium mais que le flacon change, il manque la consigne de référence. Si la forme est bonne mais l’image générique, corrigez contexte, cadrage et lumière.",
  ruleTitle: 'Règle de formule',
  ruleText:
    'Ne changez pas tout à la fois. Remplissez les sept parties, générez une fois, puis corrigez uniquement la partie responsable.',
  failureHeading: 'Erreurs fréquentes et corrections',
  failureRows: [
    ['Problème', 'Partie à corriger', 'À éviter'],
    ['Résultat générique', 'Contexte et audience.', 'Ajouter cinq adjectifs de style.'],
    ['Forme produit incorrecte', 'Sujet et rôle de la référence.', 'Changer de modèle avant de clarifier l’identité.'],
    ['Mauvais cadrage', 'Composition et règles de sortie.', 'Réécrire tout le prompt.'],
    ['Texte ou logo brouillé', 'Règles de sortie et politique de texte.', 'Demander une typographie finale dans l’image.'],
    ['Série incohérente', 'Variables réutilisables.', 'Repartir de zéro à chaque image.'],
  ],
  vogueHeading: 'Utiliser la formule dans Vogue AI',
  vogueText:
    'Dans Vogue AI, partez d’une image de bibliothèque proche du besoin, puis remplacez les variables de la formule. Notez sujet, rôle de référence, ratio et première correction.',
  checklistHeading: 'Checklist de formule réutilisable',
  checklistItems: [
    'Le sujet est-il identifiable dès la première phrase ?',
    'Le canal réel est-il nommé ?',
    'Le cadrage et l’espace vide sont-ils clairs ?',
    'La référence a-t-elle un rôle précis ?',
    'Les règles de sortie disent-elles quoi éviter ?',
    'Le premier diagnostic est-il unique ?',
  ],
  faqHeading: 'FAQ',
  faq: [
    ["Quelle est la meilleure formule de prompt d'image IA ?", 'Sujet, contexte, composition, style, référence, règles de sortie et premier diagnostic.'],
    ['Faut-il toujours sept parties ?', 'Non, mais les images de production en bénéficient quand identité, marque, ratio ou format comptent.'],
    ['Où placer les mots de style ?', 'Après le sujet et la composition, pour ne pas masquer le vrai besoin.'],
    ['Quand utiliser une référence ?', 'Quand forme, visage, packaging, logo, palette ou interface doivent rester reconnaissables.'],
    ['Puis-je réutiliser une formule ?', 'Oui, gardez la structure et remplacez les variables.'],
    ['Comment corriger un mauvais rendu ?', 'Identifiez la partie faible et corrigez-la avant de réécrire le style.'],
  ],
};

const ru: LocaleCopy = {
  ...en,
  title: 'Формула AI-промпта для изображений: структура для контроля',
  summary:
    'Практичная формула для превращения задач продукта, портрета, соцпоста и UI в контролируемый первый черновик в Vogue AI.',
  seoTitle: 'Гайд по формуле AI-промпта для изображений',
  seoDescription:
    'Используйте формулу AI-промпта: subject, context, composition, reference handoff, output rules и first review.',
  intro:
    'Хорошая формула AI-промпта — это не магическая фраза, а порядок контроля: subject, context, composition, style, reference handoff, output rules и first review.',
  tldrHeading: 'TL;DR: держите формулу, меняйте переменные',
  tldrItems: [
    'Сначала subject, потом style.',
    'Укажите use case: product page, ad, avatar, poster или UI mockup.',
    'Composition и output rules важнее декоративных слов.',
    'Reference image работает только с четкой ролью.',
    'После первого результата исправляйте одну причину.',
  ],
  intentHeading: 'Для чего нужна эта формула',
  intentText:
    'Пользователь ищет шаблон, который можно повторять. Формула помогает оценить первый результат и быстрее написать вторую версию.',
  formulaHeading: 'Формула из семи частей',
  formulaRows: [
    ['Часть', 'Что написать', 'Зачем это нужно'],
    ['Субъект', 'Точный продукт, человек, сцена, объект или интерфейс.', 'Это удерживает все последующие инструкции вокруг главного объекта.'],
    ['Контекст', 'Где и для кого будет использоваться изображение.', 'Страница продукта, реклама и баннер требуют разного кадра.'],
    ['Композиция', 'Кадр, дистанция камеры, угол, свободное место и иерархия.', 'Так первый результат реже получается хаотичным.'],
    ['Стиль', 'Материал, палитра, свет, реализм, настроение и тон бренда.', 'Стиль лучше добавлять после стабилизации субъекта.'],
    ['Передача референса', 'Что референс должен сохранить и что можно менять.', 'Это защищает лицо, упаковку, UI, цвет и позицию логотипа.'],
    ['Правила вывода', 'Соотношение сторон, текст, безопасная зона, без водяного знака, прозрачный фон.', 'Результат становится пригодным для работы.'],
    ['Проверка', 'Первый критерий после генерации.', 'Следующая правка не превращается в полный rewrite.'],
  ],
  matrixHeading: 'Варианты формулы по задачам',
  matrixRows: [
    ['Задача', 'Акцент формулы', 'Нужен ли референс', 'Что проверить первым'],
    ['Hero продукта', 'Субъект, материал, чистый фон и ratio.', 'Упаковка или силуэт, если форма критична.', 'Форма продукта и фактура.'],
    ['Портрет кампании', 'Идентичность, выражение, одежда и кадр.', 'Референс лица, если важна похожесть.', 'Стабильность лица до настроения.'],
    ['Социальный постер', 'Фокусный субъект, место под заголовок и ratio канала.', 'Необязательно, кроме брендированного субъекта.', 'Свободное место и визуальный шум.'],
    ['UI mockup', 'Рамка устройства, иерархия экрана и окружение.', 'Скрин UI, если структура важна.', 'Читаемость и перспектива.'],
  ],
  stepsHeading: 'Как заполнить формулу без перегруза',
  stepItems: [
    'Начните с одной фразы про субъект и задачу.',
    'Отдельно опишите композицию: кадр, камеру и свободное место.',
    'Стиль держите отдельной фразой, чтобы его было легко заменить.',
    'Референс добавляйте только когда нужно сохранить идентичность или макет.',
    'Закончите правилами вывода и первым критерием проверки.',
  ],
  promptHeading: 'Копируемые шаблоны',
  promptIntro:
    'Prompt blocks остаются на английском для вставки в Vogue AI. Замените переменные и не меняйте структуру до первого результата.',
  productImageAlt: 'Пример формулы промпта для продукта из библиотеки Vogue AI',
  imageCaption:
    'Product prompt требует формулы: material, lighting, background, ratio и text policy влияют на пригодность результата.',
  workedHeading: 'Пример: launch image для продукта',
  rawHeading: 'Исходный brief',
  rawText:
    'Нужна launch image для прозрачного serum bottle. Она должна работать как product-page hero и paid social crop. Форма, cap color и label position должны сохраниться.',
  promptVersionHeading: 'Prompt по формуле',
  campaignImageAlt: 'Пример формулы промпта для кампании из библиотеки Vogue AI',
  campaignCaption:
    'Кампанийные примеры показывают, почему ratio, свободное место под заголовок и правила вывода нужно задавать заранее.',
  diagnosisHeading: 'Диагностика первого результата',
  diagnosisText:
    'Если картинка premium, но форма бутылки изменилась, слабое место — reference handoff. Если форма верная, но кадр stock-like, исправьте context, crop и lighting.',
  ruleTitle: 'Правило формулы',
  ruleText: 'Не меняйте все сразу. Заполните семь частей, сгенерируйте один раз и исправьте слабую часть.',
  failureHeading: 'Ошибки формулы и исправления',
  failureRows: [
    ['Проблема', 'Что исправить', 'Чего не делать сначала'],
    ['Слишком общий результат', 'Контекст и аудитория.', 'Добавлять еще больше прилагательных.'],
    ['Неверная форма продукта', 'Субъект и передача референса.', 'Менять модель до уточнения идентичности.'],
    ['Плохой кадр', 'Композиция и правила вывода.', 'Переписывать весь prompt.'],
    ['Плохой текст или логотип', 'Правила вывода и политика текста.', 'Просить финальную типографику внутри изображения.'],
    ['Нестабильная серия', 'Повторяемые переменные.', 'Каждый раз писать prompt с нуля.'],
  ],
  vogueHeading: 'Как использовать формулу в Vogue AI',
  vogueText:
    'В Vogue AI выберите похожий prompt-library пример, замените переменные и сохраните заметку о subject, reference role, ratio и first fix.',
  checklistHeading: 'Checklist для reusable formula',
  checklistItems: [
    'Можно ли понять точный субъект из первой фразы?',
    'Назван ли реальный канал или сценарий?',
    'Явно ли заданы кадр и свободное место?',
    'У референса есть конкретная роль?',
    'Правила вывода говорят, чего избегать?',
    'Есть ли один критерий для первого результата?',
  ],
  faqHeading: 'FAQ',
  faq: [
    ['Какая формула промпта для AI-изображений самая надежная?', 'Субъект, контекст, композиция, стиль, передача референса, правила вывода и первая проверка. Порядок важен: модель сначала понимает задачу, а уже потом стиль.'],
    ['Всегда ли нужны все семь частей?', 'Нет. Для простого эскиза хватит меньшего объема, но production-картинки выигрывают от полной структуры.'],
    ['Где писать стиль?', 'После субъекта и композиции. Стиль полезен, но он не должен заменять производственный brief.'],
    ['Когда нужен референс?', 'Когда должны сохраниться форма продукта, лицо, упаковка, логотип, палитра или структура интерфейса.'],
    ['Можно ли использовать одну формулу для серии?', 'Да. Оставьте структуру и меняйте переменные: продукт, фон, канал, ratio и роль референса.'],
    ['Как исправить плохой первый результат?', 'Сначала найдите слабую часть формулы, затем меняйте только ее.'],
  ],
};

const pt: LocaleCopy = {
  ...fr,
  title: 'Fórmula de prompt de imagem com IA para controlar resultados',
  summary:
    'Uma fórmula prática para transformar briefs de produto, retrato, social e UI em primeiros rascunhos controlados no Vogue AI.',
  seoTitle: 'Guia de Fórmula de Prompt de Imagem IA',
  seoDescription:
    'Use uma fórmula de prompt de imagem IA para estruturar assunto, composição, referência, regras de saída e revisão.',
  intro:
    'Uma boa fórmula de prompt de imagem IA não é uma frase mágica. É uma ordem de controles: assunto, contexto, composição, estilo, referência, regras de saída e revisão.',
  tldrHeading: 'TL;DR: mantenha a fórmula e troque variáveis',
  tldrItems: [
    'Escreva o assunto antes do estilo.',
    'Nomeie o uso: página de produto, anúncio, avatar, pôster ou UI.',
    'Defina composição e regras de saída antes das palavras de clima.',
    'Explique exatamente o que a referência deve controlar.',
    'Depois do primeiro resultado, corrija uma causa por vez.',
  ],
  intentHeading: 'Para que serve esta fórmula',
  intentText:
    'Quem procura uma fórmula de prompt precisa de um modelo repetível, não só de inspiração. A fórmula deixa o primeiro resultado mais fácil de avaliar e a segunda versão mais fácil de corrigir.',
  formulaHeading: 'A fórmula em sete partes',
  formulaRows: [
    ['Parte', 'O que escrever', 'Por que importa'],
    ['Assunto', 'Produto, pessoa, cena, objeto ou interface exatos.', 'Ancora todas as instruções seguintes.'],
    ['Contexto de uso', 'Onde a imagem será usada e para quem.', 'Página de produto, anúncio e banner pedem enquadramentos diferentes.'],
    ['Composição', 'Corte, distância da câmera, ângulo, espaço negativo e hierarquia.', 'Evita primeiras gerações confusas.'],
    ['Estilo', 'Material, paleta, luz, realismo, clima e tom de marca.', 'Funciona melhor depois que o assunto está estável.'],
    ['Papel da referência', 'O que a imagem enviada preserva e o que pode mudar.', 'Protege identidade, embalagem, rosto, UI ou logo.'],
    ['Regras de saída', 'Proporção, política de texto, área segura, sem marca d’água, fundo transparente.', 'Aproxima o resultado do uso real.'],
    ['Revisão inicial', 'O primeiro critério para checar depois da geração.', 'Mantém a próxima correção focada.'],
  ],
  matrixHeading: 'Variações por tipo de trabalho',
  matrixRows: [
    ['Trabalho', 'Ênfase da fórmula', 'Necessidade de referência', 'Primeira revisão'],
    ['Hero de produto', 'Assunto, material, fundo limpo e proporção.', 'Referência de embalagem ou silhueta quando a forma importa.', 'Forma do produto e textura.'],
    ['Retrato de campanha', 'Identidade, expressão, figurino e corte.', 'Referência facial quando semelhança importa.', 'Rosto antes do clima visual.'],
    ['Post social', 'Assunto focal, espaço para título e proporção do canal.', 'Opcional, salvo quando o assunto é de marca.', 'Espaço para headline e poluição visual.'],
    ['Mockup UI', 'Moldura do dispositivo, hierarquia da tela e ambiente.', 'Screenshot quando a estrutura precisa ser preservada.', 'Legibilidade e perspectiva.'],
  ],
  stepsHeading: 'Como preencher sem sobrecarregar',
  stepItems: [
    'Comece com uma frase para assunto e uso.',
    'Adicione uma frase de composição com corte, câmera e espaço negativo.',
    'Mantenha o estilo em uma frase separada para ajustar depois.',
    'Use referência apenas quando identidade ou layout precisam sobreviver.',
    'Feche com regras de saída e o primeiro problema a verificar.',
  ],
  promptHeading: 'Modelos copiáveis',
  promptIntro:
    'Mantenha estes blocos em inglês para colar no Vogue AI. Troque as variáveis e preserve a estrutura na primeira geração.',
  productImageAlt: 'Exemplo de fórmula de prompt de produto na biblioteca do Vogue AI',
  imageCaption:
    'Prompt de produto precisa de fórmula porque material, luz, fundo, proporção e regra de texto mudam a utilidade da imagem.',
  workedHeading: 'Exemplo completo: imagem de lançamento',
  rawHeading: 'Brief bruto',
  rawText:
    'Criar uma imagem de lançamento para um frasco translúcido de sérum vitamínico. Ela precisa servir como hero de página de produto e corte para social pago. Formato do frasco, cor da tampa e posição do rótulo devem ficar estáveis.',
  promptVersionHeading: 'Prompt construído com a fórmula',
  campaignImageAlt: 'Exemplo de fórmula de prompt de campanha na biblioteca do Vogue AI',
  campaignCaption:
    'Exemplos de campanha mostram por que proporção, espaço para headline e regras de saída devem ser explícitos antes da geração.',
  diagnosisHeading: 'Diagnóstico do primeiro resultado',
  diagnosisText:
    'Se a imagem parece premium, mas o frasco muda de forma, falta uma regra de referência. Se a forma está certa, mas o quadro parece genérico, ajuste contexto, corte e luz antes de adicionar adjetivos.',
  ruleTitle: 'Regra da fórmula',
  ruleText:
    'Não mude tudo de uma vez. Preencha as sete partes, gere uma vez e corrija apenas a parte que explica a falha.',
  failureHeading: 'Erros comuns e correções',
  failureRows: [
    ['Problema', 'Parte da fórmula para corrigir', 'Evite começar por'],
    ['Resultado genérico', 'Contexto de uso e audiência.', 'Adicionar mais adjetivos de estilo.'],
    ['Forma errada do produto', 'Assunto e papel da referência.', 'Trocar de modelo antes de esclarecer identidade.'],
    ['Corte ruim', 'Composição e regras de saída.', 'Reescrever o prompt inteiro.'],
    ['Texto ou logo confuso', 'Regras de saída e política de texto.', 'Pedir tipografia final dentro da imagem.'],
    ['Série inconsistente', 'Variáveis reutilizáveis.', 'Escrever cada prompt do zero.'],
  ],
  vogueHeading: 'Use a fórmula no Vogue AI',
  vogueText:
    'No Vogue AI, comece por uma imagem da biblioteca de prompts que combine com a tarefa e substitua as variáveis. Guarde uma nota sobre assunto, papel da referência, proporção e primeira correção.',
  checklistHeading: 'Checklist reutilizável',
  checklistItems: [
    'A primeira frase identifica o assunto com precisão?',
    'O canal ou caso de uso real está nomeado?',
    'Corte e espaço negativo estão explícitos?',
    'Cada referência tem uma função clara?',
    'As regras de saída dizem o que evitar?',
    'Há um único critério para revisar o primeiro resultado?',
  ],
  faqHeading: 'FAQ',
  faq: [
    ['Qual é a melhor fórmula de prompt para imagem IA?', 'Use assunto, contexto de uso, composição, estilo, papel da referência, regras de saída e revisão inicial. A ordem ajuda o modelo a entender a tarefa antes do estilo.'],
    ['Todo prompt precisa das sete partes?', 'Não. Ideias simples podem ser mais curtas, mas imagens de produção precisam da fórmula completa quando identidade, corte, marca ou formato importam.'],
    ['Onde entram as palavras de estilo?', 'Depois do assunto e da composição. Elas ajudam, mas não substituem o brief de produção.'],
    ['Quando devo usar uma imagem de referência?', 'Quando forma do produto, rosto, embalagem, logo, paleta ou hierarquia de UI precisam continuar reconhecíveis.'],
    ['Posso reutilizar a mesma fórmula?', 'Sim. Mantenha a estrutura e troque variáveis como produto, fundo, canal, proporção e papel da referência.'],
    ['Como corrijo um primeiro resultado ruim?', 'Identifique qual parte da fórmula falhou e ajuste só essa parte antes de reescrever o estilo.'],
  ],
};

const ja: LocaleCopy = {
  ...zh,
  title: 'AI 画像プロンプト公式：商品・人物・SNS画像を安定させる型',
  summary:
    '商品画像、ポートレート、SNS、UI の brief を Vogue AI で制御しやすい初稿に変える公式です。',
  seoTitle: 'AI 画像プロンプト公式ガイド',
  seoDescription:
    'Subject、context、composition、reference handoff、output rules、review check を整理する AI 画像プロンプト公式。',
  intro:
    '良い AI 画像プロンプト公式は魔法の一文ではなく、subject、context、composition、style、reference handoff、output rules、review check の順序です。',
  tldrHeading: 'TL;DR：公式を固定し、変数だけ替える',
  tldrItems: [
    'スタイルより先に主題を書く。',
    '商品ページ、広告、アバター、ポスター、UI など用途を明記する。',
    '雰囲気語の前に構図と出力ルールを書く。',
    '参照画像は何を守るのかを説明してから使う。',
    '初回結果は一つの失敗点だけを直す。',
  ],
  intentHeading: 'この公式が解く課題',
  intentText:
    'AI image prompt formula を探す人が必要としているのは、単なる作例集ではなく再利用できる型です。型があると、初回結果の評価も次の修正も速くなります。',
  formulaHeading: '7 パートの AI 画像プロンプト公式',
  formulaRows: [
    ['パート', '書く内容', '重要な理由'],
    ['主題', '商品、人物、シーン、物体、UI を具体的に書く。', '後続の指示が何を安定させるべきか決まる。'],
    ['用途', 'どこで使い、誰に見せる画像か。', '商品ページ、広告、バナーでは必要な構図が違う。'],
    ['構図', '切り抜き、カメラ距離、角度、余白、階層。', '初回生成の乱れや不要な切れを減らす。'],
    ['スタイル', '素材、色、光、リアルさ、雰囲気、ブランド感。', '主題が固まってから加えると制御しやすい。'],
    ['参照画像の役割', '何を保持し、何を変えてよいか。', '顔、包装、UI、ロゴ位置などを守れる。'],
    ['出力ルール', '比率、文字、セーフエリア、透かしなし、背景指定。', '実制作で使いやすい結果に近づく。'],
    ['初回チェック', '生成後に最初に見る成否ポイント。', '次の修正が全体の書き直しになりにくい。'],
  ],
  matrixHeading: '用途別の公式バリエーション',
  matrixRows: [
    ['用途', '公式の重点', '参照画像', '最初に確認すること'],
    ['商品ヒーロー', '主題、素材、クリーンな背景、出力比率。', '形状が重要なら包装やシルエットを使う。', '商品の形と質感。'],
    ['人物キャンペーン', '本人性、表情、衣装、切り抜き。', '似せる必要があれば顔参照を使う。', '雰囲気より先に顔の安定性。'],
    ['SNSポスター', '主役、見出し用余白、チャンネル比率。', 'ブランド主体でなければ任意。', '見出しスペースと情報量。'],
    ['UI mockup', 'デバイス枠、画面階層、利用シーン。', '構造を保つなら UI スクリーンショット。', '画面の読みやすさとパース。'],
  ],
  stepsHeading: '情報を詰め込みすぎずに埋める',
  stepItems: [
    '主題と用途を一文で書く。',
    '切り抜き、カメラ、余白を含む構図文を足す。',
    '後で調整できるようスタイル指示は独立させる。',
    '本人性やレイアウトを守る必要がある時だけ参照ルールを書く。',
    '最後に出力ルールと初回チェック項目を書く。',
  ],
  promptHeading: 'コピーできる公式テンプレート',
  promptIntro:
    'Vogue AI に貼り付けやすいよう、プロンプトブロックは英語のまま使います。角括弧の変数を差し替え、初回生成では構造を固定します。',
  productImageAlt: 'Vogue AI プロンプトライブラリの商品画像公式例',
  imageCaption:
    '商品画像では、素材、光、背景、比率、文字ルールが使いやすさを左右するため、公式化が特に効きます。',
  workedHeading: '実例：商品ローンチ画像',
  rawHeading: '元の brief',
  rawText:
    '半透明のビタミン美容液ボトルのローンチ画像を作る。商品ページの hero と有料SNS用クロップの両方で使い、ボトル形状、キャップ色、ラベル位置は維持する。',
  promptVersionHeading: '公式から作ったプロンプト',
  campaignImageAlt: 'Vogue AI プロンプトライブラリのキャンペーン公式例',
  campaignCaption:
    'キャンペーン画像では、比率、見出し用の余白、出力ルールを生成前に明示する必要があります。',
  diagnosisHeading: '初回結果の診断',
  diagnosisText:
    '高級感はあるのにボトル形状が変わるなら、参照画像の役割が不足しています。形は正しいのにストック写真のようなら、形容詞を増やす前に用途、切り抜き、光を直します。',
  ruleTitle: '公式ルール',
  ruleText:
    'すべてを一度に足さないこと。7 パートを埋めて一度生成し、失敗を説明するパートだけを直します。',
  failureHeading: 'よくあるミスと修正',
  failureRows: [
    ['問題', '直すパート', '避けること'],
    ['結果が汎用的', '用途と対象者。', 'スタイル形容詞を増やす。'],
    ['商品形状が違う', '主題と参照画像の役割。', '本人性を明確にせずモデルを替える。'],
    ['切り抜きが使えない', '構図と出力ルール。', 'プロンプト全体を書き直す。'],
    ['文字やロゴが乱れる', '出力ルールと文字方針。', '画像内で最終コピーまで組ませる。'],
    ['シリーズが揃わない', '再利用する変数。', '毎回ゼロから書く。'],
  ],
  vogueHeading: 'Vogue AI で公式を使う',
  vogueText:
    'Vogue AI では、目的に近いプロンプトライブラリ画像から始め、公式内の変数だけ差し替えます。主題、参照画像の役割、比率、初回修正をメモとして残します。',
  checklistHeading: '再利用チェックリスト',
  checklistItems: [
    '最初の一文で主題が具体的に分かるか。',
    '実際のチャンネルや用途が書かれているか。',
    '切り抜きと余白が明示されているか。',
    '参照画像の役割が明確か。',
    '出力ルールに避けることが書かれているか。',
    '初回結果のチェック項目が一つに絞られているか。',
  ],
  faqHeading: 'FAQ',
  faq: [
    ['AI 画像プロンプトのおすすめ公式は？', '主題、用途、構図、スタイル、参照画像の役割、出力ルール、初回チェックの順に書きます。順序があることで、モデルが先に目的を理解できます。'],
    ['毎回 7 パート必要ですか？', '簡単なアイデアなら短くても構いません。ただし本人性、裁切、ブランド感、出力形式が重要な画像では完全な公式が有効です。'],
    ['スタイル語はどこに入れますか？', '主題と構図の後です。スタイル語は便利ですが、制作要件の代わりにはなりません。'],
    ['参照画像はいつ使うべきですか？', '商品形状、顔、包装、ロゴ位置、色、UI 階層を維持したい時です。'],
    ['同じ公式を複数画像に使えますか？', '使えます。構造を残し、商品、背景、チャンネル、比率、参照画像の役割を差し替えます。'],
    ['初回結果が悪い時は？', '失敗したパートを特定し、主題、構図、参照画像、出力ルールのどれか一つを直します。'],
  ],
};

const ko: LocaleCopy = {
  ...zh,
  title: 'AI 이미지 프롬프트 공식: 제품, 인물, 소셜 이미지를 안정화하는 구조',
  summary:
    '제품, 인물, 소셜, UI brief를 Vogue AI에서 제어 가능한 첫 이미지로 바꾸는 실전 공식입니다.',
  seoTitle: 'AI 이미지 프롬프트 공식 가이드',
  seoDescription:
    'Subject, context, composition, reference handoff, output rules, review check로 구성하는 AI 이미지 프롬프트 공식.',
  intro:
    '좋은 AI 이미지 프롬프트 공식은 마법 문장이 아니라 subject, context, composition, style, reference handoff, output rules, review check의 순서입니다.',
  tldrHeading: 'TL;DR: 공식은 고정하고 변수만 바꾸세요',
  tldrItems: [
    '스타일보다 먼저 주제를 씁니다.',
    '제품 페이지, 광고, 아바타, 포스터, UI 같은 사용 맥락을 적습니다.',
    '분위기 단어보다 구도와 출력 규칙을 먼저 둡니다.',
    '레퍼런스가 무엇을 제어하는지 설명한 뒤 이미지를 사용합니다.',
    '첫 결과는 실패 지점 하나만 기준으로 수정합니다.',
  ],
  intentHeading: '이 공식이 해결하는 문제',
  intentText:
    'AI image prompt formula를 찾는 사람에게 필요한 것은 영감 목록이 아니라 반복 가능한 템플릿입니다. 공식이 있으면 첫 결과를 평가하기 쉽고 두 번째 수정도 빨라집니다.',
  formulaHeading: '7단계 AI 이미지 프롬프트 공식',
  formulaRows: [
    ['파트', '작성할 내용', '중요한 이유'],
    ['주제', '정확한 제품, 인물, 장면, 오브젝트, 인터페이스.', '이후 지시가 무엇을 안정적으로 유지해야 하는지 정합니다.'],
    ['사용 맥락', '이미지가 어디에 쓰이고 누구를 위한 것인지.', '제품 페이지, 광고, 배너는 서로 다른 크롭이 필요합니다.'],
    ['구도', '크롭, 카메라 거리, 각도, 여백, 시각적 위계.', '첫 생성의 혼란과 잘못된 크롭을 줄입니다.'],
    ['스타일', '재질, 팔레트, 조명, 사실감, 무드, 브랜드 톤.', '주제가 안정된 뒤 적용해야 제어하기 쉽습니다.'],
    ['레퍼런스 역할', '업로드 이미지가 보존할 것과 바뀌어도 되는 것.', '정체성, 패키지, 얼굴, UI, 로고 위치를 보호합니다.'],
    ['출력 규칙', '비율, 텍스트 정책, 안전 영역, 워터마크 없음, 배경 조건.', '결과를 실제 제작에 가깝게 만듭니다.'],
    ['첫 검토', '생성 후 가장 먼저 확인할 기준.', '다음 수정이 전체 재작성으로 번지지 않게 합니다.'],
  ],
  matrixHeading: '작업별 공식 변형',
  matrixRows: [
    ['작업', '공식의 초점', '레퍼런스 필요성', '첫 검토 기준'],
    ['제품 히어로', '주제, 재질, 깨끗한 배경, 출력 비율.', '정확한 형태가 필요하면 패키지나 실루엣 레퍼런스.', '제품 형태와 재질감.'],
    ['인물 캠페인', '정체성, 표정, 의상, 크롭.', '닮음이 중요하면 얼굴 레퍼런스.', '무드보다 얼굴 안정성 먼저.'],
    ['소셜 포스터', '주요 피사체, 헤드라인 여백, 채널 비율.', '브랜드 피사체가 아니면 선택 사항.', '헤드라인 안전 영역과 복잡도.'],
    ['UI mockup', '기기 프레임, 화면 위계, 사용 환경.', '구조를 보존해야 하면 UI 스크린샷.', '화면 가독성과 원근.'],
  ],
  stepsHeading: '과부하 없이 채우는 방법',
  stepItems: [
    '주제와 용도를 한 문장으로 시작합니다.',
    '크롭, 카메라, 여백을 포함한 구도 문장을 추가합니다.',
    '나중에 조정하기 쉽도록 스타일 지시는 분리합니다.',
    '정체성이나 레이아웃을 보존해야 할 때만 레퍼런스 규칙을 씁니다.',
    '출력 규칙과 첫 검토 기준으로 마무리합니다.',
  ],
  promptHeading: '복사 가능한 공식 템플릿',
  promptIntro:
    'Vogue AI에 붙여넣기 쉽도록 프롬프트 블록은 영어로 유지합니다. 대괄호 변수를 바꾸고 첫 생성에서는 구조를 고정하세요.',
  productImageAlt: 'Vogue AI 프롬프트 라이브러리의 제품 이미지 공식 예시',
  imageCaption:
    '제품 이미지는 재질, 조명, 배경, 비율, 텍스트 규칙이 사용 가능성을 좌우하므로 공식화가 특히 중요합니다.',
  workedHeading: '예시: 제품 출시 이미지',
  rawHeading: '원본 brief',
  rawText:
    '반투명 비타민 세럼 병의 출시 이미지를 만든다. 제품 페이지 히어로와 유료 소셜 크롭 모두에 써야 하며 병 모양, 캡 색상, 라벨 위치는 안정적으로 유지되어야 한다.',
  promptVersionHeading: '공식으로 만든 프롬프트',
  campaignImageAlt: 'Vogue AI 프롬프트 라이브러리의 캠페인 공식 예시',
  campaignCaption:
    '캠페인 이미지는 비율, 헤드라인 여백, 출력 규칙을 생성 전에 명시해야 하는 이유를 잘 보여줍니다.',
  diagnosisHeading: '첫 결과 진단',
  diagnosisText:
    '고급스러운데 병 모양이 바뀌었다면 레퍼런스 역할이 부족한 것입니다. 모양은 맞지만 스톡 사진처럼 보인다면 형용사를 더하기 전에 사용 맥락, 크롭, 조명을 조정하세요.',
  ruleTitle: '공식 규칙',
  ruleText:
    '모든 디테일을 한 번에 넣지 마세요. 7단계를 채우고 한 번 생성한 뒤 실패를 설명하는 파트만 수정합니다.',
  failureHeading: '흔한 실수와 수정',
  failureRows: [
    ['문제', '수정할 공식 파트', '피해야 할 시작점'],
    ['결과가 평범함', '사용 맥락과 대상.', '스타일 형용사를 더 추가하기.'],
    ['제품 형태가 틀림', '주제와 레퍼런스 역할.', '정체성을 명확히 하기 전 모델 변경.'],
    ['크롭이 나쁨', '구도와 출력 규칙.', '전체 프롬프트 재작성.'],
    ['텍스트나 로고가 지저분함', '출력 규칙과 텍스트 정책.', '이미지 안에서 최종 타이포그래피까지 요청.'],
    ['시리즈가 일관되지 않음', '재사용 변수.', '매번 처음부터 쓰기.'],
  ],
  vogueHeading: 'Vogue AI에서 공식 사용하기',
  vogueText:
    'Vogue AI에서는 작업과 가까운 프롬프트 라이브러리 이미지를 고른 뒤 공식의 변수만 바꿉니다. 주제, 레퍼런스 역할, 비율, 첫 수정 내용을 버전 노트로 남기세요.',
  checklistHeading: '재사용 체크리스트',
  checklistItems: [
    '첫 문장에서 정확한 주제를 식별할 수 있나요?',
    '실제 채널이나 사용 사례가 적혀 있나요?',
    '크롭과 여백이 명확한가요?',
    '레퍼런스 이미지의 역할이 분명한가요?',
    '출력 규칙이 피해야 할 것을 말하나요?',
    '첫 결과의 검토 기준이 하나인가요?',
  ],
  faqHeading: 'FAQ',
  faq: [
    ['가장 좋은 AI 이미지 프롬프트 공식은 무엇인가요?', '주제, 사용 맥락, 구도, 스타일, 레퍼런스 역할, 출력 규칙, 첫 검토 순서입니다. 이 순서가 모델에게 먼저 작업을 이해시키고 그다음 스타일을 적용하게 합니다.'],
    ['모든 프롬프트에 7단계가 필요한가요?', '아닙니다. 단순 아이디어는 짧아도 되지만 정체성, 크롭, 브랜드 스타일, 출력 형식이 중요하면 전체 공식이 더 안정적입니다.'],
    ['스타일 단어는 어디에 넣어야 하나요?', '주제와 구도 뒤에 넣습니다. 스타일 단어는 유용하지만 실제 제작 brief를 대신할 수 없습니다.'],
    ['레퍼런스 이미지는 언제 써야 하나요?', '제품 형태, 얼굴, 패키지, 로고 위치, 색상 체계, UI 위계를 유지해야 할 때입니다.'],
    ['하나의 공식을 여러 이미지에 재사용할 수 있나요?', '가능합니다. 구조는 유지하고 제품, 배경, 채널, 비율, 레퍼런스 역할만 바꾸면 됩니다.'],
    ['첫 결과가 나쁘면 어떻게 고치나요?', '실패한 공식 파트를 먼저 찾고 주제, 크롭, 레퍼런스 역할, 출력 규칙 중 하나만 수정하세요.'],
  ],
};

export const aiImagePromptFormulaAutoBlogPost: BlogPostSource = {
  slug: 'ai-image-prompt-formula',
  date: '2026-06-25',
  updatedAt: '2026-06-27',
  author: 'Vogue AI Team',
  image: images.hero,
  imageAlt: 'Technical blueprint prompt formula example from the Vogue AI library',
  articleType: 'tutorial',
  modelTags: ['vogue-ai', 'gpt-image-2', 'nano-banana', 'midjourney'],
  readingMinutes: 10,
  localizations: {
    en: { title: en.title, summary: en.summary, seoTitle: en.seoTitle, seoDescription: en.seoDescription, content: makeContent(en) },
    zh: { title: zh.title, summary: zh.summary, seoTitle: zh.seoTitle, seoDescription: zh.seoDescription, content: makeContent(zh) },
    fr: { title: fr.title, summary: fr.summary, seoTitle: fr.seoTitle, seoDescription: fr.seoDescription, content: makeContent(fr) },
    ru: { title: ru.title, summary: ru.summary, seoTitle: ru.seoTitle, seoDescription: ru.seoDescription, content: makeContent(ru) },
    pt: { title: pt.title, summary: pt.summary, seoTitle: pt.seoTitle, seoDescription: pt.seoDescription, content: makeContent(pt) },
    ja: { title: ja.title, summary: ja.summary, seoTitle: ja.seoTitle, seoDescription: ja.seoDescription, content: makeContent(ja) },
    ko: { title: ko.title, summary: ko.summary, seoTitle: ko.seoTitle, seoDescription: ko.seoDescription, content: makeContent(ko) },
  },
};
