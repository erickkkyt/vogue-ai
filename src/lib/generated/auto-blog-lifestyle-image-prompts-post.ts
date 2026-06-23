import type { BlogContentBlock, BlogPostSource } from '@/lib/blog-data';

const promptLibraryImages = {
  hero:
    'https://media.vogueai.net/blog/auto/lifestyle-image-prompts/894e4ea6a61d-medium-portrait-shot-name-outdoor-fashion-lifestyle-1.jpg',
  profile:
    'https://media.vogueai.net/prompt-libraries/awesome-gptimage2-prompts/vogueai-20260611-professional-profile-avatar-with-name-ai-prompt/professional-profile-avatar-with-name-ai-prompt-adult-graduate-student-from-an-uploaded-selfie-n-01.png',
  reference:
    'https://media.vogueai.net/blog/auto/lifestyle-image-prompts/f472666d66c6-edit-uploaded-reference-image-into-100-accurate-1.jpg',
} as const;

const promptBlocks = [
  'Natural lifestyle portrait: Editorial lifestyle photo of [person description] in [real location], relaxed candid expression, natural skin texture, believable posture, soft daylight, lived-in background details, 35mm documentary framing, 4:5 crop, no extra fingers, no text, no watermark.',
  'Instagram lifestyle scene: Social-ready lifestyle image of [subject] doing [everyday action] in [setting], warm realistic light, subtle motion, authentic wardrobe, clean negative space, contemporary creator aesthetic, 9:16 vertical crop, no text overlays.',
  'Reference-led avatar: Use my uploaded image as the identity reference. Create a polished lifestyle avatar of the same person in [scene], preserve face identity, age, hair shape, and expression while changing wardrobe, lighting, and background, natural skin texture, 3:4 crop, no extra hands.',
  'Product-in-life moment: Realistic lifestyle photograph of [product] being used by [person or audience] in [context], product clearly visible but not staged, natural hand placement, honest shadows, documentary commercial style, 4:5 crop, no logo distortion, no text.',
] as const;

const casePrompts = {
  portrait:
    'Editorial lifestyle portrait of a creative director walking through a quiet city street after rain, relaxed confident expression, natural skin texture, soft overcast daylight, black wool coat, blurred storefronts in the background, 35mm documentary photography, shallow depth of field, 4:5 crop, no extra fingers, no text.',
  avatar:
    'Use my uploaded image as the face reference. Create a professional lifestyle avatar for an adult graduate student, natural expression, clean casual wardrobe, soft campus daylight, realistic skin texture, subtle background blur, preserve identity and age, 3:4 crop, no text, no watermark.',
} as const;

