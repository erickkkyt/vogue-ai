import importedPromptEntries from '../generated/awesome-gptimage2-prompts.json';
import importedSiteAdditionEntries from '../generated/awesome-gptimage2-site-additions.json';
import importedNanoBananaPromptEntries from '../generated/awesome-ai-prompts-nano-banana.json';
import importedMidjourneyPromptEntries from '../generated/awesome-ai-prompts-midjourney.json';
import importedGscIndexedPromptPublicIds from '../generated/gsc-indexed-prompt-public-ids.json';
import importedStablePromptPublicIds from '../generated/prompt-public-ids.json';
import promptSeoSlugs from '../generated/prompt-seo-slugs.json';
import frPromptTranslations from '../generated/awesome-gptimage2-prompts.i18n.fr.json';
import jaPromptTranslations from '../generated/awesome-gptimage2-prompts.i18n.ja.json';
import koPromptTranslations from '../generated/awesome-gptimage2-prompts.i18n.ko.json';
import ptPromptTranslations from '../generated/awesome-gptimage2-prompts.i18n.pt.json';
import ruPromptTranslations from '../generated/awesome-gptimage2-prompts.i18n.ru.json';
import zhPromptTranslations from '../generated/awesome-gptimage2-prompts.i18n.zh.json';
import frSiteAdditionTranslations from '../generated/awesome-gptimage2-site-additions.i18n.fr.json';
import jaSiteAdditionTranslations from '../generated/awesome-gptimage2-site-additions.i18n.ja.json';
import koSiteAdditionTranslations from '../generated/awesome-gptimage2-site-additions.i18n.ko.json';
import ptSiteAdditionTranslations from '../generated/awesome-gptimage2-site-additions.i18n.pt.json';
import ruSiteAdditionTranslations from '../generated/awesome-gptimage2-site-additions.i18n.ru.json';
import zhSiteAdditionTranslations from '../generated/awesome-gptimage2-site-additions.i18n.zh.json';
import enAwesomeAiPromptTranslations from '../generated/awesome-ai-prompts.i18n.en.json';
import frAwesomeAiPromptTranslations from '../generated/awesome-ai-prompts.i18n.fr.json';
import jaAwesomeAiPromptTranslations from '../generated/awesome-ai-prompts.i18n.ja.json';
import koAwesomeAiPromptTranslations from '../generated/awesome-ai-prompts.i18n.ko.json';
import ptAwesomeAiPromptTranslations from '../generated/awesome-ai-prompts.i18n.pt.json';
import ruAwesomeAiPromptTranslations from '../generated/awesome-ai-prompts.i18n.ru.json';
import zhAwesomeAiPromptTranslations from '../generated/awesome-ai-prompts.i18n.zh.json';
import {
  VOGUE_PROMPT_CATEGORY_DEFINITIONS,
  getVoguePromptCategoryKey,
  getVoguePromptClassificationTitle,
  getVoguePromptDisplayTitle,
  getVoguePromptPublicIdCategoryKey,
  type VoguePromptCategoryKey,
  type VoguePromptConcreteCategoryKey,
  type VoguePromptPublicIdCategoryKey,
} from '../prompt-taxonomy';
import {
  getVoguePromptImageDimensions,
  type VoguePromptImageDimensions,
} from '../prompt-image-dimensions';
import { getPromptImageAssets } from '../prompt-image-assets';
import type { VoguePromptImageAsset } from '../prompt-image-types';
import { getPromptImageVariantSrc } from '../prompt-image-variants';
import { createPromptSeoSlug } from '../prompt-slug-utils';
import { normalizeVogueLocale, type VogueLocale } from '@/i18n/vogue';

export type VoguePromptEntry = {
  id: string;
  publicId: string;
  seoSlug?: string;
  sourceOrder: number;
  title: string;
  sourceTitle?: string;
  description?: string;
  images: string[];
  imagePrompts?: VoguePromptImagePrompt[];
  prompt: string;
  originalPrompt?: string;
  promptTranslations?: Partial<Record<VogueLocale, string>>;
  modelId?: string;
  authorName?: string;
  authorHandle?: string;
  publishedLabel: string;
  publishedAtMs?: number;
  galleryPublishedAt?: string;
  galleryPublishedAtMs?: number;
  sourceUrl?: string;
  sourceType?: string;
  languages?: string[];
  categoryText?: string;
  categoryKey?: VoguePromptConcreteCategoryKey;
  publicIdCategoryKey?: VoguePromptPublicIdCategoryKey;
  imageAssets?: VoguePromptImageAsset[];
  defaultImageIndex?: number;
};

export type VoguePromptImagePrompt = {
  image: string;
  prompt: string;
  promptTranslations?: Partial<Record<VogueLocale, string>>;
  sourceId?: string;
  title?: string;
};

export type VoguePromptGalleryEntry = Pick<
  VoguePromptEntry,
  | 'id'
  | 'publicId'
  | 'seoSlug'
  | 'sourceOrder'
  | 'title'
  | 'sourceTitle'
  | 'images'
  | 'imageAssets'
  | 'modelId'
  | 'authorName'
  | 'authorHandle'
  | 'publishedLabel'
  | 'publishedAtMs'
  | 'galleryPublishedAt'
  | 'galleryPublishedAtMs'
  | 'sourceUrl'
  | 'sourceType'
  | 'languages'
  | 'categoryKey'
> & {
  imageCount: number;
  imageDimensions?: VoguePromptImageDimensions | null;
};

export type VogueRelatedPromptEntry = Pick<
  VoguePromptEntry,
  | 'id'
  | 'publicId'
  | 'seoSlug'
  | 'title'
  | 'images'
  | 'imageAssets'
  | 'modelId'
  | 'categoryKey'
>;

export const VOGUE_FEATURED_PROMPT_IDS = [
  'meigen-featured-arri-alexa-dynamic-commercial-shot-79712a31',
  'meigen-featured-high-fashion-advertisement-photo-01e335ca',
  'meigen-featured-premium-youth-culture-advertising-poster-8ed2e239',
  'meigen-featured-matte-black-trophy-premium-poster-c3506832',
  'meigen-featured-minimalist-editorial-character-poster-b0e0676b',
  'meigen-featured-premium-youth-culture-editorial-poster-2f73b51b',
  'meigen-featured-ultra-realistic-black-and-white-high-fashion-editorial-4ca1a6a2',
  'meigen-featured-editorial-photography-with-structured-deep-fashion-styling-b0ee010c',
  'meigen-featured-ultra-realistic-imax-grade-cinematic-action-shot-cafaeb20',
  'meigen-featured-cinematic-movie-poster-with-powerful-female-lead-aefeb7c7',
  'meigen-featured-ultra-realistic-cinematic-portrait-photography-89f5e7ca',
  'meigen-featured-ultra-detailed-hyper-realistic-beauty-editorial-26cdd1e4',
  'meigen-featured-photorealistic-premium-product-render-409a5681',
  'meigen-featured-vintage-filmstrip-collage-of-a-woman-ba719cbd',
  'meigen-featured-ultra-realistic-cinematic-portrait-a26a1203',
  'meigen-featured-low-angle-fashion-campaign-photograph-27aceded',
  'meigen-featured-cinematic-high-end-sneaker-advertisement-poster-5347c1db',
  'meigen-featured-dynamic-luxury-commercial-poster-with-surreal-3d-render-aca78e01',
  'meigen-featured-premium-gen-z-commercial-advertising-poster-631b95d3',
  'meigen-featured-luxury-fashion-editorial-three-panel-composition-c3e40998',
  'meigen-featured-high-end-fashion-campaign-typography-poster-2c94140f',
  'meigen-featured-perfume-key-visual-poster-3ef619c7',
  'meigen-featured-vertical-high-end-fashion-campaign-poster-486c9afe',
  'meigen-featured-ultra-premium-luxury-fashion-advertisement-collage-85f4601f',
  'meigen-featured-creative-collectible-character-packaging-poster-f9d28dcd',
  'meigen-featured-luxury-editorial-composition-from-reference-8303d551',
  'meigen-featured-bold-y2k-japanese-street-editorial-collage-poster-703a5fc5',
  'meigen-featured-cinematic-3d-promotional-travel-poster-9d9792bc',
  'meigen-featured-luxury-resort-editorial-campaign-visual-6aae4434',
  'meigen-featured-create-a-vertical-high-resolution-experimental-fashion-editorial-poste-75428929',
  'meigen-featured-sticker-surrounded-central-subject-editorial-card-aae0cd90',
  'meigen-featured-luxury-publishing-editorial-campaign-visual-f764aa1a',
  'meigen-featured-high-end-outdoor-performance-fashion-campaign-ebbf720d',
  'meigen-featured-dramatic-black-fifa-world-cup-poster-96c5a77c',
  'meigen-featured-high-impact-modern-comic-book-portrait-poster-36079b3f',
  'meigen-featured-premium-high-fashion-editorial-poster-bb62c888',
  'meigen-featured-ultra-detailed-luxury-travel-scrapbook-collage-31e97b36',
  'vogueai-20260615-black-and-white-cinematic-emotional-portrait-ai-prompt',
  'vogueai-20260615-fashion-cover-editorial-portrait-ai-prompt',
  'vogueai-20260615-gaia-motion-triptych-editorial-ai-prompt',
  'vogueai-20260615-moon-water-guardian-woman-concept-ai-prompt',
  'vogueai-20260615-premium-lifestyle-magazine-portrait-editorial-portrait-ai-prompt',
  'vogueai-20260615-the-last-roar-full-body-standing-portrait-editorial-poster-ai-prompt',
  'vogueai-20260615-the-last-roar-magazine-cover-editorial-poster-ai-prompt',
  'vogueai-20260615-the-shape-of-a-creative-life-double-exposure-poster-ai-prompt',
  'vogueai-20260611-minimal-fashion-magazine-cover-ai-prompt',
  'vogueai-20260611-fashion-editorial-watercolor-portrait-ai-prompt',
  'vogueai-20260611-studio-rose-bouquet-editorial-portrait-ai-prompt',
  'vogueai-20260611-editorial-portrait-ai-prompt',
  'vogueai-20260611-soft-waves-editorial-portrait-set-ai-prompt',
  'vogueai-20260611-ai-image-prompt-ai-prompt-14',
  'vogueai-20260611-commercial-city-double-exposure-poster-ai-prompt',
  'vogueai-20260615-empty-coastal-road-editorial-illustration-ai-prompt',
  'x-2065399979959583021',
  'vogueai-20260611-luxury-dessert-brand-poster-ai-prompt',
  'vogueai-20260610-sci-fi-cinematic-campaign-keyframe-ai-prompt',
  'vogueai-20260611-streetwear-character-fashion-drop-ai-prompt',
  'vogueai-20260615-aurora-run-lab-trail-sneaker-cozy-bed-ad-poster-ai-prompt',
  'vogueai-20260610-new-chinese-tea-beverage-packaging-hero-poster-ai-prompt',
  'vogueai-20260610-3d-souvenir-badge-travel-poster-ai-prompt',
  'vogueai-20260611-boarding-pass-3d-cultural-travel-poster-ai-prompt',
  'claude-fable-5-vs-mythos-5-epic-tech-poster-ai-prompt',
  'vogueai-20260610-fictional-brand-miniature-architecture-poster-ai-prompt',
  'vogueai-20260611-floating-city-postage-stamp-diorama-ai-prompt',
  'vogueai-20260611-nba-finals-four-heroes-illustration-poster-ai-prompt',
  'vogueai-20260611-papercraft-layered-hero-poster-ai-prompt',
  'vogueai-20260610-retro-aviation-travel-poster-ai-prompt',
  'vogueai-20260615-identity-lock-across-scenes-football-supporter-poster-ai-prompt',
  'vogueai-20260611-kawaii-scrapbook-station-paper-diorama-ai-prompt',
  'vogueai-20260611-surreal-advertising-concept-board-ai-prompt',
  'vogueai-20260611-food-photo-xiaohongshu-cover-edit-ai-prompt',
  'vogueai-20260615-last-dance-football-supporter-poster-ai-prompt',
  'vogueai-20260611-silhouette-universe-collectible-poster-ai-prompt',
  'vogueai-20260611-startup-founder-editorial-portrait-ai-prompt',
  'vogueai-20260615-urban-nomad-visual-poster-ai-prompt',
  'vogueai-20260615-vela-atelier-photo-poster-ai-prompt',
  'vogueai-20260611-visual-poster-ai-prompt-3',
  'vogueai-20260611-cinematic-cosmic-spacecraft-vista-ai-prompt',
  'vogueai-20260611-ancient-poetry-social-card-ai-prompt',
  'vogueai-20260611-food-action-six-panel-collage-ai-prompt',
  'vogueai-20260615-skinny-teenage-scavenger-poster-ai-prompt',
  'vogueai-20260611-sports-supporter-poster-ai-prompt',
  'vogueai-20260611-sword-hero-dual-composition-poster-ai-prompt',
  'vogueai-20260611-traditional-sumi-e-warrior-poster-ai-prompt',
  'vogueai-20260611-vehicle-collector-spec-poster-ai-prompt',
  'vogueai-20260611-world-cup-national-supporter-poster-ai-prompt',
  'vogueai-20260615-architecture-window-view-photo-ai-prompt',
  'vogueai-20260611-travel-photo-handwritten-annotation-ai-prompt',
  'vogueai-20260611-ai-image-prompt-ai-prompt-5',
  'vogueai-20260611-ai-image-prompt-ai-prompt-6',
  'vogueai-20260611-ai-image-prompt-ai-prompt-11',
  'vogueai-20260610-anime-fantasy-character-poster-ai-prompt',
  'vogueai-20260615-high-impact-commercial-food-double-juice-burger-commercial-poster-ai-prompt',
  'vogueai-20260615-aira-stormglass-theme-card-ai-prompt',
  'vogueai-20260615-3d-character-concept-ai-prompt',
  'vogueai-20260615-an-instantly-readable-pareidolia-logo-ai-prompt',
  'vogueai-20260615-ceramicist-concept-ai-prompt',
  'vogueai-20260610-creator-personal-brand-identity-mockup-ai-prompt',
  'vogueai-20260615-algeria-tilt-shift-map-collage-poster-ai-prompt',
  'vogueai-20260611-photo-object-english-label-stickers-ai-prompt',
  'x-2055491388310237685',
  'x-2057291128463085646',
  'x-2058509184581107776',
  'x-2054116876591272081',
  'vogueai-20260610-fictional-brand-action-campaign-poster-ai-prompt',
  'x-2053310109678535000',
  'x-2057802746171179048',
  'london-graduation-silhouette-poster',
  'x-2058397766163054705',
  'x-2054203134411739609',
  'x-2053512135993385454',
  'nanobanana-org-1445',
  'x-2061384949266309409',
  'x-2053338653230068166',
  'x-2061335069730726389',
  'x-2054054476429009086',
  'x-2053719156210774269',
  'x-2053822435062141367',
  'x-2056988183104233783',
  'vogueai-20260615-player-legacy-football-supporter-poster-ai-prompt',
  'x-2061346154642805147',
  'x-2055085798555558380',
  'x-2053730426259472870',
  'x-2053681053769105632',
  'x-2053879429265572226',
  'x-2061103821305356445',
  'vogueai-20260610-eastern-luxury-jewelry-campaign-poster-ai-prompt',
  'x-2061450776925585435',
  'x-2054942313781313621',
  'x-2054202646618407231',
  'x-2054139543423492547',
  'x-2054025608074760282',
  'x-2053819797214019996',
  'x-2053327310435266632',
  'x-2053115572112785659',
  'x-2047036229028635042-r1-dark-fantasy-stage-poster',
  'x-2057652843277165024',
  'x-2047218442030166086-r1-product-marketing-openai-merch-poster-grid',
  'vogueai-20260610-fictional-football-illustration-poster-ai-prompt',
  'x-2054015202098839660',
  'vogueai-20260610-neo-editorial-design-showcase-poster-ai-prompt',
  'x-2053811659484139961',
  'x-2054955002830217407',
  'x-1986879577189224803',
  'x-2053803928773640201',
  'x-2047098533275209826-social-media-post-cinematic-ai-mood-board',
  'x-2053791622702432453',
  'x-2061305471492096301',
  'x-2053495454764282108',
  'x-2057096166123212895',
  'x-2055516978383852002',
  'x-2055473321035399313',
  'x-2054103534854168964',
  'x-2046837522475712741',
  'x-2046144801071079612',
  'x-2045873940883808523-guangzhou-city-impression-swallow-poster',
  'vogueai-20260610-cinematic-winter-fantasy-portrait-ai-prompt',
  'x-2057787675298476353',
  'x-2061421399043092885',
  'x-2053511449881026614',
  'x-2053359720459821168',
  'x-2048431408318705733',
  'vogueai-20260610-fictional-dessert-product-macro-ad-ai-prompt',
  'x-2047048555622244582-r1-social-media-post-transform-train-scene-into-vintage-diner',
  'x-2053916651729662183',
  'x-2053691962251981084',
  'x-2058656784743850071',
  'x-2058612784645238890',
  'x-2056940651913285886',
  'x-2045368305079447853',
  'x-2057834496842723430',
  'x-2056661445950214603',
  'x-2056399689457500387',
  'x-2054111354202779672',
  'x-2054118230726447333',
  'x-2053851273342967963',
  'x-2046564674112831920-barbecue-three-sword-style-portrait',
  'x-2046268941941850575-soft-black-mist-korean-idol-3x3-collage',
] as const;

