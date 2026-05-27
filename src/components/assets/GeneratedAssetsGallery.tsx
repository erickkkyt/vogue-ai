'use client';

import { getVogueCopyFromMessages, type VogueUICopy } from '@/i18n/vogue';
import type { GeneratedWorkspaceItem } from '@/lib/app/generated-workspace-feed';
import { getUrlWithLocale } from '@/lib/urls/urls';
import {
  ArrowRight,
  Check,
  Copy,
  Download,
  Image as ImageIcon,
  Loader2,
  Plus,
  Sparkles,
  X,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useLocale, useMessages } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';

const getAssetTitle = (prompt: string | null, copy: VogueUICopy) => {
  const normalized = prompt?.trim().replace(/\s+/g, ' ');
  return normalized && normalized.length > 0 ? normalized : copy.assets.untitledAsset;
};

const getDateLabel = (createdAt: string, locale: string) =>
  new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  }).format(new Date(createdAt));

const getStatusLabel = (
  status: GeneratedWorkspaceItem['status'],
  copy: VogueUICopy
) => {
  if (status === 'succeeded') return copy.assets.statuses.succeeded;
  if (status === 'failed') return copy.assets.statuses.failed;
  if (status === 'pending') return copy.assets.statuses.pending;
  return copy.assets.statuses.processing;
};

const getDownloadHref = (taskId: string) =>
  `/api/assets/download?${new URLSearchParams({ taskId }).toString()}`;

const getUsePromptHref = (item: GeneratedWorkspaceItem, locale: string) => {
  const params = new URLSearchParams();
  if (item.modelId) params.set('model', item.modelId);
  if (item.prompt) params.set('prompt', item.prompt);
  return `${getUrlWithLocale('/app', locale)}${
    params.toString() ? `?${params.toString()}` : ''
  }`;
};

const getUseAsReferenceHref = (
  item: GeneratedWorkspaceItem,
  locale: string
) => {
  const params = new URLSearchParams();
  if (item.modelId) params.set('model', item.modelId);
  if (item.prompt) params.set('prompt', item.prompt);
  if (item.mediaUrl) params.set('referenceImage', item.mediaUrl);
  return `${getUrlWithLocale('/app', locale)}${
    params.toString() ? `?${params.toString()}` : ''
  }`;
};

function AssetPreview({
  item,
  copy,
}: {
  item: GeneratedWorkspaceItem;
  copy: VogueUICopy;
}) {
  if (item.mediaUrl && item.assetType === 'image') {
    return (
      <Image
        src={item.mediaUrl}
        alt={getAssetTitle(item.prompt, copy)}
        fill
        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
        unoptimized
        className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
        loading="lazy"
      />
    );
  }

  if (item.mediaUrl && item.assetType === 'video') {
    return (
      <video
        src={item.mediaUrl}
        muted
        playsInline
        preload="metadata"
        className="h-full w-full object-cover"
      >
        <track kind="captions" label={copy.assets.captionsUnavailable} />
      </video>
    );
  }

  return (
    <div className="flex h-full w-full items-center justify-center bg-slate-50 text-slate-400">
      {item.status === 'processing' || item.status === 'pending' ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        <ImageIcon className="h-5 w-5" />
      )}
    </div>
  );
}

