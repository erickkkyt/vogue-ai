'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useLocale } from 'next-intl';
import { getUrlWithLocale } from '@/lib/urls/urls';
import { VogueBrandLockup, VogueBrandWord } from './VogueBrand';
import { Check, Copy } from 'lucide-react';
import { useState } from 'react';
import { normalizeVogueLocale, type VogueLocale } from '@/i18n/vogue';

type FooterLink = {
  href: string;
  label: string;
  title?: string;
  textPrefix?: string;
  textHighlight?: string;
  imageSrc?: string;
  imageAlt?: string;
  imageWidth?: number;
  imageHeight?: number;
};

const supportEmail = 'support@vogueai.net';

type FooterCopy = {
  description: string;
  sections: {
    prompts: string;
    models: string;
    resources: string;
  };
  links: {
    blog: string;
    pricing: string;
    privacy: string;
    terms: string;
  };
  contact: {
    label: string;
    emailLabel: string;
    emailCopied: string;
    copyEmail: string;
  };
  rights: string;
  externalLinksLabel: string;
};

const FOOTER_COPY: Record<VogueLocale, FooterCopy> = {
  en: {
    description:
      'Curated prompt ideas and a clean workspace for faster visual generation.',
    sections: {
      prompts: 'Best AI Prompts',
      models: 'AI Tools',
      resources: 'Resources',
    },
    links: {
      blog: 'Blog',
      pricing: 'Pricing',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
    },
    contact: {
      label: 'Contact',
      emailLabel: 'Email',
      emailCopied: 'Email copied',
      copyEmail: 'Copy email',
    },
    rights: 'All rights reserved.',
    externalLinksLabel: 'External partner links',
  },
  zh: {
    description: '精选提示词创意和干净工作台，帮助更快完成视觉生成。',
    sections: {
      prompts: '精选 AI 提示词',
      models: 'AI 工具',
      resources: '资源',
    },
    links: {
      blog: '博客',
      pricing: '价格',
      privacy: '隐私政策',
      terms: '服务条款',
    },
    contact: {
      label: '联系我们',
      emailLabel: '邮箱',
      emailCopied: '邮箱已复制',
      copyEmail: '复制邮箱',
    },
    rights: '保留所有权利。',
    externalLinksLabel: '外部合作伙伴链接',
  },
  fr: {
    description:
      'Des idées de prompts sélectionnées et un espace de travail clair pour créer des visuels plus vite.',
    sections: {
      prompts: 'Meilleurs prompts IA',
      models: 'Outils IA',
      resources: 'Ressources',
    },
    links: {
      blog: 'Blog',
      pricing: 'Tarifs',
      privacy: 'Politique de confidentialité',
      terms: "Conditions d'utilisation",
    },
    contact: {
      label: 'Contact',
      emailLabel: 'E-mail',
      emailCopied: 'E-mail copié',
      copyEmail: "Copier l'e-mail",
    },
    rights: 'Tous droits réservés.',
    externalLinksLabel: 'Liens de partenaires externes',
  },
  ru: {
    description:
      'Подобранные идеи промптов и чистая рабочая среда для более быстрой генерации визуалов.',
    sections: {
      prompts: 'Лучшие AI-промпты',
      models: 'AI-инструменты',
      resources: 'Ресурсы',
    },
    links: {
      blog: 'Блог',
      pricing: 'Тарифы',
      privacy: 'Политика конфиденциальности',
      terms: 'Условия использования',
    },
    contact: {
      label: 'Связаться',
      emailLabel: 'Почта',
      emailCopied: 'Адрес скопирован',
      copyEmail: 'Скопировать адрес',
    },
    rights: 'Все права защищены.',
    externalLinksLabel: 'Ссылки внешних партнеров',
  },
  pt: {
    description:
      'Ideias de prompts selecionadas e um espaço de trabalho limpo para gerar visuais mais rápido.',
    sections: {
      prompts: 'Melhores prompts de IA',
      models: 'Ferramentas de IA',
      resources: 'Recursos',
    },
    links: {
      blog: 'Blog',
      pricing: 'Preços',
      privacy: 'Política de privacidade',
      terms: 'Termos de serviço',
    },
    contact: {
      label: 'Contato',
      emailLabel: 'E-mail',
      emailCopied: 'E-mail copiado',
      copyEmail: 'Copiar e-mail',
    },
    rights: 'Todos os direitos reservados.',
    externalLinksLabel: 'Links de parceiros externos',
  },
  ja: {
    description:
      '厳選されたプロンプトアイデアと、より速くビジュアル生成するための整理されたワークスペース。',
    sections: {
      prompts: '人気のAIプロンプト',
      models: 'AIツール',
      resources: 'リソース',
    },
    links: {
      blog: 'ブログ',
      pricing: '料金',
      privacy: 'プライバシーポリシー',
      terms: '利用規約',
    },
    contact: {
      label: 'お問い合わせ',
      emailLabel: 'メール',
      emailCopied: 'メールアドレスをコピーしました',
      copyEmail: 'メールをコピー',
    },
    rights: '無断転載を禁じます。',
    externalLinksLabel: '外部パートナーリンク',
  },
  ko: {
    description:
      '엄선한 프롬프트 아이디어와 더 빠른 비주얼 생성을 위한 깔끔한 작업 공간.',
    sections: {
      prompts: '인기 AI 프롬프트',
      models: 'AI 도구',
      resources: '리소스',
    },
    links: {
      blog: '블로그',
      pricing: '가격',
      privacy: '개인정보 처리방침',
      terms: '서비스 약관',
    },
    contact: {
      label: '문의',
      emailLabel: '이메일',
      emailCopied: '이메일을 복사했습니다',
      copyEmail: '이메일 복사',
    },
    rights: '모든 권리 보유.',
    externalLinksLabel: '외부 파트너 링크',
  },
};

