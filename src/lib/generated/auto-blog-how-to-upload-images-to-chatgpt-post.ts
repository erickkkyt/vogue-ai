import type { BlogContentBlock, BlogPostSource } from '@/lib/blog-data';

const articleImages = {
  hero:
    'https://media.vogueai.net/blog/auto/text-to-image-prompts/1ffce010c78e-use-my-uploaded-image-as-face-reference-1.jpg',
  inline:
    'https://media.vogueai.net/prompt-libraries/awesome-gptimage2-prompts/x-2055485138080014769/create-premium-square-reference-style-consumer-technology-1.jpg',
} as const;

const uploadFollowUpPrompts = [
  'Describe exactly what is happening in this image, including subject, lighting, camera angle, background, and the strongest visual style cues.',
  'Turn this image into a reusable prompt template with fixed details, variable fields, and a negative-prompt section.',
  'List what should stay unchanged if I want to regenerate this image in another style or aspect ratio.',
  'Write three improved prompts: one for a product hero, one for a social poster, and one for a portrait-style campaign image.',
  'Tell me which parts are better handled later in Vogue AI instead of inside ChatGPT.',
] as const;

const beforeUploadRows = [
  ['Image goal', 'Know whether you want analysis, prompt extraction, editing guidance, or a reference-image handoff.', 'A clear goal changes the first question you send after the upload.'],
  ['Device and plan', 'Check whether your current ChatGPT account and device surface expose image upload in the composer.', 'Many failures come from the wrong surface, not from the image itself.'],
  ['Source quality', 'Use a clean image where the main subject is visible and the key detail is not hidden.', 'ChatGPT can describe a messy photo, but the prompt you extract will be weaker.'],
  ['What must stay fixed', 'Decide which parts are identity-critical: face, packaging, palette, logo placement, or UI structure.', 'This becomes the reference-image rule for the next tool step.'],
] as const;

const handoffRows = [
  ['Simple explanation or OCR help', 'Stay in ChatGPT and ask for a cleaner description, caption, or scene breakdown.', 'Useful when you only need understanding, not a styled visual output.'],
  ['Reusable image prompt', 'Ask ChatGPT to separate fixed details, variables, and negative constraints.', 'That structure turns one upload into a repeatable prompt brief.'],
  ['Styled generation or multi-model comparison', 'Move the cleaned prompt into Vogue AI and test it in GPT Image 2, Nano Banana, or Midjourney.', 'Vogue AI is the better execution surface once you need visual output, variants, or prompt-library comparison.'],
  ['Reference-image workflow', 'Keep the uploaded-image constraints, then tell Vogue AI what can change and what must stay locked.', 'This is the cleanest path for product truth, face identity, or UI preservation.'],
] as const;

const problemRows = [
  ['The upload button is missing', 'Check the model surface, account plan, and whether your current device composer supports image upload.', 'Rewriting the prompt before confirming the product surface.'],
  ['ChatGPT only gives a shallow description', 'Ask for structure: subject, composition, lighting, style cues, fixed details, variables, and negative constraints.', 'A single vague question like "make this a prompt".'],
  ['The extracted prompt keeps drifting from the original photo', 'Tell it what must stay fixed and what is allowed to change, then use that as the reference rule in Vogue AI.', 'Adding more style adjectives before identity is protected.'],
  ['You need multiple visual versions from one upload', 'Move the cleaned prompt into Vogue AI and compare model outputs there.', 'Trying to turn ChatGPT into the full execution workspace.'],
  ['The output needs clean marketing composition', 'Ask ChatGPT for a tighter production brief, then generate in Vogue AI with the correct aspect ratio and model.', 'Staying inside a conversational answer when the next job is image production.'],
] as const;

type LocalizedCopy = {
  title: string,
  summary: string,
  seoTitle: string,
  seoDescription: string,
  intro: string,
  tlDrHeading: string,
  tlDrItems: string[],
  uploadMeaningHeading: string,
  uploadMeaningParagraph: string,
  uploadMeaningItems: string[],
  beforeUploadHeading: string,
  beforeUploadHeaders: string[],
  desktopHeading: string,
  desktopSteps: string[],
  mobileHeading: string,
  mobileSteps: string[],
  askAfterUploadHeading: string,
  askAfterUploadParagraph: string,
  imageCaption: string,
  handoffHeading: string,
  handoffHeaders: string[],
  workedExampleHeading: string,
  rawRequestHeading: string,
  rawRequestParagraph: string,
  followUpHeading: string,
  moveToVogueHeading: string,
  moveToVogueParagraph: string,
  ruleTitle: string,
  ruleText: string,
  stayVsMoveHeading: string,
  stayVsMoveItems: string[],
  problemsHeading: string,
  problemHeaders: string[],
  faqQuestions: Array<{ question: string, answer: string }>,
};

function buildContent(copy: LocalizedCopy): BlogContentBlock[] {
  return [
    {
      type: 'paragraph',
      text: copy.intro,
    },
    {
      type: 'heading',
      level: 2,
      text: copy.tlDrHeading,
    },
    {
      type: 'list',
      items: copy.tlDrItems,
    },
    {
      type: 'heading',
      level: 2,
      text: copy.uploadMeaningHeading,
    },
    {
      type: 'paragraph',
      text: copy.uploadMeaningParagraph,
    },
    {
      type: 'list',
      items: copy.uploadMeaningItems,
    },
    {
      type: 'heading',
      level: 2,
      text: copy.beforeUploadHeading,
    },
    {
      type: 'table',
      headers: copy.beforeUploadHeaders,
      rows: beforeUploadRows.map((row) => [...row]),
    },
    {
      type: 'heading',
      level: 2,
      text: copy.desktopHeading,
    },
    {
      type: 'list',
      items: copy.desktopSteps,
    },
    {
      type: 'heading',
      level: 2,
      text: copy.mobileHeading,
    },
    {
      type: 'list',
      items: copy.mobileSteps,
    },
    {
      type: 'heading',
      level: 2,
      text: copy.askAfterUploadHeading,
    },
    {
      type: 'paragraph',
      text: copy.askAfterUploadParagraph,
    },
    {
      type: 'list',
      items: [...uploadFollowUpPrompts],
    },
    {
      type: 'image',
      src: articleImages.hero,
      alt: 'Reference-image example from the Vogue AI prompt library',
      caption: copy.imageCaption,
    },
    {
      type: 'heading',
      level: 2,
      text: copy.handoffHeading,
    },
    {
      type: 'table',
      headers: copy.handoffHeaders,
      rows: handoffRows.map((row) => [...row]),
    },
    {
      type: 'heading',
      level: 2,
      text: copy.workedExampleHeading,
    },
    {
      type: 'heading',
      level: 3,
      text: copy.rawRequestHeading,
    },
    {
      type: 'paragraph',
      text: copy.rawRequestParagraph,
    },
    {
      type: 'heading',
      level: 3,
      text: copy.followUpHeading,
    },
    {
      type: 'list',
      items: [
        'Tell me the product details that must stay fixed if I regenerate this image in another style.',
        'Convert the image into a clean prompt with subject, composition, lighting, style, output rules, and negative constraints.',
        'Write one prompt for a product hero, one for a social poster, and one for a 4:5 campaign visual.',
        'List the variables I can swap without breaking the identity of the original image.',
      ],
    },
    {
      type: 'heading',
      level: 3,
      text: copy.moveToVogueHeading,
    },
    {
      type: 'paragraph',
      text: copy.moveToVogueParagraph,
    },
    {
      type: 'image',
      src: articleImages.inline,
      alt: 'Prompt-library image that fits a cleaned reference-led workflow',
      caption:
        'After ChatGPT gives you a cleaner prompt brief, use Vogue AI to compare model behavior, aspect ratios, and reference-image handling with real visual output.',
    },
    {
      type: 'callout',
      title: copy.ruleTitle,
      text: copy.ruleText,
    },
    {
      type: 'heading',
      level: 2,
      text: copy.stayVsMoveHeading,
    },
    {
      type: 'list',
      items: copy.stayVsMoveItems,
    },
    {
      type: 'heading',
      level: 2,
      text: copy.problemsHeading,
    },
    {
      type: 'table',
      headers: copy.problemHeaders,
      rows: problemRows.map((row) => [...row]),
    },
    {
      type: 'heading',
      level: 2,
      text: 'FAQ',
    },
    ...copy.faqQuestions.flatMap((item) => [
      {
        type: 'heading' as const,
        level: 3 as const,
        text: item.question,
      },
      {
        type: 'paragraph' as const,
        text: item.answer,
      },
    ]),
  ];
}

