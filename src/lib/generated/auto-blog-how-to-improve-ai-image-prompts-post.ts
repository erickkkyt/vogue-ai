import type { BlogContentBlock, BlogPostSource } from '@/lib/blog-data';

const images = {
  hero:
    'https://media.vogueai.net/blog/auto/prompt-engineering-tips/9fe50c379a97-premium-streetwear-t-shirt-graphic-design-solid-1.jpg',
  campaign:
    'https://media.vogueai.net/blog/auto/text-to-image-prompts/4905f63747d7-high-impact-cinematic-sports-advertising-poster-featuring-1.jpg',
  product:
    'https://media.vogueai.net/blog/auto/text-to-image-prompts/a6b15580403b-premium-street-food-product-photograph-crispy-fried-1.jpg',
  portrait:
    'https://media.vogueai.net/blog/auto/text-to-image-prompts/1ffce010c78e-use-my-uploaded-image-as-face-reference-1.jpg',
} as const;

type Copy = {
  title: string;
  summary: string;
  seoTitle: string;
  seoDescription: string;
  intro: string;
  tldrHeading: string;
  tldr: string[];
  diagnoseHeading: string;
  diagnoseText: string;
  auditHeading: string;
  auditItems: string[];
  loopHeading: string;
  loopRows: string[][];
  weakHeading: string;
  weakText: string;
  rewriteHeading: string;
  rewriteIntro: string;
  rewriteItems: string[];
  campaignImageAlt: string;
  campaignCaption: string;
  casesHeading: string;
  productHeading: string;
  productText: string;
  productImageAlt: string;
  productCaption: string;
  portraitHeading: string;
  portraitText: string;
  portraitImageAlt: string;
  portraitCaption: string;
  mistakeHeading: string;
  mistakeRows: string[][];
  modelHeading: string;
  modelRows: string[][];
  workedHeading: string;
  rawHeading: string;
  rawText: string;
  revisedHeading: string;
  revisedText: string;
  ruleTitle: string;
  ruleText: string;
  saveHeading: string;
  saveItems: string[];
  faqHeading: string;
  faq: Array<[string, string]>;
};

const en: Copy = {
  title: 'How to improve AI image prompts without rewriting from scratch',
  summary:
    'A practical improvement workflow for diagnosing weak AI image prompts, rewriting one control at a time, and saving reusable prompt versions in Vogue AI.',
  seoTitle: 'How to Improve AI Image Prompts: Workflow Guide',
  seoDescription:
    'Learn how to improve AI image prompts with a repeatable diagnosis loop, before-and-after rewrites, reference-image rules, and model-fit checks.',
  intro:
    'Improving an AI image prompt is not the same as writing a better-sounding prompt. The useful workflow is diagnose, change one control, regenerate, and save the version that fixed the visible failure.',
  tldrHeading: 'TL;DR: fix the failure, not the whole prompt',
  tldr: [
    'Name the visible failure before rewriting anything.',
    'Change one control at a time: subject, reference, crop, style, output rule, or model fit.',
    'Use before-and-after prompt versions so you know which sentence actually helped.',
    'Add reference images only when identity, packaging, face, logo, palette, or UI hierarchy must survive.',
    'Save the repaired version as a reusable starting point in Vogue AI.',
  ],
  diagnoseHeading: 'Diagnose the first result before adding words',
  diagnoseText:
    'A weak result usually points to one missing control. If you add more adjectives before diagnosis, you may hide the problem without fixing it. Start by naming the failure in plain language.',
  auditHeading: 'Five-question diagnosis checklist',
  auditItems: [
    'Is the main subject correct and recognizable?',
    'Is the crop usable for the intended channel?',
    'Does the output preserve any required reference identity?',
    'Is the style specific enough to avoid generic output?',
    'Are text, logo, and watermark rules explicit?',
  ],
  loopHeading: 'The prompt improvement loop',
  loopRows: [
    ['Step', 'Question', 'Action'],
    ['1. Observe', 'What is visibly wrong?', 'Write one failure sentence: wrong subject, messy crop, generic style, weak identity, bad text, or wrong model fit.'],
    ['2. Choose one control', 'Which prompt part caused it?', 'Pick subject, reference handoff, composition, style, output rule, or model choice.'],
    ['3. Rewrite one sentence', 'What minimal instruction fixes it?', 'Change only that sentence so the next result is comparable.'],
    ['4. Regenerate', 'Did the failure improve?', 'Keep the improved sentence only if the visible issue moved in the right direction.'],
    ['5. Save', 'Can this fix help the next image?', 'Save the working version with a short note about what it fixed.'],
  ],
  weakHeading: 'What a weak prompt looks like',
  weakText:
    'Weak prompt: “Make a stylish ad for my skincare bottle, premium, cinematic, high quality.” The problem is not that it lacks adjectives. It lacks product identity, crop, reference handoff, output rules, and a review target.',
  rewriteHeading: 'Before-and-after rewrite patterns',
  rewriteIntro:
    'Use these rewrites to improve one failure at a time. Keep prompt blocks in English for easy copying into Vogue AI.',
  rewriteItems: [
    'Subject drift fix: Add “preserve the uploaded product silhouette, cap color, label position, and main material; background and lighting may change.”',
    'Crop fix: Add “centered 4:5 product-page crop, full product visible, clean negative space above, no cut-off edges.”',
    'Generic style fix: Replace “premium cinematic” with “softbox studio lighting, controlled glass reflection, pale blue product stage, crisp material detail.”',
    'Text artifact fix: Add “no generated text, no fake logo, leave blank safe area for text to be added later.”',
    'Series consistency fix: Add “reuse the same camera distance, background family, lighting direction, and aspect ratio as the previous approved version.”',
  ],
  campaignImageAlt: 'Campaign visual prompt improvement example from the Vogue AI library',
  campaignCaption:
    'Campaign-style results often fail through crop and headline-space issues first, so revise composition before rewriting the full prompt.',
  casesHeading: 'Two real improvement cases',
  productHeading: 'Case 1: product texture looks weak',
  productText:
    'When a food or product image looks flat, do not start with more mood language. Improve the material sentence: name texture, surface shine, separation from background, and commercial framing.',
  productImageAlt: 'Product texture prompt improvement example from the Vogue AI library',
  productCaption:
    'This product case works because texture, sauce contrast, background, and crop are each controlled instead of hidden behind generic quality words.',
  portraitHeading: 'Case 2: face identity drifts',
  portraitText:
    'When a portrait changes the person too much, the fix is not “more realistic.” The fix is a reference handoff sentence that protects face identity while allowing wardrobe, lighting, and composition to change.',
  portraitImageAlt: 'Reference-led portrait prompt improvement example from the Vogue AI library',
  portraitCaption:
    'Reference-led portrait prompts improve when identity is protected separately from style changes.',
  mistakeHeading: 'Mistake and fix table',
  mistakeRows: [
    ['Failure', 'Improve this first', 'Do not start with'],
    ['Wrong product or person', 'Subject sentence and reference handoff.', 'More style adjectives.'],
    ['Messy layout', 'Crop, camera distance, negative space, and ratio.', 'Switching model immediately.'],
    ['Generic result', 'Audience, channel, palette, material, and lighting.', 'Adding “high quality” repeatedly.'],
    ['Bad generated text', 'Output rule and text-safe area.', 'Asking for final typography in the image.'],
    ['Inconsistent series', 'Reusable version note and fixed variables.', 'Writing a new prompt from zero.'],
  ],
  modelHeading: 'Check model fit after the prompt is clear',
  modelRows: [
    ['Need', 'Try first', 'Why'],
    ['Controlled product or reference edit', 'GPT Image 2', 'Good when identity, product shape, and instruction following matter.'],
    ['Fast variation exploration', 'Nano Banana', 'Useful when you need many quick directions from one repaired prompt.'],
    ['Stylized visual exploration', 'Midjourney', 'Useful when mood and art direction matter more than exact structure.'],
    ['Reference-led portrait', 'Start with the model that preserves identity best for your asset.', 'The prompt must still say what the reference controls.'],
  ],
  workedHeading: 'Worked example: improving a weak product prompt',
  rawHeading: 'Weak version',
  rawText:
    'Make a premium ad for this running shoe, futuristic, dramatic lighting, cool background.',
  revisedHeading: 'Improved version',
  revisedText:
    'Premium launch visual for the uploaded running shoe, preserve shoe silhouette, sole shape, logo position, and color blocking from reference image. Centered 4:5 product-page crop on a graphite athletic stage, low camera angle, crisp knit texture, controlled rim light, subtle dust motion behind the shoe, clean negative space above for later headline, no generated text, no watermark. Review shoe silhouette first, then crop, then background energy.',
  ruleTitle: 'Revision rule',
  ruleText:
    'A better prompt is the smallest change that fixes the visible failure. If you cannot name the failure, you are not ready to rewrite.',
  saveHeading: 'Save improvements as reusable prompt versions',
  saveItems: [
    'Save the original weak prompt and the repaired prompt.',
    'Write one note: “fixed crop,” “fixed identity,” “fixed material,” or “fixed output rule.”',
    'Keep variables visible so the prompt can be reused for another product or portrait.',
    'Do not overwrite the approved version when testing a new style direction.',
  ],
  faqHeading: 'FAQ',
  faq: [
    ['How do I improve an AI image prompt quickly?', 'Name the visible failure, choose the prompt part that caused it, rewrite one sentence, and regenerate.'],
    ['Should I make the prompt longer?', 'Only if the missing control needs detail. Long prompts are not better when they repeat vague style language.'],
    ['What should I fix first after a bad image?', 'Fix subject or identity first, then composition, then style, then output rules.'],
    ['When should I add a reference image?', 'Add one when the product shape, face, package layout, UI hierarchy, logo position, or palette must stay recognizable.'],
    ['Should I switch models when a result is bad?', 'Only after the prompt is clear. If the prompt lacks crop, identity, or output rules, switching models may repeat the same failure.'],
    ['How do I make improvements reusable?', 'Save the repaired prompt with a short note about what changed and which variable can be swapped next.'],
  ],
};

