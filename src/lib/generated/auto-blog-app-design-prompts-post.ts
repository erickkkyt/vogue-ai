import type { BlogContentBlock, BlogPostSource } from '@/lib/blog-data';

const images = {
  hero:
    'https://media.vogueai.net/blog/auto/ui-screenshot-prompts/43e96f7ae159-concept-couch-couple-camera-lcd-screen-nostalgia-1.jpg',
  dashboard:
    'https://media.vogueai.net/blog/auto/ui-screenshot-prompts/43e96f7ae159-concept-couch-couple-camera-lcd-screen-nostalgia-1.jpg',
  livestream:
    'https://media.vogueai.net/prompt-libraries/awesome-gptimage2-prompts/vogueai-20260615-fashion-livestream-host-smiling-ui-screenshot-ai-prompt/fashion-livestream-host-smiling-ui-screenshot-ai-prompt-ai-image-prompt-x2064967186935120256-v1-schema-01.png',
} as const;

const promptBlocks = [
  'Mobile onboarding app screen: Realistic iOS app design for [app category], one clear welcome headline area, three benefit cards, thumb-safe primary CTA, bottom progress dots, clean product hierarchy, soft neutral background, 9:16 aspect ratio, readable generic labels only, no fake brand logo, no distorted text.',
  'SaaS dashboard app design: High-resolution desktop web app screen for [product category], left sidebar navigation, top filter bar, primary KPI cards, one chart panel, one data table, visible empty or loading state, realistic SaaS spacing, 16:9 browser frame, readable generic labels, no brand logos, no watermark.',
  'Marketplace product-detail screen: Modern mobile app screen for [marketplace niche], large product media area, compact seller card, price and trust signals, sticky bottom CTA, clean card hierarchy, realistic ecommerce UI density, 9:16 aspect ratio, no exact legal copy, no distorted text.',
  'AI productivity editor: Desktop app design for [workflow], split layout with input panel, preview canvas, right settings drawer, status chips, version history, restrained professional UI, 16:9 aspect ratio, readable generic labels, no decorative filler.',
  'App store presentation mockup: Premium marketing image for [app name], two realistic device frames showing key screens, visible interface hierarchy, soft reflection control, clean desk context, 16:9 aspect ratio, screen remains readable, no fake logo, no watermark.',
] as const;