const enCopy: LocalizedCopy = {
  title: 'How to upload images to ChatGPT and turn them into a Vogue AI workflow',
  summary:
    'A practical guide to uploading images to ChatGPT, extracting a reusable prompt, and moving the result into Vogue AI for styled generation.',
  seoTitle: 'How to Upload Images to ChatGPT',
  seoDescription:
    'Learn how to upload images to ChatGPT, what to ask after the upload, and when to move the result into Vogue AI for real image generation.',
  intro:
    'Uploading an image to ChatGPT is useful when you need analysis, prompt extraction, OCR help, or a cleaner description of what you want to generate next. It becomes much more valuable when you treat the upload as the first step in a workflow: inspect the photo, extract the fixed details, then move the cleaned prompt into Vogue AI for styled generation and model comparison.',
  tlDrHeading: 'TL;DR: upload first, then ask for structure',
  tlDrItems: [
    'Use ChatGPT image upload to analyze, describe, or reverse-engineer a photo before you try to regenerate it.',
    'After the upload, ask for fixed details, variable fields, negative constraints, and prompt-ready structure instead of a generic summary.',
    'Use ChatGPT for understanding and prompt cleanup; use Vogue AI when you need actual image generation, model choice, and repeatable variants.',
    'If identity matters, state what must stay locked: face, packaging, palette, logo placement, or UI hierarchy.',
    'A strong handoff turns one photo into a reusable prompt system rather than a one-off description.',
  ],
  uploadMeaningHeading: 'What uploading an image to ChatGPT actually gives you',
  uploadMeaningParagraph:
    'The upload itself does not magically produce a better final visual. What it gives you is a better understanding layer. ChatGPT can inspect the image, name the important details, and rewrite those details into a cleaner brief that travels well into Vogue AI.',
  uploadMeaningItems: [
    'Good use: scene analysis, OCR, captioning, reverse prompting, structured prompt extraction, and reference-image planning.',
    'Weak use: expecting ChatGPT alone to become your full image-production workspace.',
    'Best next step: convert the description into a reusable prompt brief before you switch tools.',
  ],
  beforeUploadHeading: 'Before you upload anything',
  beforeUploadHeaders: ['Check', 'What to confirm', 'Why it matters'],
  desktopHeading: 'Desktop workflow',
  desktopSteps: [
    'Open the ChatGPT surface where your account already exposes image upload in the composer.',
    'Attach the image first, then explain the job in one line: analyze, extract a prompt, describe the scene, or help me recreate this in another style.',
    'Ask for structure, not just description: subject, composition, lighting, style cues, fixed details, variables, and negative constraints.',
    'If the answer is too vague, ask for three prompt versions tied to three different jobs instead of asking for more adjectives.',
  ],
  mobileHeading: 'Mobile workflow',
  mobileSteps: [
    'Use the image-attachment entry point in the mobile composer, then verify the image preview before sending the message.',
    'Keep the first request short so ChatGPT focuses on the uploaded photo instead of wandering into generic advice.',
    'If you need multiple results, ask for a clean prompt template you can paste into Vogue AI later.',
    'For product or face identity, explicitly tell ChatGPT which visual details must remain unchanged.',
  ],
  askAfterUploadHeading: 'What to ask right after the upload',
  askAfterUploadParagraph:
    'The fastest mistake is asking only "make this into a prompt." Ask for a reusable structure instead. These follow-up prompts are meant to convert the uploaded image into something you can actually use.',
  imageCaption:
    'Reference-led prompts work best when the upload is treated as a constraint source: preserve identity first, then adjust style, lighting, and composition around it.',
  handoffHeading: 'Turn one uploaded image into a reusable Vogue AI brief',
  handoffHeaders: ['Goal', 'What to ask ChatGPT for', 'When to move into Vogue AI'],
  workedExampleHeading: 'Worked example: upload a product photo and extract a better prompt',
  rawRequestHeading: 'Raw upload request',
  rawRequestParagraph:
    'Imagine you uploaded a product photo of a matte aluminum bottle and asked ChatGPT to help you recreate it for a launch campaign. The first job is not "make it prettier." The first job is to identify what is fixed: silhouette, cap color, label zone, and the angle that makes the bottle feel premium.',
  followUpHeading: 'Follow-up prompts to send',
  moveToVogueHeading: 'What to move into Vogue AI',
  moveToVogueParagraph:
    'Once ChatGPT has separated fixed details from changeable variables, move the cleaned brief into Vogue AI. There you can test GPT Image 2 for control, Nano Banana for faster variation, or Midjourney for more stylized exploration while keeping the reference-image instructions intact.',
  ruleTitle: 'Workflow rule',
  ruleText:
    'Use ChatGPT to clarify the brief. Use Vogue AI to generate, compare, and iterate. If you ask one tool to do both jobs at once, the workflow usually gets slower and less predictable.',
  stayVsMoveHeading: 'When to stay in ChatGPT and when to move to Vogue AI',
  stayVsMoveItems: [
    'Stay in ChatGPT when you still need explanation, OCR, scene breakdown, or a cleaner prompt structure.',
    'Move to Vogue AI when you need image output, model comparison, prompt-library references, or multiple usable variations.',
    'Stay in ChatGPT if you are still deciding what must remain fixed in the reference image.',
    'Move to Vogue AI as soon as the brief is clear enough to test across aspect ratios, styles, or models.',
  ],
  problemsHeading: 'Common problems and fixes',
  problemHeaders: ['Problem', 'Fix first', 'Do not start with'],
  faqQuestions: [
    {
      question: 'Can everyone upload images to ChatGPT?',
      answer:
        'That depends on the product surface and account plan exposed on your device. If the upload control is missing, confirm the current model surface before assuming the photo itself is the issue.',
    },
    {
      question: 'Should I ask for a caption or for a prompt?',
      answer:
        'Ask for a structured prompt if your next step is generation. Ask for a caption or explanation only when understanding is the final goal.',
    },
    {
      question: 'What if I want to preserve a face or product exactly?',
      answer:
        'Tell ChatGPT which details are non-negotiable, then carry that rule into the reference-image step in Vogue AI. Identity protection works better when the constraints are explicit.',
    },
    {
      question: 'When is ChatGPT enough by itself?',
      answer:
        'It is enough when you only need interpretation, extraction, or rewriting. It is usually not enough when you need repeatable styled outputs, model comparison, or asset-ready variations.',
    },
    {
      question: 'Why move the result into Vogue AI after the upload?',
      answer:
        'Because Vogue AI is the execution surface. It lets you test the cleaned prompt across real image models, compare results, and keep the workflow tied to prompt-library references.',
    },
    {
      question: 'What is the best follow-up question after I upload a photo?',
      answer:
        'Ask ChatGPT to separate fixed details, variables, and negative constraints. That gives you a reusable prompt brief instead of a one-time description.',
    },
  ],
};

