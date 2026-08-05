import { cn } from '@/lib/utils';

interface TechBadgeProps {
  children: string;
  className?: string;
}

/**
 * Small JetBrains Mono pill tinted with accent-alt. The background is a
 * translucent accent-alt tint (so it reads as "accent-alt colored") while the
 * label itself uses the readable foreground token — accent-alt at full
 * opacity fails AA for small text on the dark theme, so we never put it
 * directly behind or in front of body-sized copy.
 */
export function TechBadge({ children, className }: TechBadgeProps) {
  return (
    <span
      className={cn(
        'border-accent-alt/30 bg-accent-alt/10 text-foreground inline-flex items-center rounded-full border px-2.5 py-1 font-mono text-xs',
        className
      )}
    >
      {children}
    </span>
  );
}