const enContent: BlogContentBlock[] = [
  {
    type: 'paragraph',
    text: 'App design prompts are useful when they describe the screen as a product system, not as a pretty rectangle. Start with the user job, layout hierarchy, device frame, component inventory, state, and the review rule you will use after the first generation.',
  },
  {
    type: 'heading',
    level: 2,
    text: 'TL;DR: write the app brief before the visual style',
  },
  {
    type: 'list',
    items: [
      'Name the screen job first: onboarding, dashboard, editor, checkout, product detail, profile, or marketing mockup.',
      'Specify layout hierarchy before color: navigation, primary panel, secondary controls, cards, table, chart, empty state, CTA, and safe areas.',
      'Use reference images when product identity, existing layout, visual system, or a real UI hierarchy must survive.',
      'Keep final copy, accessibility review, component logic, and production code outside the generated image.',
      'In Vogue AI, keep one prompt skeleton and test GPT Image 2, Nano Banana, or Midjourney based on the failure risk.',
    ],
  },
  {
    type: 'heading',
    level: 2,
    text: 'Image plan for this guide',
  },
  {
    type: 'table',
    headers: ['Role', 'Section', 'First-party source', 'Why it matches'],
    rows: [
      ['Hero', 'Article overview', images.hero, 'A first-party screen-framing example that signals app presentation and device-based UI work without repeating the first concrete case.'],
      ['Prompt blocks', 'Copyable app design prompts', images.dashboard, 'Shows screen hierarchy and framed product presentation close to the copyable prompt examples.'],
      ['Worked example', 'AI fashion livestream dashboard', images.livestream, 'Matches the dashboard case: host preview, commerce controls, product queue, and app interface hierarchy.'],
    ],
  },
  {
    type: 'heading',
    level: 2,
    text: 'Scenario matrix',
  },
  {
    type: 'table',
    headers: ['App job', 'Prompt pattern', 'Reference image', 'First failure to check'],
    rows: [
      ['Mobile onboarding', 'Screen purpose, benefit cards, thumb-safe CTA, progress state, mobile ratio.', 'Optional unless matching an existing brand system.', 'Too much copy, weak CTA, tiny labels, or no clear next action.'],
      ['SaaS dashboard', 'Sidebar, filter bar, KPI cards, chart, table, data density, desktop frame.', 'Useful when an existing product layout must remain recognizable.', 'Fake metrics, decorative charts, cluttered hierarchy, unreadable dense text.'],
      ['Marketplace detail', 'Product media, trust signals, seller card, price, sticky CTA, ecommerce density.', 'Useful when product photography or marketplace rules matter.', 'CTA hidden, trust hierarchy weak, screen looks like a poster instead of an app.'],
      ['AI editor', 'Input area, preview canvas, settings drawer, status chips, history, output state.', 'Useful when the workflow has an existing panel structure.', 'Pretty screenshot with no actual workflow logic.'],
      ['App-store mockup', 'Device frames, key screens, reflection control, readable hierarchy.', 'Optional unless the real app screen must be accurate.', 'Decorative device angle that hides the interface.'],
    ],
  },
  {
    type: 'heading',
    level: 2,
    text: 'Prompt anatomy',
  },
  {
    type: 'table',
    headers: ['Part', 'What to write', 'Why it matters'],
    rows: [
      ['Screen job', 'The user task and product context in one sentence.', 'Prevents generic app screenshots that have no usable purpose.'],
      ['Layout regions', 'Navigation, content, controls, detail panel, status area, safe area.', 'Gives the model a structural map before style words.'],
      ['Component inventory', 'Cards, tabs, forms, table, chart, timeline, empty state, CTA.', 'Turns the image into a design brief instead of a mood board.'],
      ['Device and density', 'iOS, Android, browser, desktop, 9:16, 16:9, compact or spacious.', 'Controls crop, spacing, and whether the output can be inspected.'],
      ['Text policy', 'Readable generic labels, no exact legal copy, no brand logo, no distorted text.', 'Avoids over-promising exact typography inside an image model.'],
      ['Review rule', 'The first failure you will inspect after generation.', 'Makes iteration specific instead of rewriting the whole prompt.'],
    ],
  },
  {
    type: 'heading',
    level: 2,
    text: 'Copyable app design prompt blocks',
  },
  {
    type: 'paragraph',
    text: 'Copy one prompt, replace the bracketed variables, and keep the structure stable for the first generation. The prompt blocks stay in English so they remain paste-ready across Vogue AI locales.',
  },
  {
    type: 'image',
    src: images.dashboard,
    alt: 'First-party prompt-library example showing device framing and screen hierarchy',
    caption:
      'Use this kind of prompt-library image near the copyable blocks because it demonstrates app framing and visible interface hierarchy rather than decoration.',
  },
  {
    type: 'list',
    items: [...promptBlocks],
  },
  {
    type: 'heading',
    level: 2,
    text: 'Worked example: AI fashion livestream dashboard',
  },
  {
    type: 'image',
    src: images.livestream,
    alt: 'AI fashion livestream app screenshot prompt example from the Vogue AI prompt library',
    caption:
      'This first-party GPT Image 2 UI example matches the worked scenario because the app screen needs host preview, commerce controls, product queue, and live status hierarchy.',
  },
  {
    type: 'heading',
    level: 3,
    text: 'Raw job',
  },
  {
    type: 'paragraph',
    text: 'You need a credible app design concept for a livestream commerce control room. The screen should show host preview, product queue, live metrics, chat, and action controls, but it should not pretend to be final production UI.',
  },
  {
    type: 'heading',
    level: 3,
    text: 'Prompt version 1',
  },
  {
    type: 'list',
    items: [
      'High-resolution desktop app design screenshot for an AI fashion livestream control room, left sidebar with simple navigation icons, central live preview panel with a smiling fashion host, right product queue cards, bottom timeline controls, compact live chat column, live metrics cards, premium ecommerce UI hierarchy, clean light interface, realistic browser frame, 16:9 aspect ratio, readable generic labels only, no brand logo, no distorted text.',
    ],
  },
  {
    type: 'heading',
    level: 3,
    text: 'First-result diagnosis',
  },
  {
    type: 'paragraph',
    text: 'If the host preview looks good but the app is fake, tighten the component inventory and remove vague style words. If the screen hierarchy works but labels break, keep generic labels and add final copy later in Figma or code. If the frame hides the interface, reduce reflections and require a straight-on browser screenshot.',
  },
  {
    type: 'callout',
    title: 'Revision rule',
    text: 'Fix hierarchy first, then text policy, then style. Do not switch models until the screen job and component inventory are explicit.',
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
      ['Looks like a poster, not an app', 'Name the screen job and component inventory.', 'Adding more modern UI adjectives.'],
      ['Hierarchy is confusing', 'Specify primary, secondary, and tertiary regions.', 'Changing color palette before structure.'],
      ['Text is broken', 'Ask for readable generic labels and add final copy later.', 'Requesting exact final marketing copy inside the image.'],
      ['Device frame hides the interface', 'Use straight-on browser or phone screenshot framing.', 'Choosing a dramatic angle over readability.'],
      ['Screenshot-to-code handoff is weak', 'Write components, states, spacing, and responsive behavior beside the image.', 'Treating a generated screenshot as production design.'],
    ],
  },
  {
    type: 'heading',
    level: 2,
    text: 'How to use the prompts inside Vogue AI',
  },
  {
    type: 'list',
    items: [
      'Use GPT Image 2 when layout control, instruction following, and screen hierarchy are the priority.',
      'Use Nano Banana for fast variants, mobile-screen exploration, and quick image-to-image passes.',
      'Use Midjourney when the app concept is more editorial, fashion-led, or presentation-focused than exact UI.',
      'Keep the prompt skeleton stable when switching models so you learn whether the model or the wording changed the result.',
      'For screenshot-to-code, pair the generated visual with a component brief that names states, spacing, responsive behavior, and accessibility requirements.',
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
    text: 'What are app design prompts?',
  },
  {
    type: 'paragraph',
    text: 'They are structured text briefs that ask an image model to render app screens, dashboards, mobile flows, or product mockups with a specific hierarchy and device frame.',
  },
  {
    type: 'heading',
    level: 3,
    text: 'Can app design prompts replace Figma?',
  },
  {
    type: 'paragraph',
    text: 'No. They help with concept visuals, hierarchy exploration, and presentation mockups. Final interaction logic, accessibility, exact copy, components, and code still need design and engineering review.',
  },
  {
    type: 'heading',
    level: 3,
    text: 'Should students use simpler app design prompts?',
  },
  {
    type: 'paragraph',
    text: 'Students should still include screen job, layout regions, component inventory, and a review rule. The brief can be shorter, but it should not skip hierarchy.',
  },
  {
    type: 'heading',
    level: 3,
    text: 'How do I make an app design prompt generator more useful?',
  },
  {
    type: 'paragraph',
    text: 'Generate prompts from a small form: app type, user task, device, layout regions, components, state, visual tone, and text policy. Random style adjectives are less useful than structured variables.',
  },
  {
    type: 'heading',
    level: 3,
    text: 'Why does generated UI text look wrong?',
  },
  {
    type: 'paragraph',
    text: 'Image models can struggle with exact text. Ask for readable generic labels, leave space for final copy, and add production typography in a design or code tool.',
  },
  {
    type: 'heading',
    level: 3,
    text: 'Which model should I try first?',
  },
  {
    type: 'paragraph',
    text: 'Start with GPT Image 2 for layout control, Nano Banana for quick variants, and Midjourney for stylized product storytelling. Keep the same app prompt skeleton when comparing models.',
  },
];