const zh: Copy = {
  ...en,
  title: '如何改进 AI 图片提示词：不要整段重写，先修失败点',
  summary:
    '一套诊断弱提示词、一次只改一个控制点，并在 Vogue AI 中保存可复用版本的实用流程。',
  seoTitle: '如何改进 AI 图片提示词：工作流指南',
  seoDescription:
    '学习如何改进 AI 图片提示词：失败诊断、前后对比改写、参考图规则、模型选择和可复用版本保存。',
  intro:
    '改进 AI 图片提示词不是把句子写得更华丽，而是诊断、只改一个控制点、重新生成，再保存真正解决问题的版本。',
  tldrHeading: 'TL;DR：修失败点，不要整段重写',
  tldr: [
    '重写前先说出可见失败点。',
    '一次只改主体、参考图、裁切、风格、输出规则或模型匹配中的一个。',
    '保留前后版本，才能知道哪句话真的有效。',
    '只有身份、包装、人脸、logo、色板或 UI 层级必须保持时才加参考图。',
    '把修好的版本保存为 Vogue AI 中的下一个起点。',
  ],
  diagnoseHeading: '加词之前先诊断首轮结果',
  diagnoseText:
    '弱结果通常只指向一个缺失控制项。如果诊断前就继续加形容词，可能只是遮住问题而不是修好问题。',
  auditHeading: '五个诊断问题',
  auditItems: [
    '主体是否正确且可识别？',
    '裁切是否适合目标渠道？',
    '是否保住了必要的参考图身份？',
    '风格是否足够具体，避免泛化？',
    '文字、logo 和水印规则是否明确？',
  ],
  loopHeading: '提示词改进闭环',
  loopRows: [
    ['步骤', '要问的问题', '动作'],
    ['1. 观察', '画面哪里明显不对？', '写一句失败描述：主体错、裁切乱、风格泛、身份弱、文字坏或模型不匹配。'],
    ['2. 选择控制点', '是哪一段提示词导致的？', '只选主体、参考图交接、构图、风格、输出规则或模型选择中的一个。'],
    ['3. 改一句话', '最小修正是什么？', '只改这一句，保证下一次结果可以对比。'],
    ['4. 重新生成', '失败点有没有改善？', '只有可见问题确实变好时，才保留这句修改。'],
    ['5. 保存', '这个修正能不能复用？', '保存有效版本，并写一条修复说明。'],
  ],
  weakHeading: '弱提示词长什么样',
  weakText:
    '弱提示词：“给我的护肤瓶做一个高级广告，premium，cinematic，high quality。” 问题不是形容词不够，而是缺少产品身份、裁切、参考图交接、输出规则和检查目标。',
  rewriteHeading: '前后对比改写模式',
  rewriteIntro: '下面的英文提示词块可直接复制到 Vogue AI。每次只改一个失败点。',
  rewriteItems: [
    '主体漂移修正：加入 “preserve the uploaded product silhouette, cap color, label position, and main material; background and lighting may change.”',
    '裁切修正：加入 “centered 4:5 product-page crop, full product visible, clean negative space above, no cut-off edges.”',
    '风格泛化修正：把 “premium cinematic” 换成 “softbox studio lighting, controlled glass reflection, pale blue product stage, crisp material detail.”',
    '文字杂点修正：加入 “no generated text, no fake logo, leave blank safe area for text to be added later.”',
    '系列一致性修正：加入 “reuse the same camera distance, background family, lighting direction, and aspect ratio as the previous approved version.”',
  ],
  campaignImageAlt: 'Vogue AI 提示词库中的活动视觉提示词改进示例',
  campaignCaption: '活动海报类结果通常先败在裁切和标题留白，所以先修构图，不要整段重写。',
  casesHeading: '两个真实改进案例',
  productHeading: '案例 1：产品质感太弱',
  productText: '产品或食物画面太平时，不要先加情绪词。先补材质、表面高光、背景分离和商业构图。',
  productImageAlt: 'Vogue AI 提示词库中的产品质感提示词改进示例',
  productCaption: '这个产品案例有效，是因为质感、酱料对比、背景和裁切都被明确控制。',
  portraitHeading: '案例 2：人脸身份漂移',
  portraitText: '人像不像本人时，修正不是写“更真实”，而是写清参考图负责保住脸部身份。',
  portraitImageAlt: 'Vogue AI 提示词库中的参考图人像提示词改进示例',
  portraitCaption: '参考图人像提示词需要把身份保护和风格变化分开。',
  mistakeHeading: '错误与修正表',
  mistakeRows: [
    ['失败表现', '优先改哪里', '不要先做什么'],
    ['产品或人物错误', '主体句和参考图交接。', '继续加风格形容词。'],
    ['版式混乱', '裁切、机位距离、留白和比例。', '马上换模型。'],
    ['结果很泛', '受众、渠道、色板、材质和灯光。', '反复添加 high quality。'],
    ['生成文字很差', '输出规则和文字安全区。', '让模型直接生成最终排版。'],
    ['系列不一致', '可复用版本备注和固定变量。', '每张都从零写提示词。'],
  ],
  modelHeading: '提示词清楚之后再检查模型匹配',
  modelRows: [
    ['需求', '先尝试', '原因'],
    ['可控产品图或参考图编辑', 'GPT Image 2', '适合身份、产品形状和指令遵循很重要的场景。'],
    ['快速探索多个方向', 'Nano Banana', '适合用一个修好的提示词快速跑多个方向。'],
    ['强风格视觉探索', 'Midjourney', '适合艺术方向比结构精确更重要的场景。'],
    ['参考图人像', '先选最能保住身份的模型', '但提示词仍必须说明参考图控制什么。'],
  ],
  workedHeading: '实战例子：改进弱产品提示词',
  rawHeading: '弱版本',
  rawText: '给这双跑鞋做一个高级广告，未来感、戏剧光、酷背景。',
  revisedHeading: '改进版本',
  revisedText: en.revisedText,
  ruleTitle: '修正规则',
  ruleText: '更好的提示词，是能修复可见失败的最小改动。如果说不出失败点，就还不该重写。',
  saveHeading: '把改进保存成可复用版本',
  saveItems: [
    '保存原始弱提示词和修正提示词。',
    '写一条备注：修了裁切、身份、材质或输出规则。',
    '保留变量，让下一个产品或人像能复用。',
    '测试新风格时不要覆盖已确认有效的版本。',
  ],
  faqHeading: 'FAQ',
  faq: [
    ['如何快速改进 AI 图片提示词？', '先说出可见失败点，找到导致它的提示词部件，只改一句，再重新生成。'],
    ['提示词越长越好吗？', '不一定。只有缺失控制项需要细节时才加长，重复空泛风格词没有帮助。'],
    ['坏图之后应该先修什么？', '先修主体或身份，再修构图，再修风格，最后修输出规则。'],
    ['什么时候加参考图？', '产品形状、人脸、包装、UI 层级、logo 位置或色板必须保持时。'],
    ['结果不好要不要马上换模型？', '先把提示词写清楚。缺裁切、身份或输出规则时，换模型也可能重复失败。'],
    ['如何让改进可复用？', '保存修正版本，并记录这次修复了什么、下次可以替换哪个变量。'],
  ],
};

