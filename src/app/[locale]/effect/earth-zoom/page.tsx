import NonPromptToolPage from '@/components/non-prompt/NonPromptToolPage';
import { createNonPromptPageMetadata } from '@/lib/non-prompt-page-metadata';
import { getNonPromptPageConfig } from '@/lib/non-prompt-pages';

export const metadata = createNonPromptPageMetadata('earth-zoom');

export default function EarthZoomPage() {
  return <NonPromptToolPage config={getNonPromptPageConfig('earth-zoom')} />;
}