const getFooterCopy = (locale: string) => FOOTER_COPY[normalizeVogueLocale(locale)];

const getResourceLinks = (copy: FooterCopy): FooterLink[] => [
  { href: '/blog', label: copy.links.blog },
  { href: '/pricing', label: copy.links.pricing },
  { href: '/privacy-policy', label: copy.links.privacy },
  { href: '/terms-of-service', label: copy.links.terms },
  { href: 'mailto:support@vogueai.net', label: copy.contact.label },
];

const getPromptLinks = (): FooterLink[] => [
  { href: '/ai-image-prompt', label: 'AI Image Prompt' },
  { href: '/gpt-image-prompt', label: 'GPT Image Prompt' },
  { href: '/nano-banana-prompt', label: 'Nano Banana Prompt' },
  { href: '/midjourney-prompt', label: 'Midjourney Prompt' },
];

const getToolLinks = (): FooterLink[] => [
  { href: '/free-ai-image-generator', label: 'AI Image Generator' },
  { href: '/meigen-alternative', label: 'Meigen AI Prompt Gallery' },
];

const getFooterSections = (copy: FooterCopy) => [
  { key: 'prompts', title: copy.sections.prompts, links: getPromptLinks() },
  { key: 'models', title: copy.sections.models, links: getToolLinks() },
  { key: 'resources', title: copy.sections.resources, links: getResourceLinks(copy) },
];

