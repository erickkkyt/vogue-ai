import type { BlogContentBlock, BlogPostSource } from '@/lib/blog-data';

const images = {
  hero:
    'https://media.vogueai.net/blog/auto/how-to-create-images-with-chat-gpt/27acc1cc5187-chatgpt-prompt-create-premium-high-fashion-editorial-1.jpg',
  product:
    'https://media.vogueai.net/blog/auto/how-to-create-images-with-chat-gpt/c283f6efcc2d-chatgpt-prompt-create-premium-square-reference-style-1.jpg',
  zodiac:
    'https://media.vogueai.net/blog/auto/how-to-create-images-with-chat-gpt/c2b2610a3235-chatgpt-prompt-create-highly-detailed-cancer-zodiac-1.jpg',
} as const;

const promptBlocks = [
  'ChatGPT image prompt: Create a premium editorial image of [subject], clear main focal point, controlled background, realistic lighting, detailed materials, 4:5 aspect ratio, no text, no watermark.',
  'ChatGPT product prompt: Create a clean studio product image of [product], centered composition, accurate shape, soft shadow, neutral background, ecommerce-ready realism, 1:1 aspect ratio, no text.',
  'ChatGPT reference prompt: Use the uploaded image as reference for [identity or product shape]. Keep [must-stay-fixed details] the same, change only [style, background, lighting], no extra text.',
  'Vogue AI follow-up prompt: Recreate this ChatGPT image direction as a Vogue AI GPT Image 2 variation, preserving subject, crop, palette, and reference-image constraints while improving lighting and composition.',
] as const;

function makeContent(locale: string): BlogContentBlock[] {
  const isEn = locale === 'en';
  const title = (en: string, localized: string) => (isEn ? en : localized);

  return [
    {
      type: 'paragraph',
      text: title(
        'Yes, ChatGPT can create images when image generation is available in your ChatGPT account or plan. The reliable workflow is simple: describe the subject, choose the format, add style and constraints, generate one draft, then revise the largest failure instead of rewriting everything.',
        `${locale}: ChatGPT can create images when image generation is available. Use a clear subject, format, style, constraints, one draft, and one focused revision.`
      ),
    },
    { type: 'heading', level: 2, text: title('Quick answer', `${locale}: Quick answer`) },
    {
      type: 'list',
      items: title(
        'Open ChatGPT, choose an image-capable model, write a concrete prompt, attach a reference image when identity matters, then ask for one revision at a time.|If image creation is not available, use the same prompt in Vogue AI with GPT Image 2, then continue refining from the visual result.|Do not start with vague requests like "make a cool image"; start with subject, scene, crop, lighting, style, and output rules.',
        `${locale}: Open ChatGPT with image generation enabled.|${locale}: If image creation is unavailable, reuse the prompt in Vogue AI with GPT Image 2.|${locale}: Avoid vague requests; specify subject, scene, crop, lighting, style, and output rules.`
      ).split('|'),
    },
    { type: 'image', src: images.hero, alt: title('GPT Image 2 fashion editorial example', `${locale} GPT Image 2 fashion editorial example`), caption: title('This hero matches the ChatGPT image workflow because it shows a prompt-led GPT Image 2 editorial result with clear subject, styling, and composition controls.', `${locale}: This GPT Image 2 example shows prompt-led subject, styling, and composition control.`) },
    { type: 'heading', level: 2, text: title('Step-by-step workflow', `${locale}: Step-by-step workflow`) },
    {
      type: 'table',
      headers: title('Step|What to do|Why it matters', `${locale} step|${locale} action|${locale} reason`).split('|'),
      rows: [
        title('1|Confirm image generation is available in your ChatGPT interface.|Availability depends on the model and account, so start by checking the composer tools.', `${locale} 1|${locale}: Confirm image generation is available.|${locale}: The interface determines whether ChatGPT can create images now.`).split('|'),
        title('2|Write the first prompt as a production brief.|The model needs concrete visual controls more than decorative wording.', `${locale} 2|${locale}: Write a production-style prompt.|${locale}: Concrete controls beat decorative wording.`).split('|'),
        title('3|Add a reference image only when identity must stay fixed.|Reference images protect face, product shape, packaging, UI, or palette.', `${locale} 3|${locale}: Add reference only for identity.|${locale}: It protects face, product shape, packaging, UI, or palette.`).split('|'),
        title('4|Revise one failure at a time.|Single revisions reveal what instruction improved the image.', `${locale} 4|${locale}: Revise one failure at a time.|${locale}: You can see what fixed the result.`).split('|'),
      ],
    },
    { type: 'heading', level: 2, text: title('Prompt formula', `${locale}: Prompt formula`) },
    {
      type: 'list',
      items: title(
        'Subject: the person, product, object, room, interface, or scene.|Scene: background, setting, camera distance, and point of view.|Style: realism, editorial mood, material detail, color palette, and lighting.|Format: aspect ratio, crop, transparent background, no text, or safe area.|Review rule: the first thing you will inspect after generation.',
        `${locale}: Subject: person, product, object, room, interface, or scene.|${locale}: Scene: background, setting, camera distance, and view.|${locale}: Style: realism, mood, material, color, and lighting.|${locale}: Format: ratio, crop, transparency, text rule, or safe area.|${locale}: Review rule: first thing to inspect.`
      ).split('|'),
    },
    { type: 'heading', level: 2, text: title('Copyable ChatGPT image prompts', `${locale}: Copyable ChatGPT image prompts`) },
    { type: 'paragraph', text: title('Keep these prompt blocks in English so you can paste them directly into ChatGPT or Vogue AI.', `${locale}: The prompt blocks stay in English so they remain paste-ready.`) },
    { type: 'list', items: [...promptBlocks] },
    { type: 'heading', level: 2, text: title('Scenario matrix', `${locale}: Scenario matrix`) },
    {
      type: 'table',
      headers: title('Goal|Use this prompt focus|Check first', `${locale} goal|${locale} focus|${locale} check`).split('|'),
      rows: [
        title('Profile image|Face, wardrobe, background separation, crop, and expression.|Identity, extra hands, skin texture, and eye sharpness.', `${locale}: Profile image|${locale}: Face, wardrobe, crop, expression.|${locale}: Identity, hands, skin, eyes.`).split('|'),
        title('Product image|Product shape, material, lighting, background, and shadow.|Wrong silhouette, distorted label, weak material detail.', `${locale}: Product image|${locale}: Shape, material, lighting, background.|${locale}: Silhouette, label, material.`).split('|'),
        title('Poster concept|Hero subject, negative space, palette, and channel ratio.|No headline space, clutter, fake text, weak focal point.', `${locale}: Poster concept|${locale}: Subject, space, palette, ratio.|${locale}: Space, clutter, fake text.`).split('|'),
        title('Reference edit|What must stay fixed and what may change.|Identity drift, crop drift, unwanted style changes.', `${locale}: Reference edit|${locale}: Fixed details and allowed changes.|${locale}: Identity, crop, style drift.`).split('|'),
      ],
    },
    { type: 'heading', level: 2, text: title('When ChatGPT gives a generic image', `${locale}: When ChatGPT gives a generic image`) },
    {
      type: 'list',
      items: title(
        'Add a real audience, channel, season, material, or brand palette.|Replace broad style words with camera, lighting, crop, and background controls.|Ask for a new variation that keeps the subject and changes only the weak part.|Move the prompt into Vogue AI when you need model choice, prompt-library examples, or repeatable workspace history.',
        `${locale}: Add audience, channel, season, material, or palette.|${locale}: Replace broad style words with camera and lighting controls.|${locale}: Ask for a variation that changes only the weak part.|${locale}: Use Vogue AI for model choice and reusable prompt history.`
      ).split('|'),
    },
    { type: 'heading', level: 2, text: title('Reference-image workflow', `${locale}: Reference-image workflow`) },
    { type: 'image', src: images.product, alt: title('GPT Image 2 reference-style product example', `${locale} GPT Image 2 reference-style product example`), caption: title('Use this product-style example when the image needs stable shape, material, and commercial framing rather than decorative inspiration.', `${locale}: Use this example for stable shape, material, and commercial framing.`) },
    {
      type: 'paragraph',
      text: title(
        'A reference image should have a job. Tell ChatGPT whether it controls identity, shape, palette, room layout, UI hierarchy, or pose. Then say which parts may change, such as lighting, background, wardrobe, camera angle, or mood.',
        `${locale}: A reference image needs a clear job: identity, shape, palette, layout, hierarchy, or pose. Also say what may change.`
      ),
    },
    { type: 'heading', level: 2, text: title('Use Vogue AI after the first ChatGPT draft', `${locale}: Use Vogue AI after the first ChatGPT draft`) },
    {
      type: 'list',
      items: title(
        'Use GPT Image 2 in Vogue AI when you want close instruction following and clean prompt reuse.|Use Nano Banana for fast idea variations once the core brief is clear.|Use Midjourney for mood exploration after you know the subject and composition.|Save the best prompt version before changing model families.',
        `${locale}: Use GPT Image 2 for instruction control.|${locale}: Use Nano Banana for fast variations.|${locale}: Use Midjourney for mood exploration.|${locale}: Save the best prompt before changing model families.`
      ).split('|'),
    },
    { type: 'heading', level: 2, text: title('Mistakes and fixes', `${locale}: Mistakes and fixes`) },
    {
      type: 'table',
      headers: title('Problem|Fix first|Avoid', `${locale} problem|${locale} fix|${locale} avoid`).split('|'),
      rows: [
        title('ChatGPT cannot make an image|Check model/tools availability or move the prompt to Vogue AI.|Assuming every chat has image generation enabled.', `${locale}: Image unavailable|${locale}: Check tools or use Vogue AI.|${locale}: Assuming every chat can generate.`).split('|'),
        title('Image looks generic|Add audience, channel, palette, material, and lighting.|Adding more vague adjectives.', `${locale}: Generic image|${locale}: Add audience, channel, palette, material.|${locale}: More vague adjectives.`).split('|'),
        title('Wrong identity|Attach reference and define what must stay fixed.|Rewriting style while identity remains unclear.', `${locale}: Wrong identity|${locale}: Attach reference and fixed details.|${locale}: Rewriting style first.`).split('|'),
        title('Bad text in image|Ask for no text and add typography later.|Expecting perfect final copy inside the generated image.', `${locale}: Bad text|${locale}: Ask for no text.|${locale}: Expecting perfect generated copy.`).split('|'),
      ],
    },
    { type: 'heading', level: 2, text: 'FAQ' },
    ...[
      ['Can ChatGPT create images?', 'Yes, when image generation is available in your ChatGPT interface and selected model.'],
      ['How do I make ChatGPT generate an image?', 'Ask for a specific image with subject, scene, style, format, and constraints instead of a vague idea.'],
      ['Can I upload a photo and ask for an edit?', 'Use a reference image when the interface supports it, then state what must stay fixed and what may change.'],
      ['Why is my result generic?', 'The prompt probably lacks audience, channel, material, lighting, or composition controls.'],
      ['Should prompts be long?', 'They should be complete, not padded. A short structured brief beats a long vague paragraph.'],
      ['Where does Vogue AI fit?', 'Use Vogue AI when you want GPT Image 2 prompt reuse, model switching, prompt-library examples, and a visual workspace.'],
    ].flatMap(([q, a]) => [
      { type: 'heading' as const, level: 3 as const, text: title(q, `${locale}: ${q}`) },
      { type: 'paragraph' as const, text: title(a, `${locale}: ${a}`) },
    ]),
    { type: 'image', src: images.zodiac, alt: title('GPT Image 2 stylized zodiac example', `${locale} GPT Image 2 stylized zodiac example`), caption: title('This body example fits the style-control section: it shows how a specific subject and visual language can be locked into a repeatable prompt direction.', `${locale}: This example fits style control because it locks subject and visual language.`) },
  ];
}

