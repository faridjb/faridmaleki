'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { useTheme } from 'next-themes';

import { cn } from '@/lib/utils';

interface ArchitectureDiagramProps {
  /** Raw Mermaid diagram source, already read via getDiagram(). */
  definition: string;
  className?: string;
}

/**
 * Client-only Mermaid renderer, isolated from the (server) case-study page so static
 * export still works — Mermaid touches the DOM directly and can't run during SSR/build.
 * Re-renders on theme change so a light/dark switch never leaves stale colors, and falls
 * back to a muted note instead of crashing the page if the diagram fails to parse.
 */
export function ArchitectureDiagram({ definition, className }: ArchitectureDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const diagramId = useId().replace(/[^a-zA-Z0-9]/g, '');
  const { resolvedTheme } = useTheme();
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    if (!definition) {
      setStatus('error');
      return;
    }

    let cancelled = false;
    setStatus('loading');

    async function render() {
      try {
        const { default: mermaid } = await import('mermaid');
        mermaid.initialize({
          startOnLoad: false,
          theme: resolvedTheme === 'light' ? 'default' : 'dark',
          fontFamily: 'var(--font-mono)',
          securityLevel: 'strict',
        });
        const { svg } = await mermaid.render(`architecture-${diagramId}`, definition);
        if (!cancelled && containerRef.current) {
          containerRef.current.innerHTML = svg;
          setStatus('ready');
        }
      } catch {
        if (!cancelled) setStatus('error');
      }
    }

    render();

    return () => {
      cancelled = true;
    };
  }, [definition, diagramId, resolvedTheme]);

  if (status === 'error') {
    return <p className="text-muted-foreground text-sm">Diagram unavailable.</p>;
  }

  return (
    <div
      ref={containerRef}
      role="img"
      aria-label="Architecture diagram"
      className={cn(
        'overflow-x-auto',
        status === 'loading' && 'text-muted-foreground text-sm',
        className
      )}
    >
      {status === 'loading' && 'Loading diagram…'}
    </div>
  );
}