const zhCopy: LocalizedCopy = {
  title: '如何把图片上传到 ChatGPT，并接成一条 Vogue AI 工作流',
  summary:
    '这是一份实用指南：先把图片传给 ChatGPT，再提取可复用提示词，最后把结果接到 Vogue AI 做真实出图。',
  seoTitle: '如何把图片上传到 ChatGPT',
  seoDescription:
    '了解如何把图片上传到 ChatGPT、上传后该怎么追问，以及什么时候把结果接到 Vogue AI 做真实图像生成。',
  intro:
    '把图片上传到 ChatGPT，本质上最适合做的是分析、OCR、反向拆 prompt，或者把你下一步要生成的视觉需求说得更清楚。真正高价值的路径不是停在 ChatGPT 里，而是把上传当成工作流第一步：先看图、提炼固定约束，再把整理过的 brief 交给 Vogue AI 去做风格化生成和多模型对比。',
  tlDrHeading: 'TL;DR：先上传，再追问结构',
  tlDrItems: [
    '用 ChatGPT 上传图片，最适合先做分析、拆解和反向提取 prompt。',
    '上传之后，不要只让它“总结一下”，而要让它输出固定元素、可替换变量、负面约束和 prompt 结构。',
    'ChatGPT 适合理解问题和整理 brief；Vogue AI 适合真正出图、选模型和做批量变体。',
    '如果身份保真很重要，要明确哪些部分必须锁死：人脸、包装、配色、logo 位置或 UI 层级。',
    '一张图真正有价值的终点，是变成一套可复用 prompt system，而不是一次性描述。',
  ],
  uploadMeaningHeading: '把图片上传到 ChatGPT，到底能得到什么',
  uploadMeaningParagraph:
    '上传本身不会自动让最终视觉更好，但它会给你一层“理解能力”。ChatGPT 可以先帮你识别主体、光线、构图和风格线索，再把这些信息改写成更适合转到 Vogue AI 的结构化 brief。',
  uploadMeaningItems: [
    '适合的用途：场景分析、OCR、caption、reverse prompting、结构化 prompt 提取、reference-image 规划。',
    '不适合的预期：把 ChatGPT 直接当成完整的出图工作台。',
    '更好的下一步：先把描述整理成可复用 prompt brief，再换到真正的图像执行层。',
  ],
  beforeUploadHeading: '上传前先确认什么',
  beforeUploadHeaders: ['检查项', '先确认什么', '为什么重要'],
  desktopHeading: '桌面端流程',
  desktopSteps: [
    '先确认你当前的 ChatGPT surface 已经在输入框里开放图片上传入口。',
    '先传图，再用一句话说明任务：分析、提取 prompt、描述场景，还是帮我改写成另一种风格。',
    '要求它输出结构，而不只是描述：主体、构图、光线、风格线索、固定元素、变量和负面约束。',
    '如果回答太虚，就让它分别给三种具体任务版本，而不是继续堆形容词。',
  ],
  mobileHeading: '移动端流程',
  mobileSteps: [
    '在移动端输入框里通过图片入口附图，并确认预览已经正确加载。',
    '第一句请求尽量短，让 ChatGPT 先聚焦这张图，而不是跑去给泛化建议。',
    '如果后面还要真正出图，优先让它输出可复制的 prompt template。',
    '如果是产品或人脸保真任务，明确说出哪些视觉细节不能变。',
  ],
  askAfterUploadHeading: '上传之后最该怎么追问',
  askAfterUploadParagraph:
    '最常见的低效问法是“把这张图变成一个 prompt”。更高效的问法，是让它给你一套可复用结构。下面这些 follow-up prompts 的目标，就是把一张上传图变成真正能落地的执行 brief。',
  imageCaption:
    'reference-led prompt 最稳的用法，是把上传图当成约束来源：先保住 identity，再去改风格、光线和构图。',
  handoffHeading: '把一张上传图变成可复用的 Vogue AI brief',
  handoffHeaders: ['目标', '让 ChatGPT 输出什么', '什么时候切到 Vogue AI'],
  workedExampleHeading: 'Worked example：上传一张产品图，提取更好的 prompt',
  rawRequestHeading: '原始上传请求',
  rawRequestParagraph:
    '假设你上传的是一张磨砂铝制水瓶照片，想把它改成 launch campaign 视觉。第一步不是“让它更高级”，而是先确认什么必须不变：瓶身轮廓、瓶盖颜色、标签区域，以及让它看起来更 premium 的机位。',
  followUpHeading: '上传后继续追问的 prompt',
  moveToVogueHeading: '哪些内容该带进 Vogue AI',
  moveToVogueParagraph:
    '当 ChatGPT 已经把固定元素和可变变量拆开以后，就该把整理过的 brief 交给 Vogue AI。你可以在里面用 GPT Image 2 做更强控制，用 Nano Banana 做更快变体，或者用 Midjourney 做更偏风格化的探索，同时保留 reference-image 约束。',
  ruleTitle: '工作流规则',
  ruleText:
    '让 ChatGPT 负责“说清楚 brief”，让 Vogue AI 负责“真正执行图像生成、对比和迭代”。如果一个工具同时承担两份工作，通常会更慢也更不稳定。',
  stayVsMoveHeading: '什么时候留在 ChatGPT，什么时候切到 Vogue AI',
  stayVsMoveItems: [
    '还在做说明、OCR、场景拆解或 prompt 清洗时，先留在 ChatGPT。',
    '需要真实出图、选模型、看 prompt-library 参考或批量做变体时，切到 Vogue AI。',
    '如果你还没想清楚 reference image 里什么必须锁定，先继续在 ChatGPT 里梳理。',
    '一旦 brief 已经足够清楚，可以开始测试画幅、风格和模型时，就应该转去 Vogue AI。',
  ],
  problemsHeading: '常见问题与修法',
  problemHeaders: ['问题', '先修什么', '不要先做什么'],
  faqQuestions: [
    {
      question: '是不是所有人都能把图片上传到 ChatGPT？',
      answer:
        '这取决于你当前设备上的产品 surface 和账号能力。如果上传入口不见了，先确认当前模型表面和账号权限，而不是先怀疑图片本身。',
    },
    {
      question: '我应该让它写 caption，还是直接写 prompt？',
      answer:
        '如果下一步是出图，就让它写结构化 prompt；如果最终目标只是理解图片内容，caption 或解释就够了。',
    },
    {
      question: '如果我要严格保住人脸或产品外观怎么办？',
      answer:
        '直接告诉 ChatGPT 哪些细节不能动，然后把这条规则一起带到 Vogue AI 的 reference-image 步骤里。约束写明后，保真会稳定很多。',
    },
    {
      question: '什么时候只用 ChatGPT 就够了？',
      answer:
        '当你只需要解释、提取信息或整理文字时就够了；当你需要可重复出图、模型对比或可投放变体时，通常就不够了。',
    },
    {
      question: '为什么上传之后还要切到 Vogue AI？',
      answer:
        '因为 Vogue AI 是执行层。它可以把整理好的 prompt 放到真实图像模型里测试、对比结果，并和 prompt library 的案例联动起来。',
    },
    {
      question: '上传图片后最值得问的一句是什么？',
      answer:
        '让它把固定元素、可变变量和负面约束拆开。这样你拿到的是可复用 prompt brief，而不是一次性的图像描述。',
    },
  ],
};

