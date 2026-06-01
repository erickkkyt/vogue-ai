import type { BlogContentBlock, BlogPostSource } from '@/lib/blog-data';

const aiPictureIdeaImages = {
  storyboard:
    'https://media.vogueai.net/blog/auto/ai-picture-ideas/cb4379391f85-16-panel-story-illustration-cute-rounded-picture-1.jpg',
  character:
    'https://media.vogueai.net/blog/auto/ai-picture-ideas/009ad5530d79-create-picture-2d-digital-illustration-michael-jackson-1.jpg',
  styleReference:
    'https://media.vogueai.net/blog/auto/ai-picture-ideas/49f9125f4017-exploring-midjourney-style-reference-unlock-sref-680574490-1.jpg',
} as const;

const copyablePromptBlocks = [
  'Storyboard idea: Create a 16-panel visual storyboard about [story premise], cute rounded illustration style, each panel showing a different beat, consistent character design, clear color palette, readable visual sequence, no text, 4:5 aspect ratio.',
  'Character idea: Create a stylized 2D digital illustration of [character], expressive pose, iconic silhouette, [era/style] outfit, clean background, strong color harmony, friendly but memorable expression, no text, no watermark.',
  'Product scene idea: Premium product hero image of [product] in [setting], tactile material detail, controlled studio lighting, clean background, strong shadow, [brand palette], 4:5 aspect ratio, no text, no watermark.',
  'Style-reference idea: Create an art-direction board for [subject], inspired by [style reference], include color mood, texture, lighting, composition thumbnails, editorial layout, premium creative direction, no final text.',
  'Social poster idea: Vertical launch visual for [topic], one clear hero subject, bold negative space for future headline, energetic palette, platform-ready crop, no small text, no watermark.',
] as const;

type LocalizedImageText = {
  storyboardAlt: string;
  storyboardCaption: string;
  characterAlt: string;
  characterCaption: string;
  styleAlt: string;
  styleCaption: string;
};

const defaultImageText: LocalizedImageText = {
  storyboardAlt: 'Storyboard-style AI picture idea from the Vogue AI prompt library',
  storyboardCaption:
    'A good AI picture idea is already a small production brief: subject, sequence, composition, style, and output rule.',
  characterAlt: 'Character illustration prompt-library example for AI picture ideas',
  characterCaption:
    'Character ideas need a silhouette, pose, visual era, and expression before style adjectives matter.',
  styleAlt: 'Style-reference prompt-library example for AI picture ideas',
  styleCaption:
    'Style-reference ideas work best when the prompt names what the reference controls: palette, texture, light, or composition.',
};

type LocalizedCopy = {
  intro: string;
  tldrHeading?: string;
  tldr: string[];
  formulaIntro: string;
  ideaHeading: string;
  ideaHeaders: string[];
  ideaRows: string[][];
  storyboardHeading: string;
  storyboardBody: string;
  characterHeading: string;
  characterBody: string;
  styleHeading: string;
  styleBody: string;
  modelHeading: string;
  modelHeaders: string[];
  modelRows: string[][];
  cardHeading: string;
  cardList: string[];
  revisionHeading: string;
  revisionList: string[];
  mistakeHeading: string;
  mistakeHeaders: string[];
  mistakeRows: string[][];
  handoffHeading: string;
  handoffList: string[];
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
      text: copy.tldrHeading ?? 'TL;DR',
    },
    {
      type: 'list',
      items: copy.tldr,
    },
    {
      type: 'image',
      src: aiPictureIdeaImages.storyboard,
      alt: imageText.storyboardAlt,
      caption: imageText.storyboardCaption,
    },
    {
      type: 'heading',
      level: 2,
      text: copy.ideaHeading,
    },
    {
      type: 'paragraph',
      text: copy.formulaIntro,
    },
    {
      type: 'table',
      headers: copy.ideaHeaders,
      rows: copy.ideaRows,
    },
    {
      type: 'heading',
      level: 2,
      text: copy.storyboardHeading,
    },
    {
      type: 'paragraph',
      text: copy.storyboardBody,
    },
    {
      type: 'list',
      items: [copyablePromptBlocks[0]],
    },
    {
      type: 'heading',
      level: 2,
      text: copy.characterHeading,
    },
    {
      type: 'image',
      src: aiPictureIdeaImages.character,
      alt: imageText.characterAlt,
      caption: imageText.characterCaption,
    },
    {
      type: 'paragraph',
      text: copy.characterBody,
    },
    {
      type: 'list',
      items: [copyablePromptBlocks[1]],
    },
    {
      type: 'heading',
      level: 2,
      text: copy.styleHeading,
    },
    {
      type: 'image',
      src: aiPictureIdeaImages.styleReference,
      alt: imageText.styleAlt,
      caption: imageText.styleCaption,
    },
    {
      type: 'paragraph',
      text: copy.styleBody,
    },
    {
      type: 'list',
      items: [copyablePromptBlocks[2], copyablePromptBlocks[3], copyablePromptBlocks[4]],
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
      text: copy.cardHeading,
    },
    {
      type: 'list',
      items: copy.cardList,
    },
    {
      type: 'heading',
      level: 2,
      text: copy.revisionHeading,
    },
    {
      type: 'list',
      items: copy.revisionList,
    },
    {
      type: 'heading',
      level: 2,
      text: copy.mistakeHeading,
    },
    {
      type: 'table',
      headers: copy.mistakeHeaders,
      rows: copy.mistakeRows,
    },
    {
      type: 'heading',
      level: 2,
      text: copy.handoffHeading,
    },
    {
      type: 'list',
      items: copy.handoffList,
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
    'AI picture ideas are useful only when they can become prompts. Instead of collecting vague themes, build each idea with a subject, setting, mood, composition, style modifier, output format, and first-result review rule.',
  tldr: [
    'Start with the production job: avatar, product shot, story frame, poster, wallpaper, UI hero, or social image.',
    'Turn the idea into a prompt card with subject, setting, mood, composition, style, model fit, and output rule.',
    'Use GPT Image 2 for controlled briefs, Nano Banana for quick variations, and Midjourney for style exploration.',
    'Keep public prompt blocks in English so they stay copyable inside Vogue AI.',
    'Revise by failure mode after the first result instead of rewriting the whole idea.',
  ],
  formulaIntro:
    'Use this matrix as a practical idea bank. Each row gives you the missing parts that turn inspiration into a prompt-ready concept.',
  ideaHeading: 'AI picture idea bank by production job',
  ideaHeaders: ['Use case', 'Subject', 'Mood', 'Composition', 'Best model'],
  ideaRows: [
    ['Character avatar', 'Founder, mascot, creator persona', 'Cinematic, warm, iconic', 'Centered portrait or full-body pose', 'GPT Image 2 or Nano Banana'],
    ['Product visual', 'Bottle, app screen, package, tool', 'Premium, clean, tactile', 'Studio hero frame', 'GPT Image 2'],
    ['Story frame', 'Scene, world, short narrative', 'Curious, dramatic, dreamy', 'Storyboard panel or wide cinematic shot', 'GPT Image 2'],
    ['Style exploration', 'Fashion, poster, abstract art', 'Bold, surreal, editorial', 'Art-direction board', 'Midjourney'],
    ['Social post', 'Launch idea, quote, feature', 'Energetic, simple, scroll-stopping', 'Vertical poster with safe text area', 'Nano Banana or GPT Image 2'],
  ],
  storyboardHeading: 'Template 1: storyboard picture ideas',
  storyboardBody:
    'Storyboard ideas are useful when a single picture is not enough. Ask for multiple panels, one consistent character, and a clear visual sequence so the output becomes a concept board instead of a random illustration.',
  characterHeading: 'Template 2: character and avatar ideas',
  characterBody:
    'Character ideas need shape before decoration. Define silhouette, pose, wardrobe, visual era, and expression before asking for painterly, cinematic, anime, or editorial styling.',
  styleHeading: 'Template 3: style-reference ideas',
  styleBody:
    'Style-reference prompts help when the subject is known but the art direction is not. Name what the reference controls, then keep the subject and production job explicit.',
  modelHeading: 'Which Vogue AI model should you use?',
  modelHeaders: ['Goal', 'Use GPT Image 2 when...', 'Use Nano Banana when...', 'Use Midjourney when...'],
  modelRows: [
    ['Control', 'The brief has many constraints.', 'You need quick variations.', 'The mood matters more than exact structure.'],
    ['Reference image', 'Identity or layout must stay close.', 'You are exploring fast image-to-image changes.', 'You want style-transfer direction.'],
    ['Commercial output', 'Product, UI, poster, or ad must be legible.', 'Social concepts need speed.', 'Aesthetic exploration comes first.'],
  ],
  cardHeading: 'Build a reusable idea card',
  cardList: [
    'Subject: who or what appears in the image.',
    'Setting: where the picture happens and what objects matter.',
    'Mood: the emotion the picture should create.',
    'Composition: crop, camera distance, focal point, and safe area.',
    'Style: visual era, medium, color system, texture, and lighting.',
    'Output: aspect ratio, channel, no-text rule, and review target.',
  ],
  revisionHeading: 'What to change after the first result',
  revisionList: [
    'Generic result: add a production job, audience, and channel.',
    'Wrong subject: add a reference image and state what must stay fixed.',
    'Messy layout: change crop, camera distance, and negative space before changing style.',
    'Beautiful but unusable: add output rules such as poster, avatar, thumbnail, or product hero.',
    'Style drift: save the working prompt card and change only one variable at a time.',
  ],
  mistakeHeading: 'Mistake and fix table',
  mistakeHeaders: ['Failure', 'Fix first', 'Avoid first'],
  mistakeRows: [
    ['The idea is too vague', 'Choose a real production job.', 'Adding more adjectives.'],
    ['The image ignores the subject', 'Add reference or subject constraints.', 'Switching models immediately.'],
    ['The style is strong but unusable', 'Add channel, ratio, and safe area.', 'Keeping only the mood words.'],
    ['The result repeats itself', 'Change subject, setting, or composition.', 'Changing only color.'],
    ['The prompt becomes too long', 'Split idea, style, and output rules.', 'Pasting every inspiration note.'],
  ],
  handoffHeading: 'Vogue AI handoff checklist',
  handoffList: [
    'Pick the closest prompt-library example before starting from a blank page.',
    'Choose model fit before generating: control, speed, or style exploration.',
    'Keep prompt blocks English and copyable.',
    'Save the prompt version that fixed the first failure.',
    'Reuse the card for the next picture idea instead of starting over.',
  ],
  faq: [
    ['What are good AI picture ideas?', 'Good ideas already include subject, setting, mood, composition, style, and output format. They are close enough to paste into an image generator after small edits.'],
    ['How do I turn an idea into a prompt?', 'Write the production job first, then add subject, setting, mood, camera, style, and output rule. Keep the first version simple enough to diagnose.'],
    ['Which model should I start with?', 'Start with GPT Image 2 for controlled briefs, Nano Banana for quick variations, and Midjourney for style or mood exploration.'],
    ['Should prompts stay in English?', 'For public prompt blocks, yes. English keeps the blocks easier to copy across locales and models. Surrounding explanation can be localized.'],
    ['What if the first image is bad?', 'Fix one failure mode first: subject, layout, style, reference handoff, or output rule. Rewriting everything hides what changed the result.'],
    ['Can I use reference images?', 'Use references when identity, layout, product shape, face, or palette matters. Explain what the reference controls and what can change.'],
  ],
};