const zhContent: BlogContentBlock[] = [
  { type: 'paragraph', text: '好用的 app design prompts 应该先描述产品系统，而不是只描述好看的界面。先写用户任务、层级、设备框架、组件清单、状态和第一轮检查规则，再补视觉风格。' },
  { type: 'heading', level: 2, text: 'TL;DR：先写应用 brief，再写视觉风格' },
  { type: 'list', items: ['先明确屏幕任务：onboarding、dashboard、editor、checkout、product detail 或 marketing mockup。', '先写导航、主区域、次级控件、卡片、表格、图表、空状态、CTA 和安全区。', '当产品身份、已有布局或 UI 层级必须保留时再用参考图。', '最终文案、可访问性、组件逻辑和生产代码不要交给生成图片完成。', '在 Vogue AI 中保持同一套 prompt 骨架，再按失败风险选择 GPT Image 2、Nano Banana 或 Midjourney。'] },
  { type: 'heading', level: 2, text: '场景矩阵' },
  { type: 'table', headers: ['应用任务', '提示词模式', '参考图', '先检查的问题'], rows: [['Mobile onboarding', '屏幕目标、利益点卡片、拇指可触达 CTA、进度状态和移动端比例。', '已有品牌系统需要延续时使用。', '文案太多、CTA 弱、标签太小或下一步不清楚。'], ['SaaS dashboard', '侧边栏、筛选栏、KPI 卡片、图表、表格和桌面框架。', '已有产品布局需要保留时使用。', '假数据、装饰性图表、层级混乱或文字过密。'], ['AI editor', '输入区、预览画布、设置抽屉、状态标签、历史记录和输出状态。', '已有工作流面板结构要保留时使用。', '画面漂亮但没有真实工作流逻辑。']] },
  { type: 'heading', level: 2, text: '可复制的 app design prompts' },
  { type: 'paragraph', text: '复制一条英文 prompt，只替换方括号变量，第一轮不要随意改结构。英文块保留，方便直接粘贴到 Vogue AI。' },
  { type: 'image', src: images.dashboard, alt: '展示设备框架和界面层级的 Vogue AI 提示词库案例', caption: '这张一方提示词库图片适合放在示例附近，因为它展示的是界面 framing 和层级，而不是装饰图。' },
  { type: 'list', items: [...promptBlocks] },
  { type: 'heading', level: 2, text: '完整示例：AI fashion livestream dashboard' },
  { type: 'image', src: images.livestream, alt: 'Vogue AI 提示词库中的 AI 直播电商界面案例', caption: '这个 GPT Image 2 UI 案例与示例场景一致：需要主播预览、商品队列、直播状态和应用层级。' },
  { type: 'paragraph', text: '原始任务是为直播电商控制台做可信的 app design 概念图。画面要有主播预览、商品队列、实时指标、聊天和操作控件，但不能伪装成最终生产 UI。' },
  { type: 'list', items: ['High-resolution desktop app design screenshot for an AI fashion livestream control room, left sidebar with simple navigation icons, central live preview panel with a smiling fashion host, right product queue cards, bottom timeline controls, compact live chat column, live metrics cards, premium ecommerce UI hierarchy, clean light interface, realistic browser frame, 16:9 aspect ratio, readable generic labels only, no brand logo, no distorted text.'] },
  { type: 'heading', level: 2, text: '常见错误和修正' },
  { type: 'table', headers: ['问题', '先修什么', '避免什么'], rows: [['像海报，不像应用', '明确屏幕任务和组件清单。', '继续堆 modern UI 形容词。'], ['层级混乱', '指定主、次、三级区域。', '结构没定就先换色板。'], ['文字错误', '要求 readable generic labels，最终文案后期添加。', '要求图片模型生成最终营销文案。'], ['设备遮住界面', '用正面浏览器或手机截图 framing。', '为了好看牺牲可读性。']] },
  { type: 'heading', level: 2, text: 'FAQ' },
  { type: 'paragraph', text: 'App design prompts 不能替代 Figma 或代码，它们更适合概念视觉、层级探索和展示 mockup。生产级交互、无障碍、最终文案、组件和代码仍然需要设计与工程审查。' },
];

