import NonPromptToolPage from '@/components/non-prompt/NonPromptToolPage';
import { createNonPromptPageMetadata } from '@/lib/non-prompt-page-metadata';
import { getNonPromptPageConfig } from '@/lib/non-prompt-pages';

export const metadata = createNonPromptPageMetadata('veo-3-generator');

export default function Veo3GeneratorPage() {
  return (
    <NonPromptToolPage config={getNonPromptPageConfig('veo-3-generator')} />
  );
}
