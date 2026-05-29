import NonPromptToolPage from '@/components/non-prompt/NonPromptToolPage';
import { createNonPromptPageMetadata } from '@/lib/non-prompt-page-metadata';
import { getNonPromptPageConfig } from '@/lib/non-prompt-pages';

export const metadata = createNonPromptPageMetadata(
  'hailuo-ai-video-generator'
);

export default function HailuoGeneratorPage() {
  return (
    <NonPromptToolPage
      config={getNonPromptPageConfig('hailuo-ai-video-generator')}
    />
  );
}