const fr: Copy = {
  ...en,
  title: "Améliorer un prompt d'image IA sans tout réécrire",
  summary:
    'Une méthode pratique pour diagnostiquer un prompt faible, corriger un seul contrôle et sauvegarder la version utile dans Vogue AI.',
  seoTitle: "Améliorer un prompt d'image IA",
  seoDescription:
    'Diagnostiquez les prompts image IA avec une boucle de correction, des réécritures avant/après, des règles de référence et un choix de modèle.',
  intro:
    "Améliorer un prompt ne consiste pas à écrire une phrase plus jolie. La méthode utile consiste à nommer le défaut, changer un seul contrôle, régénérer, puis sauvegarder la version qui a vraiment corrigé l’image.",
  tldrHeading: 'TL;DR : corrigez le défaut, pas tout le prompt',
  tldr: [
    'Nommez le défaut visible avant de réécrire.',
    'Changez un seul contrôle: sujet, référence, cadrage, style, règle de sortie ou modèle.',
    'Gardez les versions avant/après pour savoir quelle phrase a aidé.',
    'Ajoutez une référence seulement si identité, packaging, visage, logo, palette ou UI doivent rester stables.',
    'Sauvegardez la version corrigée comme nouveau point de départ dans Vogue AI.',
  ],
  diagnoseHeading: 'Diagnostiquer le premier rendu avant d’ajouter des mots',
  diagnoseText:
    'Un mauvais rendu pointe souvent vers un contrôle manquant. Si vous ajoutez des adjectifs avant le diagnostic, vous risquez de masquer le problème sans le résoudre.',
  auditHeading: 'Checklist de diagnostic en cinq questions',
  auditItems: [
    'Le sujet principal est-il correct et reconnaissable?',
    'Le cadrage convient-il au canal visé?',
    'L’image conserve-t-elle l’identité imposée par la référence?',
    'Le style est-il assez précis pour éviter un rendu générique?',
    'Les règles de texte, logo et filigrane sont-elles explicites?',
  ],
  loopHeading: 'La boucle d’amélioration du prompt',
  loopRows: [
    ['Étape', 'Question', 'Action'],
    ['1. Observer', 'Qu’est-ce qui est visiblement faux?', 'Écrivez une phrase de défaut: mauvais sujet, cadrage confus, style générique, identité faible, mauvais texte ou modèle inadapté.'],
    ['2. Choisir un contrôle', 'Quelle partie du prompt l’a causé?', 'Choisissez sujet, référence, composition, style, règle de sortie ou modèle.'],
    ['3. Réécrire une phrase', 'Quelle instruction minimale corrige le défaut?', 'Changez seulement cette phrase pour comparer le résultat suivant.'],
    ['4. Régénérer', 'Le défaut s’améliore-t-il?', 'Gardez la phrase seulement si le problème visible va dans le bon sens.'],
    ['5. Sauvegarder', 'Cette correction servira-t-elle encore?', 'Enregistrez la version utile avec une note courte.'],
  ],
  weakHeading: 'À quoi ressemble un prompt faible',
  weakText:
    'Prompt faible: “Make a stylish ad for my skincare bottle, premium, cinematic, high quality.” Le problème n’est pas le manque d’adjectifs, mais l’absence d’identité produit, de cadrage, de référence, de règles de sortie et de cible de revue.',
  rewriteHeading: 'Réécritures avant/après',
  rewriteIntro:
    'Utilisez ces phrases pour corriger un défaut à la fois. Les blocs restent en anglais pour être copiés dans Vogue AI.',
  rewriteItems: [
    'Dérive du sujet: ajoutez “preserve the uploaded product silhouette, cap color, label position, and main material; background and lighting may change.”',
    'Cadrage: ajoutez “centered 4:5 product-page crop, full product visible, clean negative space above, no cut-off edges.”',
    'Style générique: remplacez “premium cinematic” par “softbox studio lighting, controlled glass reflection, pale blue product stage, crisp material detail.”',
    'Artefacts texte: ajoutez “no generated text, no fake logo, leave blank safe area for text to be added later.”',
    'Cohérence de série: ajoutez “reuse the same camera distance, background family, lighting direction, and aspect ratio as the previous approved version.”',
  ],
  campaignImageAlt: 'Exemple d’amélioration de prompt campagne dans la bibliothèque Vogue AI',
  campaignCaption:
    'Les visuels de campagne échouent souvent d’abord par cadrage et espace de titre; corrigez la composition avant de réécrire tout le prompt.',
  casesHeading: 'Deux cas d’amélioration',
  productHeading: 'Cas 1 : texture produit trop faible',
  productText:
    'Quand un produit ou un plat paraît plat, ne commencez pas par l’ambiance. Améliorez la phrase matière: texture, brillance, séparation du fond et cadrage commercial.',
  productImageAlt: 'Exemple d’amélioration de texture produit dans la bibliothèque Vogue AI',
  productCaption:
    'Ce cas fonctionne parce que texture, contraste, fond et cadrage sont contrôlés séparément au lieu d’être cachés derrière “high quality”.',
  portraitHeading: 'Cas 2 : identité du visage instable',
  portraitText:
    'Quand un portrait ne ressemble plus à la personne, la solution n’est pas “more realistic”. Il faut une phrase de référence qui protège l’identité et laisse changer le style.',
  portraitImageAlt: 'Exemple d’amélioration de portrait avec référence dans la bibliothèque Vogue AI',
  portraitCaption:
    'Les portraits avec référence s’améliorent quand l’identité est séparée des changements de style.',
  mistakeHeading: 'Table erreurs / corrections',
  mistakeRows: [
    ['Échec', 'À corriger d’abord', 'Ne commencez pas par'],
    ['Mauvais produit ou personne', 'Sujet et référence.', 'Plus d’adjectifs de style.'],
    ['Mise en page confuse', 'Cadrage, distance caméra, espace vide et ratio.', 'Changer de modèle tout de suite.'],
    ['Résultat générique', 'Audience, canal, palette, matière et lumière.', 'Répéter “high quality”.'],
    ['Mauvais texte généré', 'Règle de sortie et zone texte.', 'Demander une typographie finale dans l’image.'],
    ['Série incohérente', 'Note de version et variables fixes.', 'Repartir de zéro.'],
  ],
  modelHeading: 'Vérifier le modèle après avoir clarifié le prompt',
  modelRows: [
    ['Besoin', 'Essayez d’abord', 'Pourquoi'],
    ['Produit contrôlé ou édition par référence', 'GPT Image 2', 'Utile quand identité, forme produit et respect des consignes comptent.'],
    ['Exploration rapide de variantes', 'Nano Banana', 'Utile pour tester plusieurs directions depuis un prompt réparé.'],
    ['Exploration visuelle stylisée', 'Midjourney', 'Utile quand direction artistique et mood priment sur la structure exacte.'],
    ['Portrait avec référence', 'Le modèle qui préserve le mieux l’identité de votre asset', 'Le prompt doit encore préciser ce que la référence contrôle.'],
  ],
  workedHeading: 'Exemple complet : améliorer un prompt produit',
  rawHeading: 'Version faible',
  rawText:
    'Créer une publicité premium pour cette chaussure de running, futuriste, lumière dramatique, fond cool.',
  revisedHeading: 'Version améliorée',
  revisedText: en.revisedText,
  ruleTitle: 'Règle de correction',
  ruleText:
    'Un meilleur prompt est le plus petit changement qui corrige le défaut visible. Si vous ne pouvez pas nommer le défaut, vous n’êtes pas prêt à réécrire.',
  saveHeading: 'Sauvegarder les versions réutilisables',
  saveItems: [
    'Gardez le prompt faible et le prompt réparé.',
    'Ajoutez une note: cadrage, identité, matière ou règle de sortie corrigée.',
    'Laissez les variables visibles pour réutiliser la structure.',
    'Ne remplacez pas la version validée pendant un test de style.',
  ],
  faqHeading: 'FAQ',
  faq: [
    ['Comment améliorer rapidement un prompt image IA?', 'Nommez le défaut visible, choisissez la partie responsable, réécrivez une phrase et régénérez.'],
    ['Faut-il rendre le prompt plus long?', 'Seulement si le contrôle manquant demande du détail. Un long prompt vague n’est pas meilleur.'],
    ['Que corriger après une mauvaise image?', 'Sujet ou identité d’abord, puis composition, style et règles de sortie.'],
    ['Quand ajouter une référence?', 'Quand forme produit, visage, packaging, UI, logo ou palette doivent rester reconnaissables.'],
    ['Faut-il changer de modèle?', 'Seulement après clarification du prompt. Si cadrage ou identité manquent, un autre modèle peut répéter le même défaut.'],
    ['Comment rendre les corrections réutilisables?', 'Sauvegardez le prompt réparé avec une note sur le contrôle corrigé et la variable à remplacer ensuite.'],
  ],
};

