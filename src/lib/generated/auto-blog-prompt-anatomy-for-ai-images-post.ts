import type { BlogContentBlock, BlogPostSource } from '@/lib/blog-data';

const images = {
  hero:
    'https://media.vogueai.net/blog/auto/prompt-engineering-tips/76c95ea45ff7-dont-alter-my-facial-feature-create-me-1.jpg',
  product:
    'https://media.vogueai.net/blog/auto/gemini-ai-photo-prompt-copy-paste-trending/bbeff09d68ad-create-premium-square-reference-style-consumer-technology-1.jpg',
  reference:
    'https://media.vogueai.net/blog/auto/gemini-ai-photo-prompt-copy-paste-trending/1ffce010c78e-use-my-uploaded-image-as-face-reference-1.jpg',
  social:
    'https://media.vogueai.net/blog/auto/gemini-ai-photo-prompt-copy-paste-trending/4905f63747d7-high-impact-cinematic-sports-advertising-poster-featuring-1.jpg',
} as const;

type Copy = {
  title: string;
  summary: string;
  seoTitle: string;
  seoDescription: string;
  intro: string;
  tldrHeading: string;
  tldr: string[];
  mapHeading: string;
  mapIntro: string;
  anatomyRows: string[][];
  readHeading: string;
  readText: string;
  labeledPromptHeading: string;
  labeledPromptIntro: string;
  productImageAlt: string;
  productCaption: string;
  referenceHeading: string;
  referenceText: string;
  referenceImageAlt: string;
  referenceCaption: string;
  missingHeading: string;
  missingRows: string[][];
  diagnosisHeading: string;
  diagnosisItems: string[];
  socialImageAlt: string;
  socialCaption: string;
  workedHeading: string;
  rawHeading: string;
  rawText: string;
  repairHeading: string;
  repairText: string;
  ruleTitle: string;
  ruleText: string;
  vogueHeading: string;
  vogueText: string;
  checklistHeading: string;
  checklistItems: string[];
  faqHeading: string;
  faq: Array<[string, string]>;
};

const labeledPrompt = [
  'Subject: Handmade ceramic coffee dripper with visible glazed texture.',
  'Context: Product-page hero image and launch social crop.',
  'Composition: Centered object, 4:5 frame, warm off-white background, soft shadow.',
  'Style: Premium ecommerce realism, softbox lighting from upper left, subtle ceramic highlights.',
  'Reference handoff: If a reference is uploaded, preserve silhouette, rim shape, and glaze color; background may change.',
  'Output rules: No text, no watermark, no extra props, clean negative space.',
  'Review check: Inspect silhouette first, then material texture, then crop.',
] as const;

const en: Copy = {
  title: 'Prompt anatomy for AI images: what each part controls',
  summary:
    'A practical prompt anatomy guide for understanding what each part of an AI image prompt controls before you rewrite it.',
  seoTitle: 'Prompt Anatomy for AI Images Guide',
  seoDescription:
    'Learn prompt anatomy for AI images: subject, context, composition, style, reference handoff, output rules, and first-result diagnosis.',
  intro:
    'Prompt anatomy is the answer to a different question than prompt formula. Formula tells you the order to write. Anatomy tells you what each part controls, so you can repair the right part after the first image.',
  tldrHeading: 'TL;DR: diagnose by prompt part, not by taste',
  tldr: [
    'Subject controls what must exist in the image.',
    'Context controls why the image is being made and what counts as usable.',
    'Composition controls crop, distance, hierarchy, and negative space.',
    'Style controls material, lighting, palette, and mood after the subject is stable.',
    'Reference handoff controls what an uploaded image must preserve.',
    'Output rules control ratio, text policy, watermark policy, and production fit.',
  ],
  mapHeading: 'Prompt anatomy map',
  mapIntro:
    'Use this map when a result fails. The failure usually points to one weak prompt part, not to the entire prompt.',
  anatomyRows: [
    ['Anatomy part', 'Controls', 'Failure when missing'],
    ['Subject', 'Object, person, scene, product, interface, or character.', 'The model changes the main thing or adds the wrong subject.'],
    ['Context', 'Channel, audience, purpose, and level of polish.', 'The result looks pretty but unusable for the job.'],
    ['Composition', 'Camera, crop, distance, layout, safe area, and hierarchy.', 'The frame feels cluttered, cropped wrong, or hard to reuse.'],
    ['Style', 'Realism, material, lighting, palette, era, and mood.', 'The result is generic or inconsistent across a series.'],
    ['Reference handoff', 'Which details a reference image protects.', 'Identity, product shape, UI layout, or brand color drifts.'],
    ['Output rules', 'Aspect ratio, no text, no watermark, transparency, or safe area.', 'The image needs manual cleanup before use.'],
    ['Review check', 'The first pass/fail criterion after generation.', 'Every revision becomes a full rewrite.'],
  ],
  readHeading: 'How to read a prompt before you rewrite it',
  readText:
    'Underline each part. If a part is missing, do not add more adjectives. Add the missing control. If every part exists, change the one that explains the visible failure.',
  labeledPromptHeading: 'A labeled prompt anatomy example',
  labeledPromptIntro:
    'The prompt below is intentionally split into parts. It is easier to debug than one long paragraph because every sentence has a job.',
  productImageAlt: 'Product prompt anatomy example from the Vogue AI prompt library',
  productCaption:
    'Product examples make anatomy visible: subject, material, lighting, crop, and output rules can each fail independently.',
  referenceHeading: 'Reference handoff is its own anatomy part',
  referenceText:
    'A reference image is not a magic instruction. It should say what stays fixed and what can change. For portraits, the reference may control face identity while wardrobe, background, and campaign styling are allowed to move.',
  referenceImageAlt: 'Reference-led prompt anatomy example from the Vogue AI prompt library',
  referenceCaption:
    'Reference-led portrait prompts need a separate handoff sentence so the model knows identity is protected while styling can change.',
  missingHeading: 'Missing part symptoms',
  missingRows: [
    ['Symptom', 'Likely missing part', 'Repair'],
    ['Subject changes between generations', 'Subject or reference handoff.', 'Rewrite the subject sentence and clarify reference role.'],
    ['Image looks good but not useful', 'Context.', 'Name channel, audience, and production use.'],
    ['Crop is unusable', 'Composition.', 'Specify ratio, camera distance, and safe area.'],
    ['Style feels generic', 'Style controls.', 'Add palette, material, lighting, and brand tone.'],
    ['Logo or UI structure drifts', 'Reference handoff.', 'Say what the uploaded image controls.'],
    ['Text artifacts appear', 'Output rules.', 'State no text, placeholder only, or add text later.'],
  ],
  diagnosisHeading: 'First-result diagnosis by anatomy',
  diagnosisItems: [
    'If the wrong object appears, fix subject first.',
    'If the object is correct but the frame fails, fix composition.',
    'If the frame works but mood is flat, fix style controls.',
    'If identity drifts, fix reference handoff before model choice.',
    'If the image is almost usable but needs cleanup, fix output rules.',
  ],
  socialImageAlt: 'Social poster prompt anatomy example from the Vogue AI prompt library',
  socialCaption:
    'Poster-style outputs expose composition problems quickly because headline space, subject hierarchy, and channel ratio all matter.',
  workedHeading: 'Worked anatomy repair',
  rawHeading: 'Weak prompt',
  rawText:
    'Make a premium skincare ad with a bottle, soft light, modern style, high quality.',
  repairHeading: 'Anatomy-based repair',
  repairText:
    'Premium skincare product-page hero image of a translucent amber serum bottle, centered 4:5 crop, clean cream background, softbox lighting from upper left, visible glass refraction, preserve bottle silhouette and label position from reference image, leave negative space above for later headline, no generated text, no watermark. Review bottle silhouette first.',
  ruleTitle: 'Anatomy rule',
  ruleText:
    'When a result fails, name the failed anatomy part before changing the prompt. This keeps revision work evidence-based instead of taste-based.',
  vogueHeading: 'Use prompt anatomy in Vogue AI',
  vogueText:
    'When you adapt a Vogue AI prompt-library example, mark the anatomy parts that already work, then change only the missing part. This is faster than rewriting the prompt from scratch after every generation.',
  checklistHeading: 'Prompt anatomy checklist',
  checklistItems: [
    'Does the prompt name the exact subject?',
    'Does it explain where the image will be used?',
    'Does it specify crop, camera distance, and safe area?',
    'Does style language come after subject and composition?',
    'Does the reference image have a clear handoff rule?',
    'Does the prompt include one first-result review check?',
  ],
  faqHeading: 'FAQ',
  faq: [
    ['What is prompt anatomy for AI images?', 'It is the set of parts that make a prompt controllable: subject, context, composition, style, reference handoff, output rules, and review check.'],
    ['How is prompt anatomy different from a formula?', 'A formula gives writing order. Anatomy explains what each part controls and how to diagnose failures.'],
    ['Which prompt part should I fix first?', 'Fix the part that explains the visible failure: subject, composition, style, reference handoff, or output rules.'],
    ['Do long prompts always have better anatomy?', 'No. A long prompt can still miss context or output rules. Good anatomy is complete, not just long.'],
    ['Where should reference images be mentioned?', 'In a separate handoff sentence that says what the reference controls and what can change.'],
    ['Can I use this anatomy for Midjourney, GPT Image 2, or Nano Banana?', 'Yes. The same anatomy helps you prepare and diagnose prompts, even when model behavior differs.'],
  ],
};

