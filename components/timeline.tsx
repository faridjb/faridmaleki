import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

interface TimelineProps {
  children: ReactNode;
  className?: string;
}

/** Vertical rail wrapper — render TimelineItem children in the order they should appear (most-recent first). */
export function Timeline({ children, className }: TimelineProps) {
  return <ol className={cn('relative flex flex-col gap-10', className)}>{children}</ol>;
}

interface TimelineItemProps {
  children: ReactNode;
  className?: string;
  /** Hide the connecting rail below the last item. */
  isLast?: boolean;
}

export function TimelineItem({ children, className, isLast = false }: TimelineItemProps) {
  return (
    <li className={cn('relative pl-10', className)}>
      <span
        aria-hidden
        className="border-accent bg-background absolute top-1.5 left-2 size-3 -translate-x-1/2 rounded-full border-2"
      />
      {!isLast && (
        <span
          aria-hidden
          className="border-border absolute top-5 left-2 -translate-x-1/2 border-l"
          style={{ height: 'calc(100% - 0.5rem)' }}
        />
      )}
      {children}
    </li>
  );
}