const ru: Copy = {
  ...en,
  title: 'Как улучшить промпт для AI-изображений без полного переписывания',
  summary:
    'Практичный цикл для диагностики слабого промпта, исправления одного контроля и сохранения рабочей версии в Vogue AI.',
  seoTitle: 'Как улучшить промпт для AI-изображений',
  seoDescription:
    'Улучшайте промпты через диагностику, before/after правки, правила референса и проверку подходящей модели.',
  intro:
    'Улучшить промпт — не значит сделать фразу красивее. Рабочий процесс: назвать видимый сбой, изменить один контроль, сгенерировать снова и сохранить версию, которая действительно исправила проблему.',
  tldrHeading: 'TL;DR: исправляйте сбой, а не весь промпт',
  tldr: [
    'Назовите видимый сбой до переписывания.',
    'Меняйте один контроль: субъект, референс, кадр, стиль, правило вывода или модель.',
    'Сохраняйте версии до/после, чтобы понимать, какая фраза помогла.',
    'Добавляйте референс только когда нужно сохранить лицо, упаковку, логотип, палитру или UI.',
    'Сохраняйте исправленную версию как новый старт в Vogue AI.',
  ],
  diagnoseHeading: 'Сначала диагноз, потом новые слова',
  diagnoseText:
    'Слабый результат обычно указывает на один недостающий контроль. Если добавить прилагательные до диагностики, можно скрыть проблему, но не исправить ее.',
  auditHeading: 'Пять вопросов для диагностики',
  auditItems: [
    'Главный субъект правильный и узнаваемый?',
    'Кадр подходит нужному каналу?',
    'Сохранена ли обязательная идентичность из референса?',
    'Стиль достаточно конкретный, чтобы не быть generic?',
    'Правила текста, логотипа и водяного знака явные?',
  ],
  loopHeading: 'Цикл улучшения промпта',
  loopRows: [
    ['Шаг', 'Вопрос', 'Действие'],
    ['1. Наблюдать', 'Что видно не так?', 'Запишите один сбой: неверный субъект, плохой кадр, generic style, слабая идентичность, плохой текст или неверная модель.'],
    ['2. Выбрать контроль', 'Какая часть это вызвала?', 'Выберите субъект, референс, композицию, стиль, правило вывода или модель.'],
    ['3. Переписать одну фразу', 'Какая минимальная инструкция исправит сбой?', 'Меняйте только эту фразу, чтобы сравнение было честным.'],
    ['4. Сгенерировать снова', 'Сбой стал меньше?', 'Оставляйте фразу только если видимая проблема улучшилась.'],
    ['5. Сохранить', 'Поможет ли это дальше?', 'Сохраните рабочую версию с короткой заметкой.'],
  ],
  weakHeading: 'Как выглядит слабый промпт',
  weakText:
    'Слабый промпт: “Make a stylish ad for my skincare bottle, premium, cinematic, high quality.” Проблема не в нехватке прилагательных, а в отсутствии идентичности продукта, кадра, референса, правил вывода и критерия проверки.',
  rewriteHeading: 'Паттерны исправления до/после',
  rewriteIntro:
    'Используйте эти фразы для исправления одного сбоя за раз. Английские блоки удобно копировать в Vogue AI.',
  rewriteItems: [
    'Дрейф субъекта: добавьте “preserve the uploaded product silhouette, cap color, label position, and main material; background and lighting may change.”',
    'Кадр: добавьте “centered 4:5 product-page crop, full product visible, clean negative space above, no cut-off edges.”',
    'Generic style: замените “premium cinematic” на “softbox studio lighting, controlled glass reflection, pale blue product stage, crisp material detail.”',
    'Текстовые артефакты: добавьте “no generated text, no fake logo, leave blank safe area for text to be added later.”',
    'Стабильность серии: добавьте “reuse the same camera distance, background family, lighting direction, and aspect ratio as the previous approved version.”',
  ],
  campaignImageAlt: 'Пример улучшения промпта кампании из библиотеки Vogue AI',
  campaignCaption:
    'Кампанийные визуалы часто сначала ломаются на кадре и месте под заголовок, поэтому правьте композицию до полного rewrite.',
  casesHeading: 'Два примера улучшения',
  productHeading: 'Кейс 1: слабая фактура продукта',
  productText:
    'Если продукт или еда выглядят плоско, не начинайте с настроения. Исправьте фразу о материале: фактура, блеск, отделение от фона и коммерческий кадр.',
  productImageAlt: 'Пример улучшения фактуры продукта из библиотеки Vogue AI',
  productCaption:
    'Кейс работает, потому что фактура, контраст, фон и кадр управляются отдельно, а не прячутся за “high quality”.',
  portraitHeading: 'Кейс 2: лицо теряет идентичность',
  portraitText:
    'Если портрет перестает быть похожим, решение не “more realistic”. Нужна фраза референса, которая защищает лицо и разрешает менять стиль.',
  portraitImageAlt: 'Пример улучшения портрета с референсом из библиотеки Vogue AI',
  portraitCaption:
    'Портреты с референсом улучшаются, когда идентичность отделена от изменений стиля.',
  mistakeHeading: 'Ошибки и исправления',
  mistakeRows: [
    ['Сбой', 'Что исправить первым', 'Не начинайте с'],
    ['Неверный продукт или человек', 'Субъект и референс.', 'Новых style adjectives.'],
    ['Хаотичная раскладка', 'Кадр, дистанция камеры, свободное место и ratio.', 'Немедленной смены модели.'],
    ['Слишком общий результат', 'Аудитория, канал, палитра, материал и свет.', 'Повтора “high quality”.'],
    ['Плохой текст', 'Правило вывода и зона для текста.', 'Финальной типографики внутри изображения.'],
    ['Нестабильная серия', 'Заметка версии и фиксированные переменные.', 'Нового prompt с нуля.'],
  ],
  modelHeading: 'Проверяйте модель после ясного промпта',
  modelRows: [
    ['Задача', 'Сначала попробуйте', 'Почему'],
    ['Контролируемый продукт или edit по референсу', 'GPT Image 2', 'Полезно, когда важны идентичность, форма продукта и следование инструкции.'],
    ['Быстрый поиск вариантов', 'Nano Banana', 'Удобно для нескольких направлений из одного исправленного промпта.'],
    ['Сильная стилизация', 'Midjourney', 'Подходит, когда mood и арт-дирекшн важнее точной структуры.'],
    ['Портрет с референсом', 'Модель, которая лучше сохраняет идентичность вашего asset', 'Промпт все равно должен сказать, что контролирует референс.'],
  ],
  workedHeading: 'Пример: улучшение продуктового промпта',
  rawHeading: 'Слабая версия',
  rawText:
    'Сделать premium ad для беговой обуви, futuristic, dramatic lighting, cool background.',
  revisedHeading: 'Улучшенная версия',
  revisedText: en.revisedText,
  ruleTitle: 'Правило исправления',
  ruleText:
    'Хороший промпт — это минимальное изменение, которое исправляет видимый сбой. Если вы не можете назвать сбой, переписывать рано.',
  saveHeading: 'Сохраняйте версии для повторного использования',
  saveItems: [
    'Сохраните слабый и исправленный промпты.',
    'Добавьте заметку: исправлен кадр, идентичность, материал или правило вывода.',
    'Оставьте переменные видимыми для следующего продукта или портрета.',
    'Не перезаписывайте утвержденную версию при тесте нового стиля.',
  ],
  faqHeading: 'FAQ',
  faq: [
    ['Как быстро улучшить промпт?', 'Назовите видимый сбой, выберите виновную часть, перепишите одну фразу и сгенерируйте снова.'],
    ['Нужно ли делать промпт длиннее?', 'Только если недостающий контроль требует деталей. Длинный набор vague style words не лучше.'],
    ['Что исправлять после плохой картинки?', 'Сначала субъект или идентичность, затем композицию, стиль и правила вывода.'],
    ['Когда добавлять референс?', 'Когда форма продукта, лицо, упаковка, UI, логотип или палитра должны оставаться узнаваемыми.'],
    ['Стоит ли менять модель?', 'Только после ясного промпта. Если нет кадра или идентичности, другая модель может повторить сбой.'],
    ['Как сделать улучшения повторяемыми?', 'Сохраните исправленный промпт с заметкой о том, что изменилось и какую переменную можно заменить.'],
  ],
};

