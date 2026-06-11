'use client';

import type { VogueUICopy } from '@/i18n/vogue';
import { getModelIconPathByModelId } from '@/lib/model-icons';
import { Check, Copy, Download, ImagePlus, Sparkles, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';

export type AssetPreviewOverlayItem = {
  id: string;
  taskId: string;
  status: 'pending' | 'processing' | 'succeeded' | 'failed';
  prompt: string | null;
  modelId: string | null;
  modelLabel: string | null;
  paramsLabel: string | null;
  assetType: 'image' | 'video';
  mediaUrl: string | null;
  createdAt: string;
};

export type AssetPreviewOverlayOwner = {
  name: string;
  image?: string | null;
};

type AssetPreviewOverlayProps = {
  item: AssetPreviewOverlayItem;
  owner: AssetPreviewOverlayOwner;
  copy: VogueUICopy;
  locale: string;
  usePromptHref?: string;
  useAsReferenceHref?: string;
  onUsePrompt?: (prompt: string) => void;
  onUseAsReference?: (url: string) => void;
  onClose: () => void;
};

const getAssetTitle = (item: AssetPreviewOverlayItem, copy: VogueUICopy) => {
  const normalized = item.prompt?.trim().replace(/\s+/g, ' ');
  if (!normalized) return copy.assets.untitledAsset;
  return normalized.length > 88 ? `${normalized.slice(0, 88)}...` : normalized;
};

const getStatusLabel = (
  status: AssetPreviewOverlayItem['status'],
  copy: VogueUICopy
) => {
  if (status === 'succeeded') return copy.assets.statuses.succeeded;
  if (status === 'failed') return copy.assets.statuses.failed;
  if (status === 'pending') return copy.assets.statuses.pending;
  return copy.assets.statuses.processing;
};

const getDownloadHref = (taskId: string, mediaUrl?: string | null) => {
  const params = new URLSearchParams({ taskId });
  if (mediaUrl) params.set('url', mediaUrl);
  return `/api/assets/download?${params.toString()}`;
};

const copyTextToClipboard = async (value: string) => {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(value);
      return;
    }
  } catch {
    // Fall through to selection copy below.
  }

  const textarea = document.createElement('textarea');
  textarea.value = value;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.left = '-9999px';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  textarea.remove();
};