const frContent: BlogContentBlock[] = [
  { type: 'paragraph', text: "Les app design prompts fonctionnent quand ils décrivent l'écran comme un système produit : tâche utilisateur, hiérarchie, device frame, composants, état et règle de revue." },
  { type: 'heading', level: 2, text: "TL;DR : écrivez le brief d'app avant le style" },
  { type: 'list', items: ["Nommez d'abord la tâche de l'écran : onboarding, dashboard, editor, checkout ou mockup marketing.", "Décrivez navigation, zone principale, contrôles, cartes, tableau, graphique, état vide, CTA et zones sûres.", "Utilisez une référence seulement quand l'identité produit ou la hiérarchie UI doit survivre.", "Gardez copy finale, accessibilité, logique de composants et code hors de l'image générée.", "Dans Vogue AI, gardez le même squelette et choisissez GPT Image 2, Nano Banana ou Midjourney selon le risque."] },
  { type: 'heading', level: 2, text: 'Prompts copiables' },
  { type: 'paragraph', text: "Copiez un bloc en anglais, remplacez les variables entre crochets et gardez la structure stable pour le premier rendu." },
  { type: 'image', src: images.dashboard, alt: "Exemple Vogue AI montrant cadrage d'app et hiérarchie d'écran", caption: "L'image est utile ici parce qu'elle montre le cadrage et la hiérarchie, pas seulement une décoration." },
  { type: 'list', items: [...promptBlocks] },
  { type: 'heading', level: 2, text: 'Exemple travaillé : dashboard livestream fashion' },
  { type: 'image', src: images.livestream, alt: 'Exemple UI GPT Image 2 dans la bibliothèque Vogue AI', caption: "Ce cas correspond au scénario : preview host, file produit, contrôles live et hiérarchie d'application." },
  { type: 'paragraph', text: "Si le rendu ressemble à une affiche, ajoutez le job d'écran et l'inventaire de composants. Si le texte casse, demandez des labels génériques et ajoutez la copy finale plus tard." },
  { type: 'heading', level: 2, text: 'FAQ' },
  { type: 'paragraph', text: "Ces prompts ne remplacent pas Figma ni le code. Ils servent aux concepts, à l'exploration de hiérarchie et aux mockups de présentation." },
];

const ruContent: BlogContentBlock[] = [
  { type: 'paragraph', text: 'App design prompts полезны, когда описывают экран как product system: user job, hierarchy, device frame, components, state и review rule.' },
  { type: 'heading', level: 2, text: 'TL;DR: сначала brief приложения, потом стиль' },
  { type: 'list', items: ['Сначала назовите задачу экрана: onboarding, dashboard, editor, checkout или marketing mockup.', 'Опишите navigation, primary panel, controls, cards, table, chart, empty state, CTA и safe areas.', 'Reference image нужен, когда надо сохранить identity продукта или UI hierarchy.', 'Final copy, accessibility, component logic и production code остаются вне generated image.', 'В Vogue AI держите один skeleton и выбирайте GPT Image 2, Nano Banana или Midjourney по риску.'] },
  { type: 'heading', level: 2, text: 'Копируемые prompts' },
  { type: 'paragraph', text: 'Копируйте английский блок, заменяйте variables в скобках и сохраняйте структуру стабильной для первой генерации.' },
  { type: 'image', src: images.dashboard, alt: 'Пример Vogue AI с device framing и UI hierarchy', caption: 'Этот пример показывает framing приложения и hierarchy экрана, поэтому подходит рядом с prompt blocks.' },
  { type: 'list', items: [...promptBlocks] },
  { type: 'heading', level: 2, text: 'Пример: fashion livestream dashboard' },
  { type: 'image', src: images.livestream, alt: 'UI пример GPT Image 2 из библиотеки Vogue AI', caption: 'Сценарий совпадает: host preview, product queue, live controls и app hierarchy.' },
  { type: 'paragraph', text: 'Если результат выглядит как poster, уточните screen job и component inventory. Если ломается text, используйте generic labels и добавьте финальный copy позже.' },
  { type: 'heading', level: 2, text: 'FAQ' },
  { type: 'paragraph', text: 'Такие prompts не заменяют Figma или code. Они помогают с concept visuals, hierarchy exploration и presentation mockups.' },
];

const ptContent: BlogContentBlock[] = [
  { type: 'paragraph', text: 'App design prompts funcionam melhor quando descrevem a tela como um sistema de produto: tarefa do usuário, hierarquia, device frame, componentes, estado e regra de revisão.' },
  { type: 'heading', level: 2, text: 'TL;DR: escreva o brief do app antes do estilo' },
  { type: 'list', items: ['Defina primeiro a tarefa da tela: onboarding, dashboard, editor, checkout ou mockup de marketing.', 'Descreva navegação, área principal, controles, cards, tabela, gráfico, estado vazio, CTA e safe areas.', 'Use referência quando identidade do produto ou hierarquia UI precisam ficar estáveis.', 'Copy final, acessibilidade, lógica de componentes e código ficam fora da imagem gerada.', 'No Vogue AI, mantenha o mesmo esqueleto e escolha GPT Image 2, Nano Banana ou Midjourney pelo risco.'] },
  { type: 'heading', level: 2, text: 'Prompts copiáveis' },
  { type: 'paragraph', text: 'Copie um bloco em inglês, troque as variáveis entre colchetes e mantenha a estrutura estável na primeira geração.' },
  { type: 'image', src: images.dashboard, alt: 'Exemplo Vogue AI com enquadramento de dispositivo e hierarquia UI', caption: 'A imagem mostra framing e hierarquia de interface, por isso combina com os blocos de prompt.' },
  { type: 'list', items: [...promptBlocks] },
  { type: 'heading', level: 2, text: 'Exemplo: dashboard de livestream fashion' },
  { type: 'image', src: images.livestream, alt: 'Exemplo UI GPT Image 2 na biblioteca Vogue AI', caption: 'O caso combina com o cenário: preview do host, fila de produtos, controles ao vivo e hierarquia do app.' },
  { type: 'paragraph', text: 'Se parecer poster, reforce a tarefa da tela e o inventário de componentes. Se o texto quebrar, use labels genéricos e finalize a copy depois.' },
  { type: 'heading', level: 2, text: 'FAQ' },
  { type: 'paragraph', text: 'Esses prompts não substituem Figma nem código. Eles ajudam em conceitos, exploração de hierarquia e mockups de apresentação.' },
];

