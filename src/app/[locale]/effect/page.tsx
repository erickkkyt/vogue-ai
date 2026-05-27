import Footer from '@/components/common/Footer';
import Link from 'next/link';
import type { Metadata } from 'next';

const title = 'Effect Generator - Vogue AI';
const description =
  'Create stunning visual effects with our AI-powered Effect Generator. Transform your content with professional effects and filters.';

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: 'https://vogueai.net/effect',
  },
  openGraph: {
    title,
    description,
    url: 'https://vogueai.net/effect',
    images: [
      {
        url: '/social-share.jpg',
        width: 1200,
        height: 630,
        alt: 'Vogue AI effect generator',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['/social-share.jpg'],
  },
};

export default function EffectPage() {
  return (
    <div className="min-h-screen bg-[var(--vogue-page)] text-slate-950">

      <main className="mx-auto max-w-6xl px-4 pb-20 pt-28 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-slate-500">
            Vogue AI Effects
          </p>
          <h1 className="mt-4 text-4xl font-black tracking-tight md:text-6xl">
            AI effect prompts and visual workflows
          </h1>
          <p className="mt-5 text-base leading-7 text-slate-600 md:text-lg">
            Browse preserved Vogue AI effect pages, then continue inside the
            unified prompt-gallery workspace.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          <Link
            href="/effect/earth-zoom"
            className="rounded-[8px] border border-slate-200 bg-white/86 p-6 transition hover:border-cyan-300/50 hover:bg-white"
          >
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
              Effect Page
            </div>
            <h2 className="mt-3 text-2xl font-bold">Earth Zoom</h2>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              A satellite-to-ground visual prompt page preserved for SEO and
              routed into the new generator flow.
            </p>
          </Link>

          <Link
            href="/app"
            className="rounded-[8px] border border-slate-200 bg-cyan-300 p-6 text-slate-950 transition hover:bg-cyan-200"
          >
            <div className="text-xs font-black uppercase tracking-[0.2em]">
              Workspace
            </div>
            <h2 className="mt-3 text-2xl font-black">Open Generator</h2>
            <p className="mt-3 text-sm font-medium leading-6">
              Start from a gallery prompt or write your own image-generation
              prompt in the new Vogue AI workspace.
            </p>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
