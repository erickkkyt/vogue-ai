import type { BlogContentBlock, BlogPostSource } from '@/lib/blog-data';

const promptLibraryImages = {
  hero:
    'https://media.vogueai.net/blog/auto/grok-imagine-1-5-image-to-video-prompt-guide/34cfbf8d7109-youtube-thumbnail-tech-tutorial-thumbnail-with-ui-mockup-1.jpg',
  motionCase:
    'https://media.vogueai.net/blog/auto/grok-imagine-1-5-image-to-video-prompt-guide/144c00fb8b1f-does-anyone-realize-how-hard-it-is-1.jpg',
  firstFrameCase:
    'https://media.vogueai.net/blog/auto/grok-imagine-1-5-image-to-video-prompt-guide/43e96f7ae159-concept-couch-couple-camera-lcd-screen-nostalgia-1.jpg',
} as const;

const copyablePromptBlocks = [
  'Product reveal: Animate the attached product image as a 6-second premium launch shot. Keep the product silhouette, label position, and material unchanged. Start with a locked first frame, then add a slow 20-degree orbit, soft rim-light movement, subtle background parallax, realistic reflections, no new text, no logo distortion.',
  'Portrait motion: Animate the attached portrait as a calm editorial video. Preserve face identity, hairstyle, wardrobe color, and camera crop. Add a gentle push-in, natural breathing, soft fabric movement, eye contact held for the first 2 seconds, shallow depth of field, no extra hands, no face morphing.',
  'Social teaser: Turn the attached campaign still into a vertical 8-second teaser. Keep the subject placement and empty headline area unchanged. Add slow handheld drift, background light sweep, small foreground particle motion, one clean reveal beat at second 4, no generated captions, no watermark.',
  'Cinematic scene: Animate the attached environment still with controlled camera language. Begin exactly on the source image, then use a slow dolly forward, mild parallax between foreground and background, wind motion only on cloth and hair, stable horizon, no new characters, no sudden scene cut.',
] as const;

const casePrompts = {
  camera:
    'Animate this still as a cinematic tutorial opener. Preserve the full composition and subject scale. Add a slow dolly forward, gentle parallax in the background, slight light movement across the main subject, and one subtle focus pull near the end. No new objects, no scene cut, no text.',
  firstFrame:
    'Animate this reference-style lifestyle image as a nostalgic 6-second shot. Keep the couple, couch, camera LCD framing, and room layout stable. Add tiny handheld camera drift, soft ambient light flicker, natural blinking, and a slow rack focus from the LCD screen to the people. No identity drift, no extra people, no subtitles.',
} as const;