export const VOGUE_FEATURED_PROMPT_PUBLIC_IDS = VOGUE_FEATURED_PROMPT_IDS;

const vogueFeaturedPromptIdSet = new Set<string>(
  VOGUE_FEATURED_PROMPT_IDS
);

export const isVogueFeaturedPromptEntry = (
  entry: Pick<VoguePromptEntry, 'id' | 'publicId'>
) =>
  vogueFeaturedPromptIdSet.has(entry.publicId) ||
  vogueFeaturedPromptIdSet.has(entry.id);

type PromptGalleryOptions = {
  limit?: number;
  offset?: number;
  modelId?: string | null;
  featured?: boolean;
  categoryKey?: VoguePromptCategoryKey | null;
  categoryKeys?: VoguePromptConcreteCategoryKey[];
  sort?: 'default' | 'homepageFresh';
};

type PromptLocalizedFields = {
  title: string;
  prompt: string;
};

type PromptTranslationMap = Record<string, PromptLocalizedFields>;

const promptTranslationMaps: Record<VogueLocale, PromptTranslationMap> = {
  en: {
    ...enAwesomeAiPromptTranslations,
  },
  zh: {
    ...zhPromptTranslations,
    ...zhSiteAdditionTranslations,
    ...zhAwesomeAiPromptTranslations,
  },
  fr: {
    ...frPromptTranslations,
    ...frSiteAdditionTranslations,
    ...frAwesomeAiPromptTranslations,
  },
  ru: {
    ...ruPromptTranslations,
    ...ruSiteAdditionTranslations,
    ...ruAwesomeAiPromptTranslations,
  },
  pt: {
    ...ptPromptTranslations,
    ...ptSiteAdditionTranslations,
    ...ptAwesomeAiPromptTranslations,
  },
  ja: {
    ...jaPromptTranslations,
    ...jaSiteAdditionTranslations,
    ...jaAwesomeAiPromptTranslations,
  },
  ko: {
    ...koPromptTranslations,
    ...koSiteAdditionTranslations,
    ...koAwesomeAiPromptTranslations,
  },
};

const PROMPT_SOURCE_CODES = {
  x: '01',
  other: '02',
  vogueai: '03',
} as const;

const PROMPT_MODEL_CODES: Record<string, string> = {
  gptimage2: '01',
  nanobanana: '02',
  midjourney: '03',
};

const PROMPT_CATEGORY_CODES: Record<VoguePromptPublicIdCategoryKey | VoguePromptConcreteCategoryKey, string> = {
  product: '01',
  poster: '02',
  avatar: '03',
  ui: '04',
  diagram: '05',
  anime: '06',
  photo: '07',
  art: '08',
  epic: '09',
  portrait: '03',
  brandAds: '10',
  fashion: '11',
  social: '12',
};