const zh: Copy = {
  ...en,
  title: 'AI 图片提示词 Anatomy：逐项诊断主体、构图和参考图',
  summary: '一篇实用的提示词 anatomy 指南，帮你判断每段指令负责什么，再决定如何修正。',
  seoTitle: 'AI 图片提示词 Anatomy 指南',
  seoDescription:
    '学习 AI 图片提示词 anatomy：主体、场景、构图、风格、参考图交接、输出规则和首轮诊断。',
  intro:
    'Prompt anatomy 解决的问题和公式不同。公式告诉你写作顺序，anatomy 告诉你每个部件控制什么，这样首轮失败后才能修对位置。',
  tldrHeading: 'TL;DR：按部件诊断，不按喜好重写',
  tldr: [
    '主体控制画面里必须出现什么。',
    '场景控制图片为什么被制作，以及什么才算可用。',
    '构图控制裁切、距离、层级和留白。',
    '风格在主体稳定后控制材质、灯光、色板和情绪。',
    '参考图交接控制上传图片必须保住什么。',
    '输出规则控制比例、文字、水印和生产可用性。',
  ],
  mapHeading: '提示词 anatomy 地图',
  mapIntro: '结果失败时先看地图。通常是一个部件弱了，而不是整条提示词都错了。',
  anatomyRows: [
    ['部件', '控制什么', '缺失时的表现'],
    ['主体', '物体、人物、场景、产品、界面或角色。', '模型换了主角，或添加了错误主体。'],
    ['场景', '渠道、受众、目的和完成度。', '画面好看，但不适合真实任务。'],
    ['构图', '机位、裁切、距离、版式、安全区和视觉层级。', '画面拥挤、裁切错误，或难以复用。'],
    ['风格', '真实感、材质、灯光、色板、时代和情绪。', '结果泛化，系列图不一致。'],
    ['参考图交接', '参考图负责保护哪些细节。', '身份、产品形状、UI 结构或品牌色漂移。'],
    ['输出规则', '比例、无文字、无水印、透明背景或安全区。', '图片发布前需要大量手动清理。'],
    ['首轮检查', '生成后的第一个通过/失败标准。', '每次修改都变成整段重写。'],
  ],
  readHeading: '重写之前先读懂提示词',
  readText:
    '给每个部件划线。如果缺了某段，不要继续加形容词，先补控制项。如果都有，就只改解释失败的那一段。',
  labeledPromptHeading: '带标签的提示词 anatomy 示例',
  labeledPromptIntro: '下面的提示词故意拆成多个部件。每句话都有职责，所以比长段落更容易调试。',
  productImageAlt: 'Vogue AI 提示词库中的产品提示词 anatomy 示例',
  productCaption: '产品案例能清楚展示 anatomy：主体、材质、灯光、裁切和输出规则都可能单独失败。',
  referenceHeading: '参考图交接是独立部件',
  referenceText:
    '参考图不是万能指令。它应该说明什么保持不变、什么可以变化。人像里，参考图可以保住脸部身份，同时让服装、背景和海报风格改变。',
  referenceImageAlt: 'Vogue AI 提示词库中的参考图人像 anatomy 示例',
  referenceCaption: '参考图人像提示词需要单独的交接句，说明身份被保护，而风格可以变化。',
  missingHeading: '缺失部件的症状',
  missingRows: [
    ['症状', '可能缺失的部件', '修法'],
    ['主体每次都变', '主体或参考图交接。', '重写主体句，并说明参考图负责什么。'],
    ['画面好看但没法用', '场景。', '写清渠道、受众和生产用途。'],
    ['裁切不可用', '构图。', '指定比例、机位距离和安全区。'],
    ['风格很泛', '风格控制。', '补充色板、材质、灯光和品牌语气。'],
    ['logo 或 UI 结构漂移', '参考图交接。', '说明上传图片具体控制什么。'],
    ['出现文字杂点', '输出规则。', '写清无文字、仅占位或后期再加字。'],
  ],
  diagnosisHeading: '按 anatomy 做首轮诊断',
  diagnosisItems: [
    '出现错误主体时，先修主体。',
    '主体正确但画面失败时，修构图。',
    '构图可用但气质平淡时，修风格控制。',
    '身份漂移时，先修参考图交接，不要先换模型。',
    '几乎可用但需要清理时，修输出规则。',
  ],
  socialImageAlt: 'Vogue AI 提示词库中的社媒海报 anatomy 示例',
  socialCaption:
    '海报类结果会很快暴露构图问题，因为标题留白、主体层级和渠道比例都会影响可用性。',
  workedHeading: 'Anatomy 修正示例',
  rawHeading: '弱提示词',
  rawText: '做一个高级护肤广告，有瓶子、柔光、现代风格、高质量。',
  repairHeading: '按 anatomy 修正',
  repairText:
    'Premium skincare product-page hero image of a translucent amber serum bottle, centered 4:5 crop, clean cream background, softbox lighting from upper left, visible glass refraction, preserve bottle silhouette and label position from reference image, leave negative space above for later headline, no generated text, no watermark. Review bottle silhouette first.',
  ruleTitle: 'Anatomy 规则',
  ruleText: '结果失败时，先说出失败的是哪个部件，再改提示词。这样修改才有证据，而不是凭感觉。',
  vogueHeading: '在 Vogue AI 中使用 prompt anatomy',
  vogueText:
    '改写 Vogue AI 提示词库案例时，先标记哪些 anatomy 部件已经有效，再只改缺失部件。这样比每次整段重写更快。',
  checklistHeading: 'Prompt anatomy 检查表',
  checklistItems: [
    '提示词是否写清了准确主体？',
    '是否说明图片将用于哪里？',
    '是否指定裁切、机位距离和安全区？',
    '风格语言是否放在主体和构图之后？',
    '参考图是否有明确交接规则？',
    '是否包含一个首轮结果检查点？',
  ],
  faqHeading: 'FAQ',
  faq: [
    ['什么是 AI 图片提示词 anatomy？', '它是一组让提示词可控的部件：主体、场景、构图、风格、参考图交接、输出规则和检查点。'],
    ['Anatomy 和公式有什么区别？', '公式给写作顺序；anatomy 解释每个部件控制什么，以及失败后该修哪里。'],
    ['应该先修哪个部件？', '先修能解释可见失败的部件：主体、构图、风格、参考图交接或输出规则。'],
    ['长提示词一定更好吗？', '不一定。长提示词也可能缺场景或输出规则。好 anatomy 是完整，不只是长。'],
    ['参考图应该写在哪里？', '单独写一条交接句，说明参考图控制什么、什么可以变化。'],
    ['这个 anatomy 能用于不同模型吗？', '可以。它适用于 GPT Image 2、Nano Banana、Midjourney 等模型的准备和诊断。'],
  ],
};