const zhCopy: LocalizedCopy = {
  intro:
    'AI picture ideas 只有能变成 prompt 才有价值。不要只收集模糊主题，而要给每个 idea 补上 subject、setting、mood、composition、style modifier、output format 和 first-result review rule。',
  tldrHeading: '要点摘要',
  tldr: [
    '先确定生产任务：avatar、product shot、story frame、poster、wallpaper、UI hero 或 social image。',
    '把 idea 写成 prompt card：subject、setting、mood、composition、style、model fit 和 output rule。',
    '需要强约束时用 GPT Image 2，快速变化用 Nano Banana，风格探索用 Midjourney。',
    '公开 prompt blocks 保持英文，方便在 Vogue AI 中复制。',
    '第一张结果出来后按失败类型修改，而不是重写整个 idea。',
  ],
  formulaIntro:
    '下面的矩阵是一组可执行 idea bank。每一行都把灵感补齐成可以直接写 prompt 的概念。',
  ideaHeading: '按生产任务整理 AI picture ideas',
  ideaHeaders: ['用途', '主体', '情绪', '构图', '适合模型'],
  ideaRows: [
    ['角色头像', '创始人、吉祥物、creator persona', '电影感、温暖、标志性', '居中头像或全身姿态', 'GPT Image 2 或 Nano Banana'],
    ['产品视觉', '瓶子、App 屏幕、包装、工具', '高级、干净、有触感', 'studio hero frame', 'GPT Image 2'],
    ['故事画面', '场景、世界观、短叙事', '好奇、戏剧、梦幻', 'storyboard panel 或宽幅镜头', 'GPT Image 2'],
    ['风格探索', '时尚、海报、抽象艺术', '大胆、超现实、editorial', 'art-direction board', 'Midjourney'],
    ['社媒图', '发布点、quote、功能点', '有能量、简洁、抓眼', '带文字安全区的竖版 poster', 'Nano Banana 或 GPT Image 2'],
  ],
  storyboardHeading: '模板 1：storyboard picture ideas',
  storyboardBody:
    '当一张图不够表达想法时，用 storyboard。要求多个 panel、同一角色和清晰视觉顺序，让结果像概念板，而不是随机插画。',
  characterHeading: '模板 2：角色和头像 ideas',
  characterBody:
    '角色 idea 要先定义形状，再添加装饰。先写 silhouette、pose、wardrobe、visual era 和 expression，再谈 painterly、cinematic、anime 或 editorial。',
  styleHeading: '模板 3：style-reference ideas',
  styleBody:
    '当 subject 已经明确但 art direction 不明确时，用 style-reference prompt。说明 reference 控制 palette、texture、light 还是 composition。',
  modelHeading: 'Vogue AI 中应该用哪个模型？',
  modelHeaders: ['目标', 'GPT Image 2 适合', 'Nano Banana 适合', 'Midjourney 适合'],
  modelRows: [
    ['控制', 'brief 里约束很多', '需要快速 variations', 'mood 比结构更重要'],
    ['参考图', 'identity 或 layout 要接近原图', '快速 image-to-image 探索', '探索 style-transfer 方向'],
    ['商业产出', '产品、UI、poster 或广告要清楚', '社媒概念要速度', '先做审美探索'],
  ],
  cardHeading: '构建可复用 idea card',
  cardList: [
    'Subject：画面里是谁或什么。',
    'Setting：画面发生在哪里，哪些物件重要。',
    'Mood：想让画面产生什么情绪。',
    'Composition：crop、camera distance、focal point 和 safe area。',
    'Style：视觉年代、媒介、色彩、质感和灯光。',
    'Output：比例、渠道、no-text rule 和 review target。',
  ],
  revisionHeading: '第一张结果之后改什么',
  revisionList: [
    '结果 generic：加入生产任务、受众和渠道。',
    '主体错误：加 reference image，并说明必须固定什么。',
    '布局混乱：先改 crop、camera distance 和 negative space。',
    '好看但不可用：加入 poster、avatar、thumbnail、product hero 等输出规则。',
    '风格漂移：保存有效 prompt card，每次只改一个变量。',
  ],
  mistakeHeading: '常见错误和修正表',
  mistakeHeaders: ['失败', '先修正', '先不要做'],
  mistakeRows: [
    ['idea 太模糊', '选择真实生产任务', '继续堆形容词'],
    ['画面忽略主体', '加入 reference 或 subject constraints', '立刻换模型'],
    ['风格强但不可用', '补 channel、ratio、safe area', '只保留 mood words'],
    ['结果重复', '换 subject、setting 或 composition', '只换颜色'],
    ['prompt 过长', '拆分 idea、style、output rules', '粘贴所有灵感笔记'],
  ],
  handoffHeading: 'Vogue AI 执行清单',
  handoffList: [
    '先找最接近的 prompt-library example，再从空白开始。',
    '生成前先选模型：控制、速度或风格探索。',
    'Prompt blocks 保持英文、可复制。',
    '保存修复第一类失败的 prompt version。',
    '下一个 picture idea 从这张 card 复用，不要重来。',
  ],
  imageText: {
    storyboardAlt: 'Vogue AI 提示词库中的分镜式 AI 图片创意示例',
    storyboardCaption:
      '好的 AI 图片创意本身就是一份小型制作 brief：主体、顺序、构图、风格和输出规则都要明确。',
    characterAlt: 'Vogue AI 提示词库中的角色插画创意示例',
    characterCaption:
      '角色创意先要有轮廓、姿态、视觉年代和表情，再去堆风格形容词。',
    styleAlt: 'Vogue AI 提示词库中的风格参考创意示例',
    styleCaption:
      '风格参考类创意最好写清楚 reference 控制什么：色彩、质感、光线还是构图。',
  },
  faq: [
    ['什么是好的 AI picture idea？', '好的 idea 已经包含 subject、setting、mood、composition、style 和 output format，稍微修改就能进入生成器。'],
    ['如何把 idea 变成 prompt？', '先写生产任务，再补 subject、setting、mood、camera、style 和 output rule。第一版要简单到可以诊断。'],
    ['应该先用哪个模型？', '强控制用 GPT Image 2，快速 variations 用 Nano Banana，风格和 mood 探索用 Midjourney。'],
    ['Prompt 要保持英文吗？', '公开 prompt blocks 建议保持英文，方便跨语言和跨模型复制；解释文字可以本地化。'],
    ['第一张图很差怎么办？', '先修一个失败点：主体、布局、风格、reference handoff 或 output rule。不要一次重写全部。'],
    ['可以使用参考图吗？', '当 identity、layout、产品形状、脸或 palette 重要时使用，并说明 reference 控制什么、什么可以变化。'],
  ],
};

