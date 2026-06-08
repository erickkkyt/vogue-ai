import PromptSeoLandingPage from '@/components/prompts/PromptSeoLandingPage';
import { createPromptSeoLandingMetadata } from '@/lib/prompt-seo-landing-pages';

export const dynamic = 'force-static';
export const revalidate = 86400;

export const metadata = createPromptSeoLandingMetadata('midjourney-prompt');

export default function MidjourneyPromptPage() {
  return <PromptSeoLandingPage slug="midjourney-prompt" />;
}