const legacyPromptPublicIds = new Map<string, string>([
  ...Object.entries(importedStablePromptPublicIds),
  ['meigen-featured-arri-alexa-dynamic-commercial-shot-79712a31', '020101200'],
  ['meigen-featured-high-fashion-advertisement-photo-01e335ca', '020101201'],
  ['meigen-featured-premium-youth-culture-advertising-poster-8ed2e239', '020101202'],
  ['meigen-featured-matte-black-trophy-premium-poster-c3506832', '020102200'],
  ['meigen-featured-minimalist-editorial-character-poster-b0e0676b', '020102201'],
  ['meigen-featured-premium-youth-culture-editorial-poster-2f73b51b', '020102202'],
  ['meigen-featured-ultra-realistic-black-and-white-high-fashion-editorial-4ca1a6a2', '020107200'],
  ['meigen-featured-editorial-photography-with-structured-deep-fashion-styling-b0ee010c', '010107200'],
  ['meigen-featured-ultra-realistic-imax-grade-cinematic-action-shot-cafaeb20', '010107201'],
  ['meigen-featured-cinematic-movie-poster-with-powerful-female-lead-aefeb7c7', '010107202'],
  ['meigen-featured-ultra-realistic-cinematic-portrait-photography-89f5e7ca', '010107203'],
  ['meigen-featured-ultra-detailed-hyper-realistic-beauty-editorial-26cdd1e4', '010107204'],
  ['meigen-featured-photorealistic-premium-product-render-409a5681', '010107205'],
  ['meigen-featured-vintage-filmstrip-collage-of-a-woman-ba719cbd', '010107206'],
  ['meigen-featured-ultra-realistic-cinematic-portrait-a26a1203', '010107207'],
  ['meigen-featured-low-angle-fashion-campaign-photograph-27aceded', '010101200'],
  ['meigen-featured-cinematic-high-end-sneaker-advertisement-poster-5347c1db', '010101201'],
  ['meigen-featured-dynamic-luxury-commercial-poster-with-surreal-3d-render-aca78e01', '010101202'],
  ['meigen-featured-premium-gen-z-commercial-advertising-poster-631b95d3', '010101203'],
  ['meigen-featured-luxury-fashion-editorial-three-panel-composition-c3e40998', '010101204'],
  ['meigen-featured-high-end-fashion-campaign-typography-poster-2c94140f', '010101205'],
  ['meigen-featured-perfume-key-visual-poster-3ef619c7', '010101206'],
  ['meigen-featured-vertical-high-end-fashion-campaign-poster-486c9afe', '010101207'],
  ['meigen-featured-ultra-premium-luxury-fashion-advertisement-collage-85f4601f', '010101208'],
  ['meigen-featured-creative-collectible-character-packaging-poster-f9d28dcd', '010101209'],
  ['meigen-featured-luxury-editorial-composition-from-reference-8303d551', '010101210'],
  ['meigen-featured-bold-y2k-japanese-street-editorial-collage-poster-703a5fc5', '010108200'],
  ['meigen-featured-cinematic-3d-promotional-travel-poster-9d9792bc', '010102200'],
  ['meigen-featured-luxury-resort-editorial-campaign-visual-6aae4434', '010102201'],
  ['meigen-featured-create-a-vertical-high-resolution-experimental-fashion-editorial-poste-75428929', '010102202'],
  ['meigen-featured-sticker-surrounded-central-subject-editorial-card-aae0cd90', '010102203'],
  ['meigen-featured-luxury-publishing-editorial-campaign-visual-f764aa1a', '010102204'],
  ['meigen-featured-high-end-outdoor-performance-fashion-campaign-ebbf720d', '010102205'],
  ['meigen-featured-dramatic-black-fifa-world-cup-poster-96c5a77c', '010102206'],
  ['meigen-featured-high-impact-modern-comic-book-portrait-poster-36079b3f', '010102207'],
  ['meigen-featured-premium-high-fashion-editorial-poster-bb62c888', '010102208'],
  ['meigen-featured-ultra-detailed-luxury-travel-scrapbook-collage-31e97b36', '010102209'],
  ['x-2059998163532952054', '010307008'],
  ['vogueai-20260603-codex-macos-permission-dialog-ai-prompt', '030104001'],
  ['vogueai-20260603-watercolor-travel-poster-ai-prompt', '030108001'],
  ['vogueai-20260603-double-exposure-city-poster-ai-prompt', '030102001'],
  ['vogueai-20260608-luxury-product-alchemy', '030101001'],
  ['vogueai-20260608-retro-art-print-portrait-poster-from-photo', '030102002'],
  ['vogueai-20260608-fictional-hollywood-starlet-publicity-poster', '030102003'],
  ['vogueai-20260608-naive-digital-portrait-avatar-from-selfie', '030103001'],
  ['vogueai-20260603-personal-image-diagnosis-consulting-board-ai-prompt', '030104004'],
  ['vogueai-20260603-single-food-life-cycle-infographic-ai-prompt', '030105001'],
  ['vogueai-20260603-architectural-competition-presentation-board-ai-prompt', '030108002'],
  ['vogueai-20260603-outfit-breakdown-layout-transfer-ai-prompt', '030105004'],
  ['vogueai-20260603-traditional-face-reading-analysis-poster-ai-prompt', '030102007'],
  ['vogueai-20260603-palmistry-analysis-report-poster-ai-prompt', '030102009'],
  ['vogueai-20260603-physiognomy-analysis-report-poster-ai-prompt', '030102010'],
  ['vogueai-20260603-bazi-destined-partner-portrait-ai-prompt', '030103002'],
  ['vogueai-20260603-bazi-personal-tarot-card-ai-prompt', '030103003'],
  ['vogueai-20260603-bazi-personal-ip-character-ai-prompt', '030101003'],
  ['vogueai-20260603-bazi-life-dossier-infographic-ai-prompt', '030105005'],
  ['vogueai-20260603-xiaohongshu-3d-profile-card-ai-prompt', '030101005'],
  ['vogueai-20260603-ancient-poetry-social-card-ai-prompt', '030101004'],
  ['vogueai-20260603-xiaohongshu-nine-grid-life-guide-ai-prompt', '030105008'],
  ['vogueai-20260603-xiaohongshu-vertical-process-flow-card-ai-prompt', '030105009'],
  ['vogueai-20260603-food-photo-xiaohongshu-cover-edit-ai-prompt', '030101007'],
  ['vogueai-20260603-travel-photo-handwritten-annotation-ai-prompt', '030107005'],
  ['vogueai-20260603-traditional-sumi-e-warrior-poster-ai-prompt', '030102024'],
  ['vogueai-20260610-3d-historical-biography-poster-ai-prompt', '030102011'],
  ['vogueai-20260610-3d-souvenir-badge-travel-poster-ai-prompt', '030102005'],
  ['vogueai-20260610-adult-university-classroom-story-still-ai-prompt', '030107002'],
  ['vogueai-20260610-anime-fantasy-character-poster-ai-prompt', '030106001'],
  ['vogueai-20260610-athletic-locker-room-portrait-ai-prompt', '030103007'],
  ['vogueai-20260610-black-and-white-intellectual-portrait-ai-prompt', '030103010'],
  ['vogueai-20260610-business-profile-headshot-card-ai-prompt', '030103005'],
  ['vogueai-20260610-cinematic-bedroom-composition-analysis-fashion-editorial-ai-prompt', '030107007'],
  ['vogueai-20260610-cinematic-male-studio-portrait-ai-prompt', '030107006'],
  ['vogueai-20260610-cinematic-winter-fantasy-portrait-ai-prompt', '030107003'],
  ['vogueai-20260610-constructivist-classic-car-editorial-grid-ai-prompt', '030105006'],
  ['vogueai-20260610-creator-personal-brand-identity-mockup-ai-prompt', '030101002'],
  ['vogueai-20260610-dressing-room-mirror-fashion-portrait-ai-prompt', '030103008'],
  ['vogueai-20260610-early-2000s-ccd-video-diary-storyboard-ai-prompt', '030105003'],
  ['vogueai-20260610-eastern-luxury-jewelry-campaign-poster-ai-prompt', '030101011'],
  ['vogueai-20260610-fictional-brand-action-campaign-poster-ai-prompt', '030101018'],
  ['vogueai-20260610-fictional-brand-miniature-architecture-poster-ai-prompt', '030101008'],
  ['vogueai-20260610-fictional-dessert-product-macro-ad-ai-prompt', '030101012'],
  ['vogueai-20260610-fictional-football-illustration-poster-ai-prompt', '030102014'],
  ['vogueai-20260610-fictional-football-portrait-campaign-ai-prompt', '030101015'],
  ['vogueai-20260610-fictional-k-pop-silver-foil-editorial-portrait-ai-prompt-2', '030106003'],
  ['vogueai-20260610-fictional-tech-founder-transparent-cutout-meme-asset-ai-prompt', '030101016'],
  ['vogueai-20260611-nba-finals-four-heroes-illustration-poster-ai-prompt', '030102016'],
  ['vogueai-20260611-nba-finals-new-york-front-page-poster-ai-prompt', '030102017'],
  ['vogueai-20260611-nba-finals-putback-rim-pov-poster-ai-prompt', '030102018'],
  ['vogueai-20260611-nba-finals-city-duel-poster-ai-prompt', '030102019'],
  ['vogueai-20260610-football-typographic-perspective-poster-ai-prompt', '030102013'],
  ['vogueai-20260610-hand-drawn-animation-film-background-pastoral-fantasy-ai-prompt', '030107008'],
  ['vogueai-20260610-hand-drawn-photo-annotation-edit-ai-prompt', '030107004'],
  ['vogueai-20260610-handcrafted-3d-pop-up-storybook-travel-illustration-ai-prompt', '030108003'],
  ['vogueai-20260610-high-design-character-relationship-diagram-poster-ai-prompt', '030105007'],
  ['vogueai-20260610-identity-preserving-overhead-phone-cosplay-portrait-ai-prompt', '030106002'],
  ['vogueai-20260610-instant-film-street-fashion-photo-ai-prompt', '030107001'],
  ['vogueai-20260610-japanese-fashion-magazine-cover-illustration-yellow-black-ai-prompt', '030102015'],
  ['vogueai-20260610-japanese-style-2x2-ad-banner-board-ai-prompt', '030101013'],
  ['vogueai-20260610-korean-editorial-fashion-portrait-ai-prompt', '030103011'],
  ['vogueai-20260610-lace-loungewear-product-portrait-ai-prompt', '030101014'],
  ['vogueai-20260610-luxury-fitting-room-mirror-selfie-ai-prompt', '030103004'],
  ['vogueai-20260610-luxury-lace-loungewear-catalog-fashion-advertisement-ai-prompt', '030101017'],
  ['vogueai-20260610-minimal-architectural-landmark-poster-ai-prompt', '030102012'],
  ['vogueai-20260610-minimalist-line-art-everyday-city-travel-poster-ai-prompt', '030102008'],
  ['vogueai-20260610-morning-bedroom-lifestyle-editorial-portrait-ai-prompt', '030103006'],
  ['vogueai-20260610-neo-editorial-design-showcase-poster-ai-prompt', '030102006'],
  ['vogueai-20260610-new-chinese-tea-beverage-packaging-hero-poster-ai-prompt', '030101009'],
  ['vogueai-20260610-official-style-character-reference-sheet-ai-prompt', '030105002'],
  ['vogueai-20260610-premium-ceo-headshot-sample-ai-prompt', '030103009'],
  ['vogueai-20260610-product-giant-typography-campaign-poster-ai-prompt', '030101006'],
  ['vogueai-20260610-retro-aviation-travel-poster-ai-prompt', '030102004'],
  ['vogueai-20260610-sci-fi-cinematic-campaign-keyframe-ai-prompt', '030101010'],
  ['vogueai-20260610-vogue-style-fashion-illustration-photo-edit-ai-prompt', '030108004'],
  ['claude-fable-5-vs-mythos-5-epic-tech-poster-ai-prompt', '030102031'],
]);

const deletedPromptPublicIds = new Set([
  '010105054',
  '010106015',
  '010207002',
  '020102004',
  '020102005',
  '020102006',
  '030101021',
  '030101026',
  '030101027',
  '030101028',
  '030101059',
  '030101060',
  '030101061',
  '030101062',
  '030102035',
  '030102063',
  '030102064',
  '030102081',
  '030103014',
  '030103016',
  '030103033',
  '030103034',
  '030105016',
  '030105022',
  '030105028',
  '030105029',
  '030107012',
  '030107033',
  '030108005',
  '030108009',
  '030108010',
  '030108011',
  '030108013',
]);

const gscIndexedPromptPublicIdSet = new Set<string>(
  importedGscIndexedPromptPublicIds
);

const promptSeoSlugMap = promptSeoSlugs as Record<string, string>;

const legacyPublicIdOrderPrefix = [
  'x-2045092449803284923',
  'x-2044592146255352100',
  'x-2045358053831172358',
  'x-2045836887684694395',
  'x-2045875219307655337',
  'x-2045396918965285111',
  'x-2045368305079447853',
  'x-2045504669401653414',
  'x-2045385588065313057',
  'x-2046115431144902732',
] as const;

const legacyPublicIdRank = new Map<string, number>(
  legacyPublicIdOrderPrefix.map((id, index) => [id, index] as const)
);

const visualDuplicatePromptIds = new Set([
  'x-2046956068417278208-r0-convex-mirror-night-street-selfie',
  'x-2047086715911999728-r1-cyberpunk-girl-with-giant-mech-claw',
  'x-2046971122558611682-r0-e-commerce-main-image-split-screen-athleisure-couch-ad',
  'x-2046929515092554025-r1-e-commerce-main-image-child-three-view-clothing-reference',
]);

const promptDefaultImageIndexes = new Map<string, number>([
  ['vogueai-20260611-studio-rose-bouquet-editorial-portrait-ai-prompt', 1],
]);

const promptImageOrderOverrides = new Map<string, number[]>([
  ['vogueai-20260611-soft-waves-editorial-portrait-set-ai-prompt', [1, 0, 2]],
]);

const reorderPromptItems = <T,>(items: T[] | undefined, order: number[]) => {
  if (!items || items.length !== order.length) return items;

  const orderedItems = order.map((index) => items[index]);
  if (orderedItems.some((item) => item === undefined)) return items;

  return orderedItems as T[];
};

const applyPromptImageOrderOverride = (entry: VoguePromptEntry) => {
  const imageOrder = promptImageOrderOverrides.get(entry.id);
  if (!imageOrder) return entry;

  return {
    ...entry,
    images: reorderPromptItems(entry.images, imageOrder) ?? entry.images,
    imagePrompts: reorderPromptItems(entry.imagePrompts, imageOrder),
  };
};

const getPromptDefaultImageIndex = (entry: VoguePromptEntry) => {
  const imageCount = entry.images?.length ?? 0;
  if (imageCount <= 1) return 0;

  const configuredIndex = promptDefaultImageIndexes.get(entry.id) ?? 0;
  return Math.min(Math.max(configuredIndex, 0), imageCount - 1);
};