const frCopy: LocalizedCopy = {
  intro:
    "Les idées d'images IA ne sont utiles que lorsqu'elles deviennent des prompts. Construisez chaque idée avec sujet, décor, humeur, composition, style, format de sortie et règle de révision.",
  tldrHeading: 'Résumé',
  tldr: [
    "Commencez par le travail à produire : avatar, photo produit, scène narrative, poster, wallpaper, UI hero ou image sociale.",
    'Transformez l’idée en carte de prompt avec sujet, décor, humeur, composition, style, modèle et règle de sortie.',
    'Utilisez GPT Image 2 pour les briefs contrôlés, Nano Banana pour les variations rapides et Midjourney pour explorer le style.',
    'Gardez les blocs de prompt en anglais pour rester faciles à copier dans Vogue AI.',
    'Après le premier résultat, corrigez le type d’échec au lieu de tout réécrire.',
  ],
  formulaIntro:
    'Cette matrice sert de banque d’idées pratique. Chaque ligne ajoute les éléments qui manquent pour passer de l’inspiration au prompt.',
  ideaHeading: 'Banque d’idées par usage de production',
  ideaHeaders: ['Usage', 'Sujet', 'Humeur', 'Composition', 'Meilleur modèle'],
  ideaRows: [
    ['Avatar personnage', 'Fondateur, mascotte, persona créateur', 'Cinématique, chaleureux, iconique', 'Portrait centré ou pose entière', 'GPT Image 2 ou Nano Banana'],
    ['Visuel produit', 'Bouteille, écran app, packaging, outil', 'Premium, propre, tactile', 'Cadre studio hero', 'GPT Image 2'],
    ['Scène narrative', 'Scène, monde, mini-récit', 'Curieux, dramatique, rêveur', 'Panel storyboard ou plan cinéma large', 'GPT Image 2'],
    ['Exploration de style', 'Mode, poster, art abstrait', 'Audacieux, surréaliste, éditorial', 'Planche art-direction', 'Midjourney'],
    ['Post social', 'Lancement, citation, fonctionnalité', 'Énergique, simple, accrocheur', 'Poster vertical avec zone texte', 'Nano Banana ou GPT Image 2'],
  ],
  storyboardHeading: 'Modèle 1 : idées storyboard',
  storyboardBody:
    'Le storyboard est utile quand une seule image ne suffit pas. Demandez plusieurs panels, un personnage cohérent et une séquence lisible.',
  characterHeading: 'Modèle 2 : personnages et avatars',
  characterBody:
    'Une idée de personnage doit définir silhouette, pose, tenue, époque visuelle et expression avant les adjectifs de style.',
  styleHeading: 'Modèle 3 : idées avec référence de style',
  styleBody:
    'La référence de style aide quand le sujet est clair mais que la direction artistique reste ouverte. Dites ce que la référence contrôle.',
  modelHeading: 'Quel modèle Vogue AI choisir ?',
  modelHeaders: ['Objectif', 'GPT Image 2 si...', 'Nano Banana si...', 'Midjourney si...'],
  modelRows: [
    ['Contrôle', 'Le brief contient beaucoup de contraintes.', 'Vous voulez des variations rapides.', 'L’ambiance compte plus que la structure.'],
    ['Image de référence', 'L’identité ou la mise en page doit rester proche.', 'Vous explorez vite en image-to-image.', 'Vous cherchez une direction de style.'],
    ['Sortie commerciale', 'Produit, UI, poster ou publicité doivent être lisibles.', 'Le concept social doit aller vite.', 'L’exploration esthétique passe d’abord.'],
  ],
  cardHeading: 'Créer une carte d’idée réutilisable',
  cardList: [
    'Sujet : qui ou quoi apparaît.',
    'Décor : où se passe l’image et quels objets comptent.',
    'Humeur : émotion à produire.',
    'Composition : cadrage, distance, point focal et zone sûre.',
    'Style : époque, médium, couleurs, texture et lumière.',
    'Sortie : ratio, canal, règle sans texte et critère de revue.',
  ],
  revisionHeading: 'Que changer après le premier résultat',
  revisionList: [
    'Résultat générique : ajoutez usage, audience et canal.',
    'Mauvais sujet : ajoutez une référence et ce qui doit rester fixe.',
    'Mise en page confuse : corrigez cadrage, distance et espace négatif.',
    'Beau mais inutilisable : ajoutez poster, avatar, thumbnail ou product hero.',
    'Dérive de style : gardez la carte qui marche et changez une variable.',
  ],
  mistakeHeading: 'Table des erreurs et corrections',
  mistakeHeaders: ['Échec', 'Corriger d’abord', 'Éviter d’abord'],
  mistakeRows: [
    ['Idée trop vague', 'Choisir un vrai usage de production.', 'Ajouter plus d’adjectifs.'],
    ['Sujet ignoré', 'Ajouter référence ou contraintes de sujet.', 'Changer de modèle tout de suite.'],
    ['Style fort mais inutile', 'Ajouter canal, ratio et zone sûre.', 'Garder seulement les mots d’ambiance.'],
    ['Résultat répétitif', 'Changer sujet, décor ou composition.', 'Changer seulement la couleur.'],
    ['Prompt trop long', 'Séparer idée, style et règles de sortie.', 'Coller toutes les notes.'],
  ],
  handoffHeading: 'Checklist Vogue AI',
  handoffList: [
    'Choisissez l’exemple le plus proche dans la bibliothèque avant de partir de zéro.',
    'Choisissez le modèle selon contrôle, vitesse ou style.',
    'Gardez les prompts en anglais et copiables.',
    'Sauvegardez la version qui corrige le premier échec.',
    'Réutilisez la carte pour l’idée suivante.',
  ],
  imageText: {
    storyboardAlt: "Exemple d'idée d'image IA façon storyboard dans la bibliothèque de prompts Vogue AI",
    storyboardCaption:
      "Une bonne idée d'image IA est déjà un mini brief de production : sujet, séquence, composition, style et règle de sortie.",
    characterAlt: "Exemple d'illustration de personnage pour les idées d'images IA",
    characterCaption:
      'Une idée de personnage doit définir silhouette, pose, époque visuelle et expression avant les adjectifs de style.',
    styleAlt: "Exemple d'idée avec référence de style dans la bibliothèque de prompts",
    styleCaption:
      'Les idées avec référence de style fonctionnent mieux quand le prompt précise ce que la référence contrôle : palette, texture, lumière ou composition.',
  },
  faq: [
    ['Qu’est-ce qu’une bonne idée d’image IA ?', 'Elle contient déjà sujet, décor, humeur, composition, style et format de sortie.'],
    ['Comment transformer une idée en prompt ?', 'Écrivez le travail à produire, puis ajoutez sujet, décor, humeur, caméra, style et règle de sortie.'],
    ['Quel modèle utiliser en premier ?', 'GPT Image 2 pour le contrôle, Nano Banana pour les variations rapides, Midjourney pour le style.'],
    ['Les prompts doivent-ils rester en anglais ?', 'Oui pour les blocs publics copiables. Les explications autour peuvent être localisées.'],
    ['Que faire si la première image est mauvaise ?', 'Corrigez un seul problème : sujet, composition, style, référence ou règle de sortie.'],
    ['Puis-je utiliser des images de référence ?', 'Oui quand identité, layout, forme du produit, visage ou palette doivent rester stables.'],
  ],
};