const frCopy: LocalizedCopy = {
  title: 'Comment envoyer des images à ChatGPT puis continuer dans Vogue AI',
  summary:
    'Un guide pratique pour envoyer une image à ChatGPT, en extraire un prompt réutilisable, puis continuer le travail dans Vogue AI.',
  seoTitle: 'Comment envoyer des images à ChatGPT',
  seoDescription:
    'Découvrez comment envoyer une image à ChatGPT, quoi demander ensuite, et quand transférer le résultat dans Vogue AI pour la génération visuelle.',
  intro:
    "Envoyer une image à ChatGPT sert surtout à analyser, lire du texte, extraire un prompt ou clarifier ce que l'on veut générer ensuite. Le vrai gain arrive quand l'upload devient la première étape d'un workflow : comprendre l'image, isoler les contraintes fixes, puis transférer le brief nettoyé dans Vogue AI pour la génération et la comparaison de modèles.",
  tlDrHeading: 'TL;DR : téléchargez d’abord, demandez la structure ensuite',
  tlDrItems: [
    "Utilisez l’upload d’image dans ChatGPT pour analyser, décrire ou inverser une photo avant de la régénérer.",
    'Après l’upload, demandez les éléments fixes, les variables, les contraintes négatives et une structure de prompt prête à réutiliser.',
    'ChatGPT sert à comprendre et nettoyer le brief ; Vogue AI sert à vraiment générer, comparer les modèles et produire des variantes.',
    "Si l'identité doit rester stable, dites clairement ce qui doit rester verrouillé.",
    'Le meilleur résultat est de transformer une photo en système de prompt réutilisable.',
  ],
  uploadMeaningHeading: "Ce que l’upload d’image dans ChatGPT vous donne réellement",
  uploadMeaningParagraph:
    "L’upload ne produit pas automatiquement une meilleure image finale. Il vous apporte surtout une couche d'analyse. ChatGPT peut nommer les détails importants, puis les réécrire dans un brief plus propre à faire circuler vers Vogue AI.",
  uploadMeaningItems: [
    'Bon usage : analyse de scène, OCR, caption, reverse prompting, extraction structurée de prompt, plan de référence.',
    'Mauvais usage : attendre de ChatGPT qu’il devienne tout votre espace de production visuelle.',
    'Meilleure suite : convertir la photo en brief réutilisable avant de changer d’outil.',
  ],
  beforeUploadHeading: 'Que vérifier avant de téléverser',
  beforeUploadHeaders: ['Vérification', 'À confirmer', 'Pourquoi'],
  desktopHeading: 'Workflow desktop',
  desktopSteps: [
    "Ouvrez la surface ChatGPT où l’upload d’image est bien exposé dans le composer.",
    "Ajoutez l’image puis décrivez le job en une ligne : analyser, extraire un prompt, décrire la scène ou préparer une recréation.",
    'Demandez une structure complète au lieu d’une simple description.',
    'Si la réponse reste vague, demandez plusieurs versions liées à des jobs concrets.',
  ],
  mobileHeading: 'Workflow mobile',
  mobileSteps: [
    'Ajoutez la photo dans le composer mobile puis vérifiez la preview avant d’envoyer.',
    'Gardez la première question courte pour centrer la réponse sur la photo.',
    'Si vous devez générer ensuite, demandez un prompt template à coller dans Vogue AI.',
    "Pour un produit ou un visage, dites explicitement quels détails ne doivent pas changer.",
  ],
  askAfterUploadHeading: 'Que demander juste après l’upload',
  askAfterUploadParagraph:
    'La question la moins efficace est "transforme cette image en prompt". Demandez plutôt une structure réutilisable. Les follow-up prompts ci-dessous servent à convertir une photo en brief vraiment exploitable.',
  imageCaption:
    "Les prompts guidés par référence marchent mieux quand l’image uploadée sert de source de contraintes : on protège d’abord l’identité, puis on ajuste le style.",
  handoffHeading: 'Transformer une image uploadée en brief réutilisable pour Vogue AI',
  handoffHeaders: ['But', 'Ce qu’il faut demander à ChatGPT', 'Quand passer à Vogue AI'],
  workedExampleHeading: 'Worked example : envoyer une photo produit et extraire un meilleur prompt',
  rawRequestHeading: 'Requête initiale',
  rawRequestParagraph:
    'Imaginez une photo de bouteille en aluminium mat uploadée pour une campagne de lancement. Le premier travail n’est pas "rends-la plus belle", mais "quels détails doivent rester fixes" : silhouette, couleur du bouchon, zone d’étiquette, angle premium.',
  followUpHeading: 'Prompts de suivi à envoyer',
  moveToVogueHeading: 'Que transférer ensuite dans Vogue AI',
  moveToVogueParagraph:
    'Une fois que ChatGPT a séparé les contraintes fixes et les variables, utilisez ce brief propre dans Vogue AI. Vous pourrez tester GPT Image 2 pour le contrôle, Nano Banana pour des variantes rapides, ou Midjourney pour une exploration plus stylisée.',
  ruleTitle: 'Règle du workflow',
  ruleText:
    'Utilisez ChatGPT pour clarifier le brief. Utilisez Vogue AI pour générer, comparer et itérer. Mélanger les deux rôles dans un seul outil ralentit presque toujours le processus.',
  stayVsMoveHeading: 'Quand rester dans ChatGPT et quand passer à Vogue AI',
  stayVsMoveItems: [
    'Restez dans ChatGPT tant que vous avez besoin d’explication, OCR, découpage de scène ou nettoyage du prompt.',
    'Passez à Vogue AI dès que vous avez besoin d’image, de comparaison de modèles ou de variantes utilisables.',
    "Restez dans ChatGPT si vous n’avez pas encore défini ce qui doit rester fixe dans l’image de référence.",
    'Passez à Vogue AI dès que le brief est assez clair pour tester des ratios, des styles ou des modèles.',
  ],
  problemsHeading: 'Problèmes fréquents et correctifs',
  problemHeaders: ['Problème', 'Corriger d’abord', 'Ne commencez pas par'],
  faqQuestions: [
    {
      question: 'Tout le monde peut-il envoyer des images à ChatGPT ?',
      answer:
        "Cela dépend de la surface produit et du plan de compte visible sur votre appareil. Si le bouton manque, vérifiez d'abord la surface active.",
    },
    {
      question: 'Faut-il demander une caption ou un prompt ?',
      answer:
        'Demandez un prompt structuré si la prochaine étape est la génération. Demandez une caption seulement si la compréhension est votre but final.',
    },
    {
      question: "Comment préserver précisément un visage ou un produit ?",
      answer:
        "Dites quels détails sont non négociables, puis reportez cette règle dans l'étape reference-image de Vogue AI.",
    },
    {
      question: 'Quand ChatGPT suffit-il à lui seul ?',
      answer:
        "Quand vous avez seulement besoin d'analyse, d'extraction ou de reformulation. Pas quand vous avez besoin de sorties visuelles répétables.",
    },
    {
      question: 'Pourquoi passer dans Vogue AI après l’upload ?',
      answer:
        "Parce que Vogue AI est la couche d'exécution : modèles réels, variantes, comparaison et liens avec la prompt library.",
    },
    {
      question: 'Quelle est la meilleure question à poser après avoir envoyé la photo ?',
      answer:
        'Demandez la séparation entre éléments fixes, variables et contraintes négatives. Vous obtiendrez un brief réutilisable au lieu d’une simple description.',
    },
  ],
};