const fr: Copy = {
  ...en,
  title: "Anatomie d'un prompt IA : ce que chaque partie contrôle",
  summary:
    "Un guide pratique pour lire un prompt image IA, repérer la partie faible et corriger le bon contrôle.",
  seoTitle: "Anatomie d'un prompt IA : guide image",
  seoDescription:
    "Comprenez sujet, contexte, composition, style, référence, règles de sortie et diagnostic du premier rendu.",
  intro:
    "L'anatomie du prompt répond à une autre question que la formule. La formule donne l'ordre d'écriture; l'anatomie explique ce que chaque partie contrôle pour réparer le bon endroit après le premier rendu.",
  tldrHeading: 'TL;DR : diagnostiquez par partie du prompt',
  tldr: [
    'Le sujet contrôle ce qui doit apparaître dans l’image.',
    "Le contexte contrôle l'usage réel et le niveau de finition attendu.",
    'La composition contrôle cadrage, distance, hiérarchie et espace vide.',
    'Le style contrôle matière, lumière, palette et ambiance.',
    'La référence indique ce qui doit rester stable.',
    'Les règles de sortie contrôlent ratio, texte, filigrane et livraison.',
  ],
  mapHeading: "Carte d'anatomie du prompt",
  mapIntro:
    "Servez-vous de cette carte lorsqu'un rendu échoue. Le défaut pointe presque toujours vers une partie faible, pas vers tout le prompt.",
  anatomyRows: [
    ['Partie', 'Ce qu’elle contrôle', 'Symptôme si elle manque'],
    ['Sujet', 'Objet, personne, scène, produit, interface ou personnage.', 'Le modèle change l’élément principal ou ajoute le mauvais sujet.'],
    ['Contexte', 'Canal, audience, objectif et niveau de polish.', 'L’image est jolie mais inutilisable pour le vrai travail.'],
    ['Composition', 'Caméra, cadrage, distance, zone sûre et hiérarchie.', 'Le cadre est chargé, mal coupé ou difficile à réutiliser.'],
    ['Style', 'Réalisme, matière, lumière, palette, époque et humeur.', 'Le rendu devient générique ou incohérent en série.'],
    ['Référence', 'Les détails protégés par l’image fournie.', 'Identité, forme produit, UI ou couleur de marque dérivent.'],
    ['Règles de sortie', 'Ratio, absence de texte, filigrane, transparence ou zone sûre.', 'L’image demande trop de nettoyage manuel.'],
    ['Contrôle initial', 'Le premier critère de réussite après génération.', 'Chaque révision devient une réécriture complète.'],
  ],
  readHeading: 'Lire un prompt avant de le réécrire',
  readText:
    "Soulignez chaque partie. S'il manque une partie, n'ajoutez pas d'adjectifs: ajoutez le contrôle manquant. Si tout est présent, modifiez uniquement la partie qui explique le défaut visible.",
  labeledPromptHeading: 'Exemple de prompt annoté',
  labeledPromptIntro:
    'Le prompt ci-dessous est volontairement découpé. Il se corrige plus facilement qu’un long paragraphe parce que chaque phrase a un rôle.',
  productImageAlt: 'Exemple d’anatomie de prompt produit dans la bibliothèque Vogue AI',
  productCaption:
    'Un exemple produit rend l’anatomie visible: sujet, matière, lumière, cadrage et règles de sortie peuvent échouer séparément.',
  referenceHeading: 'La référence est une partie distincte',
  referenceText:
    "Une image de référence n'est pas une instruction magique. Elle doit dire ce qui reste fixe et ce qui peut changer. Pour un portrait, elle peut protéger l'identité du visage tout en laissant bouger tenue, fond et style.",
  referenceImageAlt: 'Exemple d’anatomie de prompt avec référence dans la bibliothèque Vogue AI',
  referenceCaption:
    "Un portrait guidé par référence a besoin d'une phrase de transfert pour protéger l'identité tout en autorisant le style.",
  missingHeading: 'Symptômes des parties manquantes',
  missingRows: [
    ['Symptôme', 'Partie probable', 'Correction'],
    ['Le sujet change entre générations', 'Sujet ou référence.', 'Réécrire la phrase sujet et clarifier le rôle de la référence.'],
    ['L’image est belle mais inutile', 'Contexte.', 'Nommer le canal, l’audience et l’usage de production.'],
    ['Le cadrage est inutilisable', 'Composition.', 'Préciser ratio, distance caméra et zone sûre.'],
    ['Le style est générique', 'Contrôles de style.', 'Ajouter palette, matière, lumière et ton de marque.'],
    ['Logo ou UI dérive', 'Référence.', 'Dire exactement ce que l’image fournie contrôle.'],
    ['Des artefacts texte apparaissent', 'Règles de sortie.', 'Préciser sans texte, placeholder seulement ou texte ajouté ensuite.'],
  ],
  diagnosisHeading: 'Diagnostic du premier rendu par anatomie',
  diagnosisItems: [
    'Si le mauvais objet apparaît, corrigez le sujet.',
    'Si l’objet est bon mais le cadre échoue, corrigez la composition.',
    'Si le cadre marche mais l’ambiance est plate, corrigez le style.',
    'Si l’identité dérive, corrigez la référence avant de changer de modèle.',
    'Si l’image est presque utilisable, corrigez les règles de sortie.',
  ],
  socialImageAlt: 'Exemple d’anatomie de prompt social dans la bibliothèque Vogue AI',
  socialCaption:
    'Les posters révèlent vite les problèmes de composition: espace titre, hiérarchie du sujet et ratio de canal comptent tous.',
  workedHeading: "Réparation d'anatomie",
  rawHeading: 'Prompt faible',
  rawText:
    'Créer une publicité skincare premium avec un flacon, lumière douce, style moderne, haute qualité.',
  repairHeading: 'Correction structurée',
  repairText: en.repairText,
  ruleTitle: "Règle d'anatomie",
  ruleText:
    'Quand un rendu échoue, nommez d’abord la partie d’anatomie qui a échoué. La révision devient factuelle au lieu d’être une question de goût.',
  vogueHeading: "Utiliser l'anatomie dans Vogue AI",
  vogueText:
    'Quand vous adaptez un exemple de la bibliothèque Vogue AI, marquez les parties qui fonctionnent déjà, puis changez seulement la partie absente. C’est plus rapide que repartir de zéro.',
  checklistHeading: 'Checklist d’anatomie de prompt',
  checklistItems: [
    'Le sujet exact est-il nommé?',
    'L’usage de l’image est-il clair?',
    'Le cadrage, la distance caméra et la zone sûre sont-ils indiqués?',
    'Le style arrive-t-il après sujet et composition?',
    'La référence a-t-elle une règle de transfert claire?',
    'Y a-t-il un seul contrôle initial?',
  ],
  faqHeading: 'FAQ',
  faq: [
    ['Qu’est-ce que l’anatomie d’un prompt image IA?', 'C’est l’ensemble des parties qui rendent un prompt contrôlable: sujet, contexte, composition, style, référence, règles de sortie et contrôle initial.'],
    ['Quelle différence avec une formule?', 'La formule donne l’ordre d’écriture; l’anatomie explique ce que chaque partie contrôle et comment diagnostiquer un échec.'],
    ['Quelle partie corriger en premier?', 'Celle qui explique le défaut visible: sujet, composition, style, référence ou règles de sortie.'],
    ['Un long prompt a-t-il une meilleure anatomie?', 'Non. Un long prompt peut encore manquer de contexte ou de règles de sortie.'],
    ['Où mentionner une image de référence?', 'Dans une phrase séparée qui dit ce qu’elle contrôle et ce qui peut changer.'],
    ['Cette anatomie marche-t-elle avec plusieurs modèles?', 'Oui. Elle aide à préparer et diagnostiquer les prompts, même si GPT Image 2, Nano Banana ou Midjourney réagissent différemment.'],
  ],
};

