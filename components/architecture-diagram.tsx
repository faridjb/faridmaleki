'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { useTheme } from 'next-themes';

import { cn } from '@/lib/utils';

interface ArchitectureDiagramProps {
  /** Raw Mermaid diagram source, already read via getDiagram(). */
  definition: string;
  className?: string;
}

/** Reads a resolved CSS custom property value from the live document (client-only). */
function readCssVar(name: string, fallback: string): string {
  if (typeof window === 'undefined') return fallback;
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return value || fallback;
}

/**
 * Builds Mermaid's `themeVariables` from the site's own brand tokens (globals.css) rather
 * than one of Mermaid's built-in themes, so a diagram's chrome always matches whatever
 * palette is active — re-read on every render call, which is what keeps it in sync with
 * the current light/dark class on <html>.
 */
function buildThemeVariables() {
  const bgPrimary = readCssVar('--bg-primary', '#0b1120');
  const bgSurface = readCssVar('--bg-surface', '#111827');
  const accent = readCssVar('--accent', '#22d3ee');
  const accentAlt = readCssVar('--accent-alt', '#6366f1');
  const textPrimary = readCssVar('--text-primary', '#e5e7eb');
  const textMuted = readCssVar('--text-muted', '#9ca3af');

  return {
    background: bgPrimary,
    primaryColor: bgSurface,
    primaryTextColor: textPrimary,
    primaryBorderColor: accent,
    secondaryColor: bgSurface,
    secondaryTextColor: textPrimary,
    secondaryBorderColor: accentAlt,
    tertiaryColor: bgSurface,
    tertiaryTextColor: textPrimary,
    tertiaryBorderColor: accentAlt,
    lineColor: textMuted,
    textColor: textPrimary,
    mainBkg: bgSurface,
    nodeBorder: accent,
    nodeTextColor: textPrimary,
    clusterBkg: bgPrimary,
    clusterBorder: textMuted,
    edgeLabelBackground: bgSurface,
    fontFamily: 'var(--font-mono), ui-monospace, monospace',
  };
}

/**
 * Client-only Mermaid renderer, isolated from the (server) case-study/architecture pages
 * so static export still works — Mermaid touches the DOM directly and can't run during
 * SSR/build. Re-renders on theme change (re-reading the CSS tokens above) so a light/dark
 * switch never leaves stale colors, and falls back to a muted note instead of crashing the
 * page if the diagram fails to parse.
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
          theme: 'base',
          themeVariables: buildThemeVariables(),
          securityLevel: 'strict',
          // Diagrams render at their natural size and scroll horizontally on small
          // screens instead of Mermaid's default of shrinking to fit the container,
          // which would make dense flowcharts illegible on mobile.
          flowchart: { useMaxWidth: false },
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

  return (
    <div className={cn('overflow-x-auto', className)}>
      {status === 'loading' && <p className="text-muted-foreground text-sm">Loading diagram…</p>}
      {status === 'error' && <p className="text-muted-foreground text-sm">Diagram unavailable.</p>}
      {/*
       * Mermaid's SVG is injected imperatively via containerRef.current.innerHTML, which
       * React never sees. This div must always render with the exact same (empty) JSX
       * children on every pass — including across theme-change re-renders — otherwise
       * React's reconciliation tries to diff against content it doesn't know about and
       * wipes the injected SVG back out.
       */}
      <div
        ref={containerRef}
        role="img"
        aria-label="Architecture diagram"
        hidden={status !== 'ready'}
      />
    </div>
  );
}