const enContent: BlogContentBlock[] = [
  {
    type: 'paragraph',
    text: 'Lifestyle image prompts should make people and scenes feel observed, not staged. The useful structure is simple: name the person or subject, place them in a believable daily context, control the camera and light, then add a short failure check for hands, skin, identity, and background clutter.',
  },
  {
    type: 'heading',
    level: 2,
    text: 'TL;DR: make lifestyle prompts specific, ordinary, and controllable',
  },
  {
    type: 'list',
    items: [
      'Start with a real scenario: commute, cafe table, home studio, campus, workout, shopping trip, or product-in-use moment.',
      'Use human details sparingly: posture, expression, wardrobe, skin texture, and hand placement matter more than long mood adjectives.',
      'Add the camera language that fits the channel: 35mm documentary, soft daylight portrait, vertical creator post, or clean commercial realism.',
      'Use a reference image when identity, face shape, hairstyle, product form, or brand color must stay stable.',
      'Judge the first result by realism failures first: waxy skin, extra fingers, awkward hands, over-styled background, or a pose that feels acted.',
    ],
  },
  {
    type: 'heading',
    level: 2,
    text: 'Who this guide is for',
  },
  {
    type: 'paragraph',
    text: 'Use this guide when you need lifestyle image prompts for Instagram, creator portraits, realistic avatars, brand campaigns, or product-in-life visuals. It is not a guide for fantasy art, perfect studio packshots, or exact typography inside the image.',
  },
  {
    type: 'list',
    items: [
      'Good fit: realistic people, everyday scenes, social posts, profile images, creator content, and product use cases.',
      'Poor fit: prompts that must produce exact legal copy, final logo placement, or highly specific celebrity likenesses.',
      'Best first output: a believable draft that you can revise by changing one control, not a final campaign asset with no review.',
    ],
  },
  {
    type: 'heading',
    level: 2,
    text: 'Scenario matrix',
  },
  {
    type: 'table',
    headers: ['Use case', 'Prompt pattern', 'Reference image', 'Common failure'],
    rows: [
      ['Instagram lifestyle post', 'Subject plus everyday action, location, vertical crop, creator-style light, and clean background.', 'Optional unless the person, outfit, or product must stay recognizable.', 'Over-posed subject, fake smile, cluttered room, or no space for later caption design.'],
      ['Professional avatar', 'Face identity, expression, wardrobe, soft background, natural skin, and 3:4 crop.', 'Recommended when the avatar is based on a real selfie.', 'Identity drift, plastic skin, wrong age, sharp background competing with the face.'],
      ['Brand lifestyle campaign', 'Audience, product use moment, environment, color palette, and commercial realism.', 'Recommended when product shape, packaging, or color matters.', 'Product disappears, hands look broken, logo warps, or the scene feels like stock photography.'],
      ['Editorial portrait', 'Person, mood, real location, lens, light, posture, and background depth.', 'Useful when preserving a face or wardrobe direction.', 'Too cinematic, over-retouched, unclear eyes, or a fashion pose that breaks realism.'],
    ],
  },
  {
    type: 'heading',
    level: 2,
    text: 'Prompt anatomy for natural lifestyle images',
  },
  {
    type: 'table',
    headers: ['Part', 'What to write', 'Why it matters'],
    rows: [
      ['Subject', 'Person, product, audience, age range, wardrobe, or activity.', 'A lifestyle image needs a clear human or use-case anchor.'],
      ['Scene', 'A specific ordinary place: cafe counter, hallway mirror, campus path, kitchen table, city street.', 'Ordinary specificity prevents generic studio output.'],
      ['Camera and light', '35mm, shallow depth, soft daylight, overcast street light, warm indoor practicals.', 'Camera language controls realism faster than decorative adjectives.'],
      ['Behavior', 'Walking, reaching, laughing lightly, reading, unpacking, applying, checking a phone.', 'A small action makes the frame feel lived-in.'],
      ['Output guardrails', 'Aspect ratio, no text, no watermark, no extra hands, preserve identity, clear product.', 'Guardrails target the failures lifestyle prompts often create.'],
    ],
  },
  {
    type: 'heading',
    level: 2,
    text: 'Copyable lifestyle image prompts',
  },
  {
    type: 'paragraph',
    text: 'Copy one block, replace the bracketed variables, and keep the rest stable for the first generation. These public prompt blocks stay in English so they can be pasted directly into Vogue AI.',
  },
  {
    type: 'image',
    src: promptLibraryImages.profile,
    alt: 'Professional lifestyle avatar example from the Vogue AI prompt library',
    caption:
      'This first-party GPT Image 2 avatar example matches the reference-led portrait section because the prompt protects face identity while changing scene, wardrobe, and lighting.',
  },
  {
    type: 'list',
    items: [...promptBlocks],
  },
  {
    type: 'heading',
    level: 2,
    text: 'Two prompt-library cases to copy',
  },
  {
    type: 'paragraph',
    text: 'The article uses mixed first-party examples because the keyword is broad: Nano Banana fits quick social lifestyle variations, GPT Image 2 fits reference-led avatar control, and Midjourney fits editorial lifestyle mood exploration.',
  },
  {
    type: 'heading',
    level: 3,
    text: 'Case 1: realistic outdoor lifestyle portrait',
  },
  {
    type: 'paragraph',
    text: 'Use this pattern when the scene needs to look casual and social-ready without becoming a plastic stock image. The hero image for this article uses this Nano Banana lifestyle portrait because it summarizes the search intent without duplicating the first concrete avatar case in the body.',
  },
  {
    type: 'list',
    items: [`Prompt: ${casePrompts.portrait}`],
  },
  {
    type: 'heading',
    level: 3,
    text: 'Case 2: reference-led avatar that keeps identity',
  },
  {
    type: 'image',
    src: promptLibraryImages.reference,
    alt: 'Reference-image lifestyle edit example from the Vogue AI prompt library',
    caption:
      'This Midjourney reference-image example belongs near the identity section because it demonstrates the handoff between an uploaded reference and a new lifestyle treatment.',
  },
  {
    type: 'paragraph',
    text: 'Use this structure when the person must still look like the uploaded selfie. The prompt should say exactly what the reference controls: face identity, age, hair shape, and expression. Wardrobe, background, light, and crop can change.',
  },
  {
    type: 'list',
    items: [`Prompt: ${casePrompts.avatar}`],
  },
  {
    type: 'heading',
    level: 2,
    text: 'Worked example: from vague lifestyle idea to reusable prompt',
  },
  {
    type: 'heading',
    level: 3,
    text: 'Raw request',
  },
  {
    type: 'paragraph',
    text: 'You need an Instagram-ready image for a founder using a new notebook app in a neighborhood cafe. The image should feel candid, not like a SaaS ad, but the laptop screen area and relaxed posture need to stay clear.',
  },
  {
    type: 'heading',
    level: 3,
    text: 'Prompt version 1',
  },
  {
    type: 'list',
    items: [
      'Natural lifestyle image of a startup founder working in a small neighborhood cafe, relaxed posture, one hand near a laptop trackpad, notebook app visible as a clean but not overly detailed screen, warm morning window light, ceramic coffee cup, lived-in table details, 35mm documentary photography, shallow background blur, 4:5 crop, no text overlay, no extra fingers, no logo distortion.',
    ],
  },
  {
    type: 'heading',
    level: 3,
    text: 'First-result diagnosis',
  },
  {
    type: 'paragraph',
    text: 'If the image looks attractive but the hands are strange, fix hand placement before changing style. If the cafe looks too staged, add one or two ordinary details such as a receipt, jacket on chair, or imperfect table surface. If the founder identity matters, add a reference image and tell the model what must not change.',
  },
  {
    type: 'callout',
    title: 'Revision rule',
    text: 'Do not add more adjectives until the person, hands, product visibility, and crop are stable. Lifestyle realism usually improves by removing theatrical details, not by making the prompt longer.',
  },
  {
    type: 'heading',
    level: 2,
    text: 'Mistake and fix table',
  },
  {
    type: 'table',
    headers: ['Failure', 'Fix first', 'Avoid'],
    rows: [
      ['Waxy or over-retouched skin', 'Ask for natural skin texture, soft daylight, and documentary realism.', 'Adding beauty, perfect, flawless, or ultra-glossy language.'],
      ['Extra fingers or awkward hands', 'Describe one simple hand action and keep hands partly relaxed.', 'Complex gestures, crossed arms, or multiple people holding objects.'],
      ['Identity drift', 'Attach a reference image and state what it controls.', 'Trying to preserve identity with adjectives alone.'],
      ['Generic stock-photo look', 'Add a real location, ordinary props, audience, and imperfect background details.', 'More inspirational mood words.'],
      ['Product disappears in the lifestyle scene', 'Name product visibility, placement, and what should remain readable or recognizable.', 'Letting the model decide the product role.'],
    ],
  },
  {
    type: 'heading',
    level: 2,
    text: 'Model fit inside Vogue AI',
  },
  {
    type: 'paragraph',
    text: 'Inside Vogue AI, keep the prompt skeleton stable and choose the model by the failure risk. The same lifestyle brief can be tested across model tags, but change one variable at a time so you can tell whether the model or the wording improved the result.',
  },
  {
    type: 'list',
    items: [
      'Use GPT Image 2 when a real face, product, or instruction-following detail needs tighter control.',
      'Use Nano Banana for fast social variations, candid lifestyle mood boards, and lightweight image-to-image exploration.',
      'Use Midjourney when the goal is editorial mood, fashion framing, or stylized lifestyle exploration.',
      'Save the prompt that solved the job with a plain name such as lifestyle-cafe-founder-4x5-reference-face.',
    ],
  },
  {
    type: 'heading',
    level: 2,
    text: 'What to change after the first result',
  },
  {
    type: 'list',
    items: [
      'If the person looks fake, reduce perfection language and add documentary camera cues.',
      'If the scene feels empty, add two ordinary props and one specific place detail.',
      'If hands fail, simplify the action before changing model or style.',
      'If the crop fails Instagram, set 4:5 or 9:16 and name the subject position.',
      'If brand or product identity matters, add a reference image before adding more style.',
    ],
  },
  {
    type: 'heading',
    level: 2,
    text: 'FAQ',
  },
  { type: 'heading', level: 3, text: 'What makes a good lifestyle image prompt?' },
  { type: 'paragraph', text: 'A good prompt combines a real person or product, an ordinary scene, camera and light controls, and a short realism check for hands, skin, identity, and clutter.' },
  { type: 'heading', level: 3, text: 'Can I copy these prompts directly?' },
  { type: 'paragraph', text: 'Yes. Replace the bracketed variables first, then generate once before changing the stable structure.' },
  { type: 'heading', level: 3, text: 'When should I use a reference image?' },
  { type: 'paragraph', text: 'Use a reference when face identity, product shape, packaging, wardrobe, or brand color must stay recognizable.' },
  { type: 'heading', level: 3, text: 'How do I make AI lifestyle photos less fake?' },
  { type: 'paragraph', text: 'Use ordinary locations, simple actions, natural skin texture, documentary camera language, and fewer perfection adjectives.' },
  { type: 'heading', level: 3, text: 'Which aspect ratio works for lifestyle prompts?' },
  { type: 'paragraph', text: 'Use 4:5 for feed posts and portrait cards, 9:16 for Stories or Reels covers, and 3:4 for avatars or profile images.' },
  { type: 'heading', level: 3, text: 'Should prompts include final text overlays?' },
  { type: 'paragraph', text: 'Usually no. Reserve clean negative space and add final typography in a design tool for better control.' },
];