const ruCopy: LocalizedCopy = {
  intro:
    'Идеи AI-картинок полезны только тогда, когда их можно превратить в промпт. В каждой идее должны быть субъект, среда, настроение, композиция, стиль, формат вывода и правило проверки первого результата.',
  tldrHeading: 'Кратко',
  tldr: [
    'Начните с задачи: avatar, product shot, story frame, poster, wallpaper, UI hero или social image.',
    'Соберите карточку промпта: subject, setting, mood, composition, style, model fit и output rule.',
    'GPT Image 2 подходит для контроля, Nano Banana для быстрых вариантов, Midjourney для стилистики.',
    'Публичные prompt blocks оставляйте на английском, чтобы их было легко копировать в Vogue AI.',
    'После первого результата исправляйте конкретный тип ошибки, а не весь prompt.',
  ],
  formulaIntro:
    'Эта матрица превращает вдохновение в практическую базу идей. Каждая строка закрывает недостающие элементы промпта.',
  ideaHeading: 'Банк идей по типам задач',
  ideaHeaders: ['Задача', 'Субъект', 'Настроение', 'Композиция', 'Модель'],
  ideaRows: [
    ['Аватар', 'Основатель, маскот, персона автора', 'Киношно, тепло, узнаваемо', 'Центрированный портрет или полный рост', 'GPT Image 2 или Nano Banana'],
    ['Продуктовый визуал', 'Бутылка, экран, упаковка, инструмент', 'Премиально, чисто, тактильно', 'Студийный hero кадр', 'GPT Image 2'],
    ['Сцена истории', 'Мир, эпизод, короткий сюжет', 'Любопытно, драматично, мечтательно', 'Storyboard panel или широкий кадр', 'GPT Image 2'],
    ['Поиск стиля', 'Мода, постер, абстракция', 'Смело, сюрреалистично, editorial', 'Art-direction board', 'Midjourney'],
    ['Соцпост', 'Запуск, цитата, функция', 'Энергично, просто, цепко', 'Вертикальный poster с safe area', 'Nano Banana или GPT Image 2'],
  ],
  storyboardHeading: 'Шаблон 1: storyboard ideas',
  storyboardBody:
    'Storyboard полезен, когда одной картинки мало. Попросите несколько панелей, одного стабильного персонажа и ясную визуальную последовательность.',
  characterHeading: 'Шаблон 2: персонажи и аватары',
  characterBody:
    'Для персонажа сначала важны силуэт, поза, одежда, визуальная эпоха и выражение. Стиль добавляется после формы.',
  styleHeading: 'Шаблон 3: идеи с reference style',
  styleBody:
    'Style-reference помогает, когда субъект известен, а арт-дирекшн еще открыт. Укажите, что именно контролирует reference.',
  modelHeading: 'Какую модель Vogue AI выбрать?',
  modelHeaders: ['Цель', 'GPT Image 2 если...', 'Nano Banana если...', 'Midjourney если...'],
  modelRows: [
    ['Контроль', 'В brief много ограничений.', 'Нужны быстрые вариации.', 'Настроение важнее структуры.'],
    ['Reference image', 'Идентичность или layout должны быть близки.', 'Нужны быстрые image-to-image пробы.', 'Нужно направление стиля.'],
    ['Коммерческий результат', 'Продукт, UI, poster или ad должны читаться.', 'Соцконцепту нужна скорость.', 'Сначала важна эстетика.'],
  ],
  cardHeading: 'Соберите reusable idea card',
  cardList: [
    'Subject: кто или что в кадре.',
    'Setting: где происходит сцена и какие объекты важны.',
    'Mood: эмоция изображения.',
    'Composition: crop, дистанция, фокус и safe area.',
    'Style: эпоха, medium, цвета, текстура и свет.',
    'Output: ratio, канал, no-text rule и критерий проверки.',
  ],
  revisionHeading: 'Что менять после первого результата',
  revisionList: [
    'Слишком generic: добавьте задачу, аудиторию и канал.',
    'Неверный subject: добавьте reference и что должно быть фиксировано.',
    'Грязный layout: меняйте crop, distance и negative space.',
    'Красиво, но бесполезно: добавьте poster, avatar, thumbnail или product hero.',
    'Style drift: сохраните рабочую карточку и меняйте одну переменную.',
  ],
  mistakeHeading: 'Ошибки и исправления',
  mistakeHeaders: ['Ошибка', 'Сначала исправить', 'Сначала не делать'],
  mistakeRows: [
    ['Идея слишком размыта', 'Выбрать реальную задачу.', 'Добавлять прилагательные.'],
    ['Субъект игнорируется', 'Добавить reference или constraints.', 'Сразу менять модель.'],
    ['Стиль сильный, но не нужен', 'Добавить канал, ratio, safe area.', 'Оставлять только mood.'],
    ['Результат повторяется', 'Менять subject, setting или composition.', 'Менять только цвет.'],
    ['Prompt слишком длинный', 'Разделить idea, style и output rules.', 'Вставлять все заметки.'],
  ],
  handoffHeading: 'Чеклист Vogue AI',
  handoffList: [
    'Сначала найдите ближайший пример в prompt library.',
    'Выберите модель до генерации: контроль, скорость или стиль.',
    'Держите prompt blocks на английском.',
    'Сохраните версию, которая исправила первую ошибку.',
    'Используйте карточку снова для следующей идеи.',
  ],
  imageText: {
    storyboardAlt: 'Пример storyboard-идеи для AI-изображения из библиотеки промптов Vogue AI',
    storyboardCaption:
      'Хорошая идея для AI-изображения уже похожа на небольшой продакшн-бриф: субъект, последовательность, композиция, стиль и правило вывода.',
    characterAlt: 'Пример идеи персонажной иллюстрации из библиотеки промптов',
    characterCaption:
      'В идее персонажа сначала важны силуэт, поза, визуальная эпоха и выражение, а уже потом стилевые прилагательные.',
    styleAlt: 'Пример идеи с референсом стиля из библиотеки промптов',
    styleCaption:
      'Идеи с референсом стиля работают лучше, когда промпт уточняет, что контролирует референс: палитру, фактуру, свет или композицию.',
  },
  faq: [
    ['Что такое хорошая AI picture idea?', 'Это идея с субъектом, средой, настроением, композицией, стилем и форматом вывода.'],
    ['Как превратить идею в prompt?', 'Сначала пишите задачу, затем subject, setting, mood, camera, style и output rule.'],
    ['С какой модели начать?', 'GPT Image 2 для контроля, Nano Banana для вариаций, Midjourney для стиля.'],
    ['Оставлять prompts на английском?', 'Да, для публичных копируемых блоков. Объяснения можно локализовать.'],
    ['Что делать с плохим первым результатом?', 'Исправьте одну проблему: subject, layout, style, reference handoff или output rule.'],
    ['Можно ли использовать references?', 'Да, если важны identity, layout, форма продукта, лицо или палитра.'],
  ],
};

