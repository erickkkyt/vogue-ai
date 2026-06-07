import type { BlogContentBlock, BlogPostSource } from '@/lib/blog-data';

const promptLibraryImages = {
  hero:
    'https://media.vogueai.net/blog/auto/prompt-studio-ghibli/4eadc2c9f85c-photorealistic-studio-ghibli-style-poster-totoro-catbus-1.jpg',
  pastoral:
    'https://media.vogueai.net/blog/auto/prompt-studio-ghibli/4eadc2c9f85c-photorealistic-studio-ghibli-style-poster-totoro-catbus-1.jpg',
  studio:
    'https://media.vogueai.net/blog/auto/prompt-studio-ghibli/e84b6978c235-studio-product-elemental-lifestyle-midjourney-v7-v8-1.jpg',
  portrait:
    'https://media.vogueai.net/prompt-libraries/awesome-ai-prompts/nano-banana/x-2061303657019162851/professional-high-end-studio-portrait-sharp-looking-1.jpg',
} as const;

const copyablePromptBlocks = [
  'Warm hand-painted animation scene of [subject] in a quiet rural town, watercolor background, soft afternoon light, wind moving through grass and laundry lines, expressive but original character design, rounded shapes, cozy everyday magic, gentle film-grain texture, 4:5 aspect ratio, no text, no logos.',
  'Pastoral fantasy landscape with [main object] beside a small hillside path, layered trees, painted clouds, warm green and ochre palette, lived-in details, soft atmospheric perspective, whimsical but not branded, original animation concept art, 16:9 aspect ratio.',
  'Cozy interior scene of [character or product] in a sunlit workshop, hand-painted wood textures, plants near the window, warm dust motes, gentle clutter, cinematic framing, soft edges, expressive mood, no text, no watermark.',
  'Reference-led portrait: use the uploaded photo only for face identity and pose. Reimagine the clothing, background, and lighting as a warm hand-painted animated portrait with watercolor texture, soft rim light, original character styling, calm hopeful mood, 3:4 crop.',
] as const;

