import type { BlogContentBlock, BlogPostSource } from '@/lib/blog-data';

const promptLibraryImages = {
  hero:
    'https://media.vogueai.net/blog/auto/retro-image-prompts/00a6b484b29a-cartoon-illustration-retro-style-depicts-blue-turtle-1.jpg',
  vhs:
    'https://media.vogueai.net/blog/auto/retro-image-prompts/77dc2da0fe36-glitchced-eyes-vhs-style-that-retro-glitch-1.jpg',
  brandBoard:
    'https://media.vogueai.net/prompt-libraries/awesome-gptimage2-prompts/vogueai-20260611-brand-visual-design-guide-board-ai-prompt/brand-visual-design-guide-board-ai-prompt-luna-coffee-specialty-coffee-cream-espresso-blac-01.png',
} as const;

const promptBlocks = [
  '1970s product poster: Create a retro product poster for [product], warm film grain, faded cream paper, hand-cut collage edges, bold geometric background, limited palette of burnt orange, teal, and ivory, centered product hero, soft halftone shadow, no readable text, 4:5 aspect ratio.',
  '1980s VHS portrait: Editorial portrait of [subject], neon rim light, analog VHS scanlines, soft lens bloom, magenta and cyan color cast, black studio background, confident expression, sharp eyes, 3:4 crop, no extra hands, no text.',
  '1990s magazine ad: Lifestyle campaign image for [brand or object], direct flash photography, glossy magazine texture, casual pose, playful props, saturated primary colors, visible paper grain, headline-safe empty space, 9:16 aspect ratio, keep all text areas blank.',
  'Retro brand board: Design a vintage brand mood board for [brand], arranged swatches, packaging studies, logo-free labels, aged paper, cream and espresso base with one accent color, tidy grid, realistic photographed board, 16:9 aspect ratio, no readable copy.',
] as const;

const enContent: BlogContentBlock[] = [
  { type: 'paragraph', text: 'Retro image prompts work when the era is specific enough to control color, texture, camera behavior, and layout. Instead of asking for a vague vintage look, describe the decade, medium, palette, surface wear, lens effect, and production job you want the image to perform.' },
  { type: 'heading', level: 2, text: 'TL;DR: make the decade do real work' },
  { type: 'list', items: ['Pick one era first: 1960s print, 1970s poster, 1980s VHS, 1990s magazine flash, or early web nostalgia.', 'Name the physical medium: risograph poster, faded paper ad, instant photo, VHS still, catalog scan, or brand board.', 'Control color with a short palette instead of saying vintage, retro, or aesthetic repeatedly.', 'Add one texture cue and one camera cue, then stop before the prompt becomes muddy.', 'Use Vogue AI prompt-library examples as visual anchors when adapting the structure.'] },
  { type: 'heading', level: 2, text: 'Image plan for this guide' },
  { type: 'table', headers: ['Role', 'Source', 'Why it matches'], rows: [['Hero', 'Nano Banana retro turtle illustration', 'It signals playful retro illustration without duplicating a body example.'], ['VHS case', 'Midjourney glitch eyes image', 'It shows analog scanlines, glitch texture, and neon mood close to the 1980s prompt section.'], ['Brand board case', 'GPT Image 2 Luna Coffee board', 'It grounds the brand-board prompt in a first-party layout with swatches, packaging, and vintage color.']] },
  { type: 'heading', level: 2, text: 'Retro prompt formula' },
  { type: 'table', headers: ['Part', 'What to write', 'Example'], rows: [['Era', 'One decade or design movement.', '1970s consumer poster.'], ['Medium', 'The object the image should resemble.', 'Faded magazine ad, VHS still, catalog scan.'], ['Palette', 'Three to five colors.', 'Burnt orange, teal, ivory, espresso.'], ['Texture', 'Print, film, paper, or screen artifact.', 'Halftone dots, dust, grain, scanlines.'], ['Job', 'How the image will be used.', 'Product hero, portrait, poster, mood board.']] },
  { type: 'heading', level: 2, text: 'Copyable retro image prompts' },
  { type: 'paragraph', text: 'Copy one block, replace the bracketed variables, and keep the prompt in English for the first generation. The structure is deliberately plain so you can revise one control at a time.' },
  { type: 'list', items: [...promptBlocks] },
  { type: 'heading', level: 2, text: 'Case 1: 1980s VHS portrait and glitch texture' },
  { type: 'image', src: promptLibraryImages.vhs, alt: 'VHS-style retro glitch prompt example from the Vogue AI prompt library', caption: 'Use this image near VHS and glitch prompts because the visible scanline treatment, neon contrast, and analog distortion show the style controls the prompt must name.' },
  { type: 'paragraph', text: 'The common mistake with VHS prompts is overloading the image with neon words while forgetting camera and signal artifacts. Keep the subject simple, then add scanlines, chromatic bleed, timecode-safe empty space, and a clear crop.' },
  { type: 'heading', level: 2, text: 'Case 2: retro brand board with product discipline' },
  { type: 'image', src: promptLibraryImages.brandBoard, alt: 'Retro coffee brand board prompt example from the Vogue AI prompt library', caption: 'This board is useful for brand and product prompts because it combines vintage color, packaging studies, swatches, and a controlled grid rather than a decorative retro filter.' },
  { type: 'paragraph', text: 'For product and brand work, the retro style should not hide the object. Use a board, catalog, or poster format when you need the model to preserve layout discipline and leave room for later typography.' },
  { type: 'heading', level: 2, text: 'Scenario matrix' },
  { type: 'table', headers: ['Use case', 'Best retro pattern', 'Reference image?', 'First failure to fix'], rows: [['Product poster', '1970s print poster with halftone texture and limited palette.', 'Use one when product shape or packaging matters.', 'Wrong silhouette or no headline-safe area.'], ['Portrait', '1980s VHS still or 1990s flash magazine portrait.', 'Use one when identity, hairstyle, or outfit must stay recognizable.', 'Waxy face, extra hands, or texture covering the eyes.'], ['Brand mood board', 'Vintage catalog board with swatches and packaging studies.', 'Useful for logo placement, palette, and package proportions.', 'Unreadable fake text or messy grid.'], ['Social graphic', 'Retro collage or zine layout with empty text zones.', 'Optional unless brand palette must match.', 'Too much clutter for the channel crop.']] },
  { type: 'heading', level: 2, text: 'Worked example: turn a vague vintage request into a usable prompt' },
  { type: 'heading', level: 3, text: 'Raw request' },
  { type: 'paragraph', text: 'Make a retro image for a cold brew coffee launch. It should feel nostalgic, but the can must still look premium and the frame needs room for a headline.' },
  { type: 'heading', level: 3, text: 'Prompt version 1' },
  { type: 'list', items: ['1970s premium cold brew poster, centered aluminum can on a faded cream paper backdrop, burnt orange and deep teal geometric sunburst, subtle halftone dots, soft catalog lighting, crisp condensation on the can, clean headline-safe space above, premium but nostalgic mood, 4:5 aspect ratio, no readable text, no watermark.'] },
  { type: 'heading', level: 3, text: 'First-result diagnosis' },
  { type: 'paragraph', text: 'If the can shape changes, add a reference image and say it controls silhouette, label position, and color. If the can is correct but the image feels generic, tighten the decade, medium, and palette before adding more adjectives.' },
  { type: 'callout', title: 'Revision rule', text: 'Fix identity first, layout second, and retro surface treatment third. Grain cannot rescue a weak composition.' },
  { type: 'heading', level: 2, text: 'Mistake and fix table' },
  { type: 'table', headers: ['Mistake', 'Fix first', 'Avoid'], rows: [['Vague vintage style', 'Name decade, medium, palette, and texture.', 'Stacking retro, nostalgic, aesthetic, old-school together.'], ['Subject disappears under effects', 'Reduce texture strength and restate the subject as the hero.', 'Adding more film damage.'], ['Fake unreadable text', 'Ask for blank label zones or headline-safe space.', 'Requesting final ad copy inside the image.'], ['Wrong product or face identity', 'Add a reference image with explicit handoff rules.', 'Changing the whole style first.'], ['Flat retro filter', 'Add a physical medium such as catalog scan or risograph poster.', 'Only changing color temperature.']] },
  { type: 'heading', level: 2, text: 'Use Vogue AI without overfitting the style' },
  { type: 'list', items: ['Use GPT Image 2 when the prompt needs layout control, product discipline, or a brand-board structure.', 'Use Nano Banana when you want quick playful variations or image-to-image retro treatments.', 'Use Midjourney when the priority is mood-heavy editorial styling, VHS texture, or surreal nostalgia.', 'Save the prompt that fixed the job, then duplicate it for the next product, portrait, or poster.'] },
  { type: 'heading', level: 2, text: 'Era cheat sheet for stronger retro prompts' },
  { type: 'table', headers: ['Era', 'Best visual job', 'Controls to name', 'Avoid'], rows: [['1960s print', 'Editorial poster, travel card, playful illustration.', 'Offset print, muted primaries, paper grain, simple shapes.', 'Mixing it with VHS, chrome, and 1990s flash in the same prompt.'], ['1970s poster', 'Product launch, music poster, warm campaign visual.', 'Burnt orange, teal, ivory, halftone, geometric layout.', 'Letting the product disappear behind grain and sunbursts.'], ['1980s VHS', 'Portrait, album art, glitch frame, night mood.', 'Scanlines, chromatic bleed, neon rim light, black background.', 'Covering the subject eyes with distortion.'], ['1990s magazine', 'Fashion, lifestyle ad, direct-flash portrait.', 'Glossy paper, direct flash, saturated colors, casual props.', 'Asking the model to spell final ad copy.'], ['Early web nostalgia', 'Social graphic, icon collage, playful creator post.', 'Pixel edges, low-fi UI frame, sticker layout, empty text zones.', 'Overcrowding the crop until the subject has no focal point.']] },
  { type: 'heading', level: 2, text: 'Reference image handoff for retro work' },
  { type: 'paragraph', text: 'A retro style can easily overpower the subject. When product shape, face identity, packaging color, or brand layout matters, use a reference image and explain the handoff instead of hoping the model preserves it automatically.' },
  { type: 'list', items: ['Product reference: say the reference controls silhouette, label position, package color, and hero angle.', 'Portrait reference: say the reference controls face identity, hairstyle, expression, and age while the decade treatment may change.', 'Brand-board reference: say the reference controls palette family, grid discipline, package proportions, and blank label zones.', 'After the first generation, inspect identity first, layout second, and texture third; retro surface treatment should never hide the commercial job.'] },
  { type: 'heading', level: 2, text: 'FAQ' },
  { type: 'heading', level: 3, text: 'What is a retro image prompt?' },
  { type: 'paragraph', text: 'It is a prompt that names an older visual system clearly enough for the model to reproduce its era, medium, palette, texture, camera behavior, and layout.' },
  { type: 'heading', level: 3, text: 'Should I write vintage or retro in every prompt?' },
  { type: 'paragraph', text: 'Use those words once if helpful, then spend the rest of the prompt on concrete controls such as 1970s poster, halftone dots, faded paper, and limited palette.' },
  { type: 'heading', level: 3, text: 'Can retro prompts work for product images?' },
  { type: 'paragraph', text: 'Yes, but product identity must stay above texture. Use a reference image when shape, packaging, label position, or logo placement matters.' },
  { type: 'heading', level: 3, text: 'Why do retro AI images become messy?' },
  { type: 'paragraph', text: 'Most messy results combine too many eras, textures, and layout ideas. Choose one decade, one medium, one palette, and one production job.' },
  { type: 'heading', level: 3, text: 'Which model should I start with in Vogue AI?' },
  { type: 'paragraph', text: 'Start from the risk: GPT Image 2 for controlled layout, Nano Banana for fast variations, and Midjourney for stylized mood exploration.' },
  { type: 'heading', level: 3, text: 'Can I ask the model to add retro text?' },
  { type: 'paragraph', text: 'For final marketing copy, leave text areas blank and add typography later. Generated retro lettering may be useful as texture, but it should not carry the final message.' },
];