export default function AssetPreviewOverlay({
  item,
  owner,
  copy,
  locale,
  usePromptHref,
  useAsReferenceHref,
  onUsePrompt,
  onUseAsReference,
  onClose,
}: AssetPreviewOverlayProps) {
  const [copied, setCopied] = useState(false);
  const portalHost =
    typeof document === 'undefined' ? null : document.body;
  const title = useMemo(() => getAssetTitle(item, copy), [copy, item]);
  const ownerName = owner.name.trim() || 'Vogue AI';
  const modelIconPath = item.modelId
    ? getModelIconPathByModelId(item.modelId)
    : null;
  const promptAvailable = Boolean(item.prompt?.trim());
  const referenceAvailable = Boolean(item.mediaUrl);
  const promptText = item.prompt || copy.assets.noPrompt;

  useEffect(() => {
    document.body.dataset.vogueAssetPreviewOpen = 'true';
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      delete document.body.dataset.vogueAssetPreviewOpen;
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 1400);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const copyPrompt = async () => {
    if (!item.prompt) return;
    await copyTextToClipboard(item.prompt);
    setCopied(true);
  };

  const handleUsePrompt = () => {
    if (!item.prompt || !onUsePrompt) return;
    onUsePrompt(item.prompt);
    onClose();
  };

  const handleUseAsReference = () => {
    if (!item.mediaUrl || !onUseAsReference) return;
    onUseAsReference(item.mediaUrl);
    onClose();
  };

  const primaryActionClass =
    'inline-flex h-12 items-center justify-center gap-2 rounded-[14px] border border-slate-950 bg-slate-950 px-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:border-slate-300 disabled:bg-slate-200 disabled:text-slate-500';
  const secondaryActionClass =
    'inline-flex h-12 items-center justify-center gap-2 rounded-[14px] border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-950 shadow-[0_12px_26px_rgba(72,92,130,0.08)] transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-[#f7fbff] disabled:cursor-not-allowed disabled:text-slate-400 disabled:hover:translate-y-0';

  const overlay = (
    <div
      role="dialog"
      aria-modal="true"
      lang={locale}
      data-vogue-asset-preview-overlay
      className="fixed inset-0 z-[220] grid h-dvh max-h-dvh w-screen overflow-hidden bg-[#edf4fb] font-[var(--font-vogue-sans)] text-slate-950 lg:grid-cols-[minmax(0,1fr)_minmax(390px,31vw)]"
    >
      <section className="relative min-h-0 overflow-hidden bg-[#edf4fb]">
        <div className="absolute right-4 top-4 z-20 flex items-center gap-1.5">
          {item.mediaUrl ? (
            <a
              href={getDownloadHref(item.taskId, item.mediaUrl)}
              download
              aria-label={copy.assets.download}
              className="inline-flex h-[38px] w-[38px] items-center justify-center rounded-full border border-white/80 bg-white/[0.82] text-slate-900 shadow-[0_8px_20px_rgba(72,92,130,0.12)] ring-1 ring-slate-900/[0.04] backdrop-blur-xl transition hover:bg-white hover:shadow-[0_12px_24px_rgba(72,92,130,0.16)]"
              title={copy.assets.download}
            >
              <Download className="h-4 w-4" />
            </a>
          ) : null}
          <div className="inline-flex h-[38px] min-w-[54px] items-center justify-center rounded-full border border-white/80 bg-white/[0.82] px-3 text-[13px] font-semibold tabular-nums shadow-[0_8px_20px_rgba(72,92,130,0.12)] ring-1 ring-slate-900/[0.04] backdrop-blur-xl">
            1 / 1
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={copy.common.close}
            className="inline-flex h-[38px] w-[38px] items-center justify-center rounded-full border border-white/80 bg-white/[0.82] text-slate-900 shadow-[0_8px_20px_rgba(72,92,130,0.12)] ring-1 ring-slate-900/[0.04] backdrop-blur-xl transition hover:bg-white hover:shadow-[0_12px_24px_rgba(72,92,130,0.16)]"
            title={copy.common.close}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex h-full min-h-0 items-center justify-center px-6 py-20 sm:px-10 lg:px-14">
          {item.mediaUrl && item.assetType === 'image' ? (
            <Image
              src={item.mediaUrl}
              alt={title}
              width={1400}
              height={1400}
              unoptimized
              priority
              className="h-auto w-auto max-h-[min(calc(100dvh-8rem),86vh)] max-w-[min(82vw,980px)] rounded-[18px] object-contain shadow-[0_22px_58px_rgba(72,92,130,0.16)] ring-1 ring-slate-900/[0.06]"
            />
          ) : item.mediaUrl ? (
            <video
              src={item.mediaUrl}
              controls
              className="h-auto w-auto max-h-[min(calc(100dvh-8rem),86vh)] max-w-[min(82vw,980px)] rounded-[18px] bg-black shadow-[0_22px_58px_rgba(72,92,130,0.16)]"
            >
              <track kind="captions" label={copy.assets.captionsUnavailable} />
            </video>
          ) : (
            <div className="flex aspect-[4/3] w-full max-w-[760px] items-center justify-center rounded-[20px] border border-slate-200 bg-white/70 text-sm font-medium text-slate-500">
              {copy.assets.stillProcessing}
            </div>
          )}
        </div>
      </section>

      <aside className="grid min-h-0 grid-rows-[auto_minmax(0,1fr)_auto] overflow-hidden border-t border-slate-200 bg-white lg:border-l lg:border-t-0">
        <header className="vogue-asset-panel-header border-b border-slate-200 px-6 py-6">
          <div className="flex min-w-0 items-center gap-3">
            <span className="vogue-asset-owner-avatar inline-flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-slate-50 text-[13px] font-semibold text-slate-600">
              {owner.image ? (
                <Image
                  src={owner.image}
                  alt=""
                  width={36}
                  height={36}
                  unoptimized
                  className="h-full w-full object-cover"
                />
              ) : (
                ownerName.slice(0, 1).toUpperCase()
              )}
            </span>
            <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-3 gap-y-2">
              <p className="vogue-asset-owner-name truncate text-[15px] font-semibold leading-tight text-slate-950">
                {ownerName}
              </p>
              <div className="vogue-asset-owner-meta-row flex min-w-0 flex-wrap items-center gap-2 text-[12px] font-semibold text-slate-600">
                <span className="inline-flex h-8 min-w-0 items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 shadow-[0_8px_18px_rgba(72,92,130,0.05)]">
                  {modelIconPath ? (
                    <Image
                      src={modelIconPath}
                      alt=""
                      width={16}
                      height={16}
                      unoptimized
                      className="h-3.5 w-3.5 rounded-full object-contain"
                    />
                  ) : (
                    <Sparkles className="h-3.5 w-3.5" />
                  )}
                  <span className="min-w-0 truncate">
                    {item.modelLabel || 'Vogue AI'}
                  </span>
                </span>
                <span className="inline-flex h-8 items-center rounded-full border border-slate-200 bg-white px-3 shadow-[0_8px_18px_rgba(72,92,130,0.05)]">
                  {getStatusLabel(item.status, copy)}
                </span>
              </div>
            </div>
          </div>
        </header>

        <div className="min-h-0 overflow-y-auto px-6 py-6">
          <section className="rounded-[18px] bg-[#faf9f7] px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] ring-1 ring-slate-100">
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="text-[13px] font-semibold text-slate-500">
                {copy.assets.prompt}
              </p>
              <button
                type="button"
                onClick={copyPrompt}
                disabled={!promptAvailable}
                className="inline-flex h-8 w-8 items-center justify-center rounded-[10px] border border-slate-200 bg-white text-slate-700 shadow-[0_8px_18px_rgba(72,92,130,0.06)] transition hover:bg-slate-950 hover:text-white disabled:cursor-not-allowed disabled:opacity-45"
                title={copy.assets.copy}
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                <span className="sr-only">
                  {copied ? copy.assets.copied : copy.assets.copy}
                </span>
              </button>
            </div>
            <div className="max-h-[clamp(160px,30vh,300px)] min-h-[9rem] overflow-y-auto pr-2">
              <p className="vogue-prompt-field whitespace-pre-wrap text-[0.94rem] leading-[1.62] text-slate-700">
                {promptText}
              </p>
            </div>
          </section>

          <section className="mt-4 rounded-[16px] bg-white px-4 py-1.5 shadow-[0_10px_24px_rgba(72,92,130,0.06)] ring-1 ring-slate-200/70">
            {[
              [copy.assets.labels.model, item.modelLabel || copy.assets.defaults.unknown],
              [copy.assets.labels.params, item.paramsLabel || copy.assets.defaults.defaultParams],
              [
                copy.assets.labels.type,
                item.assetType === 'video'
                  ? copy.assets.defaults.video
                  : copy.assets.defaults.image,
              ],
              [copy.assets.labels.status, getStatusLabel(item.status, copy)],
              [copy.assets.labels.taskId, item.taskId],
            ].map(([label, value]) => (
              <div
                key={label}
                className="flex items-start justify-between gap-6 border-b border-slate-100 py-2.5 last:border-b-0"
              >
                <span className="text-[13px] text-slate-500">{label}</span>
                <span className="min-w-0 truncate text-right text-[13px] text-slate-800">
                  {value}
                </span>
              </div>
            ))}
          </section>
        </div>

        <footer className="border-t border-slate-200 bg-white px-6 py-6">
          <div className="grid grid-cols-2 gap-4">
            {usePromptHref ? (
              <Link
                href={usePromptHref}
                className={`${primaryActionClass} ${
                  promptAvailable ? '' : 'pointer-events-none opacity-45'
                }`}
                aria-disabled={!promptAvailable}
              >
                <Sparkles className="h-4 w-4" />
                {copy.assets.usePrompt}
              </Link>
            ) : (
              <button
                type="button"
                onClick={handleUsePrompt}
                disabled={!promptAvailable || !onUsePrompt}
                className={primaryActionClass}
              >
                <Sparkles className="h-4 w-4" />
                {copy.assets.usePrompt}
              </button>
            )}

            {useAsReferenceHref ? (
              <Link
                href={useAsReferenceHref}
                className={`${secondaryActionClass} ${
                  referenceAvailable ? '' : 'pointer-events-none opacity-45'
                }`}
                aria-disabled={!referenceAvailable}
              >
                <ImagePlus className="h-4 w-4" />
                {copy.assets.useAsReference}
              </Link>
            ) : (
              <button
                type="button"
                onClick={handleUseAsReference}
                disabled={!referenceAvailable || !onUseAsReference}
                className={secondaryActionClass}
              >
                <ImagePlus className="h-4 w-4" />
                {copy.assets.useAsReference}
              </button>
            )}
          </div>
        </footer>
      </aside>
    </div>
  );

  if (!portalHost) return null;
  return createPortal(overlay, document.body);
}