const ru: Copy = {
  ...en,
  title: 'Анатомия промпта для AI-изображений: что контролирует каждая часть',
  summary:
    'Практичный гид, который помогает читать промпт по частям, находить слабое место и исправлять видимый сбой.',
  seoTitle: 'Анатомия промпта для AI-изображений',
  seoDescription:
    'Разберите субъект, контекст, композицию, стиль, референс, правила вывода и диагностику первого результата.',
  intro:
    'Анатомия промпта отвечает не на тот же вопрос, что формула. Формула задает порядок письма, а анатомия объясняет, что контролирует каждая часть и что именно исправлять после первого результата.',
  tldrHeading: 'TL;DR: диагностируйте по части промпта',
  tldr: [
    'Субъект контролирует то, что должно быть в изображении.',
    'Контекст задает реальный сценарий и критерий пригодности.',
    'Композиция отвечает за кадр, дистанцию, иерархию и свободное место.',
    'Стиль управляет материалом, светом, палитрой и настроением.',
    'Референс показывает, что нужно сохранить.',
    'Правила вывода задают ratio, текст, водяные знаки и production fit.',
  ],
  mapHeading: 'Карта анатомии промпта',
  mapIntro:
    'Используйте карту, когда результат не удался. Обычно сбой указывает на одну слабую часть, а не на весь промпт.',
  anatomyRows: [
    ['Часть', 'Что контролирует', 'Что происходит без нее'],
    ['Субъект', 'Объект, человек, сцена, продукт, интерфейс или персонаж.', 'Модель меняет главное или добавляет неверный субъект.'],
    ['Контекст', 'Канал, аудитория, цель и уровень готовности.', 'Картинка выглядит хорошо, но не подходит задаче.'],
    ['Композиция', 'Камера, кадр, дистанция, safe area и иерархия.', 'Кадр перегружен, плохо обрезан или не переиспользуется.'],
    ['Стиль', 'Реализм, материал, свет, палитра, эпоха и настроение.', 'Результат выглядит общим или серия распадается.'],
    ['Референс', 'Какие детали защищает загруженное изображение.', 'Лицо, форма продукта, UI или цвет бренда дрейфуют.'],
    ['Правила вывода', 'Соотношение сторон, без текста, без водяного знака, прозрачность или safe area.', 'Изображение требует ручной чистки.'],
    ['Проверка', 'Первый критерий успеха после генерации.', 'Каждая правка становится полным переписыванием.'],
  ],
  readHeading: 'Как читать промпт перед переписыванием',
  readText:
    'Отметьте каждую часть. Если часть отсутствует, не добавляйте прилагательные, а добавьте недостающий контроль. Если все части есть, меняйте только ту, что объясняет видимый сбой.',
  labeledPromptHeading: 'Пример промпта с метками',
  labeledPromptIntro:
    'Промпт ниже специально разделен на части. Его легче отлаживать, потому что у каждой строки есть работа.',
  productImageAlt: 'Пример анатомии продуктового промпта из библиотеки Vogue AI',
  productCaption:
    'На продукте видно, что субъект, материал, свет, кадр и правила вывода могут ломаться независимо.',
  referenceHeading: 'Референс — отдельная часть анатомии',
  referenceText:
    'Референс не является магической командой. Он должен объяснять, что остается фиксированным и что может меняться. В портрете он может защищать лицо, а одежда, фон и стиль кампании могут изменяться.',
  referenceImageAlt: 'Пример анатомии промпта с референсом из библиотеки Vogue AI',
  referenceCaption:
    'Портрет с референсом требует отдельной фразы, чтобы модель сохраняла идентичность и меняла только стиль.',
  missingHeading: 'Симптомы отсутствующих частей',
  missingRows: [
    ['Симптом', 'Вероятно отсутствует', 'Исправление'],
    ['Субъект меняется между генерациями', 'Субъект или референс.', 'Переписать субъект и уточнить роль референса.'],
    ['Картинка красивая, но бесполезная', 'Контекст.', 'Назвать канал, аудиторию и production use.'],
    ['Кадр нельзя использовать', 'Композиция.', 'Указать ratio, дистанцию камеры и safe area.'],
    ['Стиль слишком общий', 'Стиль.', 'Добавить палитру, материал, свет и тон бренда.'],
    ['Лого или UI расползаются', 'Референс.', 'Сказать, что именно контролирует загруженная картинка.'],
    ['Появляются текстовые артефакты', 'Правила вывода.', 'Указать без текста, placeholder или текст добавить позже.'],
  ],
  diagnosisHeading: 'Диагностика первого результата',
  diagnosisItems: [
    'Если появился неправильный объект, сначала исправьте субъект.',
    'Если объект верный, но кадр плохой, исправьте композицию.',
    'Если кадр работает, но настроение плоское, исправьте стиль.',
    'Если идентичность дрейфует, исправьте референс до смены модели.',
    'Если изображение почти готово, исправьте правила вывода.',
  ],
  socialImageAlt: 'Пример анатомии промпта для социального постера из библиотеки Vogue AI',
  socialCaption:
    'Постеры быстро показывают проблемы композиции: место под заголовок, иерархия субъекта и ratio важны одновременно.',
  workedHeading: 'Пример исправления по анатомии',
  rawHeading: 'Слабый промпт',
  rawText:
    'Сделать premium skincare ad с бутылкой, мягким светом, modern style, high quality.',
  repairHeading: 'Исправление по анатомии',
  repairText: en.repairText,
  ruleTitle: 'Правило анатомии',
  ruleText:
    'Когда результат не удался, сначала назовите провалившуюся часть анатомии. Так правка опирается на видимый сбой, а не на вкус.',
  vogueHeading: 'Используйте анатомию в Vogue AI',
  vogueText:
    'При адаптации примера из библиотеки Vogue AI отметьте части, которые уже работают, и меняйте только недостающую часть. Это быстрее, чем писать промпт заново.',
  checklistHeading: 'Чеклист анатомии промпта',
  checklistItems: [
    'Назван ли точный субъект?',
    'Понятно ли, где будет использоваться изображение?',
    'Указаны ли кадр, дистанция камеры и safe area?',
    'Стиль стоит после субъекта и композиции?',
    'У референса есть четкая роль?',
    'Есть ли один критерий первого результата?',
  ],
  faqHeading: 'FAQ',
  faq: [
    ['Что такое анатомия промпта для AI-изображений?', 'Это набор частей, которые делают промпт управляемым: субъект, контекст, композиция, стиль, референс, правила вывода и проверка.'],
    ['Чем анатомия отличается от формулы?', 'Формула задает порядок, а анатомия объясняет, что контролирует каждая часть и как исправлять сбои.'],
    ['Что исправлять первым?', 'Ту часть, которая объясняет видимый сбой: субъект, композицию, стиль, референс или правила вывода.'],
    ['Длинный промпт всегда лучше?', 'Нет. Длинный промпт может все еще не иметь контекста или правил вывода.'],
    ['Где писать про референс?', 'В отдельной фразе, где сказано, что он сохраняет и что может измениться.'],
    ['Работает ли эта анатомия для разных моделей?', 'Да. Она помогает готовить и диагностировать промпты, даже если GPT Image 2, Nano Banana и Midjourney ведут себя по-разному.'],
  ],
};