const pt: Copy = {
  ...en,
  title: 'Como melhorar prompts de imagem IA sem reescrever tudo',
  summary:
    'Um método prático para diagnosticar prompts fracos, corrigir um controle por vez e salvar versões reutilizáveis no Vogue AI.',
  seoTitle: 'Como Melhorar Prompts de Imagem IA',
  seoDescription:
    'Melhore prompts de imagem IA com diagnóstico, reescritas antes/depois, regras de referência e escolha de modelo.',
  intro:
    'Melhorar um prompt não é escrever uma frase mais bonita. O fluxo útil é nomear a falha, mudar um controle, gerar de novo e salvar a versão que realmente resolveu o problema.',
  tldrHeading: 'TL;DR: corrija a falha, não o prompt inteiro',
  tldr: [
    'Nomeie a falha visível antes de reescrever.',
    'Mude um controle por vez: assunto, referência, corte, estilo, regra de saída ou modelo.',
    'Guarde versões antes/depois para saber qual frase ajudou.',
    'Use referência só quando identidade, embalagem, rosto, logo, paleta ou UI precisam sobreviver.',
    'Salve a versão corrigida como novo ponto de partida no Vogue AI.',
  ],
  diagnoseHeading: 'Diagnostique o primeiro resultado antes de adicionar palavras',
  diagnoseText:
    'Um resultado fraco costuma apontar para um controle ausente. Se você adiciona adjetivos antes do diagnóstico, pode esconder o problema sem resolvê-lo.',
  auditHeading: 'Checklist de diagnóstico em cinco perguntas',
  auditItems: [
    'O assunto principal está correto e reconhecível?',
    'O corte serve para o canal pretendido?',
    'A imagem preserva a identidade exigida pela referência?',
    'O estilo é específico o bastante para evitar um resultado genérico?',
    'Texto, logo e marca d’água têm regras explícitas?',
  ],
  loopHeading: 'Loop de melhoria do prompt',
  loopRows: [
    ['Etapa', 'Pergunta', 'Ação'],
    ['1. Observar', 'O que está visivelmente errado?', 'Escreva uma falha: assunto errado, corte confuso, estilo genérico, identidade fraca, texto ruim ou modelo inadequado.'],
    ['2. Escolher um controle', 'Qual parte causou isso?', 'Escolha assunto, referência, composição, estilo, regra de saída ou modelo.'],
    ['3. Reescrever uma frase', 'Qual instrução mínima corrige a falha?', 'Mude só essa frase para comparar a próxima geração.'],
    ['4. Gerar de novo', 'A falha melhorou?', 'Mantenha a frase apenas se o problema visível melhorou.'],
    ['5. Salvar', 'Essa correção ajuda depois?', 'Salve a versão útil com uma nota curta.'],
  ],
  weakHeading: 'Como é um prompt fraco',
  weakText:
    'Prompt fraco: “Make a stylish ad for my skincare bottle, premium, cinematic, high quality.” O problema não é falta de adjetivos, mas falta de identidade do produto, corte, referência, regras de saída e alvo de revisão.',
  rewriteHeading: 'Padrões de reescrita antes/depois',
  rewriteIntro:
    'Use estas frases para corrigir uma falha por vez. Os blocos ficam em inglês para copiar no Vogue AI.',
  rewriteItems: [
    'Correção de assunto: adicione “preserve the uploaded product silhouette, cap color, label position, and main material; background and lighting may change.”',
    'Correção de corte: adicione “centered 4:5 product-page crop, full product visible, clean negative space above, no cut-off edges.”',
    'Correção de estilo genérico: troque “premium cinematic” por “softbox studio lighting, controlled glass reflection, pale blue product stage, crisp material detail.”',
    'Correção de texto: adicione “no generated text, no fake logo, leave blank safe area for text to be added later.”',
    'Consistência de série: adicione “reuse the same camera distance, background family, lighting direction, and aspect ratio as the previous approved version.”',
  ],
  campaignImageAlt: 'Exemplo de melhoria de prompt de campanha na biblioteca do Vogue AI',
  campaignCaption:
    'Resultados de campanha costumam falhar primeiro em corte e espaço para título; corrija composição antes de reescrever tudo.',
  casesHeading: 'Dois casos reais de melhoria',
  productHeading: 'Caso 1: textura do produto fraca',
  productText:
    'Quando produto ou comida parece plano, não comece com mais clima. Melhore a frase de material: textura, brilho, separação do fundo e enquadramento comercial.',
  productImageAlt: 'Exemplo de melhoria de textura de produto na biblioteca do Vogue AI',
  productCaption:
    'Este caso funciona porque textura, contraste, fundo e corte são controlados separadamente, não escondidos atrás de “high quality”.',
  portraitHeading: 'Caso 2: identidade do rosto muda',
  portraitText:
    'Quando um retrato muda demais a pessoa, a solução não é “more realistic”. A solução é uma frase de referência que protege identidade e permite mudar estilo.',
  portraitImageAlt: 'Exemplo de melhoria de retrato com referência na biblioteca do Vogue AI',
  portraitCaption:
    'Prompts de retrato melhoram quando identidade e mudanças de estilo são separadas.',
  mistakeHeading: 'Tabela de erro e correção',
  mistakeRows: [
    ['Falha', 'Melhore primeiro', 'Não comece com'],
    ['Produto ou pessoa errada', 'Assunto e referência.', 'Mais adjetivos de estilo.'],
    ['Layout confuso', 'Corte, distância da câmera, espaço negativo e proporção.', 'Trocar de modelo imediatamente.'],
    ['Resultado genérico', 'Audiência, canal, paleta, material e luz.', 'Repetir “high quality”.'],
    ['Texto gerado ruim', 'Regra de saída e área segura para texto.', 'Tipografia final dentro da imagem.'],
    ['Série inconsistente', 'Nota de versão e variáveis fixas.', 'Começar do zero.'],
  ],
  modelHeading: 'Verifique o modelo depois que o prompt estiver claro',
  modelRows: [
    ['Necessidade', 'Tente primeiro', 'Por quê'],
    ['Produto controlado ou edição por referência', 'GPT Image 2', 'Bom quando identidade, forma e obediência à instrução importam.'],
    ['Explorar variações rápido', 'Nano Banana', 'Útil para testar muitas direções a partir de um prompt corrigido.'],
    ['Exploração visual estilizada', 'Midjourney', 'Útil quando mood e direção de arte importam mais que estrutura exata.'],
    ['Retrato com referência', 'O modelo que melhor preserva identidade no seu asset', 'O prompt ainda precisa dizer o que a referência controla.'],
  ],
  workedHeading: 'Exemplo: melhorando um prompt de produto',
  rawHeading: 'Versão fraca',
  rawText:
    'Criar um anúncio premium para este tênis de corrida, futurista, luz dramática, fundo legal.',
  revisedHeading: 'Versão melhorada',
  revisedText: en.revisedText,
  ruleTitle: 'Regra de revisão',
  ruleText:
    'Um prompt melhor é a menor mudança que corrige a falha visível. Se você não consegue nomear a falha, ainda não deve reescrever.',
  saveHeading: 'Salve versões reutilizáveis',
  saveItems: [
    'Salve o prompt fraco e o prompt corrigido.',
    'Escreva uma nota: corte, identidade, material ou regra de saída corrigida.',
    'Mantenha variáveis visíveis para reutilizar em outro produto ou retrato.',
    'Não sobrescreva a versão aprovada ao testar novo estilo.',
  ],
  faqHeading: 'FAQ',
  faq: [
    ['Como melhorar um prompt de imagem IA rapidamente?', 'Nomeie a falha visível, escolha a parte responsável, reescreva uma frase e gere novamente.'],
    ['Devo deixar o prompt mais longo?', 'Só se o controle ausente precisar de detalhe. Prompt longo com linguagem vaga não é melhor.'],
    ['O que corrigir depois de uma imagem ruim?', 'Assunto ou identidade primeiro, depois composição, estilo e regras de saída.'],
    ['Quando adicionar imagem de referência?', 'Quando forma, rosto, embalagem, UI, logo ou paleta precisam continuar reconhecíveis.'],
    ['Devo trocar de modelo?', 'Só depois de clarear o prompt. Se faltam corte ou identidade, outro modelo pode repetir a falha.'],
    ['Como tornar melhorias reutilizáveis?', 'Salve o prompt corrigido com uma nota sobre o que mudou e qual variável pode ser trocada depois.'],
  ],
};

