'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { useTheme } from 'next-themes';

import { siteConfig } from '@/config/site.config';
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
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
  };
}

type MermaidCurve =
  | 'basis'
  | 'bumpX'
  | 'bumpY'
  | 'cardinal'
  | 'catmullRom'
  | 'linear'
  | 'monotoneX'
  | 'monotoneY'
  | 'natural'
  | 'step'
  | 'stepAfter'
  | 'stepBefore'
  | 'rounded';

const VALID_CURVES = new Set<string>([
  'basis',
  'bumpX',
  'bumpY',
  'cardinal',
  'catmullRom',
  'linear',
  'monotoneX',
  'monotoneY',
  'natural',
  'step',
  'stepAfter',
  'stepBefore',
  'rounded',
]);

let elkRegistered = false;
/** Serialize Mermaid renders — parallel calls share one engine and race on init/render. */
let renderQueue: Promise<void> = Promise.resolve();

function enqueueRender(task: () => Promise<void>): Promise<void> {
  const next = renderQueue.then(task, task);
  renderQueue = next.then(
    () => undefined,
    () => undefined
  );
  return next;
}

/**
 * Prefer diagram-type ELK (`flowchart-elk`) over `initialize({ layout: 'elk' })`, which
 * has been observed to throw circular-JSON errors under React's DOM fiber graph.
 */
function toElkDefinition(definition: string): string {
  return definition.replace(/^(\s*)flowchart(\b)/m, '$1flowchart-elk$2');
}

/**
 * Client-only Mermaid renderer. Straight edges via flowchart.curve (default: linear) —
 * the same lever Cursor / Notion previews use for non-curved connectors. Optional ELK
 * layout via siteConfig.mermaid.layout=elk with dagre fallback.
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
      await enqueueRender(async () => {
        if (cancelled) return;

        try {
          const { default: mermaid } = await import('mermaid');
          const { layout, curve, useMaxWidth, nodeSpacing, rankSpacing } = siteConfig.mermaid;
          const resolvedCurve = (VALID_CURVES.has(curve) ? curve : 'linear') as MermaidCurve;
          const preferElk = layout.startsWith('elk');

          if (preferElk && !elkRegistered) {
            const elkMod = await import('@mermaid-js/layout-elk');
            const elkLayouts = 'default' in elkMod ? elkMod.default : elkMod;
            mermaid.registerLayoutLoaders(elkLayouts);
            elkRegistered = true;
          }

          mermaid.initialize({
            startOnLoad: false,
            theme: 'base',
            themeVariables: buildThemeVariables(),
            securityLevel: 'strict',
            flowchart: {
              useMaxWidth,
              curve: resolvedCurve,
              nodeSpacing,
              rankSpacing,
              htmlLabels: true,
            },
          });

          let svg: string;
          try {
            const source = preferElk ? toElkDefinition(definition) : definition;
            ({ svg } = await mermaid.render(`architecture-${diagramId}`, source));
          } catch (elkErr) {
            if (!preferElk) throw elkErr;
            console.warn('[ArchitectureDiagram] ELK failed, falling back to dagre', elkErr);
            ({ svg } = await mermaid.render(`architecture-${diagramId}-dagre`, definition));
          }

          if (!cancelled && containerRef.current) {
            containerRef.current.innerHTML = svg;
            setStatus('ready');
          }
        } catch (err) {
          console.error('[ArchitectureDiagram]', err);
          if (!cancelled) setStatus('error');
        }
      });
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