const pt: Copy = {
  ...en,
  title: 'Anatomia de prompt de imagem IA: o que cada parte controla',
  summary:
    'Um guia prático para ler prompts por partes, encontrar o ponto fraco e corrigir a falha certa.',
  seoTitle: 'Anatomia de Prompt de Imagem IA',
  seoDescription:
    'Entenda assunto, contexto, composição, estilo, referência, regras de saída e diagnóstico do primeiro resultado.',
  intro:
    'A anatomia do prompt responde a uma pergunta diferente da fórmula. A fórmula mostra a ordem de escrita; a anatomia explica o que cada parte controla para você corrigir o ponto certo depois da primeira imagem.',
  tldrHeading: 'TL;DR: diagnostique pela parte do prompt',
  tldr: [
    'Assunto controla o que precisa existir na imagem.',
    'Contexto controla o uso real e o que conta como útil.',
    'Composição controla corte, distância, hierarquia e espaço negativo.',
    'Estilo controla material, luz, paleta e clima.',
    'Referência controla o que deve permanecer estável.',
    'Regras de saída controlam proporção, texto, marca d’água e entrega.',
  ],
  mapHeading: 'Mapa de anatomia do prompt',
  mapIntro:
    'Use este mapa quando um resultado falhar. A falha quase sempre aponta para uma parte fraca, não para o prompt inteiro.',
  anatomyRows: [
    ['Parte', 'Controla', 'Falha quando falta'],
    ['Assunto', 'Objeto, pessoa, cena, produto, interface ou personagem.', 'O modelo troca o elemento principal ou adiciona o assunto errado.'],
    ['Contexto', 'Canal, audiência, objetivo e nível de acabamento.', 'A imagem fica bonita, mas não serve para o trabalho.'],
    ['Composição', 'Câmera, corte, distância, área segura e hierarquia.', 'O quadro fica poluído, mal cortado ou difícil de reutilizar.'],
    ['Estilo', 'Realismo, material, luz, paleta, época e clima.', 'O resultado fica genérico ou inconsistente em série.'],
    ['Referência', 'Quais detalhes a imagem enviada protege.', 'Identidade, forma do produto, UI ou cor de marca mudam.'],
    ['Regras de saída', 'Proporção, sem texto, sem marca d’água, transparência ou área segura.', 'A imagem precisa de limpeza manual.'],
    ['Revisão inicial', 'Primeiro critério de aprovação depois da geração.', 'Toda revisão vira uma reescrita completa.'],
  ],
  readHeading: 'Leia o prompt antes de reescrever',
  readText:
    'Marque cada parte. Se uma parte falta, não adicione adjetivos: adicione o controle ausente. Se todas existem, altere apenas a parte que explica a falha visível.',
  labeledPromptHeading: 'Exemplo de prompt rotulado',
  labeledPromptIntro:
    'O prompt abaixo foi separado em partes de propósito. Ele é mais fácil de depurar porque cada frase tem uma função.',
  productImageAlt: 'Exemplo de anatomia de prompt de produto na biblioteca do Vogue AI',
  productCaption:
    'Exemplos de produto mostram a anatomia: assunto, material, luz, corte e regras de saída podem falhar separadamente.',
  referenceHeading: 'Referência é uma parte própria',
  referenceText:
    'Imagem de referência não é uma instrução mágica. Ela deve dizer o que fica fixo e o que pode mudar. Em retratos, pode preservar identidade facial enquanto figurino, fundo e estilo mudam.',
  referenceImageAlt: 'Exemplo de anatomia de prompt com referência na biblioteca do Vogue AI',
  referenceCaption:
    'Prompts de retrato com referência precisam de uma frase separada para proteger identidade e permitir mudanças de estilo.',
  missingHeading: 'Sintomas de partes ausentes',
  missingRows: [
    ['Sintoma', 'Parte provável', 'Correção'],
    ['Assunto muda entre gerações', 'Assunto ou referência.', 'Reescreva o assunto e esclareça o papel da referência.'],
    ['Imagem bonita, mas inútil', 'Contexto.', 'Nomeie canal, audiência e uso de produção.'],
    ['Corte inutilizável', 'Composição.', 'Defina proporção, distância da câmera e área segura.'],
    ['Estilo genérico', 'Controles de estilo.', 'Adicione paleta, material, luz e tom de marca.'],
    ['Logo ou UI mudam', 'Referência.', 'Diga o que a imagem enviada controla.'],
    ['Artefatos de texto aparecem', 'Regras de saída.', 'Declare sem texto, placeholder ou texto adicionado depois.'],
  ],
  diagnosisHeading: 'Diagnóstico do primeiro resultado',
  diagnosisItems: [
    'Se aparece o objeto errado, corrija o assunto primeiro.',
    'Se o objeto está certo, mas o quadro falha, corrija a composição.',
    'Se o quadro funciona, mas o clima está fraco, corrija o estilo.',
    'Se a identidade muda, corrija a referência antes de trocar de modelo.',
    'Se a imagem quase serve, corrija as regras de saída.',
  ],
  socialImageAlt: 'Exemplo de anatomia de prompt social na biblioteca do Vogue AI',
  socialCaption:
    'Posters revelam problemas de composição rapidamente porque espaço para título, hierarquia do assunto e proporção importam juntos.',
  workedHeading: 'Correção por anatomia',
  rawHeading: 'Prompt fraco',
  rawText:
    'Criar um anúncio premium de skincare com frasco, luz suave, estilo moderno, alta qualidade.',
  repairHeading: 'Correção estruturada',
  repairText: en.repairText,
  ruleTitle: 'Regra de anatomia',
  ruleText:
    'Quando um resultado falha, nomeie a parte da anatomia que falhou antes de alterar o prompt. A revisão fica baseada em evidência, não em gosto.',
  vogueHeading: 'Use a anatomia no Vogue AI',
  vogueText:
    'Ao adaptar um exemplo da biblioteca do Vogue AI, marque as partes que já funcionam e altere apenas a parte ausente. É mais rápido do que recomeçar do zero.',
  checklistHeading: 'Checklist de anatomia de prompt',
  checklistItems: [
    'O assunto exato está nomeado?',
    'O uso da imagem está claro?',
    'Corte, distância da câmera e área segura estão definidos?',
    'O estilo vem depois de assunto e composição?',
    'A referência tem uma regra clara?',
    'Há uma revisão inicial única?',
  ],
  faqHeading: 'FAQ',
  faq: [
    ['O que é anatomia de prompt para imagem IA?', 'É o conjunto de partes que torna o prompt controlável: assunto, contexto, composição, estilo, referência, regras de saída e revisão inicial.'],
    ['Como ela difere de uma fórmula?', 'A fórmula dá a ordem de escrita; a anatomia explica o que cada parte controla e como diagnosticar falhas.'],
    ['Qual parte corrigir primeiro?', 'A parte que explica a falha visível: assunto, composição, estilo, referência ou regras de saída.'],
    ['Prompts longos têm anatomia melhor?', 'Não. Um prompt longo ainda pode faltar contexto ou regras de saída.'],
    ['Onde mencionar imagens de referência?', 'Em uma frase separada que diga o que a referência controla e o que pode mudar.'],
    ['Funciona com modelos diferentes?', 'Sim. A anatomia ajuda a preparar e diagnosticar prompts mesmo quando GPT Image 2, Nano Banana e Midjourney respondem de formas diferentes.'],
  ],
};

