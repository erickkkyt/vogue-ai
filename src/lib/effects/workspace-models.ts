import {
  type WorkspaceMediaSchema,
  getWorkspaceMediaSchema,
} from './workspace-media';
import {
  GPT_IMAGE_15_PRICING_SCHEMA,
  GPT_IMAGE_2_PRICING_SCHEMA,
  NANO_BANANA_2_PRICING_SCHEMA,
  NANO_BANANA_PRICING_SCHEMA,
  NANO_BANANA_PRO_PRICING_SCHEMA,
  Z_IMAGE_PRICING_SCHEMA,
} from './pricing';

export type WorkspaceAspectRatio =
  | 'auto'
  | '1:1'
  | '1:2'
  | '2:1'
  | '1:3'
  | '3:1'
  | '2:3'
  | '3:2'
  | '3:4'
  | '4:3'
  | '4:5'
  | '5:4'
  | '9:16'
  | '16:9'
  | '9:21'
  | '21:9';
export type WorkspaceQualityOption = 'low' | 'medium' | 'high' | 'standard';
export type WorkspaceGenerationCount = 1 | 2 | 3 | 4;
export type WorkspaceOutputQuality = '1k' | '2k' | '4k';

export type ImageWorkspaceModel = {
  id: string;
  name: string;
  effectId: number;
  mediaSchema?: WorkspaceMediaSchema;
  uploadPath: string;
  imageBucketName: string;
  credit: number;
  provider?: string;
  pricingSchema?: unknown;
  defaultAspectRatio: WorkspaceAspectRatio;
  supportedAspectRatios: readonly WorkspaceAspectRatio[];
  defaultQuality?: WorkspaceQualityOption;
  qualityOptions?: readonly WorkspaceQualityOption[];
  defaultOutputQuality?: WorkspaceOutputQuality;
  supportedOutputQualities?: readonly WorkspaceOutputQuality[];
  defaultGenerationCount?: WorkspaceGenerationCount;
  supportedGenerationCounts?: readonly WorkspaceGenerationCount[];
};

export const IMAGE_WORKSPACE_MODELS: ImageWorkspaceModel[] = [
  {
    id: 'gptimage2',
    name: 'GPT Image 2',
    effectId: 16,
    mediaSchema: getWorkspaceMediaSchema('gptimage2')!,
    uploadPath: 'effects/gpt-image-2',
    imageBucketName: 'image',
    credit: 10,
    provider: 'kie.gpt-image-2',
    pricingSchema: GPT_IMAGE_2_PRICING_SCHEMA,
    defaultAspectRatio: 'auto',
    supportedAspectRatios: [
      'auto',
      '1:1',
      '1:2',
      '2:1',
      '1:3',
      '3:1',
      '2:3',
      '3:2',
      '3:4',
      '4:3',
      '4:5',
      '5:4',
      '9:16',
      '16:9',
      '9:21',
      '21:9',
    ],
    defaultQuality: 'low',
    qualityOptions: ['low', 'medium', 'high'],
    defaultOutputQuality: '2k',
    supportedOutputQualities: ['1k', '2k', '4k'],
    defaultGenerationCount: 1,
    supportedGenerationCounts: [1, 2, 3, 4],
  },
  {
    id: 'gptimage15',
    name: 'GPT Image 1.5',
    effectId: 15,
    mediaSchema: getWorkspaceMediaSchema('gptimage15')!,
    uploadPath: 'effects/gpt-image-1-5',
    imageBucketName: 'image',
    credit: 4,
    provider: 'kie.gpt-image-1.5',
    pricingSchema: GPT_IMAGE_15_PRICING_SCHEMA,
    defaultAspectRatio: '1:1',
    supportedAspectRatios: ['1:1', '2:3', '3:2'],
    defaultQuality: 'standard',
    qualityOptions: ['standard', 'high'],
    defaultGenerationCount: 1,
    supportedGenerationCounts: [1, 2, 3, 4],
  },
  {
    id: 'zimage',
    name: 'Z-Image',
    effectId: 17,
    uploadPath: 'effects/z-image',
    imageBucketName: 'image',
    credit: 1,
    provider: 'kie.z-image',
    pricingSchema: Z_IMAGE_PRICING_SCHEMA,
    defaultAspectRatio: '1:1',
    supportedAspectRatios: ['1:1', '4:3', '3:4', '16:9', '9:16'],
    defaultGenerationCount: 1,
    supportedGenerationCounts: [1, 2, 3, 4],
  },
  {
    id: 'nanobanana2',
    name: 'Nano Banana 2',
    effectId: 4,
    mediaSchema: getWorkspaceMediaSchema('nanobanana2')!,
    uploadPath: 'effects/nano-banana-2',
    imageBucketName: 'image',
    credit: 6,
    provider: 'kie.nano-banana-2',
    pricingSchema: NANO_BANANA_2_PRICING_SCHEMA,
    defaultAspectRatio: '1:1',
    supportedAspectRatios: ['1:1', '16:9', '9:16', '2:3', '3:2', 'auto'],
    defaultOutputQuality: '1k',
    supportedOutputQualities: ['1k', '2k', '4k'],
    defaultGenerationCount: 1,
    supportedGenerationCounts: [1, 2, 3, 4],
  },
  {
    id: 'nanobanana',
    name: 'Nano Banana',
    effectId: 5,
    mediaSchema: getWorkspaceMediaSchema('nanobanana')!,
    uploadPath: 'effects/nano-banana',
    imageBucketName: 'image',
    credit: 4,
    provider: 'kie.nano-banana',
    pricingSchema: NANO_BANANA_PRICING_SCHEMA,
    defaultAspectRatio: '1:1',
    supportedAspectRatios: ['1:1', '16:9', '9:16', '2:3', '3:2', 'auto'],
    defaultOutputQuality: '1k',
    supportedOutputQualities: ['1k'],
    defaultGenerationCount: 1,
    supportedGenerationCounts: [1, 2, 3, 4],
  },
  {
    id: 'nanobananapro',
    name: 'Nano Banana Pro',
    effectId: 6,
    mediaSchema: getWorkspaceMediaSchema('nanobananapro')!,
    uploadPath: 'effects/nano-banana-pro',
    imageBucketName: 'image',
    credit: 8,
    provider: 'kie.nano-banana-pro',
    pricingSchema: NANO_BANANA_PRO_PRICING_SCHEMA,
    defaultAspectRatio: '1:1',
    supportedAspectRatios: ['1:1', '16:9', '9:16', '2:3', '3:2', 'auto'],
    defaultOutputQuality: '2k',
    supportedOutputQualities: ['2k', '4k'],
    defaultGenerationCount: 1,
    supportedGenerationCounts: [1, 2, 3, 4],
  },
];

export const getModelById = (modelId?: string | null) =>
  IMAGE_WORKSPACE_MODELS.find((model) => model.id === modelId) ??
  IMAGE_WORKSPACE_MODELS[0];
