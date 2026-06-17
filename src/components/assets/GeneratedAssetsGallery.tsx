'use client';

import AssetPreviewOverlay, {
  type AssetPreviewOverlayOwner,
} from '@/components/assets/AssetPreviewOverlay';
import { getVogueCopyFromMessages, type VogueUICopy } from '@/i18n/vogue';
import type { GeneratedWorkspaceItem } from '@/lib/app/generated-workspace-feed';
import { getUrlWithLocale } from '@/lib/urls/urls';
import {
  Download,
  Image as ImageIcon,
  ImagePlus,
  Loader2,
  Maximize2,
  Sparkles,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useLocale, useMessages } from 'next-intl';
import { useMemo, useState, type ReactNode } from 'react';

type AssetFilter = 'all' | 'image' | 'video';

const getAssetTitle = (prompt: string | null, copy: VogueUICopy) => {
  const normalized = prompt?.trim().replace(/\s+/g, ' ');
  return normalized && normalized.length > 0 ? normalized : copy.assets.untitledAsset;
};

const getAssetDateKey = (createdAt: string) => {
  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) return 'unknown';
  return date.toISOString().slice(0, 10);
};

const getAssetDateGroupLabel = (dateKey: string, locale: string) => {
  if (dateKey === 'unknown') return dateKey;
  return new Intl.DateTimeFormat(locale, {
    month: 'long',
    day: 'numeric',
  }).format(new Date(`${dateKey}T00:00:00.000Z`));
};

const groupAssetsByDate = (items: GeneratedWorkspaceItem[]) => {
  const groups = new Map<string, GeneratedWorkspaceItem[]>();
  for (const item of items) {
    const dateKey = getAssetDateKey(item.createdAt);
    groups.set(dateKey, [...(groups.get(dateKey) ?? []), item]);
  }
  return Array.from(groups.entries()).map(([dateKey, groupItems]) => ({
    dateKey,
    items: groupItems,
  }));
};

const getStatusLabel = (
  status: GeneratedWorkspaceItem['status'],
  copy: VogueUICopy
) => {
  if (status === 'succeeded') return copy.assets.statuses.succeeded;
  if (status === 'failed') return copy.assets.statuses.failed;
  if (status === 'pending') return copy.assets.statuses.pending;
  return copy.assets.statuses.processing;
};

const getAssetFilterLabel = (filter: AssetFilter, copy: VogueUICopy) => {
  if (filter === 'all') return copy.assets.filters.all;
  if (filter === 'image') return copy.assets.filters.image;
  return copy.assets.filters.video;
};

const getDownloadHref = (taskId: string, mediaUrl?: string | null) => {
  const params = new URLSearchParams({ taskId });
  if (mediaUrl) params.set('url', mediaUrl);
  return `/api/assets/download?${params.toString()}`;
};

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
        sizes="(min-width: 1280px) 240px, (min-width: 768px) 220px, 82vw"
        unoptimized
        className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.025]"
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

