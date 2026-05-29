import NonPromptToolPage from '@/components/non-prompt/NonPromptToolPage';
import { createNonPromptPageMetadata } from '@/lib/non-prompt-page-metadata';
import { getNonPromptPageConfig } from '@/lib/non-prompt-pages';

export const metadata = createNonPromptPageMetadata('effect');

export default function EffectPage() {
  return <NonPromptToolPage config={getNonPromptPageConfig('effect')} />;
}