const ruCopy: LocalizedCopy = {
  title: 'Как загрузить изображения в ChatGPT и продолжить работу в Vogue AI',
  summary:
    'Практическое руководство: загрузить фото в ChatGPT, извлечь из него reusable prompt и перенести результат в Vogue AI для реальной генерации.',
  seoTitle: 'Как загрузить изображения в ChatGPT',
  seoDescription:
    'Узнайте, как загружать изображения в ChatGPT, что спрашивать после загрузки и когда переносить результат в Vogue AI.',
  intro:
    'Загрузка изображения в ChatGPT полезна прежде всего для анализа, OCR, reverse prompting и прояснения того, что именно нужно сгенерировать дальше. Максимальная ценность появляется тогда, когда upload становится первым шагом workflow: разобрать фото, выделить фиксированные ограничения, а затем перенести очищенный brief в Vogue AI для реального image generation и сравнения моделей.',
  tlDrHeading: 'TL;DR: сначала загрузите, потом попросите структуру',
  tlDrItems: [
    'Используйте image upload в ChatGPT, чтобы сначала понять фото, а уже потом пытаться его пересобрать.',
    'После загрузки просите не только summary, а fixed details, variables, negative constraints и prompt-ready structure.',
    'ChatGPT подходит для понимания и очистки brief, а Vogue AI — для реальной генерации и вариаций.',
    'Если важна identity, прямо скажите, что должно оставаться неизменным.',
    'Сильный handoff превращает одну фотографию в reusable prompt system.',
  ],
  uploadMeaningHeading: 'Что на самом деле дает загрузка изображения в ChatGPT',
  uploadMeaningParagraph:
    'Сама загрузка не делает финальный визуал лучше автоматически. Она дает слой понимания. ChatGPT может назвать важные детали сцены и переписать их в более чистый brief, который затем лучше переносится в Vogue AI.',
  uploadMeaningItems: [
    'Подходит для scene analysis, OCR, captioning, reverse prompting и structured prompt extraction.',
    'Плохо подходит для ожидания, что ChatGPT станет вашим полным визуальным production workspace.',
    'Лучший следующий шаг — превратить фото в reusable prompt brief, а уже потом менять инструмент.',
  ],
  beforeUploadHeading: 'Что проверить до загрузки',
  beforeUploadHeaders: ['Проверка', 'Что подтвердить', 'Почему это важно'],
  desktopHeading: 'Workflow на desktop',
  desktopSteps: [
    'Откройте ту поверхность ChatGPT, где image upload уже доступен в composer.',
    'Сначала прикрепите фото, затем одной строкой опишите job: analyze, extract a prompt, describe the scene, or help me recreate it.',
    'Просите структуру, а не только описание.',
    'Если ответ расплывчатый, попросите версии под разные конкретные jobs.',
  ],
  mobileHeading: 'Workflow на mobile',
  mobileSteps: [
    'Прикрепите фото через mobile composer и убедитесь, что preview загрузился правильно.',
    'Первый запрос держите коротким, чтобы ответ был сфокусирован на снимке.',
    'Если дальше нужна генерация, попросите чистый prompt template для переноса в Vogue AI.',
    'Для продукта или лица явно назовите детали, которые нельзя менять.',
  ],
  askAfterUploadHeading: 'Что спросить сразу после загрузки',
  askAfterUploadParagraph:
    'Самый частый промах — написать только "make this into a prompt". Лучше просить reusable structure. Эти follow-up prompts нужны для того, чтобы превратить uploaded image в рабочий brief.',
  imageCaption:
    'Reference-led prompts работают лучше всего, когда uploaded image используется как источник ограничений: сначала защищается identity, затем меняются style, lighting и composition.',
  handoffHeading: 'Как превратить одну загруженную картинку в reusable Vogue AI brief',
  handoffHeaders: ['Цель', 'Что попросить у ChatGPT', 'Когда переходить в Vogue AI'],
  workedExampleHeading: 'Worked example: загрузите product photo и извлеките лучший prompt',
  rawRequestHeading: 'Исходный запрос',
  rawRequestParagraph:
    'Представьте, что вы загрузили фотографию матовой алюминиевой бутылки и хотите использовать ее для launch campaign. Первый вопрос должен быть не "сделай красивее", а "что здесь обязательно должно остаться неизменным": silhouette, cap color, label zone и premium-looking angle.',
  followUpHeading: 'Follow-up prompts, которые стоит отправить',
  moveToVogueHeading: 'Что потом перенести в Vogue AI',
  moveToVogueParagraph:
    'Когда ChatGPT уже разделил fixed details и changeable variables, перенесите этот clean brief в Vogue AI. Там можно тестировать GPT Image 2 для контроля, Nano Banana для быстрых вариаций и Midjourney для более stylized exploration.',
  ruleTitle: 'Правило workflow',
  ruleText:
    'Используйте ChatGPT, чтобы прояснить brief. Используйте Vogue AI, чтобы генерировать, сравнивать и итеративно улучшать результат. Если просить один инструмент делать обе роли сразу, workflow обычно становится медленнее.',
  stayVsMoveHeading: 'Когда оставаться в ChatGPT, а когда переходить в Vogue AI',
  stayVsMoveItems: [
    'Оставайтесь в ChatGPT, пока вам нужны explanation, OCR, scene breakdown или cleanup prompt.',
    'Переходите в Vogue AI, когда нужна реальная генерация, выбор model или usable variants.',
    'Оставайтесь в ChatGPT, если вы еще не решили, что именно в reference image должно остаться фиксированным.',
    'Переходите в Vogue AI, как только brief уже достаточно ясен для тестов по ratio, style и model.',
  ],
  problemsHeading: 'Частые проблемы и исправления',
  problemHeaders: ['Проблема', 'Что исправить сначала', 'Не начинайте с'],
  faqQuestions: [
    {
      question: 'Все ли могут загружать изображения в ChatGPT?',
      answer:
        'Это зависит от surface продукта и тарифного плана, доступных на вашем устройстве. Если кнопки нет, сначала проверьте активную поверхность модели.',
    },
    {
      question: 'Нужно просить caption или prompt?',
      answer:
        'Если следующий шаг — генерация, просите structured prompt. Если цель только понять фото, достаточно caption или explanation.',
    },
    {
      question: 'Как точно сохранить лицо или продукт?',
      answer:
        'Явно перечислите незыблемые детали, а затем перенесите это правило в reference-image step внутри Vogue AI.',
    },
    {
      question: 'Когда одного ChatGPT действительно достаточно?',
      answer:
        'Когда нужна только интерпретация, extraction или rewrite. Не тогда, когда нужны repeatable visual outputs и model comparison.',
    },
    {
      question: 'Почему после upload стоит перейти в Vogue AI?',
      answer:
        'Потому что Vogue AI — это execution surface: реальные image models, variants и связка с prompt-library references.',
    },
    {
      question: 'Какой follow-up вопрос самый полезный после загрузки фото?',
      answer:
        'Попросите разделить fixed details, variables и negative constraints. Так вы получите reusable prompt brief, а не разовый description.',
    },
  ],
};

