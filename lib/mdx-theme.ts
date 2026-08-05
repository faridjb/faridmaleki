import type { ThemeRegistrationRaw } from 'shiki';

/**
 * Custom Shiki theme for MDX code blocks, built from the same seven brand hex values as
 * app/globals.css's `.dark` palette (bg-surface, accent, accent-alt, text-primary,
 * text-muted, success) — kept in one dark palette regardless of the page's light/dark
 * toggle, the same way a terminal window stays dark inside a light-mode editor.
 */
// Built-in Shiki themes (see node_modules/@shikijs/themes) never carry a `settings` field —
// only `tokenColors` — even though ThemeRegistrationRaw's underlying TextMate type marks
// `settings` as required. Shiki treats a *present* `settings` array (even empty) as the
// theme's real token-color source and ignores `tokenColors` entirely, which silently
// strips all syntax highlighting. So this theme is built as a plain object, matching the
// shape Shiki's own bundled themes use, and only cast to the (slightly stricter) type at
// the boundary where rehype-pretty-code expects it.
const rawTheme = {
  name: 'faridmaleki',
  type: 'dark',
  colors: {
    'editor.background': '#111827',
    'editor.foreground': '#e5e7eb',
  },
  tokenColors: [
    {
      scope: ['comment', 'punctuation.definition.comment'],
      settings: { foreground: '#9ca3af', fontStyle: 'italic' },
    },
    {
      scope: ['string', 'string.template', 'constant.other.symbol'],
      settings: { foreground: '#34d399' },
    },
    {
      scope: ['constant.numeric', 'constant.language', 'constant.other'],
      settings: { foreground: '#22d3ee' },
    },
    {
      scope: ['keyword', 'storage.type', 'storage.modifier', 'keyword.control'],
      settings: { foreground: '#6366f1' },
    },
    {
      scope: ['entity.name.function', 'support.function', 'meta.function-call'],
      settings: { foreground: '#22d3ee' },
    },
    {
      scope: [
        'entity.name.tag',
        'entity.name.type',
        'entity.name.class',
        'entity.other.attribute-name',
      ],
      settings: { foreground: '#6366f1' },
    },
    {
      scope: ['variable', 'variable.parameter', 'variable.other'],
      settings: { foreground: '#e5e7eb' },
    },
    {
      scope: ['punctuation', 'meta.brace', 'punctuation.separator'],
      settings: { foreground: '#9ca3af' },
    },
  ],
};

export const mdxCodeTheme = rawTheme as unknown as ThemeRegistrationRaw;