const getPromptPublishedAtMs = (publishedLabel: string) => {
  const publishedAtMs = new Date(publishedLabel).getTime();

  return Number.isNaN(publishedAtMs) ? 0 : publishedAtMs;
};

const getOptionalPromptDateMs = (value?: string | null) => {
  const trimmedValue = value?.trim();
  if (!trimmedValue) return undefined;

  const dateMs = new Date(trimmedValue).getTime();
  return Number.isNaN(dateMs) ? undefined : dateMs;
};

const getPromptSourceCode = (
  sourceUrl?: string | null,
  sourceType?: string | null
) => {
  if (sourceType === 'vogueai') return PROMPT_SOURCE_CODES.vogueai;
  if (sourceType === 'x') return PROMPT_SOURCE_CODES.x;
  if (!sourceUrl) return PROMPT_SOURCE_CODES.other;

  try {
    const host = new URL(sourceUrl).hostname.replace(/^www\./, '');

    return host === 'x.com' || host === 'twitter.com'
      ? PROMPT_SOURCE_CODES.x
      : PROMPT_SOURCE_CODES.other;
  } catch {
    return PROMPT_SOURCE_CODES.other;
  }
};

const getPromptModelCode = (modelId?: string | null) =>
  PROMPT_MODEL_CODES[modelId ?? ''] ?? '99';

const getPromptCategoryCode = (
  categoryKey?: VoguePromptPublicIdCategoryKey | VoguePromptConcreteCategoryKey | null
) => PROMPT_CATEGORY_CODES[categoryKey ?? 'photo'];

const comparePromptEntriesForPublicIds = (
  left: VoguePromptEntry,
  right: VoguePromptEntry
) => {
  const leftLegacyRank = legacyPublicIdRank.get(left.id);
  const rightLegacyRank = legacyPublicIdRank.get(right.id);

  if (leftLegacyRank !== undefined && rightLegacyRank !== undefined) {
    return leftLegacyRank - rightLegacyRank;
  }

  if (leftLegacyRank !== undefined) {
    return -1;
  }

  if (rightLegacyRank !== undefined) {
    return 1;
  }

  return left.sourceOrder - right.sourceOrder;
};

const comparePromptEntriesForGallery = (
  left: VoguePromptEntry,
  right: VoguePromptEntry
) => {
  const publishedAtDelta =
    (right.publishedAtMs ?? 0) - (left.publishedAtMs ?? 0);

  if (publishedAtDelta !== 0) return publishedAtDelta;

  const sourceOrderDelta = left.sourceOrder - right.sourceOrder;
  if (sourceOrderDelta !== 0) return sourceOrderDelta;

  return left.id.localeCompare(right.id);
};

const getHomepageGallerySortMs = (entry: VoguePromptEntry) =>
  entry.galleryPublishedAtMs ?? entry.publishedAtMs ?? 0;

const comparePromptEntriesForHomepageGallery = (
  left: VoguePromptEntry,
  right: VoguePromptEntry
) => {
  const homepagePublishedAtDelta =
    getHomepageGallerySortMs(right) - getHomepageGallerySortMs(left);

  if (homepagePublishedAtDelta !== 0) return homepagePublishedAtDelta;

  return comparePromptEntriesForGallery(left, right);
};

const getPromptGalleryComparator = (options: PromptGalleryOptions) =>
  options.sort === 'homepageFresh'
    ? comparePromptEntriesForHomepageGallery
    : comparePromptEntriesForGallery;

const HOMEPAGE_FRESH_DIVERSIFIED_ENTRY_COUNT = 20;
const HOMEPAGE_FRESH_CATEGORY_CAP = 4;
const HOMEPAGE_FRESH_FIRST_THREE_CATEGORY_CAP = 1;
const HOMEPAGE_FRESH_FIRST_SCREEN_ENTRY_COUNT = 6;
const HOMEPAGE_FRESH_FIRST_SCREEN_CATEGORY_CAP = 2;
const HOMEPAGE_FRESH_DEFAULT_DEFERRED_CATEGORY_KEYS = new Set(['ui', 'diagram']);
const HOMEPAGE_FRESH_PORTRAIT_FORWARD_ENTRY_COUNT = 12;
const HOMEPAGE_FRESH_PORTRAIT_FORWARD_MIN_COUNT = 5;
const HOMEPAGE_FRESH_PORTRAIT_FORWARD_CATEGORY_KEYS = new Set([
  'portrait',
  'fashion',
  'art',
  'photo',
]);
const HOMEPAGE_FRESH_PORTRAIT_FORWARD_TITLE_PATTERN =
  /\b(?:portrait|profile|fashion|photo|editorial)\b/i;
const HOMEPAGE_FRESH_MODEL_SEQUENCE = [
  'gptimage2',
  'gptimage2',
  'gptimage2',
  'nanobanana',
  'gptimage2',
  'gptimage2',
  'gptimage2',
  'midjourney',
  'gptimage2',
  'gptimage2',
  'gptimage2',
  'nanobanana',
  'gptimage2',
  'gptimage2',
  'gptimage2',
  'nanobanana',
  'gptimage2',
  'gptimage2',
  'gptimage2',
  'midjourney',
] as const;

const hasConcreteModelFilter = (modelId?: string | null) =>
  Boolean(modelId && modelId !== 'all');

const incrementCount = (counts: Map<string, number>, key: string) => {
  counts.set(key, (counts.get(key) ?? 0) + 1);
};

const isHomepageFreshPortraitForwardEntry = (entry: VoguePromptEntry) =>
  HOMEPAGE_FRESH_PORTRAIT_FORWARD_CATEGORY_KEYS.has(
    entry.categoryKey ?? 'unknown'
  ) && HOMEPAGE_FRESH_PORTRAIT_FORWARD_TITLE_PATTERN.test(entry.title);

const getHomepageFreshCategoryCap = (selectedCount: number) => {
  const nextPosition = selectedCount + 1;

  if (nextPosition <= 3) return HOMEPAGE_FRESH_FIRST_THREE_CATEGORY_CAP;
  if (nextPosition <= HOMEPAGE_FRESH_FIRST_SCREEN_ENTRY_COUNT) {
    return HOMEPAGE_FRESH_FIRST_SCREEN_CATEGORY_CAP;
  }

  return HOMEPAGE_FRESH_CATEGORY_CAP;
};

const getHomepageFreshDiversifiedEntries = (
  sortedEntries: VoguePromptEntry[],
  options: PromptGalleryOptions
) => {
  const targetCount = Math.min(
    HOMEPAGE_FRESH_DIVERSIFIED_ENTRY_COUNT,
    sortedEntries.length
  );
  if (targetCount <= 1) return sortedEntries;

  const selectedEntries: VoguePromptEntry[] = [];
  const selectedIds = new Set<string>();
  const categoryCounts = new Map<string, number>();
  const shouldDiversifyModels = !hasConcreteModelFilter(options.modelId);
  const shouldCapCategories =
    !options.categoryKeys?.length && !isConcreteCategoryKey(options.categoryKey);
  const shouldBalancePortraitForward =
    shouldDiversifyModels && shouldCapCategories;
  const shouldDeferDefaultCategories =
    shouldCapCategories &&
    sortedEntries.filter(
      (entry) =>
        !HOMEPAGE_FRESH_DEFAULT_DEFERRED_CATEGORY_KEYS.has(
          entry.categoryKey ?? 'unknown'
        )
    ).length >= targetCount;

  const canUseCategory = (
    entry: VoguePromptEntry,
    relaxCategoryCap: boolean
  ) => {
    if (!shouldCapCategories || relaxCategoryCap) return true;

    const categoryKey = entry.categoryKey ?? 'unknown';
    return (
      (categoryCounts.get(categoryKey) ?? 0) <
      getHomepageFreshCategoryCap(selectedEntries.length)
    );
  };

  const findNextEntry = ({
    modelId,
    relaxCategoryCap = false,
    portraitForward = false,
  }: {
    modelId?: string;
    relaxCategoryCap?: boolean;
    portraitForward?: boolean;
  }) =>
    sortedEntries.find((entry) => {
      if (selectedIds.has(entry.id)) return false;
      if (modelId && entry.modelId !== modelId) return false;
      if (portraitForward && !isHomepageFreshPortraitForwardEntry(entry)) {
        return false;
      }
      if (
        shouldDeferDefaultCategories &&
        HOMEPAGE_FRESH_DEFAULT_DEFERRED_CATEGORY_KEYS.has(
          entry.categoryKey ?? 'unknown'
        )
      ) {
        return false;
      }
      return canUseCategory(entry, relaxCategoryCap);
    }) ?? null;

  const selectEntry = (entry: VoguePromptEntry) => {
    selectedEntries.push(entry);
    selectedIds.add(entry.id);
    incrementCount(categoryCounts, entry.categoryKey ?? 'unknown');
  };

  for (let index = 0; index < targetCount; index += 1) {
    const scheduledModelId = shouldDiversifyModels
      ? HOMEPAGE_FRESH_MODEL_SEQUENCE[index]
      : undefined;
    const portraitForwardCount = selectedEntries.filter(
      isHomepageFreshPortraitForwardEntry
    ).length;
    const portraitForwardRemainingSlots =
      HOMEPAGE_FRESH_PORTRAIT_FORWARD_ENTRY_COUNT - selectedEntries.length;
    const portraitForwardNeeded = Math.max(
      0,
      HOMEPAGE_FRESH_PORTRAIT_FORWARD_MIN_COUNT - portraitForwardCount
    );
    const shouldForcePortraitForward =
      shouldBalancePortraitForward &&
      selectedEntries.length < HOMEPAGE_FRESH_PORTRAIT_FORWARD_ENTRY_COUNT &&
      portraitForwardNeeded > 0 &&
      portraitForwardRemainingSlots <= portraitForwardNeeded;
    const portraitForwardEntry = shouldForcePortraitForward
      ? (scheduledModelId
          ? findNextEntry({
              modelId: scheduledModelId,
              portraitForward: true,
            }) ??
            findNextEntry({
              modelId: scheduledModelId,
              portraitForward: true,
              relaxCategoryCap: true,
            })
          : findNextEntry({ portraitForward: true }) ??
            findNextEntry({
              portraitForward: true,
              relaxCategoryCap: true,
            }))
      : null;
    const nextEntry =
      portraitForwardEntry ??
      (scheduledModelId
        ? findNextEntry({ modelId: scheduledModelId })
        : null) ??
      (scheduledModelId
        ? findNextEntry({
            modelId: scheduledModelId,
            relaxCategoryCap: true,
          })
        : null) ??
      findNextEntry({}) ??
      findNextEntry({ relaxCategoryCap: true });

    if (!nextEntry) break;

    selectEntry(nextEntry);
  }

  if (selectedEntries.length === 0) return sortedEntries;

  return [
    ...selectedEntries,
    ...sortedEntries.filter((entry) => !selectedIds.has(entry.id)),
  ];
};

const getPromptGallerySortedEntries = (
  promptEntries: VoguePromptEntry[],
  options: PromptGalleryOptions
) => {
  const sortedEntries = promptEntries.toSorted(getPromptGalleryComparator(options));

  return options.sort === 'homepageFresh'
    ? getHomepageFreshDiversifiedEntries(sortedEntries, options)
    : sortedEntries;
};

const buildPromptTranslations = (entry: VoguePromptEntry) => {
  const translations: Partial<Record<VogueLocale, string>> = {};

  for (const [locale, translationMap] of Object.entries(promptTranslationMaps) as Array<
    [VogueLocale, PromptTranslationMap]
  >) {
    const translatedPrompt = translationMap[entry.id]?.prompt?.trim();
    if (!translatedPrompt) continue;

    const sanitizedPrompt = sanitizeLocalizedText(translatedPrompt, locale);
    if (sanitizedPrompt.trim() === entry.prompt.trim()) continue;

    translations[locale] = sanitizedPrompt;
  }

  return translations;
};