const localizedContent = (locale: 'zh' | 'fr' | 'ru' | 'pt' | 'ja' | 'ko'): BlogContentBlock[] => {
  const copy = {
    zh: {
      intro: '生活方式图片提示词的重点，是让人物和场景像真实被拍到，而不是摆拍。先写清人物、场景、相机、光线和失败检查，再进入风格。',
      tldr: 'TL;DR：生活方式提示词要具体、日常、可控',
      who: '适用人群',
      matrix: '场景矩阵',
      anatomy: '自然生活方式图片的提示词结构',
      copyable: '可复制的 lifestyle image prompts',
      cases: '两个可复用的提示词库案例',
      worked: '完整例子：从模糊想法到可复用提示词',
      mistakes: '错误和修正表',
      model: 'Vogue AI 内的模型选择',
      revise: '第一张结果之后改什么',
      faq: 'FAQ',
    },
    fr: {
      intro: "Un prompt lifestyle doit donner l'impression d'une scène observée, pas fabriquée. Définissez personne, lieu, caméra, lumière et contrôle des erreurs avant le style.",
      tldr: 'TL;DR : des prompts lifestyle précis, ordinaires et contrôlables',
      who: 'Pour qui',
      matrix: 'Matrice de scénarios',
      anatomy: "Anatomie d'un prompt lifestyle naturel",
      copyable: 'Prompts lifestyle copiables',
      cases: 'Deux cas de bibliothèque à réutiliser',
      worked: "Exemple complet : d'une idée vague à un prompt réutilisable",
      mistakes: 'Tableau erreurs et corrections',
      model: 'Choisir le modèle dans Vogue AI',
      revise: 'Que modifier après le premier rendu',
      faq: 'FAQ',
    },
    ru: {
      intro: 'Lifestyle prompt должен выглядеть как наблюдаемая сцена, а не постановка. Сначала задайте человека, место, камеру, свет и проверку ошибок, затем стиль.',
      tldr: 'TL;DR: делайте lifestyle prompts конкретными, обычными и управляемыми',
      who: 'Для кого это руководство',
      matrix: 'Матрица сценариев',
      anatomy: 'Структура prompt для естественных lifestyle images',
      copyable: 'Копируемые lifestyle image prompts',
      cases: 'Два кейса из библиотеки prompts',
      worked: 'Пример: от vague idea к reusable prompt',
      mistakes: 'Таблица ошибок и исправлений',
      model: 'Выбор модели в Vogue AI',
      revise: 'Что менять после первого результата',
      faq: 'FAQ',
    },
    pt: {
      intro: 'Prompts de lifestyle image devem parecer cenas observadas, não encenadas. Defina pessoa, contexto, câmera, luz e checagem de falhas antes do estilo.',
      tldr: 'TL;DR: prompts lifestyle específicos, comuns e controláveis',
      who: 'Para quem é este guia',
      matrix: 'Matriz de cenários',
      anatomy: 'Anatomia de prompts lifestyle naturais',
      copyable: 'Lifestyle image prompts copiáveis',
      cases: 'Dois casos da biblioteca para reutilizar',
      worked: 'Exemplo completo: da ideia vaga ao prompt reutilizável',
      mistakes: 'Tabela de erros e correções',
      model: 'Escolha de modelo no Vogue AI',
      revise: 'O que mudar depois do primeiro resultado',
      faq: 'FAQ',
    },
    ja: {
      intro: 'Lifestyle image prompt は、作られた広告ではなく自然に観察された場面に見えることが重要です。人物、場所、camera、light、失敗チェックを先に固定します。',
      tldr: 'TL;DR：lifestyle prompt は具体的で日常的、そして制御可能にする',
      who: 'このガイドが向いている人',
      matrix: 'シナリオ別マトリクス',
      anatomy: '自然な lifestyle image prompt の構造',
      copyable: 'コピーできる lifestyle image prompts',
      cases: '再利用できる prompt library の 2 ケース',
      worked: '完全な例：曖昧な idea から再利用できる prompt へ',
      mistakes: '失敗と修正の表',
      model: 'Vogue AI での model 選び',
      revise: '最初の結果後に変えること',
      faq: 'FAQ',
    },
    ko: {
      intro: 'Lifestyle image prompt 는 연출된 광고보다 실제로 포착한 장면처럼 보여야 합니다. 사람, 장소, camera, light, 실패 점검을 먼저 고정하세요.',
      tldr: 'TL;DR: lifestyle prompt 는 구체적이고 일상적이며 제어 가능해야 합니다',
      who: '이 가이드가 맞는 경우',
      matrix: '시나리오 매트릭스',
      anatomy: '자연스러운 lifestyle image prompt 구조',
      copyable: '복사해서 쓰는 lifestyle image prompts',
      cases: '재사용할 수 있는 prompt library 두 사례',
      worked: '완전한 예시: 모호한 idea 에서 reusable prompt 까지',
      mistakes: '실패와 수정 표',
      model: 'Vogue AI 안에서 model 고르기',
      revise: '첫 결과 후 바꿀 것',
      faq: 'FAQ',
    },
  }[locale];
  const body = {
    zh: {
      tldrItems: [
        '先写真实日常场景，再写情绪词：通勤、咖啡桌、校园路、家庭工作台或产品使用瞬间。',
        '人物细节只保留关键控制：姿态、表情、服装、皮肤质感和手部位置。',
        '用相机语言控制真实感：35mm documentary、soft daylight、vertical creator post 或 clean commercial realism。',
        '只要身份、脸型、发型、产品外形或品牌色必须稳定，就加入参考图并说明它控制什么。',
        '第一张图先查真实感失败：蜡感皮肤、多余手指、摆拍姿态、背景过度装饰或产品不清楚。',
      ],
      whoParagraph:
        '这篇适合做 Instagram 生活方式图、真实头像、品牌生活方式活动和产品使用场景。它不适合生成精确法律文案、最终 logo 排版或名人相似度。',
      whoItems: [
        '适合：真实人物、社媒图、头像、创作者内容、产品使用场景。',
        '不适合：必须精确拼写的广告文案、最终商标排版、名人脸复刻。',
        '第一轮目标：得到可控草稿，再通过一个变量一个变量地修。',
      ],
      promptIntro:
        '下面的 prompt block 保留英文，方便直接粘贴到 Vogue AI。先替换方括号变量，第一轮不要同时改结构和模型。',
      casesParagraph:
        '这个关键词范围较宽，所以示例混合使用第一方素材：Nano Banana 用于快速生活方式变化，GPT Image 2 用于参考图身份控制，Midjourney 用于编辑感氛围探索。',
      case1: '案例 1：自然户外生活方式人像',
      case1Paragraph:
        '当画面需要像真实被拍到、适合社媒发布、又不能变成塑料感图库照片时，用这一类结构。',
      case2: '案例 2：保留身份的参考图头像',
      case2Paragraph:
        '如果人物必须像上传的自拍，prompt 要明确参考图控制 face identity、age、hair shape 和 expression；服装、背景、灯光和裁切可以改变。',
      workedRaw:
        '你需要一张适合 Instagram 的创始人咖啡馆图片。画面要自然，但产品使用场景、手部动作和 4:5 构图必须清楚。',
      diagnosis:
        '如果手部失败，先简化手部动作，不要先换风格。如果咖啡馆太像摆拍，加入收据、外套、桌面痕迹这类普通细节。如果身份重要，先加参考图，再写身份保护规则。',
      revision:
        '先稳定人物、手部、产品可见性和裁切，再增加情绪词。生活方式真实感通常来自减少戏剧化，而不是堆更多形容词。',
      modelParagraph:
        '在 Vogue AI 里保持同一套 prompt skeleton，然后按失败风险选择模型。一次只改一个变量，才能判断到底是模型还是文字改善了结果。',
      modelItems: [
        'GPT Image 2：适合真实脸、产品形状和指令细节需要更稳的任务。',
        'Nano Banana：适合快速社媒变体、轻量 image-to-image 和生活方式 mood board。',
        'Midjourney：适合编辑感人像、时尚构图和更强风格探索。',
        '把有效版本用普通名称保存，例如 lifestyle-cafe-founder-4x5-reference-face。',
      ],
      reviseItems: [
        '人物太假：减少 perfect/flawless 词，加入 documentary camera cues。',
        '场景太空：加两个普通道具和一个具体地点细节。',
        '手部失败：先简化动作，再考虑换模型。',
        '裁切不适合社媒：明确 4:5、9:16 或 3:4，并说明主体位置。',
        '身份或产品必须一致：先加参考图，不要靠形容词硬保留。',
      ],
      faq: [
        ['好的 lifestyle image prompt 应该包含什么？', '真实人物或产品、普通场景、相机和光线控制，以及针对手、皮肤、身份和背景杂乱的失败检查。'],
        ['这些 prompt 可以直接复制吗？', '可以。先替换方括号变量，生成一轮后再根据失败点调整，不要一开始就重写全部结构。'],
        ['什么时候需要参考图？', '当脸部身份、产品外形、包装、服装或品牌色必须保持可识别时，需要参考图。'],
        ['怎样让 AI 生活方式照片不那么假？', '使用普通地点、简单动作、自然皮肤质感、纪实相机语言，并减少完美、奢华、电影感这类泛化词。'],
        ['生活方式图用什么比例？', '信息流和卡片用 4:5，Stories 或 Reels 封面用 9:16，头像和个人资料图用 3:4。'],
        ['要让模型直接生成最终文字吗？', '通常不要。先留出干净的负空间，最终文字放到设计工具里处理，控制会更好。'],
      ],
    },
    fr: {
      tldrItems: [
        'Commencez par une situation quotidienne réelle : trajet, café, campus, studio maison ou produit utilisé.',
        'Gardez peu de détails humains, mais précis : posture, expression, tenue, texture de peau et placement des mains.',
        'Ajoutez le langage caméra adapté au canal : 35mm documentaire, lumière naturelle douce, format vertical ou réalisme commercial.',
        'Utilisez une image de référence quand identité, visage, coiffure, forme produit ou couleur de marque doivent rester stables.',
        'Évaluez d’abord les défauts de réalisme : peau cireuse, doigts en trop, pose forcée, décor trop stylisé ou produit peu visible.',
      ],
      whoParagraph:
        'Ce guide sert aux visuels Instagram, portraits réalistes, avatars, campagnes lifestyle et scènes produit en usage. Il n’est pas conçu pour du texte légal exact, une typographie finale ou une ressemblance de célébrité.',
      whoItems: [
        'Bon usage : personnes réalistes, posts sociaux, avatars, contenu créateur, produit en contexte.',
        'Mauvais usage : mentions légales exactes, logo final, imitation de célébrité.',
        'Objectif du premier rendu : obtenir une base contrôlable, pas un asset final sans revue.',
      ],
      promptIntro:
        'Les blocs de prompt restent en anglais pour être collés directement dans Vogue AI. Remplacez les variables entre crochets, puis testez une fois avant de modifier la structure.',
      casesParagraph:
        'Le mot-clé est large, donc les exemples combinent plusieurs usages : Nano Banana pour variations rapides, GPT Image 2 pour contrôle par référence et Midjourney pour mood éditorial.',
      case1: 'Cas 1 : portrait lifestyle extérieur naturel',
      case1Paragraph:
        'Utilisez ce schéma quand l’image doit paraître spontanée, prête pour les réseaux et moins proche d’une photo de stock.',
      case2: 'Cas 2 : avatar avec référence qui conserve l’identité',
      case2Paragraph:
        'Quand la personne doit rester reconnaissable, indiquez ce que la référence contrôle : identité du visage, âge, forme des cheveux et expression.',
      workedRaw:
        'Créer une image Instagram d’un fondateur dans un café de quartier, naturelle mais assez claire pour montrer le contexte produit et le cadrage 4:5.',
      diagnosis:
        'Si les mains échouent, simplifiez l’action avant le style. Si le café paraît fabriqué, ajoutez des détails ordinaires. Si l’identité compte, ajoutez une référence avant les adjectifs.',
      revision:
        'Stabilisez personne, mains, produit visible et cadrage avant d’ajouter du mood. Le réalisme lifestyle vient souvent de la retenue.',
      modelParagraph:
        'Dans Vogue AI, gardez le même squelette de prompt et choisissez le modèle selon le risque : contrôle, vitesse ou mood éditorial.',
      modelItems: [
        'GPT Image 2 : identité, produit et consignes précises.',
        'Nano Banana : variations sociales rapides et exploration image-to-image.',
        'Midjourney : mood éditorial, cadrage mode et exploration stylisée.',
        'Sauvegardez la version utile avec un nom clair comme lifestyle-cafe-founder-4x5-reference-face.',
      ],
      reviseItems: [
        'Personne artificielle : réduisez les mots de perfection et ajoutez des indices documentaires.',
        'Scène vide : ajoutez deux objets ordinaires et un détail de lieu.',
        'Mains ratées : simplifiez l’action avant de changer de modèle.',
        'Mauvais format : fixez 4:5, 9:16 ou 3:4 et la position du sujet.',
        'Identité importante : ajoutez une image de référence avant plus de style.',
      ],
      faq: [
        ['Qu’est-ce qu’un bon lifestyle image prompt ?', 'Un sujet réel, une scène ordinaire, des contrôles caméra et une vérification des mains, de la peau, de l’identité et du décor.'],
        ['Puis-je copier ces prompts directement ?', 'Oui. Remplacez d’abord les variables, générez une fois, puis corrigez le défaut principal.'],
        ['Quand utiliser une image de référence ?', 'Quand le visage, la forme produit, la tenue, le packaging ou la couleur de marque doivent rester reconnaissables.'],
        ['Comment rendre une photo lifestyle IA moins fausse ?', 'Utilisez des lieux ordinaires, des actions simples, une peau naturelle, un langage documentaire et moins de mots de perfection.'],
        ['Quel ratio choisir ?', '4:5 pour le feed, 9:16 pour le vertical social, 3:4 pour les avatars.'],
        ['Faut-il générer les textes finaux ?', 'En général non. Gardez de l’espace vide et ajoutez la typographie dans un outil de design.'],
      ],
    },
    ru: {
      tldrItems: [
        'Начинайте с обычной ситуации: дорога, кафе, кампус, домашняя студия или момент использования продукта.',
        'Описывайте только важные человеческие детали: позу, выражение, одежду, текстуру кожи и положение рук.',
        'Добавляйте язык камеры под канал: 35mm documentary, soft daylight, vertical creator post или clean commercial realism.',
        'Используйте reference image, когда должны сохраниться лицо, прическа, форма продукта или фирменный цвет.',
        'Первый результат проверяйте на реализм: пластиковая кожа, лишние пальцы, постановочная поза, перегруженный фон или неясный продукт.',
      ],
      whoParagraph:
        'Гайд подходит для Instagram-визуалов, портретов, реалистичных аватаров, lifestyle-кампаний и сцен с продуктом в использовании. Он не подходит для точного текста, финального логотипа или сходства со знаменитостью.',
      whoItems: [
        'Подходит: реальные люди, social posts, avatars, creator content, product-in-use.',
        'Не подходит: юридически точный текст, финальная типографика, celebrity likeness.',
        'Цель первого результата: контролируемый черновик, который можно улучшать по одному параметру.',
      ],
      promptIntro:
        'Prompt-блоки оставлены на английском, чтобы их можно было вставить в Vogue AI без адаптации. Сначала замените переменные в скобках и сделайте один прогон.',
      casesParagraph:
        'Ключ широкий, поэтому примеры разделены по задачам: Nano Banana для быстрых вариаций, GPT Image 2 для reference-control, Midjourney для editorial mood.',
      case1: 'Кейс 1: естественный outdoor lifestyle portrait',
      case1Paragraph:
        'Используйте этот паттерн, когда кадр должен быть реалистичным, пригодным для соцсетей и не похожим на стоковую постановку.',
      case2: 'Кейс 2: reference-led avatar с сохранением личности',
      case2Paragraph:
        'Если человек должен остаться похожим на selfie, прямо укажите, что reference контролирует face identity, age, hair shape и expression.',
      workedRaw:
        'Нужна Instagram-ready сцена с фаундером в соседнем кафе: кадр должен быть candid, но продуктовый контекст, руки и crop 4:5 должны оставаться понятными.',
      diagnosis:
        'Если руки выглядят плохо, сначала упростите действие. Если кафе выглядит постановочно, добавьте обычные детали. Если важна личность, используйте reference image до новых style adjectives.',
      revision:
        'Сначала стабилизируйте человека, руки, видимость продукта и crop. Реализм lifestyle чаще улучшается уменьшением драматизации.',
      modelParagraph:
        'В Vogue AI сохраняйте один skeleton prompt и выбирайте модель по риску: контроль, скорость или editorial mood.',
      modelItems: [
        'GPT Image 2: контроль личности, продукта и инструкции.',
        'Nano Banana: быстрые social variations и image-to-image exploration.',
        'Midjourney: editorial mood, fashion framing и stylized exploration.',
        'Сохраняйте удачный prompt с понятным именем, например lifestyle-cafe-founder-4x5-reference-face.',
      ],
      reviseItems: [
        'Человек выглядит искусственно: уберите perfection language и добавьте documentary cues.',
        'Сцена пустая: добавьте два обычных предмета и деталь места.',
        'Плохие руки: сначала упростите действие.',
        'Неверный crop: задайте 4:5, 9:16 или 3:4 и позицию subject.',
        'Важна идентичность: сначала добавьте reference image.',
      ],
      faq: [
        ['Что делает lifestyle prompt хорошим?', 'Реальный субъект, обычная сцена, camera controls и проверка рук, кожи, идентичности и фона.'],
        ['Можно ли копировать эти prompts?', 'Да. Сначала замените переменные, сделайте один результат и затем исправляйте главный сбой.'],
        ['Когда нужен reference image?', 'Когда лицо, форма продукта, упаковка, одежда или brand color должны оставаться узнаваемыми.'],
        ['Как сделать AI lifestyle photo менее искусственной?', 'Используйте обычные места, простые действия, natural skin texture, documentary camera cues и меньше слов о совершенстве.'],
        ['Какой aspect ratio выбрать?', '4:5 для feed, 9:16 для vertical social, 3:4 для avatars.'],
        ['Нужно ли просить финальный текст?', 'Обычно нет. Оставьте clean negative space и добавьте typography позже.'],
      ],
    },
    pt: {
      tldrItems: [
        'Comece com uma cena diária real: trajeto, mesa de café, campus, estúdio em casa ou produto em uso.',
        'Use poucos detalhes humanos, mas úteis: postura, expressão, roupa, textura de pele e mãos.',
        'Controle realismo com câmera e luz: 35mm documental, soft daylight, post vertical ou commercial realism.',
        'Use imagem de referência quando identidade, rosto, cabelo, forma do produto ou cor da marca precisam ficar estáveis.',
        'Avalie primeiro falhas de realismo: pele cerosa, dedos extras, pose encenada, fundo exagerado ou produto pouco visível.',
      ],
      whoParagraph:
        'Use este guia para imagens de Instagram, retratos, avatares realistas, campanhas lifestyle e produto em uso. Não é para texto legal exato, logo final ou semelhança de celebridade.',
      whoItems: [
        'Bom uso: pessoas realistas, posts sociais, avatares, creator content, produto em contexto.',
        'Mau uso: texto final exato, logo definitivo, celebrity likeness.',
        'Meta inicial: um rascunho controlado que possa ser revisado.',
      ],
      promptIntro:
        'Os blocos de prompt ficam em inglês para colar direto no Vogue AI. Troque as variáveis e mantenha a estrutura no primeiro teste.',
      casesParagraph:
        'Como a busca é ampla, os exemplos combinam usos: Nano Banana para variações rápidas, GPT Image 2 para controle por referência e Midjourney para mood editorial.',
      case1: 'Caso 1: retrato lifestyle externo natural',
      case1Paragraph:
        'Use quando a imagem precisa parecer espontânea, social-ready e menos parecida com banco de imagens.',
      case2: 'Caso 2: avatar com referência que preserva identidade',
      case2Paragraph:
        'Se a pessoa precisa continuar parecida com a selfie, diga que a referência controla face identity, age, hair shape e expression.',
      workedRaw:
        'Criar uma imagem de fundador em um café de bairro para Instagram, com sensação candid, contexto de produto claro e crop 4:5.',
      diagnosis:
        'Se as mãos falharem, simplifique a ação. Se o café parecer encenado, adicione detalhes comuns. Se identidade importa, use referência antes de adjetivos.',
      revision:
        'Estabilize pessoa, mãos, produto visível e crop antes de adicionar mood. Realismo lifestyle melhora com menos teatralidade.',
      modelParagraph:
        'No Vogue AI, mantenha o skeleton do prompt e escolha o modelo pelo risco: controle, velocidade ou estilo editorial.',
      modelItems: [
        'GPT Image 2: identidade, produto e controle de instrução.',
        'Nano Banana: variações sociais rápidas e image-to-image.',
        'Midjourney: mood editorial e enquadramento de moda.',
        'Salve o prompt útil com nome claro como lifestyle-cafe-founder-4x5-reference-face.',
      ],
      reviseItems: [
        'Pessoa falsa: reduza linguagem de perfeição e adicione cues documentais.',
        'Cena vazia: adicione dois objetos comuns e um detalhe de lugar.',
        'Mãos ruins: simplifique a ação primeiro.',
        'Crop errado: defina 4:5, 9:16 ou 3:4.',
        'Identidade importa: adicione referência antes de mais estilo.',
      ],
      faq: [
        ['O que faz um bom lifestyle image prompt?', 'Um sujeito real, cena comum, controles de câmera e checagem de mãos, pele, identidade e fundo.'],
        ['Posso copiar direto?', 'Sim. Troque variáveis, gere uma vez e depois revise a falha principal.'],
        ['Quando usar referência?', 'Quando rosto, produto, embalagem, roupa ou cor da marca precisam ficar reconhecíveis.'],
        ['Como deixar menos artificial?', 'Use lugares comuns, ações simples, pele natural, linguagem documental e menos palavras de perfeição.'],
        ['Qual proporção usar?', '4:5 para feed, 9:16 para vertical social e 3:4 para avatares.'],
        ['Devo gerar texto final?', 'Normalmente não. Deixe espaço limpo e adicione tipografia depois.'],
      ],
    },
    ja: {
      tldrItems: [
        'まず日常の場面を決めます。通勤、カフェ、キャンパス、ホームスタジオ、商品を使う瞬間などです。',
        '人物情報は絞ります。姿勢、表情、服装、肌の質感、手の位置だけで十分なことが多いです。',
        'リアルさは camera と light で制御します。35mm documentary、soft daylight、vertical creator post などを使います。',
        '顔、髪型、商品形状、ブランドカラーを保ちたい時は reference image を使い、何を固定するか明記します。',
        '最初の結果は、肌、指、手、背景、商品視認性、ポーズの不自然さから確認します。',
      ],
      whoParagraph:
        'このガイドは Instagram 画像、自然な portrait、avatar、brand lifestyle campaign、product-in-use scene に向いています。正確な文字、最終 logo、celebrity likeness には向きません。',
      whoItems: [
        '向いている用途：realistic people、social posts、avatars、creator content、product-in-use。',
        '避ける用途：正確な legal copy、final logo、celebrity likeness。',
        '最初の目標：完成品ではなく、修正しやすい controlled draft を作ること。',
      ],
      promptIntro:
        'Prompt block は Vogue AI にそのまま貼れるよう英語で残しています。角括弧の変数だけ変え、初回は構造を保ちます。',
      casesParagraph:
        'このキーワードは広いので、例は使い分けます。Nano Banana は quick variation、GPT Image 2 は reference control、Midjourney は editorial mood に向きます。',
      case1: 'ケース 1：自然な outdoor lifestyle portrait',
      case1Paragraph:
        'SNS に使いやすく、stock photo っぽさを避けたい時に使う構造です。',
      case2: 'ケース 2：identity を保つ reference-led avatar',
      case2Paragraph:
        'アップロードした selfie に似せたい場合は、reference が face identity、age、hair shape、expression を制御すると明記します。',
      workedRaw:
        '近所のカフェで作業する founder の Instagram-ready 画像が必要です。自然に見せつつ、product context、hands、4:5 crop を明確にします。',
      diagnosis:
        '手が崩れたら、まず動作を単純化します。カフェが作り物に見える時は普通の小物を加えます。identity が重要なら style adjective より先に reference image を使います。',
      revision:
        'person、hands、product visibility、crop を安定させてから mood を足します。Lifestyle realism は大げさな演出を減らすほど改善します。',
      modelParagraph:
        'Vogue AI では prompt skeleton を保ち、control、speed、editorial style のどれが重要かで model を選びます。',
      modelItems: [
        'GPT Image 2：identity、product、instruction control に強い。',
        'Nano Banana：quick social variations と image-to-image exploration に向く。',
        'Midjourney：editorial mood と fashion framing に向く。',
        '成功した prompt は lifestyle-cafe-founder-4x5-reference-face のように保存します。',
      ],
      reviseItems: [
        '人物が不自然：perfect 系の語を減らし documentary cues を入れる。',
        '場面が空っぽ：普通の小物を 2 つと場所の detail を追加する。',
        '手が崩れる：先に action を簡単にする。',
        'crop が合わない：4:5、9:16、3:4 と subject position を指定する。',
        'identity が重要：style を足す前に reference image を使う。',
      ],
      faq: [
        ['良い lifestyle image prompt とは？', 'real subject、ordinary scene、camera control、そして hands、skin、identity、clutter の failure check を含む prompt です。'],
        ['そのままコピーできますか？', 'できます。まず変数を置き換え、1 回生成してから失敗点だけ直します。'],
        ['reference image はいつ必要ですか？', '顔、商品形状、packaging、wardrobe、brand color を保ちたい時です。'],
        ['AI lifestyle photo を自然にするには？', '普通の場所、簡単な動作、natural skin texture、documentary camera cues、少ない perfection words を使います。'],
        ['aspect ratio は？', 'feed は 4:5、vertical social は 9:16、avatar は 3:4 が使いやすいです。'],
        ['最終テキストも生成すべきですか？', '通常は避けます。余白を残し、typography は design tool で入れる方が安全です。'],
      ],
    },
    ko: {
      tldrItems: [
        '먼저 실제 일상 장면을 정하세요. 출근길, 카페 테이블, 캠퍼스, 홈 스튜디오, 제품 사용 순간처럼 구체적이어야 합니다.',
        '인물 디테일은 자세, 표정, 옷, 피부 질감, 손 위치처럼 결과를 바꾸는 것만 씁니다.',
        '현실감은 camera 와 light 로 제어합니다. 35mm documentary, soft daylight, vertical creator post 등을 사용하세요.',
        '얼굴, 헤어, 제품 형태, 브랜드 컬러가 유지되어야 하면 reference image 를 넣고 무엇을 고정하는지 적습니다.',
        '첫 결과는 피부, 손가락, 손동작, 배경 과장, 제품 가시성, 연출된 포즈부터 확인합니다.',
      ],
      whoParagraph:
        '이 가이드는 Instagram 이미지, 자연스러운 portrait, avatar, brand lifestyle campaign, product-in-use scene 에 적합합니다. 정확한 문구, 최종 logo, celebrity likeness 에는 맞지 않습니다.',
      whoItems: [
        '적합: realistic people, social posts, avatars, creator content, product-in-use.',
        '부적합: exact legal copy, final logo, celebrity likeness.',
        '첫 목표: 완성본이 아니라 수정 가능한 controlled draft 를 얻는 것.',
      ],
      promptIntro:
        'Prompt block 은 Vogue AI에 바로 붙여 넣기 쉽도록 영어로 둡니다. 대괄호 변수만 바꾸고 첫 생성에서는 구조를 유지하세요.',
      casesParagraph:
        '키워드가 넓기 때문에 예시는 역할별로 나눕니다. Nano Banana 는 빠른 variation, GPT Image 2 는 reference control, Midjourney 는 editorial mood 에 적합합니다.',
      case1: '케이스 1: 자연스러운 outdoor lifestyle portrait',
      case1Paragraph:
        '이미지가 candid 하고 social-ready 하면서 stock photo 느낌을 줄여야 할 때 쓰는 구조입니다.',
      case2: '케이스 2: identity 를 지키는 reference-led avatar',
      case2Paragraph:
        '업로드한 selfie 와 닮아야 한다면 reference 가 face identity, age, hair shape, expression 을 제어한다고 명시하세요.',
      workedRaw:
        '동네 카페에서 작업하는 founder 이미지를 Instagram-ready 로 만들되, product context, hands, 4:5 crop 이 분명해야 합니다.',
      diagnosis:
        '손이 실패하면 먼저 action 을 단순화하세요. 카페가 연출처럼 보이면 평범한 소품을 더하세요. identity 가 중요하면 style adjective 보다 reference image 가 먼저입니다.',
      revision:
        'person, hands, product visibility, crop 을 안정화한 뒤 mood 를 추가하세요. Lifestyle realism 은 과한 연출을 줄일수록 좋아집니다.',
      modelParagraph:
        'Vogue AI에서는 prompt skeleton 을 유지하고 control, speed, editorial style 중 무엇이 중요한지에 따라 model 을 선택합니다.',
      modelItems: [
        'GPT Image 2: identity, product, instruction control 에 적합.',
        'Nano Banana: quick social variations 와 image-to-image exploration 에 적합.',
        'Midjourney: editorial mood 와 fashion framing 에 적합.',
        '성공한 prompt 는 lifestyle-cafe-founder-4x5-reference-face 처럼 저장하세요.',
      ],
      reviseItems: [
        '인물이 어색함: perfection language 를 줄이고 documentary cues 를 넣기.',
        '장면이 비어 있음: 평범한 소품 두 개와 장소 detail 추가.',
        '손 실패: action 을 먼저 단순화.',
        'crop 실패: 4:5, 9:16, 3:4 와 subject position 지정.',
        'identity 중요: style 을 더하기 전에 reference image 추가.',
      ],
      faq: [
        ['좋은 lifestyle image prompt 는 무엇인가요?', 'real subject, ordinary scene, camera control, 그리고 hands, skin, identity, clutter 에 대한 failure check 가 있는 prompt 입니다.'],
        ['그대로 복사해도 되나요?', '네. 변수를 먼저 바꾸고 한 번 생성한 뒤 실패한 부분만 수정하세요.'],
        ['reference image 는 언제 쓰나요?', '얼굴, 제품 형태, packaging, wardrobe, brand color 를 유지해야 할 때 사용합니다.'],
        ['AI lifestyle photo 를 덜 가짜처럼 만들려면?', '평범한 장소, 단순한 action, natural skin texture, documentary camera cues, 적은 perfection words 를 사용하세요.'],
        ['aspect ratio 는 무엇이 좋나요?', 'feed 는 4:5, vertical social 은 9:16, avatar 는 3:4 가 좋습니다.'],
        ['최종 텍스트도 생성해야 하나요?', '보통은 아닙니다. clean negative space 를 남기고 typography 는 design tool 에서 넣으세요.'],
      ],
    },
  }[locale];

  return [
    { type: 'paragraph', text: copy.intro },
    { type: 'heading', level: 2, text: copy.tldr },
    { type: 'list', items: body.tldrItems },
    { type: 'heading', level: 2, text: copy.who },
    { type: 'paragraph', text: body.whoParagraph },
    { type: 'list', items: body.whoItems },
    { type: 'heading', level: 2, text: copy.matrix },
    { type: 'table', headers: ['Use case', 'Prompt pattern', 'Reference image', 'Common failure'], rows: [['Instagram lifestyle post', 'Subject, action, place, vertical crop, creator light.', 'Optional unless identity matters.', 'Over-posed or cluttered.'], ['Professional avatar', 'Identity, expression, wardrobe, skin, 3:4 crop.', 'Recommended from selfie.', 'Identity drift or plastic skin.'], ['Brand campaign', 'Audience, product use, palette, commercial realism.', 'Recommended for product shape.', 'Product disappears or hands break.'], ['Editorial portrait', 'Person, real location, lens, posture, depth.', 'Useful for face or wardrobe.', 'Too cinematic or over-retouched.']] },
    { type: 'heading', level: 2, text: copy.anatomy },
    { type: 'table', headers: ['Part', 'What to write', 'Why'], rows: [['Subject', 'Person, product, wardrobe, activity.', 'Anchors the image.'], ['Scene', 'Cafe, campus, street, kitchen, studio corner.', 'Prevents generic output.'], ['Camera and light', '35mm, soft daylight, overcast, warm practicals.', 'Controls realism.'], ['Behavior', 'Walking, reading, reaching, unpacking.', 'Makes the frame lived-in.'], ['Guardrails', 'Aspect ratio, no text, preserve identity, no extra hands.', 'Targets common failures.']] },
    { type: 'heading', level: 2, text: copy.copyable },
    { type: 'paragraph', text: body.promptIntro },
    { type: 'image', src: promptLibraryImages.profile, alt: 'Vogue AI lifestyle avatar prompt example', caption: 'A GPT Image 2 profile-avatar example shows how identity can stay stable while scene and wardrobe change.' },
    { type: 'list', items: [...promptBlocks] },
    { type: 'heading', level: 2, text: copy.cases },
    { type: 'paragraph', text: body.casesParagraph },
    { type: 'heading', level: 3, text: body.case1 },
    { type: 'paragraph', text: body.case1Paragraph },
    { type: 'list', items: [`Prompt: ${casePrompts.portrait}`] },
    { type: 'heading', level: 3, text: body.case2 },
    { type: 'image', src: promptLibraryImages.reference, alt: 'Vogue AI reference-image lifestyle edit example', caption: 'A reference-image example demonstrates how to preserve identity while changing lifestyle treatment.' },
    { type: 'paragraph', text: body.case2Paragraph },
    { type: 'list', items: [`Prompt: ${casePrompts.avatar}`] },
    { type: 'heading', level: 2, text: copy.worked },
    { type: 'heading', level: 3, text: 'Raw request' },
    { type: 'paragraph', text: body.workedRaw },
    { type: 'heading', level: 3, text: 'Prompt version 1' },
    { type: 'list', items: ['Natural lifestyle image of a startup founder working in a small neighborhood cafe, relaxed posture, one hand near a laptop trackpad, notebook app visible as a clean but not overly detailed screen, warm morning window light, lived-in table details, 35mm documentary photography, shallow background blur, 4:5 crop, no text overlay, no extra fingers.'] },
    { type: 'heading', level: 3, text: 'First-result diagnosis' },
    { type: 'paragraph', text: body.diagnosis },
    { type: 'callout', title: 'Revision rule', text: body.revision },
    { type: 'heading', level: 2, text: copy.mistakes },
    { type: 'table', headers: ['Failure', 'Fix first', 'Avoid'], rows: [['Waxy skin', 'Natural texture and documentary light.', 'Flawless beauty language.'], ['Awkward hands', 'One simple hand action.', 'Complex gestures.'], ['Identity drift', 'Reference image and explicit controls.', 'Adjectives alone.'], ['Stock-photo look', 'Real place and ordinary props.', 'More mood words.'], ['Product hidden', 'Name product placement and visibility.', 'Letting model decide.']] },
    { type: 'heading', level: 2, text: copy.model },
    { type: 'paragraph', text: body.modelParagraph },
    { type: 'list', items: body.modelItems },
    { type: 'heading', level: 2, text: copy.revise },
    { type: 'list', items: body.reviseItems },
    { type: 'heading', level: 2, text: copy.faq },
    ...body.faq.flatMap(([question, answer]) => [
      { type: 'heading' as const, level: 3 as const, text: question },
      { type: 'paragraph' as const, text: answer },
    ]),
  ];
};