const featuredLinks: FooterLink[] = [
  { href: 'https://wmhub.io/', label: 'World Hub', title: 'World Hub' },
  { href: 'https://gptimg2.ai', label: 'GPTIMG2 AI', title: 'GPTIMG2 AI' },
  { href: 'https://dang.ai/', label: 'Dang.ai' },
  { href: 'https://yo.directory/', label: 'yo.directory', title: 'yo.directory' },
  { href: 'https://twelve.tools', label: 'Twelve Tools' },
  { href: 'https://wired.business', label: 'Wired Business' },
  { href: 'https://www.showmysites.com', label: 'ShowMySites' },
  { href: 'https://www.promotebusinessdirectory.com/', label: 'Directory Website Promote' },
  { href: 'https://mossai.org', label: 'MossAI Tools', title: 'MossAI Tools' },
  { href: 'https://showmebest.ai', label: 'ShowMeBestAI' },
  { href: 'https://www.ontoplist.com/social-media-marketing-companies/', label: 'OnToplist' },
  { href: 'https://z-image.net/', label: 'Z-Image' },
  { href: 'https://www.siteswebdirectory.com/Health_Medical/Dentistry/', label: 'Dentists Marketing' },
  { href: 'https://www.ewebdiscussion.com/forums/web-hosting-offers.67/', label: 'Hosting' },
  { href: 'https://viesearch.com/', label: 'Viesearch', title: 'The Human-curated Search Engine' },
  { href: 'https://www.softwareworld.co/', label: 'SoftwareWorld' },
  { href: 'https://navs.site', label: 'AI Nav Site', title: 'AI Sites 2026' },
  { href: 'https://www.aitoolgo.com', label: 'AiToolGo', title: 'AiToolGo' },
  { href: 'https://aitooltrek.com', label: 'AI Tool Trek', title: 'AI Tool Trek' },
  { href: 'https://whatisaitools.com/', label: 'What Is AI Tools', title: 'What Is AI Tools' },
  { href: 'https://www.toolpilot.ai/', label: 'ToolPilot' },
  { href: 'https://startupfa.me/s/gptimg2-ai?utm_source=gptimg2.ai', label: 'Startup Fame' },
  { href: 'https://findly.tools/gptimg2-ai?utm_source=gptimg2-ai', label: 'Findly.tools' },
  { href: 'https://turbo0.com/item/gptimg2-ai', label: 'Turbo0' },
  { href: 'https://novatools.ai', label: 'NovaTools' },
  { href: 'https://submitaitools.org', label: 'Submit AI Tools' },
  { href: 'https://sellwithboost.com', label: 'Sell With Boost' },
  { href: 'https://fazier.com', label: 'Fazier' },
  { href: 'https://startupvessel.com', label: 'Startup Vessel' },
  { href: 'https://solvertools.com', label: 'Solver Tools' },
  { href: 'https://goodaitools.com', label: 'Good AI Tools' },
  { href: 'https://shinylaunch.com', label: 'ShinyLaunch' },
  { href: 'https://acidtools.com', label: 'Acid Tools' },
  { href: 'https://poweruptools.com', label: 'Power Up Tools' },
  { href: 'https://saasroots.com', label: 'SaaS Roots' },
  { href: 'https://startupaideas.com', label: 'Startup AIdeas' },
  { href: 'https://tooljourney.com', label: 'Tool Journey' },
  {
    href: 'https://indie.deals?ref=https%3A%2F%2Fvogueai.net%2F',
    label: 'Find us on Indie.Deals',
    title: 'Indie.Deals',
    textPrefix: 'Find us on',
    textHighlight: 'Indie.Deals',
  },
  {
    href: 'https://tooljourney.com/tool/vogueai',
    label: 'Tool Journey',
    title: 'Tool Journey',
    imageSrc: 'https://tooljourney.com/assets/images/badge-dark.png',
    imageAlt: 'Tool Journey',
    imageWidth: 198,
    imageHeight: 54,
  },
  {
    href: 'https://startupaideas.com/ai/vogueai',
    label: 'Startup AIdeas',
    title: 'Startup AIdeas',
    imageSrc: 'https://startupaideas.com/assets/images/badge-dark.png',
    imageAlt: 'Startup AIdeas',
    imageWidth: 213,
    imageHeight: 54,
  },
  {
    href: 'https://aiagentsdirectory.com/agent/gptimg2-ai',
    label: 'AI Agents Directory',
    title: 'Discover GPTIMG2 AI on AI Agents Directory',
  },
  { href: 'https://SeekAIs.com/', label: 'SeekAIs - AI Tools Directory', title: 'SeekAIs' },
  {
    href: 'https://www.tooluck.org/item/vogue-ai',
    label: 'Tooluck',
    title: 'Featured on Tooluck.org',
    imageSrc: 'https://www.tooluck.org/badges/tooluck-badge-light.svg',
    imageAlt: 'Featured on Tooluck.org',
    imageWidth: 210,
    imageHeight: 55,
  },
];

function FooterNavLink({
  href,
  label,
  locale,
  contactCopy,
}: {
  href: string;
  label: string;
  locale: string;
  contactCopy: FooterCopy['contact'];
}) {
  const external = href.startsWith('http');
  const email = href.startsWith('mailto:');
  const className = 'text-slate-600 transition hover:text-slate-950';

  if (email) {
    return <FooterContactEmail copy={contactCopy} />;
  }

  if (external) {
    return (
      <a
        href={href}
        className={className}
        target="_blank"
        rel="noopener noreferrer"
      >
        {label}
      </a>
    );
  }

  return (
    <Link href={getUrlWithLocale(href, locale)} className={className}>
      {label}
    </Link>
  );
}