const enContent: BlogContentBlock[] = [
  {
    type: 'paragraph',
    text: 'Grok Imagine 1.5 image-to-video prompts work best when the prompt protects the first frame before it asks for motion. The still image is not just inspiration; it is the starting frame, so your job is to describe what may move, what must stay fixed, and how the camera should behave.',
  },
  {
    type: 'heading',
    level: 2,
    text: 'TL;DR: protect the frame, then add motion',
  },
  {
    type: 'list',
    items: [
      'Start with a strong source image. Image-to-video quality depends on the first frame, not only on the motion prompt.',
      'Write the prompt in layers: first-frame lock, subject preservation, camera move, motion beats, timing, and negative constraints.',
      'Use camera verbs such as slow push-in, dolly forward, orbit, pan, rack focus, parallax, and locked-off shot instead of vague words like dynamic.',
      'Name the parts that may move and the parts that must not change: face, product label, UI screen, logo, horizon, hands, or empty text area.',
      'Keep generated text out of the video prompt. Reserve clean space and add final captions in editing software.',
    ],
  },
  {
    type: 'heading',
    level: 2,
    text: 'What the xAI workflow means for prompt writing',
  },
  {
    type: 'paragraph',
    text: 'xAI describes image-to-video as a workflow where a still image is animated with a text prompt, and the source image becomes the starting point for the generated video. That has one practical consequence: prompt writing should begin with first-frame preservation, then describe motion.',
  },
  {
    type: 'table',
    headers: ['Prompt layer', 'What to write', 'Why it matters'],
    rows: [
      ['First-frame lock', 'Begin exactly from the attached image; preserve subject placement, crop, and visual hierarchy.', 'Prevents the model from treating the source image as loose mood reference.'],
      ['Identity rules', 'Name faces, products, labels, hands, UI screens, or brand marks that must remain stable.', 'Image-to-video failures often look like identity drift, not weak motion.'],
      ['Camera language', 'Use push-in, dolly, orbit, pan, tilt, handheld drift, rack focus, locked shot, or parallax.', 'Clear camera verbs produce more controllable motion than generic energy words.'],
      ['Motion beats', 'Describe 1-3 small movements with timing: light sweep, hair movement, product rotation, background drift.', 'Short videos need a few readable beats, not a crowded animation list.'],
      ['Negative constraints', 'No new people, no face morphing, no logo distortion, no generated captions, no scene cut.', 'Constraints protect the production asset from common video artifacts.'],
      ['Review check', 'State the first thing to inspect after generation: identity, label, camera path, or text-safe space.', 'A review check makes iteration specific instead of random.'],
    ],
  },
  {
    type: 'heading',
    level: 2,
    text: 'Image plan for this guide',
  },
  {
    type: 'paragraph',
    text: 'The hero uses a first-party tutorial thumbnail because this article is a prompt guide. The motion section uses a cinematic first-party scene that matches camera-language examples, and the first-frame section uses a lifestyle LCD-screen image because it visibly teaches reference framing and identity preservation.',
  },
  {
    type: 'heading',
    level: 2,
    text: 'Scenario matrix',
  },
  {
    type: 'table',
    headers: ['Goal', 'Source image requirement', 'Prompt focus', 'First failure to check'],
    rows: [
      ['Product reveal', 'Clean product still with readable silhouette and controlled background.', 'Orbit, reflection movement, label lock, and no text changes.', 'Logo or label distortion.'],
      ['Portrait teaser', 'Face-forward portrait with stable crop and no confusing hands.', 'Identity lock, breathing, eye focus, subtle push-in.', 'Face morphing or extra hands.'],
      ['Social campaign clip', 'Vertical still with subject hierarchy and headline-safe area.', 'Handheld drift, light sweep, reveal beat, empty text area.', 'Generated captions or crowded frame.'],
      ['Cinematic environment', 'Still frame with foreground/background separation.', 'Dolly, parallax, wind on selected elements, stable horizon.', 'New objects or sudden scene jump.'],
      ['UI/app showcase', 'Screen mockup with clear hierarchy and readable product area.', 'Locked screen, gentle device movement, reflection control.', 'Fake UI changes or unreadable screen.'],
    ],
  },
  {
    type: 'heading',
    level: 2,
    text: 'Copyable Grok Imagine 1.5 image-to-video prompts',
  },
  {
    type: 'paragraph',
    text: 'Copy one block, attach your source image, and replace only the bracketed variables. The prompt blocks stay in English so they remain paste-ready in any locale.',
  },
  {
    type: 'image',
    src: promptLibraryImages.motionCase,
    alt: 'Cinematic prompt-library still for camera-motion examples',
    caption:
      'Use a cinematic still when the prompt teaches camera movement: the frame has enough depth for dolly, parallax, light sweep, and focus-pull instructions.',
  },
  {
    type: 'list',
    items: [...copyablePromptBlocks],
  },
  {
    type: 'heading',
    level: 2,
    text: 'Case 1: camera language for a cinematic still',
  },
  {
    type: 'paragraph',
    text: 'A cinematic source image is useful when the main lesson is motion control. The best prompt does not ask for a completely new scene; it keeps the composition intact and adds one camera path plus a few environmental beats.',
  },
  {
    type: 'list',
    items: [`Prompt: ${casePrompts.camera}`],
  },
  {
    type: 'heading',
    level: 2,
    text: 'Case 2: first-frame planning from a reference-style image',
  },
  {
    type: 'image',
    src: promptLibraryImages.firstFrameCase,
    alt: 'Lifestyle prompt-library still showing camera LCD framing',
    caption:
      'This image matches first-frame planning because the LCD screen, people, couch, and room layout make it obvious which elements must stay stable while motion is added.',
  },
  {
    type: 'paragraph',
    text: 'For lifestyle or portrait clips, start by naming what the source image controls. Then add small believable motion. If you skip that first-frame handoff, the video may look lively while losing the face, relationship, or layout that made the still useful.',
  },
  {
    type: 'list',
    items: [`Prompt: ${casePrompts.firstFrame}`],
  },
  {
    type: 'heading',
    level: 2,
    text: 'Worked example: from still image to video prompt',
  },
  {
    type: 'heading',
    level: 3,
    text: 'Raw brief',
  },
  {
    type: 'paragraph',
    text: 'You have a clean product hero image for a new skincare bottle. You need a 6-second product teaser for a launch page and a short social post. The bottle shape and label must remain stable, and the top third should stay empty for later typography.',
  },
  {
    type: 'heading',
    level: 3,
    text: 'Prompt version 1',
  },
  {
    type: 'list',
    items: [
      'Animate the attached skincare bottle image as a 6-second premium launch teaser. Begin exactly from the source frame. Preserve bottle shape, cap color, label position, shadow, and empty top-third headline space. Add a slow 15-degree camera orbit, soft rim-light sweep, subtle reflection movement on the bottle, and mild background parallax. No new text, no logo distortion, no extra objects, no scene cut.',
    ],
  },
  {
    type: 'heading',
    level: 3,
    text: 'First revision after generation',
  },
  {
    type: 'paragraph',
    text: 'If the motion feels good but the label drifts, strengthen the identity rules and reduce camera movement. If the bottle stays stable but the video feels flat, keep the first-frame lock and add one timed motion beat such as a light sweep at second 3. Do not rewrite the whole prompt until you know which layer failed.',
  },
  {
    type: 'callout',
    title: 'Revision rule',
    text: 'Fix identity before motion, fix camera path before style, and fix text-safe space before adding more visual effects.',
  },
  {
    type: 'heading',
    level: 2,
    text: 'Mistake and fix table',
  },
  {
    type: 'table',
    headers: ['Failure mode', 'Fix first', 'Avoid'],
    rows: [
      ['Face, product, or UI identity drifts', 'Add a first-frame lock and name exactly what cannot change.', 'Adding stronger motion before identity is stable.'],
      ['Camera movement feels random', 'Replace vague motion with one camera verb and a direction.', 'Stacking pan, zoom, orbit, and shake in one short clip.'],
      ['Video invents new objects or people', 'Add negative constraints and simplify background motion.', 'Asking for a new story beat when the frame should stay controlled.'],
      ['Text or logo breaks', 'Remove generated text requests and reserve empty space for editing.', 'Expecting perfect captions inside the generated video.'],
      ['Clip feels static', 'Add one timed beat: light sweep, focus pull, reflection move, or small foreground motion.', 'Rewriting the source-image role.'],
    ],
  },
  {
    type: 'heading',
    level: 2,
    text: 'How to use the pattern inside Vogue AI',
  },
  {
    type: 'paragraph',
    text: 'Use Vogue AI as the staging layer before you run an image-to-video workflow. Build or refine the still image in the workspace, copy a prompt-library structure, then send the strongest still plus a short motion prompt to your video model of choice.',
  },
  {
    type: 'list',
    items: [
      'Use GPT Image 2 when the still image needs instruction-heavy cleanup before animation.',
      'Use Nano Banana when you need quick image-to-image variations before choosing the first frame.',
      'Use Midjourney when the source still needs stronger cinematic mood or fashion framing.',
      'Keep the final video prompt shorter than the still-image prompt. Motion needs priority, not every styling detail repeated.',
      'Save the source still and the motion prompt together so the next clip can reuse the same first-frame logic.',
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
    text: 'What is the most important part of a Grok Imagine 1.5 image-to-video prompt?',
  },
  {
    type: 'paragraph',
    text: 'The first-frame instruction is the most important part. Tell the model to begin from the attached image and preserve the subject, crop, layout, identity, and text-safe areas before describing motion.',
  },
  {
    type: 'heading',
    level: 3,
    text: 'Should the prompt describe the source image again?',
  },
  {
    type: 'paragraph',
    text: 'Describe only the parts that must stay stable. Repeating every visual detail can make the prompt noisy; naming the protected elements is more useful.',
  },
  {
    type: 'heading',
    level: 3,
    text: 'How long should the motion prompt be?',
  },
  {
    type: 'paragraph',
    text: 'Shorter is usually better. Use one first-frame rule, one identity rule, one camera move, two or three motion beats, and a few negative constraints.',
  },
  {
    type: 'heading',
    level: 3,
    text: 'Can I ask Grok Imagine to add captions or logo text?',
  },
  {
    type: 'paragraph',
    text: 'Use generated text only as rough placeholder planning. For production clips, reserve clean space and add captions, logo marks, pricing, or legal text in an editing tool.',
  },
  {
    type: 'heading',
    level: 3,
    text: 'Why does my image-to-video result change the face or product?',
  },
  {
    type: 'paragraph',
    text: 'The prompt probably under-specified identity preservation or asked for too much motion. Strengthen the first-frame lock, name the protected details, and reduce camera movement.',
  },
  {
    type: 'heading',
    level: 3,
    text: 'How should I iterate after a bad result?',
  },
  {
    type: 'paragraph',
    text: 'Identify the largest failure first: identity, camera path, unwanted objects, broken text, or flat motion. Change only that layer, then regenerate.',
  },
];

const localizedContent = (
  locale: 'zh' | 'fr' | 'ru' | 'pt' | 'ja' | 'ko'
): BlogContentBlock[] => {
  const copy = {
    zh: {
      intro: 'Grok Imagine 1.5 的 image-to-video prompt，核心是先保护第一帧，再添加运动。源图不是灵感图，而是视频起点，所以提示词必须说明哪些能动、哪些不能变，以及镜头如何运动。',
      tldr: 'TL;DR：先锁定画面，再添加运动',
      bullets: ['先准备强 source image；第一帧质量决定视频上限。', '按层写：first-frame lock、identity、camera move、motion beats、timing、negative constraints。', '用 slow push-in、dolly、orbit、rack focus、parallax 等镜头词，不要只写 dynamic。', '明确 face、product label、UI screen、logo、horizon、hands、text-safe area 不能乱变。', '不要在生成阶段要求最终字幕；留出干净区域，后期加字。'],
      anatomy: '提示词结构',
      scenario: '场景矩阵',
      examples: '可复制的 Grok Imagine 1.5 image-to-video prompts',
      case1: '案例 1：用 cinematic still 练镜头语言',
      case2: '案例 2：从 reference-style image 做第一帧规划',
      worked: '完整示例：从静态图到视频提示词',
      fixes: '错误和修法',
      vogue: '在 Vogue AI 里使用这个结构',
      faq: ['第一帧指令为什么最重要？', '提示词需要重新描述源图吗？', 'motion prompt 应该多长？', '可以生成字幕或 logo 吗？', '为什么脸或产品会变形？', '坏结果之后怎么迭代？'],
    },
    fr: {
      intro: "Un prompt Grok Imagine 1.5 image-to-video fonctionne mieux quand il protège d'abord la première image. L'image source n'est pas une simple inspiration : c'est le point de départ de la vidéo.",
      tldr: 'TL;DR : protégez le cadre, puis ajoutez le mouvement',
      bullets: ["Commencez avec une source image solide.", 'Écrivez par couches : first-frame lock, identité, caméra, motion beats, timing et contraintes.', 'Utilisez slow push-in, dolly, orbit, rack focus et parallax plutôt que dynamic.', 'Nommez ce qui peut bouger et ce qui doit rester fixe.', 'Gardez le texte final hors de la génération vidéo.'],
      anatomy: 'Structure du prompt',
      scenario: 'Matrice de scénarios',
      examples: 'Prompts Grok Imagine 1.5 image-to-video à copier',
      case1: 'Cas 1 : langage caméra pour un still cinématique',
      case2: 'Cas 2 : planifier la première image avec une référence',
      worked: 'Exemple complet : du still au prompt vidéo',
      fixes: 'Erreurs et corrections',
      vogue: 'Utiliser ce modèle dans Vogue AI',
      faq: ['Pourquoi la première image est-elle centrale ?', "Faut-il redécrire l'image source ?", 'Quelle longueur pour le motion prompt ?', 'Puis-je générer des sous-titres ou logos ?', 'Pourquoi le visage ou produit change-t-il ?', 'Comment itérer après un mauvais résultat ?'],
    },
    ru: {
      intro: 'Grok Imagine 1.5 image-to-video prompt работает лучше, когда сначала защищает первый кадр. Source image — это старт видео, а не просто mood reference.',
      tldr: 'TL;DR: сначала фиксируйте кадр, потом добавляйте motion',
      bullets: ['Начинайте с сильной source image.', 'Пишите слоями: first-frame lock, identity, camera move, motion beats, timing, negative constraints.', 'Используйте slow push-in, dolly, orbit, rack focus и parallax вместо dynamic.', 'Назовите, что может двигаться и что нельзя менять.', 'Финальный текст добавляйте в editing tool, не в генерации.'],
      anatomy: 'Структура prompt',
      scenario: 'Матрица сценариев',
      examples: 'Копируемые Grok Imagine 1.5 image-to-video prompts',
      case1: 'Кейс 1: camera language для cinematic still',
      case2: 'Кейс 2: first-frame planning из reference image',
      worked: 'Пример: от still image к video prompt',
      fixes: 'Ошибки и исправления',
      vogue: 'Как использовать паттерн в Vogue AI',
      faq: ['Почему first-frame instruction важнее всего?', 'Нужно ли снова описывать source image?', 'Насколько длинным должен быть motion prompt?', 'Можно ли просить captions или logo text?', 'Почему меняется face или product?', 'Как итерировать после плохого результата?'],
    },
    pt: {
      intro: 'Um prompt Grok Imagine 1.5 image-to-video funciona melhor quando protege o primeiro quadro antes de pedir movimento. A imagem de origem é o ponto inicial do vídeo.',
      tldr: 'TL;DR: proteja o quadro, depois adicione movimento',
      bullets: ['Comece com uma source image forte.', 'Escreva em camadas: first-frame lock, identidade, câmera, motion beats, timing e negative constraints.', 'Use slow push-in, dolly, orbit, rack focus e parallax em vez de dynamic.', 'Diga o que pode mover e o que precisa ficar fixo.', 'Adicione texto final em edição, não na geração.'],
      anatomy: 'Estrutura do prompt',
      scenario: 'Matriz de cenários',
      examples: 'Prompts Grok Imagine 1.5 image-to-video para copiar',
      case1: 'Caso 1: linguagem de câmera para um still cinemático',
      case2: 'Caso 2: planejamento do primeiro quadro com referência',
      worked: 'Exemplo: de still image a video prompt',
      fixes: 'Erros e correções',
      vogue: 'Como usar no Vogue AI',
      faq: ['Por que a primeira imagem é tão importante?', 'Preciso redescrever a imagem fonte?', 'Qual deve ser o tamanho do motion prompt?', 'Posso gerar legendas ou logo?', 'Por que rosto ou produto mudam?', 'Como iterar após um resultado ruim?'],
    },
    ja: {
      intro: 'Grok Imagine 1.5 の image-to-video prompt は、まず第一フレームを守り、そのあと motion を足すと安定します。source image は単なる参考ではなく動画の開始点です。',
      tldr: 'TL;DR：フレームを守ってから動きを足す',
      bullets: ['強い source image から始めます。', 'first-frame lock、identity、camera move、motion beats、timing、negative constraints の層で書きます。', 'dynamic ではなく slow push-in、dolly、orbit、rack focus、parallax を使います。', '動いてよい部分と変えてはいけない部分を明記します。', '最終テキストは生成ではなく編集で追加します。'],
      anatomy: 'Prompt の構造',
      scenario: 'シナリオマトリクス',
      examples: 'コピーできる Grok Imagine 1.5 image-to-video prompts',
      case1: 'ケース 1：cinematic still の camera language',
      case2: 'ケース 2：reference image から first-frame planning',
      worked: '例：still image から video prompt へ',
      fixes: '失敗と修正',
      vogue: 'Vogue AI での使い方',
      faq: ['なぜ第一フレームが重要ですか？', 'source image をもう一度説明すべきですか？', 'motion prompt の長さは？', '字幕や logo を生成できますか？', '顔や商品が変わる理由は？', '悪い結果の後どう修正しますか？'],
    },
    ko: {
      intro: 'Grok Imagine 1.5 image-to-video prompt 는 먼저 첫 프레임을 보호하고 그다음 motion 을 추가할 때 안정적입니다. source image 는 단순 참고가 아니라 video 의 시작점입니다.',
      tldr: 'TL;DR: frame 을 지킨 뒤 motion 을 더하세요',
      bullets: ['강한 source image 로 시작하세요.', 'first-frame lock, identity, camera move, motion beats, timing, negative constraints 순서로 씁니다.', 'dynamic 대신 slow push-in, dolly, orbit, rack focus, parallax 를 사용하세요.', '움직일 부분과 고정할 부분을 명확히 쓰세요.', '최종 text 는 generation 이 아니라 editing 단계에서 넣으세요.'],
      anatomy: 'Prompt 구조',
      scenario: '시나리오 매트릭스',
      examples: '복사 가능한 Grok Imagine 1.5 image-to-video prompts',
      case1: '케이스 1: cinematic still 의 camera language',
      case2: '케이스 2: reference image 로 first-frame planning',
      worked: '예시: still image 에서 video prompt 까지',
      fixes: '실패와 수정',
      vogue: 'Vogue AI 에서 쓰는 방법',
      faq: ['첫 프레임 지시가 왜 중요한가요?', 'source image 를 다시 설명해야 하나요?', 'motion prompt 는 얼마나 길어야 하나요?', 'captions 나 logo 를 생성해도 되나요?', 'face 나 product 가 왜 바뀌나요?', '나쁜 결과 뒤에는 어떻게 수정하나요?'],
    },
  }[locale];

  return [
    { type: 'paragraph', text: copy.intro },
    { type: 'heading', level: 2, text: copy.tldr },
    { type: 'list', items: copy.bullets },
    { type: 'heading', level: 2, text: copy.anatomy },
    { type: 'paragraph', text: 'xAI workflow では still image が video の starting point になります。そのため prompt は motion より先に first-frame preservation を指定する必要があります。' },
    { type: 'table', headers: ['Layer', 'Instruction', 'Reason'], rows: [
      ['First-frame lock', 'Begin exactly from the attached image.', 'Keeps the source frame from becoming loose inspiration.'],
      ['Identity rules', 'Preserve face, product label, UI screen, hands, logo, and layout.', 'Prevents identity drift.'],
      ['Camera language', 'Use push-in, dolly, orbit, pan, rack focus, parallax.', 'Creates controllable movement.'],
      ['Motion beats', 'Add 1-3 timed movements.', 'Short clips need readable beats.'],
      ['Negative constraints', 'No new people, no scene cut, no generated captions.', 'Reduces common artifacts.'],
      ['Review check', 'Inspect identity, camera path, and text-safe space first.', 'Makes iteration specific.'],
    ] },
    { type: 'heading', level: 2, text: copy.scenario },
    { type: 'table', headers: ['Goal', 'Source image', 'Prompt focus', 'Check first'], rows: [
      ['Product reveal', 'Clean product still.', 'Orbit, reflection, label lock.', 'Logo distortion.'],
      ['Portrait teaser', 'Stable face crop.', 'Identity, breathing, push-in.', 'Face morphing.'],
      ['Social clip', 'Vertical layout with empty headline area.', 'Handheld drift, light sweep.', 'Generated captions.'],
      ['Cinematic scene', 'Depth between foreground and background.', 'Dolly, parallax, stable horizon.', 'Scene jump.'],
      ['UI showcase', 'Clear screen hierarchy.', 'Locked screen and reflection control.', 'Fake UI changes.'],
    ] },
    { type: 'heading', level: 2, text: copy.examples },
    { type: 'paragraph', text: 'Prompt blocks stay English-only so they can be copied directly into the video workflow.' },
    { type: 'image', src: promptLibraryImages.motionCase, alt: 'Cinematic still for camera motion', caption: 'This first-party prompt-library image matches dolly, parallax, light sweep, and focus-pull examples.' },
    { type: 'list', items: [...copyablePromptBlocks] },
    { type: 'heading', level: 2, text: copy.case1 },
    { type: 'paragraph', text: 'Keep the composition intact and add one camera path plus a few environmental beats.' },
    { type: 'list', items: [`Prompt: ${casePrompts.camera}`] },
    { type: 'heading', level: 2, text: copy.case2 },
    { type: 'image', src: promptLibraryImages.firstFrameCase, alt: 'Lifestyle still with camera LCD framing', caption: 'This first-party image makes first-frame preservation easy to explain because people, couch, LCD screen, and room layout all need stable roles.' },
    { type: 'paragraph', text: 'For lifestyle clips, name what the source image controls before adding small believable motion.' },
    { type: 'list', items: [`Prompt: ${casePrompts.firstFrame}`] },
    { type: 'heading', level: 2, text: copy.worked },
    { type: 'heading', level: 3, text: 'Brief' },
    { type: 'paragraph', text: 'A skincare bottle still needs a 6-second launch teaser. Bottle shape, label, cap color, and top headline space must stay stable.' },
    { type: 'heading', level: 3, text: 'Prompt version 1' },
    { type: 'list', items: ['Animate the attached skincare bottle image as a 6-second premium launch teaser. Begin exactly from the source frame. Preserve bottle shape, cap color, label position, shadow, and empty top-third headline space. Add a slow 15-degree camera orbit, soft rim-light sweep, subtle reflection movement on the bottle, and mild background parallax. No new text, no logo distortion, no extra objects, no scene cut.'] },
    { type: 'heading', level: 3, text: 'First revision' },
    { type: 'paragraph', text: 'If identity drifts, strengthen preservation and reduce motion. If the clip is flat, keep the frame lock and add one timed beat.' },
    { type: 'callout', title: 'Revision rule', text: 'Fix identity before motion, camera path before style, and text-safe space before effects.' },
    { type: 'heading', level: 2, text: copy.fixes },
    { type: 'table', headers: ['Failure mode', 'Fix first', 'Avoid'], rows: [
      ['Identity drift', 'Add first-frame lock and protected details.', 'More motion.'],
      ['Random camera', 'Use one clear camera verb.', 'Stacking every move.'],
      ['New objects', 'Add negative constraints.', 'New story beats.'],
      ['Broken text', 'Reserve clean space for editing.', 'Final captions in generation.'],
      ['Static clip', 'Add one timed beat.', 'Rewriting source role.'],
    ] },
    { type: 'heading', level: 2, text: copy.vogue },
    { type: 'paragraph', text: 'Use Vogue AI to build the still frame first, then pair that still with a concise motion prompt.' },
    { type: 'list', items: ['GPT Image 2 helps with instruction-heavy still cleanup.', 'Nano Banana helps quick image-to-image variations.', 'Midjourney helps cinematic mood and fashion framing.', 'Keep the video prompt shorter than the still-image prompt.', 'Save the source still and motion prompt together.'] },
    { type: 'heading', level: 2, text: 'FAQ' },
    ...copy.faq.flatMap((question) => [
      { type: 'heading' as const, level: 3 as const, text: question },
      { type: 'paragraph' as const, text: 'Focus on first-frame preservation, protected identity details, one camera move, and one specific revision layer before regenerating.' },
    ]),
  ];
};

export const grokImagine15ImageToVideoPromptGuideAutoBlogPost: BlogPostSource = {
  slug: 'grok-imagine-1-5-image-to-video-prompt-guide',
  date: '2026-06-04',
  updatedAt: '2026-06-04',
  author: 'Vogue AI Team',
  image: promptLibraryImages.hero,
  imageAlt: 'Tutorial thumbnail prompt-library image for an image-to-video prompt guide',
  articleType: 'tutorial',
  modelTags: ['vogue-ai', 'gpt-image-2', 'nano-banana', 'midjourney'],
  readingMinutes: 10,
  localizations: {
    en: {
      title: 'Grok Imagine 1.5 Image-to-Video Prompt Guide',
      summary:
        'A practical prompt guide for turning still images into controlled Grok Imagine 1.5 video prompts with camera language, first-frame planning, and copyable examples.',
      seoTitle: 'Grok Imagine 1.5 Image-to-Video Prompt Guide',
      seoDescription:
        'Learn how to write Grok Imagine 1.5 image-to-video prompts with first-frame locks, camera moves, copyable examples, and failure-mode fixes.',
      content: enContent,
    },
    zh: {
      title: 'Grok Imagine 1.5 图生视频提示词指南',
      summary: '用第一帧锁定、镜头语言和可复制示例，把静态图写成更可控的 Grok Imagine 1.5 视频提示词。',
      seoTitle: 'Grok Imagine 1.5 图生视频提示词指南',
      seoDescription: '学习 Grok Imagine 1.5 image-to-video prompts 的第一帧保护、镜头运动、可复制示例和失败修正。',
      content: localizedContent('zh'),
    },
    fr: {
      title: 'Guide des prompts Grok Imagine 1.5 image-to-video',
      summary: 'Un guide pratique pour transformer un still en prompt vidéo contrôlable avec première image, langage caméra et exemples copiables.',
      seoTitle: 'Guide Grok Imagine 1.5 image-to-video prompts',
      seoDescription: 'Apprenez à écrire des prompts Grok Imagine 1.5 image-to-video avec verrouillage de première image, mouvements caméra et corrections.',
      content: localizedContent('fr'),
    },
    ru: {
      title: 'Гайд по Grok Imagine 1.5 image-to-video prompts',
      summary: 'Практический guide для превращения still image в контролируемый video prompt с first-frame lock, camera language и примерами.',
      seoTitle: 'Grok Imagine 1.5 image-to-video prompt guide',
      seoDescription: 'Научитесь писать Grok Imagine 1.5 image-to-video prompts с first-frame lock, camera moves, примерами и исправлениями.',
      content: localizedContent('ru'),
    },
    pt: {
      title: 'Guia de prompts Grok Imagine 1.5 image-to-video',
      summary: 'Um guia prático para transformar uma still image em vídeo com primeiro quadro protegido, linguagem de câmera e exemplos copiáveis.',
      seoTitle: 'Guia Grok Imagine 1.5 image-to-video prompts',
      seoDescription: 'Aprenda prompts Grok Imagine 1.5 image-to-video com first-frame lock, movimentos de câmera, exemplos e correções.',
      content: localizedContent('pt'),
    },
    ja: {
      title: 'Grok Imagine 1.5 Image-to-Video Prompt ガイド',
      summary: 'still image を第一フレームとして守りながら、camera language とコピー可能な例で制御しやすい video prompt を作る実践ガイドです。',
      seoTitle: 'Grok Imagine 1.5 Image-to-Video Prompt ガイド',
      seoDescription: 'first-frame lock、camera moves、コピー可能な例、失敗修正で Grok Imagine 1.5 image-to-video prompts を学びます。',
      content: localizedContent('ja'),
    },
    ko: {
      title: 'Grok Imagine 1.5 Image-to-Video Prompt 가이드',
      summary: 'still image 를 첫 프레임으로 보호하고 camera language 와 복사용 예시로 제어 가능한 video prompt 를 만드는 실전 가이드입니다.',
      seoTitle: 'Grok Imagine 1.5 Image-to-Video Prompt 가이드',
      seoDescription: 'first-frame lock, camera moves, 복사용 예시, 실패 수정으로 Grok Imagine 1.5 image-to-video prompts 를 배웁니다.',
      content: localizedContent('ko'),
    },
  },
};