const localizedPostCopy = {
  zh: {
    intro:
      '可以，只要你的 ChatGPT 账号或当前模型开放了图片生成功能。稳定的流程不是一句“帮我做张图”，而是先写清主体、画幅、风格和限制，生成第一版，再只修最大的问题。',
    quickTitle: '快速答案',
    quickItems: [
      '打开 ChatGPT，选择支持图片生成的模型，写一个具体 prompt；如果身份或产品外形很重要，再上传参考图。',
      '如果当前 ChatGPT 不能生成图片，把同一段 prompt 放进 Vogue AI 的 GPT Image 2 工作区继续生成和迭代。',
      '不要从 “make a cool image” 这种泛泛需求开始。先写主体、场景、构图、光线、风格和输出规则。',
    ],
    heroAlt: 'GPT Image 2 时装大片示例',
    heroCaption:
      '这个示例适合作为主图，因为它体现了 prompt 驱动的 GPT Image 2 结果：主体清楚、造型明确、构图和光线都可控。',
    stepTitle: '一步一步的工作流',
    stepHeaders: ['步骤', '怎么做', '为什么重要'],
    stepRows: [
      ['1', '先确认 ChatGPT 界面里是否有图片生成入口。', '可用性取决于模型和账号，所以要先看 composer 里的工具。'],
      ['2', '把第一条 prompt 写成生产 brief。', '模型更需要具体视觉控制，而不是堆形容词。'],
      ['3', '只有在身份、产品形状或版式必须稳定时才加参考图。', '参考图可以锁住人脸、包装、UI 层级、配色或姿势。'],
      ['4', '每次只修一个失败点。', '单点修正才能看出是哪条指令改善了结果。'],
    ],
    formulaTitle: 'Prompt 公式',
    formulaItems: [
      '主体：人物、产品、物体、房间、界面或场景。',
      '场景：背景、地点、镜头距离和视角。',
      '风格：真实感、编辑感、材质细节、配色和光线。',
      '格式：比例、裁切、透明背景、无文字或安全边距。',
      '检查规则：生成后第一眼要检查的东西。',
    ],
    copyTitle: '可复制的 ChatGPT 图片 prompts',
    copyIntro: '这些 prompt blocks 保持英文，方便直接粘贴到 ChatGPT 或 Vogue AI。',
    scenarioTitle: '场景矩阵',
    scenarioHeaders: ['目标', 'prompt 重点', '先检查'],
    scenarioRows: [
      ['头像图', '人脸、服装、背景分离、裁切和表情。', '身份漂移、多余手指、皮肤质感和眼睛清晰度。'],
      ['商品图', '产品形状、材质、灯光、背景和阴影。', '轮廓错误、标签变形、材质细节不足。'],
      ['海报概念', '主视觉、留白、配色和渠道比例。', '没有标题空间、画面杂乱、假文字、焦点弱。'],
      ['参考图编辑', '哪些必须固定，哪些允许变化。', '身份漂移、裁切漂移和不需要的风格变化。'],
    ],
    genericTitle: '当 ChatGPT 生成的图片太普通时',
    genericItems: [
      '加入真实受众、渠道、季节、材质或品牌配色。',
      '把泛泛的风格词换成镜头、光线、裁切和背景控制。',
      '要求新变体保留主体，只改变最弱的部分。',
      '需要模型选择、prompt library 示例或可复用历史时，把流程移到 Vogue AI。',
    ],
    referenceTitle: '参考图工作流',
    productAlt: 'GPT Image 2 参考图风格商品示例',
    productCaption: '当图片需要稳定形状、材质和商业构图，而不是纯装饰灵感时，可以参考这个商品示例。',
    referenceText:
      '参考图必须有明确任务。告诉 ChatGPT 它要控制身份、外形、配色、房间布局、UI 层级还是姿势，再说明哪些部分可以改变，例如光线、背景、服装、镜头角度或氛围。',
    vogueTitle: '第一版 ChatGPT 草图之后使用 Vogue AI',
    vogueItems: [
      '需要更强指令跟随和干净 prompt 复用时，用 Vogue AI 里的 GPT Image 2。',
      '核心 brief 清楚后，用 Nano Banana 快速探索变体。',
      '主体和构图确定后，用 Midjourney 探索氛围。',
      '切换模型家族前，先保存最好的 prompt 版本。',
    ],
    mistakesTitle: '常见错误和修法',
    mistakeHeaders: ['问题', '先修什么', '避免什么'],
    mistakeRows: [
      ['ChatGPT 不能生成图片', '检查模型和工具是否可用，或把 prompt 移到 Vogue AI。', '假设每个 ChatGPT 会话都能出图。'],
      ['图片太普通', '加入受众、渠道、配色、材质和光线。', '继续堆模糊形容词。'],
      ['身份不对', '上传参考图并写清必须固定的细节。', '在身份还不清楚时先改风格。'],
      ['图片里的文字很差', '要求 no text，后期再加排版。', '期待生成图里直接出现完美文案。'],
    ],
    faq: [
      ['ChatGPT 可以创建图片吗？', '可以，前提是你的 ChatGPT 界面和当前模型开放了图片生成。'],
      ['怎么让 ChatGPT 生成图片？', '不要只写模糊想法，要写主体、场景、风格、格式和约束。'],
      ['可以上传照片再要求编辑吗？', '如果界面支持参考图，就说明哪些必须固定、哪些允许改变。'],
      ['为什么结果很普通？', '通常是 prompt 缺少受众、渠道、材质、光线或构图控制。'],
      ['Prompt 越长越好吗？', '不是。完整但不冗长的结构化 brief 比长篇空话更好。'],
      ['Vogue AI 适合放在哪一步？', '当你需要 GPT Image 2 复用 prompt、切换模型、参考 prompt library 或保存视觉工作区时使用 Vogue AI。'],
    ],
    zodiacAlt: 'GPT Image 2 风格化星座示例',
    zodiacCaption: '这个示例适合说明风格控制：具体主体和视觉语言被锁定成可复用的 prompt 方向。',
  },
  fr: {
    intro:
      "Oui, ChatGPT peut créer des images lorsque la génération d'images est disponible dans votre compte ou votre modèle. Le workflow fiable consiste à décrire le sujet, choisir le format, ajouter style et contraintes, générer un premier brouillon, puis corriger le plus gros défaut au lieu de tout réécrire.",
    quickTitle: 'Réponse rapide',
    quickItems: [
      "Ouvrez ChatGPT, choisissez un modèle compatible image, écrivez un prompt concret, ajoutez une image de référence si l'identité compte, puis demandez une seule révision à la fois.",
      "Si la création d'image n'est pas disponible, utilisez le même prompt dans Vogue AI avec GPT Image 2 et continuez l'itération depuis le résultat visuel.",
      "Ne commencez pas par une demande vague comme \"make a cool image\". Définissez sujet, scène, cadrage, lumière, style et règles de sortie.",
    ],
    heroAlt: 'Exemple éditorial mode GPT Image 2',
    heroCaption:
      "Cet exemple correspond au workflow ChatGPT image : il montre un résultat GPT Image 2 piloté par prompt avec sujet clair, styling et composition maîtrisés.",
    stepTitle: 'Workflow étape par étape',
    stepHeaders: ['Étape', 'Action', 'Pourquoi cela compte'],
    stepRows: [
      ['1', "Vérifiez que la génération d'images est disponible dans l'interface ChatGPT.", "La disponibilité dépend du modèle et du compte ; commencez donc par vérifier les outils du composer."],
      ['2', 'Écrivez le premier prompt comme un brief de production.', 'Le modèle a besoin de contrôles visuels concrets plus que de mots décoratifs.'],
      ['3', "Ajoutez une référence seulement si l'identité doit rester fixe.", "Les références protègent visage, forme produit, packaging, UI ou palette."],
      ['4', 'Corrigez un seul défaut à la fois.', "Les révisions ciblées révèlent quelle instruction améliore l'image."],
    ],
    formulaTitle: 'Formule de prompt',
    formulaItems: [
      'Sujet : personne, produit, objet, pièce, interface ou scène.',
      'Scène : fond, lieu, distance caméra et point de vue.',
      'Style : réalisme, humeur éditoriale, matière, palette et lumière.',
      'Format : ratio, crop, fond transparent, absence de texte ou safe area.',
      'Règle de revue : le premier élément à inspecter après génération.',
    ],
    copyTitle: 'Prompts image ChatGPT prêts à copier',
    copyIntro: 'Ces prompt blocks restent en anglais pour être collés directement dans ChatGPT ou Vogue AI.',
    scenarioTitle: 'Matrice des scénarios',
    scenarioHeaders: ['Objectif', 'Focus du prompt', 'À vérifier d’abord'],
    scenarioRows: [
      ['Image de profil', 'Visage, tenue, séparation du fond, crop et expression.', 'Identité, mains en trop, texture peau et netteté des yeux.'],
      ['Image produit', 'Forme, matière, lumière, fond et ombre.', 'Silhouette fausse, label déformé, matière trop faible.'],
      ['Concept poster', 'Sujet principal, espace négatif, palette et ratio du canal.', 'Pas de place pour le titre, encombrement, faux texte, point focal faible.'],
      ['Édition de référence', 'Ce qui reste fixe et ce qui peut changer.', "Dérive d'identité, dérive du crop, changements de style non voulus."],
    ],
    genericTitle: 'Quand ChatGPT produit une image générique',
    genericItems: [
      'Ajoutez une audience réelle, un canal, une saison, une matière ou une palette de marque.',
      'Remplacez les mots de style vagues par caméra, lumière, crop et fond.',
      'Demandez une variation qui garde le sujet et change seulement la partie faible.',
      "Passez dans Vogue AI si vous voulez choix de modèle, exemples de prompt library ou historique d'espace de travail.",
    ],
    referenceTitle: 'Workflow avec image de référence',
    productAlt: 'Exemple produit GPT Image 2 avec référence',
    productCaption: "Utilisez cet exemple quand l'image doit garder forme, matière et cadrage commercial plutôt qu'une simple inspiration décorative.",
    referenceText:
      "Une image de référence doit avoir un rôle clair. Dites à ChatGPT si elle contrôle l'identité, la forme, la palette, le layout, la hiérarchie UI ou la pose, puis précisez ce qui peut changer : lumière, fond, vêtement, angle caméra ou humeur.",
    vogueTitle: 'Utiliser Vogue AI après le premier brouillon ChatGPT',
    vogueItems: [
      "Utilisez GPT Image 2 dans Vogue AI pour un suivi d'instruction précis et une réutilisation propre des prompts.",
      'Utilisez Nano Banana pour explorer vite des variations après clarification du brief.',
      'Utilisez Midjourney pour explorer une humeur quand sujet et composition sont définis.',
      'Sauvegardez la meilleure version du prompt avant de changer de famille de modèles.',
    ],
    mistakesTitle: 'Erreurs et corrections',
    mistakeHeaders: ['Problème', 'À corriger d’abord', 'À éviter'],
    mistakeRows: [
      ["ChatGPT ne crée pas d'image", 'Vérifiez les outils/modèles ou déplacez le prompt vers Vogue AI.', "Supposer que tous les chats ont l'image activée."],
      ['Image générique', 'Ajoutez audience, canal, palette, matière et lumière.', 'Ajouter encore plus d’adjectifs vagues.'],
      ['Identité fausse', 'Ajoutez une référence et définissez les détails fixes.', "Changer le style avant d'avoir clarifié l'identité."],
      ["Texte mauvais dans l'image", 'Demandez no text et ajoutez la typographie ensuite.', 'Attendre une copy finale parfaite dans l’image générée.'],
    ],
    faq: [
      ['ChatGPT peut-il créer des images ?', "Oui, si la génération d'images est disponible dans votre interface et le modèle choisi."],
      ['Comment faire générer une image à ChatGPT ?', 'Demandez une image précise avec sujet, scène, style, format et contraintes.'],
      ['Puis-je téléverser une photo pour la modifier ?', 'Utilisez une référence si l’interface le permet, puis dites ce qui reste fixe et ce qui change.'],
      ['Pourquoi mon résultat est-il générique ?', 'Le prompt manque souvent d’audience, canal, matière, lumière ou composition.'],
      ['Les prompts doivent-ils être longs ?', 'Ils doivent être complets, pas gonflés. Un brief court et structuré bat un long paragraphe vague.'],
      ['Où placer Vogue AI ?', 'Utilisez Vogue AI pour réutiliser GPT Image 2, changer de modèle, consulter des exemples et garder un workspace visuel.'],
    ],
    zodiacAlt: 'Exemple zodiac stylisé GPT Image 2',
    zodiacCaption: 'Cet exemple illustre le contrôle de style : sujet et langage visuel deviennent une direction de prompt réutilisable.',
  },
  ru: {
    intro:
      'Да, ChatGPT может создавать изображения, если генерация доступна в вашем аккаунте или выбранной модели. Надежный процесс простой: описать объект, выбрать формат, добавить стиль и ограничения, сгенерировать первый вариант, затем исправлять самый крупный недостаток, а не переписывать все заново.',
    quickTitle: 'Короткий ответ',
    quickItems: [
      'Откройте ChatGPT, выберите модель с поддержкой изображений, напишите конкретный prompt, добавьте референс при важной идентичности и просите по одной правке за раз.',
      'Если генерация изображений недоступна, используйте тот же prompt в Vogue AI с GPT Image 2 и продолжайте итерации от визуального результата.',
      'Не начинайте с расплывчатого “make a cool image”. Укажите объект, сцену, кадр, свет, стиль и правила вывода.',
    ],
    heroAlt: 'Пример fashion editorial GPT Image 2',
    heroCaption:
      'Этот hero подходит к workflow ChatGPT image: он показывает результат GPT Image 2, управляемый prompt, с ясным объектом, стилизацией и композицией.',
    stepTitle: 'Пошаговый workflow',
    stepHeaders: ['Шаг', 'Что делать', 'Почему важно'],
    stepRows: [
      ['1', 'Проверьте, доступна ли генерация изображений в интерфейсе ChatGPT.', 'Доступность зависит от модели и аккаунта, поэтому сначала смотрите инструменты composer.'],
      ['2', 'Пишите первый prompt как производственный brief.', 'Модели нужны конкретные визуальные ограничения, а не декоративные слова.'],
      ['3', 'Добавляйте референс только когда идентичность должна остаться фиксированной.', 'Референсы защищают лицо, форму продукта, упаковку, UI или палитру.'],
      ['4', 'Исправляйте один недостаток за раз.', 'Так видно, какая инструкция действительно улучшила изображение.'],
    ],
    formulaTitle: 'Формула prompt',
    formulaItems: [
      'Объект: человек, продукт, предмет, комната, интерфейс или сцена.',
      'Сцена: фон, окружение, дистанция камеры и точка зрения.',
      'Стиль: реализм, editorial mood, материал, палитра и свет.',
      'Формат: aspect ratio, crop, прозрачный фон, no text или safe area.',
      'Правило проверки: что вы смотрите первым после генерации.',
    ],
    copyTitle: 'Готовые ChatGPT image prompts',
    copyIntro: 'Prompt blocks оставлены на английском, чтобы их можно было сразу вставить в ChatGPT или Vogue AI.',
    scenarioTitle: 'Матрица сценариев',
    scenarioHeaders: ['Цель', 'Фокус prompt', 'Проверить первым'],
    scenarioRows: [
      ['Профильное изображение', 'Лицо, одежда, отделение от фона, crop и выражение.', 'Идентичность, лишние руки, кожа и четкость глаз.'],
      ['Изображение продукта', 'Форма, материал, свет, фон и тень.', 'Неверный силуэт, искаженная этикетка, слабый материал.'],
      ['Концепт постера', 'Hero subject, negative space, palette и ratio канала.', 'Нет места для заголовка, перегруз, fake text, слабый фокус.'],
      ['Редактирование по референсу', 'Что фиксировано и что можно менять.', 'Дрифт идентичности, crop drift, лишние изменения стиля.'],
    ],
    genericTitle: 'Когда ChatGPT дает слишком общий результат',
    genericItems: [
      'Добавьте реальную аудиторию, канал, сезон, материал или палитру бренда.',
      'Замените общие style words на камеру, свет, crop и фон.',
      'Попросите новую вариацию, которая сохраняет объект и меняет только слабую часть.',
      'Перенесите prompt в Vogue AI, если нужны выбор модели, prompt-library примеры или повторяемая история workspace.',
    ],
    referenceTitle: 'Workflow с референс-изображением',
    productAlt: 'Пример продукта GPT Image 2 в reference style',
    productCaption: 'Используйте этот пример, когда нужны стабильная форма, материал и коммерческое кадрирование, а не декоративное вдохновение.',
    referenceText:
      'У референса должна быть задача. Скажите ChatGPT, контролирует ли он идентичность, форму, палитру, layout, UI hierarchy или позу. Затем укажите, что можно менять: свет, фон, одежду, угол камеры или настроение.',
    vogueTitle: 'Используйте Vogue AI после первого черновика ChatGPT',
    vogueItems: [
      'Используйте GPT Image 2 в Vogue AI для точного следования инструкциям и чистого reuse prompt.',
      'Используйте Nano Banana для быстрых вариаций, когда brief уже понятен.',
      'Используйте Midjourney для mood exploration после фиксации объекта и композиции.',
      'Сохраняйте лучшую версию prompt перед сменой семейства моделей.',
    ],
    mistakesTitle: 'Ошибки и исправления',
    mistakeHeaders: ['Проблема', 'Что исправить первым', 'Чего избегать'],
    mistakeRows: [
      ['ChatGPT не создает изображение', 'Проверьте доступность модели/инструментов или перенесите prompt в Vogue AI.', 'Думать, что каждый чат умеет генерировать картинки.'],
      ['Картинка выглядит общей', 'Добавьте аудиторию, канал, палитру, материал и свет.', 'Добавлять еще больше расплывчатых прилагательных.'],
      ['Неверная идентичность', 'Прикрепите референс и задайте фиксированные детали.', 'Менять стиль, пока идентичность не определена.'],
      ['Плохой текст в изображении', 'Попросите no text и добавьте типографику позже.', 'Ожидать идеальный финальный copy внутри сгенерированной картинки.'],
    ],
    faq: [
      ['Может ли ChatGPT создавать изображения?', 'Да, если image generation доступна в интерфейсе ChatGPT и выбранной модели.'],
      ['Как заставить ChatGPT сгенерировать изображение?', 'Попросите конкретное изображение с объектом, сценой, стилем, форматом и ограничениями.'],
      ['Можно ли загрузить фото и попросить edit?', 'Если интерфейс поддерживает reference image, укажите, что фиксировано и что можно менять.'],
      ['Почему результат выглядит generic?', 'Обычно prompt не хватает аудитории, канала, материала, света или композиции.'],
      ['Должны ли prompts быть длинными?', 'Они должны быть полными, не раздутыми. Короткий структурированный brief лучше длинного мутного абзаца.'],
      ['Где использовать Vogue AI?', 'Используйте Vogue AI для GPT Image 2 prompt reuse, смены моделей, примеров prompt library и визуального workspace.'],
    ],
    zodiacAlt: 'Стилизованный zodiac пример GPT Image 2',
    zodiacCaption: 'Этот пример показывает style control: конкретный объект и визуальный язык превращены в повторяемое направление prompt.',
  },
  pt: {
    intro:
      'Sim, o ChatGPT pode criar imagens quando a geração de imagens está disponível na sua conta ou no modelo escolhido. O fluxo confiável é simples: descreva o assunto, escolha o formato, adicione estilo e restrições, gere um rascunho e revise o maior problema sem reescrever tudo.',
    quickTitle: 'Resposta rápida',
    quickItems: [
      'Abra o ChatGPT, escolha um modelo com imagem, escreva um prompt concreto, anexe referência quando a identidade importar e peça uma revisão por vez.',
      'Se a criação de imagem não estiver disponível, use o mesmo prompt no Vogue AI com GPT Image 2 e continue refinando a partir do resultado visual.',
      'Não comece com pedidos vagos como "make a cool image"; defina assunto, cena, enquadramento, luz, estilo e regras de saída.',
    ],
    heroAlt: 'Exemplo editorial de moda GPT Image 2',
    heroCaption:
      'Este hero combina com o fluxo de imagem no ChatGPT porque mostra um resultado GPT Image 2 guiado por prompt, com assunto, styling e composição controlados.',
    stepTitle: 'Fluxo passo a passo',
    stepHeaders: ['Etapa', 'O que fazer', 'Por que importa'],
    stepRows: [
      ['1', 'Confirme se a geração de imagens está disponível na interface do ChatGPT.', 'A disponibilidade depende do modelo e da conta, então comece olhando as ferramentas do composer.'],
      ['2', 'Escreva o primeiro prompt como um brief de produção.', 'O modelo precisa de controles visuais concretos, não de palavras decorativas.'],
      ['3', 'Adicione referência apenas quando a identidade precisar ficar fixa.', 'Referências protegem rosto, forma do produto, embalagem, UI ou paleta.'],
      ['4', 'Revise um erro por vez.', 'Revisões únicas mostram qual instrução melhorou a imagem.'],
    ],
    formulaTitle: 'Fórmula de prompt',
    formulaItems: [
      'Assunto: pessoa, produto, objeto, ambiente, interface ou cena.',
      'Cena: fundo, cenário, distância da câmera e ponto de vista.',
      'Estilo: realismo, clima editorial, material, paleta e iluminação.',
      'Formato: proporção, corte, fundo transparente, sem texto ou safe area.',
      'Regra de revisão: o primeiro item que você vai inspecionar após gerar.',
    ],
    copyTitle: 'Prompts de imagem ChatGPT prontos para copiar',
    copyIntro: 'Os prompt blocks ficam em inglês para você colar diretamente no ChatGPT ou no Vogue AI.',
    scenarioTitle: 'Matriz de cenários',
    scenarioHeaders: ['Objetivo', 'Foco do prompt', 'Verifique primeiro'],
    scenarioRows: [
      ['Imagem de perfil', 'Rosto, roupa, separação do fundo, corte e expressão.', 'Identidade, mãos extras, textura da pele e nitidez dos olhos.'],
      ['Imagem de produto', 'Forma, material, luz, fundo e sombra.', 'Silhueta errada, rótulo distorcido, material fraco.'],
      ['Conceito de pôster', 'Assunto principal, espaço negativo, paleta e proporção do canal.', 'Sem espaço para título, poluição visual, texto falso, foco fraco.'],
      ['Edição com referência', 'O que fica fixo e o que pode mudar.', 'Desvio de identidade, crop drift, mudanças de estilo indesejadas.'],
    ],
    genericTitle: 'Quando o ChatGPT gera uma imagem genérica',
    genericItems: [
      'Adicione público real, canal, estação, material ou paleta de marca.',
      'Troque palavras amplas por câmera, iluminação, corte e fundo.',
      'Peça uma variação que preserve o assunto e mude só a parte fraca.',
      'Leve o prompt para o Vogue AI quando precisar de escolha de modelo, exemplos de prompt library ou histórico reutilizável.',
    ],
    referenceTitle: 'Fluxo com imagem de referência',
    productAlt: 'Exemplo de produto GPT Image 2 em estilo de referência',
    productCaption: 'Use este exemplo quando a imagem precisa manter forma, material e enquadramento comercial, em vez de inspiração decorativa.',
    referenceText:
      'Uma referência precisa ter uma função. Diga ao ChatGPT se ela controla identidade, forma, paleta, layout, hierarquia de UI ou pose. Depois diga o que pode mudar: luz, fundo, roupa, ângulo de câmera ou clima.',
    vogueTitle: 'Use Vogue AI depois do primeiro rascunho do ChatGPT',
    vogueItems: [
      'Use GPT Image 2 no Vogue AI quando quiser seguir instruções de perto e reutilizar prompts com clareza.',
      'Use Nano Banana para variações rápidas depois que o brief estiver claro.',
      'Use Midjourney para explorar mood quando assunto e composição já estiverem definidos.',
      'Salve a melhor versão do prompt antes de trocar de família de modelo.',
    ],
    mistakesTitle: 'Erros e correções',
    mistakeHeaders: ['Problema', 'Corrija primeiro', 'Evite'],
    mistakeRows: [
      ['ChatGPT não cria imagem', 'Confira modelo/ferramentas ou leve o prompt para Vogue AI.', 'Assumir que todo chat tem geração de imagem.'],
      ['Imagem genérica', 'Adicione público, canal, paleta, material e luz.', 'Adicionar mais adjetivos vagos.'],
      ['Identidade errada', 'Anexe referência e defina detalhes fixos.', 'Reescrever estilo antes de resolver identidade.'],
      ['Texto ruim na imagem', 'Peça no text e adicione tipografia depois.', 'Esperar copy final perfeita dentro da imagem gerada.'],
    ],
    faq: [
      ['ChatGPT pode criar imagens?', 'Sim, quando a geração de imagens está disponível na interface e no modelo escolhido.'],
      ['Como faço o ChatGPT gerar uma imagem?', 'Peça uma imagem específica com assunto, cena, estilo, formato e restrições.'],
      ['Posso enviar uma foto e pedir edição?', 'Use referência quando a interface permitir e diga o que deve ficar fixo e o que pode mudar.'],
      ['Por que o resultado fica genérico?', 'Normalmente faltam público, canal, material, iluminação ou composição no prompt.'],
      ['Prompts precisam ser longos?', 'Precisam ser completos, não inchados. Um brief curto e estruturado vence um parágrafo longo e vago.'],
      ['Onde o Vogue AI entra?', 'Use Vogue AI para reutilizar prompts do GPT Image 2, trocar modelos, ver exemplos e manter um workspace visual.'],
    ],
    zodiacAlt: 'Exemplo zodiac estilizado GPT Image 2',
    zodiacCaption: 'Este exemplo mostra controle de estilo: assunto e linguagem visual viram uma direção de prompt reutilizável.',
  },
  ja: {
    intro:
      'はい。ChatGPT の画面や選択中のモデルで画像生成が使える場合、ChatGPT は画像を作成できます。安定した流れは、主体を説明し、形式を選び、スタイルと制約を加え、最初の案を生成し、全体を書き直さずに最大の失敗だけを修正することです。',
    quickTitle: 'クイック回答',
    quickItems: [
      'ChatGPT を開き、画像対応モデルを選び、具体的な prompt を書きます。本人性や商品の形が重要な場合だけ reference image を追加します。',
      '画像生成が使えない場合は、同じ prompt を Vogue AI の GPT Image 2 に入れて、生成結果から調整を続けます。',
      '“make a cool image” のような曖昧な依頼ではなく、subject、scene、crop、lighting、style、output rules から始めます。',
    ],
    heroAlt: 'GPT Image 2 ファッション editorial の例',
    heroCaption:
      'この hero は ChatGPT image workflow に合っています。prompt によって主体、styling、composition が明確に制御された GPT Image 2 の結果だからです。',
    stepTitle: 'ステップ別ワークフロー',
    stepHeaders: ['ステップ', 'やること', '重要な理由'],
    stepRows: [
      ['1', 'ChatGPT の interface で画像生成が使えるか確認します。', '可用性はモデルとアカウントに依存するため、まず composer tools を確認します。'],
      ['2', '最初の prompt を production brief として書きます。', 'モデルには装飾語よりも具体的な visual controls が必要です。'],
      ['3', 'identity を固定する必要がある場合だけ reference image を追加します。', 'reference は顔、商品形状、packaging、UI、palette を守ります。'],
      ['4', '一度に一つの失敗だけを修正します。', '単独の revision なら、どの指示が改善につながったか分かります。'],
    ],
    formulaTitle: 'Prompt formula',
    formulaItems: [
      'Subject: 人物、商品、物体、部屋、interface、scene。',
      'Scene: background、setting、camera distance、point of view。',
      'Style: realism、editorial mood、material detail、color palette、lighting。',
      'Format: aspect ratio、crop、transparent background、no text、safe area。',
      'Review rule: 生成後に最初に確認する項目。',
    ],
    copyTitle: 'コピーして使える ChatGPT image prompts',
    copyIntro: 'Prompt blocks は英語のまま残し、ChatGPT や Vogue AI に直接貼れるようにします。',
    scenarioTitle: 'シナリオ別マトリクス',
    scenarioHeaders: ['目的', 'prompt の焦点', '最初に確認すること'],
    scenarioRows: [
      ['プロフィール画像', '顔、服装、背景分離、crop、表情。', 'identity、余分な手、肌質、目のシャープさ。'],
      ['商品画像', '商品形状、素材、照明、背景、影。', 'シルエット違い、ラベル歪み、素材感不足。'],
      ['ポスター案', '主役、余白、palette、channel ratio。', '見出しスペース不足、混雑、fake text、弱い focal point。'],
      ['Reference edit', '固定する要素と変えてよい要素。', 'identity drift、crop drift、不要な style change。'],
    ],
    genericTitle: 'ChatGPT の画像が generic になるとき',
    genericItems: [
      '実際の audience、channel、season、material、brand palette を追加します。',
      '曖昧な style words を camera、lighting、crop、background controls に置き換えます。',
      'subject は保ち、弱い部分だけを変える variation を依頼します。',
      'model choice、prompt-library examples、repeatable workspace history が必要なら Vogue AI に移します。',
    ],
    referenceTitle: 'Reference-image workflow',
    productAlt: 'GPT Image 2 reference-style product example',
    productCaption: '装飾的な inspiration ではなく、形状、素材、commercial framing を安定させたいときに使う例です。',
    referenceText:
      'Reference image には役割が必要です。identity、shape、palette、room layout、UI hierarchy、pose のどれを制御するのかを ChatGPT に伝え、lighting、background、wardrobe、camera angle、mood のどれを変えてよいかも指定します。',
    vogueTitle: '最初の ChatGPT draft の後で Vogue AI を使う',
    vogueItems: [
      '細かい instruction following と clean prompt reuse が必要なら Vogue AI の GPT Image 2 を使います。',
      'core brief が固まったら Nano Banana で素早く variation を出します。',
      'subject と composition が決まった後、Midjourney で mood exploration をします。',
      'model family を変える前に、最も良い prompt version を保存します。',
    ],
    mistakesTitle: 'よくある失敗と修正',
    mistakeHeaders: ['問題', '先に直すこと', '避けること'],
    mistakeRows: [
      ['ChatGPT が画像を作れない', 'model/tools availability を確認するか、prompt を Vogue AI に移します。', 'すべての chat で画像生成できると思い込むこと。'],
      ['画像が generic', 'audience、channel、palette、material、lighting を追加します。', '曖昧な形容詞を増やすこと。'],
      ['identity が違う', 'reference を添付し、固定する detail を定義します。', 'identity が曖昧なまま style を変えること。'],
      ['画像内テキストが悪い', 'no text を指定し、typography は後から追加します。', '生成画像内で完璧な copy を期待すること。'],
    ],
    faq: [
      ['ChatGPT は画像を作れますか？', 'はい。ChatGPT interface と選択モデルで image generation が使える場合に作れます。'],
      ['ChatGPT に画像を生成させるには？', 'subject、scene、style、format、constraints を含む具体的な image request を書きます。'],
      ['写真をアップロードして編集できますか？', 'interface が reference image をサポートする場合、固定する部分と変える部分を指定します。'],
      ['なぜ結果が generic になりますか？', 'prompt に audience、channel、material、lighting、composition controls が足りないことが多いです。'],
      ['Prompts は長い方が良いですか？', '長さではなく completeness です。短く構造化された brief は、長く曖昧な paragraph より強いです。'],
      ['Vogue AI はどこで使いますか？', 'GPT Image 2 prompt reuse、model switching、prompt-library examples、visual workspace が必要なときに使います。'],
    ],
    zodiacAlt: 'GPT Image 2 stylized zodiac example',
    zodiacCaption: 'この例は style control に合っています。具体的な subject と visual language を、再利用できる prompt direction として固定しています。',
  },
  ko: {
    intro:
      '가능합니다. ChatGPT 계정이나 선택한 모델에서 이미지 생성이 제공될 때 ChatGPT는 이미지를 만들 수 있습니다. 안정적인 흐름은 주제 설명, 형식 선택, 스타일과 제약 추가, 첫 초안 생성, 그리고 전체를 다시 쓰기보다 가장 큰 실패 하나를 수정하는 것입니다.',
    quickTitle: '빠른 답변',
    quickItems: [
      'ChatGPT를 열고 이미지 지원 모델을 선택한 뒤 구체적인 prompt를 작성하세요. 정체성이나 제품 형태가 중요하면 reference image를 추가합니다.',
      '이미지 생성이 보이지 않으면 같은 prompt를 Vogue AI의 GPT Image 2에 넣고 결과를 보며 계속 다듬습니다.',
      '“make a cool image”처럼 모호하게 시작하지 말고 subject, scene, crop, lighting, style, output rules를 명확히 쓰세요.',
    ],
    heroAlt: 'GPT Image 2 패션 editorial 예시',
    heroCaption:
      '이 hero는 ChatGPT image workflow와 잘 맞습니다. prompt가 주제, styling, composition을 명확히 제어한 GPT Image 2 결과이기 때문입니다.',
    stepTitle: '단계별 workflow',
    stepHeaders: ['단계', '할 일', '중요한 이유'],
    stepRows: [
      ['1', 'ChatGPT interface에서 이미지 생성이 가능한지 확인합니다.', '모델과 계정에 따라 달라지므로 composer tools부터 확인해야 합니다.'],
      ['2', '첫 prompt를 production brief처럼 작성합니다.', '모델은 장식적인 말보다 구체적인 visual controls를 필요로 합니다.'],
      ['3', 'identity가 고정되어야 할 때만 reference image를 추가합니다.', 'reference는 얼굴, 제품 형태, packaging, UI, palette를 보호합니다.'],
      ['4', '한 번에 하나의 실패만 수정합니다.', '단일 revision은 어떤 지시가 이미지를 개선했는지 보여줍니다.'],
    ],
    formulaTitle: 'Prompt formula',
    formulaItems: [
      'Subject: 사람, 제품, 물체, 방, interface, scene.',
      'Scene: background, setting, camera distance, point of view.',
      'Style: realism, editorial mood, material detail, color palette, lighting.',
      'Format: aspect ratio, crop, transparent background, no text, safe area.',
      'Review rule: 생성 후 가장 먼저 확인할 항목.',
    ],
    copyTitle: '복사 가능한 ChatGPT image prompts',
    copyIntro: 'Prompt blocks는 ChatGPT나 Vogue AI에 바로 붙여넣을 수 있도록 영어로 유지합니다.',
    scenarioTitle: 'Scenario matrix',
    scenarioHeaders: ['목표', 'prompt 초점', '먼저 확인할 것'],
    scenarioRows: [
      ['프로필 이미지', '얼굴, 의상, 배경 분리, crop, 표정.', 'identity, 여분의 손, 피부 질감, 눈 선명도.'],
      ['제품 이미지', '제품 형태, 소재, 조명, 배경, 그림자.', '잘못된 실루엣, 왜곡된 라벨, 약한 소재 디테일.'],
      ['포스터 콘셉트', '주인공, negative space, palette, channel ratio.', '제목 공간 부족, 복잡함, fake text, 약한 focal point.'],
      ['Reference edit', '고정할 것과 바꿀 수 있는 것.', 'identity drift, crop drift, 원치 않는 style change.'],
    ],
    genericTitle: 'ChatGPT 이미지가 너무 평범할 때',
    genericItems: [
      '실제 audience, channel, season, material, brand palette를 추가합니다.',
      '넓은 style words를 camera, lighting, crop, background controls로 바꿉니다.',
      'subject는 유지하고 약한 부분만 바꾸는 variation을 요청합니다.',
      'model choice, prompt-library examples, repeatable workspace history가 필요하면 Vogue AI로 옮깁니다.',
    ],
    referenceTitle: 'Reference-image workflow',
    productAlt: 'GPT Image 2 reference-style product example',
    productCaption: '장식적 inspiration보다 안정적인 shape, material, commercial framing이 필요할 때 쓰는 제품 예시입니다.',
    referenceText:
      'Reference image에는 역할이 있어야 합니다. identity, shape, palette, room layout, UI hierarchy, pose 중 무엇을 제어하는지 ChatGPT에 말하고, lighting, background, wardrobe, camera angle, mood 중 무엇을 바꿀 수 있는지도 지정하세요.',
    vogueTitle: '첫 ChatGPT draft 이후 Vogue AI 사용하기',
    vogueItems: [
      '세밀한 instruction following과 clean prompt reuse가 필요하면 Vogue AI의 GPT Image 2를 사용합니다.',
      'core brief가 명확해진 뒤 Nano Banana로 빠른 variation을 만듭니다.',
      'subject와 composition을 안 뒤 Midjourney로 mood exploration을 합니다.',
      'model family를 바꾸기 전에 가장 좋은 prompt version을 저장합니다.',
    ],
    mistakesTitle: '실수와 수정법',
    mistakeHeaders: ['문제', '먼저 고칠 것', '피할 것'],
    mistakeRows: [
      ['ChatGPT가 이미지를 만들지 못함', 'model/tools availability를 확인하거나 prompt를 Vogue AI로 옮깁니다.', '모든 chat에서 이미지 생성이 된다고 가정하기.'],
      ['이미지가 generic함', 'audience, channel, palette, material, lighting을 추가합니다.', '모호한 형용사를 더 붙이기.'],
      ['identity가 틀림', 'reference를 첨부하고 고정할 detail을 정의합니다.', 'identity가 불명확한 상태에서 style부터 바꾸기.'],
      ['이미지 안 텍스트가 나쁨', 'no text를 요청하고 typography는 나중에 추가합니다.', '생성 이미지 안에서 완벽한 copy를 기대하기.'],
    ],
    faq: [
      ['ChatGPT가 이미지를 만들 수 있나요?', '네. ChatGPT interface와 선택 모델에서 image generation이 제공될 때 가능합니다.'],
      ['ChatGPT가 이미지를 생성하게 하려면?', 'subject, scene, style, format, constraints를 포함한 구체적인 이미지 요청을 작성하세요.'],
      ['사진을 올리고 편집을 요청할 수 있나요?', 'reference image가 지원되면 무엇을 고정하고 무엇을 바꿀지 명확히 말하세요.'],
      ['왜 결과가 generic한가요?', '대개 audience, channel, material, lighting, composition controls가 부족합니다.'],
      ['Prompts는 길어야 하나요?', '길기보다 완전해야 합니다. 짧고 구조화된 brief가 긴 모호한 문장보다 낫습니다.'],
      ['Vogue AI는 어디에 쓰나요?', 'GPT Image 2 prompt reuse, model switching, prompt-library examples, visual workspace가 필요할 때 사용합니다.'],
    ],
    zodiacAlt: 'GPT Image 2 stylized zodiac example',
    zodiacCaption: '이 예시는 style control에 맞습니다. 구체적인 subject와 visual language를 재사용 가능한 prompt direction으로 고정합니다.',
  },
} as const;