const ja: Copy = {
  ...zh,
  title: 'AI 画像プロンプトを改善する方法：全体を書き直さず失敗点を直す',
  summary:
    '弱い AI 画像プロンプトを診断し、一度に一つの制御だけを直し、Vogue AI で再利用できる版として保存する手順です。',
  seoTitle: 'AI 画像プロンプト改善ガイド',
  seoDescription:
    'AI 画像プロンプトを診断し、before/after の修正、参照画像ルール、モデル選択、再利用版を整理します。',
  intro:
    'AI 画像プロンプトの改善は、文を華やかにすることではありません。見える失敗を名付け、一つの制御だけを変え、再生成し、本当に効いた版を保存することです。',
  tldrHeading: 'TL;DR：prompt 全体ではなく失敗点を直す',
  tldr: [
    '書き直す前に、見える失敗を一つ名付ける。',
    '主題、参照画像、切り抜き、スタイル、出力ルール、モデルのうち一つだけ変える。',
    'どの一文が効いたか分かるよう、before/after を残す。',
    '本人性、包装、顔、ロゴ、色、UI を守る必要がある時だけ参照画像を使う。',
    '直した版を Vogue AI の次の出発点として保存する。',
  ],
  diagnoseHeading: '言葉を足す前に初回結果を診断する',
  diagnoseText:
    '弱い結果は、多くの場合一つの制御不足を示しています。診断前に形容詞を増やすと、問題を隠すだけで修正できないことがあります。',
  auditHeading: '5 つの診断チェック',
  auditItems: [
    '主題は正しく認識できるか。',
    '切り抜きは目的のチャンネルに合っているか。',
    '必要な参照画像の本人性や形状が保たれているか。',
    '汎用的な結果を避けるだけの具体性があるか。',
    '文字、ロゴ、透かしのルールが明確か。',
  ],
  loopHeading: 'プロンプト改善ループ',
  loopRows: [
    ['ステップ', '問い', '行動'],
    ['1. 観察', '何が明らかに違うか。', '主題違い、切り抜き不良、汎用的スタイル、本人性低下、文字不良、モデル不適合のどれかを書く。'],
    ['2. 制御を選ぶ', 'どのパートが原因か。', '主題、参照画像、構図、スタイル、出力ルール、モデルから一つ選ぶ。'],
    ['3. 一文だけ直す', '最小の修正指示は何か。', '比較できるよう、その一文だけ変える。'],
    ['4. 再生成', '失敗は改善したか。', '見える問題が良くなった時だけ、その文を残す。'],
    ['5. 保存', '次にも使える修正か。', '効いた版を短いメモ付きで保存する。'],
  ],
  weakHeading: '弱い prompt の例',
  weakText:
    '弱い prompt: “Make a stylish ad for my skincare bottle, premium, cinematic, high quality.” 問題は形容詞不足ではなく、商品本人性、切り抜き、参照画像、出力ルール、評価基準がないことです。',
  rewriteHeading: 'Before/after 修正パターン',
  rewriteIntro:
    '下の英文ブロックは Vogue AI にコピーしやすいよう英語のままです。一度に一つの失敗だけ直します。',
  rewriteItems: [
    '主題漂移の修正: “preserve the uploaded product silhouette, cap color, label position, and main material; background and lighting may change.”',
    '切り抜き修正: “centered 4:5 product-page crop, full product visible, clean negative space above, no cut-off edges.”',
    '汎用スタイル修正: “premium cinematic” を “softbox studio lighting, controlled glass reflection, pale blue product stage, crisp material detail.” に替える。',
    '文字ノイズ修正: “no generated text, no fake logo, leave blank safe area for text to be added later.”',
    'シリーズ安定化: “reuse the same camera distance, background family, lighting direction, and aspect ratio as the previous approved version.”',
  ],
  campaignImageAlt: 'Vogue AI プロンプトライブラリのキャンペーン改善例',
  campaignCaption:
    'キャンペーン画像は切り抜きと見出しスペースで失敗しやすいため、全体を書き直す前に構図を直します。',
  casesHeading: '2 つの改善ケース',
  productHeading: 'ケース 1：商品質感が弱い',
  productText:
    '商品や食べ物が平坦に見える時は、雰囲気語を増やす前に素材文を直します。質感、表面の光、背景分離、商業的な切り抜きを指定します。',
  productImageAlt: 'Vogue AI プロンプトライブラリの商品質感改善例',
  productCaption:
    'この商品例は、質感、ソースのコントラスト、背景、切り抜きが具体的に制御されているため機能します。',
  portraitHeading: 'ケース 2：顔の本人性がずれる',
  portraitText:
    '人物が本人に見えなくなる時、解決策は “more realistic” ではありません。顔の本人性を守り、服装や光を変えられる参照画像文が必要です。',
  portraitImageAlt: 'Vogue AI プロンプトライブラリの参照画像人物改善例',
  portraitCaption:
    '参照画像を使う人物プロンプトは、本人性保護とスタイル変更を分けると改善しやすくなります。',
  mistakeHeading: 'ミスと修正表',
  mistakeRows: [
    ['失敗', '先に直すこと', '先にしないこと'],
    ['商品や人物が違う', '主題文と参照画像の handoff。', 'スタイル形容詞を増やす。'],
    ['レイアウトが乱れる', '切り抜き、カメラ距離、余白、比率。', 'すぐモデルを替える。'],
    ['結果が汎用的', '対象、チャンネル、色、素材、光。', 'high quality を繰り返す。'],
    ['生成文字が悪い', '出力ルールと文字安全区。', '画像内で最終タイポグラフィを作らせる。'],
    ['シリーズが揃わない', 'バージョンメモと固定変数。', '毎回ゼロから書く。'],
  ],
  modelHeading: 'prompt が明確になってからモデル適合を見る',
  modelRows: [
    ['必要なこと', 'まず試すもの', '理由'],
    ['制御された商品画像や参照編集', 'GPT Image 2', '本人性、商品形状、指示追従が重要な時に向く。'],
    ['短時間で方向探索', 'Nano Banana', '修正済み prompt から複数案を素早く見る時に便利。'],
    ['強いスタイル探索', 'Midjourney', '正確な構造より mood とアートディレクションが重要な時に向く。'],
    ['参照画像人物', '手元の asset で本人性を最も保つモデル', 'それでも参照画像が何を制御するかを書く必要がある。'],
  ],
  workedHeading: '実例：弱い商品 prompt を改善する',
  rawHeading: '弱い版',
  rawText: 'このランニングシューズの高級広告を作る。未来的、ドラマチックな光、かっこいい背景。',
  revisedHeading: '改善版',
  revisedText: en.revisedText,
  ruleTitle: '修正规則',
  ruleText:
    '良い prompt とは、見える失敗を直す最小変更です。失敗を名付けられないなら、まだ書き直す段階ではありません。',
  saveHeading: '改善を再利用できる版として保存する',
  saveItems: [
    '弱い prompt と修正 prompt の両方を保存する。',
    '「切り抜き」「本人性」「素材」「出力ルール」など修正内容をメモする。',
    '次の商品や人物に使えるよう変数を残す。',
    '新しいスタイルを試す時に承認済み版を上書きしない。',
  ],
  faqHeading: 'FAQ',
  faq: [
    ['AI 画像プロンプトを早く改善するには？', '見える失敗を名付け、原因パートを選び、一文だけ直して再生成します。'],
    ['prompt は長い方がよいですか？', '必要な制御が欠けている時だけ長くします。曖昧なスタイル語を繰り返しても改善しません。'],
    ['悪い画像の後は何を先に直しますか？', '主題や本人性を先に直し、その後に構図、スタイル、出力ルールを見ます。'],
    ['参照画像はいつ追加しますか？', '商品形状、顔、包装、UI、ロゴ位置、色を保ちたい時です。'],
    ['結果が悪い時はモデルを変えるべきですか？', 'prompt が明確になってからです。切り抜きや本人性が欠けていると、別モデルでも同じ失敗が起こります。'],
    ['改善を再利用するには？', '修正済み prompt に何を直したかをメモし、次に差し替える変数を残します。'],
  ],
};