const buildImagePromptTranslations = (entry: VoguePromptEntry) =>
  entry.imagePrompts?.map((imagePrompt) => {
    const translations: Partial<Record<VogueLocale, string>> = {};
    const sourceId = imagePrompt.sourceId;

    if (sourceId) {
      for (const [locale, translationMap] of Object.entries(promptTranslationMaps) as Array<
        [VogueLocale, PromptTranslationMap]
      >) {
        const translatedPrompt = translationMap[sourceId]?.prompt?.trim();
        if (!translatedPrompt) continue;

        const sanitizedPrompt = sanitizeLocalizedText(translatedPrompt, locale);
        if (sanitizedPrompt.trim() === imagePrompt.prompt.trim()) continue;

        translations[locale] = sanitizedPrompt;
      }
    }

    return {
      ...imagePrompt,
      promptTranslations:
        Object.keys(translations).length > 0 ? translations : undefined,
    };
  });

const sanitizeLocalizedText = (
  value: string,
  _locale: VogueLocale
) => {
  let nextValue = value;

  nextValue = nextValue
    .replace(/\bSaas\b/g, 'SaaS')
    .replace(/\bAi\b/g, 'AI')
    .replace(/\bIphone\b/g, 'iPhone')
    .replace(/\bYoutube\b/g, 'YouTube')
    .replace(/\bGta\b/g, 'GTA')
    .replace(/\bTotk\b/g, 'TOTK')
    .replace(/\bEa Fc\b/g, 'EA FC')
    .replace(/\bTiktok\b/g, 'TikTok')
    .replace(/\bPov\b/g, 'POV')
    .replace(/Douyin Tiktok/g, 'Douyin/TikTok');

  return nextValue;
};

const localizePublishedLabel = (publishedLabel: string, locale: VogueLocale) => {
  const trimmedLabel = publishedLabel.trim();

  if (!trimmedLabel) {
    return '';
  }

  const parsedDate = new Date(trimmedLabel);

  if (Number.isNaN(parsedDate.getTime())) {
    return trimmedLabel;
  }

  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(parsedDate);
};

const baseEntries = (
  [
    ...(importedPromptEntries as VoguePromptEntry[]),
    ...(importedSiteAdditionEntries as VoguePromptEntry[]),
    ...(importedNanoBananaPromptEntries as VoguePromptEntry[]),
    ...(importedMidjourneyPromptEntries as VoguePromptEntry[]),
  ] as VoguePromptEntry[]
)
  .map((entry) => {
    entry = applyPromptImageOrderOverride(entry);

    const displayTitle = getVoguePromptDisplayTitle(entry);
    const classificationTitle = getVoguePromptClassificationTitle(entry);
    const imagePromptText =
      entry.imagePrompts
        ?.map((imagePrompt) =>
          `${imagePrompt.title ?? ''} ${imagePrompt.prompt}`.trim()
        )
        .join(' ') ?? '';
    const categoryKey = getVoguePromptCategoryKey({
      ...entry,
      title: `${classificationTitle} ${displayTitle}`.trim(),
    });
    const publicIdCategoryKey = getVoguePromptPublicIdCategoryKey({
      ...entry,
      title: classificationTitle,
    });

    return {
      ...entry,
      title: displayTitle,
      sourceTitle: entry.sourceTitle ?? entry.title,
      categoryKey,
      publicIdCategoryKey,
      defaultImageIndex: getPromptDefaultImageIndex(entry),
      publishedAtMs: getPromptPublishedAtMs(entry.publishedLabel),
      galleryPublishedAtMs: getOptionalPromptDateMs(entry.galleryPublishedAt),
      categoryText: `${entry.title} ${displayTitle} ${classificationTitle} ${entry.description ?? ''} ${entry.prompt} ${imagePromptText}`,
    };
  })
  .filter(
    (entry) =>
      entry.prompt && entry.images?.length > 0 && !visualDuplicatePromptIds.has(entry.id)
  )
  .toSorted(comparePromptEntriesForPublicIds);

const assignPublicPromptIds = (promptEntries: VoguePromptEntry[]) => {
  const groupCounts = new Map<string, number>();
  const reservedPublicIds = new Set([
    ...legacyPromptPublicIds.values(),
    ...deletedPromptPublicIds,
  ]);
  const usedPublicIds = new Set<string>();

  return promptEntries.map((entry) => {
    const legacyPublicId = legacyPromptPublicIds.get(entry.id);
    if (legacyPublicId) {
      usedPublicIds.add(legacyPublicId);
      return {
        ...entry,
        publicId: legacyPublicId,
      };
    }

    const sourceCode = getPromptSourceCode(entry.sourceUrl, entry.sourceType);
    const modelCode = getPromptModelCode(entry.modelId);
    const categoryCode = getPromptCategoryCode(
      entry.publicIdCategoryKey ?? entry.categoryKey
    );
    const groupKey = `${sourceCode}${modelCode}${categoryCode}`;
    let sequence = (groupCounts.get(groupKey) ?? 0) + 1;
    let publicId = `${groupKey}${String(sequence).padStart(3, '0')}`;

    while (reservedPublicIds.has(publicId) || usedPublicIds.has(publicId)) {
      sequence += 1;
      publicId = `${groupKey}${String(sequence).padStart(3, '0')}`;
    }
    groupCounts.set(groupKey, sequence);
    usedPublicIds.add(publicId);

    return {
      ...entry,
      publicId,
    };
  });
};

const entries = assignPublicPromptIds(baseEntries).map((entry) => ({
  ...entry,
  seoSlug: promptSeoSlugMap[entry.publicId] ?? createPromptSeoSlug(entry),
}));

export const VOGUE_PROMPT_ENTRY_COUNT = entries.length;

const promptEntriesById = new Map<string, VoguePromptEntry>();

for (const entry of entries) {
  promptEntriesById.set(entry.id, entry);
  promptEntriesById.set(entry.publicId, entry);
}

const relatedPromptEntriesByCategory = entries.reduce(
  (categoryMap, entry) => {
    if (!entry.categoryKey) return categoryMap;

    const categoryEntries = categoryMap.get(entry.categoryKey) ?? [];
    categoryEntries.push(entry);
    categoryMap.set(entry.categoryKey, categoryEntries);

    return categoryMap;
  },
  new Map<VoguePromptConcreteCategoryKey, VoguePromptEntry[]>()
);

export function getLocalizedPromptEntry(
  entry: VoguePromptEntry,
  locale?: string | null
): VoguePromptEntry {
  const promptLocale = normalizeVogueLocale(locale);

  const localizedFields = promptTranslationMaps[promptLocale][entry.id] ?? null;
  const hasCuratedDisplayTitle =
    Boolean(entry.sourceTitle) && entry.sourceTitle !== entry.title;
  const localizedTitle =
    promptLocale === 'en' && hasCuratedDisplayTitle
      ? null
      : localizedFields?.title;

  return {
    ...entry,
    title: localizedTitle
      ? sanitizeLocalizedText(localizedTitle, promptLocale)
      : hasCuratedDisplayTitle
        ? entry.title
        : sanitizeLocalizedText(entry.title, promptLocale),
    prompt: sanitizeLocalizedText(entry.prompt, promptLocale),
    originalPrompt: entry.prompt,
    imagePrompts: buildImagePromptTranslations(entry),
    promptTranslations: buildPromptTranslations(entry),
    publishedLabel: localizePublishedLabel(entry.publishedLabel, promptLocale),
    imageAssets: getPromptImageAssets(entry.images),
  };
}

export function getLocalizedPromptEntries(
  locale?: string | null,
  limit = entries.length
) {
  return entries
    .slice(0, limit)
    .map((entry) => getLocalizedPromptEntry(entry, locale));
}

export function getFeaturedPromptEntries(limit = entries.length) {
  return getLocalizedPromptEntries('en', limit);
}

export function getPromptEntryById(id: string, locale?: string | null) {
  const entry = promptEntriesById.get(id) ?? null;

  return entry ? getLocalizedPromptEntry(entry, locale) : null;
}

const indexablePromptPageEntries = entries.filter((entry) =>
  gscIndexedPromptPublicIdSet.has(entry.publicId)
);
const indexablePromptPublicIdSet = new Set(
  indexablePromptPageEntries.map((entry) => entry.publicId)
);

export const INDEXABLE_PROMPT_PAGE_LIMIT = indexablePromptPageEntries.length;

export function getIndexablePromptPageEntries(limit = INDEXABLE_PROMPT_PAGE_LIMIT) {
  return indexablePromptPageEntries
    .slice(0, Math.max(0, Math.min(limit, INDEXABLE_PROMPT_PAGE_LIMIT)))
    .map((entry) => getLocalizedPromptEntry(entry, 'en'));
}

export const isIndexablePromptPublicId = (publicId: string) =>
  indexablePromptPublicIdSet.has(publicId);

export function getStaticPromptPageEntries() {
  return entries.map((entry) => getLocalizedPromptEntry(entry, 'en'));
}

const RELATED_PROMPT_STOP_WORDS = new Set([
  'and',
  'are',
  'for',
  'from',
  'image',
  'into',
  'prompt',
  'style',
  'the',
  'this',
  'use',
  'using',
  'with',
]);

const RELATED_PROMPT_AFFINITY_GROUPS = [
  ['post', 'posts', 'feed', 'social', 'twitter', 'profile', 'page'],
  ['dashboard', 'interface', 'screen', 'website', 'homepage', 'landing', 'app'],
  ['poster', 'cover', 'flyer', 'campaign', 'thumbnail'],
  ['product', 'ecommerce', 'packaging', 'brand', 'advertisement', 'mockup'],
  ['portrait', 'avatar', 'headshot', 'selfie', 'identity'],
  ['fashion', 'outfit', 'lookbook', 'styling', 'wardrobe'],
  ['youtube', 'instagram', 'tiktok', 'xiaohongshu', 'creator', 'livestream'],
  ['diagram', 'infographic', 'map', 'chart', 'blueprint', 'breakdown'],
] as const;

const RELATED_PROMPT_ADJACENT_CATEGORY_KEYS: Record<
  VoguePromptConcreteCategoryKey,
  VoguePromptConcreteCategoryKey[]
> = {
  product: ['brandAds', 'poster', 'diagram', 'ui', 'photo'],
  brandAds: ['product', 'poster', 'social', 'diagram', 'ui'],
  poster: ['social', 'brandAds', 'art', 'product', 'diagram', 'photo'],
  portrait: ['photo', 'fashion', 'art', 'anime', 'social'],
  fashion: ['portrait', 'photo', 'poster', 'art', 'brandAds'],
  social: ['poster', 'brandAds', 'ui', 'portrait', 'anime'],
  ui: ['diagram', 'product', 'brandAds', 'social'],
  diagram: ['ui', 'product', 'brandAds', 'poster', 'art'],
  anime: ['art', 'portrait', 'poster', 'social'],
  photo: ['portrait', 'fashion', 'art', 'poster', 'product'],
  art: ['poster', 'anime', 'photo', 'portrait', 'diagram'],
};

const RELATED_PROMPT_DEFAULT_LINK_COUNT = 3;
const RELATED_PROMPT_COVERAGE_RANK_LIMIT = 240;
const RELATED_PROMPT_COVERAGE_MAX_SCORE_DROP = 110;
const RELATED_PROMPT_COVERAGE_MIN_SCORE = 95;
const RELATED_PROMPT_RECIPROCAL_MAX_SCORE_DROP = 260;
const RELATED_PROMPT_RECIPROCAL_MIN_SCORE = 30;

type ScoredRelatedPromptEntry = {
  entry: VoguePromptEntry;
  score: number;
};

type RelatedPromptCoverageOpportunity = {
  candidate: ScoredRelatedPromptEntry;
  replaced: ScoredRelatedPromptEntry;
  scoreDrop: number;
  sourceEntry: VoguePromptEntry;
};

