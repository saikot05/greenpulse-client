'use client';

import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

/**
 * Root Providers Wrapper.
 * Configures the TanStack Query (QueryClientProvider) instance.
 * Note: HeroUI v3 Web is CSS-first and does not require a global provider at the root level.
 */
export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute stale query cache
            refetchOnWindowFocus: false, // Prevents aggressive refresh on tab active
            retry: 1, // Single retry on fetch failures
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