const ptCopy: LocalizedCopy = {
  title: 'Como enviar imagens ao ChatGPT e levar o resultado para o Vogue AI',
  summary:
    'Um guia prático para enviar uma imagem ao ChatGPT, extrair um prompt reutilizável e continuar o trabalho no Vogue AI.',
  seoTitle: 'Como enviar imagens ao ChatGPT',
  seoDescription:
    'Aprenda a enviar imagens ao ChatGPT, o que perguntar depois do upload e quando mover o resultado para o Vogue AI.',
  intro:
    'Enviar uma imagem ao ChatGPT funciona melhor para análise, OCR, reverse prompting e clareza sobre o que você quer gerar depois. O maior valor aparece quando o upload vira a primeira etapa de um workflow: entender a foto, separar o que é fixo e então levar o brief limpo para o Vogue AI gerar imagens reais e comparar modelos.',
  tlDrHeading: 'TL;DR: envie primeiro, peça estrutura depois',
  tlDrItems: [
    'Use o upload de imagem no ChatGPT para analisar, descrever ou desmontar uma foto antes de tentar regenerá-la.',
    'Depois do upload, peça fixed details, variables, negative constraints e prompt-ready structure.',
    'Use ChatGPT para entender e limpar o brief; use Vogue AI para gerar de verdade, comparar modelos e criar variantes.',
    'Se identidade importa, diga claramente o que deve ficar travado.',
    'O melhor handoff transforma uma foto em um reusable prompt system.',
  ],
  uploadMeaningHeading: 'O que o upload de imagem no ChatGPT realmente entrega',
  uploadMeaningParagraph:
    'O upload por si só não cria uma imagem final melhor. Ele cria uma camada de entendimento. O ChatGPT consegue identificar os detalhes relevantes e reescrevê-los como um brief mais limpo para seguir para o Vogue AI.',
  uploadMeaningItems: [
    'Bom uso: scene analysis, OCR, captioning, reverse prompting e structured prompt extraction.',
    'Mau uso: esperar que o ChatGPT vire sozinho todo o seu espaço de produção visual.',
    'Melhor próximo passo: converter a foto em reusable prompt brief antes de trocar de ferramenta.',
  ],
  beforeUploadHeading: 'O que confirmar antes do upload',
  beforeUploadHeaders: ['Checagem', 'O que confirmar', 'Por quê'],
  desktopHeading: 'Workflow no desktop',
  desktopSteps: [
    'Abra a superfície do ChatGPT em que o image upload já aparece no composer.',
    'Anexe a imagem e explique o job em uma linha.',
    'Peça estrutura completa, não apenas descrição.',
    'Se a resposta vier vaga, peça versões ligadas a jobs concretos.',
  ],
  mobileHeading: 'Workflow no mobile',
  mobileSteps: [
    'Use a entrada de imagem no composer mobile e confira a preview antes de enviar.',
    'Mantenha a primeira pergunta curta para focar a resposta na foto.',
    'Se você ainda vai gerar imagens depois, peça um prompt template limpo para colar no Vogue AI.',
    'Para produto ou rosto, diga explicitamente quais detalhes não podem mudar.',
  ],
  askAfterUploadHeading: 'O que perguntar logo depois do upload',
  askAfterUploadParagraph:
    'O erro mais comum é perguntar apenas "transforme isso em um prompt". Peça uma estrutura reutilizável. Os follow-up prompts abaixo servem para transformar a foto enviada em um brief realmente executável.',
  imageCaption:
    'Prompts guiados por referência funcionam melhor quando a imagem enviada vira uma fonte de constraints: preserve a identidade primeiro e ajuste estilo depois.',
  handoffHeading: 'Transforme uma imagem enviada em um brief reutilizável para o Vogue AI',
  handoffHeaders: ['Objetivo', 'O que pedir ao ChatGPT', 'Quando mover para o Vogue AI'],
  workedExampleHeading: 'Worked example: envie uma product photo e extraia um prompt melhor',
  rawRequestHeading: 'Pedido inicial',
  rawRequestParagraph:
    'Imagine que você enviou uma foto de uma garrafa de alumínio fosco para uma launch campaign. O primeiro trabalho não é "deixe mais bonito", e sim entender o que não pode mudar: silhouette, cap color, label zone e o ângulo que dá leitura premium.',
  followUpHeading: 'Follow-up prompts para enviar',
  moveToVogueHeading: 'O que levar depois para o Vogue AI',
  moveToVogueParagraph:
    'Quando o ChatGPT já separou fixed details e changeable variables, leve esse brief limpo para o Vogue AI. Lá você consegue testar GPT Image 2 para controle, Nano Banana para variações rápidas e Midjourney para uma exploração mais estilizada.',
  ruleTitle: 'Regra do workflow',
  ruleText:
    'Use o ChatGPT para esclarecer o brief. Use o Vogue AI para gerar, comparar e iterar. Quando um único tool tenta fazer as duas funções ao mesmo tempo, o processo costuma ficar mais lento.',
  stayVsMoveHeading: 'Quando ficar no ChatGPT e quando mover para o Vogue AI',
  stayVsMoveItems: [
    'Fique no ChatGPT quando ainda precisar de explicação, OCR, scene breakdown ou limpeza do prompt.',
    'Vá para o Vogue AI quando precisar de saída visual real, comparação de modelos ou variantes utilizáveis.',
    'Continue no ChatGPT se você ainda não definiu o que precisa permanecer fixo na reference image.',
    'Mude para o Vogue AI assim que o brief já estiver claro o suficiente para testar aspect ratios, styles e models.',
  ],
  problemsHeading: 'Problemas comuns e correções',
  problemHeaders: ['Problema', 'Corrija primeiro', 'Não comece por'],
  faqQuestions: [
    {
      question: 'Todo mundo pode enviar imagens ao ChatGPT?',
      answer:
        'Isso depende da surface do produto e do plano disponível no seu device. Se o botão sumiu, confirme primeiro a superfície ativa.',
    },
    {
      question: 'Devo pedir caption ou prompt?',
      answer:
        'Peça um structured prompt se o próximo passo for geração. Peça caption apenas se a meta final for entendimento.',
    },
    {
      question: 'Como preservar exatamente um rosto ou produto?',
      answer:
        'Liste os detalhes inegociáveis e carregue essa mesma regra para a etapa de reference image no Vogue AI.',
    },
    {
      question: 'Quando o ChatGPT sozinho é suficiente?',
      answer:
        'Quando você precisa apenas de interpretação, extração ou reescrita. Não quando precisa de visual outputs repetíveis.',
    },
    {
      question: 'Por que levar o resultado para o Vogue AI depois do upload?',
      answer:
        'Porque o Vogue AI é a camada de execução: modelos reais, variantes e integração com referências da prompt library.',
    },
    {
      question: 'Qual é a melhor pergunta depois de subir a foto?',
      answer:
        'Peça para separar fixed details, variables e negative constraints. Assim você recebe um reusable prompt brief.',
    },
  ],
};

