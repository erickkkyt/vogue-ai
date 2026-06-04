import PromptSeoLandingPage from '@/components/prompts/PromptSeoLandingPage';
import { createPromptSeoLandingMetadata } from '@/lib/prompt-seo-landing-pages';

export const metadata = createPromptSeoLandingMetadata('midjourney-prompt');

export default function MidjourneyPromptPage() {
  return <PromptSeoLandingPage slug="midjourney-prompt" />;
}