function makeLocalizedContent(locale: keyof typeof localizedPostCopy): BlogContentBlock[] {
  const c = localizedPostCopy[locale];

  return [
    { type: 'paragraph', text: c.intro },
    { type: 'heading', level: 2, text: c.quickTitle },
    { type: 'list', items: [...c.quickItems] },
    { type: 'image', src: images.hero, alt: c.heroAlt, caption: c.heroCaption },
    { type: 'heading', level: 2, text: c.stepTitle },
    { type: 'table', headers: [...c.stepHeaders], rows: c.stepRows.map((row) => [...row]) },
    { type: 'heading', level: 2, text: c.formulaTitle },
    { type: 'list', items: [...c.formulaItems] },
    { type: 'heading', level: 2, text: c.copyTitle },
    { type: 'paragraph', text: c.copyIntro },
    { type: 'list', items: [...promptBlocks] },
    { type: 'heading', level: 2, text: c.scenarioTitle },
    { type: 'table', headers: [...c.scenarioHeaders], rows: c.scenarioRows.map((row) => [...row]) },
    { type: 'heading', level: 2, text: c.genericTitle },
    { type: 'list', items: [...c.genericItems] },
    { type: 'heading', level: 2, text: c.referenceTitle },
    { type: 'image', src: images.product, alt: c.productAlt, caption: c.productCaption },
    { type: 'paragraph', text: c.referenceText },
    { type: 'heading', level: 2, text: c.vogueTitle },
    { type: 'list', items: [...c.vogueItems] },
    { type: 'heading', level: 2, text: c.mistakesTitle },
    { type: 'table', headers: [...c.mistakeHeaders], rows: c.mistakeRows.map((row) => [...row]) },
    { type: 'heading', level: 2, text: 'FAQ' },
    ...c.faq.flatMap(([question, answer]) => [
      { type: 'heading' as const, level: 3 as const, text: question },
      { type: 'paragraph' as const, text: answer },
    ]),
    { type: 'image', src: images.zodiac, alt: c.zodiacAlt, caption: c.zodiacCaption },
  ];
}