export const lifestyleImagePromptsAutoBlogPost: BlogPostSource = {
  slug: 'lifestyle-image-prompts',
  date: '2026-06-21',
  updatedAt: '2026-06-21',
  author: 'Vogue AI Team',
  image: promptLibraryImages.hero,
  imageAlt: 'Outdoor fashion lifestyle portrait prompt example from the Vogue AI prompt library',
  articleType: 'tutorial',
  modelTags: ['vogue-ai', 'gpt-image-2', 'nano-banana', 'midjourney'],
  readingMinutes: 10,
  localizations: {
    en: {
      title: 'Lifestyle image prompts for realistic people, scenes, and avatars',
      summary:
        'Copy lifestyle image prompts for natural portraits, Instagram scenes, reference-led avatars, and product-in-life visuals inside Vogue AI.',
      seoTitle: 'Lifestyle Image Prompts Workflow Guide',
      seoDescription:
        'Copy realistic lifestyle image prompts for portraits, Instagram posts, avatars, and product-in-life visuals, with reference-image rules and failure fixes.',
      content: enContent,
    },
    zh: {
      title: '适合真实人物、场景和头像的 Lifestyle Image Prompts',
      summary: '复制用于自然人像、Instagram 场景、参考图头像和产品生活方式图片的提示词结构。',
      seoTitle: 'Lifestyle Image Prompts 真实生活方式图片指南',
      seoDescription: '复制适合人像、Instagram、头像和产品生活场景的 lifestyle image prompts，学习参考图控制、手部修正、裁切比例、自然皮肤质感、产品可见性、模型选择、场景诊断、常见失败表、复用检查和第一轮真实感检查流程与案例复盘。',
      content: localizedContent('zh'),
    },
    fr: {
      title: 'Lifestyle image prompts pour personnes, scènes et avatars réalistes',
      summary: 'Copiez des prompts pour portraits naturels, scènes Instagram, avatars avec référence et visuels produit en contexte.',
      seoTitle: 'Guide de flux de travail lifestyle image prompts',
      seoDescription: 'Copiez des lifestyle image prompts réalistes pour portraits, posts Instagram, avatars et produits en contexte, avec règles de référence.',
      content: localizedContent('fr'),
    },
    ru: {
      title: 'Lifestyle image prompts для реалистичных людей, сцен и аватаров',
      summary: 'Копируйте prompts для естественных портретов, Instagram-сцен, reference-led avatars и product-in-life visuals.',
      seoTitle: 'Гайд по workflow для lifestyle image prompts',
      seoDescription: 'Копируйте realistic lifestyle image prompts для портретов, соцсетей, аватаров и product-in-life сцен с правилами reference image.',
      content: localizedContent('ru'),
    },
    pt: {
      title: 'Lifestyle image prompts para pessoas, cenas e avatares realistas',
      summary: 'Copie prompts para retratos naturais, cenas de Instagram, avatares com referência e produtos em uso.',
      seoTitle: 'Guia de fluxo de trabalho lifestyle image prompts',
      seoDescription: 'Copie lifestyle image prompts realistas para retratos, posts, avatares e produtos em contexto, com regras de referência.',
      content: localizedContent('pt'),
    },
    ja: {
      title: 'リアルな人物、シーン、アバター向け lifestyle image prompts',
      summary: '自然な portrait、Instagram scene、reference-led avatar、product-in-life visual に使える prompt 構造をまとめました。',
      seoTitle: 'Lifestyle Image Prompts 実践ワークフローガイド',
      seoDescription: 'portrait、Instagram、avatar、product-in-life visual 向けの lifestyle image prompts をコピーし、reference image、hands、crop、realism check を学べます。',
      content: localizedContent('ja'),
    },
    ko: {
      title: '현실적인 인물, 장면, 아바타를 위한 lifestyle image prompts',
      summary: '자연스러운 portrait, Instagram scene, reference-led avatar, product-in-life visual 에 쓸 prompt 구조입니다.',
      seoTitle: 'Lifestyle Image Prompts 실전 가이드',
      seoDescription: 'portrait, Instagram post, avatar, product-in-life visual 에 쓰는 realistic lifestyle image prompts 와 reference image 규칙을 배웁니다.',
      content: localizedContent('ko'),
    },
  },
};