function AssetCard({
  item,
  copy,
  locale,
  onPreview,
}: {
  item: GeneratedWorkspaceItem;
  copy: VogueUICopy;
  locale: string;
  onPreview: (item: GeneratedWorkspaceItem) => void;
}) {
  const promptHref = getUsePromptHref(item, locale);
  const referenceHref = getUseAsReferenceHref(item, locale);
  const canUsePrompt = Boolean(item.prompt);
  const canUseReference = Boolean(item.mediaUrl);

  return (
    <article className="group relative aspect-[4/5] min-w-0 overflow-hidden rounded-[18px] bg-slate-100 shadow-[0_14px_34px_rgba(72,92,130,0.11)] ring-1 ring-slate-200/70 transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_52px_rgba(72,92,130,0.16)]">
      <button
        type="button"
        disabled={!item.mediaUrl}
        onClick={() => onPreview(item)}
        className="absolute inset-0 flex h-full w-full items-center justify-center text-slate-400 disabled:cursor-default"
        aria-label={getAssetTitle(item.prompt, copy)}
      >
        <AssetPreview item={item} copy={copy} />
      </button>

      {item.status !== 'succeeded' ? (
        <div className="absolute left-3 top-3 z-10 rounded-full border border-white/70 bg-white/86 px-3 py-1 text-[12px] font-semibold text-slate-700 shadow-[0_10px_24px_rgba(72,92,130,0.12)] backdrop-blur-xl">
          {getStatusLabel(item.status, copy)}
        </div>
      ) : null}

      <div className="pointer-events-none absolute inset-x-3 bottom-3 z-20 flex translate-y-2 items-center justify-between gap-1 rounded-[16px] border border-white/70 bg-white/92 px-2 py-2 opacity-0 shadow-[0_16px_34px_rgba(15,23,42,0.18)] backdrop-blur-xl transition duration-200 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:translate-y-0 group-focus-within:opacity-100">
        <Link
          href={promptHref}
          className={`inline-flex h-9 items-center justify-center gap-1.5 whitespace-nowrap rounded-[11px] px-3 text-[12px] font-semibold transition sm:text-[13px] ${
            canUsePrompt
              ? 'bg-slate-950 text-white hover:bg-slate-800'
              : 'pointer-events-none bg-slate-100 text-slate-400'
          }`}
          aria-disabled={!canUsePrompt}
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>{copy.assets.usePrompt}</span>
        </Link>
        <Link
          href={referenceHref}
          className={`inline-flex h-9 w-9 items-center justify-center rounded-[11px] text-slate-700 transition hover:bg-slate-100 hover:text-slate-950 ${
            canUseReference ? '' : 'pointer-events-none opacity-40'
          }`}
          aria-label={copy.assets.useAsReference}
          aria-disabled={!canUseReference}
        >
          <ImagePlus className="h-4 w-4" />
        </Link>
        <a
          href={getDownloadHref(item.taskId, item.mediaUrl)}
          className={`inline-flex h-9 w-9 items-center justify-center rounded-[11px] text-slate-700 transition hover:bg-slate-100 hover:text-slate-950 ${
            canUseReference ? '' : 'pointer-events-none opacity-40'
          }`}
          aria-label={copy.assets.download}
          aria-disabled={!canUseReference}
        >
          <Download className="h-4 w-4" />
        </a>
        <button
          type="button"
          disabled={!item.mediaUrl}
          onClick={() => onPreview(item)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-[11px] text-slate-700 transition hover:bg-slate-100 hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label={copy.assets.projectAsset}
        >
          <Maximize2 className="h-4 w-4" />
        </button>
      </div>
    </article>
  );
}

function AssetFilterTabs({
  assetFilter,
  copy,
  onChange,
}: {
  assetFilter: AssetFilter;
  copy: VogueUICopy;
  onChange: (filter: AssetFilter) => void;
}) {
  return (
    <div className="flex items-center gap-0.5 rounded-[13px] border border-slate-200/80 bg-white/62 p-0.5 shadow-[0_8px_18px_rgba(72,92,130,0.06)]">
      {(['all', 'image', 'video'] as const).map((filter) => (
        <button
          key={filter}
          type="button"
          onClick={() => onChange(filter)}
          className={`inline-flex h-8 min-w-[56px] items-center justify-center rounded-[10px] px-2.5 text-[13px] font-medium transition ${
            assetFilter === filter
              ? 'bg-[#ece7df] text-slate-950 shadow-[0_6px_12px_rgba(72,55,44,0.08)]'
              : 'text-slate-500 hover:bg-white hover:text-slate-950'
          }`}
        >
          {getAssetFilterLabel(filter, copy)}
        </button>
      ))}
    </div>
  );
}

export default function GeneratedAssetsGallery({
  children,
  items,
  currentLimit,
  hasMore,
  owner,
}: {
  children?: ReactNode;
  items: GeneratedWorkspaceItem[];
  currentLimit: number;
  hasMore: boolean;
  owner: AssetPreviewOverlayOwner;
}) {
  const locale = useLocale();
  const messages = useMessages();
  const copy = getVogueCopyFromMessages(messages);
  const [assetFilter, setAssetFilter] = useState<AssetFilter>('all');
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const filteredItems = useMemo(
    () =>
      assetFilter === 'all'
        ? items
        : items.filter((item) => item.assetType === assetFilter),
    [assetFilter, items]
  );
  const groupedItems = useMemo(
    () => groupAssetsByDate(filteredItems),
    [filteredItems]
  );
  const selectedItem = useMemo(
    () => items.find((item) => item.id === selectedItemId) ?? null,
    [items, selectedItemId]
  );

  if (items.length === 0) {
    return (
      <div className="flex w-full flex-1 flex-col space-y-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {children}
        </div>
        <section className="flex min-h-[min(70vh,760px)] flex-1 flex-col items-center justify-center px-6 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 text-slate-500">
            <ImageIcon className="h-7 w-7" />
          </div>
          <h2 className="mt-8 text-[22px] font-semibold leading-tight tracking-normal text-slate-600">
            {copy.assets.blankTitle}
          </h2>
          <p className="mx-auto mt-3 max-w-md text-[14px] leading-[1.62] text-slate-500">
            {copy.assets.blankDescription}
          </p>
        </section>
      </div>
    );
  }

  return (
    <>
      <div className="w-full space-y-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {children}
          <AssetFilterTabs
            assetFilter={assetFilter}
            copy={copy}
            onChange={setAssetFilter}
          />
        </div>

        {groupedItems.length > 0 ? (
          groupedItems.map((group) => (
            <section key={group.dateKey} className="space-y-3">
              <div className="flex items-center gap-4">
                <p className="shrink-0 text-[16px] font-semibold text-slate-500">
                  {getAssetDateGroupLabel(group.dateKey, locale)}
                </p>
                <div className="h-px flex-1 bg-slate-200" />
              </div>
              <div className="grid grid-cols-[repeat(auto-fill,minmax(170px,240px))] justify-start gap-5">
                {group.items.map((item) => (
                  <AssetCard
                    key={item.id}
                    item={item}
                    copy={copy}
                    locale={locale}
                    onPreview={(nextItem) => setSelectedItemId(nextItem.id)}
                  />
                ))}
              </div>
            </section>
          ))
        ) : (
          <div className="rounded-[22px] border border-dashed border-slate-300 bg-white/55 px-6 py-10 text-center text-[14px] font-medium text-slate-500">
            {copy.assets.blankTitle}
          </div>
        )}

        {hasMore ? (
          <div className="flex justify-center pt-2">
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
      </div>

      {selectedItem ? (
        <AssetPreviewOverlay
          item={selectedItem}
          copy={copy}
          locale={locale}
          usePromptHref={getUsePromptHref(selectedItem, locale)}
          useAsReferenceHref={getUseAsReferenceHref(selectedItem, locale)}
          owner={owner}
          onClose={() => setSelectedItemId(null)}
        />
      ) : null}
    </>
  );
}
