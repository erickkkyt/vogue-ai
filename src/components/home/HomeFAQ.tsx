import { normalizeVogueLocale, type VogueLocale } from '@/i18n/vogue';

type FaqItem = {
  question: string;
  answer: string;
};

const faqCopy: Record<
  VogueLocale,
  { title: string; description: string; items: FaqItem[] }
> = {
  en: {
    title: 'AI Image Prompts FAQ',
    description:
      'Find answers to common questions about free AI image prompts, reference images, supported models, credits, and commercial use.',
    items: [
      {
        question: 'What is Vogue AI?',
        answer:
          'Vogue AI is a free AI image prompt gallery and generator workspace for creators. You can browse visual prompt examples, reuse the prompt structure, add reference images, and generate new images from one workspace.',
      },
      {
        question: 'Are Vogue AI image prompts free to browse and copy?',
        answer:
          'Yes. The prompt gallery is free to browse, and you can copy prompt text or open a prompt card to reuse its structure for your own image idea.',
      },
      {
        question: 'Which AI image models do these prompts support?',
        answer:
          'The gallery focuses on reusable prompt examples for GPT Image 2, Nano Banana, Midjourney, and related AI image models. Some prompts are model-specific, while many can be adapted across tools.',
      },
      {
        question: 'How do I use a prompt with GPT Image 2, Nano Banana, or Midjourney?',
        answer:
          'Open a gallery card, copy the prompt or send it into the Vogue AI composer, then adjust the subject, style, aspect ratio, and output settings before generating.',
      },
      {
        question: 'Can I use reference images with the generator?',
        answer:
          'Yes. Use as Reference keeps the selected gallery image as a visual reference, so you can generate from both the prompt text and the example image.',
      },
      {
        question: 'What types of AI image prompts are included?',
        answer:
          'The gallery includes prompts for product photos, posters, portraits, UI mockups, diagrams, anime styles, realistic photos, social posts, and other visual workflows.',
      },
      {
        question: 'Do I need an account or credits to generate images?',
        answer:
          'You can browse and copy prompts without starting from a blank page. Image generation uses the Vogue AI workspace and may require an account and credits depending on the model and settings you choose.',
      },
      {
        question: 'Can I use generated images commercially?',
        answer:
          'Commercial use depends on the model, your input assets, and the rights attached to any reference material. Avoid using copyrighted, trademarked, or private images unless you have permission.',
      },
    ],
  },
  zh: {
    title: '常见问题',
    description:
      '了解 Vogue AI 提示词画廊和工作台的常见使用方式。',
    items: [
      {
        question: 'Vogue AI 是什么？',
        answer:
          'Vogue AI 是面向创作者的 Nano Banana、Midjourney 与 GPT Image 提示词画廊。你可以浏览可复用的视觉提示词，改写它们，并在统一的工作台里直接生成图片。',
      },
      {
        question: '我可以复制并修改这些提示词吗？',
        answer:
          '可以。打开任意画廊卡片，复制或复用提示词结构，把主体、风格和细节换成自己的需求，然后继续在工作台中创作。',
      },
      {
        question: '这些提示词适用于哪些模型？',
        answer:
          '画廊聚焦 Nano Banana、Midjourney、GPT Image 以及相关图像生成流程中可复用的提示词思路，同一种结构可以按不同模型灵活调整。',
      },
      {
        question: '我能创作什么内容？',
        answer:
          '你可以创作编辑感视觉、海报、产品场景、人像、社媒创意参考，以及其他从成熟提示词案例出发的图像方案。',
      },
      {
        question: '我需要懂提示词工程吗？',
        answer:
          '不需要。从一个可用案例开始，保留你喜欢的部分，替换主体和风格细节，就能在同一个工作台里生成。',
      },
      {
        question: '生成器和画廊是怎么连接的？',
        answer:
          '“使用提示词”会把选中的文本送入编辑器；“用作参考图”会同时保留图片作为视觉参考，让你基于提示词和示例一起生成。',
      },
    ],
  },
  fr: {
    title: 'Questions fréquentes',
    description:
      'Réponses aux questions courantes sur la galerie de prompts Vogue AI et l’espace de travail.',
    items: [
      {
        question: 'Qu’est-ce que Vogue AI ?',
        answer:
          'Vogue AI est une galerie de prompts Nano Banana, Midjourney et GPT Image pensée pour les créateurs. Vous pouvez parcourir des prompts visuels réutilisables, les adapter et générer des images dans un espace de travail unifié.',
      },
      {
        question: 'Puis-je copier et modifier les prompts ?',
        answer:
          'Oui. Ouvrez une carte de la galerie, copiez ou réutilisez la structure du prompt, adaptez le sujet et les détails de style, puis poursuivez dans l’espace de travail.',
      },
      {
        question: 'À quels modèles ces prompts s’adressent-ils ?',
        answer:
          'La galerie se concentre sur des idées de prompts réutilisables pour Nano Banana, Midjourney, GPT Image et les workflows visuels proches, avec des structures adaptables d’un modèle à l’autre.',
      },
      {
        question: 'Quels contenus puis-je créer ?',
        answer:
          'Vous pouvez créer des visuels éditoriaux, des affiches, des scènes produit, des portraits, des références créatives pour les réseaux sociaux et d’autres idées d’images issues d’exemples éprouvés.',
      },
      {
        question: 'Faut-il maîtriser le prompt engineering ?',
        answer:
          'Non. Partez d’un exemple qui fonctionne, gardez ce qui vous plaît, remplacez le sujet et les détails de style, puis générez depuis le même espace de travail.',
      },
      {
        question: 'Comment la galerie est-elle reliée au générateur ?',
        answer:
          '« Utiliser le prompt » envoie le texte sélectionné dans le composeur. « Utiliser comme référence » conserve l’image comme repère visuel pour générer à partir du prompt et de l’exemple.',
      },
    ],
  },
  ru: {
    title: 'Частые вопросы',
    description:
      'Ответы на частые вопросы о галерее промптов Vogue AI и рабочем пространстве.',
    items: [
      {
        question: 'Что такое Vogue AI?',
        answer:
          'Vogue AI — это галерея промптов Nano Banana, Midjourney и GPT Image для авторов. Здесь можно просматривать повторно используемые визуальные промпты, адаптировать их и создавать изображения в едином рабочем пространстве.',
      },
      {
        question: 'Можно ли копировать и редактировать промпты?',
        answer:
          'Да. Откройте любую карточку, скопируйте или переиспользуйте структуру промпта, замените тему и детали стиля, а затем продолжайте в рабочем пространстве.',
      },
      {
        question: 'Для каких моделей подходят эти промпты?',
        answer:
          'Галерея фокусируется на повторно используемых идеях для Nano Banana, Midjourney, GPT Image и близких визуальных workflow, где одну структуру можно адаптировать под разные модели.',
      },
      {
        question: 'Какой контент можно создавать?',
        answer:
          'Можно создавать редакционные визуалы, постеры, продуктовые сцены, портреты, креативы для соцсетей и другие изображения на основе проверенных примеров.',
      },
      {
        question: 'Нужен ли опыт в prompt engineering?',
        answer:
          'Нет. Начните с рабочего примера, оставьте понравившиеся части, замените тему и стиль, затем генерируйте в том же рабочем пространстве.',
      },
      {
        question: 'Как генератор связан с галереей?',
        answer:
          '«Использовать промпт» отправляет выбранный текст в редактор. «Референс» сохраняет изображение как визуальную опору, чтобы генерировать по промпту и примеру одновременно.',
      },
    ],
  },
  pt: {
    title: 'Perguntas frequentes',
    description:
      'Respostas para dúvidas comuns sobre a galeria de prompts do Vogue AI e a área de trabalho.',
    items: [
      {
        question: 'O que é o Vogue AI?',
        answer:
          'O Vogue AI é uma galeria de prompts Nano Banana, Midjourney e GPT Image para criadores. Você pode explorar prompts visuais reutilizáveis, adaptá-los e gerar imagens em uma área de trabalho única.',
      },
      {
        question: 'Posso copiar e editar os prompts?',
        answer:
          'Sim. Abra qualquer card da galeria, copie ou reutilize a estrutura do prompt, ajuste o assunto e os detalhes de estilo e continue na área de trabalho.',
      },
      {
        question: 'Para quais modelos esses prompts servem?',
        answer:
          'A galeria reúne ideias de prompts reutilizáveis para Nano Banana, Midjourney, GPT Image e fluxos visuais relacionados, com estruturas que podem ser adaptadas entre modelos.',
      },
      {
        question: 'Que tipo de conteúdo posso criar?',
        answer:
          'Você pode criar visuais editoriais, pôsteres, cenas de produto, retratos, referências criativas para redes sociais e outras ideias de imagem a partir de exemplos testados.',
      },
      {
        question: 'Preciso saber engenharia de prompts?',
        answer:
          'Não. Comece por um exemplo que já funciona, mantenha as partes úteis, troque o assunto e o estilo e gere na mesma área de trabalho.',
      },
      {
        question: 'Como o gerador se conecta à galeria?',
        answer:
          '“Usar prompt” envia o texto selecionado para o compositor. “Referência” mantém a imagem como referência visual para gerar usando o prompt e o exemplo juntos.',
      },
    ],
  },
  ja: {
    title: 'よくある質問',
    description:
      'Vogue AI のプロンプトギャラリーとワークスペースについて、よくある質問に答えます。',
    items: [
      {
        question: 'Vogue AI とは何ですか？',
        answer:
          'Vogue AI は、クリエイター向けの Nano Banana、Midjourney、GPT Image プロンプトギャラリーです。再利用しやすいビジュアルプロンプトを探し、編集し、ひとつのワークスペースで画像を生成できます。',
      },
      {
        question: 'プロンプトをコピーして編集できますか？',
        answer:
          'できます。ギャラリーカードを開き、プロンプト構造をコピーまたは再利用して、被写体やスタイルの詳細を自分の目的に合わせて調整し、ワークスペースで続けられます。',
      },
      {
        question: 'どのモデル向けのプロンプトですか？',
        answer:
          'Nano Banana、Midjourney、GPT Image、関連する画像生成ワークフローで再利用しやすいプロンプトを中心に集めています。同じ構造を複数のモデルに合わせて調整できます。',
      },
      {
        question: 'どんなコンテンツを作れますか？',
        answer:
          'エディトリアル風ビジュアル、ポスター、商品シーン、ポートレート、SNS向けクリエイティブ参考など、実例から始めるさまざまな画像を作れます。',
      },
      {
        question: 'プロンプトエンジニアリングの経験は必要ですか？',
        answer:
          '必要ありません。動作する例から始め、気に入った部分を残し、被写体とスタイルを差し替えて同じワークスペースで生成できます。',
      },
      {
        question: 'ギャラリーと生成器はどうつながっていますか？',
        answer:
          '「プロンプトを使う」は選択したテキストをコンポーザーに送ります。「参考にする」は画像をビジュアル参考として保持し、プロンプトと例の両方から生成できます。',
      },
    ],
  },
  ko: {
    title: '자주 묻는 질문',
    description:
      'Vogue AI 프롬프트 갤러리와 작업 공간에 대한 자주 묻는 질문입니다.',
    items: [
      {
        question: 'Vogue AI는 무엇인가요?',
        answer:
          'Vogue AI는 크리에이터를 위한 Nano Banana, Midjourney 및 GPT Image 프롬프트 갤러리입니다. 재사용 가능한 비주얼 프롬프트를 둘러보고, 수정하고, 하나의 작업 공간에서 이미지를 생성할 수 있습니다.',
      },
      {
        question: '프롬프트를 복사하고 수정할 수 있나요?',
        answer:
          '네. 갤러리 카드를 열어 프롬프트 구조를 복사하거나 재사용하고, 주제와 스타일 디테일을 바꾼 뒤 작업 공간에서 이어서 작업할 수 있습니다.',
      },
      {
        question: '이 프롬프트는 어떤 모델용인가요?',
        answer:
          'Nano Banana, Midjourney, GPT Image 및 관련 비주얼 생성 워크플로에서 재사용하기 좋은 프롬프트 아이디어를 중심으로 구성되어 있으며, 같은 구조를 여러 모델에 맞게 조정할 수 있습니다.',
      },
      {
        question: '어떤 콘텐츠를 만들 수 있나요?',
        answer:
          '에디토리얼 비주얼, 포스터, 제품 장면, 인물 이미지, 소셜 크리에이티브 레퍼런스 등 검증된 예시에서 출발하는 다양한 이미지를 만들 수 있습니다.',
      },
      {
        question: '프롬프트 엔지니어링 경험이 필요하나요?',
        answer:
          '필요하지 않습니다. 잘 작동하는 예시에서 시작해 마음에 드는 부분은 유지하고, 주제와 스타일만 바꿔 같은 작업 공간에서 생성하면 됩니다.',
      },
      {
        question: '생성기와 갤러리는 어떻게 연결되나요?',
        answer:
          '“프롬프트 사용”은 선택한 텍스트를 작성기로 보냅니다. “레퍼런스”는 이미지를 시각 참고로 유지해 프롬프트와 예시 이미지를 함께 사용해 생성할 수 있게 합니다.',
      },
    ],
  },
};