const ja: Copy = {
  ...zh,
  title: 'AI 画像プロンプト Anatomy：各パートの役割と直し方',
  summary:
    'AI 画像プロンプトをパートごとに読み、弱い部分を見つけて初回結果を正しく修正するためのガイドです。',
  seoTitle: 'AI 画像プロンプト Anatomy ガイド',
  seoDescription:
    '主題、用途、構図、スタイル、参照画像、出力ルール、初回診断を整理します。',
  intro:
    'Prompt anatomy は formula とは別の役割です。formula は書く順序を示し、anatomy は各パートが何を制御するかを説明します。初回結果が失敗した時、どこを直すべきかが分かります。',
  tldrHeading: 'TL;DR：好みではなくパートで診断する',
  tldr: [
    '主題は画像に必ず存在するものを制御します。',
    '用途は何のための画像か、何を可用とするかを決めます。',
    '構図は切り抜き、距離、階層、余白を制御します。',
    'スタイルは素材、光、色、雰囲気を制御します。',
    '参照画像は何を保持するかを決めます。',
    '出力ルールは比率、文字、透かし、制作適合性を制御します。',
  ],
  mapHeading: 'Prompt anatomy マップ',
  mapIntro:
    '結果が失敗した時はこのマップで確認します。失敗の多くはプロンプト全体ではなく、弱いパート一つに由来します。',
  anatomyRows: [
    ['パート', '制御するもの', '欠けた時の症状'],
    ['主題', '物体、人物、シーン、商品、UI、キャラクター。', '主役が変わる、または不要な主体が追加される。'],
    ['用途', 'チャンネル、読者、目的、仕上がりレベル。', 'きれいだが実務に使えない。'],
    ['構図', 'カメラ、切り抜き、距離、安全区、階層。', '画面が混雑し、切り抜きが悪く、再利用しにくい。'],
    ['スタイル', 'リアルさ、素材、光、色、時代、雰囲気。', '汎用的でシリーズが揃わない。'],
    ['参照画像', 'アップロード画像が守るべき細部。', '本人性、商品形状、UI、ブランド色がずれる。'],
    ['出力ルール', '比率、文字なし、透かしなし、透明背景、安全区。', '公開前に手作業の修正が必要になる。'],
    ['初回チェック', '生成後の最初の合否基準。', '毎回すべてを書き直してしまう。'],
  ],
  readHeading: '書き直す前に prompt を読む',
  readText:
    '各パートに印を付けます。欠けたパートがあるなら形容詞を足すのではなく、足りない制御を補います。全パートがあるなら、見える失敗を説明する一箇所だけを変えます。',
  labeledPromptHeading: 'ラベル付き prompt anatomy 例',
  labeledPromptIntro:
    '下のプロンプトは意図的にパート分けしています。一文ごとに役割があるため、長い一段落よりも修正しやすくなります。',
  productImageAlt: 'Vogue AI プロンプトライブラリの商品プロンプト anatomy 例',
  productCaption:
    '商品例では、主題、素材、光、切り抜き、出力ルールがそれぞれ独立して失敗し得ることが分かります。',
  referenceHeading: 'Reference handoff は独立したパート',
  referenceText:
    '参照画像は万能指示ではありません。何を固定し、何を変えてよいかを書く必要があります。人物なら、顔の本人性は守りつつ、服装、背景、キャンペーン表現は変えられます。',
  referenceImageAlt: 'Vogue AI プロンプトライブラリの参照画像 anatomy 例',
  referenceCaption:
    '参照画像を使う人物プロンプトでは、本人性を守りながらスタイルを変えるための handoff 文が必要です。',
  missingHeading: '欠けたパートの症状',
  missingRows: [
    ['症状', '欠けている可能性', '修正'],
    ['生成ごとに主題が変わる', '主題または参照画像。', '主題文を書き直し、参照画像の役割を明確にする。'],
    ['きれいだが使えない', '用途。', 'チャンネル、対象、制作目的を書く。'],
    ['切り抜きが使えない', '構図。', '比率、カメラ距離、安全区を指定する。'],
    ['スタイルが汎用的', 'スタイル制御。', '色、素材、光、ブランドトーンを足す。'],
    ['ロゴや UI がずれる', '参照画像。', 'アップロード画像が制御するものを明記する。'],
    ['文字のノイズが出る', '出力ルール。', '文字なし、プレースホルダーのみ、後入れなどを指定する。'],
  ],
  diagnosisHeading: 'Anatomy で初回結果を診断する',
  diagnosisItems: [
    '違う物体が出たら、まず主題を直す。',
    '物体は正しいが画面が失敗したら、構図を直す。',
    '構図は良いが雰囲気が弱いなら、スタイルを直す。',
    '本人性がずれるなら、モデル変更前に参照画像の役割を直す。',
    'ほぼ使えるが清掃が必要なら、出力ルールを直す。',
  ],
  socialImageAlt: 'Vogue AI プロンプトライブラリのSNSポスター anatomy 例',
  socialCaption:
    'ポスターでは、見出しスペース、主題の階層、チャンネル比率がすべて効くため、構図の問題がすぐ見えます。',
  workedHeading: 'Anatomy 修正例',
  rawHeading: '弱い prompt',
  rawText: '高級スキンケア広告を作る。ボトル、柔らかい光、モダン、高品質。',
  repairHeading: 'Anatomy ベースの修正',
  repairText: en.repairText,
  ruleTitle: 'Anatomy ルール',
  ruleText:
    '結果が失敗したら、プロンプトを変える前に失敗した anatomy パートを言語化します。修正が感覚ではなく観察に基づきます。',
  vogueHeading: 'Vogue AI で prompt anatomy を使う',
  vogueText:
    'Vogue AI のプロンプトライブラリ例を使う時は、すでに機能している anatomy パートを残し、不足している部分だけ変えます。毎回ゼロから書くより速くなります。',
  checklistHeading: 'Prompt anatomy チェックリスト',
  checklistItems: [
    '正確な主題が書かれているか。',
    '画像の使用場所が説明されているか。',
    '切り抜き、カメラ距離、安全区が指定されているか。',
    'スタイルは主題と構図の後にあるか。',
    '参照画像の handoff ルールが明確か。',
    '初回結果のチェック項目が一つあるか。',
  ],
  faqHeading: 'FAQ',
  faq: [
    ['AI 画像プロンプト anatomy とは？', 'プロンプトを制御可能にするパートの集合です。主題、用途、構図、スタイル、参照画像、出力ルール、初回チェックを含みます。'],
    ['Formula との違いは？', 'Formula は書く順序、anatomy は各パートが何を制御し、失敗後どこを直すかを示します。'],
    ['最初に直すべきパートは？', '目に見える失敗を説明するパートです。主題、構図、スタイル、参照画像、出力ルールのいずれかです。'],
    ['長いプロンプトほど良いですか？', 'いいえ。長くても用途や出力ルールが欠けていれば弱いプロンプトです。'],
    ['参照画像はどこに書きますか？', '何を保持し、何を変えてよいかを説明する独立した文として書きます。'],
    ['複数モデルで使えますか？', '使えます。GPT Image 2、Nano Banana、Midjourney の挙動は違っても、準備と診断には同じ anatomy が役立ちます。'],
  ],
};