function AssetDetail({
  item,
  locale,
  copy,
  onClose,
}: {
  item: GeneratedWorkspaceItem;
  locale: string;
  copy: VogueUICopy;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const title = getAssetTitle(item.prompt, copy);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 1600);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const copyPrompt = async () => {
    if (!item.prompt) return;
    try {
      await navigator.clipboard.writeText(item.prompt);
      setCopied(true);
    } catch {}
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/78 p-4 backdrop-blur-xl"
      role="dialog"
      aria-modal="true"
    >
      <div className="mx-auto grid h-full max-w-[1600px] overflow-hidden rounded-[8px] border border-white/10 bg-[#12141a] shadow-[0_40px_140px_rgba(0,0,0,0.55)] xl:grid-cols-[minmax(0,1.18fr)_430px]">
        <div className="relative flex min-h-0 items-center justify-center overflow-hidden bg-[#090a0d] p-5">
          {item.mediaUrl ? (
            <>
              <div
                className="absolute inset-0 scale-110 bg-cover bg-center opacity-35 blur-[90px]"
                style={{ backgroundImage: `url("${item.mediaUrl}")` }}
              />
              <div className="absolute inset-0 bg-black/35" />
            </>
          ) : null}
          <div className="relative flex h-full w-full items-center justify-center">
            {item.mediaUrl && item.assetType === 'image' ? (
              <Image
                src={item.mediaUrl}
                alt={title}
                width={1400}
                height={1050}
                unoptimized
                className="max-h-full max-w-full rounded-[8px] object-contain shadow-[0_24px_80px_rgba(0,0,0,0.42)]"
              />
            ) : item.mediaUrl ? (
              <video
                src={item.mediaUrl}
                controls
                className="max-h-full max-w-full rounded-[8px] bg-black"
              >
                <track kind="captions" label={copy.assets.captionsUnavailable} />
              </video>
            ) : (
              <div className="flex aspect-[4/3] w-full max-w-[720px] items-center justify-center rounded-[8px] border border-white/10 bg-black/35 text-sm text-zinc-500">
                {copy.assets.stillProcessing}
              </div>
            )}
          </div>
        </div>

        <aside className="flex min-h-0 flex-col border-t border-white/10 bg-[#171920] xl:border-l xl:border-t-0">
          <div className="border-b border-white/10 px-5 py-5">
            <div className="flex items-start gap-4">
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-200">
                  {copy.assets.projectAsset}
                </p>
                <h2 className="mt-3 text-2xl font-bold leading-tight text-white">
                  {title}
                </h2>
                <p className="mt-2 text-sm text-zinc-500">
                  {item.modelLabel || 'Vogue AI'} ·{' '}
                  {getDateLabel(item.createdAt, locale)}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-black/35 text-zinc-300 transition hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
                <span className="sr-only">{copy.common.close}</span>
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-5">
            <section className="rounded-[8px] border border-white/10 bg-white/[0.035] p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
                  {copy.assets.prompt}
                </p>
                <button
                  type="button"
                  onClick={copyPrompt}
                  className="inline-flex items-center gap-1.5 rounded-[8px] px-2.5 py-1.5 text-xs font-semibold text-zinc-300 transition hover:bg-white/10 hover:text-white"
                >
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? copy.assets.copied : copy.assets.copy}
                </button>
              </div>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-zinc-200">
                {item.prompt || copy.assets.noPrompt}
              </p>
            </section>

            <section className="mt-4 rounded-[8px] border border-white/10 bg-white/[0.03] px-4 py-2">
              {[
                [copy.assets.labels.status, getStatusLabel(item.status, copy)],
                [copy.assets.labels.model, item.modelLabel || copy.assets.defaults.unknown],
                [copy.assets.labels.params, item.paramsLabel || copy.assets.defaults.defaultParams],
                [
                  copy.assets.labels.type,
                  item.assetType === 'video'
                    ? copy.assets.defaults.video
                    : copy.assets.defaults.image,
                ],
                [copy.assets.labels.taskId, item.taskId],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-start justify-between gap-4 border-b border-white/10 py-3 last:border-b-0"
                >
                  <span className="text-sm text-zinc-500">{label}</span>
                  <span className="min-w-0 truncate text-right text-sm text-zinc-100">
                    {value}
                  </span>
                </div>
              ))}
            </section>
          </div>

          <div className="grid gap-3 border-t border-white/10 p-5 sm:grid-cols-3 xl:grid-cols-1">
            <Link
              href={getUsePromptHref(item, locale)}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-[8px] bg-cyan-300 px-4 text-sm font-bold text-slate-950 transition hover:bg-cyan-200"
            >
              <Sparkles className="h-4 w-4" />
              {copy.assets.usePrompt}
            </Link>
            <Link
              href={getUseAsReferenceHref(item, locale)}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-[8px] bg-white px-4 text-sm font-bold text-slate-950 transition hover:bg-zinc-100"
            >
              <ArrowRight className="h-4 w-4" />
              {copy.assets.useAsReference}
            </Link>
            <a
              href={getDownloadHref(item.taskId)}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-[8px] border border-white/10 px-4 text-sm font-bold text-zinc-100 transition hover:bg-white/10"
            >
              <Download className="h-4 w-4" />
              {copy.assets.download}
            </a>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default function GeneratedAssetsGallery({
  items,
  currentLimit,
  hasMore,
}: {
  items: GeneratedWorkspaceItem[];
  currentLimit: number;
  hasMore: boolean;
}) {
  const locale = useLocale();
  const messages = useMessages();
  const copy = getVogueCopyFromMessages(messages);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const selectedItem = useMemo(
    () => items.find((item) => item.id === selectedItemId) ?? null,
    [items, selectedItemId]
  );

  if (items.length === 0) {
    return (
      <section className="flex min-h-[min(70vh,760px)] w-full flex-1 flex-col items-center justify-center px-6 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 text-slate-500">
          <ImageIcon className="h-7 w-7" />
        </div>
        <h2 className="mt-8 text-[22px] font-semibold leading-tight tracking-normal text-slate-600">
          {copy.assets.blankTitle}
        </h2>
        <p className="mx-auto mt-3 max-w-md text-[14px] leading-[1.62] text-slate-500">
          {copy.assets.blankDescription}
        </p>
        <Link
          href={getUrlWithLocale('/app', locale)}
          className="mt-7 inline-flex h-10 items-center gap-2 rounded-[14px] border border-slate-200 bg-white/82 px-4 text-[14px] font-medium text-slate-700 shadow-[0_10px_26px_rgba(72,92,130,0.08)] transition hover:bg-white hover:text-slate-950"
        >
          <Plus className="h-4 w-4" />
          {copy.assets.newGeneration}
        </Link>
      </section>
    );
  }

  return (
    <>
      <section className="grid w-full gap-x-5 gap-y-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <Link
          href={getUrlWithLocale('/app', locale)}
          className="group flex flex-col gap-3"
        >
          <div className="flex aspect-[4/3] items-center justify-center rounded-[18px] border border-dashed border-slate-200 bg-white/58 transition hover:border-[#4f67ff]/35 hover:bg-[#f7f9ff]">
            <Plus className="h-8 w-8 text-slate-400 transition group-hover:text-[#4f67ff]" />
          </div>
          <div>
            <p className="text-[14px] font-semibold text-slate-950">
              {copy.assets.newGeneration}
            </p>
            <p className="mt-1 text-[14px] text-slate-500">
              {copy.assets.newGenerationDescription}
            </p>
          </div>
        </Link>

        {items.map((item) => {
          const title = getAssetTitle(item.prompt, copy);
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelectedItemId(item.id)}
              className="group flex min-w-0 flex-col gap-3 text-left"
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-[18px] border border-slate-200 bg-slate-50 transition hover:-translate-y-0.5 hover:border-[#4f67ff]/24 hover:shadow-[0_20px_44px_rgba(72,92,130,0.14)]">
                <AssetPreview item={item} copy={copy} />
                {item.status !== 'succeeded' ? (
                  <div className="absolute left-3 top-3 rounded-full border border-white/55 bg-white/78 px-2.5 py-1 text-xs font-semibold text-slate-700 backdrop-blur">
                    {getStatusLabel(item.status, copy)}
                  </div>
                ) : null}
              </div>
              <div className="min-w-0">
                <p className="truncate text-[14px] font-semibold text-slate-950">
                  {title}
                </p>
                <p className="mt-1 text-[14px] text-slate-500">
                  {item.modelLabel || 'Vogue AI'} ·{' '}
                  {getDateLabel(item.createdAt, locale)}
                </p>
              </div>
            </button>
          );
        })}
      </section>

      {hasMore ? (
        <div className="mt-8 flex justify-center">
          <Link
            href={`${getUrlWithLocale('/assets', locale)}?limit=${
              currentLimit + 12
            }`}
            className="rounded-[14px] border border-slate-200 bg-white/78 px-4 py-2 text-[14px] font-medium text-slate-700 transition hover:bg-white hover:text-slate-950"
          >
            {copy.assets.loadMore}
          </Link>
        </div>
      ) : null}

      {selectedItem ? (
        <AssetDetail
          item={selectedItem}
          locale={locale}
          copy={copy}
          onClose={() => setSelectedItemId(null)}
        />
      ) : null}
    </>
  );
}
