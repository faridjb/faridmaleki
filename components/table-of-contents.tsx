import type { TocEntry } from '@/types/blog';
import { cn } from '@/lib/utils';

interface TableOfContentsProps {
  toc: TocEntry[];
}

/**
 * Renders nothing for short posts (fewer than 2 headings) — a TOC for one heading isn't
 * useful and would just be dead weight above the fold.
 */
export function TableOfContents({ toc }: TableOfContentsProps) {
  if (toc.length < 2) return null;

  return (
    <nav
      aria-label="Table of contents"
      className="border-border bg-card mb-10 rounded-xl border p-5"
    >
      <p className="text-accent mb-3 font-mono text-xs tracking-widest uppercase">On this page</p>
      <ul className="flex flex-col gap-2">
        {toc.map((entry) => (
          <li key={entry.slug} className={cn(entry.depth === 3 && 'pl-4')}>
            <a
              href={`#${entry.slug}`}
              className="text-muted-foreground hover:text-accent text-sm transition-colors"
            >
              {entry.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
