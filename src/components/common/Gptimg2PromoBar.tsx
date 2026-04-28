'use client';

import { useEffect, useState } from 'react';
import { ExternalLink, Sparkles, X } from 'lucide-react';

const DISMISSED_KEY = 'vogueai-gptimg2-promo-dismissed';

export default function Gptimg2PromoBar() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(localStorage.getItem(DISMISSED_KEY) !== 'true');
  }, []);

  const handleDismiss = () => {
    localStorage.setItem(DISMISSED_KEY, 'true');
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed left-0 right-0 top-16 z-40 border-b border-blue-400/20 bg-slate-950/95 px-3 py-2 shadow-lg shadow-blue-950/20 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
        <a
          href="https://gptimg2.ai"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex min-w-0 flex-1 items-center justify-center gap-2 text-sm font-medium text-slate-100 transition-colors hover:text-white"
        >
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-500/15 text-blue-300 ring-1 ring-blue-300/25">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
          </span>
          <span className="truncate">
            New: Try GPT Image 2 prompts and image generation on GPTIMG2 AI
          </span>
          <ExternalLink className="h-4 w-4 shrink-0 text-blue-300 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
        </a>

        <button
          type="button"
          onClick={handleDismiss}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
          aria-label="Dismiss GPTIMG2 AI promotion"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
