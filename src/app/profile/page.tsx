import { VogueAccountRouteSurface } from '@/components/account/VogueAccountRouteSurface';
import { normalizeVogueLocale, type VogueLocale } from '@/i18n/vogue';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

const profileMetadataCopy: Record<VogueLocale, string> = {
  en: 'Profile',
  zh: '个人资料',
  fr: 'Profil',
  ru: 'Профиль',
  pt: 'Perfil',
  ja: 'プロフィール',
  ko: '프로필',
};

export async function generateProfileMetadata(
  localeValue: string
): Promise<Metadata> {
  const locale = normalizeVogueLocale(localeValue);

  return {
    title: `${profileMetadataCopy[locale]} - Vogue AI`,
    robots: {
      index: false,
      follow: false,
    },
  };
}

export function generateMetadata(): Promise<Metadata> {
  return generateProfileMetadata('en');
}

export function ProfilePageContent() {
  return <VogueAccountRouteSurface route="/profile" />;
}

export default function ProfileFallbackPage() {
  redirect('/en/profile');
}