const ko: Copy = {
  ...zh,
  title: 'AI 이미지 프롬프트 개선 방법: 전체를 다시 쓰지 말고 실패 지점을 고치기',
  summary:
    '약한 AI 이미지 프롬프트를 진단하고 한 번에 하나의 제어만 수정해 Vogue AI에서 재사용 가능한 버전으로 저장하는 방법입니다.',
  seoTitle: 'AI 이미지 프롬프트 개선 가이드',
  seoDescription:
    'AI 이미지 프롬프트를 진단하고 before/after 수정, 레퍼런스 규칙, 모델 선택, 재사용 버전을 정리합니다.',
  intro:
    'AI 이미지 프롬프트 개선은 문장을 더 멋지게 쓰는 일이 아닙니다. 보이는 실패를 이름 붙이고, 하나의 제어만 바꾸고, 다시 생성한 뒤 실제로 문제를 해결한 버전을 저장하는 일입니다.',
  tldrHeading: 'TL;DR: 전체 prompt가 아니라 실패 지점을 고치세요',
  tldr: [
    '다시 쓰기 전에 보이는 실패를 하나로 말하세요.',
    '주제, 레퍼런스, 크롭, 스타일, 출력 규칙, 모델 중 하나만 바꾸세요.',
    '어떤 문장이 효과가 있었는지 알 수 있도록 before/after를 남기세요.',
    '정체성, 패키지, 얼굴, 로고, 팔레트, UI가 유지되어야 할 때만 레퍼런스를 추가하세요.',
    '수정된 버전을 Vogue AI의 다음 시작점으로 저장하세요.',
  ],
  diagnoseHeading: '단어를 더하기 전에 첫 결과를 진단하세요',
  diagnoseText:
    '약한 결과는 보통 하나의 빠진 제어를 가리킵니다. 진단 전에 형용사를 더하면 문제를 숨길 수는 있어도 해결하지 못할 수 있습니다.',
  auditHeading: '다섯 가지 진단 질문',
  auditItems: [
    '주요 피사체가 정확하고 알아볼 수 있나요?',
    '크롭이 목표 채널에 맞나요?',
    '필요한 레퍼런스 정체성이 유지되나요?',
    '스타일이 평범한 결과를 피할 만큼 구체적인가요?',
    '텍스트, 로고, 워터마크 규칙이 명확한가요?',
  ],
  loopHeading: '프롬프트 개선 루프',
  loopRows: [
    ['단계', '질문', '행동'],
    ['1. 관찰', '무엇이 눈에 띄게 틀렸나요?', '잘못된 주제, 혼란스러운 크롭, 평범한 스타일, 약한 정체성, 나쁜 텍스트, 모델 부적합 중 하나로 적습니다.'],
    ['2. 제어 선택', '어느 파트가 원인인가요?', '주제, 레퍼런스, 구도, 스타일, 출력 규칙, 모델 중 하나를 고릅니다.'],
    ['3. 한 문장 수정', '최소 수정 지시는 무엇인가요?', '다음 결과와 비교할 수 있게 한 문장만 바꿉니다.'],
    ['4. 재생성', '실패가 개선되었나요?', '보이는 문제가 좋아졌을 때만 수정 문장을 유지합니다.'],
    ['5. 저장', '다음 이미지에도 도움이 되나요?', '작동한 버전을 짧은 메모와 함께 저장합니다.'],
  ],
  weakHeading: '약한 prompt의 모습',
  weakText:
    '약한 prompt: “Make a stylish ad for my skincare bottle, premium, cinematic, high quality.” 문제는 형용사가 부족한 것이 아니라 제품 정체성, 크롭, 레퍼런스, 출력 규칙, 검토 기준이 없다는 점입니다.',
  rewriteHeading: 'Before/after 수정 패턴',
  rewriteIntro:
    '아래 영어 블록은 Vogue AI에 복사하기 쉽도록 그대로 둡니다. 한 번에 하나의 실패만 수정하세요.',
  rewriteItems: [
    '주제 드리프트 수정: “preserve the uploaded product silhouette, cap color, label position, and main material; background and lighting may change.”',
    '크롭 수정: “centered 4:5 product-page crop, full product visible, clean negative space above, no cut-off edges.”',
    '평범한 스타일 수정: “premium cinematic”을 “softbox studio lighting, controlled glass reflection, pale blue product stage, crisp material detail.”로 바꿉니다.',
    '텍스트 잡음 수정: “no generated text, no fake logo, leave blank safe area for text to be added later.”',
    '시리즈 일관성 수정: “reuse the same camera distance, background family, lighting direction, and aspect ratio as the previous approved version.”',
  ],
  campaignImageAlt: 'Vogue AI 프롬프트 라이브러리의 캠페인 프롬프트 개선 예시',
  campaignCaption:
    '캠페인 결과는 크롭과 헤드라인 공간에서 먼저 실패하는 경우가 많으므로 전체를 다시 쓰기 전에 구도를 고치세요.',
  casesHeading: '두 가지 실제 개선 사례',
  productHeading: '사례 1: 제품 질감이 약함',
  productText:
    '제품이나 음식 이미지가 밋밋할 때는 무드 단어를 더하지 말고 재질 문장을 개선하세요. 질감, 표면 광택, 배경 분리, 상업적 프레이밍을 지정합니다.',
  productImageAlt: 'Vogue AI 프롬프트 라이브러리의 제품 질감 개선 예시',
  productCaption:
    '이 제품 사례는 질감, 대비, 배경, 크롭이 막연한 “high quality” 뒤에 숨지 않고 각각 제어되기 때문에 작동합니다.',
  portraitHeading: '사례 2: 얼굴 정체성이 흔들림',
  portraitText:
    '인물이 너무 달라질 때 해결책은 “more realistic”이 아닙니다. 얼굴 정체성을 보호하면서 의상, 조명, 구도를 바꿀 수 있는 레퍼런스 handoff 문장이 필요합니다.',
  portraitImageAlt: 'Vogue AI 프롬프트 라이브러리의 레퍼런스 인물 개선 예시',
  portraitCaption:
    '레퍼런스 기반 인물 프롬프트는 정체성 보호와 스타일 변경을 분리할 때 좋아집니다.',
  mistakeHeading: '실수와 수정 표',
  mistakeRows: [
    ['실패', '먼저 개선할 것', '먼저 하지 말 것'],
    ['제품이나 인물이 틀림', '주제 문장과 레퍼런스 handoff.', '스타일 형용사 추가.'],
    ['레이아웃이 혼란스러움', '크롭, 카메라 거리, 여백, 비율.', '즉시 모델 변경.'],
    ['결과가 평범함', '대상, 채널, 팔레트, 재질, 조명.', '“high quality” 반복.'],
    ['생성 텍스트가 나쁨', '출력 규칙과 텍스트 안전 영역.', '이미지 안에서 최종 타이포그래피 요청.'],
    ['시리즈가 불일치', '버전 노트와 고정 변수.', '처음부터 새로 쓰기.'],
  ],
  modelHeading: '프롬프트가 명확해진 뒤 모델 적합성 확인',
  modelRows: [
    ['필요', '먼저 시도', '이유'],
    ['제어된 제품 또는 레퍼런스 편집', 'GPT Image 2', '정체성, 제품 형태, 지시 준수가 중요할 때 좋습니다.'],
    ['빠른 방향 탐색', 'Nano Banana', '수정된 프롬프트 하나로 여러 방향을 빠르게 볼 때 유용합니다.'],
    ['강한 스타일 탐색', 'Midjourney', '정확한 구조보다 무드와 아트 디렉션이 중요할 때 적합합니다.'],
    ['레퍼런스 기반 인물', '내 asset에서 정체성을 가장 잘 보존하는 모델', '그래도 프롬프트는 레퍼런스가 무엇을 제어하는지 말해야 합니다.'],
  ],
  workedHeading: '예시: 약한 제품 prompt 개선',
  rawHeading: '약한 버전',
  rawText: '이 러닝화를 위한 프리미엄 광고를 만들어줘. 미래적, 드라마틱한 조명, 멋진 배경.',
  revisedHeading: '개선 버전',
  revisedText: en.revisedText,
  ruleTitle: '수정 규칙',
  ruleText:
    '더 좋은 prompt는 보이는 실패를 고치는 가장 작은 변경입니다. 실패를 말할 수 없다면 아직 다시 쓸 준비가 되지 않은 것입니다.',
  saveHeading: '개선을 재사용 가능한 버전으로 저장하기',
  saveItems: [
    '약한 prompt와 수정된 prompt를 모두 저장합니다.',
    '크롭, 정체성, 재질, 출력 규칙 중 무엇을 고쳤는지 메모합니다.',
    '다른 제품이나 인물에 재사용할 수 있도록 변수를 남깁니다.',
    '새 스타일을 테스트할 때 승인된 버전을 덮어쓰지 않습니다.',
  ],
  faqHeading: 'FAQ',
  faq: [
    ['AI 이미지 프롬프트를 빠르게 개선하려면?', '보이는 실패를 말하고, 원인 파트를 고른 뒤, 한 문장만 고쳐 다시 생성합니다.'],
    ['프롬프트는 길수록 좋은가요?', '부족한 제어에 세부사항이 필요할 때만 길게 쓰세요. 막연한 스타일 언어를 반복하는 긴 프롬프트는 좋지 않습니다.'],
    ['나쁜 이미지 후 무엇을 먼저 고치나요?', '주제나 정체성을 먼저 고치고, 그다음 구도, 스타일, 출력 규칙을 봅니다.'],
    ['레퍼런스 이미지는 언제 추가하나요?', '제품 형태, 얼굴, 패키지, UI, 로고 위치, 팔레트가 인식 가능하게 유지되어야 할 때입니다.'],
    ['결과가 나쁘면 모델을 바꿔야 하나요?', '프롬프트가 명확해진 뒤에 바꾸세요. 크롭이나 정체성이 빠져 있으면 다른 모델도 같은 실패를 반복할 수 있습니다.'],
    ['개선을 재사용하려면?', '수정된 prompt를 저장하고 무엇이 바뀌었는지, 다음에 어떤 변수를 바꿀지 메모하세요.'],
  ],
};