type RelatedPromptDiversityOpportunity = RelatedPromptCoverageOpportunity & {
  improvesCoverage: boolean;
  replacedIndex: number;
};

const getRelatedPromptText = (entry: VoguePromptEntry) => {
  const promptTranslationText = Object.values(entry.promptTranslations ?? {}).join(' ');
  const imagePromptText =
    entry.imagePrompts
      ?.map((imagePrompt) =>
        [
          imagePrompt.title,
          imagePrompt.prompt,
          ...Object.values(imagePrompt.promptTranslations ?? {}),
        ]
          .filter(Boolean)
          .join(' ')
      )
      .join(' ') ?? '';

  return `${entry.title} ${entry.sourceTitle ?? ''} ${
    entry.categoryText ?? ''
  } ${promptTranslationText} ${imagePromptText}`;
};

const getRelatedPromptTokens = (entry: VoguePromptEntry) =>
  new Set(
    getRelatedPromptText(entry)
      .toLowerCase()
      .split(/[^a-z0-9]+/i)
      .filter(
        (token) =>
          token.length > 3 &&
          !RELATED_PROMPT_STOP_WORDS.has(token) &&
          !/^\d+$/.test(token)
      )
  );

const relatedPromptTokenCache = new Map<string, Set<string>>();

const getCachedRelatedPromptTokens = (entry: VoguePromptEntry) => {
  const cacheKey = entry.publicId || entry.id;
  const cachedTokens = relatedPromptTokenCache.get(cacheKey);

  if (cachedTokens) return cachedTokens;

  const tokens = getRelatedPromptTokens(entry);
  relatedPromptTokenCache.set(cacheKey, tokens);

  return tokens;
};

const hasAnyToken = (tokens: Set<string>, values: readonly string[]) =>
  values.some((value) => tokens.has(value));

const getRelatedPromptAffinityScore = (
  sourceTokens: Set<string>,
  candidateTokens: Set<string>
) =>
  RELATED_PROMPT_AFFINITY_GROUPS.reduce(
    (score, group) =>
      hasAnyToken(sourceTokens, group) && hasAnyToken(candidateTokens, group)
        ? score + 24
        : score,
    0
  );

const getRelatedPromptScore = (
  sourceEntry: VoguePromptEntry,
  candidateEntry: VoguePromptEntry,
  sourceTokens: Set<string>,
  candidateTokens = getRelatedPromptTokens(candidateEntry)
) => {
  let sharedTokenCount = 0;

  for (const token of candidateTokens) {
    if (sourceTokens.has(token)) sharedTokenCount += 1;
  }

  return (
    (candidateEntry.categoryKey === sourceEntry.categoryKey ? 100 : 0) +
    (candidateEntry.modelId === sourceEntry.modelId ? 30 : 0) +
    Math.min(sharedTokenCount * 5, 45) +
    getRelatedPromptAffinityScore(sourceTokens, candidateTokens) +
    (candidateEntry.sourceType === sourceEntry.sourceType ? 4 : 0) +
    Math.min(candidateEntry.images.length, 4)
  );
};

const compareScoredRelatedPromptEntries = (
  left: ScoredRelatedPromptEntry,
  right: ScoredRelatedPromptEntry
) => {
  const scoreDelta = right.score - left.score;
  if (scoreDelta !== 0) return scoreDelta;

  const sourceOrderDelta = left.entry.sourceOrder - right.entry.sourceOrder;
  if (sourceOrderDelta !== 0) return sourceOrderDelta;

  return left.entry.publicId.localeCompare(right.entry.publicId);
};

const getRelatedPromptCandidateEntries = (sourceEntry: VoguePromptEntry) => {
  const categoryEntries = sourceEntry.categoryKey
    ? relatedPromptEntriesByCategory.get(sourceEntry.categoryKey)
    : null;

  return categoryEntries && categoryEntries.length > 1
    ? categoryEntries
    : entries;
};

const getDiverseRelatedPromptCandidateEntries = (
  sourceEntry: VoguePromptEntry
) => {
  const candidateEntries = new Map<string, VoguePromptEntry>();
  const addEntries = (nextEntries?: VoguePromptEntry[]) => {
    for (const entry of nextEntries ?? []) {
      if (entry.publicId !== sourceEntry.publicId) {
        candidateEntries.set(entry.publicId, entry);
      }
    }
  };

  addEntries(getRelatedPromptCandidateEntries(sourceEntry));

  for (const categoryKey of sourceEntry.categoryKey
    ? RELATED_PROMPT_ADJACENT_CATEGORY_KEYS[sourceEntry.categoryKey]
    : []) {
    addEntries(relatedPromptEntriesByCategory.get(categoryKey));
  }

  return [...candidateEntries.values()];
};

const getRankedRelatedPromptCandidates = (
  sourceEntry: VoguePromptEntry,
  scoringSourceEntry = sourceEntry,
  candidateEntries = getRelatedPromptCandidateEntries(sourceEntry)
) => {
  const sourceTokens =
    scoringSourceEntry.publicId === sourceEntry.publicId
      ? getCachedRelatedPromptTokens(sourceEntry)
      : getRelatedPromptTokens(scoringSourceEntry);

  return candidateEntries
    .filter((entry) => entry.publicId !== sourceEntry.publicId)
    .map((entry) => ({
      entry,
      score: getRelatedPromptScore(
        scoringSourceEntry,
        entry,
        sourceTokens,
        getCachedRelatedPromptTokens(entry)
      ),
    }))
    .toSorted(compareScoredRelatedPromptEntries);
};

const isCoverageCandidateStrongEnough = (
  sourceEntry: VoguePromptEntry,
  candidate: ScoredRelatedPromptEntry,
  replaced: ScoredRelatedPromptEntry
) =>
  candidate.entry.categoryKey === sourceEntry.categoryKey &&
  candidate.score >= RELATED_PROMPT_COVERAGE_MIN_SCORE &&
  replaced.score - candidate.score <= RELATED_PROMPT_COVERAGE_MAX_SCORE_DROP;

const isReciprocalReplacementStrongEnough = (
  sourceEntry: VoguePromptEntry,
  candidate: ScoredRelatedPromptEntry,
  replaced: ScoredRelatedPromptEntry
) =>
  candidate.score >= RELATED_PROMPT_RECIPROCAL_MIN_SCORE &&
  replaced.score - candidate.score <= RELATED_PROMPT_RECIPROCAL_MAX_SCORE_DROP;

const createsImmediateReciprocalLink = (
  selectedEntries: Map<string, ScoredRelatedPromptEntry[]>,
  sourceEntry: VoguePromptEntry,
  candidate: ScoredRelatedPromptEntry
) =>
  (selectedEntries.get(candidate.entry.publicId) ?? []).some(
    (relatedCandidate) =>
      relatedCandidate.entry.publicId === sourceEntry.publicId
  );

const reduceImmediateReciprocalLinks = ({
  diversityRankings,
  graphSourceEntries,
  incomingCounts,
  selectedEntries,
}: {
  diversityRankings: Map<string, ScoredRelatedPromptEntry[]>;
  graphSourceEntries: VoguePromptEntry[];
  incomingCounts: Map<string, number>;
  selectedEntries: Map<string, ScoredRelatedPromptEntry[]>;
}) => {
  const opportunities: RelatedPromptDiversityOpportunity[] = [];
  let appliedCount = 0;

  for (const sourceEntry of graphSourceEntries) {
    const selectedCandidates = selectedEntries.get(sourceEntry.publicId) ?? [];
    const selectedIds = new Set(
      selectedCandidates.map((candidate) => candidate.entry.publicId)
    );
    const rankedCandidates = diversityRankings.get(sourceEntry.publicId) ?? [];

    for (
      let replacedIndex = selectedCandidates.length - 1;
      replacedIndex >= 0;
      replacedIndex -= 1
    ) {
      const replaced = selectedCandidates[replacedIndex];

      if (
        !replaced ||
        !createsImmediateReciprocalLink(selectedEntries, sourceEntry, replaced)
      ) {
        continue;
      }

      const candidates = rankedCandidates.filter((candidate) => {
        if (selectedIds.has(candidate.entry.publicId)) return false;
        if (
          !isReciprocalReplacementStrongEnough(
            sourceEntry,
            candidate,
            replaced
          )
        ) {
          return false;
        }

        return !createsImmediateReciprocalLink(
          selectedEntries,
          sourceEntry,
          candidate
        );
      });
      const candidate =
        candidates.find(
          (candidate) => (incomingCounts.get(candidate.entry.publicId) ?? 0) === 0
        ) ?? candidates[0];

      if (!candidate) continue;

      opportunities.push({
        candidate,
        improvesCoverage:
          (incomingCounts.get(candidate.entry.publicId) ?? 0) === 0,
        replaced,
        replacedIndex,
        scoreDrop: replaced.score - candidate.score,
        sourceEntry,
      });
    }
  }

  opportunities
    .toSorted((left, right) => {
      if (left.improvesCoverage !== right.improvesCoverage) {
        return left.improvesCoverage ? -1 : 1;
      }

      const scoreDropDelta = left.scoreDrop - right.scoreDrop;
      if (scoreDropDelta !== 0) return scoreDropDelta;

      const replacedIndexDelta = right.replacedIndex - left.replacedIndex;
      if (replacedIndexDelta !== 0) return replacedIndexDelta;

      const candidateScoreDelta = right.candidate.score - left.candidate.score;
      if (candidateScoreDelta !== 0) return candidateScoreDelta;

      const sourceOrderDelta =
        left.sourceEntry.sourceOrder - right.sourceEntry.sourceOrder;
      if (sourceOrderDelta !== 0) return sourceOrderDelta;

      return left.candidate.entry.publicId.localeCompare(
        right.candidate.entry.publicId
      );
    })
    .forEach((opportunity) => {
      const selectedCandidates =
        selectedEntries.get(opportunity.sourceEntry.publicId) ?? [];

      if (
        selectedCandidates[opportunity.replacedIndex]?.entry.publicId !==
          opportunity.replaced.entry.publicId ||
        selectedCandidates.some(
          (candidate) =>
            candidate.entry.publicId === opportunity.candidate.entry.publicId
        ) ||
        createsImmediateReciprocalLink(
          selectedEntries,
          opportunity.sourceEntry,
          opportunity.candidate
        )
      ) {
        return;
      }

      selectedCandidates[opportunity.replacedIndex] = opportunity.candidate;
      incomingCounts.set(
        opportunity.replaced.entry.publicId,
        (incomingCounts.get(opportunity.replaced.entry.publicId) ?? 0) - 1
      );
      incomingCounts.set(
        opportunity.candidate.entry.publicId,
        (incomingCounts.get(opportunity.candidate.entry.publicId) ?? 0) + 1
      );
      appliedCount += 1;
    });

  return appliedCount;
};

const forceReduceImmediateReciprocalLinks = ({
  diversityRankings,
  graphSourceEntries,
  incomingCounts,
  selectedEntries,
}: {
  diversityRankings: Map<string, ScoredRelatedPromptEntry[]>;
  graphSourceEntries: VoguePromptEntry[];
  incomingCounts: Map<string, number>;
  selectedEntries: Map<string, ScoredRelatedPromptEntry[]>;
}) => {
  let appliedCount = 0;

  for (const sourceEntry of graphSourceEntries) {
    const selectedCandidates = selectedEntries.get(sourceEntry.publicId) ?? [];
    const rankedCandidates = diversityRankings.get(sourceEntry.publicId) ?? [];

    for (
      let replacedIndex = selectedCandidates.length - 1;
      replacedIndex >= 0;
      replacedIndex -= 1
    ) {
      const replaced = selectedCandidates[replacedIndex];

      if (
        !replaced ||
        !createsImmediateReciprocalLink(selectedEntries, sourceEntry, replaced)
      ) {
        continue;
      }

      const selectedIds = new Set(
        selectedCandidates.map((candidate) => candidate.entry.publicId)
      );
      const replacement = rankedCandidates.find((candidate) => {
        if (selectedIds.has(candidate.entry.publicId)) return false;

        return !createsImmediateReciprocalLink(
          selectedEntries,
          sourceEntry,
          candidate
        );
      });

      if (!replacement) continue;

      selectedCandidates[replacedIndex] = replacement;
      incomingCounts.set(
        replaced.entry.publicId,
        (incomingCounts.get(replaced.entry.publicId) ?? 0) - 1
      );
      incomingCounts.set(
        replacement.entry.publicId,
        (incomingCounts.get(replacement.entry.publicId) ?? 0) + 1
      );
      appliedCount += 1;
    }
  }

  return appliedCount;
};