const ptCopy: LocalizedCopy = {
  intro:
    'Ideias de imagens com IA só ajudam quando viram prompts. Cada ideia precisa de sujeito, cenário, humor, composição, estilo, formato de saída e regra de revisão.',
  tldrHeading: 'Resumo',
  tldr: [
    'Comece pelo trabalho: avatar, product shot, story frame, poster, wallpaper, UI hero ou social image.',
    'Transforme a ideia em um prompt card com subject, setting, mood, composition, style, model fit e output rule.',
    'Use GPT Image 2 para controle, Nano Banana para variações rápidas e Midjourney para estilo.',
    'Mantenha prompt blocks públicos em inglês para copiar no Vogue AI.',
    'Depois do primeiro resultado, revise pelo tipo de falha.',
  ],
  formulaIntro:
    'Esta matriz funciona como banco de ideias prático. Cada linha completa os elementos que faltam para virar prompt.',
  ideaHeading: 'Banco de ideias por tarefa de produção',
  ideaHeaders: ['Uso', 'Sujeito', 'Humor', 'Composição', 'Modelo'],
  ideaRows: [
    ['Avatar', 'Founder, mascote, creator persona', 'Cinemático, quente, icônico', 'Retrato central ou corpo inteiro', 'GPT Image 2 ou Nano Banana'],
    ['Visual de produto', 'Garrafa, tela de app, embalagem, ferramenta', 'Premium, limpo, tátil', 'Studio hero frame', 'GPT Image 2'],
    ['Cena narrativa', 'Cena, mundo, pequena história', 'Curioso, dramático, onírico', 'Storyboard panel ou plano amplo', 'GPT Image 2'],
    ['Exploração de estilo', 'Moda, poster, arte abstrata', 'Ousado, surreal, editorial', 'Art-direction board', 'Midjourney'],
    ['Post social', 'Lançamento, frase, feature', 'Energético, simples, chamativo', 'Poster vertical com área de texto', 'Nano Banana ou GPT Image 2'],
  ],
  storyboardHeading: 'Modelo 1: ideias de storyboard',
  storyboardBody:
    'Storyboard funciona quando uma imagem não basta. Peça vários painéis, personagem consistente e sequência visual clara.',
  characterHeading: 'Modelo 2: personagens e avatares',
  characterBody:
    'Ideias de personagem precisam de forma antes de decoração: silhueta, pose, roupa, era visual e expressão.',
  styleHeading: 'Modelo 3: ideias com referência de estilo',
  styleBody:
    'Style reference ajuda quando o sujeito está claro, mas a direção visual ainda não. Diga o que a referência controla.',
  modelHeading: 'Qual modelo Vogue AI usar?',
  modelHeaders: ['Objetivo', 'GPT Image 2 quando...', 'Nano Banana quando...', 'Midjourney quando...'],
  modelRows: [
    ['Controle', 'O brief tem muitas restrições.', 'Você precisa de variações rápidas.', 'O mood importa mais que a estrutura.'],
    ['Imagem de referência', 'Identidade ou layout precisam ficar próximos.', 'Você explora image-to-image rápido.', 'Quer direção de estilo.'],
    ['Saída comercial', 'Produto, UI, poster ou ad precisam ser legíveis.', 'Conceitos sociais precisam de velocidade.', 'A estética vem primeiro.'],
  ],
  cardHeading: 'Monte um idea card reutilizável',
  cardList: [
    'Subject: quem ou o que aparece.',
    'Setting: onde acontece e quais objetos importam.',
    'Mood: emoção que a imagem deve criar.',
    'Composition: crop, distância, foco e safe area.',
    'Style: era, mídia, cores, textura e luz.',
    'Output: ratio, canal, no-text rule e critério de revisão.',
  ],
  revisionHeading: 'O que mudar depois do primeiro resultado',
  revisionList: [
    'Resultado genérico: adicione tarefa, público e canal.',
    'Sujeito errado: adicione referência e o que deve ficar fixo.',
    'Layout confuso: mude crop, distância e negative space.',
    'Bonito mas inútil: adicione poster, avatar, thumbnail ou product hero.',
    'Style drift: salve o card que funcionou e mude uma variável.',
  ],
  mistakeHeading: 'Tabela de erros e correções',
  mistakeHeaders: ['Falha', 'Corrigir primeiro', 'Evitar primeiro'],
  mistakeRows: [
    ['Ideia vaga', 'Escolher tarefa real de produção.', 'Adicionar adjetivos.'],
    ['Sujeito ignorado', 'Adicionar referência ou constraints.', 'Trocar de modelo.'],
    ['Estilo forte mas inútil', 'Adicionar canal, ratio e safe area.', 'Manter só mood words.'],
    ['Resultado repetido', 'Mudar subject, setting ou composition.', 'Mudar apenas cor.'],
    ['Prompt longo demais', 'Separar idea, style e output rules.', 'Colar todas as notas.'],
  ],
  handoffHeading: 'Checklist Vogue AI',
  handoffList: [
    'Escolha o exemplo mais próximo na biblioteca antes de começar do zero.',
    'Escolha modelo por controle, velocidade ou estilo.',
    'Mantenha prompt blocks em inglês e copiáveis.',
    'Salve a versão que corrigiu a primeira falha.',
    'Reutilize o card para a próxima ideia.',
  ],
  imageText: {
    storyboardAlt: 'Exemplo de ideia de imagem IA em estilo storyboard da biblioteca de prompts Vogue AI',
    storyboardCaption:
      'Uma boa ideia de imagem IA já funciona como um pequeno brief: sujeito, sequência, composição, estilo e regra de saída.',
    characterAlt: 'Exemplo de ilustração de personagem para ideias de imagens IA',
    characterCaption:
      'Ideias de personagem precisam de silhueta, pose, era visual e expressão antes dos adjetivos de estilo.',
    styleAlt: 'Exemplo de ideia com referência de estilo da biblioteca de prompts',
    styleCaption:
      'Ideias com referência de estilo funcionam melhor quando o prompt diz o que a referência controla: paleta, textura, luz ou composição.',
  },
  faq: [
    ['O que são boas AI picture ideas?', 'São ideias com subject, setting, mood, composition, style e output format.'],
    ['Como transformar ideia em prompt?', 'Escreva a tarefa, depois subject, setting, mood, camera, style e output rule.'],
    ['Qual modelo usar primeiro?', 'GPT Image 2 para controle, Nano Banana para variações, Midjourney para estilo.'],
    ['Prompts devem ficar em inglês?', 'Sim para blocos copiáveis públicos; o texto explicativo pode ser localizado.'],
    ['E se a primeira imagem for ruim?', 'Corrija um modo de falha: subject, layout, style, reference ou output rule.'],
    ['Posso usar imagens de referência?', 'Sim quando identity, layout, forma do produto, rosto ou paleta importam.'],
  ],
};