const makeContent = (copy: Copy): BlogContentBlock[] => [
  { type: 'paragraph', text: copy.intro },
  { type: 'heading', level: 2, text: copy.tldrHeading },
  { type: 'list', items: copy.tldr },
  { type: 'heading', level: 2, text: copy.diagnoseHeading },
  { type: 'paragraph', text: copy.diagnoseText },
  { type: 'heading', level: 2, text: copy.auditHeading },
  { type: 'list', items: copy.auditItems },
  { type: 'heading', level: 2, text: copy.loopHeading },
  { type: 'table', headers: copy.loopRows[0], rows: copy.loopRows.slice(1) },
  { type: 'heading', level: 2, text: copy.weakHeading },
  { type: 'paragraph', text: copy.weakText },
  { type: 'heading', level: 2, text: copy.rewriteHeading },
  { type: 'paragraph', text: copy.rewriteIntro },
  {
    type: 'image',
    src: images.campaign,
    alt: copy.campaignImageAlt,
    caption: copy.campaignCaption,
  },
  { type: 'list', items: copy.rewriteItems },
  { type: 'heading', level: 2, text: copy.casesHeading },
  { type: 'heading', level: 3, text: copy.productHeading },
  {
    type: 'image',
    src: images.product,
    alt: copy.productImageAlt,
    caption: copy.productCaption,
  },
  { type: 'paragraph', text: copy.productText },
  { type: 'heading', level: 3, text: copy.portraitHeading },
  {
    type: 'image',
    src: images.portrait,
    alt: copy.portraitImageAlt,
    caption: copy.portraitCaption,
  },
  { type: 'paragraph', text: copy.portraitText },
  { type: 'heading', level: 2, text: copy.mistakeHeading },
  { type: 'table', headers: copy.mistakeRows[0], rows: copy.mistakeRows.slice(1) },
  { type: 'heading', level: 2, text: copy.modelHeading },
  { type: 'table', headers: copy.modelRows[0], rows: copy.modelRows.slice(1) },
  { type: 'heading', level: 2, text: copy.workedHeading },
  { type: 'heading', level: 3, text: copy.rawHeading },
  { type: 'paragraph', text: copy.rawText },
  { type: 'heading', level: 3, text: copy.revisedHeading },
  { type: 'paragraph', text: copy.revisedText },
  { type: 'callout', title: copy.ruleTitle, text: copy.ruleText },
  { type: 'heading', level: 2, text: copy.saveHeading },
  { type: 'list', items: copy.saveItems },
  { type: 'heading', level: 2, text: copy.faqHeading },
  ...copy.faq.flatMap(([question, answer]) => [
    { type: 'heading' as const, level: 3 as const, text: question },
    { type: 'paragraph' as const, text: answer },
  ]),
];

export const howToImproveAiImagePromptsAutoBlogPost: BlogPostSource = {
  slug: 'how-to-improve-ai-image-prompts',
  date: '2026-06-27',
  updatedAt: '2026-06-27',
  author: 'Vogue AI Team',
  image: images.hero,
  imageAlt: 'Prompt refinement example from the Vogue AI library',
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