const relatedPromptCoverageGraphCache = new Map<
  string,
  Map<string, ScoredRelatedPromptEntry[]>
>();

const getCoverageGraphCacheKey = () => 'all';

const getCoverageAdjustedRelatedPromptGraph = (
  sourceEntry: VoguePromptEntry
) => {
  const cacheKey = getCoverageGraphCacheKey();
  const cachedGraph = relatedPromptCoverageGraphCache.get(cacheKey);

  if (cachedGraph) return cachedGraph;

  const rankings = new Map<string, ScoredRelatedPromptEntry[]>();
  const diversityRankings = new Map<string, ScoredRelatedPromptEntry[]>();
  const selectedEntries = new Map<string, ScoredRelatedPromptEntry[]>();
  const incomingCounts = new Map<string, number>();
  const graphSourceEntries = entries;

  for (const entry of graphSourceEntries) {
    incomingCounts.set(entry.publicId, 0);
  }

  for (const graphSourceEntry of graphSourceEntries) {
    const rankedCandidates = getRankedRelatedPromptCandidates(graphSourceEntry).slice(
      0,
      RELATED_PROMPT_COVERAGE_RANK_LIMIT
    );
    const selectedCandidates = rankedCandidates.slice(
      0,
      RELATED_PROMPT_DEFAULT_LINK_COUNT
    );
    rankings.set(graphSourceEntry.publicId, rankedCandidates);
    diversityRankings.set(graphSourceEntry.publicId, rankedCandidates);
    selectedEntries.set(graphSourceEntry.publicId, selectedCandidates);

    for (const candidate of selectedCandidates) {
      incomingCounts.set(
        candidate.entry.publicId,
        (incomingCounts.get(candidate.entry.publicId) ?? 0) + 1
      );
    }
  }

  const opportunities: RelatedPromptCoverageOpportunity[] = [];

  for (const graphSourceEntry of graphSourceEntries) {
    const selectedCandidates =
      selectedEntries.get(graphSourceEntry.publicId) ?? [];
    const replaced = selectedCandidates[RELATED_PROMPT_DEFAULT_LINK_COUNT - 1];

    if (
      selectedCandidates.length < RELATED_PROMPT_DEFAULT_LINK_COUNT ||
      !replaced ||
      (incomingCounts.get(replaced.entry.publicId) ?? 0) <= 1
    ) {
      continue;
    }

    const selectedIds = new Set(
      selectedCandidates.map((candidate) => candidate.entry.publicId)
    );
    const rankedCandidates = rankings.get(graphSourceEntry.publicId) ?? [];

    for (const candidate of rankedCandidates.slice(RELATED_PROMPT_DEFAULT_LINK_COUNT)) {
      if (selectedIds.has(candidate.entry.publicId)) continue;
      if ((incomingCounts.get(candidate.entry.publicId) ?? 0) > 0) continue;
      if (!isCoverageCandidateStrongEnough(graphSourceEntry, candidate, replaced)) {
        continue;
      }
      if (createsImmediateReciprocalLink(selectedEntries, graphSourceEntry, candidate)) {
        continue;
      }

      opportunities.push({
        candidate,
        replaced,
        scoreDrop: replaced.score - candidate.score,
        sourceEntry: graphSourceEntry,
      });
      break;
    }
  }

  opportunities
    .toSorted((left, right) => {
      const scoreDropDelta = left.scoreDrop - right.scoreDrop;
      if (scoreDropDelta !== 0) return scoreDropDelta;

      const candidateScoreDelta = right.candidate.score - left.candidate.score;
      if (candidateScoreDelta !== 0) return candidateScoreDelta;

      const sourceOrderDelta =
        left.sourceEntry.sourceOrder - right.sourceEntry.sourceOrder;
      if (sourceOrderDelta !== 0) return sourceOrderDelta;

      return left.candidate.entry.publicId.localeCompare(
        right.candidate.entry.publicId
      );
    })
    .forEach((opportunity) => {
      const selectedCandidates =
        selectedEntries.get(opportunity.sourceEntry.publicId) ?? [];
      const replacementIndex = RELATED_PROMPT_DEFAULT_LINK_COUNT - 1;

      if (
        selectedCandidates[replacementIndex]?.entry.publicId !==
          opportunity.replaced.entry.publicId ||
        (incomingCounts.get(opportunity.replaced.entry.publicId) ?? 0) <= 1 ||
        (incomingCounts.get(opportunity.candidate.entry.publicId) ?? 0) > 0
      ) {
        return;
      }

      selectedCandidates[replacementIndex] = opportunity.candidate;
      incomingCounts.set(
        opportunity.replaced.entry.publicId,
        (incomingCounts.get(opportunity.replaced.entry.publicId) ?? 0) - 1
      );
      incomingCounts.set(opportunity.candidate.entry.publicId, 1);
    });

  for (let passIndex = 0; passIndex < 4; passIndex += 1) {
    const appliedCount = reduceImmediateReciprocalLinks({
      diversityRankings,
      graphSourceEntries,
      incomingCounts,
      selectedEntries,
    });

    if (appliedCount === 0) break;
  }

  relatedPromptCoverageGraphCache.set(cacheKey, selectedEntries);

  return selectedEntries;
};

const getIndexableRelatedPromptCandidateEntries = (
  sourceEntry: VoguePromptEntry
) =>
  getDiverseRelatedPromptCandidateEntries(sourceEntry).filter((entry) =>
    isIndexablePromptPublicId(entry.publicId)
  );

const getAllIndexableRelatedPromptCandidateEntries = (
  sourceEntry: VoguePromptEntry
) =>
  entries.filter(
    (entry) =>
      entry.publicId !== sourceEntry.publicId &&
      isIndexablePromptPublicId(entry.publicId)
  );

const mergeScoredRelatedPromptRankings = (
  primaryRankings: ScoredRelatedPromptEntry[],
  fallbackRankings: ScoredRelatedPromptEntry[]
) => {
  const merged = [...primaryRankings];
  const selectedIds = new Set(
    primaryRankings.map((candidate) => candidate.entry.publicId)
  );

  for (const candidate of fallbackRankings) {
    if (selectedIds.has(candidate.entry.publicId)) continue;
    merged.push(candidate);
    selectedIds.add(candidate.entry.publicId);
  }

  return merged;
};

const indexableRelatedPromptCoverageGraphCache = new Map<
  string,
  Map<string, ScoredRelatedPromptEntry[]>
>();

const getIndexableCoverageAdjustedRelatedPromptGraph = () => {
  const cacheKey = 'indexable';
  const cachedGraph = indexableRelatedPromptCoverageGraphCache.get(cacheKey);

  if (cachedGraph) return cachedGraph;

  const rankings = new Map<string, ScoredRelatedPromptEntry[]>();
  const diversityRankings = new Map<string, ScoredRelatedPromptEntry[]>();
  const selectedEntries = new Map<string, ScoredRelatedPromptEntry[]>();
  const incomingCounts = new Map<string, number>();
  const graphSourceEntries = indexablePromptPageEntries;

  for (const entry of graphSourceEntries) {
    incomingCounts.set(entry.publicId, 0);
  }

  for (const graphSourceEntry of graphSourceEntries) {
    const rankedCandidates = getRankedRelatedPromptCandidates(
      graphSourceEntry,
      graphSourceEntry,
      getIndexableRelatedPromptCandidateEntries(graphSourceEntry)
    ).slice(0, RELATED_PROMPT_COVERAGE_RANK_LIMIT);
    const broadRankedCandidates = mergeScoredRelatedPromptRankings(
      rankedCandidates,
      getRankedRelatedPromptCandidates(
        graphSourceEntry,
        graphSourceEntry,
        getAllIndexableRelatedPromptCandidateEntries(graphSourceEntry)
      )
    ).slice(0, RELATED_PROMPT_COVERAGE_RANK_LIMIT);
    const selectedCandidates = (
      rankedCandidates.length >= RELATED_PROMPT_DEFAULT_LINK_COUNT
        ? rankedCandidates
        : broadRankedCandidates
    ).slice(0, RELATED_PROMPT_DEFAULT_LINK_COUNT);

    rankings.set(graphSourceEntry.publicId, broadRankedCandidates);
    diversityRankings.set(graphSourceEntry.publicId, broadRankedCandidates);
    selectedEntries.set(graphSourceEntry.publicId, selectedCandidates);

    for (const candidate of selectedCandidates) {
      incomingCounts.set(
        candidate.entry.publicId,
        (incomingCounts.get(candidate.entry.publicId) ?? 0) + 1
      );
    }
  }

  const opportunities: RelatedPromptCoverageOpportunity[] = [];

  for (const graphSourceEntry of graphSourceEntries) {
    const selectedCandidates =
      selectedEntries.get(graphSourceEntry.publicId) ?? [];
    const replaced = selectedCandidates[RELATED_PROMPT_DEFAULT_LINK_COUNT - 1];

    if (
      selectedCandidates.length < RELATED_PROMPT_DEFAULT_LINK_COUNT ||
      !replaced ||
      (incomingCounts.get(replaced.entry.publicId) ?? 0) <= 1
    ) {
      continue;
    }

    const selectedIds = new Set(
      selectedCandidates.map((candidate) => candidate.entry.publicId)
    );
    const rankedCandidates = rankings.get(graphSourceEntry.publicId) ?? [];

    for (const candidate of rankedCandidates.slice(RELATED_PROMPT_DEFAULT_LINK_COUNT)) {
      if (selectedIds.has(candidate.entry.publicId)) continue;
      if ((incomingCounts.get(candidate.entry.publicId) ?? 0) > 0) continue;
      if (!isCoverageCandidateStrongEnough(graphSourceEntry, candidate, replaced)) {
        continue;
      }
      if (createsImmediateReciprocalLink(selectedEntries, graphSourceEntry, candidate)) {
        continue;
      }

      opportunities.push({
        candidate,
        replaced,
        scoreDrop: replaced.score - candidate.score,
        sourceEntry: graphSourceEntry,
      });
      break;
    }
  }

  opportunities
    .toSorted((left, right) => {
      const scoreDropDelta = left.scoreDrop - right.scoreDrop;
      if (scoreDropDelta !== 0) return scoreDropDelta;

      const candidateScoreDelta = right.candidate.score - left.candidate.score;
      if (candidateScoreDelta !== 0) return candidateScoreDelta;

      const sourceOrderDelta =
        left.sourceEntry.sourceOrder - right.sourceEntry.sourceOrder;
      if (sourceOrderDelta !== 0) return sourceOrderDelta;

      return left.candidate.entry.publicId.localeCompare(
        right.candidate.entry.publicId
      );
    })
    .forEach((opportunity) => {
      const selectedCandidates =
        selectedEntries.get(opportunity.sourceEntry.publicId) ?? [];
      const replacementIndex = RELATED_PROMPT_DEFAULT_LINK_COUNT - 1;

      if (
        selectedCandidates[replacementIndex]?.entry.publicId !==
          opportunity.replaced.entry.publicId ||
        (incomingCounts.get(opportunity.replaced.entry.publicId) ?? 0) <= 1 ||
        (incomingCounts.get(opportunity.candidate.entry.publicId) ?? 0) > 0
      ) {
        return;
      }

      selectedCandidates[replacementIndex] = opportunity.candidate;
      incomingCounts.set(
        opportunity.replaced.entry.publicId,
        (incomingCounts.get(opportunity.replaced.entry.publicId) ?? 0) - 1
      );
      incomingCounts.set(opportunity.candidate.entry.publicId, 1);
    });

  for (let passIndex = 0; passIndex < 4; passIndex += 1) {
    const appliedCount = reduceImmediateReciprocalLinks({
      diversityRankings,
      graphSourceEntries,
      incomingCounts,
      selectedEntries,
    });

    if (appliedCount === 0) break;
  }

  for (let passIndex = 0; passIndex < 4; passIndex += 1) {
    const appliedCount = forceReduceImmediateReciprocalLinks({
      diversityRankings,
      graphSourceEntries,
      incomingCounts,
      selectedEntries,
    });

    if (appliedCount === 0) break;
  }

  indexableRelatedPromptCoverageGraphCache.set(cacheKey, selectedEntries);

  return selectedEntries;
};

