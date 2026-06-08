import PromptSeoLandingPage from '@/components/prompts/PromptSeoLandingPage';
import { createPromptSeoLandingMetadata } from '@/lib/prompt-seo-landing-pages';

export const dynamic = 'force-static';
export const revalidate = 86400;

export const metadata = createPromptSeoLandingMetadata('ai-image-prompt');

export default function AiImagePromptPage() {
  return <PromptSeoLandingPage slug="ai-image-prompt" />;
}
