'use client';

import Link from 'next/link';
import { ArrowRight, Wand2 } from 'lucide-react';

interface DashboardSectionProps {
  type:
    | 'ai-baby-podcast'
    | 'ai-baby-generator'
    | 'veo-3-generator'
    | 'hailuo-generator'
    | 'earth-zoom'
    | 'seedance'
    | 'lipsync';
  title: string;
}

const promptByType: Record<DashboardSectionProps['type'], string> = {
  'ai-baby-podcast':
    'Create a short-form AI baby podcast concept with expressive character timing, clean lip motion, and social video framing.',
  'ai-baby-generator':
    'Create a realistic family-style future baby portrait with soft natural light, gentle expression, and editorial photo realism.',
  'veo-3-generator':
    'Create a cinematic AI video concept with natural camera movement, dramatic lighting, and a believable story beat.',
  'hailuo-generator':
    'Create a high-energy short AI video prompt with clear subject motion, rich atmosphere, and fast social pacing.',
  'earth-zoom':
    'Create an earth zoom visual concept that starts from a cinematic close-up and pulls back to a dramatic satellite-scale view.',
  seedance:
    'Create a dynamic motion prompt with expressive character movement, coherent timing, and polished visual direction.',
  lipsync:
    'Create a talking portrait concept with natural facial expression, accurate speech timing, and clean creator-video composition.',
};

export default function DashboardSection({ type, title }: DashboardSectionProps) {
  const appHref = `/app?target=image&model=gptimage2&prompt=${encodeURIComponent(
    promptByType[type]
  )}`;

  return (
    <section id="dashboard" className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl rounded-[20px] border border-slate-200 bg-white/84 p-6 text-slate-950 shadow-[0_24px_70px_rgba(72,92,130,0.12)] backdrop-blur md:p-8">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-center">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-slate-600 shadow-[0_10px_24px_rgba(72,92,130,0.08)]">
              <Wand2 className="h-3.5 w-3.5" />
              Vogue AI Generator
            </div>
            <h2 className="text-3xl font-black">{title}</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
              This topic page now connects into the Vogue AI prompt-gallery and
              workspace. Start from this page's visual direction and
              continue inside the unified creator flow.
            </p>
          </div>
          <Link
            href={appHref}
            className="inline-flex items-center justify-center gap-2 rounded-[14px] bg-slate-950 px-5 py-3 text-sm font-bold text-white shadow-[0_18px_38px_rgba(17,24,39,0.18)] transition hover:-translate-y-0.5 hover:bg-slate-800"
          >
            Open New Generator
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
