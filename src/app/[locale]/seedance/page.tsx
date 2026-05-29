import NonPromptToolPage from '@/components/non-prompt/NonPromptToolPage';
import { createNonPromptPageMetadata } from '@/lib/non-prompt-page-metadata';
import { getNonPromptPageConfig } from '@/lib/non-prompt-pages';

export default function SeedancePage() {
  return <NonPromptToolPage config={getNonPromptPageConfig('seedance')} />;
}

export const metadata = createNonPromptPageMetadata('seedance');
