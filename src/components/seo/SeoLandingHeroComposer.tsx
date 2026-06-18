'use client';

import { writeVogueAppTransferPayload } from '@/lib/app/composer-transfer';
import Link from 'next/link';
import { useMemo, useState } from 'react';

type SeoLandingHeroComposerProps = {
  placeholder: string;
};

const PROMPT_MAX_CHARS = 1600;
const DEFAULT_MODEL_ID = 'zimage';
const DEFAULT_ASPECT_RATIO = '1:1';
const DEFAULT_OUTPUT_QUALITY = '1k';
const DEFAULT_QUALITY = 'medium';
const DEFAULT_GENERATION_COUNT = 1;

const truncatePrompt = (value: string) => value.slice(0, PROMPT_MAX_CHARS);

export default function SeoLandingHeroComposer({
  placeholder,
}: SeoLandingHeroComposerProps) {
  const [prompt, setPrompt] = useState('');
  const appHref = useMemo(() => {
    const params = new URLSearchParams({
      target: 'image',
      model: DEFAULT_MODEL_ID,
      aspectRatio: DEFAULT_ASPECT_RATIO,
      outputQuality: DEFAULT_OUTPUT_QUALITY,
      quality: DEFAULT_QUALITY,
      generationCount: String(DEFAULT_GENERATION_COUNT),
    });

    return `/app?${params.toString()}`;
  }, []);

  const persistTransfer = () => {
    writeVogueAppTransferPayload({
      source: 'gallery',
      createdAt: Date.now(),
      model: DEFAULT_MODEL_ID,
      prompt,
      aspectRatio: DEFAULT_ASPECT_RATIO,
      outputQuality: DEFAULT_OUTPUT_QUALITY,
      quality: DEFAULT_QUALITY,
      generationCount: DEFAULT_GENERATION_COUNT,
      referenceImages: [],
      referenceImageItems: [],
    });
  };

  const isPromptEmpty = prompt.trim().length === 0;

  return (
    <div className="seo-landing-hero-composer mx-auto mt-7 max-w-4xl text-left">
      <div className="vogue-composer-dock relative overflow-hidden rounded-[28px] border border-white/80 bg-white/86 p-3 shadow-[0_18px_48px_rgba(72,92,130,0.14)] ring-1 ring-[rgba(118,92,70,0.08)] backdrop-blur-[18px] sm:p-4 lg:rounded-[30px] lg:px-5 lg:py-4">
        <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/95 to-transparent" />
        <div className="pointer-events-none absolute inset-x-8 bottom-0 h-px bg-gradient-to-r from-transparent via-[rgba(118,92,70,0.14)] to-transparent" />
        <textarea
          value={prompt}
          onChange={(event) => setPrompt(truncatePrompt(event.target.value))}
          placeholder={placeholder}
          className="vogue-prompt-field relative z-10 h-[118px] w-full resize-none overflow-y-auto border-0 !bg-transparent !shadow-none px-3 py-3 text-[15px] font-normal leading-7 tracking-normal text-slate-950 outline-none placeholder:text-slate-400 transition-none focus:border-0 focus:!bg-transparent focus:shadow-none focus:outline-none focus-visible:!border-transparent focus-visible:!ring-0 sm:h-[124px] sm:px-4"
        />
        <div className="mt-3 flex min-h-[48px] items-center justify-end border-t border-[rgba(118,92,70,0.12)] px-3 pb-1 pt-3 sm:px-4">
          <Link
            href={isPromptEmpty ? '#' : appHref}
            onClick={(event) => {
              if (isPromptEmpty) {
                event.preventDefault();
                return;
              }

              persistTransfer();
            }}
            aria-disabled={isPromptEmpty}
            aria-label="Generate image in Vogue AI"
            style={{ minWidth: 220 }}
            className={`home-generate-button relative inline-flex h-11 w-full max-w-none items-center justify-center gap-3 rounded-2xl px-4 md:h-[42px] md:w-auto md:rounded-[1.1rem] ${
              isPromptEmpty
                ? 'pointer-events-none cursor-not-allowed opacity-85 hover:shadow-none'
                : ''
            }`}
          >
            <span aria-hidden="true" className="home-generate-button__text">
              Generate
            </span>
            <span className="sr-only">Generate image in Vogue AI</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
