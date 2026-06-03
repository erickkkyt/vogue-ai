'use client';

import Footer from '@/components/common/Footer';
import { getNonPromptBreadcrumbParent } from '@/lib/non-prompt-breadcrumbs';
import type {
  NonPromptCard,
  NonPromptPageConfig,
  NonPromptShowcaseItem,
  NonPromptToolControl,
} from '@/lib/non-prompt-pages';
import {
  ArrowRight,
  Baby,
  Check,
  ChevronDown,
  ChevronRight,
  Clapperboard,
  Clock3,
  Copy,
  Film,
  Globe2,
  Image as ImageIcon,
  Mic2,
  Play,
  Settings2,
  Upload,
  Users,
  Wand2,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

type NonPromptToolPageProps = {
  config: NonPromptPageConfig;
};

const iconClassName = 'h-5 w-5 text-slate-600';

function getIcon(title: string) {
  const value = title.toLowerCase();

  if (value.includes('baby') || value.includes('parent')) return Baby;
  if (value.includes('voice') || value.includes('audio')) return Mic2;
  if (value.includes('earth') || value.includes('orbit')) return Globe2;
  if (value.includes('video') || value.includes('motion')) return Film;
  if (value.includes('team') || value.includes('creator')) return Users;
  if (value.includes('setting') || value.includes('quality')) return Settings2;
  if (value.includes('time') || value.includes('speed')) return Clock3;
  return Clapperboard;
}

function getPreviewClassName(variant: string) {
  switch (variant) {
    case 'baby':
      return 'bg-[radial-gradient(circle_at_50%_34%,#f7d9cb_0%,#e6b9a4_20%,#cab0a4_42%,#efe8e2_100%)]';
    case 'podcast':
      return 'bg-[linear-gradient(135deg,#f5ede8_0%,#d8c8bc_50%,#252936_100%)]';
    case 'lipsync':
      return 'bg-[linear-gradient(135deg,#f8fafc_0%,#dbe3ea_52%,#b2a89f_100%)]';
    case 'seedance':
      return 'bg-[radial-gradient(circle_at_36%_30%,#d7c3a6_0%,#7f8e90_38%,#161f2f_100%)]';
    case 'hailuo':
      return 'bg-[radial-gradient(circle_at_64%_30%,#d3e2df_0%,#8aa3aa_42%,#1e293b_100%)]';
    case 'veo':
      return 'bg-[linear-gradient(135deg,#f4f0e9_0%,#a4b0b8_48%,#111827_100%)]';
    case 'earth':
    default:
      return 'bg-[linear-gradient(180deg,#f8fafc_0%,#edf4f3_48%,#d7d0c9_100%)]';
  }
}

function SectionHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="mx-auto mb-12 max-w-4xl text-center">
      <h2 className="text-3xl font-semibold leading-tight text-slate-950 md:text-4xl">
        {title}
      </h2>
      <p className="mx-auto mt-4 max-w-3xl text-base leading-7 text-slate-600 md:text-lg">
        {description}
      </p>
    </div>
  );
}

function PreviewArt({
  variant,
  className = 'aspect-[16/9]',
}: {
  variant: string;
  className?: string;
}) {
  return (
    <div
      className={[
        'relative w-full overflow-hidden rounded-[8px] border border-[rgba(72,55,44,0.12)]',
        className,
        getPreviewClassName(variant),
      ].join(' ')}
    >
      <div className="absolute inset-x-[12%] bottom-[-44%] aspect-square rounded-full border border-white/50 bg-[radial-gradient(circle_at_38%_28%,rgba(255,255,255,0.82),rgba(180,198,185,0.34)_16%,rgba(82,105,107,0.62)_38%,rgba(22,35,50,0.9)_74%)] shadow-[0_26px_62px_rgba(15,23,42,0.2)]" />
      <div className="absolute left-[17%] top-[24%] h-px w-[66%] rotate-[-11deg] bg-white/44" />
      <div className="absolute left-[25%] top-[38%] h-px w-[50%] rotate-[-11deg] bg-white/24" />
      <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.5),transparent_38%,rgba(255,250,247,0.34)_74%,transparent)]" />
    </div>
  );
}