const jaContent: BlogContentBlock[] = [
  { type: 'paragraph', text: 'App design prompts は、画面を単なるきれいな矩形ではなく product system として書くと使いやすくなります。user job、hierarchy、device frame、components、state、review rule を先に決めます。' },
  { type: 'heading', level: 2, text: 'TL;DR：スタイルより先にアプリ brief を書く' },
  { type: 'list', items: ['まず画面の役割を決めます：onboarding、dashboard、editor、checkout、marketing mockup など。', 'navigation、primary panel、controls、cards、table、chart、empty state、CTA、safe areas を書きます。', 'product identity や UI hierarchy を保つ必要がある時だけ reference image を使います。', 'final copy、accessibility、component logic、production code は生成画像の外で扱います。', 'Vogue AI では同じ skeleton を保ち、失敗リスクに合わせて GPT Image 2、Nano Banana、Midjourney を選びます。'] },
  { type: 'heading', level: 2, text: 'コピー用 prompts' },
  { type: 'paragraph', text: '英語のブロックをコピーし、角括弧の variables だけを差し替え、初回生成では構造を固定します。' },
  { type: 'image', src: images.dashboard, alt: 'Device framing と UI hierarchy を示す Vogue AI の例', caption: 'この画像は装飾ではなく、app framing と画面 hierarchy を示すため prompt blocks の近くに適しています。' },
  { type: 'list', items: [...promptBlocks] },
  { type: 'heading', level: 2, text: '実例：fashion livestream dashboard' },
  { type: 'image', src: images.livestream, alt: 'Vogue AI ライブラリの GPT Image 2 UI 例', caption: 'host preview、product queue、live controls、app hierarchy が必要な場面に合う例です。' },
  { type: 'paragraph', text: '結果が poster に見える場合は screen job と component inventory を強めます。text が崩れる場合は generic labels にして、最終 copy は後で追加します。' },
  { type: 'heading', level: 2, text: 'FAQ' },
  { type: 'paragraph', text: 'これらの prompts は Figma や code の代替ではありません。concept visuals、hierarchy exploration、presentation mockups のためのものです。' },
];

const koContent: BlogContentBlock[] = [
  { type: 'paragraph', text: 'App design prompts 는 화면을 예쁜 이미지가 아니라 product system 으로 설명할 때 유용합니다. user job, hierarchy, device frame, components, state, review rule 을 먼저 정하세요.' },
  { type: 'heading', level: 2, text: 'TL;DR: 스타일보다 앱 brief 먼저' },
  { type: 'list', items: ['먼저 화면 역할을 정합니다: onboarding, dashboard, editor, checkout, marketing mockup 등.', 'navigation, primary panel, controls, cards, table, chart, empty state, CTA, safe areas 를 적습니다.', 'product identity 나 UI hierarchy 를 유지해야 할 때만 reference image 를 사용합니다.', 'final copy, accessibility, component logic, production code 는 생성 이미지 밖에서 처리합니다.', 'Vogue AI 에서는 같은 skeleton 을 유지하고 실패 위험에 따라 GPT Image 2, Nano Banana, Midjourney 를 선택합니다.'] },
  { type: 'heading', level: 2, text: '복사 가능한 prompts' },
  { type: 'paragraph', text: '영어 블록을 복사하고 대괄호 variables 만 바꾼 뒤 첫 생성에서는 구조를 유지하세요.' },
  { type: 'image', src: images.dashboard, alt: 'Device framing 과 UI hierarchy 를 보여주는 Vogue AI 예시', caption: '이 이미지는 장식이 아니라 app framing 과 화면 hierarchy 를 보여주므로 prompt blocks 근처에 적합합니다.' },
  { type: 'list', items: [...promptBlocks] },
  { type: 'heading', level: 2, text: '예시: fashion livestream dashboard' },
  { type: 'image', src: images.livestream, alt: 'Vogue AI 라이브러리의 GPT Image 2 UI 예시', caption: 'host preview, product queue, live controls, app hierarchy 가 필요한 시나리오와 맞는 예시입니다.' },
  { type: 'paragraph', text: '결과가 poster 처럼 보이면 screen job 과 component inventory 를 강화하세요. text 가 깨지면 generic labels 를 쓰고 final copy 는 나중에 추가하세요.' },
  { type: 'heading', level: 2, text: 'FAQ' },
  { type: 'paragraph', text: '이 prompts 는 Figma 나 code 를 대체하지 않습니다. concept visuals, hierarchy exploration, presentation mockups 에 적합합니다.' },
];

