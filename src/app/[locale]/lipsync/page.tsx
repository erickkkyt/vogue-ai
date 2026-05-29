import NonPromptToolPage from '@/components/non-prompt/NonPromptToolPage';
import { createNonPromptPageMetadata } from '@/lib/non-prompt-page-metadata';
import { getNonPromptPageConfig } from '@/lib/non-prompt-pages';

export default function LipsyncPage() {
  return <NonPromptToolPage config={getNonPromptPageConfig('lipsync')} />;
}

export const metadata = createNonPromptPageMetadata('lipsync');