export const howToCreateImagesWithChatGptAutoBlogPost: BlogPostSource = {
  slug: 'how-to-create-images-with-chat-gpt',
  date: '2026-05-31',
  updatedAt: '2026-05-31',
  author: 'Vogue AI Team',
  image: images.hero,
  imageAlt: 'GPT Image 2 fashion editorial prompt example',
  articleType: 'tutorial',
  modelTags: ['vogue-ai', 'gpt-image-2', 'nano-banana', 'midjourney'],
  readingMinutes: 10,
  localizations: {
    en: {
      title: 'How to create images with ChatGPT: prompts, references, and fixes',
      summary:
        'A practical ChatGPT image workflow with copyable prompts, reference-image rules, failure fixes, and a Vogue AI follow-up path for GPT Image 2 variations.',
      seoTitle: 'How to Create Images with ChatGPT',
      seoDescription:
        'Learn how to create images with ChatGPT using structured prompts, reference images, revision rules, and Vogue AI GPT Image 2 follow-up workflows.',
      content: makeContent('en'),
    },
    zh: { title: '如何用 ChatGPT 创建图片', summary: '用结构化提示词、参考图和 Vogue AI 后续流程创建更稳定的 ChatGPT 图片。', seoTitle: '如何用 ChatGPT 创建图片', seoDescription: '学习用 ChatGPT 创建图片的提示词结构、参考图规则和 Vogue AI GPT Image 2 后续工作流。', content: makeLocalizedContent('zh') },
    fr: { title: 'Comment créer des images avec ChatGPT', summary: 'Un workflow pratique avec prompts structurés, références, corrections et relais Vogue AI.', seoTitle: 'Créer des images avec ChatGPT', seoDescription: 'Apprenez à créer des images avec ChatGPT grâce aux prompts, références et workflows Vogue AI.', content: makeLocalizedContent('fr') },
    ru: { title: 'Как создавать изображения с ChatGPT', summary: 'Практический процесс с промптами, референсами, исправлениями и продолжением в Vogue AI.', seoTitle: 'Как создавать изображения с ChatGPT', seoDescription: 'Создавайте изображения с ChatGPT через структурированные промпты, референсы и Vogue AI.', content: makeLocalizedContent('ru') },
    pt: { title: 'Como criar imagens com ChatGPT', summary: 'Um fluxo prático com prompts, referências, correções e continuidade no Vogue AI.', seoTitle: 'Como criar imagens com ChatGPT', seoDescription: 'Aprenda a criar imagens com ChatGPT usando prompts estruturados, referências e Vogue AI.', content: makeLocalizedContent('pt') },
    ja: { title: 'ChatGPT で画像を作成する方法', summary: '構造化 prompt、参考画像、修正ルール、Vogue AI 連携で ChatGPT 画像を作る実践ガイドです。', seoTitle: 'ChatGPT で画像を作成する方法', seoDescription: 'ChatGPT で画像を作る prompt、参考画像、Vogue AI GPT Image 2 ワークフローを解説します。', content: makeLocalizedContent('ja') },
    ko: { title: 'ChatGPT로 이미지를 만드는 방법', summary: '구조화된 prompt, 레퍼런스, 수정 규칙, Vogue AI 후속 흐름으로 이미지를 만드는 가이드입니다.', seoTitle: 'ChatGPT로 이미지 만들기', seoDescription: 'ChatGPT 이미지 생성 prompt, 레퍼런스 이미지, Vogue AI GPT Image 2 워크플로를 배웁니다.', content: makeLocalizedContent('ko') },
  },
};
