import PromptSeoLandingPage from '@/components/prompts/PromptSeoLandingPage';
import { createPromptSeoLandingMetadata } from '@/lib/prompt-seo-landing-pages';

export const dynamic = 'force-static';
export const revalidate = 86400;

export const metadata = createPromptSeoLandingMetadata('gpt-image-prompt');

export default function GptImagePromptPage() {
  return <PromptSeoLandingPage slug="gpt-image-prompt" />;
}
