import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

interface SectionProps {
  eyebrow?: string;
  heading?: string;
  description?: string;
  children?: ReactNode;
  className?: string;
  /** Set false for sections that shouldn't render a <h2> (e.g. the hero, which owns the page's h1). */
  as?: 'h1' | 'h2' | 'h3';
}

/**
 * Shared section wrapper: eyebrow label + heading + optional description,
 * clamped to the site's content measure with consistent vertical rhythm.
 */
export function Section({
  eyebrow,
  heading,
  description,
  children,
  className,
  as = 'h2',
}: SectionProps) {
  const Heading = as;
  const isScrollSubject = Boolean(eyebrow || heading);
  return (
    <section
      className={cn('mx-auto w-full max-w-5xl px-6 py-24 sm:py-32', className)}
      data-scroll-section={isScrollSubject ? '' : undefined}
    >
      {(eyebrow || heading || description) && (
        <div className="mb-12 max-w-2xl">
          {eyebrow && (
            <p className="text-accent mb-3 font-mono text-xs tracking-widest uppercase">
              {eyebrow}
            </p>
          )}
          {heading && (
            <Heading className="text-foreground text-3xl font-semibold tracking-tight sm:text-4xl">
              {heading}
            </Heading>
          )}
          {description && <p className="text-muted-foreground mt-4 text-base">{description}</p>}
        </div>
      )}
      {children}
    </section>
  );
}