const enContent: BlogContentBlock[] = [
  { type: 'paragraph', text: 'A good prompt studio ghibli workflow should not depend on typing a studio name and hoping the model guesses the rest. The safer, more controllable path is to describe the visible ingredients people usually mean: hand-painted backgrounds, soft light, pastoral spaces, expressive original characters, rounded shapes, and quiet everyday magic.' },
  { type: 'heading', level: 2, text: 'TL;DR: describe the ingredients, not only the reference name' },
  { type: 'list', items: ['Use "warm hand-painted animation" or "watercolor fantasy film still" as the style anchor.', 'Build the image from subject, setting, light, palette, texture, and output rule.', 'Keep characters original; do not ask for named characters, exact film scenes, or studio logos.', 'Add reference images only for identity, pose, product shape, or color palette, then say what the reference controls.', 'In Vogue AI, test GPT Image 2 for instruction control, Nano Banana for quick image-to-image variations, and Midjourney for mood exploration.'] },
  { type: 'heading', level: 2, text: 'Image plan for this guide' },
  { type: 'table', headers: ['Role', 'Section', 'First-party source', 'Why it matches'], rows: [
    ['Hero', 'Article cover', 'GPT Image 2 prompt-library poster', 'It is the clearest first-party match for the broad hand-painted animation intent.'],
    ['Prompt case', 'Pastoral town prompt', 'Midjourney elemental lifestyle prompt-library image', 'It shows how a stylized prompt can carry atmosphere through setting, light, and materials.'],
    ['Reference case', 'Portrait prompt', 'Nano Banana portrait prompt-library image', 'It supports the identity-preserving variation workflow without repeating the hero.'],
  ] },
  { type: 'heading', level: 2, text: 'Who this prompt guide is for' },
  { type: 'paragraph', text: 'This guide is for creators who want the warm animated look for posters, portraits, cozy product scenes, thumbnails, or concept art, but still need prompts they can edit. It is not for copying protected characters, recreating exact frames, or claiming official studio output.' },
  { type: 'list', items: ['Good fit: original characters, rural scenes, cozy interiors, soft product storytelling, and gentle fantasy landscapes.', 'Poor fit: exact movie still recreation, named characters, logo use, or final legal/commercial claims inside the generated image.', 'Best first result: an editable visual direction with a clear subject and mood, not a final asset that needs no review.'] },
  { type: 'heading', level: 2, text: 'Prompt anatomy' },
  { type: 'table', headers: ['Part', 'What to write', 'Why it matters'], rows: [
    ['Subject', 'The original character, product, animal, vehicle, room, or landscape.', 'The model needs a clear anchor before style words can help.'],
    ['Setting', 'Rural town, hillside path, sunlit kitchen, rainy street, floating garden, or workshop.', 'The look depends heavily on lived-in place and background detail.'],
    ['Light', 'Soft afternoon light, warm window light, overcast glow, sunset rim light, or misty morning.', 'Lighting creates the gentle mood users expect from the query.'],
    ['Palette', 'Sage green, cream, ochre, sky blue, warm wood, muted coral, and dusty yellow.', 'A palette gives control without relying on a brand name.'],
    ['Texture', 'Watercolor wash, hand-painted background, visible brush texture, soft edges, light grain.', 'Texture separates the result from glossy generic anime.'],
    ['Boundary', 'Original character design, no text, no logo, no exact film scene, no named characters.', 'The boundary keeps the prompt safer and easier to reuse.'],
  ] },
  { type: 'heading', level: 2, text: 'Copyable prompt blocks' },
  { type: 'paragraph', text: 'Copy one block, replace the bracketed variables, and keep the prompt in English for the generation step. The surrounding article can be localized, but prompt blocks stay copyable across Vogue AI locales.' },
  { type: 'image', src: promptLibraryImages.studio, alt: 'Stylized prompt-library image with warm studio lighting and material atmosphere', caption: 'This example fits the prompt section because the scene is controlled by setting, material, and soft light rather than by a decorative style label alone.' },
  { type: 'list', items: [...copyablePromptBlocks] },
  { type: 'heading', level: 2, text: 'Scenario matrix' },
  { type: 'table', headers: ['Scenario', 'Prompt focus', 'Use a reference when', 'First failure to fix'], rows: [
    ['Pastoral poster', 'Landscape, path, sky, tiny human scale, and warm color palette.', 'You need the same product, mascot, or place to remain recognizable.', 'Background feels empty or too glossy.'],
    ['Original character', 'Expression, silhouette, clothing texture, pose, and emotional tone.', 'Face identity or pose continuity matters.', 'Character looks like a known franchise figure.'],
    ['Cozy product scene', 'Object shape, room detail, window light, wood texture, and gentle clutter.', 'Product silhouette, package, or color must stay stable.', 'Product deforms or the room overwhelms the subject.'],
    ['Portrait variation', 'Face identity, soft animated texture, wardrobe, and background mood.', 'The uploaded face must remain recognizable.', 'Face changes, skin becomes plastic, or style becomes too sharp.'],
  ] },
  { type: 'heading', level: 2, text: 'Worked example: from raw request to controlled prompt' },
  { type: 'heading', level: 3, text: 'Raw request' },
  { type: 'paragraph', text: 'You need a cozy launch image for a handmade tea tin. The tin must stay recognizable, but the scene can become a warm animated kitchen with plants, wood shelves, and afternoon light.' },
  { type: 'heading', level: 3, text: 'Prompt version 1' },
  { type: 'list', items: ['Cozy hand-painted animation scene of a handmade tea tin on a sunlit wooden kitchen shelf, plants near the window, warm afternoon light, watercolor background, visible brush texture, sage green and cream palette, gentle everyday magic, product centered and readable, 4:5 aspect ratio, no text, no logo distortion, no watermark.'] },
  { type: 'heading', level: 3, text: 'First-result diagnosis' },
  { type: 'paragraph', text: 'If the room feels right but the tin changes shape, add the product image as a reference and say it controls silhouette, lid color, and front label placement. If the tin is correct but the scene is generic, tighten the setting, palette, and texture instead of adding more style names.' },
  { type: 'callout', title: 'Revision rule', text: 'Change one control at a time: reference handoff for identity, setting for atmosphere, palette for mood, and output rules for crop or text problems.' },
  { type: 'heading', level: 2, text: 'Mistake and fix table' },
  { type: 'table', headers: ['Failure', 'Fix first', 'Do not start with'], rows: [
    ['The image copies a known character or scene', 'Replace with original character traits, setting, and emotion.', 'More franchise or studio references.'],
    ['The result looks like generic glossy anime', 'Add watercolor background, soft edges, muted palette, and hand-painted texture.', 'Only increasing quality words.'],
    ['The product or face changes', 'Attach a reference and define exactly what it controls.', 'A full prompt rewrite.'],
    ['The composition is cluttered', 'Set crop, subject size, negative space, and background density.', 'Switching models before fixing layout.'],
    ['Generated text appears in the image', 'Ask for no text and reserve empty space for typography later.', 'Trying to force perfect lettering.'],
  ] },
  { type: 'heading', level: 2, text: 'Use the pattern in Vogue AI' },
  { type: 'image', src: promptLibraryImages.portrait, alt: 'Reference-led portrait prompt-library image for identity preserving variations', caption: 'This image belongs near the reference workflow because portrait prompts often fail when the model changes identity while changing style.' },
  { type: 'paragraph', text: 'In Vogue AI, start with the model family that matches the risk. Use GPT Image 2 when the prompt has many constraints, Nano Banana when you want fast reference-led variations, and Midjourney when the main job is mood, framing, and concept exploration.' },
  { type: 'list', items: ['Paste the English prompt block into the workspace and generate one controlled first pass.', 'If identity matters, upload the reference image and state whether it controls face, pose, product shape, or palette.', 'Keep the same prompt skeleton when switching models so you can compare behavior fairly.', 'Save the version that solved the job with a plain label such as warm-painted-product-scene-reference-shape.'] },
  { type: 'heading', level: 2, text: 'FAQ' },
  { type: 'heading', level: 3, text: 'What is a safe prompt studio ghibli alternative?' },
  { type: 'paragraph', text: 'Describe the visual ingredients: warm hand-painted animation, watercolor backgrounds, pastoral settings, soft light, original characters, muted palettes, and cozy everyday magic.' },
  { type: 'heading', level: 3, text: 'Can I use the phrase Studio Ghibli in a prompt?' },
  { type: 'paragraph', text: 'Many users do, but a more reusable production prompt should not depend on the name alone. Ingredient-based wording gives better control and avoids asking for exact protected characters or scenes.' },
  { type: 'heading', level: 3, text: 'Which Vogue AI model should I start with?' },
  { type: 'paragraph', text: 'Start with GPT Image 2 for instruction-heavy prompts, Nano Banana for quick reference-led variations, and Midjourney for stylized mood exploration.' },
  { type: 'heading', level: 3, text: 'Should prompt blocks stay in English?' },
  { type: 'paragraph', text: 'Yes. Keep the generation prompt in English so it remains easy to copy across locales, then localize the explanation, checklist, and FAQ around it.' },
  { type: 'heading', level: 3, text: 'How do I avoid copying a famous character?' },
  { type: 'paragraph', text: 'Write original character traits: age range, clothing, pose, expression, role, and emotion. Avoid names, exact costumes, exact creature designs, and movie-specific scenes.' },
  { type: 'heading', level: 3, text: 'What should I fix after the first result?' },
  { type: 'paragraph', text: 'Fix the largest failure first. Use reference handoff for identity, crop rules for layout, palette for mood, and texture words when the image looks too glossy.' },
];