const makeLocalizedContent = (locale: 'zh' | 'fr' | 'ru' | 'pt' | 'ja' | 'ko'): BlogContentBlock[] => {
  const copy = {
    zh: {
      intro: '复古图片提示词的重点不是反复写 vintage，而是把年代、媒介、色彩、纹理、镜头和用途说清楚。这样生成结果才像一个可执行的视觉 brief。',
      tldr: 'TL;DR：让年代承担具体控制',
      imagePlan: '本文图片计划',
      formula: '复古提示词公式',
      prompts: '可复制的 retro image prompts',
      case1: '案例 1：1980s VHS 人像与 glitch 纹理',
      case2: '案例 2：带产品纪律的复古品牌板',
      matrix: '场景矩阵',
      worked: '完整示例：把模糊 vintage 需求变成可用提示词',
      mistakes: '错误与修正表',
      vogue: '在 Vogue AI 中使用时不要过度套风格',
      faq: 'FAQ',
    },
    fr: {
      intro: "Un prompt rétro efficace ne répète pas vintage. Il précise l'époque, le support, la palette, la texture, la caméra et l'usage de l'image.",
      tldr: "TL;DR : donnez un rôle concret à l'époque",
      imagePlan: 'Plan des images',
      formula: 'Formule de prompt rétro',
      prompts: 'Retro image prompts copiables',
      case1: 'Cas 1 : portrait VHS années 1980 et texture glitch',
      case2: 'Cas 2 : brand board rétro avec discipline produit',
      matrix: 'Matrice de scénarios',
      worked: 'Exemple complet : transformer une demande vintage vague',
      mistakes: 'Table erreurs et corrections',
      vogue: 'Utiliser Vogue AI sans figer le style',
      faq: 'FAQ',
    },
    ru: {
      intro: 'Хороший retro prompt не повторяет vintage, а задает эпоху, носитель, палитру, текстуру, камеру и задачу изображения.',
      tldr: 'TL;DR: пусть эпоха управляет результатом',
      imagePlan: 'План изображений',
      formula: 'Формула retro prompt',
      prompts: 'Копируемые retro image prompts',
      case1: 'Кейс 1: VHS-портрет 1980-х и glitch-текстура',
      case2: 'Кейс 2: ретро brand board с продуктовой дисциплиной',
      matrix: 'Матрица сценариев',
      worked: 'Пример: из размытого vintage запроса в рабочий prompt',
      mistakes: 'Таблица ошибок и исправлений',
      vogue: 'Как использовать Vogue AI без переусложнения стиля',
      faq: 'FAQ',
    },
    pt: {
      intro: 'Um bom prompt retrô não repete vintage; ele define época, mídia, paleta, textura, câmera e objetivo de produção.',
      tldr: 'TL;DR: faça a década controlar o resultado',
      imagePlan: 'Plano de imagens',
      formula: 'Fórmula de prompt retrô',
      prompts: 'Retro image prompts copiáveis',
      case1: 'Caso 1: retrato VHS dos anos 1980 e textura glitch',
      case2: 'Caso 2: brand board retrô com disciplina de produto',
      matrix: 'Matriz de cenários',
      worked: 'Exemplo completo: de pedido vintage vago a prompt utilizável',
      mistakes: 'Tabela de erros e correções',
      vogue: 'Usar Vogue AI sem exagerar no estilo',
      faq: 'FAQ',
    },
    ja: {
      intro: 'retro image prompt は vintage と繰り返すより、年代、媒体、色、質感、カメラ、用途を明確にするほど安定します。',
      tldr: 'TL;DR：年代に具体的な役割を持たせる',
      imagePlan: '画像計画',
      formula: 'レトロプロンプトの公式',
      prompts: 'コピー用 retro image prompts',
      case1: 'ケース 1：1980s VHS portrait と glitch texture',
      case2: 'ケース 2：商品設計に強い retro brand board',
      matrix: 'シナリオ表',
      worked: '実例：曖昧な vintage 依頼を使える prompt にする',
      mistakes: '失敗と修正表',
      vogue: 'Vogue AI でスタイルを固定しすぎない',
      faq: 'FAQ',
    },
    ko: {
      intro: 'retro image prompt 는 vintage 를 반복하는 것보다 era, medium, palette, texture, camera, production job 을 분명히 할 때 안정적입니다.',
      tldr: 'TL;DR: decade 가 실제로 제어하게 하세요',
      imagePlan: '이미지 계획',
      formula: '레트로 프롬프트 공식',
      prompts: '복사해서 쓰는 retro image prompts',
      case1: '케이스 1: 1980s VHS portrait 와 glitch texture',
      case2: '케이스 2: 제품 질서를 지키는 retro brand board',
      matrix: '시나리오 매트릭스',
      worked: '예시: 모호한 vintage 요청을 usable prompt 로 바꾸기',
      mistakes: '실수와 수정 표',
      vogue: 'Vogue AI 에서 스타일을 과하게 고정하지 않기',
      faq: 'FAQ',
    },
  }[locale];
  const body = {
    zh: {
      tldrItems: [
        '先选一个年代：1960s print、1970s poster、1980s VHS、1990s magazine flash 或 early web nostalgia。',
        '再指定媒介：risograph poster、faded paper ad、instant photo、VHS still、catalog scan 或 brand board。',
        '用 3-5 个颜色控制画面，而不是反复写 vintage、retro、nostalgic。',
        '只加一个纹理 cue 和一个相机 cue，避免年代、材质和镜头信号互相打架。',
        '第一轮先检查主体、布局和可读空白区，再调整 grain、scanlines 或 halftone。',
      ],
      imagePlanRows: [
        ['Hero', 'Nano Banana retro turtle illustration', '用轻松插画感概括 retro 主题，不重复正文案例。'],
        ['VHS case', 'Midjourney glitch eyes image', '展示 scanlines、analog distortion 和 neon mood。'],
        ['Brand board case', 'GPT Image 2 Luna Coffee board', '用 swatches、packaging 和 vintage color 证明 layout discipline。'],
      ],
      formulaRows: [
        ['年代', '一个 decade 或设计运动。', '1970s consumer poster。'],
        ['媒介', '画面应该像什么实体物。', 'Faded magazine ad、VHS still、catalog scan。'],
        ['色彩', '三到五个颜色。', 'Burnt orange、teal、ivory、espresso。'],
        ['纹理', '印刷、胶片、纸张或屏幕痕迹。', 'Halftone dots、dust、grain、scanlines。'],
        ['用途', '图片要完成的生产任务。', 'Product hero、portrait、poster、mood board。'],
      ],
      promptIntro:
        '下面的 prompt block 保留英文，方便直接粘贴到 Vogue AI。替换方括号变量后，第一轮先保持结构不变。',
      case1Caption:
        '这个 VHS 示例适合放在 glitch 部分，因为 scanline、neon contrast 和 analog distortion 都是 prompt 必须写出的控制项。',
      case1Paragraph:
        'VHS prompt 的常见错误是堆 neon 和 cyber 词，却忘了 camera signal。主体要简单，然后明确 scanlines、chromatic bleed、empty space 和 crop。',
      case2Caption:
        'Brand board 示例说明 retro 不是滤镜，而是 palette、package study、grid discipline 和 blank label zones 的组合。',
      case2Paragraph:
        '产品和品牌任务里，复古风格不能盖住对象。需要保留形状、包装、色彩和后续排版空间时，优先用 board、catalog 或 poster 格式。',
      matrixRows: [
        ['Product poster', '1970s print poster，limited palette，halftone texture。', '产品形状或包装重要时使用。', 'Silhouette 错误或没有 headline-safe area。'],
        ['Portrait', '1980s VHS still 或 1990s flash magazine portrait。', '身份、发型、服装必须稳定时使用。', '蜡感脸、额外手指或纹理盖住眼睛。'],
        ['Brand mood board', 'Vintage catalog board，swatches，packaging studies。', '需要匹配 palette、package proportions 和 label zones 时使用。', '假文字太多或网格混乱。'],
        ['Social graphic', 'Retro collage 或 zine layout，保留空白文字区。', '品牌色要一致时可用。', '裁切太拥挤，主体没有焦点。'],
      ],
      workedRaw:
        '为冷萃咖啡发布做一张 retro image。它要有怀旧感，但罐身仍然 premium，并且画面上方需要留 headline 空间。',
      diagnosis:
        '如果罐身形状变了，加参考图并说明它控制 silhouette、label position 和 color。如果形状正确但感觉泛泛，优先收紧 decade、medium 和 palette。',
      revision:
        '先修 identity，再修 layout，最后修 surface treatment。Grain 不能拯救弱构图。',
      mistakesRows: [
        ['Vague vintage style', '明确 decade、medium、palette、texture。', '反复堆 retro、nostalgic、old-school。'],
        ['Subject 被效果盖住', '降低 texture 强度并重申主体是 hero。', '继续增加 film damage。'],
        ['生成假文字', '要求 blank label zones 或 headline-safe space。', '让模型生成最终广告文案。'],
        ['产品或脸不一致', '加入 reference image 和 handoff rules。', '先整体换风格。'],
        ['只是平面滤镜', '加入 catalog scan、risograph poster 等物理媒介。', '只改色温。'],
      ],
      vogueItems: [
        'GPT Image 2：适合 layout control、product discipline 和 brand-board structure。',
        'Nano Banana：适合快速 playful variations 和 image-to-image retro treatments。',
        'Midjourney：适合 mood-heavy editorial styling、VHS texture 和 surreal nostalgia。',
        '保存解决问题的 prompt，再为下一个 product、portrait 或 poster 替换变量。',
      ],
      eraRows: [
        ['1960s print', 'Editorial poster、travel card、playful illustration。', 'Offset print、muted primaries、paper grain、simple shapes。', '不要和 VHS、chrome、1990s flash 混在同一 prompt。'],
        ['1970s poster', 'Product launch、music poster、warm campaign visual。', 'Burnt orange、teal、ivory、halftone、geometric layout。', '不要让产品被 grain 和 sunburst 吞掉。'],
        ['1980s VHS', 'Portrait、album art、glitch frame、night mood。', 'Scanlines、chromatic bleed、neon rim light、black background。', '不要让 distortion 盖住眼睛。'],
        ['1990s magazine', 'Fashion、lifestyle ad、direct-flash portrait。', 'Glossy paper、direct flash、saturated colors、casual props。', '不要要求模型拼出最终文案。'],
        ['Early web nostalgia', 'Social graphic、icon collage、creator post。', 'Pixel edges、low-fi UI frame、sticker layout、empty text zones。', '不要把裁切塞满到没有焦点。'],
      ],
      handoffParagraph:
        'Retro style 很容易压过主体。当产品形状、脸部身份、包装颜色或品牌布局重要时，使用 reference image，并明确 reference 和风格各自负责什么。',
      handoffItems: [
        '产品参考图：说明 reference 控制 silhouette、label position、package color 和 hero angle。',
        '人像参考图：说明 reference 控制 face identity、hairstyle、expression 和 age，年代风格可以改变。',
        '品牌板参考图：说明 reference 控制 palette family、grid discipline、package proportions 和 blank label zones。',
        '第一轮结果按 identity、layout、texture 的顺序检查，retro surface treatment 不能盖住商业任务。',
      ],
      faq: [
        ['什么是 retro image prompt？', '它会清楚指定年代、媒介、色彩、纹理、相机行为和 layout，让模型生成可控的怀旧视觉。'],
        ['每个 prompt 都要写 vintage 或 retro 吗？', '不用。写一次即可，剩下篇幅用于 1970s poster、halftone dots、faded paper、limited palette 等具体控制。'],
        ['Retro prompts 能做产品图吗？', '可以，但产品 identity 要高于纹理。形状、包装、label position 或 logo placement 重要时要使用参考图。'],
        ['为什么 retro AI 图片会乱？', '通常是太多年代、纹理和 layout idea 混在一起。限制为一个 decade、一个 medium、一个 palette 和一个 production job。'],
        ['Vogue AI 里先用哪个模型？', '需要布局和产品控制时用 GPT Image 2，快速 variations 用 Nano Banana，强风格 mood 用 Midjourney。'],
        ['可以让模型生成 retro text 吗？', '最终营销文案建议留白后再设计。生成文字可作为质感，但不应该承载最终信息。'],
      ],
    },
    fr: {
      tldrItems: [
        'Choisissez une époque : 1960s print, 1970s poster, 1980s VHS, 1990s magazine flash ou early web nostalgia.',
        'Ajoutez un support physique : risograph poster, faded paper ad, instant photo, VHS still, catalog scan ou brand board.',
        'Contrôlez la couleur avec 3-5 tons au lieu de répéter vintage ou retro.',
        'Ajoutez un indice de texture et un indice caméra, puis évitez de mélanger trop de signaux.',
        'Au premier rendu, vérifiez sujet, layout et espace pour titre avant de toucher grain, scanlines ou halftone.',
      ],
      imagePlanRows: [
        ['Hero', 'Nano Banana retro turtle illustration', 'Résume le ton rétro sans dupliquer les cas internes.'],
        ['VHS case', 'Midjourney glitch eyes image', 'Montre scanlines, analog distortion et neon mood.'],
        ['Brand board case', 'GPT Image 2 Luna Coffee board', 'Ancre swatches, packaging et vintage color dans un layout contrôlé.'],
      ],
      formulaRows: [
        ['Époque', 'Une décennie ou un mouvement.', '1970s consumer poster.'],
        ['Support', 'L’objet visuel à imiter.', 'Faded magazine ad, VHS still, catalog scan.'],
        ['Palette', 'Trois à cinq couleurs.', 'Burnt orange, teal, ivory, espresso.'],
        ['Texture', 'Trace print, film, papier ou écran.', 'Halftone dots, dust, grain, scanlines.'],
        ['Usage', 'Le rôle de production.', 'Product hero, portrait, poster, mood board.'],
      ],
      promptIntro:
        'Les blocs de prompt restent en anglais pour être collés dans Vogue AI. Remplacez les variables et gardez la structure au premier essai.',
      case1Caption:
        'Cet exemple VHS convient aux sections glitch : scanlines, neon contrast et analog distortion sont des contrôles visibles.',
      case1Paragraph:
        'L’erreur fréquente consiste à empiler des mots neon sans signal caméra. Gardez le sujet simple, puis nommez scanlines, chromatic bleed, empty space et crop.',
      case2Caption:
        'Ce brand board montre qu’un style rétro est un système de palette, packaging, grille et zones vides, pas seulement un filtre.',
      case2Paragraph:
        'Pour un produit ou une marque, le style rétro ne doit pas cacher l’objet. Utilisez board, catalog ou poster quand forme, packaging et espace typographique comptent.',
      matrixRows: [
        ['Product poster', '1970s print poster, palette limitée, halftone texture.', 'Oui si forme ou packaging importent.', 'Mauvaise silhouette ou pas de zone titre.'],
        ['Portrait', '1980s VHS still ou 1990s flash magazine portrait.', 'Oui si identité, coiffure ou tenue doivent rester stables.', 'Peau cireuse, mains cassées, texture sur les yeux.'],
        ['Brand mood board', 'Vintage catalog board avec swatches et packaging studies.', 'Utile pour palette et proportions.', 'Texte faux ou grille désordonnée.'],
        ['Social graphic', 'Retro collage ou zine layout avec zones de texte vides.', 'Optionnel sauf palette de marque.', 'Crop trop encombré.'],
      ],
      workedRaw:
        'Créer une image rétro pour le lancement d’un cold brew. Elle doit être nostalgique, premium, et garder une zone de titre.',
      diagnosis:
        'Si la forme de la canette change, ajoutez une référence qui contrôle silhouette, label position et color. Si la forme est bonne mais générique, resserrez decade, medium et palette.',
      revision:
        'Corrigez identity, puis layout, puis surface treatment. Le grain ne sauve pas une composition faible.',
      mistakesRows: [
        ['Vague vintage style', 'Nommer decade, medium, palette, texture.', 'Répéter retro, nostalgic, old-school.'],
        ['Sujet caché par les effets', 'Réduire texture et rappeler le sujet hero.', 'Ajouter plus de film damage.'],
        ['Faux texte', 'Demander blank label zones ou headline-safe space.', 'Demander le texte final.'],
        ['Produit ou visage instable', 'Ajouter reference image et handoff rules.', 'Changer tout le style.'],
        ['Simple filtre plat', 'Ajouter catalog scan ou risograph poster.', 'Changer seulement la température.'],
      ],
      vogueItems: [
        'GPT Image 2 : layout control, product discipline, brand-board structure.',
        'Nano Banana : variations rapides et image-to-image retro treatments.',
        'Midjourney : mood éditorial, VHS texture et surreal nostalgia.',
        'Sauvegardez le prompt qui résout le job, puis changez les variables.',
      ],
      eraRows: [
        ['1960s print', 'Poster éditorial, travel card, illustration playful.', 'Offset print, muted primaries, paper grain, simple shapes.', 'Mélanger avec VHS, chrome et flash 1990s.'],
        ['1970s poster', 'Product launch, music poster, warm campaign visual.', 'Burnt orange, teal, ivory, halftone, geometric layout.', 'Faire disparaître le produit derrière le grain.'],
        ['1980s VHS', 'Portrait, album art, glitch frame, night mood.', 'Scanlines, chromatic bleed, neon rim light, black background.', 'Couvrir les yeux du sujet.'],
        ['1990s magazine', 'Fashion, lifestyle ad, direct-flash portrait.', 'Glossy paper, direct flash, saturated colors, casual props.', 'Faire porter le message au texte généré.'],
        ['Early web nostalgia', 'Social graphic, icon collage, creator post.', 'Pixel edges, low-fi UI frame, sticker layout, empty text zones.', 'Surcharger le crop.'],
      ],
      handoffParagraph:
        'Le style rétro peut dominer le sujet. Si forme produit, identité visage, couleur packaging ou layout de marque comptent, ajoutez une référence et expliquez ce qu’elle contrôle.',
      handoffItems: [
        'Produit : la référence contrôle silhouette, label position, package color et hero angle.',
        'Portrait : la référence contrôle face identity, hairstyle, expression et age.',
        'Brand board : la référence contrôle palette family, grid discipline, package proportions et blank label zones.',
        'Inspectez identity, puis layout, puis texture; le style ne doit jamais cacher le job commercial.',
      ],
      faq: [
        ['Qu’est-ce qu’un retro image prompt ?', 'Un brief qui nomme époque, support, palette, texture, caméra et layout pour produire une image nostalgique contrôlable.'],
        ['Faut-il écrire vintage ou retro partout ?', 'Non. Utilisez le mot une fois, puis écrivez des contrôles concrets comme 1970s poster ou halftone dots.'],
        ['Les prompts rétro marchent-ils pour les produits ?', 'Oui, si l’identité produit reste prioritaire. Utilisez une référence quand forme, packaging ou label comptent.'],
        ['Pourquoi les images rétro deviennent-elles confuses ?', 'Elles mélangent souvent trop d’époques, textures et idées de layout. Limitez chaque prompt.'],
        ['Quel modèle tester dans Vogue AI ?', 'GPT Image 2 pour contrôle, Nano Banana pour variations rapides, Midjourney pour mood stylisé.'],
        ['Puis-je générer le texte final ?', 'Mieux vaut garder des zones vides et ajouter la typographie ensuite.'],
      ],
    },
    ru: {
      tldrItems: [
        'Выберите одну эпоху: 1960s print, 1970s poster, 1980s VHS, 1990s magazine flash или early web nostalgia.',
        'Назовите физический носитель: risograph poster, faded paper ad, instant photo, VHS still, catalog scan или brand board.',
        'Управляйте цветом через 3-5 оттенков, а не повторяйте vintage и retro.',
        'Добавьте один texture cue и один camera cue, чтобы сигналы не конфликтовали.',
        'Сначала проверяйте subject, layout и headline-safe space, потом grain, scanlines или halftone.',
      ],
      imagePlanRows: [
        ['Hero', 'Nano Banana retro turtle illustration', 'Дает playful retro overview без повторения body examples.'],
        ['VHS case', 'Midjourney glitch eyes image', 'Показывает scanlines, analog distortion и neon mood.'],
        ['Brand board case', 'GPT Image 2 Luna Coffee board', 'Закрепляет swatches, packaging и vintage color в строгой сетке.'],
      ],
      formulaRows: [
        ['Эпоха', 'Одна декада или движение.', '1970s consumer poster.'],
        ['Носитель', 'На что должна быть похожа картинка.', 'Faded magazine ad, VHS still, catalog scan.'],
        ['Палитра', 'Три-пять цветов.', 'Burnt orange, teal, ivory, espresso.'],
        ['Текстура', 'Print, film, paper или screen artifact.', 'Halftone dots, dust, grain, scanlines.'],
        ['Задача', 'Производственное назначение.', 'Product hero, portrait, poster, mood board.'],
      ],
      promptIntro:
        'Prompt-блоки оставлены на английском для прямой вставки в Vogue AI. Замените переменные и не меняйте структуру в первом прогоне.',
      case1Caption:
        'VHS-пример полезен для glitch-секции: scanlines, neon contrast и analog distortion видны как конкретные controls.',
      case1Paragraph:
        'Главная ошибка VHS prompts — много neon-слов и мало signal artifacts. Оставьте subject простым и задайте scanlines, chromatic bleed, empty space и crop.',
      case2Caption:
        'Brand board показывает, что retro — это palette, package study, grid discipline и blank label zones, а не фильтр.',
      case2Paragraph:
        'В product и brand задачах стиль не должен скрывать объект. Используйте board, catalog или poster, когда важны форма, packaging и место под typography.',
      matrixRows: [
        ['Product poster', '1970s print poster, limited palette, halftone texture.', 'Когда важны shape или packaging.', 'Неверная silhouette или нет headline-safe area.'],
        ['Portrait', '1980s VHS still или 1990s flash magazine portrait.', 'Когда должны сохраниться identity, hair, outfit.', 'Пластиковое лицо, лишние руки, texture на глазах.'],
        ['Brand mood board', 'Vintage catalog board со swatches и packaging studies.', 'Для palette и proportions.', 'Фальшивый текст или грязная grid.'],
        ['Social graphic', 'Retro collage или zine layout с blank text zones.', 'Опционально, если важна brand palette.', 'Слишком плотный crop.'],
      ],
      workedRaw:
        'Нужна retro image для запуска cold brew coffee: ностальгия, premium can и место под headline.',
      diagnosis:
        'Если форма банки меняется, добавьте reference image для silhouette, label position и color. Если форма верна, но общий вид generic, уточните decade, medium и palette.',
      revision:
        'Сначала identity, затем layout, затем surface treatment. Grain не спасает слабую композицию.',
      mistakesRows: [
        ['Vague vintage style', 'Назвать decade, medium, palette, texture.', 'Складывать retro, nostalgic, old-school.'],
        ['Subject теряется под эффектами', 'Снизить texture и повторить hero subject.', 'Добавлять film damage.'],
        ['Сломанный текст', 'Запросить blank label zones.', 'Просить финальный headline.'],
        ['Неверная identity', 'Добавить reference handoff.', 'Сначала менять весь стиль.'],
        ['Плоский фильтр', 'Добавить catalog scan или risograph poster.', 'Менять только температуру.'],
      ],
      vogueItems: [
        'GPT Image 2: layout control, product discipline, brand-board structure.',
        'Nano Banana: быстрые variations и image-to-image retro treatments.',
        'Midjourney: mood-heavy editorial styling, VHS texture, surreal nostalgia.',
        'Сохраните prompt, который решил задачу, и меняйте только переменные.',
      ],
      eraRows: [
        ['1960s print', 'Editorial poster, travel card, playful illustration.', 'Offset print, muted primaries, paper grain, simple shapes.', 'Смешивать с VHS, chrome и 1990s flash.'],
        ['1970s poster', 'Product launch, music poster, warm campaign visual.', 'Burnt orange, teal, ivory, halftone, geometric layout.', 'Прятать продукт за grain.'],
        ['1980s VHS', 'Portrait, album art, glitch frame, night mood.', 'Scanlines, chromatic bleed, neon rim light, black background.', 'Закрывать глаза distortion.'],
        ['1990s magazine', 'Fashion, lifestyle ad, direct-flash portrait.', 'Glossy paper, direct flash, saturated colors, casual props.', 'Полагаться на generated text.'],
        ['Early web nostalgia', 'Social graphic, icon collage, creator post.', 'Pixel edges, low-fi UI frame, sticker layout, empty text zones.', 'Перегружать crop.'],
      ],
      handoffParagraph:
        'Retro style легко подавляет subject. Если важны форма продукта, лицо, packaging color или brand layout, добавьте reference image и явно опишите handoff.',
      handoffItems: [
        'Product reference: silhouette, label position, package color, hero angle.',
        'Portrait reference: face identity, hairstyle, expression, age.',
        'Brand-board reference: palette family, grid discipline, package proportions, blank label zones.',
        'Проверяйте identity, затем layout, затем texture; стиль не должен скрывать commercial job.',
      ],
      faq: [
        ['Что такое retro image prompt?', 'Это brief с эпохой, носителем, палитрой, текстурой, камерой и layout для контролируемой ностальгической картинки.'],
        ['Нужно ли писать vintage или retro везде?', 'Нет. Одного раза достаточно; остальное место отдайте конкретным controls.'],
        ['Подходит ли retro для product images?', 'Да, если product identity важнее texture. Reference image нужен при точной форме и packaging.'],
        ['Почему retro images становятся messy?', 'Часто смешано слишком много эпох, textures и layout ideas. Ограничьте prompt.'],
        ['С какой модели начать?', 'GPT Image 2 для контроля, Nano Banana для быстрых вариантов, Midjourney для stylized mood.'],
        ['Можно ли генерировать финальный текст?', 'Лучше оставить blank areas и добавить typography позже.'],
      ],
    },
    pt: {
      tldrItems: [
        'Escolha uma era: 1960s print, 1970s poster, 1980s VHS, 1990s magazine flash ou early web nostalgia.',
        'Defina o meio físico: risograph poster, faded paper ad, instant photo, VHS still, catalog scan ou brand board.',
        'Controle cor com 3-5 tons, não repetindo vintage e retro.',
        'Use um cue de textura e um cue de câmera para evitar mistura confusa.',
        'No primeiro resultado, revise subject, layout e headline-safe space antes de mexer em grain, scanlines ou halftone.',
      ],
      imagePlanRows: [
        ['Hero', 'Nano Banana retro turtle illustration', 'Resume o tom playful retro sem repetir os casos.'],
        ['VHS case', 'Midjourney glitch eyes image', 'Mostra scanlines, analog distortion e neon mood.'],
        ['Brand board case', 'GPT Image 2 Luna Coffee board', 'Mostra swatches, packaging e vintage color com grid controlado.'],
      ],
      formulaRows: [
        ['Era', 'Uma década ou movimento.', '1970s consumer poster.'],
        ['Mídia', 'O formato físico que a imagem imita.', 'Faded magazine ad, VHS still, catalog scan.'],
        ['Paleta', 'Três a cinco cores.', 'Burnt orange, teal, ivory, espresso.'],
        ['Textura', 'Artefato de print, film, paper ou screen.', 'Halftone dots, dust, grain, scanlines.'],
        ['Job', 'Função de produção.', 'Product hero, portrait, poster, mood board.'],
      ],
      promptIntro:
        'Os blocos de prompt ficam em inglês para colar direto no Vogue AI. Troque variáveis e mantenha a estrutura no primeiro teste.',
      case1Caption:
        'O exemplo VHS mostra scanlines, neon contrast e analog distortion como controles visuais claros.',
      case1Paragraph:
        'O erro comum em VHS prompts é empilhar palavras neon e esquecer signal artifacts. Mantenha o subject simples e controle scanlines, chromatic bleed, empty space e crop.',
      case2Caption:
        'O brand board mostra que retro é palette, package study, grid discipline e blank label zones, não apenas filtro.',
      case2Paragraph:
        'Em produto e marca, o estilo retro não pode esconder o objeto. Use board, catalog ou poster quando shape, packaging e espaço para typography importam.',
      matrixRows: [
        ['Product poster', '1970s print poster com limited palette e halftone texture.', 'Use se shape ou packaging importam.', 'Silhouette errada ou sem espaço de headline.'],
        ['Portrait', '1980s VHS still ou 1990s flash magazine portrait.', 'Use se identity, hair ou outfit precisam ficar estáveis.', 'Pele plástica, mãos ruins ou textura cobrindo olhos.'],
        ['Brand mood board', 'Vintage catalog board com swatches e packaging studies.', 'Útil para palette e proportions.', 'Texto falso ou grid bagunçado.'],
        ['Social graphic', 'Retro collage ou zine layout com blank text zones.', 'Opcional salvo brand palette.', 'Crop cheio demais.'],
      ],
      workedRaw:
        'Criar uma imagem retro para lançamento de cold brew: nostálgica, premium e com espaço para headline.',
      diagnosis:
        'Se a lata muda de forma, adicione referência para silhouette, label position e color. Se a forma está certa mas genérica, ajuste decade, medium e palette.',
      revision:
        'Corrija identity, depois layout, depois surface treatment. Grain não salva composição fraca.',
      mistakesRows: [
        ['Vague vintage style', 'Definir decade, medium, palette, texture.', 'Repetir retro, nostalgic, old-school.'],
        ['Subject escondido', 'Reduzir texture e reafirmar hero subject.', 'Adicionar film damage.'],
        ['Texto falso', 'Pedir blank label zones.', 'Pedir final ad copy.'],
        ['Identity errada', 'Adicionar reference handoff.', 'Mudar todo o estilo.'],
        ['Filtro plano', 'Adicionar catalog scan ou risograph poster.', 'Só mudar temperatura.'],
      ],
      vogueItems: [
        'GPT Image 2: layout control, product discipline, brand-board structure.',
        'Nano Banana: variações rápidas e image-to-image retro treatments.',
        'Midjourney: mood editorial, VHS texture e surreal nostalgia.',
        'Salve o prompt que resolveu o job e troque apenas variáveis.',
      ],
      eraRows: [
        ['1960s print', 'Editorial poster, travel card, playful illustration.', 'Offset print, muted primaries, paper grain, simple shapes.', 'Misturar VHS, chrome e flash 1990s.'],
        ['1970s poster', 'Product launch, music poster, warm campaign visual.', 'Burnt orange, teal, ivory, halftone, geometric layout.', 'Esconder produto atrás de grain.'],
        ['1980s VHS', 'Portrait, album art, glitch frame, night mood.', 'Scanlines, chromatic bleed, neon rim light, black background.', 'Cobrir os olhos com distortion.'],
        ['1990s magazine', 'Fashion, lifestyle ad, direct-flash portrait.', 'Glossy paper, direct flash, saturated colors, casual props.', 'Confiar em generated text final.'],
        ['Early web nostalgia', 'Social graphic, icon collage, creator post.', 'Pixel edges, low-fi UI frame, sticker layout, empty text zones.', 'Lotar o crop.'],
      ],
      handoffParagraph:
        'O estilo retro pode dominar o subject. Se shape, face identity, packaging color ou brand layout importam, use reference image e explique o handoff.',
      handoffItems: [
        'Product reference: silhouette, label position, package color e hero angle.',
        'Portrait reference: face identity, hairstyle, expression e age.',
        'Brand-board reference: palette family, grid discipline, package proportions e blank label zones.',
        'Revise identity, layout e texture nessa ordem; o estilo não deve esconder o job comercial.',
      ],
      faq: [
        ['O que é um retro image prompt?', 'Um brief com era, mídia, palette, texture, camera e layout para produzir uma imagem nostálgica controlada.'],
        ['Preciso escrever vintage ou retro sempre?', 'Não. Use uma vez e dedique o resto a controles concretos.'],
        ['Funciona para produtos?', 'Sim, se product identity vier antes da textura e houver referência quando shape ou packaging importam.'],
        ['Por que fica bagunçado?', 'Geralmente por misturar eras, textures e layout ideas demais. Limite cada prompt.'],
        ['Qual modelo começar?', 'GPT Image 2 para controle, Nano Banana para variações, Midjourney para mood estilizado.'],
        ['Posso gerar texto final?', 'Melhor deixar blank space e adicionar typography depois.'],
      ],
    },
    ja: {
      tldrItems: [
        'まず era を一つ選びます。1960s print、1970s poster、1980s VHS、1990s magazine flash、early web nostalgia などです。',
        '次に physical medium を指定します。risograph poster、faded paper ad、instant photo、VHS still、catalog scan、brand board などです。',
        'vintage や retro を繰り返すより、3-5 色の palette を指定します。',
        'texture cue と camera cue は一つずつにし、年代や媒体の信号を混ぜすぎないようにします。',
        '最初の結果は subject、layout、headline-safe space を確認してから grain、scanlines、halftone を調整します。',
      ],
      imagePlanRows: [
        ['Hero', 'Nano Banana retro turtle illustration', '本文のケースを重複せず playful retro を示します。'],
        ['VHS case', 'Midjourney glitch eyes image', 'scanlines、analog distortion、neon mood を見せます。'],
        ['Brand board case', 'GPT Image 2 Luna Coffee board', 'swatches、packaging、vintage color と grid discipline を示します。'],
      ],
      formulaRows: [
        ['Era', '一つの decade または design movement。', '1970s consumer poster。'],
        ['Medium', '画像が似せる物理形式。', 'Faded magazine ad、VHS still、catalog scan。'],
        ['Palette', '3-5 色。', 'Burnt orange、teal、ivory、espresso。'],
        ['Texture', 'print、film、paper、screen artifact。', 'Halftone dots、dust、grain、scanlines。'],
        ['Job', '画像の production use。', 'Product hero、portrait、poster、mood board。'],
      ],
      promptIntro:
        'Prompt block は Vogue AI に貼りやすいよう英語で残します。変数を置き換え、初回は構造を保ちます。',
      case1Caption:
        'この VHS 例は scanlines、neon contrast、analog distortion が見えるため、glitch セクションに適しています。',
      case1Paragraph:
        'VHS prompt では neon words を増やしすぎず、subject を単純にして scanlines、chromatic bleed、empty space、crop を指定します。',
      case2Caption:
        'Brand board は retro filter ではなく、palette、package study、grid discipline、blank label zones の設計を示します。',
      case2Paragraph:
        'product や brand では style が object を隠してはいけません。shape、packaging、typography space が重要なら board、catalog、poster 形式にします。',
      matrixRows: [
        ['Product poster', '1970s print poster、limited palette、halftone texture。', 'shape や packaging が重要な時。', 'silhouette 失敗、headline space 不足。'],
        ['Portrait', '1980s VHS still または 1990s flash magazine portrait。', 'identity、hair、outfit を保つ時。', 'waxy face、broken hands、texture over eyes。'],
        ['Brand mood board', 'Vintage catalog board、swatches、packaging studies。', 'palette と proportions を保つ時。', 'fake text や messy grid。'],
        ['Social graphic', 'Retro collage または zine layout、blank text zones。', 'brand palette が重要な時。', 'crop が混みすぎる。'],
      ],
      workedRaw:
        'cold brew coffee launch 用の retro image が必要です。nostalgic でも can は premium に見え、headline space も必要です。',
      diagnosis:
        'can shape が変わるなら reference image で silhouette、label position、color を固定します。形が正しく generic なら decade、medium、palette を絞ります。',
      revision:
        'identity、layout、surface treatment の順で直します。grain は弱い composition を救えません。',
      mistakesRows: [
        ['Vague vintage style', 'decade、medium、palette、texture を指定。', 'retro words を重ねる。'],
        ['Subject が効果で隠れる', 'texture を弱め hero subject を明記。', 'film damage を増やす。'],
        ['fake text', 'blank label zones を指定。', 'final ad copy を生成させる。'],
        ['identity が違う', 'reference handoff を追加。', 'style 全体を変える。'],
        ['flat filter', 'catalog scan や risograph poster を追加。', '色温度だけ変える。'],
      ],
      vogueItems: [
        'GPT Image 2：layout control、product discipline、brand-board structure。',
        'Nano Banana：quick variations と image-to-image retro treatments。',
        'Midjourney：mood-heavy editorial styling、VHS texture、surreal nostalgia。',
        '問題を解決した prompt を保存し、次は variables だけ変えます。',
      ],
      eraRows: [
        ['1960s print', 'Editorial poster、travel card、playful illustration。', 'Offset print、muted primaries、paper grain、simple shapes。', 'VHS、chrome、1990s flash と混ぜる。'],
        ['1970s poster', 'Product launch、music poster、warm campaign visual。', 'Burnt orange、teal、ivory、halftone、geometric layout。', 'product を grain で隠す。'],
        ['1980s VHS', 'Portrait、album art、glitch frame、night mood。', 'Scanlines、chromatic bleed、neon rim light、black background。', 'eyes を distortion で隠す。'],
        ['1990s magazine', 'Fashion、lifestyle ad、direct-flash portrait。', 'Glossy paper、direct flash、saturated colors、casual props。', 'generated text に任せる。'],
        ['Early web nostalgia', 'Social graphic、icon collage、creator post。', 'Pixel edges、low-fi UI frame、sticker layout、empty text zones。', 'crop を詰めすぎる。'],
      ],
      handoffParagraph:
        'Retro style は subject を覆いやすいです。product shape、face identity、packaging color、brand layout が重要なら reference image を使い、handoff を明確にします。',
      handoffItems: [
        'Product reference：silhouette、label position、package color、hero angle を固定。',
        'Portrait reference：face identity、hairstyle、expression、age を固定。',
        'Brand-board reference：palette family、grid discipline、package proportions、blank label zones を固定。',
        'identity、layout、texture の順で確認し、style が commercial job を隠さないようにします。',
      ],
      faq: [
        ['retro image prompt とは？', 'era、medium、palette、texture、camera、layout を明確にした nostalgic image brief です。'],
        ['vintage や retro を毎回書くべき？', '一度で十分です。残りは 1970s poster や halftone dots のような具体的 control に使います。'],
        ['product image に使えますか？', '使えます。product identity を texture より優先し、shape や packaging が重要なら reference image を使います。'],
        ['なぜ messy になりますか？', 'era、texture、layout idea を混ぜすぎることが多いです。一つずつ制限します。'],
        ['どの model から始めますか？', 'control は GPT Image 2、variation は Nano Banana、stylized mood は Midjourney です。'],
        ['final retro text を生成できますか？', '最終 copy は design tool で入れる方が安全です。prompt では blank space を残します。'],
      ],
    },
    ko: {
      tldrItems: [
        '먼저 하나의 era 를 고르세요. 1960s print, 1970s poster, 1980s VHS, 1990s magazine flash, early web nostalgia 처럼 제한합니다.',
        '그다음 medium 을 지정하세요. risograph poster, faded paper ad, instant photo, VHS still, catalog scan, brand board 등이 좋습니다.',
        'vintage 나 retro 를 반복하기보다 3-5개 색상의 palette 로 제어합니다.',
        'texture cue 하나와 camera cue 하나만 추가해 신호가 섞이지 않게 합니다.',
        '첫 결과는 subject, layout, headline-safe space 를 먼저 보고 grain, scanlines, halftone 을 조정합니다.',
      ],
      imagePlanRows: [
        ['Hero', 'Nano Banana retro turtle illustration', '본문 사례를 반복하지 않고 playful retro 를 보여줍니다.'],
        ['VHS case', 'Midjourney glitch eyes image', 'scanlines, analog distortion, neon mood 를 보여줍니다.'],
        ['Brand board case', 'GPT Image 2 Luna Coffee board', 'swatches, packaging, vintage color 와 grid discipline 을 보여줍니다.'],
      ],
      formulaRows: [
        ['Era', '하나의 decade 또는 design movement.', '1970s consumer poster.'],
        ['Medium', '이미지가 닮아야 하는 물리 형식.', 'Faded magazine ad, VHS still, catalog scan.'],
        ['Palette', '세 개에서 다섯 개 색상.', 'Burnt orange, teal, ivory, espresso.'],
        ['Texture', 'print, film, paper, screen artifact.', 'Halftone dots, dust, grain, scanlines.'],
        ['Job', '이미지의 production use.', 'Product hero, portrait, poster, mood board.'],
      ],
      promptIntro:
        'Prompt block 은 Vogue AI에 바로 붙여 넣기 쉽도록 영어로 둡니다. 변수만 바꾸고 첫 시도에서는 구조를 유지하세요.',
      case1Caption:
        '이 VHS 예시는 scanlines, neon contrast, analog distortion 이 보이기 때문에 glitch 섹션에 적합합니다.',
      case1Paragraph:
        'VHS prompt 는 neon words 를 많이 쓰는 것보다 subject 를 단순하게 두고 scanlines, chromatic bleed, empty space, crop 을 명확히 해야 합니다.',
      case2Caption:
        'Brand board 는 retro filter 가 아니라 palette, package study, grid discipline, blank label zones 의 조합입니다.',
      case2Paragraph:
        'product 와 brand 작업에서 retro style 이 object 를 가리면 안 됩니다. shape, packaging, typography space 가 중요하면 board, catalog, poster 형식을 쓰세요.',
      matrixRows: [
        ['Product poster', '1970s print poster, limited palette, halftone texture.', 'shape 또는 packaging 이 중요할 때.', 'silhouette 실패 또는 headline space 부족.'],
        ['Portrait', '1980s VHS still 또는 1990s flash magazine portrait.', 'identity, hair, outfit 을 유지할 때.', 'waxy face, broken hands, texture over eyes.'],
        ['Brand mood board', 'Vintage catalog board, swatches, packaging studies.', 'palette 와 proportions 유지.', 'fake text 또는 messy grid.'],
        ['Social graphic', 'Retro collage 또는 zine layout, blank text zones.', 'brand palette 가 중요할 때.', 'crop 이 너무 복잡함.'],
      ],
      workedRaw:
        'cold brew coffee launch 를 위한 retro image 가 필요합니다. nostalgic 하지만 can 은 premium 하게 보이고 headline space 도 필요합니다.',
      diagnosis:
        'can shape 이 바뀌면 reference image 로 silhouette, label position, color 를 고정하세요. shape 은 맞지만 generic 하면 decade, medium, palette 를 좁히세요.',
      revision:
        'identity, layout, surface treatment 순서로 고치세요. grain 은 약한 composition 을 해결하지 못합니다.',
      mistakesRows: [
        ['Vague vintage style', 'decade, medium, palette, texture 지정.', 'retro words 반복.'],
        ['Subject 가 효과에 묻힘', 'texture 를 줄이고 hero subject 명시.', 'film damage 추가.'],
        ['fake text', 'blank label zones 요청.', 'final ad copy 생성 요청.'],
        ['identity 오류', 'reference handoff 추가.', 'style 전체 변경.'],
        ['flat filter', 'catalog scan 또는 risograph poster 추가.', '색온도만 변경.'],
      ],
      vogueItems: [
        'GPT Image 2: layout control, product discipline, brand-board structure.',
        'Nano Banana: quick variations 와 image-to-image retro treatments.',
        'Midjourney: mood-heavy editorial styling, VHS texture, surreal nostalgia.',
        '문제를 해결한 prompt 를 저장하고 다음에는 variables 만 바꾸세요.',
      ],
      eraRows: [
        ['1960s print', 'Editorial poster, travel card, playful illustration.', 'Offset print, muted primaries, paper grain, simple shapes.', 'VHS, chrome, 1990s flash 혼합.'],
        ['1970s poster', 'Product launch, music poster, warm campaign visual.', 'Burnt orange, teal, ivory, halftone, geometric layout.', 'product 를 grain 뒤에 숨김.'],
        ['1980s VHS', 'Portrait, album art, glitch frame, night mood.', 'Scanlines, chromatic bleed, neon rim light, black background.', 'eyes 를 distortion 으로 가림.'],
        ['1990s magazine', 'Fashion, lifestyle ad, direct-flash portrait.', 'Glossy paper, direct flash, saturated colors, casual props.', 'generated text 에 의존.'],
        ['Early web nostalgia', 'Social graphic, icon collage, creator post.', 'Pixel edges, low-fi UI frame, sticker layout, empty text zones.', 'crop 을 과하게 채움.'],
      ],
      handoffParagraph:
        'Retro style 은 subject 를 덮어버리기 쉽습니다. product shape, face identity, packaging color, brand layout 이 중요하면 reference image 를 쓰고 handoff 를 명확히 적으세요.',
      handoffItems: [
        'Product reference: silhouette, label position, package color, hero angle 고정.',
        'Portrait reference: face identity, hairstyle, expression, age 고정.',
        'Brand-board reference: palette family, grid discipline, package proportions, blank label zones 고정.',
        'identity, layout, texture 순서로 확인하고 style 이 commercial job 을 가리지 않게 하세요.',
      ],
      faq: [
        ['retro image prompt 는 무엇인가요?', 'era, medium, palette, texture, camera, layout 을 명확히 한 nostalgic image brief 입니다.'],
        ['vintage 또는 retro 를 매번 써야 하나요?', '한 번이면 충분합니다. 나머지는 구체적인 control 에 쓰세요.'],
        ['product image 에도 되나요?', '가능합니다. product identity 를 texture 보다 우선하고 shape 또는 packaging 이 중요하면 reference image 를 쓰세요.'],
        ['왜 messy 해지나요?', 'era, texture, layout idea 를 너무 많이 섞어서 그렇습니다. 하나씩 제한하세요.'],
        ['어떤 model 부터 시작하나요?', 'control 은 GPT Image 2, variation 은 Nano Banana, stylized mood 는 Midjourney 입니다.'],
        ['final retro text 를 생성해도 되나요?', '최종 copy 는 design tool 에서 넣는 편이 안전합니다. prompt 에서는 blank space 를 남기세요.'],
      ],
    },
  }[locale];

  return [
    { type: 'paragraph', text: copy.intro },
    { type: 'heading', level: 2, text: copy.tldr },
    { type: 'list', items: body.tldrItems },
    { type: 'heading', level: 2, text: copy.imagePlan },
    { type: 'table', headers: ['Role', 'Source', 'Fit'], rows: body.imagePlanRows },
    { type: 'heading', level: 2, text: copy.formula },
    { type: 'table', headers: ['Part', 'Control', 'Example'], rows: body.formulaRows },
    { type: 'heading', level: 2, text: copy.prompts },
    { type: 'paragraph', text: body.promptIntro },
    { type: 'list', items: [...promptBlocks] },
    { type: 'heading', level: 2, text: copy.case1 },
    { type: 'image', src: promptLibraryImages.vhs, alt: 'Vogue AI prompt library VHS glitch example', caption: body.case1Caption },
    { type: 'paragraph', text: body.case1Paragraph },
    { type: 'heading', level: 2, text: copy.case2 },
    { type: 'image', src: promptLibraryImages.brandBoard, alt: 'Vogue AI prompt library retro coffee brand board', caption: body.case2Caption },
    { type: 'paragraph', text: body.case2Paragraph },
    { type: 'heading', level: 2, text: copy.matrix },
    { type: 'table', headers: ['Use case', 'Pattern', 'Reference image?', 'First failure to fix'], rows: body.matrixRows },
    { type: 'heading', level: 2, text: copy.worked },
    { type: 'heading', level: 3, text: 'Raw request' },
    { type: 'paragraph', text: body.workedRaw },
    { type: 'heading', level: 3, text: 'Prompt version 1' },
    { type: 'list', items: ['1970s premium cold brew poster, centered aluminum can on a faded cream paper backdrop, burnt orange and deep teal geometric sunburst, subtle halftone dots, soft catalog lighting, crisp condensation on the can, clean headline-safe space above, premium but nostalgic mood, 4:5 aspect ratio, no readable text, no watermark.'] },
    { type: 'heading', level: 3, text: 'First-result diagnosis' },
    { type: 'paragraph', text: body.diagnosis },
    { type: 'callout', title: 'Revision rule', text: body.revision },
    { type: 'heading', level: 2, text: copy.mistakes },
    { type: 'table', headers: ['Mistake', 'Fix first', 'Avoid'], rows: body.mistakesRows },
    { type: 'heading', level: 2, text: copy.vogue },
    { type: 'list', items: body.vogueItems },
    { type: 'heading', level: 2, text: 'Era cheat sheet' },
    { type: 'table', headers: ['Era', 'Best visual job', 'Controls to name', 'Avoid'], rows: body.eraRows },
    { type: 'heading', level: 2, text: 'Reference image handoff' },
    { type: 'paragraph', text: body.handoffParagraph },
    { type: 'list', items: body.handoffItems },
    { type: 'heading', level: 2, text: copy.faq },
    ...body.faq.flatMap(([question, answer]) => [
      { type: 'heading' as const, level: 3 as const, text: question },
      { type: 'paragraph' as const, text: answer },
    ]),
  ];
};

