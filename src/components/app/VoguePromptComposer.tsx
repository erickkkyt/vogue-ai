'use client';

import { getVogueCopyFromMessages, type VogueUICopy } from '@/i18n/vogue';
import {
  buildPromptRemixSegments,
  findPromptRemixVariableAtOffset,
  getInitialPromptRemixValues,
  replacePromptRemixVariableValue,
  type PromptRemixSchema,
  type PromptRemixValues,
} from '@/lib/prompt-remix';
import {
  Check,
  ChevronDown,
  Image as ImageIcon,
  Lock,
  Loader2,
  Settings2,
  Sparkles,
  X,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useMessages } from 'next-intl';
import type { CSSProperties } from 'react';
import {
  Fragment,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

export type VogueComposerModel = {
  id: string;
  name: string;
  description?: string;
  iconPath?: string | null;
};

export type VogueComposerReferenceItem = {
  id: string;
  url: string;
  name: string;
};

export type VogueComposerParameter = {
  id: string;
  label: string;
  value: string;
  options: readonly string[];
  onChange: (value: string) => void;
  formatLabel?: (value: string) => string;
  disabled?: boolean;
};

export type VogueComposerCredits = {
  available?: number | null;
  estimate?: number | null;
};

type VoguePromptComposerProps = {
  variant: 'gallery' | 'workspace';
  prompt: string;
  onPromptChange: (value: string) => void;
  promptCharacterCount: number;
  promptMaxChars: number;
  placeholder: string;
  models: readonly VogueComposerModel[];
  selectedModelId: string;
  onSelectedModelIdChange: (value: string) => void;
  referenceItems: VogueComposerReferenceItem[];
  maxReferenceImages: number;
  onAddReference?: () => void;
  onRemoveReference?: (id: string) => void;
  addReferenceLabel?: string;
  parameters?: VogueComposerParameter[];
  credits?: VogueComposerCredits;
  generateHref?: string;
  onGenerateNavigate?: () => void;
  onGenerate?: () => void;
  generateDisabled?: boolean;
  modelLocked?: boolean;
  lockedParameterSummary?: string;
  lockedParameterTitle?: string;
  generateMetaLabel?: string;
  isGenerating?: boolean;
  autoFocusPrompt?: boolean;
  promptFocusKey?: number;
  remixSchema?: PromptRemixSchema | null;
  remixValues?: PromptRemixValues;
  onRemixValuesChange?: (values: PromptRemixValues) => void;
  className?: string;
};

const cn = (...values: Array<string | false | null | undefined>) =>
  values.filter(Boolean).join(' ');

const formatValue = (
  parameter: VogueComposerParameter,
  value = parameter.value
) => parameter.formatLabel?.(value) ?? value;

const getModelDescription = (model: VogueComposerModel, copy: VogueUICopy) => {
  if (model.description) return model.description;
  return copy.composer.imageGenerationModel;
};

const getReferenceCounter = (
  referenceItems: VogueComposerReferenceItem[],
  maxReferenceImages: number,
  copy: VogueUICopy
) =>
  `${referenceItems.length} / ${Math.max(maxReferenceImages, 0)} ${
    copy.composer.references
  }`;

const getGenerateCreditsLabel = (
  credits: VogueComposerCredits | undefined,
  copy: VogueUICopy
) => {
  if (!credits) return null;
  if (credits.estimate !== null && credits.estimate !== undefined) {
    return {
      value: String(Math.ceil(credits.estimate)),
      unit: copy.composer.creditsUnit,
    };
  }
  return {
    value:
      credits.available === null || credits.available === undefined
        ? '--'
        : String(credits.available),
    unit: copy.composer.creditsUnit,
  };
};

function useDismissibleComposerMenu(
  open: boolean,
  setOpen: (open: boolean) => void
) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target;

      if (!(target instanceof Node)) {
        setOpen(false);
        return;
      }

      if (rootRef.current && rootRef.current.contains(target)) return;
      setOpen(false);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown, true);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown, true);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, setOpen]);

  return rootRef;
}

function VogueModelIcon({
  model,
}: {
  model?: VogueComposerModel;
}) {
  const iconSizeClassName = 'h-5 w-5';

  if (model?.iconPath) {
    return (
      <Image
        src={model.iconPath}
        alt=""
        width={20}
        height={20}
        className={`${iconSizeClassName} object-contain`}
      />
    );
  }

  return <Sparkles className={iconSizeClassName} />;
}

const selectedOptionStyle: CSSProperties = {
  background: '#111827',
  borderColor: '#111827',
  color: '#ffffff',
  boxShadow: '0 10px 22px rgba(17, 24, 39, 0.16)',
};

