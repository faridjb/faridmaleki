'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import { MoonIcon, SunIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';

/**
 * Light/dark toggle. next-themes persists the choice (localStorage) and
 * injects a blocking pre-hydration script so there's no flash of the wrong
 * theme on load — see the `attribute="class"` ThemeProvider in app/layout.tsx.
 */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === 'dark';

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      aria-label={
        mounted ? (isDark ? 'Switch to light theme' : 'Switch to dark theme') : 'Toggle theme'
      }
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
    >
      {mounted ? (
        isDark ? (
          <SunIcon />
        ) : (
          <MoonIcon />
        )
      ) : (
        <SunIcon className="opacity-0" aria-hidden />
      )}
    </Button>
  );
}
