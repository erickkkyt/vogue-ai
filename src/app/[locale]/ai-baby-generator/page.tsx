import NonPromptToolPage from '@/components/non-prompt/NonPromptToolPage';
import { createNonPromptPageMetadata } from '@/lib/non-prompt-page-metadata';
import { getNonPromptPageConfig } from '@/lib/non-prompt-pages';

export default function AIBabyGeneratorPage() {
  return (
    <NonPromptToolPage config={getNonPromptPageConfig('ai-baby-generator')} />
  );
}

export const metadata = createNonPromptPageMetadata('ai-baby-generator');