const jaCopy: LocalizedCopy = {
  title: 'ChatGPT に画像をアップロードして Vogue AI につなぐ方法',
  summary:
    '画像を ChatGPT に送り、再利用できる prompt に整理し、その結果を Vogue AI に渡して実際の生成につなげるための実践ガイドです。',
  seoTitle: 'ChatGPT に画像をアップロードする方法',
  seoDescription:
    'ChatGPT への画像アップロード方法、アップロード後に何を聞くべきか、そして Vogue AI にいつ渡すべきかを整理します。',
  intro:
    'ChatGPT への画像アップロードは、analysis、OCR、reverse prompting、そして次に何を生成したいかを明確にする用途で最も役立ちます。本当に価値が出るのは、upload を workflow の最初の一歩として扱うときです。写真を理解し、固定制約を抜き出し、その brief を Vogue AI に渡して実際の image generation と model comparison に進めます。',
  tlDrHeading: 'TL;DR: まず upload、次に structure を聞く',
  tlDrItems: [
    'ChatGPT の image upload は、写真を再生成する前に内容を理解し、分解するために使うと効果的です。',
    'Upload 後は summary だけでなく、fixed details、variables、negative constraints、prompt-ready structure を求めてください。',
    'ChatGPT は brief を整える層、Vogue AI は実際に画像を出して比べる層です。',
    'Identity が重要なら、何を固定するかを明示します。',
    '一枚の写真を reusable prompt system に変えるのが理想的な handoff です。',
  ],
  uploadMeaningHeading: 'ChatGPT に画像を upload すると何が得られるか',
  uploadMeaningParagraph:
    'Upload しただけで final visual が自動的に良くなるわけではありません。得られるのは understanding layer です。ChatGPT は重要な details を言語化し、それを Vogue AI に持ち込みやすい clean brief に書き換えてくれます。',
  uploadMeaningItems: [
    '向いている用途: scene analysis、OCR、captioning、reverse prompting、structured prompt extraction。',
    '向いていない期待: ChatGPT だけで image production workspace 全体をまかなうこと。',
    'より良い次の一手: 写真を reusable prompt brief にしてから実行ツールへ移ること。',
  ],
  beforeUploadHeading: 'Upload 前に確認すること',
  beforeUploadHeaders: ['確認項目', '確認内容', '理由'],
  desktopHeading: 'Desktop workflow',
  desktopSteps: [
    'まず、現在の ChatGPT surface で image upload が composer に出ていることを確認します。',
    '画像を添付したあと、一行で job を伝えます。',
    'Description だけでなく、structure 全体を求めてください。',
    '返答が vague なら、具体的な jobs ごとの version を出させます。',
  ],
  mobileHeading: 'Mobile workflow',
  mobileSteps: [
    'Mobile composer から画像を添付し、preview が正しく出ていることを確認します。',
    '最初の質問は短くして、返答を写真に集中させます。',
    '後で生成まで進むなら、Vogue AI に貼れる prompt template を出してもらいます。',
    'Product や face identity が重要なら、変えてはいけない details を明示します。',
  ],
  askAfterUploadHeading: 'Upload の直後に聞くべきこと',
  askAfterUploadParagraph:
    '一番もったいない聞き方は "これを prompt にして" だけで終わることです。再利用できる structure を求めてください。以下の follow-up prompts は、uploaded image を実行可能な brief に変えるためのものです。',
  imageCaption:
    'Reference-led prompt は、uploaded image を constraints source として扱うと安定します。まず identity を守り、その上で style や lighting を動かします。',
  handoffHeading: '一枚の upload 画像を reusable な Vogue AI brief に変える',
  handoffHeaders: ['目的', 'ChatGPT に聞くこと', 'Vogue AI に移るタイミング'],
  workedExampleHeading: 'Worked example: product photo を upload して、より良い prompt を抜き出す',
  rawRequestHeading: '最初の依頼',
  rawRequestParagraph:
    'たとえば、マットなアルミボトルの写真を upload し、launch campaign 用の visual にしたいとします。最初の job は "もっときれいにして" ではなく、何を固定すべきかを見つけることです。silhouette、cap color、label zone、premium に見える angle などです。',
  followUpHeading: '続けて送る follow-up prompts',
  moveToVogueHeading: 'そのあと Vogue AI に持っていくもの',
  moveToVogueParagraph:
    'ChatGPT が fixed details と changeable variables を分けたら、その clean brief を Vogue AI に持っていきます。GPT Image 2 で control を取り、Nano Banana で variation を増やし、Midjourney で stylized exploration を行えます。',
  ruleTitle: 'Workflow rule',
  ruleText:
    'ChatGPT は brief を明確にする役割、Vogue AI は generate・compare・iterate する役割と考えてください。一つの tool に両方をさせると workflow は遅くなりやすいです。',
  stayVsMoveHeading: 'ChatGPT に残るべき時と Vogue AI に移るべき時',
  stayVsMoveItems: [
    'Explanation、OCR、scene breakdown、prompt cleanup が必要な間は ChatGPT に残ります。',
    '実際の image output、model comparison、usable variants が必要になったら Vogue AI に移ります。',
    'Reference image で何を固定すべきか決まっていないなら、まだ ChatGPT 側で整理します。',
    'Brief が十分に明確になり、aspect ratio や style を試せる段階になったら Vogue AI に移ります。',
  ],
  problemsHeading: 'よくある問題と fix',
  problemHeaders: ['問題', '先に直すこと', '先にやらないこと'],
  faqQuestions: [
    {
      question: '誰でも ChatGPT に画像を upload できますか？',
      answer:
        'それは device 上で有効になっている product surface と account plan によります。Upload ボタンがない場合は、まず active surface を確認してください。',
    },
    {
      question: 'Caption を頼むべきですか、それとも prompt を頼むべきですか？',
      answer:
        '次の step が generation なら structured prompt を頼んでください。理解だけが目的なら caption や explanation で十分です。',
    },
    {
      question: 'Face や product を厳密に保ちたい場合は？',
      answer:
        '変えてはいけない details を明示し、その rule をそのまま Vogue AI の reference-image step に持ち込みます。',
    },
    {
      question: 'ChatGPT だけで十分なのはどんな時ですか？',
      answer:
        'Interpretation、extraction、rewrite だけが必要な時です。Repeatable visual outputs が必要な時には足りません。',
    },
    {
      question: 'なぜ upload の後に Vogue AI へ移るのですか？',
      answer:
        'Vogue AI は execution surface だからです。実際の image models、variants、prompt-library references との接続ができます。',
    },
    {
      question: 'Upload 後の最重要 question は何ですか？',
      answer:
        'Fixed details、variables、negative constraints を分けてください。そうすれば one-off description ではなく reusable prompt brief が得られます。',
    },
  ],
};

