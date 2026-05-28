import type { VogueUICopy, VogueWorkspaceModelDescriptionKey } from '@/i18n/vogue';

export const getVogueWorkspaceModelDescription = (
  copy: VogueUICopy,
  modelId: string
) =>
  copy.app.modelDescriptions[
    modelId as VogueWorkspaceModelDescriptionKey
  ] ?? copy.composer.imageGenerationModel;
