import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

interface CardProps {
  children?: ReactNode;
  className?: string;
  /** Renders as an <a>-wrapped-friendly div; pass asChild-style via a Link parent when needed. */
  hoverable?: boolean;
}

/**
 * bg-surface panel with a hairline border. When `hoverable`, lifts 2-4px and
 * the border shifts to the accent token with a soft glow — the shared visual
 * language for ProjectCard, timeline entries, and any other surface panel.
 */
export function Card({ children, className, hoverable = true }: CardProps) {
  return (
    <div
      className={cn(
        'border-border bg-card rounded-xl border p-6',
        hoverable &&
          'hover:border-accent transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-[0_0_24px_-6px_var(--accent)]',
        className
      )}
    >
      {children}
    </div>
  );
}
