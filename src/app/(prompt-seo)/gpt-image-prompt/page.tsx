import PromptSeoLandingPage from '@/components/prompts/PromptSeoLandingPage';
import { createPromptSeoLandingMetadata } from '@/lib/prompt-seo-landing-pages';

export const metadata = createPromptSeoLandingMetadata('gpt-image-prompt');

export default function GptImagePromptPage() {
  return <PromptSeoLandingPage slug="gpt-image-prompt" />;
}