const jaCopy: LocalizedCopy = {
  intro:
    'AI picture ideas は prompt に変換できて初めて役に立ちます。各 idea には subject、setting、mood、composition、style、output format、最初の確認ルールを入れます。',
  tldrHeading: '要点',
  tldr: [
    'まず制作目的を決めます: avatar、product shot、story frame、poster、wallpaper、UI hero、social image。',
    'Idea を prompt card に変えます: subject、setting、mood、composition、style、model fit、output rule。',
    '制御重視は GPT Image 2、素早い variation は Nano Banana、style 探索は Midjourney。',
    '公開 prompt blocks は Vogue AI でコピーしやすいよう英語のままにします。',
    '最初の結果後は、全体を書き直さず failure mode ごとに直します。',
  ],
  formulaIntro:
    'このマトリクスは実用的な idea bank です。各行が、ひらめきを prompt-ready な概念に変えます。',
  ideaHeading: '制作目的別 AI 画像アイデアバンク',
  ideaHeaders: ['用途', '主体', 'ムード', '構図', '推奨モデル'],
  ideaRows: [
    ['キャラクターアバター', '創業者、マスコット、クリエイター人格', '映画的、温かい、象徴的', '中央寄せのポートレートまたは全身ポーズ', 'GPT Image 2 または Nano Banana'],
    ['商品ビジュアル', 'ボトル、アプリ画面、パッケージ、ツール', '上質、クリーン、質感重視', 'スタジオのヒーローカット', 'GPT Image 2'],
    ['ストーリーフレーム', 'シーン、世界観、短い物語', '好奇心、ドラマ性、夢のような雰囲気', 'ストーリーボードのコマまたは広いシネマショット', 'GPT Image 2'],
    ['スタイル探索', 'ファッション、ポスター、抽象アート', '大胆、シュール、エディトリアル', 'アートディレクションボード', 'Midjourney'],
    ['SNS 投稿', 'ローンチ案、引用、機能紹介', 'エネルギッシュ、簡潔、スクロールを止める', '文字用の安全余白を持つ縦型ポスター', 'Nano Banana または GPT Image 2'],
  ],
  storyboardHeading: 'テンプレート 1：ストーリーボード型の画像アイデア',
  storyboardBody:
    '1 枚では足りないときはストーリーボードにします。複数のコマ、一貫したキャラクター、読みやすい視覚順序を指定します。',
  characterHeading: 'テンプレート 2：キャラクターとアバターのアイデア',
  characterBody:
    'キャラクター案は装飾より先に形です。シルエット、ポーズ、衣装、視覚年代、表情を先に決めます。',
  styleHeading: 'テンプレート 3：スタイル参照のアイデア',
  styleBody:
    '主体は決まっているがアートディレクションが未定のときにスタイル参照を使います。参照が何を制御するかを書きます。',
  modelHeading: 'Vogue AI ではどのモデルを使う？',
  modelHeaders: ['目的', 'GPT Image 2 が向く場合', 'Nano Banana が向く場合', 'Midjourney が向く場合'],
  modelRows: [
    ['制御', '制約が多い brief。', '素早いバリエーションが必要。', '構造よりムードが重要。'],
    ['参考画像', '同一性やレイアウトを近く保つ。', '高速な image-to-image 探索。', 'スタイル転写の方向を探る。'],
    ['商用アウトプット', '商品、UI、ポスター、広告を読める形にする。', 'SNS コンセプトを速く作る。', '審美的な探索が先。'],
  ],
  cardHeading: '再利用できるアイデアカードを作る',
  cardList: [
    '主体：画像に出る人や物。',
    '設定：場所と重要なオブジェクト。',
    'ムード：作りたい感情。',
    '構図：切り抜き、カメラ距離、焦点、セーフエリア。',
    'スタイル：時代感、媒体、色設計、質感、照明。',
    '出力：アスペクト比、掲載先、文字なしルール、確認基準。',
  ],
  revisionHeading: '最初の結果後に変えること',
  revisionList: [
    '汎用的な結果：制作目的、対象読者、掲載先を足す。',
    '主体が違う：参考画像と固定すべき要素を足す。',
    'レイアウトが乱れる：切り抜き、カメラ距離、余白を先に直す。',
    '美しいが使えない：ポスター、アバター、サムネイル、商品ヒーローなどの出力ルールを足す。',
    'スタイルが流れる：動いたカードを保存し、一度に一つだけ変える。',
  ],
  mistakeHeading: '失敗と修正テーブル',
  mistakeHeaders: ['失敗', '先に直すこと', '先に避けること'],
  mistakeRows: [
    ['アイデアが曖昧', '実際の制作目的を選ぶ。', '形容詞を増やす。'],
    ['主体が無視される', '参考画像または主体の制約を足す。', 'すぐモデルを変える。'],
    ['スタイルは強いが使えない', '掲載先、比率、セーフエリアを足す。', 'ムード語だけ残す。'],
    ['結果が似すぎる', '主体、設定、構図を変える。', '色だけ変える。'],
    ['プロンプトが長すぎる', 'アイデア、スタイル、出力ルールを分ける。', '全メモを貼る。'],
  ],
  handoffHeading: 'Vogue AI 実行チェックリスト',
  handoffList: [
    '白紙から始める前に、最も近いプロンプトライブラリ例を選ぶ。',
    '生成前にモデル適性を決める：制御、速度、スタイル探索。',
    'Prompt blocks は英語でコピー可能に保つ。',
    '最初の失敗を直したプロンプト版を保存する。',
    '次の画像アイデアはそのカードから始める。',
  ],
  imageText: {
    storyboardAlt: 'Vogue AI プロンプトライブラリのストーリーボード型 AI 画像アイデア例',
    storyboardCaption:
      '良い AI 画像アイデアは、小さな制作ブリーフです。主体、順序、構図、スタイル、出力ルールまで明確にします。',
    characterAlt: 'AI 画像アイデア向けのキャラクターイラスト例',
    characterCaption:
      'キャラクター案は、スタイル形容詞より先にシルエット、ポーズ、視覚年代、表情を決める必要があります。',
    styleAlt: 'Vogue AI プロンプトライブラリのスタイル参照アイデア例',
    styleCaption:
      'スタイル参照のアイデアは、参照が色、質感、光、構図のどれを制御するかを書くと安定します。',
  },
  faq: [
    ['良い AI picture idea とは？', 'Subject、setting、mood、composition、style、output format が入っていて、少し直せば生成に使える idea です。'],
    ['Idea を prompt にするには？', 'Production job を先に書き、subject、setting、mood、camera、style、output rule を足します。'],
    ['どの model から始める？', '制御は GPT Image 2、variation は Nano Banana、style 探索は Midjourney です。'],
    ['Prompt は英語のまま？', '公開の copyable block は英語が便利です。説明部分はローカライズできます。'],
    ['最初の画像が悪いときは？', 'Subject、layout、style、reference handoff、output rule のどれか一つを先に直します。'],
    ['Reference image は使える？', 'Identity、layout、product shape、face、palette が重要なときに使います。'],
  ],
};

