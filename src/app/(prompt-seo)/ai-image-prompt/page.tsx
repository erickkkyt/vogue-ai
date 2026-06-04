import PromptSeoLandingPage from '@/components/prompts/PromptSeoLandingPage';
import { createPromptSeoLandingMetadata } from '@/lib/prompt-seo-landing-pages';

export const metadata = createPromptSeoLandingMetadata('ai-image-prompt');

export default function AiImagePromptPage() {
  return <PromptSeoLandingPage slug="ai-image-prompt" />;
}
