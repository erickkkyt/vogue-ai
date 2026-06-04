import type { SocialPromptPageEntry } from '@/lib/social-prompt-pages';
import { ArrowRight, CheckCircle2, ExternalLink, ImageIcon, Layers3, Sparkles } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

type SocialPromptPageProps = {
  entry: SocialPromptPageEntry;
};

function getAppHref(prompt: string | null) {
  if (!prompt) return '/app?target=image&model=gptimage2';
  return `/app?target=image&model=gptimage2&prompt=${encodeURIComponent(prompt)}`;
}

export default function SocialPromptPage({ entry }: SocialPromptPageProps) {
  const primaryImage = entry.generatedImages[0] ?? null;
  const hasApprovedPrompt = Boolean(entry.prompt?.trim());

  return (
    <main className="min-h-screen bg-[var(--vogue-page)] text-slate-950">
      <section className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:px-8 lg:py-8">
        <div className="min-w-0 space-y-5">
          <header className="rounded-[8px] border border-[#e6ded8] bg-[#fffdf9] p-5 shadow-[0_18px_40px_rgba(70,52,38,0.06)]">
            <div className="flex flex-wrap items-center gap-2 text-[12px] font-semibold text-slate-500">
              <Link className="text-slate-700 underline-offset-4 hover:underline" href="/">
                Prompt gallery
              </Link>
              <span>/</span>
              <span>Social prompt template</span>
              <span className="rounded-full border border-[#dfd6ce] bg-white px-2 py-0.5 text-[11px] text-slate-600">
                {hasApprovedPrompt ? 'Ready' : 'Draft shell'}
              </span>
            </div>
            <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px] lg:items-end">
              <div className="space-y-3">
                <h1 className="max-w-4xl text-[32px] font-semibold leading-[1.03] tracking-normal text-slate-950 sm:text-[44px]">
                  {entry.title}
                </h1>
                <p className="max-w-2xl text-[15px] leading-7 text-slate-600">
                  {entry.description}
                </p>
              </div>
              <div className="grid gap-2">
                <Link
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[7px] bg-slate-950 px-4 text-[13px] font-semibold text-white shadow-[0_14px_28px_rgba(15,23,42,0.16)]"
                  href={getAppHref(entry.prompt)}
                >
                  {hasApprovedPrompt ? 'Use this prompt' : 'Open VogueAI'}
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  className="inline-flex min-h-10 items-center justify-center rounded-[7px] border border-slate-200 bg-white px-4 text-[13px] font-semibold text-slate-800"
                  href="/app?target=image&model=gptimage2"
                >
                  Generate your image
                </Link>
              </div>
            </div>
          </header>

          <section className="grid gap-4 rounded-[8px] border border-slate-200 bg-white p-4 shadow-[0_18px_40px_rgba(15,23,42,0.06)]">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-[12px] font-semibold uppercase tracking-normal text-slate-500">
                  Approved VogueAI prompt
                </p>
                <h2 className="mt-1 text-[20px] font-semibold text-slate-950">
                  {hasApprovedPrompt ? 'Copy and run this prompt' : 'Waiting for rewrite review'}
                </h2>
              </div>
              <span
                className={`inline-flex min-h-8 items-center rounded-full px-3 text-[12px] font-semibold ${
                  hasApprovedPrompt
                    ? 'bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200'
                    : 'bg-amber-50 text-amber-900 ring-1 ring-amber-200'
                }`}
              >
                {hasApprovedPrompt ? 'Prompt approved' : 'Prompt pending'}
              </span>
            </div>

            {hasApprovedPrompt ? (
              <pre className="max-h-[360px] overflow-auto whitespace-pre-wrap rounded-[8px] border border-slate-200 bg-slate-50 p-4 text-[13px] leading-6 text-slate-800">
                {entry.prompt}
              </pre>
            ) : (
              <div className="rounded-[8px] border border-dashed border-slate-300 bg-slate-50 p-5">
                <div className="max-w-2xl space-y-3">
                  <p className="text-[18px] font-semibold text-slate-950">
                    The final prompt will appear here after rewrite and image review.
                  </p>
                  <p className="text-[13px] leading-6 text-slate-600">
                    This public template is ready, but it will not publish the original source prompt or reference images. The final copy should come from the approved rewrite queue.
                  </p>
                </div>
              </div>
            )}
          </section>

          <section className="grid gap-4 rounded-[8px] border border-slate-200 bg-white p-4 shadow-[0_18px_40px_rgba(15,23,42,0.06)]">
            <div className="flex items-center gap-2">
              <Layers3 className="h-4 w-4 text-slate-700" />
              <h2 className="text-[20px] font-semibold text-slate-950">
                Prompt structure to finalize
              </h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {entry.promptSummary.map((summary) => (
                <div
                  className="rounded-[8px] border border-slate-200 bg-slate-50 p-3 text-[13px] leading-6 text-slate-700"
                  key={summary}
                >
                  {summary}
                </div>
              ))}
            </div>
          </section>

          <section className="grid gap-4 rounded-[8px] border border-slate-200 bg-white p-4 shadow-[0_18px_40px_rgba(15,23,42,0.06)]">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-slate-700" />
              <h2 className="text-[20px] font-semibold text-slate-950">
                Best use cases
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {entry.useCases.map((useCase) => (
                <span
                  className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[12px] font-semibold text-slate-700"
                  key={useCase}
                >
                  {useCase}
                </span>
              ))}
            </div>
          </section>

          <section className="grid gap-3 rounded-[8px] border border-amber-200 bg-amber-50 p-4">
            <h2 className="text-[18px] font-semibold text-amber-950">
              Usage guardrails
            </h2>
            <ul className="grid gap-2 text-[13px] leading-6 text-amber-900">
              {entry.safetyNotes.map((note) => (
                <li className="flex gap-2" key={note}>
                  <CheckCircle2 className="mt-1 h-4 w-4 shrink-0" />
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-6">
          <section className="overflow-hidden rounded-[8px] border border-slate-200 bg-white shadow-[0_18px_40px_rgba(15,23,42,0.08)]">
            {primaryImage ? (
              <Image
                alt={`${entry.title} generated with VogueAI`}
                className="aspect-[4/5] w-full object-cover"
                height={850}
                sizes="(min-width: 1024px) 340px, 100vw"
                src={primaryImage}
                width={680}
              />
            ) : (
              <div className="grid aspect-[4/5] place-items-center bg-[linear-gradient(135deg,#f8fafc,#e6f4f1_52%,#fff7ed)] p-8 text-center">
                <div className="space-y-3">
                  <p className="text-[12px] font-semibold uppercase tracking-normal text-slate-500">
                    Generated result pending
                  </p>
                  <p className="text-[22px] font-semibold leading-tight text-slate-950">
                    Image slot reserved
                  </p>
                  <p className="text-[13px] leading-6 text-slate-600">
                    The public page will show VogueAI-generated media after the workbench review passes.
                  </p>
                </div>
              </div>
            )}
          </section>

          <section className="grid gap-3 rounded-[8px] border border-slate-200 bg-white p-4 shadow-[0_18px_40px_rgba(15,23,42,0.06)]">
            <p className="text-[12px] font-semibold uppercase tracking-normal text-slate-500">
              Page status
            </p>
            <div className="grid gap-2 text-[13px] leading-6 text-slate-600">
              <p className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4 text-slate-500" />
                Generated media: {primaryImage ? 'ready' : 'pending'}
              </p>
              <p className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-slate-500" />
                Prompt rewrite: {hasApprovedPrompt ? 'approved' : 'pending'}
              </p>
            </div>
          </section>

          <section className="grid gap-3 rounded-[8px] border border-slate-200 bg-white p-4 shadow-[0_18px_40px_rgba(15,23,42,0.06)]">
            <p className="text-[12px] font-semibold uppercase tracking-normal text-slate-500">
              Inspiration note
            </p>
            <h2 className="text-[16px] font-semibold text-slate-950">
              Reviewed from {entry.sourceAuthor}
            </h2>
            <p className="text-[13px] leading-6 text-slate-600">
              Reference prompt text and reference images stay in the internal workbench. This page only exposes the approved VogueAI rewrite and generated output.
            </p>
            <a
              className="inline-flex min-h-9 items-center justify-center gap-2 rounded-[7px] border border-slate-200 bg-slate-50 px-3 text-[13px] font-semibold text-slate-800"
              href={entry.sourceUrl}
              rel="noreferrer"
              target="_blank"
            >
              Open source
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </section>

          <section className="grid gap-2 rounded-[8px] border border-slate-200 bg-white p-4 text-[13px] leading-6 text-slate-600">
            <p className="font-semibold text-slate-950">Remix note</p>
            <p>{entry.assetAngle}</p>
          </section>
        </aside>
      </section>
    </main>
  );
}