const koCopy: LocalizedCopy = {
  intro:
    'AI picture ideas는 prompt로 바꿀 수 있을 때 가치가 있습니다. 각 idea에는 subject, setting, mood, composition, style modifier, output format, first-result review rule이 있어야 합니다.',
  tldrHeading: '요약',
  tldr: [
    '먼저 제작 작업을 정합니다: avatar, product shot, story frame, poster, wallpaper, UI hero, social image.',
    'Idea를 prompt card로 바꿉니다: subject, setting, mood, composition, style, model fit, output rule.',
    '제어는 GPT Image 2, 빠른 variation은 Nano Banana, style exploration은 Midjourney.',
    '공개 prompt blocks는 Vogue AI에서 복사하기 쉽도록 영어로 둡니다.',
    '첫 결과 후에는 전체를 다시 쓰지 말고 failure mode별로 수정합니다.',
  ],
  formulaIntro:
    '이 matrix는 실전 idea bank입니다. 각 줄은 영감을 prompt-ready concept으로 바꾸는 누락 요소를 채웁니다.',
  ideaHeading: '제작 작업별 AI 이미지 아이디어 뱅크',
  ideaHeaders: ['용도', '주제', '분위기', '구도', '추천 모델'],
  ideaRows: [
    ['캐릭터 아바타', '창업자, 마스코트, 크리에이터 페르소나', '영화적, 따뜻함, 상징적', '중앙 인물 사진 또는 전신 포즈', 'GPT Image 2 또는 Nano Banana'],
    ['제품 비주얼', '병, 앱 화면, 패키지, 도구', '프리미엄, 깔끔함, 촉감 중심', '스튜디오 히어로 컷', 'GPT Image 2'],
    ['스토리 프레임', '장면, 세계관, 짧은 내러티브', '호기심, 드라마틱, 몽환적', '스토리보드 패널 또는 넓은 시네마틱 샷', 'GPT Image 2'],
    ['스타일 탐색', '패션, 포스터, 추상 아트', '대담함, 초현실, 에디토리얼', '아트 디렉션 보드', 'Midjourney'],
    ['소셜 포스트', '출시 아이디어, 인용구, 기능 소개', '에너지, 단순함, 스크롤을 멈추는 느낌', '텍스트 안전 영역이 있는 세로 포스터', 'Nano Banana 또는 GPT Image 2'],
  ],
  storyboardHeading: '템플릿 1: 스토리보드형 이미지 아이디어',
  storyboardBody:
    '한 장으로 충분하지 않을 때는 스토리보드를 씁니다. 여러 패널, 일관된 캐릭터, 읽히는 시각적 순서를 요청하세요.',
  characterHeading: '템플릿 2: 캐릭터와 아바타 아이디어',
  characterBody:
    '캐릭터 아이디어는 장식보다 형태가 먼저입니다. 실루엣, 포즈, 의상, 시각적 시대감, 표정을 먼저 정하세요.',
  styleHeading: '템플릿 3: 스타일 참조 아이디어',
  styleBody:
    '주제는 정해졌지만 아트 디렉션이 열려 있을 때 스타일 참조가 좋습니다. 참조가 무엇을 제어하는지 적으세요.',
  modelHeading: 'Vogue AI에서 어떤 모델을 쓸까?',
  modelHeaders: ['목적', 'GPT Image 2가 맞는 경우', 'Nano Banana가 맞는 경우', 'Midjourney가 맞는 경우'],
  modelRows: [
    ['제어', '브리프에 제약이 많을 때.', '빠른 변형이 필요할 때.', '구조보다 분위기가 중요할 때.'],
    ['참고 이미지', '동일성이나 레이아웃을 가깝게 유지해야 할 때.', '빠른 image-to-image 탐색.', '스타일 전환 방향을 찾을 때.'],
    ['상업용 결과물', '제품, UI, 포스터, 광고가 읽혀야 할 때.', '소셜 콘셉트를 빠르게 만들 때.', '미감 탐색이 우선일 때.'],
  ],
  cardHeading: '재사용 가능한 아이디어 카드 만들기',
  cardList: [
    '주제: 이미지에 나오는 사람이나 사물.',
    '설정: 장면이 일어나는 곳과 중요한 오브젝트.',
    '분위기: 이미지가 만들어야 할 감정.',
    '구도: 크롭, 카메라 거리, 초점, 안전 영역.',
    '스타일: 시대감, 매체, 색상 체계, 질감, 조명.',
    '출력: 화면비, 채널, 텍스트 없음 규칙, 검토 기준.',
  ],
  revisionHeading: '첫 결과 후 무엇을 바꿀까',
  revisionList: [
    '평범한 결과: 제작 목적, 대상 독자, 채널을 추가.',
    '주제가 틀림: 참고 이미지와 고정 대상을 추가.',
    '레이아웃이 지저분함: 크롭, 카메라 거리, 여백을 먼저 수정.',
    '아름답지만 쓸 수 없음: 포스터, 아바타, 썸네일, 제품 히어로 같은 출력 규칙 추가.',
    '스타일이 흔들림: 작동한 카드를 저장하고 한 번에 하나만 변경.',
  ],
  mistakeHeading: '실패와 수정 테이블',
  mistakeHeaders: ['실패', '먼저 고칠 것', '먼저 피할 것'],
  mistakeRows: [
    ['아이디어가 모호함', '실제 제작 목적 선택.', '형용사 추가.'],
    ['주제가 무시됨', '참고 이미지 또는 주제 제약 추가.', '바로 모델 변경.'],
    ['스타일은 강하지만 쓸 수 없음', '채널, 비율, 안전 영역 추가.', '분위기 단어만 유지.'],
    ['결과가 반복됨', '주제, 설정, 구도 변경.', '색상만 변경.'],
    ['프롬프트가 너무 김', '아이디어, 스타일, 출력 규칙 분리.', '모든 영감 메모 붙여넣기.'],
  ],
  handoffHeading: 'Vogue AI 실행 체크리스트',
  handoffList: [
    '빈 페이지에서 시작하기 전에 가장 가까운 프롬프트 라이브러리 예시를 고릅니다.',
    '생성 전 모델 선택: 제어, 속도, 스타일 탐색.',
    'Prompt blocks는 영어로 복사 가능하게 유지.',
    '첫 실패를 해결한 프롬프트 버전 저장.',
    '다음 이미지 아이디어는 저장한 카드에서 시작.',
  ],
  imageText: {
    storyboardAlt: 'Vogue AI 프롬프트 라이브러리의 스토리보드형 AI 이미지 아이디어 예시',
    storyboardCaption:
      '좋은 AI 이미지 아이디어는 작은 제작 브리프입니다. 주제, 순서, 구도, 스타일, 출력 규칙이 이미 정리되어 있어야 합니다.',
    characterAlt: 'AI 이미지 아이디어용 캐릭터 일러스트 예시',
    characterCaption:
      '캐릭터 아이디어는 스타일 형용사보다 먼저 실루엣, 포즈, 시각적 시대감, 표정을 정해야 합니다.',
    styleAlt: 'Vogue AI 프롬프트 라이브러리의 스타일 참조 아이디어 예시',
    styleCaption:
      '스타일 참조 아이디어는 참조가 색상, 질감, 빛, 구도 중 무엇을 제어하는지 쓸 때 가장 안정적입니다.',
  },
  faq: [
    ['좋은 AI picture idea란?', 'Subject, setting, mood, composition, style, output format이 포함되어 바로 생성기로 옮길 수 있는 idea입니다.'],
    ['Idea를 prompt로 바꾸려면?', 'Production job을 먼저 쓰고 subject, setting, mood, camera, style, output rule을 추가합니다.'],
    ['어떤 모델부터 쓰나요?', '제어는 GPT Image 2, 빠른 variations는 Nano Banana, style exploration은 Midjourney입니다.'],
    ['Prompt는 영어여야 하나요?', '공개 copyable block은 영어가 편합니다. 설명은 현지화해도 됩니다.'],
    ['첫 이미지가 나쁘면?', 'Subject, layout, style, reference handoff, output rule 중 하나만 먼저 수정하세요.'],
    ['Reference image를 써도 되나요?', 'Identity, layout, product shape, face, palette가 중요할 때 사용하세요.'],
  ],
};

