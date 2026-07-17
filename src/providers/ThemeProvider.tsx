'use client';

import React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

/**
 * SSR-safe theme provider built on next-themes.
 * - attribute="class" applies the "dark" class to <html> for Tailwind dark: variants.
 * - defaultTheme="system" respects the OS preference on first load.
 * - enableSystem keeps it in sync with OS changes.
 * - disableTransitionOnChange prevents a flash during hydration.
 */
export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