function ToolPreviewPane({ title }: { title: string }) {
  return (
    <div className="relative flex h-full min-h-[520px] overflow-hidden rounded-[8px] border border-[rgba(72,55,44,0.12)] bg-[linear-gradient(180deg,#fffdfb_0%,#f7f1ec_100%)] shadow-[0_22px_58px_rgba(72,55,44,0.08)] lg:min-h-[620px]">
      <div className="pointer-events-none absolute inset-5 rounded-[8px] border border-dashed border-[rgba(72,55,44,0.18)]" />
      <div className="pointer-events-none absolute inset-x-10 top-10 h-px bg-gradient-to-r from-transparent via-slate-900/12 to-transparent" />
      <div className="pointer-events-none absolute inset-x-10 bottom-10 grid grid-cols-5 gap-3 opacity-50">
        {Array.from({ length: 5 }).map((_, index) => (
          <span
            key={index}
            className="h-1 rounded-full bg-[rgba(72,55,44,0.18)]"
          />
        ))}
      </div>
      <div className="relative z-10 flex w-full flex-col items-center justify-center px-8 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-[8px] border border-[rgba(72,55,44,0.14)] bg-white shadow-[0_16px_38px_rgba(72,55,44,0.08)]">
          <ImageIcon className="h-7 w-7 text-slate-500" />
        </div>
        <p className="mt-5 text-lg font-semibold text-slate-950">Preview</p>
        <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
          {title} appears here after generation.
        </p>
      </div>
    </div>
  );
}

function ToolWorkspace({ config }: NonPromptToolPageProps) {
  const { workspace } = config;
  const [prompt, setPrompt] = useState(workspace.defaultPrompt);
  const [selectedValues, setSelectedValues] = useState<Record<string, string>>(
    () =>
      Object.fromEntries(
        workspace.controls.map((control) => [control.id, control.defaultValue])
      )
  );
  const [uploads, setUploads] = useState<Record<string, string>>({});
  const promptLength = useMemo(() => prompt.trim().length, [prompt]);

  const handleFile = (slotId: string, file?: File) => {
    setUploads((current) => {
      const existing = current[slotId];
      if (existing) URL.revokeObjectURL(existing);
      if (!file) {
        const next = { ...current };
        delete next[slotId];
        return next;
      }
      return { ...current, [slotId]: URL.createObjectURL(file) };
    });
  };

  useEffect(() => {
    return () => {
      Object.values(uploads).forEach((url) => URL.revokeObjectURL(url));
    };
  }, [uploads]);

  return (
    <section
      id="tool"
      className="min-h-[100svh] bg-[var(--vogue-page)] px-4 pb-20 pt-10 sm:px-6 lg:px-8 lg:pb-24 lg:pt-12"
    >
      <div className="mx-auto max-w-[1500px]">
        <nav
          aria-label="Breadcrumb"
          className="mb-8 flex flex-wrap items-center gap-2 text-[13px] font-medium text-slate-500"
        >
          <Link href="/" className="transition hover:text-slate-950">
            Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
          <span className="text-slate-500">{config.category}</span>
          <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
          <span className="text-slate-900">{config.label}</span>
        </nav>

        <div className="grid gap-6 lg:grid-cols-[minmax(360px,0.82fr)_minmax(560px,1.18fr)] lg:items-stretch">
          <div className="rounded-[8px] border border-[rgba(72,55,44,0.12)] bg-[rgba(255,253,251,0.96)] p-4 shadow-[0_22px_58px_rgba(72,55,44,0.08)] sm:p-5 lg:p-6">
            <div className="space-y-2.5">
              <h1 className="max-w-full text-3xl font-semibold leading-[1.06] text-slate-950 xl:!text-[34px]">
                {workspace.title}
              </h1>
              <p className="max-w-full text-sm !leading-[1.55] text-slate-600 sm:!text-[14px]">
                {workspace.description}
              </p>
            </div>

            <div className="mt-5 grid gap-3">
              {workspace.uploadSlots.map((slot) => (
                <label key={slot.id} className="block">
                  <span className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-900">
                    <Upload className="h-4 w-4 text-slate-600" />
                    {slot.label}
                  </span>
                  <input
                    type="file"
                    accept={slot.accept}
                    className="sr-only"
                    onChange={(event) =>
                      handleFile(slot.id, event.target.files?.[0])
                    }
                  />
                  <div
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={(event) => {
                      event.preventDefault();
                      handleFile(slot.id, event.dataTransfer.files?.[0]);
                    }}
                    className="relative flex min-h-[108px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-[8px] border border-dashed border-[rgba(72,55,44,0.2)] bg-[#fffaf7] px-4 py-4 text-center transition hover:border-slate-400 hover:bg-white"
                  >
                    {uploads[slot.id] ? (
                      <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={uploads[slot.id]}
                          alt={`${slot.label} preview`}
                          className="absolute inset-0 h-full w-full object-cover"
                        />
                        <span className="absolute inset-0 bg-gradient-to-t from-slate-950/58 via-slate-950/12 to-transparent" />
                        <span className="relative mt-auto inline-flex rounded-[8px] bg-white/92 px-3 py-2 text-xs font-semibold text-slate-900 shadow-[0_10px_26px_rgba(15,23,42,0.16)]">
                          Replace image
                        </span>
                      </>
                    ) : (
                      <>
                        <ImageIcon className="h-5 w-5 text-slate-500" />
                        <span className="mt-2 text-sm font-bold text-slate-900">
                          Drop or browse files
                        </span>
                        <span className="mt-1 max-w-md text-xs leading-5 text-slate-500">
                          {slot.description}
                        </span>
                      </>
                    )}
                  </div>
                </label>
              ))}

              <label className="block">
                <span className="mb-2 flex items-center justify-between gap-3 text-sm font-bold text-slate-900">
                  <span className="inline-flex items-center gap-2">
                    <Wand2 className="h-4 w-4 text-slate-600" />
                    {workspace.promptLabel}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    {promptLength}/{workspace.promptMaxLength}
                  </span>
                </span>
                <textarea
                  value={prompt}
                  maxLength={workspace.promptMaxLength}
                  onChange={(event) => {
                    setPrompt(event.target.value);
                  }}
                  className="vogue-prompt-field min-h-[116px] w-full resize-none rounded-[8px] border border-[rgba(72,55,44,0.14)] bg-white px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-[rgba(15,23,42,0.08)]"
                />
              </label>

              <div className="grid gap-3 sm:grid-cols-3">
                {workspace.controls.map((control) => (
                  <ToolControl
                    key={control.id}
                    control={control}
                    value={selectedValues[control.id] ?? control.defaultValue}
                    onChange={(value) => {
                      setSelectedValues((current) => ({
                        ...current,
                        [control.id]: value,
                      }));
                    }}
                  />
                ))}
              </div>

              <button
                type="button"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[8px] bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_16px_36px_rgba(15,23,42,0.18)] transition hover:-translate-y-0.5 hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[rgba(15,23,42,0.12)] active:translate-y-0"
              >
                <Play className="h-4 w-4" />
                <span>{workspace.actionLabel}</span>
              </button>
            </div>
          </div>

          <div aria-label={workspace.previewTitle}>
            <ToolPreviewPane title={workspace.previewTitle} />
          </div>
        </div>
      </div>
    </section>
  );
}

