import NonPromptCollectionPage from '@/components/non-prompt/NonPromptCollectionPage';
import { createNonPromptCollectionMetadata } from '@/lib/non-prompt-collection-metadata';
import { getNonPromptCollectionConfig } from '@/lib/non-prompt-collections';

export const metadata = createNonPromptCollectionMetadata('model');

export default function ModelPage() {
  return (
    <NonPromptCollectionPage config={getNonPromptCollectionConfig('model')} />
  );
}