export function getHomeFAQCopy(locale: string) {
  return faqCopy[normalizeVogueLocale(locale)];
}

export default function HomeFAQ({ locale }: { locale: string }) {
  const copy = getHomeFAQCopy(locale);

  return (
    <section id="faq" className="bg-[var(--vogue-page)] py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-black text-slate-950">
            {copy.title}
          </h2>
          <p className="mx-auto max-w-3xl text-xl text-slate-600">
            {copy.description}
          </p>
        </div>

        <div className="mx-auto max-w-4xl">
          <div className="space-y-6">
            {copy.items.map((faq) => (
              <details
                key={faq.question}
                className="group overflow-hidden rounded-[18px] border border-slate-200 bg-white/86 shadow-[0_18px_46px_rgba(72,92,130,0.1)] backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between p-6 transition-colors hover:bg-[#f7fbff]">
                  <h3 className="pr-4 text-lg font-semibold text-slate-950">
                    {faq.question}
                  </h3>
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-slate-950">
                    <svg
                      className="h-4 w-4 text-white transition-transform duration-200 group-open:rotate-45"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  </div>
                </summary>
                <div className="border-t border-slate-200 px-6 pb-6">
                  <p className="pt-4 leading-relaxed text-slate-600">
                    {faq.answer}
                  </p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