export const aiPictureIdeasAutoBlogPost: BlogPostSource = {
  slug: 'ai-picture-ideas',
  date: '2026-06-01',
  updatedAt: '2026-06-01',
  author: 'Vogue AI Team',
  image: aiPictureIdeaImages.storyboard,
  imageAlt: 'Storyboard-style AI picture idea from the Vogue AI prompt library',
  articleType: 'tutorial',
  modelTags: ['vogue-ai', 'gpt-image-2', 'nano-banana', 'midjourney'],
  readingMinutes: 11,
  localizations: {
    en: {
      title: 'AI picture ideas you can turn into prompts',
      summary:
        'A practical idea bank for turning vague AI picture ideas into prompt-ready concepts by subject, style, use case, and model fit inside Vogue AI.',
      seoTitle: 'AI Picture Ideas for Prompt-Ready Images',
      seoDescription:
        'Use this AI picture idea bank to build prompt-ready avatars, product visuals, story frames, posters, and social images with Vogue AI.',
      content: createContent(enCopy),
    },
    zh: {
      title: '可以直接变成提示词的 AI 图片创意',
      summary:
        '一套实用 AI picture idea bank，按主体、风格、用途和模型选择，把模糊灵感变成 Vogue AI 可执行提示词。',
      seoTitle: 'AI 图片创意与提示词实战指南',
      seoDescription:
        '用这套 AI 图片创意表，把头像、产品图、故事画面、海报和社媒图整理成可直接复制的 Vogue AI 提示词。',
      content: createContent(zhCopy),
    },
    fr: {
      title: "Idées d'images IA prêtes à devenir des prompts",
      summary:
        "Une banque d'idées pratique pour transformer des inspirations vagues en concepts prêts à générer dans Vogue AI.",
      seoTitle: "Idées d'images IA prêtes pour la génération",
      seoDescription:
        "Transformez des idées d'images IA en prompts pour avatars, produits, storyboards, posters et posts sociaux avec Vogue AI.",
      content: createContent(frCopy),
    },
    ru: {
      title: 'AI-идеи для изображений, готовые к промптам',
      summary:
        'Практический банк идей для превращения размытых AI picture ideas в готовые концепты для Vogue AI.',
      seoTitle: 'AI-идеи для изображений и промптов',
      seoDescription:
        'Собирайте идеи для аватаров, продуктов, сторибордов, постеров и соцсетей в готовые промпты для Vogue AI.',
      content: createContent(ruCopy),
    },
    pt: {
      title: 'Ideias de imagens com IA prontas para virar prompts',
      summary:
        'Um banco prático para transformar ideias vagas em conceitos prontos para gerar no Vogue AI.',
      seoTitle: 'Ideias de Imagens IA para Prompts Prontos',
      seoDescription:
        'Crie prompts para avatares, produtos, storyboards, pôsteres e posts sociais a partir de ideias de imagens com IA.',
      content: createContent(ptCopy),
    },
    ja: {
      title: 'プロンプトに変えられる AI 画像アイデア',
      summary:
        'Vogue AI で使えるように、曖昧な AI picture ideas を subject、style、用途、model fit で整理する実践ガイドです。',
      seoTitle: 'AI 画像アイデアを生成向けプロンプトへ',
      seoDescription:
        'アバター、商品画像、storyboard、poster、SNS 画像の AI アイデアを Vogue AI 用のプロンプトに変えます。',
      content: createContent(jaCopy),
    },
    ko: {
      title: '프롬프트로 바꿀 수 있는 AI 이미지 아이디어',
      summary:
        'Vogue AI에서 실행할 수 있도록 모호한 AI picture ideas를 subject, style, use case, model fit으로 정리하는 실전 가이드입니다.',
      seoTitle: 'AI 이미지 아이디어를 생성용 프롬프트로',
      seoDescription:
        'Avatar, product visual, storyboard, poster, social image 아이디어를 Vogue AI에서 쓸 prompt로 바꾸는 방법입니다.',
      content: createContent(koCopy),
    },
  },
};
