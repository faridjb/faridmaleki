import type { ReactNode } from 'react';

import { getCompanyNamePattern, getCompanyUrl } from '@/lib/company-links';
import { cn } from '@/lib/utils';

/**
 * Matches a percentage figure (with optional leading "~"/"+" and trailing "+", e.g.
 * "~80%+", "+33%") or a time/quantity transformation joining two values with an arrow
 * or the word "to" (e.g. "6 weeks → 30 minutes", "6 weeks to 30 minutes").
 */
const EMPHASIS_PATTERN =
  /([~+]?\d+(?:\.\d+)?%\+?|\d+\s*(?:weeks?|days?|hours?|hrs?|minutes?|mins?|seconds?|secs?)\s*(?:→|->|to)\s*\d+\s*(?:weeks?|days?|hours?|hrs?|minutes?|mins?|seconds?|secs?))/gi;

interface EmphasizedTextProps {
  text: string;
  className?: string;
}

function withCompanyLinks(text: string): ReactNode[] {
  const pattern = getCompanyNamePattern();
  const parts = text.split(pattern);
  return parts.map((part, index) => {
    const href = getCompanyUrl(part);
    if (!href) return <span key={`${part}-${index}`}>{part}</span>;
    return (
      <a
        key={`${part}-${index}`}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-foreground hover:text-accent font-medium underline-offset-4 hover:underline"
      >
        {part}
      </a>
    );
  });
}

/**
 * Renders free text with measured outcomes emphasized and employer names linked
 * to their websites when configured.
 */
export function EmphasizedText({ text, className }: EmphasizedTextProps) {
  const parts = text.split(EMPHASIS_PATTERN);
  return (
    <span className={cn(className)}>
      {parts.map((part, index) =>
        index % 2 === 1 ? (
          <span key={index} className="text-success font-medium">
            {part}
          </span>
        ) : (
          <span key={index}>{withCompanyLinks(part)}</span>
        )
      )}
    </span>
  );
}
