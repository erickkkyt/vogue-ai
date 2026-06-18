import VogueSeoLandingPage from '@/components/seo/VogueSeoLandingPage';
import { createSeoLandingMetadata } from '@/lib/seo-landing-pages';

export const dynamic = 'force-static';
export const revalidate = 86400;

export const metadata = createSeoLandingMetadata('meigen-alternative');

export default function MeigenAlternativePage() {
  return <VogueSeoLandingPage slug="meigen-alternative" />;
}
