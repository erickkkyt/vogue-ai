'use client';

import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import type { AuthShowcaseSlideCopy } from './auth-copy';

const AUTH_SHOWCASE_SLIDES = [
  {
    modelName: 'GPT Image 2',
    imageUrl:
      'https://pub-911e4fa03f0c4323a80d8f3dc99d1c7f.r2.dev/prompt-libraries/awesome-gptimage2-prompts/x-2048229413108719653/luxury-tech-fashion-camera-campaign-1.jpg',
    objectPosition: '50% 48%',
  },
  {
    modelName: 'Nano Banana',
    imageUrl:
      'https://pub-911e4fa03f0c4323a80d8f3dc99d1c7f.r2.dev/prompt-libraries/awesome-ai-prompts/nano-banana/x-2057440991607484589/high-fashion-portrait-features-woman-mysterious-presence-1.jpg',
    objectPosition: '50% 42%',
  },
  {
    modelName: 'Midjourney',
    imageUrl:
      'https://pub-911e4fa03f0c4323a80d8f3dc99d1c7f.r2.dev/prompt-libraries/awesome-ai-prompts/midjourney/x-2057872901056127057/fashion-photography-i-adore-texture-this-images-1.jpg',
    objectPosition: '50% 44%',
  },
] as const;

const AUTOPLAY_MS = 6000;

interface AuthShowcasePanelProps {
  showcaseSlides: readonly AuthShowcaseSlideCopy[];
}

export function AuthShowcasePanel({ showcaseSlides }: AuthShowcasePanelProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setActiveIndex((current) => (current + 1) % AUTH_SHOWCASE_SLIDES.length);
    }, AUTOPLAY_MS);

    return () => clearInterval(timer);
  }, [isPaused]);

  const activeSlide = AUTH_SHOWCASE_SLIDES[activeIndex];
  const activeSlideCopy = showcaseSlides[activeIndex];

  return (
    <aside
      className="vogue-auth-showcase relative hidden min-h-[580px] overflow-hidden bg-[#f7fbff] lg:block"
      style={{ minHeight: 580 }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="absolute inset-0 bg-[linear-gradient(135deg,#fbfdff_0%,#eef6ff_38%,#fff7f4_100%)]" />
      <div className="relative z-10 h-full w-full p-3">
        <div className="relative h-full w-full overflow-hidden rounded-[20px] border border-white/80 bg-slate-950 shadow-[0_18px_44px_rgba(72,92,130,0.16)]">
          {AUTH_SHOWCASE_SLIDES.map((slide, index) => {
            const isActive = index === activeIndex;

            return (
              <div
                key={slide.modelName}
                aria-hidden={!isActive}
                className={cn(
                  'absolute inset-0 transition-all duration-700 ease-out',
                  isActive
                    ? 'translate-x-0 opacity-100'
                    : 'translate-x-4 opacity-0'
                )}
              >
                <div
                  className="h-full w-full scale-[1.01] bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${slide.imageUrl})`,
                    backgroundPosition: slide.objectPosition,
                  }}
                />
              </div>
            );
          })}

          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(3,5,11,0.04)_0%,rgba(3,5,11,0.1)_34%,rgba(3,5,11,0.84)_100%)]" />

          <div className="absolute inset-x-5 bottom-5 z-10">
            <div className="mb-5 max-w-[420px] text-white">
              <h2 className="text-[34px] font-semibold leading-[1.04] tracking-normal">
                {activeSlide.modelName}
              </h2>
              <p className="mt-2 text-base font-medium leading-6 text-white/90">
                {activeSlideCopy?.title}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              {AUTH_SHOWCASE_SLIDES.map((slide, index) => {
                const isActive = index === activeIndex;

                return (
                  <button
                    key={slide.modelName}
                    type="button"
                    aria-label={
                      showcaseSlides[index]?.ariaLabel ??
                      `Show ${slide.modelName} showcase`
                    }
                    onClick={() => setActiveIndex(index)}
                    className="group text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-white/55"
                  >
                    <span className="block h-[3px] overflow-hidden rounded-full bg-white/24">
                      {isActive ? (
                        <span
                          key={activeIndex}
                          className="vogue-auth-progress block h-full rounded-full bg-white"
                          style={{
                            animationDuration: `${AUTOPLAY_MS}ms`,
                            animationPlayState: isPaused ? 'paused' : 'running',
                          }}
                        />
                      ) : null}
                    </span>
                    <span
                      className={cn(
                        'mt-2 block truncate text-xs font-semibold transition-colors',
                        isActive ? 'text-white' : 'text-white/46 group-hover:text-white/76'
                      )}
                    >
                      {slide.modelName}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