function ToolControl({
  control,
  value,
  onChange,
}: {
  control: NonPromptToolControl;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 flex items-center gap-2 text-xs font-bold text-slate-500">
        <Settings2 className="h-3.5 w-3.5" />
        {control.label}
      </span>
      {control.type === 'text' ? (
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full rounded-[8px] border border-[rgba(72,55,44,0.14)] bg-white px-3 py-2 text-sm font-semibold text-slate-900 outline-none focus:border-slate-400"
        />
      ) : (
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full rounded-[8px] border border-[rgba(72,55,44,0.14)] bg-white px-3 py-2 text-sm font-semibold text-slate-900 outline-none focus:border-slate-400"
        >
          {(control.options ?? [control.defaultValue]).map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      )}
    </label>
  );
}

function ShowcaseSection({ config }: NonPromptToolPageProps) {
  const section = config.sections.showcase;
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyPrompt = async (prompt: string, id: string) => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1600);
    } catch {
      setCopiedId(null);
    }
  };

  return (
    <section id="showcase" className="bg-[var(--vogue-page)] py-20">
      <SectionHeader {...section} />
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-2">
        {section.items.map((item, index) => (
          <ShowcaseCard
            key={item.title}
            item={item}
            index={index}
            copied={copiedId === item.title}
            onCopy={() => copyPrompt(item.prompt, item.title)}
          />
        ))}
      </div>
    </section>
  );
}