const localizedCommon = (locale: 'zh' | 'fr' | 'ru' | 'pt' | 'ja' | 'ko'): BlogContentBlock[] => {
  const copy = {
    zh: ['用视觉成分写提示词，而不是只写风格名', '这篇指南把 prompt studio ghibli 拆成更可控的提示词结构：手绘背景、柔和光线、田园空间、原创角色、圆润造型和日常魔法感。', '适合谁', '适合原创角色、田园海报、温暖产品场景、人像变化和概念图；不适合复刻电影画面、角色或 Logo。', '提示词结构', '复制提示词块', '场景矩阵', '完整示例', '错误和修法', '在 Vogue AI 中使用', '常见问题'],
    fr: ["Décrire les ingrédients visuels, pas seulement un nom de style", "Ce guide transforme prompt studio ghibli en structure contrôlable : fonds peints, lumière douce, lieux pastoraux, personnages originaux, formes rondes et magie quotidienne.", 'Pour qui', "Pour personnages originaux, posters pastoraux, scènes produit chaleureuses, portraits et concept art ; pas pour recréer des plans, personnages ou logos.", 'Anatomie du prompt', 'Blocs de prompts à copier', 'Matrice de scénarios', 'Exemple complet', 'Erreurs et corrections', 'Utiliser dans Vogue AI', 'FAQ'],
    ru: ['Описывайте визуальные ингредиенты, а не только название стиля', 'Гайд разбирает prompt studio ghibli на контролируемые части: рисованный фон, мягкий свет, пасторальное место, оригинальные персонажи, округлые формы и тихая бытовая магия.', 'Для кого', 'Подходит для оригинальных персонажей, пасторальных постеров, теплых продуктовых сцен, портретов и concept art; не для копирования кадров, героев или логотипов.', 'Анатомия prompt', 'Блоки prompt для копирования', 'Матрица сценариев', 'Полный пример', 'Ошибки и исправления', 'Как использовать в Vogue AI', 'FAQ'],
    pt: ['Descreva os ingredientes visuais, não só o nome do estilo', 'Este guia transforma prompt studio ghibli em uma estrutura controlável: fundos pintados, luz suave, espaços pastorais, personagens originais, formas arredondadas e magia cotidiana.', 'Para quem', 'Serve para personagens originais, pôsteres pastorais, cenas de produto acolhedoras, retratos e concept art; não para recriar cenas, personagens ou logos.', 'Anatomia do prompt', 'Blocos de prompt para copiar', 'Matriz de cenários', 'Exemplo completo', 'Erros e correções', 'Usar no Vogue AI', 'FAQ'],
    ja: ['スタイル名だけでなく、見える要素を指定する', 'このガイドは prompt studio ghibli を、手描き背景、柔らかい光、田園的な場所、オリジナルキャラクター、丸い形、日常の小さな魔法に分解します。', '向いている用途', 'オリジナルキャラクター、田園ポスター、温かい商品シーン、ポートレート、コンセプトアート向けです。映画の場面、キャラクター、ロゴの再現には向きません。', 'Prompt の構造', 'コピー用 prompt ブロック', 'シナリオ表', '実例', '失敗と修正', 'Vogue AI で使う', 'FAQ'],
    ko: ['스타일 이름만 쓰지 말고 보이는 요소를 설명하세요', '이 가이드는 prompt studio ghibli를 손그림 배경, 부드러운 빛, 목가적 장소, 오리지널 캐릭터, 둥근 형태, 일상의 작은 마법으로 나눕니다.', '어울리는 용도', '오리지널 캐릭터, 목가적 포스터, 따뜻한 제품 장면, portrait, concept art에 적합하며 영화 장면, 캐릭터, logo 복제에는 맞지 않습니다.', 'Prompt 구조', '복사용 prompt block', '시나리오 매트릭스', '작업 예시', '실패와 수정', 'Vogue AI에서 사용하기', 'FAQ'],
  }[locale];

  return [
    { type: 'paragraph', text: copy[1] },
    { type: 'heading', level: 2, text: copy[0] },
    { type: 'list', items: ['Subject + setting + light + palette + texture + output rule.', 'Original character design; no named characters, no exact film scenes, no logos.', 'Use references only for identity, pose, product shape, or palette.', 'Test GPT Image 2, Nano Banana, and Midjourney with the same prompt skeleton.'] },
    { type: 'heading', level: 2, text: copy[2] },
    { type: 'paragraph', text: copy[3] },
    { type: 'heading', level: 2, text: copy[4] },
    { type: 'table', headers: ['Part', 'Instruction', 'Purpose'], rows: [['Subject', 'Original person, product, room, or landscape.', 'Anchor the scene.'], ['Setting', 'Rural town, workshop, kitchen, hillside, rainy street.', 'Create atmosphere.'], ['Light', 'Soft afternoon, warm window, misty morning.', 'Set mood.'], ['Texture', 'Watercolor, brush texture, soft edges.', 'Avoid glossy generic anime.']] },
    { type: 'heading', level: 2, text: copy[5] },
    { type: 'image', src: promptLibraryImages.studio, alt: 'Warm stylized prompt-library example', caption: 'A first-party prompt-library image that matches the section through setting, material, and soft light.' },
    { type: 'list', items: [...copyablePromptBlocks] },
    { type: 'heading', level: 2, text: copy[6] },
    { type: 'table', headers: ['Scenario', 'Focus', 'Fix first'], rows: [['Pastoral poster', 'Landscape, path, sky, small human scale.', 'Empty or glossy background.'], ['Original character', 'Expression, silhouette, clothes, emotion.', 'Known-character drift.'], ['Product scene', 'Object shape, room detail, window light.', 'Product deformation.'], ['Portrait variation', 'Identity, wardrobe, soft texture.', 'Face drift.']] },
    { type: 'heading', level: 2, text: copy[7] },
    { type: 'heading', level: 3, text: 'Raw brief' },
    { type: 'paragraph', text: 'Create a cozy hand-painted launch image for a handmade tea tin in a warm kitchen, while preserving the product silhouette.' },
    { type: 'heading', level: 3, text: 'Prompt version 1' },
    { type: 'list', items: ['Cozy hand-painted animation scene of a handmade tea tin on a sunlit wooden kitchen shelf, plants near the window, warm afternoon light, watercolor background, visible brush texture, sage green and cream palette, gentle everyday magic, product centered and readable, 4:5 aspect ratio, no text, no logo distortion, no watermark.'] },
    { type: 'heading', level: 2, text: copy[8] },
    { type: 'table', headers: ['Failure', 'Fix first', 'Avoid'], rows: [['Known character drift', 'Original traits and new setting.', 'More franchise references.'], ['Glossy anime look', 'Watercolor, muted palette, soft edges.', 'Quality words only.'], ['Identity changes', 'Reference handoff.', 'Full rewrite.'], ['Clutter', 'Crop and negative space.', 'Switching models first.'], ['Text artifacts', 'No text and empty space.', 'Forcing perfect lettering.']] },
    { type: 'heading', level: 2, text: copy[9] },
    { type: 'image', src: promptLibraryImages.portrait, alt: 'Reference-led portrait prompt-library example', caption: 'A first-party portrait example for identity-preserving variations.' },
    { type: 'list', items: ['Use GPT Image 2 for constrained prompts.', 'Use Nano Banana for fast reference-led variations.', 'Use Midjourney for mood and concept exploration.', 'Save the working prompt version before changing variables.'] },
    { type: 'heading', level: 2, text: 'FAQ' },
    ...['Safe alternative?', 'Can I use the style name?', 'Which model first?', 'Should prompts stay English?', 'How avoid famous characters?', 'What fix after first result?'].flatMap((q) => [{ type: 'heading' as const, level: 3 as const, text: q }, { type: 'paragraph' as const, text: 'Use ingredient-based wording, original subjects, explicit references, and one focused revision at a time.' }]),
  ];
};

