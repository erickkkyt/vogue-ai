import promptImageDimensions from './generated/vogue-prompt-image-dimensions.json';

export type VoguePromptImageDimensions = {
  width: number;
  height: number;
  aspectRatio: string;
};

const promptImageDimensionMap = promptImageDimensions as Record<
  string,
  VoguePromptImageDimensions
>;

export const getVoguePromptImageDimensions = (imageUrl: string) =>
  promptImageDimensionMap[imageUrl] ?? null;
