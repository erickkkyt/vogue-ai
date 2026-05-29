import NonPromptToolPage from '@/components/non-prompt/NonPromptToolPage';
import { createNonPromptPageMetadata } from '@/lib/non-prompt-page-metadata';
import { getNonPromptPageConfig } from '@/lib/non-prompt-pages';

export default function AIBabyPodcastPage() {
  return (
    <NonPromptToolPage config={getNonPromptPageConfig('ai-baby-podcast')} />
  );
}

export const metadata = createNonPromptPageMetadata('ai-baby-podcast');