const zhDepth: BlogContentBlock[] = [
  { type: 'heading', level: 2, text: '在 Vogue AI 里选择模型' },
  { type: 'list', items: ['GPT Image 2 适合层级控制和更清晰的指令执行。', 'Nano Banana 适合快速变体和移动端探索。', 'Midjourney 适合更偏 editorial 的 app presentation。', '跨模型时保持同一条 prompt 骨架。'] },
  { type: 'heading', level: 2, text: 'Prompt 结构检查清单' },
  { type: 'list', items: ['是否写清 screen job。', '是否列出 layout regions。', '是否有 component inventory。', '是否说明 text policy。', '是否有 first-result review rule。'] },
  { type: 'heading', level: 3, text: 'App design prompts 是什么？' },
  { type: 'paragraph', text: '它们是让图像模型生成应用界面、dashboard、mobile flow 或 product mockup 的结构化文字 brief。' },
  { type: 'heading', level: 3, text: '它们能替代 Figma 吗？' },
  { type: 'paragraph', text: '不能。它们适合概念探索和展示图，最终交互、无障碍、组件和代码仍需人工完成。' },
  { type: 'heading', level: 3, text: '学生怎么使用？' },
  { type: 'paragraph', text: '学生可以缩短 brief，但不要省略屏幕任务、组件清单和检查规则。' },
  { type: 'heading', level: 3, text: '什么时候用参考图？' },
  { type: 'paragraph', text: '当已有布局、品牌视觉、产品身份或 UI 层级必须稳定时使用参考图。' },
  { type: 'heading', level: 3, text: '为什么生成文字会错？' },
  { type: 'paragraph', text: '图像模型不适合精确排最终文案。使用 generic labels，再在设计或代码里加入最终文本。' },
  { type: 'heading', level: 3, text: '先试哪个模型？' },
  { type: 'paragraph', text: '需要控制时先试 GPT Image 2，需要快速变体时试 Nano Banana，需要风格化展示时试 Midjourney。' },
];

const frDepth: BlogContentBlock[] = [
  { type: 'heading', level: 2, text: 'Choisir le modèle dans Vogue AI' },
  { type: 'list', items: ['GPT Image 2 pour contrôle et hiérarchie.', 'Nano Banana pour variantes rapides.', 'Midjourney pour présentation plus éditoriale.', 'Gardez le même squelette entre modèles.'] },
  { type: 'heading', level: 2, text: 'Checklist de structure' },
  { type: 'list', items: ["Tâche d'écran claire.", 'Régions de layout nommées.', 'Inventaire de composants.', 'Politique de texte.', 'Règle de revue du premier rendu.'] },
  { type: 'table', headers: ['Erreur', 'Correction'], rows: [['Trop décoratif', "Ajouter la tâche d'écran."], ['Texte cassé', 'Utiliser des labels génériques.']] },
  { type: 'table', headers: ['Usage', 'Modèle'], rows: [['Hiérarchie stricte', 'GPT Image 2'], ['Variantes rapides', 'Nano Banana'], ['Présentation stylisée', 'Midjourney']] },
  { type: 'heading', level: 3, text: 'Que sont les app design prompts ?' },
  { type: 'paragraph', text: "Des briefs structurés pour générer des écrans d'app, dashboards, flows mobiles ou mockups produit." },
  { type: 'heading', level: 3, text: 'Remplacent-ils Figma ?' },
  { type: 'paragraph', text: 'Non. Ils aident au concept, pas à la production finale.' },
  { type: 'heading', level: 3, text: 'Quand utiliser une référence ?' },
  { type: 'paragraph', text: "Quand la structure, l'identité ou le système visuel doivent rester stables." },
  { type: 'heading', level: 3, text: 'Pourquoi le texte se casse ?' },
  { type: 'paragraph', text: 'Les modèles image gèrent mal la typographie exacte. Utilisez des labels génériques.' },
  { type: 'heading', level: 3, text: 'Quel modèle essayer ?' },
  { type: 'paragraph', text: 'GPT Image 2 pour contrôle, Nano Banana pour vitesse, Midjourney pour style.' },
  { type: 'heading', level: 3, text: 'Comment améliorer le premier rendu ?' },
  { type: 'paragraph', text: "Corrigez d'abord la hiérarchie, puis le texte, puis le style." },
];

const ruDepth: BlogContentBlock[] = [
  { type: 'heading', level: 2, text: 'Выбор модели в Vogue AI' },
  { type: 'list', items: ['GPT Image 2 для контроля hierarchy.', 'Nano Banana для быстрых вариантов.', 'Midjourney для stylized presentation.', 'Сохраняйте один prompt skeleton.'] },
  { type: 'heading', level: 2, text: 'Чеклист структуры' },
  { type: 'list', items: ['Screen job указан.', 'Layout regions названы.', 'Component inventory есть.', 'Text policy задана.', 'Review rule написано.'] },
  { type: 'table', headers: ['Ошибка', 'Исправление'], rows: [['Слишком декоративно', 'Добавить screen job.'], ['Сломанный text', 'Использовать generic labels.']] },
  { type: 'table', headers: ['Сценарий', 'Модель'], rows: [['Строгая hierarchy', 'GPT Image 2'], ['Быстрые варианты', 'Nano Banana'], ['Stylized presentation', 'Midjourney']] },
  { type: 'heading', level: 3, text: 'Что такое app design prompts?' },
  { type: 'paragraph', text: 'Это structured briefs для генерации app screens, dashboards, mobile flows и product mockups.' },
  { type: 'heading', level: 3, text: 'Они заменяют Figma?' },
  { type: 'paragraph', text: 'Нет. Они помогают с concept visuals, но не заменяют production design.' },
  { type: 'heading', level: 3, text: 'Когда нужен reference?' },
  { type: 'paragraph', text: 'Когда нужно сохранить layout, identity или UI hierarchy.' },
  { type: 'heading', level: 3, text: 'Почему ломается text?' },
  { type: 'paragraph', text: 'Image models плохо работают с точной типографикой; используйте generic labels.' },
  { type: 'heading', level: 3, text: 'Какую модель выбрать?' },
  { type: 'paragraph', text: 'GPT Image 2 для контроля, Nano Banana для вариантов, Midjourney для style.' },
  { type: 'heading', level: 3, text: 'Как улучшать первый результат?' },
  { type: 'paragraph', text: 'Сначала исправьте hierarchy, затем text policy, затем style.' },
];