const optionStyle: CSSProperties = {
  background: '#ffffff',
  borderColor: '#dbe3ef',
  color: '#334155',
};

function VogueCreditsDisplay({
  credits,
  copy,
}: {
  credits?: VogueComposerCredits;
  copy: VogueUICopy;
}) {
  if (!credits) return null;

  return (
    <div className="hidden min-w-0 items-center gap-2 text-[11px] font-semibold text-slate-500 lg:flex">
      <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1">
        {copy.composer.credits}{' '}
        {credits.available === null || credits.available === undefined ? '--' : credits.available}
      </span>
      <span className="rounded-full border border-[#dfe6ff] bg-[#f0f4ff] px-2.5 py-1 text-[#4f67ff]">
        {copy.composer.estimate}{' '}
        {credits.estimate === null || credits.estimate === undefined ? '--' : Math.ceil(credits.estimate)}
      </span>
    </div>
  );
}

function VogueModelSelect({
  models,
  selectedModelId,
  onSelectedModelIdChange,
  locked = false,
  lockedTitle,
  copy,
}: {
  models: readonly VogueComposerModel[];
  selectedModelId: string;
  onSelectedModelIdChange: (value: string) => void;
  locked?: boolean;
  lockedTitle?: string;
  copy: VogueUICopy;
}) {
  const [open, setOpen] = useState(false);
  const selectedModel =
    models.find((model) => model.id === selectedModelId) ?? models[0];
  const rootRef = useDismissibleComposerMenu(open, setOpen);

  return (
    <div ref={rootRef} className="relative min-w-0 md:w-auto">
      <button
        type="button"
        aria-label={copy.composer.selectModel}
        disabled={models.length === 0 || locked}
        onClick={() => {
          if (locked) return;
          setOpen((current) => !current);
        }}
        title={locked ? lockedTitle : undefined}
        className={cn(
          'vogue-composer-control flex h-11 w-full max-w-full items-center gap-2 rounded-[18px] border border-[rgba(118,92,70,0.14)] bg-white/78 px-3.5 text-[14px] font-medium tracking-normal text-slate-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.78),0_8px_22px_rgba(112,90,76,0.08)] backdrop-blur-xl transition-all duration-200 hover:border-[rgba(97,91,255,0.28)] hover:bg-white/92 hover:shadow-[0_12px_28px_rgba(112,90,76,0.12)] disabled:cursor-not-allowed disabled:opacity-50 md:h-10 md:w-auto md:min-w-[170px]',
          locked &&
            'border-[rgba(97,91,255,0.18)] bg-[rgba(244,247,255,0.82)] text-slate-700 opacity-100'
        )}
      >
        <span className="flex h-5 w-5 shrink-0 items-center justify-center text-slate-950">
          <VogueModelIcon model={selectedModel} />
        </span>
        <span className="truncate">
          {selectedModel?.name ?? copy.composer.selectModel}
        </span>
        {locked ? (
          <Lock className="h-3.5 w-3.5 shrink-0 text-[#4f67ff]" />
        ) : (
          <ChevronDown
            className={cn(
              'h-4 w-4 shrink-0 text-slate-500 transition',
              open && 'rotate-180'
            )}
          />
        )}
      </button>
      {open && !locked ? (
        <div
          className="vogue-model-menu absolute left-0 z-50 w-[min(86vw,332px)] overflow-hidden rounded-[22px] border border-[rgba(118,92,70,0.14)] bg-white/92 p-2.5 text-slate-900 shadow-[0_24px_70px_rgba(112,90,76,0.18)] ring-1 ring-white/70 backdrop-blur-2xl"
          style={{ bottom: 'calc(100% + 10px)' }}
        >
          {models.map((model) => {
            const active = model.id === selectedModelId;
            return (
              <button
                key={model.id}
                type="button"
                onClick={() => {
                  onSelectedModelIdChange(model.id);
                  setOpen(false);
                }}
                aria-current={active ? 'true' : undefined}
                className={cn(
                  'vogue-model-option flex w-full items-center gap-3 rounded-[18px] border px-3 py-2.5 text-left text-[14px] transition-all duration-200',
                  active
                    ? 'border-[rgba(97,91,255,0.26)] bg-[rgba(246,248,255,0.9)] text-slate-950 shadow-[0_12px_30px_rgba(97,91,255,0.1)]'
                    : 'border-transparent text-slate-700 hover:border-[rgba(118,92,70,0.12)] hover:bg-white/78'
                )}
              >
                <span
                  className={cn(
                    'flex h-5 w-5 shrink-0 items-center justify-center',
                    active ? 'text-[#4f67ff]' : 'text-slate-950'
                  )}
                >
                  <VogueModelIcon model={model} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[14px] font-semibold">
                    {model.name}
                  </span>
                  <span className="mt-0.5 block truncate text-[12px] text-slate-500">
                    {getModelDescription(model, copy)}
                  </span>
                </span>
                <span
                  className={cn(
                    'flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition',
                    active
                      ? 'bg-white text-[#4f67ff] shadow-[0_6px_16px_rgba(97,91,255,0.16)]'
                      : 'text-transparent'
                  )}
                  aria-hidden="true"
                >
                  {active ? <Check className="h-4 w-4" /> : null}
                </span>
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

function VogueParameterPopover({
  parameters = [],
  copy,
}: {
  parameters?: VogueComposerParameter[];
  copy: VogueUICopy;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useDismissibleComposerMenu(open, setOpen);
  const activeParameters = parameters.filter(
    (parameter) => parameter.options.length > 0 && !parameter.disabled
  );
  const summaryTokens = activeParameters
    .map((parameter) => formatValue(parameter))
    .filter(Boolean);

  if (activeParameters.length === 0) return null;

  return (
    <div ref={rootRef} className="relative min-w-0 md:w-auto">
      <button
        type="button"
        aria-label={copy.composer.parameters}
        onClick={() => setOpen((current) => !current)}
        className="vogue-composer-control relative flex h-11 w-full max-w-full items-center gap-3 rounded-[18px] border border-[rgba(118,92,70,0.14)] bg-white/78 px-3.5 pr-10 text-[14px] font-medium tracking-normal text-slate-800 shadow-[inset_0_1px_0_rgba(255,255,255,0.78),0_8px_22px_rgba(112,90,76,0.08)] backdrop-blur-xl transition-all duration-200 hover:border-[rgba(97,91,255,0.28)] hover:bg-white/92 hover:shadow-[0_12px_28px_rgba(112,90,76,0.12)] md:h-10 md:w-fit md:min-w-[228px] md:max-w-[320px]"
      >
        <Settings2 className="h-4 w-4 shrink-0 text-[#4f67ff]" />
        <span className="flex min-w-0 flex-1 items-center justify-center gap-2.5 overflow-hidden whitespace-nowrap">
          {summaryTokens.length > 0 ? (
            summaryTokens.map((token, index) => (
              <span key={`${token}-${index}`} className="contents">
                {index > 0 ? (
                  <span className="shrink-0 text-slate-400">|</span>
                ) : null}
                <span
                  className={
                    index === summaryTokens.length - 1
                      ? 'truncate'
                      : 'shrink-0'
                  }
                >
                  {token}
                </span>
              </span>
            ))
          ) : (
            <span className="truncate">{copy.composer.parameters}</span>
          )}
        </span>
        <ChevronDown
          className={cn(
            'pointer-events-none absolute right-3.5 h-4 w-4 shrink-0 text-slate-500 transition',
            open && 'rotate-180'
          )}
        />
      </button>
      {open ? (
        <div
          className="vogue-parameter-menu absolute left-0 z-50 w-[min(86vw,330px)] rounded-[20px] border border-[rgba(118,92,70,0.14)] bg-white/94 p-3 text-slate-900 shadow-[0_24px_70px_rgba(112,90,76,0.18)] ring-1 ring-white/70 backdrop-blur-2xl md:left-auto md:right-0"
          style={{ bottom: 'calc(100% + 10px)' }}
        >
          <div className="space-y-4">
            {activeParameters.map((parameter) => (
              <section key={parameter.id} className="space-y-2">
                <p className="text-[12px] font-medium text-slate-500">
                  {parameter.label}
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {parameter.options.map((option) => {
                    const active = option === parameter.value;
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => parameter.onChange(option)}
                        className={cn(
                          'min-h-8 rounded-lg border px-2 text-[13px] font-medium transition-all duration-200',
                          active
                            ? 'border-slate-950 bg-slate-950 font-semibold text-white shadow-[0_10px_22px_rgba(17,24,39,0.16)]'
                            : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                        )}
                        style={active ? selectedOptionStyle : optionStyle}
                      >
                        {formatValue(parameter, option)}
                      </button>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function VogueLockedParameterSummary({
  summary,
  title,
}: {
  summary?: string;
  title?: string;
}) {
  if (!summary) return null;

  return (
    <button
      type="button"
      disabled
      title={title}
      className="vogue-composer-control relative flex h-11 w-full max-w-full cursor-not-allowed items-center gap-3 rounded-[18px] border border-[rgba(97,91,255,0.18)] bg-[rgba(244,247,255,0.82)] px-3.5 text-[14px] font-medium tracking-normal text-slate-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.78),0_8px_22px_rgba(112,90,76,0.08)] backdrop-blur-xl md:h-10 md:w-fit md:min-w-[228px] md:max-w-[320px]"
    >
      <Settings2 className="h-4 w-4 shrink-0 text-[#4f67ff]" />
      <span className="truncate">{summary}</span>
      <Lock className="h-3.5 w-3.5 shrink-0 text-[#4f67ff]" />
    </button>
  );
}

function VogueReferenceStrip({
  referenceItems,
  maxReferenceImages,
  onAddReference,
  onRemoveReference,
  addReferenceLabel,
  copy,
}: {
  referenceItems: VogueComposerReferenceItem[];
  maxReferenceImages: number;
  onAddReference?: () => void;
  onRemoveReference?: (id: string) => void;
  addReferenceLabel?: string;
  copy: VogueUICopy;
}) {
  const canAdd =
    referenceItems.length < maxReferenceImages && Boolean(onAddReference);
  const [trayOpen, setTrayOpen] = useState(false);
  const trayCloseTimerRef = useRef<number | null>(null);
  const hasReferences = referenceItems.length > 0;
  const previewItems = referenceItems.slice(-3);
  const resolvedAddReferenceLabel = addReferenceLabel ?? copy.app.addReference;
  const referenceCounter = getReferenceCounter(
    referenceItems,
    maxReferenceImages,
    copy
  );
  const referenceButtonLabel = canAdd
    ? resolvedAddReferenceLabel
    : referenceCounter;
  const shouldRenderReferenceTray = hasReferences;
  const clearTrayCloseTimer = () => {
    if (trayCloseTimerRef.current === null) return;
    window.clearTimeout(trayCloseTimerRef.current);
    trayCloseTimerRef.current = null;
  };
  const openReferenceTray = () => {
    clearTrayCloseTimer();
    setTrayOpen(true);
  };
  const closeReferenceTraySoon = () => {
    clearTrayCloseTimer();
    trayCloseTimerRef.current = window.setTimeout(() => {
      setTrayOpen(false);
      trayCloseTimerRef.current = null;
    }, 220);
  };

  useEffect(
    () => () => {
      if (trayCloseTimerRef.current !== null) {
        window.clearTimeout(trayCloseTimerRef.current);
      }
    },
    []
  );

  return (
    <div
      className="vogue-reference-well group/reference-images relative aspect-square h-[84px] w-[84px] shrink-0 sm:h-[104px] sm:w-[104px]"
      onMouseEnter={openReferenceTray}
      onMouseLeave={closeReferenceTraySoon}
      onFocusCapture={openReferenceTray}
      onBlurCapture={(event) => {
        const nextTarget = event.relatedTarget;
        if (nextTarget instanceof Node && event.currentTarget.contains(nextTarget)) {
          return;
        }
        closeReferenceTraySoon();
      }}
    >
      {shouldRenderReferenceTray ? (
        <div
          className={cn(
            'pointer-events-none absolute bottom-full left-0 z-50 max-w-[min(78vw,448px)] translate-y-2 pb-2 opacity-0 transition-all duration-200 group-hover/reference-images:pointer-events-auto group-hover/reference-images:translate-y-0 group-hover/reference-images:opacity-100 group-focus-within/reference-images:pointer-events-auto group-focus-within/reference-images:translate-y-0 group-focus-within/reference-images:opacity-100',
            trayOpen && 'pointer-events-auto translate-y-0 opacity-100'
          )}
          onMouseEnter={openReferenceTray}
        >
          <div className="min-w-[176px] max-w-full rounded-[18px] border border-[rgba(118,92,70,0.14)] bg-white/92 p-2 shadow-[0_18px_54px_rgba(112,90,76,0.16)] backdrop-blur-xl">
            <div className="mb-2 px-1">
              <span className="text-[11px] font-semibold leading-none tracking-normal text-slate-500">
                {referenceCounter}
              </span>
            </div>
            <div className="flex max-w-full items-center gap-2 overflow-x-auto">
              {hasReferences ? (
                referenceItems.map((item) => (
                  <div
                    key={item.id}
                    className="group/thumb relative flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-100"
                    title={item.name}
                  >
                    {/* Reference previews can be local blob URLs before upload. */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.url}
                      alt={item.name}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                    {onRemoveReference ? (
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          onRemoveReference(item.id);
                        }}
                        className="absolute right-0.5 top-0.5 z-20 inline-flex size-7 items-center justify-center rounded-full bg-white/92 text-slate-700 opacity-95 shadow-[0_6px_16px_rgba(15,23,42,0.18)] transition hover:text-slate-950 hover:opacity-100"
                        title={copy.composer.removeReference}
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    ) : null}
                  </div>
                ))
              ) : null}
              {hasReferences && canAdd ? (
                <button
                  type="button"
                  onClick={onAddReference}
                  className="flex size-14 min-h-[44px] shrink-0 items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 text-[24px] font-light leading-none text-slate-500 transition hover:border-slate-500 hover:text-slate-950"
                  title={resolvedAddReferenceLabel}
                >
                  +
                </button>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
      <button
        type="button"
        aria-label={referenceCounter}
        title={referenceButtonLabel}
        onClick={
          canAdd
            ? onAddReference
            : () => {
                if (hasReferences) setTrayOpen((current) => !current);
              }
        }
        aria-expanded={hasReferences ? trayOpen : undefined}
        disabled={!canAdd && !hasReferences}
        className={cn(
          'relative flex size-full shrink-0 items-center justify-center overflow-hidden rounded-[18px] border border-dashed bg-white/58 text-slate-500 shadow-[inset_0_1px_0_rgba(255,255,255,0.82),0_14px_34px_rgba(112,90,76,0.12)] backdrop-blur-xl transition-all duration-200',
          canAdd
            ? 'border-[rgba(118,92,70,0.18)] hover:border-[rgba(97,91,255,0.34)] hover:bg-white/78 hover:text-slate-700'
            : 'border-[rgba(118,92,70,0.12)]',
          hasReferences &&
            'border-solid border-[rgba(97,91,255,0.18)] bg-white/78 text-white hover:border-[rgba(97,91,255,0.42)]'
        )}
      >
        {hasReferences ? (
          <div className="absolute inset-2.5">
            {previewItems.map((item, index) => {
              const offsetIndex = previewItems.length - 1 - index;
              return (
                <Fragment key={item.id}>
                  {/* Reference previews can be local blob URLs before upload. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.url}
                    alt={item.name}
                    className="absolute inset-0 h-full w-full rounded-xl border border-white/30 object-cover shadow-[0_9px_22px_rgba(72,92,130,0.24)]"
                    loading="lazy"
                    style={{
                      transform: `translate(${offsetIndex * -4}px, ${offsetIndex * -3}px) rotate(${offsetIndex === 0 ? 0 : -5 + index * 4}deg)`,
                      zIndex: index + 1,
                    }}
                  />
                </Fragment>
              );
            })}
            <div className="absolute inset-0 z-10 rounded-xl bg-[linear-gradient(180deg,rgba(255,255,255,0),rgba(15,23,42,0.24))]" />
          </div>
        ) : canAdd ? (
          <span className="text-[30px] font-light leading-none">+</span>
        ) : (
          <ImageIcon className="h-4 w-4" />
        )}
        {hasReferences && canAdd ? (
          <span className="absolute right-1.5 top-1.5 z-20 inline-flex size-5 items-center justify-center rounded-full border border-white/70 bg-white/82 text-[15px] font-light leading-none text-slate-800 shadow-[0_6px_18px_rgba(72,92,130,0.18)]">
            +
          </span>
        ) : null}
      </button>
    </div>
  );
}

export function VoguePromptComposer({
  variant,
  prompt,
  onPromptChange,
  placeholder,
  models,
  selectedModelId,
  onSelectedModelIdChange,
  referenceItems,
  maxReferenceImages,
  onAddReference,
  onRemoveReference,
  addReferenceLabel,
  parameters,
  credits,
  generateHref,
  onGenerateNavigate,
  onGenerate,
  generateDisabled,
  modelLocked = false,
  lockedParameterSummary,
  lockedParameterTitle,
  generateMetaLabel,
  isGenerating = false,
  autoFocusPrompt = false,
  promptFocusKey = 0,
  remixSchema = null,
  remixValues,
  onRemixValuesChange,
  className,
}: VoguePromptComposerProps) {
  const messages = useMessages();
  const copy = getVogueCopyFromMessages(messages);
  const promptRef = useRef<HTMLTextAreaElement>(null);
  const [activeRemixVariableKey, setActiveRemixVariableKey] = useState<
    string | null
  >(null);
  const [customRemixValue, setCustomRemixValue] = useState('');
  const [promptScrollTop, setPromptScrollTop] = useState(0);
  const isDisabled =
    Boolean(generateDisabled) || isGenerating || prompt.trim().length === 0;
  const generateLabel = isGenerating
    ? copy.composer.generating
    : copy.composer.generate;
  const idleGenerateLabel = copy.composer.generate;
  const busyGenerateLabel = copy.composer.generating;
  const generateCreditsLabel = getGenerateCreditsLabel(credits, copy);
  const parameterCount = parameters?.length ?? 0;
  const panelClassName = useMemo(
    () =>
      cn(
        'vogue-composer-dock relative w-full overflow-visible rounded-[28px] border border-white/70 bg-white/72 px-3.5 pb-3 pt-3 shadow-[0_30px_90px_rgba(112,90,76,0.18)] ring-1 ring-[rgba(118,92,70,0.08)] backdrop-blur-[22px] transition-all duration-300 sm:rounded-[32px] sm:px-4 sm:pb-3.5 sm:pt-3.5 lg:px-5 lg:py-4',
        className
      ),
    [className]
  );
  const panelStyle: CSSProperties = {
    background:
      'linear-gradient(135deg, rgba(255, 255, 255, 0.88), rgba(250, 244, 239, 0.78) 48%, rgba(238, 243, 255, 0.68)), linear-gradient(180deg, rgba(255, 255, 255, 0.92), rgba(246, 241, 236, 0.64))',
    boxShadow:
      '0 30px 90px rgba(112, 90, 76, 0.18), 0 1px 0 rgba(255, 255, 255, 0.92) inset',
    backdropFilter: 'blur(22px) saturate(1.08)',
    WebkitBackdropFilter: 'blur(22px) saturate(1.08)',
  };
  const baseGenerateControlStyle: CSSProperties = {
    minWidth: 220,
  };
  const generateControlStyle = baseGenerateControlStyle;
  const resolvedRemixValues = useMemo(
    () =>
      remixSchema
        ? {
            ...getInitialPromptRemixValues(remixSchema),
            ...(remixValues ?? {}),
          }
        : {},
    [remixSchema, remixValues]
  );
  const remixEnabled = Boolean(
    remixSchema?.variables.length && prompt.trim().length > 0
  );
  const promptRemixSegments = useMemo(
    () =>
      remixEnabled
        ? buildPromptRemixSegments(prompt, remixSchema, resolvedRemixValues)
        : [],
    [prompt, remixEnabled, remixSchema, resolvedRemixValues]
  );
  const activeRemixVariable = useMemo(
    () =>
      remixSchema?.variables.find(
        (variable) => variable.key === activeRemixVariableKey
      ) ?? null,
    [activeRemixVariableKey, remixSchema]
  );
  const openVariableAtCursor = () => {
    const textarea = promptRef.current;
    if (!textarea || !remixEnabled) {
      setActiveRemixVariableKey(null);
      return;
    }

    const activeVariable = findPromptRemixVariableAtOffset(
      prompt,
      remixSchema,
      resolvedRemixValues,
      textarea.selectionStart
    );

    if (!activeVariable) {
      setActiveRemixVariableKey(null);
      return;
    }

    setActiveRemixVariableKey(activeVariable.key);
    setCustomRemixValue(activeVariable.text);
  };
  const syncPromptScroll = () => {
    setPromptScrollTop(promptRef.current?.scrollTop ?? 0);
  };
  const updateComposerRemixVariable = (key: string, value: string) => {
    if (!remixSchema) return;

    const replacement = replacePromptRemixVariableValue(
      prompt,
      remixSchema,
      resolvedRemixValues,
      key,
      value
    );

    onPromptChange(replacement.prompt);
    onRemixValuesChange?.(replacement.values);
    setActiveRemixVariableKey(null);
    setCustomRemixValue('');
  };
  const applyCustomRemixValue = () => {
    if (!activeRemixVariable) return;

    updateComposerRemixVariable(
      activeRemixVariable.key,
      customRemixValue.trim() || activeRemixVariable.defaultValue
    );
  };
  const handlePromptInputChange = (value: string) => {
    onPromptChange(value);
    setActiveRemixVariableKey(null);
  };

  useEffect(() => {
    if (!autoFocusPrompt) return;

    const textarea = promptRef.current;
    if (!textarea) return;

    textarea.focus({ preventScroll: true });
    const cursorPosition = textarea.value.length;
    textarea.setSelectionRange(cursorPosition, cursorPosition);
  }, [autoFocusPrompt, promptFocusKey]);

  const generateButton = (
    <button
      type="button"
      onClick={onGenerate}
      disabled={isDisabled || Boolean(generateHref)}
      style={generateControlStyle}
      data-submitting={isGenerating ? 'true' : 'false'}
      className={cn(
        'home-generate-button relative inline-flex h-11 w-full max-w-none items-center justify-center gap-3 rounded-2xl px-4 md:h-[42px] md:w-auto md:rounded-[1.1rem]',
        isDisabled && 'cursor-not-allowed opacity-85 hover:shadow-none'
      )}
    >
      <span aria-hidden="true" className="home-generate-button__text">
        {isGenerating ? busyGenerateLabel : idleGenerateLabel}
      </span>
      {generateMetaLabel || generateCreditsLabel ? (
        <span
          aria-hidden="true"
          className="home-generate-button__credits relative z-[1] inline-flex shrink-0 items-center gap-1.5"
        >
          {isGenerating ? (
            <Loader2 className="home-generate-button__credits-icon size-3.5 animate-spin" />
          ) : (
            <Sparkles className="home-generate-button__credits-icon size-3.5" />
          )}
          {generateMetaLabel ? (
            <span>{generateMetaLabel}</span>
          ) : generateCreditsLabel ? (
            <>
              <span>{generateCreditsLabel.value}</span>
              <span className="home-generate-button__credits-unit">
                {generateCreditsLabel.unit}
              </span>
            </>
          ) : null}
        </span>
      ) : null}
      <span className="sr-only">{generateLabel}</span>
    </button>
  );

  return (
    <div className={panelClassName} style={panelStyle}>
      <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/95 to-transparent" />
      <div className="pointer-events-none absolute inset-x-8 bottom-0 h-px bg-gradient-to-r from-transparent via-[rgba(118,92,70,0.14)] to-transparent" />
      <div className="flex flex-col gap-3.5 sm:flex-row sm:items-stretch sm:gap-4">
        <VogueReferenceStrip
          referenceItems={referenceItems}
          maxReferenceImages={maxReferenceImages}
          onAddReference={onAddReference}
          onRemoveReference={onRemoveReference}
          addReferenceLabel={addReferenceLabel}
          copy={copy}
        />
        <div
          suppressHydrationWarning
          className="relative min-w-0 flex-1 px-0.5 pt-0 sm:px-1"
        >
          {remixEnabled ? (
            <div
              aria-hidden="true"
              className="vogue-composer-highlight-layer pointer-events-none absolute inset-x-0 top-0 z-0 h-[94px] overflow-hidden px-0 py-0 pr-0 text-[14px] font-normal leading-[1.62] tracking-normal text-slate-900 sm:h-[104px] md:h-[112px] md:text-[14px] md:leading-[1.62]"
            >
              <div
                className="whitespace-pre-wrap break-words"
                style={{
                  transform: `translateY(-${promptScrollTop}px)`,
                }}
              >
                {promptRemixSegments.map((segment, index) => {
                  if (segment.type === 'variable') {
                    const isActive = activeRemixVariableKey === segment.key;

                    return (
                      <span
                        key={`${segment.key}-${index}`}
                        className={cn(
                          'vogue-composer-remix-token mx-[1px] inline rounded-full border px-1.5 py-[1px] text-[13px] font-semibold leading-[1.32] align-baseline text-[#164b56] box-decoration-clone',
                          isActive
                            ? 'border-[#3196a4] bg-[#c5edf1]'
                            : 'border-[#68bdc8] bg-[#d8f3f5]'
                        )}
                      >
                        {segment.text}
                      </span>
                    );
                  }

                  if (segment.type === 'keep') {
                    return (
                      <span key={`keep-${index}`}>{segment.text}</span>
                    );
                  }

                  return <span key={`text-${index}`}>{segment.text}</span>;
                })}
              </div>
            </div>
          ) : null}
          <textarea
            ref={promptRef}
            value={prompt}
            onChange={(event) => handlePromptInputChange(event.target.value)}
            onClick={openVariableAtCursor}
            onKeyUp={openVariableAtCursor}
            onSelect={openVariableAtCursor}
            onScroll={syncPromptScroll}
            onKeyDown={(event) => {
              if (event.key === 'Escape') {
                setActiveRemixVariableKey(null);
              }
            }}
            placeholder={placeholder}
            className={cn(
              'vogue-prompt-field relative z-10 h-[94px] w-full resize-none overflow-y-auto [field-sizing:fixed] border-0 !bg-transparent !shadow-none px-0 py-0 pr-0 text-[14px] font-normal leading-[1.62] tracking-normal text-slate-900 outline-none placeholder:text-[14px] placeholder:font-normal placeholder:tracking-normal placeholder:text-slate-400/80 transition-none focus:border-0 focus:!bg-transparent focus:shadow-none focus:outline-none focus-visible:!border-transparent focus-visible:!ring-0 sm:h-[104px] md:h-[112px] md:text-[14px] md:leading-[1.62]',
              remixEnabled &&
                'text-transparent caret-slate-950 selection:bg-[#a8eee6]/55'
            )}
          />
          {remixEnabled && activeRemixVariable ? (
            <div className="vogue-composer-variable-card absolute bottom-full z-40 mb-2 left-0 w-[min(720px,100%)] max-w-[calc(100vw-2rem)] max-h-[min(38vh,260px)] overflow-y-auto rounded-[18px] border border-[rgba(104,189,200,0.38)] bg-white/96 p-3 shadow-[0_18px_46px_rgba(72,92,130,0.16)] ring-1 ring-white/80 backdrop-blur-xl">
              <div className="mb-2 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-[12px] font-semibold leading-none text-[#164b56]">
                    Swap {activeRemixVariable.label}
                  </div>
                  <div className="mt-1 text-[11px] font-medium leading-none text-slate-400">
                    Keep the look. Change this part.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveRemixVariableKey(null)}
                  className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-950 hover:text-white"
                  title="Close"
                >
                  <X className="h-3.5 w-3.5" />
                  <span className="sr-only">Close</span>
                </button>
              </div>
              <div className="mb-3 flex flex-wrap gap-1.5">
                {activeRemixVariable.suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() =>
                      updateComposerRemixVariable(
                        activeRemixVariable.key,
                        suggestion
                      )
                    }
                    className="rounded-full border border-[#a9d7dd] bg-[#eefafb] px-2.5 py-1 text-[11px] font-semibold text-[#245966] transition hover:border-[#3196a4] hover:bg-[#d8f3f5] hover:text-[#164b56]"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-2">
                <input
                  value={customRemixValue}
                  onChange={(event) => setCustomRemixValue(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      applyCustomRemixValue();
                    }

                    if (event.key === 'Escape') {
                      setActiveRemixVariableKey(null);
                    }
                  }}
                  className="h-9 min-w-0 rounded-[12px] border border-slate-200 bg-[#fbfdff] px-3 text-[13px] font-medium text-slate-800 outline-none transition focus:border-[#68bdc8] focus:ring-2 focus:ring-[#d8f3f5]"
                  aria-label={`Swap ${activeRemixVariable.label}`}
                />
                <button
                  type="button"
                  onClick={applyCustomRemixValue}
                  className="h-9 rounded-[12px] bg-slate-950 px-3 text-[12px] font-semibold text-white transition hover:bg-[#164b56]"
                >
                  Apply
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <div className="mt-3 flex min-h-[48px] flex-col gap-2.5 md:flex-row md:items-center md:justify-between md:gap-3 md:pb-0.5 lg:gap-4">
        <div
          className={cn(
            'grid w-full min-w-0 grid-cols-1 gap-2.5 md:flex md:w-auto md:flex-1 md:flex-nowrap md:items-center',
            parameterCount > 0 ? 'md:gap-3' : 'md:gap-2.5'
          )}
        >
          <VogueModelSelect
            models={models}
            selectedModelId={selectedModelId}
            onSelectedModelIdChange={onSelectedModelIdChange}
            locked={modelLocked}
            lockedTitle={lockedParameterTitle}
            copy={copy}
          />
          {modelLocked && lockedParameterSummary ? (
            <VogueLockedParameterSummary
              summary={lockedParameterSummary}
              title={lockedParameterTitle}
            />
          ) : (
            <VogueParameterPopover parameters={parameters} copy={copy} />
          )}
        </div>

        <div className="flex w-full flex-col items-center gap-2 md:ml-auto md:w-auto md:items-end">
          {generateHref ? (
            <Link
              href={isDisabled ? '#' : generateHref}
              onClick={(event) => {
                if (isDisabled) {
                  event.preventDefault();
                  return;
                }

                onGenerateNavigate?.();
              }}
              aria-disabled={isDisabled}
              style={generateControlStyle}
              data-submitting="false"
              className={cn(
                'home-generate-button relative inline-flex h-11 w-full max-w-none items-center justify-center gap-3 rounded-2xl px-4 md:h-[42px] md:w-auto md:rounded-[1.1rem]',
                isDisabled && 'pointer-events-none cursor-not-allowed opacity-85 hover:shadow-none'
              )}
            >
              <span aria-hidden="true" className="home-generate-button__text">
                {idleGenerateLabel}
              </span>
              {generateMetaLabel || generateCreditsLabel ? (
                <span
                  aria-hidden="true"
                  className="home-generate-button__credits relative z-[1] inline-flex shrink-0 items-center gap-1.5"
                >
                  <Sparkles className="home-generate-button__credits-icon size-3.5" />
                  {generateMetaLabel ? (
                    <span>{generateMetaLabel}</span>
                  ) : generateCreditsLabel ? (
                    <>
                      <span>{generateCreditsLabel.value}</span>
                      <span className="home-generate-button__credits-unit">
                        {generateCreditsLabel.unit}
                      </span>
                    </>
                  ) : null}
                </span>
              ) : null}
            </Link>
          ) : (
            generateButton
          )}
        </div>
      </div>

    </div>
  );
}
