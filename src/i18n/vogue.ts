import type { Messages } from 'next-intl';

export type VogueLocale = 'en' | 'zh' | 'fr' | 'ru' | 'pt' | 'ja' | 'ko';

type GalleryCategoryCopy = {
  label: string;
  hint: string;
};

type PricingPlanCopy = {
  name: string;
  price: string;
  monthlyOriginalPrice: string;
  yearlyMonthlyPrice: string;
  yearlyCaption: string;
  description: string;
  features: string[];
  cta: string;
  highlight?: boolean;
  bestValue?: boolean;
};

type PricingPackCopy = {
  name: string;
  price: string;
  description: string;
  cta: string;
  highlight?: boolean;
};

export type VogueUICopy = {
  common: {
    home: string;
    assets: string;
    app: string;
    pricing: string;
    signIn: string;
    account: string;
    credits: string;
    unknown: string;
    close: string;
  };
  home: {
    metaTitle: string;
    metaDescription: string;
    h1: string;
    srDescription: string;
    itemListName: string;
    featureList: string[];
  };
  sidebar: {
    primaryMobileNavigation: string;
    models: string;
    effects: string;
    explore: string;
    moreModels: string;
    projectAssets: string;
    imageWorkspace: string;
    workspace: string;
    prompts: string;
    blog: string;
    veo3: string;
    hailuo: string;
    aiBabyGenerator: string;
    aiBabyPodcast: string;
    lipsync: string;
  };
  gallery: {
    ariaLabel: string;
    filtersAria: string;
    gridAria: string;
    modelFilter: string;
    useFilter: string;
    modelAll: string;
    gptImageFilter: string;
    gptImage15Filter: string;
    aiFilter: string;
    modelGptImage2: string;
    modelGptImage15: string;
    modelAiImage: string;
    modelDescriptionGptImage2: string;
    categories: Record<
      | 'all'
      | 'product'
      | 'poster'
      | 'avatar'
      | 'ui'
      | 'diagram'
      | 'anime'
      | 'photo'
      | 'art'
      | 'epic',
      GalleryCategoryCopy
    >;
    usePrompt: string;
    useAsReference: string;
    useAsRefShort: string;
    copyPrompt: string;
    openSource: string;
    downloadImage: string;
    noMatches: string;
    composerPlaceholder: string;
    by: string;
    prompt: string;
    model: string;
    useCase: string;
    image: string;
    source: string;
    open: string;
    unknown: string;
    promptCountAria: string;
  };
  composer: {
    credits: string;
    estimate: string;
    creditsUnit: string;
    selectModel: string;
    imageGenerationModel: string;
    references: string;
    generating: string;
    generate: string;
    parameters: string;
    removeReference: string;
  };
  app: {
    filters: Record<'all' | 'video' | 'image', string>;
    assets: string;
    emptyHistory: string;
    modelControlLabel: string;
    parameterControlLabel: string;
    promptPlaceholder: string;
    addReference: string;
    statuses: Record<'succeeded' | 'failed' | 'pending' | 'processing', string>;
    imageModel: string;
    noPromptSaved: string;
    generatedAsset: string;
    generatedAssetAlt: string;
    usePrompt: string;
    useAsReference: string;
    download: string;
    parameterLabels: {
      imageNumber: string;
      aspectRatio: string;
      resolution: string;
      quality: string;
    };
    activeModelDescription: string;
    baseCreditsDescription: string;
    imageUnit: string;
    imagesUnit: string;
    errors: {
      generationFailed: string;
      refreshFailed: string;
      promptRequired: string;
      promptTooLong: string;
      referenceTooLarge: string;
      referenceType: string;
      limitedReferenceSlots: string;
      noReferenceSlots: string;
      insufficientCredits: string;
    };
  };
  assets: {
    back: string;
    title: string;
    new: string;
    listView: string;
    gridView: string;
    untitledAsset: string;
    captionsUnavailable: string;
    stillProcessing: string;
    projectAsset: string;
    prompt: string;
    copied: string;
    copy: string;
    noPrompt: string;
    labels: {
      status: string;
      model: string;
      params: string;
      type: string;
      taskId: string;
    };
    defaults: {
      unknown: string;
      defaultParams: string;
      video: string;
      image: string;
    };
    usePrompt: string;
    useAsReference: string;
    download: string;
    blankTitle: string;
    blankDescription: string;
    newGeneration: string;
    newGenerationDescription: string;
    loadMore: string;
    statuses: Record<'succeeded' | 'failed' | 'pending' | 'processing', string>;
  };
  pricing: {
    ariaLabel: string;
    closeLabel: string;
    eyebrow: string;
    title: string;
    description: string;
    subscriptionBadge: string;
    popularBadge: string;
    bestValueBadge: string;
    toggle: {
      monthly: string;
      yearly: string;
      oneTime: string;
      saveUpTo: string;
    };
    monthSuffix: string;
    creditPacksEyebrow: string;
    creditPacksTitle: string;
    creditUnit: string;
    oneTimeBadge: string;
    checkoutTitle: string;
    checkoutDescription: string;
    plans: Record<'basic' | 'pro' | 'creator' | 'elite', PricingPlanCopy>;
    packs: Record<'starter' | 'growth' | 'professional', PricingPackCopy>;
    checkout: {
      close: string;
      stripe: string;
      alipay: string;
      wechatPay: string;
    };
    errors: {
      stripeCheckout: string;
      zpayCheckout: string;
      priceNotConfigured: string;
    };
  };
};

export const SUPPORTED_VOGUE_LOCALES: VogueLocale[] = [
  'en',
  'zh',
  'fr',
  'ru',
  'pt',
  'ja',
  'ko',
];

type VogueMessageCatalog = {
  Vogue?: unknown;
};

export function normalizeVogueLocale(locale?: string | null): VogueLocale {
  if (locale?.startsWith('zh')) return 'zh';
  if (locale?.startsWith('fr')) return 'fr';
  if (locale?.startsWith('ru')) return 'ru';
  if (locale?.startsWith('pt')) return 'pt';
  if (locale?.startsWith('ja')) return 'ja';
  if (locale?.startsWith('ko')) return 'ko';
  return 'en';
}

export function getVogueCopyFromMessages(messages: Messages): VogueUICopy {
  const candidate = (messages as VogueMessageCatalog).Vogue;

  if (!candidate || typeof candidate !== 'object' || Array.isArray(candidate)) {
    throw new Error('Vogue message namespace is not configured');
  }

  return candidate as VogueUICopy;
}