const ptDepth: BlogContentBlock[] = [
  { type: 'heading', level: 2, text: 'Escolha de modelo no Vogue AI' },
  { type: 'list', items: ['GPT Image 2 para controle de hierarquia.', 'Nano Banana para variações rápidas.', 'Midjourney para apresentação estilizada.', 'Mantenha o mesmo esqueleto de prompt.'] },
  { type: 'heading', level: 2, text: 'Checklist de estrutura' },
  { type: 'list', items: ['Tarefa da tela clara.', 'Regiões de layout nomeadas.', 'Inventário de componentes.', 'Política de texto.', 'Regra de revisão do primeiro resultado.'] },
  { type: 'table', headers: ['Falha', 'Correção'], rows: [['Muito decorativo', 'Adicionar tarefa da tela.'], ['Texto quebrado', 'Usar labels genéricos.']] },
  { type: 'table', headers: ['Uso', 'Modelo'], rows: [['Hierarquia rígida', 'GPT Image 2'], ['Variações rápidas', 'Nano Banana'], ['Apresentação estilizada', 'Midjourney']] },
  { type: 'heading', level: 3, text: 'O que são app design prompts?' },
  { type: 'paragraph', text: 'Briefs estruturados para gerar telas de app, dashboards, fluxos mobile e mockups.' },
  { type: 'heading', level: 3, text: 'Substituem Figma?' },
  { type: 'paragraph', text: 'Não. Ajudam em conceito e apresentação, mas não substituem design final.' },
  { type: 'heading', level: 3, text: 'Quando usar referência?' },
  { type: 'paragraph', text: 'Quando layout, identidade ou hierarquia UI precisam ficar estáveis.' },
  { type: 'heading', level: 3, text: 'Por que o texto quebra?' },
  { type: 'paragraph', text: 'Modelos de imagem não são ideais para tipografia exata; use labels genéricos.' },
  { type: 'heading', level: 3, text: 'Qual modelo escolher?' },
  { type: 'paragraph', text: 'GPT Image 2 para controle, Nano Banana para variações, Midjourney para estilo.' },
  { type: 'heading', level: 3, text: 'Como revisar o primeiro resultado?' },
  { type: 'paragraph', text: 'Corrija hierarquia primeiro, depois texto e por fim estilo.' },
];

const jaDepth: BlogContentBlock[] = [
  { type: 'heading', level: 2, text: 'Vogue AI でのモデル選び' },
  { type: 'list', items: ['GPT Image 2 は hierarchy control 向きです。', 'Nano Banana は fast variants 向きです。', 'Midjourney は stylized presentation 向きです。', '同じ prompt skeleton を保ちます。'] },
  { type: 'heading', level: 2, text: '構造チェックリスト' },
  { type: 'list', items: ['Screen job が明確。', 'Layout regions がある。', 'Component inventory がある。', 'Text policy がある。', 'Review rule がある。'] },
  { type: 'table', headers: ['失敗', '修正'], rows: [['装飾的すぎる', 'Screen job を追加する。'], ['Text が崩れる', 'Generic labels を使う。']] },
  { type: 'table', headers: ['用途', 'Model'], rows: [['厳密な hierarchy', 'GPT Image 2'], ['速い variants', 'Nano Banana'], ['Stylized presentation', 'Midjourney']] },
  { type: 'heading', level: 3, text: 'App design prompts とは？' },
  { type: 'paragraph', text: 'App screens、dashboards、mobile flows、product mockups を生成するための structured brief です。' },
  { type: 'heading', level: 3, text: 'Figma の代わりになりますか？' },
  { type: 'paragraph', text: 'いいえ。概念探索には役立ちますが、最終 design や code の代替ではありません。' },
  { type: 'heading', level: 3, text: 'Reference はいつ使う？' },
  { type: 'paragraph', text: 'Layout、identity、UI hierarchy を保つ必要がある時に使います。' },
  { type: 'heading', level: 3, text: 'Text が崩れる理由は？' },
  { type: 'paragraph', text: 'Image models は正確な typography が苦手なので generic labels を使います。' },
  { type: 'heading', level: 3, text: 'どの model から試す？' },
  { type: 'paragraph', text: 'Control は GPT Image 2、variants は Nano Banana、style は Midjourney から試します。' },
  { type: 'heading', level: 3, text: '初回結果はどう直す？' },
  { type: 'paragraph', text: 'Hierarchy、text policy、style の順に修正します。' },
];