const ko: Copy = {
  ...zh,
  title: 'AI 이미지 프롬프트 Anatomy: 각 파트의 역할과 수정법',
  summary:
    'AI 이미지 프롬프트를 파트별로 읽고 약한 부분을 찾아 첫 결과를 정확히 수정하는 가이드입니다.',
  seoTitle: 'AI 이미지 프롬프트 Anatomy 가이드',
  seoDescription:
    '주제, 맥락, 구도, 스타일, 레퍼런스, 출력 규칙, 첫 결과 진단을 정리합니다.',
  intro:
    'Prompt anatomy는 formula와 다른 질문에 답합니다. formula는 작성 순서를 알려주고, anatomy는 각 파트가 무엇을 제어하는지 설명합니다. 그래서 첫 결과가 실패했을 때 어디를 고쳐야 하는지 알 수 있습니다.',
  tldrHeading: 'TL;DR: 취향이 아니라 파트별로 진단하세요',
  tldr: [
    '주제는 이미지에 반드시 있어야 할 것을 제어합니다.',
    '맥락은 이미지의 목적과 사용 가능 기준을 정합니다.',
    '구도는 크롭, 거리, 위계, 여백을 제어합니다.',
    '스타일은 재질, 조명, 팔레트, 무드를 제어합니다.',
    '레퍼런스는 업로드 이미지에서 유지할 것을 정합니다.',
    '출력 규칙은 비율, 텍스트, 워터마크, 제작 적합성을 제어합니다.',
  ],
  mapHeading: 'Prompt anatomy 지도',
  mapIntro:
    '결과가 실패했을 때 이 지도를 사용하세요. 실패는 대개 전체 프롬프트가 아니라 약한 파트 하나를 가리킵니다.',
  anatomyRows: [
    ['파트', '제어하는 것', '빠졌을 때의 증상'],
    ['주제', '오브젝트, 인물, 장면, 제품, 인터페이스, 캐릭터.', '모델이 주인공을 바꾸거나 잘못된 주제를 추가합니다.'],
    ['맥락', '채널, 대상, 목적, 완성도.', '이미지는 예쁘지만 실제 작업에는 맞지 않습니다.'],
    ['구도', '카메라, 크롭, 거리, 안전 영역, 시각 위계.', '프레임이 복잡하거나 잘못 잘리고 재사용하기 어렵습니다.'],
    ['스타일', '사실감, 재질, 조명, 팔레트, 시대감, 무드.', '결과가 평범하거나 시리즈가 불안정합니다.'],
    ['레퍼런스', '업로드 이미지가 보호할 세부 요소.', '정체성, 제품 형태, UI, 브랜드 색상이 흔들립니다.'],
    ['출력 규칙', '비율, 텍스트 없음, 워터마크 없음, 투명 배경, 안전 영역.', '사용 전에 수동 정리가 필요합니다.'],
    ['첫 검토', '생성 후 첫 통과/실패 기준.', '매번 전체 재작성으로 이어집니다.'],
  ],
  readHeading: '다시 쓰기 전에 prompt 읽기',
  readText:
    '각 파트에 표시하세요. 빠진 파트가 있으면 형용사를 더하지 말고 부족한 제어를 추가합니다. 모든 파트가 있다면 눈에 보이는 실패를 설명하는 한 파트만 바꿉니다.',
  labeledPromptHeading: '라벨이 붙은 prompt anatomy 예시',
  labeledPromptIntro:
    '아래 프롬프트는 일부러 파트별로 나누었습니다. 각 문장에 역할이 있어 긴 문단보다 디버깅하기 쉽습니다.',
  productImageAlt: 'Vogue AI 프롬프트 라이브러리의 제품 프롬프트 anatomy 예시',
  productCaption:
    '제품 예시는 주제, 재질, 조명, 크롭, 출력 규칙이 각각 독립적으로 실패할 수 있음을 보여줍니다.',
  referenceHeading: 'Reference handoff는 독립 파트입니다',
  referenceText:
    '레퍼런스 이미지는 마법 지시가 아닙니다. 무엇을 고정하고 무엇을 바꿀 수 있는지 말해야 합니다. 인물에서는 얼굴 정체성을 보호하면서 의상, 배경, 캠페인 스타일은 바꿀 수 있습니다.',
  referenceImageAlt: 'Vogue AI 프롬프트 라이브러리의 레퍼런스 기반 anatomy 예시',
  referenceCaption:
    '레퍼런스 기반 인물 프롬프트는 정체성을 보호하면서 스타일을 바꾸기 위한 handoff 문장이 필요합니다.',
  missingHeading: '빠진 파트의 증상',
  missingRows: [
    ['증상', '빠졌을 가능성이 큰 파트', '수정 방법'],
    ['생성할 때마다 주제가 바뀜', '주제 또는 레퍼런스.', '주제 문장을 다시 쓰고 레퍼런스 역할을 명확히 합니다.'],
    ['예쁘지만 쓸 수 없음', '맥락.', '채널, 대상, 제작 목적을 적습니다.'],
    ['크롭이 사용할 수 없음', '구도.', '비율, 카메라 거리, 안전 영역을 지정합니다.'],
    ['스타일이 평범함', '스타일 제어.', '팔레트, 재질, 조명, 브랜드 톤을 추가합니다.'],
    ['로고나 UI 구조가 흔들림', '레퍼런스.', '업로드 이미지가 무엇을 제어하는지 말합니다.'],
    ['텍스트 잡음이 생김', '출력 규칙.', '텍스트 없음, placeholder만, 또는 나중에 텍스트 추가를 명시합니다.'],
  ],
  diagnosisHeading: 'Anatomy로 첫 결과 진단하기',
  diagnosisItems: [
    '잘못된 오브젝트가 나오면 먼저 주제를 고칩니다.',
    '오브젝트는 맞지만 프레임이 실패하면 구도를 고칩니다.',
    '프레임은 맞지만 무드가 약하면 스타일을 고칩니다.',
    '정체성이 흔들리면 모델을 바꾸기 전에 레퍼런스 역할을 고칩니다.',
    '거의 쓸 수 있지만 정리가 필요하면 출력 규칙을 고칩니다.',
  ],
  socialImageAlt: 'Vogue AI 프롬프트 라이브러리의 소셜 포스터 anatomy 예시',
  socialCaption:
    '포스터는 헤드라인 공간, 주제 위계, 채널 비율이 모두 중요하기 때문에 구도 문제가 빠르게 드러납니다.',
  workedHeading: 'Anatomy 수정 예시',
  rawHeading: '약한 prompt',
  rawText: '프리미엄 스킨케어 광고를 만들어줘. 병, 부드러운 빛, 모던 스타일, 고품질.',
  repairHeading: 'Anatomy 기반 수정',
  repairText: en.repairText,
  ruleTitle: 'Anatomy 규칙',
  ruleText:
    '결과가 실패하면 프롬프트를 바꾸기 전에 실패한 anatomy 파트를 먼저 이름 붙이세요. 수정이 취향이 아니라 관찰에 기반하게 됩니다.',
  vogueHeading: 'Vogue AI에서 prompt anatomy 사용하기',
  vogueText:
    'Vogue AI 프롬프트 라이브러리 예시를 적용할 때 이미 작동하는 anatomy 파트는 남기고 빠진 파트만 바꾸세요. 매번 처음부터 쓰는 것보다 빠릅니다.',
  checklistHeading: 'Prompt anatomy 체크리스트',
  checklistItems: [
    '정확한 주제가 적혀 있나요?',
    '이미지가 어디에 쓰일지 설명되어 있나요?',
    '크롭, 카메라 거리, 안전 영역이 지정되어 있나요?',
    '스타일 문구가 주제와 구도 뒤에 있나요?',
    '레퍼런스 이미지의 handoff 규칙이 명확한가요?',
    '첫 결과 검토 기준이 하나 있나요?',
  ],
  faqHeading: 'FAQ',
  faq: [
    ['AI 이미지 프롬프트 anatomy란 무엇인가요?', '프롬프트를 제어 가능하게 만드는 파트의 집합입니다. 주제, 맥락, 구도, 스타일, 레퍼런스, 출력 규칙, 첫 검토를 포함합니다.'],
    ['Formula와 무엇이 다른가요?', 'Formula는 작성 순서이고 anatomy는 각 파트가 무엇을 제어하며 실패 후 어디를 수정할지 알려줍니다.'],
    ['어떤 파트를 먼저 고쳐야 하나요?', '보이는 실패를 설명하는 파트입니다. 주제, 구도, 스타일, 레퍼런스, 출력 규칙 중 하나입니다.'],
    ['긴 프롬프트가 항상 더 좋은가요?', '아닙니다. 길어도 맥락이나 출력 규칙이 빠져 있으면 약한 프롬프트입니다.'],
    ['레퍼런스 이미지는 어디에 언급하나요?', '무엇을 유지하고 무엇을 바꿀 수 있는지 말하는 독립 문장으로 적습니다.'],
    ['여러 모델에서 쓸 수 있나요?', '가능합니다. GPT Image 2, Nano Banana, Midjourney의 반응은 달라도 준비와 진단에는 같은 anatomy가 도움이 됩니다.'],
  ],
};

