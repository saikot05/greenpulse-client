'use client';

import React, { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Button } from '@heroui/react';
import { Sun, Moon, LayoutHeader } from '@gravity-ui/icons';

/**
 * Compact icon-only theme toggle.
 * Cycles: light → dark → system → light …
 *
 * Uses a `mounted` guard to prevent SSR/hydration mismatch — next-themes
 * cannot know the resolved theme during the server render pass.
 */
export default function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid rendering theme-specific UI until client has mounted
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Render a neutral placeholder to preserve layout space
    return (
      <Button
        isIconOnly
        aria-label="Toggle theme"
        className="h-9 w-9 bg-transparent text-neutral-500"
        aria-hidden="true"
      >
        <LayoutHeader className="h-5 w-5" />
      </Button>
    );
  }

  const cycleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('light');
  };

  const isDark = resolvedTheme === 'dark';

  return (
    <Button
      isIconOnly
      onPress={cycleTheme}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode (current: ${theme ?? 'system'})`}
      className="h-9 w-9 bg-transparent hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 dark:text-neutral-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors duration-200 rounded-lg"
    >
      {isDark ? (
        <Moon className="h-5 w-5" />
      ) : (
        <Sun className="h-5 w-5" />
      )}
    </Button>
  );
}
