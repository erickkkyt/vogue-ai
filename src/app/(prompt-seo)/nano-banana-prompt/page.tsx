import PromptSeoLandingPage from '@/components/prompts/PromptSeoLandingPage';
import { createPromptSeoLandingMetadata } from '@/lib/prompt-seo-landing-pages';

export const metadata = createPromptSeoLandingMetadata('nano-banana-prompt');

export default function NanoBananaPromptPage() {
  return <PromptSeoLandingPage slug="nano-banana-prompt" />;
}
