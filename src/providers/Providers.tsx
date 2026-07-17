'use client';

import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ThemeProvider from './ThemeProvider';

/**
 * Root Providers Wrapper.
 *
 * Order matters:
 *   ThemeProvider  (outermost — controls HTML class attribute)
 *   └─ QueryClientProvider  (TanStack Query caching layer)
 *       └─ {children}
 *
 * Note: HeroUI v3 is CSS-first and does not require a global HeroUIProvider.
 */
export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,        // 1 minute stale query cache
            refetchOnWindowFocus: false,  // Prevents aggressive refresh on tab active
            retry: 1,                     // Single retry on fetch failures
          },
        },
      })
  );

  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </ThemeProvider>
  );
}
