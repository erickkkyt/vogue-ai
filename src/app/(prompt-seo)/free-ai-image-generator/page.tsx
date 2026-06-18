import VogueSeoLandingPage from '@/components/seo/VogueSeoLandingPage';
import { createSeoLandingMetadata } from '@/lib/seo-landing-pages';

export const dynamic = 'force-static';
export const revalidate = 86400;

export const metadata = createSeoLandingMetadata('free-ai-image-generator');

export default function FreeAiImageGeneratorPage() {
  return <VogueSeoLandingPage slug="free-ai-image-generator" />;
}