function ShowcaseCard({
  item,
  index,
  copied,
  onCopy,
}: {
  item: NonPromptShowcaseItem;
  index: number;
  copied: boolean;
  onCopy: () => void;
}) {
  const variant = item.variant ?? ['earth', 'veo', 'hailuo', 'seedance'][index % 4];

  return (
    <div className="group overflow-hidden rounded-[8px] border border-[rgba(72,55,44,0.12)] bg-white shadow-[0_16px_42px_rgba(72,55,44,0.07)] transition duration-300 hover:border-[rgba(72,55,44,0.22)]">
      <div className="relative">
        <PreviewArt variant={variant} />
        <div className="absolute inset-0 bg-gradient-to-t from-white/92 via-white/18 to-transparent opacity-0 transition duration-300 group-hover:opacity-100">
          <div className="absolute bottom-4 left-4 right-4">
            <h3 className="text-lg font-semibold text-slate-950">
              {item.title}
            </h3>
            <p className="mt-1 text-sm text-slate-600">{item.description}</p>
          </div>
        </div>
      </div>
      <div className="p-6">
        <div className="rounded-[8px] border border-[rgba(72,55,44,0.12)] bg-[#fffaf7] p-4">
          <div className="mb-3 flex items-start justify-between">
            <div className="flex items-center">
              <Wand2 className="mr-2 h-5 w-5 text-slate-500" />
              <span className="text-sm font-medium text-slate-600">
                Prompt
              </span>
            </div>
            <button
              onClick={onCopy}
              className="rounded-[8px] bg-white p-1.5 text-slate-500 transition-colors duration-200 hover:bg-slate-950 hover:text-white"
              title="Copy prompt"
              type="button"
            >
              {copied ? (
                <Check className="h-4 w-4 text-emerald-600" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </button>
          </div>
          <p className="line-clamp-3 text-sm leading-relaxed text-slate-600">
            {item.prompt}
          </p>
        </div>
      </div>
    </div>
  );
}

function WhatSection({ config }: NonPromptToolPageProps) {
  const section = config.sections.what;

  return (
    <section id="what-this-tool-creates" className="bg-[var(--vogue-page)] py-16">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[0.94fr_1.06fr] lg:items-stretch">
        <div className="relative overflow-hidden rounded-[8px] border border-[rgba(72,55,44,0.12)] bg-[rgba(255,253,251,0.95)] p-7 shadow-[0_18px_48px_rgba(72,55,44,0.07)] sm:p-8">
          <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-slate-900/20 to-transparent" />
          <div className="flex h-12 w-12 items-center justify-center rounded-[8px] border border-[rgba(72,55,44,0.12)] bg-[#fffaf7] text-slate-700">
            <Wand2 className="h-5 w-5" />
          </div>
          <h2 className="mt-8 text-3xl font-semibold leading-tight text-slate-950 md:text-4xl">
            {section.title}
          </h2>
          <p className="mt-5 text-base leading-8 text-slate-600">
            {section.description}
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {['Input', 'Direction', 'Review'].map((label, index) => (
              <div
                key={label}
                className="rounded-[8px] border border-[rgba(72,55,44,0.1)] bg-white/78 px-4 py-3"
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                  {String(index + 1).padStart(2, '0')}
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-900">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-4">
          {section.items.map((item, index) => {
            const Icon = getIcon(item.title);
            return (
              <article
                key={item.title}
                className="group grid gap-4 rounded-[8px] border border-[rgba(72,55,44,0.12)] bg-white/88 p-5 shadow-[0_12px_34px_rgba(72,55,44,0.05)] transition hover:-translate-y-0.5 hover:border-[rgba(72,55,44,0.22)] sm:grid-cols-[auto_1fr]"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-[8px] border border-[rgba(72,55,44,0.12)] bg-[#fffaf7] transition group-hover:bg-slate-950">
                  <Icon className="h-5 w-5 text-slate-600 transition group-hover:text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-slate-400">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <h3 className="text-lg font-semibold text-slate-950">
                      {item.title}
                    </h3>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {item.description}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function HowSection({ config }: NonPromptToolPageProps) {
  const section = config.sections.how;

  return (
    <section id="how-it-works" className="bg-[var(--vogue-page)] py-16">
      <SectionHeader {...section} />
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-5">
          {section.steps.map((step) => (
            <article
              key={step.step}
              className="grid gap-5 rounded-[8px] border border-[rgba(72,55,44,0.12)] bg-[rgba(255,253,251,0.94)] p-5 shadow-[0_14px_36px_rgba(72,55,44,0.05)] sm:p-6 md:grid-cols-[92px_1fr] md:items-start"
            >
              <div className="flex h-12 w-16 items-center justify-center rounded-[8px] bg-slate-950 text-sm font-semibold text-white shadow-[0_14px_34px_rgba(15,23,42,0.16)]">
                {step.step}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-950">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {step.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureMosaicSection({ config }: NonPromptToolPageProps) {
  const section = config.sections.features;

  return (
    <section id="features" className="bg-[var(--vogue-page)] py-16">
      <SectionHeader {...section} />
      <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-2 lg:grid-cols-4">
        {section.items.map((item, index) => {
          const Icon = getIcon(item.title);
          const featured = index === 0;
          return (
            <article
              key={item.title}
              className={[
                'relative overflow-hidden rounded-[8px] border border-[rgba(72,55,44,0.12)] bg-white p-5 shadow-[0_14px_36px_rgba(72,55,44,0.05)]',
                featured ? 'lg:col-span-2 lg:row-span-2 lg:p-7' : '',
              ].join(' ')}
            >
              <div className="pointer-events-none absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-slate-900/18 to-transparent" />
              <div className="flex items-center justify-between gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-[8px] border border-[rgba(72,55,44,0.12)] bg-[#fffaf7]">
                  <Icon className={iconClassName} />
                </div>
                <span className="text-xs font-semibold text-slate-400">
                  {String(index + 1).padStart(2, '0')}
                </span>
              </div>
              <h3
                className={[
                  'mt-5 font-semibold leading-tight text-slate-950',
                  featured ? 'text-2xl md:text-3xl' : 'text-lg',
                ].join(' ')}
              >
                {item.title}
              </h3>
              <p
                className={[
                  'mt-3 text-sm leading-6 text-slate-600',
                  featured ? 'md:text-base md:leading-7' : '',
                ].join(' ')}
              >
                {item.description}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function UseCasesSection({ config }: NonPromptToolPageProps) {
  const section = config.sections.useCases;

  return (
    <section id="use-cases" className="bg-[var(--vogue-page)] py-16">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
          <div>
            <h2 className="text-3xl font-semibold leading-tight text-slate-950 md:text-4xl">
              {section.title}
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-600">
              {section.description}
            </p>
          </div>
          <div className="overflow-hidden rounded-[8px] border border-[rgba(72,55,44,0.12)] bg-white/86 shadow-[0_16px_42px_rgba(72,55,44,0.06)]">
            {section.items.map((item, index) => {
              const Icon = getIcon(item.title);
              return (
                <article
                  key={item.title}
                  className="grid gap-4 border-b border-[rgba(72,55,44,0.1)] p-5 last:border-b-0 sm:grid-cols-[auto_1fr_auto] sm:items-start"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-[8px] bg-[#fffaf7] text-slate-600">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-950">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {item.description}
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-slate-400">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function ValueSection({ config }: NonPromptToolPageProps) {
  const section = config.sections.value;

  return (
    <section id="why-it-works" className="bg-[var(--vogue-page)] py-16">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-stretch">
        <div className="relative overflow-hidden rounded-[8px] bg-slate-950 p-7 [color:#fff] shadow-[0_22px_58px_rgba(15,23,42,0.18)] sm:p-8">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(255,255,255,0.16),transparent_34%)]" />
          <div className="relative">
            <div className="flex h-12 w-12 items-center justify-center rounded-[8px] border border-white/12 bg-white/8">
              <Check className="h-5 w-5" />
            </div>
            <h2 className="mt-8 text-3xl font-semibold leading-tight md:text-4xl">
              {section.title}
            </h2>
            <p className="mt-5 text-base leading-8 [color:rgba(255,255,255,0.84)]">
              {section.description}
            </p>
          </div>
        </div>
        <div className="grid gap-4">
          {section.points.map((point, index) => (
            <article
              key={point.title}
              className="rounded-[8px] border border-[rgba(72,55,44,0.12)] bg-[rgba(255,253,251,0.94)] p-5 shadow-[0_14px_36px_rgba(72,55,44,0.05)]"
            >
              <div className="flex items-start gap-4">
                <span className="flex h-8 min-w-8 items-center justify-center rounded-full bg-[#fffaf7] text-xs font-semibold text-slate-500">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3 className="text-lg font-semibold text-slate-950">
                    {point.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {point.description}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function RelatedSection({ config }: NonPromptToolPageProps) {
  const section = config.sections.related;

  return (
    <section id="related-tools" className="bg-[var(--vogue-page)] py-16">
      <SectionHeader {...section} />
      <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-2">
        {section.tools.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="group rounded-[8px] border border-[rgba(72,55,44,0.12)] bg-white p-5 shadow-[0_14px_36px_rgba(72,55,44,0.06)] transition hover:border-[rgba(72,55,44,0.22)]"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[8px] border border-[rgba(72,55,44,0.12)] bg-[#fffaf7] text-slate-600">
                <Film className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-lg font-semibold text-slate-950">
                  {tool.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {tool.description}
                </p>
              </div>
              <ArrowRight className="mt-1 h-4 w-4 text-slate-400 transition group-hover:translate-x-1 group-hover:text-slate-800" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function FaqSection({ config }: NonPromptToolPageProps) {
  const section = config.sections.faq;

  return (
    <section id="faq" className="bg-[var(--vogue-page)] py-16">
      <SectionHeader {...section} />
      <div className="mx-auto max-w-4xl space-y-5">
        {section.items.map((faq) => (
          <details
            key={faq.question}
            className="group overflow-hidden rounded-[8px] border border-[rgba(72,55,44,0.12)] bg-white shadow-[0_12px_34px_rgba(72,55,44,0.05)] transition duration-300 hover:border-[rgba(72,55,44,0.2)]"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between p-6 transition-colors hover:bg-[#fffaf7]">
              <h3 className="pr-4 text-lg font-semibold text-slate-950">
                {faq.question}
              </h3>
              <ChevronDown className="h-5 w-5 shrink-0 text-slate-400 transition-transform duration-200 group-open:rotate-180 group-hover:text-slate-700" />
            </summary>
            <div className="border-t border-[rgba(72,55,44,0.1)] px-6 pb-6">
              <p className="pt-4 leading-relaxed text-slate-600">
                {faq.answer}
              </p>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}

function FinalCta({ config }: NonPromptToolPageProps) {
  const section = config.sections.finalCta;

  return (
    <section className="bg-[var(--vogue-page)] px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl rounded-[8px] border border-[rgba(72,55,44,0.12)] bg-[rgba(255,253,251,0.96)] p-8 text-center shadow-[0_18px_46px_rgba(72,55,44,0.06)]">
        <h2 className="text-2xl font-semibold text-slate-950 md:text-3xl">
          {section.title}
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600">
          {section.description}
        </p>
        <a
          href="#tool"
          className="mt-6 inline-flex items-center rounded-[8px] bg-slate-950 px-6 py-3 font-medium text-white shadow-[0_14px_32px_rgba(15,23,42,0.16)] transition hover:-translate-y-0.5 hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[rgba(15,23,42,0.12)]"
        >
          {section.actionLabel}
          <ArrowRight className="ml-2 h-5 w-5" />
        </a>
      </div>
    </section>
  );
}

function JsonLd({ config }: NonPromptToolPageProps) {
  const parentBreadcrumb = getNonPromptBreadcrumbParent(config);
  const faqData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: config.sections.faq.items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  const breadcrumbData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://vogueai.net',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: parentBreadcrumb.name,
        item: parentBreadcrumb.item,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: config.label,
        item: `https://vogueai.net${config.path}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
      />
    </>
  );
}

export default function NonPromptToolPage({ config }: NonPromptToolPageProps) {
  return (
    <div className="vogue-marketing-light min-h-screen bg-[var(--vogue-page)] !bg-none text-slate-950">
      <JsonLd config={config} />
      <main>
        <ToolWorkspace config={config} />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ShowcaseSection config={config} />
          <WhatSection config={config} />
          <HowSection config={config} />
          <FeatureMosaicSection config={config} />
          <UseCasesSection config={config} />
          <ValueSection config={config} />
          <RelatedSection config={config} />
          <FaqSection config={config} />
        </div>
        <FinalCta config={config} />
      </main>
      <div className="[&>footer]:!bg-[var(--vogue-page)] [&>footer]:!bg-none">
        <Footer />
      </div>
    </div>
  );
}