const makeContent = (copy: Copy): BlogContentBlock[] => [
  { type: 'paragraph', text: copy.intro },
  { type: 'heading', level: 2, text: copy.tldrHeading },
  { type: 'list', items: copy.tldr },
  { type: 'heading', level: 2, text: copy.mapHeading },
  { type: 'paragraph', text: copy.mapIntro },
  {
    type: 'table',
    headers: copy.anatomyRows[0],
    rows: copy.anatomyRows.slice(1),
  },
  { type: 'heading', level: 2, text: copy.readHeading },
  { type: 'paragraph', text: copy.readText },
  { type: 'heading', level: 2, text: copy.labeledPromptHeading },
  { type: 'paragraph', text: copy.labeledPromptIntro },
  {
    type: 'image',
    src: images.product,
    alt: copy.productImageAlt,
    caption: copy.productCaption,
  },
  { type: 'list', items: [...labeledPrompt] },
  { type: 'heading', level: 2, text: copy.referenceHeading },
  { type: 'paragraph', text: copy.referenceText },
  {
    type: 'image',
    src: images.reference,
    alt: copy.referenceImageAlt,
    caption: copy.referenceCaption,
  },
  { type: 'heading', level: 2, text: copy.missingHeading },
  {
    type: 'table',
    headers: copy.missingRows[0],
    rows: copy.missingRows.slice(1),
  },
  { type: 'heading', level: 2, text: copy.diagnosisHeading },
  { type: 'list', items: copy.diagnosisItems },
  {
    type: 'image',
    src: images.social,
    alt: copy.socialImageAlt,
    caption: copy.socialCaption,
  },
  { type: 'heading', level: 2, text: copy.workedHeading },
  { type: 'heading', level: 3, text: copy.rawHeading },
  { type: 'paragraph', text: copy.rawText },
  { type: 'heading', level: 3, text: copy.repairHeading },
  { type: 'paragraph', text: copy.repairText },
  { type: 'callout', title: copy.ruleTitle, text: copy.ruleText },
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

export const promptAnatomyForAiImagesAutoBlogPost: BlogPostSource = {
  slug: 'prompt-anatomy-for-ai-images',
  date: '2026-06-26',
  updatedAt: '2026-06-27',
  author: 'Vogue AI Team',
  image: images.hero,
  imageAlt: 'Prompt engineering reference example from the Vogue AI library',
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