export const retroImagePromptsAutoBlogPost: BlogPostSource = {
  slug: 'retro-image-prompts',
  date: '2026-06-22',
  updatedAt: '2026-06-22',
  author: 'Vogue AI Team',
  image: promptLibraryImages.hero,
  imageAlt: 'Retro cartoon illustration prompt example from the Vogue AI prompt library',
  articleType: 'tutorial',
  modelTags: ['vogue-ai', 'gpt-image-2', 'nano-banana', 'midjourney'],
  readingMinutes: 9,
  localizations: {
    en: {
      title: 'Retro image prompts that control era, color, and texture',
      summary:
        'A practical Vogue AI guide to writing retro image prompts for posters, portraits, products, and brand boards with copyable examples.',
      seoTitle: 'Retro Image Prompts for AI Photos and Posters',
      seoDescription:
        'Copy retro image prompts for 1970s posters, VHS portraits, 1990s ads, and brand boards, with Vogue AI examples and revision rules.',
      content: enContent,
    },
    zh: {
      title: '能控制年代、色彩与质感的 Retro Image Prompts',
      summary: '一篇 Vogue AI 实用指南，帮助你为海报、人像、产品图和品牌板编写可复制的复古图片提示词。',
      seoTitle: 'Retro Image Prompts 复古图片提示词实战指南',
      seoDescription: '复制适用于 1970s poster、VHS portrait、1990s ad 和 brand board 的 retro image prompts，学习年代、媒介、色彩、纹理、参考图 handoff、空白文字区、模型选择和第一轮修正规则。',
      content: makeLocalizedContent('zh'),
    },
    fr: {
      title: "Retro image prompts qui contrôlent époque, couleur et texture",
      summary: "Un guide Vogue AI pratique pour écrire des prompts rétro pour posters, portraits, produits et brand boards.",
      seoTitle: 'Guide Retro Image Prompts pour images IA',
      seoDescription: "Copiez des retro image prompts pour posters 1970s, portraits VHS, publicités 1990s et brand boards, avec règles de correction.",
      content: makeLocalizedContent('fr'),
    },
    ru: {
      title: 'Retro image prompts с контролем эпохи, цвета и текстуры',
      summary: 'Практический гид Vogue AI для ретро-промптов под постеры, портреты, продукты и brand boards.',
      seoTitle: 'Retro Image Prompts для AI изображений',
      seoDescription: 'Копируйте retro image prompts для 1970s poster, VHS portrait, 1990s ad и brand board, с правилами эпохи, палитры, texture, reference image и правок.',
      content: makeLocalizedContent('ru'),
    },
    pt: {
      title: 'Retro image prompts que controlam época, cor e textura',
      summary: 'Um guia prático do Vogue AI para prompts retrô de posters, retratos, produtos e brand boards.',
      seoTitle: 'Guia de Retro Image Prompts para IA',
      seoDescription: 'Copie retro image prompts para posters 1970s, retratos VHS, anúncios 1990s e brand boards, com era, palette, texture, referência e revisão.',
      content: makeLocalizedContent('pt'),
    },
    ja: {
      title: '年代、色、質感を制御する Retro Image Prompts',
      summary: 'ポスター、ポートレート、商品画像、brand board 向けに、Vogue AI で使える retro image prompts を整理した実践ガイドです。',
      seoTitle: 'Retro Image Prompts レトロ画像生成プロンプト実践ガイド',
      seoDescription: '1970s poster、VHS portrait、1990s ad、brand board 用の retro image prompts をコピーし、era、medium、palette、texture、reference image、revision rules を学べます。',
      content: makeLocalizedContent('ja'),
    },
    ko: {
      title: 'Era, color, texture 를 제어하는 Retro Image Prompts',
      summary: 'Poster, portrait, product image, brand board 를 위한 Vogue AI retro image prompts 실전 가이드입니다.',
      seoTitle: 'Retro Image Prompts 레트로 이미지 프롬프트 실전 가이드',
      seoDescription: '1970s poster, VHS portrait, 1990s ad, brand board 용 retro image prompts 를 복사하고 era, medium, palette, texture, reference image, revision rules 를 익히세요.',
      content: makeLocalizedContent('ko'),
    },
  },
};