const toRelatedPromptEntry = (
  entry: VoguePromptEntry
): VogueRelatedPromptEntry => ({
  id: entry.id,
  publicId: entry.publicId,
  seoSlug: entry.seoSlug,
  title: entry.title,
  images: entry.images,
  imageAssets: entry.imageAssets ?? getPromptImageAssets(entry.images),
  modelId: entry.modelId,
  categoryKey: entry.categoryKey,
});

const buildRelatedPromptEntryMap = () => {
  const coverageGraph = entries[0]
    ? getCoverageAdjustedRelatedPromptGraph(entries[0])
    : new Map<string, ScoredRelatedPromptEntry[]>();
  const relatedEntryMap = new Map<string, VogueRelatedPromptEntry[]>();

  for (const sourceEntry of entries) {
    const selectedCandidates = coverageGraph.get(sourceEntry.publicId) ?? [];

    relatedEntryMap.set(
      sourceEntry.publicId,
      selectedCandidates.map(({ entry }) => toRelatedPromptEntry(entry))
    );
  }

  return relatedEntryMap;
};

let precomputedRelatedPromptEntries:
  | Map<string, VogueRelatedPromptEntry[]>
  | null = null;

const getPrecomputedRelatedPromptEntries = () => {
  if (!precomputedRelatedPromptEntries) {
    precomputedRelatedPromptEntries = buildRelatedPromptEntryMap();
  }

  return precomputedRelatedPromptEntries;
};

export function getRelatedPromptEntries(
  entryOrPublicId: VoguePromptEntry | string,
  limit = 3
): VogueRelatedPromptEntry[] {
  const canonicalSourceEntry =
    typeof entryOrPublicId === 'string'
      ? entries.find(
          (entry) =>
            entry.publicId === entryOrPublicId || entry.id === entryOrPublicId
        )
      : entries.find(
          (entry) =>
            entry.publicId === entryOrPublicId.publicId ||
            entry.id === entryOrPublicId.id
        ) ?? entryOrPublicId;
  const scoringSourceEntry =
    typeof entryOrPublicId === 'string'
      ? canonicalSourceEntry
      : entryOrPublicId;
  const normalizedLimit = Math.max(0, Math.min(limit, 6));

  if (!canonicalSourceEntry || !scoringSourceEntry || normalizedLimit === 0) {
    return [];
  }

  if (normalizedLimit <= RELATED_PROMPT_DEFAULT_LINK_COUNT) {
    return (
      getPrecomputedRelatedPromptEntries().get(canonicalSourceEntry.publicId) ??
      []
    ).slice(0, normalizedLimit);
  }

  const rankedCandidates =
    normalizedLimit >= RELATED_PROMPT_DEFAULT_LINK_COUNT
      ? getCoverageAdjustedRelatedPromptGraph(canonicalSourceEntry).get(
          canonicalSourceEntry.publicId
        ) ?? []
      : getRankedRelatedPromptCandidates(
          canonicalSourceEntry,
          scoringSourceEntry
        );
  const selectedCandidates =
    normalizedLimit <= RELATED_PROMPT_DEFAULT_LINK_COUNT
      ? rankedCandidates.slice(0, normalizedLimit)
      : [
          ...rankedCandidates,
          ...getRankedRelatedPromptCandidates(
            canonicalSourceEntry,
            scoringSourceEntry
          ).filter(
            (candidate) =>
              !rankedCandidates.some(
                (selectedCandidate) =>
                  selectedCandidate.entry.publicId === candidate.entry.publicId
              )
          ),
        ].slice(0, normalizedLimit);

  return selectedCandidates.map(({ entry }) => toRelatedPromptEntry(entry));
}

export function getIndexableRelatedPromptEntries(
  entryOrPublicId: VoguePromptEntry | string,
  limit = 3
): VogueRelatedPromptEntry[] {
  const canonicalSourceEntry =
    typeof entryOrPublicId === 'string'
      ? entries.find(
          (entry) =>
            entry.publicId === entryOrPublicId || entry.id === entryOrPublicId
        )
      : entries.find(
          (entry) =>
            entry.publicId === entryOrPublicId.publicId ||
            entry.id === entryOrPublicId.id
        ) ?? entryOrPublicId;
  const scoringSourceEntry =
    typeof entryOrPublicId === 'string'
      ? canonicalSourceEntry
      : entryOrPublicId;
  const normalizedLimit = Math.max(0, Math.min(limit, 6));

  if (!canonicalSourceEntry || !scoringSourceEntry || normalizedLimit === 0) {
    return [];
  }

  const rankedGraphCandidates =
    getIndexableCoverageAdjustedRelatedPromptGraph().get(
      canonicalSourceEntry.publicId
    ) ?? [];
  const fallbackCandidates = getRankedRelatedPromptCandidates(
    canonicalSourceEntry,
    scoringSourceEntry,
    getAllIndexableRelatedPromptCandidateEntries(canonicalSourceEntry)
  );
  const selectedCandidates = mergeScoredRelatedPromptRankings(
    rankedGraphCandidates,
    fallbackCandidates
  ).slice(0, normalizedLimit);

  return selectedCandidates
    .map(({ entry }) => toRelatedPromptEntry(entry));
}

const isConcreteCategoryKey = (
  categoryKey?: VoguePromptCategoryKey | null
): categoryKey is VoguePromptConcreteCategoryKey =>
  Boolean(categoryKey && categoryKey !== 'all');

const getConcreteCategoryFilters = (options: PromptGalleryOptions = {}) => {
  if (options.categoryKeys?.length) {
    return new Set(options.categoryKeys);
  }

  return isConcreteCategoryKey(options.categoryKey)
    ? new Set([options.categoryKey])
    : null;
};

const matchesGalleryOptions = (
  entry: VoguePromptEntry,
  options: PromptGalleryOptions = {}
) => {
  if (options.featured && !isVogueFeaturedPromptEntry(entry)) return false;

  if (options.modelId && options.modelId !== 'all') {
    if ((entry.modelId || 'unknown') !== options.modelId) return false;
  }

  const categoryFilters = getConcreteCategoryFilters(options);
  if (categoryFilters) {
    return Boolean(entry.categoryKey && categoryFilters.has(entry.categoryKey));
  }

  return true;
};

const toPromptGalleryEntry = (
  entry: VoguePromptEntry,
  locale?: string | null
): VoguePromptGalleryEntry => {
  const localizedEntry = getLocalizedPromptEntry(entry, locale);
  const defaultImageIndex = localizedEntry.defaultImageIndex ?? 0;
  const defaultImage = localizedEntry.images[defaultImageIndex];
  const defaultImageAsset = localizedEntry.imageAssets?.[defaultImageIndex] ?? null;
  const thumbnailUrls = defaultImage
    ? [
        getPromptImageVariantSrc({
          entryId: localizedEntry.id,
          imageIndex: defaultImageIndex,
          imageUrl: defaultImage,
          width: 640,
        }),
      ]
    : [];

  return {
    id: localizedEntry.id,
    publicId: localizedEntry.publicId,
    seoSlug: localizedEntry.seoSlug,
    sourceOrder: localizedEntry.sourceOrder,
    title: localizedEntry.title,
    sourceTitle: localizedEntry.sourceTitle,
    images: thumbnailUrls,
    imageAssets: defaultImageAsset ? [defaultImageAsset] : [],
    imageCount: localizedEntry.images.length,
    imageDimensions: defaultImageAsset?.width && defaultImageAsset.height
      ? {
          width: defaultImageAsset.width,
          height: defaultImageAsset.height,
          aspectRatio:
            defaultImageAsset.aspectRatio ??
            `${defaultImageAsset.width} / ${defaultImageAsset.height}`,
        }
      : defaultImage
        ? getVoguePromptImageDimensions(defaultImage)
        : null,
    modelId: localizedEntry.modelId,
    authorName: localizedEntry.authorName,
    authorHandle: localizedEntry.authorHandle,
    publishedLabel: localizedEntry.publishedLabel,
    publishedAtMs: localizedEntry.publishedAtMs,
    galleryPublishedAt: localizedEntry.galleryPublishedAt,
    galleryPublishedAtMs: localizedEntry.galleryPublishedAtMs,
    sourceUrl: localizedEntry.sourceUrl,
    sourceType: localizedEntry.sourceType,
    languages: localizedEntry.languages,
    categoryKey: localizedEntry.categoryKey,
  };
};

export function getLocalizedPromptGalleryEntries(
  locale?: string | null,
  options: PromptGalleryOptions = {}
) {
  const offset = Math.max(0, options.offset ?? 0);
  const limit = Math.max(1, Math.min(options.limit ?? 80, 200));
  const sortedEntries = getPromptGallerySortedEntries(
    entries.filter((entry) => matchesGalleryOptions(entry, options)),
    options
  );

  return sortedEntries
    .slice(offset, offset + limit)
    .map((entry) => toPromptGalleryEntry(entry, locale));
}

export function getLocalizedIndexablePromptGalleryEntries(
  locale?: string | null,
  options: PromptGalleryOptions = {}
) {
  const offset = Math.max(0, options.offset ?? 0);
  const limit = Math.max(1, Math.min(options.limit ?? 80, 200));

  return indexablePromptPageEntries
    .filter((entry) => matchesGalleryOptions(entry, options))
    .toSorted(comparePromptEntriesForGallery)
    .slice(offset, offset + limit)
    .map((entry) => toPromptGalleryEntry(entry, locale));
}

export function getPromptGalleryEntryTotal(options: PromptGalleryOptions = {}) {
  return entries.filter((entry) => matchesGalleryOptions(entry, options)).length;
}

export function getPromptGalleryCounts(options: PromptGalleryOptions = {}) {
  return entries.filter((entry) => matchesGalleryOptions(entry, options)).reduce<{
    total: number;
    featured: number;
    models: Record<string, number>;
    categories: Record<VoguePromptConcreteCategoryKey, number>;
  }>(
    (counts, entry) => {
      const modelId = entry.modelId || 'unknown';

      counts.total += 1;
      if (isVogueFeaturedPromptEntry(entry)) counts.featured += 1;
      counts.models[modelId] = (counts.models[modelId] || 0) + 1;
      if (entry.categoryKey) {
        counts.categories[entry.categoryKey] =
          (counts.categories[entry.categoryKey] || 0) + 1;
      }

      return counts;
    },
    {
      total: 0,
      featured: 0,
      models: {},
      categories: Object.fromEntries(
        VOGUE_PROMPT_CATEGORY_DEFINITIONS.filter(
          (category) => category.key !== 'all'
        ).map((category) => [category.key, 0])
      ) as Record<VoguePromptConcreteCategoryKey, number>,
    }
  );
}