export const promptStudioGhibliAutoBlogPost: BlogPostSource = {
  slug: 'prompt-studio-ghibli',
  date: '2026-06-06',
  updatedAt: '2026-06-06',
  author: 'Vogue AI Team',
  image: promptLibraryImages.hero,
  imageAlt: 'Hand-painted animation style prompt-library poster example',
  articleType: 'tutorial',
  modelTags: ['vogue-ai', 'gpt-image-2', 'nano-banana', 'midjourney'],
  readingMinutes: 10,
  localizations: {
    en: {
      title: 'Prompt Studio Ghibli style images without losing control',
      summary:
        'A practical prompt studio ghibli guide that turns the look into safer reusable ingredients, copyable prompts, and Vogue AI model workflows.',
      seoTitle: 'Prompt Studio Ghibli Style Guide for AI Images',
      seoDescription:
        'Copy safer Studio Ghibli style prompt patterns using hand-painted backgrounds, soft light, original characters, reference images, and Vogue AI model workflows.',
      content: enContent,
    },
    zh: { title: 'Prompt Studio Ghibli 风格图片的可控写法', summary: '把 Studio Ghibli 风格提示词拆成手绘背景、柔和光线、原创角色和 Vogue AI 工作流。', seoTitle: 'Prompt Studio Ghibli 风格提示词指南', seoDescription: '学习更安全可控的 Studio Ghibli 风格提示词写法，包含英文可复制 prompt、参考图和 Vogue AI 模型选择。', content: localizedCommon('zh') },
    fr: { title: 'Prompt Studio Ghibli : obtenir le style sans perdre le contrôle', summary: 'Un guide pour transformer le style Studio Ghibli en ingrédients visuels, prompts copiables et workflow Vogue AI.', seoTitle: 'Guide Prompt Studio Ghibli pour images IA', seoDescription: 'Copiez des prompts Studio Ghibli plus sûrs avec fonds peints, lumière douce, personnages originaux et workflow Vogue AI.', content: localizedCommon('fr') },
    ru: { title: 'Prompt Studio Ghibli: как сохранить контроль над стилем', summary: 'Практический гайд по разбору Studio Ghibli style на визуальные ингредиенты, prompts и workflow Vogue AI.', seoTitle: 'Гайд Prompt Studio Ghibli для AI-изображений', seoDescription: 'Копируйте более безопасные Studio Ghibli prompts с рисованными фонами, мягким светом, оригинальными героями и Vogue AI workflow.', content: localizedCommon('ru') },
    pt: { title: 'Prompt Studio Ghibli com controle de resultado', summary: 'Um guia para transformar o estilo Studio Ghibli em ingredientes visuais, prompts copiáveis e fluxo Vogue AI.', seoTitle: 'Guia Prompt Studio Ghibli para imagens IA', seoDescription: 'Copie prompts Studio Ghibli mais seguros com fundos pintados, luz suave, personagens originais e fluxo Vogue AI.', content: localizedCommon('pt') },
    ja: { title: 'Prompt Studio Ghibli 風の画像を制御して作る', summary: 'Studio Ghibli 風の見た目を、手描き背景、柔らかい光、オリジナルキャラクター、Vogue AI の手順に分解します。', seoTitle: 'Prompt Studio Ghibli AI画像ガイド', seoDescription: '手描き背景、柔らかい光、オリジナルキャラクター、参考画像を使った Studio Ghibli 風 prompt の作り方。', content: localizedCommon('ja') },
    ko: { title: 'Prompt Studio Ghibli 스타일 이미지를 제어해서 만들기', summary: 'Studio Ghibli 스타일을 손그림 배경, 부드러운 빛, 오리지널 캐릭터, Vogue AI workflow로 나누는 가이드입니다.', seoTitle: 'Prompt Studio Ghibli AI 이미지 가이드', seoDescription: '손그림 배경, 부드러운 빛, 오리지널 캐릭터, 레퍼런스를 활용한 Studio Ghibli 스타일 prompt 작성법.', content: localizedCommon('ko') },
  },
};