const koCopy: LocalizedCopy = {
  title: 'ChatGPT에 이미지를 업로드하고 Vogue AI로 이어가는 방법',
  summary:
    '이미지를 ChatGPT에 올리고 재사용 가능한 prompt 로 정리한 뒤, 그 결과를 Vogue AI로 넘겨 실제 생성까지 이어가는 실전 가이드입니다.',
  seoTitle: 'ChatGPT에 이미지를 업로드하는 방법',
  seoDescription:
    'ChatGPT에 이미지를 업로드하는 방법, 업로드 후 무엇을 물어야 하는지, 그리고 언제 Vogue AI로 넘겨야 하는지 정리합니다.',
  intro:
    'ChatGPT에 이미지를 업로드하는 가장 좋은 용도는 analysis, OCR, reverse prompting, 그리고 다음에 무엇을 생성해야 하는지 더 명확하게 만드는 일입니다. 진짜 가치는 upload 를 workflow 의 첫 단계로 다룰 때 생깁니다. 사진을 이해하고, 고정되어야 하는 constraints 를 분리한 뒤, 그 brief 를 Vogue AI로 넘겨 실제 image generation 과 model comparison 으로 이어가는 것입니다.',
  tlDrHeading: 'TL;DR: 먼저 upload 하고, 그다음 structure 를 물어보세요',
  tlDrItems: [
    'ChatGPT image upload 는 사진을 다시 만들기 전에 먼저 이해하고 분해하는 용도로 쓰는 것이 좋습니다.',
    'Upload 후에는 summary 만이 아니라 fixed details, variables, negative constraints, prompt-ready structure 를 요청하세요.',
    'ChatGPT 는 brief 를 정리하는 층이고, Vogue AI 는 실제로 이미지를 생성하고 비교하는 층입니다.',
    'Identity 가 중요하다면 무엇을 고정해야 하는지 명확히 말해야 합니다.',
    '좋은 handoff 는 한 장의 사진을 reusable prompt system 으로 바꿉니다.',
  ],
  uploadMeaningHeading: 'ChatGPT에 이미지를 upload 하면 실제로 무엇을 얻는가',
  uploadMeaningParagraph:
    'Upload 자체가 final visual 을 자동으로 개선하지는 않습니다. 대신 understanding layer 를 제공합니다. ChatGPT 는 중요한 visual details 를 언어화하고, 그것을 Vogue AI 로 넘기기 좋은 clean brief 로 정리해 줍니다.',
  uploadMeaningItems: [
    '적합한 용도: scene analysis, OCR, captioning, reverse prompting, structured prompt extraction.',
    '부적합한 기대: ChatGPT 하나만으로 전체 image production workspace 를 대신하는 것.',
    '더 좋은 다음 단계: 사진을 reusable prompt brief 로 만든 뒤 실행 툴로 넘어가는 것.',
  ],
  beforeUploadHeading: 'Upload 전에 먼저 확인할 것',
  beforeUploadHeaders: ['체크 항목', '무엇을 확인할까', '왜 중요한가'],
  desktopHeading: 'Desktop workflow',
  desktopSteps: [
    '현재 ChatGPT surface 에 image upload 가 composer 안에 노출되는지 확인하세요.',
    '이미지를 첨부한 뒤 job 을 한 줄로 설명하세요.',
    '설명만이 아니라 전체 structure 를 요청하세요.',
    '답이 vague 하면 구체적인 jobs 기준으로 여러 version 을 요청하세요.',
  ],
  mobileHeading: 'Mobile workflow',
  mobileSteps: [
    'Mobile composer 에서 이미지를 첨부하고 preview 가 정상인지 확인하세요.',
    '첫 질문은 짧게 유지해서 답변이 사진에 집중되도록 하세요.',
    '나중에 실제 생성까지 할 예정이라면 Vogue AI에 붙일 prompt template 을 받아 두세요.',
    'Product 나 face identity 가 중요하면 변하면 안 되는 details 를 명시하세요.',
  ],
  askAfterUploadHeading: 'Upload 직후에 무엇을 물어야 하나',
  askAfterUploadParagraph:
    '가장 비효율적인 질문은 "이걸 prompt 로 바꿔줘" 한 문장으로 끝내는 것입니다. 재사용 가능한 structure 를 요청하세요. 아래 follow-up prompts 는 uploaded image 를 실제 실행 가능한 brief 로 바꾸기 위한 용도입니다.',
  imageCaption:
    'Reference-led prompt 는 uploaded image 를 constraints source 로 다룰 때 가장 안정적입니다. 먼저 identity 를 보호하고 그다음 style 과 lighting 을 조정하세요.',
  handoffHeading: '한 장의 업로드 이미지를 reusable Vogue AI brief 로 바꾸기',
  handoffHeaders: ['목표', 'ChatGPT에 요청할 것', '언제 Vogue AI로 옮길까'],
  workedExampleHeading: 'Worked example: product photo 를 upload 해서 더 좋은 prompt 를 뽑아내기',
  rawRequestHeading: '초기 요청',
  rawRequestParagraph:
    '예를 들어 무광 알루미늄 물병 사진을 upload 해서 launch campaign visual 로 바꾸고 싶다고 합시다. 첫 번째 할 일은 "더 예쁘게"가 아니라 무엇을 고정해야 하는지 찾는 것입니다. silhouette, cap color, label zone, premium 하게 보이게 하는 angle 같은 요소들입니다.',
  followUpHeading: '이어서 보낼 follow-up prompts',
  moveToVogueHeading: '그다음 Vogue AI로 가져갈 내용',
  moveToVogueParagraph:
    'ChatGPT 가 fixed details 와 changeable variables 를 분리해 주면 그 clean brief 를 Vogue AI로 옮기세요. GPT Image 2 로 control 을 잡고, Nano Banana 로 빠른 variation 을 만들고, Midjourney 로 더 stylized 한 exploration 을 할 수 있습니다.',
  ruleTitle: 'Workflow rule',
  ruleText:
    'ChatGPT 는 brief 를 명확히 하는 역할, Vogue AI 는 generate・compare・iterate 하는 역할로 나누는 편이 좋습니다. 한 tool 에 두 역할을 모두 기대하면 workflow 가 느려집니다.',
  stayVsMoveHeading: '언제 ChatGPT에 남고 언제 Vogue AI로 넘어갈까',
  stayVsMoveItems: [
    'Explanation, OCR, scene breakdown, prompt cleanup 이 더 필요할 때는 ChatGPT에 남으세요.',
    '실제 image output, model comparison, usable variants 가 필요해지면 Vogue AI로 넘어가세요.',
    'Reference image 에서 무엇을 고정해야 할지 아직 불분명하면 ChatGPT에서 더 정리하세요.',
    'Brief 가 충분히 명확해져 aspect ratio, style, model 을 시험할 수 있는 단계가 되면 Vogue AI로 이동하세요.',
  ],
  problemsHeading: '자주 생기는 문제와 수정법',
  problemHeaders: ['문제', '먼저 고칠 것', '먼저 하지 말 것'],
  faqQuestions: [
    {
      question: '누구나 ChatGPT에 이미지를 upload 할 수 있나요?',
      answer:
        '사용 중인 device 에서 노출되는 product surface 와 account plan 에 따라 다릅니다. 버튼이 없으면 먼저 active surface 를 확인하세요.',
    },
    {
      question: 'Caption 을 요청해야 하나요, prompt 를 요청해야 하나요?',
      answer:
        '다음 단계가 generation 이라면 structured prompt 를 요청하세요. 이해만 필요하다면 caption 이나 explanation 으로 충분합니다.',
    },
    {
      question: '얼굴이나 제품을 정확히 유지하려면 어떻게 해야 하나요?',
      answer:
        '절대 바뀌면 안 되는 details 를 명시하고, 그 rule 을 Vogue AI 의 reference-image step 에 그대로 넘기세요.',
    },
    {
      question: 'ChatGPT 하나만으로 충분한 때는 언제인가요?',
      answer:
        'Interpretation, extraction, rewrite 만 필요할 때입니다. Repeatable visual outputs 가 필요할 때는 부족합니다.',
    },
    {
      question: '왜 upload 후에 Vogue AI로 넘어가야 하나요?',
      answer:
        'Vogue AI 는 execution surface 이기 때문입니다. 실제 image models, variants, prompt-library references 와 연결됩니다.',
    },
    {
      question: 'Upload 후 가장 중요한 질문은 무엇인가요?',
      answer:
        'Fixed details, variables, negative constraints 를 분리해 달라고 하세요. 그러면 one-off description 이 아니라 reusable prompt brief 를 얻게 됩니다.',
    },
  ],
};

export const howToUploadImagesToChatGptAutoBlogPost: BlogPostSource = {
  slug: 'how-to-upload-images-to-chatgpt',
  date: '2026-05-28',
  updatedAt: '2026-05-28',
  author: 'Vogue AI Team',
  image: articleImages.hero,
  imageAlt: 'Reference-image upload example from the Vogue AI prompt library',
  articleType: 'tutorial',
  modelTags: ['vogue-ai', 'chatgpt', 'gpt-image-2', 'nano-banana', 'midjourney'],
  readingMinutes: 9,
  localizations: {
    en: {
      title: enCopy.title,
      summary: enCopy.summary,
      seoTitle: enCopy.seoTitle,
      seoDescription: enCopy.seoDescription,
      content: buildContent(enCopy),
    },
    zh: {
      title: zhCopy.title,
      summary: zhCopy.summary,
      seoTitle: zhCopy.seoTitle,
      seoDescription: zhCopy.seoDescription,
      content: buildContent(zhCopy),
    },
    fr: {
      title: frCopy.title,
      summary: frCopy.summary,
      seoTitle: frCopy.seoTitle,
      seoDescription: frCopy.seoDescription,
      content: buildContent(frCopy),
    },
    ru: {
      title: ruCopy.title,
      summary: ruCopy.summary,
      seoTitle: ruCopy.seoTitle,
      seoDescription: ruCopy.seoDescription,
      content: buildContent(ruCopy),
    },
    pt: {
      title: ptCopy.title,
      summary: ptCopy.summary,
      seoTitle: ptCopy.seoTitle,
      seoDescription: ptCopy.seoDescription,
      content: buildContent(ptCopy),
    },
    ja: {
      title: jaCopy.title,
      summary: jaCopy.summary,
      seoTitle: jaCopy.seoTitle,
      seoDescription: jaCopy.seoDescription,
      content: buildContent(jaCopy),
    },
    ko: {
      title: koCopy.title,
      summary: koCopy.summary,
      seoTitle: koCopy.seoTitle,
      seoDescription: koCopy.seoDescription,
      content: buildContent(koCopy),
    },
  },
};
