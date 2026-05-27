import { cn } from '@/lib/utils';
import Image from 'next/image';

type VogueBrandMarkProps = {
  alt?: string;
  className?: string;
  priority?: boolean;
};

type VogueBrandWordProps = {
  className?: string;
  text?: string;
};

type VogueBrandLockupProps = {
  className?: string;
  markClassName?: string;
  orientation?: 'horizontal' | 'vertical';
  priority?: boolean;
  tagline?: string;
  taglineClassName?: string;
  text?: string;
  wordClassName?: string;
};

export function VogueBrandMark({
  alt = 'Vogue AI Logo',
  className,
  priority = false,
}: VogueBrandMarkProps) {
  return (
    <Image
      src="/logo/logo.png"
      alt={alt}
      width={56}
      height={56}
      className={cn('shrink-0 object-contain', className)}
      priority={priority}
    />
  );
}

export function VogueBrandWord({ className, text = 'Vogue AI' }: VogueBrandWordProps) {
  return (
    <span
      className={cn(
        'vogue-brand-word inline-block shrink-0 whitespace-nowrap tracking-normal',
        className
      )}
    >
      {text}
    </span>
  );
}

export function VogueBrandLockup({
  className,
  markClassName,
  orientation = 'horizontal',
  priority = false,
  tagline,
  taglineClassName,
  text,
  wordClassName,
}: VogueBrandLockupProps) {
  const vertical = orientation === 'vertical';

  return (
    <span
      className={cn(
        'inline-flex items-center',
        vertical ? 'flex-col' : 'flex-row',
        className
      )}
    >
      <VogueBrandMark className={markClassName} priority={priority} />
      <span className={cn(vertical ? 'text-center' : 'min-w-0')}>
        <VogueBrandWord className={wordClassName} text={text} />
        {tagline ? (
          <span
            className={cn(
              'block text-[11px] font-medium uppercase tracking-[0.22em] text-slate-500',
              taglineClassName
            )}
          >
            {tagline}
          </span>
        ) : null}
      </span>
    </span>
  );
}
