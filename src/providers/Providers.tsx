'use client';

import React, { useState } from 'react';
import { HeroUIProvider } from '@heroui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

/**
 * Root Providers Wrapper.
 * Combines TanStack Query (QueryClientProvider) and HeroUI (HeroUIProvider)
 * to provide database query caching and semantic layout controls.
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
      <HeroUIProvider>
        {children}
      </HeroUIProvider>
    </QueryClientProvider>
  );
}