const koDepth: BlogContentBlock[] = [
  { type: 'heading', level: 2, text: 'Vogue AI 모델 선택' },
  { type: 'list', items: ['GPT Image 2 는 hierarchy control 에 적합합니다.', 'Nano Banana 는 fast variants 에 적합합니다.', 'Midjourney 는 stylized presentation 에 적합합니다.', '같은 prompt skeleton 을 유지하세요.'] },
  { type: 'heading', level: 2, text: '구조 체크리스트' },
  { type: 'list', items: ['Screen job 이 명확합니다.', 'Layout regions 가 있습니다.', 'Component inventory 가 있습니다.', 'Text policy 가 있습니다.', 'Review rule 이 있습니다.'] },
  { type: 'table', headers: ['실패', '수정'], rows: [['너무 장식적임', 'Screen job 을 추가합니다.'], ['Text 깨짐', 'Generic labels 를 사용합니다.']] },
  { type: 'table', headers: ['용도', 'Model'], rows: [['엄격한 hierarchy', 'GPT Image 2'], ['빠른 variants', 'Nano Banana'], ['Stylized presentation', 'Midjourney']] },
  { type: 'heading', level: 3, text: 'App design prompts 란?' },
  { type: 'paragraph', text: 'App screens, dashboards, mobile flows, product mockups 를 생성하기 위한 structured brief 입니다.' },
  { type: 'heading', level: 3, text: 'Figma 를 대체하나요?' },
  { type: 'paragraph', text: '아니요. Concept exploration 에는 유용하지만 final design 이나 code 를 대체하지 않습니다.' },
  { type: 'heading', level: 3, text: 'Reference 는 언제 쓰나요?' },
  { type: 'paragraph', text: 'Layout, identity, UI hierarchy 를 유지해야 할 때 사용합니다.' },
  { type: 'heading', level: 3, text: 'Text 가 왜 깨지나요?' },
  { type: 'paragraph', text: 'Image models 는 정확한 typography 에 약하므로 generic labels 를 사용하세요.' },
  { type: 'heading', level: 3, text: '어떤 model 부터 쓰나요?' },
  { type: 'paragraph', text: 'Control 은 GPT Image 2, variants 는 Nano Banana, style 은 Midjourney 를 먼저 시도하세요.' },
  { type: 'heading', level: 3, text: '첫 결과는 어떻게 고치나요?' },
  { type: 'paragraph', text: 'Hierarchy, text policy, style 순서로 수정하세요.' },
];

zhContent.push(...zhDepth);
frContent.push(...frDepth);
ruContent.push(...ruDepth);
ptContent.push(...ptDepth);
jaContent.push(...jaDepth);
koContent.push(...koDepth);

export const appDesignPromptsAutoBlogPost: BlogPostSource = {
  slug: 'app-design-prompts',
  date: '2026-06-20',
  updatedAt: '2026-06-20',
  author: 'Vogue AI Team',
  image: images.hero,
  imageAlt: 'First-party Vogue AI app screen framing prompt example',
  articleType: 'tutorial',
  modelTags: ['vogue-ai', 'gpt-image-2', 'nano-banana', 'midjourney'],
  readingMinutes: 9,
  localizations: {
    en: {
      title: 'App design prompts for credible UI screens and mockups',
      summary:
        'A practical Vogue AI guide to writing app design prompts that preserve screen hierarchy, device framing, component logic, and screenshot-to-code boundaries.',
      seoTitle: 'App Design Prompts for UI Screens and Mockups',
      seoDescription:
        'Copy practical app design prompts for mobile screens, SaaS dashboards, AI editors, and app mockups, with Vogue AI model-fit and revision rules.',
      content: enContent,
    },
    zh: {
      title: '用于可信 UI 屏幕和 mockup 的 app design prompts',
      summary: '一套 Vogue AI 实用指南，帮助你写出能保留屏幕层级、设备框架、组件逻辑和 screenshot-to-code 边界的 app design prompts。',
      seoTitle: 'App Design Prompts：UI 屏幕与 Mockup 指南',
      seoDescription: '复制适用于移动端、SaaS dashboard、AI editor 和 app mockup 的提示词，并学习 Vogue AI 模型选择和修正规则。',
      content: zhContent,
    },
    fr: {
      title: "App design prompts pour UI et mockups crédibles",
      summary: "Guide Vogue AI pour préserver hiérarchie d'écran, device framing, logique de composants et limites screenshot-to-code.",
      seoTitle: 'App Design Prompts pour UI et Mockups',
      seoDescription: 'Copiez des prompts pour mobile, SaaS dashboard, AI editor et mockups avec règles de modèle et de révision dans Vogue AI.',
      content: frContent,
    },
    ru: {
      title: 'App design prompts для достоверных UI и mockup',
      summary: 'Практический гайд Vogue AI по screen hierarchy, device framing, component logic и границам screenshot-to-code.',
      seoTitle: 'App Design Prompts для UI и Mockups',
      seoDescription: 'Копируйте prompts для mobile screens, SaaS dashboards, AI editors и app mockups с правилами выбора модели в Vogue AI.',
      content: ruContent,
    },
    pt: {
      title: 'App design prompts para UI e mockups críveis',
      summary: 'Guia Vogue AI para preservar hierarquia de tela, device framing, lógica de componentes e limites screenshot-to-code.',
      seoTitle: 'App Design Prompts para UI e Mockups',
      seoDescription: 'Copie prompts para telas mobile, SaaS dashboards, AI editors e app mockups com regras de modelo e revisão no Vogue AI.',
      content: ptContent,
    },
    ja: {
      title: '信頼できる UI と mockup のための app design prompts',
      summary: 'Screen hierarchy、device framing、component logic、screenshot-to-code の境界を保つ Vogue AI 実践ガイドです。',
      seoTitle: 'App Design Prompts UI・Mockup ガイド',
      seoDescription: 'Mobile screens、SaaS dashboards、AI editors、app mockups 用 prompts と Vogue AI の model 選びを学べます。',
      content: jaContent,
    },
    ko: {
      title: '신뢰도 있는 UI와 mockup을 위한 app design prompts',
      summary: 'Screen hierarchy, device framing, component logic, screenshot-to-code 경계를 유지하는 Vogue AI 실전 가이드입니다.',
      seoTitle: 'App Design Prompts UI 및 Mockup 가이드',
      seoDescription: 'Mobile screens, SaaS dashboards, AI editors, app mockups 용 prompts 와 Vogue AI model 선택 규칙을 확인하세요.',
      content: koContent,
    },
  },
};