function FooterContactEmail({ copy }: { copy: FooterCopy['contact'] }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyEmailWithFallback = () => {
    const textArea = document.createElement('textarea');
    textArea.value = supportEmail;
    textArea.setAttribute('readonly', '');
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    document.body.appendChild(textArea);
    textArea.select();
    const didCopy = document.execCommand('copy');
    document.body.removeChild(textArea);

    return didCopy;
  };

  const copyEmail = async () => {
    let didCopy = false;

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(supportEmail);
        didCopy = true;
      }
    } catch {
      didCopy = false;
    }

    if (!didCopy) {
      didCopy = copyEmailWithFallback();
    }

    if (didCopy) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    }
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocusCapture={() => setOpen(true)}
      onBlurCapture={(event) => {
        const nextTarget =
          event.relatedTarget instanceof Node ? event.relatedTarget : null;

        if (!nextTarget || !event.currentTarget.contains(nextTarget)) {
          setOpen(false);
        }
      }}
    >
      <button
        type="button"
        className="text-left text-slate-600 transition hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--vogue-accent-ring)]"
        aria-expanded={open}
        aria-controls="footer-contact-email"
        onClick={() => setOpen(true)}
      >
        {copy.label}
      </button>

      {open && (
        <div
          id="footer-contact-email"
          className="absolute left-0 top-full z-30 mt-2 w-[260px] rounded-[12px] border border-[rgba(72,55,44,0.12)] bg-[#fffaf7] p-2.5 text-slate-600 shadow-[0_18px_40px_rgba(72,55,44,0.14)]"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
            {copy.emailLabel}
          </p>
          <div className="mt-2 flex items-center gap-2 rounded-[10px] border border-[rgba(72,55,44,0.08)] bg-white/72 px-2 py-1.5">
            <a
              href={`mailto:${supportEmail}`}
              className="min-w-0 flex-1 truncate text-[13px] leading-5 text-slate-700 hover:text-slate-950"
            >
              {supportEmail}
            </a>
            <button
              type="button"
              aria-label={copied ? copy.emailCopied : copy.copyEmail}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px] bg-slate-950 text-white transition hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--vogue-accent-ring)]"
              onClick={copyEmail}
            >
              {copied ? (
                <Check className="h-3.5 w-3.5" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function FooterFeaturedLink({ link }: { link: FooterLink }) {
  const linkClassName = link.imageSrc
    ? 'group inline-flex h-[54px] shrink-0 items-center transition hover:opacity-90'
    : 'group inline-flex shrink-0 items-center text-xs font-medium text-slate-500 transition hover:text-slate-950';

  return (
    <a
      href={link.href}
      title={link.title}
      target="_blank"
      rel="noopener noreferrer"
      className={linkClassName}
    >
      {link.imageSrc ? (
        <Image
          src={link.imageSrc}
          alt={link.imageAlt ?? link.label}
          width={link.imageWidth ?? 198}
          height={link.imageHeight ?? 54}
          loading="lazy"
          className="block h-[54px] w-auto max-w-none rounded-[6px]"
        />
      ) : link.textHighlight ? (
        <span className="text-sm font-medium text-slate-600">
          {link.textPrefix}{' '}
          <span className="font-bold text-[#0070f3] underline decoration-[#0070f3]/0 decoration-2 underline-offset-4 transition group-hover:decoration-[#0070f3]">
            {link.textHighlight}
          </span>
        </span>
      ) : (
        link.label
      )}
    </a>
  );
}

export default function Footer() {
  const locale = useLocale();
  const copy = getFooterCopy(locale);
  const footerSections = getFooterSections(copy);
  const marqueeLinks = [...featuredLinks, ...featuredLinks];

  return (
    <footer className="border-t border-[rgba(72,55,44,0.1)] bg-gradient-to-r from-[#fff3ec] via-[#fffaf7] to-[#fff8f4] text-slate-600">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
        <div className="grid gap-9 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.6fr)] lg:gap-14">
          <div>
            <Link
              href={getUrlWithLocale('/', locale)}
              className="inline-flex items-center gap-3"
            >
              <VogueBrandLockup
                className="gap-3"
                markClassName="size-9"
                wordClassName="text-[24px]"
              />
            </Link>
            <p className="mt-4 max-w-lg text-sm leading-7 text-slate-600">
              {copy.description}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 sm:gap-x-10 xl:grid-cols-3">
            {footerSections.map((section) => (
              <div key={section.key}>
                <h3 className="text-[12px] font-bold uppercase tracking-[0.18em] text-slate-500">
                  {section.title}
                </h3>
                {section.links.length > 0 && (
                  <ul className="mt-4 grid gap-2.5 text-sm">
                    {section.links.map((link) => (
                      <li key={link.href}>
                        <FooterNavLink
                          href={link.href}
                          label={link.label}
                          locale={locale}
                          contactCopy={copy.contact}
                        />
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="vogue-footer-bottom border-t border-[rgba(72,55,44,0.08)] py-5">
        <div className="mx-auto max-w-7xl space-y-4 px-4 sm:px-6 lg:px-8">
          <p className="text-xs leading-6 text-slate-500">
            &copy; {new Date().getFullYear()}{' '}
            <VogueBrandWord className="align-[-0.16em] text-[18px]" />.{' '}
            {copy.rights}
          </p>
          <div
            className="vogue-footer-marquee"
            aria-label={copy.externalLinksLabel}
            suppressHydrationWarning
          >
            <div className="vogue-footer-marquee-track">
              {marqueeLinks.map((link, index) => (
                <FooterFeaturedLink
                  key={`${link.href}-${link.label}-${index}`}
                  link={link}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
