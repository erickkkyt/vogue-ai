import PromptSeoLandingPage from '@/components/prompts/PromptSeoLandingPage';
import { createPromptSeoLandingMetadata } from '@/lib/prompt-seo-landing-pages';

export const dynamic = 'force-static';
export const revalidate = 86400;

export const metadata = createPromptSeoLandingMetadata('nano-banana-prompt');

export default function NanoBananaPromptPage() {
  return <PromptSeoLandingPage slug="nano-banana-prompt" />;
}
