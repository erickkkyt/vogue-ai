import type { BlogPostSource } from '@/lib/blog-data';
import { brandingPromptsAutoBlogPost } from '@/lib/generated/auto-blog-branding-prompts-post';

export const brandVisualPromptsAutoBlogPost: BlogPostSource = {
  ...brandingPromptsAutoBlogPost,
  slug: 'brand-visual-prompts',
  date: '2026-06-12',
  updatedAt: '2026-06-12',
  localizations: {
    ...brandingPromptsAutoBlogPost.localizations,
    en: {
      ...brandingPromptsAutoBlogPost.localizations.en,
      title: 'Brand visual prompts that turn a brief into campaign-ready images',
      summary:
        'A practical Vogue AI workflow for writing brand visual prompts that produce moodboards, identity posters, campaign images, product visuals, and logo directions.',
      seoTitle: 'Brand Visual Prompts for Campaign-Ready Brand Images',
      seoDescription:
        'Copy brand visual prompts for moodboards, identity posters, campaigns, product visuals, and logo directions, then adapt them inside Vogue AI.',
    },
    zh: {
      ...brandingPromptsAutoBlogPost.localizations.zh,
      title: '把 brief 变成 campaign-ready 视觉的 brand visual prompts',
      summary:
        '一套 Vogue AI 品牌视觉提示词工作流，用于 moodboard、identity poster、campaign image、产品视觉和 logo direction。',
      seoTitle: 'Brand Visual Prompts 品牌视觉工作流',
      seoDescription:
        '复制适用于 moodboard、品牌海报、活动图、产品视觉和 logo direction 的 brand visual prompts，并在 Vogue AI 中改写。',
    },
    fr: {
      ...brandingPromptsAutoBlogPost.localizations.fr,
      title: 'Brand visual prompts pour transformer un brief en visuels de campagne',
      summary:
        'Un workflow Vogue AI pour créer moodboards, posters d’identité, campagnes, visuels produit et pistes de logo.',
      seoTitle: 'Brand Visual Prompts pour visuels de marque',
      seoDescription:
        'Copiez des brand visual prompts pour moodboards, posters, campagnes, produits et directions de logo dans Vogue AI.',
    },
    ru: {
      ...brandingPromptsAutoBlogPost.localizations.ru,
      title: 'Brand visual prompts для кампаний и бренд-визуалов',
      summary:
        'Workflow для Vogue AI: moodboard, identity poster, campaign image, product visual и logo direction из одного brand brief.',
      seoTitle: 'Brand Visual Prompts для бренд-визуалов',
      seoDescription:
        'Копируйте brand visual prompts для moodboard, poster, campaign, product visual и logo direction в Vogue AI.',
    },
    pt: {
      ...brandingPromptsAutoBlogPost.localizations.pt,
      title: 'Brand visual prompts para transformar brief em visuais de campanha',
      summary:
        'Um workflow no Vogue AI para moodboards, posters de identidade, campanhas, produtos e direções de logo.',
      seoTitle: 'Brand Visual Prompts para Visuais de Marca',
      seoDescription:
        'Copie brand visual prompts para moodboards, posters, campanhas, produto e logo direction dentro do Vogue AI.',
    },
    ja: {
      ...brandingPromptsAutoBlogPost.localizations.ja,
      title: 'Brief を campaign-ready な brand visual に変える prompts',
      summary:
        'Vogue AI で moodboard、identity poster、campaign image、product visual、logo direction を作る実践 workflow です。',
      seoTitle: 'Brand Visual Prompts 実践ガイド',
      seoDescription:
        'Moodboard、poster、campaign、product visual、logo direction 用の brand visual prompts を Vogue AI で活用します。',
    },
    ko: {
      ...brandingPromptsAutoBlogPost.localizations.ko,
      title: 'Brief를 campaign-ready 브랜드 visual로 바꾸는 prompts',
      summary:
        'Vogue AI에서 moodboard, identity poster, campaign image, product visual, logo direction을 만드는 실전 workflow입니다.',
      seoTitle: 'Brand Visual Prompts 실전 가이드',
      seoDescription:
        'Moodboard, poster, campaign, product visual, logo direction용 brand visual prompts를 Vogue AI에서 활용하세요.',
    },
  },
};
